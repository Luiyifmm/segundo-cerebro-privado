"""Fotogramas de un clip en segundos dados, a 960 px de ancho con rejilla cada 100 px (en medida 1920) para leer posiciones.
Uso: python fotos_rejilla.py clip.mp4 salida.jpg t1 t2 ..."""
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

vid, out = sys.argv[1], sys.argv[2]
ts = [float(t) for t in sys.argv[3:]]
W, H = 960, 540
f = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 14)
tiles = []
for t in ts:
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", str(t), "-i", vid, "-frames:v", "1", "-vf",
                        f"scale={W}:{H}:in_color_matrix=bt709:out_color_matrix=bt709", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                       capture_output=True)
    im = Image.fromarray(np.frombuffer(p.stdout, np.uint8).reshape(H, W, 3).copy())
    d = ImageDraw.Draw(im)
    for x in range(0, 1920, 100):
        d.line([(x / 2, 0), (x / 2, H)], fill=(255, 255, 255) if x % 500 == 0 else (120, 120, 120), width=1)
        if x % 200 == 0:
            d.text((x / 2 + 2, 2), str(x), font=f, fill=(255, 230, 0))
    for y in range(0, 1080, 100):
        d.line([(0, y / 2), (W, y / 2)], fill=(255, 255, 255) if y % 500 == 0 else (120, 120, 120), width=1)
        if y % 200 == 0:
            d.text((2, y / 2 + 2), str(y), font=f, fill=(255, 230, 0))
    d.text((W - 90, H - 22), f"{t:.2f} s", font=ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 18), fill=(255, 60, 60))
    tiles.append(im)
cols = 2
filas = (len(tiles) + cols - 1) // cols
hoja = Image.new("RGB", (cols * (W + 4), filas * (H + 4)), (0, 0, 0))
for i, im in enumerate(tiles):
    hoja.paste(im, ((i % cols) * (W + 4), (i // cols) * (H + 4)))
hoja.save(out, quality=88)
print(out, hoja.size)
