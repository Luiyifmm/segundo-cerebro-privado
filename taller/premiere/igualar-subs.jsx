// Copia los ajustes de un subtítulo a los demás (duración de entrada, retraso de la clave, animación, tamaño y altura).
// Origen: el primer subtítulo seleccionado. Destino: los demás seleccionados; si solo hay uno seleccionado, todos los de la pista.
// APLICAR = false solo informa de lo que haría.
(function () {
  var APLICAR = false;
  var CAMPOS = ["Duracion de la entrada (fotogramas)", "Retraso de la palabra clave (fotogramas)", "Animacion de entrada", "Tamano (50 = normal, 100 = doble)", "Altura (50 = normal, mas = sube)"];
  var seq = app.project.activeSequence, r = { errores: [] }, i, t, SUB = -1, mejor = 0;
  for (t = 0; t < seq.videoTracks.numTracks; t++) { var n = 0; for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) if (seq.videoTracks[t].clips[i].getMGTComponent()) n++; if (n > mejor) { mejor = n; SUB = t; } }
  if (SUB < 0) return JSON.stringify({ error: "no hay subtitulos de plantilla" });
  var tr = seq.videoTracks[SUB], sel = [], todos = [];
  for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i]; if (!c.getMGTComponent()) continue; todos.push(c); if (c.isSelected()) sel.push(c); }
  r.pista = "V" + (SUB + 1); r.subtitulos = todos.length; r.seleccionados = sel.length;
  if (!sel.length) { r.aviso = "selecciona el subtitulo que sirve de modelo"; return JSON.stringify(r); }
  var origen = sel[0], destino = sel.length > 1 ? sel.slice(1) : todos, po = origen.getMGTComponent().properties, vals = {}, k;
  r.modelo = origen.name;
  for (k = 0; k < CAMPOS.length; k++) { var p = po.getParamForDisplayName(CAMPOS[k]); if (p) vals[CAMPOS[k]] = p.getValue(); }
  r.valores = vals; r.destinos = destino.length;
  if (!APLICAR) return JSON.stringify(r);
  var hechos = 0;
  for (i = 0; i < destino.length; i++) {
    if (destino[i] === origen) continue;
    try { var pd = destino[i].getMGTComponent().properties; for (k = 0; k < CAMPOS.length; k++) { var q = pd.getParamForDisplayName(CAMPOS[k]); if (q && vals[CAMPOS[k]] !== undefined) q.setValue(vals[CAMPOS[k]], true); } hechos++; }
    catch (e) { r.errores.push(destino[i].name + ": " + e); }
  }
  r.cambiados = hechos;
  return JSON.stringify(r);
})();
