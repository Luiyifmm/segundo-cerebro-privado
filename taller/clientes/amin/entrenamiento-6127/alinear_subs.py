import json, unicodedata, difflib
def norm(s): return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn" and c.isalnum())
W = [w for w in json.load(open("montaje-v1-audio.palabras.json")) if w["inicio"] is not None]
oid = [norm(w["texto"]) for w in W]
bloques = []
for l in open("subtitulos.txt"):
    if l.startswith("#") or not l.strip(): continue
    linea, clave = [x.strip() for x in l.split("|")]
    bloques.append((linea, clave))
esp, dueño = [], []
for k, (li, cl) in enumerate(bloques):
    for w in (li + " " + cl).split():
        esp.append(norm(w)); dueño.append(k)
esp = [("ninat" if e == "ninato" and False else e) for e in esp]
m = difflib.SequenceMatcher(a=esp, b=oid, autojunk=False)
mapa = {}
for a0, b0, n in m.get_matching_blocks():
    for i in range(n): mapa[a0 + i] = b0 + i
# palabras sin pareja (p. ej. "niñato"/"niñat", "del"/"al"): tomar la vecina
for i in range(len(esp)):
    if i not in mapa:
        j = mapa.get(i - 1, None); mapa[i] = (j + 1) if j is not None else mapa.get(i + 1, 0) - 1
subs = []
for k, (li, cl) in enumerate(bloques):
    idx = [mapa[i] for i in range(len(esp)) if dueño[i] == k]
    subs.append([round(W[min(idx)]["inicio"] - 0.05, 3), round(W[max(idx)]["fin"] + 0.12, 3), li, cl])
for i in range(len(subs) - 1):
    if subs[i + 1][0] - subs[i][1] < 0.5: subs[i][1] = round(subs[i + 1][0] - 0.02, 3)
json.dump(subs, open("subtitulos.json", "w"), ensure_ascii=False, indent=0)
for s in subs: print(f"{s[0]:6.2f}-{s[1]:6.2f} {s[2]:22s}| {s[3]}")
print(len(subs), "subtítulos")
