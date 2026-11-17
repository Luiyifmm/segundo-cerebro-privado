"""Tratamiento de voz con comprobación: si el procesado empeora la relación voz/ruido, no se usa.

Uso: uv run --with numpy python voz.py ENTRADA SALIDA.wav [--sin-ruido] [--lufs -14]

Cadena (de Luis, punto de partida, no dogma):
  highpass 80 Hz → lowpass 14 kHz → [afftdn suave, solo si hay ruido audible] → compresor 2:1 →
  de-esser → loudnorm a -14 LUFS / -1,5 dBTP (dos pasadas).
Lección de Luis (gimnasio de un cliente): la cadena completa subió el ruido 5 dB y se notó. Por eso se mide la
relación voz/ruido (p90 − p10 en ventanas de 50 ms) antes y después; si baja más de 3 dB, se repite solo con
loudnorm y se avisa. Escribe SALIDA.json con las medidas.
"""
import json, os, re, subprocess, sys

sys.path.insert(0, os.path.dirname(__file__))
from ingesta import FF, niveles, lufs  # noqa: E402
import numpy as np  # noqa: E402

args = sys.argv[1:]
ent, sal = args[0], args[1]
objetivo = float(args[args.index('--lufs') + 1]) if '--lufs' in args else -14.0


def medir(f):
    m = niveles(f)
    return {'voz_p90_db': round(float(np.percentile(m, 90)), 1), 'ruido_p10_db': round(float(np.percentile(m, 10)), 1),
            'voz_ruido_db': round(float(np.percentile(m, 90) - np.percentile(m, 10)), 1), 'lufs': lufs(f)[0], 'pico': lufs(f)[1]}


def loudnorm(entrada, salida, previo=''):
    """Dos pasadas: la primera mide y la segunda aplica (más fiel que una sola)."""
    f1 = (previo + ',' if previo else '') + f'loudnorm=I={objetivo}:TP=-1.5:LRA=11:print_format=json'
    e = subprocess.run([FF, '-hide_banner', '-nostdin', '-i', entrada, '-vn', '-af', f1, '-f', 'null', '-'], capture_output=True, text=True).stderr
    j = json.loads(e[e.rfind('{'):e.rfind('}') + 1])
    f2 = (previo + ',' if previo else '') + (f'loudnorm=I={objetivo}:TP=-1.5:LRA=11:measured_I={j["input_i"]}:measured_TP={j["input_tp"]}:'
                                             f'measured_LRA={j["input_lra"]}:measured_thresh={j["input_thresh"]}:offset={j["target_offset"]}:linear=true')
    subprocess.run([FF, '-v', 'error', '-y', '-nostdin', '-i', entrada, '-vn', '-af', f2, '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', salida], check=True)


antes = medir(ent)
cadena = ['highpass=f=80', 'lowpass=f=14000']
if antes['ruido_p10_db'] > -60 and '--sin-ruido' not in args:
    cadena.append('afftdn=nf=-25')  # ruido audible: reducción suave
cadena += ['acompressor=ratio=2:threshold=-24dB:attack=10:release=150:makeup=1', 'deesser=i=0.4']
loudnorm(ent, sal, ','.join(cadena))
despues = medir(sal)
decision = 'cadena completa'
if despues['voz_ruido_db'] < antes['voz_ruido_db'] - 3:
    loudnorm(ent, sal)  # solo nivel
    despues = medir(sal)
    decision = 'solo loudnorm: la cadena empeoraba la relación voz/ruido'
info = {'entrada': os.path.basename(ent), 'cadena': ','.join(cadena), 'decision': decision, 'antes': antes, 'despues': despues}
json.dump(info, open(os.path.splitext(sal)[0] + '.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps(info, ensure_ascii=False, indent=1))
