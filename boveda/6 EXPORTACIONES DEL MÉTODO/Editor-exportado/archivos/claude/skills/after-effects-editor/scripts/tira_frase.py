"""Tiras horizontales (1:1) de una franja del vídeo en muchos fotogramas, apiladas: para ver cómo entran y se mueven palabras.
uso: python tira_frase.py video.mp4 salida.jpg x0,y0,x1,y1 f_ini f_fin paso [offset_etiqueta]"""
import sys, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
vid, out = sys.argv[1], sys.argv[2]; x0, y0, x1, y1 = [int(v) for v in sys.argv[3].split(",")]
fa, fb, st = int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6]); lab = int(sys.argv[7]) if len(sys.argv) > 7 else 0
W, H = 1920, 1080
p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-frames:v", str(fb + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
A = np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
fr = list(range(fa, fb + 1, st)); h = y1 - y0
sheet = Image.new("RGB", (x1 - x0 + 70, len(fr) * (h + 2)), (15, 15, 20)); d = ImageDraw.Draw(sheet)
try: f = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 18)
except Exception: f = ImageFont.load_default()
for i, n in enumerate(fr):
    sheet.paste(Image.fromarray(A[min(n, len(A) - 1)][y0:y1, x0:x1]), (70, i * (h + 2))); d.text((4, i * (h + 2) + 4), str(n + lab), fill=(255, 220, 0), font=f)
sheet.save(out, quality=90); print(out)
