(function () { var seq = app.project.activeSequence, i, k, T = 254016000000; if (seq.name !== "CLIENTE-N_1010_01 - como la referencia") return JSON.stringify({ error: seq.name });
  function mov(c) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === "AE.ADBE Motion") return c.components[x].properties; return null; }
  var cfg = { 1: [58, 0.175], 2: [78, 0.295], 3: [52, 0.885] };
  for (k in cfg) { var tr = seq.videoTracks[+k]; for (i = 0; i < tr.clips.numItems; i++) { tr.clips[i].getMGTComponent().properties.getParamForDisplayName("Tamano (50 = normal, 100 = doble)").setValue(cfg[k][0], true); mov(tr.clips[i])[0].setValue([0.5, cfg[k][1]], true); } }
  app.enableQE(); var q = qe.project.getActiveSequence(), ts = [7.5, 17.5];
  for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/nq-" + i); }
  seq.setPlayerPosition("0"); app.project.save(); return "ok"; })();
