"""montaje-desde-tomas.py — de una lista de tomas (tomas.json) a una EDL con cortes ajustados al silencio MEDIDO.

Uso: <python con numpy> montaje-desde-tomas.py tomas.json [--colchon 0.06] [--pausa-veredicto 0.22]
- Cada tramo [entrada, salida] (segundos del bruto, elegidos por frases) se ajusta:
    entrada → el punto más silencioso en [entrada − 0,25 s, entrada + 0,03 s], dejando --colchon antes del arranque de voz;
    salida  → el punto más silencioso en [salida − 0,03 s, salida + 0,30 s].
- Entre tramos de un mismo bloque (acción → veredicto) se deja una micro-pausa de --pausa-veredicto (silencio del propio bruto).
- Escribe edl.json junto a tomas.json: [{"bloque","entrada","salida","t_montaje"}…] y tramos.json para cortes-voz.py.
Código propio (07-11-2026).
"""
import argparse, json, os, subprocess
import numpy as np
a = argparse.ArgumentParser(); a.add_argument("tomas"); a.add_argument("--colchon", type=float, default=0.06); a.add_argument("--pausa-veredicto", type=float, default=0.22)
o = a.parse_args()
T = json.load(open(o.tomas)); d = os.path.dirname(os.path.abspath(o.tomas))
x = np.frombuffer(subprocess.run(["/Users/luiyi/.local/bin/ffmpeg", "-nostdin", "-v", "error", "-i", T["bruto"], "-vn", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
hop = 160; n = len(x) // hop; db = 20 * np.log10(np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(1)) + 1e-9)
ruido = np.percentile(db, 20); voz = ruido + 0.45 * (np.percentile(db, 95) - ruido)
def idx(t): return int(t / 0.01)
PAL = sorted([w for w in json.load(open(T["palabras"])) if w.get("inicio") is not None], key=lambda w: w["inicio"])
def fin_anterior(t): return max([w["fin"] for w in PAL if w["fin"] <= t - 0.02] or [t - 0.6])
def inicio_siguiente(t): return min([w["inicio"] for w in PAL if w["inicio"] >= t + 0.02] or [t + 0.3])
avisos = []
def entrada(t):
    a0 = max(fin_anterior(t), t - 0.6); w = db[idx(a0):idx(t + 0.03)]
    if len(w) == 0: return t
    on = np.where(w >= voz)[0]
    quieto = np.where(w < voz)[0]
    antes = quieto[quieto < on[0]] if len(on) else quieto
    if len(antes) == 0:
        avisos.append(f"entrada {t:.2f}: habla continua → corte en el límite de palabra (−50 ms por el retraso medido de WhisperX)"); return round(t - 0.05, 3)
    return round(a0 + antes.max() * 0.01 - o.colchon + 0.01, 3) if len(on) else round(t - o.colchon, 3)
def salida(t):
    b1 = min(inicio_siguiente(t), t + 0.30); w = db[idx(t - 0.03):idx(b1)]
    quieto = np.where(w < voz)[0]
    if len(quieto) == 0:
        avisos.append(f"salida {t:.2f}: habla continua → corte en el límite de palabra"); return round(t + 0.02, 3)
    return round(t - 0.03 + quieto[0] * 0.01 + 0.04, 3)
edl, tramos, t = [], [], 0.0
for b in T["bloques"]:
    for j, (e, s) in enumerate(b["tramos"]):
        e2, s2 = entrada(e), salida(s)
        if j > 0: e2 = max(e2, e - o.pausa_veredicto)
        edl.append({"bloque": b["id"], "entrada": e2, "salida": s2, "t_montaje": round(t, 3), "clave": b.get("clave"), "marca": b.get("marca") if j == len(b["tramos"]) - 1 else None})
        tramos.append([e2, s2]); t += s2 - e2
json.dump(edl, open(os.path.join(d, "edl.json"), "w"), ensure_ascii=False, indent=1)
json.dump(tramos, open(os.path.join(d, "tramos.json"), "w"))
for v in avisos: print("  AVISO", v)
print(f"{len(edl)} tramos · duración del montaje {t:.2f} s · umbral de voz {voz:.0f} dB")
for r in edl: print(f"  {r['bloque']:7s} {r['entrada']:8.3f}–{r['salida']:8.3f}  (montaje {r['t_montaje']:6.2f})")
