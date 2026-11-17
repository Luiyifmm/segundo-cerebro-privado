"""Frase de la escena 10-11 por fotograma: bordes del texto blanco (izquierdo / derecho), huecos entre palabras
(para situar cada palabra) y centro del anillo azul. uso: python medir_frase.py video.mp4 offset f_ini f_fin [y0 y1]"""
import sys, subprocess
import numpy as np
vid, off, fa, fb = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
y0, y1 = (int(sys.argv[5]), int(sys.argv[6])) if len(sys.argv) > 6 else (500, 580)
W, H = 1920, 1080
p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-frames:v", str(fb - off + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
A = np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
print("fot   texto izq-der   bloques de texto (x ini-fin)                         anillo (x, y)")
for f in range(fa, fb + 1):
    img = A[f - off][y0:y1].astype(np.float32); r, g, b = img[:, :, 0], img[:, :, 1], img[:, :, 2]
    txt = (r > 150) & (g > 150) & (b > 150) & ((b - r) < 60)
    ring = ((b - r) > 60) & (b > 110)
    cols = txt.sum(0) >= 2; xs = np.nonzero(cols)[0]
    s = "f%d  " % f
    if len(xs):
        # bloques separados por huecos de más de 14 px (espacio entre palabras)
        bl = []; st = xs[0]; pv = xs[0]
        for x in xs[1:]:
            if x - pv > 14: bl.append((st, pv)); st = x
            pv = x
        bl.append((st, pv))
        s += "%4d-%4d   %-52s" % (xs.min(), xs.max(), " ".join("%d-%d" % q for q in bl[:5]))
    else: s += "   -                                                              "
    ys, xr = np.nonzero(ring)
    s += "  (%4.0f, %4.0f) n=%d" % (xr.mean(), ys.mean() + y0, len(xr)) if len(xr) > 30 else "  -"
    print(s)
