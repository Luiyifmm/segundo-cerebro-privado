# Prepara imágenes (Google Flow, fotos) para el b-roll animado de reel_alumno.py (parallax 2.5D tipo After Effects).
# Por cada imagen: <nombre>.fg.png (sujeto recortado con Vision de Apple, mismo lienzo) y <nombre>.bg.png (fondo con el hueco
# del sujeto rellenado con inpaint, para que al mover las capas a distinta velocidad no se vea el sujeto doble).
# Uso: ~/Videos-Remotion/herramientas/entornos/ecc-taste/bin/python preparar_broll.py img1.png [img2.png ...]
import os, sys, subprocess
import numpy as np, cv2
REC = os.path.expanduser('~/Videos-Remotion/herramientas/recorte-objetos/recortar')
for f in sys.argv[1:]:
    if f.endswith(('.fg.png', '.bg.png')): continue
    b = os.path.splitext(f)[0]; fg, bg = b + '.fg.png', b + '.bg.png'
    if os.path.exists(fg) and os.path.exists(bg) and os.path.getmtime(fg) > os.path.getmtime(f): print('ya', f); continue
    r = subprocess.run([REC, '--lienzo', f, fg], capture_output=True, text=True); print(r.stdout.strip())
    img = cv2.imread(f)
    if not os.path.exists(fg):                     # sin sujeto: el fondo es la imagen entera y no hay capa delantera
        cv2.imwrite(bg, img); continue
    a = cv2.imread(fg, cv2.IMREAD_UNCHANGED)
    if a.shape[:2] != img.shape[:2]: a = cv2.resize(a, (img.shape[1], img.shape[0]))
    m = (a[:, :, 3] > 40).astype(np.uint8) * 255
    frac = m.mean() / 255
    if frac > 0.55:                                 # el «sujeto» es casi toda la imagen (paisaje, mesa): sin capa delantera
        os.remove(fg); cv2.imwrite(bg, img); print('  sujeto demasiado grande (%.2f): sin parallax de capas' % frac); continue
    m = cv2.dilate(m, np.ones((25, 25), np.uint8))
    s = 0.5; small = cv2.resize(img, None, fx=s, fy=s); ms = cv2.resize(m, None, fx=s, fy=s)
    fill = cv2.inpaint(small, ms, 9, cv2.INPAINT_TELEA); fill = cv2.GaussianBlur(fill, (0, 0), 6)
    fill = cv2.resize(fill, (img.shape[1], img.shape[0]))
    mm = cv2.GaussianBlur(m, (0, 0), 6)[:, :, None] / 255.0
    cv2.imwrite(bg, (img * (1 - mm) + fill * mm).astype(np.uint8)); print('  ok', bg, 'sujeto %.2f' % frac)
