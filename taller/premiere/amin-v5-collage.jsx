// AMIN_1010_01: versión 2 de los motion graphics collage (glow, ambiente, línea en los ojos, arrodillado, persona libre grande).
(function () { app.enableQE(); var seq = app.project.activeSequence, r = { errores: [], puesto: [] }, i, t2, T = 254016000000, D = "/Users/luiyi/Videos-Remotion/clientes/amin/AMIN_1010_01/motion/";
  if (seq.name.indexOf("SONIDO v2") < 0) return "secuencia inesperada: " + seq.name;
  function buscar(b, nombre) { for (var x = 0; x < b.children.numItems; x++) { var c = b.children[x]; if (c.type === 2) { var h = buscar(c, nombre); if (h) return h; } else if (c.name === nombre) return c; } return null; }
  function traer(ruta) { var n = ruta.substr(ruta.lastIndexOf("/") + 1), it = buscar(app.project.rootItem, n); if (it) return it; app.project.importFiles([ruta], true, app.project.getInsertionBin(), false); return buscar(app.project.rootItem, n); }
  function pistaDe(nombre, s) { for (t2 = 0; t2 < seq.videoTracks.numTracks; t2++) for (i = 0; i < seq.videoTracks[t2].clips.numItems; i++) { var c = seq.videoTracks[t2].clips[i]; if (c.name === nombre && Math.abs(c.start.seconds - s) < 0.3) return [t2, c.start.seconds]; } return null; }
  var pE = pistaDe("MG escuela (collage).mp4", 102.2), pC = pistaDe("MG romper cadenas (collage).mp4", 109.3333), itE = traer(D + "MG escuela (collage v2).mp4"), itC = traer(D + "MG romper cadenas (collage v2).mp4");
  if (pC && itC) { seq.videoTracks[pC[0]].overwriteClip(itC, pC[1]); r.puesto.push("cadenas " + pC[1].toFixed(2)); } else r.errores.push("cadenas no encontrada");
  if (pE && itE) { seq.videoTracks[pE[0]].overwriteClip(itE, pE[1]); r.puesto.push("escuela " + pE[1].toFixed(2)); } else r.errores.push("escuela no encontrada");
  var q = qe.project.getActiveSequence(), ts = [102.8, 104.0, 105.3, 110.2, 111.0, 112.2]; for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/v6-" + i); }
  return JSON.stringify(r); })();
