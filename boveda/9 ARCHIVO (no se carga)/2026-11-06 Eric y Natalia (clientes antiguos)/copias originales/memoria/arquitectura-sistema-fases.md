---
name: arquitectura-sistema-fases
description: "Plan de optimización del sistema aprobado por fases (06-11-2026) — qué está hecho, qué NO está aprobado, decisiones de memoria y contradicciones resueltas"
metadata:
  node_type: memory
  type: project
  originSessionId: ee0e846e-677a-48a5-82b2-eed5c985a811
  modified: 2026-11-07T02:27:26.760Z
---

El 06-11-2026 el usuario aprobó SOLO la fase 1 de la auditoría (`~/EDICION/0 CLAUDE EDITOR/AUDITORÍA DEL SISTEMA - 2026-11-06.md`). Las fases 2 a 7 NO están aprobadas: no implementarlas sin su visto bueno.

Objetivo que dijo: editar cada vez mejor, con menos errores, menos tokens y más autonomía. NO quiere más herramientas ni agentes.

**Fase 1 hecha (06-11):**
- Git local en `~/Videos-Remotion`, sin remoto, con un `.gitignore` de lista blanca (solo código y docs).
- `reel.js`: sin orden muestra la ayuda; registrar material exige `nuevo` o `sincronizar`.
- Recetas con JSON en `premiere/recetas/`, lanzadas con `correr-receta.sh`.
- Las 9 skills de HyperFrames con `disable-model-invocation: true`. Copia de los originales en `~/.claude/skills-respaldo/`.

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

**How to apply:** antes de cualquier cambio de estructura, mira qué fase está aprobada. Las reglas de cliente se leen en las FICHAS de la bóveda. Relacionado: [[claude-editor-entrenamiento]], [[organizacion-skills-y-proyecto]].
