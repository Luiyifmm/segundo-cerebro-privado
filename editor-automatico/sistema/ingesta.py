"""Ficha técnica de un bruto ANTES de editar (lección de Luis: la mitad de los fallos graves salen de no mirar esto).

Uso: uv run --with numpy python ingesta.py VIDEO [SALIDA.json]

Mide:
- Resolución, rotación, fps y si es HDR (HLG/PQ de iPhone: hay que pasarlo a SDR o se ve lavado).
- Cada canal de audio por separado: si la voz va en uno solo, el otro hay que rellenarlo
  (si no, en el móvil «no se oye»). Avisa a partir de 25 dB de diferencia.
- Sonoridad integrada (LUFS), nivel de la voz (p90) y ruido de fondo (p10) en ventanas de 50 ms.
  El ruido de fondo es la referencia para comprobar después que el tratamiento de voz no lo sube.
"""
import json, os, re, subprocess, sys

import numpy as np

FF = os.path.expanduser('~/.local/bin/ffmpeg')
FP = os.path.expanduser('~/.claude/herramientas/edicion/motor/node_modules/@remotion/compositor-darwin-arm64/ffprobe')
ENV = {**os.environ, 'DYLD_LIBRARY_PATH': os.path.dirname(FP)}


def sonda(video):
    o = subprocess.run([FP, '-v', 'error', '-show_streams', '-show_format', '-of', 'json', video], capture_output=True, text=True, env=ENV)
    return json.loads(o.stdout)


def niveles(video, canal=None, ss=0, t=None):
    """dB por ventanas de 50 ms (mono o un canal suelto)."""
    filtro = f'pan=mono|c0=c{canal}' if canal is not None else 'pan=mono|c0=0.5*c0+0.5*c1'
    cmd = [FF, '-v', 'error', '-ss', str(ss)] + (['-t', str(t)] if t else []) + ['-i', video, '-vn', '-af', filtro, '-ar', '16000', '-f', 'f32le', '-']
    x = np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32)
    n = len(x) // 800
    if not n: return np.array([-120.0])
    r = np.sqrt((x[:n * 800].reshape(n, 800) ** 2).mean(1))
    return 20 * np.log10(np.maximum(r, 1e-6))


def lufs(video):
    e = subprocess.run([FF, '-hide_banner', '-nostdin', '-i', video, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    r = e[e.rfind('Summary:'):]
    i = re.search(r'I:\s+(-?[\d.]+) LUFS', r); p = re.search(r'Peak:\s+(-?[\d.]+) dBFS', r)
    return (float(i.group(1)) if i else None, float(p.group(1)) if p else None)


def ficha(video):
    s = sonda(video)
    v = next((x for x in s['streams'] if x['codec_type'] == 'video'), {})
    a = next((x for x in s['streams'] if x['codec_type'] == 'audio'), {})
    rot = 0
    for sd in v.get('side_data_list', []):
        if 'rotation' in sd: rot = int(sd['rotation'])
    rot = rot or int(v.get('tags', {}).get('rotate', 0) or 0)
    w, h = v.get('width'), v.get('height')
    vertical = (h > w) if rot % 180 == 0 else (w > h)
    num, den = (v.get('r_frame_rate') or '0/1').split('/')
    trc = v.get('color_transfer', '')
    out = {
        'archivo': os.path.basename(video), 'duracion': round(float(s['format']['duration']), 2),
        'resolucion': f'{w}x{h}', 'rotacion': rot, 'se_ve_vertical': vertical, 'fps': round(int(num) / max(1, int(den)), 3),
        'codec': v.get('codec_name'), 'hdr': trc in ('arib-std-b67', 'smpte2084'), 'transferencia': trc,
        'canales_audio': a.get('channels', 0), 'avisos': [],
    }
    if out['hdr']: out['avisos'].append('HDR: pasar a SDR (zscale+tonemap) antes de montar o se verá lavado.')
    if out['fps'] not in (24, 25, 30, 60, 23.976, 29.97, 59.94): out['avisos'].append(f'fps raros ({out["fps"]}).')
    if a.get('channels', 0) >= 2:
        l, r = niveles(video, 0), niveles(video, 1)
        out['canal_izq_db'], out['canal_der_db'] = round(float(np.percentile(l, 90)), 1), round(float(np.percentile(r, 90)), 1)
        if abs(out['canal_izq_db'] - out['canal_der_db']) > 25:
            bueno = 0 if out['canal_izq_db'] > out['canal_der_db'] else 1
            out['avisos'].append(f'Voz en un solo canal: rellenar con pan=stereo|c0=c{bueno}|c1=c{bueno}.')
    m = niveles(video)
    out['voz_p90_db'] = round(float(np.percentile(m, 90)), 1)
    out['ruido_fondo_p10_db'] = round(float(np.percentile(m, 10)), 1)
    out['relacion_voz_ruido_db'] = round(out['voz_p90_db'] - out['ruido_fondo_p10_db'], 1)
    out['lufs'], out['pico_dbfs'] = lufs(video)
    if out['relacion_voz_ruido_db'] < 25: out['avisos'].append('Poco margen entre voz y ruido: tratar la voz con cuidado y comparar el ruido antes y después.')
    return out


if __name__ == '__main__':
    f = ficha(sys.argv[1])
    txt = json.dumps(f, ensure_ascii=False, indent=1)
    if len(sys.argv) > 2: open(sys.argv[2], 'w').write(txt)
    print(txt)
