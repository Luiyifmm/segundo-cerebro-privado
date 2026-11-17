---
name: after-effects-editor
description: Editor profesional de After Effects 2026 (AE 26.5, Windows) controlado por script con el MCP de After Effects (herramientas ae_*). Diseña, anima y renderiza motion graphics 2D y 3D, títulos, intros, explicativos, anuncios de producto, interfaces, transiciones, VFX sobre vídeo, escenas 3D (mallas paramétricas, Advanced 3D, Element 3D, Cinema 4D), color y look, y sonido sincronizado; replica tutoriales comparando con la referencia. Obliga a investigar si existe un efecto, plugin o función nativa antes de construir nada a mano, a optimizar (cada capa solo vive mientras se ve) y a dejar el proyecto organizado para que un humano cambie textos y texturas fácil. Úsala SIEMPRE que la tarea toque After Effects (proyectos .aep, comps, capas, efectos, expresiones, ExtendScript, render o revisar una animación), aunque sea un arreglo pequeño.
---

# After Effects Editor

Conocimiento destilado de 26 clases estudiadas y replicadas en After Effects del 29/09 al 02/10/2026 (principios de diseño de Solazzo, anuncio Glass Health, fundamentos, cámara 3D, novedades de AE 2026), más un informe técnico de AE 26.x. Todo está **probado** en un PC con Windows 11 y AE 26.5 salvo lo marcado *(informe)*; en otro PC, comprobar la versión y los efectos y plugins instalados (`ae_status`, `ae_search_effects`).

Pensada para editores de vídeo que hablan español y **no saben programar**: Claude lo hace todo y lo cuenta con palabras sencillas. Versión pública (comunidad de Solazzo). Probada en Windows; en Mac, las herramientas `.py` que dibujan texto usan fuentes de Windows y necesitan otra ruta de fuente.

---

## Dónde funciona (Claude Code o el chat de Claude)
- **Las herramientas `ae_*`** salen del MCP "after-effects" (github.com/23d1/after-effects-mcp): cómo se instala y se usa, en `references/mcp-after-effects.md`.
  - Se configura en Claude Code (`claude mcp add`) y, si se quiere, también en el chat de la app de Claude (`claude_desktop_config.json`).
  - Si no aparecen herramientas `ae_*`, decírselo al usuario: falta instalar el MCP o reiniciar la app de Claude.
- **Los scripts de esta skill** están en su carpeta `scripts/`. Claude Code da la ruta de la skill al cargarla («Base directory for this skill»).
  - `ae_run_script` corre DENTRO de After Effects, en el PC: los .jsx se cargan con su ruta absoluta y barras `/`, p. ej. `$.evalFile(new File("<carpeta de la skill>/scripts/ae_lib.jsx"))`.
  - Si la skill no está en el disco del PC (en el chat, sus archivos están en la nube y AE no los ve), leer el .jsx de la skill y mandarlo entero dentro del `ae_run_script`.
- **Claude Code (recomendado para el trabajo completo):** hay consola, así que también van las herramientas de Python, ffmpeg y PowerShell (`*.py`, `voz_onecore.ps1`, convertir a MP4, hojas, comparar, Whisper).
- **Chat de Claude:** solo lo que pasa por After Effects (construir, mirar con `ae_save_frame`, renderizar).
  - Sin consola local: las herramientas `.py` no se pueden lanzar, y `system.callSystem` desde AE no devolvió la salida en la prueba.
  - El vídeo final, directamente desde AE con una plantilla H.264 (`ae_render_templates` para ver cuáles hay).
  - Si hace falta Python (voz en off, comparar, convertir), decirle al usuario que lo siga en Claude Code.

## 0. Cada vez, antes de tocar nada
1. **`ae_status`.**
   - Si AE no está abierto, pedir que lo abra.
   - Si el proyecto abierto **no es el nuestro** (el usuario está trabajando en lo suyo), **no tocarlo**: ni capas temporales ni sondas. Tampoco abrir otro proyecto sin preguntar.
   - Antes de abrir otro proyecto, guardar el actual. Nunca descartar cambios sin preguntar.
