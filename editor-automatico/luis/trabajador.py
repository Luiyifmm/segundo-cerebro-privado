"""Trabajador del Claude de Luis: edita los vídeos de las colas de Trainer10x (alumnos) y de la Sala.

Uso:
  Cola (launchd cada 60 s):  uv run --python 3.12 --with mlx-whisper --with "numpy<2.3" --with "opencv-python-headless==4.10.0.84" --with "psycopg[binary]" python luis/trabajador.py
  Prueba local sin BD:       ... python luis/trabajador.py --local BRUTO --salida CARPETA [--titulo T] [--guion G.txt] [--quien amin|alumno] [--notas TEXTO]

Qué hace con cada vídeo:
  1. Lo reserva con FOR UPDATE SKIP LOCKED (no se pisa con el agente de Amin ni con otra máquina).
  2. Ingesta (giro, HDR, canales), transcripción (transcribir.py) y frases (frases.py) del motor de Amin.
  3. DECIDE el Claude de Luis (Claude Code sin pantalla, luis/editor.md): tomas, claves, zooms fuertes, titular y pocos efectos.
  4. Monta (montar.py), arma la EDL del Reel con las reglas del manual base y renderiza con el motor (Remotion).
  5. REVISA el Claude de Luis (luis/revisor.md) una hoja de fotogramas + medidas; si pide cambios, se aplican y se renderiza otra vez (una vez).
  6. Normaliza (−14 LUFS, pico ≤ −1,5 dBTP), sube final + portada + edl.json + decisiones.json y deja el vídeo para revisar.

Credenciales: ~/.config/claude-editor/env.json (fuera del repo, chmod 600):
  {"DATABASE_URL": "...", "S3_ENDPOINT": "...", "S3_BUCKET": "...", "S3_KEY": "...", "S3_SECRET": "...", "S3_REGION": "auto",
   "COLAS": ["alumnos"], "MODELO": "opus", "CLAUDE": "/ruta/al/binario/claude (opcional)"}
"""
import os, sys, re, json, glob, time, shutil, fcntl, hashlib, hmac, datetime, subprocess, random, string, argparse
from urllib.parse import quote, urlparse

AQUI = os.path.dirname(os.path.abspath(__file__))
MOTOR_DIR = os.path.dirname(AQUI)                      # edicion-motor/
MOTOR = os.path.join(MOTOR_DIR, 'motor')               # Remotion
APP = os.path.expanduser(os.environ.get('SALA_APP', '~/Proyectos/amin/sala-edicion'))  # librería de sonidos y fuentes (solo lectura)
CONF = os.path.expanduser(os.environ.get('EDITOR_CONF', '~/.config/claude-editor/env.json'))  # EDITOR_CONF: otra config (p. ej. la cola de alumnos en el Mac de Amin)
TRABAJO = os.path.expanduser('~/Proyectos/amin/trabajos')
TMP = os.path.join(TRABAJO, '_tmp')
ENV = json.load(open(CONF)) if os.path.exists(CONF) else {}
# Token de un año del Claude sin pantalla (`claude setup-token`, Luis 14-11): fuera del repo, permisos 600
_TOKEN = os.path.expanduser('~/.config/claude-editor/claude-token')
if not os.environ.get('CLAUDE_CODE_OAUTH_TOKEN') and os.path.exists(_TOKEN):
    os.environ['CLAUDE_CODE_OAUTH_TOKEN'] = ''.join(open(_TOKEN).read().split())
LIB = json.load(open(os.path.join(APP, 'src/lib/libreria.json')))
PICO_MAX = -1.5
QUIEN = 'claude-luis'


def log(*a): print(time.strftime('%d-%m %H:%M:%S'), *a, flush=True)
def sh(*a, **kw): return subprocess.run(a, check=True, **kw)
def uid(): return format(int(time.time() * 1000), 'x') + ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
def seguro(s): return re.sub(r'[/:\\]', '-', s).strip()
def limpia(w): return re.sub(r'[.,;:!?¡¿"«»]', '', w).lower()


class Saltar(Exception):
    """No se puede editar solo: se devuelve con un motivo para el humano."""


class SinClaude(Exception):
    """El Claude de Luis no puede contestar ahora (límite de uso o sesión caducada). No es culpa del vídeo:
    vuelve a la cola y el trabajador se pausa (16-11: 11 vídeos acabaron en «error» por esto)."""


PAUSA = os.path.join(TRABAJO, '.pausa-claude')   # contiene el instante (epoch) hasta el que no se coge nada


# ─────────────── Claude de Luis (Claude Code sin pantalla) ───────────────

def binario_claude():
    if ENV.get('CLAUDE') and os.path.exists(ENV['CLAUDE']): return ENV['CLAUDE']
    for c in [shutil.which('claude')] + sorted(glob.glob(os.path.expanduser('~/.vscode/extensions/anthropic.claude-code-*/resources/native-binary/claude'))):
        if c and os.path.exists(c): return c
    raise RuntimeError('no encuentro el binario de Claude Code')


COSTE = {'usd': 0.0}
REUSAR_PLAN = False   # --reusar-plan: no vuelve a preguntar al editor (para iterar en pruebas)


def claude(prompt, cwd, herramientas=None, timeout=900):
    """Una llamada a Claude Code en modo -p. Devuelve el JSON que haya en la respuesta y suma el coste."""
    cmd = [binario_claude(), '-p', '--output-format', 'json', '--model', ENV.get('MODELO', 'opus')]
    if herramientas: cmd += ['--allowedTools', herramientas]
    for intento in range(3):
        r = subprocess.run(cmd, input=prompt, capture_output=True, text=True, cwd=cwd, timeout=timeout)
        try: out = json.loads(r.stdout)
        except Exception: out = {}
        aviso = str(out.get('result') or '') + ' ' + str(out.get('api_error') or '')
        if out.get('is_error') and re.search(r'limit|authenticat|OAuth|log ?in|credit', aviso, re.I):
            raise SinClaude(aviso.strip()[:200])
        try:
            COSTE['usd'] += float(out.get('total_cost_usd') or 0)
            texto = out.get('result') or ''
            return json.loads(re.search(r'\{.*\}', texto, re.S)[0])
        except Exception as e:
            log('Claude no devolvió JSON, reintento:', repr(e)[:150], r.stderr[-200:], '| salida:', (r.stdout or '')[-300:].replace('\n', ' '))
            time.sleep(10 * (intento + 1))
    raise RuntimeError('Claude no contestó con un JSON válido')


# ─────────────── Ingesta y transcripción (motor de Amin) ───────────────

def sonda(video):
    o = subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', video], capture_output=True, text=True)
    return json.loads(o.stdout or '{}')


def ingesta(src, carpeta):
    """Vertical, SDR y voz en los dos canales. Devuelve el archivo listo para montar."""
    s = sonda(src); v = next((x for x in s.get('streams', []) if x.get('codec_type') == 'video'), None)
    if not v: raise Saltar('No reconozco el vídeo.')
    w, h = int(v['width']), int(v['height'])
    rot = 0
    for sd in v.get('side_data_list') or []:
        if 'rotation' in sd: rot = abs(int(float(sd['rotation'])))
    if rot in (90, 270): w, h = h, w
    if w > h: raise Saltar('Está grabado en horizontal; el montaje automático es para vertical.')
    hdr = v.get('color_transfer') in ('arib-std-b67', 'smpte2084')
    # Canales: si uno está muerto (>25 dB por debajo), se copia el bueno en los dos
    pan = ''
    a = next((x for x in s.get('streams', []) if x.get('codec_type') == 'audio'), None)
    if a and int(a.get('channels', 1)) >= 2:
        nivel = []
        for c in (0, 1):
            e = subprocess.run(['ffmpeg', '-nostdin', '-ss', '5', '-t', '20', '-i', src, '-af', f'pan=mono|c0=c{c},volumedetect', '-f', 'null', '-'],
                               capture_output=True, text=True).stderr
            m = re.search(r'mean_volume: (-?[\d.]+)', e); nivel.append(float(m[1]) if m else -91)
        if abs(nivel[0] - nivel[1]) > 25:
            bueno = 0 if nivel[0] > nivel[1] else 1
            pan = f'pan=stereo|c0=c{bueno}|c1=c{bueno}'
            log('voz en un solo canal: se copia al otro')
    if not hdr and not pan: return src, {'w': w, 'h': h, 'hdr': False, 'canal_arreglado': False}
    out = os.path.join(carpeta, 'bruto-listo.mp4')
    vf = ['-vf', 'zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p'] if hdr else []
    af = ['-af', pan] if pan else []
    if not os.path.exists(out):
        sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', src, *vf, *(['-c:v', 'h264_videotoolbox', '-b:v', '45M'] if hdr else ['-c:v', 'copy']),
           *af, '-c:a', 'aac', '-b:a', '256k', out)
    return out, {'w': w, 'h': h, 'hdr': hdr, 'canal_arreglado': bool(pan)}


def transcribir(src, carpeta):
    tj = os.path.join(carpeta, 'transcripcion.json')
    if not any(x.get('codec_type') == 'audio' for x in sonda(src).get('streams', [])): return None   # sin pista de audio: sin_voz()
    if not os.path.exists(tj): sh(sys.executable, os.path.join(MOTOR_DIR, 'transcribir.py'), src, tj)
    if not any(s.get('words') for s in json.load(open(tj))['segments']): return None   # sin voz: lo monta sin_voz()
    fj = os.path.join(carpeta, 'frases.json')
    sys.path.insert(0, MOTOR_DIR)
    import frases as F
    json.dump({'segments': F.frases(json.load(open(tj))['segments'])}, open(fj, 'w'), ensure_ascii=False)
    return fj


# ─────────────── Limpieza de muletillas y repeticiones ───────────────
# Whisper NO escribe muchas muletillas («pera», «eh») ni los arranques repetidos: los tapa estirando una palabra
# (prueba IMG_6126, 30-10: un «rato» de 2,48 s escondía «rato, espérate, que te busquen para pasar el rato»).
# Luis lo oyó en el primer ejemplo. Aquí se vuelve a transcribir el montaje pidiendo las muletillas, se cortan
# y se cortan también las frases que se reinician (queda la última versión).

PROMPT_MULETILLAS = 'Eh, em, mmm, pera, espera, espérate, este, o sea. Se repite: que te, que te busquen.'
MULETILLA = re.compile(r'^(e+h+|e+m+|m{2,}|a+h+|este|esper[aá]|esp[eé]rate|esperate|pera|o|sea)$')


def _norm(w):
    import unicodedata
    w = unicodedata.normalize('NFKD', w.lower()); w = ''.join(c for c in w if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9ñ]', '', w)


