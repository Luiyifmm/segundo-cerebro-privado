(function () { app.enableQE(); var r = { hecho: [], errores: [] }, i, t, T = 254016000000, S = "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/", B = null;
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === "CLIENTE-A_1010_01 - B motion graphics nuevos") B = app.project.sequences[i]; if (!B) return "sin secuencia B";
  app.project.openSequence(B.sequenceID); var q = qe.project.getActiveSequence(), fx = qe.project.getVideoEffectByName("Voltear horizontal"); if (!fx) fx = qe.project.getVideoEffectByName("Horizontal Flip"); if (!fx) return "no encuentro el efecto de volteo";
  var tr = B.videoTracks[0], qt = q.getVideoTrackAt(0), n = 0, ya = 0;
  for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i]; if (c.start.seconds < 65.9 || c.start.seconds > 108.2) continue; var tiene = false; for (t = 0; t < c.components.numItems; t++) if (/Voltear horizontal|Horizontal Flip/.test(c.components[t].displayName)) tiene = true; if (tiene) { ya++; continue; }
    for (t = 0; t < qt.numItems; t++) { var qc = qt.getItemAt(t); if (qc && qc.type === "Clip" && Math.abs(qc.start.secs - c.start.seconds) < 0.02) { qc.addVideoEffect(fx); n++; break; } } }
  r.hecho.push("clips volteados: " + n + " (ya lo estaban: " + ya + ")");
  var ts = [67.5, 80.5, 100.5, 106.5]; for (i = 0; i < ts.length; i++) { B.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, S + "esp-" + i); }
  return JSON.stringify(r); })();
