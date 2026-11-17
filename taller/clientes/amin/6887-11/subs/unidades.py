# (línea, inicio, clave, inicio_clave, fin) en tiempos de «Ranking negocios (Claude) v1». Texto corregido a mano sobre ranking-66.verificada.json.
U=[("voy a ordenar",0.25,"10 negocios",0.69,1.40),("del peor al",1.43,"mejor",1.93,2.30),
("un restaurante, puesto 10",2.33,None,None,3.85),("horarios",3.89,"infernales",4.33,4.90),
("y la mayoría cierra",4.90,None,None,5.77),("antes de los",5.77,"3 años",6.37,6.92),("una peluquería, puesto 9",6.97,None,None,8.50),
("si no cortas,",8.57,"no cobras",9.44,10.10),("una franquicia, puesto 8",10.14,None,None,11.38),
("pagas por una marca",11.42,None,None,12.20),("que ni siquiera",12.20,"es tuya",12.94,13.26),("una cafetería, puesto 7",13.28,None,None,14.90),
("un café soso",14.94,None,None,15.66),("y no da para el",15.66,"alquiler",16.40,16.95),("una gasolinera, puesto 6",16.98,None,None,18.56),
("cada vez está más cara",18.60,None,None,20.04),("y encima ganas",20.06,"céntimos",20.88,21.88),
("un centro médico, puesto 5",21.92,None,None,24.32),("si se van tus médicos,",24.36,None,None,26.00),
("te quedas a hacer amigos",26.03,None,None,26.98),("un concesionario, puesto 4",27.04,None,None,28.60),
("coches parados que",28.62,"pierden valor",29.86,31.00),("una inmobiliaria, puesto 3",31.06,None,None,32.68),
("los alquileres",32.72,None,None,33.26),("cada vez están más",33.26,"caros",33.88,34.32),("y hay poquita gente",34.36,None,None,35.04),("que lo pueda",35.04,"pagar",35.46,35.66),
("un gimnasio, puesto 2",35.70,None,None,36.92),("gastos en",36.95,"máquinas",37.41,37.83),("y alquiler,",37.85,None,None,38.35),
("pero puede ir",38.37,"muy bien",39.11,39.62),("entrenador online,",39.65,None,None,40.47),("puesto número",40.49,None,None,41.27),
("sin duda trabajas",41.29,None,None,42.13),("desde donde quieras",42.13,None,None,43.28),("vendiendo lo que",43.33,None,None,44.17),("todo el mundo",44.17,"quiere",44.73,45.32),
("que es",45.35,"verse mejor",45.71,46.33),("y si ya eres",46.35,"entrenador",46.84,47.52),("solo te falta",47.54,"un paso",48.28,49.10),
("para estar en el",49.12,"número uno",49.82,50.52),("es dejar de cambiar tus horas por",50.55,"dinero",52.05,52.52),
("y empezar a vender planes",52.55,"anuales",53.57,53.98),("y te envío la guía paso a paso",54.87,None,None,56.92),
("de cómo puedes llegar a tus primeros",56.95,None,None,58.32),("al mes como entrenador online",59.04,None,None,60.58),
("desde",60.60,"cero",61.00,61.33)]
import json
clips=[]
for l,a,k,ka,b in U:
  tam=60 if a<46.3 else 67.89
  if k is None: clips.append([a,b,l,"",tam]); continue
  if ka-a>0.25: clips.append([a,ka,l,"",tam]); clips.append([ka,b,l,k,tam])
  else: clips.append([a,b,l,k,tam])
for c in clips: assert c[1]>c[0]+0.15, c
for x,y in zip(clips,clips[1:]): assert y[0]>=x[1]-0.001,(x,y)
json.dump(clips,open("subs.json","w"),ensure_ascii=False)
print(len(clips),"clips")
