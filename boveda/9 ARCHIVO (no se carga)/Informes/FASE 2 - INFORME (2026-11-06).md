# Fase 2 — informe (06-11-2026)

No he instalado nada, no he ejecutado instaladores de terceros, no he borrado nada definitivamente y no he tocado ningún proyecto real de Premiere. Las pruebas se hicieron en `3 PROYECTOS/_PRUEBAS CLAUDE/`.

## 1. Cambios
| Qué | Dónde |
|---|---|
| Director global corto (3 KB, se carga siempre) | `~/.claude/CLAUDE.md` |
| ESTADO por trabajo + plantilla | `0 CLAUDE EDITOR/7 TRABAJOS EN CURSO/` (creado el de IMG_6887); `reel.js nuevo` lo crea solo y `reel.js retomar <reel>` lo muestra |
| Guardia de proyecto y secuencia + errores con línea real | `premiere/envoltura.js`, `premiere/pr.sh`; clave `"guardia"` en `correr-receta.sh` |
| Recetas nuevas y probadas | `guardar-proyectos` (opción `solo`), `leer-secuencia.jsx` |
| Control de calidad y aprendizaje | `herramientas/qc/qc-zona-segura.py`, `comparar-secuencias.py`, `LEEME.md` |
| HyperFrames para Premiere | `hyperframes/animaciones-casa.js` (propio), `ejemplo-amin/`, `render-para-premiere.sh` |
| Biblioteca de estilos (8 notas + 9 ejemplos visuales) | `0 CLAUDE EDITOR/8 BIBLIOTECA DE ESTILOS/` |
| Inventario de video-editor | `0 CLAUDE EDITOR/INVENTARIO video-editor (2026-11-06).md` |
| Git de skills y memoria | `~/.claude` (lista blanca; fuera binarios, credenciales y skills de Anthropic) |
| Git de la bóveda | `~/EDICION/0 CLAUDE EDITOR` (solo `.md`; fuera vídeos y enlaces) |
| `reel.js`: Amin único cliente activo | No registra ni corta en lote a clientes archivados; el panel solo muestra a Amin |

## 2. Eric y Natalia
**Fuera del sistema activo:**
- skill `clientes`: solo Amin;
- skill `subtitulos-reels`, archivada en `~/.claude/skills-archivo/`; su flujo técnico pasó a `subtitulos`;
- memoria `eric-estilo-propuesta-final`, archivada en `~/.claude/memoria-archivo/`;
- preferencias de Eric y Natalia retiradas de: `edicion-video`, `primer-corte`, `portadas`, `direccion-viral`, `color-hdr`, `criterio.md`, 10 memorias, el índice `MEMORY.md`, el manual, `CLAUDE.md` del taller, el registro de correcciones y `reel.js` (clientes activos y panel).

**Archivado** en `0 CLAUDE EDITOR/9 ARCHIVO (no se carga)/2026-11-06 Eric y Natalia (clientes antiguos)/`:
- sus 3 fichas, incluidas Eric YouTube, con sus enlaces a vídeos y referencias;
- copias íntegras de las skills, memorias y notas tal como estaban.

**Convertido en aprendizaje:** `4 ENTRENAMIENTO/Lecciones generales de edición.md`, unas 35 reglas de oficio sin preferencias de marca. Las filas de Eric y Natalia del registro de correcciones pasaron a "General".

**Sin tocar:** sus brutos, exportados, carpetas TERMINADO, proyectos de Premiere, componentes de Remotion (`Eric*.tsx`, `Natalia.tsx`) y sus 11 reels en `reels.json`.

## 3. video-editor
Detalle en el inventario. En resumen:
- **Integrado y probado (implementación propia):**
  - el estado por trabajo;
  - la guardia del puente con errores por línea;
  - la foto y comparación de secuencias (aprender de los retoques);
  - el control de zona segura;
  - el vocabulario de animación;
  - el render de HyperFrames con alfa para Premiere.
- **En la biblioteca:** Talking Head Explainer, TikTok raw, YouTube por defecto, Liquid glass, Vox collage y Blue pill.
- **Candidatas:**
  - `cut-proof` (corte transcrito y comparado con el guion);
  - `frame-proof` (fotogramas sin caché);
  - nivel de voz medido;
  - B-roll propio indexado;
  - `clipper`;
  - los encuadres por cara (MediaPipe, a instalar);
  - WhisperX (a instalar);
  - las skills extra de HyperFrames para el piloto.
