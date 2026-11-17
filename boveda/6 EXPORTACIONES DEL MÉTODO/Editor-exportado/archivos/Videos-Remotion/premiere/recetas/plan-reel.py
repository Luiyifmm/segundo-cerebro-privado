# Planificador genérico de reels hablados (ClienteE/ClienteN). Uso: python plan-reel.py <ficha.json> <salida-cfg.json>
# Ficha: {"proyecto","nombre","bandeja","enlaces": carpeta con <PRE>__<archivo> → bruto real, "piezas": [[clave,a,b,zoom,canal]],
#  "broll": [[clave,a,b,"ancla"|t,pista,escala,dur?]], "textos": [[plantilla,pista,"ancla"|t,dur,props,pos,nombre]], "imgs": [[pista,ruta,"ancla"|t,dur,pos,escala]],
#  "musica": [ruta,inicio,vol], "color": [r,g,b], "subPos", "subAjustes", "claves": [...], "sinSubs": [[a,b]], "hdr": bool}
import json, re, sys, os, subprocess, unicodedata, numpy as np
F = json.load(open(sys.argv[1])); S = "~/Videos-Remotion/voz/salida/"; CACHE = "~/Videos-Remotion/clientes/lote1017/audio-cache/"; os.makedirs(CACHE, exist_ok=True)
SFX = "~/EDICION/2 MATERIALES DE EDICION/Efectos de sonido/RECURSOS DE EDICIÓN (en Drive)/EFECTOS DE SONIDO/"
def norm(s): return "".join(ch for ch in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(ch) != "Mn")
def real(clave): return os.path.realpath(os.path.join(F["enlaces"], [f for f in os.listdir(F["enlaces"]) if f.rsplit(".", 1)[0] == clave][0]))
def nombre(clave): return os.path.basename(real(clave))
def hlg(clave): return subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=color_transfer", "-of", "csv=p=0", real(clave)], capture_output=True, text=True).stdout.strip() in ("arib-std-b67", "smpte2084")
AUD = {}
def env(c):
    if c not in AUD:
        p = CACHE + c + ".raw"
        if not os.path.exists(p): subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", real(c), "-vn", "-ac", "1", "-ar", "16000", "-f", "f32le", p], check=True)
        a = np.fromfile(p, np.float32); n = len(a) // 160; e = np.sqrt((a[:n * 160].reshape(n, 160) ** 2).mean(1)); AUD[c] = np.convolve(e, np.ones(3) / 3, "same")
    return AUD[c]
def calma(c, t0, t1):
    e = env(c); i0, i1 = max(0, int(t0 * 100)), min(len(e) - 1, int(t1 * 100)); return (i0 + int(np.argmin(e[i0:i1 + 1]))) / 100 if i1 > i0 else t0
def canal(c, a, b):
    o = subprocess.run(["ffmpeg", "-hide_banner", "-ss", str(a), "-t", str(max(0.5, b - a)), "-i", real(c), "-af", "astats=measure_perchannel=RMS_level:measure_overall=none", "-f", "null", "-"], capture_output=True, text=True).stderr
    v = [float(x) if x not in ("-inf", "inf") else -200 for x in re.findall(r"RMS level dB: (\S+)", o)]
    if len(v) < 2: return ""
    return "L" if v[1] < v[0] - 25 else ("R" if v[0] < v[1] - 25 else "")
def W(c): return [w for w in json.load(open(S + c + ".palabras.json")) if w["texto"].strip() not in ("...",)]
piezas, t = [], 0.0
def busca(ws, frase, fin, desde=-1):
    m = re.match(r"^(.*?)(?:#(\d+))?$", frase); q = [norm(re.sub(r"[^\w%]", "", x)) for x in m.group(1).split()]; n = int(m.group(2) or 0); sq = [norm(re.sub(r"[^\w%]", "", w["texto"])) for w in ws]
    for i in range(len(ws)):
        if ws[i]["inicio"] < desde: continue
        if sq[i:i + len(q)] == q:
            if n == 0: return (ws[i + len(q) - 1]["inicio"] + min(ws[i + len(q) - 1]["fin"], ws[i + len(q) - 1]["inicio"] + 0.6)) / 2 if fin else ws[i]["inicio"]
            n -= 1
    raise SystemExit("no hallo en %s: %s" % (c, frase))
