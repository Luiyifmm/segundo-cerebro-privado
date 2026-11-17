# Centra abajo, como los del usuario, los gráficos que salen de "Actualizar subtítulo a gráfico" (quedan con la caja arriba a la izquierda).
# El texto no se puede leer por script: se empareja cada gráfico con su línea del .srt por tiempo de inicio y se mide el ancho con CoreText.
# Uso: python3 centrar-subtitulos-convertidos.py <archivo.srt> <medir> <fuente> <tamaño> <y> <salida.jsx>
# Eric YT (estilo del usuario, Sequel Sans Heavy 64): medir con 64, y=0.9083, y además Escala del Texto 151.5 (los convertidos salen a ~42 px).
# medir = ~/Videos-Remotion/herramientas/fotogramas/medir-texto <FuentePostScript> <tamaño> "frase" … (ancho en px con CoreText)
import sys, re, subprocess, json
srt, medir, fuente, tam, y, out = sys.argv[1:7]
def seg(t): h, m, s = t.replace(",", ".").split(":"); return int(h) * 3600 + int(m) * 60 + float(s)
L = [(seg(m.group(1)), m.group(3).strip()) for m in re.finditer(r"(\S+) --> (\S+)\n(.+?)\n\n", open(srt, encoding="utf-8").read() + "\n\n", re.S)]
anchos = subprocess.run([medir, fuente, tam] + [t for _, t in L], capture_output=True, text=True).stdout.split("\n")
P = [[round(a, 3), round(0.5 - float(w.split(" ")[0]) / 2 / 1280, 5)] for (a, _), w in zip(L, anchos)]
js = '''(function () { var s = app.project.activeSequence, P = %s, Y = %s, n = 0, sin = 0;
  for (var t = 1; t < s.videoTracks.numTracks; t++) { var tr = s.videoTracks[t]; for (var i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i], x = null;
      for (var j = 0; j < P.length; j++) if (Math.abs(P[j][0] - c.start.seconds) < 0.06) { x = P[j][1]; break; } if (x === null) continue;
      var tx = null; for (var k = 0; k < c.components.numItems; k++) if (c.components[k].displayName === "Texto") tx = c.components[k]; if (!tx) { sin++; continue; }
      var p = tx.properties[2].getValue(); if (Math.abs(p[0] - 0.125) > 0.002 && Math.abs(p[1] - 0.65) > 0.002 && Math.abs(p[1] - 0.9097) > 0.002) continue;
      tx.properties[2].setValue([x, Y], true); tx.properties[3].setValue(151.5, true); n++; } }
  app.project.save(); return "centrados " + n + (sin ? " | sin texto " + sin : ""); })();''' % (json.dumps(P), y)
open(out, "w").write(js); print(len(P), "líneas")
