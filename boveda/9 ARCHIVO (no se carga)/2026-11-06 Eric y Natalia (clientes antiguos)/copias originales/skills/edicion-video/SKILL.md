---
name: edicion-video
description: Motion graphics y apoyo de edición de vídeo para el usuario (editor profesional en Premiere). Usar cuando pida animaciones, títulos, motion graphics, gráficos explicativos, subtítulos animados, cortar silencios, cambiar fondos, analizar reels/vídeos de referencia, o trabajar con Remotion, After Effects o Premiere.
---

# Edición de vídeo y motion graphics

El usuario es editor profesional en Premiere. Quiere delegar todo lo automatizable y hacer solo lo que yo no pueda. Todo gratis salvo Adobe, que ya paga. Responder siempre corto, por puntos, en español.

## Herramientas en este Mac

- Node: `export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"` antes de cualquier comando (no está en el PATH de las shells de herramienta).
- Remotion: `~/Videos-Remotion/motion`. Composiciones en `src/`, registradas en `src/Root.tsx`.
  - Entrega para Premiere (alfa): `npm run render -- <Id> out/<nombre>.mov` (ProRes 4444).
  - Vista rápida: `npm run preview -- <Id> out/<nombre>.mp4`, luego `open -a "QuickTime Player"`.
  - Fotograma suelto para revisar: `npx remotion still src/index.ts <Id> out/f.jpg --frame N --image-format jpeg`.
- After Effects 2026: `~/Videos-Remotion/ae/run.sh script.jsx`. El script debe escribir su resultado en `ae/resultado.txt` (DoScript devuelve 0). Envolver en `app.beginUndoGroup`.
- Premiere 2026: MCP `premiere-pro` (comunidad, panel "MCP Bridge (CEP)", carpeta `/tmp/premiere-mcp-bridge`). El usuario tiene que abrir el panel y pulsar Start Bridge en cada sesión.
- `ffmpeg`, `ffprobe`, `yt-dlp` en `~/.local/bin`. YouTube solo funciona con `--extractor-args "youtube:player_client=android_vr"`.
- No hay Python ni Homebrew; `python3` y `git` abren un diálogo de instalación de Xcode. No usarlos.

## Analizar una referencia (reel o vídeo)

1. `yt-dlp -o "ig-%(id)s.%(ext)s" --write-info-json <url>` en `~/Videos-Remotion/referencias`.
2. Hoja de fotogramas: `ffmpeg -i X.mp4 -vf "fps=2,scale=270:-2,drawtext=text='%{pts\:hms}':x=4:y=4:fontsize=18:fontcolor=yellow:box=1:boxcolor=black@0.7,tile=6x3" -q:v 5 hojas/X-%02d.jpg` (fps=1 si dura más de 30 s). Leer las hojas con Read.
3. YouTube: bajar solo subtítulos (`--skip-download --write-auto-subs --sub-langs es`) y pasar `referencias/vtt2txt.js`.
4. Anotar: paleta, tipografías, ritmo de cambio de escena, tipo de entrada/salida, elementos recurrentes.

## Estilos aprendidos de las referencias del usuario

**A. Showreel de "motion designer" (MotionLove, Gael Troncoso)** — lo que más le interesa.
- Fondo casi negro con rejilla fina y marcas HUD pequeñas en las esquinas (texto mono diminuto, numeración de escena).
- Un solo color de acento (naranja/rojo) con resplandor; blanco para el texto principal.
- Tipografía cinética: palabra clave enorme en sans extra negrita, subtítulo en serif cursiva pequeña ("CLAUDE." + "motion designer"). Una idea por pantalla.
- Escenas de 1 a 2,5 s. Cambios bruscos de color de fondo (negro, naranja pleno, blanco, azul eléctrico) como transición.
- Repertorio: línea que se abre desde el centro, texto que se revela con máscara, contador de porcentaje con barras y anillo, partículas/campos de flujo, rejilla 3D ondulada, tarjeta de interfaz con interruptores, formas que se funden (metaballs), curva de easing dibujándose, cajas conectadas por líneas como diagrama de flujo, texto tecleado con cursor, desenfoque de movimiento en las transiciones.
- Cierra con logo + lema, todo centrado.

**B. Glosario con tarjeta (Wallsframe)** — busto parlante con fondo oscuro desenfocado; término en serif grande arriba, cambia cada 0,5 a 1 s; abajo una tarjeta blanca redondeada con un mini diagrama distinto por término; subtítulos serif pequeños al centro.

**C. Tutorial con capturas (Santiago Clavijo)** — fondo de rejilla con degradado dorado; captura de pantalla en tarjeta redondeada con brillo, entra inclinada en 3D; orador recortado en círculo con halo; subtítulo de 1 a 3 palabras en píldora negra bajo el círculo; URL escrita arriba; flechas blancas señalando; transición de fuga de luz naranja.

**D. Pizarra explicativa (Juan Carrizo)** — diagrama blanco de trazo negro dentro de un formato vertical con bandas negras; orador recortado que se mueve y cambia de tamaño según la zona del diagrama de la que habla; zoom al detalle; subtítulos pequeños blancos abajo.