def limpiar(corte):
    """Corta del montaje muletillas y arranques repetidos que Whisper se calló. Devuelve lo que quitó."""
    import mlx_whisper, numpy as np
    from mlx_whisper.audio import load_audio, SAMPLE_RATE
    mj, pjf = os.path.join(corte, 'montaje.mp4'), os.path.join(corte, 'palabras.json')
    pj = json.load(open(pjf)); a = load_audio(mj)
    r = mlx_whisper.transcribe(a, path_or_hf_repo='mlx-community/whisper-large-v3-turbo-q4', language='es', word_timestamps=True,
                               initial_prompt=PROMPT_MULETILLAS, condition_on_previous_text=False)
    W = [{'w': w['word'].strip(), 's': round(w['start'], 3), 'e': round(w['end'], 3)} for sg in r['segments'] for w in sg.get('words', []) if w['word'].strip()]
    # Energía real: una «muletilla» sin voz debajo es una alucinación del prompt y no se toca
    F = len(a) // 160; rms = 20 * np.log10(np.sqrt((a[:F * 160].reshape(F, 160) ** 2).mean(1)) + 1e-9)
    voz = np.percentile(rms, 90)
    con_voz = lambda s, e: (rms[int(s * 100):max(int(s * 100) + 1, int(e * 100))] > voz - 25).mean() > 0.3
    n = [_norm(w['w']) for w in W]
    quitar = set()
    for i, w in enumerate(W):   # 1) muletillas sueltas
        if MULETILLA.match(n[i]) and n[i] not in ('o', 'sea') and w['e'] - w['s'] >= 0.1 and con_voz(w['s'], w['e']): quitar.add(i)
        if n[i] == 'o' and i + 1 < len(n) and n[i + 1] == 'sea': quitar.update({i, i + 1})
    i = 0
    while i < len(W):           # 2) arranques repetidos: «que te busquen para… espérate, que te busquen para…» → queda el último
        hecho = False
        for k in range(12, 1, -1):
            a_ = [x for x in n[i:i + k]]
            if len(a_) < k or not all(a_): continue
            for j in range(i + 1, min(len(W) - k + 1, i + k + 4)):
                if n[j:j + k] == a_ and all(m in quitar or MULETILLA.match(n[m]) for m in range(i + k, j)):
                    quitar.update(range(i, j)); i = j; hecho = True; break
            if hecho: break
        if not hecho: i += 1
    if not quitar: return []
    # Tramos a quitar: cada corte cae en el punto más silencioso entre la última palabra que se queda y la primera que se va
    # (con el inicio de Whisper el corte se comió «valor» de la frase anterior, prueba del 30-10)
    def silencio(a0, a1):
        i0, i1 = max(0, int(a0 * 100)), max(int(a0 * 100) + 1, int(a1 * 100))
        return (i0 + int(np.argmin(rms[i0:i1]))) / 100 if i1 > i0 else a0
    idx = sorted(quitar); grupos = []
    for m in idx:
        if grupos and m == grupos[-1][-1] + 1: grupos[-1].append(m)
        else: grupos.append([m])
    fuera, usados = [], []
    for g in grupos:
        prev = W[g[0] - 1]['e'] if g[0] > 0 else 0.0
        sig = W[g[-1] + 1]['s'] if g[-1] + 1 < len(W) else pj['duracion']
        s = silencio(max(prev - 0.02, W[g[0]]['s'] - 0.35), W[g[0]]['s'] + 0.04)
        e = silencio(W[g[-1]]['e'] - 0.04, min(sig + 0.02, W[g[-1]]['e'] + 0.35))
        if e - s > 0.08: fuera.append([s, e]); usados.append(g)
    dur = pj['duracion']; quedan, t = [], 0.0
    for s, e in fuera:
        if s - t > 0.05: quedan.append((t, s))
        t = max(t, e)
    if dur - t > 0.05: quedan.append((t, dur))
    fc = ''.join(f'[0:v]trim={s:.3f}:{e:.3f},setpts=PTS-STARTPTS[v{k}];[0:a]atrim={s:.3f}:{e:.3f},asetpts=PTS-STARTPTS,'
                 f'afade=t=in:d=0.015,afade=t=out:st={max(0, e - s - 0.015):.3f}:d=0.015[a{k}];' for k, (s, e) in enumerate(quedan))
    fc += ''.join(f'[v{k}][a{k}]' for k in range(len(quedan))) + f'concat=n={len(quedan)}:v=1:a=1[v][a]'
    os.replace(mj, os.path.join(corte, 'montaje-sin-limpiar.mp4'))
    sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', os.path.join(corte, 'montaje-sin-limpiar.mp4'), '-filter_complex', fc, '-map', '[v]', '-map', '[a]',
       '-c:v', 'h264_videotoolbox', '-b:v', '45M', '-c:a', 'aac', '-b:a', '256k', '-r', '30', mj)
    # Tiempos nuevos: palabras de la transcripción limpia (con su frase de origen) y tramos desplazados
    def nuevo(t):
        acc = 0.0
        for s, e in quedan:
            if t < s: return None
            if t <= e: return round(acc + t - s, 3)
            acc += e - s
        return None
    seg_de = lambda t: next((tr['seg'] for tr in reversed(pj['tramos']) if t >= tr['montaje'] - 0.01), pj['tramos'][0]['seg'])
    tramos = []
    for tr in pj['tramos']:
        nm = nuevo(tr['montaje'] + 0.05)
        if nm is None:   # empieza dentro de un trozo cortado: arranca justo después del corte (si no, su frase se perdía)
            fin = next((e for s_, e in fuera if s_ <= tr['montaje'] + 0.05 <= e), None)
            nm = nuevo(fin + 0.06) if fin is not None else None
            if nm is not None: nm += 0.05
        if nm is not None: tramos.append({**tr, 'montaje': max(0, round(nm - 0.05, 3))})
    # Subtítulos: se vuelve a transcribir el montaje YA LIMPIO (sin prompt). Sin la muletilla en el audio, Whisper no
    # amontona palabras; con las palabras viejas, las de la toma buena se perdían con el corte (prueba del 30-10).
    b = load_audio(mj)
    r2 = mlx_whisper.transcribe(b, path_or_hf_repo='mlx-community/whisper-large-v3-turbo-q4', language='es', word_timestamps=True,
                                condition_on_previous_text=False, no_speech_threshold=0.95, logprob_threshold=None)
    seg_nuevo = lambda t: next((tr['seg'] for tr in reversed(tramos) if t >= tr['montaje'] - 0.01), tramos[0]['seg'] if tramos else 0)
    palabras = [{'w': w['word'].strip(), 's': round(w['start'], 3), 'e': round(w['end'], 3), 'seg': seg_nuevo(w['start'])}
                for sg in r2['segments'] for w in sg.get('words', []) if w['word'].strip()]
    quitado = [{'montaje_s': round(s, 2), 'montaje_e': round(e, 2), 'texto': ' '.join(W[m]['w'] for m in g)} for (s, e), g in zip(fuera, usados)]
    json.dump({**pj, 'duracion': round(sum(e - s for s, e in quedan), 3), 'palabras': palabras, 'tramos': tramos, 'limpieza': quitado},
              open(pjf, 'w'), ensure_ascii=False, indent=1)
    log('limpieza:', '; '.join(f'«{q["texto"]}»' for q in quitado))
    return quitado


# ─────────────── Decidir (Claude de Luis) ───────────────

def _fundir(base, extra):
    out = dict(base)
    for k, v in extra.items(): out[k] = _fundir(out[k], v) if isinstance(v, dict) and isinstance(out.get(k), dict) else v
    return out


def ficha_de(quien, cliente=None):
    if quien == 'alumno':   # estilo de los alumnos de Trainer10x: lo escribe y afina Luis (14-11); sin ella, la genérica de abajo
        try: base = json.load(open(os.path.join(AQUI, 'fichas', 'alumno.json')))
        except Exception: base = None
        # Marca de cada alumno (Luis, 14-11): fichas/alumnos/<cliente_id>.json manda sobre la común
        try: propia = json.load(open(os.path.join(AQUI, 'fichas', 'alumnos', f'{cliente}.json'))) if cliente else None
        except Exception: propia = None
        if base or propia: return _fundir(base or {}, propia or {})
    if quien == 'amin':
        for f in (os.path.join(AQUI, 'fichas', 'amin.json'), os.path.join(MOTOR_DIR, 'sistema', 'fichas', 'amin.json')):  # la de Luis manda
            try: return json.load(open(f))
            except Exception: pass
    return {'cliente': 'alumno de Trainer10x (entrenador personal)', 'musica': 'ninguna', 'max_palabras': 4,
            'insertos': 'NO son fotos: son tarjetas de fondo blanco con 1-3 palabras en negro. En cada inserto pon "palabra" = la palabra '
                        'exacta que se dice y, si ayuda, "texto" = 1-3 palabras que resumen la idea (p. ej. «0 RESULTADOS», «CARDIO»). '
                        'Como mucho 2-3 por vídeo y solo en ideas fuertes; si no aportan, déjalo vacío.'}


def dirigir(segs, titulo, guion, notas, ficha, carpeta):
    """Director creativo (Luis, 14-11): antes de editar decide formato, mensaje, gancho, estructura y elementos.
    Si falla, se sigue sin brief (el editor trabaja como antes)."""
    bf = os.path.join(carpeta, 'brief.json')
    if REUSAR_PLAN and os.path.exists(bf): return json.load(open(bf))
    lista = '\n'.join(f'{i}: [{s["start"]:.1f}-{s["end"]:.1f}] {s["text"].strip()}' for i, s in enumerate(segs))
    prompt = open(os.path.join(AQUI, 'director.md')).read() + '\n\n---\n' + open(os.path.join(AQUI, 'formatos.md')).read() + f"""

---
TÍTULO: {titulo}
FICHA DE MARCA: {json.dumps(ficha, ensure_ascii=False)}
NOTAS Y CORRECCIONES (prioridad máxima): {notas or 'ninguna'}
GUION: {guion or 'no hay'}

TRANSCRIPCIÓN POR FRASES:
{lista}
"""
    try: b = claude(prompt, carpeta)
    except SinClaude: raise
    except Exception as e: log('director: sin brief', repr(e)[:150]); return {}
    json.dump(b, open(bf, 'w'), ensure_ascii=False, indent=1)
    log('director:', b.get('formato'), '·', str(b.get('mensaje', ''))[:100])
    return b


def decidir(segs, titulo, guion, notas, ficha, carpeta, brief=None):
    lista = '\n'.join(f'{i}: [{s["start"]:.1f}-{s["end"]:.1f}] {s["text"].strip()}' for i, s in enumerate(segs))
    prompt = open(os.path.join(AQUI, 'editor.md')).read() + f"""

---
TÍTULO: {titulo}
ESTILO: {ESTILO}. {ESTILOS[ESTILO]['desc']} Rótulos: {'sí' if ESTILOS[ESTILO]['rotulos'] else 'no'}. Insertos: {'sí' if ESTILOS[ESTILO]['insertos'] else 'no'}.
FICHA DEL CREADOR: {json.dumps(ficha, ensure_ascii=False)}
NOTAS Y CORRECCIONES (prioridad máxima): {notas or 'ninguna'}
BRIEF DEL DIRECTOR CREATIVO (síguelo: formato, gancho, estructura, qué sobra y qué elementos van y dónde; tarjeta = inserto, pausa = no quitar esa frase ni su silencio): {json.dumps(brief, ensure_ascii=False) if brief else 'no hay'}
GUION: {guion or 'no hay'}

TRANSCRIPCIÓN POR FRASES:
{lista}
"""
    p = claude(prompt, carpeta)
    p['mantener'] = [int(i) for i in p.get('mantener', []) if 0 <= int(i) < len(segs) and segs[int(i)].get('words')]
    if not p['mantener']: raise Saltar('No he encontrado tomas que valgan.')
    json.dump(p, open(os.path.join(carpeta, 'plan.json'), 'w'), ensure_ascii=False, indent=1)
    return p


