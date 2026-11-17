"""Aísla las líneas finas (paso alto: imagen - desenfoque) para comparar la GEOMETRÍA de ondas/hebras sin el brillo del fondo.
uso: python lineas_hp.py ref.mp4 mio.mp4 salida.jpg offset f1 f2 ...   (hoja: ORIGINAL | MÍO, a media resolución)"""
import sys, subprocess
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageFont
ref, mine, out, off = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]); frames = [int(v) for v in sys.argv[5:]]
W, H = 1920, 1080
def read(vid, n):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-frames:v", str(n + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
A = read(ref, off + max(frames)); B = read(mine, max(frames))
def hp(a):
    im = Image.fromarray(a).convert("L"); g = np.asarray(im, np.float32); b = np.asarray(im.filter(ImageFilter.GaussianBlur(5)), np.float32)
    h = np.clip((g - b) * 9, 0, 255).astype(np.uint8); return Image.fromarray(h).resize((W // 2, H // 2), Image.LANCZOS)
sheet = Image.new("L", (W + 12, len(frames) * (H // 2 + 6) + 30), 20); d = ImageDraw.Draw(sheet)
try: f = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 22)
except Exception: f = ImageFont.load_default()
d.text((8, 3), "ORIGINAL (solo líneas)", fill=255, font=f); d.text((W // 2 + 14, 3), "MÍO (solo líneas)", fill=255, font=f)
for i, n in enumerate(frames):
    y = 30 + i * (H // 2 + 6); sheet.paste(hp(A[off + n]), (4, y)); sheet.paste(hp(B[n]), (W // 2 + 8, y)); d.text((8, y + 2), str(n), fill=255, font=f)
sheet.save(out, quality=90); print(out)
