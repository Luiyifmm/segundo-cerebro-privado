"""Compara colores de puntos entre la referencia y mi render.
uso: python muestras.py ref.mp4 mio.mp4 offset_ref "f1,f2,..." "x,y;x,y;..." [radio]
(f = fotograma de MI vídeo; la referencia usa f + offset_ref)"""
import sys, subprocess
import numpy as np

ref, mine, off = sys.argv[1], sys.argv[2], int(sys.argv[3])
frames = [int(v) for v in sys.argv[4].split(",")]
pts = [tuple(int(float(c)) for c in p.split(",")) for p in sys.argv[5].split(";")]
R = int(sys.argv[6]) if len(sys.argv) > 6 else 6
W, H = 1920, 1080

def read(vid, n):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-frames:v", str(n + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)

A = read(ref, off + max(frames)); B = read(mine, max(frames))
def col(img, x, y):
    c = img[max(0, y - R):y + R + 1, max(0, x - R):x + R + 1].reshape(-1, 3).mean(0)
    return c
for f in frames:
    a = A[off + f].astype(np.float32); b = B[f].astype(np.float32)
    print("f%d (ref %d)  media ref %.1f  mía %.1f" % (f, off + f, a.mean(), b.mean()))
    for (x, y) in pts:
        ca, cb = col(a, x, y), col(b, x, y)
        print("   (%4d,%4d)  ref #%02X%02X%02X  mía #%02X%02X%02X   dif lum %+.0f" % (x, y, *[int(v) for v in ca], *[int(v) for v in cb], cb.mean() - ca.mean()))