Reglas comunes: una idea por pantalla, algo cambia cada 1 a 2 s, texto sincronizado con la voz, entradas con muelle (spring) y salidas rápidas, máximo dos familias tipográficas y un acento.

## Hacerlo mejor que las referencias

- Easing siempre: `spring` para entradas, `Easing.bezier(0.16,1,0.3,1)` para movimientos; nunca lineal.
- Escalonar elementos 2 a 4 fotogramas entre sí; no todo a la vez.
- Movimiento secundario: algo sutil sigue vivo cuando el texto ya está quieto (rejilla que deriva, resplandor que respira).
- Márgenes seguros en 9:16: nada importante en el 12 % superior ni el 20 % inferior (interfaz de Instagram).
- Texto legible en móvil: titulares de 120 px o más en 1080×1920.
- Revisar fotogramas sueltos de cada escena antes de entregar; comprobar que nada se corta ni se solapa.
- Preguntar o deducir del vídeo del cliente: paleta, fuente y formato, y mantenerlos en todo el paquete.

## Flujos de trabajo

**Motion graphic suelto** — Remotion, composición nueva, render con alfa, el usuario lo arrastra a Premiere. Si necesita retocarlo a mano, construirlo en After Effects por script.

**Cortar silencios** — `ffmpeg -i in.mp4 -af silencedetect=noise=-35dB:d=0.4 -f null -` da los tramos; con eso, o cortar en Premiere por el MCP, o generar el vídeo ya cortado con ffmpeg. Dejar 0,1 s de aire a cada lado. Confirmar umbral con el usuario en el primer vídeo.

**Cambiar el fondo con IA (método del reel de Santiago Clavijo)**
1. Sacar un fotograma del vídeo.
2. Generar el fondo nuevo con un generador de imágenes (él usa Nano Banana Pro vía insMind) con este prompt: "Con base en la iluminación del personaje y la escena, crea un fondo profesional oscuro donde se vea [una planta elegante a la izquierda, estantería…], con profundidad de mínimo 4 metros para que el personaje no parezca pegado a la pared. Elimina al personaje." Formato 9:16, 4K.
3. Recortar a la persona del vídeo: él usa app.beeble.ai > Background Remover (modelo MatAnyone) y descarga el RGBA. Alternativa ya pagada: Roto Brush en After Effects o máscara de objeto en Premiere.
4. En Premiere: fondo generado abajo, RGBA encima, capa de ajuste de color arriba para igualar.
- Yo no puedo generar la imagen ni hacer el recorte; sí escribir el prompt, sacar el fotograma y montar la composición.

**Vídeo sin cara (método del editor de Mario Ruiz)** — limpiar voz con Adobe Podcast Enhance; cortar errores; convertir cada frase del guion en palabras clave en inglés para buscar stock; numerar los recursos en el orden del guion; montar el cuerpo primero y la intro al final con los mejores planos; animar fotos con zoom lento; texto en pantalla para cifras y nombres propios; música a unos -25 dB, cambiando de tema en cada cambio de sección.

## Qué tiene que hacer el usuario (no puedo yo)

- Abrir el panel de Premiere y pulsar Start Bridge.
- Generar imágenes o voces con IA de terceros.
- Recorte de personas (rotoscopia).
- Decisiones de gusto: aprobar estilo, ritmo y color.

## Marca Amin Business (@aminbusinesss)

- Color de marca: azul. Overlay de "seguir" ya hecho: `~/Downloads/files/overlay_seguir_ig_aminbusinesss.mov`.
- Brutos: `~/Downloads/Video raw amine/` (iPhone 4K vertical, 30 fps) y `~/Downloads/IMG_6131.MOV`. Proyecto: `~/Documents/Adobe/Premiere Pro/26.0/Amin.prproj`. Editado de referencia: `IMG_6127.mp4` en esa carpeta.
- Estilo actual del usuario: busto sentado en sillón, vertical; imágenes de apoyo como tarjetas pequeñas arriba que se van acumulando de izquierda a derecha (1 a 3 por idea); subtítulos blancos SF Pro Bold pequeños, 1 a 3 palabras, centrados sobre el pecho; overlay de seguir al final. En el proyecto nuevo cambia el fondo por una pintura clásica.
- Otros clientes en el Mac: Erick (`Video raw eric`, `erikk.prproj`), Natalia (nutrición, `Hicha vs desinflama`).

## Más estilos de referencia

**E. Subtítulos de énfasis (wolfofwallst)** — busto con micrófono; frase en dos líneas, la primera blanca fina y la segunda amarilla en negrita cursiva; palabras clave sueltas en mayúsculas cursivas; numeración "1 SOLUTIONS" con el número en amarillo; iconos en cajas de borde punteado que se acumulan arriba; símbolos grandes con brillo detrás de la cabeza (la persona recortada por delante).

**F. Explicativo claro (ai.nxtlvl)** — fondo crema con rejilla y manchas de degradado suave; tarjetas blancas redondeadas con interfaz simulada; título en sans con una palabra en serif cursiva de color; etiqueta tipo comando en píldora negra; subtítulo abajo con la palabra activa en caja de color; pantallas de color pleno con número gigante para los datos.

