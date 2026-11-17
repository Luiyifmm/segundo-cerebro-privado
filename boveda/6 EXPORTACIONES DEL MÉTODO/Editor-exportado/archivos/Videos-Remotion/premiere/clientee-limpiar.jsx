(function () { var seq = app.project.activeSequence, r = { q: 0 }, t, i; if (seq.name.indexOf("CLIENTE-E_1009_01") !== 0) return JSON.stringify({ error: seq.name });
  for (t = 0; t < 1; t++) for (i = seq.videoTracks[t].clips.numItems - 1; i >= 0; i--) if (seq.videoTracks[t].clips[i].start.seconds > 73) { seq.videoTracks[t].clips[i].remove(false, false); r.q++; }
  for (t = 0; t < 2; t++) for (i = seq.audioTracks[t].clips.numItems - 1; i >= 0; i--) if (seq.audioTracks[t].clips[i].start.seconds > 73) { seq.audioTracks[t].clips[i].remove(false, false); r.q++; }
  r.v1 = seq.videoTracks[0].clips.numItems; r.fin = seq.end / 254016000000; app.project.save(); return JSON.stringify(r); })();
