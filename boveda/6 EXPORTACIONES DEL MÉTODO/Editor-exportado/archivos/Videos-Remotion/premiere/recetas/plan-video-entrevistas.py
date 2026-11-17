# Plan completo del vídeo de ClienteE "Preguntando cómo se hicieron ricos": cortes ajustados a silencios, subtítulos, rótulos, sfx, música y marcadores.
import json, re, numpy as np, unicodedata
R = "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/ricos/"
S = "~/Videos-Remotion/voz/salida/MVI_%s.palabras.json"
SFX = "~/EDICION/2 MATERIALES DE EDICION/Efectos de sonido/RECURSOS DE EDICIÓN (en Drive)/EFECTOS DE SONIDO/"
PL = "~/Videos-Remotion/clientes/_plantillas/"
G = [
 ("1315",115.2,118.35,1.0,"GANCHO"),("1315",123.95,125.1,1.18,"GANCHO"),("1315",108.3,113.6,1.12,"GANCHO"),
 ("1341",107.45,113.85,1.12,"GANCHO"),("1354",12.95,14.95,1.0,"GANCHO"),
 ("1309",6.9,11.3,1.0,"INTRO"),("1309",26.1,36.3,1.0,"INTRO"),("1309",36.8,48.3,1.1,"INTRO"),
 ("1310",1.0,16.0,1.0,"INTRO"),
 ("1317",0.2,3.6,1.0,"RECHAZOS"),("1317",9.7,11.9,1.12,"RECHAZOS"),("1319",15.7,18.8,1.0,"RECHAZOS"),
 ("1320",9.8,12.0,1.12,"RECHAZOS"),("1336",4.0,11.3,1.0,"RECHAZOS"),("1363",20.2,23.0,1.0,"RECHAZOS"),
 ("1321",1.3,7.3,1.1,"RECHAZOS"),("1357",3.1,10.0,1.0,"RECHAZOS"),("1350",0.4,11.0,1.0,"RECHAZOS"),
 ("1315",20.8,24.6,1.0,"JACO"),("1315",50.6,52.9,1.0,"JACO"),("1315",53.4,55.2,1.1,"JACO"),
 ("1315",62.0,75.6,1.0,"JACO"),("1315",78.6,80.4,1.1,"JACO"),("1315",82.3,100.9,1.0,"JACO"),
 ("1315",100.9,113.4,1.0,"JACO"),("1315",115.2,125.1,1.0,"JACO"),("1315",125.2,129.0,1.12,"JACO"),
 ("1322",60.0,67.7,1.0,"PASION"),("1322",82.4,93.4,1.0,"PASION"),("1322",93.4,101.9,1.0,"PASION"),("1322",105.4,118.0,1.1,"PASION"),
 ("1323",4.5,18.2,1.0,"PASION"),
 ("1334",42.3,43.9,1.0,"CABEZA"),("1334",44.3,77.3,1.0,"CABEZA"),("1334",77.6,85.4,1.1,"CABEZA"),("1334",85.4,110.5,1.0,"CABEZA"),
 ("1341",12.3,31.7,1.0,"CORAZON"),("1341",43.3,58.0,1.08,"CORAZON"),("1341",57.9,65.3,1.0,"CORAZON"),("1341",79.9,90.0,1.0,"CORAZON"),
 ("1341",90.6,96.0,1.0,"CORAZON"),("1341",100.1,114.7,1.1,"CORAZON"),("1342",1.0,4.35,1.0,"CORAZON"),("1342",18.3,24.1,1.0,"CORAZON"),
 ("1345",8.0,13.0,1.0,"CONSTANCIA"),("1345",34.9,37.4,1.12,"CONSTANCIA"),("1345",49.9,56.6,1.0,"CONSTANCIA"),("1345",66.9,71.6,1.1,"CONSTANCIA"),
 ("1354",8.3,11.6,1.0,"PAREJA"),("1354",13.0,16.3,1.0,"PAREJA"),("1354",17.2,20.4,1.0,"PAREJA"),("1354",28.9,33.2,1.1,"PAREJA"),
 ("1373",8.2,37.3,1.0,"CIERRE"),
]
AUD = {}
def env(c):
    if c not in AUD:
        a = np.fromfile(R + "aud/%s.raw" % c, np.float32); n = len(a) // 160; e = np.sqrt((a[:n*160].reshape(n, 160) ** 2).mean(1))
        AUD[c] = np.convolve(e, np.ones(3) / 3, "same")
    return AUD[c]
def calma(c, t0, t1):
    e = env(c); i0, i1 = max(0, int(t0 * 100)), min(len(e) - 1, int(t1 * 100)); i = i0 + int(np.argmin(e[i0:i1 + 1])); return i / 100
