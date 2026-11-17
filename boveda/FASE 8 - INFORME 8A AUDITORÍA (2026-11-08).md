---
tipo: informe de fase
fase: 8A (auditoría de eficiencia)
fecha: 2026-11-08
estado: entregado, pendiente de aprobación. NO se ha cambiado nada del sistema.
---
# Fase 8A: auditoría de eficiencia

**Qué he hecho:** solo leer y medir.
- No he modificado instrucciones, skills, memoria ni scripts.
- El único archivo nuevo es este informe, más una línea en la memoria de fases.

**Marcas:**
- 📏 **Medido:** con datos de los registros de sesión o de los archivos.
- 💭 **Estimado:** razonado, sin medir.
- Ninguna optimización se ha probado todavía. Este informe no afirma que ninguna ahorre tokens.

## 0. De dónde salen los datos
- 📏 **Registro de la sesión del 6887-08** (`~/.claude/projects/-Users-luiyi-EDICION/0d22a94f….jsonl`, 138 MB):
  - del 07-11, 23:43, al 08-11, 15:58 (UTC), con pausas;
  - 33 peticiones tuyas, 673 respuestas del modelo y 2 compactaciones.
- 📏 **Otra sesión de EDICION** (07-11): 22 respuestas y 1,9 M de tokens. Las sesiones antiguas están en `~/.claude/projects/-Users-luiyi/` (594 MB) y en las carpetas de cada trabajo. No las he analizado a fondo.
- 📏 **Script de medida:** `consumo.py`, en la carpeta temporal de esta sesión. Cuenta tokens por respuesta, herramientas y operaciones.
- **Lo que NO se puede medir:**
  - el coste en dinero: el registro da tokens, no precio;
  - tu tiempo real de trabajo;
  - los picos de RAM;
  - qué parte de cada turno son instrucciones fijas y qué parte conversación.

## 1. Los cinco problemas principales

### 1) Sesiones muy largas: cada turno vuelve a leer todo el contexto · impacto MUY ALTO
- 📏 **Total del 6887-08:** **269 M de tokens procesados**. El 98,8 % es lectura de caché, es decir, el modelo releyendo la conversación en cada turno. De salida, solo 0,7 M.
- 📏 **Media:** 0,39 M de tokens por turno.
- 📏 **El tamaño del contexto manda:**

| Petición | Tokens | Turnos | Por turno |
|---|---|---|---|
| «Sí, la de Radiohead» (antes de compactar) | 20,5 M | 22 | ≈ 0,93 M |
| «zoom out + lista 6/6» (justo tras compactar) | 13,1 M | 67 | ≈ 0,20 M |

  - Un turno con el contexto lleno cuesta unas **4–5 veces** más que uno con el contexto recién resumido.
- 📏 **Las peticiones más caras:**
  - «Aprobado tal cual»: montaje completo, 39,3 M (14,6 %);
  - «Ya está cerrado»: plantilla de AE, 22,8 M;
  - búsqueda de referencias en TikTok: 20,7 M;
  - música: 20,5 M.
- **Causa:** un único vídeo en una única conversación, de la dirección creativa a la entrega, más tres rondas de pruebas de entrenamiento mezcladas.

### 2) Imágenes que se quedan en el contexto · impacto ALTO
- 📏 **132 lecturas de imagen** (hojas, recortes, fotogramas) en una sesión.
- 💭 **Coste:** cada imagen ocupa del orden de 1.000–2.000 tokens y se relee en todos los turnos siguientes. Se multiplica con el problema 1.
- 📏 **Hojas montadas con ffmpeg:** 100. Fotogramas exportados desde Premiere: 31 veces.
- **Lo que sobra:**
  - hojas grandes a 2160 px de ancho cuando bastaba un recorte de la zona dudosa;
  - varias hojas del mismo momento.
- **Lo que no sobra:** la revisión con mis ojos. Encontró fallos reales que los números no vieron: el PNG de franjas sin alfa, el roce del «7» con el pelo y el título que salía de golpe.

