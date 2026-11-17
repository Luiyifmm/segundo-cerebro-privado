// Prueba: inserta la plantilla en un clon de la secuencia, cambia el texto y exporta un fotograma. Borra el clon al terminar.
(function () {
  var r = {}, T = 254016000000;
  var MOGRT = "~/Videos-Remotion/clientes/_plantillas/Subtitulo elegante.mogrt";
  var base = null, i;
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === "Trial - Estilo elegante EN LINEA") base = app.project.sequences[i];
  if (!base) return JSON.stringify({ error: "sin secuencia base" });
  var antes = {};
  for (i = 0; i < app.project.sequences.numSequences; i++) antes[app.project.sequences[i].sequenceID] = 1;
  base.clone();
  var seq = null;
  for (i = 0; i < app.project.sequences.numSequences; i++) if (!antes[app.project.sequences[i].sequenceID]) seq = app.project.sequences[i];
  r.clon = seq.name;
  app.project.openSequence(seq.sequenceID);
  var top = seq.videoTracks.numTracks - 1;
  var pista = seq.videoTracks[top];
  for (i = pista.clips.numItems - 1; i >= 0; i--) pista.clips[i].remove(false, false);
  var t = new Time(); t.seconds = 4.02;
  var clip = seq.importMGT(MOGRT, t.ticks, top, 0);
  r.clip = clip ? clip.name : null;
  if (clip) {
    var fin = new Time(); fin.seconds = 4.92; clip.end = fin;
    var comp = clip.getMGTComponent();
    r.params = [];
    for (i = 0; i < comp.properties.numItems; i++) { var p = comp.properties[i]; var v; try { v = String(p.getValue()).substr(0, 400); } catch (e) { v = "?" + e; } r.params.push(p.displayName + " = " + v); }
    var pl = comp.properties.getParamForDisplayName("Linea"), pc = comp.properties.getParamForDisplayName("Palabra clave");
    try {
      var j = JSON.parse(pl.getValue()); j.textEditValue = "texto de prueba"; r.setL = pl.setValue(JSON.stringify(j), true);
      var k = JSON.parse(pc.getValue()); k.textEditValue = "probando"; r.setC = pc.setValue(JSON.stringify(k), true);
      r.tras = String(pl.getValue()).substr(0, 200);
    } catch (e) { r.errSet = String(e); }
    r.dur = clip.end.seconds - clip.start.seconds;
    r.escala = seq.frameSizeHorizontal;
  }
  app.enableQE();
  seq.setPlayerPosition(String(Math.round(4.7 * T)));
  var q = qe.project.getActiveSequence();
  q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/prueba-mogrt");
  r.seqID = seq.sequenceID;
  return JSON.stringify(r);
})();
