"""Hoja ORIGINAL | RÉPLICA por MOMENTOS: arriba su vídeo, abajo el mío, cada columna un momento equivalente aunque los
tiempos no coincidan (su pieza y la mía pueden durar distinto). Sirve igual para vídeos verticales u horizontales.
Uso: python comparar_momentos.py su_clip.mp4 mi_video.mp4 salida.jpg "t_suyo:t_mio:etiqueta" ... [--ancho=200]
(su_clip: la pieza del profe recortada a su tamaño, p. ej. con un crop de ffmpeg; Tanda 04 · 05)
"""
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

args = [a for a in sys.argv[1:] if not a.startswith("--")]
opts = dict(a[2:].split("=", 1) for a in sys.argv[1:] if a.startswith("--") and "=" in a)
suyo, mio, out = args[0], args[1], args[2]
pares = [a.split(":") for a in args[3:]]
W = int(opts.get("ancho", 200))


def aspecto(v):
    p = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", v],
                       capture_output=True, text=True)
    w, h = p.stdout.strip().split(",")[:2]
    return int(h) / int(w)


H = int(round(W * aspecto(suyo) / 2) * 2)


def cuadro(v, t):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", str(t), "-i", v, "-frames:v", "1",
                        "-vf", f"scale={W}:{H}:in_color_matrix=bt709:out_color_matrix=bt709", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                       capture_output=True)
    return Image.frombytes("RGB", (W, H), p.stdout[: W * H * 3].ljust(W * H * 3, b"\0"))


fnt = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 14)
hoja = Image.new("RGB", (len(pares) * (W + 6), 2 * (H + 22) + 4), (20, 20, 20))
d = ImageDraw.Draw(hoja)
for i, (ts, tm, et) in enumerate(pares):
    x = i * (W + 6)
    hoja.paste(cuadro(suyo, float(ts)), (x, 20))
    hoja.paste(cuadro(mio, float(tm)), (x, H + 44))
    d.text((x + 3, 2), "%s · él %.1f" % (et, float(ts)), font=fnt, fill=(255, 215, 0))
    d.text((x + 3, H + 25), "yo %.1f" % float(tm), font=fnt, fill=(120, 220, 255))
hoja.save(out, quality=88)
print("ok", hoja.size)
