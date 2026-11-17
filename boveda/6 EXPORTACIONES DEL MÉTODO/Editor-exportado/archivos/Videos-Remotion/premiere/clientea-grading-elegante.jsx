// CLIENTE-A_1010_01: gradación "elegante" en los 16 clips de vídeo (66 s en adelante): más contraste con negros suaves (película descolorida),
// luces contenidas, un punto más frío y menos saturado, nitidez y viñeta. Valores anteriores: contraste 12, resaltados -12, sombras 6, blancos 5, negros -8, saturación 108.
(function () { app.enableQE(); var seq = app.project.activeSequence, n = 0, i, k, T = 254016000000; if (app.project.name !== "CLIENTE-A EDICION.prproj" || seq.name.indexOf("SONIDO v2") < 0) return "proyecto o secuencia inesperados";
  var vals = { 14: -9, 15: 2, 16: 90, 19: 0.15, 20: 36, 21: -32, 22: -14, 23: 6, 24: -6, 40: 12, 41: 22, 42: 16, 43: 96, 110: -2.3, 111: 38, 112: 10, 113: 75 }, tr = seq.videoTracks[0];
  for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i]; if (c.start.seconds < 65.9) continue; for (k = 0; k < c.components.numItems; k++) if (c.components[k].displayName === "Color de Lumetri") { for (var ix in vals) { try { c.components[k].properties[+ix].setValue(vals[ix], true); } catch (x) {} } n++; } }
  var q = qe.project.getActiveSequence(), ts = [71.5, 79.0, 101.0, 107.0]; for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/gr2-" + i); }
  return "clips " + n; })();
