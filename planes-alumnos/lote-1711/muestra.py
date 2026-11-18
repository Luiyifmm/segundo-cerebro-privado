# Prueba rápida de un spec: pinta solo los instantes pedidos (en segundos del BRUTO si el spec usa "tiempos": "bruto") y los junta en una tira.
# Uso: python3 muestra.py <carpeta> t1 t2 ...   -> <carpeta>/muestra.jpg   (sin animar el vídeo entero: ahorra minutos y tokens)
import json, os, sys, subprocess
AQUI = os.path.abspath(sys.argv[1]); S = json.load(open(os.path.join(AQUI, 'spec.json'))); ts = [float(x) for x in sys.argv[2:]]
PY = os.path.expanduser('~/Videos-Remotion/herramientas/entornos/whisperx/bin/python'); LOTE = os.path.dirname(os.path.abspath(__file__))
WORK = S.get('trabajo') or os.path.join('/private/tmp/claude-501/lote-1711', os.path.basename(AQUI))
def a_montaje(t):
    if S.get('tiempos') != 'bruto': return t
    off = 0.0
    for s, e in S['tramos']:
        if t < s: return off
        if t <= e: return off + t - s
        off += e - s
    return off
fs = [int(round(a_montaje(t) * 30)) for t in ts]
subprocess.run([PY, os.path.join(LOTE, 'reel_alumno.py'), os.path.join(AQUI, 'spec.json'), 'anim', ','.join(map(str, fs))], check=True)
ent = sum([['-i', '%s/an/a_%04d.jpg' % (WORK, f)] for f in fs], [])
fc = ''.join('[%d]scale=270:480,drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial Bold.ttf:text=%.2f:x=6:y=6:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6[s%d];' % (k, ts[k], k) for k in range(len(fs)))
fc = (fc + ''.join('[s%d]' % k for k in range(len(fs))) + 'hstack=%d' % len(fs)) if len(fs) > 1 else fc.rstrip(';')[:-4]
out = os.path.join(AQUI, 'muestra.jpg')
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + ent + ['-filter_complex', fc, '-frames:v', '1', out], check=True); print(out)
