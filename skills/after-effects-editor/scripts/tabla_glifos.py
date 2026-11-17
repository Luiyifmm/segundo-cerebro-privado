"""Hojas con todos los glifos de una fuente de iconos y su código (para elegir iconos sin descargar nada).
Sin fontTools (no está instalado): un código existe si su dibujo no está vacío y no es igual al del «glifo que falta».
Segoe Fluent Icons (Windows 11) tiene ~1540 glifos entre E700 y F8FF → 7 hojas de 240.
Uso: python tabla_glifos.py carpeta_salida [fuente.ttf] [desde_hex] [hasta_hex]
"""
import os
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFont

salida = sys.argv[1]
ruta = sys.argv[2] if len(sys.argv) > 2 else r"C:\Windows\Fonts\SegoeIcons.ttf"
desde = int(sys.argv[3], 16) if len(sys.argv) > 3 else 0xE700
hasta = int(sys.argv[4], 16) if len(sys.argv) > 4 else 0xF8FF
os.makedirs(salida, exist_ok=True)
f = ImageFont.truetype(ruta, 30)
fl = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 11)


def dibujo(c):
    im = Image.new("L", (48, 48), 0)
    ImageDraw.Draw(im).text((8, 4), chr(c), font=f, fill=255)
    return im


falta = dibujo(0xE000)
codigos = [c for c in range(desde, hasta) if dibujo(c).getbbox() is not None and ImageChops.difference(dibujo(c), falta).getbbox() is not None]
por_hoja, col = 240, 20
for h in range(0, len(codigos), por_hoja):
    trozo = codigos[h:h + por_hoja]
    im = Image.new("RGB", (col * 64, ((len(trozo) + col - 1) // col) * 62), (30, 30, 30))
    d = ImageDraw.Draw(im)
    for i, c in enumerate(trozo):
        x, y = (i % col) * 64, (i // col) * 62
        d.text((x + 16, y + 4), chr(c), font=f, fill=(255, 255, 255))
        d.text((x + 14, y + 46), "%X" % c, font=fl, fill=(255, 210, 0))
    im.save(os.path.join(salida, "hoja_%02d.png" % (h // por_hoja)))
print("glifos", len(codigos), "| hojas", (len(codigos) + por_hoja - 1) // por_hoja)
