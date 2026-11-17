"""ajuste_posicion_ae.py — ajusta keys de POSICIÓN UNIFICADA de After Effects (trayecto Bézier + gráfico de velocidad)
a una trayectoria medida (x, y por fotograma). Probado en la Tanda 03 · 02 ("Dominando las curvas": la F que salta).

Modelo exacto de AE por tramo entre dos keys:
  - trayecto: Bézier P0, P0 + Tsalida, P1 + Tentrada, P1 (longitud L);
  - avance por el trayecto: Bézier distancia-tiempo (t0, 0) (t0 + Io·T, So·Io·T) (t1 − Ii·T, L − Si·Ii·T) (t1, L),
    con So/Si = velocidad (px/s) e Io/Ii = influencia (0..1) de cada lado.
  - La medida se compara con la MEDIA de la posición durante el obturador (180° = ±1/4 de fotograma), que es lo que
    se ve con desenfoque de movimiento. Pon "obturador": 0 si el original no lo tiene.

Uso: python ajuste_posicion_ae.py config.json salida.json
config.json:
{
  "fps": 30, "obturador": 0.5, "reinicios": 4, "iteraciones": 3000,
  "medidas": [[fr, x, y], ...],
  "keys": [
    {"fr": 17, "x": 342.5, "y": 793.2,
     "tangente": "cero",                  # cero | horizontal | libre   (tiradores del trayecto en esta key)
     "velIn": 0, "inflIn": 33.33, "velOut": 0, "inflOut": 33.33,
     "libres": ["inflIn"]},               # qué se ajusta de esta key: x, y, fr, h (tiradores), velIn, inflIn, velOut, inflOut
    {"fr": 25, "x": 414, "y": 626, "tangente": "horizontal", "h": [50, 50], "libres": ["x", "y", "h", "inflIn", "inflOut"]},
    ...]
}
Salida: las keys ajustadas (con inT/outT listas para setSpatialTangentsAtKey y velocidades en px/s / influencias en %)
y el error RMS en px. En AE: claveEase(pos, k, velIn, inflIn, velOut, inflOut) de ae_lib.jsx.
"""
import json
import math
import sys

import numpy as np

sys.path.insert(0, __file__.rsplit("\\", 1)[0] if "\\" in __file__ else ".")
from ajuste_ease import nelder  # noqa: E402

U = np.linspace(0, 1, 600)


def _bez(p0, p1, p2, p3):
    u = U[:, None]
    return (1 - u) ** 3 * p0 + 3 * (1 - u) ** 2 * u * p1 + 3 * (1 - u) * u ** 2 * p2 + u ** 3 * p3


class Tramo:
    def __init__(self, t0, t1, P0, P1, Tout, Tin, So, Io, Si, Ii):
        self.t0, self.t1 = t0, t1
        P0, P1 = np.asarray(P0, float), np.asarray(P1, float)
        self.pts = _bez(P0, P0 + Tout, P1 + Tin, P1)
        seg = np.hypot(*np.diff(self.pts, axis=0).T)
        self.cum = np.concatenate([[0], np.cumsum(seg)])
        L = self.cum[-1]
        T = t1 - t0
        Io, Ii = min(max(Io, 0.001), 1), min(max(Ii, 0.001), 1)
        self.tx = (1 - U) ** 3 * t0 + 3 * (1 - U) ** 2 * U * (t0 + Io * T) + 3 * (1 - U) * U ** 2 * (t1 - Ii * T) + U ** 3 * t1
        self.dy = 3 * (1 - U) ** 2 * U * (So * Io * T) + 3 * (1 - U) * U ** 2 * (L - Si * Ii * T) + U ** 3 * L
        self.L = L

    def pos(self, t):
        d = np.clip(np.interp(t, self.tx, self.dy), 0, self.L)
        k = np.interp(d, self.cum, np.arange(len(self.cum)))
        i = min(int(k), len(self.pts) - 2); f = k - i
        return self.pts[i] * (1 - f) + self.pts[i + 1] * f


def posicion(tramos, t):
    if t <= tramos[0].t0:
        return tramos[0].pos(tramos[0].t0)
    for tr in tramos:
        if tr.t0 <= t <= tr.t1:
            return tr.pos(t)
    return tramos[-1].pos(tramos[-1].t1)


def construir(keys, fps):
    tramos = []
    for a, b in zip(keys[:-1], keys[1:]):
        tramos.append(Tramo(a["fr"] / fps, b["fr"] / fps, (a["x"], a["y"]), (b["x"], b["y"]), np.array(a["outT"]), np.array(b["inT"]),
                            a["velOut"], a["inflOut"] / 100, b["velIn"], b["inflIn"] / 100))
    return tramos


