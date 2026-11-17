#!/bin/zsh
# Uso: bajar_reels.sh codigos.txt CARPETA  — baja cada reel (shortcode por línea) con su info.json; salta los ya bajados.
L=$1; D=$2; mkdir -p "$D"; cd "$D"
while read c; do
  [ -z "$c" ] && continue; ls "$c".mp4 >/dev/null 2>&1 && continue
  uvx yt-dlp -q --no-warnings --write-info-json -o "%(id)s.%(ext)s" "https://www.instagram.com/reel/$c/" >/dev/null 2>>errores.log && echo "ok $c" || echo "fallo $c"
  sleep 2
done < "$L"
echo FIN
