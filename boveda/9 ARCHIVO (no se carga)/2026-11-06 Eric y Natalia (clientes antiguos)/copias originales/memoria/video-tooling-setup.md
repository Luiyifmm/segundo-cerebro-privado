---
name: video-tooling-setup
description: "Where the motion-graphics tooling lives on this Mac and how to drive Remotion, After Effects and Premiere"
metadata:
  node_type: memory
  type: reference
  originSessionId: ee0e846e-677a-48a5-82b2-eed5c985a811
  modified: 2026-10-08T17:34:06.158Z
---

Set up 2026-10-08 on the user's Mac (arm64, no Homebrew, no Xcode CLT so `python3`/`git` shims fail).

- Node.js 24 lives in `~/.local/node/bin` — not on PATH in tool shells; prefix commands with `export PATH="$HOME/.local/node/bin:$PATH"`.
- Remotion project: `~/Videos-Remotion/motion`. `npm run render -- <CompId> out/x.mov` = ProRes 4444 with alpha for Premiere; `npm run preview -- <CompId> out/x.mp4` = H.264 for quick viewing.
- After Effects 2026: driven directly via AppleScript, `~/Videos-Remotion/ae/run.sh script.jsx` (script writes its output to `ae/resultado.txt`; DoScript return values come back as 0). Works, file/network scripting pref already on.
- Premiere Pro 2026: community MCP `adobe-premiere-pro-mcp` (npm global), CEP panel "MCP Bridge (CEP)", temp dir `/tmp/premiere-mcp-bridge`, registered as `premiere-pro` in `~/.claude.json` and Claude Desktop config with telemetry off. The bridge normally starts by itself when Premiere opens (verified through 2026-11); if it does not answer, check first, then ask for Ventana > Extensiones > MCP Bridge (recovery steps in skill `premiere-puente`).

User gave blanket permission to install tooling for this ([[user-video-editor]]).

Added later on 2026-10-08: local tools `~/Videos-Remotion/voz` (transcribir.js, cortar-silencios.js) and `~/Videos-Remotion/fondo/recortar.js`; full ffmpeg/ffprobe/yt-dlp in `~/.local/bin`. Usage lives in the user skills `edicion-video`, `cortar-silencios`, `subtitulos`, `cambiar-fondo` and the official `remotion-best-practices` in `~/.claude/skills`. Premiere bridge confirmed working via command files in `/tmp/premiere-mcp-bridge`.

Reel tracking: `node ~/Videos-Remotion/sistema/reel.js` (empezar/parar/terminar/estado/mejora/panel) writes `sistema/reels.json` and `sistema/panel.html`. Drive `PACKS` is a read-only shared folder; organized copies go in `Mi unidad/RECURSOS DE EDICIÓN/`.

2026-10-30 (guía de sonido de Trescendit que pasó el usuario): instalados **earshot** 0.4.0 (MCP `earshot` en `~/.claude.json`, scope user; código + `.venv` Python 3.12 + modelos CLAP/AST en `~/Videos-Remotion/herramientas/earshot`; skill `~/.claude/skills/earshot`) y **Real SFX** (skill `~/.claude/skills/real-sfx`, bibliotecas del usuario indexadas: 301 sonidos). Python 3.12 vía `uv` (`~/.local/bin/uv`, pythons en `~/.local/share/uv/python/`), sin Homebrew. Copia previa del config: `~/.claude.json.copia-antes-de-earshot`. Las herramientas MCP de earshot aparecen solo en sesiones nuevas. Cómo encajan con Premiere: skill `edicion-video` › "Oír el sonido". Nunca usar `earshot llm` (sube audio a Gemini).

2026-10-30: skill real-sfx (~/.claude/skills/real-sfx) y MCP earshot instalados. Librerías de real-sfx: Recursos (main), Motionix (extra), Openverse CC0 (extra, `~/EDICION/2 MATERIALES DE EDICION/Efectos de sonido/Openverse CC0`, ids 301–316, con `creditos y licencias.csv`). search.py no encuentra los de Openverse (índice con dur 0): usarlos por id. La API de Openverse tarda ~45 s por búsqueda y a menudo falla. Primer trabajo: "Calcula esto" de Eric en `3 PROYECTOS/Calcula esto - SFX reales/`; sus exports ya llevan SFX propios, solo se sonorizan rótulos sin sonido.
