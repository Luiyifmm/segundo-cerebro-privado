# 03 · Herramientas, configuración y recursos

Mac Apple Silicon (MacBook Air M5, 16 GB, sin ventilador), macOS 26. Sin Homebrew y sin Xcode Command Line Tools: `git` abre un diálogo de instalación. Todo vive en `~/.local`. Para usar node hay que exportar antes `PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"`, porque no está en el PATH de las shells de herramienta.

## 1. Instrucciones y memoria de Claude (copiadas en `archivos/claude/`)

| Qué | Dónde estaba | Copia |
|---|---|---|
| CLAUDE.md global | no existe | — |
| CLAUDE.md del proyecto | `~/Videos-Remotion/CLAUDE.md` | `claude/CLAUDE.md (proyecto Videos-Remotion)` |
| Ajustes | `~/.claude/settings.json` (modelo opus, esfuerzo medio, tema oscuro) | `claude/settings.json` |
| Memorias (21 archivos + índice) | `~/.claude/projects/-Users-USUARIO/memory/` | `claude/memoria/` |
| Agentes, comandos, hooks | no tengo ninguno | — |
| Servidores MCP | `~/.claude.json` → `mcpServers` | `claude/mcp-servidores.json` (variables de entorno cambiadas por `<VALOR>`) |

**Skills propias** (copiadas en `claude/skills/`):

| Skill | Para qué |
|---|---|
| `edicion-video` (+ `criterio.md`) | El grueso del oficio: referencias, estilos, flujos, Premiere, recetas de sonido y color. **Empezar por aquí.** |
| `direccion-viral` | Gancho, estructura, ritmo, sonido; receta de entrevistas de YouTube. |
| `subtitulos-reels` | Subtítulos de ClienteE/N con MOGRT y las correcciones que el usuario hace a mano. |
| `clientes` | Ficha de marca por cliente. |
| `premiere-puente` | Cómo manejar Premiere por ExtendScript, con patrones y trampas. |
| `portadas` | Miniaturas 9:16. |
| `primer-corte` | Sistema de reels (`reel.js`): ingesta, corte y selección de tomas. |
| `cortar-silencios`, `subtitulos`, `cambiar-fondo`, `color-hdr` | Herramientas sueltas. |

**Skills de terceros** que tengo instaladas (copiadas también, solo como apoyo):

| Skill | Origen | Uso |
|---|---|---|
| `motion-video-director` | github.com/Miftahul-Islam-Efaz/Motion-graphics-skill | Criterio de motion graphics; no uso su flujo de voz de ElevenLabs. |
| `after-effects-editor` | autor "Solazzo" (pensada para Windows y su propio MCP) | Recetas de AE. |
| `remotion-best-practices` | skill oficial de Remotion | Cargar antes de escribir composiciones. |
| Skills integradas de la plataforma (pdf, docx, xlsx, pptx, skill-creator…) | Anthropic | No son de edición; no se copian. |

## 2. Programas

