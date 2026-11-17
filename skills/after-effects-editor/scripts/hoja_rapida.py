"""Hoja rápida de un clip: N fotogramas por segundo, pequeños, con su tiempo. Uso: python hoja_rapida.py clip.mp4 salida.jpg [fps=2] [ancho=320] [cols=8]"""
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

vid, out = sys.argv[1], sys.argv[2]
fps = float(sys.argv[3]) if len(sys.argv) > 3 else 2
ancho = int(sys.argv[4]) if len(sys.argv) > 4 else 320
cols = int(sys.argv[5]) if len(sys.argv) > 5 else 8
alto = round(ancho * 9 / 16 / 2) * 2
p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-vf",
                    f"fps={fps},scale={ancho}:{alto}:in_color_matrix=bt709:out_color_matrix=bt709",
                    "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True)
a = np.frombuffer(p.stdout, np.uint8)
n = a.size // (ancho * alto * 3)
fr = a[: n * ancho * alto * 3].reshape(n, alto, ancho, 3)
filas = (n + cols - 1) // cols
hoja = Image.new("RGB", (cols * (ancho + 4), filas * (alto + 4)), (15, 15, 15))
d = ImageDraw.Draw(hoja)
f = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 16)
for i in range(n):
    x, y = (i % cols) * (ancho + 4), (i // cols) * (alto + 4)
    hoja.paste(Image.fromarray(fr[i]), (x, y))
    d.text((x + 5, y + 3), f"{i / fps:.1f}s", font=f, fill=(255, 210, 0))
hoja.save(out, quality=88)
print(n, "fotogramas ->", out, hoja.size)
