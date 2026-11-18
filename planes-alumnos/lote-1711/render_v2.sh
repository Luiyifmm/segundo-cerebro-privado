#!/bin/bash
# Render completo de una carpeta del lote: base -> (sujeto si hay elementos «detras») -> anim -> hoja -> sonido -> caras. Uso: ./render_v2.sh <carpeta>
set -e; cd "$(dirname "$0")"; PY=~/Videos-Remotion/herramientas/entornos/whisperx/bin/python
$PY reel_alumno.py "$1/spec.json" base > /dev/null
grep -q '"detras": true' "$1/spec.json" && $PY reel_alumno.py "$1/spec.json" sujeto > /dev/null
$PY reel_alumno.py "$1/spec.json" anim && $PY reel_alumno.py "$1/spec.json" hoja && python3 sonido.py "$1/spec.json" todo > "$1/sonido.log" 2>&1
$PY reel_alumno.py "$1/spec.json" caras | head -1
echo "LISTO $1"