# ─────────────── EDL con las reglas del manual base ───────────────

def sfx_de(nombre):
    m = next((s['src'] for s in LIB['sfx'] if s['nombre'].lower() == nombre.lower()), None)
    return m or next((s['src'] for s in LIB['sfx'] if nombre.lower() in s['nombre'].lower()), None)


# Estilos premium (referencias analizadas el 30-10: Alborna, Belfort, Víctor Heras, Natt Jongsala, Guille Collado, Ashish).
ESTILOS = {
    'clave': {'desc': 'Belfort / Víctor Heras: subtítulo con palabra clave grande debajo, insertos de imagen a pantalla completa cada 8-12 s, 1-2 rótulos grandes delante (gancho y moraleja), look de cine suave.',
              'persona': False, 'rotulos': True, 'detras': False, 'insertos': True, 'bn': False,
              'look': {'tipo': 'premium', 'fuerza': 0.6}, 'acabado': {'grano': 0.04, 'vineta': 0.35},
              'cara_alto': 0.12},
    'cine': {'desc': 'Julian Alborna: oscuro y cinematográfico. Fondo oscurecido con grano y viñeta, subtítulo pequeño en minúscula con brillo cálido, insertos de archivo en blanco y negro (fotos antiguas, pinturas, estatuas) cada 8-12 s, rótulos finos con UNA palabra en color.',
             'persona': True, 'rotulos': True, 'detras': False, 'insertos': True, 'bn': True,
             'look': {'tipo': 'premium', 'fuerza': 0.9}, 'acabado': {'grano': 0.08, 'vineta': 0.55, 'fondo': 0.3, 'desenfoqueFondo': 3},
             'cara_alto': 0.16,   # la cara ocupa el 16 % del alto (plano cercano, como Alborna)
             'sub': {'tam': 58, 'fuente': 'sfpro-medium', 'color': '#F2C46D', 'y_px': 1180}, 'clave': {'tam': 104, 'fuente': 'nyght-italic', 'mayusculas': False}},
    'profundidad': {'desc': 'Natt Jongsala / Guille Collado: títulos grandes DETRÁS de la persona (dos letras: palo seco + cursiva en color) en las frases titular, fondo oscurecido y desenfocado, partículas, grano; pocos insertos.',
                    'persona': True, 'rotulos': True, 'detras': True, 'insertos': True, 'bn': False,
                    'look': {'tipo': 'premium', 'fuerza': 0.8}, 'acabado': {'grano': 0.06, 'vineta': 0.5, 'particulas': 0.45, 'fondo': 0.34, 'desenfoqueFondo': 4},
                    'cara_alto': 0.13},
}
ESTILO = 'clave'

SONIDO = {'pop': ('Pop up SFX', 0.14), 'whoosh': ('SWHOOSH', 0.12), 'golpe': ('Sub Bass Hit', 0.2), 'obturador': ('Camera Shutter', 0.16)}


def construir_edl(pj, plan, clave, usuario, ficha, imgs=None, persona=False, cara=None):
    P, dur = pj['palabras'], pj['duracion']
    palabras_seg = P
    # Texto: correcciones de la transcripción (de una o dos palabras)
    palabras = [{'w': p['w'], 's': p['s'], 'e': p['e']} for p in P]
    for mal, bien in (plan.get('correcciones') or {}).items():
        mal_t, bien_t = mal.split(), bien.split()
        for i in range(len(palabras) - len(mal_t) + 1):
            if [limpia(palabras[i + k]['w']) for k in range(len(mal_t))] == [limpia(x) for x in mal_t]:
                if len(mal_t) == len(bien_t):
                    for k in range(len(mal_t)): palabras[i + k]['w'] = bien_t[k] + re.sub(r'^[^.,;:!?…]*', '', palabras[i + k]['w'])
                elif len(mal_t) == 1:
                    palabras[i]['w'] = bien
    # Claves: como mucho 3 por cada 30 s
    tope = max(2, round(dur / 30 * 3))
    col = ficha.get('colores') or {}
    MALO, BUENO = col.get('malo', '#E5322D'), col.get('bueno', '#F5C542')
    marca = {'#E5322D': MALO, '#F5C542': BUENO, '#FFFFFF': col.get('neutro', '#FFFFFF')}
    claves = {limpia(k): marca.get(str(v).upper(), v) for k, v in list((plan.get('claves') or {}).items())[:tope] if re.fullmatch(r'#[0-9A-Fa-f]{6}', str(v))}
    # Zoom solo en los cortes, alternando dos encuadres; las frases fuertes un poco más
    enc = dict(ficha.get('encuadre') or {})
    if cara and ESTILOS[ESTILO].get('cara_alto'):   # zoom según el tamaño real de la cara (OpenCV), no un número fijo
        b = max(1.0, min(1.85, ESTILOS[ESTILO]['cara_alto'] / max(cara['alto'], 0.02)))
        enc = {'zoom_base': round(b, 2), 'zoom_alterno': round(min(1.95, b * 1.1), 2)}
    base, alterno = float(enc.get('zoom_base', 1.0)), float(enc.get('zoom_alterno', 1.12))
    fuerte = set(plan.get('zoom_fuerte') or [])
    zooms, n, visto = [], 0, set()
    for t in pj.get('tramos', []):
        if t['seg'] in visto and zooms: continue   # un cambio por frase, no por cada micro-tramo
        visto.add(t['seg'])
        esc = (alterno if n % 2 else base) + (0.12 if t['seg'] in fuerte else 0)
        zooms.append({'s': round(t['montaje'], 2), 'escala': round(min(esc, 2.0), 2)}); n += 1
    if not zooms or zooms[0]['s'] > 0: zooms.insert(0, {'s': 0, 'escala': base})
    # Empuje lento dentro de cada plano (Guille Collado: «casi todos mis clips tienen un zoom de principio a final muy suave»)
    con_empuje = []
    for k, z in enumerate(zooms):
        sig = zooms[k + 1]['s'] if k + 1 < len(zooms) else dur
        con_empuje.append(z)
        if sig - z['s'] > 1.0:
            con_empuje.append({'s': round(z['s'] + 0.3, 2), 'escala': round(z['escala'] * 1.035, 3), 'tipo': 'suave', 'dur': round(sig - z['s'] - 0.3, 2)})
    zooms = con_empuje
    # Efectos: los que pidió el editor, uno cada 6 s como mucho
    sfx, ultimo = [], -99.0
    for x in plan.get('sfx') or []:
        nombre, vol = SONIDO.get(x.get('tipo'), (None, 0))
        src = sfx_de(nombre) if nombre else None
        w = next((p for p in P if p['seg'] == x.get('frase') and limpia(p['w']) == limpia(x.get('palabra', ''))), None) \
            or next((p for p in P if p['seg'] == x.get('frase')), None)
        if not (src and w) or w['s'] - ultimo < 6: continue
        t = max(0, w['s'] - (0.15 if x.get('tipo') == 'whoosh' else 0.03))
        sfx.append({'src': src, 't': round(t, 2), 'vol': vol, 'por_que': x.get('por_que', '')}); ultimo = t
    seguir = next((p for p in P if re.search(r's[ií]gueme|seguirme|s[ií]guenos|seguidor', p['w'], re.I)), None)
    cta_t = round(seguir['s'] - 0.05, 2) if seguir else round(max(0, dur - 2.5), 2)
    pop = sfx_de('Pop up SFX')
    if pop: sfx.append({'src': pop, 't': cta_t, 'vol': 0.14, 'por_que': 'entra la tarjeta de seguir'})
    E = ESTILOS[ESTILO]
    st = {**(ficha.get('subtitulo') or {}), **E.get('sub', {})}; cl = {**(ficha.get('clave') or {}), **E.get('clave', {})}
    frase = lambda i: [p for p in palabras_seg if p['seg'] == i]
    # Rótulos: duran su frase (1,5-4,5 s), uno cada 6 s como mucho
    rotulos, ult = [], -99.0
    for r in (plan.get('rotulos') or []) if E['rotulos'] else []:
        ws = frase(r.get('frase'))
        if not ws or not str(r.get('texto', '')).strip(): continue
        s0 = max(0, ws[0]['s'] - 0.05); e0 = min(s0 + 4.5, max(s0 + 1.5, ws[-1]['e'] + 0.3))
        if s0 - ult < 6: continue
        acento = {'malo': MALO, 'bueno': BUENO}.get(r.get('tono'), col.get('acento', '#FFFFFF'))
        lineas = max(1, str(r['texto']).count('/') + 1)
        tam = 150 if E['detras'] else 124
        if E['detras']:
            # Detrás: a la altura de la cabeza; la cabeza tapa la parte de abajo del texto (en pantalla, sin zoom)
            fh = (cara['alto'] if cara else 0.085) * 1920 * enc.get('zoom_base', 1.3)
            pelo = 640 - fh / 2 - 0.35 * fh          # parte de arriba de la cabeza en pantalla
            y = max(150, round(pelo + 0.35 * tam - lineas * tam))   # la cabeza tapa solo el tercio de abajo de la última línea
        else:
            # Delante: en la zona del subtítulo (Natt: todo el texto en el mismo sitio), nunca sobre la cara
            y = round(int(st.get('y_px', 1080)) - lineas * tam * 0.5 - 20)
        rotulos.append({'s': round(s0, 2), 'e': round(e0, 2), 'texto': str(r['texto'])[:60], 'acento': acento,
                        'detras': E['detras'], 'y': y, 'tam': tam,
                        **({'fuente': 'sfpro-medium', 'mayus': False} if ESTILO == 'cine' else (ficha.get('rotulo') or {}))})
        ult = s0
    # Insertos: la imagen entra con su palabra y dura 2 s (sin pisar rótulos ni la tarjeta de seguir)
    broll = []
    for k, x in enumerate((plan.get('insertos') or []) if E['insertos'] else []):
        src = (imgs or {}).get(k)
        ws = frase(x.get('frase'))
        w = next((p for p in ws if limpia(p['w']) == limpia(x.get('palabra', ''))), ws[0] if ws else None)
        if not w:   # la frase no quedó en el montaje con ese número: se busca la palabra
            w = next((p for p in P if limpia(p['w']) == limpia(x.get('palabra', '')) and all(abs(p['s'] - b['s']) > 4 for b in broll)), None)
        if not (src and w): continue
        b0 = max(0, w['s'] - 0.05); b1 = min(b0 + 2.0, dur - 2.5)
        for r in rotulos:   # nunca a la vez que un rótulo: se acorta o se adelanta
            if b0 < r['e'] and b1 > r['s']:
                if r['s'] - b0 >= 1.2: b1 = r['s'] - 0.1
                elif r['s'] - 2.1 >= 0 and all(abs((r['s'] - 2.1) - b['s']) > 4 for b in broll): b0, b1 = r['s'] - 2.1, r['s'] - 0.1
                else: b1 = b0
        if b1 - b0 < 1.2 or any(b0 < b['e'] + 4 and b1 > b['s'] - 4 for b in broll): continue
        broll.append({'s': round(b0, 2), 'e': round(b1, 2), 'src': src, **({'bn': True} if E['bn'] else {})})
        wh = sfx_de('SWHOOSH')
        if wh and all(abs(x_['t'] - (b0 - 0.15)) > 1.5 for x_ in sfx): sfx.append({'src': wh, 't': round(max(0, b0 - 0.15), 2), 'vol': 0.1, 'por_que': 'entra un inserto'})
    edl = {
        'fps': 30, 'duracion': round(dur + 0.6, 2), 'video': f'p/{clave}/video.mp4',
        'cara': {'x': round(cara['x'] * 1080), 'y': round(cara['y'] * 1920)} if cara else {'x': 540, 'y': 800},
        'palabras': palabras, 'claves': claves, 'comparaciones': [], 'zooms': zooms, 'bn': [], 'broll': broll,
        'rotulos': rotulos, 'look': E['look'], 'acabado': E['acabado'],
        **({'persona': f'p/{clave}/persona.webm'} if E['persona'] and persona else {}),
        'sfx': sorted(sfx, key=lambda s: s['t']),
        'cta': {'t': cta_t, 'usuario': usuario}, 'colorPobre': MALO, 'colorRico': BUENO,
        'estilo': {'subTam': int(st.get('tam', 76)), 'claveTam': int(cl.get('tam', 170)), 'subY': int(st.get('y_px', 1080)),
                   'subFuente': st.get('fuente', 'serif'), 'claveFuente': cl.get('fuente', 'anton'), 'subColor': st.get('color', '#FFFFFF'),
                   'mayus': False,   # en Reel «mayus» pone en mayúsculas el subtítulo entero, no la clave
                   'claveMayus': cl.get('mayusculas', True) is not False},
    }
    mus = str(ficha.get('musica_src') or '')
    if mus and mus in {m['src'] for m in LIB['musica']}: edl['musica'] = {'src': mus, 'vol': 0.1}   # solo si el creador la eligió
    tit = plan.get('titular')
    if any(r['s'] < 3 for r in rotulos): tit = None   # ya hay un rótulo en el gancho: la etiqueta chocaba con él (revisión del 30-10)
    if isinstance(tit, dict) and str(tit.get('texto', '')).strip():
        hasta = max(1.5, min(3.0, float(tit.get('hasta') or 2.5)))
        # Mientras sale el titular, Reel oculta los subtítulos: si en esos segundos hay una palabra clave, el titular se
        # come el gancho (prueba IMG_6126, 30-10). Entonces van los dos a la vez, el titular arriba.
        tapa_clave = any(limpia(p['w']) in claves for p in palabras if p['s'] < hasta)
        edl['titular'] = {'texto': str(tit['texto']).strip()[:80], 'hasta': hasta, **({'conSubtitulos': True} if tapa_clave else {})}
    return edl


