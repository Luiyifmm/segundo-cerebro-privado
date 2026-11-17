# Subtítulos para el corte ACTUAL de un reel: lee las piezas de V1 (salida de leer-v1.jsx), toma las palabras de Whisper
# de cada bruto, las pasa a tiempo de secuencia y las agrupa en bloques "línea + palabra clave" (la clave solo si es la última palabra).
# Uso: python3 subs-desde-linea.py <piezas.txt> <ficha.json> <prefijo palabras> <salida.json> [extra.json]
#   piezas.txt: líneas "V1 <archivo>.mov <ini>-<fin> in <entrada>"  · ficha.json: {"claves":[...], "arreglos":{...}}
#   prefijo: p. ej. ~/Videos-Remotion/voz/salida/E14__  (se le añade el nombre del bruto sin extensión + .palabras.json)
#   extra.json (opcional): {"<bruto>": [[texto, inicio, fin], ...]} palabras re-transcritas de tramos que Whisper se saltó (tiempos del bruto)
import json, re, sys, unicodedata, os
piezas, ficha, pref, salida = sys.argv[1:5]; EXTRA = json.load(open(sys.argv[5])) if len(sys.argv) > 5 else {}
F = json.load(open(ficha)); norm = lambda s: "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn")
CL = set(norm(x) for x in F.get("claves", [])); FIX = F.get("arreglos", {}); pal = []
for k, l in enumerate(open(piezas)):
    m = re.match(r"\s*V1 (\S+)\.\w+ ([\d.]+)-([\d.]+) in ([\d.]+)", l)
    if not m: continue
    c, st, en, i0 = m.group(1), *map(float, m.groups()[1:]); o = i0 + en - st
    W = [w for w in json.load(open(os.path.expanduser(pref) + c + ".palabras.json")) if w["texto"].strip() != "..."]
    if c in EXTRA:
        a0, a1 = min(x[1] for x in EXTRA[c]), max(x[2] for x in EXTRA[c]); W = [w for w in W if not a0 - 0.5 <= w["inicio"] < a1 + 0.5] + [{"texto": t, "inicio": a, "fin": b} for t, a, b in EXTRA[c]]; W.sort(key=lambda w: w["inicio"])
    for w in W:
        a, b = w["inicio"], min(w["fin"], w["inicio"] + 0.9)   # Whisper alarga palabras: máx 0,9 s
        if i0 - 0.05 <= a < o - 0.08: pal.append(dict(t=w["texto"].strip(), a=st + max(0, a - i0), b=min(en, st + min(o, b) - i0), pz=k))
subs, g = [], []
def cerrar():
    global g
    if not g: return
    txt = [FIX.get(x["t"], x["t"]) for x in g]; kk = ""
    if norm(re.sub(r"[^\w%]", "", txt[-1])) in CL: kk = txt.pop()
    subs.append([round(g[0]["a"], 3), round(g[-1]["b"] + 0.12, 3), re.sub(r"[.,;:!¡¿?]+$|^[¿¡]", "", " ".join(txt)).strip(), re.sub(r"[.,;:!?]+$|^[¿¡]", "", kk)]); g = []
for w in pal:
    if g and (w["a"] - g[-1]["b"] > 0.4 or len(g) >= 4 or w["pz"] != g[-1]["pz"]): cerrar()
    g.append(w)
    if re.search(r"[.?!,]$", w["t"]) or norm(re.sub(r"[^\w%]", "", w["t"])) in CL: cerrar()
cerrar()
for i in range(len(subs) - 1): subs[i][1] = round(min(subs[i][1], subs[i + 1][0]), 3)
subs = [s for s in subs if (s[2] or s[3]) and s[1] - s[0] > 0.1]
json.dump(subs, open(salida, "w"), ensure_ascii=False); [print("%6.2f-%6.2f  %-36s [%s]" % tuple(s)) for s in subs]; print(len(subs), "subtítulos")
