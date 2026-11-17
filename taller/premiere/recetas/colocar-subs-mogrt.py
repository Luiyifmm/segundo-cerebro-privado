# Genera los .jsx que colocan subtítulos MOGRT (línea + palabra clave) en una pista VACÍA, en orden de tiempo y por tandas de 23.
# OJO: importMGT mete la plantilla con 30 s y pisa todo lo que haya detrás en esa pista antes de recortarla:
# por eso la pista debe estar vacía y las tandas van en orden. Nunca entre clips existentes.
# Uso: python3 colocar-subs-mogrt.py <subs.json> <cfg.json con subPlantilla/subAjustes/colorClave/subPos> <pista (0=V1)> <nombre de secuencia> <carpeta salida>
import json, sys, os
subs, cfg, pista, sec, out = json.load(open(sys.argv[1])), json.load(open(sys.argv[2])), int(sys.argv[3]), sys.argv[4], sys.argv[5]
A = {"pl": cfg["subPlantilla"], "aj": cfg["subAjustes"], "col": cfg["colorClave"], "pos": cfg["subPos"], "esc": 100}
T = '''(function () { var s = app.project.activeSequence, L = %s, A = %s, T = 254016000000, n = 0, i, P0 = %d;
  if (s.name.indexOf(%s) < 0) return "activa: " + s.name;
  var tr = s.videoTracks[P0]; for (i = 0; i < tr.clips.numItems; i++) if (tr.clips[i].end.seconds > L[0][0] + 0.01) return "pista no vacía desde " + L[0][0];
  function seg(x) { var y = new Time(); y.seconds = x; return y; }
  for (i = 0; i < L.length; i++) { var u = L[i], cl = s.importMGT(A.pl, String(Math.round(u[0] * T)), P0, 0); if (!cl) continue; cl.end = seg(u[1]);
    var P = cl.getMGTComponent().properties, pr = {}; for (var k in A.aj) pr[k] = A.aj[k]; pr["Linea"] = u[2]; pr["Palabra clave"] = u[3];
    for (var y = 0; y < P.numItems; y++) { var pp = P[y], v = pr[pp.displayName]; if (pp.displayName === "Color clave") { pp.setColorValue(255, A.col[0], A.col[1], A.col[2], true); continue; } if (v === undefined) continue;
      try { if (typeof v === "string") { var j = JSON.parse(pp.getValue()); j.textEditValue = v; j.fontTextRunLength = [v.length]; pp.setValue(JSON.stringify(j), true); } else pp.setValue(v, true); } catch (e2) {} }
    for (var x = 0; x < cl.components.numItems; x++) if (cl.components[x].matchName === "AE.ADBE Motion") { cl.components[x].properties[0].setValue(A.pos, true); cl.components[x].properties[1].setValue(A.esc, true); }
    cl.name = (u[2] + " " + u[3]).replace(/^\\s+|\\s+$/g, ""); n++; }
  app.project.save(); return "subtítulos " + n + "/" + L.length; })();'''
os.makedirs(out, exist_ok=True); n = 0
for n, i in enumerate(range(0, len(subs), 23)):
    open(os.path.join(out, "tanda%d.jsx" % n), "w").write(T % (json.dumps(subs[i:i + 23], ensure_ascii=False), json.dumps(A, ensure_ascii=False), pista, json.dumps(sec, ensure_ascii=False)))
print(n + 1, "tandas en", out)
