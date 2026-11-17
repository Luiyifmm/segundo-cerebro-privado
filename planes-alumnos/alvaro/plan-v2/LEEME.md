# Álvaro · plan v2 (16-11-2026) · SIN CONSTRUIR, pendiente de tu sí

**Modo:** entrenamiento (vídeo de un alumno, en copia). **Skills usadas:** editor-maestro (pasos 1–3), criterio (banco consultado). Sin cargar aún: real-sfx (toca en el paso de sonido).
**Formato:** sketch de humor con dos personajes del mismo actor. **No hay formato escrito para esto** en la biblioteca: uso el acabado del estilo minimal y las referencias de abajo.
**Tiempos:** los de la reedición v1 (19,1 s). «¿Lunes? Nada de pan» lo puse a mano: la transcripción no lo cogió.

## Qué cambia frente a la v1 (tus correcciones)
| Tu corrección | Qué hago | Referencia |
|---|---|---|
| Cuadrados tipo UI de Apple con los días | 4 pestañas de cristal arriba: la del día en blanco, las otras translúcidas | c088 · Miro ANIMACIONES (WEEK 1 · 2 · 3) |
| Del cuaderno sale el pan en pantalla tipo VR con prohibido y va a su día | Ventana flotante de cristal que sale del cuaderno, 0,7 s, y vuela a la pestaña | c084 · Miro («20 % body fat», panel flotante) |
| B-roll fuera de la estética | Se quita la pintura; martes y miércoles repiten la mecánica del lunes | c107 (el b-roll lleva la marca) |
| Empezar con zoom out + sonido | Zoom out + enfoque en 0,25 s con golpe grave y whoosh; música desde el fotograma 0 | c112 · favoritas r22, r23, r25 |
| Cortes en J y en L | 4 cortes en J (cada «¿día?» y la nevera) y 1 en L (la queja del martes) | Sin referencia medida: es tu regla L1 |
| Zoom en «¿pero qué haces?» | Zoom de golpe al entrenador + el ✓ del jueves se rompe | Tu regla L8 |
| Música según la emoción, mejores efectos | 3 músicas de 10 s (emoción: cómplice y pícara, que suba en el remate); efectos con la skill real-sfx | editor-maestro paso 7 |

## Lo que se mantiene de la v1
Superposición de los dos personajes (c076), letras SF Pro + Sequel Heavy, rojo #FF5F57 y azul #3A86FF, zoom en «¿cómo me voy a poner?», «NO» grande.

## Preguntas (solo lo que no puedo deducir)
1. **Imagen dentro de la ventana:** ¿el objeto real recortado del plano (el baguette, el croissant, la manzana) o un icono 3D? Recomiendo el objeto real: es de la escena y no hay que buscar nada. Para «salir a cenar» no hay objeto: iría un plato con cubiertos dibujado.
2. **Cocina:** ¿la dejo sin texto (más corta) o añado una píldora de cristal con la hora, «Jueves · 23:47»? Es idea mía, no del guion.
3. **Final:** ¿botón «Seguir» o la barra de comentario con palabra clave de tu Miro (c095)? El alumno no pidió palabra clave.

## Siguiente paso si apruebas
Paso 5: un fotograma de diseño por escena (pestañas, ventana flotante saliendo del cuaderno, remate) sobre fotogramas reales. No animo nada hasta que los veas.

## No comprobado
- Que la ventana «salga del cuaderno» quede bien: el cuaderno se mueve; hay que verlo en el fotograma de diseño.
- Los cortes en J dependen de que el audio de cada toma tenga aire antes de la frase.

---
## Actualización 16-11 · decisiones de Luis y montaje v2
- **Aprobado por Luis:** plan v2 → diseño (2.ª versión) → prueba del gancho → «haz el resto».
- **Correcciones al diseño:** las imágenes son de FUERA del vídeo (emojis del sistema), nunca recortes del plano; los días son 4 cuadrados de cristal y lo dicho acaba dentro de su cuadrado (propuestas 16-11-L9 y L10).
- **Sin respuesta de Luis, decidido por mí:** cocina sin texto; final con botón «Seguir».
- **Montaje:** `montaje_v2.py` (pasos base · anim · audio · final · musica). 477 fotogramas = 15,9 s (la v1 duraba 19,1 s).
  - Se quita el aire muerto antes de cada «¿día?» (0,4 s en martes, 1,0 s en miércoles, 0,4 s en jueves), la cocina baja de 2,5 a 1,6 s y el remate empieza 0,5 s más tarde.
  - **Corte en J** en martes y jueves: la voz «¿Martes?» / «¿Jueves?» empieza 4–6 fotogramas antes del cambio de plano. En miércoles NO: chocaría con el final de «¿cómo me voy a poner?». El corte en L previsto no se hizo.
  - Efectos: todos de `editing luiyi pack/Efectos de sonido/00 FAVORITOS`, colocados por su punto de golpe medido.
  - Música: 3 muestras sobre el vídeo entero (1901, Play That Funky Music, Rapp Snitch Knishes), desde el arranque de cada canción. Son temas comerciales: en Instagram conviene añadirlos desde la app.

- **Música elegida por Luis (16-11): A · 1901.** Entrega: `MEDIA/Álvaro Cabrera/Álvaro - v2 ENTREGA (música 1901).mp4`.
