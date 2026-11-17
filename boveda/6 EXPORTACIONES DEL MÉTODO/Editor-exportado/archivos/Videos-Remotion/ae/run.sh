#!/bin/zsh
# Ejecuta un .jsx dentro de After Effects y muestra lo que el script escribe en resultado.txt
DIR="${0:A:h}"
rm -f "$DIR/resultado.txt"
osascript -e 'with timeout of 120 seconds' -e "tell application \"Adobe After Effects 2026\" to DoScriptFile \"${1:A}\"" -e 'end timeout' >/dev/null
cat "$DIR/resultado.txt" 2>/dev/null
