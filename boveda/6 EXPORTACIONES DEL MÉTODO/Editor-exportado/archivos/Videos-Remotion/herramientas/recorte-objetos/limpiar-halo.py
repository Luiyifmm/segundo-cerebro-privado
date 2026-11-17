# Uso: python limpiar-halo.py <recorte_rgba.raw> <fotograma_rgb.raw> <salida.raw>  (2160x3840; sacar los .raw con ffmpeg -f rawvideo -pix_fmt rgba|rgb24)
# Quita del recorte el halo amarillo de la pared en el borde (pelo) y oscurece el tinte que queda.
import sys, numpy as np
W, H = 2160, 3840
p = np.fromfile(sys.argv[1], np.uint8).reshape(H, W, 4).astype(np.float32)
f = np.fromfile(sys.argv[2], np.uint8).reshape(H, W, 3).astype(np.float32)
pared = np.median(f[300:900, 200:1900].reshape(-1, 3), axis=0); print("pared", pared)
a = p[..., 3] / 255; rgb = p[..., :3]
def caja(x, r):
    c = np.cumsum(np.cumsum(np.pad(x, ((r+1, r), (r+1, r)), mode="edge"), 0), 1)
    return (c[2*r+1:, 2*r+1:] - c[:-2*r-1, 2*r+1:] - c[2*r+1:, :-2*r-1] + c[:-2*r-1, :-2*r-1]) / (2*r+1)**2
interior = caja((a > 0.5).astype(np.float32), 18)
banda = (a > 0.02) & (interior < 0.985)
d = np.linalg.norm((rgb - pared) / 255, axis=2)
parecido = np.clip(1 - d / 0.16, 0, 1)                       # 1 = color de pared
claro = np.clip((rgb.mean(2) - 120) / 80, 0, 1) * np.clip((rgb.max(2) - rgb.min(2) - 40) / 60, 0, 1) * np.clip((112 - rgb[..., 2]) / 20, 0, 1) * np.clip((rgb[..., 1] - rgb[..., 2] - 55) / 20, 0, 1)   # claro y amarillento
quitar = np.maximum(parecido, claro * 0.8) * banda
a2 = a * (1 - quitar)
# erosión de 2 px y suavizado de 1 px
for _ in range(2):
    a2 = np.minimum.reduce([a2, np.roll(a2, 1, 0), np.roll(a2, -1, 0), np.roll(a2, 1, 1), np.roll(a2, -1, 1)])
a2 = np.where(interior > 0.999, a, caja(a2, 1))
# oscurecer y desaturar lo que queda en el borde con tinte de pared
t = (banda * np.maximum(parecido, claro))[..., None] * 0.6
g = rgb.mean(2, keepdims=True)
rgb2 = rgb * (1 - t) + (g * 0.45) * t
out = np.dstack([np.clip(rgb2, 0, 255), np.clip(a2 * 255, 0, 255)]).astype(np.uint8)
out.tofile(sys.argv[3]); print("hecho")