| Herramienta | Versión | Ruta | Cómo instalar |
|---|---|---|---|
| ffmpeg | 6.0 (estático) | `~/.local/bin/ffmpeg` | binario estático de evermeet.cx o osxexperts, a `~/.local/bin` |
| ffprobe | 4.4 (tessus) | `~/.local/bin/ffprobe` | ídem |
| ffmpeg de Remotion | el de `@remotion/compositor-darwin-arm64` | `motion/node_modules/...` | viene con Remotion; **úsalo para ProRes 4444 con alfa** (con `DYLD_LIBRARY_PATH`) |
| Node.js | v24.21.0 (npm 11.19.0) | `~/.local/node` | tarball oficial de nodejs.org descomprimido en `~/.local/node` |
| Remotion | 4.0.534 (React 19, TS 7) | `~/Videos-Remotion/motion` | `npm i` con el `package.json` copiado |
| Transcriptor | `@huggingface/transformers` 4.3.1 + modelo `onnx-community/whisper-small_timestamped` | `~/Videos-Remotion/voz` | `npm i` (el modelo se descarga la primera vez) |
| Recorte de persona | `onnxruntime-node` 1.30 + Robust Video Matting (`rvm_mobilenetv3_fp32.onnx`, 15 MB) | `~/Videos-Remotion/fondo` | `npm i` + bajar el .onnx del repo PeterL1n/RobustVideoMatting |
| Recorte de objetos / emoji / medir texto | programas Swift propios (Vision y AppKit de Apple) | `herramientas/recorte-objetos`, `emoji`, `fotogramas` | `swiftc -O x.swift -o x -sdk .../MacOSX26.5.sdk` (con el SDK 27 no compila) |
| Python del sistema | 3.9.6, sin numpy | `/usr/bin/python3` | viene con macOS |
| Entorno Python con numpy, torch, demucs | torch 2.8.0, demucs 4.0.1, numpy 1.26.4, soundfile | `herramientas/separar-env` | `python3 -m venv separar-env && separar-env/bin/pip install torch demucs soundfile numpy` |
| yt-dlp | 2026.10.21 | `~/.local/bin/yt-dlp` | binario oficial; YouTube solo con `--extractor-args "youtube:player_client=android_vr"` |
| Adobe Premiere Pro 2026 | 26.x | /Applications | Creative Cloud (de pago) |
| Adobe After Effects 2026 | 26.5.2 | /Applications | Creative Cloud (de pago) |
| Adobe Media Encoder 2026 | 26.x | /Applications | Creative Cloud (de pago) |
| MCP de Premiere | `adobe-premiere-pro-mcp` 1.2.11 (comunidad) + panel CEP "MCP Bridge" | `~/.local/node/lib/node_modules/` | `npm i -g adobe-premiere-pro-mcp`; instalar su panel CEP |
| MCP de After Effects | `after-effects-mcp` 0.1.0 | `~/after-effects-mcp` | repo de la comunidad compilado en local |

**Ojo:** `premiere/recetas/plan-reel.py` necesita numpy. Ejecútalo con `herramientas/separar-env/bin/python`, no con el python del sistema.

**APIs externas que llamo:**
- Todas son públicas y sin clave: Wikimedia Commons, Openverse, páginas públicas de Pinterest (`/ideas/`), yt-dlp para bajar referencias y exportación de Google Docs a texto.
- La única con token es la de Notion (gestión, no edición). No se incluye.
- **No uso ninguna API de pago para editar.**

## 3. Cómo llamo a Premiere y a After Effects

- **Premiere:** `premiere/pr.sh <archivo.jsx> <segundos>`.
  - Escribe `{"id","script"}` en `/tmp/premiere-mcp-bridge/command-<id>.json` (primero como `.part` y luego lo renombra) y lee `response-<id>.json`. Hay que leer solo la línea `result`.
  - Necesita el panel "MCP Bridge" abierto (Ventana > Extensiones > MCP Bridge). Si responde "sin respuesta del puente", se le pide al usuario que lo abra y **se para**.
  - Un script largo sigue ejecutándose aunque el puente diga "timed out": no hay que lanzar otro encima.
- **After Effects:** `ae/run.sh script.jsx` por AppleScript (DoScript). El script escribe su resultado en `ae/resultado.txt`. Se envuelve en `app.beginUndoGroup`.

## 4. Mi código (copiado en `archivos/Videos-Remotion/`)

| Carpeta | Contenido clave |
|---|---|
| `voz/` | `transcribir.js`, `cortar-silencios.js`, `primer-corte.js`, `qc.js` (control de calidad), `ganchos.js` |
| `sistema/` | `reel.js` (sistema de reels: nuevo, cortar, quitar, recuperar, entregar…), `subs-reel.js`, `marcadores.js`, `proxies.js`, `montaje-solapado.js`, `recortes-extra.js`, `linea.py` |
| `premiere/` | ~250 scripts ExtendScript. Los genéricos son `pr.sh`, `propuesta-reel2.jsx`, `propuesta-hablado.jsx` y `propuesta-yt.jsx`. En `recetas/`: `plan-reel.py`, `colocar-subs-mogrt.py`, `subs-desde-linea.py`, `leer-v1.jsx`, `leer-subs-mogrt.jsx`, `lumetri-hdr-iphone.jsx`, `resincronizar.py`, `columnas-difuminado.jsx`, `subtitulos-por-tandas.jsx`. Los que llevan nombre de cliente son de un vídeo concreto: sirven como ejemplo. |
| `ae/` | Generadores de las plantillas MOGRT (`mogrt-*.jsx`) y `run.sh` |
| `motion/src/` | Componentes de Remotion (Root.tsx los registra). Los de esta semana: `ClienteECalculaLista2.tsx` (lista + pizarra paso a paso con fusión), `ClienteESiQuieres.tsx` (tabla Si quieres / Debes), `ClienteERankingCat.tsx` (ranking 5→1 por categoría), `ClienteE.tsx` (portadas y CTA "Guárdalo / Compártelo / Seguir"). Otros: `Elegante.tsx`, `Trials.tsx`, `VtrialReticula.tsx`, `ClienteACollage.tsx`, `ClienteN.tsx` (portadas). |
| `fondo/` | `recortar.js` (RVM local, ~14 fps a 1080×1920) |
| `herramientas/` | `emoji` (emoji de Apple a PNG), `fotogramas/mejor-fotograma.sh`, `recorte-objetos/recortar` + `limpiar-halo.py` |

