"""Control de calidad técnico del vídeo exportado (versión adaptada de qc.js de Luis).

Uso: uv run --with numpy python qc.py VIDEO [--min 15] [--max 90]
Veredicto APROBADO / REVISAR / BLOQUEADO con evidencia: formato 9:16, audio presente, voz en los dos canales,
negros, imagen congelada, silencios largos, sonoridad (-18 a -11 LUFS) y pico real (objetivo ≤ -1,5 dBTP).
No sustituye mirar fotogramas ni escuchar.

Si ffmpeg falla o no da la sonoridad o el pico, `analisis_ok` es false y el veredicto nunca es APROBADO:
lo que no se pudo medir no cuenta como bueno (30-10-2026, hallazgo de Claude 2).
`pico_dbtp` es el pico REAL (ebur128 peak=true; ffmpeg lo rotula «dBFS»). `pico_dbfs` se mantiene con el mismo
valor para los lectores antiguos.
"""
import json, os, re, subprocess, sys

sys.path.insert(0, os.path.dirname(__file__))
from ingesta import FF, niveles, sonda  # noqa: E402

PICO_MAX = -1.5   # dBTP, el mismo objetivo que voz.py y el agente (loudnorm de dos pasadas, TP=-1.5)

a = sys.argv[1:]
video = a[0]
opt = lambda n, d: float(a[a.index('--' + n) + 1]) if '--' + n in a else d
s = sonda(video)
v = next((x for x in s['streams'] if x['codec_type'] == 'video'), None)
au = next((x for x in s['streams'] if x['codec_type'] == 'audio'), None)
dur = float(s['format']['duration'])
cmd = [FF, '-hide_banner', '-nostdin', '-i', video, '-vf', 'blackdetect=d=0.1:pix_th=0.05,freezedetect=n=0.003:d=2']
if au: cmd += ['-af', 'silencedetect=noise=-40dB:d=1.2,ebur128=peak=true']
cmd += ['-f', 'null', '-']
p = subprocess.run(cmd, capture_output=True, text=True)
log = p.stderr
negros = re.findall(r'black_start:([\d.]+)', log)
congelados = re.findall(r'freeze_start: ([\d.]+)', log)
silencios = re.findall(r'silence_start: ([\d.]+)', log)
r = log[log.rfind('Summary:'):] if 'Summary:' in log else ''
m_lufs = re.search(r'I:\s+(-?[\d.]+) LUFS', r)
m_pico = re.search(r'Peak:\s+(-?[\d.]+) dBFS', r)
lufs = float(m_lufs.group(1)) if m_lufs else None
pico = float(m_pico.group(1)) if m_pico else None

fallos, avisos, incompleto = [], [], []
if p.returncode != 0: incompleto.append(f'ffmpeg terminó con código {p.returncode}')
# Un MP4 cortado o corrupto: ffmpeg suele acabar con código 0, pero lo dice en el registro.
danos = sorted(set(re.findall(r'(partial file|Invalid data found|Decoding error|Error splitting|moov atom not found|corrupt)', log, re.I)))
if danos:
    fallos.append('archivo dañado o incompleto (' + ', '.join(danos) + ')')
    incompleto.append('el archivo no se pudo leer entero')
if au and lufs is None: incompleto.append('sin medida de sonoridad')
if au and pico is None: incompleto.append('sin medida de pico')

# Voz en un solo canal (la lección más grave de Luis): un canal con voz y el otro casi mudo.
canales = None
if au and (au.get('channels') or 0) >= 2:
    try:
        import numpy as np
        izq, der = (round(float(np.percentile(niveles(video, c), 90)), 1) for c in (0, 1))
        canales = {'izq_db': izq, 'der_db': der}
        if abs(izq - der) > 25: fallos.append(f'voz en un solo canal (izq {izq} dB, der {der} dB)')
    except Exception as e:  # sin numpy o sin poder leer el audio: no se da por bueno
        incompleto.append(f'sin medida por canal ({type(e).__name__})')

if not v: fallos.append('sin vídeo')
elif abs(v['width'] / v['height'] - 9 / 16) > 0.01: fallos.append(f'formato {v["width"]}x{v["height"]}, no es 9:16')
if not au: fallos.append('sin audio')
if not opt('min', 15) <= dur <= opt('max', 90): avisos.append(f'duración {dur:.1f} s fuera del rango pedido')
if negros: avisos.append('fotogramas negros en ' + ', '.join(f'{float(x):.2f}s' for x in negros))
if congelados: avisos.append('imagen congelada desde ' + ', '.join(f'{float(x):.1f}s' for x in congelados))
if silencios: avisos.append('silencios > 1,2 s en ' + ', '.join(f'{float(x):.1f}s' for x in silencios))
if lufs is not None and not -18 <= lufs <= -11: avisos.append(f'sonoridad {lufs} LUFS (para Reels, cerca de -14)')
if pico is not None and pico > PICO_MAX: avisos.append(f'pico {pico} dBTP: riesgo de saturar (objetivo ≤ {PICO_MAX})')
if incompleto: avisos.append('análisis incompleto: ' + '; '.join(incompleto))

print(json.dumps({'veredicto': 'BLOQUEADO' if fallos else 'REVISAR' if avisos else 'APROBADO', 'video': os.path.basename(video),
                  'analisis_ok': not incompleto,
                  'formato': f'{v["width"]}x{v["height"]}' if v else None, 'fps': v.get('r_frame_rate') if v else None,
                  'duracion': round(dur, 2), 'lufs': lufs, 'pico_dbtp': pico, 'pico_dbfs': pico, 'pico_max_dbtp': PICO_MAX,
                  'canales': canales, 'fallos': fallos, 'avisos': avisos}, ensure_ascii=False, indent=1))
