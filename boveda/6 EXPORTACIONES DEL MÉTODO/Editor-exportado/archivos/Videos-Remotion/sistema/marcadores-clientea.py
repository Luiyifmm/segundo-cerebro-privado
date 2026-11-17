# Marcadores de ClienteA en el formato que usa el usuario (captura del 11-10-2026): marcadores CON DURACIÓN encima de la línea de tiempo,
# "IMAGEN derecha|izquierda: …" (rojo), "MOTION GRAPHIC: …" y "CIERRE: …" (naranja), sobre la última toma de cada idea.
# Regla de lados (marca de ClienteA): lo malo/pobre a la derecha, lo bueno/rico a la izquierda.
import json,os,re,sys,unicodedata
H=os.path.expanduser("~"); bd=json.load(open(H+"/Videos-Remotion/sistema/reels.json"))["reels"]; plan=json.load(open(H+"/Videos-Remotion/sistema/linea-clientea.json"))
CRUDO="--crudo" in sys.argv   # bruto entero sin cortar nada: los tiempos son los del archivo original
DUR=[]
INI=[57,150,306,431]
if "--orden" in sys.argv: o=sys.argv[sys.argv.index("--orden")+1].split(","); plan=sorted(plan,key=lambda v:o.index(v["id"]) if v["id"] in o else 99)   # orden de los vídeos en la línea de tiempo
nz=lambda s:re.sub(r"[^a-zñ0-9 ]","",unicodedata.normalize("NFD",s.lower()).encode("ascii","ignore").decode())
def frases(P):
    F=[];cur=[]
    for p in P:
        if cur and (re.search(r"[.?!]$",cur[-1]["t"]) or p["a"]-cur[-1]["b"]>0.8): F.append(cur);cur=[]
        cur.append(p)
    if cur: F.append(cur)
    return F
R={ "CLIENTE-A_1010_03":[
  (r"mujer del pobre","PAR","mujer del pobre|mujer del rico"),(r"fin de semana del pobre y","PAR","fin de semana del pobre|fin de semana del rico"),(r"interior de la casa","PAR","interior de la casa del pobre|interior de la casa del rico"),
  (r"lo que bebe","PAR","lo que bebe el pobre|lo que bebe el rico"),(r"lo que escucha","PAR","lo que escucha el pobre|lo que escucha el rico"),(r"como se viste","PAR","cómo se viste el pobre|cómo se viste el rico"),
  (r"exito no depende","MG","el éxito no depende de lo que tengas, sino de tu mentalidad"),(r"comenta rico y te voy","CIERRE","comenta RICO + seguir @cliente_a_handle")],
 "CLIENTE-A_1010_04":[
  (r"bailando tiktok","D","ver a gente bailando en TikTok (de pobre)"),(r"fardar del lamb","C","fardar del Lamborghini (ni lo uno ni lo otro)"),(r"ultimo iphone","D","tener el último iPhone (de pobre)"),(r"cocinar para ti","C","cocinar para ti (o eres pobre o muy rico)"),
  (r"pagar a medias","D","pagar a medias con tu novia (triste y de mediocre)"),(r"comprarte un coche|de pobre casi siempre pero","D","comprarte un coche (de pobre casi siempre; de rico si sabes comprarlo)"),(r"casa para vivir","D","comprarte una casa para vivir (de pobre)"),
  (r"para invertir en ella","I","casa para invertir en ella (de rico)"),(r"ropa con logos","D","llevar ropa con logos (de pobre)"),(r"ropa simple","I","llevar ropa simple (de rico)"),(r"dejar el dinero en el banco","D","dejar el dinero en el banco (de pobre: te arruina)"),
  (r"quejarse continuamente|se hagan continuamente","D","quejarse continuamente (de miserable)"),(r"gastan dinero para aparentar","MG","los pobres gastan dinero para aparentar"),(r"invierten en conocimiento","MG","los ricos invierten en conocimiento que les hará ganar más"),
  (r"aprender una habilidad online","CIERRE","comenta RICO + seguir @cliente_a_handle")],
 "CLIENTE-A_1010_05":[
  (r"5 tipos de mujeres","MG","título: 5 tipos de mujeres con las que no puedes perder tu tiempo"),(r"intimidad como premio","MG","1 · usa la intimidad como premio o castigo"),(r"jamas pide perdon","MG","2 · nunca acepta que se equivoca ni pide perdón"),
  (r"ganado de amiguitos hombres","MG","3 · necesita mantener a su ganado de amiguitos"),(r"no te valora y no te apoy","MG","4 · no te respeta, no te valora, no te apoya (red flag)"),(r"solo pide y gasta","MG","5 · la peor: solo pide y gasta (cajero automático)"),
  (r"ni un segundo de energia","MG","frase: un ganador no pierde ni un segundo con mujeres que le restan"),(r"construir riqueza","MG","invierte todo su tiempo en construir riqueza"),(r"sigueme para mejorar","CIERRE","seguir @cliente_a_handle")],
 "CLIENTE-A_1010_06":[
  (r"^tener novia$|tener novia de pobre|de pobre mediocri","D","tener novia (de pobre)"),(r"quita tu tiempo y tu foco","MG","lista: te quita tu tiempo y tu foco"),(r"te cuesta dinero","MG","lista: te cuesta dinero"),(r"vacia la cartera","MG","lista: te vacía la cartera"),
  (r"dolores de cabeza","MG","lista: te da dolores de cabeza"),(r"horas para tus proyectos","MG","lista: no tienes horas para tus proyectos"),(r"restaurantes caros","D","gastar en restaurantes caros lo que no tienes"),(r"mendigar un poquito","D","mendigar un poquito de intimidad"),
  (r"perdedor arrastrado","MG","frase: eso es de perdedor arrastrado"),(r"construye su imperio","MG","un ganador primero construye su imperio"),(r"mujer de valor","MG","y solo en la cima busca una mujer de valor para compartirlo"),(r"sigueme para mejorar|sigueme para ser","CIERRE","seguir @cliente_a_handle")]}
