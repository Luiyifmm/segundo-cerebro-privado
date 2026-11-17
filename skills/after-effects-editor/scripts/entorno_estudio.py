"""Mapa de entorno tipo estudio (equirectangular 2048x1024) para el anillo de cristal: fondo oscuro, dos ventanas de luz
grandes y suaves y una tira fina. Refleja en caras planas como bandas limpias (el original) en vez del ruido de la textura
de bloques."""
import numpy as np
from PIL import Image, ImageFilter
import sys
W, H = 2048, 1024
lon = (np.arange(W) / W) * 360.0 - 180.0          # -180..180
lat = 90.0 - (np.arange(H) / H) * 180.0            # 90..-90
LON, LAT = np.meshgrid(lon, lat)
img = np.zeros((H, W), np.float32)
# cielo/suelo: degradado muy oscuro (algo más claro arriba)
img += 0.22 + 0.2 * np.clip((LAT + 10) / 100, 0, 1) + 0.12 * np.cos(np.radians(LON * 2))
def caja(lo0, lo1, la0, la1, v, suave):
    dx = np.maximum(np.maximum(lo0 - LON, LON - lo1), 0); dy = np.maximum(np.maximum(la0 - LAT, LAT - la1), 0)
    d = np.sqrt(dx * dx + dy * dy); return v * np.clip(1 - d / suave, 0, 1) ** 2
img += caja(-70, -10, 15, 55, 1.0, 12)      # ventana grande delante-izquierda, arriba
img += caja(120, 175, 5, 35, 0.75, 14)      # ventana detrás-derecha
img += caja(-180, 180, -14, -9, 0.7, 5)    # tira fina alrededor (horizonte)
img += caja(30, 60, 55, 80, 0.6, 10)        # luz cenital pequeña
img += caja(-150, -120, -40, -20, 0.35, 12) # rebote bajo
# tiras finas (como un estudio con varios tubos de luz): dan los reflejos rectangulares brillantes del cristal
for lo in (-160, -115, -40, 15, 70, 100, 145):
    img += caja(lo, lo + 4, -35, 60, 0.85, 3)
for la in (25, -30):
    img += caja(-180, 180, la, la + 3, 0.6, 3)
img = np.clip(img, 0, 1)
out = Image.fromarray((img * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3)).convert("RGB")
out.save(sys.argv[1])
print(sys.argv[1])
