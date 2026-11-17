"""Ajusta UNA animación de 2 claves de After Effects (velocidad 0 en las dos, suavizado con influencias) a una curva
medida en la referencia: inicio, duración, influencia de salida (clave 1) e influencia de entrada (clave 2).
(Clase 12: la bajada de cámara salió inicio 2,02 s, duración 2,05 s, 50 % / 95 %; error 1,7 px.)
Para claves con velocidad (arranque "ya en marcha") usar ajuste_multi.py.

Uso: python ajustar_curva2keys.py medidas.csv
     medidas.csv: t,valor  (tiempo real en s; valor = posición medida, p. ej. el borde de un panel en px)
"""
import sys

import numpy as np

d = np.loadtxt(sys.argv[1], delimiter=",", ndmin=2)
T, Y = d[:, 0], d[:, 1]


def bez(a, b, n=400):
    s = np.linspace(0, 1, n)
    x = 3 * (1 - s) ** 2 * s * a + 3 * (1 - s) * s ** 2 * (1 - b) + s ** 3
    y = 3 * (1 - s) * s ** 2 + s ** 3
    return x, y


orden = np.argsort(T)
T, Y = T[orden], Y[orden]
n = max(3, len(T) // 10)
y0, y1 = np.median(Y[:n]), np.median(Y[-n:])
mejor = (1e9, None)
tmin, tmax = T.min(), T.max()
for ts in np.arange(tmin, tmax, (tmax - tmin) / 120):
    for dur in np.arange((tmax - tmin) / 40, tmax - ts + 1e-9, (tmax - tmin) / 60):
        for a in (0.05, 0.1, 0.2, 0.33, 0.5, 0.66, 0.8, 0.9, 0.95):
            for b in (0.05, 0.1, 0.2, 0.33, 0.5, 0.66, 0.8, 0.9, 0.95, 0.99):
                bx, by = bez(a, b)
                f = np.interp(np.clip((T - ts) / dur, 0, 1), bx, by)
                e = float(np.sqrt(np.mean((y0 + (y1 - y0) * f - Y) ** 2)))
                if e < mejor[0]:
                    mejor = (e, (ts, dur, a, b))
e, (ts, dur, a, b) = mejor
print(f"valor inicial {y0:.1f} -> final {y1:.1f}")
print(f"clave 1 en {ts:.2f} s, clave 2 en {ts + dur:.2f} s (duración {dur:.2f} s)")
print(f"influencia de SALIDA clave 1: {a * 100:.0f} %   influencia de ENTRADA clave 2: {b * 100:.0f} %   (velocidades 0)")
print(f"error RMS {e:.2f}")
