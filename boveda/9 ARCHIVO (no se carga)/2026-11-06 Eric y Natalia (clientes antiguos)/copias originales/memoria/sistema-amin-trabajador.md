---
name: sistema-amin-trabajador
description: "Since 2026-10-30 Claude de Luis edits Amin's panels (Sala + Trainer10x) via a worker on Luis's Mac; repos, PRs, rules, pending credentials"
metadata:
  node_type: memory
  type: project
  originSessionId: 411942d8-369f-4b90-8efb-1efb3ec51c39
  modified: 2026-10-30T20:53:05.876Z
---

2026-10-30: Amin decided that Claude de Luis edits his videos ("tú mandas en la edición"). Two jobs: edit the videos that arrive in his panels, and teach his system (decisiones.json per video, manual base, PRs).

- **GitHub account:** `javisanchezz`, logged in with `gh` (~/.local/bin/gh) and with write access to the private repos `F25-LIQUIDSHYPIX/sala-edicion`, `trainer10x-contenido` and `edicion-motor`. Clones are in `~/Proyectos/amin/`.
- **Always:** work on branches named `claude-luis/*` with a PR. Never touch `main` and never deploy. Amin's "Claude 1" reviews and merges.
- **Do not touch** the Sala QC (`qc.ts`, `components/qc`, `qc-prueba`); another Claude owns it.
- **Amin's fixed rules:** music only if he chooses it; nothing covers the face; the figure on screen = the voice.
- **Open PRs:** sala-edicion #1 (AI prompt: zoom, effects, music) and edicion-motor #1 (worker `luis/trabajador.py`).
- **Worker:** `luis/trabajador.py` takes `t10x.videos` jobs with `FOR UPDATE SKIP LOCKED`. Claude Code headless (`claude -p`) decides with `luis/editor.md` and reviews with `luis/revisor.md`; the render uses Amin's `Reel`.
  - Credentials live in `~/.config/claude-editor/env.json` and are still pending from Amin: a limited DB user and an R2 token.
  - The LaunchAgent is not installed yet; install it only after Amin approves a test video.
- **Test on IMG_6126:** 242 s → 44 s, IA cost $0.41–0.58 per video, 13 min.
- **Sala queue:** blocked until the Sala reads videos from R2 (today it deploys from `main`).
- **Pending:** comparison images; Amin has to switch his own agent off for the queues the worker takes.

Manual base zip: `~/EDICION/0 CLAUDE EDITOR/6 EXPORTACIONES DEL MÉTODO/Manual-base-edicion-2026-10-30.zip`. Related: [[reparto-de-trabajo-por-cliente]], [[direccion-edicion-natural-y-elegante]].

**Luis's corrections, 2026-10-30 (night):**
- **Fillers and repeated restarts must go** ("pera"/"espérate", "tú eliges exactamente, tú eliges exactamente"). Whisper hides them by stretching one word, so the worker re-transcribes with a filler prompt, cuts at the quietest point and rebuilds the subtitles from a fresh transcription of the clean cut.
- **Fonts for Amin:** SF Pro, plus one second font for dynamism. This is Luis's correction and it overrides Amin's own message (Instrument Serif + Anton). It lives in `luis/fichas/amin.json`: SF Pro Display Bold for the line, Nyght Serif Italic in lowercase for the keyword, in red or gold.
- **References:** analysed in `EDICION/0 CLAUDE EDITOR/1 REFERENCIAS/Analizadas por Claude/2026-10-30 estilo Amin/LEEME.md`. Still missing: full-screen inserts every 8–12 s, and a big title when a number is said.

**2026-10-31, premium styles:** new skill `edicion-premium` in `~/.claude/skills`, built from Alborna, Belfort, Víctor Heras, Guille Collado, Natt Jongsala, Marco Said, Ashish Kumar and Zane Hoyer. The worker takes `--estilo cine|clave|profundidad`.
- Examples are in `~/Proyectos/amin/trabajos/ejemplos-premium/`: cine-IMG_6121, clave-IMG_6122, profundidad-IMG_6123.
- Pushed to edicion-motor PR #1.
- Instagram has no session in Chrome, so creator profiles can't be listed; YouTube was used instead.
- Pending: a quiet real ambience bed (no music), number titles in lists, and better insert images than Commons.

**2026-10-31, phase 1 = Sala only:**
- Trainer10x is off until Amin says otherwise.
- Requests to Amin's Claudes go as GitHub issues in edicion-motor (issue #2 asks for Sala storage, the Reel/sanear sync, renders of Luis's entregas, a per-type switch and rotating the DB password).
- DB URL is stored in `~/.config/claude-editor/env.json` (600) with COLAS ["sala"]. It passed through chat, so rotation was requested.
- The contract is in `bd/CONTRATO-TRABAJADOR.md` on main.
- Notify Amin only when the first video is in the Sala.

**2026-10-31, Amin's order: Claude de Luis is the main instruction for his Claude 1 and Claude 2.**
- They ask permission and copy `luis/NORMAS.md`.
- The DB password stays as it is (Amin's decision; no rotation).
- Delegation: `IDENTIDAD` luis/claude1; above `SATURACION`=3 reels in queue, `datos.delegar='claude1'`; claude1 also takes reels waiting more than 30 min.
- Claude 1 will run `luis/trabajador.py` on Amin's Mac.
- PRs: edicion-motor #3 (norms + delegation). sala-edicion #2 approved.
- Blocker: Amin must create R2 bucket `sala-edicion-videos` (public) plus 2 tokens.
