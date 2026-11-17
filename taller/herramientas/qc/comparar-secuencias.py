"""comparar-secuencias.py — qué cambió en una secuencia entre dos fotos (antes/después de un retoque del usuario).

Uso:  python3 comparar-secuencias.py antes.json despues.json
Las fotos salen de premiere/recetas/leer-secuencia.jsx. Empareja clips por pista + nombre + orden y lista:
movidos, recortados, de pista nueva, borrados, añadidos, (des)activados, textos cambiados, nivel, escala/posición
y efectos añadidos o quitados. Es la materia prima para convertir un retoque en una regla (ficha o lecciones).
Código propio (06-11-2026).
"""
import json, sys, math
from collections import defaultdict
def carga(f):
    t = open(f, encoding="utf8").read()
    try: d = json.loads(t)
    except ValueError:
        import ast; d = ast.literal_eval(t)
    if isinstance(d, dict) and "result" in d: d = d["result"]  # respuesta completa del puente
    if isinstance(d, str): d = json.loads(d)
    return d
A = carga(sys.argv[1]); B = carga(sys.argv[2])
def db(v): return f"{20*math.log10(v)+15:+.1f} dB" if v and v > 0 else "−∞"
def grupo(d):
    g = defaultdict(list)
    for c in sorted(d["clips"], key=lambda c: c["i"]): g[c["n"]].append(c)
    return g
ga, gb = grupo(A), grupo(B); cambios = []
for n in sorted(set(ga) | set(gb)):
    la, lb = ga.get(n, []), gb.get(n, []); usados = set()
    for a in la:
        # el de "después" más cercano en tiempo con el mismo nombre
        cand = [(abs(b["i"] - a["i"]) + (0 if b["p"] == a["p"] else 0.5), j) for j, b in enumerate(lb) if j not in usados]
        if not cand: cambios.append(f"BORRADO   {a['p']} {n} {a['i']}–{a['f']}"); continue
        _, j = min(cand); usados.add(j); b = lb[j]; d = []
        if b["p"] != a["p"]: d.append(f"pista {a['p']}→{b['p']}")
        if abs(b["i"] - a["i"]) > 0.02: d.append(f"inicio {a['i']}→{b['i']} ({b['i']-a['i']:+.2f} s)")
        if abs((b["f"] - b["i"]) - (a["f"] - a["i"])) > 0.02: d.append(f"duración {a['f']-a['i']:.2f}→{b['f']-b['i']:.2f} s")
        if b.get("off") != a.get("off"): d.append("desactivado" if b.get("off") else "activado")
        if b.get("txt") != a.get("txt"): d.append(f"texto {a.get('txt')} → {b.get('txt')}")
        if a.get("vol") and b.get("vol") and abs(b["vol"] - a["vol"]) > 0.001: d.append(f"nivel {db(a['vol'])}→{db(b['vol'])}")
        if b.get("esc") != a.get("esc"): d.append(f"escala {a.get('esc')}→{b.get('esc')}")
        if b.get("pos") != a.get("pos"): d.append(f"posición {a.get('pos')}→{b.get('pos')}")
        fa, fb = set(a.get("fx", [])), set(b.get("fx", []))
        if fb - fa: d.append("efecto + " + ", ".join(sorted(fb - fa)))
        if fa - fb: d.append("efecto − " + ", ".join(sorted(fa - fb)))
        if d: cambios.append(f"CAMBIADO  {b['p']} {n} @{b['i']}: " + "; ".join(d))
    for j, b in enumerate(lb):
        if j not in usados: cambios.append(f"AÑADIDO   {b['p']} {n} {b['i']}–{b['f']}" + (f" texto {b.get('txt')}" if b.get("txt") else ""))
print(f"{A['secuencia']}: {len(A['clips'])} clips antes, {len(B['clips'])} después · {len(cambios)} cambio(s)")
print("\n".join(cambios) if cambios else "Sin cambios.")
