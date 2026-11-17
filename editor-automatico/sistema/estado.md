# Estado de instalación y limitaciones (comprobado el 30-10-2026)

## Qué hay en este Mac
| Herramienta | Estado |
|---|---|
| Premiere Pro, After Effects, Media Encoder | **No instalados.** Solo hay CapCut |
| ffmpeg | 7.1 en `~/.local/bin` (con afftdn, deesser, loudnorm, zscale y tonemap) |
| ffprobe | No está suelto: se usa el de Remotion (`motor/node_modules/@remotion/compositor-darwin-arm64/ffprobe`) |
| Transcripción | mlx-whisper con whisper-large-v3-turbo (local, gratis), vía `uv` |
| Remotion | 4.0.535 en `../motor` (y una copia del Reel en la Sala) |
| Node | 24.21 en `~/.local/node` |
| Python | `uv` con 3.12 (numpy y mlx a demanda). Demucs: el modelo está en caché, sin probar aquí |
| Puentes de control (MCP de Premiere o AE) | No: no hay Adobe |

## Mapa del método de Luis
| Pieza de Luis | Aquí |
|---|---|
| Orden de autoridad, «menos es más», nada sobre la cara, cifras = voz | **Reutilizado** (reglas en `flujo.md`) |
| Cortes en el silencio real + validar volviendo a transcribir | **Adaptado** (`montar.py` + `validar_cortes.py`) · probado |
| Inspección de canales, HDR, rotación y fps | **Adaptado** (`ingesta.py`) · probado (sin HDR ni voz en un canal reales todavía) |
| Cadena de voz midiendo el ruido antes y después | **Adaptado** (`voz.py`) · probado y medido, no escuchado |
| Subtítulos por sentido escritos a mano | **Adaptado** (`subtitulos.py` + `bloques.txt`) · probado |
| Gráficos ligados a la palabra y recolocables por segundo del bruto | **Adaptado** (`tramos` + `t_bruto` en `montaje.json`) · guardado; la recolocación automática tras un recorte **falta por escribir** |
| QC con veredicto | **Adaptado** (`qc.py`) · probado |
| Entrega por capas en Premiere (MOGRT, ExtendScript, XML) | **No se puede**: no hay Premiere. Sustituto: capas con alfa + SRT + `montaje.json` (ver abajo) |
| Lumetri y presets de Media Encoder | **No se puede**. El color, si hace falta, va con ffmpeg o Remotion (sin probar) |
| Fichas de ClienteA/E/N, plantillas MOGRT, fuentes con licencia (SF Pro, Sequel) | **No se copian** a los vídeos de Amin; se quedan en el traspaso como referencia |
| Emojis de Apple (Swift), recorte de persona (RVM) | **Falta** (no hace falta para la muestra) |
| Música y efectos | El paquete de Luis trae 110 MB **sin copiar**. Los efectos de Amin están en `IMG_6131-trabajo/sfx` y en la biblioteca de la Sala |

## Qué será editable y qué no (sin Premiere)
- **Editable en CapCut:**
  - el vídeo cortado (`capas/video-cortado-sin-zoom.mp4`);
  - la voz tratada (`capas/voz-tratada.wav`);
  - los subtítulos como texto (`capas/subtitulos.srt`, se importa en CapCut, pero **pierde el estilo**: serif más clave en Anton);
  - las capas con alfa (`subs.mov`, `graficos.mov`) como superposición.
  - CapCut admite ProRes con alfa según su documentación; **no se ha probado aquí**.
- **No editable fuera del código:** el diseño exacto de subtítulos y tarjetas, y los zooms. Se cambian en `montaje.json` y `bloques.txt` y se vuelve a renderizar (unos 2 min).
- **Opción futura:** abrirlo en el editor de la Sala (sala-edicion.vercel.app/editor), que ya trabaja sobre un JSON de montaje. Falta adaptar `Muestra` al formato de la Sala.

## Límites
- No puedo escuchar: la voz se valida con medidas y volviendo a transcribir, no de oído.
- Licencias de la música y las fuentes de Luis sin verificar: no se usan para publicar.
