(function () {
  var seq = app.project.activeSequence, r = { c: [] }, i, k, m;
  for (var t = 5; t < seq.videoTracks.numTracks; t++) for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) {
    var c = seq.videoTracks[t].clips[i], o = { pista: t + 1, n: c.name, a: c.start.seconds, b: c.end.seconds, mgt: !!c.getMGTComponent(), comps: [] };
    for (k = 0; k < c.components.numItems; k++) { var co = c.components[k], ps = []; for (m = 0; m < co.properties.numItems && m < 14; m++) { var v; try { v = String(co.properties[m].getValue()).substr(0, 160); } catch (e) { v = "?"; } ps.push(co.properties[m].displayName + "=" + v); } o.comps.push(co.displayName + " [" + co.matchName + "]: " + ps.join(" | ")); }
    r.c.push(o);
  }
  return JSON.stringify(r);
})();
