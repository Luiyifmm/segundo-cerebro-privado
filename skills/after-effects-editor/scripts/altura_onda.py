"""Altura de la onda en una franja vertical (centro de la luz y rango) por fotograma, original vs mío.
uso: python altura_onda.py ref.mp4 mio.mp4 offset x0 x1 f_ini f_fin"""
import sys, subprocess
import numpy as np
ref, mine, off, x0, x1, fa, fb = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6]), int(sys.argv[7])
W, H = 1920, 1080
def read(vid, n):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-frames:v", str(n + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
A = read(ref, off + fb); B = read(mine, fb)
def perfil(img):
    col = img[:, x0:x1].astype(np.float32).mean(2).mean(1)      # luminancia por fila
    base = np.percentile(col, 20); c = np.maximum(col - base, 0)
    if c.sum() < 1: return None
    ys = np.arange(H); cen = (ys * c).sum() / c.sum()
    thr = c.max() * 0.5; on = np.nonzero(c > thr)[0]
    return cen, on.min(), on.max(), c.max()
print("fot   ORIGINAL (centro, rango >50%%, pico)        MÍO")
for n in range(fa, fb + 1, 2):
    a = perfil(A[off + n]); b = perfil(B[n])
    fa_ = "%6.0f [%4d-%4d] %5.1f" % a if a else "   -"; fb_ = "%6.0f [%4d-%4d] %5.1f" % b if b else "   -"
    print("n%2d  %s     %s" % (n, fa_, fb_))
