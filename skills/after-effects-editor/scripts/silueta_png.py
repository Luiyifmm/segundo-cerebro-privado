"""Silueta con transparencia para el mate de alfa (en la clase era una cabeza recortada en Photoshop).
Dibuja un emoji de Windows (Segoe UI Emoji, en color y vectorial: sale nítido a cualquier tamaño) en un PNG transparente.
Uso: python silueta_png.py salida.png [emoji] [tamaño_fuente]"""
import sys

from PIL import Image, ImageDraw, ImageFont

salida = sys.argv[1]
emo = sys.argv[2] if len(sys.argv) > 2 else "\U0001F98B"     # mariposa
tam = int(sys.argv[3]) if len(sys.argv) > 3 else 800
f = ImageFont.truetype(r"C:\Windows\Fonts\seguiemj.ttf", tam)
im = Image.new("RGBA", (int(tam * 1.8), int(tam * 1.8)), (0, 0, 0, 0))
ImageDraw.Draw(im).text((int(tam * 0.4), int(tam * 0.4)), emo, font=f, embedded_color=True)
x0, y0, x1, y1 = im.getbbox()
m = 40
im = im.crop((x0 - m, y0 - m, x1 + m, y1 + m))
im.save(salida)
print(salida, im.size)
