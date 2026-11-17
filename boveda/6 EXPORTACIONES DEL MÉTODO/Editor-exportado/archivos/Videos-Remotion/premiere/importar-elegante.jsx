// Importa el trial de estilo elegante en el proyecto de alternativas, lo guarda en su bandeja y abre la secuencia.
(function () {
  var PROY = "~/Videos-Remotion/entregas/clientea-alternativas-premiere-4K/ClienteA - 5 alternativas 4K.prproj";
  var XML = "~/Videos-Remotion/entregas/clientea-alternativas-premiere-4K/Trial - Estilo elegante EN LINEA.xml";
  var NOMBRE = "Trial - Estilo elegante EN LINEA";
  var r = { proyecto: app.project.path };
  if (app.project.path !== PROY) { app.openDocument(PROY, true, true, true); r.abierto = app.project.path; }
  var raiz = app.project.rootItem, antes = {};
  for (var i = 0; i < raiz.children.numItems; i++) antes[raiz.children[i].nodeId] = 1;
  var bin = raiz.createBin("Medios trial estilo elegante");
  app.project.importFiles([XML], true, bin, false);
  var seq = null;
  for (var s = 0; s < app.project.sequences.numSequences; s++) if (app.project.sequences[s].name === NOMBRE) seq = app.project.sequences[s];
  if (!seq) { r.error = "no aparece la secuencia"; return JSON.stringify(r); }
  app.project.openSequence(seq.sequenceID);
  var clips = 0, sinMedio = 0;
  for (var t = 0; t < seq.videoTracks.numTracks; t++) for (var c = 0; c < seq.videoTracks[t].clips.numItems; c++) { clips++; var pi = seq.videoTracks[t].clips[c].projectItem; if (pi && pi.isOffline()) sinMedio++; }
  for (var t2 = 0; t2 < seq.audioTracks.numTracks; t2++) for (var c2 = 0; c2 < seq.audioTracks[t2].clips.numItems; c2++) { clips++; var pa = seq.audioTracks[t2].clips[c2].projectItem; if (pa && pa.isOffline()) sinMedio++; }
  r.secuencia = seq.name; r.clips = clips; r.sinMedio = sinMedio; r.seg = seq.end / 254016000000;
  r.tam = seq.frameSizeHorizontal + "x" + seq.frameSizeVertical;
  app.project.save();
  return JSON.stringify(r);
})();