def aplicar(edl, ops):
    """JSON Patch reducido (replace / remove) solo en las rutas que el revisor puede tocar."""
    ok = re.compile(r'^/(claves/[^/]+|palabras/\d+/w|titular(/texto)?|sfx/\d+|estilo/subY|rotulos/\d+(/texto)?|broll/\d+)$')
    for o in sorted(ops or [], key=lambda o: -int(re.findall(r'\d+', o.get('path', '0'))[-1]) if re.findall(r'\d+', o.get('path', '')) else 0):
        path = o.get('path', '')
        if not ok.match(path): continue
        partes = path.strip('/').split('/'); padre = edl
        for p in partes[:-1]: padre = padre[int(p)] if isinstance(padre, list) else padre.get(p)
        k = partes[-1]
        if isinstance(padre, list): k = int(k)
        if o.get('op') == 'remove':
            if isinstance(padre, list) and k < len(padre): padre.pop(k)
            elif isinstance(padre, dict): padre.pop(k, None)
        elif o.get('op') == 'replace':
            padre[k] = o.get('value')
    return edl


# ─────────────── Render, medida y revisión ───────────────

def enlazar(src, dst):
    if os.path.isdir(src):
        os.makedirs(dst, exist_ok=True)
        for f in os.listdir(src): enlazar(os.path.join(src, f), os.path.join(dst, f))
    else:
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        try: os.link(src, dst)
        except OSError: shutil.copy2(src, dst)


def render(edl, video, clave, salida):
    pub = os.path.join(TMP, f'pub-{clave}-{uid()}')   # carpeta nueva en cada render
    enlazar(video, os.path.join(pub, 'p', clave, 'video.mp4'))
    extra = os.path.join(os.path.dirname(video), 'publico')   # persona.webm e img/ del corte
    if os.path.isdir(extra): enlazar(extra, os.path.join(pub, 'p', clave))
    for u in {s['src'] for s in edl.get('sfx', [])} | {(edl.get('musica') or {}).get('src', '')}:
        if u.startswith('lib/'): enlazar(os.path.join(APP, 'public', u), os.path.join(pub, u))
    enlazar(os.path.join(APP, 'public', 'fuentes'), os.path.join(pub, 'fuentes'))
    # SF Pro no va en ningún repo (es de Apple): se COPIA de las fuentes de este Mac a trabajos/_fuentes. Nunca enlace:
    # los originales llevan la marca «no modificable» (uchg) y un enlace duro la hereda (no se podía borrar el temporal).
    for dst, src in (('sfpro-bold.otf', 'SFPRODISPLAYBOLD.OTF'), ('sfpro-medium.otf', 'SFPRODISPLAYMEDIUM.OTF')):
        copia = os.path.join(TRABAJO, '_fuentes', dst); org = os.path.expanduser(f'~/Library/Fonts/{src}')
        if not os.path.exists(copia) and os.path.exists(org):
            os.makedirs(os.path.dirname(copia), exist_ok=True); shutil.copyfile(org, copia); os.chmod(copia, 0o644)
        if os.path.exists(copia): shutil.copyfile(copia, os.path.join(pub, 'fuentes', dst))
    props = os.path.join(TMP, f'edl-{clave}.json')
    json.dump({k: v for k, v in edl.items()}, open(props, 'w'), ensure_ascii=False)
    crudo = os.path.join(TMP, f'render-{clave}.mp4')
    try:
        limite = max(480, int(edl['duracion'] * 12))   # un reel de 45 s tarda ~4 min en este Mac
        for conc in (3, 1, 1):
            # Vigilado: si el navegador de Remotion se cuelga, se mata el grupo entero y se repite más despacio
            p = subprocess.Popen(['npx', 'remotion', 'render', 'src/index.ts', 'Reel', crudo, f'--props={props}', f'--public-dir={pub}',
                                  '--codec=h264', '--crf=16', f'--concurrency={conc}', '--log=error'], cwd=MOTOR,
                                 stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, start_new_session=True)
            try:
                _, err = p.communicate(timeout=limite)
                if p.returncode == 0: break
                log('render falló', (err or '')[-300:])
            except subprocess.TimeoutExpired:
                import signal
                try: os.killpg(p.pid, signal.SIGKILL)
                except Exception: pass
                p.wait(); log(f'render colgado más de {limite // 60} min: lo repito con concurrencia 1')
        else:
            raise RuntimeError('el render falló tres veces')
        return normalizar(crudo, salida)
    finally:
        for f in (props, crudo):
            if os.path.exists(f): os.remove(f)
        shutil.rmtree(pub, ignore_errors=True)


