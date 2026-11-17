(function () {
  var r = { proyecto: app.project.name }, i, t, k, seq = app.project.activeSequence; r.activa = seq.name; r.fin = seq.end / 254016000000; r.v = []; r.a = []; r.marc = [];
  function f(x) { return +x.toFixed(3); }
  var m = seq.markers.getFirstMarker(); while (m) { r.marc.push([f(m.start.seconds), f(m.end.seconds), m.name, String(m.comments).substr(0, 40), m.type, (function () { try { return m.getColorByIndex(); } catch (e) { return ""; } })()]); m = seq.markers.getNextMarker(m); }
  for (t = 0; t < seq.videoTracks.numTracks; t++) { var tr = seq.videoTracks[t], o = { n: tr.name, c: [] };
    for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i], p = "", cm = []; try { p = c.projectItem.getMediaPath(); } catch (e) {}
      var e = { s: f(c.start.seconds), e: f(c.end.seconds), i: f(c.inPoint.seconds), n: c.name.substr(0, 40), p: p.split("/").slice(-2).join("/") };
      for (k = 0; k < c.components.numItems; k++) { var co = c.components[k]; if (co.matchName === "AE.ADBE Motion") { e.pos = co.properties[0].getValue(); e.esc = co.properties[1].getValue(); try { e.kf = co.properties[0].isTimeVarying() ? co.properties[0].getKeys().length : 0; } catch (e9) {} } else if (co.matchName !== "AE.ADBE Opacity" && co.matchName !== "AE.ADBE Capsule") cm.push(co.displayName); }
      if (cm.length) e.fx = cm.join(",");
      var g = c.getMGTComponent(); if (g && c.start.seconds < 6) { e.mgt = {}; for (k = 0; k < g.properties.numItems; k++) { var pr = g.properties[k], v; try { v = pr.getValue(); } catch (e2) { v = "?"; } if (pr.displayName === "Linea" || pr.displayName === "Palabra clave") { try { var j = JSON.parse(v); v = j.textEditValue + " | " + j.fontEditValue + " " + j.fontSizeEditValue; } catch (e3) {} } if (pr.displayName.indexOf("Color") === 0) { try { v = pr.getColorValue().join(","); } catch (e4) {} } e.mgt[pr.displayName.substr(0, 14)] = v; } }
      try { if (c.projectItem && /\.(png|jpe?g|webp|heic|gif)$/i.test(p)) { var pm = c.projectItem.getMarkers(), q = pm.getFirstMarker(), l = []; while (q) { l.push(f(q.start.seconds) + ":" + q.name); q = pm.getNextMarker(q); } if (l.length) e.clipMarc = l; } } catch (e5) {}
      o.c.push(e); } r.v.push(o); }
  for (t = 0; t < seq.audioTracks.numTracks; t++) { var ta = seq.audioTracks[t], oa = { n: ta.name, mute: ta.isMuted(), c: [] }; for (i = 0; i < ta.clips.numItems; i++) { var ca = ta.clips[i]; oa.c.push([f(ca.start.seconds), f(ca.end.seconds), f(ca.inPoint.seconds), ca.name.substr(0, 26)]); } r.a.push(oa); }
  var f2 = new File("/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/clientee-estado2.json"); f2.encoding = "UTF-8"; f2.open("w"); f2.write(JSON.stringify(r)); f2.close(); return "ok";
})();