### 3) Scripts escritos a mano en lugar de recetas · impacto MEDIO-ALTO
- 📏 **Scripts:** 71 en `08/scripts/` para un solo vídeo; 119 escritos a mano en la sesión; 22 usos de recetas.
- 📏 **Duplicados de recetas que ya existen:**
  - **exportar:** 19 scripts de exportación propios, con `recetas/exportar.jsx` ya hecha;
  - **leer:** 20 lecturas de secuencia ad hoc, con `leer-secuencia.jsx`;
  - **fotogramas:** fotogramas propios, con `fotogramas.jsx`.
- **Coste:**
  - tokens de salida y de contexto;
  - errores evitables: guardia con la secuencia equivocada, rutas mal escritas, un PNG sin alfa, un `grep` vacío que obligó a repetir.
- **Lo que faltaba en las recetas y me hizo escribir a mano:**
  - exportar solo el audio (WAV) o con nombre de versión;
  - leer la cadena de efectos de audio;
  - clonar una secuencia y renombrarla;
  - montar una hoja de fotogramas.

### 4) Recalcular lo que ya era válido · impacto MEDIO
- 📏 **Transcripciones:** se volvió a transcribir cada versión exportada (A completo v2.1 → v2.7: 12 archivos en `salida-whisperx/`), aunque solo cambiaban los SFX o la música y la voz era la misma.
- 📏 **Exportaciones:**
  - **48 exportaciones completas** desde Premiere en 4K;
  - la carpeta `_PRUEBAS CLAUDE/6887-08` tiene **37 MP4** y ocupa **11 GB**;
  - cada exportación de 4K tarda alrededor de un minuto y pesa unos 290 MB;
  - 💭 para comprobar el sonido bastaba un WAV de la mezcla (segundos), y para la imagen, 3–4 fotogramas.
- 📏 **Sonoridad:** 39 medidas. Algunas, de archivos que no habían cambiado.
- **Bien resuelto:** se reutilizaron las medidas de la referencia y la transcripción del bruto («palabras-version-usuario.json»).

### 5) Instrucciones duplicadas o contradictorias y memoria partida · impacto MEDIO (riesgo para la calidad)
- 📏 **Contradicciones vigentes:**

| Dónde | Dice | Choca con |
|---|---|---|
| skill `edicion-video` (27 KB) | «Acento de Amin: siempre azul», «plantilla vigente v8» | `clientes` («v12») y la regla de editar según el formato (memoria `editar-segun-formato`) |
| skill `clientes` y `direccion-viral` | «Dirección: natural, elegante y sencilla» como estilo de Amin | CLAUDE.md: «no hay un estilo único para Amin: se edita según el formato» |
| `direccion-viral` | cita la memoria `direccion-edicion-natural-y-elegante.md` | no está en la memoria de este proyecto |
| CLAUDE.md | cita la memoria `arquitectura-sistema-fases` | está en `~/.claude/projects/-Users-luiyi/memory/` y **no se carga** si la sesión empieza en `~/EDICION` |

- 📏 **Memoria partida en dos carpetas** según dónde abras Claude:
  - `-Users-luiyi`: 23 memorias;
  - `-Users-luiyi-EDICION`: 1.
- 📏 **El ESTADO de 6887-08 mide 13,7 KB (168 líneas) y funciona como bitácora:** mezcla el estado actual con todo el historial. Para retomar hay que leerlo entero.
- 📏 **Peso de las skills:** las descripciones de todas se cargan siempre (≈ 9 KB solo las tuyas). Hay skills enormes que se cargan al invocarlas: `motion-video-director` 62 KB, `real-sfx` 50 KB, `edicion-video` 27 KB y `earshot` 22 KB.
  - 💭 En este vídeo no se usaron `motion-video-director` ni `real-sfx`: no costaron nada. No he podido medir si alguna se cargó sin hacer falta.

## 2. Qué consume más y con qué evidencia
1. 📏 **Releer el contexto en cada turno:** 98,8 % de los tokens, porque las sesiones son largas.
2. 💭 **Imágenes acumuladas:** 132. Son la parte del contexto que más crece por cada revisión.
3. 📏 **Turnos por petición:** 20,4 de media. Muchos son scripts de un solo uso y sus errores.
4. 📏 **Disco y tiempo:** 11 GB en exportaciones intermedias de un solo vídeo.
5. 💭 **RAM (16 GB):** Premiere, After Effects y WhisperX o MediaPipe abiertos a la vez. No lo medí, pero hoy no hubo cuelgues. Conviene no lanzar a la vez WhisperX y una exportación 4K.

