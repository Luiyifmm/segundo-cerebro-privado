#!/bin/zsh
# Ejecuta un archivo .jsx (ExtendScript) en Premiere a través del puente y muestra la respuesta.
B=/tmp/premiere-mcp-bridge; id="claude$(date +%s)$RANDOM"
"$HOME/.local/node/bin/node" -e 'const fs=require("fs");fs.writeFileSync(process.argv[2],JSON.stringify({id:process.argv[1],script:fs.readFileSync(process.argv[3],"utf8"),timeoutMs:Math.max(45000,(+process.argv[4]||60)*1000)}))' "$id" "$B/command-$id.json.part" "$1" "${2:-60}"
mv "$B/command-$id.json.part" "$B/command-$id.json"
for i in {1..${2:-60}}; do [ -f "$B/response-$id.json" ] && break; /bin/sleep 1; done
cat "$B/response-$id.json" 2>/dev/null || echo '{"error":"sin respuesta del puente"}'; rm -f "$B/response-$id.json"
