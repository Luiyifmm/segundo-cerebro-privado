// Recoloca las miniaturas acumuladas de izquierda a derecha (colocadas al revés, cada imagen fija entra con 5 s y pisaba el arranque de la siguiente, dejando huecos).
// Lee el plan (lista de finales de cada imagen) de [70, 73.9, 83.05, 86.27, 91.3, 94.6, 97.95, 100.6] y deja la pista miniaturas sin huecos hasta 100.6.
(function () { app.enableQE(); var seq = app.project.activeSequence, r = { errores: [], clips: [] }, i, k, t, PLAN = [70, 73.9, 83.05, 86.27, 91.3, 94.6, 97.95, 100.6], D = "/Users/luiyi/Videos-Remotion/clientes/amin/AMIN_1010_01/miniaturas/", PRE = "miniaturas amin ", FIN = 100.6;
  if (app.project.name !== "AMIN EDICION.prproj" || seq.name !== "AMIN_1009_01 - SONIDO v2") return "proyecto o secuencia inesperados: " + app.project.name + " / " + seq.name;
  function seg(s) { var x = new Time(); x.seconds = s; return x; }
  function buscar(b, nombre) { for (var x = 0; x < b.children.numItems; x++) { var c = b.children[x]; if (c.type === 2) { var h = buscar(c, nombre); if (h) return h; } else if (c.name === nombre) return c; } return null; }
  var vM = -1; for (t = 0; t < seq.videoTracks.numTracks; t++) { var n = 0; for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) if (seq.videoTracks[t].clips[i].name.indexOf(PRE) === 0) n++; if (n) vM = t; }
  if (vM < 0) return "no encuentro la pista de miniaturas";
  var trM = seq.videoTracks[vM]; for (i = trM.clips.numItems - 1; i >= 0; i--) if (trM.clips[i].name.indexOf(PRE) === 0) trM.clips[i].remove(false, false);
  for (i = 0; i < PLAN.length; i++) { var a = PLAN[i], b = i < PLAN.length - 1 ? PLAN[i + 1] : FIN; if (b - a < 0.03) continue; var nom = PRE + (i + 1 < 10 ? "0" : "") + (i + 1) + ".png", it = buscar(app.project.rootItem, nom); if (!it) { app.project.importFiles([D + nom], true, app.project.getInsertionBin(), false); it = buscar(app.project.rootItem, nom); } if (!it) { r.errores.push("falta " + nom); continue; }
    trM.overwriteClip(it, a); for (k = 0; k < trM.clips.numItems; k++) if (trM.clips[k].name === nom && Math.abs(trM.clips[k].start.seconds - a) < 0.03) { var c = trM.clips[k]; c.end = seg(b); c.outPoint = seg(c.inPoint.seconds + (b - a)); for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === "AE.ADBE Motion") { c.components[x].properties[1].setValue(100, true); c.components[x].properties[0].setValue([0.5, 0.5], true); } } }
  for (i = 0; i < trM.clips.numItems; i++) if (trM.clips[i].name.indexOf(PRE) === 0) r.clips.push(trM.clips[i].start.seconds.toFixed(2) + "-" + trM.clips[i].end.seconds.toFixed(2));
  var huecos = 0; for (i = 1; i < r.clips.length; i++) if (Math.abs(parseFloat(r.clips[i].split("-")[0]) - parseFloat(r.clips[i - 1].split("-")[1])) > 0.03) huecos++; r.huecos = huecos; r.pista = trM.name;
  return JSON.stringify(r); })();
