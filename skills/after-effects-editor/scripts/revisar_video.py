"""Revisa un render: hojas de fotogramas cada N s y saltos entre fotogramas consecutivos.

Uso: python revisar_video.py video.mp4 carpeta_salida [cada_s=0.5]
Saltos: diferencia media absoluta de luminancia (0-255) entre fotogramas seguidos, a 320 px de ancho.
"""
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

video = Path(sys.argv[1])
out = Path(sys.argv[2])
cada = float(sys.argv[3]) if len(sys.argv) > 3 else 0.5
out.mkdir(parents=True, exist_ok=True)
tmp = out / "_fotogramas"
tmp.mkdir(exist_ok=True)
for f in tmp.glob("*.png"):
    f.unlink()
subprocess.run(["ffmpeg", "-v", "error", "-i", str(video), "-vf", "scale=320:-2", str(tmp / "f%05d.png")], check=True)
fs = sorted(tmp.glob("f*.png"))
fps = 30.0
lum = [np.asarray(Image.open(f).convert("L"), dtype=np.float32) for f in fs]
dif = np.array([np.abs(lum[i + 1] - lum[i]).mean() for i in range(len(lum) - 1)])
med = np.median(dif)
print(f"fotogramas: {len(fs)}  diferencia mediana: {med:.2f}")
orden = np.argsort(dif)[::-1][:25]
print("mayores saltos (t = segundo del fotograma siguiente):")
for i in sorted(orden):
    print(f"  t={(i + 1) / fps:6.2f}s  f{i + 2:4d}  salto={dif[i]:6.2f}  ({dif[i] / max(med, 1e-3):.1f}x la mediana)")
np.savetxt(out / "saltos.txt", np.c_[np.arange(1, len(dif) + 1) / fps, dif], fmt="%.3f")

# hojas de fotogramas
paso = int(round(cada * fps))
sel = list(range(0, len(fs), paso))
cols, filas = 4, 6
w, h = Image.open(fs[0]).size
for hoja_i in range(0, len(sel), cols * filas):
    grupo = sel[hoja_i:hoja_i + cols * filas]
    hoja = Image.new("RGB", (cols * w, filas * h), (30, 30, 30))
    d = ImageDraw.Draw(hoja)
    for k, idx in enumerate(grupo):
        im = Image.open(fs[idx]).convert("RGB")
        x, y = (k % cols) * w, (k // cols) * h
        hoja.paste(im, (x, y))
        d.rectangle([x, y, x + 58, y + 14], fill=(0, 0, 0))
        d.text((x + 3, y + 2), f"{idx / fps:5.2f}s", fill=(255, 255, 0))
    hoja.save(out / f"hoja_{hoja_i // (cols * filas) + 1}.jpg", quality=88)
print("hojas en", out)
