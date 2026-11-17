// Pasa los subtítulos (desde 4,85 s; los primeros los dejó el usuario a mano) a la plantilla ClienteE v2: línea más grande respecto a la clave.
(function () {
  var MOGRT = "~/Videos-Remotion/clientes/_plantillas/Subtitulo ClienteE v2.mogrt", DESDE = 4.85;
  var seq = app.project.activeSequence, r = { errores: [] }, i, k, S = -1, T = 254016000000;
  try {
    if (seq.name !== "CLIENTE-E_1009_01 - v2 audio solapado") return JSON.stringify({ error: seq.name });
    for (i = 0; i < seq.videoTracks.numTracks; i++) if (seq.videoTracks[i].name === "SUBTITULOS") S = i; if (S < 0) return JSON.stringify({ error: "sin pista SUBTITULOS" });
    var tr = seq.videoTracks[S], datos = [], quitar = []; function seg(x) { var tm = new Time(); tm.seconds = x; return tm; }
    for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i]; if (c.start.seconds < DESDE) continue; var g = c.getMGTComponent(); if (!g) { r.errores.push("no es plantilla: " + c.name); continue; }
      var ps = g.properties, d = { a: c.start.ticks, s: c.start.seconds, e: c.end.seconds, nombre: c.name };
      d.linea = JSON.parse(ps.getParamForDisplayName("Linea").getValue()).textEditValue; d.clave = JSON.parse(ps.getParamForDisplayName("Palabra clave").getValue()).textEditValue;
      d.cc = ps.getParamForDisplayName("Color clave").getColorValue(); d.cl = ps.getParamForDisplayName("Color linea").getColorValue();
      datos.push(d); quitar.push(c); }
    r.leidos = datos.length; if (r.errores.length || !datos.length) return JSON.stringify(r);
    for (i = quitar.length - 1; i >= 0; i--) quitar[i].remove(false, false);
    var puestos = 0;
    for (i = 0; i < datos.length; i++) { var x = datos[i], clip = seq.importMGT(MOGRT, x.a, S, 0); if (!clip) { r.errores.push("no entra " + i); continue; }
      clip.end = seg(x.e); clip.outPoint = seg(x.e - x.s); clip.name = x.nombre;
      var q = clip.getMGTComponent().properties, pl = q.getParamForDisplayName("Linea"), pc = q.getParamForDisplayName("Palabra clave");
      var linea = String(x.linea).replace(/[\r\n]/g, ""), clave = String(x.clave).replace(/[\r\n]/g, "");
      var j = JSON.parse(pl.getValue()); j.textEditValue = linea; j.fontTextRunLength = [linea.length]; pl.setValue(JSON.stringify(j), true);
      var kk = JSON.parse(pc.getValue()); kk.textEditValue = clave; kk.fontTextRunLength = [clave.length]; pc.setValue(JSON.stringify(kk), true);
      q.getParamForDisplayName("Color clave").setColorValue(x.cc[0], x.cc[1], x.cc[2], x.cc[3], true); q.getParamForDisplayName("Color linea").setColorValue(x.cl[0], x.cl[1], x.cl[2], x.cl[3], true);
      q.getParamForDisplayName("Tamano (50 = normal, 100 = doble)").setValue(58, true);
      for (k = 0; k < clip.components.numItems; k++) if (clip.components[k].matchName === "AE.ADBE Motion") clip.components[k].properties[0].setValue([0.5, clave ? 0.391 : 0.402], true);
      if (Math.abs(clip.end.seconds - x.e) > 0.02) r.errores.push("recorte " + i); puestos++; }
    r.puestos = puestos; r.enPista = tr.clips.numItems; r.fin = seq.end / T;
    app.enableQE(); var qs = qe.project.getActiveSequence(), p0 = seq.getPlayerPosition().ticks, ts = [5.2, 6.9, 14.6, 20.5, 33.0, 45.5];
    for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); qs.exportFramePNG(qs.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/s2-" + i); }
    seq.setPlayerPosition(p0); app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r);
})();
