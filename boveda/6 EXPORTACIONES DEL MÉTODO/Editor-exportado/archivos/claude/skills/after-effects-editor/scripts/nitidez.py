"""Brillo y nitidez de una región (p. ej. un título): percentiles de luminancia y energía del borde (gradiente).
uso: python nitidez.py ref.mp4 mio.mp4 offset x0 y0 x1 y1 f1 f2 ...
Nitidez = media del gradiente en los píxeles de borde (los del 5 % con más gradiente). Desenfocado -> número bajo."""
import sys, subprocess
import numpy as np
ref, mine, off = sys.argv[1], sys.argv[2], int(sys.argv[3])
x0, y0, x1, y1 = [int(v) for v in sys.argv[4:8]]; frames = [int(v) for v in sys.argv[8:]]
W, H = 1920, 1080
def read(vid, n):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-frames:v", str(n + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
A = read(ref, off + max(frames)); B = read(mine, max(frames))
def med(img):
    r = img[y0:y1, x0:x1].astype(np.float32); lum = r.mean(2)
    gy, gx = np.gradient(lum); g = np.hypot(gx, gy); edge = g[g >= np.percentile(g, 95)].mean()
    top = r.reshape(-1, 3)[lum.reshape(-1) >= np.percentile(lum, 97)].mean(0)
    return np.percentile(lum, 50), np.percentile(lum, 97), np.percentile(lum, 99.5), edge, top
print("fot   ORIGINAL p50 p97 p99.5 borde  color(top3%)          MÍO")
for n in frames:
    a = med(A[off + n]); b = med(B[n])
    fm = lambda m: "%3.0f %3.0f %3.0f  %5.1f  #%02X%02X%02X" % (m[0], m[1], m[2], m[3], int(m[4][0]), int(m[4][1]), int(m[4][2]))
    print("n%2d   %s        %s" % (n, fm(a), fm(b)))
