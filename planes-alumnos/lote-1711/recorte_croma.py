# Recorta objetos generados sobre croma verde (Flow, «pure green screen»): sujeto con Vision de Apple + clave de color,
# y quita el reflejo verde (despill) SOLO en una franja del borde, para no estropear alimentos verdes (brócoli, aguacate).
# Uso: ~/Videos-Remotion/herramientas/entornos/ecc-taste/bin/python recorte_croma.py img.png [...]  -> img.cut.png (RGBA, ajustado al contorno)
import os, sys, subprocess, numpy as np, cv2
REC = os.path.expanduser('~/Videos-Remotion/herramientas/recorte-objetos/recortar')
for f in sys.argv[1:]:
    if f.endswith('.cut.png'): continue
    out = f[:-4] + '.cut.png'; tmp = f[:-4] + '.vis.png'
    subprocess.run([REC, '--lienzo', f, tmp], capture_output=True)
    img = cv2.imread(f).astype(np.float32); b, g, r = img[..., 0], img[..., 1], img[..., 2]
    verde = np.clip((g - np.maximum(r, b) - 25) / 60, 0, 1)                 # cuánto «es croma» cada píxel
    a_key = 1 - verde
    a_vis = cv2.imread(tmp, cv2.IMREAD_UNCHANGED)[..., 3].astype(np.float32) / 255 if os.path.exists(tmp) else np.ones_like(g)
    a = cv2.GaussianBlur(a_vis, (0, 0), 1.2)
    franja = (cv2.dilate((a_vis > 0.5).astype(np.uint8), np.ones((7, 7), np.uint8)) - cv2.erode((a_vis > 0.5).astype(np.uint8), np.ones((13, 13), np.uint8))) > 0
    a[franja] = np.minimum(a, a_key)[franja]                                            # la clave de color solo en el borde (el interior verde se respeta)
    a[cv2.dilate((a_vis > 0.5).astype(np.uint8), np.ones((5, 5), np.uint8)) == 0] = 0     # fuera del sujeto de Vision: nada
    borde = cv2.dilate((a > 0.05).astype(np.uint8), np.ones((3, 3))) - cv2.erode((a > 0.95).astype(np.uint8), np.ones((9, 9)))
    m = (borde > 0) & (g > np.maximum(r, b)); img[..., 1][m] = np.maximum(r, b)[m]          # despill en el borde
    rgba = np.dstack([img, a[..., None] * 255]).clip(0, 255).astype(np.uint8)
    ys, xs = np.where(a > 0.05)
    if len(xs): rgba = rgba[max(0, ys.min() - 4):ys.max() + 5, max(0, xs.min() - 4):xs.max() + 5]
    cv2.imwrite(out, rgba); os.path.exists(tmp) and os.remove(tmp); print('ok', out, rgba.shape[1], 'x', rgba.shape[0])
