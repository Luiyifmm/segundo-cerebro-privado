(function () { var seq = app.project.activeSequence, r = { fin: seq.end / 254016000000, v1: [], c: [], otras: [] }, i, t;
  for (i = 0; i < seq.videoTracks[0].clips.numItems; i++) r.v1.push(seq.videoTracks[0].clips[i].start.seconds.toFixed(2));
  for (i = 0; i < seq.videoTracks[1].clips.numItems; i++) r.c.push(seq.videoTracks[1].clips[i].start.seconds.toFixed(2) + "=" + seq.videoTracks[1].clips[i].name.split(",")[0]);
  for (t = 2; t < seq.videoTracks.numTracks; t++) r.otras.push(seq.videoTracks[t].name + ":" + seq.videoTracks[t].clips.numItems);
  return JSON.stringify(r); })();
