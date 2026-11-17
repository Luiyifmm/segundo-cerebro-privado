# Editor exportado · índice

Todo lo que sé y uso para editar vídeo, para que otro Claude Code (el que trabaja con Trainer10x y la Sala de edición) edite igual. Lo exportó el Claude Code del usuario el 30-10-2026.

## Por dónde empezar

1. **Este archivo**, y en especial la última sección («Lo que yo haría distinto»).
2. **`01-metodo.md`**: el método paso a paso, del bruto al vídeo final.
3. **`02-reglas-y-numeros.md`**: la tabla de valores exactos. Tenla a mano mientras editas.
4. **`05-errores-y-lecciones.md`**: lo que el usuario corrigió y la regla que salió de cada corrección. **Es lo que más vale**: son sus gustos.
5. **`06-ejemplo-real.md`**: un reel contado decisión por decisión, con tiempos.
6. `04-prompts.md`: las reglas convertidas en prompts para tu IA que decide cortes.
7. `03-herramientas.md`: el inventario, con versiones y cómo instalar cada cosa.
8. `archivos/claude/skills/edicion-video/SKILL.md` y `criterio.md`: mi skill principal, completa.

## Qué hay en la carpeta

| Ruta | Qué es |
|---|---|
| `00`…`06` | Documentos |
| `archivos/claude/` | Mis skills (propias y de terceros), memorias, CLAUDE.md del proyecto, ajustes y servidores MCP (sin secretos) |
| `archivos/Videos-Remotion/` | Mi código: `voz/` (transcribir, cortar, primer corte, QC), `sistema/` (reels, subtítulos, marcadores, proxies), `premiere/` (~250 scripts ExtendScript y `recetas/`), `ae/` (generadores de MOGRT), `motion/` (Remotion: componentes, `package.json`, configuración), `fondo/` (recorte de persona), `herramientas/` |
| `archivos/plantillas/mogrt/` | Mis plantillas de subtítulos y textos (.mogrt + .aep) |
| `archivos/presets/` | Preset de exportación de Media Encoder |
| `archivos/recursos/` | Fuentes, música y efectos (110 MB) |
| `ejemplos/` | Datos de montaje reales (cortes, props de animación, tiempos de sonido, subtítulos, una ficha de reel automática). **Sin vídeos** (ver más abajo) |

## Anonimización y reglas que he aplicado