2. **Leer las referencias del tema** (tabla de la sección 9). En un encargo nuevo, como mínimo, `references/reglas-de-oro.md`.
3. **Hablar en español y simple:**
   - hacerlo todo uno mismo, sin pedirle comandos, y contarle qué se hizo y qué salió;
   - directo: si algo no se puede, decirlo con el dato que lo demuestra;
   - si una decisión es de verdad suya, preguntarla; si no, decidir y decir qué se decidió.

## 1. Las 3 reglas de oro (SIEMPRE, sin excepción) → `references/reglas-de-oro.md`

### REGLA 1 · Investigar antes de construir: si existe un efecto, se usa
**Nunca hacer a mano lo que hace un efecto, un plugin instalado, una función nativa o un preset.** El error típico: hacer cada partícula como una capa en vez de usar un efecto de partículas.
- **Orden de búsqueda:**
  1. funciones nativas (Repeater, Trim Paths, animadores de texto, Echo, mallas…);
  2. `references/catalogo-efectos-instalados.md` (760 efectos de un PC de referencia; Grep por palabra en inglés) y **`ae_search_effects`** (lo que hay de verdad en este PC);
  3. los plugins de pago (`references/efectos-y-plugins.md`);
  4. los presets;
  5. las recetas de esta skill (`references/recetas/indice.md`);
  6. **la web** (WebSearch / WebFetch: ayuda de Adobe, School of Motion, Video Copilot, foros).
- **Probar el efecto solo** en una comp de prueba y mirarlo.
- **Solo si nada sirve, a mano**, y decírselo al usuario: qué se buscó y por qué no valía.
- **Alarma:** si un script va a crear más de ~15 capas iguales, parar y buscar el efecto o el Repeater.
- Partículas → **CC Particle World / CC Particle Systems II / S_Sparkles**. Copias → **Repeater**. Brillo → **Deep Glow 2**. Rayos → **S_Rays / Godrays**. Texto letra a letra → **animadores con selectores**. Ruido → **Fractal / Curl Noise**. Quitar un fondo negro → **Unmult**. Objetos 3D → **mallas paramétricas**.

### REGLA 2 · Optimizar: en la comp solo vive lo que se ve
Una capa gasta RAM, GPU y render **entre su entrada y su salida**, aunque esté fuera del cuadro, tapada o al 0 % de opacidad.
- **Cada capa empieza cuando entra en cuadro y termina cuando sale** (+1 fotograma). Lo que nunca se ve, se quita.
- Herramienta: **`scripts/optimizar_visibles.jsx`**. Lo calcula fotograma a fotograma con la caja real proyectada, la opacidad, la escala y la cámara, y recorta. Primero `aplicar:false` (informe) y después `aplicar:true`. Pasarlo **al terminar cada escena y antes del render**.
- **Nada de una precomp gigante con todo dentro:** cada escena en su comp, recortada a su tramo. Precomps del tamaño de su contenido.
- **Lo pesado y repetido se pre-renderiza una vez:** ProRes 4444 con alfa, y se usa el .mov.
- Expresiones caras, en pocas capas; si van en muchas, horneadas a keys.
- **El motor 3D justo:** Classic para 2.5D; Advanced solo si hace falta.
- **Medir el tiempo por fotograma** después de cada bloque (render de 1 s) y avisar de los minutos del render.

### REGLA 3 · Organizar para el humano: cambiar un texto o una textura en segundos
- **Carpetas fijas** (`scripts/organizar_proyecto.jsx`): `01 FINAL` · `02 ESCENAS` · `03 PRECOMPS` · `04 MEDIOS` (Imágenes, Vídeos, Audio, 3D) · `05 SÓLIDOS` · `99 PRUEBAS`.
- **Nombres en español que dicen qué es:** "TEXTO · título", "TEXTURA · papel", "CONTROL · colores", "CAM · …". Nunca "Shape Layer 3".
- **Colores de etiqueta por tipo:** textos amarillo, formas verde, archivos azul, precomps morado, cámara y nulos rojo, luces melocotón, ajustes lavanda, mallas aguamarina, mates cian.
- **Textos:**
  - siempre capas de texto editables;
  - dentro de precomps, expuestos en **Propiedades esenciales** (`addToMotionGraphicsTemplateAs`): se cambian desde fuera, y en Premiere como .mogrt;
  - un texto repetido, en una capa maestra que las demás leen por expresión.
