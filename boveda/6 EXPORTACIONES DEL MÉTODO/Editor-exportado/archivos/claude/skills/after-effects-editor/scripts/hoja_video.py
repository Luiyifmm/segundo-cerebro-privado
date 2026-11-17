"""Hoja de fotogramas de un render (para revisar el movimiento a ojo). Uso: python hoja_video.py video.mp4 salida.jpg f1 f2 ... [--ancho=480]"""
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

vid, out = sys.argv[1], sys.argv[2]
args = [a for a in sys.argv[3:] if not a.startswith("--")]
ancho = int(next((a.split("=")[1] for a in sys.argv[3:] if a.startswith("--ancho=")), 480))
frs = [int(a) for a in args]
p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-vf", "scale=in_color_matrix=bt709:out_color_matrix=bt709",
                    "-frames:v", str(max(frs) + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
V = np.frombuffer(p.stdout, np.uint8).reshape(-1, 1080, 1920, 3)
alto = int(ancho * 1080 / 1920)
cols = 4
filas = (len(frs) + cols - 1) // cols
hoja = Image.new("RGB", (cols * (ancho + 4), filas * (alto + 22)), (20, 20, 20))
d = ImageDraw.Draw(hoja)
fnt = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 15)
for i, f in enumerate(frs):
    im = Image.fromarray(np.ascontiguousarray(V[min(f, len(V) - 1)])).resize((ancho, alto), Image.LANCZOS)
    x, y = (i % cols) * (ancho + 4), (i // cols) * (alto + 22)
    hoja.paste(im, (x, y + 20))
    d.text((x + 4, y + 2), f"fotograma {f}", font=fnt, fill=(255, 220, 0))
hoja.save(out, quality=88)
print(hoja.size)
