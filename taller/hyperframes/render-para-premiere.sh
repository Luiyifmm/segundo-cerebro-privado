#!/bin/zsh
# Renderiza una composición de HyperFrames con transparencia LISTA PARA PREMIERE.
# Uso: render-para-premiere.sh <carpeta de la composición> <salida.mov> [calidad: draft|standard|high]
# Por qué: HyperFrames codifica con el ffmpeg 6.0 del sistema y Premiere 2026 ignora ese canal alfa
# (fondo negro y halo; comprobado el 06-11-2026). Se recodifica con el ffmpeg de Remotion (Lavc61), que sí lo lee.
set -e
export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"
DIR="$1"; OUT="$2"; Q="${3:-standard}"
[ -d "$DIR" ] && [ -n "$OUT" ] || { echo "Uso: render-para-premiere.sh <carpeta> <salida.mov> [draft|standard|high]"; exit 1; }
TMP="$(mktemp -d /tmp/hf-render.XXXXXX)"
hyperframes render "$DIR" --format mov -o "$TMP/bruto.mov" --quality "$Q" >"$TMP/render.log" 2>&1 || { tail -20 "$TMP/render.log"; exit 1; }
RD="$HOME/Videos-Remotion/motion/node_modules/@remotion/compositor-darwin-arm64"
(cd "$RD" && ./ffmpeg -nostdin -v error -y -i "$TMP/bruto.mov" -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le -an "$OUT")
"$HOME/.local/bin/ffprobe" -v error -show_entries stream=codec_name,profile,pix_fmt,width,height:stream_tags=encoder -of compact "$OUT"
rm -rf "$TMP"
