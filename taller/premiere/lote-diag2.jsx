(function () { app.enableQE(); var T = 254016000000, S = "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/", s = null, j, k; for (j = 0; j < app.project.sequences.numSequences; j++) if (app.project.sequences[j].name.indexOf("NATALIA_1010_02") === 0) s = app.project.sequences[j]; app.project.openSequence(s.sequenceID); var q = qe.project.getActiveSequence();
  var c = s.videoTracks[0].clips[0], m = null; for (k = 0; k < c.components.numItems; k++) if (c.components[k].matchName === "AE.ADBE Motion") m = c.components[k]; var t = String(Math.round((c.start.seconds + 0.5) * T)), r = { clip: c.name, rot: m.properties[4].getValue(), esc: m.properties[1].getValue(), item: c.projectItem.name, proxy: c.projectItem.hasProxy() };
  function foto(n) { s.setPlayerPosition(t); q.exportFramePNG(q.CTI.timecode, S + "d2-" + n); }
  app.setEnableProxies(0); foto("1-orig-rot90"); app.setEnableProxies(1); foto("2-proxy-rot90");
  m.properties[4].setValue(0, true); app.setEnableProxies(0); foto("3-orig-rot0"); app.setEnableProxies(1); foto("4-proxy-rot0"); m.properties[4].setValue(90, true); s.setPlayerPosition("0");
  return JSON.stringify(r); })();