def tangentes(keys):
    for i, k in enumerate(keys):
        modo = k.get("tangente", "cero")
        if modo == "cero":
            k["inT"], k["outT"] = [0.0, 0.0], [0.0, 0.0]
        elif modo == "horizontal":
            prev = keys[i - 1]["x"] if i > 0 else k["x"]
            nxt = keys[i + 1]["x"] if i + 1 < len(keys) else k["x"]
            s = 1.0 if nxt >= prev else -1.0          # sentido del movimiento en x
            h = k.get("h", [40, 40])
            k["inT"], k["outT"] = [-s * abs(h[0]), 0.0], [s * abs(h[1]), 0.0]
        # "libre": inT/outT vienen en la key


def main():
    cfg = json.load(open(sys.argv[1], encoding="utf-8"))
    fps = cfg.get("fps", 30.0)
    obt = cfg.get("obturador", 0.5)
    med = np.array(cfg["medidas"], float)
    keys = cfg["keys"]
    for k in keys:
        for campo, v in (("velIn", 0.0), ("inflIn", 33.33), ("velOut", 0.0), ("inflOut", 33.33)):
            k.setdefault(campo, v)
        if k.get("tangente") == "libre":
            k.setdefault("inT", [0.0, 0.0]); k.setdefault("outT", [0.0, 0.0])
    # vector de parámetros libres
    libres = []
    for i, k in enumerate(keys):
        for campo in k.get("libres", []):
            if campo == "h":
                libres += [(i, "h0"), (i, "h1")]
            elif campo in ("inT", "outT"):
                libres += [(i, campo + "0"), (i, campo + "1")]
            else:
                libres.append((i, campo))

    def aplicar(p):
        ks = [dict(k) for k in keys]
        for (i, campo), v in zip(libres, p):
            if campo in ("h0", "h1"):
                h = list(ks[i].get("h", [40, 40])); h[int(campo[1])] = v; ks[i]["h"] = h
            elif campo[:-1] in ("inT", "outT"):
                t = list(ks[i][campo[:-1]]); t[int(campo[-1])] = v; ks[i][campo[:-1]] = t
            else:
                ks[i][campo] = v
        tangentes(ks)
        return ks

    sub = np.linspace(-obt / 2, obt / 2, 5) if obt > 0 else np.array([0.0])

    def err(p):
        ks = aplicar(p)
        for k in ks:
            if not (0.1 <= k["inflIn"] <= 100 and 0.1 <= k["inflOut"] <= 100):
                return 1e18
            if k["velIn"] < 0 or k["velOut"] < 0:          # en posición (espacial) AE no admite velocidades negativas
                return 1e18
        for a, b in zip(ks[:-1], ks[1:]):
            if b["fr"] - a["fr"] < 1:
                return 1e18
        tr = construir(ks, fps)
        e = 0.0
        for fr, x, y in med:
            q = np.mean([posicion(tr, (fr + s) / fps) for s in sub], axis=0)
            e += (q[0] - x) ** 2 + (q[1] - y) ** 2
        return e

    x0 = np.array([keys[i].get(c, 0.0) if c not in ("h0", "h1") and c[:-1] not in ("inT", "outT")
                   else (keys[i].get("h", [40, 40])[int(c[1])] if c in ("h0", "h1") else keys[i][c[:-1]][int(c[-1])])
                   for i, c in libres], float)
    escala = {"x": 5, "y": 5, "fr": 0.5, "h0": 15, "h1": 15, "velIn": 200, "velOut": 200, "inflIn": 10, "inflOut": 10}
    paso = np.array([escala.get(c, 10 if c[:-1] in ("inT", "outT") else 5) for _, c in libres], float)
    mejor = None
    for r in range(cfg.get("reinicios", 4)):
        p, e = nelder(err, x0 if mejor is None else mejor[1], paso * (0.6 ** r), iters=cfg.get("iteraciones", 3000))
        if mejor is None or e < mejor[0]:
            mejor = (e, p)
    e, p = mejor
    ks = aplicar(p)
    rms = math.sqrt(e / len(med))
    salida = {"rms_px": rms, "keys": [{c: k[c] for c in ("fr", "x", "y", "inT", "outT", "velIn", "inflIn", "velOut", "inflOut")} for k in ks]}
    json.dump(salida, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("RMS %.2f px" % rms)
    for k in salida["keys"]:
        print("fr %6.2f  (%7.1f, %7.1f)  inT %s outT %s  entra %.0f px/s %.1f %%  sale %.0f px/s %.1f %%" % (
            k["fr"], k["x"], k["y"], [round(v, 1) for v in k["inT"]], [round(v, 1) for v in k["outT"]], k["velIn"], k["inflIn"], k["velOut"], k["inflOut"]))


if __name__ == "__main__":
    main()
