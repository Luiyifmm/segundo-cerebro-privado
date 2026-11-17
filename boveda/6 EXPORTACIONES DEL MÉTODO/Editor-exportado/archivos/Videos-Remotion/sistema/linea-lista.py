# Como linea.py pero sin reels registrados: python3 linea-lista.py <videos.json> <salida.json>
# videos.json = [{"titulo":..., "clips":[rutas]}]; transcripciones en voz/salida/<nombre>.palabras.json (o E20__<nombre>).
import json,os,sys,glob,re,subprocess,unicodedata
H=os.path.expanduser("~"); FF=H+"/.local/bin/ffmpeg"; src=open(H+"/Videos-Remotion/sistema/linea.py").read()
exec(src[src.index("def dur"):src.index("mmss=")])          # tramos(), frases(), grupos(), norm
mmss=lambda s:f"{int(s//60)}:{int(s%60):02d}"
def palabras(f):
    b=os.path.splitext(os.path.basename(f))[0]
    for p in [H+f"/Videos-Remotion/voz/salida/{b}.palabras.json"]+glob.glob(H+f"/Videos-Remotion/voz/salida/*__{b}.palabras.json"):
        if os.path.exists(p): return [{"a":w["inicio"],"b":w["fin"],"t":w["texto"]} for w in json.load(open(p))]
    return []
out=[]
for v in json.load(open(sys.argv[1])):
    piezas=[];marc=[];t=0.0;nsil=0;quit=0.0;bruto=0.0
    for f in v["clips"]:
        W=palabras(f); habla=len(W)>=8
        d,T,C=tramos(f,habla); bruto+=d; ini_f=t; mapa=[]
        for a,b in T: piezas.append({"f":f,"a":a,"b":b,"t":round(t,3)}); mapa.append((a,b,t)); t+=b-a
        def tl(x):
            for a,b,tt in mapa:
                if x<b: return tt+max(0,x-a)
            return t
        marc.append({"t":round(ini_f,3),"n":f"CLIP {os.path.basename(f)}","c":f"Bruto de {d:.0f} s"+("" if habla else " · sin voz: entero"),"col":2})
        if habla:
            nsil+=len(C); quit+=sum(b-a for a,b in C)
            for g in grupos(frases(W)):
                ult=g["tomas"][-1]; n=len(g["tomas"])
                marc.append({"t":round(tl(g["tomas"][0]["a"]),3),"n":(f"({n} tomas) " if n>1 else "")+ult["t"][:80],"c":("Tomas en "+", ".join(mmss(tl(x["a"])) for x in g["tomas"])+". La última suele ser la buena." if n>1 else ""),"col":4 if n==1 else 7})
    marc.sort(key=lambda m:m["t"])
    res=f"Bruto de {bruto:.0f} s; quedan {t:.0f} s (quitados {nsil} silencios, {quit:.0f} s). No se ha quitado ninguna toma."
    out.append({"titulo":v["titulo"],"fuentes":v["clips"],"dur":round(t,3),"piezas":piezas,"marcadores":marc,"resumen":res})
    print(v["titulo"],"|",res,"| piezas",len(piezas),"| marcadores",len(marc))
json.dump(out,open(sys.argv[2],"w"),ensure_ascii=False,indent=1)
