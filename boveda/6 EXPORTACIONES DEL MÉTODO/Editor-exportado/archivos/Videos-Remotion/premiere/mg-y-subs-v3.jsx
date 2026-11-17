// CLIENTE-A_1009_01: cambia los subtítulos de V4 a la plantilla v3 (con control de tiempos) conservando su contenido,
// y coloca en V3 los dos clips del motion graphic "eliminar programación → abundancia".
(function () {
  var MOGRT = "~/Videos-Remotion/clientes/_plantillas/Subtitulo ClienteA v3.mogrt";
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
      var fin = new Time(); fin.ticks = x.b; clip.end = fin; clip.name = x.nombre;
      var q = clip.getMGTComponent().properties;
      var pl = q.getParamForDisplayName("Linea"), pc = q.getParamForDisplayName("Palabra clave");
      var j = JSON.parse(pl.getValue()); j.textEditValue = x.linea; j.fontTextRunLength = [x.linea.length]; pl.setValue(JSON.stringify(j), true);
      var k = JSON.parse(pc.getValue()); k.textEditValue = x.clave; k.fontTextRunLength = [x.clave.length]; pc.setValue(JSON.stringify(k), true);
      q.getParamForDisplayName("Color clave").setColorValue(x.cc[0], x.cc[1], x.cc[2], x.cc[3], true);
      // sobre el fondo blanco del segundo clip, la línea va en tinta oscura
      if (tA >= 0 && x.s >= tB - 0.05 && x.s < finB - 0.05) { q.getParamForDisplayName("Color linea").setColorValue(255, 20, 20, 20, true); oscuros++; }
      else q.getParamForDisplayName("Color linea").setColorValue(x.cl[0], x.cl[1], x.cl[2], x.cl[3], true);
      q.getParamForDisplayName("Altura").setValue(x.alt, true); q.getParamForDisplayName("Tamano").setValue(x.tam, true);
      q.getParamForDisplayName("Animacion de entrada").setValue(x.anim, true);
      puestos++;
    }
    r.subs = puestos; r.lineaOscura = oscuros;
    // 2. motion graphic en V3
    if (tA >= 0) {
      var v3 = seq.videoTracks[2], ocupado = false;
      for (i = 0; i < v3.clips.numItems; i++) if (v3.clips[i].end.seconds > tA && v3.clips[i].start.seconds < finB) ocupado = true;
      if (ocupado) r.errores.push("V3 ya tiene clips en ese tramo: no coloco el motion graphic");
      else {
        var bin = null, raiz = app.project.rootItem;
        for (i = 0; i < raiz.children.numItems; i++) if (raiz.children[i].name === "MOTION GRAPHICS CLIENTE-A_1009_01") bin = raiz.children[i];
        if (!bin) bin = raiz.createBin("MOTION GRAPHICS CLIENTE-A_1009_01");
        app.project.importFiles([MGA, MGB], true, bin, false);
        var ia = null, ib = null;
        for (i = 0; i < bin.children.numItems; i++) { if (bin.children[i].name.indexOf("MG eliminar") === 0) ia = bin.children[i]; if (bin.children[i].name.indexOf("MG abundancia") === 0) ib = bin.children[i]; }
        v3.overwriteClip(ia, tA); v3.overwriteClip(ib, tB);
        r.v3 = []; for (i = 0; i < v3.clips.numItems; i++) r.v3.push(v3.clips[i].name + " " + v3.clips[i].start.seconds.toFixed(2) + "-" + v3.clips[i].end.seconds.toFixed(2));
        r.audio = []; for (i = 0; i < seq.audioTracks.numTracks; i++) r.audio.push(seq.audioTracks[i].clips.numItems);
      }
      app.enableQE(); var qs = qe.project.getActiveSequence(), pos = seq.getPlayerPosition().ticks, ts = [tA + 1.2, tA + 3.3, tA + 4.15, tB + 1.5, tB + 3.4];
      for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); qs.exportFramePNG(qs.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/mgv3-" + i); }
      seq.setPlayerPosition(pos);
    }
    app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r);
})();
