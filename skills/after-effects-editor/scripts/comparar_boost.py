"""Como comparar_video.py pero con las dos imágenes ACLARADAS (gamma 0,6) para ver la luz del fondo.
uso: python comparar_boost.py ref.mp4 mio.mp4 salida.jpg offset_ref f1 f2 ..."""
import sys, subprocess
import numpy as np
from PIL import Image, ImageDraw
ref, mine, out, off = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]); frames = [int(v) for v in sys.argv[5:]]
W, H = 1920, 1080
def read(vid, n):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid, "-frames:v", str(n + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)
A = read(ref, off + max(frames)); B = read(mine, max(frames))
def boost(a): x = a.astype(np.float32) / 255.0; return Image.fromarray((np.clip(x ** 0.6 * 1.1, 0, 1) * 255).astype(np.uint8))
cw, ch = 640, 360
sheet = Image.new("RGB", (cw * 2 + 8, len(frames) * (ch + 4)), (20, 20, 20)); d = ImageDraw.Draw(sheet)
for i, n in enumerate(frames):
    y = i * (ch + 4)
    sheet.paste(boost(A[min(off + n, len(A) - 1)]).resize((cw, ch), Image.LANCZOS), (0, y)); sheet.paste(boost(B[min(n, len(B) - 1)]).resize((cw, ch), Image.LANCZOS), (cw + 8, y))
    d.rectangle([0, y, 34, y + 16], fill=(0, 0, 0)); d.text((3, y + 2), str(n), fill=(255, 255, 0))
    for x0 in (0, cw + 8):
        for gx in range(0, cw, 64): d.line([(x0 + gx, y), (x0 + gx, y + ch)], fill=(70, 25, 25))
        for gy in range(0, ch, 36): d.line([(x0, y + gy), (x0 + cw, y + gy)], fill=(70, 25, 25))
sheet.save(out, quality=88); print(out)
