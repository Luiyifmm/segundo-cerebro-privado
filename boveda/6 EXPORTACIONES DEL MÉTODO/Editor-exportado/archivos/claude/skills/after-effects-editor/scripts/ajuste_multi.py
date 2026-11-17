"""Ajuste de N keyframes de After Effects (valor, tiempo, velocidad e influencias) a una curva medida.
Las keys interiores son "continuas" (misma velocidad de entrada y salida), como la técnica del keyframe continuo.
uso: python ajuste_multi.py config.json
config: {"data": [[t, v], ...], "keys": [{"t": 0.0, "free": false}, ...], "restarts": 30, "iters": 6000}
"""
import sys, json
import numpy as np
from curvas_ae import seg
from ajuste_ease import nelder

cfg = json.load(open(sys.argv[1], encoding="utf-8"))
D = np.array(cfg["data"], float); t = D[:, 0]; y = D[:, 1]
K = cfg["keys"]; N = len(K)
free_t = [i for i in range(N) if K[i].get("free")]
restarts = cfg.get("restarts", 30); iters = cfg.get("iters", 6000)

def unpack(p):
    p = list(p); k = 0
    T = [kk["t"] for kk in K]
    for i in free_t:
        T[i] = p[k]; k += 1
    V = p[k:k + N]; k += N
    S = p[k:k + N]; k += N
    Io = [min(max(v, 0.011), 1.0) for v in p[k:k + N - 1]]; k += N - 1
    Ii = [min(max(v, 0.011), 1.0) for v in p[k:k + N - 1]]; k += N - 1
    return T, V, S, Io, Ii

def model(p, tt):
    T, V, S, Io, Ii = unpack(p)
    out = np.empty_like(tt)
    for i in range(N - 1):
        m = (tt >= T[i]) & (tt <= T[i + 1]) if i < N - 2 else (tt >= T[i])
        if i == 0:
            m = m | (tt < T[0])
        out[m] = seg(tt[m], T[i], T[i + 1], V[i], V[i + 1], S[i], Io[i], S[i + 1], Ii[i])
    return out

def err(p):
    T, V, S, Io, Ii = unpack(p)
    for i in range(N - 1):
        if T[i + 1] - T[i] < 0.05:
            return 1e12
    # influencias fuera de rango penalizadas (para que el simplex no se escape)
    pen = 0.0
    k0 = len(free_t) + 2 * N
    for v in p[k0:]:
        if v < 0.011: pen += (0.011 - v) * 1e4
        if v > 1.0: pen += (v - 1.0) * 1e4
    r = model(p, t) - y
    return float(np.sum(r * r)) + pen

rng = np.random.default_rng(7)
# valores iniciales: interpolar la curva medida en los tiempos de las keys
best = None
for trial in range(restarts):
    x0 = []
    Tg = []
    for i in free_t:
        tg = K[i]["t"] + (rng.random() - 0.5) * K[i].get("jitter", 0.1)
        x0.append(tg)
    Tall = [kk["t"] for kk in K]
    for j, i in enumerate(free_t):
        Tall[i] = x0[j]
    Vg = list(np.interp(Tall, t, y) + (rng.random(N) - 0.5) * 2)
    # velocidades iniciales: pendiente local medida
    Sg = []
    for i in range(N):
        a = max(t[0], Tall[i] - 0.05); b = min(t[-1], Tall[i] + 0.05)
        if b - a < 1e-6:
            a, b = t[-2], t[-1]
        Sg.append((np.interp(b, t, y) - np.interp(a, t, y)) / (b - a) * (0.5 + rng.random()))
    Iog = list(0.1 + 0.8 * rng.random(N - 1)); Iig = list(0.1 + 0.8 * rng.random(N - 1))
    x0 = np.array(x0 + Vg + Sg + Iog + Iig, float)
    step = np.array([0.03] * len(free_t) + [2.0] * N + [max(20.0, abs(s) * 0.3) for s in Sg] + [0.1] * (2 * N - 2))
    x, v = nelder(err, x0, step, iters)
    x, v = nelder(err, x, step * 0.3, iters)
    if best is None or v < best[1]:
        best = (x, v)
p, v = best
T, V, S, Io, Ii = unpack(p)
print("error RMS: %.3f" % np.sqrt(v / len(t)))
for i in range(N):
    s = "K%d  t=%.4f s (f %.2f)  valor=%.2f  velocidad=%.2f/s" % (i, T[i], T[i] * cfg.get("fps", 30), V[i], S[i])
    if i > 0: s += "  infl_entrada=%.1f%%" % (Ii[i - 1] * 100)
    if i < N - 1: s += "  infl_salida=%.1f%%" % (Io[i] * 100)
    print(s)
m = model(p, t)
print("t  medido  modelo  dif")
for a, b, c in zip(t, y, m):
    print("%.4f %.2f %.2f %+.2f" % (a, b, c, c - b))
json.dump({"T": T, "V": V, "S": S, "Io": Io, "Ii": Ii}, open(sys.argv[1].replace(".json", "_res.json"), "w"))