- **Colores, tamaños y tiempos generales en una capa CONTROL** (nulo arriba del todo) con controles nombrados "CTRL_…".
- **Imágenes y texturas como archivos** en `04 MEDIOS`: se cambian con *Reemplazar metraje*.
- **Marcadores con nombre** en los momentos clave. Comentarios `//` en las expresiones.
- **Al entregar:** `scripts/mapa_proyecto.jsx` escribe **`MAPA DEL PROYECTO.md`** junto al .aep: la comp final, dónde está cada texto, cada textura con su ruta, cada control y los marcadores. Decirle al usuario dónde está.
- **Scripts reproducibles:** los parámetros en ARGS o en `parametros.json`. Se relanza y se reconstruye.

## 2. Mentalidad y diseño → `references/diseno-y-dinamismo.md`
- **El diseño es el cupcake; la animación, la crema.**
  - Diseñar el fotograma final antes de animar: 50–80 % del esfuerzo.
  - Una animación nunca salva un mal diseño.
- **Las 5 leyes:**
  - **Composición:** margen seguro ≈9 % del ancho y ≈13 % del alto; tercios o centro al píxel; balance también durante la animación.
  - **Tamaño:** lo más importante, lo más grande (≥ 2–3× lo secundario); lo igual, igual.
  - **Espaciado:** márgenes, padding uniforme y espacio en blanco.
  - **Color:** 1 dominante + 1 acento + neutros; el significado y la emoción mandan.
  - **Profundidad:** sombra + viñeta + textura + glow como mínimo; capas delante y detrás; desenfoque.
- **Dinamismo:**
  - **Contexto:** intensidad, velocidad, fluidez, fuentes, color y assets según el género.
  - **Digestibilidad:** 1 concepto a la vez; ~0,3 s por palabra + 1 s.
  - **Timing:** el pico del movimiento en la sílaba tónica (Whisper da los tiempos de cada palabra).
  - **Movimiento constante:** nada quieto nunca; curvas largas al 75–90 %; movimientos solapados; `wiggle` < 1 Hz; zoom lento.
- **Estilos:**
  - **Apple:** diseño contenido + cámara simple + espacio en blanco;
  - **UI tech de marca:** azul marino, un solo color de luz y glow dosificado;
  - **paneles de interfaz de cristal:** bisel oscuro, borde fino e interior con degradado; nunca bloques planos.

## 3. Flujo de un encargo → `references/metodo-de-trabajo.md`
1. **Entender:** formato, fps, duración, contexto y entregable; pedir referencias.
2. **Investigar** (regla 1) y elegir las recetas.
3. **Diseñar** el fotograma final.
4. **Construir por script**, organizado desde la primera capa (regla 3).
5. **Mirar** (`ae_save_frame`, hojas) y corregir con la checklist.
6. **Optimizar** (regla 2).
7. **Organizar y hacer el mapa** (regla 3).
8. **Render** (avisando de los minutos) → MP4 → revisarlo a velocidad real.
9. **Contar:** qué se hizo, dónde está, cómo cambiar los textos y qué no quedó igual.

## 4. Por script con el MCP de AE → `references/mcp-after-effects.md`, `references/trampas-scripting.md`
- **Construir con `ae_run_script`:**
  - un `construir.jsx` que abre o crea el .aep (guardando antes el que está abierto) y lanza los pasos;
  - un script por escena con los parámetros en `ARGS`;
  - librerías: `scripts/ae_lib.jsx` (+ `teclas_lib.jsx`, `camara_lib.jsx`…), cargadas con `$.evalFile`.
- **Siempre:**
  - `undoLabel` en lo que cambia algo y `return` para devolver datos;
  - textos y rutas por `args`;
  - **guardar al final de cada script**;
  - **una orden de AE a la vez**.
- **ExtendScript es ES3:**
  - sin `let`/`const`, sin flechas, sin JSON, sin `forEach`/`indexOf`;
  - **tope en todos los `while`**;
  - nunca `alert`/`confirm`/`prompt` ni palabras reservadas como clave (`in`, `super`…): abren ventanas que cuelgan el MCP.
