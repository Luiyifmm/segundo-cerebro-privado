---
tipo: informe
fecha: 2026-11-14
estado: lo AÑADIDO está hecho · todo lo que MUEVE, FUNDE o ARCHIVA está PROPUESTO y espera tu sí
---
# Auditoría del sistema de edición con IA (14-11-2026)

## Resumen
El sistema tiene buenas piezas (transcripción verificada, recetas de Premiere con guardia, QC, bóveda con estados) pero **le faltaba la puerta de entrada**: nada decía, en orden, qué hacer con un vídeo ni qué skill cargar. La prueba está en los registros: en 121 sesiones solo se han invocado 7 de las 28 skills. Eso ya está añadido. Lo que queda es limpiar, y eso lo decides tú.

## 1. Medido
| Qué | Dato |
|---|---|
| Skills instaladas | 28 (30 con las dos de hoy) · 340 KB de instrucciones |
| Descripciones siempre cargadas | ≈ 11.000 caracteres ≈ 2.750 tokens por sesión |
| Skills invocadas alguna vez (121 sesiones) | `premiere-puente` 11 · `portadas` 4 · `real-sfx` 2 · `clientes` 2 · `after-effects-editor` 2 · `primer-corte` 1 · `direccion-viral` 1 |
| Nunca invocadas | `edicion-video` (27 KB), `motion-video-director` (62 KB), `edicion-premium`, `earshot` (la skill; el MCP sí se usa), las 3 de `hyperframes`, `media-use`, `figma`, `remotion-*`, `reverse-any-video`, `slideshow`, `style-sampling`, `color-hdr`, `cambiar-fondo`, `cortar-silencios`, `subtitulos` |
| Scripts sueltos en `~/Videos-Remotion/premiere/` | 224 `.jsx` de vídeos concretos (amin-, eric-, nat-), mezclados con el puente |
| Informes en la raíz de la bóveda | 13 `.md` (fases 1–8, auditorías, inventario) |
| Reglas duplicadas | «Reglas que no se negocian» está en `~/.claude/CLAUDE.md` y en `~/Videos-Remotion/CLAUDE.md` |

El recuento de skills es un mínimo: una skill también se puede leer como archivo sin invocarla.

## 2. Hecho hoy (solo añadidos; nada borrado ni movido)
| Añadido | Para qué |
|---|---|
| Skill `editor-maestro` | La puerta de entrada: 8 pasos con su orden, lo que sale, cuándo está hecho y cuándo parar; tabla de qué skill para qué; los errores que ya pasaron |
| `sistema/preparar-clip.sh` | El arranque de Joseph en una orden: transcripción por palabra en ms + hojas de fotogramas + corte de silencios + plan de escenas |
| `sistema/plan-escenas.py` | El documento de plan: casillas vacías a la izquierda, cada línea del guion a la derecha; calcula el reparto y avisa si hay más de 5 s de A-roll; botón «Copiar plan» |
| Skills `talking-head-premium` y `minimal-corto` | Método y estilo, con 16 reglas medidas |
| Estilos 10 y 11 + auditoría del estilo | Libro de reglas, adaptación fitness y script que puntúa un vídeo |
| Punteros | En `~/Videos-Remotion/CLAUDE.md`, en la skill `cortar-silencios` y en el índice de estilos |
| graphify | Instalado, sin ejecutar |

**Probado:** `preparar-clip.sh` con el bruto de Miguel: 51,8 s → 34,4 s (el corte que ya tienes en Premiere mide 34,6 s), 108 palabras verificadas, plan de 22 líneas. **No probado:** que otro modelo siga `editor-maestro` de principio a fin.

