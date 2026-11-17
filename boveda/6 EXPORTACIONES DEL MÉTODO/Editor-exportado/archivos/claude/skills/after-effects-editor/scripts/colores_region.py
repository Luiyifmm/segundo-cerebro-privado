"""Color medio y color de lo más brillante (3 %) de varias regiones, original vs mío.
uso: python colores_region.py ref.mp4 mio.mp4 offset "nombre:x0,y0,x1,y1;..." f1 f2 ..."""
import sys, subprocess
import numpy as np
ref, mine, off = sys.argv[1], sys.argv[2], int(sys.argv[3])
regs = [(r.split(":")[0], [int(v) for v in r.split(":")[1].split(",")]) for r in sys.argv[4].split(";")]
frames = [int(v) for v in sys.argv[5:]]
W, H = 1920, 1080
def read(vid, n):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-frames:v", str(n + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
A = read(ref, off + max(frames)); B = read(mine, max(frames))
def hx(c): return "#%02X%02X%02X" % tuple(int(v) for v in c)
for n in frames:
    print("n%d" % n)
    for nm, (x0, y0, x1, y1) in regs:
        out = []
        for img in (A[off + n], B[n]):
            r = img[y0:y1, x0:x1].reshape(-1, 3).astype(np.float32); l = r.mean(1)
            out.append("media %s  brillo3%% %s" % (hx(r.mean(0)), hx(r[l >= np.percentile(l, 97)].mean(0))))
        print("   %-10s ORIGINAL %s    MÍO %s" % (nm, out[0], out[1]))