- **Por matchName, nunca por el nombre visible:** cambia con el idioma.
  - `references/matchnames-probados.md` y `matchnames-formas-texto-camara.md`;
  - si falta uno: `scripts/volcar_propiedades.jsx`, `objeto.reflect.methods` o `scripts/buscar_matchnames.py` (busca dentro de los .dll de AE).
- **Crear las carpetas antes** de `saveFrameToPng` o `ae_render`: si no, salen ventanas de error y AE se bloquea.
- **Mirar después de cada cambio importante** con `ae_save_frame`. No dar nada por hecho.
- **Todo visible en AE:** `comp.openInViewer()`, la capa del efecto seleccionada y el tiempo en un momento representativo.

## 5. Decisiones rápidas
- **Motores 3D** (PROBADO; el informe externo los tiene al revés):
  - `"ADBE Advanced 3d"` = **Classic 3D** (2.5D, efectos y motion blur en capas 3D, rápido);
  - `"ADBE Calder"` = **Advanced 3D** (mallas, GLB, HDRI, sombras de focos y paralelas, desenfoque fuerte; sin efectos en texto o forma 3D; sin motion blur de capa; ~2,3 s por fotograma con desenfoque + sombras);
  - `"ADBE Ernst"` = **Cinema 4D** (extruir con bisel).
  - **No elegir el motor buscando la palabra "advanced".** → `references/3d-y-motores.md`
- **Cámara:**
  - zoom = ancho × mm / 36;
  - de un nodo colgada de **un nulo por movimiento** (el nuevo, padre del anterior, solapado 10 f);
  - **Center In View** = cámara + [0, 0, zoom] en el instante en que llega;
  - diseñar primero el plano final (4.106);
  - foco con un nulo FOCO, medido a lo largo del eje.
- **Curvas:**
  - **pico = media / (1 − influencia)**: 75 % → 4×; 90 % → 10×;
  - corte de acción en el fotograma más rápido (medido);
  - lo que entra ya trae velocidad; lo que sale no frena;
  - punto lento ≤ 50 px/s.
- **Luz 3D:** la sombra quita la luz principal; con mucho ambiente no hay sombras. Estudio blanco sin horizonte = luz paralela + fondo del color medido del suelo (4.111).
- **Texto:**
  - nombre PostScript de la fuente, y releer `doc.font` para ver que no la sustituyó;
  - **fuentes variables:** Bahnschrift (peso 300–700, ancho 75–100), Segoe UI Variable…; animadas con `animador.property("ADBE Text Animator Properties").addVariableFontAxis("wght")` (valor absoluto) y una instancia fija con `postScriptNameForDesignVector([peso, ancho])`;
  - fuentes: las instaladas (`ae_list_fonts`); si falta la pedida, proponer una parecida.
- **Glow dosificado:** "si todo brilla, nada destaca".
  - Deep Glow 0,1–0,5 con picos solo en transiciones y palabras clave.
  - Tinte con Tint Mode `PEDG2-0043` = 2. Para apagarlo, Mix `PEDG2-0082` = 0 (con exposición 0 sigue brillando).
  - El umbral va en % (79 = 79).
- **Un destello** es una luz grande y suave DETRÁS durante 2–3 fotogramas, no quemar la palabra.
- **Color:** las ruedas y las curvas de Lumetri no se tocan por script; usar Color Balance + Contraste de Lumetri. Mezclar colores en HSL, no con `linear()`.
- **Mates:** `capa.setTrackMatte(mate, TrackMatteType.ALPHA | ALPHA_INVERTED | LUMA | LUMA_INVERTED)` y `mate.enabled = false`. Un mate por capa. Un mate 3D sirve para capas 2D.
- **Sin motion blur si la referencia no lo tiene.**
- **Recursos:**
  - modelos 3D de Sketchfab (CC BY, guardando el crédito);
  - texturas de Texturelabs o Pinterest;
  - **pedir permiso antes de cada descarga** (qué archivo, de dónde y cuánto pesa);
  - sin caras reales ni marcas de otros. → `references/entorno-y-recursos.md`