**G. Anuncio de producto (riki.bosso)** — fondo negro, producto 3D con contornos de neón, texto mínimo ("Not so fast."), una palabra por plano.

## Cambiar fondo sin apps externas (probado)

`cd ~/Videos-Remotion/fondo && node recortar.js <video> <fondo.jpg> <salida> [--inicio s] [--duracion s] [--alfa]`
- IA local (Robust Video Matting), unos 14 fotogramas por segundo a 1080×1920. `--alfa` da un ProRes 4444 transparente para Premiere.
- Recorta solo a la persona: el sillón y los objetos desaparecen. Si hay que conservar el sillón, hacer la máscara en Premiere.
- Solo hace falta el clip y la imagen de fondo.

## Premiere sin recargar la sesión

El puente funciona por archivos: escribir `/tmp/premiere-mcp-bridge/command-<id>.json` con `{"id","script"}` (ExtendScript; escribir como `.part` y renombrar) y leer `response-<id>.json`. Sirve aunque las herramientas MCP no estén cargadas.

## Oír el sonido: earshot, Real SFX y Openverse (instalados 2026-10-30, guía Trescendit)
Yo no oigo. Desde ahora no digo cómo suena algo sin una medida de earshot, y cito el número ("−14,2 LUFS", "match strong z +3,9").
- **earshot** (MCP `earshot`, código y modelos en `~/Videos-Remotion/herramientas/earshot`, Python 3.12 en `.venv`; skill `earshot`). Corre en local, sin subir audio. NUNCA usar `llm` (Gemini): sube el audio y necesita clave. Usos en nuestro flujo:
  - `measure` de la exportación: LUFS y pico verdadero. Complementa `voz/qc.js`.
  - `timeline` / `sheet` de un reel exportado: qué suena cuándo y si los efectos caen en el corte. Comprobar los sonidos tras moverlos.
  - `rank` / `match` / `describe` para elegir entre candidatos de la biblioteca ("a deep soft whoosh") antes de ponerlos en Premiere.
  - `find` para recortar el mejor trozo de una grabación larga.
  - `critique` como segunda opinión; su perfil es de anuncios de producto, no de reels hablados: no aplicar sus cifras a ciegas.
  - Fuera de MCP: `~/Videos-Remotion/herramientas/earshot/.venv/bin/python -m earshot <cmd>`. Cada llamada tarda 20–40 s en cargar los modelos.
- **Real SFX** (skill `real-sfx`, `~/.claude/skills/real-sfx`, Python 3.9 del sistema vale). Bibliotecas configuradas: principal = Drive "RECURSOS DE EDICIÓN/EFECTOS DE SONIDO" (228); reserva = Motionix (73); índice de 301. Original del config en `config.json.original`.
  - Está pensada para devolver un MP4 + una pista WAV de efectos. Con clientes la entrega sigue siendo **clips sueltos en Premiere**.
  - De ella uso el **plan y la elección de sonidos** (`mix.py --plan`, `picker`) y la **crítica de niveles y sincronía** (`critique.py`, `levels.py`). Los tiempos y archivos elegidos se colocan con ExtendScript en una pista libre.
  - Para trials o vídeos sin Premiere puede usarse entera.
- **Openverse** (`https://api.openverse.org/v1/audio/?q=whoosh&license=cc0`): sin clave. Buscar en inglés, filtrar `license=cc0` (CC BY pide crédito; nada de NC/ND). "sound effects" da 0 resultados. Si da error 429, esperar y reintentar. Solo cuando la biblioteca del usuario no tenga el sonido; anotar el origen.
- Las reglas de gusto no cambian: pocos sonidos, uno por cambio, un solo pop por objeto (ver `criterio.md` y `subtitulos-reels`).

## Skills relacionadas

- `cortar-silencios`, `subtitulos`, `cambiar-fondo`: herramientas locales en `~/Videos-Remotion/voz` y `~/Videos-Remotion/fondo`.
- `remotion-best-practices`: skill oficial de Remotion; cargarla antes de escribir composiciones.
- Orden habitual para un reel de busto parlante: cortar silencios → transcribir el cortado → fondo → subtítulos y gráficos en Remotion con alfa → montaje final en Premiere.

## Leer un proyecto de Premiere sin el puente

`cd ~/Videos-Remotion/premiere && gunzip -c "<proyecto>.prproj" > p.xml && node leer-prproj.js p.xml p.json` lista cada secuencia con sus pistas y clips (inicio/fin en la línea de tiempo, entrada/salida en el original, en segundos). Con eso se reconstruye el corte limpio con ffmpeg desde el bruto.
- `./pr.sh script.jsx` ejecuta ExtendScript en Premiere si el panel "MCP Bridge (CEP)" está abierto. Si `bridge-heartbeat.json` lleva más de 10 s sin actualizarse, el panel está cerrado: pedir al usuario que lo reabra (Ventana > Extensiones). Se cierra al cambiar de proyecto.

