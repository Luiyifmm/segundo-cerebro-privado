# Plan de montaje IMG_6122 (preguntas con voz de Amin sobre plano callado continuo con la respuesta)
import json
G=0.4  # pausa de "pensar" antes del veredicto
B=[ # nombre, pregunta(a,b), veredicto inicio, fin respuesta, texto pregunta, veredictos [(t_ini_rel_bruto,t_fin,linea,clave,color)]
 ("medias",(115.11,116.35),119.54,120.62,"¿Pagar a medias con tu novia?",[(119.54,120.62,"triste y de","MEDIOCRE","rojo")]),
 ("iphone",(93.18,94.30),96.51,97.20,"¿Tener el último iPhone?",[(96.51,97.20,"de","POBRE","rojo")]),
 ("logos",(181.85,182.92),185.73,187.05,"¿Llevar ropa con logos?",[(185.6,187.05,"de","POBRE","rojo")]),
 ("simple",(191.76,192.65),195.45,196.15,"¿Y llevar ropa simple?",[(195.45,196.15,"de","RICO","azul")]),
 ("coche",(131.46,132.32),149.90,153.30,"¿Comprarte un coche?",[(149.90,151.40,"de pobre","CASI SIEMPRE","rojo"),(151.40,153.30,"pero de rico si","SABES COMPRARLO","azul")]),
 ("casa",(161.10,162.48),165.69,166.45,"¿Comprarte una casa para vivir?",[(165.69,166.45,"de","POBRE","rojo")]),
 ("invertir",(171.85,173.17),175.40,177.05,"¿Y si es para invertir en ella?",[(175.40,177.05,"de rico,","MUY RICO","azul")]),
 ("banco",(229.78,231.06),240.03,241.50,"¿Dejar el dinero en el banco?",[(240.03,241.50,"de pobre porque te","ARRUINA","rojo")]),
 ("cocinar",(104.08,104.85),107.21,108.85,"¿Cocinar para ti?",[(107.21,108.85,"¿o eres pobre o eres","MUY RICO?","azul")]),
]
seq=[];t=0.0
for n,(qa,qb),v0,vend,qtxt,ver in B:
    qd=qb-qa; r0=v0-G; p0=r0-qd
    seq.append(dict(bloque=n,tipo="P",t=round(t,3),src=[round(p0,3),round(r0,3)],audio=[qa,qb],texto=qtxt))
    t+=qd
    seq.append(dict(bloque=n,tipo="R",t=round(t,3),src=[round(r0,3),vend],ver=[[round(t+(a-r0),3),round(t+(b-r0),3),l,k,c] for a,b,l,k,c in ver]))
    t+=vend-r0
for n,a,b,l,k in [("moraleja1",272.50,274.50,"los pobres gastan dinero para","APARENTAR"),("moraleja2",290.95,291.75,"los ricos",""),("moraleja3",292.32,296.10,"invierten en conocimiento que les hará ganar","MUCHO MÁS DINERO"),("cta",315.05,320.55,"comenta","RICO")]:
    seq.append(dict(bloque=n,tipo="H",t=round(t,3),src=[a,b],sub=[l,k]));t+=b-a
json.dump(seq,open("plan.json","w"),ensure_ascii=False,indent=1)
for s in seq: print(s["bloque"],s["tipo"],s["t"],s["src"],s.get("audio",""))
print("duración",round(t,2))
