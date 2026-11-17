"""Recorta la misma zona de varias PNG (sobre negro) y las amplía ×3 lado a lado.
Uso: python comparar_zona.py salida.jpg x0 y0 w h img1 img2 ..."""
import sys
from PIL import Image, ImageDraw, ImageFont

out = sys.argv[1]
x0, y0, w, h = (int(v) for v in sys.argv[2:6])
ims = sys.argv[6:]
f = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22)
k = 3 if len(ims) <= 3 else 2
hoja = Image.new("RGB", (len(ims) * (w * k + 6), h * k), (0, 0, 0))
d = ImageDraw.Draw(hoja)
for i, p in enumerate(ims):
    im = Image.open(p).convert("RGBA")
    neg = Image.new("RGBA", im.size, (0, 0, 0, 255))
    im = Image.alpha_composite(neg, im).convert("RGB").crop((x0, y0, x0 + w, y0 + h)).resize((w * k, h * k), Image.NEAREST)
    hoja.paste(im, (i * (w * k + 6), 0))
    d.text((i * (w * k + 6) + 6, 4), p.split("\\")[-1].split("/")[-1][:-4], font=f, fill=(255, 210, 0))
hoja.save(out, quality=92)
print(out, hoja.size)