def medir(archivo):
    e = subprocess.run(['ffmpeg', '-hide_banner', '-nostdin', '-i', archivo, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    s = e[e.rfind('Summary:'):]
    i = re.search(r'I:\s+(-?[\d.]+) LUFS', s); p = re.search(r'Peak:\s+(-?[\d.]+) dBFS', s)
    return {'lufs': float(i[1]) if i else None, 'pico_dbtp': float(p[1]) if p else None}


def normalizar(entrada, salida):
    """−14 LUFS, loudnorm de dos pasadas; si el pico del MP4 ya codificado pasa de −1,5 dBTP, otra vez con más margen."""
    for tp in (-1.5, -2.0, -2.5):
        e = subprocess.run(['ffmpeg', '-hide_banner', '-nostdin', '-i', entrada, '-vn', '-af', f'loudnorm=I=-14:TP={tp}:LRA=9:print_format=json',
                            '-f', 'null', '-'], capture_output=True, text=True).stderr
        j = json.loads(e[e.rfind('{'):e.rfind('}') + 1])
        if 'inf' in str(j.get('input_i')):   # audio en silencio total (vídeo sin sonido): no hay nada que normalizar
            sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', entrada, '-c', 'copy', salida)
            return {'lufs': None, 'pico_dbtp': None}
        f2 = (f'loudnorm=I=-14:TP={tp}:LRA=9:measured_I={j["input_i"]}:measured_TP={j["input_tp"]}:measured_LRA={j["input_lra"]}:'
              f'measured_thresh={j["input_thresh"]}:offset={j["target_offset"]}:linear=true')
        sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', entrada, '-c:v', 'copy', '-af', f2, '-ar', '48000', '-c:a', 'aac', '-b:a', '256k', salida)
        m = medir(salida)
        if m['pico_dbtp'] is not None and m['pico_dbtp'] <= PICO_MAX: return m
    return m


def hoja(video, edl, destino):
    """Fotogramas clave: arranque, fin del titular, cada clave, un punto medio, la tarjeta de seguir y el final."""
    D = edl['duracion'] - 0.6
    ts = [0.4]
    if edl.get('titular'): ts.append(edl['titular']['hasta'] - 0.2)
    vistas = set()
    for p in edl['palabras']:
        k = limpia(p['w'])
        if k in edl['claves'] and k not in vistas: vistas.add(k); ts.append(p['s'] + 0.25)
    ts += [D * 0.5, D - 0.2] + ([edl['cta']['t'] + 1.0] if edl.get('cta') else [])
    ts = sorted({round(min(max(0.1, t), D - 0.1), 2) for t in ts})[:12]
    tmp = os.path.join(TMP, 'hoja-' + uid()); os.makedirs(tmp)
    for i, t in enumerate(ts):
        sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-ss', f'{t:.2f}', '-i', video, '-frames:v', '1',
           '-vf', f"scale=360:-2,drawtext=text='{t:.1f}s':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6", os.path.join(tmp, f'{i:02d}.jpg'))
    cols = min(6, len(ts)); filas = (len(ts) + cols - 1) // cols
    sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', os.path.join(tmp, '%02d.jpg'), '-vf', f'tile={cols}x{filas}', '-frames:v', '1', destino)
    shutil.rmtree(tmp, ignore_errors=True)
    return ts


def revisar(final, edl, medidas, carpeta):
    hj = os.path.join(carpeta, 'revision.jpg'); ts = hoja(final, edl, hj)
    resumen = {'duracion': edl['duracion'], 'claves': edl['claves'], 'titular': edl.get('titular'),
               'sfx': [{'i': i, 't': s['t'], 'archivo': os.path.basename(s['src']), 'por_que': s.get('por_que', '')} for i, s in enumerate(edl['sfx'])],
               'palabras': [f'{i}:{p["w"]}@{p["s"]:.1f}' for i, p in enumerate(edl['palabras'])], 'estilo': edl['estilo']}
    prompt = open(os.path.join(AQUI, 'revisor.md')).read() + f"""

---
HOJA DE FOTOGRAMAS: {hj} (tiempos: {ts})
MEDIDAS DEL AUDIO: {json.dumps(medidas)}
EDL RESUMIDA: {json.dumps(resumen, ensure_ascii=False)}
"""
    return claude(prompt, carpeta, herramientas='Read')


# ─────────────── decisiones.json (formato de Amin) ───────────────

def decisiones(titulo, bruto, pj, plan, edl, segs, revision, medidas):
    cortes = []
    for t in pj.get('tramos', []):
        cortes.append({'bruto_s': t['bruto_ini'], 'bruto_e': t['bruto_fin'], 'por_que': f'frase {t["seg"]}: «{segs[t["seg"]]["text"].strip()[:60]}»'})
    quitadas = {q.get('i'): q.get('por_que', '') for q in plan.get('quitadas') or []}
    subs = []
    for p in edl['palabras']:
        k = limpia(p['w'])
        subs.append({'s': p['s'], 'e': p['e'], 'linea': p['w'], 'clave': p['w'] if k in edl['claves'] else '', 'color': edl['claves'].get(k, '')})
    return {
        'video': titulo, 'bruto': os.path.basename(bruto), 'duracion_final_s': edl['duracion'],
        'cortes': cortes, 'quitadas': [{'frase': i, 'texto': segs[i]['text'].strip()[:80], 'por_que': q} for i, q in quitadas.items() if isinstance(i, int) and i < len(segs)],
        'subtitulos': subs,
        'graficos': ([{'t': 0.0, 'hasta': edl['titular']['hasta'], 'que': f'titular «{edl["titular"]["texto"]}»', 'palabra_que_lo_dispara': 'gancho', 'por_que': 'refuerza el gancho'}] if edl.get('titular') else [])
                    + ([{'t': edl['cta']['t'], 'hasta': edl['duracion'], 'que': 'tarjeta de seguir', 'palabra_que_lo_dispara': 'sígueme', 'por_que': 'una sola llamada a la acción'}] if edl.get('cta') else []),
        'zooms': [{'t': z['s'], 'escala': z['escala'], 'por_que': 'cambio de plano en el corte' + (' + frase fuerte' if z['escala'] > 1.3 else '')} for z in edl['zooms']],
        'sfx': [{'t': s['t'], 'archivo': os.path.basename(s['src']), 'nivel_db': round(20 * __import__('math').log10(max(s['vol'], 1e-4)), 1), 'por_que': s.get('por_que', '')} for s in edl['sfx']],
        'musica': {'archivo': os.path.basename(edl['musica']['src']), 'nivel_db': round(20 * __import__('math').log10(edl['musica']['vol']), 1)} if edl.get('musica') else {'archivo': '', 'nivel_db': None},
        'color': 'HDR a SDR (tonemap hable) si el bruto era HLG; sin más corrección',
        'audio': medidas, 'revision': {'problemas': revision.get('problemas', []), 'nota': revision.get('nota', '')},
        'dudas': plan.get('dudas', []), 'notas': ' · '.join(plan.get('notas') or []),
        'editor': QUIEN, 'coste_ia_usd': round(COSTE['usd'], 3),
    }


# ─────────────── Persona recortada e imágenes de los insertos ───────────────

# Recorte de la persona: la copia del repo (luis/fondo, `npm install` una vez) y, si no está instalada, la del Mac de Luis
FONDO = os.path.join(AQUI, 'fondo') if os.path.isdir(os.path.join(AQUI, 'fondo', 'node_modules')) else os.path.expanduser('~/Videos-Remotion/fondo')


def detectar_cara(video):
    """Centro y alto de la cara (mediana de 8 fotogramas, OpenCV Haar). None si no hay OpenCV o no se ve cara."""
    try:
        import cv2, statistics as st
        cap = cv2.VideoCapture(video); n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        cc = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'); res = []
        for k in range(8):
            cap.set(cv2.CAP_PROP_POS_FRAMES, int(n * (k + 0.5) / 8)); ok, fr = cap.read()
            if not ok: continue
            g = cv2.cvtColor(cv2.resize(fr, (540, int(540 * fr.shape[0] / fr.shape[1]))), cv2.COLOR_BGR2GRAY)
            f = cc.detectMultiScale(g, 1.1, 6, minSize=(30, 30))
            if len(f):
                x, y, w, h = max(f, key=lambda r: r[2] * r[3]); res.append(((x + w / 2) / g.shape[1], (y + h / 2) / g.shape[0], h / g.shape[0]))
        if len(res) < 3: return None
        c = {'x': st.median(r[0] for r in res), 'y': st.median(r[1] for r in res), 'alto': st.median(r[2] for r in res)}
        log('cara en', {k: round(v, 3) for k, v in c.items()}); return c
    except Exception as e:
        log('sin detección de cara:', repr(e)[:120]); return None


def recortar_persona(montaje, pubdir):
    """Máscara de la persona (RVM, ~14 fps a 1080) y vídeo con alfa VP9 para poner rótulos detrás y oscurecer solo el fondo."""
    out = os.path.join(pubdir, 'persona.webm')
    if os.path.exists(out): return True
    try:
        negro = os.path.join(TMP, 'negro.png')
        if not os.path.exists(negro): sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-f', 'lavfi', '-i', 'color=c=black:s=1080x1920', '-frames:v', '1', negro)
        base = os.path.join(TMP, 'persona-' + uid())
        sh('node', os.path.join(FONDO, 'recortar.js'), montaje, negro, base, '--ancho', '1080', cwd=FONDO, stdout=subprocess.DEVNULL)
        sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', montaje, '-i', base + '-mate.mp4', '-filter_complex',
           '[0:v]scale=1080:1920,format=yuva420p[v];[1:v]scale=1080:1920,format=gray,gblur=sigma=1.2[m];[v][m]alphamerge[a]',
           '-map', '[a]', '-an', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '6M', '-deadline', 'realtime', '-cpu-used', '8', '-row-mt', '1', out)
        for f in glob.glob(base + '*'): os.remove(f)
        return True
    except Exception as e:
        log('no pude recortar a la persona, sigo sin ella:', repr(e)[:200]); return False


def tarjetas_blancas(insertos, pubdir, clave):
    """Alumnos (Amin, 13-11): nada de fotos de Wikimedia, que salían sin relación con lo que se dice. En su lugar, el efecto
    de Luis: fondo blanco a pantalla completa con la palabra (o 2-3 palabras) en negro y grande."""
    imgs = {}
    os.makedirs(os.path.join(pubdir, 'img'), exist_ok=True)
    fuente = os.path.join(APP, 'public', 'fuentes', 'montserrat-black.ttf')
    for k, x in enumerate(insertos):
        txt = re.sub(r'[^\wÁÉÍÓÚÜÑáéíóúüñ%€$ ]', '', str(x.get('texto') or x.get('palabra') or '')).strip().upper()
        pal = txt.split()[:4]
        if not pal: continue
        lineas = []
        for w in pal:   # líneas de ~11 letras como mucho
            if lineas and len(lineas[-1]) + 1 + len(w) <= 11: lineas[-1] += ' ' + w
            else: lineas.append(w)
        tam = max(90, min(190, int(900 / max(len(l) for l in lineas) * 1.25)))
        alto = tam * 1.15; y0 = 960 - alto * len(lineas) / 2
        dt = ','.join(f"drawtext=fontfile='{fuente}':text='{l}':fontsize={tam}:fontcolor=0x0b0b0c:x=(w-text_w)/2:y={int(y0 + i * alto)}"
                      for i, l in enumerate(lineas))
        dst = os.path.join(pubdir, 'img', f'i{k}.png')
        try:
            sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-f', 'lavfi', '-i', 'color=c=white:s=1080x1920', '-vf', dt, '-frames:v', '1', dst)
            imgs[k] = f'p/{clave}/img/i{k}.png'
        except Exception as e:
            log('tarjeta blanca falló:', txt, repr(e)[:120])
    return imgs, []


def buscar_insertos(insertos, pubdir, clave):
    """Una imagen por inserto de Wikimedia Commons (licencias libres; se apunta autor y licencia)."""
    import urllib.request, urllib.parse
    imgs, creditos = {}, []
    os.makedirs(os.path.join(pubdir, 'img'), exist_ok=True)
    for k, x in enumerate(insertos):
        q0 = str(x.get('busqueda') or '').strip()
        if not q0: continue
        intentos = [(q0, 900), (' '.join(q0.split()[:3]), 700), (' '.join(q0.split()[:2]), 700)]
        for q, minimo in dict.fromkeys(intentos):
          if k in imgs: break
          url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode({
            'action': 'query', 'generator': 'search', 'gsrnamespace': 6, 'gsrsearch': f'{q} filetype:bitmap', 'gsrlimit': 8,
            'prop': 'imageinfo', 'iiprop': 'url|size|mime|extmetadata', 'iiurlwidth': 1400, 'format': 'json'})
          try:
            r = json.loads(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'ClaudeDeLuis/1.0 (editor de video)'}), timeout=30).read())
            paginas = sorted((r.get('query') or {}).get('pages', {}).values(), key=lambda p: p.get('index', 99))
            for pg in paginas:
                ii = (pg.get('imageinfo') or [{}])[0]
                if ii.get('mime') not in ('image/jpeg', 'image/png') or ii.get('width', 0) < minimo or ii.get('height', 0) < minimo * 0.75: continue
                dst = os.path.join(pubdir, 'img', f'i{k}.jpg')
                sh('curl', '-sSfL', '-A', 'ClaudeDeLuis/1.0', '-o', dst, ii.get('thumburl') or ii['url'])
                meta = ii.get('extmetadata') or {}
                creditos.append({'inserto': k, 'busqueda': q, 'archivo': pg.get('title'), 'pagina': ii.get('descriptionurl'),
                                 'licencia': (meta.get('LicenseShortName') or {}).get('value', ''), 'autor': re.sub('<[^>]+>', '', (meta.get('Artist') or {}).get('value', ''))[:120]})
                imgs[k] = f'p/{clave}/img/i{k}.jpg'
                break
          except Exception as e:
            log('inserto sin imagen:', q, repr(e)[:120])
        if k not in imgs: log('inserto sin imagen tras simplificar:', q0)
    return imgs, creditos


# ─────────────── Edición completa de un vídeo ───────────────

AVISO_QUEMADOS = ('⚠️ El vídeo que subió ya viene editado: trae subtítulos o textos metidos en la imagen. Para no poner '
                  'subtítulos dobles, este montaje va SIN nuestros subtítulos ni rótulos. Pídele el bruto sin editar '
                  '(sin subtítulos, sin textos, tal cual sale de la cámara) para editarlo bien.')


