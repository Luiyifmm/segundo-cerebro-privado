---
name: skill-motion-video-director
description: Skill "Motion Video Director" de Miftahul Islam Efaz instalada el 2026-10-10; qué es, dónde está y cómo se usa aquí
metadata:
  type: reference
---

El 2026-10-10 el usuario pasó https://github.com/Miftahul-Islam-Efaz/Motion-graphics-skill (v3.1.0) y pidió explicarla e interiorizarla. Instalada en `~/.claude/skills/motion-video-director/` (SKILL.md de 509 líneas + 5 scripts); clon en `~/Videos-Remotion/descargas-skills/motion-graphics-skill-efaz/`.

Revisada antes de instalar: los scripts solo comprueban herramientas, crean un `.env` vacío, analizan una referencia con ffmpeg y montan hojas de contacto; no instalan ni envían nada.

Es un manual de producción que hace vídeos enteros en código (Canvas/SVG/Three.js/GSAP en Chrome sin ventana → ffmpeg), sin After Effects ni Premiere, con voz de ElevenLabs y aprobaciones en guion, plan y vista previa. Su flujo no encaja tal cual con el del usuario (Premiere editable, voz real del cliente): lo que se usa es su criterio, resumido en `~/.claude/skills/edicion-video/criterio.md` (sección "Oficio de motion graphics…"). No se instalaron sus dependencias opcionales (Playwright, faster-whisper, Demucs, claves de Pixabay/Freesound/Unsplash/Firecrawl). Relacionado: [[skill-after-effects-editor]], [[video-tooling-setup]], [[estilo-objetivo-sproject]].