for p in F["piezas"]:
    c, a, b = p[0], p[1], p[2]; ws = W(c)
    if isinstance(a, str): a = busca(ws, a, False)
    if isinstance(b, str): b = busca(ws, b, True, a)
    d0 = [dict(w, fin=min(w["fin"], w["inicio"] + 0.9)) for w in ws if a - 0.05 <= (w["inicio"] + min(w["fin"], w["inicio"] + 0.6)) / 2 <= b + 0.05]
    if not d0: raise SystemExit("sin palabras en %s %s-%s" % (c, a, b))
    grupos = [[d0[0]]]
    for w in d0[1:]:
        if w["inicio"] - grupos[-1][-1]["fin"] > 0.8: grupos.append([w])
        else: grupos[-1].append(w)
    for d in grupos:
        an = [w for w in ws if w["inicio"] < d[0]["inicio"] - 0.01]; de = [w for w in ws if w["inicio"] > d[-1]["inicio"] + 0.01]
        lo = max(d[0]["inicio"] - 0.3, min(an[-1]["fin"], an[-1]["inicio"] + 0.9) + 0.02 if an else 0); hi = d[0]["inicio"] + 0.02; i0 = calma(c, lo, hi) if hi - lo > 0.05 else lo
        lo = d[-1]["fin"] - 0.03; hi = min(d[-1]["fin"] + 0.3, de[0]["inicio"] - 0.03 if de else 9e9); i1 = calma(c, lo, hi) if hi - lo > 0.05 else max(lo, hi); i1 = max(i1, i0 + 0.4)
        piezas.append(dict(c=c, i=round(i0, 3), o=round(i1, 3), st=round(t, 3), z=p[3] if len(p) > 3 else 1, canal=(p[4] if len(p) > 4 and p[4] != "auto" else canal(c, i0, i1)), d=d)); t += i1 - i0
FIN = round(t, 3)
def norm(s): return "".join(ch for ch in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(ch) != "Mn")
CL = set(norm(x) for x in F.get("claves", []))
pal = []
for k, p in enumerate(piezas):
    for w in p["d"]: pal.append(dict(t=w["texto"].strip(), a=p["st"] + max(0, w["inicio"] - p["i"]), b=p["st"] + min(p["o"], w["fin"]) - p["i"], pz=k))
FIX = F.get("arreglos", {})
subs, g = [], []
def cerrar():
    global g
    if not g: return
    txt = [FIX.get(x["t"], x["t"]) for x in g]; k = ""
    for j in [len(txt) - 1]:
        if norm(re.sub(r"[^\w%]", "", txt[j])) in CL or re.match(r"^\d", txt[j]):
            j0 = j
            while j0 > 0 and (re.match(r"^\d", txt[j0 - 1]) or norm(re.sub(r"[^\w]", "", txt[j0 - 1])) in ("mil", "millones")): j0 -= 1
            k = " ".join(txt[j0:j + 1]); del txt[j0:j + 1]; break
    lin = re.sub(r"\s*\.\.\.\s*", " ", " ".join(txt)).strip()
    subs.append([round(g[0]["a"], 3), round(g[-1]["b"] + 0.12, 3), re.sub(r"[.,;:!¡¿?]+$|^[¿¡]", "", lin).strip(), re.sub(r"[.,;:!?]+$|^[¿¡]", "", k)]); g = []
for i, w in enumerate(pal):
    if g and (w["a"] - g[-1]["b"] > 0.4 or len(g) >= 4 or w["pz"] != g[-1]["pz"]): cerrar()
    g.append(w); sig = pal[i + 1]["t"] if i + 1 < len(pal) else ""
    num = norm(re.sub(r"[^\w]", "", sig)) in ("mil", "gramos", "calorias", "kcal", "minutos", "kg") and not re.search(r"[.?!,]$", w["t"])
    if re.search(r"[.?!,]$", w["t"]) or ((norm(re.sub(r"[^\w%]", "", w["t"])) in CL or re.match(r"^\d", w["t"])) and not num): cerrar()
cerrar()
for i in range(len(subs) - 1): subs[i][1] = round(min(subs[i][1], subs[i + 1][0]), 3)
subs = [s for s in subs if (s[2] or s[3]) and s[1] - s[0] > 0.1 and not any(a <= s[0] < b for a, b in F.get("sinSubs", []))]
def ancla(x):
    if isinstance(x, (int, float)): return float(x)
    m = re.match(r"^(.*?)(?:#(\d+))?([+-][\d.]+)?$", x); fr, n, off = norm(m.group(1)), int(m.group(2) or 0), float(m.group(3) or 0)
    seq = [norm(re.sub(r"[^\w%]", "", w["t"])) for w in pal]; ws = fr.split()
    for i in range(len(pal)):
        if seq[i:i + len(ws)] == [norm(re.sub(r"[^\w%]", "", q)) for q in ws]:
            if n == 0: return round(pal[i]["a"] + off, 3)
            n -= 1
    raise SystemExit("no hallo ancla: " + x)
