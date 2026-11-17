---
name: skill-after-effects-editor
description: Skill de After Effects de Solazzo instalada el 2026-10-10; qué trae, de dónde salió y qué le falta para funcionar entera en este Mac
metadata:
  type: reference
---

El 2026-10-10 el usuario pidió descargar la skill `after-effects-editor` de https://prompts-after-effects.pages.dev (Solazzo, gratis, zip de 321 KB, versión del 02/10/2026). Está instalada en `~/.claude/skills/after-effects-editor/` (SKILL.md, `references/` con recetas, trampas de scripting, matchnames y reglas de oro, y `scripts/` con librerías .jsx y utilidades .py). Copia del zip en `~/Videos-Remotion/descargas-skills/`.

La revisé antes de instalar: sin red, sin borrados fuera de las comps que crea, Python solo llama a ffmpeg/ffprobe; sus normas piden permiso antes de descargar y no tocar proyectos ajenos.

Limitaciones aquí (comprobadas leyendo la skill, no probadas en AE):
- Está escrita y probada en Windows con AE 26.5; rutas de fuentes y los `.ps1` de voz son de Windows.
- Sus herramientas `ae_*` vienen del MCP `23d1/after-effects-mcp`: instalado el 2026-10-10 en `~/after-effects-mcp` (revisado antes: sin red, usa osascript y archivos temporales; `node scripts/doctor.mjs` pasó todo con AE 26.5) y registrado como `after-effects` en `~/.claude.json` (copia previa: `~/.claude.json.copia-antes-de-after-effects-mcp`). Las herramientas aparecen solo en sesiones nuevas. Mientras tanto, o si falla, sigue valiendo `~/Videos-Remotion/ae/run.sh <jsx>` (ver [[video-tooling-setup]]).
- La web ofrece además tres prompts (básico 2D, intermedio 3D, maestro) que se generan pegando el transcript del vídeo.