## Recursos del usuario en Google Drive (montado en el Mac)

`~/Library/CloudStorage/GoogleDrive-luiscarlosmercadoleon@gmail.com/.shortcut-targets-by-id/1l8P_ZvOmLfWiy1vN0HiH8-rV_BNtTnqR/PACKS/`: SOUND EFFECTS (whooshes, clics de cámara, impactos, risers), CINEMATIC OVERLAYS, DEGRADADOS NEGROS, RECTÁNGULOS SUPER 8MM. Usarlos en vez de buscar fuera. Plantillas de texto que ya usa: "Texto Premium Animado", "Animación Regular", "Texto Impacto Supremo".

## Alternativas de un vídeo ya editado (hecho con Amin IMG_6118)

Material en `~/Videos-Remotion/amin-6118` y `motion/public/amin`; composiciones `Amin1`…`Amin5` en `motion/src/Amin.tsx` (limpio azul, énfasis con palabra gigante detrás, estudio oscuro con fondo sustituido, pantalla partida, editorial con pintura). Entregas en `~/Videos-Remotion/entregas/`. Patrón reutilizable: corte limpio `base.mp4` + `persona.webm` (VP9 con alfa a partir del mate) + `palabras.json` corregido.

## Formatos que se repiten en las 156 referencias del usuario (revisadas 72 en hojas, `referencias/lote/hojas`)

Nicho: negocios, mentalidad, masculinidad, dinero; casi todo busto parlante vertical en español.

1. **Lista numerada con contador** (juradonegocios, checouperezcuadra, coralmujaes, alfredomarinn): título fijo arriba ("15 reglas del hombre", "17 reglas para una vida exitosa"), lista o columna de números a un lado que se va rellenando o iluminando, a veces cronómetro. Fondo negro puro con la persona iluminada (juradonegocios, el de más likes del lote) o estudio.
2. **Comparativa A vs B** (diego.garciae, alfredomarinn, caronuvan, jesus.braincode, clogamez, tinocontentt): etiquetas arriba "RICO / POBRE", "niño / hombre", "Madre tóxica / sana", "MALO / BUENO / VIRAL"; una imagen o icono bajo cada etiqueta; a veces la misma persona duplicada en dos lados. Es exactamente el tema del vídeo de Amin.
3. **Busto + b-roll cinematográfico de fondo** (zeidarellano, gabrimolinaa, bastian.xu): persona recortada pequeña en el centro o abajo, fondo que cambia cada 1 a 2 s con pintura, cine o lujo; subtítulo pequeño centrado. Imágenes de película en tarjetas arriba (gabrimolinaa).
4. **Gancho fijo arriba en caja** (tinocontentt, christianpolk, danilodominguezcruz, pulsooriginal): frase en mayúsculas blanca o cita entre comillas que no se mueve en todo el vídeo, bandas negras arriba y abajo, vídeo en el centro; emojis 3D grandes como énfasis.
5. **Subtítulo de una palabra** (cuzimroy, austingeorgas, alberto.riehl, babystickley): fondo oscuro o exterior, una palabra o dos por pantalla, tipografía fina o serif, mucha calma; alberto.riehl usa mayúsculas amarillas con contorno.
6. **Podcast / micrófono** (javireelbe, jorgegarciamentor, leilahormozi, paco.benitez): plano medio con micro, fondo de estudio cálido y desenfocado, subtítulos pequeños abajo, casi sin gráficos: la credibilidad viene del set y del encuadre.
7. **Tutorial con pantalla** (codebyjavi, janbasx, colomonterg): captura arriba o de fondo, cara abajo.

Señales de credibilidad comunes en las cuentas grandes: mismo set y misma ropa en todos los vídeos; una sola tipografía y uno o dos colores; título o gancho siempre en el mismo sitio; subtítulos pequeños y limpios (no gigantes ni de colores); fondo oscuro o cálido con profundidad; el formato se repite como serie reconocible ("X reglas", "rico vs pobre"). No pude abrir los perfiles (Instagram pide sesión): esto sale solo de los reels.

## Entregar versiones editables en Premiere (sin el puente)

En `~/Videos-Remotion/motion`: `node src/alternativas-datos.js` define las capas de cada versión (`src/alternativas.json`), `src/Alternativas.tsx` las dibuja (composiciones `Capa` y `Version1…5`) y `node construir-premiere.js <carpeta>` exporta cada capa como clip (ProRes 4444 con alfa, o mp4 si es opaca) y escribe un XML de Final Cut 7 con una secuencia por versión. Todas las capas van a tamaño completo de secuencia para no depender de valores de posición en el XML.
- Abrir: copiar un .prproj vacío, `open -a "Adobe Premiere Pro 2026" proyecto.prproj`, esperar, y `open -a … archivo.xml`. Comprobación: `lsof -p <pid de Premiere> | grep medios`.
- Antes de exportar, renderizar fotogramas de `VersionN` y mirar que ninguna imagen tape a la persona: fue la queja del usuario con la primera tanda (2026-10-08). Poner las imágenes detrás de la capa de persona recortada o fuera de su silueta, y que aparezcan justo cuando se nombran.
- El usuario quiere las propuestas dentro de Premiere, por capas, para revisar y editar; no solo vídeos planos.