## 3. Herramientas e instrucciones duplicadas
- **Recetas frente a scripts sueltos:** `exportar`, `leer-secuencia` y `fotogramas` existen, pero se reescriben en cada vídeo (sección 1.3).
- **Detección de caras:** `caras` (Vision, la recomendada desde la fase 4) y `mp-caras.py` (MediaPipe, experimental). Hoy usé MediaPipe. Sobra una vía.
- **Plantillas de subtítulos de Amin:** v8, v12, «fino», «SF limpio» y «Jordan v4». Cada skill nombra una «vigente» distinta.
- **Motion:** HyperFrames y Remotion. HyperFrames ya no se carga solo, así que no consume. No hay duplicado activo.
- **Reglas de estilo:** el mismo tema se repite con versiones distintas en la ficha, `clientes`, `edicion-video` y `direccion-viral` (sección 1.5).

## 4. Optimizaciones propuestas (de más a menos impacto)

| # | Propuesta | Impacto 💭 | Riesgo para la calidad | Reversible |
|---|---|---|---|---|
| 1 | **Una sesión por etapa del vídeo** (dirección → montaje → sonido → QC y entrega). Al cerrar cada etapa, el ESTADO hace de traspaso y la siguiente empieza de cero leyendo solo eso | Muy alto: la evidencia de 4–5 veces por turno lo apoya | Bajo, si el traspaso es bueno | Sí |
| 2 | **ESTADO corto + BITÁCORA aparte.** ESTADO de ≤ 40 líneas (dónde estamos, decisiones vigentes, pendiente, no verificado); la historia va en `<trabajo> · BITÁCORA.md` y no se carga | Alto: menos lectura al retomar | Bajo: no se borra nada, se mueve | Sí |
| 3 | **Protocolo visual barato:** primero la medida numérica (caras, colisiones, alfa); después **una sola hoja pequeña** (≤ 1600 px) o un recorte de la zona dudosa; la hoja completa, solo en la revisión final | Alto | Medio: no quitar la revisión final con mis ojos | Sí |
| 4 | **Ampliar las recetas que ya existen**, no crear herramientas: `exportar` (WAV de audio, nombre de versión, no sobrescribir), `leer-secuencia` (cadena de audio y efectos), `fotogramas` (más una hoja), clonar secuencia | Medio-alto: menos scripts y menos errores | Bajo: se prueban en `_PRUEBAS CLAUDE` | Sí (git) |
| 5 | **Reglas de validez** para reutilizar resultados (tabla en la sección 5) | Medio | Bajo, si se respetan los disparadores de recálculo | Sí |
| 6 | **Limpiar contradicciones:** `edicion-video` y `clientes` remiten a la ficha y a «según el formato»; arreglar las dos memorias citadas que no existen; elegir una carpeta de memoria | Medio, sobre todo en calidad (menos dudas) | Bajo: no se borra nada, se corrige y se archiva | Sí (git en `~/.claude`) |
| 7 | **Dos modos** (PRODUCCIÓN / ENTRENAMIENTO) en el director global, en ≤ 8 líneas: en producción nada nuevo sin explicar antes beneficio y coste | Medio: evita mezclar como en el 6887-08 | Bajo | Sí |
| 8 | **Exportaciones intermedias:** del sonido, WAV; de la imagen, fotogramas; MP4 4K solo para enseñarte una versión. Las intermedias se marcan para que decidas si van a la Papelera | Medio: disco y minutos | Bajo | Sí |

## 5. Mejoras que no tocan la calidad (y cuándo recalcular)

