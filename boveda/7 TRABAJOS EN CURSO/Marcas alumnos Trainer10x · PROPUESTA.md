# Marcas por alumno de Trainer10x · PROPUESTA (14-11)

Estado: **APROBADA por Luis el 14-11** («Todo bien, pásalo»). Está en el motor real y en `main`: PR #10 de edicion-motor, merge `3384c8d`. Las fichas están en `luis/fichas/alumnos/`.

## Qué cambia en el motor (copia)
- `luis/fichas/alumnos/<cliente_id>.json` se funde encima de `alumno.json`. Si un alumno no tiene ficha propia, sigue la común.
- **Colores:** el editor sigue eligiendo «malo» (#E5322D) y «bueno» (#F5C542). El motor los cambia por los colores de la marca en:
  - las palabras clave;
  - los rótulos;
  - las comparaciones.
- **Fuentes:** subtítulo, palabra clave y rótulo (fuente principal + fuente de acento), por alumno.
- **Música:** una pista por alumno según su tono. Va baja y solo en los vídeos con voz.
- El alumno se pasa con `--cliente` en las pruebas y desde la cola en el servicio real.

## Principios que se aplicaron
- Vídeo simple: una fuente legible para el subtítulo y otra con carácter para la palabra clave.
- Dos colores de marca más el blanco. El color se usa solo en la idea que importa.
- El tono del nicho manda:
  - confianza → serif y dorado;
  - energía → condensada y colores vivos;
  - emoción → cursiva cálida.

## Propuesta por alumno
| Alumno | Tono | Subtítulo / clave | Malo / bueno | Música |
|---|---|---|---|---|
| Leo Fitness | fuerza en gimnasio | SF Pro / Anton | #FF3B30 / #00C2FF (cian, como su gimnasio azul) | The Racer |
| Jorge Robledo | TikTok informal | Poppins / Komet | #FF4D4D / #FFD60A | Trendsetter |
| Camilo Arias | ciclismo, técnico | Sequel Bold / Sequel Heavy | #FF5A36 / #C6FF00 (lima) | Night Drive |
| Eduardo Maluenga | experto, longevidad | SF Pro / Oswald | #E5484D / #2EC4B6 (turquesa salud) | Tethered to the Sky |
| Lorena Castaño | abogados, humano | SF Pro / Playfair cursiva | #C0392B / #D4AF37 (dorado) | Golden Hour (piano) |
| Marc Martínez | espalda, didáctico | SF Pro / Montserrat Black | #FF453A / #30D158 (alivio) | Hold You |
| Miguel Santos | fútbol | SF Pro / Bebas | #FF3B30 / #34C759 (césped) | Life in Rio |
| Miguel Á. Romero | padre a turnos, emocional | SF Pro / Nyght cursiva | #E5322D / #F2A541 (ámbar) | To Build a Home |
| Kevin Palacios | humor, POV | Poppins / Archivo Black | #FF3B5C / #2F5BFF (su azul) | Parisian Funk |
| Álvaro Cabrera | hábitos, cercano | SF Pro / Sequel Heavy | #FF5F57 / #3A86FF | 1901 |
| Paula Font | joven, tendencia | Poppins / SignPainter | #FF4D6D / #C77DFF (lila) | Luminary |
| María Morales | mamá fitness, elegante | SF Pro / Playfair cursiva | #D64545 / #F2A07B (coral) | Infinite Circles |

## Probado (plan de montaje escrito a mano: el Claude sin pantalla no tiene sesión)
- **Camilo:**
  - primera prueba: Akira se salía del ancho y no tiene tildes. Se cambió por Sequel y se repitió.
- **María:** Playfair coral, elegante y legible.
- **Kevin:** sus brutos ya vienen editados (texto blanco con caja azul). El motor quita nuestros subtítulos, así que su marca solo se nota en tarjetas y música. Su «bueno» pasa a ser su azul.
- **Lorena:** el vídeo que había es sin voz (solo música). No se ha probado su marca.

## Lecciones (propuestas, no reglas)
- **Akira Expanded no tiene tildes, ñ ni ¿¡.** No usarla en español. Las demás fuentes del pack sí las tienen (comprobado con fontTools).
- Algunos alumnos (Kevin, Jorge) ya editan sus brutos. En ellos la marca casi no se ve; habría que tomar sus colores de lo que ya hacen.

## No verificado
- Las marcas reales de cada alumno en su Instagram: los colores salen de sus vídeos y su nicho, no de su perfil.
- La música a oído (elegida por nombre y tono) y si alguna pista corta pasa a los 45 s.
- El titular de los vídeos sin voz sigue con la letra fija de la plantilla (no sigue la marca).
