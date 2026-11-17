"""Compara fotogramas de mi render con la referencia: hoja con pares ORIGINAL | RÉPLICA.
uso: python comparar_video.py ref.mp4 mio.mp4 salida.jpg offset_ref f1 f2 f3 ...
(offset_ref: fotograma de la referencia que corresponde al fotograma 0 de mi vídeo)
Desde la Tanda 03 · 02 lee el tamaño de cada vídeo (sirve para verticales 1080x1920) y respeta la proporción,
y lee los vídeos HD sin etiqueta de color (los H.264 de AE) como BT.709, para que los colores saturados no salgan cambiados."""
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ref, mine, out, off = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
frames = [int(x) for x in sys.argv[5:]]


def tam(vid):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,color_space", "-of", "csv=p=0", vid],
                       capture_output=True, text=True, check=True)
    w, h = r.stdout.strip().split(",")[:2]
    cs = r.stdout.strip().split(",")[2] if r.stdout.count(",") >= 2 else ""
    return int(w), int(h), cs


def read(vid, n):
    W, H, cs = tam(vid)
    # El H.264 de AE sale SIN etiqueta de color y ffmpeg lo leería como BT.601: los rojos saturados salen oscuros
    # (#FF0042 -> R 232 en vez de 255). Un vídeo HD sin etiqueta se lee como BT.709 (lo que hacen los reproductores).
    vf = ["-vf", "scale=in_color_matrix=bt709:out_color_matrix=bt709"] if cs in ("", "unknown") and max(W, H) >= 720 else []
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", vid] + vf + ["-frames:v", str(n + 1), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                       capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, H, W, 3)


A = read(ref, off + max(frames)); B = read(mine, max(frames))
Hh, Ww = A.shape[1], A.shape[2]
if Ww >= Hh:
    cw, ch = 800, int(800 * Hh / Ww)
else:
    ch = 700; cw = int(700 * Ww / Hh)
vertical = Hh > Ww
cols = 2 * (3 if vertical else 1)
filas = (len(frames) + cols // 2 - 1) // (cols // 2)
sheet = Image.new("RGB", (cols * (cw + 6) + 6, filas * (ch + 32) + 8), (20, 22, 28))
d = ImageDraw.Draw(sheet)
try:
    f = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 20)
except Exception:
    f = ImageFont.load_default()
for i, n in enumerate(frames):
    r, c = divmod(i, cols // 2)
    x = 6 + c * 2 * (cw + 6)
    y = 8 + r * (ch + 32)
    a = Image.fromarray(A[min(off + n, len(A) - 1)]).resize((cw, ch), Image.LANCZOS)
    b = Image.fromarray(B[min(n, len(B) - 1)]).resize((cw, ch), Image.LANCZOS)
    sheet.paste(a, (x, y + 26)); sheet.paste(b, (x + cw + 6, y + 26))
    d.text((x + 2, y + 2), f"ORIGINAL {n}", fill=(255, 210, 90), font=f)
    d.text((x + cw + 8, y + 2), f"RÉPLICA {n}", fill=(120, 255, 150), font=f)
sheet.save(out, quality=88)
print(out)
