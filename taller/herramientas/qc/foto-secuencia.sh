#!/bin/zsh
# Foto de una secuencia de Premiere para el ciclo de aprendizaje (solo lee).
# Uso: foto-secuencia.sh <trabajo> <antes|despues|etiqueta> "<proyecto.prproj>" "<secuencia>"
# Guarda: ~/EDICION/0 CLAUDE EDITOR/7 TRABAJOS EN CURSO/fotos/<trabajo>/<etiqueta>-AAAAMMDD-HHMM.json
set -e
T="$1"; E="$2"; P="$3"; S="$4"
[ -n "$T" ] && [ -n "$E" ] && [ -n "$P" ] && [ -n "$S" ] || { echo "Uso: foto-secuencia.sh <trabajo> <antes|despues> <proyecto.prproj> <secuencia>"; exit 1; }
D="$HOME/EDICION/0 CLAUDE EDITOR/7 TRABAJOS EN CURSO/fotos/$T"; mkdir -p "$D"
OUT="$D/$E-$(date +%Y%m%d-%H%M).json"
CFG=$(printf '{"guardia":{"proyecto":"%s","secuencia":"%s"},"secuencia":"%s"}' "$P" "$S" "$S")
"$HOME/Videos-Remotion/premiere/recetas/correr-receta.sh" "$HOME/Videos-Remotion/premiere/recetas/leer-secuencia.jsx" "$CFG" 120 \
 | "$HOME/.local/node/bin/node" -e 'let t="";process.stdin.on("data",d=>t+=d).on("end",()=>{let r;try{r=JSON.parse(t);}catch(e){console.error("ERROR: respuesta ilegible del puente");process.exit(2);}if(r.error){console.error("ERROR: "+r.error+" (¿Premiere abierto con el panel MCP Bridge?)");process.exit(2);}let x=r.result;if(x===undefined){console.error("ERROR: el puente no devolvió resultado");process.exit(2);}if(typeof x==="string"&&x.startsWith("ERROR")){console.error(x);process.exit(1);}if(typeof x==="string")x=JSON.parse(x);require("fs").writeFileSync(process.argv[1],JSON.stringify(x));console.log(process.argv[1]+"  ("+x.clips.length+" clips)");})' "$OUT"
