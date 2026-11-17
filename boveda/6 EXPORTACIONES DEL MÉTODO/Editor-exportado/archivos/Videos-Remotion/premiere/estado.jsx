(function () {
  var r = {}, seq = null, i;
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name.indexOf("CLIENTE-A_1009_01 - corte") === 0) seq = app.project.sequences[i];
  r.v = []; for (i = 0; i < seq.videoTracks.numTracks; i++) r.v.push(seq.videoTracks[i].clips.numItems);
  r.a = []; for (i = 0; i < seq.audioTracks.numTracks; i++) r.a.push(seq.audioTracks[i].clips.numItems);
  r.marc = seq.markers.numMarkers; r.c = [];
  for (i = 0; i < seq.videoTracks[0].clips.numItems; i++) { var c = seq.videoTracks[0].clips[i]; r.c.push(c.start.seconds.toFixed(2) + "@" + c.components[1].properties[1].getValue()); }
  return JSON.stringify(r);
})();
