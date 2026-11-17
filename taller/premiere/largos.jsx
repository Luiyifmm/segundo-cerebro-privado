(function () { var seq = app.project.activeSequence, r = [], t, i;
  for (t = 0; t < seq.videoTracks.numTracks; t++) for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) { var c = seq.videoTracks[t].clips[i]; if (c.end.seconds > 39.6) r.push("V" + (t + 1) + " " + c.name + " " + c.start.seconds.toFixed(2) + "-" + c.end.seconds.toFixed(2)); }
  for (t = 0; t < seq.audioTracks.numTracks; t++) for (i = 0; i < seq.audioTracks[t].clips.numItems; i++) { var a = seq.audioTracks[t].clips[i]; if (a.end.seconds > 39.6 || t >= 7) r.push("A" + (t + 1) + " " + a.name + " " + a.start.seconds.toFixed(2) + "-" + a.end.seconds.toFixed(2) + " in " + a.inPoint.seconds.toFixed(2)); }
  return JSON.stringify(r); })();
