(function () { var seq = app.project.activeSequence, T = 254016000000, ts = [0.4, 0.95, 1.4, 2.0, 3.2, 4.3, 6.9, 14.6, 20.5, 45.5], i; app.enableQE(); var q = qe.project.getActiveSequence(), p0 = seq.getPlayerPosition().ticks;
  for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/u-" + i); }
  seq.setPlayerPosition(p0); return "ok"; })();
