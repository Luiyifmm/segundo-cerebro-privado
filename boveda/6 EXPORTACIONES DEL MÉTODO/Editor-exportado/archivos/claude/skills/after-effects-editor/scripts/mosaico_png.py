"""Junta varias imágenes en una hoja con su nombre. Uso: python mosaico_png.py salida.jpg ancho cols img1 img2 ... [--fondo=0]
(--fondo = gris sobre el que se ven las zonas transparentes; 0 = negro, como el fondo del montaje)"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

out, ancho, cols = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
gris = int(next((a.split("=")[1] for a in sys.argv[4:] if a.startswith("--fondo=")), 40))
ims = [Path(p) for p in sys.argv[4:] if not p.startswith("--")]
fuente = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 18)
tiles = []
for p in ims:
    im = Image.open(p).convert("RGBA")
    fondo = Image.new("RGBA", im.size, (gris, gris, gris, 255))
    im = Image.alpha_composite(fondo, im).convert("RGB")
    h = round(im.height * ancho / im.width)
    tiles.append((p.stem, im.resize((ancho, h), Image.LANCZOS)))
h = max(t[1].height for t in tiles)
filas = (len(tiles) + cols - 1) // cols
hoja = Image.new("RGB", (cols * (ancho + 6), filas * (h + 6)), (10, 10, 10))
d = ImageDraw.Draw(hoja)
for i, (nom, im) in enumerate(tiles):
    x, y = (i % cols) * (ancho + 6), (i // cols) * (h + 6)
    hoja.paste(im, (x, y))
    d.text((x + 6, y + 4), nom, font=fuente, fill=(255, 210, 0))
hoja.save(out, quality=90)
print(out, hoja.size)