| Resultado | Se reutiliza mientras… | Se recalcula si… |
|---|---|---|
| Transcripción WhisperX **del bruto** | el bruto sea el mismo (nombre, duración y tamaño) | cambia el bruto o el canal de voz |
| Palabras de la **versión montada** | no cambian los cortes de voz (A1/A2) | cambia el montaje: entonces se recalculan los tiempos desde el bruto (sin retranscribir) y se comprueba la sincronía del nuevo render |
| Transcripción de un **render** | — | solo si cambia la voz; no por SFX, música o gráficos |
| Mapa de tomas y tiempos | no cambia el montaje | cambia V1/A1/A2 |
| Análisis de audio (sonoridad, márgenes) | el WAV de la mezcla no ha cambiado | cambia cualquier clip de audio, efecto o nivel: se mide un WAV nuevo, no un MP4 |
| Caras y colisiones | no cambian el montaje, el zoom ni los gráficos de esa zona | cambia cualquiera de ellos |
| Fotogramas extraídos | el render es el mismo | hay render nuevo |
| QC con «LIMPIO» | el mismo archivo | hay render nuevo. Y un «LIMPIO» no aprueba nada creativo |
| Referencias analizadas | siempre: se citan, no se vuelven a analizar | quieres otra lectura |
| Recursos autorizados (música, SFX) | dentro del vídeo y para el uso aprobado | otro vídeo u otro uso: se pregunta |

**Sin coste de calidad:**
- WAV en vez de MP4 para iterar el sonido;
- no retranscribir renders cuando no cambia la voz;
- usar las recetas existentes;
- ESTADO corto;
- un solo detector de caras (Vision).

## 6. Cómo mediremos
- **Registro por vídeo:** una fila por vídeo en `7 TRABAJOS EN CURSO/_REGISTRO DE EFICIENCIA.md`, con estas columnas:
  - vídeo, formato, fecha;
  - sesiones, peticiones, turnos;
  - tokens procesados y por turno (de `consumo.py`);
  - versiones enseñadas, exportaciones 4K, imágenes leídas, scripts nuevos frente a recetas;
  - correcciones tuyas y tiempo en correcciones (si lo apuntas tú);
  - problemas técnicos;
  - **tu nota creativa** (1–10) y si se acerca al mensaje del brief.
- **Línea base, el 6887-08:**

| Medida | Valor |
|---|---|
| Tokens | 269 M |
| Turnos | 673 |
| Peticiones | 33 |
| Tokens por turno | 0,39 M |
| Imágenes | 132 |
| Exportaciones 4K | 48 |
| Scripts nuevos | 71 |
| Disco | 11 GB |
| Nota creativa | la pones tú: dijiste que es buena |

  - Nota: mezcla producción con mucho entrenamiento (pruebas A/B/C, Jordan, A2–A5), así que la comparación justa es con la parte de producción.
- **Cómo se compara:**
  - con vídeos del **mismo formato**;
  - se cuenta como mejora **solo** si baja el consumo y tu nota no baja;
  - si baja la nota, la optimización se revierte.

## 7. Plan breve
**8B · Optimización (después de tu aprobación, en este orden y de una en una):**
1. ESTADO corto + bitácora (propuesta 2), probado con 6887-08: lo muevo, no borro nada.
2. Modos y traspaso por etapas en el director global (propuestas 1 y 7): unas 10 líneas.
3. Limpiar contradicciones (propuesta 6): te enseño el diff antes de aplicarlo y lo guardo en git.
4. Ampliar `exportar`, `leer-secuencia` y `fotogramas` (propuesta 4), probadas en `_PRUEBAS CLAUDE`.
5. Protocolo visual y reglas de validez (propuestas 3, 5 y 8), por escrito en el QC.
6. `_REGISTRO DE EFICIENCIA.md` + `consumo.py` en `herramientas/` (es un script de lectura, sin dependencias).

**8C · Validación:**
- Un vídeo real nuevo de Amin, idealmente del mismo formato (lista o consejos a cámara), en MODO PRODUCCIÓN, con sesiones por etapa.
- Se compara con la línea base: tokens por turno, turnos, imágenes, exportaciones, correcciones y **tu nota**.
- Si la calidad baja, se revierte lo que lo haya causado.

## Pendiente fuera de la fase
- **A4:** la voz sale ≈ 12,6 dB más baja que en A5, por algo del mezclador. Espera tu captura.
- **Secuencia de medida:** queda «_MEDIDA voz A5», que se puede borrar con tu permiso.
- **Exportaciones intermedias:** las de 6887-08 (11 GB) siguen ahí. Se decide en 8B (propuesta 8).

