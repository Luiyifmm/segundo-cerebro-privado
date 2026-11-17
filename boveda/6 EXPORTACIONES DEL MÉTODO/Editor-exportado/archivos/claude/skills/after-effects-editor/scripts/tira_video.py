"""Tira de recortes de un vídeo a N fotogramas por segundo, en una zona del cuadro.

Sirve para VER un movimiento que el profe reproduce en el visor de AE (su resultado, a velocidad real) o para leer
cómo aparece un texto o un preset. Las rutas con emojis o "｜" funcionan (ffmpeg se llama desde Python).

Uso: python tira_video.py video.mp4 salida.jpg t_ini t_fin fps ancho cols x0 y0 x1 y1
     (t en segundos o "m:ss.s"; x0 y0 x1 y1 en fracciones del cuadro: 0,0,1,1 = entero)
Ejemplo (el visor de AE en una grabación 1920x1080): ... "15:53.9" "15:59.9" 4 380 5 0.331 0.164 0.706 0.539
"""
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont


def seg(t):
    if ":" in t:
        m, s = t.split(":")
        return int(m) * 60 + float(s)
    return float(t)


vid, out = sys.argv[1], sys.argv[2]
t0, t1, fps, W, cols = seg(sys.argv[3]), seg(sys.argv[4]), float(sys.argv[5]), int(sys.argv[6]), int(sys.argv[7])
x0, y0, x1, y1 = [float(v) for v in sys.argv[8:12]]
pr = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", vid],
                    capture_output=True, text=True)
w0, h0 = [int(v) for v in pr.stdout.strip().split(",")[:2]]
cx0, cy0, cw, ch = int(x0 * w0), int(y0 * h0), int((x1 - x0) * w0), int((y1 - y0) * h0)
H = int(W * ch / cw)
p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", str(t0), "-t", str(t1 - t0), "-i", vid,
                    "-vf", f"fps={fps},crop={cw}:{ch}:{cx0}:{cy0},scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                   capture_output=True)
n = len(p.stdout) // (W * H * 3)
frames = np.frombuffer(p.stdout[: n * W * H * 3], np.uint8).reshape(n, H, W, 3)
fnt = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 16)
filas = (n + cols - 1) // cols
hoja = Image.new("RGB", (cols * (W + 4), filas * (H + 22)), (20, 20, 20))
d = ImageDraw.Draw(hoja)
for i in range(n):
    x, y = (i % cols) * (W + 4), (i // cols) * (H + 22)
    hoja.paste(Image.fromarray(frames[i]), (x, y + 20))
    t = t0 + i / fps
    d.text((x + 4, y + 2), f"{int(t // 60)}:{t % 60:05.2f}", font=fnt, fill=(255, 220, 0))
hoja.save(out, quality=88)
print(n, "recortes", hoja.size, (w0, h0))
