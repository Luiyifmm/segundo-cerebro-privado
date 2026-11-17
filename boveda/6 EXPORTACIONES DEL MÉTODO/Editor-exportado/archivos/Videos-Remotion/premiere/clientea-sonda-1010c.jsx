(function () { var r = { img: [], mg: [], mus: [], mini: [] }, seq = app.project.activeSequence, i, t, k, a;
  function f(x) { return +x.toFixed(3); }
  for (t = 0; t < seq.videoTracks.numTracks; t++) { var tr = seq.videoTracks[t];
    for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i]; if (c.end.seconds < 65.5 || c.start.seconds > 117) continue;
      if (/^arrow_/.test(c.name)) { var o = { tr: t, n: c.name, s: f(c.start.seconds), e: f(c.end.seconds), inp: f(c.inPoint.seconds), fx: [] };
        for (k = 0; k < c.components.numItems; k++) { var cm = c.components[k]; if (cm.matchName === "AE.ADBE Motion") { var P = cm.properties[0], E = cm.properties[1], ks = P.getKeys(), q = []; for (a = 0; a < ks.length; a++) { var v = P.getValueAtKey(ks[a]); q.push([f(ks[a].seconds - c.inPoint.seconds), v[0], v[1]]); } o.kp = q; q = []; if (E.isTimeVarying()) { ks = E.getKeys(); for (a = 0; a < ks.length; a++) q.push([f(ks[a].seconds - c.inPoint.seconds), f(E.getValueAtKey(ks[a]))]); } else q = E.getValue(); o.ke = q; o.crop = [cm.properties[7].getValue(), cm.properties[8].getValue(), cm.properties[9].getValue(), cm.properties[10].getValue()]; } else if (cm.matchName !== "AE.ADBE Opacity") o.fx.push(cm.displayName); } r.img.push(o); }
      else if (/^MG |CTA/.test(c.name)) r.mg.push([t, c.name, f(c.start.seconds), f(c.end.seconds), f(c.inPoint.seconds), f(c.outPoint.seconds), c.disabled]);
      else if (/^miniaturas/.test(c.name)) r.mini.push([t, c.name, f(c.start.seconds), f(c.end.seconds), c.projectItem.getMediaPath()]); } }
  for (t = 0; t < seq.audioTracks.numTracks; t++) { var ta = seq.audioTracks[t]; for (i = 0; i < ta.clips.numItems; i++) { var ca = ta.clips[i]; if (!/musica/.test(ca.name) || ca.end.seconds < 66) continue; var V = ca.components[0].properties[1], ks2 = V.isTimeVarying() ? V.getKeys() : [], qq = []; for (a = 0; a < ks2.length; a++) qq.push([f(ks2[a].seconds - ca.inPoint.seconds + ca.start.seconds), V.getValueAtKey(ks2[a])]); r.mus.push([t, f(ca.start.seconds), f(ca.end.seconds), f(ca.inPoint.seconds), V.getValue(), qq]); } }
  r.tam = [seq.frameSizeHorizontal, seq.frameSizeVertical];
  return JSON.stringify(r); })();
