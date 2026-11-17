# Las 3 reglas de oro del usuario (02/10/2026) — SIEMPRE, sin excepción

> El usuario revisó las animaciones que hice solo. Encontró tres fallos de oficio y pidió que la skill los impida:
> 1. hacía a mano lo que ya hace un efecto (por ejemplo, **cada partícula como una capa** en vez de un efecto de partículas);
> 2. la optimización era pésima: **todo metido en capas que duraban toda la comp**, consumiendo RAM y GPU aunque no se vieran;
> 3. el proyecto no estaba pensado para que un humano cambie un texto o una textura sin buscar.

---

## REGLA 1 · Investigar antes de construir: si existe un efecto, se usa

**Nunca construir a mano algo que ya hace un efecto, un plugin instalado, una función nativa o un preset.** Solo se construye a mano cuando, después de investigar bien, no existe nada que lo haga. En ese caso hay que decírselo al usuario: qué se buscó y por qué no servía.

### Protocolo, en este orden
1. **¿Lo hace una función nativa que no es un efecto?** Repeater, Trim Paths, Wiggle Paths/Transform, Merge Paths, Offset Paths, Zig Zag, animadores de texto con sus selectores (Range, Wiggly, Expression), Echo, Time Remap, Posterize Time, Create Nulls From Paths, Puppet, mallas paramétricas, luz de entorno, desenfoque de cámara, Track Mask, 3D Camera Tracker, Warp Stabilizer, Content-Aware Fill, Object Matte o Roto Brush (con clics), Gráficos/Propiedades esenciales.
2. **¿Hay un efecto instalado?**
   - Buscar en `references/catalogo-efectos-instalados.md` (los 760 del PC del autor) con Grep por palabra inglesa: particle, glow, shadow, light, ray, noise, grain, blur, wipe, glitch, distort, key, matte, 3D, text, audio…
   - O con `ae_search_effects`, o con `scripts/volcar_propiedades.jsx` (`efectos: "palabra"`).
3. **¿Hay un plugin de pago instalado mejor?** Mirar `references/efectos-y-plugins.md`: Deep Glow 2, Sapphire (más de 300 efectos), Optical Flares, Element 3D, Shadow Studio 3, Crate's Godrays, Displacer Pro, Pixel Sorter 4. ⛔ BAO no.
4. **¿Hay un preset?** Los de AE están en `C:\Program Files\Adobe\Adobe After Effects 2026\Support Files\Presets` (texto, fondos, comportamientos, transiciones). Se aplican con `capa.applyPreset(new File(ruta))`. Los del usuario están en sus User Presets.
5. **Si no se sabe cómo se hace: investigar.**
   - Primero en este CEREBRO (`references/recetas/indice.md`).
   - Después en la web, con WebSearch / WebFetch: ayuda de Adobe, School of Motion, Video Copilot, foros de Adobe, docsforadobe…
   - Buscar en inglés: "how to make X in After Effects".
6. **Probar el efecto solo, en una comp de prueba**, y mirarlo con `ae_save_frame` antes de meterlo en la escena. Los plugins nuevos, siempre aparte: algunos abren ventanas que bloquean AE.
7. **Solo si nada sirve:** construirlo a mano (formas, expresiones o script) y explicar por qué.

