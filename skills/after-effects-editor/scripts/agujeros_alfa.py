"""¿El recorte tiene agujeros? Mide el canal alfa del ProRes recortado en un instante y guarda el alfa como imagen.
Uso: python agujeros_alfa.py recorte.mov t salida.png"""
import subprocess
import sys

import numpy as np
from PIL import Image

vid, t, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
W, H = 1920, 1080
p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", str(t), "-i", vid, "-frames:v", "1",
                    "-f", "rawvideo", "-pix_fmt", "rgba", "-"], capture_output=True)
a = np.frombuffer(p.stdout, np.uint8).reshape(H, W, 4)
al = a[:, :, 3].astype(float) / 255
cuerpo = al > 0.02
# zona interior: erosionar la máscara 12 px (quitar el borde) con un mínimo por desplazamientos
inter = cuerpo.copy()
for dx, dy in [(12, 0), (-12, 0), (0, 12), (0, -12), (8, 8), (-8, 8), (8, -8), (-8, -8)]:
    inter &= np.roll(np.roll(cuerpo, dy, 0), dx, 1)
v = al[inter]
print(f"t={t}s  píxeles interiores: {v.size}  alfa<0.98: {np.mean(v < 0.98) * 100:.1f}%  alfa<0.8: {np.mean(v < 0.8) * 100:.1f}%  alfa<0.5: {np.mean(v < 0.5) * 100:.1f}%  media {v.mean():.3f}")
Image.fromarray((al * 255).astype(np.uint8)).save(out)
