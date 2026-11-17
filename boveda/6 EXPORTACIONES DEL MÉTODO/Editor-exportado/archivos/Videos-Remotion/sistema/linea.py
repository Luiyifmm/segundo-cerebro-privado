# Plan de "línea de tiempo de lote": tras el vídeo de ejemplo, cada bruto ENTERO con solo los silencios quitados (regla del usuario, 11-10-2026:
# "entrégamelos en crudo y solamente corta la parte donde haya silencio"), separados 30 s entre sí ("regla de los treinta segundos"),
# con marcadores de qué trata cada parte y de lo recortado. Uso: python3 linea.py <cliente> <ID> [<ID>...]  → sistema/linea-<cliente>.json
import json,os,re,subprocess,sys,unicodedata
H=os.path.expanduser("~"); FF=H+"/.local/bin/ffmpeg"; cli=sys.argv[1]; ids=sys.argv[2:]
bd=json.load(open(H+"/Videos-Remotion/sistema/reels.json"))["reels"]
def dur(f): return float(subprocess.run([H+"/.local/bin/ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f],capture_output=True,text=True).stdout.strip() or 0)
def tramos(f,habla):
    d=dur(f)
    if not habla: return d,[[0,round(d,3)]],[]
    e=subprocess.run([FF,"-nostdin","-hide_banner","-i",f,"-vn","-af","ebur128","-f","null","-"],capture_output=True,text=True).stderr
    m=re.findall(r"I:\s+(-?[\d.]+) LUFS",e); I=float(m[-1]) if m else -30
    um=max(-52,min(-28,I-13))
    log=subprocess.run([FF,"-nostdin","-hide_banner","-i",f,"-vn","-af",f"silencedetect=noise={um}dB:d=0.6","-f","null","-"],capture_output=True,text=True).stderr
    ini=[float(x) for x in re.findall(r"silence_start: (-?[\d.]+)",log)]; fin=[float(x) for x in re.findall(r"silence_end: ([\d.]+)",log)]
    if len(fin)<len(ini): fin.append(d)
    AIRE=0.14; T=[]; cur=0.0; cortes=[]
    for a,b in zip(ini,fin):
        a=max(0,a)
        if a-cur>0.25: T.append([max(0,cur-AIRE),min(d,a+AIRE)])
        cur=b
    if d-cur>0.25: T.append([max(0,cur-AIRE),d])
    U=[]
    for t in T:                                   # unir tramos que se tocan
        if U and t[0]<=U[-1][1]+0.02: U[-1][1]=max(U[-1][1],t[1])
        else: U.append(t)
    U=[[round(a,3),round(b,3)] for a,b in U if b-a>=0.3]
    prev=0.0
    for a,b in U:
        if a-prev>0.05: cortes.append([round(prev,3),round(a,3)])
        prev=b
    if d-prev>0.05: cortes.append([round(prev,3),round(d,3)])
    return d,U,cortes
norm=lambda s:[w for w in re.sub(r"[^a-zñ0-9 ]","",unicodedata.normalize("NFD",s.lower()).encode("ascii","ignore").decode()).split() if w]
def frases(P):
    F=[];cur=[]
    for p in P:
        if cur and (re.search(r"[.?!]$",cur[-1]["t"]) or p["a"]-cur[-1]["b"]>0.8): F.append(cur);cur=[]
        cur.append(p)
    if cur: F.append(cur)
    return [{"a":f[0]["a"],"b":f[-1]["b"],"t":" ".join(w["t"] for w in f)} for f in F]
def grupos(F):
    G=[]
    for f in F:
        n=set(norm(f["t"]))
        if len(n)<3 or re.search(r"\b(otra vez|espera|esperate|perate|vale|siguiente|repite|dale)\b",f["t"].lower()) and len(n)<6:
            if G: G[-1]["ruido"]+=1
            continue
        if G:
            r=set(norm(G[-1]["tomas"][-1]["t"])); sim=len(n&r)/max(1,min(len(n),len(r)))
            if sim>=0.6: G[-1]["tomas"].append(f); continue
        G.append({"tomas":[f],"ruido":0})
    return G
mmss=lambda s:f"{int(s//60)}:{int(s%60):02d}"
out=[]
for rid in ids:
    r=next(x for x in bd if x["id"]==rid); habla=cli!="clientee"; piezas=[]; marc=[]; t=0.0; nsil=0; quit=0.0; bruto=0.0; ruidoso=False
    for f in r["fuentes"]:
        d,T,C=tramos(f,habla); bruto+=d; ini_f=t; mapa=[]
        cache=os.path.join(r["dir"],".cache",os.path.basename(f)+".json"); nota_f=""
        if habla and os.path.exists(cache) and sum(b-a for a,b in C)<0.08*d:
            # Ruido de fondo (gimnasio, música): el detector de volumen no ve silencios. Se recorta por huecos entre palabras (>= 2 s), con más margen.
            W=json.load(open(cache))["palabras"]; M=0.45; T2=[]; ca=None; cb=None
            for w in W:
                if ca is None: ca,cb=w["a"],w["b"]
                elif w["a"]-cb>=2.0: T2.append([max(0,ca-M),min(d,cb+M)]); ca,cb=w["a"],w["b"]
                else: cb=max(cb,w["b"])
            if ca is not None: T2.append([max(0,ca-M),min(d,cb+M)])
            if T2 and sum(b-a for a,b in T2)<0.9*d:
                T=[[round(a,3),round(b,3)] for a,b in T2]; C=[]; prev=0.0
                for a,b in T:
                    if a-prev>0.05: C.append([round(prev,3),a])
                    prev=b
                if d-prev>0.05: C.append([round(prev,3),round(d,3)])
                ruidoso=True
        for a,b in T: piezas.append({"f":f,"a":a,"b":b,"t":round(t,3)}); mapa.append((a,b,t)); t+=b-a
        def tl(x):
            for a,b,tt in mapa:
                if x<b: return tt+max(0,x-a)
            return t
        if habla:
            nsil+=len(C); quit+=sum(b-a for a,b in C)
            for a,b in C:
                if b-a>=2.5: marc.append({"t":round(tl(b),3),"n":f"✂ quitados {b-a:.1f} s de silencio","c":"","col":1,"corte":round(b-a,1)})
            cache=os.path.join(r["dir"],".cache",os.path.basename(f)+".json")
            if os.path.exists(cache):
                for g in grupos(frases(json.load(open(cache))["palabras"])):
                    ult=g["tomas"][-1]; n=len(g["tomas"])
                    marc.append({"t":round(tl(g["tomas"][0]["a"]),3),"n":(f"({n} tomas) " if n>1 else "")+ult["t"][:80],"c":("Tomas en "+", ".join(mmss(tl(x["a"])) for x in g["tomas"])+" (contado desde el inicio de este vídeo). La última suele ser la buena." if n>1 else ""),"col":4 if n==1 else 7})
        else:
            marc.append({"t":round(ini_f,3),"n":f"TOMA: {os.path.basename(f)}","c":f"{d:.1f} s","col":4})
    marc.sort(key=lambda m:m["t"])
    # un recorte justo antes de un marcador de contenido se anota dentro de ese marcador (menos marcadores, misma información)
    ideas=[m for m in marc if "corte" not in m]; fin=[]
    for m in marc:
        if "corte" not in m: fin.append(m); continue
        sig=next((x for x in ideas if 0<=x["t"]-m["t"]<=1.5),None)
        if sig: sig["c"]=(f"✂ Justo antes se quitaron {m['corte']} s de silencio. "+sig["c"]).strip()
        elif m["corte"]>=4: fin.append(m)
    marc=fin
    res=f"Bruto de {bruto:.0f} s; quedan {t:.0f} s" + (f" (quitados {nsil} silencios, {quit:.0f} s{', por huecos entre palabras: hay ruido de fondo' if ruidoso else ''}). No se ha quitado ninguna toma." if habla else " (tomas enteras, sin recortar: no llevan voz).")
    out.append({"id":rid,"titulo":r["titulo"],"fuentes":r["fuentes"],"dur":round(t,3),"piezas":piezas,"marcadores":marc,"resumen":res})
    print(rid,r["titulo"],"|",res,"| piezas",len(piezas),"| marcadores",len(marc))
json.dump(out,open(H+f"/Videos-Remotion/sistema/linea-{cli}.json","w"),ensure_ascii=False,indent=1)
