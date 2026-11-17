// Importa el trial azul, coloca un subtítulo de texto editable (plantilla MOGRT) por frase en la pista de arriba y abre la secuencia.
(function () {
  var D = "~/Videos-Remotion/entregas/clientea-alternativas-premiere-4K/";
  var XML = D + "Trial - Estilo elegante azul EN LINEA.xml", NOMBRE = "Trial - Estilo elegante azul EN LINEA";
  var MOGRT = "~/Videos-Remotion/clientes/_plantillas/Subtitulo elegante.mogrt";
  var SUBS = [{"a":0.2,"b":0.66,"linea":"así se viste","clave":"","retraso":0,"fin":0.62},{"a":0.62,"b":1.06,"linea":"a la mujer","clave":"","retraso":0,"fin":1.02},{"a":1.02,"b":1.78,"linea":"que solo quieren","clave":"","retraso":0,"fin":1.74},{"a":1.74,"b":2.4,"linea":"para una","clave":"noche","retraso":12,"fin":2.36},{"a":2.36,"b":2.86,"linea":"y así se","clave":"","retraso":0,"fin":2.82},{"a":2.82,"b":3.32,"linea":"viste a la","clave":"","retraso":0,"fin":3.28},{"a":3.28,"b":4.06,"linea":"mujer que quieren","clave":"","retraso":0,"fin":4.02},{"a":4.02,"b":4.8,"linea":"para toda la","clave":"vida","retraso":18,"fin":4.88},{"a":4.88,"b":5.7,"linea":"a esta solo","clave":"","retraso":0,"fin":5.66},{"a":5.66,"b":6.28,"linea":"la quieren para","clave":"","retraso":0,"fin":6.24},{"a":6.24,"b":6.84,"linea":"una","clave":"cosa","retraso":7,"fin":6.94},{"a":6.94,"b":7.52,"linea":"ya sabes para","clave":"","retraso":0,"fin":7.48},{"a":7.48,"b":7.6,"linea":"qué","clave":"","retraso":0,"fin":7.64},{"a":7.64,"b":8.8,"linea":"a esta la","clave":"respetan","retraso":17,"fin":8.94},{"a":8.94,"b":9.44,"linea":"a ella la","clave":"","retraso":0,"fin":9.4},{"a":9.4,"b":10.56,"linea":"buscan para divertirse","clave":"","retraso":0,"fin":10.52},{"a":10.52,"b":11.48,"linea":"y perder el","clave":"tiempo","retraso":23,"fin":11.54},{"a":11.54,"b":12.22,"linea":"y con ella","clave":"","retraso":0,"fin":12.18},{"a":12.18,"b":12.88,"linea":"para","clave":"prosperar","retraso":10,"fin":12.84},{"a":12.84,"b":13.28,"linea":"la","clave":"vida","retraso":4,"fin":13.24},{"a":13.24,"b":13.52,"linea":"entera","clave":"","retraso":0,"fin":13.56},{"a":13.56,"b":14.36,"linea":"la regla es","clave":"","retraso":0,"fin":14.32},{"a":14.32,"b":15.46,"linea":"cruel pero es","clave":"innegable","retraso":21,"fin":15.62},{"a":15.62,"b":17.18,"linea":"atraes exactamente lo","clave":"","retraso":0,"fin":17.14},{"a":17.14,"b":17.84,"linea":"que","clave":"proyectas","retraso":10,"fin":17.9},{"a":17.9,"b":19,"linea":"como es","clave":"adentro","retraso":10,"fin":19.22},{"a":19.22,"b":19.74,"linea":"es","clave":"afuera","retraso":7,"fin":19.8},{"a":19.8,"b":20.32,"linea":"la forma en","clave":"","retraso":0,"fin":20.28},{"a":20.28,"b":21.24,"linea":"la que te presentas","clave":"","retraso":0,"fin":21.2},{"a":21.2,"b":21.68,"linea":"al","clave":"mundo","retraso":5,"fin":21.64},{"a":21.64,"b":22.56,"linea":"dicta cómo te","clave":"","retraso":0,"fin":22.52},{"a":22.52,"b":23.48,"linea":"van a","clave":"tratar","retraso":10,"fin":23.44},{"a":23.44,"b":24.06,"linea":"y cómo te","clave":"","retraso":0,"fin":24.02},{"a":24.02,"b":24.48,"linea":"van a","clave":"valorar","retraso":8,"fin":24.56},{"a":24.56,"b":25.42,"linea":"","clave":"sígueme","retraso":0,"fin":25.38},{"a":25.38,"b":26.04,"linea":"para mejorar tu","clave":"vida","retraso":19,"fin":26.167}];
  var r = {}, i, T = 254016000000;
  // quitar el clon de la prueba
  for (i = app.project.sequences.numSequences - 1; i >= 0; i--) if (app.project.sequences[i].name === "Trial - Estilo elegante EN LINEA copia") { app.project.deleteSequence(app.project.sequences[i]); r.clonBorrado = true; }
  var seq = null;
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === NOMBRE) seq = app.project.sequences[i];
  if (!seq) {
    var bin = app.project.rootItem.createBin("Medios trial estilo elegante azul");
    app.project.importFiles([XML], true, bin, false);
    for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === NOMBRE) seq = app.project.sequences[i];
  }
  if (!seq) return JSON.stringify({ error: "no aparece la secuencia" });
  app.project.openSequence(seq.sequenceID);
  var top = seq.videoTracks.numTracks - 1, pista = seq.videoTracks[top];
  r.pistas = seq.videoTracks.numTracks; r.enPistaAntes = pista.clips.numItems;
  if (pista.clips.numItems) return JSON.stringify({ error: "la pista de arriba no esta vacia", r: r });
  var puestos = 0, fallos = [];
  for (i = 0; i < SUBS.length; i++) {
    var s = SUBS[i], t = new Time(); t.seconds = Math.round(s.a * 30) / 30;
    var clip = seq.importMGT(MOGRT, t.ticks, top, 0);
    if (!clip) { fallos.push(i); continue; }
    var fin = new Time(); fin.seconds = Math.round(s.fin * 30) / 30; clip.end = fin;
    clip.name = s.linea + (s.clave ? " / " + s.clave : "");
    var ps = clip.getMGTComponent().properties;
    var pl = ps.getParamForDisplayName("Linea"), pc = ps.getParamForDisplayName("Palabra clave");
    var j = JSON.parse(pl.getValue()); j.textEditValue = s.linea; j.fontTextRunLength = [s.linea.length]; pl.setValue(JSON.stringify(j), true);
    var k = JSON.parse(pc.getValue()); k.textEditValue = s.clave; k.fontTextRunLength = [s.clave.length]; pc.setValue(JSON.stringify(k), true);
    if (i === 0) r.fuenteEditable = j.capPropFontEdit;
    ps.getParamForDisplayName("Retraso clave (fotogramas)").setValue(s.clave && s.linea ? s.retraso : 0, true);
    puestos++;
  }
  r.puestos = puestos; r.fallos = fallos; r.enPista = pista.clips.numItems;
  // el importMGT deja la plantilla en la raíz: llevarla a la bandeja de medios
  var clips = 0, sinMedio = 0;
  for (var a = 0; a < seq.videoTracks.numTracks; a++) for (var b = 0; b < seq.videoTracks[a].clips.numItems; b++) { clips++; var pi = seq.videoTracks[a].clips[b].projectItem; if (pi && pi.isOffline()) sinMedio++; }
  r.clipsVideo = clips; r.sinMedio = sinMedio; r.seg = seq.end / T; r.tam = seq.frameSizeHorizontal + "x" + seq.frameSizeVertical;
  app.enableQE();
  var q = qe.project.getActiveSequence(), tiempos = [4.75, 8.5, 17.7, 19.0, 23.3, 25.9];
  for (i = 0; i < tiempos.length; i++) { seq.setPlayerPosition(String(Math.round(tiempos[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/azul-" + i); }
  seq.setPlayerPosition("0");
  app.project.save();
  return JSON.stringify(r);
})();