piezas, t = [], 0.0
for c, a, b, z, blk in G:
    W = [w for w in json.load(open(S % c)) if w["texto"].strip() not in ("...",)]
    dentro = [w for w in W if a - 0.05 <= (w["inicio"] + min(w["fin"], w["inicio"] + 0.6)) / 2 <= b + 0.05]
    antes = [w for w in W if w["fin"] <= dentro[0]["inicio"] + 0.01 and w is not dentro[0]]; despues = [w for w in W if w["inicio"] >= dentro[-1]["fin"] - 0.01 and w is not dentro[-1]]
    lo = max(dentro[0]["inicio"] - 0.35, antes[-1]["fin"] + 0.02 if antes else 0); hi = dentro[0]["inicio"] + 0.02
    i0 = calma(c, lo, hi) if hi - lo > 0.05 else lo
    lo = dentro[-1]["fin"] - 0.03; hi = min(dentro[-1]["fin"] + 0.3, despues[0]["inicio"] - 0.03 if despues else 9e9)
    i1 = calma(c, lo, hi) if hi - lo > 0.05 else max(lo, hi); i1 = max(i1, i0 + 0.4)
    piezas.append(dict(c=c, i=round(i0, 3), o=round(i1, 3), st=round(t, 3), z=z, blk=blk)); t += i1 - i0
FIN = round(t, 3)
def norm(s): return "".join(ch for ch in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(ch) != "Mn")
CLAVE = set("rico ricos rica ricas rapido dinero euros millones mil lamborghini lambo rechazar rechazos rechazo rendirme insistir riesgo arriesgadas locuras all in nada perder corazon razon pasion ganas suenos sueños cabeza guardar piso pisos gestion financiera espabila espabilen constancia clave exito ventas vender conectar perseverancia suerte trading r8 ella pasta coach director 23 40 500 400 50 113 90 10.000 7 conseguir lograr evolucionar facturacion negocio futuro joven amarme quererme autentico".split())
pal = []
for p in piezas:
    for w in json.load(open(S % p["c"])):
        m = (w["inicio"] + min(w["fin"], w["inicio"] + 0.6)) / 2
        if p["i"] <= m <= p["o"] and w["texto"].strip() not in ("...", "Ehh", "Ehh...", "Mmm", "Eh"):
            pal.append(dict(t=w["texto"].strip(), a=p["st"] + max(0, w["inicio"] - p["i"]), b=p["st"] + min(p["o"], w["fin"]) - p["i"], pz=id(p)))
# dedupe Whisper repeats (same text overlapping in time)
lim = []
for w in pal:
    if lim and w["a"] < lim[-1]["b"] - 0.05 and w["a"] <= lim[-1]["a"] + 0.3: continue
    if lim and w["a"] < lim[-1]["a"]: continue
    lim.append(w)
subs, g = [], []
def cerrar():
    global g
    if not g: return
    txt = [x["t"] for x in g]; k = ""
    for j in range(len(txt) - 1, -1, -1):
        if norm(re.sub(r"[^\w]", "", txt[j])) in CLAVE or re.match(r"^\d", txt[j]):
            j0 = j
            while j0 > 0 and (re.match(r"^\d", txt[j0 - 1]) or norm(re.sub(r"[^\w]", "", txt[j0 - 1])) in ("mil", "millones")): j0 -= 1
            if j0 == j and j + 1 < len(txt): j0, j = j, j
            k = " ".join(txt[j0:j + 1]); del txt[j0:j + 1]; break
    a, b = g[0]["a"], g[-1]["b"] + 0.15
    subs.append([round(a, 3), round(b, 3), re.sub(r"\s*\.\.\.\s*", " ", " ".join(txt)).strip(), re.sub(r"[?!,.]+$", "", re.sub(r"^[¿¡]", "", k))]); g = []
for i, w in enumerate(lim):
    if g and (w["a"] - g[-1]["b"] > 0.45 or len(g) >= 4 or w["pz"] != g[-1]["pz"]): cerrar()
    g.append(w); tx = w["t"]; sig = lim[i + 1]["t"] if i + 1 < len(lim) else ""
    numsig = norm(re.sub(r"[^\w]", "", sig)) in ("mil", "millones", "euros", "anos", "personas") and not re.search(r"[.?!,]$", tx)
    if re.search(r"[.?!,]$", tx) or (norm(re.sub(r"[^\w]", "", tx)) in CLAVE and not numsig): cerrar()
