(function () {
  var seq = app.project.activeSequence, tr = seq.videoTracks[4], o = [], i;
  for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i]; o.push(c.start.seconds.toFixed(2) + "-" + c.end.seconds.toFixed(2) + " in" + c.inPoint.seconds.toFixed(2) + " out" + c.outPoint.seconds.toFixed(2) + " " + c.name.substr(0, 14)); }
  return JSON.stringify({ n: tr.clips.numItems, fin: seq.end / 254016000000, c: o });
})();
