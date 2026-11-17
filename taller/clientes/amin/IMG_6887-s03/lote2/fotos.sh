#!/bin/zsh
# fotos.sh <v> "<nombre propuesta>" "[t1,t2,…]" → $L/<v>/fot/hoja.png
v=$1; NP="$2"; T=$3; L=~/Videos-Remotion/clientes/amin/IMG_6887-s03/lote2; D=$L/$v/fot; mkdir -p $D; rm -f $D/f-*.png(N)
cd ~/Videos-Remotion/premiere; recetas/correr-receta.sh recetas/abrir-secuencia.jsx "{\"guardia\":{\"proyecto\":\"Amin (recuperado 19-15).prproj\"},\"secuencias\":[\"$NP\"]}" 60 >/dev/null; sed "s#__CFG__#{\"t\":$T,\"dir\":\"$D\",\"p\":\"f\"}#" ~/Videos-Remotion/clientes/amin/6887-11/subs-s04/fotogramas.tpl > $L/$v/fot.jsx
PR_PROYECTO="Amin (recuperado 19-15).prproj" PR_SECUENCIA="$NP" ./pr.sh $L/$v/fot.jsx 400 | grep -o '"result": "[^"]*'
n=$(python3 -c "print(len($T))"); rm -f $D/hoja.png; recetas/hoja.sh $D/hoja.png $(for i in $(seq 0 $((n-1))); do echo $D/f-$i.png; done) --ancho 2400 --columnas 8 --rotulos >/dev/null; echo $D/hoja.png
