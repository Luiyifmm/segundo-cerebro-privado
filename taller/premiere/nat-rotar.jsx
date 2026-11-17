(function () { var seq = app.project.activeSequence, r = {}, i, T = 254016000000; if (seq.name.indexOf("NATALIA_1010_01") !== 0) return JSON.stringify({ error: seq.name });
  function mov(c) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === "AE.ADBE Motion") return c.components[x].properties; return null; }
  var mr = mov(seq.videoTracks[0].clips[0]), mb = mov(seq.videoTracks[1].clips[0]);
  mr[4].setValue(90, true); mr[7].setValue(0, true); mr[9].setValue(0, true); mr[8].setValue(25, true); mr[10].setValue(0, true);
  mb[4].setValue(90, true); mb[7].setValue(0, true); mb[9].setValue(0, true); mb[10].setValue(29, true); mb[8].setValue(0, true);
  app.enableQE(); var q = qe.project.getActiveSequence(), ts = [1.0, 4.0, 6.5, 10.0, 14.0, 15.9, 17.4];
  for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/nt-" + i); }
  seq.setPlayerPosition("0"); app.project.save(); return "ok"; })();
