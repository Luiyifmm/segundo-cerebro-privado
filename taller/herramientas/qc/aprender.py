"""aprender.py — convierte los retoques manuales del usuario en PROPUESTAS de regla (nunca en reglas directamente).

Uso:
  python3 aprender.py <antes.json> <despues.json> --trabajo <ID> [--mios "Subtitulo Amin|SFX|pitido"] [--escribir]

1. Empareja los clips de las dos fotos (premiere/recetas/leer-secuencia.jsx) y lista cada cambio exacto.
2. Clasifica cada cambio:
   - TÉCNICA: corrige un error objetivo (sincronía de ≤ 3 fotogramas, ortografía, tildes, mayúsculas, nivel de voz).
   - ESTILO: una preferencia que se repite (el mismo tipo de cambio en ≥ 2 clips del mismo tipo, o sobre la
     estética de MIS clips: nivel de SFX, escala o posición de subtítulos, efectos).
   - VÍDEO: decisión que solo vale para este vídeo (un texto reescrito, un clip movido, un recurso añadido o quitado una vez).
3. Propone una explicación y, para TÉCNICA o ESTILO, una regla corta.
4. Con --escribir, añade el bloque a `4 ENTRENAMIENTO/PROPUESTAS DE REGLAS.md` con estado PENDIENTE.
   Nada pasa a la ficha ni a las lecciones sin aprobación del usuario.
Código propio (06-11-2026).
"""
import json, sys, math, re, argparse, unicodedata, datetime, os
from collections import defaultdict

a = argparse.ArgumentParser(); a.add_argument("antes"); a.add_argument("despues"); a.add_argument("--trabajo", required=True)
a.add_argument("--mios", default=""); a.add_argument("--fps", type=float, default=30); a.add_argument("--escribir", action="store_true"); a.add_argument("--archivo", default="")
o = a.parse_args()

def carga(f):
    t = open(f, encoding="utf8").read()
    try: d = json.loads(t)
    except ValueError:
        import ast; d = ast.literal_eval(t)
    if isinstance(d, dict) and "result" in d: d = d["result"]
    if isinstance(d, str): d = json.loads(d)
    return d

A, B = carga(o.antes), carga(o.despues)
mio = re.compile(o.mios, re.I) if o.mios else None
def db(v): return 20 * math.log10(v) + 15 if v and v > 0 else None
def norm(s): return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn" and c.isalnum())

def grupo(d):
    g = defaultdict(list)
    for c in sorted(d["clips"], key=lambda c: c["i"]): g[c["n"]].append(c)
    return g
ga, gb = grupo(A), grupo(B); cambios = []   # (tipo, clip, detalle, datos)
for n in sorted(set(ga) | set(gb)):
    la, lb = ga.get(n, []), gb.get(n, []); usados = set()
    for x in la:
        cand = [(abs(y["i"] - x["i"]) + (0 if y["p"] == x["p"] else 0.5), j) for j, y in enumerate(lb) if j not in usados]
        if not cand: cambios.append(("borrado", x, f"{x['p']} {n} {x['i']}–{x['f']} borrado", {})); continue
        _, j = min(cand); usados.add(j); y = lb[j]
        if abs(y["i"] - x["i"]) > 0.005: cambios.append(("mover", y, f"{y['p']} {n}: inicio {x['i']}→{y['i']} ({(y['i']-x['i'])*o.fps:+.1f} fotogramas)", {"d": y["i"] - x["i"]}))
        if abs((y["f"] - y["i"]) - (x["f"] - x["i"])) > 0.02: cambios.append(("duracion", y, f"{y['p']} {n}: duración {x['f']-x['i']:.2f}→{y['f']-y['i']:.2f} s", {"d": (y['f']-y['i'])-(x['f']-x['i'])}))
        if y.get("off") != x.get("off"): cambios.append(("desactivar" if y.get("off") else "activar", y, f"{y['p']} {n} @{y['i']}: {'desactivado' if y.get('off') else 'activado'}", {}))
        ta, tb = x.get("txt") or [], y.get("txt") or []
        if ta != tb:
            for q in range(max(len(ta), len(tb))):
                va, vb = (ta[q] if q < len(ta) else ""), (tb[q] if q < len(tb) else "")
                if va != vb: cambios.append(("texto", y, f"{y['p']} {n} @{y['i']}: texto «{va}» → «{vb}»", {"a": [va], "b": [vb]}))
        if x.get("vol") and y.get("vol") and abs(y["vol"] - x["vol"]) > 0.001:
            cambios.append(("nivel", y, f"{y['p']} {n} @{y['i']}: nivel {db(x['vol']):+.1f}→{db(y['vol']):+.1f} dB", {"d": db(y["vol"]) - db(x["vol"])}))
        if y.get("esc") != x.get("esc"): cambios.append(("escala", y, f"{y['p']} {n} @{y['i']}: escala {x.get('esc')}→{y.get('esc')}", {}))
        if y.get("pos") != x.get("pos"): cambios.append(("posicion", y, f"{y['p']} {n} @{y['i']}: posición {x.get('pos')}→{y.get('pos')}", {}))
        fa, fb = set(x.get("fx", [])), set(y.get("fx", []))
        for f in sorted(fb - fa): cambios.append(("efecto+", y, f"{y['p']} {n} @{y['i']}: + efecto {f}", {"fx": f}))
        for f in sorted(fa - fb): cambios.append(("efecto-", y, f"{y['p']} {n} @{y['i']}: − efecto {f}", {"fx": f}))
    for j, y in enumerate(lb):
        if j not in usados: cambios.append(("añadido", y, f"{y['p']} {n} {y['i']}–{y['f']} añadido", {}))

