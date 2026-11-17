(function () { var seq = app.project.activeSequence, T = 254016000000, p0 = seq.getPlayerPosition().ticks; app.enableQE(); var q = qe.project.getActiveSequence();
  seq.setPlayerPosition(String(Math.round(20.5 * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/col-ahora");
  seq.setPlayerPosition(p0); return "ok"; })();