## 6. Reglas de calidad que no se saltan (salen de correcciones reales)
1. **No adivinar:** si se afirma algo, enseñar el número; si no se puede verificar, decirlo. Pero medir es para entender, no para calcar.
2. **Nunca keys por fotograma copiadas de un rastreo:** se ve temblor. Pocas keys ajustadas o un rig rígido.
3. **Glow dosificado** y destellos como luz detrás.
4. **Precomps con glow:** +200 px de margen por lado. Al agrandarlas, AE mueve el ancla de las capas que las usan: fijarla otra vez.
5. **Paneles de interfaz de cristal translúcido**, no bloques planos.
6. **Curvas largas y continuas; nada se queda quieto nunca.**
7. **Logos que se forman:** medir su tamaño fotograma a fotograma (crecen ~20 fotogramas, no 4); que no monten encima del texto.
8. **Revisar a tamaño y velocidad reales** antes de decir "listo"; comparar antes y después de cada corte.
9. **APRENDER, NO CALCAR:**
   - en una réplica, construir como el profe, comparar a ojo y arreglar lo que se note;
   - tiempo proporcionado (5 s de animación no son horas de medidas);
   - el esfuerzo, en entender por qué funciona cada cosa.
10. **Todo visible en la pantalla de AE.**

## 7. Las trampas que más han costado (lista completa en `references/trampas-scripting.md`)
- `while (pos.numKeys) pos.removeKey(1)` con la Posición **separada** = bucle infinito, y hubo que matar AE. Usar `ADBE Position_0/_1` y siempre un tope.
- **Poner el `inPoint` después del `outPoint` mueve también el `outPoint`:** primero `inPoint`, luego `outPoint`, y leer los dos.
- **Tras `addProperty` (o `effect.moveTo`), las variables anteriores caducan:** volver a buscarlas por índice o matchName.
- `setTemporalEaseAtKey` quita las keys HOLD: las retenciones, al final. Keys recreadas que salen viejas en el render: "tocarlas" con `setValueAtKey(k, keyValue(k))`.
- **No llamar a una función propia como una de ae_lib** (`keys`, `pop`…): `$.evalFile` la pisa. Usar `var f = function…`.
- **Emparentar por script compensa la transformación:** poner escala, posición y orientación DESPUÉS de `parent =`. La opacidad no se hereda.
- **Los puntos de efecto** (Ramp, 4-Color) en capas de texto o forma van en coordenadas de la COMP; si la capa se mueve, `toComp`.
- **Gaussian Blur no hizo nada** en una precomp grande escalada: Box Blur, y comprobar que se ve.
- **`saveFrameToPng` es asíncrono:** esperar a que exista el PNG, y no sirve para medir tiempos.
- **Una orden larga (reconstruir + renderizar)** tras muchos renders cerró AE: separar las órdenes, purgar cachés y, si sale una ventana, que el usuario lea el texto antes de cerrarla.
- **Varios `? :` seguidos sin paréntesis se evalúan mal en ExtendScript** (de izquierda a derecha): usar if/else o paréntesis en cada ternario anidado.
- **Al reconstruir por script se acumulan sólidos y nulos sin usar:** limpiar con `app.project.removeUnusedFootage()` (`organizar_proyecto.jsx`, `limpiarSinUso:true`).
- **`addParametricMesh(nombre, ParametricMeshType.X)`:** el nombre va primero.
- **`addVariableFontAxis(tag)`, en el grupo de propiedades del animador**, no en la capa.
- **Máscara de efecto por script** (Opciones de composición): se crea, pero no limita el efecto. Hacerlo a mano o con una copia de la capa + máscara.
- **ffmpeg y PowerShell:**
  - rutas con tildes o emojis → llamar a ffmpeg desde Python (glob);
  - código Python dentro de un *here-string* dispara un falso "Remove-Item blocked" → escribir un .py y ejecutarlo.

