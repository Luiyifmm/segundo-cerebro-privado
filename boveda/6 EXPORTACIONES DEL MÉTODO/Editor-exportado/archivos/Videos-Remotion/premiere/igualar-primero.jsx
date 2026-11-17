// Copia el tamaño y la posición del primer subtítulo a todos los demás (controles de la plantilla y Movimiento del clip),
// salvo los que quedan encima de los motion graphics de V3.
(function () {
  var seq = app.project.activeSequence, r = { errores: [] }, i, t, k, SUB = -1, mejor = 0;
  try {
    for (t = 0; t < seq.videoTracks.numTracks; t++) { var n = 0; for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) if (seq.videoTracks[t].clips[i].getMGTComponent()) n++; if (n > mejor) { mejor = n; SUB = t; } }
    var tr = seq.videoTracks[SUB], subs = [];
    for (i = 0; i < tr.clips.numItems; i++) if (tr.clips[i].getMGTComponent()) subs.push(tr.clips[i]);
    // tramos ocupados por los motion graphics (clips "MG ..." en cualquier pista)
    var mg = [];
    for (t = 0; t < seq.videoTracks.numTracks; t++) for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) { var c = seq.videoTracks[t].clips[i]; if (c.name.indexOf("MG ") === 0) mg.push([c.start.seconds, c.end.seconds]); }
    r.mg = mg.length;
    var o = subs[0], po = o.getMGTComponent().properties, CAMPOS = ["Tamano (50 = normal, 100 = doble)", "Altura (50 = normal, mas = sube)"], vals = {};
    for (k = 0; k < CAMPOS.length; k++) vals[CAMPOS[k]] = po.getParamForDisplayName(CAMPOS[k]).getValue();
    function mov(clip) { for (var m = 0; m < clip.components.numItems; m++) if (clip.components[m].displayName === "Movimiento" || clip.components[m].matchName === "AE.ADBE Motion") return clip.components[m]; return null; }
    var mo = mov(o), pos = null, esc = null;
    if (mo) { pos = mo.properties[0].getValue(); esc = mo.properties[1].getValue(); }
    r.modelo = o.name; r.valores = vals; r.posicion = pos; r.escala = esc;
    r.componentes = []; for (k = 0; k < o.components.numItems; k++) r.componentes.push(o.components[k].displayName);
    var hechos = 0, saltados = [];
    for (i = 1; i < subs.length; i++) {
      var s = subs[i], enMG = false;
      for (k = 0; k < mg.length; k++) if (s.start.seconds < mg[k][1] - 0.02 && s.end.seconds > mg[k][0] + 0.02) enMG = true;
      if (enMG) { saltados.push(s.name); continue; }
      var ps = s.getMGTComponent().properties;
      for (k = 0; k < CAMPOS.length; k++) ps.getParamForDisplayName(CAMPOS[k]).setValue(vals[CAMPOS[k]], true);
      var ms = mov(s); if (mo && ms) { ms.properties[0].setValue(pos, true); ms.properties[1].setValue(esc, true); }
      hechos++;
    }
    r.cambiados = hechos; r.saltados = saltados;
    app.enableQE(); var q = qe.project.getActiveSequence(), p0 = seq.getPlayerPosition().ticks, ts = [0.4, 3.95, 20.0, 38.0], T = 254016000000;
    for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/ig-" + i); }
    seq.setPlayerPosition(p0);
    app.project.save();
  } catch (e) { r.errores.push("EXCEPCION " + e + " linea " + e.line); }
  return JSON.stringify(r);
})();
