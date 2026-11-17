# Genera los .jsx de la propuesta de un vídeo a partir de plan.json (tandas ≤12 MOGRT, Flicker, SFX).
import json,os,sys
D=os.path.dirname(os.path.abspath(__file__)); v=sys.argv[1]; P=json.load(open(f"{D}/{v}/plan.json"))
TPL=os.path.expanduser("~/Videos-Remotion/clientes/amin/6887-11/subs-s04/")
tanda=open(TPL+"tanda.tpl").read(); out=[]
def chunks(L,n=12): return [L[i:i+n] for i in range(0,len(L),n)]
for nom,L,col,y,pista in (("blanco",P["blanco"],[255,255,255],0.4606,"__PB__"),("amarillo",P["amarillo"],[243,255,0],0.5056,"__PA__")):
  for k,c in enumerate(chunks(L)):
    f=f"{D}/{v}/{nom}{k}.jsx"; open(f,"w").write(tanda.replace("__L__",json.dumps(c,ensure_ascii=False)).replace("__P__",pista).replace("__COL__",json.dumps(col)).replace("__Y__",str(y))); out.append((f,c[0][0]+0.2))
fl={"items":[{"sv":7,"sc":6,"t0":a,"t1":b,"txt":t,"pos":[0.5,0.6375]} for t,a,b in P["flicker"]]}
open(f"{D}/{v}/flicker.jsx","w").write(open(TPL+"flicker.tpl").read().replace("__CFG__",json.dumps(fl,ensure_ascii=False)))
S="/Users/luiyi/EDICION/2 MATERIALES DE EDICION/Efectos de sonido/Sound Effects By Motionix /Ui Sound Effects /Ui Glitch, Flicker, Text  (2).wav"
sfx={"bandeja":"SFX (Claude)","pistas":1,"sonidos":{"fl":S},"eventos":[{"pista":0,"sonido":"fl","t":round(max(0,a-0.02),3),"db":-14,"dur":0.8} for t,a,b in P["flicker"]],"guardar":True}
json.dump(sfx,open(f"{D}/{v}/sfx.json","w"),ensure_ascii=False)
print("\n".join(f"{f} {t:.2f}" for f,t in out))
