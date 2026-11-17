---
name: subtitulos-reels
description: Subtítulos de reels de Eric (y Natalia) en Premiere con la plantilla MOGRT línea + palabra clave, con la estética y las correcciones que hace el usuario a mano. Usar cuando pida subtítulos para un reel ya cortado, "ayúdame con los subtítulos", arreglar la estética de los subtítulos o continuar los que él empezó.
---
# Subtítulos de reels (Eric / Natalia)

Aprendido del usuario en ERIC_1017_05 "3 trucos para eliminar barriga" (19-10-2026): él corrige a mano el principio y quiere que el resto quede igual.

## Flujo
1. **Releer la secuencia activa** (el usuario edita a la vez): `premiere/pr.sh premiere/recetas/leer-v1.jsx` → piezas de V1 a `piezas.txt`.
2. **Bloques desde el corte actual** (no desde el plan viejo: él recorta después):
   `python3 premiere/recetas/subs-desde-linea.py piezas.txt <ficha.json> ~/Videos-Remotion/voz/salida/<prefijo>__ subs.json [extra.json]`
   - La ficha da `claves` (palabras en color) y `arreglos` (errores de Whisper).
   - Si un tramo sale sin palabras, Whisper se lo saltó. Re-transcribir solo ese trozo con `voz/transcribir.js <bruto> --inicio X --duracion 4` y pasar las palabras en `extra.json` con tiempos del bruto.
   - OJO: `transcribir.js` sobrescribe el `.palabras.json`, `.srt` y `.txt` del bruto. Copiar antes el `.palabras.json` y restaurarlo después.
3. **Colocar** en una pista de vídeo **VACÍA**, en orden de tiempo:
   `python3 premiere/recetas/colocar-subs-mogrt.py subs.json <cfg con subPlantilla/subAjustes/colorClave/subPos> <pista 0=V1> <nombre secuencia> <carpeta>`
   Luego ejecutar `tanda0.jsx`, `tanda1.jsx`… en orden con `pr.sh`.
   - `importMGT` mete la plantilla con 30 s y PISA lo que haya detrás en esa pista antes de recortarla. Nunca colocar entre clips existentes ni en pista ocupada (así se borraron 32 subtítulos el 19-10).
   - Comprobar después que están todos (mismo número y nombres en orden) y mirar fotogramas.
4. **Quitar subtítulos míos** solo filtrando por nombre y `getMGTComponent()`. Nunca tocar animaciones del usuario.
5. **Ver qué corrigió el usuario**: `premiere/recetas/leer-subs-mogrt.jsx` lista texto, controles, posición y escala de cada MOGRT. Comparar con los valores por defecto y aplicar el patrón al resto.

## Estética base (Eric de reels, naranja)
- Plantilla `clientes/_plantillas/Subtitulo Eric v3.mogrt`, con estos ajustes:
  - Tamano 52,2
  - Tamano de la línea 77
  - Palabra clave 50, en naranja 255,88,0; retraso de la palabra clave 2 fotogramas
  - Sombra 100 / 34 / 18; animación de entrada 6 fotogramas
  - Centrado, posición [0.5, 0.3909] (sobre el pecho)
- Bloques de 4 palabras como máximo. La palabra clave va solo si es la última del bloque.

## Correcciones que hace el usuario (aplicarlas sin que lo pida)
- **Intro con animaciones de título** ("Animación Rápida Con Brillo" / "Animación Limpia Rápida" en V3–V5, y ≈0,59–0,65): subir los subtítulos de esos segundos a **y 0,32** para que no choquen.
- **Números de cada punto/truco**: MOGRT "Efecto Brillo", Inter-Black 300, en [0.5, 0.616] y ≈0,83 s, al empezar cada punto ("1.", "2.", "3."). Para el que falte, duplicar el clip de uno existente (mismo `projectItem` y mismos controles) y cambiar `textEditValue`.
- **Cifras como gráfico** ("3 DÍAS × 45 MIN", "2–3 H" con Efecto Brillo, Inter-Black 225–300): quitar esa cifra del texto del subtítulo y dejar el resto ("con que hagas", "un entrenamiento"). Si la frase entera es la cifra, sin subtítulo.
- **Palabra clave a destiempo**: cuando la palabra clave se dice claramente después de la línea, va en un clip aparte en la pista de encima (V8), solo con la clave, desde el momento en que se dice ("sé que puedes bajar" + "grasa", "después de que te" + "levantes", "rápidamente" sola).
- **Énfasis**: frases clave del cierre más grandes, por ejemplo "3 trucos" con Tamano 74 y línea 100, o "durante 1 mes" con línea 84. Los números van en cifra ("3", "1 mes").
- **Texto**: completar la palabra clave que Whisper corta ("da sueño", "en tu cuerpo", "comer algo"), corregir faltas ("según como los cocines") y quitar muletillas.