### Tabla rápida "no lo hagas a mano"
| Necesitas… | Úsalo (instalado aquí) | Nunca |
|---|---|---|
| Partículas: polvo, chispas, confeti, nieve, lluvia, burbujas, explosiones | **CC Particle World**, **CC Particle Systems II**, CC Star Burst, CC Snowfall (`CSSnowfall`), CC Rainfall (`CSRainfall`), CC Bubbles, CC Drizzle, Particle Playground, **S_Sparkles / S_Dust** (Sapphire) | Una capa por partícula |
| Muchas copias de una forma (rayos, anillos, filas) | **Repeater** de la capa de forma | Duplicar capas |
| Una capa repetida en mosaico o en espejo | **Motion Tile**, **CC RepeTile**, Offset | Copias a mano |
| Rejilla de puntos o de líneas | **Grid**, Venetian Blinds ×2, CC Ball Action | Una forma por punto |
| Texto letra a letra, por palabras, en onda o aleatorio | **Animadores de texto** + selector Range / Wiggly / Expression; presets de texto | Una capa por letra |
| Dibujar un trazo, escribir a mano | **Trim Paths**, Stroke, Write-on | Máscaras animadas punto a punto |
| Brillo | **Deep Glow 2**; Glow | Copias desenfocadas a mano |
| Rayos de luz | **S_Rays**, **Crate's Godrays**, CC Light Rays | Formas con desenfoque |
| Destello de lente | **Optical Flares** | Círculos sueltos |
| Luz que recorre un borde | **CC Light Sweep**, Trim Paths + Deep Glow | — |
| Sombra larga o realista | **Shadow Studio 3**, Drop Shadow, estilos de capa; en 3D, luces con sombra | Copias negras desplazadas |
| Ruido, humo, nubes, texturas vivas | **Fractal Noise**, Turbulent Noise, **Curl Noise**, Noise, Add Grain, S_Grain | Imágenes animadas a mano |
| Grano de película | **Add Grain**, S_Grain, S_FilmEffect | — |
| Desenfoque de movimiento | Switch de motion blur, **CC Force Motion Blur**, Pixel Motion Blur, Transform (con su motion blur) | Ecos a mano |
| Temblor o shake | `wiggle()` en un nulo, **S_Shake** | Keys a mano |
| Glitch | **S_DigitalDamage**, Shift Channels + `posterizeTime`, Pixel Sorter 4 | — |
| Aberración cromática | **VR Chromatic Aberrations**, Shift Channels, S_BlurChroma | 3 copias desplazadas a mano (solo si no hay otra) |
| Viñeta | **CC Vignette**, S_Vignette, Lumetri | Un sólido con máscara (solo si no hay otra) |
| Degradados | **Gradient Ramp**, 4-Color Gradient, relleno de degradado (Escala y Rotación nuevas en 26) | — |
| Ondas y deformaciones | **Wave Warp**, Turbulent Displace, Wiggle Paths, Zig Zag, Displacer Pro, Displacement Map | Mover vértices con keys |
| Romper en trozos | **Shatter**, CC Pixel Polly | — |
| Transiciones | Gradient Wipe, Linear/Radial Wipe, CC (Grid Wipe, Jaws, Light Wipe, Glass Wipe…), **67 transiciones de Sapphire**, Card Wipe | — |
| Quitar un fondo negro (fuego, chispas, destellos) | **Unmult** (`ADBE Unmult`, nuevo en 26) | Modos de fusión a ciegas |
| Recortar a una persona | Keylight sobre verde (4.92); con clics, **Object Matte** (nuevo, sustituye al Roto Brush) | Máscaras a mano fotograma a fotograma |
| Seguir algo que se mueve | **Track Mask**, 3D Camera Tracker, Tracker (con clics) | Keys por fotograma a ojo |
| Objetos 3D sencillos | **Mallas paramétricas** (`addParametricMesh`, 4.111), GLB/OBJ, Element 3D; extrusión con el motor Cinema 4D | Cubos hechos con 6 sólidos (salvo un truco a propósito) |
| Contadores de números | Source Text con expresión, efecto Numbers | Una capa por número |
| Visualizador de audio | **Audio Spectrum**, Audio Waveform, *Convert Audio to Keyframes* | — |
| Reflejo en el suelo | Receta nativa 4.80 (VC Reflect no está instalado) | — |
| Partículas sobre un trazado, rastros | CC Particle World con productor animado, Echo | — |

**Señal de alarma:** si un script va a crear más de ~15 capas iguales (partículas, puntos, copias), parar y buscar el efecto o el Repeater que lo hace.

---

## REGLA 2 · Optimizar: en la comp solo vive lo que se ve

Una capa consume memoria, GPU y tiempo de render **mientras está entre su entrada y su salida**, aunque esté fuera del cuadro, tapada o con opacidad 0. Sus efectos y sus expresiones se siguen calculando. Por eso:

1. **Cada capa empieza cuando entra en cuadro y termina cuando sale**, más 1 fotograma de margen.
   - Si sale de cuadro, se corta en ese fotograma; si entra tarde, empieza al entrar.
   - Con opacidad 0 al principio o al final, se recorta ese tramo.
   - Herramienta: **`scripts/optimizar_visibles.jsx`**. Lo calcula fotograma a fotograma con la caja real proyectada (`toComp`), la opacidad, la escala y la cámara, y recorta.
   - Uso: primero `aplicar:false` (informe) y después `aplicar:true`. Pasarlo **al terminar cada escena** y otra vez antes del render.
2. **Lo que nunca se ve, se quita** de la comp (borrar, o pasarlo a una comp "ALMACÉN" que no se renderiza).
   - Y del proyecto, **lo que no usa ninguna comp**: al reconstruir por script se acumulan sólidos y nulos sueltos. `organizar_proyecto.jsx` con `limpiarSinUso:true` (en la prueba, 20 elementos). En un proyecto del usuario, preguntar antes.
3. **Opacidad 0 no es "apagado":** se corta la capa o se apaga su ojo.
4. **Nada de "todo dentro de una capa o una precomp gigante".**
   - Cada escena en su comp, recortada a su tramo; la comp final las encadena.
   - Las precomps, del tamaño de su contenido: +200 px por lado solo si hay brillo.
5. **Partículas y repeticiones con UN efecto** (regla 1), no cientos de capas.
6. **Sólidos y máscaras de tamaño justo:** un sólido de 30000×3000 con calado 2000 pasó de 3,5 s a más de 2 min por fotograma. Se usa uno pequeño escalado.
7. **No duplicar precomps pesadas:** se calculan cada vez.
   - Si algo pesado se repite, **pre-renderizarlo una vez** (ProRes 4444 con alfa) y usar el .mov.
   - La separación RGB, con una copia + capa de ajuste, no con 3 copias de la escena 3D.
