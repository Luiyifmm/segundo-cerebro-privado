(function () {
  var r = { proyecto: app.project.name, secs: [] }, i, t, k, seq = app.project.activeSequence;
  for (i = 0; i < app.project.sequences.numSequences; i++) r.secs.push(app.project.sequences[i].name);
  r.activa = seq.name; r.fin = seq.end / 254016000000; r.v = []; r.a = [];
  function f(x) { return +x.toFixed(3); }
  for (t = 0; t < seq.videoTracks.numTracks; t++) { var tr = seq.videoTracks[t], o = { n: tr.name, c: [] };
    for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i], p = ""; try { p = c.projectItem.getMediaPath().split("/").pop(); } catch (e) {} var z = "", sp = 100; for (k = 0; k < c.components.numItems; k++) if (c.components[k].matchName === "AE.ADBE Motion") z = c.components[k].properties[1].getValue(); try { sp = c.getSpeed(); } catch (e2) {}
      o.c.push([f(c.start.seconds), f(c.end.seconds), f(c.inPoint.seconds), c.name.substr(0, 30), p.substr(0, 26), z, c.getMGTComponent() ? 1 : 0, sp]); } r.v.push(o); }
  for (t = 0; t < seq.audioTracks.numTracks; t++) { var ta = seq.audioTracks[t], oa = { n: ta.name, c: [] };
    for (i = 0; i < ta.clips.numItems; i++) { var ca = ta.clips[i], pa = ""; try { pa = ca.projectItem.getMediaPath().split("/").pop(); } catch (e3) {} var comps = []; if (i === 0) for (k = 0; k < ca.components.numItems; k++) { var co = ca.components[k], ps = []; for (var m = 0; m < co.properties.numItems; m++) ps.push(co.properties[m].displayName + "=" + co.properties[m].getValue()); comps.push(co.displayName + "[" + co.matchName + "]:" + ps.join(",")); }
      oa.c.push([f(ca.start.seconds), f(ca.end.seconds), f(ca.inPoint.seconds), ca.name.substr(0, 22), pa.substr(0, 22), comps.join(" ; ")]); } r.a.push(oa); }
  var f2 = new File("/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/clientee-estado.json"); f2.encoding = "UTF-8"; f2.open("w"); f2.write(JSON.stringify(r)); f2.close();
  return "ok";
})();
