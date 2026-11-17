#!/bin/zsh
# Ejecuta una receta .jsx con su configuración JSON en Premiere (vía pr.sh).
# Uso: correr-receta.sh <receta.jsx> <config.json | 'json en línea'> [segundos]
# La receta lleva el marcador __CFG__, que se sustituye por el JSON. No modifica la receta.
set -e
R="$1"; C="$2"; T="${3:-120}"
[ -f "$R" ] || { echo '{"error":"no existe la receta"}'; exit 1; }
[ -f "$C" ] && C="$(cat "$C")"
mkdir -p /tmp/premiere-recetas
OUT="/tmp/premiere-recetas/$(basename "$R" .jsx)-$(date +%s).jsx"
"$HOME/.local/node/bin/node" -e '
const fs=require("fs");const [r,c,o]=process.argv.slice(1);
let cfg; try{cfg=JSON.stringify(JSON.parse(c));}catch(e){console.log(JSON.stringify({error:"JSON de configuración no válido: "+e.message}));process.exit(1);}
const s=fs.readFileSync(r,"utf8"); if(!s.includes("__CFG__")){console.log(JSON.stringify({error:"la receta no tiene __CFG__"}));process.exit(1);}
fs.writeFileSync(o,s.split("__CFG__").join(cfg));' "$R" "$C" "$OUT"
# Guardia: si el JSON trae "guardia": {"proyecto": …, "secuencia": …}, pr.sh no ejecuta nada en otro proyecto o secuencia.
GP=$("$HOME/.local/node/bin/node" -e 'const c=JSON.parse(process.argv[1]);process.stdout.write((c.guardia&&c.guardia.proyecto)||"")' "$C")
GS=$("$HOME/.local/node/bin/node" -e 'const c=JSON.parse(process.argv[1]);process.stdout.write((c.guardia&&c.guardia.secuencia)||"")' "$C")
PR_PROYECTO="${PR_PROYECTO:-$GP}" PR_SECUENCIA="${PR_SECUENCIA:-$GS}" "$HOME/Videos-Remotion/premiere/pr.sh" "$OUT" "$T"
