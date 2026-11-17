---
name: premiere-puente
description: Manejar Premiere Pro del usuario por script (puente MCP + ExtendScript) - montar secuencias desde brutos, subtítulos y rótulos con MOGRT, efectos, color, sfx, marcadores y fotogramas de control. Usar siempre que haya que tocar un proyecto o secuencia de Premiere.
---
# Premiere por script — guía corta

## Conexión
- Ejecutar: `~/Videos-Remotion/premiere/pr.sh <archivo.jsx> <segundos>` (máx. 590). Leer solo la línea `result` (`| grep result`).
- Si responde "sin respuesta del puente": `verify_premiere_connection(launchIfNeeded:false)`; si pide acción → decir al usuario "Ventana > Extensiones > MCP Bridge" y PARAR.
- Si un script falla con "CEP evalScript()": casi siempre falló `app.project.save()` o `exportFramePNG` al final. Comprobar el estado con un script de lectura antes de repetir (puede haberse aplicado ya).

## Antes de tocar nada
1. Leer la secuencia activa (pistas, clips, in/out). El usuario edita a la vez: reorganiza pistas, borra clips. Identificar clips por NOMBRE de archivo, no por número de pista.
2. Secuencia del usuario = intocable; trabajar en secuencia nueva o en pista vacía nueva. Desactivar (`clip.disabled = true`), no borrar.
3. `seq.clone()` CAMBIA la secuencia activa a la copia: renombrar la copia "RESPALDO …" y volver a abrir la original con `app.project.openSequence(id)`.
4. Exportar fotogramas de control y MIRARLOS antes de dar algo por hecho.

## Patrones (ExtendScript)
- Tiempo: ticks = s × 254016000000. `function seg(x){var y=new Time();y.seconds=x;return y;}`
- Montar tomas: `item.setInPoint(a,4); item.setOutPoint(b,4); track.overwriteClip(item, t)`; luego `clearInPoint/OutPoint`.
- MOGRT: `seq.importMGT(ruta, ticks, pistaV, 0)`, luego `clip.end` y `outPoint`. Texto: `JSON.parse(p.getValue())` → `textEditValue` + `fontTextRunLength=[len]` → `p.setValue(JSON.stringify(j), true)`. Color: `p.setColorValue(255,r,g,b,true)`. Duran máx. 30 s (más → partir).
- Filtrar MOGRT por `clip.projectItem.name` (nombre de plantilla) + pista. NUNCA por nombre de propiedad: otras plantillas comparten nombres y se pisan.
- Efectos (QE): `app.enableQE(); qe.project.getVideoEffectByName("…")` y `qeItem.addVideoEffect(fx)` buscando el item QE por `start.secs`. Nombres en español: "Color de Lumetri", "Volteado horizontal", "Rellenar derecha con izquierda", "Sombra paralela", "Barrido lineal (heredado)". `removeEffects()` no quita Lumetri: dejarlo neutro.
- Movimiento (props): 0 posición (normalizada), 1 escala, 4 rotación, 7–10 recorte izq/arriba/der/abajo (%).
- Lumetri (índices): 14 temp, 16 saturación, 19 exposición, 20 contraste, 21 resaltados, 22 sombras, 23 blancos, 24 negros, 41 nitidez, 42 intensidad.
- Pistas: `qe…addTracks(nV, despuésDe, 0)`; audio `addTracks(0,0,n,1,después)`.
- Fotograma: `qe.project.getActiveSequence().exportFramePNG(q.CTI.timecode, ruta)` tras `seq.setPlayerPosition(ticks)`. Da caché si se repite en el mismo script.
- Marcadores: `m = seq.markers.createMarker(s); m.name=…; m.end = s2` (números, no Time).
- Velocidad: `qeClip.setSpeed(v,"",false,mantenerTono,true)`; NO meter voz+sfx en un clip anidado acelerado.

## Texto nativo (Gráficos esenciales) — NO se puede escribir por script
- `Texto de origen` de un gráfico nativo devuelve 1 carácter interno: no se puede leer ni cambiar el texto. Si el usuario quiere subtítulos nativos con SUS estilos (nada de After Effects): generar un .srt por estilo/color, `app.project.importFiles([srt])` + `seq.createCaptionTrack(item, 0, Sequence.CAPTION_FORMAT_SUBTITLE)` → una pista de subtítulos por estilo; el usuario aplica su estilo a cada pista y, si los quiere como gráficos, "Actualizar subtítulo a gráfico". Ejemplo: `clientes/clientee/ricos/subtitulos/`.

## Recetas listas (`~/Videos-Remotion/premiere/`)
- **Reels de cliente (lo más rápido, 2026-10-17):** ficha JSON por vídeo → `recetas/plan-reel.py ficha.json cfg.json` (tomas por frase `"desde la frase"`→`"hasta#n"`, parte en pausas >0,8 s, canal de voz automático, HDR solo a clips HLG, subtítulos con palabra clave solo al final del bloque, rótulos/imágenes/apoyos anclados a frases, capa Remotion opcional `overlay` = `Ranking`) → `propuesta-reel2.jsx` (sustituir `__CFG__`). Fichas de ejemplo: `clientes/lote1017/fichas/` (N06 apoyos+imágenes, N10 orden cambiado, E19 ranking, E07 lista a la derecha). Subtítulos en pista por encima de los apoyos (`pistaSubs: 2`, apoyos en pista 1). Emojis PNG de 320 px → escala ~270 en secuencia 4K.
- `propuesta-hablado.jsx` (vertical, iPhone) y `propuesta-yt.jsx` (horizontal, zoom por pieza, `rellenar:false`): reemplazar `__CFG__` por el JSON del plan.
- `recetas/plan-video-entrevistas.py`: de transcripciones a plan (cortes ajustados al silencio entre palabras vecinas, subtítulos con palabra clave, rótulos, sfx, marcadores). Cambiar rutas `R`.
- `recetas/subtitulos-por-tandas.jsx` (>120 MOGRT → tandas de 120), `recetas/subtitulos-frase-dos-colores.jsx` (frase completa, hablante en dos colores).
- `recetas/columnas-difuminado.jsx` (columnas fundidas con barrido lineal), `recetas/lumetri-hdr-iphone.jsx`, `recetas/restaurar-textos-desde-cfg.jsx`.
- Plantillas MOGRT y tamaños: skill **clientes**. Color/HDR: skill **color-hdr**.

## Audio
- Brutos iPhone: voz solo en canal izquierdo → un clip por corte en A1 + "Rellenar derecha con izquierda". Cámara Canon: dos canales, no rellenar.
- No meter la voz/música del usuario sin preguntar; no tocar sfx si pide "quitar arreglos de audio".
