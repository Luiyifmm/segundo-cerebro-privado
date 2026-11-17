"""Logo de la escena 12 (encima de "Glass Health AI"): caja del grupo brillante de arriba (se separa del texto por el primer
hueco de filas vacías). uso: python medir_logo12.py ref.mp4 mio.mp4 offset_mio f_ini f_fin paso"""
import sys, subprocess
import numpy as np
ref, mine, off = sys.argv[1], sys.argv[2], int(sys.argv[3]); fa, fb, st = int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])
W, H = 1920, 1080
def rd(v, n):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", v, "-frames:v", str(n + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
A = rd(ref, fb); B = rd(mine, fb - off)
def logo(img):
    r = img[250:470, 840:1090].astype(np.float32); l = r.mean(2); m = l > 100
    rows = np.nonzero(m.sum(1) >= 2)[0]
    if len(rows) < 2: return None
    grp = [rows[0]]
    for y in rows[1:]:
        if y - grp[-1] > 2: break
        grp.append(y)
    ys = np.array(grp); sub = m[ys.min():ys.max() + 1]; cols = np.nonzero(sub.sum(0) >= 1)[0]
    return cols.min() + 840, ys.min() + 250, cols.max() + 840, ys.max() + 250, l[ys.min():ys.max() + 1][sub].mean()
def fmt(q):
    if q is None: return "   -"
    return "(%4d,%4d)-(%4d,%4d) %3dx%3d c=(%4.0f,%4.0f) luz %3.0f" % (q[0], q[1], q[2], q[3], q[2] - q[0], q[3] - q[1], (q[0] + q[2]) / 2, (q[1] + q[3]) / 2, q[4])
for n in range(fa, fb + 1, st):
    print("f%d  O %s   M %s" % (n, fmt(logo(A[n])), fmt(logo(B[n - off]))))