## Reglas de producción del usuario (de su Notion "AI Content Agency — Proyecto V1", copia en `~/Videos-Remotion/notion/segundo-cerebro.md`)

El usuario está diseñando una agencia de contenido dirigida por IA; yo soy en la práctica su Director + trabajadores. Aplicar su propio método:
- **El modelo decide, la herramienta determinista ejecuta** (ffmpeg, Whisper, scripts). No improvisar a mano lo que un script hace igual siempre.
- **Inspeccionar los archivos antes de preguntar**; preguntar solo si la ambigüedad cambia el resultado.
- **Orden:** ingesta → plan (gancho, estructura, ritmo, estilo) → corte bruto → limpieza → subtítulos → audio → visual → ensamblaje → control de calidad → corrección automática → entrega.
- **Control de calidad obligatorio antes de entregar:** `node ~/Videos-Remotion/voz/qc.js <video>` (formato, duración, negros, congelados, silencios, volumen) y mirar fotogramas. Veredicto APROBADO / REVISAR / BLOQUEADO con evidencia. No dar por bueno mi propio trabajo sin esto.
- **Intervención humana solo para:** gusto de alto impacto, assets que faltan, contradicciones, publicar o acciones irreversibles. El usuario es director, no operador de línea de tiempo.
- **Reglas de contenido:** retener atención, sin relleno; el b-roll debe apoyar lo que se dice, nunca al azar; subtítulos legibles, sincronizados y pensados para móvil; la voz manda sobre la música; vertical para Reels.
- **Entregar siempre:** vídeo, proyecto editable si se puede, subtítulos, y un resumen de qué se hizo, con qué y qué queda pendiente.
- **Todo gratis en V1**; registrar cada herramienta nueva con qué hace, licencia, riesgo y decisión.
- Formato objetivo: vertical de 30 a 90 s, busto parlante, motivacional y narrativo.
- Su plan nombra CapCut y DaVinci; hoy trabaja en Premiere. Repos que quiere evaluar: DaVinci-MCP, mcpCut, Pireel (AGPL), capcut-ai-editor, Higgsfield CLI y Skills (MIT; la generación necesita cuenta). No instalar ninguno sin que lo pida.
- Lección del QC (2026-10-08): la voz en bruto de Amin sale a unos -33 LUFS; normalizar siempre a cerca de -15 (`loudnorm=I=-15:TP=-1.5`).

## Comparativas de Amin (confirmado 2026-10-08)
- En imágenes enfrentadas: lo "malo" entra por la derecha y lo "bueno" por la izquierda. `tarjetas2()` en `motion/src/alternativas-datos.js` ya lo hace.

## Marca por cliente y proyectos de Premiere (2026-10-08)
- `Amin Branding.prproj`, `Eric Branding.prproj`, `Natalia Branding.prproj` en `~/Documents/Adobe/Premiere Pro/26.0/`: cada uno con secuencia `KIT <CLIENTE>` (una muestra de cada plantilla de texto, subtítulo, capa de ajuste, overlay, SFX y música, con marcadores) y el ejemplo real completo.
- Ficha y recursos: `clientes/<cliente>/marca/marca.json` + `sfx/`, `musica/`, `overlays/`. Se regenera con `sistema/marca-desde-proyecto.js`.
- Subtítulos: Amin = SF Pro Bold; Eric y Natalia = Sequel Sans Medium Disp (resaltado Heavy Disp). Plantillas MOGRT del pack "PRESETS TEXTO PREMIERE [V4]".
- Separar/duplicar secuencias con el puente: `sequence.clone()`, `trackItem.remove(false,false)`, `trackItem.move(Time)`, `sequence.exportAsProject(ruta)`, `project.importSequences(ruta,[sequenceID])`. `importFiles` con un .prproj no importa nada. ExtendScript falla con ternarios encadenados: usar `if`.
- `app.openDocument(ruta)` abre otro proyecto sin cerrar el panel; no guardar nunca los proyectos originales del usuario tras clonar (borrar los clones).

## Criterio y guías de marca (2026-10-08)
- Antes de proponer estilo o revisar un vídeo, leer `criterio.md` (junto a este archivo): intensidad por tipo, zonas seguras, tipografía, sonido y control final.
- Guía de marca de cada cliente: en Notion (dentro de Estudio de Edición › Clientes › <cliente> › "Guía de marca") y resumida en `clientes/<cliente>/marca/marca.json` → `guia`.
- Maquetas "así debería verse": composición `Marca` de Remotion (`motion/src/Marca.tsx`, props `{c, e}`, 4 escenas por cliente); salidas en `clientes/<cliente>/marca/propuesta/`.
- Sacar fotogramas de una secuencia de Premiere: `app.enableQE(); seq.setPlayerPosition(ticks); qe.project.getActiveSequence().exportFramePNG(q.CTI.timecode, ruta)` (añade `.png`).
- Revisar siempre ortografía y tildes del texto en pantalla: los vídeos de Eric y Natalia tenían faltas.

