# Render y entrega

> Lo probado en el PC del autor + lo útil del informe externo (marcado *(informe)*).

## Con el MCP (lo normal)
- `ae_render {comp, start, end, outputModule: "High Quality", outputPath: "…/render/X master.mov", overwrite: true, timeoutMinutes}`.
  - **Crear antes la carpeta `render`**: sin ella, AE se quedó con el aviso "Undo group mismatch" y no renderizó.
  - AE se bloquea mientras renderiza y Windows pone **"(No responde)"** en la ventana. El usuario creyó que se había colgado y lo cerró. **Antes de un render de más de 1 minuto, avisar de los minutos y de que no lo cierre.**
  - Medir antes: render de 1 s con la hora antes y después. Referencias: Classic 3D simple ~0,4 s por fotograma; Advanced 3D con desenfoque y sombras ~2,3 s; Cinema 4D ~1,6 s; Element con supersampling 2x ~3 s; con CC Force Motion Blur ×10 muestras, 133 s por segundo de vídeo.
- **Master a MP4:** `python scripts/master_a_mp4_audio.py "X master.mov"` → H.264 50 Mbps, AAC 320k si hay audio, BT.709, sin la pista de capítulos que mete AE.
  - `masters_a_mp4.py` pasa una carpeta entera, sin audio.
- **Revisar el MP4**, no el proyecto:
  - hojas de fotogramas (`hoja_video.py`, `tira_video.py`) y saltos (`revisar_video.py`);
  - comparación con la referencia (`comparar_momentos.py`);
  - el audio, con ffprobe.
  - El H.264 de AE sale sin etiqueta de color: leerlo como BT.709 o los rojos parecen mal.
- **Un render de más de 30 min:** Claude Code corta la llamada, pero AE sigue. No mandar órdenes; vigilar el archivo.
- **Reconstruir y renderizar en órdenes separadas**, con `app.purge(PurgeTarget.ALL_CACHES)`. Si AE lleva muchas horas y mucha memoria, reiniciarlo antes.
- **Un .mov que el proyecto usa como metraje no se puede sobrescribir:** renderizar con otro nombre y `item.replace(File)`.
- **Rutas con tildes:** el H.264 va bien; una secuencia TIFF falló. Renderizar a una ruta sin tildes y mover.
- **Media resolución** (`rqItem.setSettings({"Resolution": "Half"})`) para revisar: ~4× más rápido. Los trazos finos que brillan se pierden: el final, a resolución completa.

## Formatos de entrega
| Para | Formato | Cómo |
|---|---|---|
| YouTube, redes, cliente | MP4 H.264, ≥50 Mbps en 1080p y ≥100 en 4K (YouTube recomprime) | master → `master_a_mp4_audio.py` |
| Montar en Premiere con alfa | **ProRes 4444 con alfa** (plantilla *High Quality with Alpha*, premultiplicado) | `ae_render` con esa plantilla (4.92) |
| **OBS (alertas, overlays de stream) con alfa** | **WebM VP9 con alfa** | AE no lo exporta: ProRes 4444 o secuencia PNG con alfa → `ffmpeg -i in.mov -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 30 out.webm` *(informe, sin probar aquí: comprobar en OBS que se ve la transparencia)* |
| Web, apps | Lottie (plugin Bodymovin, gratis): solo formas, texto y transformaciones *(informe; no instalado)* | — |
| Plantilla editable para Premiere | `.mogrt`: propiedades en Gráficos esenciales + `comp.exportAsMotionGraphicsTemplate(true, carpeta)` (guardar antes el proyecto) *(informe)* | — |

## aerender (render sin abrir la interfaz) — informe
`"C:\Program Files\Adobe\Adobe After Effects 2026\Support Files\aerender.exe" -project x.aep -comp "FINAL" -output out.mov -OMtemplate "High Quality" -RStemplate "Best Settings" -s 0 -e 120 -mfr ON 100`. Ver `aerender -help`. Útil para renderizar mientras el usuario usa AE (otra instancia; consume RAM).

## Color
- Web y YouTube: sRGB / Rec.709. Proyecto a **16 bpc** contra las bandas en degradados oscuros, más grano 2,5–3 % (o Ramp Scatter).
- ACES 2.0 (26.5) solo si hay un flujo con EXR de Blender *(informe)*.
- **Lumetri: las ruedas y las curvas no se pueden tocar por script.** Sustitutos: Color Balance + el Contraste de Lumetri (4.109).

## GPU (probado con una RTX de 16 GB) — informe
- Drivers **NVIDIA Studio** recientes, con instalación limpia. Hay reportes en el foro de cuelgues de AE 2026 con tarjetas Blackwell, sin confirmar.
- *Mercury GPU Acceleration (CUDA)* en los ajustes del proyecto y caché de disco en un NVMe.
- En Advanced 3D, previsualizar con *Draft 3D* y calidad baja.
- 16 GB de VRAM limitan los hilos del *Multi-Frame Rendering*.
