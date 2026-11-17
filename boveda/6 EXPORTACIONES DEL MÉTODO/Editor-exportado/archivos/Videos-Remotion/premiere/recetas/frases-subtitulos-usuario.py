# Frases de subtítulo (estilo del usuario: frase completa, minúsculas, sin signos salvo ?) sobre su secuencia MVI_1373, solo en entrevistas, desde 0:58.
import json, re
R = "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/ricos/"
ENT = set("1315 1317 1319 1320 1322 1330 1334 1336 1341 1345 1354 1363".split())
cl = [l.split("|") for l in open(R + "v1.txt").read().splitlines()]
pal = []
for n, a, b, i0 in cl:
    c = n[4:8]; a, b, i0 = float(a), float(b), float(i0)
    if c not in ENT or b < 58.4: continue
    W = json.load(open("~/Videos-Remotion/voz/salida/MVI_%s.palabras.json" % c)); prev = None
    for w in W:
        tx = w["texto"].strip()
        if tx in ("...", "Ehh", "Eh", "Mmm") or not tx: continue
        m = (w["inicio"] + min(w["fin"], w["inicio"] + 0.6)) / 2
        if not (i0 <= m <= i0 + (b - a)): continue
        if prev and w["inicio"] < prev["fin"] - 0.05: continue
        ta = a + max(0, w["inicio"] - i0); tb = a + min(b - a, w["fin"] - i0)
        if ta < 58.4: continue
        pal.append(dict(t=tx, a=ta, b=tb, clip=n + "@" + str(a))); prev = w
F, g = [], []
def cerrar():
    global g
    if g:
        tx = " ".join(x["t"] for x in g).lower(); tx = re.sub(r"[¿¡.,;:!…]", "", tx).replace("  ", " ").strip()
        if tx: F.append([round(g[0]["a"], 3), round(g[-1]["b"] + 0.12, 3), tx])
    g = []
for w in pal:
    if g and (w["a"] - g[-1]["b"] > 0.4 or w["clip"] != g[-1]["clip"] or len(" ".join(x["t"] for x in g + [w])) > 40): cerrar()
    g.append(w)
    if re.search(r"[.?!]$", w["t"]) or (re.search(r",$", w["t"]) and len(g) >= 3): cerrar()
cerrar()
for i in range(len(F) - 1): F[i][1] = min(F[i][1], F[i + 1][0])
json.dump(F, open(R + "frases.json", "w"), ensure_ascii=False)
for i, f in enumerate(F): print(i, "%.2f" % f[0], f[2])
