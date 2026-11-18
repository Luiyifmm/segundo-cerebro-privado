# Verificación técnica del lote (sin tokens): por cada spec.json comprueba sus MP4 de MEDIA.
# Uso: python3 verificar.py [carpeta_lote]  -> tabla OK/FALLA y verificacion.json
import os, sys, json, re, glob, subprocess
L = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__)))
MEDIA = os.path.expanduser('~/EDICION/3 PROYECTOS/Alumnos Trainer10x/MEDIA/')
def sonda(f):
    o = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', f], capture_output=True, text=True).stdout or '{}')
    v = next((s for s in o.get('streams', []) if s['codec_type'] == 'video'), {}); a = next((s for s in o.get('streams', []) if s['codec_type'] == 'audio'), None)
    return v, a, float(o.get('format', {}).get('duration', 0))
def medir(f):
    e = subprocess.run(['ffmpeg', '-nostdin', '-i', f, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    i = re.findall(r'I:\s+(-?[\d.]+) LUFS', e); p = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', e)
    return (float(i[-1]) if i else None), (float(p[-1]) if p else None)
def negros(f):
    e = subprocess.run(['ffmpeg', '-nostdin', '-i', f, '-vf', 'blackdetect=d=0.25:pix_th=0.06', '-an', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return re.findall(r'black_start:([\d.]+)', e)
res = []
for sp in sorted(glob.glob(os.path.join(L, '*', 'spec.json'))):
    S = json.load(open(sp)); d = os.path.dirname(sp); dur = sum(e - s for s, e in S['tramos'])
    tit = S.get('titulo_salida'); fallos = []; info = ''
    for var in (('música', 'sin música') if S.get('audio', 'voz') == 'voz' else ('música',)):
        f = os.path.join(MEDIA, S['alumno'], f"{tit} - {S.get('version', 'v1')} lote ({var}).mp4")
        if not os.path.exists(f): fallos.append(f'falta ({var})'); continue
        v, a, dd = sonda(f); lu, tp = medir(f); ng = negros(f)
        if (int(v.get('width', 0)), int(v.get('height', 0))) != (1080, 1920): fallos.append(f'{var}: tamaño {v.get("width")}x{v.get("height")}')
        if v.get('r_frame_rate') != '30/1': fallos.append(f'{var}: fps {v.get("r_frame_rate")}')
        if abs(dd - dur) > 0.15: fallos.append(f'{var}: dura {dd:.2f} s y el corte {dur:.2f}')
        if not a: fallos.append(f'{var}: sin audio')
        if var == 'música' and lu is not None and abs(lu + 14) > 0.6: fallos.append(f'{var}: {lu} LUFS')
        if tp is not None and tp > -0.9: fallos.append(f'{var}: pico real {tp} dBTP')
        if ng: fallos.append(f'{var}: negro en {", ".join(ng[:3])} s')
        mb = os.path.getsize(f) / 1e6
        if mb / max(dd, 1) > 1.9: fallos.append(f'{var}: pesa {mb:.0f} MB ({mb * 8 / max(dd, 1):.0f} Mbps)')
        if var == 'música': info = f'{dd:.1f} s · {lu} LUFS · TP {tp} · {mb:.0f} MB'
    if not os.path.exists(os.path.join(d, 'hoja.jpg')): fallos.append('sin hoja.jpg')
    res.append({'video': os.path.basename(d), 'alumno': S['alumno'], 'info': info, 'fallos': fallos})
    print(('OK   ' if not fallos else 'FALLA'), f'{os.path.basename(d):16}', info, '| ' + '; '.join(fallos) if fallos else '')
json.dump(res, open(os.path.join(L, 'verificacion.json'), 'w'), ensure_ascii=False, indent=1)
