"""Orientación aparente del anillo 3D por fotograma: elipse equivalente (momentos) de los píxeles del anillo (azules y brillantes).
Da centro, eje mayor, eje menor, razón menor/mayor (≈ cos de la inclinación) y ángulo del eje mayor en pantalla.
uso: python elipse_anillo.py ref.mp4 mio.mp4 offset x0,y0,x1,y1 f_ini f_fin [paso]"""
import sys, subprocess, math
import numpy as np
ref, mine, off = sys.argv[1], sys.argv[2], int(sys.argv[3]); x0, y0, x1, y1 = [int(v) for v in sys.argv[4].split(",")]
fa, fb = int(sys.argv[5]), int(sys.argv[6]); step = int(sys.argv[7]) if len(sys.argv) > 7 else 1
W, H = 1920, 1080
def read(vid, n):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-frames:v", str(n + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
A = read(ref, off + fb); B = read(mine, fb)
def elipse(img):
    r = img[y0:y1, x0:x1].astype(np.float32)
    bg = np.median(r.reshape(-1, 3), 0)
    m = ((r[:, :, 2] - bg[2]) > 45) & (r[:, :, 2] > 90) & ((r[:, :, 2] - r[:, :, 0]) > 55)
    ys, xs = np.nonzero(m)
    if len(xs) < 50: return None
    cx, cy = xs.mean(), ys.mean(); dx, dy = xs - cx, ys - cy
    cov = np.array([[np.mean(dx * dx), np.mean(dx * dy)], [np.mean(dx * dy), np.mean(dy * dy)]])
    w, v = np.linalg.eigh(cov); a, b = 2 * math.sqrt(w[1]), 2 * math.sqrt(max(w[0], 1e-6))
    ang = math.degrees(math.atan2(v[1, 1], v[0, 1]))
    if ang > 90: ang -= 180
    if ang < -90: ang += 180
    return cx + x0, cy + y0, a, b, b / a, ang, len(xs)
print("fot   ORIGINAL centro  ejeM  ejem  razón  ángulo        MÍO")
for n in range(fa, fb + 1, step):
    e1 = elipse(A[off + n]); e2 = elipse(B[n])
    f = lambda e: "(%4.0f,%4.0f) %5.0f %5.0f  %.2f  %+6.1f°" % e[:6] if e else "   -"
    print("n%2d   %s      %s" % (n, f(e1), f(e2)))
