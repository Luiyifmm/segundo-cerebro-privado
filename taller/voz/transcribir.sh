#!/bin/zsh
# transcribir.sh — PUERTA ÚNICA de transcripción (aprobado 07-11-2026, fase 5).
# Por defecto: WhisperX (entorno aislado) + verificar-transcripcion.py contra el audio FUENTE.
#   voz/transcribir.sh <audio|vídeo> [--inicio s] [--duracion s] [--modelo small|medium|large-v3] [--ganancia dB]
# Alternativa (Whisper small de siempre, sin alineado fino):  voz/transcribir.sh --respaldo <archivo> [args de transcribir.js]
# Salida principal: voz/salida-whisperx/<nombre>[_<inicio>].verificada.json  (cada palabra con "voz" y "fiable").
# Regla: para CORTAR o SINCRONIZAR solo se usan palabras con fiable=true de una transcripción verificada (código 0).
#        Una sincronía a ±2 f solo se afirma si qc/sincronia.py la MIDE; si no, se dice NO VERIFICADO.
set -e
R="$HOME/Videos-Remotion"; PY="$R/herramientas/entornos/whisperx/bin/python"
if [[ "$1" == "--respaldo" ]]; then shift; export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"; exec node "$R/voz/transcribir.js" "$@"; fi
[[ -x "$PY" ]] || { echo "ERROR: falta el entorno aislado de WhisperX ($PY). Usa --respaldo."; exit 2; }
f="$1"; [[ -f "$f" ]] || { echo "uso: transcribir.sh <archivo> [--inicio s] [--duracion s] …"; exit 2; }
out=$("$PY" "$R/voz/transcribir-whisperx.py" "$@" | tee /dev/stderr | tail -1 | /usr/bin/python3 -c 'import json,sys; print(json.loads(sys.stdin.read())["salida"])')
[[ -f "$out" ]] || { echo "ERROR: WhisperX no dejó salida"; exit 2; }
ver="${out%.palabras.json}.verificada.json"
# Los tiempos de WhisperX ya están en la base del ARCHIVO ORIGINAL (aunque se use --inicio), así que se verifica contra él.
set +e; "$PY" "$R/voz/verificar-transcripcion.py" "$out" "$f" --salida "$ver"; rc=$?; set -e
echo "VERIFICADA: $ver (código $rc: 0 = coherente, 1 = NO corresponde a este audio)"; exit $rc
