"""Banda de la onda de fondo por columnas: filas donde hay hebras (paso alto), fuera de un rectángulo tapado (panel + título).
uso: python banda_onda.py video.mp4 fotograma  x0,y0,x1,y1(tapado)  [paso]
Imprime por columna: fila mínima, máxima y centro de la energía de líneas, y el número de hebras (picos)."""
import sys, subprocess
import numpy as np
from PIL import Image, ImageFilter
vid, fr = sys.argv[1], int(sys.argv[2]); bx0, by0, bx1, by1 = [int(v) for v in sys.argv[3].split(",")]; step = int(sys.argv[4]) if len(sys.argv) > 4 else 40
W, H = 1920, 1080
p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-vf", "select=eq(n\\,%d)" % fr, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
a = np.frombuffer(p.stdout, np.uint8).reshape(H, W, 3)
im = Image.fromarray(a).convert("L"); g = np.asarray(im, np.float32); b = np.asarray(im.filter(ImageFilter.GaussianBlur(5)), np.float32)
h = np.clip(g - b, 0, None); h[by0:by1, bx0:bx1] = 0; h[:60, :] = 0
thr = 2.2
for x in range(10, W, step):
    col = h[:, max(0, x - 6):x + 6].mean(1)
    col = np.convolve(col, np.ones(3) / 3, "same"); on = np.nonzero(col > thr)[0]
    if len(on) < 3: print("x%4d   -" % x); continue
    # picos (hebras) separados >= 5 px
    pk = [i for i in range(2, H - 2) if col[i] > thr and col[i] >= col[i - 1] and col[i] >= col[i + 1] and col[i] >= col[i - 2] and col[i] >= col[i + 2]]
    cen = (np.arange(H) * np.where(col > thr, col, 0)).sum() / np.where(col > thr, col, 0).sum()
    print("x%4d   filas %4d-%4d  centro %5.0f  hebras %2d  %s" % (x, on.min(), on.max(), cen, len(pk), " ".join(str(v) for v in pk[:14])))
