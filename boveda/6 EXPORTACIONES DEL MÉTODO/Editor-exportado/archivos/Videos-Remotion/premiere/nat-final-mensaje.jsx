// CLIENTE-N_1010_01 (Reaccion a los pasos): encuadre de los cortes igual al que dejó el usuario (botella arriba, reacción abajo) y mensaje al final.
(function () { app.enableQE(); var seq = app.project.activeSequence, r = { errores: [], hecho: [] }, i, k, t, T = 254016000000, FIN = 15.6;
  if (seq.name !== "CLIENTE-N_1010_01 - Reaccion a los pasos") return "secuencia inesperada: " + seq.name;
  var MOGRT = "~/Videos-Remotion/clientes/_plantillas/Texto ClienteN deportivo v1.mogrt";
  function seg(s) { var x = new Time(); x.seconds = s; return x; }
  function vp(n) { for (var x = 0; x < seq.videoTracks.numTracks; x++) if (seq.videoTracks[x].name === n) return x; return -1; }
  function mot(c) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === "AE.ADBE Motion") return c.components[x]; return null; }
  function alargar(v) { if (v < 0) return; var tr = seq.videoTracks[v], c = tr.clips[tr.clips.numItems - 1]; if (!c) return; var d = FIN - c.start.seconds; c.end = seg(FIN); c.outPoint = seg(c.inPoint.seconds + d); r.hecho.push(tr.name + " hasta " + c.end.seconds.toFixed(2)); }
  var vR = vp("REACCION"), trV = seq.videoTracks[vR]; for (i = 0; i < trV.clips.numItems; i++) { var m = mot(trV.clips[i]); m.properties[0].setValue([0.48404258489609, 0.63846164941788], true); m.properties[1].setValue(112.3, true); }
  alargar(vR); alargar(vp("BOTELLA")); alargar(vp("CONTADOR")); alargar(vp("TITULO"));
  var vM = vp("MORALEJA"); if (vM < 0 || seq.videoTracks[vM].clips.numItems) return JSON.stringify({ error: "pista MORALEJA ocupada o ausente", r: r });
  var ini = seq.videoTracks[vR].clips[trV.clips.numItems - 1].start.seconds + 0.3, medio = ini + (FIN - ini) * 0.46, msgs = [[ini, medio, "NO NECESITAS\r20.000 PASOS", [255, 45, 45], 54], [medio, FIN, "NECESITAS DE 8.000 A 12.000\rTODOS LOS DÍAS", [0, 255, 4], 40]];
  for (i = 0; i < 2; i++) { var M = msgs[i], c = seq.importMGT(MOGRT, seg(M[0]).ticks, vM, 0); if (!c) { r.errores.push("mensaje " + i); continue; } c.end = seg(M[1]); c.outPoint = seg(c.inPoint.seconds + (M[1] - M[0])); var g = c.getMGTComponent(); for (k = 0; k < g.properties.numItems; k++) { var p = g.properties[k], n = p.displayName; if (n === "Texto") { var j = JSON.parse(p.getValue()); j.textEditValue = M[2]; p.setValue(JSON.stringify(j), true); } else if (n === "Color") p.setColorValue(255, M[3][0], M[3][1], M[3][2], true); else if (n.indexOf("Tamano") === 0) p.setValue(M[4], true); } mot(c).properties[0].setValue([0.5, 0.80], true); c.name = M[2].replace(/\r/g, " "); r.hecho.push("mensaje " + M[0].toFixed(2) + "-" + M[1].toFixed(2)); }
  seq = app.project.activeSequence; r.fin = (seq.end / T).toFixed(2);
  var q = qe.project.getActiveSequence(), ts = [0.2, 2.8, 6.0, 9.0, 12.7, 13.6, 15.2]; for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/natj-" + i); }
  return JSON.stringify(r); })();