## Curso del usuario (Hotmart, "Edición en Premiere y After Effects 0 a PRO")
- El usuario se forma con este curso; sus packs (carpeta PACKS de Drive) y las plantillas MOGRT que usa vienen de ahí. Hablarle con ese vocabulario: presets de subtítulos V2/V3/V4, Premiere Composer / Animation Composer, máscaras nuevas, glow, líneas estilo Iman Gadzhi, texturizar iconos, 3D estilo Julián Alborna, zoom out con texto 3D, estilo Ramiro Cubría.
- Temario del módulo (solo títulos): bases de Premiere y After · subtitular y estilos cinemáticos · zooms y animaciones orgánicas · máscaras · Premiere Composer · animar sin keyframes · glow · líneas · animación para YouTube/VSL · reels estilo b-roll · texturizar iconos y capturas · 3D · perfiles de redes animados · estilo Iman Gadzhi en After · zoom out 3D. Hay módulos de CapCut, DaVinci, branding y optimización de perfil.
- Las clases son vídeo dentro del reproductor de Hotmart: no se descargan ni se transcriben. Para aprender una técnica concreta, pedir al usuario sus apuntes o trabajar sobre los presets y proyectos de práctica que ya tiene en disco.
- 30 plantillas MOGRT en `PACKS/PRESETS TEXTO PREMIERE [V4]/PRESETS (morgt)` (p. ej. Texto Elegante Animado, Texto Premium Animado, Comentario Destacado, Impacto Brutal, Dúo Cinemático).

## Estilo elegante y subtítulos de texto editables (2026-10-09)
- Referencias: `~/Videos-Remotion/referencias/sproject/` (estilo objetivo) y `referencias/motion-graphics/` (ideas de motion graphics tipo póster).
- Piezas en `motion/src/Elegante.tsx`: `BaseElegante` (zooms), `Miniatura`, `Versus`, `Seguir`, `MgPantalla` (`que`: proyectas, dentro, persona, valor).
- Subtítulos SIEMPRE como texto editable: plantilla `clientes/_plantillas/Subtitulo Amin.mogrt` (SF Pro Bold + Nyght; la genérica es `Subtitulo elegante.mogrt`). Se crea con `ae/mogrt-amin.jsx`, las frases salen de `motion/subs-texto.js` y se colocan con `premiere/importar-elegante-azul-v2.jsx` (`seq.importMGT` + JSON `textEditValue`; color con `setColorValue(255,r,g,b,true)`). El XML necesita una pista vacía arriba: `PISTA_VACIA=1`.
- Acento de Amin: siempre azul `#1E8BFF`.
- Trials = edición libre. Vídeo de cliente desde cero = todo editable (clips originales cortados, zooms como escala del clip, imágenes sueltas, motion graphics en pista aparte).
- After Effects: no usar `app.newProject()` (se bloquea con el aviso de guardar); usar `app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES)`. Las referencias a efectos se invalidan al añadir otro: volver a buscarlos por nombre.
- "Iguala los subtítulos" / "aplica este a todos": Premiere no deja editar los controles de la plantilla con varios clips seleccionados. Usar `premiere/igualar-subs.jsx` (poner `APLICAR = true`): copia duración de entrada, retraso, animación, tamaño y altura del primer subtítulo seleccionado a los demás seleccionados, o a todos si solo hay uno. Plantilla actual de Amin: `Subtitulo Amin v4.mogrt` (todo SF Pro). Recortar clips de plantilla siempre con `clip.end` y después `clip.outPoint`.
- SFX por script en Premiere: `track.overwriteClip(item, seg)` entra con la duración COMPLETA del archivo y pisa lo que haya después en esa pista antes de que lo recortes; colocar de derecha a izquierda o en una pista libre. Nivel de audio: `Volumen › Nivel = Math.pow(10, (dB - 15) / 20)`. Scripts de ejemplo: `premiere/sfx-poner.jsx`, `sfx-mg-extra.jsx`.
- Corrección de color por script (`premiere/color.jsx`): `qe.project.getVideoEffectByName("Color de Lumetri")` (nombre en español) + `qeItem.addVideoEffect(fx)`; los elementos QE incluyen huecos, emparejar por `it.type === "Clip"` y `it.start.secs`. Parámetros de Corrección básica por índice: 14 temperatura, 15 tinción, 16 saturación, 19 exposición, 20 contraste, 21 resaltados, 22 sombras, 23 blancos, 24 negros, 42 intensidad. Identificar el bruto por `projectItem.getMediaPath()`, no por nombre. Aplicarlo también dentro de las secuencias anidadas del usuario.
- Plantilla de subtítulos vigente de Amin: `Subtitulo Amin v8.mogrt` (compacta, todo SF Pro, con controles de sombra); cambio conservando ajustes con `premiere/subs-v8.jsx`.

