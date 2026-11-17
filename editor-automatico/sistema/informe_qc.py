"""COPIA en sistema/ del informe de Claude 2 (original: /Users/aminsproject/claude-2/qc/informe_qc.py, 30-10-2026),
para que el agente no dependa de la carpeta de Claude 2. Cambios de Claude 1: pico ≤ −1,5 dBTP, filas «integridad»
y «canales», y `pico_dbtp`. Si Claude 2 cambia el original, se vuelve a copiar con estos ajustes.

Informe de control de calidad (contrato «qc-v1») para la Sala, ligado a la huella del archivo.

Uso: uv run -q --with numpy python -I informe_qc.py VIDEO [--entrega ID] [--numero N] [--nota TEXTO] > informe.json

No mide nada por su cuenta: ejecuta sistema/qc.py (de Claude 1) sin tocarlo y reparte su veredicto en
comprobaciones con lo medido, el criterio y el motivo. Los umbrales son los de qc.py; aquí solo se copian
como texto para enseñarlos en la Sala. Si qc.py cambia un umbral, hay que actualizar CRITERIOS.

Añade la huella SHA-256 del archivo: si el vídeo se vuelve a renderizar, la huella cambia y la Sala
marca el informe como desactualizado (gris).
"""
import datetime, hashlib, json, os, re, subprocess, sys

QC = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'qc.py')

# id → (nombre, criterio tal como lo aplica qc.py, prefijo del texto de qc.py, gravedad si falla)
CRITERIOS = [
    ('integridad', 'Archivo íntegro', 'se lee entero sin errores', 'archivo dañado', 'fallo'),
    ('video', 'Pista de vídeo', 'debe existir', 'sin vídeo', 'fallo'),
    ('formato', 'Formato', 'vertical 9:16 (±1 %)', 'formato', 'fallo'),
    ('audio', 'Pista de audio', 'debe existir', 'sin audio', 'fallo'),
    ('duracion', 'Duración', 'entre 15 y 90 s', 'duración', 'aviso'),
    ('negros', 'Fotogramas negros', 'ninguno ≥ 0,1 s (puede ser intencional)', 'fotogramas negros', 'aviso'),
    ('congelados', 'Imagen congelada', 'ninguna ≥ 2 s', 'imagen congelada', 'aviso'),
    ('silencios', 'Silencios', 'ninguno > 1,2 s bajo −40 dB', 'silencios', 'aviso'),
    ('sonoridad', 'Sonoridad integrada', 'entre −18 y −11 LUFS (objetivo −14)', 'sonoridad', 'aviso'),
    ('pico', 'Pico real (true peak)', '≤ −1,5 dBTP', 'pico', 'aviso'),
    ('canales', 'Voz en los dos canales', 'diferencia ≤ 25 dB entre izquierda y derecha', 'voz en un solo canal', 'fallo'),
]


def es(t):
    """Cifras a la española en los textos de qc.py: «-0.7» → «−0,7»."""
    return re.sub(r'(?<![\w.])-(?=\d)', '−', re.sub(r'(\d)\.(\d)', r'\1,\2', t))


def sha256(ruta):
    h = hashlib.sha256()
    with open(ruta, 'rb') as f:
        for trozo in iter(lambda: f.read(1 << 20), b''):
            h.update(trozo)
    return h.hexdigest()