---
# 8B.1 · Contexto y memoria (08-11): hecho, pendiente de revisión
- **Instantánea previa en git:** `~/.claude` b803b90 · bóveda 0208e97 · `~/Videos-Remotion` 17518cb.
- **Archivos cambiados:**
  - `~/.claude/CLAUDE.md`: jerarquía de decisiones, dos modos, sesiones por etapa con traspaso, ESTADO ≤ 40 líneas + bitácora, ruta completa de la memoria de fases;
  - `7 TRABAJOS EN CURSO/_PLANTILLA ESTADO.md`: modo, enlace a la bitácora y bloque «Traspaso»;
  - `6887-08.md`: resumen operativo (13.658 → 3.212 bytes);
  - `6887-08 · BITÁCORA.md` (nuevo): todo el ESTADO anterior, íntegro (comprobado con `diff`);
  - skill `edicion-video`: 4 líneas marcadas como «Histórico» que remiten a la FICHA («siempre azul» pasa a «el que diga la FICHA»);
  - skill `direccion-viral`: 4 referencias de memoria con ruta completa;
  - `memory/MEMORY.md` de EDICION: un puntero a las memorias antiguas.
- **Sin tocar:** `reel.js` (crea su ESTADO por su cuenta y no usa la plantilla: queda para 8B.2) y la FICHA.
- **Conflicto creativo NO resuelto** (espera al usuario):
  - FICHA n.º 2 «Natural y elegante, sin sobrecarga» (decidido con Amin, 10-10), y n.º 3/5 (azul, v12);
  - frente a «no hay un estilo único: según el formato, ni minimalismo por obligación» (usuario, 07-11).
- **Pendiente de confirmar, sin cambiar:** FICHA «Transcripción: usar el guion» frente a WhisperX + verificador, aprobado en la fase 4.

## 8B.1 · Cierre (08-11)
- **Aprobada por el usuario.** Conflictos resueltos con su decisión:
  1. **Identidad ≠ estilo único:** FICHA, regla 2, con una aclaración. Las reglas 3 y 5 dicen ahora «predeterminado» (azul y v12). La skill `clientes` va alineada.
  2. **Guion frente a audio:** FICHA, «Transcripción». El guion es la referencia; los subtítulos salen del audio verificado; WhisperX da los tiempos, revisando sus errores; las diferencias que cambian el sentido se señalan.
- **No se borró ninguna regla histórica:** la línea antigua de la FICHA queda como «Histórico», y la del MANUAL del 06-11, anotada.
- **Búsqueda de contradicciones:**
  - no quedan textos vivos que digan «estilo único» o «usar el guion»;
  - los BRIEF antiguos (6887-03/09/10/11/13) que citan «natural y elegante» son decisiones de su vídeo y no se tocan;
  - las carpetas de exportación del método son copias fechadas.
- **Commits:** bóveda 694e9c5, `~/.claude` af89655.
- **Incidencia de audio A4:** sigue abierta, fuera de la fase 8. El usuario no autoriza tocar el mezclador ni el audio.

# 8B.2 · Herramientas y procesamiento (08-11)
**Punto de vuelta:** `~/Videos-Remotion` 17518cb (limpio). Pruebas solo en la copia de pruebas de 6887-08, en secuencias de Claude, con el guardia.

## Inventario: 71 scripts de 6887-08 (`08/scripts/`)
| Operación | Scripts | ¿Había receta? | Por qué no se usó / qué faltaba |
|---|---|---|---|
| Exportar MP4 | 19 (18, 23, 25, 30, 32–46 pares, 49, 54, 56, 58, 61; y 62–63 mezclados con cambios) | ✅ `exportar.jsx` | no activaba la secuencia por nombre ni volvía a la anterior; no exportaba solo audio (WAV) |
| Cambiar nivel de clips por nombre | 12 (05, 06, 07, 07b, 07c, 33, 35, 37, 43, 62, 64, 65) | ❌ | no existe; cada vez se reescribe la fórmula `10^((dB−15)/20)` |
| Mover o recortar tiempos de clips | 7 (14, 15, 22, 27, 39, 45, 63) | ❌ | cada caso es distinto: no compensa receta |
| Duplicar secuencia y renombrar | 2 sueltos (16, 50) + dentro de 20, 24, 26, 47, 59 y 60 | ❌ | no existe |
| Fotogramas y lecturas | 4 (09, 21, 48, 51) + unas 20 lecturas ad hoc en la sesión | ✅ `fotogramas.jsx`, `leer-secuencia.jsx` | `leer-secuencia` no lee la cadena de efectos de audio ni sus valores; no hay hoja de fotogramas |
| Abrir copia y crear secuencia | 2 (01, 02) | ✅ `abrir-secuencia.jsx` | — |
| Construcción creativa (montaje, subtítulos, lista, zooms, SFX, música, franjas) | 24 | parcial (`mogrt-textos`, `sfx-colocar`) | trabajo propio del vídeo: no se automatiza |
| Reintentos del mismo script | 6 (03b, 07b, 07c, 17a–c) | — | errores corregidos sobre la marcha |

