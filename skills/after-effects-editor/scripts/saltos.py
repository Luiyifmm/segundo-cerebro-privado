"""Saltos entre fotogramas (diferencia media absoluta, a 1/4 de resolución) del original y de la réplica, para encontrar
"pops" o parpadeos que el original no tiene. uso: python saltos.py ref.mp4 mio.mp4 [umbral]"""
import sys, subprocess
import numpy as np
ref, mine = sys.argv[1], sys.argv[2]; thr = float(sys.argv[3]) if len(sys.argv) > 3 else 6
W, H = 480, 270
def rd(v):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", v, "-vf", "scale=%d:%d" % (W, H), "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W).astype(np.float32)
A = rd(ref); B = rd(mine); n = min(len(A), len(B))
da = np.abs(np.diff(A[:n], axis=0)).mean((1, 2)); db = np.abs(np.diff(B[:n], axis=0)).mean((1, 2))
print("fotogramas %d | cortes del original (salto > 12): %s" % (n, " ".join(str(i + 1) for i in np.nonzero(da > 12)[0])))
print("saltos de la réplica que el original no tiene (dif. > %.0f y > 2x el original):" % thr)
for i in range(len(db)):
    if db[i] > thr and db[i] > 2 * da[i] + 2: print("   f%d -> f%d   réplica %.1f   original %.1f" % (i, i + 1, db[i], da[i]))