- **Bloqueado:** sus 152 SFX y 30 LUT (sin licencia ni origen), sus instaladores y permisos amplios, y su MCP de Premiere (el nuestro funciona).
- **HyperFrames:** no se cambia de versión. Su referencia se renderiza bien con nuestra 0.9.19.

## 4. Pruebas
| Prueba | Resultado |
|---|---|
| Git: revisión de contenido y secretos antes de cada primer commit (3 repositorios) | ✅ solo menciones en documentación |
| `reel.js` en copias (sin orden, ayuda, desconocida, panel, descargas, parar, sincronizar ×2, nuevo eric, panel solo Amin, retomar, ESTADO) | ✅ todas; datos reales idénticos (SHA-1). 1 fallo mío intermedio (`vivos`) detectado por la prueba y corregido |
| Guardia en vivo: proyecto equivocado, secuencia equivocada, correcto | ✅ bloquea / bloquea / pasa |
| Envoltura: error con número de línea | ✅ tras 2 intentos fallidos: el panel rechaza `eval` (*Script validation failed*) y el número de línea venía desplazado; ahora se calcula en tiempo de ejecución |
| Las 9 recetas con JSON y guardia en el proyecto de pruebas | ✅ las 9, con valores leídos de vuelta y fotogramas |
| `leer-secuencia` + `comparar-secuencias` con un retoque simulado | ✅ detectó los 3 cambios exactos |
| `qc-zona-segura`: limpio / invasión arriba / sin alfa | ✅ 0 / 1 / 2 |
| HyperFrames: su referencia con 0.9.19 | ✅ (aviso: ruta de una fuente) |
| HyperFrames → Premiere | ❌ el primer intento salió con fondo negro y halo (ffmpeg 6.0); ✅ con `render-para-premiere.sh` |
| Skills de HyperFrames sin cargarse | ⚠️ sin verificar: solo se ve en una sesión nueva |

## 5. Git
| Repositorio | Commits | Remoto | Pendiente |
|---|---|---|---|
| `~/Videos-Remotion` | 8 | ninguno | limpio |
| `~/.claude` (skills y memoria) | 5 | ninguno | limpio |
| `~/EDICION/0 CLAUDE EDITOR` (notas) | 3 | ninguno | limpio |

## 6. Problemas encontrados
1. **Alfa de HyperFrames ignorado por Premiere** (ffmpeg 6.0). Resuelto con la recodificación.
2. **El panel del puente rechaza `eval`.** El envoltorio se rehízo sin él.
3. **`exportFramePNG` y la caché:** sin resolver del todo (candidata `frame-proof`).
4. **Imágenes de la bóveda fuera de git** (solo `.md`): los ejemplos visuales no tienen historial.
5. **Las 9 skills de HyperFrames** pueden reactivarse si se ejecuta `hyperframes skills update`.
6. **Premiere sigue abierto** con el proyecto de pruebas (`_PRUEBAS CLAUDE/…/Prueba recetas Claude.prproj`); se puede cerrar sin guardar nada más.

## 7. Propuesta para la fase 3 (Obsidian y calidad creativa)
1. **Bóveda de Obsidian de verdad:**
   - abrir `0 CLAUDE EDITOR` como bóveda (lo haces tú: Obsidian › "Abrir carpeta como bóveda");
   - `00 ÍNDICE.md` de 1 KB;
   - ficha de Amin con "Reglas vigentes" cortas y sustituibles, más un historial aparte.
2. **Ciclo de aprendizaje automático en cada entrega:** foto antes y después + comparación → propuesta de regla en una línea para que la apruebes.
3. **Calidad creativa con Amin:**
   - **piloto de 3 motion graphics** en HyperFrames con el vocabulario de la casa y un estilo de la biblioteca (Blue pill o Vox collage con #1E8BFF);
   - para cada uno: render, QC, prueba en Premiere y tu opinión;
   - comparar tiempo y correcciones con Remotion.
4. **Dos comprobaciones nuevas antes de enseñarte nada:**
   - `cut-proof` (palabras cortadas o dobles);
   - sincronía con la palabra (cada gráfico a ±2 fotogramas de su palabra).
5. **Aprobación que necesito para ir más allá:** instalar MediaPipe (encuadres por cara) y WhisperX (corte más preciso), una por una y con prueba.
