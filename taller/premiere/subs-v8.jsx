// Pasa los subtítulos (desde 4,15 s; los ejemplos del usuario no se tocan) a la plantilla compacta v7:
// línea blanca pegada encima de la palabra clave, clave siempre en azul. Conserva texto, tiempos, tamaño y posición.
(function () {
  var MOGRT = "/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin v8.mogrt", DESDE = 4.15;
  var TAM = "Tamano (50 = normal, 100 = doble)", ALT = "Altura (50 = normal, mas = sube)", DUR = "Duracion de la entrada (fotogramas)", RET = "Retraso de la palabra clave (fotogramas)";
  var seq = app.project.activeSequence, r = { errores: [] }, i, t, k, SUB = -1, mejor = 0, T = 254016000000;
  try {
    for (t = 0; t < seq.videoTracks.numTracks; t++) { var n = 0; for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) { var g = seq.videoTracks[t].clips[i].getMGTComponent(); if (g && g.properties.getParamForDisplayName("Alinear a la izquierda")) n++; } if (n > mejor) { mejor = n; SUB = t; } }
    var tr = seq.videoTracks[SUB], datos = [], quitar = [];
    function mov(clip) { for (var m = 0; m < clip.components.numItems; m++) if (clip.components[m].matchName === "AE.ADBE Motion") return clip.components[m]; return null; }
    for (i = 0; i < tr.clips.numItems; i++) {
      var c = tr.clips[i];
      var comp = c.getMGTComponent(); if (!comp || !comp.properties.getParamForDisplayName("Alinear a la izquierda")) { r.saltados = (r.saltados || 0) + 1; continue; }
      var ps = comp.properties, d = { a: c.start.ticks, b: c.end.ticks, s: c.start.seconds, e: c.end.seconds, nombre: c.name };
      d.linea = JSON.parse(ps.getParamForDisplayName("Linea").getValue()).textEditValue; d.clave = JSON.parse(ps.getParamForDisplayName("Palabra clave").getValue()).textEditValue;
      d.cl = ps.getParamForDisplayName("Color linea").getColorValue(); d.cc = ps.getParamForDisplayName("Color clave").getColorValue(); d.izq = ps.getParamForDisplayName("Alinear a la izquierda").getValue();
      d.tam = ps.getParamForDisplayName(TAM).getValue(); d.alt = ps.getParamForDisplayName(ALT).getValue();
      d.anim = ps.getParamForDisplayName("Animacion de entrada").getValue(); d.durE = ps.getParamForDisplayName(DUR).getValue(); d.ret = ps.getParamForDisplayName(RET).getValue();
      var mo = mov(c); if (mo) { d.pos = mo.properties[0].getValue(); d.esc = mo.properties[1].getValue(); }
      datos.push(d); quitar.push(c);
    }
    r.leidos = datos.length; r.pista = "V" + (SUB + 1);
    if (r.errores.length || !datos.length) return JSON.stringify(r);
    for (i = quitar.length - 1; i >= 0; i--) quitar[i].remove(false, false);
    var puestos = 0; function d2(v, n) { return v[n]; }
    for (i = 0; i < datos.length; i++) {
      var x = datos[i], clip = seq.importMGT(MOGRT, x.a, SUB, 0);
      if (!clip) { r.errores.push("no entra " + i); continue; }
      var fin = new Time(); fin.ticks = x.b; clip.end = fin; var sal = new Time(); sal.seconds = x.e - x.s; clip.outPoint = sal; clip.name = x.nombre;
      var q = clip.getMGTComponent().properties, pl = q.getParamForDisplayName("Linea"), pc = q.getParamForDisplayName("Palabra clave");
      var j = JSON.parse(pl.getValue()); j.textEditValue = x.linea; j.fontTextRunLength = [x.linea.length]; pl.setValue(JSON.stringify(j), true);
      var kk = JSON.parse(pc.getValue()); kk.textEditValue = x.clave; kk.fontTextRunLength = [x.clave.length]; pc.setValue(JSON.stringify(kk), true);
      q.getParamForDisplayName("Color clave").setColorValue(d2(x.cc, 0), d2(x.cc, 1), d2(x.cc, 2), d2(x.cc, 3), true); q.getParamForDisplayName("Alinear a la izquierda").setValue(x.izq, true);
      q.getParamForDisplayName("Color linea").setColorValue(x.cl[0], x.cl[1], x.cl[2], x.cl[3], true);
      q.getParamForDisplayName(TAM).setValue(x.tam, true); q.getParamForDisplayName(ALT).setValue(x.alt, true);
      q.getParamForDisplayName("Animacion de entrada").setValue(x.anim, true); q.getParamForDisplayName(DUR).setValue(x.durE, true); q.getParamForDisplayName(RET).setValue(x.ret, true);
      var m2 = mov(clip); if (m2 && x.pos) { m2.properties[0].setValue(x.pos, true); m2.properties[1].setValue(x.esc, true); }
      if (Math.abs(clip.end.seconds - x.e) > 0.02 || Math.abs(clip.outPoint.seconds - (x.e - x.s)) > 0.02) r.errores.push("recorte " + i);
      puestos++;
    }
    r.puestos = puestos; r.enPista = tr.clips.numItems; r.fin = seq.end / T;
    app.enableQE(); var qs = qe.project.getActiveSequence(), p0 = seq.getPlayerPosition().ticks, ts = [5.2, 19.9, 30.2];
    for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); qs.exportFramePNG(qs.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/c8-" + i); }
    seq.setPlayerPosition(p0);
    app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r);
})();
