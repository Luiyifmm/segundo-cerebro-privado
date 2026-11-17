(function () { var r = { errores: [] }, seq = app.project.activeSequence, i, T = 254016000000;
  if (seq.name !== "CLIENTE-E_1009_01 - v2 audio solapado") return JSON.stringify({ error: seq.name });
  var tr = seq.videoTracks[2]; for (i = tr.clips.numItems - 1; i >= 0; i--) if (tr.clips[i].name.indexOf("MG emojis") === 0) tr.clips[i].remove(false, false);
  var bin = null; for (i = 0; i < app.project.rootItem.children.numItems; i++) if (app.project.rootItem.children[i].name === "MOTION GRAPHICS CLIENTE-E_1009_01") bin = app.project.rootItem.children[i];
  app.project.importFiles(["~/Videos-Remotion/clientes/clientee/CLIENTE-E_1009_01/motion/MG emojis detras de ClienteE v2.mov"], true, bin, false);
  var it = null; for (i = 0; i < bin.children.numItems; i++) if (bin.children[i].name === "MG emojis detras de ClienteE v2.mov") it = bin.children[i];
  if (!it) return JSON.stringify({ error: "no importa" });
  tr.overwriteClip(it, 54.367); r.v3 = []; for (i = 0; i < tr.clips.numItems; i++) r.v3.push(tr.clips[i].name + " " + tr.clips[i].start.seconds.toFixed(2) + "-" + tr.clips[i].end.seconds.toFixed(2));
  app.enableQE(); var q = qe.project.getActiveSequence(), ts = [56.9, 57.4, 58.3];
  for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/em2-" + i); }
  seq.setPlayerPosition("0"); app.project.save(); return JSON.stringify(r); })();
