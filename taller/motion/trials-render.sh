#!/bin/bash
# Renderiza los formatos de Trials indicados (por defecto los 20) y les pone el audio de la voz.
# Uso: bash trials-render.sh [números...]
export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"
cd ~/Videos-Remotion/motion
OUT=~/Videos-Remotion/entregas/trials-AMIN_1009_01; mkdir -p "$OUT/.tmp"
BASE=public/t1009/base.mp4
NOMBRES=("" "Base con barras" "Pantalla completa" "Tarjeta redondeada" "Tarjeta con brillo azul" "Fondo desenfocado" "Azul noche" "Blanco y negro con azul" "Primer plano" "Descentrado" "Palabra a palabra" "Frase entera" "Portada y bucle" "Rapido" "Corto" "Pantalla partida" "Estudio" "Miniaturas elegantes" "Poster" "Palabra gigante" "Fotos que caen")
LISTA="${@:-1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20}"
for n in $LISTA; do
  nn=$(printf "%02d" $n); final="$OUT/$nn - ${NOMBRES[$n]}.mp4"; tmp="$OUT/.tmp/$nn.mp4"
  npx remotion render build Trial$n "$tmp" --codec h264 --crf 18 --muted --log=error || { echo "FALLO $n"; continue; }
  if [ "$n" = "13" ]; then af="atempo=1.1"; elif [ "$n" = "14" ]; then af="atrim=0:19.47,afade=t=out:st=19.1:d=0.35"; else af="anull"; fi
  ffmpeg -v error -y -i "$tmp" -i "$BASE" -filter_complex "[1:a]${af}[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$final" && rm -f "$tmp" && echo "listo $nn $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$final")"
done
