"""Caja de lo que brilla (luminancia > umbral) dentro de una región, por fotograma: sirve para seguir un título o un logo.
uso: python caja_brillante.py ref.mp4 mio.mp4 offset x0,y0,x1,y1 umbral f_ini f_fin [paso]"""
import sys, subprocess
import numpy as np
ref, mine, off = sys.argv[1], sys.argv[2], int(sys.argv[3]); x0, y0, x1, y1 = [int(v) for v in sys.argv[4].split(",")]
thr, fa, fb = float(sys.argv[5]), int(sys.argv[6]), int(sys.argv[7]); step = int(sys.argv[8]) if len(sys.argv) > 8 else 1
W, H = 1920, 1080
def read(vid, n):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-frames:v", str(n + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
A = read(ref, off + fb); B = read(mine, fb)
def caja(img):
    l = img[y0:y1, x0:x1].astype(np.float32).mean(2); m = l > thr
    r = np.nonzero(m.sum(1) >= 3)[0]; c = np.nonzero(m.sum(0) >= 2)[0]
    if len(r) < 2: return None
    return c.min() + x0, r.min() + y0, c.max() + x0, r.max() + y0
print("fot   ORIGINAL izq arr der abj (ancho x alto)          MÍO")
for n in range(fa, fb + 1, step):
    a = caja(A[off + n]); b = caja(B[n])
    f = lambda q: "%4d %4d %4d %4d (%4d x %3d)" % (q[0], q[1], q[2], q[3], q[2] - q[0], q[3] - q[1]) if q else "   -"
    print("n%2d   %s      %s" % (n, f(a), f(b)))
