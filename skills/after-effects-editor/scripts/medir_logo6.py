"""Tamaño del logo (punto -> flor -> nudo) de la escena 6 por fotograma: extensión vertical y borde izquierdo de lo que brilla
en una ventana a la izquierda del título. uso: python medir_logo6.py ref.mp4 mio.mp4 offset x0 y0 x1 y1 f_ini f_fin"""
import sys, subprocess
import numpy as np
ref, mine, off = sys.argv[1], sys.argv[2], int(sys.argv[3])
x0, y0, x1, y1, fa, fb = [int(v) for v in sys.argv[4:10]]
W, H = 1920, 1080
def read(vid, n):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-frames:v", str(n + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
A = read(ref, off + fb); B = read(mine, fb)
def medir(img):
    r = img[y0:y1, x0:x1].astype(np.float32); lum = r.mean(2)
    bg = np.median(lum); m = lum > bg + 28
    rows = np.nonzero(m.sum(1) >= 2)[0]; cols = np.nonzero(m.sum(0) >= 2)[0]
    if len(rows) < 2: return None
    return rows.min() + y0, rows.max() + y0, cols.min() + x0, lum[m].mean()
print("fot  ORIGINAL (alto, centro y, borde izq, luz)     MÍO")
for n in range(fa, fb + 1):
    a = medir(A[off + n]); b = medir(B[n])
    fa_ = "alto %3d  cy %4.0f  izq %4d  luz %3.0f" % (a[1] - a[0], (a[0] + a[1]) / 2, a[2], a[3]) if a else "   -"
    fb_ = "alto %3d  cy %4.0f  izq %4d  luz %3.0f" % (b[1] - b[0], (b[0] + b[1]) / 2, b[2], b[3]) if b else "   -"
    print("n%2d  %s     %s" % (n, fa_, fb_))