## 3. Propuesto (espera tu sí, uno a uno)
| # | Propuesta | Gana | Riesgo |
|---|---|---|---|
| P1 | **Actualizar `~/.claude/CLAUDE.md`:** hoy dice «cliente activo: Amin» y nada de los alumnos de Trainer10x ni de Víctor Hugo; añadir una línea «cargar primero `editor-maestro`» | Que cada sesión empiece bien | Bajo. Es tu archivo: te paso el texto exacto |
| P2 | **Quitar del taller las reglas duplicadas** y dejar un enlace a las globales; corregir «Premiere 2026» (es la 27) | Una sola fuente | Bajo |
| P3 | **Archivar skills que no se usan** en `~/.claude/skills-archivo/` (se recuperan moviendo la carpeta): `slideshow`, `style-sampling`, `reverse-any-video`, `remotion-to-hyperframes`, `figma`, `media-use` | ≈ 1.800 caracteres menos por sesión y menos confusión al elegir | Medio: confirma antes que no las usas a mano |
| P4 | **Fundir `edicion-video` (27 KB) y `motion-video-director` (62 KB):** lo vigente pasa a `editor-maestro` y a la biblioteca de estilos; el resto, al archivo. `edicion-video` aún habla de Eric y Natalia | La mayor reducción de texto | Alto: hay que leerlas enteras antes; propongo hacerlo en una sesión aparte |
| P5 | **Mover los 224 scripts sueltos** de `premiere/` a `premiere/_historico/`, dejando solo `pr.sh`, el puente y `recetas/` | Listar la carpeta deja de llenar el contexto | Medio: comprobar antes que ninguna receta los llama |
| P6 | **Mover los 13 informes** de la raíz de la bóveda a `9 ARCHIVO (no se carga)/Informes/` | Raíz limpia | Bajo |
| P7 | **Conectar el editor automático de alumnos** (`edicion-motor`: `editor.md`, `director.md`, `revisor.md`) con el estilo 11: que su «árbitro» use la misma auditoría | Un solo criterio para lo manual y lo automático | Medio: toca el motor real de Amin; primero en copia con `--local` |
| P8 | **Transcripción con idioma automático** (hoy es español por defecto y un vídeo en inglés sale traducido mal) | Evita un error que ya pasó dos veces hoy | Bajo |
| P9 | **Ejecutar graphify** sobre la bóveda y el taller, y medir si ahorra de verdad | Búsquedas sin leer archivos enteros | Bajo; puede no compensar |
| P10 | **Estudiar el sonido** de las referencias con `earshot` | El hueco más grande de los dos estilos | Bajo |

## 4. Lo que NO recomiendo
- Instalar `claude-mem`, `caveman`, `rtk` u `OpenMontage`: duplican lo que ya tienes o están pensados para programar.
- Borrar nada: todo lo anterior es mover a una carpeta de archivo.
- Fiarse de «cualquier modelo lo hará igual» sin probarlo: propongo una prueba real (abajo).

## 5. Prueba que falta para dar el sistema por bueno
Abrir una sesión nueva, con un modelo más pequeño, y darle solo: «edita este vídeo» + un bruto. Si sigue los 8 pasos de `editor-maestro`, para donde debe y entrega el mensaje en tres partes, el sistema funciona. Lo que falle se corrige en la skill, no en el chat.

## 6. Aplicado el 14-11 con tu sí (P1, P2, P6, P8)
| # | Qué se hizo | Copia de seguridad | Comprobado |
|---|---|---|---|
| P1 | `~/.claude/CLAUDE.md`: clientes activos (Amin + alumnos de Trainer10x; Víctor Hugo prospecto), «cargar primero `editor-maestro`» y fila de `preparar-clip.sh` | `~/.claude/CLAUDE.md.copia-2026-11-14` | Leído de vuelta. Tiene efecto en la PRÓXIMA sesión |
| P2 | `~/Videos-Remotion/CLAUDE.md`: fuera las 4 reglas duplicadas (enlace a las globales), Premiere 27, clientes al día | `CLAUDE.md.copia-2026-11-14` | Leído de vuelta |
| P6 | 8 informes (fases 1–6, auditoría e inventario del 06-11) movidos a `9 ARCHIVO (no se carga)/Informes/`. Se quedan en la raíz los de la fase 8 (en curso) y el manual | Es un movimiento: están enteros en el archivo | Una ruta que apuntaba a la auditoría vieja, corregida en la memoria de fases |
| P8 | `voz/transcribir-whisperx.py`: idioma `auto` por defecto; avisa si detecta algo que no es español ni inglés. `preparar-clip.sh` usa `auto` | `transcribir-whisperx.py.copia-antes-idioma-auto` | Un vídeo en inglés (r25) y uno en español (Kevin) salieron cada uno en su idioma |

**No comprobado:** `primer-corte.js` y el editor automático de alumnos usan su propio parámetro de idioma y no se han tocado.