cerrar()
for i in range(len(subs) - 1): subs[i][1] = round(min(subs[i][1], subs[i + 1][0]), 3)
for s in subs: s[2] = re.sub(r"^[,.]\s*", "", s[2])
subs = [s for s in subs if (s[2] or s[3]) and s[1] - s[0] > 0.12]
def hallar(blk, frase, n=0):
    ps = [p for p in piezas if p["blk"] == blk]; fr = norm(frase)
    for s in subs:
        if ps[0]["st"] - 0.1 <= s[0] <= ps[-1]["st"] + (ps[-1]["o"] - ps[-1]["i"]) and fr in norm(s[2] + " " + s[3]):
            if n == 0: return s[0]
            n -= 1
    raise SystemExit("no hallo " + blk + " " + frase)
def ini(blk, k=0): return [p for p in piezas if p["blk"] == blk][k]["st"]
def finb(blk): p = [p for p in piezas if p["blk"] == blk][-1]; return p["st"] + p["o"] - p["i"]
NAR, ROJ, NEG, BLA = [255, 88, 0], [226, 38, 38], [12, 12, 12], [255, 255, 255]
ET = PL + "Etiqueta ClienteE v1.mogrt"
textos, sfx = [], []
def rotulo(pista, a, b, txt, caja, tam, pos, son=None, vol=0.08):
    textos.append([ET, pista, round(a, 3), round(b, 3), {"Texto": txt, "Color de la caja": caja, "Color del texto": BLA, "Tamano (50 = normal, 100 = doble)": tam}, pos, txt])
    if son: sfx.append([SFX + son, round(a, 3), vol])
# gancho
t40 = piezas[1]["st"]; rotulo(3, t40, t40 + 1.4, "40.000 € EN UN DÍA", NAR, 70, [0.5, 0.2], "09 Interfaz y avisos/Cash Machine sound effect.m4a", 0.12)
sfx.append([SFX + "03 Booms e impactos/Boom 2.wav", round(t40, 3), 0.1])
for k in (2, 3, 4): sfx.append([SFX + "01 Whooshes/Cinematic Fast Whoosh.wav", round(piezas[k]["st"] - 0.12, 3), 0.06])
ti = ini("INTRO"); sfx.append([SFX + "02 Risers/Smooth Riser.wav", round(max(0, ti - 2.2), 3), 0.07]); sfx.append([SFX + "03 Booms e impactos/BOOM IMPACT (23).wav", round(ti, 3), 0.1])
rotulo(4, ti, ti + 3.2, "¿CÓMO SE HICIERON RICOS?", NAR, 60, [0.5, 0.2], "01 Whooshes/Cinematic Low Whoosh.wav", 0.08)
rotulo(4, hallar("INTRO", "113"), hallar("INTRO", "113") + 3.0, "113.000 MILLONES € · 90.000 HABITANTES", NEG, 44, [0.5, 0.2], "09 Interfaz y avisos/Cinematic Money 1.wav", 0.08)
# rechazos
rp = [p for p in piezas if p["blk"] == "RECHAZOS"]; nr = 0
for k, p in enumerate(rp):
    if p["c"] in ("1317", "1319", "1320", "1336", "1363", "1357") and not (p["c"] == "1317" and p["i"] < 5):
        nr += 1; a = p["st"] + 0.15; rotulo(4, a, a + 1.6, "RECHAZO #%d" % nr, ROJ, 50, [0.5, 0.2], "09 Interfaz y avisos/Windows_error.mp3", 0.07)
sfx.append([SFX + "01 Whooshes/Cinematic Fast Whoosh.wav", round(ini("RECHAZOS") - 0.1, 3), 0.06])
a = hallar("RECHAZOS", "rendirme"); sfx.append([SFX + "04 Bajos (bass drops)/Deep Bass Hit 1.wav", round(a, 3), 0.1])
# lecciones y nombres
LEC = [("JACO", "salto", "LECCIÓN 1 · ARRIESGA SIN MIEDO"), ("PASION", "pasión", "LECCIÓN 2 · LA PASIÓN ABRE EL CAMINO"), ("CABEZA", "cabeza", "LECCIÓN 3 · GESTIONA TU DINERO"),
       ("CORAZON", "clave", "LECCIÓN 4 · CONÓCETE Y CONECTA"), ("CONSTANCIA", "constancia", "LECCIÓN 5 · CONSTANCIA"), ("PAREJA", "perseverancia", "LECCIÓN 6 · PERSEVERA")]
for blk, fr, txt in LEC:
    a = hallar(blk, fr); rotulo(5, a, a + 3.0, txt, NAR, 50, [0.5, 0.12], "01 Whooshes/Cinematic Mediam Whoosh.wav", 0.07)
