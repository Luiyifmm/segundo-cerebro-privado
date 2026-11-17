# Palabras en tiempo de MONTAJE a partir de v1.json (start,end,inPoint en s del bruto) y la transcripción verificada.
import json,os,sys
D=os.path.dirname(os.path.abspath(__file__)); OFF=785.651
def palabras(v):
  C=json.load(open(f"{D}/{v}/v1.json")); W=json.load(open(f"{D}/palabras-bruto.json")); out=[]
  for st,en,inp in C:
    outp=inp+(en-st)
    for w in W:
      if w.get("inicio") is None: continue
      m=(w["inicio"]+w["fin"])/2
      if inp<=m<=outp: out.append({"t":w["texto"],"a":round(max(st,w["inicio"]-inp+st),3),"b":round(min(en,w["fin"]-inp+st),3)})
  return out
if __name__=="__main__":
  P=palabras(sys.argv[1]); json.dump(P,open(f"{D}/{sys.argv[1]}/palabras-montaje.json","w"),ensure_ascii=False)
  print(" ".join(f'{i}:{p["t"]}@{p["a"]:.2f}' for i,p in enumerate(P)))
