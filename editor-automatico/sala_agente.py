"""El agente de la Sala de edición en el Mac (launchd: com.amin.sala-agente, cada 60 s).

Hace solo lo que la web no puede:
1. RENDER: las versiones que Amin marca «Pedir render final» (estado `pedido`) se renderizan en
   calidad final con el motor Remotion, sobre el montaje en 4K, y quedan en Escritorio/2 · Contenido/Edición/05 Entregas.
2. PRIMER MONTAJE: cada bruto «en cola» con enlace de Drive se baja, se transcribe, la IA elige las
   tomas buenas y las palabras clave, se hace el jump cut y se publica como entrega nueva con su editor.
3. CLIPS: si el bruto es «Clips de un vídeo largo» (YouTube o Drive), la IA saca los mejores trozos de
   ~30 s (gancho fuerte, valor, conversión), se recortan a vertical sobre la cara y salen ya renderizados.

Uso manual: uv run --python 3.12 --with mlx-whisper --with "psycopg[binary]" python sala_agente.py
Interruptores «Luis edita»: `touch LUIS-EDITA-REELS` en esta carpeta apaga 2 y `touch LUIS-EDITA-CLIPS` apaga 3 en este
Mac para que los haga el trabajador de Luis; `rm` los vuelve a encender. El 1 sigue aquí, salvo las entregas de Luis.
Los vídeos de alumnos (4) NO tienen interruptor: no se tocan sin permiso expreso de Amin (31-10).
"""
import os, sys, re, json, hashlib, glob, shutil, fcntl, subprocess, unicodedata, urllib.request, urllib.error, http.client, time, random, string
import psycopg
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb

AQUI = os.path.dirname(os.path.abspath(__file__))
CANDADO = open(os.path.join(AQUI, '.sala-agente.lock'), 'w')
try: fcntl.flock(CANDADO, fcntl.LOCK_EX | fcntl.LOCK_NB)
except BlockingIOError: sys.exit(0)  # ya hay otro trabajando (un render tarda varios minutos)

HERR = os.path.dirname(AQUI)
ENV = json.load(open(os.path.join(HERR, 'env-sala.json')))
APP = os.path.expanduser('~/sala-edicion')
MOTOR = os.path.join(AQUI, 'motor')
ENTREGAS = os.path.expanduser('~/Desktop/2 · Contenido/Edición/05 Entregas')
TMP = os.path.join(AQUI, 'sala-tmp')
LIB = json.load(open(os.path.join(APP, 'src/lib/libreria.json')))


class BD:
    """Conexión que se rehace sola: Neon corta las que pasan minutos paradas (bajar y transcribir tarda)."""
    def __init__(self): self.c = None
    def execute(self, q, p=None):
        for intento in range(3):
            try:
                if self.c is None or self.c.closed:
                    self.c = psycopg.connect(ENV['DATABASE_URL'], autocommit=True, row_factory=dict_row)
                return self.c.execute(q, p)
            except psycopg.OperationalError:
                self.c = None
                if intento == 2: raise
                time.sleep(3)


def log(*a): print(time.strftime('%d-%m %H:%M:%S'), *a, flush=True)
def avisar(titulo, texto):
    q = lambda t: json.dumps(t, ensure_ascii=False)
    subprocess.run(['osascript', '-e', f'display notification {q(texto)} with title {q(titulo)} sound name "Glass"'])
def sh(*a, **kw): return subprocess.run(a, check=True, **kw)
def uid(): return format(int(time.time() * 1000), 'x') + ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')[:40] or 'video'
def seguro(s): return re.sub(r'[/:\\]', '-', s).strip()


# ─────────────── 1. Render final ───────────────

def enlazar(src, dst):
    """Enlace duro (no ocupa espacio). Remotion copia la carpeta pública y se salta los enlaces simbólicos."""
    if os.path.isdir(src):
        os.makedirs(dst, exist_ok=True)
        for f in os.listdir(src): enlazar(os.path.join(src, f), os.path.join(dst, f))
    else:
        try: os.link(src, dst)
        except OSError: shutil.copy2(src, dst)


def publico_para_render(entrega, trabajo, video4k):
    """Carpeta pública para Remotion: lo del editor (ligero) salvo el vídeo, que va en 4K."""
    pub = os.path.join(TMP, f'render-{entrega}')
    shutil.rmtree(pub, ignore_errors=True)
    base = os.path.join(pub, 'p', entrega); os.makedirs(base)
    origen = os.path.join(APP, 'public', 'p', entrega)
    for f in os.listdir(origen):
        enlazar(os.path.join(trabajo, video4k) if f == 'video.mp4' else os.path.join(origen, f), os.path.join(base, f))
    # De la biblioteca, solo lo que usa esta versión.
    return pub


def remotion(cmd, limite):
    """Lanza un render de Remotion vigilado. Si el navegador interno se cae («Session closed») Remotion no termina nunca:
    se queda escupiendo el mismo error en bucle. Aquí se mata en cuanto pasa eso o se pasa del tiempo, y el que llama reintenta."""
    salida = os.path.join(TMP, f'remotion-{os.getpid()}.log')
    with open(salida, 'w') as f:
        p = subprocess.Popen(cmd, cwd=MOTOR, stdout=f, stderr=subprocess.STDOUT, start_new_session=True)
    t0, motivo = time.time(), ''
    while p.poll() is None:
        time.sleep(5)
        if time.time() - t0 > limite: motivo = f'tardó más de {limite // 60} min'
        elif os.path.getsize(salida) > 200000:
            with open(salida, errors='ignore') as f: texto = f.read()
            if texto.count('Session closed') > 5 or texto.count('Target closed') > 5: motivo = 'el navegador del render se cayó'
        if motivo:
            try: os.killpg(p.pid, 15); p.wait(20)
            except Exception: os.killpg(p.pid, 9); p.wait()
            break
    with open(salida, errors='ignore') as f: lineas = [l for l in f.read().splitlines() if l.strip() and not l.startswith('    at ')]
    os.remove(salida)
    if motivo or p.returncode:
        log('render cortado:', motivo or f'código {p.returncode}', '|', ' / '.join(dict.fromkeys(lineas[-6:]))[:400])
        raise subprocess.CalledProcessError(p.returncode or 1, cmd[:4])


PICO_MAX = -1.5  # dBTP en el MP4 final; el mismo objetivo que sistema/voz.py y sistema/qc.py (30-10-2026)


