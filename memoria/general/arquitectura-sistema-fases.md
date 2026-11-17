---
name: arquitectura-sistema-fases
description: "Plan de optimización del sistema aprobado por fases (06-11-2026) — qué está hecho, qué NO está aprobado, decisiones de memoria y contradicciones resueltas"
metadata:
  node_type: memory
  type: project
  originSessionId: ee0e846e-677a-48a5-82b2-eed5c985a811
  modified: 2026-11-07T02:27:26.760Z
---

El 06-11-2026 el usuario aprobó la fase 1 y después la fase 2 (con dos cambios: Amin único cliente, y dar mucha importancia a video-editor). Fase 3 aprobada y hecha el 06-11 (Obsidian, aprendizaje, piloto HyperFrames, QC, evaluación). Lo siguiente NO está aprobado. Plan original en `~/EDICION/0 CLAUDE EDITOR/9 ARCHIVO (no se carga)/Informes/AUDITORÍA DEL SISTEMA - 2026-11-06.md`. Las fases 3 a 7 NO están aprobadas: no implementarlas sin su visto bueno. Informe de la fase 2: `0 CLAUDE EDITOR/FASE 2 - INFORME (2026-11-06).md`.

Objetivo que dijo: editar cada vez mejor, con menos errores, menos tokens y más autonomía. NO quiere más herramientas ni agentes.

**Fase 1 hecha (06-11):**
- Git local en `~/Videos-Remotion`, sin remoto, con un `.gitignore` de lista blanca (solo código y docs).
- `reel.js`: sin orden muestra la ayuda; registrar material exige `nuevo` o `sincronizar`.
- Recetas con JSON en `premiere/recetas/`, lanzadas con `correr-receta.sh`.
- Las 9 skills de HyperFrames con `disable-model-invocation: true`. Copia de los originales en `~/.claude/skills-respaldo/`.

**Fase 2 hecha (06-11):**
- Eric y Natalia archivados en `0 CLAUDE EDITOR/9 ARCHIVO (no se carga)/`; las lecciones de oficio están en `4 ENTRENAMIENTO/Lecciones generales de edición.md`.
- Director global en `~/.claude/CLAUDE.md`. ESTADO por trabajo en `7 TRABAJOS EN CURSO/` (`reel.js retomar`).
- `pr.sh` con guardia y errores con línea (`envoltura.js`). Las 9 recetas, probadas en `3 PROYECTOS/_PRUEBAS CLAUDE/`.
- Git local en `~/.claude` (skills y memoria) y en la bóveda (solo `.md`).
- Biblioteca de estilos en `8 BIBLIOTECA DE ESTILOS/`; inventario de video-editor.
- QC en `herramientas/qc`; HyperFrames listo para Premiere con `hyperframes/render-para-premiere.sh`.

**Fase 3 hecha (06-11):**
- Bóveda: `00 ÍNDICE.md`; ficha operativa de Amin (vigente / pendiente / historial); `PROPUESTAS DE REGLAS.md`; `EVALUACIÓN DE EDICIONES.md`.
- Aprendizaje: `foto-secuencia.sh` + `aprender.py` (TÉCNICA / ESTILO / VÍDEO); nada es regla sin aprobación.
- QC: `qc-colisiones.py` (cara con Vision, subtítulos y bandas), `cortes-voz.py`, `sincronia.py` (NO VERIFICADO si la palabra no es fiable).
- Piloto HyperFrames: 3 pruebas en `hyperframes/piloto/`; informe en `0 CLAUDE EDITOR/FASE 3 - INFORME (2026-11-06).md`.
- MediaPipe: no hace falta (Vision basta). WhisperX: prueba aislada pendiente de aprobación.
- **Trampa:** una orden de `pr.sh` sin respuesta se quedaba en cola y se ejecutaba al reabrir Premiere; ahora se retira.
- **Trampa:** la transcripción guardada del bruto IMG_6887 no es la voz de Amin (apuntador o charla); verificar con el audio antes de sincronizar.