def textos_quemados(src, fj):
    """¿El bruto ya trae subtítulos o textos dentro de la imagen (vídeo ya editado en CapCut/Edits…)? OCR de Vision del Mac
    en 12 fotogramas. Cuenta como subtítulo el texto que coincide con lo que se dice, o el que se repite en muchos fotogramas
    (títulos fijos); un cartel suelto del fondo no cuenta. Kevin, 09-11: subía sus vídeos ya subtitulados y salían dobles."""
    try:
        from ocrmac import ocrmac
    except ImportError:
        log('sin ocrmac: no compruebo si el bruto trae subtítulos'); return None
    import tempfile, collections
    dicho = {_norm(w['w']) for sg in json.load(open(fj))['segments'] for w in sg.get('words') or []} if fj else set()
    dicho = {w for w in dicho if len(w) >= 3}
    dur = float(sonda(src).get('format', {}).get('duration') or 30)
    d = tempfile.mkdtemp(dir=TMP); n = 12
    sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', src, '-vf', f'fps={n / max(dur, 1):.4f},scale=540:-2', '-frames:v', str(n), os.path.join(d, 'f%02d.jpg'))
    fotos = sorted(glob.glob(os.path.join(d, '*.jpg')))
    con_dicho, lineas = 0, collections.Counter()
    for f in fotos:
        try: textos = [t for t, conf, _ in ocrmac.OCR(f, language_preference=['es-ES']).recognize() if conf > 0.5]
        except Exception: continue
        if any(_norm(x) in dicho for t in textos for x in t.split()): con_dicho += 1
        for t in set(_norm(t) for t in textos):
            if len(t) >= 4: lineas[t] += 1
    shutil.rmtree(d, ignore_errors=True)
    fijos = [t for t, k in lineas.items() if k >= max(3, len(fotos) * 0.4)]
    hay = bool(fotos) and (con_dicho >= max(3, len(fotos) * 0.3) or bool(fijos))
    log('textos en el bruto:', f'{con_dicho}/{len(fotos)} fotogramas con palabras dichas, fijos {fijos[:3]}', '→ YA EDITADO' if hay else '→ limpio')
    return hay


def sin_textos_nuestros(edl):
    """El bruto ya trae subtítulos: fuera los nuestros (y rótulos/titular) y sin zoom fuerte, que cortaría sus textos."""
    edl.update(palabras=[], claves={}, rotulos=[], zooms=[{'s': 0, 'escala': 1.0}])
    edl.pop('titular', None); edl.pop('persona', None)
    return edl


def sin_seguir(edl):
    """Alumnos (Amin, 13-11): sin la tarjeta de «Seguir» con el @; sus usuarios son largos y raros y quedaba feo."""
    edl.pop('cta', None)
    edl['sfx'] = [x for x in edl.get('sfx', []) if x.get('por_que') != 'entra la tarjeta de seguir']
    return edl


def texto_en_pantalla(*fuentes):
    """El texto que el guion pide en pantalla: lo primero entre «» (título, notas o guion); si no, el gancho del guion."""
    for f in fuentes:
        m = re.search(r'[Tt]exto en pantalla[^«"]*[«"]([^»"]{3,120})[»"]', f or '') or re.search(r'«([^»]{3,120})»', f or '')
        if m: return m[1].strip()
    g = re.search(r'^GANCHO: (.+)$', fuentes[1] if len(fuentes) > 1 and fuentes[1] else '', re.M)
    return g[1].strip()[:110] if g else ''


def sin_voz(src, src_original, carpeta, titulo, guion, notas, ficha, quien, usuario):
    """Vídeos sin voz (audio en tendencia, sketch mudo, entreno): antes daban error. Va entero, sin subtítulos ni zoom,
    con el texto en pantalla que pide el guion (si el bruto no lo trae ya) y el audio original normalizado."""
    log('sin voz: se monta entero con el texto en pantalla')
    COSTE['usd'] = 0.0
    corte = os.path.join(carpeta, 'corte'); os.makedirs(corte, exist_ok=True)
    mont = os.path.join(corte, 'montaje.mp4')
    con_audio = any(x.get('codec_type') == 'audio' for x in sonda(src).get('streams', []))
    sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', src, *([] if con_audio else ['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-shortest']),
       '-map', '0:v:0', '-map', '0:a:0' if con_audio else '1:a:0', '-c:v', 'h264_videotoolbox', '-b:v', '16M', '-r', '30',
       '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', mont)
    dur = float(sonda(mont)['format']['duration'])
    pj = {'palabras': [], 'duracion': dur, 'tramos': []}
    json.dump(pj, open(os.path.join(corte, 'palabras.json'), 'w'))
    clave = 'v-' + hashlib.sha1(carpeta.encode()).hexdigest()[:10]
    edl = construir_edl(pj, {}, clave, usuario, ficha, {}, False, detectar_cara(mont))
    edl['zooms'] = [{'s': 0, 'escala': 1.0}]   # sin voz suele ser un plano de cuerpo entero o un sketch: no se recorta
    edl.pop('musica', None)   # sin voz manda su propio audio (tendencia): la música de la ficha es solo para vídeos con voz (Luis, 14-11)
    if quien == 'alumno': sin_seguir(edl)
    quemados = textos_quemados(src, None)
    texto = '' if quemados else texto_en_pantalla(titulo, guion, notas)
    if texto: edl['titular'] = {'texto': texto, 'hasta': round(max(1.5, edl['duracion'] - 0.4), 2)}
    final = os.path.join(carpeta, 'final.mp4')
    medidas = render(edl, mont, clave, final)
    portada = os.path.join(carpeta, 'portada.jpg')
    sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-ss', '0.6', '-i', final, '-frames:v', '1', '-vf', 'scale=540:-2', '-q:v', '4', portada)
    json.dump(edl, open(os.path.join(carpeta, 'edl.json'), 'w'), ensure_ascii=False, indent=1)
    nota = ('Vídeo sin voz: va entero, sin subtítulos, con el audio original.'
            + (f' Texto en pantalla: «{texto}».' if texto else ' El bruto ya trae su texto en pantalla.' if quemados else ' Sin texto en pantalla: añádelo si hace falta.'))
    plan = {'notas': [nota], 'dudas': []}
    dec = decisiones(titulo, src_original, pj, plan, edl, [], {}, medidas)
    dec.update(limpieza=[], estilo='sin_voz', bruto_ya_editado=False, insertos_creditos=[])
    json.dump(dec, open(os.path.join(carpeta, 'decisiones.json'), 'w'), ensure_ascii=False, indent=1)
    log('listo (sin voz)', titulo, f'{edl["duracion"]:.1f} s', medidas)
    return final, portada, edl, dec


def editar(src_original, carpeta, titulo, guion='', notas='', quien='alumno', usuario='tucuenta', cliente=None):
    os.makedirs(carpeta, exist_ok=True); os.makedirs(TMP, exist_ok=True)
    COSTE['usd'] = 0.0
    src, info = ingesta(src_original, carpeta)
    fj = transcribir(src, carpeta)
    ficha = ficha_de(quien, cliente)
    if not fj: return sin_voz(src, src_original, carpeta, titulo, guion, notas, ficha, quien, usuario)
    segs = json.load(open(fj))['segments']
    pf = os.path.join(carpeta, 'plan.json')
    try:
        brief = dirigir(segs, titulo, guion, notas, ficha, carpeta) if quien == 'alumno' else {}
        plan = json.load(open(pf)) if REUSAR_PLAN and os.path.exists(pf) else decidir(segs, titulo, guion, notas, ficha, carpeta, brief)
    except Saltar as e:
        if 'tomas' not in str(e): raise
        log('ninguna toma hablada útil (música o ruido): va como vídeo sin voz')
        return sin_voz(src, src_original, carpeta, titulo, guion, notas, ficha, quien, usuario)
    corte = os.path.join(carpeta, 'corte')
    sh(sys.executable, os.path.join(MOTOR_DIR, 'montar.py'), src, fj, corte, ','.join(map(str, plan['mantener'])), '0.18', '0.08',
       env={**os.environ, 'BITRATE': '45M' if max(info['w'], info['h']) >= 3000 else '16M', 'MULETILLAS': '1'})
    limpieza = limpiar(corte)
    pj = json.load(open(os.path.join(corte, 'palabras.json')))
    clave = 'v-' + hashlib.sha1(carpeta.encode()).hexdigest()[:10]
    pubdir = os.path.join(corte, 'publico'); os.makedirs(pubdir, exist_ok=True)
    persona = ESTILOS[ESTILO]['persona'] and recortar_persona(os.path.join(corte, 'montaje.mp4'), pubdir)
    buscar = tarjetas_blancas if quien == 'alumno' else buscar_insertos
    imgs, creditos = buscar(plan.get('insertos') or [], pubdir, clave) if ESTILOS[ESTILO]['insertos'] else ({}, [])
    cara = detectar_cara(os.path.join(corte, 'montaje.mp4'))
    edl = construir_edl(pj, plan, clave, usuario, ficha, imgs, persona, cara)
    if quien == 'alumno': sin_seguir(edl)
    quemados = textos_quemados(src, fj)
    if quemados: sin_textos_nuestros(edl)
    final = os.path.join(carpeta, 'final.mp4')
    medidas = render(edl, os.path.join(corte, 'montaje.mp4'), clave, final)
    rev = revisar(final, edl, medidas, carpeta)
    if rev.get('ops'):
        log('la revisión pide', len(rev['ops']), 'cambios:', '; '.join(rev.get('problemas', []))[:200])
        edl = aplicar(edl, rev['ops'])
        if quien == 'alumno': sin_seguir(edl)
        if quemados: sin_textos_nuestros(edl)   # la revisión no puede volver a meter subtítulos encima de los suyos
        medidas = render(edl, os.path.join(corte, 'montaje.mp4'), clave, final)
    portada = os.path.join(carpeta, 'portada.jpg')
    sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-ss', '0.6', '-i', final, '-frames:v', '1', '-vf', 'scale=540:-2', '-q:v', '4', portada)
    json.dump(edl, open(os.path.join(carpeta, 'edl.json'), 'w'), ensure_ascii=False, indent=1)
    dec = decisiones(titulo, src_original, pj, plan, edl, segs, rev, medidas)
    dec['brief'] = brief   # lo que decidió el director (formato, mensaje, guion)
    dec['limpieza'] = limpieza   # muletillas y arranques repetidos que se cortaron del montaje
    dec['estilo'] = ESTILO
    dec['bruto_ya_editado'] = bool(quemados)
    if quemados: dec['dudas'] = [AVISO_QUEMADOS] + list(dec.get('dudas') or [])
    dec['insertos_creditos'] = creditos
    dec['graficos'] += [{'t': r['s'], 'hasta': r['e'], 'que': f'rótulo «{r["texto"]}»' + (' detrás de la persona' if r.get('detras') else ''), 'palabra_que_lo_dispara': r['texto'].split('/')[0].replace('*', ''), 'por_que': 'titular de la idea'} for r in edl.get('rotulos', [])]
    dec['graficos'] += [{'t': b['s'], 'hasta': b['e'], 'que': f'inserto {os.path.basename(b["src"])}', 'palabra_que_lo_dispara': '', 'por_que': 'ilustra lo que se nombra'} for b in edl.get('broll', [])]
    json.dump(dec, open(os.path.join(carpeta, 'decisiones.json'), 'w'), ensure_ascii=False, indent=1)
    log('listo', titulo, f'{edl["duracion"]:.1f} s', medidas, f'IA ${COSTE["usd"]:.2f}')
    return final, portada, edl, dec


# ─────────────── Almacén R2 (S3) ───────────────

def _enc(s): return quote(s, safe='-_.~')


def s3_listo(): return all(ENV.get(k) for k in ('S3_ENDPOINT', 'S3_BUCKET', 'S3_KEY', 'S3_SECRET'))


