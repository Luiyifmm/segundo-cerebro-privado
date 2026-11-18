#!/bin/bash
# Render completo v2 de una carpeta del lote: anim -> hoja -> sonido (efectos + capas + músicas + master). Uso: ./render_v2.sh <carpeta>
set -e; cd "$(dirname "$0")"; PY=~/Videos-Remotion/herramientas/entornos/whisperx/bin/python
$PY reel_alumno.py "$1/spec.json" anim && $PY reel_alumno.py "$1/spec.json" hoja && python3 sonido.py "$1/spec.json" todo > "$1/sonido.log" 2>&1 && echo "LISTO $1"
