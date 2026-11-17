#!/bin/zsh
# Elige el fotograma más nítido de un tramo y lo saca a resolución completa (con conversión HDR→SDR si el vídeo es HLG/PQ de iPhone).
# Uso: mejor-fotograma.sh <video> <desde_s> <duracion_s> <salida.png>   → imprime los 5 mejores tiempos (varianza del laplaciano, zona central)
V="$1"; T0="$2"; DUR="$3"; OUT="$4"; PY=~/Videos-Remotion/herramientas/separar-env/bin/python; TMP=$(mktemp -d)
ffmpeg -loglevel error -y -ss "$T0" -t "$DUR" -i "$V" -vf "scale=540:-2,format=gray" -f rawvideo "$TMP/g.raw"
H=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$V" | awk -F, '{print ($1>$2)?int(540*$2/$1):int(540*$1/$2)}')
FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$V" | awk -F/ '{print $1/$2}')
MEJOR=$($PY - "$TMP/g.raw" "$T0" "$FPS" <<'P'
import sys, numpy as np
f, t0, fps = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]); a = np.fromfile(f, np.uint8); w = 540
h = None
for hh in range(200, 1200, 2):
    if a.size % (w * hh) == 0: h = hh
a = a.reshape(-1, h, w).astype(np.float32); r = a[:, int(h*.2):int(h*.8), int(w*.1):int(w*.9)]
lap = r[:,1:-1,1:-1]*4 - r[:,:-2,1:-1] - r[:,2:,1:-1] - r[:,1:-1,:-2] - r[:,1:-1,2:]; v = lap.var(axis=(1,2)); o = np.argsort(-v)[:5]
print(" ".join(f"{t0+i/fps:.3f}" for i in o), file=sys.stderr); print(f"{t0+o[0]/fps:.3f}")
P
)
TR=$(ffprobe -v error -select_streams v:0 -show_entries stream=color_transfer -of csv=p=0 "$V")
if [[ "$TR" == arib-std-b67 || "$TR" == smpte2084 ]]; then VF="zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=rgb24"; else VF="format=rgb24"; fi
ffmpeg -loglevel error -y -ss "$MEJOR" -i "$V" -vf "$VF" -frames:v 1 "$OUT" && echo "mejor: $MEJOR s → $OUT"; rm -rf "$TMP"