out=[]
for n,v in enumerate(plan):
    r=next(x for x in bd if x["id"]==v["id"])
    if CRUDO:
        d=r["corte"]["bruto"]; ini=57 if n==0 else int(-(-(DUR[-1]+30)//1)); DUR.append(ini+d); v=dict(v,resumen="Bruto entero (%.0f s), sin cortar nada." % d,piezas=[{"a":0,"b":d,"t":0}],dur=d)
    else: ini=INI[n]
    out.append({"a":ini,"b":ini,"n":"▶ VÍDEO %d · %s"%(n+2,v["titulo"]),"c":v["resumen"],"col":5})
    f=v["fuentes"][0]; P=json.load(open(os.path.join(r["dir"],".cache",os.path.basename(f)+".json")))["palabras"]; mapa=[(p["a"],p["b"],p["t"]) for p in v["piezas"]]
    def tl(x):
        for a,b,t in mapa:
            if x<b: return t+max(0,x-a)
        return v["dur"]
    F=frases(P)
    for rx,tipo,et in R[v["id"]]:
        c=[fr for fr in F if re.search(rx,nz(" ".join(w["t"] for w in fr)))]
        if not c: print("  sin toma para:",et); continue
        fr=c[-1]; a=ini+tl(fr[0]["a"]); b=ini+tl(fr[-1]["b"])+0.15; nt=len(c); com=("%d tomas; marcada la última." % nt) if nt>1 else ""
        if tipo=="PAR":
            k=next((i for i,w in enumerate(fr) if i>2 and nz(w["t"])=="y"),None); m=ini+tl(fr[k]["a"]) if k else (a+b)/2; i1,i2=et.split("|")
            out.append({"a":round(a,2),"b":round(m,2),"n":"IMAGEN derecha: "+i1,"c":com,"col":1}); out.append({"a":round(m,2),"b":round(b,2),"n":"IMAGEN izquierda: "+i2,"c":"","col":1})
        elif tipo in ("D","I","C"): out.append({"a":round(a,2),"b":round(b,2),"n":"IMAGEN "+{"D":"derecha","I":"izquierda","C":"centro"}[tipo]+": "+et,"c":com,"col":1})
        elif tipo=="MG": out.append({"a":round(a,2),"b":round(b,2),"n":"MOTION GRAPHIC: "+et,"c":com,"col":3})
        else: out.append({"a":round(a,2),"b":round(b,2),"n":"CIERRE: "+et,"c":com,"col":3})
out.sort(key=lambda m:m["a"]); json.dump(out,open(H+"/Videos-Remotion/sistema/marcadores-clientea.json","w"),ensure_ascii=False,indent=1); print(len(out),"marcadores"); print("inicios:",[[m["n"][2:40],m["a"]] for m in out if m["n"].startswith("▶")])
