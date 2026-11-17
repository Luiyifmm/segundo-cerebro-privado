#!/bin/zsh
# Uso: propuesta.sh <F2|G|H|I> "<nombre base>"  → crea «<nombre> · propuesta (Claude)» desde su corte y le pone color, subs, Flicker, voz y SFX.
set -e; v=$1; N="$2"; L=~/Videos-Remotion/clientes/amin/IMG_6887-s03/lote2; R=~/Videos-Remotion/premiere; PJ="Amin (recuperado 19-15).prproj"; NP="$N · propuesta (Claude)"
cd $R; res(){ grep -o '"result": "[^"]*' | cut -c12-; }
G="\"guardia\":{\"proyecto\":\"$PJ\"}"
recetas/correr-receta.sh recetas/clonar-secuencia.jsx "{$G,\"origen\":\"$N · corte (Claude)\",\"nuevo\":\"$NP\",\"activar\":true}" 120 | res
export PR_PROYECTO="$PJ" PR_SECUENCIA="$NP"
for p in 3 2; do recetas/correr-receta.sh recetas/lumetri-copiar.jsx "{\"guardia\":{\"proyecto\":\"$PJ\",\"secuencia\":\"$NP\"},\"destino\":\"$NP\",\"origen\":{\"secuencia\":\"Ranking negocios (Claude) v1\",\"pista\":$p,\"clip\":0},\"capaDe\":{\"secuencia\":\"Ranking negocios (Claude) v1\",\"pista\":$p,\"clip\":0},\"desde\":0,\"hasta\":999,\"guardar\":false}" 120 | res; done
PS=$(./pr.sh $L/pistas.tpl 60 | res); echo "pistas subs (índices) $PS"; PB=${PS%,*}; PA=${PS#*,}
python3 $L/gen.py $v | while read f t; do sed -i '' -e "s/__PB__/$PB/" -e "s/__PA__/$PA/" $f; echo -n "$(basename $f): "; ./pr.sh $f 300 | res; sed -e "s/__T__/$t/" -e "s#__F__#$L/$v/chk#" $L/check.tpl > $L/$v/chk.jsx; ./pr.sh $L/$v/chk.jsx 120 | res; done
echo -n "flicker: "; ./pr.sh $L/$v/flicker.jsx 300 | res
echo -n "voz: "; recetas/correr-receta.sh recetas/voz-nivelar.jsx "{\"guardia\":{\"proyecto\":\"$PJ\",\"secuencia\":\"$NP\"},\"pista\":1,\"ganancia_db\":15}" 120 | res
echo -n "sfx: "; recetas/correr-receta.sh recetas/sfx-colocar.jsx $L/$v/sfx.json 180 | res
echo -n "guardar: "; ./pr.sh ~/Videos-Remotion/clientes/amin/6887-11/subs-s04/guardar.jsx 120 | res
