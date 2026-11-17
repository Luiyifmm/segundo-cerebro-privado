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
- Premiere Pro 2026: community MCP `adobe-premiere-pro-mcp` (npm global), CEP panel "MCP Bridge (CEP)", temp dir `/tmp/premiere-mcp-bridge`, registered as `premiere-pro` in `~/.claude.json` and Claude Desktop config with telemetry off. User must click Start Bridge in the panel each Premiere session (my understanding; verify).

User gave blanket permission to install tooling for this ([[user-video-editor]]).

Added later on 2026-10-08: local tools `~/Videos-Remotion/voz` (transcribir.js, cortar-silencios.js) and `~/Videos-Remotion/fondo/recortar.js`; full ffmpeg/ffprobe/yt-dlp in `~/.local/bin`. Usage lives in the user skills `edicion-video`, `cortar-silencios`, `subtitulos`, `cambiar-fondo` and the official `remotion-best-practices` in `~/.claude/skills`. Premiere bridge confirmed working via command files in `/tmp/premiere-mcp-bridge`.

Reel tracking: `node ~/Videos-Remotion/sistema/reel.js` (empezar/parar/terminar/estado/mejora/panel) writes `sistema/reels.json` and `sistema/panel.html`. Drive `PACKS` is a read-only shared folder; organized copies go in `Mi unidad/RECURSOS DE EDICIÓN/`.
