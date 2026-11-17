---
name: direccion-viral
description: Dirección de edición pensada para retener y viralizar - gancho, estructura, ritmo, rótulos, sonido y CTA para reels (Amin, trials) y vídeos de YouTube (entrevistas callejeras). Usar cuando el usuario pida editar un vídeo completo, pensar como director, una propuesta completa, un vtrial o analizar por qué un vídeo funcionó.
---

> **Desde el 07-11-2026, antes de montar:** dirección creativa con el usuario (propuesta breve + 2–4 preguntas concretas + su aprobación + BRIEF CREATIVO en la bóveda). Ver director (`~/.claude/CLAUDE.md`, paso 2). Cada recurso necesita una función.
# Dirección y viralidad

## Prioridad de criterios
1. Referencias y vídeos del propio usuario (`~/.claude/projects/-Users-luiyi/memory/prioridad-referencias-del-usuario.md`).
2. Dirección de clientes: **natural, elegante, sencillo**, sin sobrecarga (`~/.claude/projects/-Users-luiyi/memory/direccion-edicion-natural-y-elegante.md`; regla vigente: FICHA de Amin n.º 2; cada vídeo, además, según su formato). Marca de cada cliente: skill **clientes**.
3. Recetas medidas en referencias: `~/.claude/skills/edicion-video/criterio.md` (secciones Sonido, Color y texturas, Motion graphics, @julianealborna, S Project). Leer SOLO la sección que haga falta.

## Flujo eficiente (pocas vueltas, pocos tokens)
1. Transcribir todo de una vez en segundo plano: `~/Videos-Remotion/voz/transcribir.sh <video>` (WhisperX + verificador) → `voz/salida-whisperx/<n>.verificada.json`; para cortes y sincronía solo palabras `fiable`. Respaldo: `transcribir.sh --respaldo <video> --idioma spanish`.
2. Leer la transcripción con tiempos (una línea por frase) y escribir el guion en una tabla breve: bloque · qué va · clips.
3. Plan en Python (`premiere/recetas/plan-video-entrevistas.py`): cortes ajustados al silencio entre palabras vecinas, subtítulos, rótulos, sfx, marcadores → JSON → `propuesta-yt.jsx` / `propuesta-hablado.jsx` (skill **premiere-puente**).
4. Fotogramas de control en 6–8 momentos clave, una sola hoja de contacto, corregir y entregar.
5. Si el bruto trae instrucciones del creador (p. ej. un clip "instrucciones para la edición"), cumplirlas.

## Reel hablado (9:16)
- Gancho 0–2 s: la frase más fuerte primero; título arriba con la marca.
- Subtítulos 1–4 palabras, palabra clave grande en color de marca; nada sobre la cara.
- Datos/fórmulas arriba como rótulo; si el rótulo ya lo dice, quitar el subtítulo que repite la operación (dejar el resultado).
- Imágenes de apoyo en cuadrícula 2×2 con línea blanca; provocadoras/conceptuales, no stock (`~/.claude/projects/-Users-luiyi/memory/imagenes-que-retienen-pinterest.md`).
- Comparativas: malo en rojo, bueno en verde; columnas alineadas al cuerpo; versión sin líneas con difuminado.
- CTA final con caja de marca + emoji + pop. Música de la referencia del cliente.

## YouTube entrevistas callejeras (16:9) — receta probada
- **Gancho 10–20 s**: 3–4 frases punch de distintos entrevistados (cifra sorprendente, consejo potente, una de humor).
- **Intro**: dónde y por qué (dato llamativo), el reto ("me van a rechazar mil veces").
- **Montaje de rechazos** rápido con contador "RECHAZO #n" + sonido de error; cerrar con "no me voy a rendir" + golpe grave → empatía y humor.
- **Bloques por entrevistado = una LECCIÓN** con rótulo ("LECCIÓN 1 · ARRIESGA"), nombre/rol en rótulo, cifras en rótulo de dato + sonido de dinero. Comentario del creador tras cada uno.
- Quitar lo que reste autoridad ("aún no soy rico/a"), muletillas y saludos; zoom 108–118 % en frases fuertes.
- **Cierre**: resumen + esperanza ("cualquiera puede") + suscríbete.
- Subtítulos: estilo del usuario si ya empezó alguno (copiarlo exacto: color por hablante, minúsculas, frase completa).

## Sonido
- Whoosh entre bloques, pop en rótulos, riser + impacto antes del título, música −20/−24 dB bajo voz; en vídeo largo música en bucle con fundido (`acrossfade`).
- Efectos ordenados: `~/EDICION/2 MATERIALES DE EDICION/Efectos de sonido/RECURSOS DE EDICIÓN (en Drive)/EFECTOS DE SONIDO/<01 Whooshes…10 Varios>`.
- Yo no oigo: decir siempre que los tipos de sonido salen de medidas.

## Amin: trials y vtrials
- Catálogo de formatos: `~/.claude/projects/-Users-luiyi/memory/catalogo-formatos-trials.md`; componentes `motion/src/Trials6118.tsx`, `VtrialReticula.tsx`. A Amin solo marcadores y recursos en su timeline.
