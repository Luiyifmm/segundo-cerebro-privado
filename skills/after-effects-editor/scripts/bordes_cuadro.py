"""Recortes a tamaño real de las esquinas y el centro de los bordes de un fotograma (arriba y abajo), en una hoja.
Sirve para ver artefactos de los efectos en el borde del cuadro: p. ej. VR Chromatic Aberrations deja una raya azul de
~5 px arriba y abajo (no hay imagen fuera del cuadro con qué rellenar). Tanda 04 · 03.
Uso: python bordes_cuadro.py fotograma.png salida.jpg
"""
import sys

from PIL import Image

im = Image.open(sys.argv[1]).convert("RGB")
W, H = im.size
zonas = [(0, 0, 480, 160), (W // 2 - 240, 0, W // 2 + 240, 160), (W - 480, 0, W, 160),
         (0, H - 160, 480, H), (W // 2 - 240, H - 160, W // 2 + 240, H), (W - 480, H - 160, W, H)]
hoja = Image.new("RGB", (480 * 3 + 20, 160 * 2 + 10), (255, 0, 255))
for i, z in enumerate(zonas):
    hoja.paste(im.crop(z), ((i % 3) * 490, (i // 3) * 170))
hoja.save(sys.argv[2], quality=92)
print("OK", sys.argv[2])
