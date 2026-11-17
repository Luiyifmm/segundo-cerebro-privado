# Fase 3: informe (06-11-2026)

**Lo que no he hecho:**
- no he instalado nada (ni MediaPipe ni WhisperX);
- no he borrado nada;
- no he tocado ningún proyecto real. Todo se probó en `3 PROYECTOS/_PRUEBAS CLAUDE/`, y tu bruto y tu edición de Amin solo se leyeron.

## 1. Estructura de la bóveda (`~/EDICION/0 CLAUDE EDITOR/`)
```
00 ÍNDICE.md                     ← lo primero que leo (1 KB)
00 CÓMO FUNCIONA.md              ← cómo entrenarme (con las carpetas nuevas)
1 REFERENCIAS/                   ← tus referencias y las analizadas
2 CLIENTES/AMIN/FICHA.md         ← ficha operativa: reglas vigentes · alcance · valores · estilos aprobados ·
                                   referencias · correcciones confirmadas · PENDIENTE de confirmar · historial
4 ENTRENAMIENTO/
   Lecciones generales de edición.md    ← oficio (vale para cualquier vídeo)
   PROPUESTAS DE REGLAS.md              ← lo que aprendo, PENDIENTE de tu aprobación
   REGISTRO DE CORRECCIONES.md          ← historial de lo aprobado
   EVALUACIÓN DE EDICIONES.md           ← notas por versión (¿mejoramos?)
   MediaPipe y WhisperX — ¿hacen falta.md
7 TRABAJOS EN CURSO/             ← un ESTADO por vídeo (decisiones de UN vídeo) + fotos/ para el aprendizaje
8 BIBLIOTECA DE ESTILOS/         ← 7 estilos como opciones + ejemplos (incluidos los del piloto)
9 ARCHIVO (no se carga)/         ← historia y clientes antiguos
.obsidian/app.json               ← Obsidian no indexa el archivo, el taller ni las referencias pesadas
```
**Para abrirla:** Obsidian › "Abrir carpeta como bóveda" › `0 CLAUDE EDITOR`.

**Contradicción nueva, sin decidir** (en la ficha, como "pendiente"): la corrección del 30-10 para el sistema automático de Amin dice la clave en Nyght cursiva roja u oro; en Premiere la clave va en SF Pro azul.

## 2. Aprendizaje de tus correcciones
1. Al entregar: `herramientas/qc/foto-secuencia.sh <trabajo> antes "<proyecto>" "<secuencia>"` (solo lee, con guardia).
2. Cuando retocas a mano: lo mismo con `despues`.
3. `herramientas/qc/aprender.py antes.json despues.json --trabajo <ID> --mios "<mis clips>" --escribir`:
   - lista cada **cambio exacto** (movido, recortado, texto campo a campo, nivel en dB, escala, posición, efectos, activado, borrado o añadido);
   - **lo clasifica** en: **TÉCNICA** (sincronía ≤ 3 f, ortografía o mayúsculas, nivel de voz), **ESTILO** (se repite o toca la estética de mis clips) o **VÍDEO** (solo ese vídeo);
   - **propone** explicación y regla, como **PENDIENTE**, en `PROPUESTAS DE REGLAS.md`.
4. Yo reviso cada fila y te pregunto. **Tú apruebas o descartas.** Solo entonces va a la ficha (estilo) o a "Lecciones generales" (técnica), con su línea en el REGISTRO.

**Probado dos veces** en el proyecto de pruebas, con retoques simulados:
- 1.ª ronda: 3 cambios → TÉCNICA (sincronía +2 f) y ESTILO ×2 (bajar −4 dB mis sonidos);
- 2.ª ronda: 4 cambios → VÍDEO (texto reescrito), TÉCNICA (mayúscula), ESTILO (sombra añadida a mi gráfico), VÍDEO (clip desactivado).

## 3 y 4. Piloto HyperFrames: tres pruebas y su evaluación
Detalle y justificación de cada una en `7 TRABAJOS EN CURSO/PILOTO HYPERFRAMES (fase 3).md`; las notas, en `EVALUACIÓN DE EDICIONES.md`.

| | 01 Blue pill | 02 Explicativo números y objetos | 03 Collage Vox en azul Amin |
|---|---|---|---|
| Fuente editable | `hyperframes/piloto/01-blue-pill/index.html` | `…/02-explicativo-10h/index.html` + `cues.json` | `…/03-vox-collage/index.html` + recorte |
| Render para Premiere | `01-blue-pill v2.mov` (9 s) | `02-explicativo v3.mov` (13,5 s) | `03-vox-collage v3.mov` (30 s) |
| Composición y alfa en Premiere | ✅ sobre tu edición | ✅ sobre el bruto y sobre tu edición | ✅ inserto opaco |
| QC automático | ✅ limpio (v1: tapaba el pelo y solapaba texto) | ✅ limpio (v1: fuera de margen y sobre la cabeza) | ✅ (v1–v2: errores de animación) |
| Revisión a ojo | **Repite el texto de tu subtítulo** | Pierde lectura sobre la ilustración final | El sello roza el texto; estático tras 2 s |
| Sincronía | — | **NO VERIFICADA** (ver 5) | — |
| Autoría | ~1.000 tokens de código | ~1.100 | ~1.000 |
| Nota (autoevaluación) | **19/25** | **17/25** | **18/25** |

