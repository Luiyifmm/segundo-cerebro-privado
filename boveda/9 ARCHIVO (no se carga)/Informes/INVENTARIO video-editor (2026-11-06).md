---
tipo: inventario
actualizado: 2026-11-06
fuente: ~/Downloads/video-editor (v2026.10.16)
---
# Inventario de video-editor frente a nuestro sistema

**Leyenda:**
- ✅ **integrado y probado:** versión propia, funcionando aquí;
- 🧪 **candidata:** vale la pena; necesita prueba o aprobación;
- 📚 **en la biblioteca:** estilo como opción;
- ⛔ **bloqueada o descartada**, con el motivo.

**Licencia:** el paquete **no tiene licencia general**. Solo `talking-head-recut` declara ser una adaptación de un proyecto MIT (vtake-skills) y conserva el aviso. Regla aplicada: se adoptan ideas y números con implementación propia; no se copia su código ni sus recursos a producción.

## Flujo y estado
| Suyo | Nuestro antes | Decisión |
|---|---|---|
| Línea de 8 pasos con `RUN.md` por trabajo (sobrevive a la compactación) | Nada equivalente | ✅ `ESTADO.md` por trabajo en `7 TRABAJOS EN CURSO/`, creado por `reel.js nuevo`; `reel.js retomar` |
| `bake-preset`: lo aprendido en un vídeo pasa a su estilo | Registro de correcciones manual | ✅ ciclo: foto antes/después + `comparar-secuencias.py` → ficha o lecciones |
| Reglas: arreglar la fuente, cambios quirúrgicos, revisión solo de gusto, última toma | Parcial | ✅ en el director y en "Lecciones generales" |

## Premiere
| Suyo | Nuestro antes | Decisión |
|---|---|---|
| Contrato del puente: una línea, `ERROR @ línea`, guardia de proyecto activo | `pr.sh` sin guardia, error genérico | ✅ `envoltura.js` + guardia de proyecto **y** secuencia (sin `eval`, que nuestro panel rechaza) |
| `timeline-dump --diff` (detecta tus retoques a mano) | Nada | ✅ `leer-secuencia.jsx` + `comparar-secuencias.py` |
| `frame-proof` (limpia la caché de previsualización antes de sacar fotogramas) | Sabíamos que `exportFramePNG` da caché | 🧪 añadir a la receta `fotogramas` |
| `cut-proof` (exporta el audio del corte, lo transcribe y lo compara con el guion) | Transcripción local disponible | 🧪 buena candidata: caza sílabas cortadas y palabras dobles |
| `place-sfx --diff/--adopt` + `sfx-plan` (sonidos según los gráficos colocados) | `sfx-colocar.jsx` | 🧪 la parte "--diff" ya la cubre `comparar-secuencias` |
| `audio-polish` / `voice-gain` (voz a −17 LUFS antes del limitador a −6 dBFS) | `earshot` mide | 🧪 regla de nivel de voz para Amin |
| `grade-lut` (aplica un LUT como Look de Lumetri) | `lumetri-copiar.jsx` | ⛔ sus 30 LUT sin licencia conocida; el mecanismo, candidato |
| Exportar sin Media Encoder (`exportAsMediaDirect`) | Media Encoder (gasta 8–11 GB) | 🧪 tú prefieres AME: opción para lotes |
| Su MCP de Premiere (otro repositorio, clonado) | Nuestro MCP + `pr.sh` funcionando | ⛔ no se sustituye |

## Motion graphics
| Suyo | Nuestro antes | Decisión |
|---|---|---|
| Vocabulario de animación (riseIn, pop, slam, riseOut, draw-on, float) | Remotion caso a caso | ✅ `hyperframes/animaciones-casa.js` (propio) + ejemplo de Amin |
| Gráficos a 12 fps con brillo y grano / capturas fluidas con líneas de barrido | — | 📚 en la biblioteca |
| Fondos `bg-dark` / `bg-light` | Fondos de Remotion | 📚 (con #1E8BFF para Amin) |
| Títulos de sección letra a letra con desenfoque de movimiento | — | 📚 🧪 |
| Resaltados con seguimiento (rotulador amarillo / caja roja) sobre grabaciones de pantalla | — | 🧪 para Amin, si enseña capturas |
| HyperFrames fijado en 0.8.105 | 0.9.19 | ✅ **no se cambia**: su referencia se renderiza bien con 0.9.19 |
| Render con alfa | — | ✅ `render-para-premiere.sh`: HyperFrames con ffmpeg 6 da un alfa que Premiere ignora; recodificado con el ffmpeg de Remotion, correcto |
| Skills extra de HyperFrames (animation, creative, keyframes, audio, studio, core) | Tenemos `hyperframes`, `-cli`, `-registry` (desactivadas) | 🧪 para el piloto de 3 motion graphics |

## Montaje, B-roll y talking head
| Suyo | Nuestro antes | Decisión |
|---|---|---|
| `rough-cut` con WhisperX large-v3 + alineado por palabra | Whisper small local + cortes por volumen | 🧪 más preciso, pero instalación pesada: pedir aprobación |
| Encuadres S/T/W/F/O medidos sobre la cara (`face-frame`, MediaPipe) | Zoom manual | 📚 + 🧪 (MediaPipe no instalado) |
| `broll-own`: indexa tu carpeta de B-roll y lo coloca a pantalla completa | B-roll a mano | 🧪 |
| `clipper`: de un vídeo largo saca clips cortos | — | 🧪 para vídeos largos de Amin |
| `talking-head-recut` (tarjetas sobre una entrevista; derivado de MIT) | — | 🧪 el único con licencia clara |
| `background-music`: cama plana a −20 dB, salida de 2 s | Criterio propio (−11 a −18 dB bajo la voz) | 🧪 regla simple para Amin, cuando él elija la música |

## Sonido
| Suyo | Nuestro antes | Decisión |
|---|---|---|
| "El sonido es el objeto literal"; cara, subtítulos y salidas en silencio | Un sonido por cambio | 📚 añadido como opción |
| 152 efectos de sonido | Biblioteca propia en Drive + `real-sfx` | ⛔ sin licencia ni origen: no se usan |

## Control de calidad
| Suyo | Nuestro antes | Decisión |
|---|---|---|
| `graphics-qa(-short)`: defectos objetivos antes de enseñarte nada | Fotogramas a ojo | ✅ `qc-zona-segura.py` (zona segura y alfa); 🧪 colisiones entre elementos y sincronía con la palabra |
| `change-events --sync` (cada suceso cae en su palabra, medido en el render) | — | 🧪 |
| Revisión con subagente de "ojos frescos" | — | ⛔ por ahora (sin agentes hasta que haga falta) |

## Instalación y permisos (no ejecutado nada)
- `setup.sh`, `setup-premiere.sh`, `update.py`: **no ejecutados**.
  - Instalan con brew, npm y pip, clonan repositorios y escriben en `~/.video-editor`.
  - Su `.claude/settings.json` concede permisos automáticos amplios (`brew install`, `npm install`, `pip install`, `git clone`) y un gancho de inicio. **No adoptado.**
- Dependencias que sus scripts piden por `uv` (se descargan al ejecutar): numpy, matplotlib, mediapipe, opencv, WhisperX… Instalar cualquiera necesita tu aprobación.
