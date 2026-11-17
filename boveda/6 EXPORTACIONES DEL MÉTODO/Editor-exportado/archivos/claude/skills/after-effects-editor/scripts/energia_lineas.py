"""Energía de líneas finas (paso alto) y luz media por regiones, original vs mío. Sirve para igualar lo marcadas que se ven
las hebras (contraste) por separado del brillo del fondo (neblina).
uso: python energia_lineas.py ref.mp4 mio.mp4 offset "nombre:x0,y0,x1,y1;nombre2:..." f1 f2 ..."""
import sys, subprocess
import numpy as np
from PIL import Image, ImageFilter
ref, mine, off = sys.argv[1], sys.argv[2], int(sys.argv[3])
regs = [(r.split(":")[0], [int(v) for v in r.split(":")[1].split(",")]) for r in sys.argv[4].split(";")]
frames = [int(v) for v in sys.argv[5:]]
W, H = 1920, 1080
def read(vid, n):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-frames:v", str(n + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
A = read(ref, off + max(frames)); B = read(mine, max(frames))
def med(a):
    im = Image.fromarray(a).convert("L"); g = np.asarray(im, np.float32); b = np.asarray(im.filter(ImageFilter.GaussianBlur(5)), np.float32)
    h = np.clip(g - b, 0, None); out = {}
    for nm, (x0, y0, x1, y1) in regs: out[nm] = (h[y0:y1, x0:x1].mean(), np.percentile(h[y0:y1, x0:x1], 99), b[y0:y1, x0:x1].mean())
    return out
print("región: energía media de líneas / p99 de líneas / luz media (desenfocada)   ORIGINAL -> MÍO")
for n in frames:
    a = med(A[off + n]); b = med(B[n])
    print("n%d  " % n + "   ".join("%s %.2f/%.0f/%.0f -> %.2f/%.0f/%.0f" % (nm, a[nm][0], a[nm][1], a[nm][2], b[nm][0], b[nm][1], b[nm][2]) for nm, _ in regs))