**Comparación con Remotion** (componente parecido, contador con alfa):

| | Render | Duración | Código |
|---|---|---|---|
| Remotion | 4,3 s | 4,4 s | 46 líneas |
| HyperFrames | 13,5 s | 5,5 s | 47 líneas |

- **Remotion** renderiza ~2,5× más rápido y no necesita recodificar.
- **HyperFrames** es HTML más fácil de retocar, trae vocabulario y estilos, y tiene herramientas de inspección.
- **Mi lectura:** ninguno sustituye al otro. HyperFrames para gráficos nuevos de estilo; Remotion para lo que ya funciona.

## 5. Comprobaciones automáticas (resultados)
| Comprobación | Resultado |
|---|---|
| Colisiones (cara con Vision, subtítulos y 4 bandas) | ✅ Cazó la cara y el solape del piloto 01 v1, y el margen del 02 v1. Corregido: **dio "LIMPIO" con 0 fotogramas revisados** por un fallo del filtro; ahora falla si no revisa nada |
| Detector de caras (Vision, sin instalar nada) | ✅ confianza 0,87–0,92 en Amin |
| Cortes con voz | ✅ montaje limpio → limpio; corte en plena voz → detectado (medido en el audio) |
| Frases repetidas | ✅ detecta la toma repetida "te tiene … 10 horas en el" (tras mejorarlo: antes solo veía repeticiones idénticas y pegadas) |
| Sincronía ±2 f | ⚠️ los elementos del gráfico se miden bien; **las 5 palabras quedan NO VERIFICADAS** (voz continua con música y Whisper small) |
| Ciclo de aprendizaje | ✅ 2 rondas |
| Composición en Premiere (3 pruebas) | ✅ alfa correcto; un fallo mío de escala (4K al 100 %) corregido |

## 6. Errores sin resolver
1. **Sincronía de palabra a ±2 fotogramas:** no medible con Whisper small. Propuesta: prueba aislada de WhisperX, con tu aprobación.
2. **La transcripción guardada del bruto IMG_6887 no es la voz de Amin:** en 20–26 s hay silencio; en 8–17 s, charla. Probablemente transcribe la voz de apuntador. Hace falta transcribir solo por encima del nivel de su voz, o separar voces.
3. **La banda de subtítulos** está medida a mano en un vídeo (y ≈ 1030–1210). Habría que leerla de los propios MOGRT o de los fotogramas de cada secuencia.
4. **Los scripts no ven** repeticiones de texto entre gráfico y subtítulo, lectura sobre fondos cargados ni gusto. Eso lo cubre la revisión a ojo, que sigue siendo obligatoria.
5. **Las pruebas son 1080×1920:** falta probar el render 4K nativo.
6. **Riesgo encontrado y corregido:** una orden de `pr.sh` sin respuesta quedaba en cola y **se ejecutó al reabrir Premiere** (aplicó dos veces un retoque de prueba, solo en el proyecto de pruebas). Ahora se retira.
7. **Contradicción del color de la clave de Amin** (pendiente de ti).

## 7. Próximas mejoras recomendadas
1. **Tu opinión sobre las 3 pruebas** (y tu nota en la evaluación). Si alguna convence, probarla en un vídeo real de Amin con tu permiso.
2. **Regla creativa propuesta** (pendiente de tu aprobación): un gráfico nunca repite el texto del subtítulo que está en pantalla; o enseña otra cosa (objeto, cifra) o el subtítulo se aparta.
3. **WhisperX en prueba aislada**, para medir la sincronía y nombrar bien la palabra cortada.
4. **Banda de subtítulos automática** (leída de la secuencia) en `qc-colisiones`.
5. **Usar el ciclo de aprendizaje en el próximo vídeo real de Amin:** foto al entregar y foto cuando lo retoques.
6. **Aprovechar la Biblioteca:** para cada vídeo de Amin propondré un estilo de la biblioteca y lo evaluaré con la tabla, para ver si las notas suben y tus correcciones bajan.

## Git
| Repositorio | Commits | Remoto | Pendiente |
|---|---|---|---|
| `~/Videos-Remotion` | 12 | ninguno | limpio |
| `~/.claude` | 7 | ninguno | limpio |
| bóveda | 6 | ninguno | limpio |