def comprobar(q):
    """Reparte la salida de qc.py en comprobaciones. Regla: lo que no se pudo medir NUNCA sale como «ok»."""
    textos = [(t, 'fallo') for t in q['fallos']] + [(t, 'aviso') for t in q['avisos']]
    usados = set()
    sin_video = 'sin vídeo' in q['fallos']
    sin_audio = 'sin audio' in q['fallos']
    # qc.py no expone si ffmpeg terminó bien. Si algún día añade «analisis_ok», se respeta.
    analisis_ok = q.get('analisis_ok', True)
    # Con audio pero sin sonoridad ni pico, el análisis de audio no ha funcionado: tampoco se fía de «sin silencios».
    q.setdefault('pico_dbtp', q.get('pico_dbfs'))
    audio_roto = not sin_audio and q.get('lufs') is None and q.get('pico_dbtp') is None
    num = {'sonoridad': ('lufs', 'LUFS'), 'pico': ('pico_dbtp', 'dBTP')}
    canales = q.get('canales')

    def sin_medir(cid, nombre, criterio, motivo):
        return {'id': cid, 'nombre': nombre, 'criterio': criterio, 'medido': 'sin medir', 'resultado': 'sin_medir', 'motivo': motivo}

    out = []
    for cid, nombre, criterio, prefijo, _ in CRITERIOS:
        hit = next(((t, g) for t, g in textos if t.startswith(prefijo)), None)
        if hit: usados.add(hit[0])
        if not hit:
            if sin_audio and cid in ('silencios', 'sonoridad', 'pico', 'canales'):
                out.append(sin_medir(cid, nombre, criterio, 'no se puede medir: el vídeo no tiene audio')); continue
            if sin_video and cid == 'formato':
                out.append(sin_medir(cid, nombre, criterio, 'no se puede medir: el archivo no tiene vídeo')); continue
            if cid in num and q.get(num[cid][0]) is None:
                out.append(sin_medir(cid, nombre, criterio, 'el análisis no devolvió la medida')); continue
            if cid == 'canales' and not canales:
                out.append(sin_medir(cid, nombre, criterio, 'el análisis no devolvió la medida por canal')); continue
            if (audio_roto and cid == 'silencios') or (not analisis_ok and cid in ('negros', 'congelados', 'silencios')):
                out.append(sin_medir(cid, nombre, criterio, 'no se puede confirmar: el análisis no terminó bien')); continue
        if cid == 'integridad': medido = 'no' if hit else 'sí'
        elif cid == 'canales': medido = es(f"izq {canales['izq_db']} dB · der {canales['der_db']} dB")
        elif cid == 'video': medido = 'no' if sin_video else 'sí'
        elif cid == 'audio': medido = 'no' if sin_audio else 'sí'
        elif cid == 'formato': medido = q.get('formato') or '—'
        elif cid == 'duracion': medido = es(f"{q['duracion']:.1f} s") if q.get('duracion') is not None else 'sin medir'
        elif cid in num: medido = es(f"{q[num[cid][0]]} {num[cid][1]}")
        else: medido = 'detectado' if hit else 'nada detectado'
        out.append({'id': cid, 'nombre': nombre, 'criterio': criterio, 'medido': medido,
                    'resultado': hit[1] if hit else 'ok',
                    # qc.py lee la sección «True peak» de ffmpeg, que ffmpeg rotula «dBFS»: es pico real (dBTP).
                    'motivo': es(hit[0].replace(' dBFS', ' dBTP') if cid == 'pico' else hit[0]) if hit else ''})
    # Cualquier aviso o fallo que no reconozca no se pierde: va como comprobación aparte.
    for t, g in textos:
        if t not in usados:
            out.append({'id': 'otro', 'nombre': 'Otro', 'criterio': 'qc.py', 'medido': '—', 'resultado': g, 'motivo': es(t)})
    return out


def main():
    a = sys.argv[1:]
    video = a[0]
    opt = lambda n: a[a.index('--' + n) + 1] if '--' + n in a else None
    r = subprocess.run(['uv', 'run', '-q', '--with', 'numpy', 'python', '-I', QC, video], capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f'qc.py falló:\n{r.stderr[-2000:]}')
    q = json.loads(r.stdout)
    comprobaciones = comprobar(q)

    st = os.stat(video)
    informe = {
        'contrato': 'qc-v1',
        'analizado_at': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'),
        'herramienta': 'sistema/qc.py vía sistema/informe_qc.py',
        'simulado': False,
        'nota': opt('nota') or '',
        'archivo': {'nombre': os.path.basename(video), 'sha256': sha256(video), 'bytes': st.st_size},
        'version': {'entrega': opt('entrega'), 'numero': int(opt('numero')) if opt('numero') else None},
        'medidas': {'formato': q.get('formato'), 'fps': q.get('fps'), 'duracion_s': q.get('duracion'),
                    'lufs_i': q.get('lufs'), 'pico_dbtp': q.get('pico_dbtp', q.get('pico_dbfs'))},
        'comprobaciones': comprobaciones,
        'veredicto_qc_py': q['veredicto'],
    }
    print(json.dumps(informe, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