for blk in ("JACO", "PASION", "CABEZA", "CORAZON", "CONSTANCIA", "PAREJA", "CIERRE"): sfx.append([SFX + "01 Whooshes/Cinematic Fast Whoosh.wav", round(ini(blk) - 0.1, 3), 0.06])
NOM = [("JACO", "jaco", "JACO · 23 AÑOS · TRADER"), ("PASION", "entrenador", "ENTRENADOR PERSONAL · MARCA DE PERFUMES"), ("CABEZA", "cabeza", "INVIERTE EN VIVIENDA"),
       ("CORAZON", "director", "EX DIRECTOR COMERCIAL · AHORA COACH"), ("CONSTANCIA", "constancia", "ARTISTA VISUAL · FOTÓGRAFA")]
for blk, fr, txt in NOM:
    a = hallar(blk, fr) + (0.4 if blk in ("CABEZA", "CONSTANCIA") else 0); rotulo(6, a, a + 3.2, txt, NEG, 40, [0.27, 0.86], "09 Interfaz y avisos/Smooth Pop.wav", 0.06)
DAT = [("JACO", "500", "EMPEZÓ CON 500 €"), ("JACO", "23", "23 AÑOS"), ("CORAZON", "400", "400 M€ AL AÑO · 50 PERSONAS"), ("CONSTANCIA", "10", "OBRAS DE HASTA 10.000 €")]
for blk, fr, txt in DAT:
    a = hallar(blk, fr); rotulo(7, a, a + 2.4, txt, NAR, 48, [0.75, 0.3], "09 Interfaz y avisos/Cinematic Money 2.wav", 0.07)
a = hallar("JACO", "40", 0); rotulo(7, a, a + 2.4, "40.000 € EN UN DÍA", NAR, 60, [0.75, 0.3], "03 Booms e impactos/Boom 2.wav", 0.1)
a = hallar("CIERRE", "suscrib"); rotulo(8, a, min(FIN, a + 3.5), "SUSCRÍBETE 🔔", ROJ, 64, [0.5, 0.2], "09 Interfaz y avisos/Pop up SFX.mp3", 0.08)
sfx.sort(key=lambda x: x[1])
marc = []
NB = {"GANCHO": "GANCHO: las mejores frases", "INTRO": "INTRO: Andorra + Lambo", "RECHAZOS": "RECHAZOS (humor + no rendirse)", "JACO": "1. Jaco, 23 años: arriesgar", "PASION": "2. Pasión", "CABEZA": "3. Gestión financiera", "CORAZON": "4. Francisco: conectar", "CONSTANCIA": "5. Constancia", "PAREJA": "6. Perseverancia y suerte", "CIERRE": "CIERRE + suscríbete"}
for blk in NB: marc.append([round(ini(blk), 3), round(finb(blk) - ini(blk), 3), NB[blk]])
CFG = dict(proyecto="Preguntando a millonarios clientee.prproj", nombre="CLIENTE-E · PREGUNTANDO CÓMO SE HICIERON RICOS · PROPUESTA", pistasVideo=9, rellenar=False,
  piezas=[["MVI_%s.MP4" % p["c"], p["i"], p["o"], p["st"], True, p["z"]] for p in piezas],
  subs=subs, subPlantilla=PL + "Subtitulo ClienteE v3.mogrt",
  subAjustes={"Tamano (50 = normal, 100 = doble)": 30, "Altura (50 = normal, mas = sube)": 50, "Duracion de la entrada (fotogramas)": 5, "Animacion de entrada": True, "Sombra": True, "Sombra: opacidad (0 a 100)": 90, "Sombra: difuminado": 20, "Sombra: distancia": 8, "Alinear a la izquierda": False},
  colorClave=NAR, subPos=[0.5, 0.78], textos=textos, imgs=[], nombresPistas=["TOMAS", "SUBTITULOS", "", "GANCHO", "TITULOS Y RECHAZOS", "LECCIONES", "NOMBRES", "DATOS", "CTA"],
  musica=["~/Videos-Remotion/clientes/clientee/ricos/Until I Win (bucle).wav", 0.0, 0.08], sfx=sfx, fin=FIN, marc=marc,
  fotos=[1.0, 6.0, 25.0, 60.0, 120.0, 200.0, 300.0], fotosDir=R)
json.dump(CFG, open(R + "cfg.json", "w"), ensure_ascii=False)
print("duración", FIN, "| piezas", len(piezas), "| subs", len(subs), "| textos", len(textos), "| sfx", len(sfx))
for s in subs[:25]: print(s)