## Comprobar antes de decir "hecho"
- Fotogramas en la intro, en cada número y en el cierre: que no se pisen texto, números ni cara.
- Contar los subtítulos colocados frente a los esperados.
- Guardar el proyecto.

## Cierre / CTA de Eric (reels)
- Si el usuario alarga el final con el CTA hablado, transcribir ese tramo (puede faltar en la transcripción) y subtitularlo igual; la cifra ("4–12 KG") va con Efecto Brillo, como el resto.
- Animación de follow aprobada: `clientes/eric/ERIC_1009_01/motion/CTA guardar compartir seguir v2.mov` (3,63 s, 2160×3840 con alfa). Posición [0.5, 0.98] y pista libre más alta. El botón pasa a "Siguiendo" hacia los 2,2 s: empezar 2,2 s antes de "sígueme".
- Sonido en pista de audio libre: Pop up SFX.mp3 (0–0,62 s) a 0,06 al entrar y Mouse Click 01.wav a 0,08 en el clic.

## Propuesta completa de Eric (corrección del usuario, 22-10-2026, ERIC 03 "un fin de semana no cuenta")
Referencia buena: su reel "3 trucos para eliminar barriga" (secuencia ERIC_1017_05 en `ERIC - LOTE 17 OCT.prproj`).
- **Nada de cajas** ("Etiqueta Eric v1" naranja/negra): no le gustan. Textos con SUS plantillas (`~/Library/Application Support/Adobe/Common/Motion Graphics Templates/`):
  - Gancho: "Animación Limpia Rápida" blanco + "Animación Rápida Con Brillo" / "Desenfoque Con Brillo" naranja (255,96,0), con Sombra paralela (op. 127,5, dir. 135, dist. 5).
  - Números ("1.", "2.") y cifras ("3 veces", "10-20 min", "2-3 H"): "Efecto Brillo" naranja en [0.5, 0.616], 0,83 s los números; Sombra paralela + Transformar (sube de y 0,6536 a 0,5 y opacidad 1→100 en 0,2 s) + desvanecido final. La cifra sale del subtítulo.
- **Nunca una palabra clave sola**: si llega tarde, la línea sigue en V3 y la clave va en la pista de encima desde que se dice hasta el final del bloque. Bloques de menos de ~0,45 s se unen a la frase anterior.
- **Sonidos** (rutas exactas en su proyecto): Cinematic Click (Drive `06 Teclado y clics`) en cada palabra clave a 0,517; Data Collect (`09 Interfaz y avisos`) en cifras a 0,124; **Smooth Pop** (un solo pop) en emojis a 0,06. NO usar "Normal Pop.wav": son varios pops seguidos y parece que salen varios objetos.
- Él corrige cortes en la propuesta y deja la voz repartida en A1/A2 con solapes: trabajar en un clon y rehacer subtítulos sobre su corte actual (mapa pieza→bruto), sin tocar V1/A1/A2.
- **Bloques cortos (corrección 22-10-2026):** línea de 1–3 palabras + palabra clave naranja al final ("Seguramente haces / **ejercicio**", y "de" pasa al bloque siguiente). Nunca acabar un bloque en "de/la/que/y…". La partición automática sale troceada: escribir los bloques a mano (`línea|clave` por renglón) y alinearlos a los tiempos de palabra (receta en scratch `eric22/bloques-v3.txt`).