- **Lo que más se repite:** exportar (19) y niveles (12) suman 31 de 71. Siguen duplicar (8 apariciones) y lecturas (≈ 24).
- **Fuera de Premiere:** 12 retranscripciones de renders sin cambios de voz y 48 exportaciones 4K. Lo resuelven las reglas de validez y el WAV, no un script nuevo.

## Mejoras (una a una, probada cada una antes de seguir)
| # | Cambio | Prueba (en la copia de 6887-08, secuencias de Claude o solo lectura) | Resultado | Commit |
|---|---|---|---|---|
| m1 | `exportar.jsx`: `"secuencia"`, `"audio"` (WAV), vuelta a la secuencia activa, comprueba la extensión | se niega con la extensión mal, la secuencia inexistente y el archivo existente; WAV frente a MP4 de A5 | ✅ WAV en **3 s y 6 MB**; MP4 en **124 s y 291 MB**; sonoridad −10,6 / −10,5 LUFS; vuelve a la secuencia | e993407 |
| m2 | `clonar-secuencia.jsx` (nueva receta) | se niega con el origen inexistente y el nombre usado; clona «_MEDIDA» | ✅ copia con 172/87 clips y la misma duración; la activa no cambia | 283256e |
| m3 | `leer-secuencia.jsx`: `"audio"`, `"solo"` | sin opciones, misma salida (259 clips, mismas claves); con audio, cadena de efectos de A5 | ✅ (no lee el mezclador: límite de Premiere, escrito en la receta) | 8147ce1 |
| m4 | `hoja.sh` (shell) | 4 fotogramas 4K de A5 → hoja mirada; 1 y 3 fotogramas; no sobrescribe | ✅ 1600×740 px con rótulos | e6a4219 |
| m5 | Protocolo visual + reglas de validez en `herramientas/qc/LEEME.md` | — (texto) | la revisión final con mis ojos se mantiene | 8c3b3b2 |
| m6 | `reel.js` crea el ESTADO desde `_PLANTILLA ESTADO.md` (traspaso y modo) | `REEL_RAIZ` y `REEL_BOVEDA` en carpeta temporal; con plantilla y sin ella | ✅ `reels.json` real intacto (md5) | 870915f |
| m7 | `niveles-clips.jsx` (aprobada después del cierre, 08-11): nivel por nombre de clip, simula por defecto | clon «_PRUEBA receta clonar»: simulación, 2 errores, −3 dB a 21 clips de voz, vuelta con `"dB":-6` | ✅ valores releídos; WAV de vuelta idéntico al original. La mezcla solo bajó 0,5 LUFS y el pico siguió en −6,0 dBFS. Comportamiento **pendiente de diagnóstico** (no demuestra por sí solo un limitador o compresor; no investigado, va con la incidencia de audio) | (este commit) |
| — | `premiere-puente` remite a estas recetas | — | — | `~/.claude` f87a8b7 |

**Incidente durante la prueba de m1:**
- Lancé la prueba en paralelo con la escritura de la receta. La escritura falló, así que corrió la receta vieja: dos MP4 de A4 con nombre `.wav`, en la carpeta temporal.
- No cambió nada del proyecto. Esos dos archivos están en la Papelera, igual que el MP4 de control.
- **Lección:** no lanzar la prueba en el mismo paso que el cambio que prueba.

**Dato observado y no tocado:** A5 mide ahora −10,6 LUFS con pico +0,2 dBFS. Tras el script 64 medía −16,3, y yo no la he cambiado. Está anotado en la incidencia de audio (ESTADO de 6887-08).