- **Clientes:** ClienteA (marca personal / negocios, azul #1E8BFF, SF Pro), ClienteE (fitness, naranja #FF5800, Sequel Sans) y ClienteN (fitness, rojo #D3261C, Futura Condensed).
  - Los nombres, cuentas de Instagram, correos, IDs de Drive y el usuario del Mac se han sustituido en todos los archivos de texto y en los nombres de archivo.
  - Dentro de los binarios .mogrt/.aep el nombre interno de la plantilla puede conservar el nombre real.
- **Sin secretos:** ninguna clave, token ni .env. El escáner encontró un único falso positivo (en un archivo de Font Awesome), que se ha sustituido por `<SECRETO>`. Las variables de entorno de los MCP aparecen como `<VALOR>`.
- **Fuera por ser datos de clientes:**
  - los guiones;
  - el panel de reels (contenía frases de los guiones);
  - las transcripciones;
  - la carpeta de Notion (plan del negocio);
  - el b-roll;
  - los brutos y los vídeos finales.
- No he cambiado nada de mi configuración: solo he leído y copiado.

## Sobre los ejemplos «antes y después» (punto 5 del encargo)

Pediste meter brutos y finales tuyos, pero **todos los vídeos que he editado son de clientes**, y tus propias reglas dicen «nada de datos de clientes: ni sus vídeos». Por eso:
- he incluido **todo lo que permite reconstruir el montaje sin la imagen**: listas de cortes con segundos del bruto, props de las animaciones, tiempos de cada sonido, subtítulos y configuración;
- **no he incluido ningún vídeo**.

Si los clientes te dan permiso, copia tú en `ejemplos/` el bruto y el final de cada carpeta. Están en:
- `~/EDICION/1 CLIENTES/<CLIENTE>/BRUTOS/…`
- `~/EDICION/1 CLIENTES/<CLIENTE>/TERMINADO/…`

Para pasarlos a 720p sin tocar el montaje:

```
ffmpeg -i in.mp4 -vf scale=720:-2 -c:v libx264 -crf 23 -c:a aac -b:a 128k out.mp4
```

## Dependencias que no se pueden copiar (punto 6)

| Qué | Qué hace exactamente | Ajustes | Cómo hacerlo sin ella |
|---|---|---|---|
| **Adobe Premiere Pro 2026** (de pago) | Línea de tiempo donde entrego todo editable: clips cortados, subtítulos MOGRT, Lumetri, efectos de audio, marcadores, proxies. La manejo por ExtendScript con un puente CEP de la comunidad (`adobe-premiere-pro-mcp` + panel "MCP Bridge") | Ver `01-metodo.md` §4, §7, §9 | ffmpeg para cortar y montar (concat con los tramos), Remotion para subtítulos y gráficos (tu sistema ya lo hace); se pierde el "editable por el humano" |
| **"Mejorar la voz"** (Sonido esencial de Premiere) y **Limitador forzado / Compresor de banda única** | Limpieza de la voz y control de picos | Cadena: Mejorar voz → 0 dB → compresor → limitador | ffmpeg: `highpass=f=80, lowpass=f=14000, afftdn=nf=-25` (suave), `acompressor=ratio=2:threshold=-24dB:attack=10:release=150`, `deesser`, `alimiter=limit=0.84:level=disabled`, y `loudnorm=I=-14:TP=-1.5`. **Mide el ruido de fondo antes y después**: si sube, no proceses |
| **Adobe Podcast Enhance** (web) | Lo pidió un cliente para la voz | Manual | No hay equivalente local igual de bueno; DeepFilterNet (código abierto) es lo más cercano |
| **After Effects 2026** | Solo para fabricar las plantillas MOGRT (controles de texto, tamaño, color, sombra, entrada) | Scripts `ae/mogrt-*.jsx` | Si no usas Premiere, no hacen falta: los subtítulos van en Remotion |
| **Media Encoder** | Exportación final | Preset "max h264" | `ffmpeg -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -c:a aac -b:a 320k -ar 48000 -movflags +faststart` a 2160×3840 o 1080×1920 |
| **Plantillas MOGRT del curso del usuario** ("Animación Rápida Con Brillo", "Efecto Brillo"…) | Títulos de gancho y números de ClienteE | Ver `01-metodo.md` §3–4 | Recrearlas en Remotion: texto + glow naranja + entrada desde abajo en 0,2 s |
| **Emojis de Apple** | Los renderiza un programa Swift con AppKit | `herramientas/emoji` | Solo funciona en macOS; alternativa: Noto Color Emoji o Twemoji en PNG |
| **Recorte de objetos** (Vision de Apple) | Recorta alimentos y objetos de fotos | `herramientas/recorte-objetos` | rembg / BiRefNet (código abierto) |

No uso CapCut, Descript, Submagic ni ninguna API de pago.

## Lo que yo haría distinto

Comparado con tu otro sistema (mlx-whisper → IA decide cortes → ffmpeg monta → Remotion pone subtítulos, zooms, música y efectos → agente del Mac procesa la cola). Ordenado de lo que más mejora la calidad a lo que menos. Es lo que hago yo y probablemente ese sistema no hace.

1. **Las correcciones del usuario y de cada cliente como reglas que mandan sobre todo lo demás.**
   - Guardo cada corrección como regla con su motivo (`05-errores-y-lecciones.md`, `claude/memoria/`) y la aplico sin que la repitan.
   - Orden de autoridad: correcciones > referencias del usuario > reglas genéricas.
   - Sin esto, un sistema automático repite los mismos errores de gusto en cada vídeo.
2. **Cortes por la energía real de la voz, no por los tiempos de Whisper.**
   - Whisper se desvía hasta 0,5 s e inventa palabras. Corto en el mínimo de energía entre palabras (ventanas de 10 ms) con 0,08 s / 0,15 s de aire.
   - **Valido cada corte retranscribiendo el audio montado.** Con esto se acaban las sílabas comidas.
3. **Mejor toma = la última completa, y la cifra en pantalla siempre igual a la voz.**
   - Quito ensayos, indicaciones y alternativas ("30 o 35").
   - Si el cliente cambia un número, corto la voz para que lo diga; no solo cambio el gráfico.
4. **Comprobación visual de verdad antes de entregar.**
   - Fotogramas del montaje final (no del render suelto) en el gancho, en cada gráfico, en los cambios y en el cierre.
   - Busco texto sobre la cara, gráficos que pisan subtítulos, faltas, huecos negros y cifras que no cuadran. Lo que falla está casi siempre entre capas.
5. **Ingesta que mide la fuente:**
   - **canales de audio** (en estas cámaras la voz viene en UN canal: sin rellenar el otro, el vídeo exportado "no tiene voz");
   - HDR/HLG de iPhone (tone mapping y Lumetri);
   - rotación de los clips de cámara;
   - 24 frente a 30 fps.
6. **Marca por cliente fija:** plantilla, tamaño, posición, color de clave, sombra y entrada exactos por cliente (tabla en `02`). No un estilo genérico de subtítulos.
7. **Reglas de subtítulo que no salen de partir cada N palabras:**
   - la clave solo al final del bloque y nunca sola;
   - nunca acabar en "de/la/que";
   - la cifra que va en gráfico sale del subtítulo;
   - malo en rojo y bueno en verde.
8. **Menos es más.** Estilo de cliente "natural y elegante": pocos sonidos (solo en cambios, un solo pop por objeto), zoom solo en frases fuertes, motion graphic solo si hay metáfora. Un sistema automático tiende a rellenar.
9. **Gráficos ligados a la palabra que los dispara y que sobreviven a los recortes.** Guardo cada evento en segundos del bruto y lo remapeo cuando el montaje cambia; los sonidos se mueven con él.
10. **Voz por encima de la música y sin destrozar el ruido.** La voz 10–18 dB sobre la música, mezcla a −14 LUFS y −1,5 dBTP; medir el ruido de fondo antes y después de cualquier procesado.
11. **Entrega editable por el humano.** Secuencia de Premiere por capas, no un MP4 cerrado. Si tu sistema no tiene humano en el bucle, ignora esto, pero guarda igualmente las capas por separado (voz, gráficos con alfa, subtítulos como datos) para poder corregir sin rehacer.
12. **Lo que no hago y tu sistema quizá sí:** seguimiento de cara y reencuadre automático (yo encuadro a mano por pieza) y procesar una cola sin supervisión. Ahí tu sistema va por delante.
