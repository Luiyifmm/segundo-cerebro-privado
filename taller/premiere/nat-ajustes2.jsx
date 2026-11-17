(function () { var seq = app.project.activeSequence, i, T = 254016000000; if (seq.name.indexOf("NATALIA_1010_01") !== 0) return JSON.stringify({ error: seq.name });
  function seg(x) { var tm = new Time(); tm.seconds = x; return tm; }
  function pV(n) { for (var x = 0; x < seq.videoTracks.numTracks; x++) if (seq.videoTracks[x].name === n) return seq.videoTracks[x]; return null; }
  var tc = pV("CONTADOR"), tz = pV("ZONA IDEAL");
  for (i = 0; i < tc.clips.numItems; i++) tc.clips[i].getMGTComponent().properties.getParamForDisplayName("Tamano (50 = normal, 100 = doble)").setValue(33, true);
  tz.clips[0].end = seg(15.6);
  app.enableQE(); var q = qe.project.getActiveSequence(), ts = [4.0, 6.5, 12.0, 15.9, 17.4];
  for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/nu-" + i); }
  seq.setPlayerPosition("0"); app.project.save(); return "ok"; })();
