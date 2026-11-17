---
name: clientes-y-carga-de-trabajo
description: The user's three video clients, daily volume, current time per reel, and the efficiency goal I'm helping with
metadata:
  type: project
---

As of 2026-11-06 Amin (@aminbusinesss) is the only active client (Eric and Natalia were dropped and archived). On 2026-10-08 each reel took the user 4–6 hours and they asked me to take over every mechanical step I can shorten and to help them control their time.

**Why:** 4 reels at 4–6 h each does not fit in a day.

**How to apply:** Default to doing the mechanical steps myself (first cut, subtitles, background, graphics from the client's template, voice levelling, QC) and hand over only taste decisions. Raws go in `~/Videos-Remotion/clientes/<cliente>/entrada/`. See [[video-tooling-setup]], [[user-video-editor]], [[communication-style]]. Per-client style templates were proposed but not yet agreed.

Update 2026-10-08: a reel is a folder, not a file (Amin usually sends one file). Raw footage arrives in ~/Downloads as Drive folders/zips. Single entry point `node ~/Videos-Remotion/sistema/reel.js` (see skill primer-corte).

2026-10-09 (corrected by the user): the 10+ "alternativas" built on Amin footage are formats for Instagram **Trial Reels** (testing variations), NOT Amin's brand format. Do not treat any of them as his template. He liked "3 Pantalla partida" and "2 Estudio cálido" and asks for repeats with new image sets (order sent = bad, good, bad, good, bad, good, then 3 closing images). To redo one: put images in `motion/public/amin/<set>/`, clone the version in `alternativas-datos.js` (versions 11, 12 are examples), build with `SOLO=<n>` and import into the open project in its own bin.

- Quiere la voz pasada por Adobe Podcast ("sale súper niquelada") y siempre muy por encima de la música (quedó la música unos 18 dB por debajo). La mejora de voz no se puede lanzar por script: es Sonido esencial > Diálogo > Mejorar voz, o subir el WAV a podcast.adobe.com/enhance y reconectar.
- Códigos de color: lo que quita el hambre / lo bueno en verde, lo que da hambre / lo malo en rojo (aunque su marca sea naranja).
- Títulos y subtítulos un poco más pequeños.
- Los gráficos nativos del usuario no se pueden reescribir por script, pero sí recolorear con el efecto "Tinción" (negro y blanco al mismo color) y bajar su "Resplandor de VR" para que se lean.

2026-10-10 (noche), AMIN_1010_01: el usuario recortó el vídeo (acaba en 108,27 s) y quitó la 2ª imagen (arrow_025406, EXITOSO). Pidió dos opciones, que quedaron como secuencias aparte en `AMIN EDICION.prproj` sin tocar `AMIN_1009_01 - SONIDO v2`: "AMIN_1010_01 - A sin motion graphics" y "AMIN_1010_01 - B motion graphics nuevos" (estilo Julián, imagen de Amin en espejo, 7 fotos distintas de `imagenes/v2/` con licencias en `fuentes.json`, subtítulos finos). Por "reviértela" quería decir voltear en espejo (lo confirmó al preguntarle). Interpretación mía: las variantes sirven para resubir el mismo vídeo sin que parezca igual ([[catalogo-formatos-trials]]).
