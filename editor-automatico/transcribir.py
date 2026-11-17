"""Transcribe un vídeo con marcas de tiempo por palabra (mlx-whisper, en el Mac).
Uso: uv run --with mlx-whisper python transcribir.py VIDEO [SALIDA.json]
Primero corta el audio en tramos con voz (silencedetect) y transcribe cada tramo por separado:
así Whisper no se salta frases dichas en voz baja después de un silencio largo.
Escribe SALIDA.json (segmentos + palabras, tiempos del vídeo original) y SALIDA.txt legible."""
import sys, json, os, re, subprocess
import mlx_whisper
from mlx_whisper.audio import load_audio, SAMPLE_RATE

src = sys.argv[1]
out = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(src)[0] + '.transcripcion.json'
audio = load_audio(src)
dur = len(audio) / SAMPLE_RATE

# Tramos con voz: lo que no es silencio a -40 dB durante más de 0,5 s
e = subprocess.run(['ffmpeg', '-i', src, '-vn', '-af', 'silencedetect=n=-40dB:d=0.5', '-f', 'null', '-'],
                   capture_output=True, text=True).stderr
ini = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', e)]
fin = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]
tramos, t = [], 0.0
for a, b in zip(ini, fin + [dur] * (len(ini) - len(fin))):
    if a - t > 0.25: tramos.append([t, a])
    t = b
if dur - t > 0.25: tramos.append([t, dur])
# Unir tramos separados por menos de 1 s y dar margen
unidos = []
for a, b in tramos:
    if unidos and a - unidos[-1][1] < 1.0: unidos[-1][1] = b
    else: unidos.append([a, b])
unidos = [[max(0, a - 0.2), min(dur, b + 0.2)] for a, b in unidos]

segs = []
for a, b in unidos:
    trozo = audio[int(a * SAMPLE_RATE):int(b * SAMPLE_RATE)]
    r = mlx_whisper.transcribe(trozo, path_or_hf_repo='mlx-community/whisper-large-v3-turbo-q4', language='es',
                               word_timestamps=True, condition_on_previous_text=False,
                               no_speech_threshold=0.95, logprob_threshold=None)
    for s in r['segments']:
        palabras = [{'w': w['word'].strip(), 's': round(a + w['start'], 2), 'e': round(a + w['end'], 2)}
                    for w in s.get('words', [])]
        if not palabras: continue
        segs.append({'start': palabras[0]['s'], 'end': palabras[-1]['e'], 'text': s['text'].strip(), 'words': palabras})

json.dump({'segments': segs, 'tramos_voz': unidos}, open(out, 'w'), ensure_ascii=False, indent=1)
with open(os.path.splitext(out)[0] + '.txt', 'w') as f:
    for s in segs: f.write(f"[{int(s['start']//60):02d}:{s['start']%60:05.2f}] {s['text']}\n")
print(out)
