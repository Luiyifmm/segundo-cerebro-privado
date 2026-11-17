"""Rastreo de un elemento plano que gira y cambia de escala (búsqueda de ángulo + escala + posición con NCC enmascarada por FFT).
uso: python rastrear_rot.py carpeta plantilla_f x0 y0 x1 y1 "f1,f2,..." ang_min ang_max [esc_min esc_max]
Devuelve por fotograma: centro (x, y) del elemento, ángulo (grados, + = horario en pantalla), escala y puntuación."""
import sys, os
import numpy as np
from PIL import Image

D = sys.argv[1]; tf = sys.argv[2]; x0, y0, x1, y1 = [int(v) for v in sys.argv[3:7]]
# la plantilla puede ser un fotograma de la carpeta (número) o una imagen cualquiera ("img:ruta")
if not tf.startswith("img:"): tf = int(tf)
frames = [int(v) for v in sys.argv[7].split(",")]
a0, a1 = float(sys.argv[8]), float(sys.argv[9])
s0, s1 = (float(sys.argv[10]), float(sys.argv[11])) if len(sys.argv) > 11 else (0.85, 1.25)
DS = 4  # reducción para la búsqueda gruesa

def load(f):
    return Image.open(os.path.join(D, "f_%03d.png" % f)).convert("L")

def grad(a):
    gy, gx = np.gradient(a.astype(np.float32)); return np.hypot(gx, gy)

def prep(img, ds):
    w, h = img.size
    return grad(np.asarray(img.resize((w // ds, h // ds), Image.BILINEAR)))

def corr(A, B):
    # correlación (valid) de A con núcleo B mediante FFT
    H, W = A.shape; h, w = B.shape
    fa = np.fft.rfft2(A, s=(H + h, W + w)); fb = np.fft.rfft2(B[::-1, ::-1], s=(H + h, W + w))
    c = np.fft.irfft2(fa * fb, s=(H + h, W + w))
    return c[h - 1:H, w - 1:W]

def ncc_map(I, T, M):
    n = M.sum(); Tm = (T - (T * M).sum() / n) * M; tn = np.sqrt((Tm ** 2).sum()) + 1e-6
    num = corr(I, Tm); sI = corr(I, M); sI2 = corr(I * I, M)
    var = np.maximum(sI2 - sI * sI / n, 1e-3)
    return num / (np.sqrt(var) * tn)

tmpl_img = (Image.open(tf[4:]).convert("L") if isinstance(tf, str) else load(tf)).crop((x0, y0, x1, y1))
cx0, cy0 = (x1 - x0) / 2.0, (y1 - y0) / 2.0

def make(ds, ang, sc):
    w, h = tmpl_img.size
    t = tmpl_img.resize((max(4, int(w * sc / ds)), max(4, int(h * sc / ds))), Image.BILINEAR)
    m = Image.new("L", t.size, 255)
    # PIL rota en sentido antihorario con ángulo positivo -> usamos -ang para que + sea horario
    t = t.rotate(-ang, resample=Image.BILINEAR, expand=True); m = m.rotate(-ang, resample=Image.NEAREST, expand=True)
    T = grad(np.asarray(t)); M = (np.asarray(m) > 128).astype(np.float32)
    # erosionar un poco la máscara (bordes de la rotación)
    M[1:-1, 1:-1] = M[1:-1, 1:-1] * M[:-2, 1:-1] * M[2:, 1:-1] * M[1:-1, :-2] * M[1:-1, 2:]
    return T, M

angs = np.arange(a0, a1 + 0.01, 2.0); scs = np.linspace(s0, s1, 7)
cache = {}
prev = None
for f in frames:
    img = load(f); I = prep(img, DS)
    best = None
    A = angs if prev is None else np.arange(prev[2] - 8, prev[2] + 8.01, 2.0)
    S = scs if prev is None else np.linspace(prev[3] * 0.9, prev[3] * 1.1, 5)
    for a in A:
        for s in S:
            T, M = make(DS, a, s)
            if T.shape[0] >= I.shape[0] or T.shape[1] >= I.shape[1]: continue
            r = ncc_map(I, T, M); k = np.unravel_index(np.argmax(r), r.shape)
            if best is None or r[k] > best[0]: best = (r[k], k, a, s, T.shape)
    # refinamiento a resolución completa alrededor del mejor
    sc_, k, a, s, shp = best
    Ifull = grad(np.asarray(img)); bestf = None
    for da in (-1.5, -0.75, 0, 0.75, 1.5):
        for ds_ in (0.97, 1.0, 1.03):
            T, M = make(1, a + da, s * ds_)
            cyc = (k[0] + shp[0] / 2.0) * DS; cxc = (k[1] + shp[1] / 2.0) * DS
            yA = int(max(0, cyc - T.shape[0] / 2 - 12)); xA = int(max(0, cxc - T.shape[1] / 2 - 12))
            yB = int(min(Ifull.shape[0], cyc + T.shape[0] / 2 + 12)); xB = int(min(Ifull.shape[1], cxc + T.shape[1] / 2 + 12))
            sub = Ifull[yA:yB, xA:xB]
            if sub.shape[0] <= T.shape[0] or sub.shape[1] <= T.shape[1]: continue
            r = ncc_map(sub, T, M); kk = np.unravel_index(np.argmax(r), r.shape)
            if bestf is None or r[kk] > bestf[0]:
                bestf = (r[kk], yA + kk[0] + T.shape[0] / 2.0, xA + kk[1] + T.shape[1] / 2.0, a + da, s * ds_)
    if bestf is None:
        bestf = (sc_, (k[0] + shp[0] / 2.0) * DS, (k[1] + shp[1] / 2.0) * DS, a, s)
    # segundo refinamiento fino (ángulo ±0,4° en pasos de 0,2; escala ±1,5 % en pasos de 0,5 %)
    b0 = bestf
    for da in (-0.4, -0.2, 0, 0.2, 0.4):
        for ds_ in (0.985, 0.99, 0.995, 1.0, 1.005, 1.01, 1.015):
            T, M = make(1, b0[3] + da, b0[4] * ds_)
            cyc, cxc = b0[1], b0[2]
            yA = int(max(0, cyc - T.shape[0] / 2 - 6)); xA = int(max(0, cxc - T.shape[1] / 2 - 6))
            yB = int(min(Ifull.shape[0], cyc + T.shape[0] / 2 + 6)); xB = int(min(Ifull.shape[1], cxc + T.shape[1] / 2 + 6))
            sub = Ifull[yA:yB, xA:xB]
            if sub.shape[0] <= T.shape[0] or sub.shape[1] <= T.shape[1]: continue
            r = ncc_map(sub, T, M); kk = np.unravel_index(np.argmax(r), r.shape)
            if r[kk] > bestf[0]:
                bestf = (r[kk], yA + kk[0] + T.shape[0] / 2.0, xA + kk[1] + T.shape[1] / 2.0, b0[3] + da, b0[4] * ds_)
    prev = (bestf[2], bestf[1], bestf[3], bestf[4])
    print("f%03d  centro (%.1f, %.1f)  ángulo %+.2f°  escala %.3f  punt %.3f" % (f, bestf[2], bestf[1], bestf[3], bestf[4], bestf[0]))
    sys.stdout.flush()