## 8. Verificar y entregar → `references/oficio-motion.md`, `references/checklist.md`, `references/render-y-entrega.md`
- **Mirar** el inicio, el 25 %, el 50 % y el 75 %, el final y cada momento clave.
- **Comprobar:**
  - **0 errores de expresión** (`expressionError`, solo en las propiedades CON expresión);
  - lo centrado, centrado al píxel;
  - nada importante fuera de la zona segura;
  - si hay referencia, la hoja ORIGINAL | RÉPLICA (`scripts/comparar_momentos.py`).
- **Render:**
  - `ae_render` con plantilla "High Quality" → master `.mov` → `python scripts/master_a_mp4_audio.py` (H.264 50 Mbps + audio, BT.709);
  - avisar de los minutos y de que AE pondrá "(No responde)" y no hay que cerrarlo;
  - para OBS con alfa: ProRes 4444 → WebM VP9 con ffmpeg.
- **Revisar el MP4** (hojas, saltos y audio con ffprobe) antes de decir "listo".
- **Entregar con:** la ruta del render, el proyecto guardado y organizado, el `MAPA DEL PROYECTO.md` y qué no quedó como se pidió.

## 9. Mapa de referencias (leer solo lo que haga falta)
| Archivo | Cuándo |
|---|---|
| `references/reglas-de-oro.md` | **Siempre**: investigar, optimizar y organizar, con la tabla "no lo hagas a mano" |
| `references/catalogo-efectos-instalados.md` | Antes de construir algo: ¿existe el efecto? (760 efectos de un PC de referencia con su matchName; confirmar con `ae_search_effects`) |
| `references/efectos-y-plugins.md` | Qué efecto o plugin usar, si es de pago y su alternativa; lo que se usó en cada clase |
| `references/diseno-y-dinamismo.md` | Diseñar: las 5 leyes, los 4 principios, el contexto, el estilo Apple y el estilo UI |
| `references/metodo-de-trabajo.md` | Flujo de un encargo, cómo replicar un tutorial y cómo hablar con el usuario |
| `references/recetas/indice.md` → `recetas/*.md` | 111 recetas probadas por tema: fondos y look, texto, curvas, cámara y 3D, luz y glow, UI, mates, expresiones, vídeo real y VFX, Element 3D, replicar y medir; y `recetas-del-informe.md` |
| `references/3d-y-motores.md` | Motores, cámaras, luces y sombras, mallas, modelos GLB y Blender |
| `references/expresiones.md` | Motor JavaScript, expresiones a prueba de idioma y biblioteca |
| `references/trampas-scripting.md` | Antes de escribir un script largo o si algo falla raro (todas las trampas probadas) |
| `references/matchnames-probados.md` · `matchnames-formas-texto-camara.md` | Nombres internos de efectos, formas, texto, cámara, mallas y novedades de la 26 |
| `references/mcp-after-effects.md` | Las herramientas `ae_*` y cómo usarlas sin colgar AE |
| `references/render-y-entrega.md` | Render, formatos (MP4, ProRes con alfa, WebM para OBS, .mogrt), color y GPU |
| `references/oficio-motion.md` | Números de referencia (tiempos, curvas, zonas seguras) y control de calidad |
| `references/checklist.md` | La checklist completa antes de dar una escena por terminada |
| `references/entorno-y-recursos.md` | Dónde conseguir modelos, texturas e imágenes, y qué comprobar en cada PC |
| `references/herramientas.md` | Qué hace cada script de `scripts/` y cómo se usa |
| `references/versiones-ae.md` | Qué trajo cada versión hasta la 26.5 |
| `references/element-3d-parametros.txt` | Parámetros de Element 3D (buscar con Grep) |

**Scripts clave** (`scripts/`):
- `ae_lib.jsx` (librería base: formas, textos, keys, colores, estilos), `teclas_lib.jsx`, `camara_lib.jsx`;
- **`optimizar_visibles.jsx`**, **`organizar_proyecto.jsx`**, **`mapa_proyecto.jsx`** y `volcar_propiedades.jsx`;
- `master_a_mp4_audio.py`, `comparar_momentos.py`, `hojas_resumen.py`, `voz_onecore.ps1` (voz en off en español con las voces de Windows; los tiempos por palabra, con Whisper), `sfx_lib.py` (sonido sintetizado), `buscar_matchnames.py`, `perfil_color.py`.
