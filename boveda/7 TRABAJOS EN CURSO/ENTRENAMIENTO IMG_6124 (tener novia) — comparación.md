---
tipo: estado
trabajo: ENTRENAMIENTO-6124
cliente: amin
actualizado: 2026-11-07
---
# Entrenamiento · IMG_6124 · "¿Tener novia? De pobre": mi propuesta frente a tu edición

**Material:**
- bruto `BRUTOS/PENDIENTES/IMG_6124.MOV`;
- guion "¿Tener novia? De pobre" (`guiones.txt`, línea 634);
- tu edición final `EXPORTADOS/tener novia_1.mp4` (35,3 s), que **no se miró hasta terminar la mía**.

**Propuesta reproducible** (proyecto de pruebas, nada real):
- `3 PROYECTOS/_PRUEBAS CLAUDE/entrenamiento-6127/Entrenamiento 6127 Claude.prproj` › secuencia "ENTRENAMIENTO 6124 · propuesta Claude v1";
- exportada como `_PRUEBAS CLAUDE/entrenamiento-6124/propuesta Claude v1.1.mp4` (33,8 s).

**Fuentes editables** en `~/Videos-Remotion/clientes/amin/entrenamiento-6124/`:
- `tomas.json` (tomas elegidas);
- `edl.json` y `tramos.json` (cortes);
- `subtitulos.txt` (bloques escritos a mano) y `subtitulos.json` (alineados);
- `montaje.palabras.json`;
- iconos en `hyperframes/entrenamiento-6124-costes/`.

> Primero intenté con IMG_6127 ("dar like a otras mujeres", también montado y exportado). Pero tu `EXPORTADOS/IMG_6127.mp4` resultó ser de **otro bruto** (IMG_6132), y de "dar like" no hay edición tuya en local. Ver § Errores.

## QC técnico (automático)
| Comprobación | Resultado |
|---|---|
| Cortes con voz / palabras cortadas | ✅ ninguna palabra cortada; 9 uniones en habla continua para escuchar |
| Prueba del corte (audio del montaje transcrito de nuevo) | ✅ 112/112 palabras; "ruinado" es pronunciación de Amin |
| Colisiones (cara, subtítulos leídos del fotograma, bandas) | ✅ limpio, 86/86 fotogramas con cara |
| Sincronía iconos-palabra | ⚠️ NO VERIFICADA a ±2 f (palabras pegadas); estimado −0,8 / −1,2 / −1,4 f con WhisperX |
| Volumen | ✅ −15,3 LUFS, pico −2,4 dBTP |
| Errores técnicos que encontré y corregí antes de entregar | Subtítulo "dolores de cabeza" fuera de pantalla · espejo que Premiere no aplicó sin dar error · (en 6127) voz a −30,8 LUFS, halo azul en claves, overlay de seguir con fondo negro |

## QC creativo (mío)
1. **Idea:** clara, pero la diluyo. Mantengo los tres costes y "Atento"; tu edición se queda con lo más fuerte.
2. **Redundancia:** los iconos no repiten el subtítulo (bien), pero aportan poco. El de "dolor de cabeza" parece un despertador y el billete de la cartera no se ve.
3. **Lectura:** buena; subtítulos dentro de la pantalla tras corregir uno.
4. **Ritmo:** demasiado continuo, sin respiraciones ni golpes. Todo va al mismo tempo.
5. **Estilo:** marca correcta (azul, SF Pro), pero no es el estilo que usas en Amin ahora (ver comparación).
6. **Cortes:** limpios.
7. **Sonido:** correcto pero plano; sin música (la ficha dice "solo si él la elige").
8. **Lo que haría un editor top:** quitar los dos costes débiles y dar al vídeo golpes visuales (imagen o pausa) en las frases duras.