textos, imgs, broll, sfx = [], [], [], []
for e in F.get("textos", []):
    a = ancla(e[2]); textos.append([e[0], e[1], a, round(min(FIN, a + e[3]), 3), e[4], e[5], e[6]])
    if len(e) > 7 and e[7]: sfx.append([SFX + e[7], a, e[8] if len(e) > 8 else 0.07])
for e in F.get("imgs", []):
    a = ancla(e[2]); imgs.append([e[0], e[1], a, round(min(FIN, a + e[3]), 3), e[4], e[5]])
    if len(e) > 6 and e[6]: sfx.append([SFX + e[6], a, e[7] if len(e) > 7 else 0.06])
for e in F.get("broll", []):
    a = ancla(e[3]); dur = e[6] if len(e) > 6 else e[2] - e[1]; broll.append([nombre(e[0]) if "__" in e[0] else e[0], e[1], e[1] + min(dur, FIN - a), a, e[4], e[5]])
OV = F.get("overlay")
if OV:
    pr = dict(OV["props"]); pr["items"] = [dict(img=it["img"], puesto=it["puesto"], t=ancla(it["ancla"]), nombre=it.get("nombre", "")) for it in OV["items"]]
    pr["tTitulo"] = ancla(OV.get("tTitulo", 0.0)); pr["tFin"] = ancla(OV["tFin"]) if "tFin" in OV else FIN
    out = OV["salida"]; json.dump(pr, open(out + ".props.json", "w"), ensure_ascii=False)
    dur = int(round(FIN * OV.get("fps", 30))) + 2
    subprocess.run(["npx", "remotion", "render", "src/index.ts", OV["comp"], out, "--props=" + out + ".props.json", "--frames=0-%d" % (dur - 1), "--codec=prores", "--prores-profile=4444", "--image-format=png", "--pixel-format=yuva444p10le", "--muted"], cwd="~/Videos-Remotion/motion", check=True, capture_output=True)
    F.setdefault("importarExtra", []).append(out); broll.append([os.path.basename(out), 0.0, FIN, 0.0, OV["pista"], OV.get("escala", 2.0)])
    for it in pr["items"]: sfx_ov = F.setdefault("_sfxov", []).append([SFX + "09 Interfaz y avisos/Normal Pop.wav", it["t"], 0.06])
for k in range(1, len(piezas)):
    if piezas[k]["c"] != piezas[k - 1]["c"] and k % 2 == 0: sfx.append([SFX + "01 Whooshes/Cinematic Fast Whoosh.wav", round(piezas[k]["st"] - 0.1, 3), 0.045])
sfx += [[SFX + x[0], ancla(x[1]), x[2]] for x in F.get("sfx", [])] + F.get("_sfxov", [])
sfx.sort(key=lambda x: x[1])
CFG = dict(proyecto=F["proyecto"], nombre=F["nombre"], bandeja=F["bandeja"], pistasVideo=F.get("pistasVideo", 10), pistaSubs=F.get("pistaSubs", 1),
  importar=sorted({real(p["c"]) for p in piezas} | {real(e[0]) for e in F.get("broll", []) if "__" in e[0]} | set(F.get("importarExtra", []))),
  piezas=[[nombre(p["c"]), p["i"], p["o"], p["st"], True, p["z"], p["canal"]] for p in piezas], broll=broll,
  subs=subs, subPlantilla="~/Videos-Remotion/clientes/_plantillas/Subtitulo ClienteE v3.mogrt", subAjustes=F["subAjustes"], colorClave=F["color"], subPos=F["subPos"],
  textos=textos, imgs=imgs, nombresPistas=F.get("nombresPistas", []), musica=F["musica"], sfx=sfx, fin=FIN,
  marc=[[ancla(m[0]), m[1], m[2]] for m in F.get("marc", [])], fotos=F.get("fotos", [1.0, FIN / 2, FIN - 1.5]), fotosDir=F["fotosDir"],
  hdr=sorted({nombre(p["c"]) for p in piezas if F.get("hdr") and hlg(p["c"])} | {nombre(e[0]) for e in F.get("broll", []) if F.get("hdr") and "__" in e[0] and hlg(e[0])}), lumetri=F.get("lumetri", {}))
json.dump(CFG, open(sys.argv[2], "w"), ensure_ascii=False)
print("duración %.1f s | piezas %d | subs %d | textos %d | imgs %d | apoyos %d | sfx %d" % (FIN, len(piezas), len(subs), len(textos), len(imgs), len(broll), len(sfx)))
for s in subs: print("  %.2f %s [%s]" % (s[0], s[2], s[3]))
