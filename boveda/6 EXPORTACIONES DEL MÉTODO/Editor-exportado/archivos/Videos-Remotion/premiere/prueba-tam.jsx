(function () { var seq = app.project.activeSequence, c = seq.videoTracks[4].clips[0], p = c.getMGTComponent().properties.getParamForDisplayName("Tamano"), r = {};
  r.antes = p.getValue(); p.setValue(140, true); r.tras = p.getValue();
  app.enableQE(); var q = qe.project.getActiveSequence(), pos = seq.getPlayerPosition().ticks; seq.setPlayerPosition(String(Math.round(0.2 * 254016000000))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/tam140");
  p.setValue(r.antes, true); seq.setPlayerPosition(pos); r.restaurado = p.getValue(); return JSON.stringify(r); })();
