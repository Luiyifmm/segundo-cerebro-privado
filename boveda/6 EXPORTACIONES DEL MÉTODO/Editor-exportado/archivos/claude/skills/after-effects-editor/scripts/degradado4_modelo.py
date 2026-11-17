"""Modelo MEDIDO del efecto "Degradado de 4 colores" (ADBE 4ColorGradient) de After Effects y ajuste a medidas.

Descubierto en la clase 12 (Mira cómo edito): con muestras reales de AE (sampleImage) el color en un punto es
    color = Σ wᵢ·cᵢ / Σ wᵢ      con      wᵢ = 1 / (dᵢ² + fusión²)^1,1
(dᵢ = distancia en px al punto i; "fusión" = el parámetro Blend/Fusionar). Error < 1 nivel con fusión 100–2000.
Ojo: con fusión alta, ni siquiera JUNTO a un punto se llega a su color (con 847 y 3 puntos negros a 1000 px, 47 %).

Uso:
  python degradado4_modelo.py muestras.csv [fusion_fija]
     muestras.csv: x,y,valor   (coordenadas de la capa del degradado; valor 0-255, un canal o luz)
     Busca 4 puntos + 4 grises + fusión que mejor reproducen las muestras y los imprime.
  Desde otro script:  from degradado4_modelo import campo; campo(X, Y, puntos, colores, fusion)
"""
import sys

import numpy as np


def campo(X, Y, puntos, colores, fusion):
    """Valor del degradado en (X, Y). puntos: [[x,y]x4]; colores: 4 valores o 4 colores RGB."""
    P = np.asarray(puntos, dtype=float)
    C = np.asarray(colores, dtype=float)
    X = np.asarray(X, dtype=float)[:, None]
    Y = np.asarray(Y, dtype=float)[:, None]
    w = 1.0 / ((X - P[None, :, 0]) ** 2 + (Y - P[None, :, 1]) ** 2 + fusion ** 2) ** 1.1
    w = w / w.sum(axis=1, keepdims=True)
    return w @ C


def ajustar(X, Y, V, arranques=None, fusion_fija=None):
    """Descenso por coordenadas: posiciones y fusión; los colores salen por mínimos cuadrados en cada prueba."""
    X, Y, V = map(lambda a: np.asarray(a, dtype=float), (X, Y, V))
    x0, x1, y0, y1 = X.min(), X.max(), Y.min(), Y.max()
    if arranques is None:
        arranques = [[x0, x1, x0, x1, y0, y0, y1, y1, 600], [(x0 + x1) / 2, (x0 + x1) / 2, x0, x1, y0, y1, (y0 + y1) / 2, (y0 + y1) / 2, 800]]

    def colores(p):
        P = np.array([[p[k], p[4 + k]] for k in range(4)])
        w = 1.0 / ((X[:, None] - P[None, :, 0]) ** 2 + (Y[:, None] - P[None, :, 1]) ** 2 + p[8] ** 2) ** 1.1
        w = w / w.sum(axis=1, keepdims=True)
        c = np.clip(np.linalg.lstsq(w, V, rcond=None)[0], 0, 255)
        return c, float(np.sqrt(np.mean((w @ c - V) ** 2)))

    mejor = (1e9, None, None)
    for a in arranques:
        p = np.array(a, dtype=float)
        if fusion_fija:
            p[8] = fusion_fija
        paso = np.array([max(x1 - x0, y1 - y0) / 6] * 8 + [150.0])
        e0 = colores(p)[1]
        for _ in range(300):
            mejoro = False
            for k in range(8 if fusion_fija else 9):
                for s in (1, -1):
                    q = p.copy()
                    q[k] += s * paso[k]
                    if q[8] < 20:
                        continue
                    e = colores(q)[1]
                    if e < e0:
                        p, e0, mejoro = q, e, True
            if not mejoro:
                paso *= 0.6
            if paso.max() < 1:
                break
        if e0 < mejor[0]:
            mejor = (e0, p, colores(p)[0])
    e, p, c = mejor
    return {"error": e, "puntos": [[round(p[k]), round(p[4 + k])] for k in range(4)], "colores": [round(float(v)) for v in c], "fusion": round(p[8])}


if __name__ == "__main__":
    d = np.loadtxt(sys.argv[1], delimiter=",", ndmin=2)
    r = ajustar(d[:, 0], d[:, 1], d[:, 2], fusion_fija=float(sys.argv[2]) if len(sys.argv) > 2 else None)
    print(f"error RMS {r['error']:.2f} niveles")
    print("puntos:", r["puntos"])
    print("grises:", r["colores"], " -> hex:", ["#%02X%02X%02X" % (v, v, v) for v in r["colores"]])
    print("fusión:", r["fusion"])
