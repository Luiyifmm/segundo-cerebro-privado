#!/bin/zsh
# Transcribe r01..r34 por palabra (WhisperX + verificador). Español: r05 r08 r27; el resto inglés.
W="${0:A:h}"; cd "$W"
for f in src/r*.mp4; do n=${f:t:r}; [[ -f trans/$n.ok ]] && continue
  id=en; [[ $n == r05 || $n == r08 || $n == r27 ]] && id=es
  ~/Videos-Remotion/voz/transcribir.sh "$W/$f" --idioma $id --salida "$W/trans" > trans/$n.log 2>&1; echo "$n $id rc=$?" >> trans/_estado.txt; touch trans/$n.ok
done
echo FIN >> trans/_estado.txt
