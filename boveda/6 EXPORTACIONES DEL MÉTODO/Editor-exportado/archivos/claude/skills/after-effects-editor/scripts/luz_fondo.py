"""Luminancia media del FONDO por zonas (rejilla 6x4), sin contar los paneles (máscara = mi render sin fondo).
uso: python luz_fondo.py ref.mp4 mio.mp4 mascara.mp4 offset f1 f2 ...   (f = fotograma de mi vídeo)"""
import sys, subprocess
import numpy as np
ref, mine, mask, off = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]); frames = [int(v) for v in sys.argv[5:]]
W, H = 1920, 1080
def read(vid, n):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-frames:v", str(n + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
A = read(ref, off + max(frames)); B = read(mine, max(frames)); Mk = read(mask, max(frames))
GX, GY = 6, 4
for n in frames:
    a = A[off + n].astype(np.float32); b = B[n].astype(np.float32); m = Mk[n].astype(np.float32).mean(2) < 5
    m[0:80, 0:260] = False
    print("f%d (ref %d)   celdas: ORIGINAL / MÍA  (luminancia media del fondo; '--' = tapado)" % (n, off + n))
    for gy in range(GY):
        row = []
        for gx in range(GX):
            ys, xs = slice(gy * H // GY, (gy + 1) * H // GY), slice(gx * W // GX, (gx + 1) * W // GX)
            mm = m[ys, xs]
            if mm.mean() < 0.15: row.append("   --   "); continue
            la = a[ys, xs][mm].mean(); lb = b[ys, xs][mm].mean(); row.append("%3.0f/%3.0f " % (la, lb))
        print("   " + " ".join(row))
