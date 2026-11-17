# Emaús 05 · El obispo — ESTADO (10-11-2026)

**Proyecto:** `3 PROYECTOS/Lotes de edición/emaus.prproj` · secuencia **«Emaús · 05 El obispo (vertical)»** (corte de Luis, 58,7 s).
**Guía:** `1 CLIENTES/EMAUS/Documentos/Guía de contenido Emaús - noviembre 2026 (2).docx` (nº 5, publicar mié 11-11).
**Paso:** propuesta (subtítulos, SFX, zooms) montada; falta el estilo de los subtítulos (Luis) y el QC final.

## Decisiones aprobadas (10-11)
- Música: Sanctuary.mp3 (A7, −18 dB, fundido de salida en los 2 últimos s).
- Subtítulos: frase en **Sequel** (blanco) + palabra clave en **Noteworthy** (amarillo), estilo del Mensaje 2.
- Las frases dudosas (33,5–38,4 s y 47,2–48,0 s) las subtitula Luis.

## Hecho por Claude (todo en pistas nuevas; V1–V4/A1 de Luis sin tocar)
- A4–A6: whoosh de entrada 0,0 · aire 2,57 · golpe 4,52 (obispo) · riser 10,03→«falso» 13,96 · golpe + brillo 30,6 (giro «vestidos de obispo») · whoosh 37,9 (mesa). Bandeja «SFX 05 obispo (Claude)».
- Zooms con claves en la escala de Movimiento: 5 b-rolls a 100→110 % (mesa 290→304,5).
- 2 pistas de subtítulos desde `Emaús/Subtítulos/05 El obispo v2 · frase (Sequel).srt` y `· clave (Noteworthy).srt` (transcripción WhisperX verificada sobre el corte).

## QC
- Sincronía SFX medida con earshot: 5/6 a < 40 ms, el golpe del giro a −37 ms. Mezcla −19,3 LUFS, pico −1,4 dBTP, sin recortes.
- Zoom leído (100/105/110) y visto en fotogramas. Subtítulos vistos en fotogramas, todavía sin estilo y con las dos pistas solapadas.
- NO VERIFICADO: el balance de la música frente a la voz, escuchado por Luis; la colocación final de los subtítulos.

## Subtítulos (10-11, tarde)
- Luis los pasó a gráfico (V5 frase Sequel blanco ×21, V6 clave Noteworthy amarillo ×9) y puso fuente y color. El texto de un gráfico nativo sigue sin poder leerse ni escribirse por script.
- Claude: «Movimiento del vector» con anclaje (0,5; 0,94), frase en y = 0,72 y clave en y = 0,765 al 130 %; entrada con opacidad de 0 a 100 en 3 f y «pop» de la clave (70 → 108 → 100 % en 5 f). Visto en fotogramas.

## Traspaso
Luis escribe las 2 frases dudosas (33,5 y 47,2 s) en V5. Después: QC final y exportación.
- Error mío corregido (10-11): `sfx-colocar.jsx` con `dur` solo cambiaba `end` y dejaba `outPoint` al final del archivo, así que el clip no se podía alargar. Arreglado en Sanctuary (A7) y en el golpe de 4,52 (A5). Hay que corregir la receta.
- Sombra paralela en los 30 subtítulos (negra, opacidad 165/255, 180°, distancia 3, suavizado 18). Vista sobre el plano aéreo, la casulla y el padre: se lee bien.