def firmar(metodo, clave, segundos=3600):
    ep, bucket, region = ENV['S3_ENDPOINT'].rstrip('/'), ENV['S3_BUCKET'], ENV.get('S3_REGION') or 'auto'
    ahora = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'); dia = ahora[:8]
    ambito = f'{dia}/{region}/s3/aws4_request'
    ruta = f'/{bucket}/' + '/'.join(_enc(p) for p in clave.split('/'))
    q = {'X-Amz-Algorithm': 'AWS4-HMAC-SHA256', 'X-Amz-Credential': f'{ENV["S3_KEY"]}/{ambito}', 'X-Amz-Date': ahora, 'X-Amz-Expires': str(segundos), 'X-Amz-SignedHeaders': 'host'}
    consulta = '&'.join(f'{_enc(k)}={_enc(q[k])}' for k in sorted(q))
    canonica = '\n'.join([metodo, ruta, consulta, f'host:{urlparse(ep).netloc}\n', 'host', 'UNSIGNED-PAYLOAD'])
    a_firmar = '\n'.join(['AWS4-HMAC-SHA256', ahora, ambito, hashlib.sha256(canonica.encode()).hexdigest()])
    h = lambda k, s: hmac.new(k, s.encode(), hashlib.sha256).digest()
    k = h(h(h(h(('AWS4' + ENV['S3_SECRET']).encode(), dia), region), 's3'), 'aws4_request')
    return f'{ep}{ruta}?{consulta}&X-Amz-Signature={hmac.new(k, a_firmar.encode(), hashlib.sha256).hexdigest()}'


def s3_bajar(clave, destino): sh('curl', '-sSf', '--retry', '5', '--retry-all-errors', '--retry-delay', '5', '-o', destino, firmar('GET', clave))
def s3_subir(archivo, clave, tipo='video/mp4'):
    sh('curl', '-sSf', '--retry', '3', '-X', 'PUT', '-H', f'Content-Type: {tipo}', '-T', archivo, firmar('PUT', clave, 6 * 3600), stdout=subprocess.DEVNULL)


# ─────────────── Cola de alumnos (Trainer10x) ───────────────

def alumnos(c):
    from psycopg.types.json import Jsonb  # noqa: F401
    if not s3_listo(): log('sin almacén R2 configurado: no cojo vídeos de alumnos'); return False
    c.execute("""UPDATE t10x.videos SET estado = CASE WHEN correcciones <> '' THEN 'corregir' ELSE 'en_cola' END
                 WHERE estado='editando' AND updated_at < now() - interval '2 hours'""")
    cogido = c.execute("""UPDATE t10x.videos SET estado='editando', updated_at=now(),
                            historial = historial || %s::text::jsonb
                          WHERE id = (SELECT id FROM t10x.videos WHERE estado IN ('en_cola', 'corregir') ORDER BY updated_at LIMIT 1 FOR UPDATE SKIP LOCKED)
                          RETURNING id""", (json.dumps([{'quien': QUIEN, 'que': 'cogido para editar', 'fecha': time.strftime('%Y-%m-%dT%H:%M:%S')}]),)).fetchone()
    if not cogido: return False
    v = c.execute("""SELECT v.*, cl.nombre cliente, cl.instagram, g.gancho, g.historia, g.moraleja, g.cta
                     FROM t10x.videos v JOIN t10x.clientes cl ON cl.id = v.cliente_id LEFT JOIN t10x.guiones g ON g.id = v.guion_id
                     WHERE v.id = %s""", (cogido['id'],)).fetchone()
    titulo = v['titulo'] or 'Vídeo'
    carpeta = os.path.join(TRABAJO, 'alumnos', seguro(v['cliente'])[:60] or v['cliente_id'], f'{seguro(titulo)[:60]}-{v["id"][-4:]}')
    try:
        os.makedirs(carpeta, exist_ok=True)
        src = os.path.join(carpeta, 'bruto.' + v['bruto'].rsplit('.', 1)[-1].lower())
        if not os.path.exists(src) or os.path.getsize(src) < 100_000: s3_bajar(v['bruto'], src)
        guion = '\n'.join(f'{k.upper()}: {v[k]}' for k in ('gancho', 'historia', 'moraleja', 'cta') if v.get(k))
        notas = '\n'.join(x for x in [v['nota_alumno'] and f'Nota del alumno: {v["nota_alumno"]}',
                                      v['correcciones'] and f'CORRECCIONES DEL EDITOR sobre la versión anterior (aplícalas todas):\n{v["correcciones"]}'] if x)
        usuario = re.sub(r'^@|^https?://(www\.)?instagram\.com/|[/?].*$', '', (v['instagram'] or '').strip()) or 'tucuenta'
        final, portada, edl, dec = editar(src, carpeta, titulo, guion, notas, 'alumno', usuario, v['cliente_id'])
        n = v['version'] + 1; base = f'alumnos/{v["cliente_id"]}/{v["id"]}'
        ligero = os.path.join(carpeta, f'final-v{n}.mp4')
        sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', final, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-maxrate', '12M', '-bufsize', '24M',
           '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', ligero)
        s3_subir(ligero, f'{base}/final-v{n}.mp4'); s3_subir(portada, f'{base}/portada-v{n}.jpg', 'image/jpeg')
        s3_subir(os.path.join(carpeta, 'decisiones.json'), f'{base}/decisiones-v{n}.json', 'application/json')
        s3_subir(os.path.join(carpeta, 'edl.json'), f'{base}/edl-v{n}.json', 'application/json')
        aviso = str((dec.get('brief') or {}).get('aviso_alumno') or '').strip()
        resumen = (AVISO_QUEMADOS + ' ' if dec.get('bruto_ya_editado') else '') + (f'Sobre el guion: {aviso} ' if aviso else '') + ('Con tus cambios. ' if v['correcciones'] else 'Primer montaje. ') + (dec['notas'] or '') + (f' Dudas: {"; ".join(x for x in dec["dudas"] if x != AVISO_QUEMADOS)}' if [x for x in dec['dudas'] if x != AVISO_QUEMADOS] else '')
        c.execute("""UPDATE t10x.videos SET estado='revisar', final=%s, portada=%s, duracion=%s, version=%s, respuesta=%s, updated_at=now(),
                     historial = historial || %s::text::jsonb WHERE id=%s AND estado='editando'""",
                  (f'{base}/final-v{n}.mp4', f'{base}/portada-v{n}.jpg', round(edl['duracion'], 1), n, resumen.strip()[:600],
                   json.dumps([{'quien': QUIEN, 'que': f'versión {n}', 'fecha': time.strftime('%Y-%m-%dT%H:%M:%S'), 'coste_ia_usd': dec['coste_ia_usd']}]), v['id']))
    except SinClaude as e:
        # No es un fallo del vídeo: vuelve a donde estaba y se para todo 30 min (el LaunchAgent lo relanza cada minuto).
        log('Claude sin cupo o sin sesión, vuelve a la cola y pauso 30 min:', str(e)[:150])
        open(PAUSA, 'w').write(str(int(time.time()) + 1800))
        c.execute("""UPDATE t10x.videos SET estado = CASE WHEN correcciones <> '' THEN 'corregir' ELSE 'en_cola' END, updated_at=now()
                     WHERE id=%s AND estado='editando'""", (v['id'],))
        return False
    except Saltar as e:
        c.execute("UPDATE t10x.videos SET estado='error', respuesta=%s, updated_at=now() WHERE id=%s", (str(e), v['id'])); log('saltado:', e)
    except Exception as e:
        log('falló:', repr(e)[:300])
        motivo = re.sub(r'\s+', ' ', f'{type(e).__name__}: {e}')[:160]
        c.execute("UPDATE t10x.videos SET estado='error', respuesta=%s, updated_at=now() WHERE id=%s",
                  (f'El montaje automático falló ({motivo}). «Rehacer desde cero» para reintentarlo, o edítalo a mano.', v['id']))
    return True


# ─────────────── Cola de la Sala (fase 1, 31-10) ───────────────
# Contrato: bd/CONTRATO-TRABAJADOR.md (main). Bruto 'en cola' sin datos.auto → 'editando' + auto 'luis' → 'entregado';
# la entrega va en edicion.items (tipo 'entrega', estado 'esperando', editado_por 'luis') + edicion.versiones n.º 1 'renderizado'.
# Los archivos van al almacén (prefijo sala/<entrega>/). Sin almacén configurado no se coge nada (issue #2).

def bajar_bruto(url, carpeta):
    os.makedirs(carpeta, exist_ok=True)
    if re.search(r'(youtube\.com|youtu\.be)/', url):
        if not glob.glob(os.path.join(carpeta, 'bruto.mp4')):
            sh('uvx', 'yt-dlp', '-q', '--no-warnings', '--no-playlist', '-f', 'bv*[height<=2160]+ba/b', '--merge-output-format', 'mp4',
               '-o', os.path.join(carpeta, 'bruto.%(ext)s'), url)
    elif re.search(r'/folders/([\w-]+)', url):
        sh(sys.executable, os.path.join(MOTOR_DIR, 'bajar_drive.py'), re.search(r'/folders/([\w-]+)', url)[1], carpeta)
    else:
        m = re.search(r'/file/d/([\w-]+)|[?&]id=([\w-]+)', url)
        if not m: raise Saltar('El enlace no es de un archivo o carpeta de Google Drive ni de YouTube.')
        dst = os.path.join(carpeta, 'bruto.mov')
        if not os.path.exists(dst) or os.path.getsize(dst) < 1_000_000:
            sh('curl', '-sL', '-o', dst, f'https://drive.usercontent.google.com/download?id={m[1] or m[2]}&export=download&confirm=t')
    vids = [f for f in glob.glob(os.path.join(carpeta, '**', '*'), recursive=True) if re.search(r'\.(mov|mp4|m4v)$', f, re.I) and os.path.getsize(f) > 1_000_000]
    if not vids: raise Saltar('No he podido bajar el vídeo: revisa que el enlace esté compartido con «cualquiera con el enlace».')
    return max(vids, key=os.path.getsize)


def estilo_de(texto):
    t = (texto or '').lower()
    return 'profundidad' if re.search(r'profundidad|detr[aá]s|natt|guille', t) else 'cine' if re.search(r'\bcine|alborna|oscuro', t) else 'clave'


# Quién edita (orden de Amin, 31-10): Luis dirige; Claude 1 edita con estas mismas normas cuando Luis se satura.
# IDENTIDAD en env.json: 'luis' (por defecto) o 'claude1'.
#  - luis coge los reels sin `auto` y sin delegar (o delegados a él); si hay más de SATURACION en cola, marca los
#    sobrantes con datos.delegar='claude1'.
#  - claude1 coge los delegados a él y, si el Mac de Luis no está, los que llevan más de 30 min esperando.
IDENTIDAD = ENV.get('IDENTIDAD', 'luis')
SATURACION = int(ENV.get('SATURACION', 3))
REEL = "tipo='bruto' AND estado='en cola' AND coalesce(datos->>'auto','')='' AND coalesce(datos->>'formato','') NOT ILIKE '%%clip%%'"


def delegar_sobrantes(c):
    """Luis saturado: los reels que pasan de SATURACION en cola se marcan para Claude 1 (los más nuevos)."""
    if IDENTIDAD != 'luis': return
    r = c.execute(f"""UPDATE edicion.items SET datos = datos || '{{"delegar":"claude1"}}', updated_at=now() WHERE id IN (
                        SELECT id FROM edicion.items WHERE {REEL} AND coalesce(datos->>'delegar','')=''
                        ORDER BY created_at OFFSET %s FOR UPDATE SKIP LOCKED) RETURNING id""", (SATURACION,)).fetchall()
    if r: log('saturado: delego a Claude 1', [x['id'] for x in r])


