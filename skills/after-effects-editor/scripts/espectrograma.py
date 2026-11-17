"""espectrograma.py — espectrograma (20 Hz – 16 kHz, eje logarítmico) + forma de onda de un WAV, con marcas rojas
en los instantes de un "mapa del sonido" (líneas "  1.80 s  nombre"). Sirve para revisar un diseño de sonido
SIN oírlo: ¿cae cada golpe en su segundo? ¿hay huecos o tramos flojos?

Uso: python espectrograma.py sonido.wav "mapa del sonido.txt" salida.png
(Probado con el sonido de "La IA dominará el mundo", Tanda 03 · 01.)
"""
import math
import sys
import wave

import numpy as np
from PIL import Image, ImageDraw

ruta, mapa, salida = sys.argv[1], sys.argv[2], sys.argv[3]
with wave.open(ruta) as w:
    sr = w.getframerate(); n = w.getnframes(); ch = w.getnchannels()
    x = np.frombuffer(w.readframes(n), dtype="<i2").reshape(-1, ch).astype(float) / 32768
m = x.mean(axis=1)
W, H1, H2 = 2000, 520, 200
hop = len(m) // W
win = 4096
spec = np.zeros((win // 2, W))
ventana = np.hanning(win)
for i in range(W):
    seg = m[i * hop:i * hop + win]
    if len(seg) < win:
        seg = np.pad(seg, (0, win - len(seg)))
    spec[:, i] = np.abs(np.fft.rfft(seg * ventana))[:win // 2]
f = np.fft.rfftfreq(win, 1 / sr)[:win // 2]
ys = np.geomspace(20, 16000, H1)
filas = np.searchsorted(f, ys).clip(0, win // 2 - 1)
S = 20 * np.log10(spec[filas][::-1] + 1e-9)
S = np.clip((S + 30) / 70, 0, 1)
img = Image.new("RGB", (W, H1 + H2 + 30), (10, 10, 14))
col = (np.stack([S ** 0.8 * 255, S ** 1.6 * 200, (1 - S) * S * 4 * 180], axis=-1)).astype(np.uint8)
img.paste(Image.fromarray(col), (0, 0))
d = ImageDraw.Draw(img)
for i in range(W):                                   # forma de onda: pico (oscuro) y RMS (claro) por columna
    seg = np.abs(m[i * hop:(i + 1) * hop])
    p = seg.max() if len(seg) else 0
    r = math.sqrt(np.mean(seg ** 2)) if len(seg) else 0
    y0 = H1 + H2 // 2
    d.line([(i, y0 - p * H2 / 2), (i, y0 + p * H2 / 2)], fill=(90, 110, 160))
    d.line([(i, y0 - r * H2 / 2), (i, y0 + r * H2 / 2)], fill=(170, 200, 255))
dur = len(m) / sr
for s in range(int(dur) + 1):
    X = s / dur * W
    d.line([(X, 0), (X, H1 + H2)], fill=(80, 80, 80))
    d.text((X + 3, H1 + H2 + 8), "%d s" % s, fill=(200, 200, 200))
for linea in open(mapa, encoding="utf-8"):
    try:                                   # solo las líneas "  1.80 s  nombre" (un título u otra línea se salta)
        X = float(linea.strip().split(" ")[0].replace(",", ".")) / dur * W
    except ValueError:
        continue
    d.line([(X, H1 - 18), (X, H1)], fill=(255, 80, 80), width=2)
for fr in [50, 100, 500, 1000, 5000, 10000]:
    Y = H1 - 1 - np.searchsorted(ys, fr)
    d.text((4, Y - 6), "%g Hz" % fr, fill=(230, 230, 230))
img.save(salida)
print("ok", img.size)
