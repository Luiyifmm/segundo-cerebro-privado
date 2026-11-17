"""Compara una REGIÓN a tamaño real (1:1) entre la referencia y mi render, en varios fotogramas.
uso: python comparar_region.py ref.mp4 mio.mp4 salida.jpg offset_ref x0 y0 x1 y1 f1 f2 ...
(f = fotograma de MI vídeo; la referencia usa f + offset_ref). Cada fila: ORIGINAL | RÉPLICA."""
import sys, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ref, mine, out, off = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
x0, y0, x1, y1 = [int(v) for v in sys.argv[5:9]]
frames = [int(v) for v in sys.argv[9:]]
W, H = 1920, 1080

def read_frames(vid, wanted):
    n = max(wanted) + 1
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-frames:v", str(n), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    a = np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
    return {f: a[min(f, len(a) - 1)] for f in wanted}

A = read_frames(ref, [off + f for f in frames]); B = read_frames(mine, frames)
cw, ch = x1 - x0, y1 - y0
sheet = Image.new("RGB", (cw * 2 + 12, len(frames) * (ch + 6) + 34), (20, 22, 28))
d = ImageDraw.Draw(sheet)
try:
    f = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 22)
except Exception:
    f = ImageFont.load_default()
d.text((8, 5), "ORIGINAL (1:1)", fill=(255, 210, 90), font=f); d.text((cw + 16, 5), "RÉPLICA (1:1)", fill=(120, 255, 150), font=f)
import os
BOOST = os.environ.get("BOOST") == "1"
def prep(a):
    if not BOOST: return Image.fromarray(a)
    x = a.astype(np.float32) / 255.0; return Image.fromarray((np.clip(x ** 0.6 * 1.1, 0, 1) * 255).astype(np.uint8))
for i, n in enumerate(frames):
    y = 34 + i * (ch + 6)
    sheet.paste(prep(A[off + n][y0:y1, x0:x1]), (4, y)); sheet.paste(prep(B[n][y0:y1, x0:x1]), (cw + 8, y))
    d.rectangle([4, y, 58, y + 24], fill=(0, 0, 0)); d.text((8, y), str(n), fill=(255, 230, 0), font=f)
sheet.save(out, quality=92)
print(out)