def medir_pico(archivo):
    e = subprocess.run(['ffmpeg', '-hide_banner', '-nostdin', '-i', archivo, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    m = re.search(r'Peak:\s+(-?[\d.]+) dBFS', e[e.rfind('Summary:'):])
    return float(m.group(1)) if m else None


def normalizar(entrada, salida):
    """Sonoridad a -14 LUFS con loudnorm de DOS pasadas (la primera mide, la segunda aplica en lineal) y AAC 256k.
    Antes era una pasada con TP=-1.0 y el AAC dejaba picos de -0,7. Se mide el pico real en el MP4 ya codificado;
    si pasa de -1,5 dBTP se repite con más margen."""
    for tp in (-1.5, -2.0, -2.5):
        e = subprocess.run(['ffmpeg', '-hide_banner', '-nostdin', '-i', entrada, '-vn', '-af', f'loudnorm=I=-14:TP={tp}:LRA=9:print_format=json',
                            '-f', 'null', '-'], capture_output=True, text=True).stderr
        j = json.loads(e[e.rfind('{'):e.rfind('}') + 1])
        f2 = (f'loudnorm=I=-14:TP={tp}:LRA=9:measured_I={j["input_i"]}:measured_TP={j["input_tp"]}:measured_LRA={j["input_lra"]}:'
              f'measured_thresh={j["input_thresh"]}:offset={j["target_offset"]}:linear=true')
        sh('ffmpeg', '-v', 'error', '-y', '-i', entrada, '-c:v', 'copy', '-af', f2, '-ar', '48000', '-c:a', 'aac', '-b:a', '256k', salida)
        pico = medir_pico(salida)
        if pico is not None and pico <= PICO_MAX: return pico
        log('pico', pico, 'dBTP tras normalizar con TP', tp, '→ repito con más margen')
    return pico


def control_calidad(archivo, entrega=None, numero=None):
    """Huella SHA-256 del MP4 + informe qc-v1 (sistema/informe_qc.py). Si algo falla, el QC queda vacío
    y la Sala lo pinta en gris «Sin analizar»: nunca se inventa un verde."""
    h = hashlib.sha256()
    with open(archivo, 'rb') as f:
        for trozo in iter(lambda: f.read(1 << 20), b''): h.update(trozo)
    cmd = ['uv', 'run', '-q', '--with', 'numpy', 'python', '-I', os.path.join(AQUI, 'sistema', 'informe_qc.py'), archivo]
    if entrega: cmd += ['--entrega', str(entrega)]
    if numero: cmd += ['--numero', str(numero)]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        informe = json.loads(r.stdout) if r.returncode == 0 else None
        if informe is None: log('QC falló:', r.stderr[-300:])
    except Exception as e:
        log('QC falló:', repr(e)[:300]); informe = None
    return h.hexdigest(), informe


def render_edl(entrega, trabajo, video4k, edl, nombre, clave, pub=None, destino=ENTREGAS):
    """Renderiza una edl con Remotion sobre el vídeo bueno y la deja en 05 Entregas (audio a −14 LUFS)."""
    pub = pub or publico_para_render(entrega, trabajo, video4k)
    usados = {s['src'] for s in edl.get('sfx', [])} | {(edl.get('musica') or {}).get('src', '')} | {x.get('src', '') for x in edl.get('fx') or []}
    for u in usados:
        if u.startswith('lib/'): os.makedirs(os.path.dirname(os.path.join(pub, u)), exist_ok=True); enlazar(os.path.join(APP, 'public', u), os.path.join(pub, u))
    enlazar(os.path.join(APP, 'public', 'fuentes'), os.path.join(pub, 'fuentes'))  # las fuentes pro del pack
    props = os.path.join(TMP, f'edl-{clave}.json'); json.dump(edl, open(props, 'w'), ensure_ascii=False)
    bruto = os.path.join(TMP, f'render-{clave}.mp4')
    try:
        limite = max(900, int(float(edl.get('duracion') or 60) * 40))  # un clip de 60 s tarda ~5 min; 40 s por segundo es que se colgó
        for intento, (conc, espera, cache) in enumerate([(3, 120000, 2000), (1, 300000, 1000), (1, 300000, 600)]):  # si falla, otra vez más despacio y con menos memoria
            try:
                remotion(['npx', 'remotion', 'render', 'src/index.ts', 'Reel', bruto, f'--props={props}', f'--public-dir={pub}', '--codec=h264', '--crf=16',
                          f'--concurrency={conc}', f'--offthreadvideo-cache-size-in-bytes={cache * 1000000}', f'--timeout={espera}', '--log=error'], limite)
                break
            except subprocess.CalledProcessError:
                if intento == 2: raise
                log('render falló, reintento más despacio'); time.sleep(20)
        normalizar(bruto, os.path.join(destino, nombre))
    finally:
        for f in (props, bruto): os.path.exists(f) and os.remove(f)
        shutil.rmtree(pub, ignore_errors=True)
    return os.path.join(destino, nombre)


def renderizar(c, v):
    d = v['datos']
    trabajo, video4k = d.get('trabajo'), d.get('video4k')
    if not trabajo or not os.path.exists(os.path.join(trabajo, video4k or '')):
        log('sin carpeta de trabajo para', v['entrega']); c.execute("UPDATE edicion.versiones SET estado='borrador' WHERE id=%s", (v['id'],))
        avisar('Sala de edición', f'No encuentro el montaje de «{d["titulo"]}» en el Mac'); return
    c.execute("UPDATE edicion.versiones SET estado='renderizando' WHERE id=%s", (v['id'],))
    log('render', v['entrega'], 'versión', v['numero'])
    nombre = f'{seguro(d["titulo"])} - versión {v["numero"]}.mp4'
    try:
        render_edl(v['entrega'], trabajo, video4k, v['edl'], nombre, v['id'])
    except subprocess.CalledProcessError as e:
        log('render falló', e); c.execute("UPDATE edicion.versiones SET estado='borrador' WHERE id=%s", (v['id'],))
        avisar('Sala de edición', f'El render de «{d["titulo"]}» falló: lo miro a mano'); return
    huella, qc = control_calidad(os.path.join(ENTREGAS, nombre), v['entrega'], v['numero'])
    c.execute("UPDATE edicion.versiones SET estado='renderizado', archivo=%s, huella=%s, qc=%s WHERE id=%s",
              (nombre, huella, Jsonb(qc) if qc else None, v['id']))
    log('listo', nombre, 'QC', (qc or {}).get('veredicto_qc_py', 'sin analizar')); avisar('Vídeo renderizado', f'{nombre} ya está en Edición/05 Entregas')


# ─────────────── 2. Primer montaje de un bruto ───────────────

class Saltar(Exception):
    """El bruto no se puede montar solo: se deja en cola con una respuesta para Amin."""


def bajar(url, carpeta):
    os.makedirs(carpeta, exist_ok=True)
    m = re.search(r'/folders/([\w-]+)', url)
    if re.search(r'(youtube\.com|youtu\.be)/', url):
        if not glob.glob(os.path.join(carpeta, 'bruto.mp4')):
            r = subprocess.run(['uvx', 'yt-dlp', '-q', '--no-warnings', '--no-playlist', '--js-runtimes', 'node',
                                '-f', 'bv*[height<=1440]+ba/b[height<=1440]/b', '--merge-output-format', 'mp4',
                                '-o', os.path.join(carpeta, 'bruto.%(ext)s'), url], capture_output=True, text=True)
            if r.returncode: log('yt-dlp', r.stderr[-400:]); raise Saltar('No he podido bajar el vídeo de YouTube: revisa que sea público o «no listado».')
    elif m:
        sh(sys.executable, os.path.join(AQUI, 'bajar_drive.py'), m[1], carpeta)
    else:
        m = re.search(r'/file/d/([\w-]+)|[?&]id=([\w-]+)', url)
        if not m: raise Saltar('El enlace no es de un archivo o carpeta de Google Drive.')
        fid = m[1] or m[2]
        if not os.path.exists(os.path.join(carpeta, 'bruto.mov')) or os.path.getsize(os.path.join(carpeta, 'bruto.mov')) < 1_000_000:
          sh('curl', '-sL', '-o', os.path.join(carpeta, 'bruto.mov'), f'https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t')
    videos = [f for f in glob.glob(os.path.join(carpeta, '**', '*'), recursive=True) if re.search(r'\.(mov|mp4|m4v)$', f, re.I)]
    videos = [f for f in videos if os.path.getsize(f) > 1_000_000]
    if not videos: raise Saltar('No he podido bajar el vídeo: revisa que el enlace de Drive esté compartido con «cualquiera con el enlace».')
    return max(videos, key=os.path.getsize)


def medidas(video):
    """Ancho y alto como se ve (los MOV del iPhone guardan el giro aparte). Solo hay ffmpeg, sin ffprobe."""
    info = subprocess.run(['ffmpeg', '-hide_banner', '-i', video], capture_output=True, text=True).stderr
    m = re.search(r'Video:.*?(\d{3,5})x(\d{3,5})', info)
    if not m: raise Saltar('No reconozco el vídeo que he bajado.')
    w, h = int(m[1]), int(m[2])
    rot = re.search(r'rotation of (-?[\d.]+)', info)
    return (h, w) if rot and abs(round(float(rot[1]))) in (90, 270) else (w, h)


def pedir_ia(segs, titulo, instrucciones, guion='', quien='Amin'):
    """La IA elige las tomas buenas (quita repeticiones y fallos), las palabras clave y la música."""
    lista = '\n'.join(f'{i}: [{s["start"]:.1f}-{s["end"]:.1f}] {s["text"].strip()}' for i, s in enumerate(segs))
    musica = '\n'.join(f'{m["src"]} = {m["nombre"]}' for m in LIB['musica'])
    guion = f"\nEl guion que tenía que grabar (úsalo para saber qué tomas valen y en qué orden van; si dice algo distinto, manda lo grabado):\n{guion}\n" if guion else ''
    texto = f"""Eres el editor de vídeo de {quien}. Este es el bruto de un reel vertical titulado «{titulo}». Instrucciones: {instrucciones or 'ninguna'}.
{guion}
Transcripción por tramos (índice: [inicio-fin] texto):
{lista}

Música disponible (src = nombre):
{musica}

Devuelve SOLO un JSON, sin nada más, con:
- "mantener": índices de los tramos que van al vídeo, en orden. Si una frase está repetida (tomas), quédate con la ÚLTIMA buena; quita fallos, muletillas sueltas y lo que no aporte. El vídeo debe arrancar con el gancho, sin presentaciones.
- "claves": de 4 a 10 palabras clave (una palabra, en minúsculas, tal y como aparece) → color: "#F5C542" (dorado) para lo positivo o de dinero, "#E5322D" (rojo) para lo negativo, "#FFFFFF" para el resto.
- "zoom": índices (de los que mantienes) donde hay que meter zoom fuerte: la moraleja o las frases más potentes.
- "musica": el src de la canción que mejor encaje con el tono.
- "resumen": una frase para el editor de qué has quitado o elegido."""
    cuerpo = {'model': 'claude-sonnet-5-5', 'max_tokens': 2000, 'messages': [{'role': 'user', 'content': texto}]}
    req = urllib.request.Request('https://api.anthropic.com/v1/messages', data=json.dumps(cuerpo).encode(), method='POST',
                                 headers={'x-api-key': ENV['ANTHROPIC_API_KEY'], 'anthropic-version': '2023-06-01', 'content-type': 'application/json'})
    try:
        r = json.loads(urllib.request.urlopen(req, timeout=120).read())
        t = ''.join(c.get('text', '') for c in r['content'])
        j = json.loads(re.search(r'\{.*\}', t, re.S)[0])
        j['mantener'] = [int(i) for i in j.get('mantener', []) if 0 <= int(i) < len(segs)]
        if not j['mantener']: raise ValueError('sin tramos')
        return j
    except Exception as e:
        log('IA no disponible, monto todo:', e)
        return {'mantener': list(range(len(segs))), 'claves': {}, 'zoom': [], 'musica': None, 'resumen': 'He dejado todas las tomas.'}


def construir_edl(pj, ia, entrega, usuario='aminbusinesss'):
    P, dur = pj['palabras'], pj['duracion']
    limpia = lambda w: re.sub(r'[.,;:!?¡¿"]', '', w).lower()
    claves = ia.get('claves') or {}
    if isinstance(claves, list):  # a veces la IA las da en lista: [{"palabra", "color"}], [palabra, color] o solo la palabra
        claves = dict((x.get('palabra') or x.get('word') or '', x.get('color') or '#FFFFFF') if isinstance(x, dict)
                      else (x[0], x[1]) if isinstance(x, (list, tuple)) and len(x) > 1 else (str(x), '#FFFFFF') for x in claves)
    claves = {limpia(k): v for k, v in claves.items() if k and re.fullmatch(r'#[0-9A-Fa-f]{6}', str(v))}
    # Un cambio de plano cada frase: zoom suave alterno y zoom fuerte en lo que marcó la IA.
    zooms, fuerte, n = [{'s': 0, 'escala': 1.0}], set(ia.get('zoom') or []), 0
    for k in ia['mantener'][1:]:
        w = next((p for p in P if p['seg'] == k), None)
        if not w: continue
        n += 1
        zooms.append({'s': round(w['s'], 2), 'escala': (1.5 if n % 2 else 1.8) if k in fuerte else (1.0 if n % 2 == 0 else 1.2)})
    por_cat = lambda cat: [s['src'] for s in LIB['sfx'] if s['cat'] == cat]
    golpes, whoosh = por_cat('Golpes y bajos') or [LIB['sfx'][0]['src']], por_cat('Whoosh') or [LIB['sfx'][0]['src']]
    sfx = [{'src': whoosh[0], 't': 0.0, 'vol': 0.3}]
    vistas = set()
    for i, p in enumerate(P):
        k = limpia(p['w'])
        if k in claves and k not in vistas and len(sfx) < 14:
            vistas.add(k); sfx.append({'src': golpes[len(sfx) % len(golpes)], 't': round(max(0, p['s'] - 0.05), 2), 'vol': 0.4})
    for z in zooms[1:]:
        if z['escala'] >= 1.5: sfx.append({'src': whoosh[len(sfx) % len(whoosh)], 't': round(max(0, z['s'] - 0.15), 2), 'vol': 0.3})
    seguir = next((p for p in P if re.search(r's[ií]gueme|seguirme|s[ií]guenos|seguidor', p['w'], re.I)), None)
    musica = ia.get('musica') if ia.get('musica') in {m['src'] for m in LIB['musica']} else LIB['musica'][0]['src']
    return {
        'fps': 30, 'duracion': round(dur + 0.6, 2), 'video': f'p/{entrega}/video.mp4', 'cara': {'x': 540, 'y': 800},
        'palabras': [{'w': p['w'], 's': p['s'], 'e': p['e']} for p in P], 'claves': claves,
        'comparaciones': [], 'zooms': zooms, 'bn': [], 'broll': [], 'sfx': sorted(sfx, key=lambda s: s['t']),
        'musica': {'src': musica, 'vol': 0.13},
        'cta': {'t': round(seguir['s'] - 0.05, 2) if seguir else round(max(0, dur - 2.5), 2), 'usuario': usuario},
        'colorPobre': '#E5322D', 'colorRico': '#F5C542',
        'estilo': {'subTam': 76, 'claveTam': 190, 'subY': 1010, 'subFuente': 'serif', 'subColor': '#FFFFFF'},
    }


def tira_y_onda(pub, dur):
    """Miniaturas (1 por segundo) y onda del audio para la línea de tiempo tipo CapCut."""
    v = os.path.join(pub, 'video.mp4'); n = max(1, int(dur + 0.999))
    sh('ffmpeg', '-v', 'error', '-y', '-i', v, '-vf', f'fps=1,scale=-1:64,tile={n}x1', '-frames:v', '1', '-q:v', '5', os.path.join(pub, 'tira.jpg'))
    sh('ffmpeg', '-v', 'error', '-y', '-i', v, '-filter_complex', 'showwavespic=s=3000x56:colors=#7ce3e8', '-frames:v', '1', os.path.join(pub, 'onda.png'))


def a_la_web(entrega, video, edl):
    """Lo ligero para el editor web: vídeo a 720p, miniaturas y onda."""
    pub = os.path.join(APP, 'public', 'p', entrega); os.makedirs(pub, exist_ok=True)
    sh('ffmpeg', '-v', 'error', '-y', '-i', video, '-vf', 'scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2',
       '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', os.path.join(pub, 'video.mp4'))
    tira_y_onda(pub, edl['duracion'])


def publicar(mensaje):
    """Guarda en git, sube a GitHub y publica la web (el editor necesita los vídeos nuevos)."""
    subprocess.run(['git', 'add', '-A', 'public/p'], cwd=APP, check=True)
    subprocess.run(['git', '-c', 'user.name=Amin', '-c', 'user.email=elmeslek1@gmail.com', 'commit', '-qm', mensaje], cwd=APP)
    subprocess.run(['git', 'push', '-q'], cwd=APP)  # copia en GitHub; si falla la red, no frena el montaje
    r = subprocess.run([sys.executable, os.path.join(HERR, 'deploy_next.py'), APP, 'sala-edicion', os.path.join(HERR, 'env-sala.json')],
                       capture_output=True, text=True)
    if 'READY' not in r.stdout: raise RuntimeError('no se pudo publicar: ' + r.stdout[-300:] + r.stderr[-300:])


def alta_entrega(c, entrega, datos, edl, nota, estado):
    c.execute("""INSERT INTO edicion.items (id, tipo, estado, datos, autor) VALUES (%s, 'entrega', 'esperando', %s, 'editor')
                 ON CONFLICT (id) DO UPDATE SET datos = EXCLUDED.datos""",
              (entrega, Jsonb({**datos, 'editor': {'base': f'p/{entrega}/', 'sfx': [], 'img': []}})))
    c.execute("DELETE FROM edicion.versiones WHERE entrega=%s", (entrega,))
    c.execute("""INSERT INTO edicion.versiones (id, entrega, numero, edl, nota, origen, estado, autor)
                 VALUES (%s, %s, 1, %s, %s, 'editor', %s, 'editor')""", (uid(), entrega, Jsonb(edl), nota, estado))


def montar_bruto(c, b):
    d = b['datos']; titulo = d.get('titulo') or 'Vídeo'
    entrega = f'{slug(titulo)}-{b["id"][-4:]}'
    trabajo = os.path.join(ENTREGAS, f'{seguro(titulo)}-trabajo')
    log('montaje', titulo)
    src = bajar(d['url'], os.path.join(trabajo, 'bruto'))
    w, h = medidas(src)
    if w > h: raise Saltar('Por ahora el montaje automático es solo para vídeos verticales; este horizontal lo edito yo a mano.')
    tj = os.path.join(trabajo, 'transcripcion.json')
    if not os.path.exists(tj): sh(sys.executable, os.path.join(AQUI, 'transcribir.py'), src, tj)
    if not any(s.get('words') for s in json.load(open(tj))['segments']): raise Saltar('No he oído voz en el vídeo.')
    tj = frases_de(tj, os.path.join(trabajo, 'frases.json'))
    segs = json.load(open(tj))['segments']
    ia = pedir_ia(segs, titulo, d.get('instrucciones', ''))
    ia['mantener'] = [k for k in ia['mantener'] if segs[k].get('words')]
    sh(sys.executable, os.path.join(AQUI, 'montar.py'), src, tj, trabajo, ','.join(map(str, ia['mantener'])),
       env={**os.environ, 'BITRATE': '45M' if max(w, h) >= 3000 else '16M'})
    pj = json.load(open(os.path.join(trabajo, 'palabras.json')))
    edl = construir_edl(pj, ia, entrega)
    json.dump(edl, open(os.path.join(trabajo, 'edl.json'), 'w'), ensure_ascii=False, indent=1)
    a_la_web(entrega, os.path.join(trabajo, 'montaje.mp4'), edl)
    publicar(f'Primer montaje automático: {titulo}')
    alta_entrega(c, entrega, {'titulo': titulo, 'version': 'v1', 'duracion': f'{round(edl["duracion"])} s · vertical',
                              'nota': f'Primer montaje automático. {ia.get("resumen", "")}'.strip(), 'trabajo': trabajo, 'video4k': 'montaje.mp4'},
                 edl, 'Primer montaje automático', 'borrador')
    c.execute("UPDATE edicion.items SET estado='entregado', respuesta=%s, updated_at=now() WHERE id=%s",
              (f'Primer montaje listo: está en Entregas → «{titulo}». Ábrelo en el editor para retocarlo. {ia.get("resumen", "")}'.strip(), b['id']))
    log('montaje listo', entrega); avisar('Primer montaje listo', f'«{titulo}» ya está en la Sala para retocarlo')


# ─────────────── 3. Clips de un vídeo largo ───────────────
# Ingeniería inversa de Opus Clip / Vizard / Submagic: transcribir → la IA elige y puntúa (0-99) →
# jump cut sin silencios ni muletillas → reencuadre 9:16 siguiendo a quien habla → titular del gancho,
# subtítulos con palabras clave, zooms, efectos, música y «Seguir» → render y descarga en la Sala.

DURACIONES = {'corto': (15, 30), 'medio': (30, 60), 'largo': (60, 90), 'auto': (25, 60)}
PESOS = {'gancho': 0.30, 'valor': 0.25, 'conversion': 0.20, 'fluidez': 0.15, 'tendencia': 0.10}


def claude(contenido, max_tokens=4000, timeout=240):
    cuerpo = {'model': 'claude-sonnet-5-5', 'max_tokens': max_tokens, 'messages': [{'role': 'user', 'content': contenido}]}
    req = urllib.request.Request('https://api.anthropic.com/v1/messages', data=json.dumps(cuerpo).encode(), method='POST',
                                 headers={'x-api-key': ENV['ANTHROPIC_API_KEY'], 'anthropic-version': '2023-06-01', 'content-type': 'application/json'})
    for intento in range(4):  # la red o la API a veces cortan: reintentar con espera creciente
        try:
            r = json.loads(urllib.request.urlopen(req, timeout=timeout).read())
            break
        except (urllib.error.URLError, ConnectionError, TimeoutError, http.client.HTTPException) as e:
            codigo = getattr(e, 'code', 0)
            if intento == 3 or codigo in (400, 401, 403): raise
            log('la IA no contestó, reintento:', repr(e)[:120]); time.sleep(10 * (intento + 1))
    t = ''.join(c.get('text', '') for c in r['content'])
    return json.loads(re.search(r'\{.*\}', t, re.S)[0])


TIPO_ENTRENO = {'instruccion': 'Instrucción', 'bueno': 'Ejemplo de lo que SÍ quiero', 'malo': 'Ejemplo de lo que NO quiero', 'correccion': 'Corrección de un fallo'}


def aprendido(c):
    """Lo que Amin ha enseñado en la Sala de entrenamiento (para clips o para todo) y cómo les fue a los clips publicados."""
    try: return _aprendido(c)
    except Exception as e: log('sin entrenamiento:', e); return ''


def _aprendido(c):
    notas = c.execute("""SELECT tipo, texto, url FROM edicion.entreno WHERE activa AND para IN ('clips', 'todo') ORDER BY created_at DESC LIMIT 60""").fetchall()
    res = c.execute("""SELECT datos FROM edicion.items WHERE tipo = 'entrega' AND datos ? 'resultado' AND coalesce(datos->>'gancho', '') <> ''
                       ORDER BY coalesce((datos->'resultado'->>'seguidores')::bigint, 0) * 50 + coalesce((datos->'resultado'->>'visitas')::bigint, 0) DESC""").fetchall()
    t = ''
    if notas:
        t += '\nLO QUE AMIN TE HA ENSEÑADO (Sala de entrenamiento). Manda sobre cualquier otra regla:\n' + '\n'.join(
            f'- [{TIPO_ENTRENO.get(n["tipo"], n["tipo"])}] {n["texto"]}' + (f' ({n["url"]})' if n['url'] else '') for n in notas) + '\n'
    if res:
        fila = lambda d: f'- «{d["gancho"]}» → {d["resultado"].get("visitas", 0)} visitas, +{d["resultado"].get("seguidores", 0)} seguidores' + (' (funcionó)' if d['resultado'].get('bien') is True else ' (no funcionó)' if d['resultado'].get('bien') is False else '') + f' · tu nota fue {d.get("puntuacion", "?")}'
        mejores, peores = [r['datos'] for r in res[:5]], [r['datos'] for r in res[-3:]] if len(res) > 5 else []
        t += '\nRESULTADOS REALES de clips anteriores (aprende qué funciona en esta cuenta y ajusta tus notas; Víctor: los SEGUIDORES nuevos pesan más que las visitas):\n' + '\n'.join(map(fila, mejores + peores)) + '\n'
    return t


def frases_de(tj, destino):
    """Transcripción → frases completas (frases.py). Los tramos largos sin puntuación los parte la IA por el sentido."""
    if os.path.exists(destino) and os.path.getmtime(destino) >= os.path.getmtime(tj): return destino
    sys.path.insert(0, AQUI)
    import frases as F
    out = []
    for f in F.frases(json.load(open(tj))['segments']):
        ws = f['words']
        if f['end'] - f['start'] > 9 and len(ws) > 12 and not any(re.search(r'[.?!]$', w['w']) for w in ws[:-1]):
            try:
                lista = ' '.join(f'{i}:{w["w"]}' for i, w in enumerate(ws))
                j = claude(f"""Son palabras seguidas de una charla en español a las que la transcripción les quitó la puntuación.
Di detrás de qué índices acaba una frase con sentido completo (donde iría un punto). Devuelve SOLO JSON: {{"fines": [números]}}
{lista}""", max_tokens=3000, timeout=60)
                fines = sorted({int(i) for i in j.get('fines', []) if 0 <= int(i) < len(ws) - 1})
                ini = 0
                for k in fines + [len(ws) - 1]:
                    trozo = ws[ini:k + 1]
                    if trozo: out.append({'start': trozo[0]['s'], 'end': trozo[-1]['e'], 'text': ' '.join(w['w'] for w in trozo), 'words': trozo})
                    ini = k + 1
                continue
            except Exception as e:
                log('sin puntuar el tramo largo:', e)
        out.append(f)
    json.dump({'segments': out}, open(destino, 'w'), ensure_ascii=False)
    log('frases', len(out))
    return destino


def elegir_clips(c, segs, titulo, d, cuantos):
    """La IA busca los trozos que mejor funcionan solos y los puntúa como Opus (gancho, fluidez, valor, tendencia) + conversión."""
    lo, hi = DURACIONES.get(d.get('duracion') or 'auto', DURACIONES['auto'])
    lista = '\n'.join(f'{i}: [{s["start"]:.1f}-{s["end"]:.1f}] {s["text"].strip()}' for i, s in enumerate(segs) if s.get('words'))
    musica = '\n'.join(f'{m["src"]} = {m["nombre"]}' for m in LIB['musica'])
    buscar = (d.get('buscar') or '').strip()
    texto = f"""Eres el mejor clipper de habla hispana (nivel Opus Clip, pero con criterio de editor humano). De este vídeo largo («{titulo}»)
hay que sacar los {cuantos} mejores clips verticales de {lo} a {hi} segundos para la cuenta SECUNDARIA del creador: la que convierte al
seguidor en un lead consciente (alguien que entiende su problema, ve que este creador sabe resolverlo y quiere más).
{f'LO QUE PIDE EL CREADOR (manda sobre todo lo demás): «{buscar}». Solo clips que encajen con eso.' if buscar else ''}
Instrucciones extra: {d.get('instrucciones') or 'ninguna'}.

Cómo se elige un clip (en este orden de importancia):
1. GANCHO (0-10): la primera frase para el scroll SOLA en 2-3 s: afirmación polémica o contraintuitiva, cifra concreta, promesa,
   error común, «el problema es…», una pregunta que duele. Empieza en la frase más fuerte, no en su preparación. Nunca con «y»,
   «entonces», «como te decía», «bueno», saludos ni presentaciones. Si para entenderla hace falta lo de antes, NO vale.
2. VALOR (0-10): enseña algo concreto (método, paso, error y solución, historia con moraleja). Se entiende sin el resto del vídeo.
3. CONVERSIÓN (0-10): deja claro que el creador domina el tema y que hay más (método propio, resultados, el «cómo» que no puedes
   hacer solo). Un clip que vende autoridad vale más que uno solo gracioso.
4. FLUIDEZ (0-10): va de la tensión a una conclusión que se siente cerrada; el final no queda a mitad de frase.
5. TENDENCIA (0-10): toca algo de lo que la gente habla ahora (dinero, IA, redes, mentalidad, relaciones, trabajo).
Sé exigente: un 8 tiene que ser de verdad bueno. No repitas la misma idea en dos clips.
{aprendido(c)}
Transcripción por frases (índice: [inicio-fin en segundos] texto):
{lista}

Música disponible (src = nombre):
{musica}

Devuelve SOLO un JSON, sin nada más: {{"clips": [ ... ]}}, del mejor al peor, cada clip con:
- "tramos": índices de FRASES en orden (normalmente seguidas). Cada índice es una frase completa: el clip empieza en una frase
  que se entiende sola y acaba en una que cierra la idea. Puedes saltarte frases de relleno de en medio para que quede más directo,
  sin romper el sentido. Entre todas deben sumar {lo}-{hi} s.
- "titulo": título corto del clip (máx. 6 palabras).
- "titular": texto que va escrito ARRIBA del vídeo los 3 primeros segundos (máx. 7 palabras). Refuerza el gancho sin repetirlo
  palabra por palabra; puede ser la pregunta o la promesa («Por qué nunca ahorrarás», «El error del 90 % al emprender»).
- "gancho": la primera frase tal cual se dice.
- "por_que": una frase de por qué funciona y a qué lead atrae.
- "notas": {{"gancho": n, "valor": n, "conversion": n, "fluidez": n, "tendencia": n}} de 0 a 10.
- "descripcion": el texto para publicarlo (2-3 líneas, en la voz del creador, que termine invitando a comentar una palabra o a seguir).
- "hashtags": 5 hashtags en español, sin espacios.
- "claves": objeto con 3-8 palabras clave del clip (una palabra, minúsculas, como aparece) → "#F5C542" positivo/dinero, "#E5322D" negativo, "#FFFFFF" resto.
- "zoom": índices (de sus tramos) con la frase más potente.
- "musica": el src de la canción que encaje."""
    j = claude(texto, max_tokens=12000, timeout=400)
    buenos = []
    for k in j.get('clips', []):
        tr = [int(i) for i in k.get('tramos', []) if 0 <= int(i) < len(segs) and segs[int(i)].get('words')]
        dur = sum(segs[i]['end'] - segs[i]['start'] for i in tr)
        if not tr or not (lo * 0.6 <= dur <= hi * 1.4): continue
        cl = k.get('claves') or {}
        k['claves'] = cl if isinstance(cl, dict) else {str(w): '#FFFFFF' for w in cl}  # a veces llega como lista
        nt = {c: max(0, min(10, float((k.get('notas') or {}).get(c, 5)))) for c in PESOS}
        k['notas'] = nt
        k['puntuacion'] = min(99, round(sum(nt[c] * p for c, p in PESOS.items()) * 10))
        k['tramos'] = tr; k['inicio'] = segs[tr[0]]['start']
        buenos.append(k)
    if not buenos: raise Saltar('La IA no ha encontrado trozos que funcionen solos en este vídeo.')
    return sorted(buenos, key=lambda k: -k['puntuacion'])[:cuantos]


def donde_esta_la_cara(video, dur):
    """Respaldo si Vision no ve caras: la IA mira 3 fotogramas y dice dónde está quien habla (fracción del ancho y alto)."""
    fotos = []
    for t in (dur * 0.2, dur * 0.5, dur * 0.8):
        f = os.path.join(TMP, f'cara-{t:.1f}.jpg')
        sh('ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', video, '-frames:v', '1', '-vf', 'scale=640:-2', '-q:v', '4', f)
        fotos.append({'type': 'image', 'source': {'type': 'base64', 'media_type': 'image/jpeg', 'data': __import__('base64').b64encode(open(f, 'rb').read()).decode()}})
        os.remove(f)
    try:
        j = claude(fotos + [{'type': 'text', 'text': 'Son 3 fotogramas de un vídeo horizontal que voy a recortar a vertical 9:16. '
                             'Dime dónde está lo que hay que encuadrar (la persona que habla o el sujeto principal). Devuelve SOLO un JSON: '
                             '{"x": centro de 0 a 1 en horizontal, "y": centro de la cara de 0 a 1 en vertical}'}], max_tokens=2000, timeout=90)
        return min(1, max(0, float(j['x']))), min(1, max(0, float(j['y'])))
    except Exception as e:
        log('no sé dónde está la cara, recorto al centro:', e)
        return 0.5, 0.4


def a_vertical(montaje, salida, w, h, dur):
    """Vertical 9:16 siguiendo a quien habla. Devuelve dónde queda la cara en el lienzo 1080x1920."""
    if h >= w:
        os.replace(montaje, salida); return {'x': 540, 'y': 800}
    sys.path.insert(0, AQUI)
    import encuadre
    r = encuadre.reencuadrar(montaje, salida, w, h, respaldo=lambda: donde_esta_la_cara(montaje, dur))
    log('encuadre', r['personas'], 'personas,', r['planos'], 'planos')
    os.remove(montaje)
    return r['cara']


def progreso(c, b, texto):
    c.execute("UPDATE edicion.items SET respuesta=%s, updated_at=now() WHERE id=%s", (texto, b['id']))


def sacar_clips(c, b):
    d = b['datos']; titulo = d.get('titulo') or 'Vídeo'
    cuantos = max(1, min(12, int(re.sub(r'\D', '', str(d.get('clips') or '')) or 5)))
    usuario = (d.get('cuenta') or 'aminbusinesss').strip().lstrip('@') or 'aminbusinesss'
    raiz = os.path.join(ENTREGAS, f'{seguro(titulo)}-clips')
    log('clips', titulo)
    progreso(c, b, '1/5 · Bajando el vídeo…')
    src = bajar(d['url'], os.path.join(raiz, 'bruto'))
    w, h = medidas(src)
    tj = os.path.join(raiz, 'transcripcion.json')
    if not os.path.exists(tj):
        progreso(c, b, '2/5 · Transcribiendo el vídeo entero (en uno de una hora, unos 10 min)…')
        sh(sys.executable, os.path.join(AQUI, 'transcribir.py'), src, tj)
    if not any(s.get('words') for s in json.load(open(tj))['segments']): raise Saltar('No he oído voz en el vídeo.')
    tj = frases_de(tj, os.path.join(raiz, 'frases.json'))  # frases completas: ningún clip empieza ni acaba a medias
    segs = json.load(open(tj))['segments']
    progreso(c, b, '3/5 · La IA está eligiendo y puntuando los mejores momentos…')
    clips = elegir_clips(c, segs, titulo, d, cuantos)
    hechos = []
    for n, k in enumerate(clips, 1):
      try:
        progreso(c, b, f'4/5 · Editando el clip {n} de {len(clips)} (recorte, subtítulos, render)…')
        entrega = f'{slug(titulo)[:28]}-clip{n}-{b["id"][-4:]}'
        trabajo = os.path.join(raiz, f'clip {n}')
        sh(sys.executable, os.path.join(AQUI, 'montar.py'), src, tj, trabajo, ','.join(map(str, k['tramos'])),
           env={**os.environ, 'BITRATE': '30M' if max(w, h) >= 2000 else '16M', 'MULETILLAS': '0' if d.get('muletillas') == 'no' else '1'})
        pj = json.load(open(os.path.join(trabajo, 'palabras.json')))
        cara = a_vertical(os.path.join(trabajo, 'montaje.mp4'), os.path.join(trabajo, 'vertical.mp4'), w, h, pj['duracion'])
        edl = construir_edl(pj, {**k, 'mantener': k['tramos']}, entrega, usuario)
        edl['cara'] = cara
        edl['estilo']['subY'] = max(1010, min(1500, cara['y'] + 380))  # subtítulos a la altura del pecho, sin tapar la cara
        if k.get('titular') and d.get('titular') != 'no':
            edl['titular'] = {'texto': str(k['titular'])[:80], 'hasta': 3.0}
        json.dump(edl, open(os.path.join(trabajo, 'edl.json'), 'w'), ensure_ascii=False, indent=1)
        a_la_web(entrega, os.path.join(trabajo, 'vertical.mp4'), edl)
        t = f'{titulo} · clip {n} · {k.get("titulo", "")}'.strip(' ·')
        nombre = f'{seguro(t)} - versión 1.mp4'
        final = render_edl(entrega, trabajo, 'vertical.mp4', edl, nombre, entrega)
        calidad = control_calidad(final, entrega, 1)
        # Copia ligera (1080p) para descargar desde la Sala, y la portada.
        pub = os.path.join(APP, 'public', 'p', entrega)
        sh('ffmpeg', '-v', 'error', '-y', '-i', final, '-c:v', 'libx264', '-preset', 'medium', '-crf', '24', '-maxrate', '6M', '-bufsize', '12M',
           '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', os.path.join(pub, 'final.mp4'))
        sh('ffmpeg', '-v', 'error', '-y', '-ss', '1.2', '-i', final, '-frames:v', '1', '-vf', 'scale=540:-2', '-q:v', '4', os.path.join(pub, 'portada.jpg'))
        nt = k['notas']
        hechos.append((entrega, t, trabajo, edl, nombre, calidad, {
            'proyecto': b['id'], 'clip': n, 'puntuacion': k['puntuacion'], 'notas': nt, 'inicio': round(k['inicio'], 1),
            'titulo_clip': k.get('titulo', ''), 'titular': k.get('titular', ''), 'gancho': k.get('gancho', ''), 'por_que': k.get('por_que', ''),
            'descripcion': k.get('descripcion', ''), 'hashtags': [str(x).lstrip('#') for x in (k.get('hashtags') or [])][:8],
            'final': f'p/{entrega}/final.mp4', 'portada': f'p/{entrega}/portada.jpg'}))
        log('clip', n, entrega, f'{pj["duracion"]:.1f} s', k['puntuacion'])
      except Exception as e:  # se salta ese clip y siguen los demás
        log('clip', n, 'falló, lo salto:', repr(e)[:300])
    if not hechos: raise RuntimeError('no ha salido ningún clip')
    progreso(c, b, '5/5 · Publicando los clips en la Sala…')
    publicar(f'Clips automáticos: {titulo}')
    for entrega, t, trabajo, edl, nombre, (huella, qc), extra in hechos:
        nt = extra['notas']
        alta_entrega(c, entrega, {'titulo': t, 'version': 'v1', 'duracion': f'{round(edl["duracion"])} s · vertical', 'archivo': nombre,
                                  'nota': f'Puntuación {extra["puntuacion"]}/99 · gancho {nt["gancho"]:g} · valor {nt["valor"]:g} · conversión {nt["conversion"]:g}. '
                                          f'Empieza: «{extra["gancho"]}». {extra["por_que"]}',
                                  'trabajo': trabajo, 'video4k': 'vertical.mp4', **extra}, edl, 'Clip automático', 'renderizado')
        c.execute("UPDATE edicion.versiones SET archivo=%s, huella=%s, qc=%s WHERE entrega=%s", (nombre, huella, Jsonb(qc) if qc else None, entrega))
        if extra['gancho']:  # a la biblioteca de ganchos (al rehacer un proyecto, el gancho viejo del clip se sustituye)
            c.execute("DELETE FROM edicion.ganchos WHERE id = %s", ('g-' + entrega,))
            c.execute("""INSERT INTO edicion.ganchos (id, texto, origen, url, nota, datos) VALUES (%s, %s, 'clip', %s, %s, %s) ON CONFLICT (texto) DO NOTHING""",
                      ('g-' + entrega, extra['gancho'], f'/clips/{b["id"]}', extra['puntuacion'], Jsonb({'titular': extra['titular'], 'entrega': entrega})))
    c.execute("UPDATE edicion.items SET estado='entregado', respuesta=%s, updated_at=now() WHERE id=%s",
              (f'{len(hechos)} clips listos, ordenados por puntuación. Descárgalos o retócalos en el editor.', b['id']))
    log('clips listos', titulo, len(hechos)); avisar('Clips listos', f'{len(hechos)} clips de «{titulo}» en la Sala')


# ─────────────── 4. Vídeos de los alumnos de Trainer10x ───────────────
# El alumno sube su grabación en su portal (trainer10x-contenido.vercel.app/p/…) → t10x.videos 'en_cola'.
# Aquí se monta igual que un bruto de Amin, pero con SU guion, su @ y su propia carpeta (nada se mezcla con lo de Amin),
# se sube al almacén y queda 'revisar' para que el editor lo mire en /panel/edicion. Nunca se entrega solo.

ALUMNOS = os.path.expanduser('~/Desktop/2 · Contenido/Edición/Alumnos Trainer10x')
T10X = json.load(open(os.path.join(HERR, 'env-trainer10x.json')))


def aviso_t10x(asunto, texto):
    """Correo al equipo (el mismo buzón de avisos del panel)."""
    if not (T10X.get('RESEND_API_KEY') and T10X.get('AVISOS_EMAIL')): return
    cuerpo = {'from': T10X.get('EMAIL_FROM') or 'Trainer10x <onboarding@resend.dev>', 'to': [T10X['AVISOS_EMAIL']], 'subject': asunto,
              'text': texto + '\n\nhttps://trainer10x-contenido.vercel.app/panel/edicion'}
    try:
        urllib.request.urlopen(urllib.request.Request('https://api.resend.com/emails', data=json.dumps(cuerpo).encode(), method='POST',
                               headers={'Authorization': 'Bearer ' + T10X['RESEND_API_KEY'], 'Content-Type': 'application/json',
                                        'User-Agent': 'trainer10x-agente/1.0'}), timeout=20)  # sin él, Cloudflare de Resend da 403 (1010)
    except Exception as e: log('aviso por correo falló', repr(e)[:120])


def editar_alumno(c, v):
    import s3
    titulo = v['titulo'] or 'Vídeo'
    trabajo = os.path.join(ALUMNOS, seguro(v['cliente'])[:60] or v['cliente_id'], f'{seguro(titulo)[:60]}-{v["id"][-4:]}')
    os.makedirs(trabajo, exist_ok=True)
    log('alumno', v['cliente'], '·', titulo, '(cambios)' if v['correcciones'] else '')
    src = os.path.join(trabajo, 'bruto.' + v['bruto'].rsplit('.', 1)[-1].lower())
    if not os.path.exists(src) or os.path.getsize(src) < 100_000: s3.bajar(v['bruto'], src)
    w, h = medidas(src)
    if w > h: raise Saltar('Está grabado en horizontal y el montaje automático es para vertical. Descarga el bruto y edítalo a mano, o pide al alumno que lo grabe en vertical.')
    tj = os.path.join(trabajo, 'transcripcion.json')
    if not os.path.exists(tj): sh(sys.executable, os.path.join(AQUI, 'transcribir.py'), src, tj)
    if not any(s.get('words') for s in json.load(open(tj))['segments']): raise Saltar('No se oye voz en el vídeo: edítalo a mano.')
    tj = frases_de(tj, os.path.join(trabajo, 'frases.json'))
    segs = json.load(open(tj))['segments']
    guion = '\n'.join(f'{k.upper()}: {v[k]}' for k in ('gancho', 'historia', 'moraleja', 'cta') if v.get(k))
    instr = '\n'.join(x for x in [
        v['nota_alumno'] and f'Nota del alumno: {v["nota_alumno"]}',
        v['correcciones'] and f'CORRECCIONES DEL EDITOR sobre la versión anterior (prioridad máxima, aplícalas todas):\n{v["correcciones"]}'] if x)
    ia = pedir_ia(segs, titulo, instr, guion, quien='un alumno de Trainer10x (entrenador personal)')
    ia['mantener'] = [k for k in ia['mantener'] if segs[k].get('words')]
    sh(sys.executable, os.path.join(AQUI, 'montar.py'), src, tj, trabajo, ','.join(map(str, ia['mantener'])),
       env={**os.environ, 'BITRATE': '45M' if max(w, h) >= 3000 else '16M'})
    pj = json.load(open(os.path.join(trabajo, 'palabras.json')))
    clave = f't10x-{v["id"]}'
    usuario = re.sub(r'^@|^https?://(www\.)?instagram\.com/|[/?].*$', '', (v['instagram'] or '').strip()) or 'tucuenta'
    edl = construir_edl(pj, ia, clave, usuario)
    json.dump(edl, open(os.path.join(trabajo, 'edl.json'), 'w'), ensure_ascii=False, indent=1)
    pub = os.path.join(TMP, f'render-{clave}'); shutil.rmtree(pub, ignore_errors=True)
    os.makedirs(os.path.join(pub, 'p', clave)); enlazar(os.path.join(trabajo, 'montaje.mp4'), os.path.join(pub, 'p', clave, 'video.mp4'))
    n = v['version'] + 1
    render = render_edl(clave, trabajo, 'montaje.mp4', edl, f'render-v{n}.mp4', clave, pub=pub, destino=trabajo)
    # Para entregar: H.264 ligero y que empiece a verse antes de bajarlo entero
    final, portada = os.path.join(trabajo, f'final-v{n}.mp4'), os.path.join(trabajo, f'portada-v{n}.jpg')
    sh('ffmpeg', '-v', 'error', '-y', '-i', render, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-maxrate', '12M', '-bufsize', '24M',
       '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', final)
    sh('ffmpeg', '-v', 'error', '-y', '-ss', '0.6', '-i', final, '-frames:v', '1', '-vf', 'scale=540:-2', '-q:v', '4', portada)
    os.remove(render)
    base = f'alumnos/{v["cliente_id"]}/{v["id"]}'
    s3.subir(final, f'{base}/final-v{n}.mp4'); s3.subir(portada, f'{base}/portada-v{n}.jpg', 'image/jpeg')
    for viejo in (v['final'], v['portada']):
        if viejo and viejo not in (f'{base}/final-v{n}.mp4', f'{base}/portada-v{n}.jpg'): s3.borrar(viejo)
    resumen = ('Con tus cambios. ' if v['correcciones'] else 'Primer montaje. ') + (ia.get('resumen') or '')
    c.execute("""UPDATE t10x.videos SET estado='revisar', final=%s, portada=%s, duracion=%s, version=%s, respuesta=%s, updated_at=now(),
                 historial = historial || %s::text::jsonb WHERE id=%s AND estado='editando'""",
              (f'{base}/final-v{n}.mp4', f'{base}/portada-v{n}.jpg', round(edl['duracion'], 1), n, resumen.strip()[:600],
               json.dumps([{'quien': 'mac', 'que': f'versión {n}', 'fecha': time.strftime('%Y-%m-%dT%H:%M:%S')}]), v['id']))
    log('alumno listo', titulo, f'v{n}')
    avisar('Trainer10x · para revisar', f'{v["cliente"]}: {titulo}')
    aviso_t10x(f'Vídeo para revisar · {v["cliente"]}', f'«{titulo}» ya está editado (versión {n}). Revísalo y entrégalo.')


def alumnos(c):
    import s3
    if not s3.listo(): return
    try:
        c.execute("""UPDATE t10x.videos SET estado = CASE WHEN correcciones <> '' THEN 'corregir' ELSE 'en_cola' END
                     WHERE estado='editando' AND updated_at < now() - interval '2 hours'""")
    except psycopg.errors.UndefinedTable: return
    # Se coge el vídeo de forma atómica (SKIP LOCKED): pueden trabajar varios equipos a la vez sin pisarse
    # (este Mac y los servidores que se añadan), cada uno con un vídeo distinto.
    cogido = c.execute("""UPDATE t10x.videos SET estado='editando', updated_at=now() WHERE id = (
                            SELECT id FROM t10x.videos WHERE estado IN ('en_cola', 'corregir') ORDER BY updated_at LIMIT 1 FOR UPDATE SKIP LOCKED)
                          RETURNING id""").fetchone()
    if not cogido: return
    for v in c.execute("""SELECT v.*, cl.nombre cliente, cl.instagram, g.gancho, g.historia, g.moraleja, g.cta
                          FROM t10x.videos v JOIN t10x.clientes cl ON cl.id = v.cliente_id LEFT JOIN t10x.guiones g ON g.id = v.guion_id
                          WHERE v.id = %s""", (cogido['id'],)).fetchall():
        try:
            editar_alumno(c, v)
        except Saltar as e:
            c.execute("UPDATE t10x.videos SET estado='error', respuesta=%s, updated_at=now() WHERE id=%s", (str(e), v['id']))
            log('alumno saltado', e); aviso_t10x(f'Vídeo con problema · {v["cliente"]}', f'«{v["titulo"]}»: {e}')
        except Exception as e:
            log('alumno falló', repr(e))
            c.execute("UPDATE t10x.videos SET estado='error', respuesta=%s, updated_at=now() WHERE id=%s",
                      ('El montaje automático falló. «Rehacer desde cero» para reintentarlo, o descarga el bruto y edítalo a mano.', v['id']))
            avisar('Trainer10x', f'Falló el montaje de «{v["titulo"]}»'); aviso_t10x(f'Vídeo con problema · {v["cliente"]}', f'«{v["titulo"]}»: el montaje automático falló ({repr(e)[:200]}).')


def luis_edita(tipo):
    """Interruptores (31-10, issue #2 de edicion-motor): con el archivo LUIS-EDITA-REELS (o SALA_LUIS_EDITA_REELS=1) este Mac
    deja los brutos de reel al trabajador del Mac de Luis; con LUIS-EDITA-CLIPS, los de «Clips de un vídeo largo».
    Los renders «pedido» de lo nuestro y los alumnos siguen aquí."""
    return os.path.exists(os.path.join(AQUI, f'LUIS-EDITA-{tipo}')) or os.environ.get(f'SALA_LUIS_EDITA_{tipo}') == '1'


# Las entregas del Mac de Luis (datos.editado_por = 'luis'): sus archivos están allí y las renderiza él
DE_LUIS = "coalesce(i.datos->>'editado_por', '') = 'luis'"


def main():
    os.makedirs(TMP, exist_ok=True)
    # Mientras este proceso viva, el Mac no se duerme (caffeinate se apaga solo al terminar el agente)
    subprocess.Popen(['caffeinate', '-i', '-w', str(os.getpid())], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    c = BD()
    reels, clips = not luis_edita('REELS'), not luis_edita('CLIPS')
    if True:
        # Lo que se quedó a medias (Mac dormido o apagado) vuelve a la cola. Solo lo nuestro: lo de Luis lo lleva su Mac.
        c.execute(f"""UPDATE edicion.versiones v SET estado='pedido' FROM edicion.items i
                      WHERE i.id = v.entrega AND v.estado='renderizando' AND NOT {DE_LUIS}""")
        c.execute("""UPDATE edicion.items SET estado='en cola' WHERE tipo='bruto' AND estado='editando'
                     AND datos->>'auto' = 'trabajando' AND updated_at < now() - interval '2 hours'""")
        for v in c.execute(f"""SELECT v.id, v.entrega, v.numero, v.edl, i.datos FROM edicion.versiones v JOIN edicion.items i ON i.id = v.entrega
                               WHERE v.estado = 'pedido' AND NOT {DE_LUIS} ORDER BY v.created_at""").fetchall():
            renderizar(c, v)
        # El bruto se coge de forma atómica (SKIP LOCKED): el trabajador de Luis lee la misma cola
        for b in (c.execute("""UPDATE edicion.items SET estado='editando', datos = datos || '{"auto":"trabajando"}',
                                  respuesta='Montando el primer corte en el Mac…', updated_at=now() WHERE id = (
                                  SELECT id FROM edicion.items WHERE tipo='bruto' AND estado='en cola' AND coalesce(datos->>'auto', '') = ''
                                  AND (%(reels)s OR coalesce(datos->>'formato', '') ILIKE '%%clip%%')
                                  AND (%(clips)s OR coalesce(datos->>'formato', '') NOT ILIKE '%%clip%%')
                                  ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED)
                              RETURNING id, datos""", {'reels': reels, 'clips': clips}).fetchall() if reels or clips else []):
            try:
                (sacar_clips if 'clip' in (b['datos'].get('formato') or '').lower() else montar_bruto)(c, b)
                c.execute("""UPDATE edicion.items SET datos = datos || '{"auto":"hecho"}' WHERE id=%s""", (b['id'],))
            except Saltar as e:
                c.execute("""UPDATE edicion.items SET estado='en cola', datos = datos || '{"auto":"no"}', respuesta=%s, updated_at=now() WHERE id=%s""", (str(e), b['id']))
                log('saltado', e)
            except Exception as e:
                log('montaje falló', repr(e))
                c.execute("""UPDATE edicion.items SET estado='en cola', datos = datos || '{"auto":"error"}',
                             respuesta='El montaje automático ha fallado; lo hago yo a mano.', updated_at=now() WHERE id=%s""", (b['id'],))
                avisar('Sala de edición', f'El montaje automático de «{b["datos"].get("titulo")}» falló')
        if not luis_edita('ALUMNOS'): alumnos(c)  # con LUIS-EDITA-ALUMNOS los edita luis/trabajador.py (método de Luis; Amin, 07-11)


if __name__ == '__main__':
    main()