**Fase 4 (07-11): entrenamiento real y transcripción.** El usuario cambió el foco: mejorar el criterio con material real, no acumular herramientas.
- Aprobó WhisperX y MediaPipe en entornos aislados (`herramientas/entornos/`). WhisperX + `voz/verificar-transcripcion.py` = transcripción para cortes y sincronía. MediaPipe se queda experimental (Vision es mejor para caras).
- Regla aprobada: gráfico y subtítulo no repiten la misma información sin necesidad (en Lecciones generales).
- **Trampa:** los nombres de las exportaciones de Amin NO corresponden a su bruto (IMG_6127.mp4 = bruto 6132; IMG_6123.mp4 / tener novia = 6124). Identificar por contenido: `0 CLAUDE EDITOR/4 ENTRENAMIENTO/Mapa brutos y exportaciones de Amin`.
- Entrenamiento 6124 comparado con su edición: mismas tomas en 9/11 bloques. Él recorta los puntos débiles, mete golpes en blanco y negro con 💀, rojo para lo negativo, subtítulo pequeño de una línea, encuadre más cerrado e imágenes reales. Lecciones P1–P9 PENDIENTES en `PROPUESTAS DE REGLAS.md`.

**Decisiones de memoria:**
- Obsidian será la memoria principal y la fuente de las reglas vigentes.
- Bóveda en `~/EDICION/0 CLAUDE EDITOR/`.
- No reorganizar ni borrar sus carpetas todavía.

**Contradicciones resueltas:**
- Eric: no hay peso global (ni 80 ni 83 kg); se usan los datos de cada vídeo.
- Amin: #1E8BFF es el color oficial provisional; el cian 0,250,255 es una variante pendiente.
- Natalia: el color de las claves de los subtítulos está pendiente; una corrección puntual no es norma.
- Amin: el alcance puede ser solo marcadores o edición completa, según el proyecto.
- Puente de Premiere: normalmente arranca solo; los pasos de recuperación están en la skill `premiere-puente`.

**HyperFrames:** no se elimina Remotion. Piloto futuro de 3 motion graphics, todavía no aprobado.

**Fase 5 (07-11, hecha; informe `0 CLAUDE EDITOR/FASE 5 - INFORME (2026-11-07).md`):** WhisperX aprobado como transcriptor por defecto (`voz/transcribir.sh`, `--respaldo` = viejo); estudio «Invisible – Marco Said» (ficha 08 de la biblioteca); 3 ejercicios; ronda 2 con IMG_6118 (11/12 tomas iguales, mejora pequeña y no concluyente). P3 rojo y P4 subtítulo pequeño = VARIANTES VISUALES PENDIENTES: no cambiar la identidad de Amin sin autorización. Pendiente del usuario: regla 8 (su 6118 pone lo malo a la IZQUIERDA, contra la ficha), estándar de subtítulo, notas de 6124/6118.
**Trampas de la fase 5:** el 07-11 a las 10:40 el usuario movió los brutos de Amin a Drive `RAW/CORTOS/Octubre/` (solo lectura) y casi todas sus exportaciones desaparecieron de `EXPORTADOS` (quedan IMG_6118_1, IMG_6123.mp4 y tener novia). Si After Effects tiene un proyecto suyo abierto con cambios, leerlo solo por script, sin abrir otro ni guardar. MOGRT v12 en secuencia de 1080 → escala 50.

**How to apply:** antes de cualquier cambio de estructura, mira qué fase está aprobada. Las reglas de cliente se leen en las FICHAS de la bóveda. Relacionado: [[claude-editor-entrenamiento]], [[organizacion-skills-y-proyecto]].

**Fase 8 (08-11): optimización y producción eficiente.**
- **Iniciada:** solo la 8A (auditoría), entregada en `0 CLAUDE EDITOR/FASE 8 - INFORME 8A AUDITORÍA (2026-11-08).md`.
- **8B y 8C NO están aprobadas.** No cambiar instrucciones, skills ni recetas hasta que el usuario lo apruebe.
- **Línea base 6887-08:** 269 M de tokens, 673 turnos y 0,39 M por turno. El 98,8 % es releer el contexto.
