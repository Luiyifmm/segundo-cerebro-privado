"""Suavidad de un movimiento rastreado: velocidad, aceleración y "temblor" (lo que se aparta de una curva suave).
uso: python suavidad.py pistas.txt [pistas2.txt ...]
pistas.txt = salida de rastrear_rot.py (líneas "fNNN centro (x, y) ángulo a° escala s ...").
Temblor = RMS de la diferencia entre la trayectoria y su versión suavizada (ventana de 5 fotogramas, cúbica).
Un movimiento limpio de AE da < 0,3 px; con ruido de medición copiado a keys sale 1-3 px."""
import sys, re
import numpy as np

def load(fn):
    d = {}
    for ln in open(fn, encoding="utf-8-sig"):
        m = re.match(r"f(\d+)\s+centro \(([-\d.]+), ([-\d.]+)\)\s+ángulo ([-+\d.]+)°\s+escala ([\d.]+)", ln.strip())
        if m: d[int(m.group(1))] = [float(m.group(i)) for i in range(2, 6)]
    return d

def smooth(v, w=5):
    out = v.copy(); h = w // 2
    for i in range(len(v)):
        a, b = max(0, i - h), min(len(v), i + h + 1)
        t = np.arange(a, b); c = np.polyfit(t, v[a:b], min(3, b - a - 1)); out[i] = np.polyval(c, i)
    return out

for fn in sys.argv[1:]:
    d = load(fn); fs = sorted(d)
    # tramos de fotogramas consecutivos
    runs, cur = [], [fs[0]]
    for f in fs[1:]:
        if f == cur[-1] + 1: cur.append(f)
        else: runs.append(cur); cur = [f]
    runs.append(cur)
    print("==", fn)
    for r in runs:
        if len(r) < 6: continue
        A = np.array([d[f] for f in r])
        res = []
        for k, nm in ((0, "x"), (1, "y"), (2, "ángulo"), (3, "escala")):
            v = A[:, k]; s = smooth(v); j = np.sqrt(np.mean((v - s) ** 2))
            if nm == "escala": j *= 1000
            res.append("%s %.2f" % (nm, j))
        vel = np.hypot(np.diff(A[:, 0]), np.diff(A[:, 1]))
        print("  f%d-f%d  temblor: %s   (escala en milésimas)   velocidad px/fot: mín %.1f  máx %.1f" % (r[0], r[-1], ", ".join(res), vel.min(), vel.max()))
