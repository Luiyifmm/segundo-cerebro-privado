(function () { var seq = app.project.activeSequence, T = 254016000000, pos = seq.getPlayerPosition().ticks, ts = [2.1, 3.95, 20.0], i; app.enableQE(); var q = qe.project.getActiveSequence();
  for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/v4b-" + i); }
  seq.setPlayerPosition(pos); return "ok"; })();
