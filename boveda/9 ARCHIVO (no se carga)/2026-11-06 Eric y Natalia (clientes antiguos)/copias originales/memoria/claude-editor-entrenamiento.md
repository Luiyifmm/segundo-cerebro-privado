---
name: claude-editor-entrenamiento
description: "Hub ~/EDICION/0 CLAUDE EDITOR created 2026-10-30 where the user trains Claude — references, client FICHAs, training inbox and corrections log"
metadata:
  node_type: memory
  type: project
  originSessionId: f0f52be6-d772-4b02-932f-ddbb96885324
  modified: 2026-10-30T16:34:21.390Z
---

On 2026-10-30 the user asked to "optimizar nuestro trabajo": tidy the files, delete what no longer serves, and create a "Claude Editor" folder "donde vamos a guardar referencias, clientes, skills y ahí te voy a ir entrenando para que seas el mejor editando vídeos".

Built `~/EDICION/0 CLAUDE EDITOR/` (guide in `00 CÓMO FUNCIONA.md`):
- `1 REFERENCIAS/` holds `Tuyas/` (moved from `EDICION/4 REFERENCIAS`) and `Analizadas por Claude/` (moved from `~/Videos-Remotion/referencias`). Both old paths are now symlinks, so Premiere links and old memory paths still work.
- `2 CLIENTES/<AMIN|ERIC|NATALIA|ERIC YOUTUBE>/FICHA.md` holds the brand, templates, "cómo lo quiere" and pitfalls, plus links to finished videos.
- `3 SKILLS Y MEMORIA` contains symlinks to `~/.claude/skills`, to this memory folder and to the project CLAUDE.md.
- `4 ENTRENAMIENTO/` contains `BANDEJA DE ENTRADA (deja aquí lo nuevo)`, `REGISTRO DE CORRECCIONES.md` and `ANTES Y DESPUÉS`.
- `5 TALLER` is a symlink to `~/Videos-Remotion` (it replaced `EDICION/5 TALLER DE CLAUDE`).
- `6 EXPORTACIONES DEL MÉTODO` holds the "Editor-exportado" package and zip for the user's other Claude Code.

**Why:** the user wants one place where they keep teaching me, and wants each correction to stick.

**How to apply:**
- When the user says "entrénate" or "mira la bandeja":
  1. Analyse each new item (frames, rhythm, type, colours, measured sound).
  2. Turn it into rules with numbers.
  3. Write the rules into the client FICHA, the relevant skill or this memory.
  4. Add a row to `REGISTRO DE CORRECCIONES.md`, newest on top.
  5. Move the item to `1 REFERENCIAS` or `ANTES Y DESPUÉS`.
- Every correction the user gives in a session also goes to the log and to the FICHA, not only to memory.

Same day cleanup: 616 items (57.8 GB) were moved to `~/.Trash/Limpieza 2026-10-30`, with a log in `EDICION/9 OTROS/limpieza-2026-10-30 (papelera).json`. They were old Premiere autosaves (the newest 3 per project were kept, including their "Masks" folders of ~244 MB each), caches, old "Calcula lista" renders, unused working copies in `Videos-Remotion/clientes`, and repeated exports (the newest of each was kept).

Rule used to decide what was unused: the file NAME must not appear anywhere in the decompressed XML of any .prproj. Path-only checks missed items whose path is stored elsewhere. Proxies were never touched, and raws that only exist in `Videos-Remotion` were kept.

Space is only freed once the Trash is emptied. Not touched (personal or undecided): `~/Downloads` (13 GB of exports, music and raws), `Movies/One Pace`, `Documents/5 años`. Related: [[espacio-de-trabajo-edicion]].