**Queda en la copia de pruebas:** la secuencia «_PRUEBA receta clonar (Claude, se puede borrar)». Se conserva por ahora (decisión del usuario, 08-11).

**Hecho tras tu sí (08-11):** `niveles-clips.jsx`, fila m7. Sustituye a los 12 scripts de niveles; ahorro aún no medido en un vídeo real.

**Ahorro:** demostrado solo en tiempo y disco de exportación (WAV frente a MP4). En tokens y turnos no está medido: se mide en 8B.3/8C.

**8B.2 cerrada (08-11, aprobada por el usuario).** `niveles-clips.jsx` queda como receta reutilizable; su modo predeterminado sigue siendo la simulación.

# 8B.3 · Registro de eficiencia (08-11)

**Qué he hecho:**
- `~/Videos-Remotion/herramientas/consumo/consumo.py` + `precios.json` + `LEEME.md` (con los límites). Parte del script temporal de 8A. Solo lectura y sin dependencias.
- `7 TRABAJOS EN CURSO/_REGISTRO DE EFICIENCIA.md`, con dos tablas:
  - A, automática: consumo;
  - B, manual: versiones, correcciones, problemas, tu nota y la cercanía al BRIEF.
- Regla escrita en recetas/LEEME y en `premiere-puente`: una orden a Premiere cada vez.
- Referencias en `00 ÍNDICE` y en `Videos-Remotion/CLAUDE.md`.
- ESTADO 6887-08: el hallazgo de A5 queda como «sin diagnosticar». La diferencia de sonoridad del clon queda como «comportamiento pendiente de diagnóstico», no como limitador.

## Métricas verificadas: base 6887-08
Medida sobre una COPIA del registro `0d22a94f`, cortada antes del mensaje «FASE 8»: del 07-11 23:43 al 08-11 15:57 UTC.

| Medida | Valor | Cómo se verificó |
|---|---|---|
| Sesiones / peticiones tuyas / compactaciones | 1 / 30 / 2 | peticiones = mensajes con `origin: human` |
| Llamadas al modelo | 669 | ids únicos; ninguno repetido con uso distinto |
| **Contexto** (no es dinero) | media 396 k por llamada · mediana 306 k · máx 965 k · total 264,9 M | entrada + caché escrita + caché leída |
| **Tokens facturables** (Opus 5.5) | entrada 1,5 k · escritura de caché 1 h 2,40 M · lectura de caché 262,5 M · salida 708 k (262 k de razonamiento) | registro |
| **Coste estimado** (equivalente API) | **85,89 USD** = lectura de caché 52,50 + escritura 19,23 + salida 14,16 | tarifa validada contra la app (abajo) |
| Exportaciones | **49 MP4, 7,4 GB** en `_PRUEBAS CLAUDE/6887-08` | disco; por comandos solo se detectan 32 |
| Scripts `.jsx` de sesión / recetas usadas | 114 / 23 | registro |
| Imágenes leídas | 132 | registro |
| Errores de herramienta | 25 | registro |

- **Validación del coste:** `precios.json` sobre los tokens que la app atribuye a la sesión da 96,4542 USD, igual que su `cost-state` (96,4542).
  - `consumo.py` cortado a la hora de esa foto da 95,44 USD (−1,1 %). Lo que falta son llamadas que no quedan en el registro: compactaciones y llamadas auxiliares.
- **Sobre las cifras de 8A** (269 M de tokens, 673 turnos, 33 peticiones, 48 exportaciones):
  - 8A sumaba también la salida y las llamadas del propio análisis de 8A;
  - contaba como peticiones algunos avisos automáticos;
  - contaba como exportaciones las palabras «exportar» en los comandos.
  - Las cifras de arriba sustituyen a las de 8A como referencia.
- **Fase 8 hasta ahora** (desde «FASE 8» hasta las 22:15): 4 peticiones, 119 llamadas, 2 compactaciones, contexto medio 235 k, **11,46 USD** equivalentes.
- **Las 5 peticiones más caras de la base:**

