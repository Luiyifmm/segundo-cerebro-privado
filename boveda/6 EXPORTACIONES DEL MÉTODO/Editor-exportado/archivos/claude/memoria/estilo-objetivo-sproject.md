---
name: estilo-objetivo-sproject
description: Target editing style the user wants (sprojectagency.com reels) — sophisticated, elegant, minimalist, modern; the recipe and where the references are
metadata:
  type: feedback
---

On 2026-10-09 the user said the reels on https://sprojectagency.com/ are "el estilo de edicion que quiero conseguir: sofisticado, elegante, minimalista, moderno".

Reference copies (15 reels + 2 long videos, contact sheets): `~/Videos-Remotion/referencias/sproject/` (`v/`, `hojas/`).

Recipe I extracted (my reading of the videos, not the user's words):
- Subtitles: 1–3 words, small white lowercase sans with tight tracking, no box, soft shadow/glow, placed on the chest (never on the face).
- Keyword: bigger, second font (serif italic or condensed display), stacked right under the small line, in ONE accent color per reel taken from wardrobe/set.
- Text enters with blur + fade, word by word; no bounces.
- B-roll: full screen or rounded card on black; object cutouts (PNG) on the chest; small tilted rounded thumbnails top-left.
- Hook 1–2 s designed (white vignette + cutout, big title); punch-in zoom between wide and close; branded CTA end card.
- Simple data graphics (two-column table, chart card, checks); emoji very sparse.
- Audio loud: about −11 to −12 LUFS.

**Why:** it is the look the user wants for their own edits.
**How to apply:** use this recipe as default for new motion/subtitle layers unless a client brand guide says otherwise; see [[clientes-y-carga-de-trabajo]] and [[video-tooling-setup]].

User feedback on the first test (2026-10-09): liked the elegant look "mucho más". Corrections:
- ClienteA's accent is always his brand blue (`#1E8BFF`), not a color picked from the set.
- Wants full-screen motion graphics on a simple elegant background (done: brand black + blue glow + dot grid, `MgPantalla` in `motion/src/Elegante.tsx`).
- Subtitles must be editable text in Premiere, one per phrase, never a rendered clip. How: MOGRT `~/Videos-Remotion/clientes/_plantillas/Subtitulo elegante.mogrt` (built by `ae/mogrt-subtitulo.jsx`; controls Linea, Palabra clave, Color clave, Retraso, Altura, Tamano), placed with `seq.importMGT` and text set through the JSON `textEditValue` (`premiere/importar-elegante-azul.jsx`, units from `motion/subs-texto.js`). The XML needs an empty top track (`PISTA_VACIA=1`).
- After Effects hangs on a save prompt if a script calls `app.newProject()` with an unsaved project: use `app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES)`.
