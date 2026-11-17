#!/bin/zsh
# preparar-clip.sh — los 4 primeros pasos del flujo de Joseph, en una orden. NO toca el original ni Premiere.
#   1) transcripción palabra a palabra con tiempos en milisegundos (WhisperX + verificador)
#   2) desglose de fotogramas (hojas a 2 fotogramas por segundo, con la hora en cada uno)
#   3) corte de silencios (copia cortada + lista de tramos que se conservan)
#   4) documento de plan de escenas: izquierda casillas vacías, derecha cada línea del guion
# uso: preparar-clip.sh <vídeo> [--salida carpeta] [--idioma auto|es|en] [--minimo 0.45] [--aire 0.08] [--umbral -35] [--sin-corte] [--marca "Nombre:#acento,#oscuro"]
# Salida (por defecto junto al vídeo, en "<nombre> · preparado/"): palabras.json, hojas/, cortado.mp4, tramos.json, plan.html, plan.md, RESUMEN.md
set -e
export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"
R="$HOME/Videos-Remotion"; V="$1"; [[ -f "$V" ]] || { echo "uso: preparar-clip.sh <vídeo> [--salida carpeta] [--idioma es] [--sin-corte]"; exit 2; }
V="${V:A}"; shift
SAL="${V:r} · preparado"; MARCA=""; ID=auto; MIN=0.45; AIRE=0.08; UMB=-35; CORTE=1
while [[ $# -gt 0 ]]; do case "$1" in --salida) SAL="$2"; shift 2;; --idioma) ID="$2"; shift 2;; --minimo) MIN="$2"; shift 2;; --aire) AIRE="$2"; shift 2;; --umbral) UMB="$2"; shift 2;; --sin-corte) CORTE=0; shift;; --marca) MARCA="$2"; shift 2;; *) echo "opción desconocida: $1"; exit 2;; esac; done
mkdir -p "$SAL/hojas" "$SAL/_trans"; N="${V:t:r}"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
echo "1/4 transcripción ($ID)…"
set +e; "$R/voz/transcribir.sh" "$V" --idioma "$ID" --salida "$SAL/_trans" > "$SAL/_trans/registro.txt" 2>&1; RC=$?; set -e
P="$SAL/_trans/$N.verificada.json"; [[ -f "$P" ]] || P="$SAL/_trans/$N.palabras.json"
[[ -f "$P" ]] || { echo "ERROR: no hay transcripción (ver $SAL/_trans/registro.txt)"; exit 2; }
cp "$P" "$SAL/palabras.json"
case $RC in 0) VER="verificada (coincide con la voz)";; 1) VER="NO corresponde a este audio: NO usar para cortes";; *) VER="NO VERIFICADA (el verificador no pudo comprobar la voz; con música es habitual)";; esac
echo "2/4 hojas de fotogramas…"
ffmpeg -v error -y -i "$V" -vf "fps=2,scale=150:-2,drawtext=text='%{pts\:hms}':x=3:y=3:fontsize=13:fontcolor=yellow:box=1:boxcolor=black@0.7,tile=10x5" "$SAL/hojas/hoja_%02d.jpg" 2>/dev/null
QUIT="—"; TR=()
if [[ $CORTE == 1 ]]; then
  echo "3/4 silencios…"
  ( cd "$R/voz" && node cortar-silencios.js "$V" --umbral $UMB --minimo $MIN --aire $AIRE > "$SAL/_trans/silencios.txt" 2>&1 ) || true
  [[ -f "$R/voz/salida/$N.tramos.json" ]] && cp "$R/voz/salida/$N.tramos.json" "$SAL/tramos.json"
  [[ -f "$R/voz/salida/$N-cortado.mp4" ]] && mv "$R/voz/salida/$N-cortado.mp4" "$SAL/cortado.mp4"
  if [[ -f "$SAL/tramos.json" && -f "$SAL/cortado.mp4" ]]; then
    D2=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SAL/cortado.mp4"); QUIT=$(printf "%.1f s (de %.1f a %.1f)" $((DUR-D2)) $DUR $D2); TR=(--tramos "$SAL/tramos.json")
  else QUIT="FALLÓ (ver _trans/silencios.txt)"; fi
else echo "3/4 silencios: omitido"; fi
echo "4/4 plan de escenas…"
VID="$V"; [[ ${#TR[@]} -gt 0 ]] && VID="$SAL/cortado.mp4"
PYP="$R/herramientas/entornos/whisperx/bin/python"; [[ -x "$PYP" ]] || PYP=/usr/bin/python3   # con PIL saca las paletas del propio vídeo
"$PYP" "$R/sistema/plan-escenas.py" "$SAL/palabras.json" --salida "$SAL" --titulo "$N" --video "$VID" "${TR[@]}" ${MARCA:+--marca "$MARCA"}
NP=$(/usr/bin/python3 -c 'import json,sys; d=json.load(open(sys.argv[1])); print(len(d if isinstance(d,list) else d.get("palabras",[])))' "$SAL/palabras.json")
cat > "$SAL/RESUMEN.md" <<EOF
# $N · preparado
- Original: \`$V\` ($(printf "%.1f" $DUR) s). **No se ha tocado.**
- Transcripción: $NP palabras · $VER.
- Silencios quitados: $QUIT. Umbral $UMB dB, mínimo $MIN s, aire $AIRE s. **Hay que ver \`cortado.mp4\` antes de dar el corte por bueno** (no detecta tomas repetidas ni errores: eso es \`primer-corte\`).
- Hojas de fotogramas: \`hojas/\` (2 por segundo).
- Plan de escenas: \`plan.html\` (elegir paleta y letras, rellenar o corregir la casilla de cada línea, «Copiar plan» y pegarlo en el chat) · \`plan.md\`. Para que lleve mis propuestas: \`plan-escenas.py … --propuestas propuestas.json\`.
- Los tiempos del plan son los del vídeo $([[ ${#TR[@]} -gt 0 ]] && echo "YA CORTADO" || echo "ORIGINAL").
EOF
cat "$SAL/RESUMEN.md"