def sala(c):
    from psycopg.types.json import Jsonb
    global ESTILO
    if not s3_listo(): log('sin almacén para la Sala (issue #2): no cojo brutos'); return False
    delegar_sobrantes(c)
    filtro = ("coalesce(datos->>'delegar','') IN ('', 'luis')" if IDENTIDAD == 'luis'
              else "(datos->>'delegar' = %s OR updated_at < now() - interval '30 minutes')")
    b = c.execute(f"""UPDATE edicion.items SET estado='editando', datos = datos || jsonb_build_object('auto', %s::text), updated_at=now(),
                       respuesta=%s WHERE id = (
                       SELECT id FROM edicion.items WHERE {REEL} AND {filtro} ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED)
                     RETURNING id, datos""", (IDENTIDAD, 'Editando (Claude de Luis)…' if IDENTIDAD == 'luis' else 'Editando (Claude 1, normas de Luis)…',
                                               *(() if IDENTIDAD == 'luis' else (IDENTIDAD,)))).fetchone()
    if not b: return False
    d = b['datos']; titulo = d.get('titulo') or 'Vídeo'
    entrega = re.sub(r'[^a-z0-9]+', '-', __import__('unicodedata').normalize('NFKD', titulo).encode('ascii', 'ignore').decode().lower()).strip('-')[:40] + '-' + b['id'][-4:]
    carpeta = os.path.join(TRABAJO, 'sala', entrega)
    try:
        src = bajar_bruto(d.get('url', ''), os.path.join(carpeta, 'bruto'))
        notas = d.get('instrucciones') or ''
        ESTILO = estilo_de(notas)
        final, portada, edl, dec = editar(src, carpeta, titulo, d.get('guion', ''), notas, 'amin', 'aminbusinesss')
        base = f'sala/{entrega}'
        corte = os.path.join(carpeta, 'corte')
        # Lo que necesita el editor web: base a 720p, tira, onda (como a_la_web del agente) + persona/imágenes + final y portada
        web = os.path.join(carpeta, 'web'); os.makedirs(web, exist_ok=True)
        sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', os.path.join(corte, 'montaje.mp4'), '-vf', 'scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2',
           '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', os.path.join(web, 'video.mp4'))
        n = max(1, int(edl['duracion'] + 0.999))
        sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', os.path.join(web, 'video.mp4'), '-vf', f'fps=1,scale=-1:64,tile={n}x1', '-frames:v', '1', '-q:v', '5', os.path.join(web, 'tira.jpg'))
        sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', os.path.join(web, 'video.mp4'), '-filter_complex', 'showwavespic=s=3000x56:colors=#7ce3e8', '-frames:v', '1', os.path.join(web, 'onda.png'))
        ligero = os.path.join(web, 'final.mp4')
        sh('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', final, '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-maxrate', '12M', '-bufsize', '24M',
           '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', ligero)
        tipos = {'.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png', '.webm': 'video/webm', '.json': 'application/json'}
        subir = [(os.path.join(web, f), f) for f in ('video.mp4', 'tira.jpg', 'onda.png', 'final.mp4')] + [(portada, 'portada.jpg'),
                 (os.path.join(carpeta, 'edl.json'), 'edl.json'), (os.path.join(carpeta, 'decisiones.json'), 'decisiones.json')]
        for r, _, fs in os.walk(os.path.join(corte, 'publico')):
            subir += [(os.path.join(r, f), os.path.relpath(os.path.join(r, f), os.path.join(corte, 'publico'))) for f in fs]
        for local, nombre in subir: s3_subir(local, f'{base}/{nombre}', tipos.get(os.path.splitext(nombre)[1], 'application/octet-stream'))
        # La EDL apunta a p/<entrega>/… como las del agente; editor.base dice dónde están de verdad
        clave_vieja = edl['video'].split('/')[1]
        edl_sala = json.loads(json.dumps(edl).replace(f'p/{clave_vieja}/', f'p/{entrega}/'))
        url_base = (ENV.get('S3_PUBLICO', '').rstrip('/') + f'/{base}/') if ENV.get('S3_PUBLICO') else f'r2:{base}/'
        h = hashlib.sha256(open(ligero, 'rb').read()).hexdigest()
        datos = {'titulo': titulo, 'version': 'v1', 'duracion': f'{round(edl["duracion"])} s · vertical', 'editado_por': IDENTIDAD, 'estilo': ESTILO,
                 'nota': ('Editado por el Claude de Luis. ' + (dec.get('notas') or ''))[:900], 'archivo': 'final.mp4',
                 'final': f'p/{entrega}/final.mp4', 'portada': f'p/{entrega}/portada.jpg', 'decisiones': f'p/{entrega}/decisiones.json',
                 'editor': {'base': url_base, 'sfx': [], 'img': []}, 'proyecto': b['id'],
                 **({'url': url_base + 'final.mp4'} if url_base.startswith('http') else {})}   # «Descargar» en la tarjeta (Claude 1, issue #2)
        c.execute("INSERT INTO edicion.items (id, tipo, estado, datos, autor) VALUES (%s, 'entrega', 'esperando', %s, 'editor')", (entrega, Jsonb(datos)))
        c.execute("""INSERT INTO edicion.versiones (id, entrega, numero, edl, nota, origen, estado, autor, archivo, huella)
                     VALUES (%s, %s, 1, %s, %s, 'editor', 'renderizado', 'editor', %s, %s)""",
                  (uid(), entrega, Jsonb(edl_sala), 'Primera versión (Claude de Luis)', 'final.mp4', h))
        c.execute("UPDATE edicion.items SET estado='entregado', respuesta=%s, updated_at=now() WHERE id=%s",
                  (f'Listo: está en Entregas → «{titulo}». ' + '; '.join((dec.get('dudas') or [])[:2]), b['id']))
        log('entregado en la Sala', entrega)
    except SinClaude as e:
        log('Claude sin cupo o sin sesión, el bruto vuelve a la cola y pauso 30 min:', str(e)[:150])
        open(PAUSA, 'w').write(str(int(time.time()) + 1800))
        c.execute("UPDATE edicion.items SET estado='en cola', datos = datos - 'auto', respuesta=NULL, updated_at=now() WHERE id=%s", (b['id'],))
        return False
    except Saltar as e:
        c.execute("UPDATE edicion.items SET estado='en cola', datos = datos || '{\"auto\":\"luis-no\"}', respuesta=%s, updated_at=now() WHERE id=%s", (str(e), b['id']))
        log('saltado:', e)
    except Exception as e:
        log('falló:', repr(e)[:300])
        c.execute("""UPDATE edicion.items SET estado='en cola', datos = datos || '{"auto":"luis-error"}', updated_at=now(),
                     respuesta='El montaje en el Mac de Luis ha fallado; lo revisa Luis.' WHERE id=%s""", (b['id'],))
    return True


def renders_pedidos(c):
    """Amin retoca una entrega mía en la Sala y pide render: versión 'pedido' → 'renderizando' → 'renderizado'.
    Los archivos (montaje 4K, persona, imágenes) están en TRABAJO/sala/<entrega> de este Mac."""
    v = c.execute("""SELECT v.id, v.entrega, v.numero, v.edl FROM edicion.versiones v JOIN edicion.items i ON i.id = v.entrega
                       WHERE v.estado='pedido' AND i.datos->>'editado_por' = %s ORDER BY v.created_at LIMIT 1 FOR UPDATE OF v SKIP LOCKED""",
                  (IDENTIDAD,)).fetchone()
    if not v: return False
    carpeta = os.path.join(TRABAJO, 'sala', v['entrega']); corte = os.path.join(carpeta, 'corte')
    if not os.path.exists(os.path.join(corte, 'montaje.mp4')):
        log('pedido sin carpeta de trabajo:', v['entrega']); c.execute("UPDATE edicion.versiones SET estado='borrador' WHERE id=%s", (v['id'],)); return True
    c.execute("UPDATE edicion.versiones SET estado='renderizando' WHERE id=%s", (v['id'],))
    try:
        salida = os.path.join(carpeta, f'final-v{v["numero"]}.mp4')
        render(v['edl'], os.path.join(corte, 'montaje.mp4'), v['entrega'], salida)
        s3_subir(salida, f'sala/{v["entrega"]}/final-v{v["numero"]}.mp4')
        h = hashlib.sha256(open(salida, 'rb').read()).hexdigest()
        c.execute("UPDATE edicion.versiones SET estado='renderizado', archivo=%s, huella=%s WHERE id=%s", (f'final-v{v["numero"]}.mp4', h, v['id']))
        log('render pedido listo', v['entrega'], v['numero'])
    except Exception as e:
        log('render pedido falló:', repr(e)[:200]); c.execute("UPDATE edicion.versiones SET estado='borrador' WHERE id=%s", (v['id'],))
    return True


# ─────────────── Arranque ───────────────

def principal():
    ap = argparse.ArgumentParser()
    ap.add_argument('--local'); ap.add_argument('--salida'); ap.add_argument('--titulo', default='Vídeo')
    ap.add_argument('--guion', default=''); ap.add_argument('--notas', default=''); ap.add_argument('--quien', default='alumno')
    ap.add_argument('--usuario', default='tucuenta'); ap.add_argument('--reusar-plan', action='store_true')
    ap.add_argument('--estilo', default='clave', choices=list(ESTILOS)); ap.add_argument('--cliente')
    a = ap.parse_args()
    global REUSAR_PLAN, ESTILO; REUSAR_PLAN = a.reusar_plan; ESTILO = a.estilo
    if a.local:
        # Que el Mac no se duerma a mitad de un render (la noche del 31-10 un render de prueba se quedó parado 3 h)
        subprocess.Popen(['caffeinate', '-dimsu', '-w', str(os.getpid())], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        guion = open(a.guion).read() if a.guion and os.path.exists(a.guion) else a.guion
        editar(a.local, os.path.abspath(a.salida or os.path.join(TRABAJO, 'pruebas', seguro(a.titulo))), a.titulo, guion, a.notas, a.quien, a.usuario, a.cliente)
        return
    os.makedirs(TRABAJO, exist_ok=True)
    candado = open(os.path.join(TRABAJO, '.trabajador.lock'), 'w')
    try: fcntl.flock(candado, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError: return   # ya hay uno trabajando
    if not ENV.get('DATABASE_URL'): log('sin DATABASE_URL en', CONF); return
    try:
        if time.time() < float(open(PAUSA).read()): return   # Claude sin cupo: se espera sin ensuciar el log
    except (OSError, ValueError): pass
    import psycopg
    from psycopg.rows import dict_row
    subprocess.Popen(['caffeinate', '-i', '-w', str(os.getpid())], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    with psycopg.connect(ENV['DATABASE_URL'], autocommit=True, row_factory=dict_row) as c:
        if 'sala' in ENV.get('COLAS', []):
            while renders_pedidos(c): pass   # primero lo que Amin ya retocó y pidió
            while sala(c): pass              # fase 1 (31-10): solo la Sala
        if 'alumnos' in ENV.get('COLAS', []):
            while alumnos(c): pass   # Trainer10x: solo cuando Amin lo diga


if __name__ == '__main__':
    principal()