## 5. Plantillas y presets

- `archivos/plantillas/mogrt/`: todas mis plantillas MOGRT y sus proyectos .aep (subtítulos por cliente, etiquetas, textos).
  - **Los nombres de archivo están anonimizados, pero dentro del .mogrt el nombre interno de la plantilla puede seguir llevando el nombre real del cliente.**
  - Ábrelas en AE si quieres renombrarlas.
- **Plantillas del usuario que no son mías** (no se copian; vienen de un curso de pago): "Animación Limpia Rápida", "Animación Rápida Con Brillo", "Desenfoque Con Brillo", "Efecto Brillo", "Animación Regular" y el pack "PRESETS TEXTO PREMIERE [V4]" (30 MOGRT). Están en `~/Library/Application Support/Adobe/Common/Motion Graphics Templates/` y en `PACKS/` de su Drive.
- `archivos/presets/max h264 (Media Encoder).epr`: preset de exportación final.

## 6. Recursos

**Copiados** (110 MB en total, por debajo del límite de 200 MB):
- **Fuentes** (`recursos/fuentes/`): SF Pro Bold y Medium, Sequel Sans Heavy, Bold y Medium, Nyght Serif Italic, Montserrat SemiBold, Inter, Akira, Balboa, Aston Script, Bootzy, Font Awesome 7.
  - **Licencias:** SF Pro es de Apple (solo para uso en macOS). Sequel Sans y Nyght son comerciales. Úsalas solo en la misma cuenta y equipo de trabajo del usuario.
- **Música** (`recursos/musica/`): 8 pistas. Fuentes: YouTube Audio Library, The Grey Room y versiones "slowed". Las licencias no están verificadas, sobre todo las de canciones comerciales: revísalas antes de publicar.
- **Efectos** (`recursos/efectos/`):
  - pack Motionix completo;
  - los 9 efectos que más uso en `mas-usados/`;
  - la lista completa de la biblioteca de 234 efectos en `LISTA-COMPLETA-biblioteca-Drive.txt`.

**No copiados** (pesan demasiado o no son del método):
- La biblioteca completa de efectos (151 MB, 234 archivos). Está en Drive del usuario, `Mi unidad/RECURSOS DE EDICIÓN/EFECTOS DE SONIDO/` (01 Whooshes … 10 Varios); es una copia ordenada de `PACKS/SOUND EFFECTS`.
- Overlays y CTA (15 GB): `~/EDICION/2 MATERIALES DE EDICION/Overlays y CTA/`. Se pueden regenerar desde Remotion con los props JSON que hay junto a cada render.
- B-roll (1,2 GB): material de clientes.
- Plugins y presets (499 MB): LUTs y presets de terceros. Están en `~/EDICION/2 MATERIALES DE EDICION/Plugins y presets/`.
- PACKS del curso (Drive compartido, solo lectura): SOUND EFFECTS, CINEMATIC OVERLAYS, DEGRADADOS NEGROS, RECTÁNGULOS SUPER 8MM y PRESETS TEXTO PREMIERE [V4].
- Modelos: Whisper small (lo baja `transformers` solo) y RVM (`rvm_mobilenetv3_fp32.onnx`, del repo de Robust Video Matting).
