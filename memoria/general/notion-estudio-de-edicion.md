---
name: notion-estudio-de-edicion
description: Notion hub "Estudio de Edición — Segundo Cerebro" that Claude maintains with workflow, client brands, system and decisions
metadata:
  type: reference
---

Notion hub created 2026-10-08 at workspace root of "Luiyi's Space": https://app.notion.com/p/8bdb898b7076440eb9c3dcd4245729d6
Sub-pages: Cómo trabajamos, Clientes (Amin Business; las páginas de clientes antiguos siguen en Notion sin tocar), Reels en curso, Sistema y herramientas, Aprendizajes de edición, Contenido con IA — mapa, Registro de decisiones. Page IDs in `~/Videos-Remotion/notion/estudio-paginas.json`.

The user asked Claude to keep it as the second brain of the editing work and allowed reorganizing his existing AI-content pages; so far nothing existing was moved (only an index with links and a proposed reorder awaiting "aplica el orden").
Writing uses the Notion private API with a temporary Brave session cookie (deleted after each use); scripts kept in `~/Videos-Remotion/notion/scripts/` (`crear-paginas.js <spaceId> <arbol.js>`, `crear-bd.js`, `rastrear.js`; they read cookies from `nt.txt` beside them; saveTransactionsFanout, root pages need `permissions` + space `pages` listAfter).
Related: [[clientes-y-carga-de-trabajo]], [[video-tooling-setup]].

2026-10-08: added "Guía de marca — <cliente>" pages inside each client page (IDs in `~/Videos-Remotion/notion/marca-<cliente>.json`). Brand proposals are Claude's and await the user's approval; do not treat them as agreed style until he confirms. Image blocks: upload works only as create block → `getUploadFileUrl` → PUT → `format.display_source` update (setting `properties.source` is rejected); rendering not visually confirmed.

2026-10-09: the user asked that what I learn from the videos they send be written into the second brain. Added under "Aprendizajes de edición" the page "Formación — 9 de octubre de 2026" (https://app.notion.com/p/b394227724eb4b919de596c10a73e9a4; IDs in `notion/formacion-1009.json`; source tree `notion/scripts/arbol-formacion-1009.js`) with five sub-pages: sound, colour and texture in motion graphics, colour grading in Premiere, the 20 Trials formats, and Amin subtitles/editable workflow. Do the same for future study sessions: one dated "Formación" page per day with a sub-page per topic. When YouTube blocks subtitles (HTTP 429), download low-res audio with yt-dlp and transcribe with `voz/transcribir.js --idioma english`.

2026-10-18: base "⏱️ Tiempos de edición" dentro del hub (https://app.notion.com/p/c9999df6286a44c98dfe33b4537b35dc; IDs en `notion/tiempos/bd.json`, script `notion/tiempos/crear.js`): Vídeo, Cliente, Fecha, minutos de Recorte / Subtítulos / Color / VFX / Buscando material / SFX y "Tiempo total (min)" por fórmula (AST antiguo de la API privada; no comprobado visualmente). Space id: 72c1a3f6-1a4c-8136-9913-00030eb75646 (getRecordValues da 500 cross-cell: usar syncRecordValues).
