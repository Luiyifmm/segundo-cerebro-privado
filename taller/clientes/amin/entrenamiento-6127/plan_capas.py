"""Calcula, desde la EDL y las palabras VERIFICADAS (WhisperX, voz principal), los tiempos en el montaje de:
subtítulos (línea 1–3 palabras + clave = veredicto), marcas del marcador (HOMBRE/NIÑATO), sonidos y escalas por clip."""
import json, re, unicodedata
E = json.load(open("edl.json")); T = json.load(open("tomas.json"))
P = [w for w in json.load(open(T["palabras"])) if w.get("inicio") is not None]
def norm(s): return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn" and c.isalnum())
pal = []  # palabras del montaje con tiempo de montaje
for k, e in enumerate(E):
    for w in P:
        mid = (w["inicio"] + w["fin"]) / 2
        if e["entrada"] <= mid <= e["salida"] and w["voz"] == "principal":
            pal.append({"t": round(e["t_montaje"] + w["inicio"] - e["entrada"], 3), "f": round(e["t_montaje"] + w["fin"] - e["entrada"], 3),
                        "w": w["texto"].strip(" ,.¿?¡!"), "b": e["bloque"], "fiable": w["fiable"], "tramo": k})
# subtítulos por bloque: la clave (veredicto) al final, línea de 1–3 palabras delante; nunca terminar línea en artículo/preposición
DEBIL = {"de", "la", "el", "que", "y", "a", "en", "un", "una", "tu", "lo", "con", "por", "si"}
subs = []
for b in T["bloques"]:
    ws = [p for p in pal if p["b"] == b["id"]]
    if not ws: continue
    clave = b["clave"].split(); nc = len(clave)
    cuerpo, cl = ws[:-nc], ws[-nc:]
    if [norm(x["w"]) for x in cl] != [norm(c) for c in clave]:
        cuerpo, cl = ws, []  # la clave no está al final: sin clave en este bloque
    grupos, g = [], []
    for p in cuerpo:
        g.append(p)
        if len(g) == 3 or (len(g) >= 2 and p is cuerpo[-1]): grupos.append(g); g = []
    if g: grupos.append(g)
    # no acabar en palabra débil: pasarla al grupo siguiente
    for i in range(len(grupos) - 1):
        while len(grupos[i]) > 1 and norm(grupos[i][-1]["w"]) in DEBIL: grupos[i + 1].insert(0, grupos[i].pop())
    for i, g in enumerate(grupos):
        ultimo = i == len(grupos) - 1
        ini = g[0]["t"]; fin = (cl[-1]["f"] if (ultimo and cl) else g[-1]["f"])
        sig = None
        subs.append([round(ini - 0.05, 3), round(fin + 0.12, 3), " ".join(x["w"] for x in g), " ".join(x["w"] for x in cl) if (ultimo and cl) else ""])
# encadenar: cada subtítulo dura hasta el siguiente (sin huecos de < 0,4 s)
for i in range(len(subs) - 1):
    if subs[i + 1][0] - subs[i][1] < 0.4: subs[i][1] = round(subs[i + 1][0] - 0.02, 3)
# marcas del marcador en la palabra-veredicto
marcas = []
for b in T["bloques"]:
    if not b.get("marca"): continue
    cl = [p for p in pal if p["b"] == b["id"]][-len(b["clave"].split()):]
    if cl: marcas.append({"bloque": b["id"], "tipo": b["marca"], "palabra": " ".join(x["w"] for x in cl), "t": cl[0]["t"], "fiable": all(x["fiable"] for x in cl)})
json.dump({"subtitulos": subs, "marcas": marcas, "palabras": pal}, open("capas.json", "w"), ensure_ascii=False, indent=1)
for s in subs: print(f"SUB {s[0]:6.2f}-{s[1]:6.2f}  {s[2]:28s} | {s[3]}")
for m in marcas: print(f"MARCA {m['tipo']:3s} {m['t']:6.2f}  «{m['palabra']}» fiable={m['fiable']}")
