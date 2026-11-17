"""Quita el cielo de una foto de paisaje (cielo azul o lavanda, suelo verde o de otro color) y deja PNG con transparencia.
Probado en Tanda 04 · 03 con la colina de Pexels 4112378: borde limpio, sin ribete del color del cielo.

- Llave por diferencia de color G-B: en el cielo G-B ≈ -30; en la hierba G-B ≈ +80. alfa = (G-B - T0)/(T1-T0).
  (Para suelos que no son verdes, cambia la diferencia: p. ej. R-B para tierra o roca.)
- Horizonte por columna: la primera fila con 5 píxeles seguidos de suelo; nada de «suelo» suelto por encima.
- En el borde los píxeles son mezcla: se «desmezclan» con el color del cielo de esa columna (F = (C - (1-alfa)·S)/alfa),
  así no queda un ribete del color del cielo alrededor del suelo.
- Recorta desde `margen` px por encima de la cima hasta abajo.
Uso: python quitar_cielo.py foto.jpg salida.png [T0=-10] [T1=40] [margen=100]
"""
import sys

import numpy as np
from PIL import Image

foto, salida = sys.argv[1], sys.argv[2]
T0 = float(sys.argv[3]) if len(sys.argv) > 3 else -10.0
T1 = float(sys.argv[4]) if len(sys.argv) > 4 else 40.0
MARGEN = int(sys.argv[5]) if len(sys.argv) > 5 else 100
im = np.asarray(Image.open(foto).convert("RGB")).astype(np.float32)
H, W, _ = im.shape
alfa = np.clip((im[..., 1] - im[..., 2] - T0) / (T1 - T0), 0, 1)

suelo = alfa > 0.5
horiz = np.zeros(W, dtype=int)
for x in range(W):
    run = np.convolve(suelo[:, x].astype(int), np.ones(5, dtype=int), mode="valid")
    ys = np.nonzero(run == 5)[0]
    horiz[x] = ys[0] if len(ys) else H - 1
alfa[np.arange(H)[:, None] < (horiz[None, :] - 6)] = 0

cielo = np.stack([np.median(im[max(0, horiz[x] - 40):max(1, horiz[x] - 20), x], axis=0) for x in range(W)])
a = alfa[..., None]
F = np.where(a > 0.02, (im - (1 - a) * cielo[None, :, :]) / np.maximum(a, 0.02), im)
F = np.clip(F, 0, 255)

arriba = max(0, int(horiz.min()) - MARGEN)
rgba = np.dstack([F, alfa * 255])[arriba:].round().astype(np.uint8)
Image.fromarray(rgba, "RGBA").save(salida)
print("OK", salida, rgba.shape[1], "x", rgba.shape[0], "| cima en y =", int(horiz.min()) - arriba,
      "| horizonte (foto) min/max", int(horiz.min()), int(horiz.max()))
