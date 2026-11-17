(function () { var seq = app.project.activeSequence, r = { errores: [] }, i, T = 254016000000, D = "/Users/luiyi/Videos-Remotion/clientes/natalia/NATALIA_1010_01/"; if (seq.name.indexOf("NATALIA_1010_01") !== 0) return JSON.stringify({ error: seq.name });
  function seg(x) { var tm = new Time(); tm.seconds = x; return tm; }
  function mov(c) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === "AE.ADBE Motion") return c.components[x].properties; return null; }
  function pV(n) { for (var x = 0; x < seq.videoTracks.numTracks; x++) if (seq.videoTracks[x].name === n) return seq.videoTracks[x]; return null; }
  var tc = pV("CONTADOR"), tm = pV("MORALEJA"), tz = pV("ZONA IDEAL");
  for (i = 0; i < tc.clips.numItems; i++) { var c = tc.clips[i]; mov(c)[0].setValue([0.25, 0.708], true); c.getMGTComponent().properties.getParamForDisplayName("Tamano (50 = normal, 100 = doble)").setValue(44, true); }
  for (i = 0; i < tm.clips.numItems; i++) mov(tm.clips[i])[0].setValue([0.5, 0.419], true);
  var fin = seq.end / T; for (i = tz.clips.numItems - 1; i >= 0; i--) tz.clips[i].remove(false, false);
  var bin = null; for (i = 0; i < app.project.rootItem.children.numItems; i++) if (app.project.rootItem.children[i].name === "NATALIA_1010_01") bin = app.project.rootItem.children[i];
  app.project.importFiles([D + "zona ideal v2.png"], true, bin, false); var it = null; for (i = 0; i < bin.children.numItems; i++) if (bin.children[i].name === "zona ideal v2.png") it = bin.children[i];
  if (it) { tz.overwriteClip(it, 5.4); tz.clips[0].end = seg(fin); r.zonaEscala = mov(tz.clips[0])[1].getValue(); } else r.errores.push("sin zona");
  app.enableQE(); var q = qe.project.getActiveSequence(), ts = [1.0, 4.0, 6.5, 8.0, 12.0, 15.9, 17.4];
  for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/nt-" + i); }
  seq.setPlayerPosition("0"); app.project.save(); return JSON.stringify(r); })();
