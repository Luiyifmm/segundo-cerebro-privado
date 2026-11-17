(function () { var seq = app.project.activeSequence, r = { v1: [], g: [] }, i, k, m;
  var t0 = seq.videoTracks[0]; for (i = 0; i < t0.clips.numItems; i++) r.v1.push([+t0.clips[i].start.seconds.toFixed(3), +t0.clips[i].end.seconds.toFixed(3), +t0.clips[i].inPoint.seconds.toFixed(2)]);
  for (var t = 2; t <= 3; t++) { var tr = seq.videoTracks[t]; for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i], e = { t: t, s: +c.start.seconds.toFixed(3), e: +c.end.seconds.toFixed(3), tx: [] };
      for (k = 0; k < c.components.numItems; k++) { var co = c.components[k]; if (co.displayName === "Texto") { var ps = []; for (m = 0; m < co.properties.numItems; m++) { var v; try { v = String(co.properties[m].getValue()); } catch (e2) { v = "?"; } ps.push(co.properties[m].displayName + "=" + (i < 2 || t === 2 ? v.substr(0, 700) : v.length)); } e.tx.push(co.matchName + " :: " + ps.join(" || ")); } }
      r.g.push(e); } }
  return JSON.stringify(r); })();
