"""Ajusta keyframes con suavizado de After Effects (velocidad + influencia en cada lado) a un avance medido p(f).
Modelo de AE: cada tramo entre keys es una Bézier cúbica en (tiempo, valor):
  P0=(ta,va) P1=(ta+Io*T, va+So*Io*T) P2=(tb-Ii*T, vb-Si*Ii*T) P3=(tb,vb)
uso: python ajuste_ease.py datos.txt fps [n_keys]
datos.txt: una línea por fotograma con el avance medido (0..1)."""
import sys
import numpy as np

def seg_eval(t, ta, tb, va, vb, So, Io, Si, Ii):
    T = tb - ta
    P = np.array([[ta, va], [ta + Io * T, va + So * Io * T], [tb - Ii * T, vb - Si * Ii * T], [tb, vb]])
    # resolver u tal que x(u)=t (bisección vectorizada)
    lo = np.zeros_like(t); hi = np.ones_like(t)
    for _ in range(50):
        u = (lo + hi) / 2
        x = (1 - u) ** 3 * P[0, 0] + 3 * (1 - u) ** 2 * u * P[1, 0] + 3 * (1 - u) * u ** 2 * P[2, 0] + u ** 3 * P[3, 0]
        m = x < t
        lo = np.where(m, u, lo); hi = np.where(m, hi, u)
    u = (lo + hi) / 2
    return (1 - u) ** 3 * P[0, 1] + 3 * (1 - u) ** 2 * u * P[1, 1] + 3 * (1 - u) * u ** 2 * P[2, 1] + u ** 3 * P[3, 1]

def model(params, t):
    # 3 keys: K0 (t0, 0), K1 (t1, p1), K2 (t2, p2)
    t0, t1, t2, p1, p2, S0, I0, S1, I1i, I1o, S2, I2 = params
    out = np.empty_like(t)
    a = t <= t1
    out[a] = seg_eval(t[a], t0, t1, 0.0, p1, S0, I0, S1, I1i)
    b = ~a
    out[b] = seg_eval(t[b], t1, t2, p1, p2, S1, I1o, S2, I2)
    return out

def clampp(p):
    t0, t1, t2, p1, p2, S0, I0, S1, I1i, I1o, S2, I2 = p
    I0, I1i, I1o, I2 = [min(max(v, 0.011), 1.0) for v in (I0, I1i, I1o, I2)]
    S0, S1, S2 = max(S0, 0), max(S1, 0), max(S2, 0)
    t0 = min(t0, 0.0)
    return np.array([t0, t1, t2, p1, p2, S0, I0, S1, I1i, I1o, S2, I2])

def nelder(f, x0, step, iters=6000):
    n = len(x0)
    pts = [x0] + [x0 + np.eye(n)[i] * step[i] for i in range(n)]
    vals = [f(p) for p in pts]
    for _ in range(iters):
        order = np.argsort(vals); pts = [pts[i] for i in order]; vals = [vals[i] for i in order]
        c = np.mean(pts[:-1], axis=0)
        xr = c + (c - pts[-1]); fr = f(xr)
        if fr < vals[0]:
            xe = c + 2 * (c - pts[-1]); fe = f(xe)
            pts[-1], vals[-1] = (xe, fe) if fe < fr else (xr, fr)
        elif fr < vals[-2]:
            pts[-1], vals[-1] = xr, fr
        else:
            xc = c + 0.5 * (pts[-1] - c); fc = f(xc)
            if fc < vals[-1]:
                pts[-1], vals[-1] = xc, fc
            else:
                pts = [pts[0] + 0.5 * (p - pts[0]) for p in pts]; vals = [f(p) for p in pts]
    i = int(np.argmin(vals)); return pts[i], vals[i]

if __name__ == "__main__":
    data = np.array([float(x) for x in open(sys.argv[1]).read().split()])
    fps = float(sys.argv[2])
    t = np.arange(len(data)) / fps
    def err(p):
        p = clampp(p)
        if not (p[0] < p[1] < p[2]) or p[2] < t[-1] - 0.02:
            return 1e9
        return float(np.sum((model(p, t) - data) ** 2))
    best = None
    rng = np.random.default_rng(1)
    for trial in range(12):
        x0 = np.array([-0.02 * rng.random(), 0.55 + 0.25 * rng.random(), t[-1] + 0.05 * rng.random(), 0.72 + 0.06 * rng.random(), 1.0 + 0.05 * rng.random(),
                       3 * rng.random(), 0.1 + 0.4 * rng.random(), 0.1 + 0.2 * rng.random(), 0.5 + 0.5 * rng.random(), 0.5 + 0.5 * rng.random(), 3 + 3 * rng.random(), 0.3 + 0.5 * rng.random()])
        x, v = nelder(err, x0, np.array([0.02, 0.05, 0.02, 0.03, 0.02, 0.5, 0.1, 0.05, 0.1, 0.1, 0.5, 0.1]))
        if best is None or v < best[1]:
            best = (clampp(x), v)
    p, v = best
    names = "t0 t1 t2 p1 p2 S0 I0 S1 I1in I1out S2 I2in".split()
    print("error RMS: %.4f" % np.sqrt(v / len(data)))
    for n_, val in zip(names, p):
        print(f"{n_} = {val:.4f}")
    m = model(p, t)
    for f in range(len(data)):
        print(f, "%.3f %.3f" % (data[f], m[f]))
