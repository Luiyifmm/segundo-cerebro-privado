// Marcadores de CLIENTE-A_1009_01 (imágenes que faltan e ideas de motion graphics), nombres de pista y fotogramas de control.
(function () {
  var MARCAS = [
    [0.34, 2.26, "IMAGEN derecha: mujer del pobre", "V2. Lo malo va a la derecha, en gris"], [2.26, 4.15, "IMAGEN izquierda: mujer del rico", "V2. Lo bueno va a la izquierda, en color con borde azul"],
    [4.15, 5.39, "IMAGEN derecha: lo que le gusta al pobre", ""], [5.39, 6.8, "IMAGEN izquierda: lo que disfruta el rico", ""],
    [6.8, 8.84, "IMAGEN derecha: fin de semana del pobre", ""], [8.84, 10.38, "IMAGEN izquierda: fin de semana del rico", ""],
    [10.44, 11.78, "IMAGEN derecha: lo que escucha el pobre", ""], [11.78, 13.37, "IMAGEN izquierda: lo que escucha el rico", ""],
    [13.37, 15.13, "IMAGEN derecha: interior de la casa del pobre", ""], [15.13, 17.22, "IMAGEN izquierda: interior de la casa del rico", ""],
    [17.22, 18.16, "IMAGEN derecha: como se viste un pobre", ""], [18.16, 19.48, "IMAGEN izquierda: como se viste un rico", ""],
    [19.48, 22.74, "MOTION GRAPHIC: no es lo que tienes, es como piensas", "Idea: fondo negro, billetes tachados a un lado y una cabeza con el cerebro iluminado en azul al otro"],
    [22.74, 26.18, "MOTION GRAPHIC: programacion mental desde pequeno", "Idea: fondo papel, silueta de nino con lineas de codigo entrando en la cabeza"],
    [28.85, 32.91, "MOTION GRAPHIC: eliminar la programacion de pobre", "Idea: lista de creencias que se tachan una a una (poca abundancia, pobre)"],
    [32.91, 37.05, "MOTION GRAPHIC: exito y abundancia", "Idea: ClienteA recortado en blanco y negro sobre circulo azul, dos barras que se llenan"],
    [37.05, 39.3, "CIERRE: boton seguir @cliente_a_handle", ""]
  ];
  var r = { errores: [] }, seq = null, i, T = 254016000000;
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name.indexOf("CLIENTE-A_1009_01 - corte") === 0) seq = app.project.sequences[i];
  app.project.openSequence(seq.sequenceID);
  var viejo = seq.markers.getFirstMarker(), lista = [];
  while (viejo) { lista.push(viejo); viejo = seq.markers.getNextMarker(viejo); }
  for (i = 0; i < lista.length; i++) seq.markers.deleteMarker(lista[i]);
  for (i = 0; i < MARCAS.length; i++) {
    try {
      var mk = seq.markers.createMarker(MARCAS[i][0]);
      mk.name = MARCAS[i][2];
      if (MARCAS[i][3]) mk.comments = MARCAS[i][3];
      try { mk.end = MARCAS[i][1]; } catch (e1) { r.errores.push(i + " fin " + e1); }
      var col = 1; if (MARCAS[i][2].indexOf("MOTION") === 0) col = 5; if (MARCAS[i][2].indexOf("CIERRE") === 0) col = 3;
      try { mk.setColorByIndex(col, 0); } catch (e2) {}
    } catch (e) { r.errores.push(i + " " + e); }
  }
  r.marcadores = seq.markers.numMarkers;
  try { seq.videoTracks[1].name = "IMAGENES"; seq.videoTracks[2].name = "MOTION GRAPHICS"; seq.videoTracks[3].name = "SUBTITULOS"; r.pistas = seq.videoTracks[3].name; } catch (e3) { r.errores.push("pistas " + e3); }
  try {
    app.enableQE(); var q = qe.project.getActiveSequence(), tiempos = [1.9, 5.0, 20.0, 21.9, 27.9, 35.3];
    for (i = 0; i < tiempos.length; i++) { seq.setPlayerPosition(String(Math.round(tiempos[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/am-" + i); }
    seq.setPlayerPosition("0");
  } catch (e4) { r.errores.push("fotogramas " + e4); }
  app.project.save();
  return JSON.stringify(r);
})();
