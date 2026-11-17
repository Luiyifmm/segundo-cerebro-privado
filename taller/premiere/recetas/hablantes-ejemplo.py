import json
R = "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/ricos/"
F = json.load(open(R + "frases.json"))
FIX = {8: "enseña la llave?", 12: "de que no me has visto en tu vida", 16: "hace siete años que me di cuenta del", 18: "me vine a trabajar a un almacén", 20: "con 500 euros",
 21: "yo empecé trabajando en sprinter aquí", 23: "porque no quería pagar los 50.000 euros", 28: "cuál dirías que es el salto más grande que has dado", 30: "el salto más grande para hacerme",
 38: "crees que para tomar riesgo hay que", 41: "o crees que puedes ir all in?", 42: "puedes ir all in", 44: "difícil porque tienes más que perder", 45: "cuando no tienes nada solo puedes subir",
 47: "te hago una pregunta un poco", 49: "cuánto es lo máximo que has ganado en un", 55: "40 mil euros con 23 años", 71: "gimnasio", 78: "y el gusto", 79: "el gusto y las ganas y todo se logra?",
 85: "si tuvieses que dar un consejo a la", 87: "cuál sería ese último consejo", 88: "el más importante?", 97: "si te digo la verdad", 102: "fue como he logrado las cosas",
 107: "perdona tenéis dos minutos de vuestro", 114: "para ayudar a la gente joven oye", 118: "en lugar de todo lo que te entra", 128: "pero estoy ya invirtiendo en pisos",
 129: "si fuese el último consejo", 138: "qué sector ves que ahora puede tener", 140: "o qué sector ves de moda?", 141: "turismo", 142: "todo lo que se puede invertir en turismo",
 155: "y cuál dirías que ha sido la clave?", 176: "en una compañía de seguros", 177: "y ahora soy coach", 178: "busco especialmente gente joven", 187: "movíamos 400 millones de euros cada año",
 189: "puedes dar a un chaval de 20 años para", 190: "que seas bueno de cojones en ventas?", 191: "bueno de cojones en ventas", 198: "fíjate sino por el corazón", 208: "para mí la constancia", 238: "bonito coche bro",
 26: "y qué edad tienes?", 58: "no", 231: "una pregunta un poco directa", 232: "cómo te hiciste rico?", 234: "estoy preguntando a la gente cómo se hizo"}
QUITAR = {13, 14, 63, 67, 103, 104, 106, 109, 111, 137, 225}
I = set([2, 5, 7, 10, 27, 58, 65, 66, 69, 75, 78, 112, 146, 147, 150, 152, 154, 160, 203, 228, 230, 233, 237] + list(range(16, 25)) + list(range(30, 38)) + list(range(42, 47)) + list(range(51, 55))
 + list(range(70, 74)) + list(range(83, 85)) + list(range(89, 94)) + list(range(97, 105)) + list(range(117, 123)) + list(range(132, 137)) + list(range(141, 144)) + list(range(156, 161))
 + list(range(162, 172)) + list(range(174, 184)) + list(range(186, 188)) + list(range(191, 199)) + list(range(208, 210)) + list(range(213, 218)) + list(range(221, 223)))
out = []
for k, f in enumerate(F):
    if k in QUITAR: continue
    out.append([f[0], f[1], FIX.get(k, f[2]), "I" if k in I else "E"])
json.dump(out, open(R + "frases-final.json", "w"), ensure_ascii=False)
print(len(out), sum(1 for x in out if x[3] == "I"), "entrevistado")
