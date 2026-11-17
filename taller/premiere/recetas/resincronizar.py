# Tras cortes del usuario en V1: vuelve a sincronizar sfx, subtítulos, rótulos, imágenes y apoyos con la voz.
# Cada elemento que sigue en su posición del plan se lleva al nuevo tiempo del mismo instante de la toma; si ese instante se cortó, se desactiva.
# Uso: python3 resincronizar.py <cfg.json del plan> <estado.json (V1 actual + resto de pistas)> <ID> <salida.jsx>
import json, sys
cfg, est, sid, out = json.load(open(sys.argv[1])), json.load(open(sys.argv[2])), sys.argv[3], sys.argv[4]
V = est[sid]["v"]  # [archivo, inicio, fin, in]
def fuente(t):
    for p in cfg["piezas"]:
        if p[3] - 0.001 <= t < p[3] + (p[2] - p[1]) + 0.001: return p[0], p[1] + (t - p[3])
    return None
def nuevo(t):
    f = fuente(t)
    if not f: return None
    for a, b, e, i0 in [(x[0], x[1], x[2], x[3]) for x in V]:
        if a == f[0] and i0 - 0.02 <= f[1] <= i0 + (e - b) + 0.02: return round(b + (f[1] - i0), 3)
    return None
plan = set()
for s in cfg["subs"]: plan.add(round(s[0], 2))
for e in cfg["textos"]: plan.add(round(e[2], 2))
for e in cfg["imgs"]: plan.add(round(e[2], 2))
for e in cfg["sfx"]: plan.add(round(e[1], 2))
for e in cfg.get("broll", []): plan.add(round(e[3], 2))
nombres = {s[2] + " " + s[3] for s in cfg["subs"]} | {(s[2] + " " + s[3]).strip() for s in cfg["subs"]} | {e[6] for e in cfg["textos"]} | {e[1].split("/")[-1] for e in cfg["imgs"]} | {e[0].split("/")[-1] for e in cfg["sfx"]}
mov = []
def revisa(pista, nombre, st):
    if not any(abs(st - p) < 0.03 for p in plan) or nombre.strip() not in nombres: return
    n = nuevo(st + 0.03)
    if n is None: mov.append([pista, nombre, st, None])
    elif abs(n - 0.03 - st) > 0.08: mov.append([pista, nombre, st, round(n - 0.03 - st, 3)])
for x in est[sid]["otros"]: revisa(x[0], x[1], x[2])
for x in est[sid]["a"]:
    if x[0] in ("A1", "A2"): continue
    revisa(x[0], x[1], x[2])
for s in est[sid].get("subs", []): revisa("V3" if cfg.get("pistaSubs", 1) == 2 else "V2", s[0], s[1])
js = '''(function(){var M=%s,s=null,P=app.project.sequences,n=0,off=0,i,j;for(i=0;i<P.numSequences;i++)if(P[i].name.indexOf("%s")===0)s=P[i];if(!s)return "no";function seg(x){var y=new Time();y.seconds=x;return y;}
for(var k=0;k<M.length;k++){var m=M[k],v=m[0].charAt(0)=="V",tr=v?s.videoTracks[+m[0].substr(1)-1]:s.audioTracks[+m[0].substr(1)-1];for(j=0;j<tr.clips.numItems;j++){var c=tr.clips[j];if(c.name===m[1]&&Math.abs(c.start.seconds-m[2])<0.005){if(m[3]===null){c.disabled=true;off++;}else{c.move(seg(m[3]));n++;}break;}}}
app.project.save();return "movidos "+n+" | desactivados (tramo cortado) "+off;})();''' % (json.dumps(mov, ensure_ascii=False), sid)
open(out, "w").write(js); print(len(mov), "a mover;", sum(1 for m in mov if m[3] is None), "en tramos cortados")
for m in mov[:12]: print("  ", m)
