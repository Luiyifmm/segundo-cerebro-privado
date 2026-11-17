"""Curvas de keyframes de After Effects (velocidad + influencia) muestreadas: funciones reutilizables."""
import numpy as np

U = np.linspace(0, 1, 800)

def seg(t, ta, tb, va, vb, So, Io, Si, Ii):
    """valor de un tramo entre keyframes (ta, va) y (tb, vb) con velocidad/influencia de salida (So, Io) y de entrada (Si, Ii)"""
    T = tb - ta
    x0, x1, x2, x3 = ta, ta + Io * T, tb - Ii * T, tb
    y0, y1, y2, y3 = va, va + So * Io * T, vb - Si * Ii * T, vb
    u = U
    x = (1 - u) ** 3 * x0 + 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u ** 2 * x2 + u ** 3 * x3
    y = (1 - u) ** 3 * y0 + 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u ** 2 * y2 + u ** 3 * y3
    return np.interp(t, x, y)
