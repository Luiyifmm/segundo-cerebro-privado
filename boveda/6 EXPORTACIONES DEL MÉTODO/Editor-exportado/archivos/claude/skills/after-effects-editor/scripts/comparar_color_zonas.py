"""Color medio por zonas de DOS imágenes (el plano del profe y el nuestro), para igualar el etalonaje con números.
Las zonas van en fracciones del cuadro. La imagen del profe puede ser un recorte del visor de su grabación:
se le pasa la caja del visor en píxeles (x0,y0,x1,y1) y se escala a 1920x1080.
Uso: python comparar_color_zonas.py profe.jpg nuestro.png "x0,y0,x1,y1"|- "nombre:fx0,fy0,fx1,fy1" ...
  p. ej. ... "2,22,960,559" "cielo:0.40,0.03,0.60,0.15" "hierba:0.65,0.62,0.85,0.75"
Tanda 04 · 03: cielo del profe (196,231,241) frente al nuestro (124,166,208) → había que aclarar y llevar a cian.
"""
import sys

import numpy as np
from PIL import Image

profe = Image.open(sys.argv[1]).convert("RGB")
if sys.argv[3] != "-":
    profe = profe.crop(tuple(int(v) for v in sys.argv[3].split(",")))
profe = profe.resize((1920, 1080))
nuestro = Image.open(sys.argv[2]).convert("RGB").resize((1920, 1080))
for z in sys.argv[4:]:
    nombre, caja = z.split(":")
    x0, y0, x1, y1 = (float(v) for v in caja.split(","))
    fila = []
    for im in (profe, nuestro):
        a = np.asarray(im.crop((int(x0 * 1920), int(y0 * 1080), int(x1 * 1920), int(y1 * 1080)))).reshape(-1, 3)
        m = a.mean(axis=0)
        fila.append("(%3d %3d %3d) luz %3d" % (m[0], m[1], m[2], a.mean()))
    print("%-22s profe %s | nuestro %s" % (nombre, fila[0], fila[1]))