8. **Expresiones caras** (`sampleImage`, `sourceRectAtTime`, bucles con `valueAtTime`) solo en pocas capas.
   - En muchas capas: hornearlas a keys (recorrer los fotogramas con `valueAtTime`, `setValuesAtTimes` y quitar la expresión).
   - Mejor una capa CONTROL que calcule y que las demás lean.
9. **El motor 3D justo:**
   - Classic 3D (`"ADBE Advanced 3d"`) para 2.5D con capas planas: rápido y con motion blur;
   - Advanced 3D (`"ADBE Calder"`) solo si hacen falta mallas, modelos, desenfoque fuerte o sombras de focos (con desenfoque y sombras, ~2,3 s por fotograma);
   - Cinema 4D (`"ADBE Ernst"`) solo para extruir.
10. **Efectos que no se ven, apagados o quitados.** Capas de ajuste recortadas a su tramo.
11. **Imágenes del tamaño de uso:** no meter una de 8K para un icono. Los modelos GLB, limpios y con pocas caras (Blender: diezmar).
12. **Medir y avisar:**
    - el tiempo por fotograma después de cada bloque de capas (render de 1 s con la hora antes y después: `saveFrameToPng` es asíncrono y no sirve para medir);
    - avisar al usuario de los minutos que tardará un render de más de 1 min.
13. **Higiene de sesión:**
    - `app.purge(PurgeTarget.ALL_CACHES)` entre bloques grandes;
    - reconstruir y renderizar en órdenes separadas;
    - previsualizar a media resolución o con Draft 3D, y el render final a resolución completa (los trazos finos que brillan se pierden a media resolución).

---

## REGLA 3 · Organizar para el humano: que cualquiera cambie un texto o una textura en segundos

El usuario tiene que poder abrir el proyecto y cambiar un texto, una imagen, un color o un tiempo **sin buscar**.

1. **Carpetas fijas en el panel Proyecto** (`scripts/organizar_proyecto.jsx` lo hace solo):
   `01 FINAL` · `02 ESCENAS` · `03 PRECOMPS` · `04 MEDIOS` (Imágenes, Vídeos, Audio, 3D) · `05 SÓLIDOS` · `99 PRUEBAS`.
2. **Nombres que dicen qué es, en español:**
   - capas: "TEXTO · título principal", "TEXTURA · papel del fondo", "FOTO · producto", "CONTROL · colores y tiempos", "CAM · …", "LUZ · …", "AJUSTE · color final", "MATE · ventana";
   - comps: "FINAL · …", "ESCENA 2 · …";
   - **nunca** "Shape Layer 3", "Pre-comp 1" ni "Solid 2" (el script los avisa).
3. **Colores de etiqueta por tipo:** textos amarillo (2), formas verde (9), archivos azul (8), precomps morado (10), cámara y nulos rojo (1), luces melocotón (6), ajustes lavanda (5), mallas 3D aguamarina (3), mates cian (14). Los pone `organizar_proyecto.jsx` con `colores:true`.
4. **Textos:**
   - siempre **capas de texto reales**, editables: nunca convertidos a formas, salvo que la animación lo exija; entonces, guardar la capa original oculta y nombrada;
   - un texto dentro de una precomp se **expone en Propiedades esenciales**: `prop.addToMotionGraphicsTemplateAs(comp, "Título")` sobre el Source Text, en la comp de dentro. Así se cambia desde la comp de arriba, y en Premiere como .mogrt;
   - textos que dependen de otros (el mismo nombre en 3 sitios): una sola capa maestra y las demás lo leen por expresión (`thisComp.layer("TEXTO · nombre").text.sourceText`).
5. **Colores, tamaños y tiempos generales en una capa CONTROL** (un nulo arriba del todo, receta 4.71): Color Control y Sliders con nombres propios ("CTRL_Color marca"). Las capas los leen con `effect("CTRL_Color marca")(1)`, que funciona con AE en cualquier idioma.
6. **Imágenes y texturas como archivos importados**, en `04 MEDIOS`, con nombre claro. Se cambian con *Reemplazar metraje* y cambian en todas partes. No incrustar el mismo archivo dos veces.
7. **Marcadores con nombre** en los momentos clave ("entra logo", "corte", "voz: paso a paso"), para encontrar los tiempos.
8. **Orden de capas lógico:** CONTROL, cámara y luces arriba; luego textos; luego elementos; el fondo abajo; las capas de ajuste arriba del todo (en 3D, una capa 2D en medio parte el render).
9. **Comentarios `//` dentro de las expresiones** que expliquen qué hacen.
10. **Un MAPA junto al .aep:** `scripts/mapa_proyecto.jsx` escribe `MAPA DEL PROYECTO.md`:
    - qué comp es la final;
    - dónde está cada texto (comp → capa → lo que dice);
    - cada imagen o textura y su ruta;
    - cada control y sus valores;
    - las propiedades esenciales y los marcadores.
    Se genera al entregar y se le dice al usuario dónde está.
11. **Scripts reproducibles:** los parámetros de cada pieza en ARGS o en un `parametros.json`, documentados. Cambiar un valor y relanzar el script reconstruye la escena.
12. **Antes de entregar:** las pruebas, fuera (a `99 PRUEBAS` o borradas), el proyecto guardado y el mapa al día.
