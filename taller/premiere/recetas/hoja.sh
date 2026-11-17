#!/bin/zsh
# Hoja de fotogramas pequeña para mirar varios PNG de una vez (protocolo visual barato, fase 8B.2, 08-11).
# Uso: hoja.sh <salida.png> <png1> <png2> … [--ancho 1600] [--columnas 4] [--rotulos]
#   - Ajusta cada fotograma a ancho/columnas y los coloca en una rejilla. No modifica los PNG de entrada.
#   - --rotulos escribe el nombre de cada archivo debajo (útil con los prefijos de fotogramas.jsx).
#   - Se niega a sobrescribir la salida.
# Para la revisión final, mirar también los fotogramas a tamaño completo de la zona dudosa.
set -e
OUT="$1"; shift
[ -z "$OUT" ] && { echo "uso: hoja.sh <salida.png> <png…> [--ancho N] [--columnas N] [--rotulos]"; exit 1; }
[ -e "$OUT" ] && { echo "ERROR: ya existe $OUT (no sobrescribo)"; exit 1; }
ANCHO=1600; COL=4; ROT=0; F=()
while [ $# -gt 0 ]; do case "$1" in
  --ancho) ANCHO="$2"; shift 2;; --columnas) COL="$2"; shift 2;; --rotulos) ROT=1; shift;;
  *) [ -f "$1" ] || { echo "ERROR: no existe $1"; exit 1; }; F+=("$1"); shift;; esac; done
N=${#F[@]}; [ $N -eq 0 ] && { echo "ERROR: sin fotogramas"; exit 1; }
[ $N -lt $COL ] && COL=$N
FIL=$(( (N + COL - 1) / COL )); W=$(( ANCHO / COL ))
IN=(); FC=""
for i in {1..$N}; do
  IN+=(-i "${F[$i]}"); j=$((i-1))
  if [ $ROT -eq 1 ]; then
    T=$(basename "${F[$i]}" .png | sed "s/[:']/ /g")
    FC+="[$j:v]scale=$W:-2,pad=iw:ih+28:0:0:black,drawtext=text='$T':fontcolor=white:fontsize=18:x=6:y=h-24[f$j];"
  else FC+="[$j:v]scale=$W:-2[f$j];"; fi
done
# Rellena la rejilla con negro si faltan casillas
L=""; for j in $(seq 0 $((N-1))); do L+="[f$j]"; done
if [ $N -eq 1 ]; then FC="${FC%;}"; FC="${FC/\[f0\]/}"; else
FC+="${L}xstack=inputs=${N}:layout="
LAY=""; for j in $(seq 0 $((N-1))); do c=$((j % COL)); r=$((j / COL)); x="0"; y="0"
  [ $c -gt 0 ] && x=$(for k in $(seq 1 $c); do printf "w0+"; done | sed 's/+$//')
  [ $r -gt 0 ] && y=$(for k in $(seq 1 $r); do printf "h0+"; done | sed 's/+$//')
  LAY+="${x}_${y}|"; done
FC+="${LAY%|}:fill=black"; fi
ffmpeg -v error "${IN[@]}" -filter_complex "$FC" -frames:v 1 "$OUT" 2> >(grep -v "^Fontconfig" >&2)
echo "hoja: $OUT · $N fotogramas · ${COL}×${FIL} · $(sips -g pixelWidth -g pixelHeight "$OUT" | awk '/pixel/{printf $2" "}')px · $(( $(stat -f %z "$OUT") / 1024 )) KB"
