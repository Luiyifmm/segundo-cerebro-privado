# Subtítulos estilo «Secuencia 04» (aprobado por Luis en 6887-11; aquí PROPUESTA): blanco centrado + 2.ª línea amarilla; cifras con Flicker.
# U = (i, j, blanco, amarillo, índice donde entra el amarillo) sobre palabras-montaje.json · F = (texto, i, j)
import json,os,sys
D=os.path.dirname(os.path.abspath(__file__))
P={
"F2":dict(U=[(0,2,"tres cosas que",None,None),(3,8,"te van a dar","muchísimo dinero",7),(10,12,"aprender a","vender",12),(13,16,"sepas lo que sepas",None,None),
 (17,22,"si no sabes venderlo","vale cero",21),(24,26,"saber hacer vídeos",None,None),(27,29,"en redes sociales",None,None),(30,32,"porque sin clientes",None,None),
 (33,37,"nunca vas a","conseguir nada",36),(39,42,"que tu dinero nunca",None,None),(43,46,"dependa de","tu tiempo",45),(47,50,"porque si tus ingresos",None,None),
 (51,54,"dependen de tu tiempo,",None,None),(55,58,"amigo mío,","estás limitado",57),(59,59,"tienes",None,None),(64,68,"y espero que al menos",None,None),
 (69,71,"quieras","dormir una",70),(72,74,"por lo tanto,",None,None),(75,78,"cuando empiezas a dejar",None,None),(79,80,"de cambiar",None,None),(81,84,"tu tiempo","por dinero",83),
 (85,89,"y empiezas a","conseguir clientes",88),(90,92,"que te paguen",None,None),(93,97,"por ser su","entrenador online",96),(98,101,"ahí es cuando, amigo,",None,None),
 (102,106,"de verdad consigues","libertad financiera",105),(107,111,"y si tú quieres aprender",None,None),(112,116,"a cómo ser","entrenador online",115),
 (117,119,"comenta la palabra",None,None),(121,126,"y te envío una","clase gratuita",125),(127,129,"donde te explico",None,None),(130,132,"cómo puedes hacerlo",None,None)],
 F=[("1",9,9),("2",23,23),("3",38,38),("24H",60,63),("PLAN",120,120)]),
"G":dict(U=[(0,5,"¿quién debería pagar","en las citas?",3),(6,7,"¿el hombre",None,None),(8,10,"o la mujer?",None,None),(11,12,"el coche",None,None),
 (15,16,"la ropa",None,None),(19,20,"la cena",None,None),(23,24,"el alquiler",None,None),(27,28,"las uñas",None,None),
 (31,34,"entonces, ¿ella","no paga nada?",33),(36,42,"ella no tiene que pagar","absolutamente nada",41),(43,47,"¿y eso acaso","no es injusto?",45),(48,48,"piénsalo",None,None),
 (49,53,"si ella nunca pide más,",None,None),(54,56,"el hombre nunca",None,None),(57,62,"tendrá una razón para","crecer económicamente",61),(63,65,"hay unos pocos",None,None),
 (66,68,"que no pueden",None,None),(69,73,"y se dedican a pagarle",None,None),(74,77,"a unas","gold diggers",76),(78,83,"que eso es tema aparte, amigo",None,None),
 (84,87,"si tú eres hombre",None,None),(88,91,"y vas al gimnasio",None,None),(92,95,"y no tienes","ingresos",95),(96,98,"lo único que",None,None),(99,102,"tienes que hacer es",None,None),
 (103,106,"ayudar a otras personas",None,None),(107,110,"a cambiar su","físico",110),(111,113,"como","entrenador online",112),(114,117,"y literalmente hay gente",None,None),
 (118,122,"que te paga","por eso",121),(123,125,"entonces no entiendo",None,None),(126,128,"cómo la gente,",None,None),(129,130,"estando en",None,None),
 (132,136,"no sabe cómo","hacer dinero",135),(137,137,"literalmente",None,None),(138,141,"yo genero más de",None,None),(144,144,"con",None,None),
 (147,147,"comenta",None,None),(149,153,"si tú quieres aprender a",None,None),(154,156,"cómo generar","ingresos",156),(157,159,"como","entrenador online",158)],
 F=[("EL HOMBRE",13,14),("EL HOMBRE",17,18),("EL HOMBRE",21,22),("EL HOMBRE",25,26),("EL HOMBRE",29,30),("NADA",35,35),("2026",131,131),("5 CIFRAS",142,143),("18 AÑOS",145,146),("PLAN",148,148)]),
"H":dict(U=[(0,4,"consejos para no","estar pelado",3),(5,9,"nunca más en tu vida",None,None),(10,12,"parte número uno",None,None),(13,16,"coge tu sueldo y",None,None),
 (17,18,"multiplícalo por",None,None),(21,24,"ese es tu número",None,None),(25,27,"de","libertad financiera",26),(28,30,"multiplica eso por",None,None),
 (34,36,"lo mínimo que",None,None),(37,41,"tendrías que guardar","cada mes",40),(42,46,"sin ningún tipo","de excusas",45),(47,49,"multiplica eso por",None,None),
 (51,54,"ese es tu","colchón",54),(55,56,"multiplícalo por",None,None),(58,62,"ese es el","gasto máximo",61),(63,64,"de alquiler,",None,None),(65,67,"gastos fijos, teléfono",None,None),
 (68,71,"o lo que sea",None,None),(72,76,"si esos gastos fijos","sobrepasan",76),(77,78,"ese 0,70,",None,None),(79,85,"algo tiene que cambiar","en tu vida",83),
 (86,88,"yo lo veo",None,None),(89,92,"desde la otra","perspectiva",92),(93,96,"si tus gastos fijos",None,None),(97,100,"ahogan a","tus ingresos",99),
 (101,103,"probablemente no seas","valioso",103),(104,108,"con esto no quiero decir",None,None),(109,114,"que tú no valgas","como persona",113),(115,117,"sino que probablemente",None,None),
 (118,120,"no sepas algo",None,None),(121,125,"por lo que el mundo",None,None),(126,128,"te considera","valioso",128),(129,133,"y te pague por él",None,None),
 (134,138,"y a día de hoy",None,None),(139,143,"eso es algo","súper simple",142),(144,146,"como por ejemplo",None,None),(147,149,"ser","entrenador online",148),
 (150,152,"que literalmente con",None,None),(153,155,"ir al gimnasio",None,None),(156,159,"entender un poco sobre",None,None),(160,161,"tu cuerpo",None,None),
 (162,164,"entender cómo funciona",None,None),(165,167,"el cuerpo humano",None,None),(168,173,"y vender asesorías","de forma online",171),(174,176,"pues está generando",None,None),
 (177,178,"de unos",None,None),(185,190,"todos los meses","de forma recurrente",188),(191,195,"y si tú quieres aprender",None,None),(196,201,"a cómo puedes","hacer tú eso",198),
 (202,204,"comenta la palabra",None,None),(206,209,"y te estaré enviando",None,None),(210,212,"una","clase gratuita",211),(213,215,"donde te enseño",None,None),(216,218,"cómo puedes hacerlo",None,None)],
 F=[("×150",19,20),("×0,10",31,33),("×6",50,50),("×0,70",57,57),("5.000 – 10.000",179,184),("PLAN",205,205)]),
"I":dict(U=[(0,2,"tú, sí, tú,",None,None),(3,6,"coge tu sueldito y",None,None),(7,11,"multiplícalo por","estos 5 números",9),(12,12,"uno",None,None),
 (18,22,"lo máximo para","lo básico",21),(23,24,"comida, transporte",None,None),(29,32,"tu dinero","sin remordimientos",31),(33,37,"gástatelo en","lo que quieras",35),
 (38,38,"tres",None,None),(42,44,"si tienes","deudas,",44),(45,45,"págalas",None,None),(46,50,"y si no,","a invertir",49),(51,51,"cuatro",None,None),
 (56,58,"tus gastos cercanos",None,None),(59,61,"casa, viajes, coches",None,None),(62,64,"lo que sea",None,None),(68,72,"tu riqueza","a largo plazo",70),
 (73,76,"esas son tus","inversiones",76),(77,82,"ponlas a trabajar","cada mes",81),(83,84,"pero realmente",None,None),(85,88,"no tendrías que estar",None,None),
 (89,91,"pensando en invertir",None,None),(92,96,"si tú aún eres","pobre",96),(97,102,"lo que tendrías que hacer es",None,None),(103,105,"aprender una","habilidad",105),
 (106,109,"como ser","entrenador online",108),(110,112,"y simplemente con",None,None),(113,115,"saber ganar músculo",None,None),(116,117,"perder grasa",None,None),
 (118,121,"vender tus asesorías",None,None),(122,124,"a otras personas",None,None),(125,128,"y ganar entre",None,None),(135,140,"todos los meses","de forma recurrente",138),
 (141,142,"simplemente ayudando",None,None),(143,148,"a otros a cambiar","su físico",147),(149,151,"y verse bien",None,None),(152,159,"que es lo que","todo el mundo quiere",156),
 (160,165,"y si tú quieres aprender a",None,None),(166,169,"cómo puedes","hacer esto",168),(170,176,"cómo lo han hecho","cientos de alumnos",174),(177,179,"comenta la palabra",None,None),
 (181,187,"y te enviaré una","clase gratuita",186),(188,190,"donde te enseño",None,None),(191,193,"cómo puedes hacerlo",None,None)],
 F=[("×0,55",13,17),("×0,05",25,28),("×0,10",39,41),("×0,15",52,55),("×0,15",65,67),("5.000 – 10.000 €",129,134),("PLAN",180,180)]),
}
def plan(v):
  W=json.load(open(f"{D}/{v}/palabras-montaje.json")); S=P[v]; B=[];Y=[];F=[]
  U=S["U"]
  for k,(i,j,w,y,yi) in enumerate(U):
    a=max(0,W[i]["a"]-0.05); a=max(a,B[-1][1] if B else 0)
    fin=W[j]["b"]+0.30
    if k+1<len(U): fin=min(fin if W[U[k+1][0]]["a"]-W[j]["b"]>0.6 else 9e9, W[U[k+1][0]]["a"]-0.05)
    fin=max(fin,a+0.35)
    B.append([round(a,3),round(fin,3),w])
    if y: Y.append([round(max(a,W[yi]["a"]-0.03),3),round(fin,3),y])
  for k,(t,i,j) in enumerate(S["F"]):
    a=max(0,W[i]["a"]-0.03); b=max(W[j]["b"]+0.35,a+0.6)
    if k+1<len(S["F"]): b=min(b,W[S["F"][k+1][1]]["a"]-0.05)
    F.append([t,round(a,3),round(b,3)])
  for Lx in (B,Y):
    for x in Lx:
      for t,fa,fb in F:
        if x[0]<fa<x[1]: x[1]=round(fa-0.02,3)
    for x,z in zip(Lx,Lx[1:]): assert z[0]>=x[1]-0.001,(v,x,z)
  json.dump({"blanco":B,"amarillo":Y,"flicker":F},open(f"{D}/{v}/plan.json","w"),ensure_ascii=False)
  return B,Y,F
for v in (sys.argv[1:] or P):
  B,Y,F=plan(v); print(v,len(B),"blancos",len(Y),"amarillos",len(F),"flicker",F)