## Comparación con tu edición
### Decisiones iguales
- **Tomas:** en 9 de los 11 bloques elegimos la **misma toma** del bruto: gancho, pregunta, respuesta, dolores de cabeza, restaurantes, intimidad, perdedor arrastrado, moraleja y cima / mujer de valor.
- Estructura gancho → pregunta → respuesta → costes → moraleja → CTA.
- Amin a cámara todo el vídeo, sin cambio de fondo.

### Lo que hiciste tú y yo no
1. **Quitaste contenido:** "Atento", el coste 1 (tiempo y foco) y el coste 2 (dinero y cartera). Te quedas con un solo coste fuerte ("dolores de cabeza") antes del remate. Es más directo.
2. **Golpes en blanco y negro con 💀:**
   - tras las frases duras ("de pobre", "está arruinado", "intimidad", "perdedor arrastrado", "imperio", final) pasas a blanco y negro, con viñeta arriba y un emoji 💀 en el pecho, durante ≈1 s;
   - es el recurso que da ritmo y humor al vídeo;
   - son unos 10 cortes de imagen en 35 s; yo, 4 cambios de encuadre.
3. **Imágenes reales en tarjetas pequeñas redondeadas que ilustran lo que se dice:**
   - una chica arriba a la izquierda en "tener novia" y una X roja en "de pobre";
   - un restaurante, una cita, una vista de lujo y una pareja sobre el pecho.

   Yo usé iconos dibujados.
4. **Subtítulos pequeños, de una línea, con la palabra clave coloreada dentro de la línea:**
   - **rojo para lo negativo** ("pobre", "perdedor") y **azul para el resto** ("novia", "mendigar", "intimidad");
   - yo usé la clave grande debajo y siempre en azul, que es lo que dice la ficha.
5. **Encuadre más cerrado y más alto:** la cara se ve más grande. Mi 135 % fue corto.
6. **CTA:** elegiste la variante "Sígueme **para ser un ganador**" (más fuerte); yo seguí el guion ("para mejorar tu vida").
7. **Música** de fondo con mucho grave.

### Lo que añadí sin necesidad
- Los iconos de coste (no aportan frente a imágenes reales).
- El espejo en la pregunta: idea defendible, pero tú no lo necesitaste.
- El overlay de seguir.
- Pops y whoosh: correctos, pero sin los golpes visuales a los que acompañar.

### Mis cortes: mejores o peores
- **Iguales en la elección de tomas.**
- **Peores en ritmo:** los míos son un "chorizo" continuo de 33 s con más contenido; los tuyos respiran.
- **Mejor técnicamente en un punto:** tu exportación **satura** (−6,4 LUFS, pico +2,8 dBTP, **150.738 muestras recortadas**), seguramente por la música. La mía está en −15,3 LUFS, pico −2,4.

### Errores técnicos frente a errores de criterio
| Técnicos (míos) | De criterio (míos) |
|---|---|
| Elegir el vídeo por el nombre del archivo sin comprobar el contenido | Mantener puntos débiles (dos costes y "Atento") |
| Voz sin nivelar en el primer intento (6127) | Ritmo sin respiraciones ni golpes |
| Halo azul en claves (contra la ficha) | Iconos dibujados donde hacían falta imágenes |
| Overlay sin transparencia | Encuadre demasiado abierto |
| Subtítulo fuera de pantalla | Seguir el texto del guion en el CTA cuando el bruto tenía una variante mejor |
| Espejo no aplicado (fallo silencioso de Premiere) | No conocer tu uso actual del rojo y de los subtítulos pequeños |

## Lecciones propuestas (PENDIENTES; ver `4 ENTRENAMIENTO/PROPUESTAS DE REGLAS.md`)
Resumen: recortar los puntos débiles de una lista; golpes en blanco y negro con 💀 tras frases duras; rojo para lo negativo; subtítulos pequeños de una línea; encuadre más cerrado; imágenes reales en tarjetas; preferir la variante más fuerte del bruto en el CTA; limitador a −1 dBTP en la mezcla final; identificar el bruto por contenido, no por nombre.
