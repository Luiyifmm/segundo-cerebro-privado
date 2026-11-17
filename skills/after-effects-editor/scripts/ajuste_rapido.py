"""Ajuste RÁPIDO de keyframes de AE (velocidad + influencia) a un avance medido.
Modo "giro": K0 -> K1 (velocidad 0, punto de giro) -> K2.  Modo "continuo": K1 con velocidad libre.
El segmento Bézier se muestrea (np.interp) en vez de resolverlo por bisección.
uso: python ajuste_rapido.py datos.txt fps modo"""
import sys
import numpy as np
from ajuste_ease import nelder

U = np.linspace(0, 1, 600)
def seg(t, ta, tb, va, vb, So, Io, Si, Ii):
    T = tb - ta
    x0, x1, x2, x3 = ta, ta + Io * T, tb - Ii * T, tb
    y0, y1, y2, y3 = va, va + So * Io * T, vb - Si * Ii * T, vb
    u = U
    x = (1 - u) ** 3 * x0 + 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u ** 2 * x2 + u ** 3 * x3
    y = (1 - u) ** 3 * y0 + 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u ** 2 * y2 + u ** 3 * y3
    return np.interp(t, x, y)

data = np.array([float(x) for x in open(sys.argv[1]).read().split()])
fps = float(sys.argv[2]); modo = sys.argv[3] if len(sys.argv) > 3 else "giro"
t = np.arange(len(data)) / fps

def model(p, t):
    t1, t2, p1, p2, S0, I0, S1, I1i, I1o, S2, I2 = p
    if modo == "giro":
        S1 = 0.0
    out = np.empty_like(t); a = t <= t1
    out[a] = seg(t[a], 0.0, t1, 0.0, p1, S0, I0, S1, I1i)
    out[~a] = seg(t[~a], t1, t2, p1, p2, S1, I1o, S2, I2)
    return out

def clampp(p):
    p = np.array(p, float)
    for i in (5, 7, 8, 10):
        p[i] = min(max(p[i], 0.011), 1.0)
    return p

def err(p):
    p = clampp(p)
    if not (0.05 < p[0] < p[1]) or p[1] < t[-1] - 0.01:
        return 1e9
    return float(np.sum((model(p, t) - data) ** 2))

best = None
rng = np.random.default_rng(3)
imax = int(np.argmax(data))
for trial in range(24):
    x0 = np.array([t[imax] * (0.8 + 0.4 * rng.random()), t[-1] + 0.05 * rng.random(), data[imax], data[-1] - 0.05 * rng.random(),
                   5 * rng.random(), 0.05 + 0.5 * rng.random(), 0.2 * rng.random(), 0.2 + 0.7 * rng.random(), 0.2 + 0.7 * rng.random(), -4 * rng.random(), 0.05 + 0.6 * rng.random()])
    x, v = nelder(err, x0, np.array([0.05, 0.02, 0.02, 0.03, 0.6, 0.1, 0.05, 0.1, 0.1, 0.6, 0.1]), 5000)
    if best is None or v < best[1]:
        best = (clampp(x), v)
p, v = best
if modo == "giro":
    p[6] = 0.0
print("error RMS: %.4f" % np.sqrt(v / len(data)))
for n_, val in zip("t1 t2 p1 p2 S0 I0 S1 I1in I1out S2 I2in".split(), p):
    print(f"{n_} = {val:.4f}")
m = model(p, t)
print("fot  medido  modelo")
for f in range(len(data)):
    print(f, "%.3f %.3f" % (data[f], m[f]))
