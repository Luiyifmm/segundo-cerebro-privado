(function () {
  var r = { secs: [] }, i, t, k;
  for (i = 0; i < app.project.sequences.numSequences; i++) {
    var s = app.project.sequences[i], o = { n: s.name, seg: (s.end / 254016000000).toFixed(1), v: [] };
    for (t = 0; t < s.videoTracks.numTracks; t++) { var tr = s.videoTracks[t], cs = []; for (k = 0; k < tr.clips.numItems && k < 70; k++) { var c = tr.clips[k]; cs.push(c.start.seconds.toFixed(2) + "-" + c.end.seconds.toFixed(2) + " " + c.name.substr(0, 26) + (c.getMGTComponent() ? "*" : "")); } o.v.push("V" + (t + 1) + " " + tr.name + " (" + tr.clips.numItems + "): " + cs.join(" | ")); }
    r.secs.push(o);
  }
  r.activa = app.project.activeSequence ? app.project.activeSequence.name : null;
  return JSON.stringify(r);
})();
