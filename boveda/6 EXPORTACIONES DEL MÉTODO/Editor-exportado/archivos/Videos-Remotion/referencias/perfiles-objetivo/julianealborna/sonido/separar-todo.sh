#!/bin/bash
export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"
PY=~/Videos-Remotion/herramientas/separar-env/bin/python
for id in $(cat ids20.txt) 7557522291089886475; do
  [ -f stems/htdemucs/$id/no_vocals.wav ] && continue
  for k in $(seq 1 40); do [ -f $id.mp4 ] && break; sleep 15; done
  [ -f $id.mp4 ] || { echo "FALTA $id"; continue; }
  sleep 5
  ffmpeg -nostdin -v error -y -i $id.mp4 -vn -ac 2 -ar 44100 cache-audio/$id.wav
  $PY -m demucs -n htdemucs --two-stems=vocals -o stems cache-audio/$id.wav >/dev/null 2>&1 </dev/null && echo "OK $id" || echo "ERROR $id"
  rm -f cache-audio/$id.wav
  ffmpeg -nostdin -i "$id.mp4" -vf "select='gt(scene,0.3)',showinfo" -an -f null - 2>&1 | grep -o "pts_time:[0-9.]*" | cut -d: -f2 > "sonido/$id.cortes.txt"
done
echo FIN