## Los 20 formatos de Trials (2026-10-09, prueba)
- Solo para Trials. Componente único `motion/src/Trials.tsx` (fichas `FICHAS[1..20]`, composiciones `Trial1`…`Trial20`); datos del reel en `motion/public/t1009/` (base.mp4 = corte limpio 1080p, img01–12, persona.webm = recorte) y `src/t1009-subs.json`, `t1009-palabras.json`.
- Render y audio: `bash motion/trials-render.sh [números]` → `entregas/trials-AMIN_1009_01/NN - nombre.mp4` (unos 3,5 min por formato). Rebundle antes si cambia el código o `public/`.
- Para otro reel: generar base.mp4 con los tramos del primer corte, copiar imágenes, `sistema/subs-reel.js`, recorte con `fondo/recortar.js --alfa` → webm VP9 con alfa, y cambiar título, pares de imágenes y cortes en `Trials.tsx` (hoy están fijos para AMIN_1009_01: falta parametrizarlo).

## Eric (2026-10-09)
- Proyecto: `~/Documents/Adobe/Premiere Pro/26.0/ERICK EDICION.prproj`. Acento naranja `#FF5800`, Sequel Sans; plantilla de subtítulos `clientes/_plantillas/Subtitulo Eric v1.mogrt` (`ae/mogrt-eric-v1.jsx`). Camiseta blanca: subtítulos algo más abajo (Movimiento Y 0,555) sobre el degradado negro de `clientes/_recursos/` (pista propia, escala 200 en 4K).
- Sus brutos de iPhone son HDR (Rec. 2100 HLG): en la secuencia hay que activar `autoToneMapEnabled` (`var st = seq.getSettings(); st.autoToneMapEnabled = true; seq.setSettings(st)`) o se ve lavado.
- Sus brutos traen ensayo + toma final en clips distintos, con el nombre del alimento dicho por otra persona: elegir las tomas de la última pasada. Si una frase queda con dos tomas dentro, `sistema/recortes-extra.js <reel> --quitar "a-b" --palabras "mal=bien"` recorta el XML y corrige palabras.
- Montaje completo de ejemplo: `premiere/montar-eric-1009.jsx`.
- Guiones de Eric (índice y estado): `clientes/eric/guiones-octubre.md`. Cada vídeo sale de una "idea ganadora" de referencia que no se copia.
- Audio solapado (lo que hace el usuario en sus vídeos de Eric): en algunos cortes la frase siguiente entra unos fotogramas antes de que acabe el audio de la anterior. `sistema/montaje-solapado.js <reel> --solapar 1,2,6 --max 8` genera `<reel> - montaje.xml` con el audio en tablero (A1/A2 y A3/A4), sin descartes, y desplaza `palabras.json`; solo solapa donde queda silencio suficiente. Sin abusar: 3 o 4 por vídeo.
- Imágenes de propuesta con licencia libre: API de Wikimedia Commons (`generator=search&gsrnamespace=6`) y Openverse (`api.openverse.org/v1/images?license=cc0,pdm,by`); guardar fuente y licencia en `imagenes/fuentes-elegidas.txt`. Tarjeta uniforme (1500×900, esquinas de 60 px, borde blanco) con ffmpeg `pad` + `geq` para el alfa. No usar fotos actuales de personas reconocibles para ilustrar algo negativo.
- Elementos "detrás de la persona": máscara con `fondo/recortar.js` (solo el mate), multiplicar el alfa del gráfico por el mate invertido y transformado igual que el zoom del clip. ffmpeg 6 `prores_ks` deja un alfa que Premiere NO lee: sacar PNG con alfa y codificar el ProRes 4444 con el ffmpeg de Remotion (`node_modules/@remotion/compositor-darwin-arm64/ffmpeg`, con `DYLD_LIBRARY_PATH`).
- Piezas de Eric: `motion/src/Eric.tsx` (`EricResumen`, `EricCierre`, cuenta @erick.eecofit). Montaje v2 de ejemplo: `premiere/montar-eric-1009-v2.jsx`.
- Eric graba con dos micros: canal izquierdo = una voz, canal derecho = la otra. El XML del primer corte reparte los canales a izquierda/derecha y eso no se puede centrar por script: crear `audio/<clip> voz centrada.wav` (ffmpeg `pan=stereo|c0=0.707*c0+0.707*c1|c1=...`), colocarlo en dos pistas nuevas con los mismos puntos (`item.setInPoint/OutPoint(seg, 4)` + `overwriteClip`, y después fijar `clip.inPoint` exacto: entra un fotograma desplazado) y silenciar las originales.
- Si el usuario recorta la línea de tiempo, reacomodar lo demás por tiempo de origen: `premiere/eric-estado.jsx` (lee todo a JSON) → plan en node → `premiere/eric-reacomodar.jsx` (mueve los subtítulos con `clip.move(Time delta)` sin recrearlos).
- Eric, formato "quita / no quita el hambre" (2026-10-10): títulos arriba (izquierda NO QUITA, derecha QUITA), imagen recortada del alimento que entra desde abajo al centro y sube a su lado en el veredicto. El usuario marca el momento: marcador DENTRO del clip de imagen = lado "quita" (derecha), marcador de secuencia = lado contrario; si falta, inferirlo del subtítulo "te / quita|da". Fotogramas clave por script: `prop.setTimeVarying(true); addKey(t); setValueAtKey(t, v, true); setInterpolationTypeAtKey(t, 5, true)` con `t = clip.inPoint + desfase` (las imágenes fijas tienen inPoint 3600). Script: `premiere/eric-paso4.jsx`.
- Subtítulos de Eric: plantilla vigente `Subtitulo Eric v2.mogrt` (`ae/mogrt-eric-v2.jsx`): Tamaño 58, "Tamaño de la línea" 77 (línea grande respecto a la clave, como la dejó el usuario a mano), Movimiento Y 0,391 con clave y 0,402 sin clave. Conversión conservando texto: `premiere/eric-subs-v2.jsx`.
- Mejorar audio sin mover clips: procesar el WAV (misma duración) y `projectItem.changeMediaPath(nuevo, true)`. `alimiter` necesita `level=disabled` o normaliza a 0 dB.
- Voz de Eric (gimnasio, ruido de fondo alto, unos −36 dB): NO comprimir ni subir ganancia ni presencia: la cadena "mejorada" subió el ruido 5 dB y el usuario lo notó. Dejar la voz centrada sin procesar; `afftdn` + `agate` de ffmpeg no bajaron ese ruido. Medir siempre el nivel de los silencios antes y después de procesar una voz.
- Portada de reel de Eric: composición `EricPortada` en `motion/src/Eric.tsx` (props l1, grande, l3; base en `public/eric/portada-base.jpg`, alimentos en `bueno.png`/`malo.png`); `npx remotion still build EricPortada <salida.png> --scale=2`. Sigue el estilo de sus portadas: línea blanca + palabra grande en degradado amarillo-naranja.
- Portada preferida por el usuario para Eric (2026-10-10): como un fotograma del vídeo (títulos NO QUITA / QUITA EL HAMBRE, Eric nítido sobre fondo desenfocado), sin subtítulo, con 5 alimentos en silueta oscura con resplandor naranja e interrogación. Composición `EricPortada2`.

