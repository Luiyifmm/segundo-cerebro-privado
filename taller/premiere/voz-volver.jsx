(function () { var seq = app.project.activeSequence, r = {}, t, i, it = null; if (seq.name.indexOf("ERIC_1009_01") !== 0) return JSON.stringify({ error: seq.name });
  for (t = 0; t < seq.audioTracks.numTracks; t++) for (i = 0; i < seq.audioTracks[t].clips.numItems; i++) { var c = seq.audioTracks[t].clips[i]; try { if (c.projectItem.getMediaPath().indexOf("IMG_1114 voz") >= 0) it = c.projectItem; } catch (e) {} }
  if (!it) return JSON.stringify({ error: "no encuentro la voz" }); r.antes = it.getMediaPath().split("/").pop();
  r.ok = it.changeMediaPath("/Users/luiyi/Videos-Remotion/clientes/eric/ERIC_1009_01/audio/IMG_1114 voz centrada.wav", true); r.ahora = it.getMediaPath().split("/").pop(); app.project.save(); return JSON.stringify(r); })();
