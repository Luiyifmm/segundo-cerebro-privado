(function () { var seq = app.project.activeSequence, tr = seq.videoTracks[4], r = { n: tr.clips.numItems, mal: 0 }, i;
  for (i = 0; i < tr.clips.numItems; i++) { var k = tr.clips[i]; if (Math.abs(k.inPoint.seconds) > 0.01 || Math.abs(k.outPoint.seconds - (k.end.seconds - k.start.seconds)) > 0.02) r.mal++; }
  r.fin = seq.end / 254016000000; r.primero = tr.clips[0].start.seconds + "-" + tr.clips[0].end.seconds.toFixed(2);
  var c = tr.clips[2], ps = c.getMGTComponent().properties, p = ps.getParamForDisplayName("Tamano (50 = normal, 100 = doble)");
  r.clip = c.name; r.antes = p.getValue(); p.setValue(80, true); r.tras = p.getValue();
  app.enableQE(); var q = qe.project.getActiveSequence(), pos = seq.getPlayerPosition().ticks; seq.setPlayerPosition(String(Math.round(2.1 * 254016000000))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/v6-grande");
  p.setValue(r.antes, true); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/v6-normal");
  seq.setPlayerPosition(pos); r.restaurado = p.getValue(); app.project.save(); return JSON.stringify(r); })();