## Natalia (2026-10-10)
- Proyecto `~/Documents/Adobe/Premiere Pro/26.0/NATALIA EDICION.prproj`; brutos en Drive `Videos Octubre B/<carpeta>` (copiar a `clientes/natalia/entrada/`). Sus clips de cámara `A001_*.MOV` son 3840×2160 con rotación 90: al importarlos por XML Premiere NO los gira → poner Rotación 90 en Movimiento (y entonces "recortar arriba" = lado derecho en pantalla, "recortar abajo" = lado izquierdo). 24 fps.
- Vídeos sin voz (reacciones): no hay primer corte; se monta directo. Ejemplo pantalla partida + contador editable: `premiere/montar-natalia-1010.jsx`; plantilla de texto `Texto Natalia v1.mogrt` (misma que Eric v2, colores por clip; verde #22B573 = bueno).
- Cuando el usuario pide "idéntico a la referencia": copiar formato tal cual (sin añadir pantalla partida, gráficos ni colores de marca). Texto tipo app: plantilla `Texto nativo.mogrt` (`ae/mogrt-nativo.jsx`; Avenir Next Condensed blanco con contorno negro; controles Texto y Tamaño; se coloca con Movimiento). Ejemplo: `premiere/montar-natalia-ref.jsx`.
- Los gráficos nativos de Premiere (clip "Gráfico", componente Texto) NO se pueden editar por script: "Texto de origen" es binario. Para contadores o textos en serie usar plantillas propias: `Texto contorno.mogrt` (SF Pro Bold blanco con contorno negro, `ae/mogrt-contorno.jsx`) o `Texto nativo.mogrt`. Contador por corte: `premiere/nat-contador.jsx`. Formato de miles de Natalia: "1,000 pasos" (con coma, como lo escribió el usuario).
- Guiones de Amin: documento de Google exportable a texto (`curl -L "https://docs.google.com/document/d/1Jf5YqyPyAHBwuQbnx73kAsSyZo72mX7w/export?format=txt"`), copia en `clientes/amin/guiones/guiones.txt` (cada guion: Número, Idea ganadora, Formato, Gancho, Historia, Moraleja, CTA). Buscar ahí el guion antes de elegir tomas: la transcripción automática de Amin falla mucho.
- Amin trabaja varios vídeos en UNA misma línea de tiempo (`AMIN_1009_01 - SONIDO v2` en AMIN EDICION) para mantener la identidad: el vídeo nuevo se monta a continuación (desplazamiento de 66 s para AMIN_1010_01) copiando color y estilo de subtítulos de los clips anteriores. Montar desde el bruto que él deja en la línea de tiempo: `item.setInPoint/OutPoint` + `videoTrack.overwriteClip` (arrastra audio a las pistas: quitarlo y poner la voz en un WAV centrado). Para elegir tomas cuando Whisper falla: unir las tomas candidatas en un WAV y transcribir ese WAV (da el guion limpio y los tiempos del corte). Scripts: `premiere/amin-1010-a.jsx`, `amin-1010-b.jsx`.
