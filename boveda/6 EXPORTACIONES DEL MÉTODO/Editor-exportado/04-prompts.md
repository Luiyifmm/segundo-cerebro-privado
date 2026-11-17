# 04 · Prompts

**No tengo prompts guardados que use tal cual.** No llamo a otra IA para decidir cortes, ganchos, subtítulos ni b-roll: esas decisiones las tomo yo mismo dentro de la conversación, siguiendo las reglas de mis skills y memorias (copiadas en `archivos/claude/`).

Para que tu sistema (donde "una IA decide los cortes y los momentos clave") decida igual, abajo convierto esas reglas en prompts. **El texto de los prompts lo he escrito ahora para esta exportación; las reglas de dentro son las que aplico de verdad.** Cada prompt espera la transcripción con tiempos por palabra (`[{texto, inicio, fin}]`) y devuelve JSON.

---

## 1. Selección de tomas y cortes

```
Eres el montador. Tienes la transcripción con tiempos por palabra de un bruto de reel hablado en español y el guion del cliente.
Divide en frases (cierra frase en . ? ! o en pausa > 0,45 s) y numéralas.
Marca para QUITAR:
- indicaciones fuera del guion ("otra vez", "¿así?", "listo", "espera"),
- palabras que no encajan con el guion (Whisper inventa "Gracias." en silencios),
- tomas anteriores de una frase repetida: conserva SOLO la última toma completa,
- frases sin terminar o que acaban en "…",
- alternativas dichas en la misma frase cuando el cliente pidió una sola cifra ("30 o 35" → deja solo la que diga el guion),
- ideas sin ninguna toma limpia (dilo).
No reordenes si el guion ya pone el gancho delante.
Devuelve: {"frases":[{"n":1,"texto":"...","inicio":s,"fin":s,"accion":"quedar|quitar","motivo":"..."}],"dudas":[n,...]}
Los tiempos de corte finales NO los decides tú: el script los ajusta al mínimo de energía entre palabras (ventanas de 10 ms) y añade 0,08 s de aire antes y 0,15 s después.
```

## 2. Gancho

```
Con la transcripción ya limpia, decide los primeros 3 segundos.
Busca la frase más fuerte: afirmación tajante, pregunta, resultado o dato sorprendente. Si ya está al principio, no toques el orden.
Si está más adelante y subirla no rompe el sentido, propón moverla y di desde y hasta qué palabra.
Propón un título de gancho de ≤ 6 palabras para arriba de la pantalla, con UNA palabra en el color de acento.
Nunca abras con logo ni saludo.
Devuelve: {"mover":bool,"frase":{"inicio":s,"fin":s},"titulo":"...","palabra_acento":"..."}
```

## 3. Subtítulos (bloques y palabra clave)

```
Parte la transcripción en bloques de subtítulo para un reel vertical:
- cada bloque: línea de 1–3 palabras + como mucho UNA palabra clave, y la clave solo si es la ÚLTIMA palabra del bloque;
- nunca una palabra clave sola; nunca acabes un bloque en "de, la, el, que, y, en, a, por, con…" (pásala al siguiente);
- si un bloque dura < 0,45 s, únelo a la frase anterior;
- la clave es el sustantivo o verbo que lleva el significado (beneficio, problema, alimento, cifra), nunca un conector;
- si una cifra va a salir como gráfico grande, quítala del subtítulo y deja el resto de la frase; si toda la frase es la cifra, no hay subtítulo;
- si la clave se dice claramente después de la línea, márcala "tardia" con su tiempo propio;
- corrige faltas, tildes y lo que Whisper oye mal; quita muletillas; escribe los números en cifra.
Devuelve: [[inicio, fin, "linea", "clave", {"tardia":t|null,"color":"acento|rojo|verde"}], ...]
Color: acento de marca por defecto; rojo si es lo malo y verde si es lo bueno en una comparativa.
```

## 4. Momentos clave: b-roll, imágenes, motion graphics y sonido

```
Lee el guion bloque a bloque. Para cada frase decide si necesita apoyo visual, y solo si nombra algo concreto (alimento, objeto, persona, cifra, comparación).
Para cada apoyo: qué objeto o metáfora la representa (una por frase), tipo (emoji PNG / recorte de imagen / tarjeta / gráfico de datos / número grande), aparición exacta (la palabra que lo nombra), duración (0,3 s por palabra de texto + 0,5 s; mínimo 1 s) y zona de pantalla (nunca sobre la cara; fuera de los 220 px de arriba, 420 de abajo y 140 de la derecha; si hay subtítulos sobre el pecho, por encima de ~900 px de 1920).
Imágenes: provocadoras o conceptuales, no stock neutro.
Sonido: solo en cambios. Pop en emoji/ítem, clic en palabra clave importante (no en todas), dato en cifra, whoosh cuando entra una tarjeta, riser → impacto antes de una revelación. Máximo uno por cambio, nunca uno por palabra.
Estilo de cliente: natural, elegante, sencillo; menos es más.
Devuelve: [{"t":s,"dur":s,"tipo":"...","contenido":"...","zona":"...","sonido":"..."}]
```

## 5. Correcciones del cliente

```
Te paso la corrección del cliente tal cual la escribió (puede venir de un audio transcrito, sin puntuación).
1) Divide en peticiones atómicas y numéralas.
2) Marca cuáles ya están hechas en la versión actual (te paso la descripción de la versión).
3) Para cada una, el cambio exacto: qué elemento, qué valor antes → después, en qué segundo.
4) Si una petición es ambigua y cambia el resultado, formula UNA pregunta con 2–3 opciones; si no cambia el resultado, decide y dilo.
5) Apunta qué NO hay que tocar ("no lo toques" = ni vídeo ni audio: solo la capa pedida).
6) Si la corrección cambia números (por ejemplo, el peso), recalcula toda la cadena y lista las cifras que dejan de cuadrar con la voz.
Devuelve: {"peticiones":[{"n":1,"texto":"...","hecha":bool,"cambio":"...","pregunta":null}],"no_tocar":[...],"cifras_que_no_cuadran_con_la_voz":[...]}
```

## 6. Revisión final

```
Te paso N fotogramas de la secuencia (con su tiempo) y la lista de lo que debía haber.
Comprueba en cada uno: texto sobre ojos o boca; un gráfico tocando o tapando un subtítulo; textos fuera de las zonas seguras; cifras en pantalla distintas de lo que dice la voz en ese segundo; faltas de ortografía o tildes; huecos negros; dos elementos animados a la vez en la misma zona.
Devuelve APROBADO / REVISAR / BLOQUEADO con la evidencia (tiempo + qué se ve).
```