# --- clasificación ---
cuenta = defaultdict(list)
for c in cambios: cuenta[(c[0], c[1]["n"])].append(c)
salida = []
for t, clip, det, dat in cambios:
    es_mio = bool(mio and mio.search(clip["n"]))
    rep = len(cuenta[(t, clip["n"])])
    cls, motivo, regla = "VÍDEO", "decisión de este vídeo", None
    if t == "mover" and abs(dat["d"]) * o.fps <= 3.01:
        cls, motivo = "TÉCNICA", "ajuste de sincronía (≤ 3 fotogramas): mi colocación no caía en la palabra"
        regla = f"Colocar «{clip['n']}» {'más tarde' if dat['d'] > 0 else 'antes'} (~{abs(dat['d'])*o.fps:.0f} f) respecto a la palabra" if rep >= 2 else "Comprobar la sincronía con la palabra (±2 f) antes de entregar"
    elif t == "texto":
        a1, b1 = " ".join(dat["a"]), " ".join(dat["b"])
        if norm(a1) == norm(b1):
            cls, motivo, regla = "TÉCNICA", "ortografía, tildes o mayúsculas", "Revisar ortografía, tildes y mayúsculas de los textos en pantalla"
        else:
            motivo = "texto reescrito para este vídeo"
    elif t == "nivel":
        if re.search(r"(?i)voz|dialog|IMG_|MVI_|A001", clip["n"]):
            cls, motivo, regla = "TÉCNICA", "nivel de voz", f"Nivel de voz: {dat['d']:+.1f} dB respecto a mi mezcla"
        elif es_mio or rep >= 2:
            cls, motivo, regla = "ESTILO", "mis sonidos le sonaban fuertes o flojos", f"«{clip['n']}» {dat['d']:+.0f} dB (≈ {db(clip['vol']):+.0f} dB)"
    elif t in ("escala", "posicion") and (es_mio or rep >= 2):
        cls, motivo, regla = "ESTILO", "tamaño o posición de mis gráficos o subtítulos", f"Ajustar {t} de «{clip['n']}» al valor que dejó el usuario"
    elif t in ("efecto+", "efecto-") and (es_mio or rep >= 2):
        cls, motivo, regla = "ESTILO", f"{'añade' if t=='efecto+' else 'quita'} «{dat['fx']}» en mis clips", f"{'Añadir' if t=='efecto+' else 'No usar'} «{dat['fx']}» en «{clip['n']}»"
    elif t in ("desactivar", "borrado") and es_mio and rep >= 2:
        cls, motivo, regla = "ESTILO", "le sobran varios de mis clips del mismo tipo", f"Usar menos «{clip['n']}» (quitó {rep})"
    elif t == "duracion" and es_mio and rep >= 2:
        cls, motivo, regla = "ESTILO", "duración de mis clips", f"Duración de «{clip['n']}»: {dat['d']:+.2f} s"
    salida.append((cls, det, motivo, regla))

hoy = datetime.date.today().isoformat()
lin = [f"## {hoy} · {o.trabajo} · {len(cambios)} cambio(s) del usuario", "", f"Fotos: `{os.path.basename(o.antes)}` → `{os.path.basename(o.despues)}`", "",
       "| # | Tipo | Cambio exacto | Explicación propuesta | Regla propuesta | Estado |", "|---|---|---|---|---|---|"]
for k, (cls, det, mot, reg) in enumerate(salida, 1):
    lin.append(f"| P{k} | {cls} | {det} | {mot} | {reg or '— (no es regla)'} | {'PENDIENTE' if reg else 'solo este vídeo'} |")
txt = "\n".join(lin) + "\n"
print(txt)
if o.escribir:
    f = o.archivo or os.path.expanduser("~/EDICION/0 CLAUDE EDITOR/4 ENTRENAMIENTO/PROPUESTAS DE REGLAS.md")
    s = open(f, encoding="utf8").read() if os.path.exists(f) else ""
    marca = "<!-- nuevas debajo -->"
    s = s.replace(marca, marca + "\n\n" + txt, 1) if marca in s else s + "\n" + txt
    open(f, "w", encoding="utf8").write(s); print("añadido a", f)
