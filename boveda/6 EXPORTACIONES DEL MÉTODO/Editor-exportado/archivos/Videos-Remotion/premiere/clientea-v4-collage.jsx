// CLIENTE-A_1010_01: motion graphics en estilo collage en los dos marcadores (escuela encima de las versiones anteriores, cadenas en su pista).
(function () { app.enableQE(); var seq = app.project.activeSequence, r = { errores: [], puesto: [] }, i, k, t2, T = 254016000000, D = "~/Videos-Remotion/clientes/clientea/CLIENTE-A_1010_01/motion/";
  if (seq.name.indexOf("SONIDO v2") < 0) return "secuencia inesperada: " + seq.name;
  function buscar(b, nombre) { for (var x = 0; x < b.children.numItems; x++) { var c = b.children[x]; if (c.type === 2) { var h = buscar(c, nombre); if (h) return h; } else if (c.name === nombre) return c; } return null; }
  function traer(ruta) { var n = ruta.substr(ruta.lastIndexOf("/") + 1), it = buscar(app.project.rootItem, n); if (it) return it; app.project.importFiles([ruta], true, app.project.getInsertionBin(), false); return buscar(app.project.rootItem, n); }
  function pistaDe(nombre, s) { for (t2 = 0; t2 < seq.videoTracks.numTracks; t2++) for (i = 0; i < seq.videoTracks[t2].clips.numItems; i++) { var c = seq.videoTracks[t2].clips[i]; if (c.name === nombre && Math.abs(c.start.seconds - s) < 0.05) return t2; } return -1; }
  var vE = pistaDe("MG escuela a empleado (sin emojis).mp4", 102.2), vC = pistaDe("MG romper cadenas v2.mp4", 109.3333), itE = traer(D + "MG escuela (collage).mp4"), itC = traer(D + "MG romper cadenas (collage).mp4");
  if (vC >= 0 && itC) { seq.videoTracks[vC].overwriteClip(itC, 109.3333); r.puesto.push("cadenas en " + seq.videoTracks[vC].name); } else r.errores.push("cadenas " + vC);
  if (vE >= 0 && itE) { seq.videoTracks[vE].overwriteClip(itE, 102.2); r.puesto.push("escuela en " + seq.videoTracks[vE].name); } else r.errores.push("escuela " + vE);
  var q = qe.project.getActiveSequence(), ts = [102.8, 103.9, 105.2, 110.2, 111.0, 112.2]; for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/v5-" + i); }
  return JSON.stringify(r); })();
