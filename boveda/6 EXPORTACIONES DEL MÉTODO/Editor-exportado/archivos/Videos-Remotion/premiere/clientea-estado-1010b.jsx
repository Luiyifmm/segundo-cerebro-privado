(function () { var r = { proy: app.project.name, v: [], a: [] }, seq = app.project.activeSequence, i, t, k; r.sec = seq.name; r.fin = seq.end / 254016000000;
  function f(x) { return +x.toFixed(2); }
  for (t = 0; t < seq.videoTracks.numTracks; t++) { var tr = seq.videoTracks[t], L = [];
    for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i]; if (c.end.seconds < 65.5 || c.start.seconds > 117) continue; var o = [c.name.substr(0, 34), f(c.start.seconds), f(c.end.seconds)]; if (c.disabled) o.push("OFF");
      if (/arrow_|miniaturas|linea/.test(c.name)) { for (k = 0; k < c.components.numItems; k++) { var cm = c.components[k]; if (cm.matchName === "AE.ADBE Motion") { var P = cm.properties[0], E = cm.properties[1]; if (P.isTimeVarying()) { var ks = P.getKeys(), q = []; for (var a = 0; a < ks.length; a++) { var v = P.getValueAtKey(ks[a]); q.push([f(ks[a].seconds - c.inPoint.seconds), f(v[0]), f(v[1])]); } o.push({ kp: q }); } else { var v2 = P.getValue(); o.push({ p: [f(v2[0]), f(v2[1])], e: f(E.getValue()) }); } } } }
      L.push(o); }
    r.v.push({ i: t, n: tr.name, c: L }); }
  for (t = 0; t < seq.audioTracks.numTracks; t++) { var ta = seq.audioTracks[t], La = [];
    for (i = 0; i < ta.clips.numItems; i++) { var ca = ta.clips[i]; if (ca.end.seconds < 65.5 || ca.start.seconds > 117) continue; var oa = [ca.name.substr(0, 30), f(ca.start.seconds), f(ca.end.seconds)]; if (ca.disabled) oa.push("OFF"); La.push(oa); }
    r.a.push({ i: t, n: ta.name, k: La.length, c: La.length > 14 ? La.slice(0, 3).concat([["…"]], La.slice(-2)) : La }); }
  return JSON.stringify(r); })();