| Petición | Coste |
|---|---|
| abrir una referencia («No tengo la referencia a la mano…») | 12,88 USD |
| «Aprobado tal cual» (montaje) | 10,31 USD |
| plantilla de AE | 5,65 USD |
| búsqueda en TikTok | 5,27 USD |
| música | 5,19 USD |

## Pruebas de la herramienta
- Solo lectura:
  - md5 de la copia del registro igual antes y después;
  - md5 de un registro original (`7b4964c8`) igual antes y después.
- Se niega a sobrescribir; sesión inexistente → error claro; corte por petición y por hora; varias fuentes; búsqueda por texto. Tarda 0,4 s con 140 MB.

## Comprobaciones pedidas
- **Recetas nuevas documentadas:** exportar, clonar-secuencia, leer-secuencia, niveles-clips y hoja.sh están en recetas/LEEME, en la skill `premiere-puente` y en disco. ✅
- **Pruebas en Premiere en serie:** 184 órdenes a Premiere en toda la sesión (21 en la fase 8). Ninguna en paralelo ni en segundo plano.
  - El único caso marcado era un listado de archivos que nombra `pr.sh`, no una ejecución.
  - Los comandos con varias órdenes las ejecutan en serie. ✅

## Límites (detalle en el LEEME de la herramienta)
- No ve las compactaciones ni las llamadas auxiliares (≈ 1 % por debajo de la app).
- Coste ≠ factura con suscripción. Precio de caché de Haiku 5.5 supuesto, sin confirmar.
- No separa producción de entrenamiento dentro de una misma sesión.
- El tiempo activo es aproximado.
- No mide calidad.

## No verificado
- La parte de producción pura de 6887-08: la base incluye tres rondas de entrenamiento.
- Cuántas versiones viste realmente y cuántas correcciones hiciste: no queda en el registro (tabla B, la rellenas tú).
- El ahorro de las mejoras de 8B en tokens: no medido. Se mide en 8C.

# Propuesta para 8C · Cómo medir el ahorro real (no iniciada: se revisa antes)

1. **Vídeo:**
   - el próximo vídeo real de Amin, a ser posible del mismo formato (lista o consejos a cámara);
   - MODO PRODUCCIÓN, sin entrenamiento mezclado;
   - una sesión por etapa: dirección, corte, propuesta, QC y entrega, cambios.
   - Si llega un formato distinto, se mide igual y se compara con cautela.
2. **Qué se mide** (por etapa y total):
   - **principales:** coste equivalente de API por vídeo, contexto medio por llamada, llamadas al modelo, compactaciones;
   - **de proceso:** tus peticiones, exportaciones en disco, imágenes leídas, scripts de sesión frente a recetas, errores;
   - **de calidad (tuyas):** nota de 1 a 10, cercanía al BRIEF, número de correcciones.
3. **De dónde salen los totales:**
   - `cost-state` de la app al cerrar cada sesión, porque incluye las compactaciones;
   - `consumo.py` para el desglose, usando una copia del registro.
4. **Normalizar:** apuntar también la duración del vídeo final y el número de brutos y tomas, para comparar por minuto entregado.
5. **Base justa** (necesita tu decisión), dos opciones:
   - (a) la base total de 6887-08, que está inflada por el entrenamiento;
   - (b) una base de «solo producción»: te enseño la lista de las 30 peticiones, marcas cuáles fueron entrenamiento, y las mido aparte.
   - Recomiendo la (b).
6. **Criterio de éxito** (a fijar por ti antes de empezar):
   - mejora = baja el coste por minuto **y** tu nota no baja;
   - si baja la nota, se revierte.
   - Propuesta de umbral: −30 % de contexto medio por llamada y −30 % de coste, con la misma nota.
7. **No se toca en 8C:**
   - la conversación de dirección creativa;
   - las referencias;
   - la revisión del mensaje;
   - la elección de tomas;
   - la sincronía de los subtítulos;
   - el control de composición;
   - el QC técnico;
   - tu aprobación final.

# 8B cerrada · 8C en preparación (08-11)
- **El usuario aprobó** cerrar 8B y preparar 8C.
- Protocolo, base cerrada y vídeo recomendado (6887-13) en `FASE 8C - PROTOCOLO DE MEDICIÓN (2026-11-08).md`.
- **No se ha montado nada:** falta que apruebe el vídeo y la dirección creativa.
