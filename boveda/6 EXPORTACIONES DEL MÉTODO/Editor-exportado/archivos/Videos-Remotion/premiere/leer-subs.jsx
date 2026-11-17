(function () {
  var seq = app.project.activeSequence, r = { subs: [] }, i, t, k, SUB = -1, mejor = 0;
  for (t = 0; t < seq.videoTracks.numTracks; t++) { var n = 0; for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) if (seq.videoTracks[t].clips[i].getMGTComponent()) n++; if (n > mejor) { mejor = n; SUB = t; } }
  var tr = seq.videoTracks[SUB]; r.pista = SUB; r.n = tr.clips.numItems;
  r.pistas = []; for (t = 0; t < seq.videoTracks.numTracks; t++) r.pistas.push("V" + (t + 1) + ":" + seq.videoTracks[t].clips.numItems);
  for (i = 0; i < tr.clips.numItems; i++) {
    var c = tr.clips[i], comp = c.getMGTComponent(); if (!comp) { r.subs.push(c.start.seconds.toFixed(2) + " NO PLANTILLA " + c.name); continue; }
    var ps = comp.properties, o = [c.start.seconds.toFixed(2) + "-" + c.end.seconds.toFixed(2)];
    for (k = 0; k < ps.numItems; k++) { var p = ps[k], v; try { v = p.getValue(); } catch (e) { v = "?"; }
      if (p.displayName === "Linea" || p.displayName === "Palabra clave") { try { v = JSON.parse(v).textEditValue; } catch (e2) {} }
      if (p.displayName.indexOf("Color") === 0) { try { v = p.getColorValue().join(","); } catch (e3) {} }
      o.push(p.displayName.substr(0, 8) + "=" + v); }
    for (k = 0; k < c.components.numItems; k++) if (c.components[k].displayName === "Movimiento") o.push("pos=" + c.components[k].properties[0].getValue() + " esc=" + c.components[k].properties[1].getValue());
    r.subs.push(o.join(" | "));
  }
  app.enableQE(); var q = qe.project.getActiveSequence(), p0 = seq.getPlayerPosition().ticks, T = 254016000000;
  for (i = 0; i < 12; i++) { seq.setPlayerPosition(String(Math.round((0.2 + i * 0.34) * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/p4-" + (i < 10 ? "0" : "") + i); }
  seq.setPlayerPosition(p0);
  return JSON.stringify(r);
})();
