"""Rastrea la cabeza del artista en el recorte (canal alfa): la cabeza es la parte más alta de la silueta.
Sustituye al "rastrear movimiento → estabilizar" de la clase (el rastreador de AE no se puede lanzar por script).
Uso: python rastrear_cabeza.py recorte.mov t0_clip velocidad n_fotogramas salida.json [fps_comp=30]
Devuelve, para cada fotograma de la comp, el punto de la cabeza (en píxeles 1920×1080), ya suavizado.
"""
import json
import subprocess
import sys

import numpy as np

vid, t0, vel, n, out = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
fps = float(sys.argv[6]) if len(sys.argv) > 6 else 30.0
W, H = 1920, 1080
dur = n / fps * vel + 0.2
# todos los fotogramas (60 fps) del tramo, solo el alfa
p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", f"{max(0, t0 - 0.05):.3f}", "-i", vid, "-t", f"{dur:.3f}",
                    "-vf", "alphaextract", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True)
A = np.frombuffer(p.stdout, np.uint8)
m = A.size // (W * H)
A = A[: m * W * H].reshape(m, H, W)
t_src = max(0, t0 - 0.05) + np.arange(m) / 60.0
puntos = []
for k in range(m):
    mk = A[k] > 128
    filas = np.nonzero(mk.sum(axis=1) >= 12)[0]
    if filas.size == 0:
        puntos.append((np.nan, np.nan)); continue
    y_top = filas[0]
    xs_top = np.nonzero(mk[y_top:y_top + 6].any(axis=0))[0]
    x_top = np.median(xs_top)
    y0, y1 = y_top, min(H, y_top + 210)
    x0, x1 = int(max(0, x_top - 170)), int(min(W, x_top + 170))
    zona = mk[y0:y1, x0:x1]
    yy, xx = np.nonzero(zona)
    puntos.append((xx.mean() + x0, yy.mean() + y0))
P = np.array(puntos, dtype=float)
# rellenar huecos y suavizar (media móvil de 7 fotogramas a 60 fps ≈ 3,5 de la comp): quita el temblor del rastreo
for c in range(2):
    v = P[:, c]; ok = ~np.isnan(v)
    P[:, c] = np.interp(np.arange(m), np.nonzero(ok)[0], v[ok])
k = 7
ker = np.ones(k) / k
Ps = np.vstack([np.convolve(np.pad(P[:, c], (k // 2, k // 2), mode="edge"), ker, mode="valid") for c in range(2)]).T
# muestrear en los instantes de cada fotograma de la comp
tc = t0 + np.arange(n) / fps * vel
res = [[round(float(np.interp(t, t_src, Ps[:, 0])), 1), round(float(np.interp(t, t_src, Ps[:, 1])), 1)] for t in tc]
salto = np.abs(np.diff(np.array(res), axis=0)).max(axis=0)
json.dump(res, open(out, "w"))
print(f"{n} puntos · x {min(r[0] for r in res):.0f}–{max(r[0] for r in res):.0f} · y {min(r[1] for r in res):.0f}–{max(r[1] for r in res):.0f} · salto máx por fotograma {salto.round(1)}")
