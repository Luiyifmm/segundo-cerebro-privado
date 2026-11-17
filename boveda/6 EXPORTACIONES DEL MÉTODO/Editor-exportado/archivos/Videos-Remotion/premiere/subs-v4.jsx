// CLIENTE-A_1009_01: cambia los subtítulos de V4 a la plantilla v3 (con control de tiempos) conservando su contenido,
// y coloca en V3 los dos clips del motion graphic "eliminar programación → abundancia".
(function () {
  var MOGRT = "~/Videos-Remotion/clientes/_plantillas/Subtitulo ClienteA v4.mogrt";
  var DIR = "~/Videos-Remotion/clientes/clientea/CLIENTE-A_1009_01/motion/";
  var MGA = DIR + "MG eliminar programacion (fondo azul).mp4", MGB = DIR + "MG abundancia (fondo blanco).mp4";
  var r = { errores: [] }, seq = null, i, T = 254016000000;
  try {
    for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name.indexOf("CLIENTE-A_1009_01 - corte") === 0) seq = app.project.sequences[i];
    if (!seq) return JSON.stringify({ error: "sin secuencia" });
    // la pista de subtítulos es la que tiene más clips de plantilla (el usuario puede haberla movido)
    var SUB = -1, mejor = 0, tt, kk2;
    for (tt = 0; tt < seq.videoTracks.numTracks; tt++) { var n = 0; for (kk2 = 0; kk2 < seq.videoTracks[tt].clips.numItems; kk2++) if (seq.videoTracks[tt].clips[kk2].getMGTComponent()) n++; if (n > mejor) { mejor = n; SUB = tt; } }
    if (SUB < 0) return JSON.stringify({ error: "no encuentro la pista de subtitulos" });
    r.pistaSubs = "V" + (SUB + 1);
    var pista = seq.videoTracks[SUB], datos = [];
    for (i = 0; i < pista.clips.numItems; i++) {
      var c = pista.clips[i], comp = c.getMGTComponent();
      if (!comp) { r.errores.push("clip " + i + " no es plantilla: " + c.name); continue; }
      var ps = comp.properties, d = { a: c.start.ticks, b: c.end.ticks, s: c.start.seconds, e: c.end.seconds, nombre: c.name };
      d.linea = JSON.parse(ps.getParamForDisplayName("Linea").getValue()).textEditValue;
      d.clave = JSON.parse(ps.getParamForDisplayName("Palabra clave").getValue()).textEditValue;
      d.cc = ps.getParamForDisplayName("Color clave").getColorValue(); d.cl = ps.getParamForDisplayName("Color linea").getColorValue();
      d.alt = ps.getParamForDisplayName("Altura").getValue(); d.tam = ps.getParamForDisplayName("Tamano").getValue();
      var an = ps.getParamForDisplayName("Animacion de entrada"); d.anim = an ? an.getValue() : true;
      var pd = ps.getParamForDisplayName("Duracion de la entrada (fotogramas)"), pr2 = ps.getParamForDisplayName("Retraso de la palabra clave (fotogramas)"); d.durE = pd ? pd.getValue() : 6; d.ret = pr2 ? pr2.getValue() : 2;
      datos.push(d);
    }
    r.leidos = datos.length;
    if (r.errores.length || !datos.length) return JSON.stringify(r);
    // dónde empieza el motion graphic: el subtítulo cuya palabra clave es "eliminar"
    var tA = -1;
    for (i = 0; i < datos.length; i++) if (datos[i].clave === "eliminar") tA = datos[i].s;
    r.inicioMG = tA;
    var tB = tA + 132 / 30, finB = tB + 114 / 30;
    // 1. subtítulos
    for (i = pista.clips.numItems - 1; i >= 0; i--) pista.clips[i].remove(false, false);
    var puestos = 0, oscuros = 0;
    for (i = 0; i < datos.length; i++) {
      var x = datos[i], clip = seq.importMGT(MOGRT, x.a, SUB, 0);
      if (!clip) { r.errores.push("no entra " + i); continue; }
      var sal = new Time(); sal.seconds = x.e - x.s; clip.outPoint = sal; clip.name = x.nombre;
      var q = clip.getMGTComponent().properties;
      var pl = q.getParamForDisplayName("Linea"), pc = q.getParamForDisplayName("Palabra clave");
      var j = JSON.parse(pl.getValue()); j.textEditValue = x.linea; j.fontTextRunLength = [x.linea.length]; pl.setValue(JSON.stringify(j), true);
      var k = JSON.parse(pc.getValue()); k.textEditValue = x.clave; k.fontTextRunLength = [x.clave.length]; pc.setValue(JSON.stringify(k), true);
      q.getParamForDisplayName("Color clave").setColorValue(x.cc[0], x.cc[1], x.cc[2], x.cc[3], true);
      q.getParamForDisplayName("Color linea").setColorValue(x.cl[0], x.cl[1], x.cl[2], x.cl[3], true);
      q.getParamForDisplayName("Altura").setValue(x.alt, true); q.getParamForDisplayName("Tamano").setValue(x.tam, true);
      q.getParamForDisplayName("Animacion de entrada").setValue(x.anim, true);
      q.getParamForDisplayName("Duracion de la entrada (fotogramas)").setValue(x.durE, true); q.getParamForDisplayName("Retraso de la palabra clave (fotogramas)").setValue(x.ret, true);
      if (Math.abs(clip.end.seconds - x.e) > 0.02 || Math.abs(clip.outPoint.seconds - (x.e - x.s)) > 0.02) r.errores.push("recorte " + i + ": " + clip.end.seconds.toFixed(2) + " out " + clip.outPoint.seconds.toFixed(2));
      puestos++;
    }
    r.subs = puestos;
    app.enableQE(); var qs = qe.project.getActiveSequence(), pos = seq.getPlayerPosition().ticks, ts = [1.9, 3.9, 20.0];
    for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); qs.exportFramePNG(qs.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/v4-" + i); }
    seq.setPlayerPosition(pos);
    app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r);
})();
