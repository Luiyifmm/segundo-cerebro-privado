# Estilo «Secuencia 04» (pedido por Luis 11-11): blanco centrado + 2.ª línea amarilla del mismo tamaño; cifras con Flicker.
# (inicio, fin, blanco, amarillo, inicio_amarillo). Tiempos de «Ranking negocios (Claude) v1». Desde 5,47 s (antes, clips de Luis).
U=[(5.47,5.99,"la mayoría cierra",None,None),(5.99,6.95,"antes de los",None,None),
(6.97,8.50,"peluquería",None,None),(8.57,10.10,"si no cortas,","no cobras",9.44),
(10.14,11.38,"franquicia",None,None),(11.42,12.20,"pagas por una marca",None,None),(12.20,13.26,"que ni siquiera","es tuya",12.94),
(13.28,14.90,"cafetería",None,None),(14.94,15.66,"un café soso",None,None),(15.66,16.95,"y no da para el","alquiler",16.40),
(16.98,18.56,"gasolinera",None,None),(18.60,20.04,"cada vez está más cara",None,None),(20.06,21.88,"y encima ganas","céntimos por litro",20.88),
(21.92,24.32,"centro médico",None,None),(24.36,26.00,"si se van tus médicos,",None,None),(26.03,26.98,"te quedas a hacer amigos",None,None),
(27.04,28.60,"concesionario",None,None),(28.62,29.64,"coches parados",None,None),(29.66,31.00,"que pierden","valor cada día",30.20),
(31.06,32.68,"inmobiliaria",None,None),(32.72,33.54,"los alquileres cada vez",None,None),(33.56,34.32,"están más","caros",33.88),
(34.36,35.02,"y hay poquita gente",None,None),(35.04,35.66,"que lo pueda","pagar",35.46),
(35.70,36.92,"gimnasio",None,None),(36.95,37.83,"gastos en","máquinas",37.41),(37.85,38.35,"y alquiler,",None,None),(38.37,39.62,"pero puede ir","muy bien",39.11),
(39.65,40.47,"entrenador online",None,None),(40.49,41.27,"puesto número",None,None),(41.29,42.11,"sin duda trabajas",None,None),(42.13,43.28,"desde donde quieras",None,None),
(43.33,44.15,"vendiendo lo que",None,None),(44.17,45.32,"todo el mundo","quiere",44.73),(45.35,46.33,"que es","verse mejor",45.71),
(46.35,47.52,"y si ya eres","entrenador",46.84),(47.54,49.10,"solo te falta","un paso",48.28),(49.12,50.52,"para estar en el","número uno",49.82),
(50.55,51.43,"es dejar de cambiar",None,None),(51.45,52.52,"tus horas","por dinero",51.89),(52.55,53.98,"y empezar a vender","planes anuales",53.29),
(56.95,57.68,"de cómo puedes llegar",None,None),(57.70,58.32,"a tus primeros",None,None),(59.04,59.64,"al mes",None,None),(59.66,60.58,"como entrenador online",None,None),
(60.60,61.33,"desde","cero",61.00)]
F=[("3 años",6.37,6.95),("9",7.66,8.50),("8",10.90,11.40),("7",14.10,14.92),("6",17.72,18.58),("5",23.55,24.34),("4",28.28,29.20),("3",31.84,32.70),("2",36.33,37.00)]
import json
B=[[a,b,w] for a,b,w,y,ya in U]; Y=[[ya,b,y] for a,b,w,y,ya in U if y]
for L in (B,Y):
  for x,z in zip(L,L[1:]): assert z[0]>=x[1]-0.001,(x,z)
json.dump({"blanco":B,"amarillo":Y,"flicker":F},open("plan.json","w"),ensure_ascii=False)
print(len(B),"blancos",len(Y),"amarillos",len(F),"flicker")
