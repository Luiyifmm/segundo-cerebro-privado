# Uso: python3 palabras.py desde hasta  → palabras del tramo (s del tramo; bruto = +785.651), ? = no fiable, * = otra voz
import json,sys,os
W=json.load(open(os.path.expanduser("~/Videos-Remotion/voz/salida-whisperx/s03_desde_785.651.verificada.json")))
a,b=float(sys.argv[1]),float(sys.argv[2]);line=[];last=None
for w in W:
  if w.get("inicio") is None or not (a<=w["inicio"]<=b): continue
  if last is not None and w["inicio"]-last>0.6: print(" ".join(line)); line=[]
  m="" if w.get("fiable") else "?"
  if w.get("voz")!="principal": m+="*"
  line.append(f'{w["texto"]}{m}@{w["inicio"]:.2f}-{w["fin"]:.2f}'); last=w["fin"]
print(" ".join(line))
