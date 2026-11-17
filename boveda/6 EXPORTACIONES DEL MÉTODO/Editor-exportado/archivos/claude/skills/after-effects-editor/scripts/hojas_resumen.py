"""Hojas de resumen de un vídeo largo: 1 fotograma cada N segundos, repartidos en varias hojas con su minuto.
Lee el vídeo UNA vez con ffmpeg (reducido dentro de ffmpeg, rápido aunque sea largo). Acepta un patrón glob para
nombres con emojis o «｜» (PowerShell 5.1 los rompe). Tanda 04 · 05.
Uso: python hojas_resumen.py "patrón_o_ruta.mp4" carpeta_salida [cada_seg=15] [por_hoja=60] [cols=10] [ancho=300]
"""
import glob
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

vid = sorted(glob.glob(sys.argv[1]))[0]
out = sys.argv[2]
cada = float(sys.argv[3]) if len(sys.argv) > 3 else 15
por_hoja = int(sys.argv[4]) if len(sys.argv) > 4 else 60
cols = int(sys.argv[5]) if len(sys.argv) > 5 else 10
W = int(sys.argv[6]) if len(sys.argv) > 6 else 300
H = round(W * 9 / 16 / 2) * 2
os.makedirs(out, exist_ok=True)
p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-vf",
                    f"fps=1/{cada},scale={W}:{H}:in_color_matrix=bt709:out_color_matrix=bt709",
                    "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True)
n = len(p.stdout) // (W * H * 3)
fr = np.frombuffer(p.stdout[: n * W * H * 3], np.uint8).reshape(n, H, W, 3)
fnt = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 15)
for h0 in range(0, n, por_hoja):
    trozo = fr[h0:h0 + por_hoja]
    filas = (len(trozo) + cols - 1) // cols
    hoja = Image.new("RGB", (cols * (W + 4), filas * (H + 20)), (18, 18, 18))
    d = ImageDraw.Draw(hoja)
    for i, f in enumerate(trozo):
        x, y = (i % cols) * (W + 4), (i // cols) * (H + 20)
        hoja.paste(Image.fromarray(f), (x, y + 18))
        t = (h0 + i) * cada
        d.text((x + 3, y + 1), "%d:%02d" % (t // 60, t % 60), font=fnt, fill=(255, 215, 0))
    nombre = "hoja %02d (%d-%d min).jpg" % (h0 // por_hoja + 1, h0 * cada // 60, min(n, h0 + por_hoja) * cada // 60)
    hoja.save(os.path.join(out, nombre), quality=86)
print(n, "fotogramas en", (n + por_hoja - 1) // por_hoja, "hojas |", os.path.basename(vid))
