"""Color del texto "Glass Health AI" a lo largo de x (y por filas), original vs mío: solo píxeles del texto (los más claros
de cada tramo). uso: python color_texto12.py ref.mp4 mio.mp4 offset_mio fotograma"""
import sys, subprocess
import numpy as np
ref, mine, off, f = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
W, H = 1920, 1080
def fr(v, n):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", v, "-vf", "select=eq(n\\,%d)" % n, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(H, W, 3).astype(np.float32)
A = fr(ref, f); B = fr(mine, f - off)
def perfil(img, y0, y1):
    out = []
    for x in range(440, 1480, 80):
        r = img[y0:y1, x:x + 80].reshape(-1, 3); l = r.mean(1); m = l > np.percentile(l, 75)
        c = r[m].mean(0) if m.sum() > 10 else np.zeros(3); out.append("#%02X%02X%02X" % tuple(int(v) for v in c))
    return " ".join(out)
print("x:     " + " ".join("%-7d" % x for x in range(440, 1480, 80)))
for (y0, y1, nm) in ((500, 515, "arriba"), (520, 540, "medio"), (545, 560, "abajo")):
    print("%-6s O %s" % (nm, perfil(A, y0, y1))); print("%-6s M %s" % ("", perfil(B, y0, y1)))
