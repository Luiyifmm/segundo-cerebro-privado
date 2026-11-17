#!/bin/zsh
# Ejecuta un archivo .jsx (ExtendScript) en Premiere a través del puente y muestra la respuesta.
# Uso: pr.sh <archivo.jsx> [segundos]
#
# Envoltura (por defecto): un error del script vuelve como "ERROR: <mensaje> @ línea <n>",
#   en vez del genérico "CEP evalScript() failed". PR_SIN_ENVOLTURA=1 lo manda tal cual.
# Guardia (recomendada al ESCRIBIR): no ejecuta nada si el proyecto o la secuencia activos no son los esperados.
#   PR_PROYECTO=<nombre.prproj | ruta | parte de la ruta>   PR_SECUENCIA=<nombre exacto>
#   Ejemplo: PR_PROYECTO="Amin.prproj" PR_SECUENCIA="IMG_6887" pr.sh receta.jsx 120
B=/tmp/premiere-mcp-bridge; id="claude$(date +%s)$RANDOM"
"$HOME/.local/node/bin/node" "$HOME/Videos-Remotion/premiere/envoltura.js" "$id" "$B/command-$id.json.part" "$1" "${2:-60}"
mv "$B/command-$id.json.part" "$B/command-$id.json"
for i in {1..${2:-60}}; do [ -f "$B/response-$id.json" ] && break; /bin/sleep 1; done
if [ -f "$B/response-$id.json" ]; then cat "$B/response-$id.json"; rm -f "$B/response-$id.json"
else
  # Sin respuesta: retirar la orden para que NO se ejecute más tarde (al reabrir Premiere el panel ejecutaría las pendientes).
  rm -f "$B/command-$id.json"
  echo '{"error":"sin respuesta del puente (orden retirada; no se ejecutará después)"}'
fi
