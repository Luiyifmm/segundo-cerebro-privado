#!/bin/zsh
# exportar.sh <v> "<nombre propuesta>" → <v>/exportado/<v>-propuesta-v2.mp4 + WAV −16 LUFS (loudnorm 2 pasadas)
v=$1; NP="$2"; L=~/Videos-Remotion/clientes/amin/IMG_6887-s03/lote2; O=$L/$v/exportado; mkdir -p $O; cd ~/Videos-Remotion/premiere; PJ="Amin (recuperado 19-15).prproj"
recetas/correr-receta.sh recetas/exportar.jsx "{\"guardia\":{\"proyecto\":\"$PJ\"},\"secuencia\":\"$NP\",\"salida\":\"$O/$v-propuesta-v2.mp4\"}" 600 | grep -o '"result": "[^"]*'
recetas/correr-receta.sh recetas/exportar.jsx "{\"guardia\":{\"proyecto\":\"$PJ\"},\"secuencia\":\"$NP\",\"salida\":\"$O/$v-mezcla-original-v2.wav\",\"audio\":true}" 300 | grep -o '"result": "[^"]*'
F=~/.local/bin/ffmpeg; I=$O/$v-mezcla-original-v2.wav
J=$($F -nostdin -hide_banner -i $I -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
mi=$(echo $J | python3 -c "import sys,json;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
read ii tp lra th off <<< "$mi"; echo "entrada: $ii LUFS, pico $tp"
$F -nostdin -v error -y -i $I -af loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$ii:measured_TP=$tp:measured_LRA=$lra:measured_thresh=$th:offset=$off:linear=true -ar 48000 $O/$v-mezcla-16LUFS-v2.wav
$F -nostdin -hide_banner -i $O/$v-mezcla-16LUFS-v2.wav -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I:|Peak:)" | tr -s ' '
