"""Perfil vertical de color en unas columnas de un PNG (para ver el horizonte suelo/fondo)."""
import sys

import numpy as np
from PIL import Image

a = np.asarray(Image.open(sys.argv[1]).convert("RGB")).astype(int)
cols = [int(x) for x in sys.argv[2].split(",")]
y0, y1, paso = [int(v) for v in sys.argv[3].split(",")]
for y in range(y0, y1, paso):
    fila = " | ".join("%3d %3d %3d" % tuple(a[y, x]) for x in cols)
    print("y %4d : %s" % (y, fila))
