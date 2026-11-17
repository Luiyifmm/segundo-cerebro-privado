"""Fotogramas exactos (número de fotograma a 30 fps) de un video, en hoja de 2 columnas a 960 px.
Uso: python fotos_video.py video.mp4 salida.jpg f1 f2 ..."""
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

vid, out = sys.argv[1], sys.argv[2]
fs = [int(v) for v in sys.argv[3:]]
W, H = 960, 540
fnt = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 20)
tiles = []
for f in fs:
    t = (f + 0.5) / 30
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", f"{t:.4f}", "-i", vid, "-frames:v", "1", "-vf",
                        f"scale={W}:{H}:in_color_matrix=bt709:out_color_matrix=bt709", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                       capture_output=True)
    im = Image.fromarray(np.frombuffer(p.stdout, np.uint8).reshape(H, W, 3).copy())
    ImageDraw.Draw(im).text((8, 6), f"f{f}", font=fnt, fill=(255, 220, 0))
    tiles.append(im)
cols = 2
filas = (len(tiles) + cols - 1) // cols
hoja = Image.new("RGB", (cols * (W + 4), filas * (H + 4)))
for i, im in enumerate(tiles):
    hoja.paste(im, ((i % cols) * (W + 4), (i // cols) * (H + 4)))
hoja.save(out, quality=88)
print(out, hoja.size)
