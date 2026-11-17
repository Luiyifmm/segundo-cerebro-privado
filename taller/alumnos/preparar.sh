#!/bin/zsh
# Baja del panel y prepara cada vídeo: bruto + ficha.json + prep/ (transcripción verificada y hojas).
# Comprueba sola la transcripción: voz muy baja (< −40 dB) o frases repetidas en bucle -> repite con large-v3 (+ ganancia).
# Uso: LOTE=<carpeta del lote> preparar.sh carpeta:video_id [carpeta:video_id ...]
set -e; H="${0:A:h}"; cd "${LOTE:-$PWD}"
PYW=~/Videos-Remotion/herramientas/entornos/whisperx/bin/python
for par in "$@"; do
  d="${par%%:*}"; id="${par##*:}"
  uv run -q --with "psycopg[binary]" python "$H/panel.py" bajar "$id" "$d" 2>/dev/null | tail -1
  f=$(ls "$d"/bruto.* | head -1)
  [[ -f "$d/prep/palabras.json" ]] || ~/Videos-Remotion/sistema/preparar-clip.sh "$PWD/$f" --salida "$PWD/$d/prep" --idioma es --sin-corte 2>&1 | grep -E "Transcripción|ERROR" || true
  read nivel fiab rep <<< $(python3 -c "
import json,collections;ws=json.load(open('$d/prep/palabras.json'));n=max(len(ws),1)
db=sorted(w['nivel_db'] for w in ws if w.get('nivel_db') is not None);t=[w['texto'].lower().strip('.,¿?¡!') for w in ws]
c=collections.Counter(tuple(t[i:i+5]) for i in range(len(t)-4))
print(int(db[len(db)//2]) if db else 0, int(100*sum(1 for w in ws if w.get('fiable'))/n), max(c.values()) if c else 0)")
  echo "$d: nivel mediano ${nivel} dB · fiables ${fiab} % · máx. repetición ${rep}"
  if [[ $nivel -lt -30 || $fiab -lt 60 || $rep -ge 4 ]]; then
    g=0; [[ $nivel -lt -30 ]] && g=$(( -24 - nivel ))
    echo "  -> transcripción dudosa: repito con large-v3 (ganancia $g dB)"
    u="$PWD/$d/${d}_bruto.${f##*.}"; cp -n "$f" "$u"
    ~/Videos-Remotion/voz/transcribir.sh "$u" --modelo large-v3 --ganancia $g > "$d/trans2.log" 2>&1 || true
    v=~/Videos-Remotion/voz/salida-whisperx/${d}_bruto.verificada.json
    if [[ -f $v ]]; then cp -n "$d/prep/palabras.json" "$d/prep/palabras_whisper1.json"; cp "$v" "$d/prep/palabras.json"; echo "  -> prep/palabras.json sustituida (la 1.ª queda en palabras_whisper1.json)"; fi
  fi
done
