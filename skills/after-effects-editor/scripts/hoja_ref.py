"""Hoja de fotogramas numerados de un vídeo (para estudiar el movimiento fotograma a fotograma).
uso: python hoja_ref.py video.mp4 salida.jpg desde hasta paso [ancho_celda] [columnas]
(desde/hasta = número de fotograma; se leen todos los fotogramas del vídeo una vez y se cachean en .npy)"""
import sys, os, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

vid, out = sys.argv[1], sys.argv[2]
a, b, step = int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
cw = int(sys.argv[6]) if len(sys.argv) > 6 else 384
cols = int(sys.argv[7]) if len(sys.argv) > 7 else 5
W, H = 640, 360
cache = vid + f".{W}x{H}.npy"
if not os.path.exists(cache):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-vf", f"scale={W}:{H}:flags=lanczos",
                        "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    np.save(cache, np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3))
arr = np.load(cache, mmap_mode="r")
idx = list(range(a, min(b, len(arr) - 1) + 1, step))
ch = round(cw * 9 / 16)
rows = (len(idx) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (cw + 3), rows * (ch + 3)), "white")
d = ImageDraw.Draw(sheet)
try:
    f = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 18)
except Exception:
    f = ImageFont.load_default()
for k, i in enumerate(idx):
    im = Image.fromarray(np.array(arr[i])).resize((cw, ch), Image.LANCZOS)
    r, c = divmod(k, cols)
    x, y = c * (cw + 3), r * (ch + 3)
    sheet.paste(im, (x, y))
    d.rectangle([x, y, x + 62, y + 22], fill=(0, 0, 0))
    d.text((x + 4, y + 1), str(i), fill=(255, 230, 0), font=f)
sheet.save(out, quality=88)
print(out, len(idx), "fotogramas")
