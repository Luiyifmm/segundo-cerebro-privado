// CLIENTE-N_1010_01 (Reacción a los pasos): pantalla partida (reacción izquierda, botella derecha), contador de pasos editable,
// título, marca de zona ideal, moraleja al final y sonido.
(function () {
  var D = "~/Videos-Remotion/clientes/clienten/CLIENTE-N_1010_01/", MOGRT = "~/Videos-Remotion/clientes/_plantillas/Texto ClienteN v1.mogrt", NOMBRE = "CLIENTE-N_1010_01 - Reaccion a los pasos";
  var CONT = [[2,2.54,1],[2.54,3.08,2],[3.08,3.62,3],[3.62,4.16,4],[4.16,4.7,5],[4.7,5.24,6],[5.24,5.78,7],[5.78,6.32,8],[6.32,6.86,9],[6.86,7.4,10],[7.4,7.94,11],[7.94,8.48,12],[8.48,9.02,13],[9.02,9.56,14],[9.56,10.1,15],[10.1,10.64,16],[10.64,11.18,17],[11.18,11.72,18],[11.72,12.26,19],[12.26,12.8,20],[12.8,13.34,21],[13.34,13.88,22],[13.88,14.42,23],[14.42,14.96,24],[14.96,15.5,25],[15.5,17.958,30]], FIN = 431 / 24, r = { errores: [] }, seq = null, i, k, T = 254016000000;
  try {
    if (app.project.name !== "CLIENTE-N EDICION.prproj") return JSON.stringify({ error: "abre CLIENTE-N EDICION", abierto: app.project.name });
    for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === NOMBRE) return JSON.stringify({ error: "la secuencia ya existe" });
    function seg(x) { var tm = new Time(); tm.seconds = x; return tm; }
    function buscar(bin, nombre) { for (var b = 0; b < bin.children.numItems; b++) { var ch = bin.children[b]; if (ch.type === 2) { var x = buscar(ch, nombre); if (x) return x; } else if (ch.name === nombre) return ch; } return null; }
    var bin = app.project.rootItem.createBin("CLIENTE-N_1010_01"); app.project.importFiles([D + "CLIENTE-N_1010_01 - montaje.xml"], true, bin, false);
    for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === NOMBRE) seq = app.project.sequences[i];
    if (!seq) return JSON.stringify({ error: "no se importo la secuencia" });
    app.project.openSequence(seq.sequenceID); app.enableQE(); var q = qe.project.getActiveSequence(); r.tam = seq.frameSizeHorizontal + "x" + seq.frameSizeVertical; r.v0 = seq.videoTracks.numTracks; r.a0 = seq.audioTracks.numTracks;
    while (seq.videoTracks.numTracks < 6) q.addTracks(1, seq.videoTracks.numTracks, 0);
    if (seq.audioTracks.numTracks < 4) q.addTracks(0, 0, 4 - seq.audioTracks.numTracks, 1, seq.audioTracks.numTracks);
    try { seq.videoTracks[0].name = "REACCION"; seq.videoTracks[1].name = "BOTELLA"; seq.videoTracks[2].name = "ZONA IDEAL"; seq.videoTracks[3].name = "CONTADOR"; seq.videoTracks[4].name = "TITULO"; seq.videoTracks[5].name = "MORALEJA"; seq.audioTracks[0].name = "AMBIENTE BOTELLA"; seq.audioTracks[1].name = "AMBIENTE REACCION"; seq.audioTracks[2].name = "SFX"; seq.audioTracks[3].name = "SFX 2"; } catch (e0) {}
    function mov(c) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === "AE.ADBE Motion") return c.components[x].properties; return null; }
    // pantalla partida: la reacción ocupa la mitad izquierda y la botella la derecha (recortes y posición en Movimiento)
    var mr = mov(seq.videoTracks[0].clips[0]), mb = mov(seq.videoTracks[1].clips[0]); r.props = []; for (k = 0; k < mb.numItems; k++) r.props.push(k + ":" + mb[k].displayName);
    mr[0].setValue([0.25, 0.5], true); mr[9].setValue(25, true);
    mb[0].setValue([0.71, 0.5], true); mb[7].setValue(29, true);
    // textos
    function texto(pista, a, b, linea, clave, pos, tam, colL, colK) { var clip = seq.importMGT(MOGRT, seg(a).ticks, pista, 0); if (!clip) { r.errores.push("texto " + a); return; } clip.end = seg(b); clip.outPoint = seg(b - a); clip.name = (linea ? linea + (clave ? " / " : "") : "") + clave;
      var ps = clip.getMGTComponent().properties, pl = ps.getParamForDisplayName("Linea"), pc = ps.getParamForDisplayName("Palabra clave");
      var j = JSON.parse(pl.getValue()); j.textEditValue = linea; j.fontTextRunLength = [linea.length]; pl.setValue(JSON.stringify(j), true);
      var kk = JSON.parse(pc.getValue()); kk.textEditValue = clave; kk.fontTextRunLength = [clave.length]; pc.setValue(JSON.stringify(kk), true);
      ps.getParamForDisplayName("Tamano (50 = normal, 100 = doble)").setValue(tam, true); ps.getParamForDisplayName("Alinear a la izquierda").setValue(false, true); ps.getParamForDisplayName("Sombra").setValue(false, true);
      ps.getParamForDisplayName("Color linea").setColorValue(255, colL[0], colL[1], colL[2], true); ps.getParamForDisplayName("Color clave").setColorValue(255, colK[0], colK[1], colK[2], true);
      var pm = mov(clip); if (pm) pm[0].setValue(pos, true); return clip; }
    var TINTA = [22, 22, 22], VERDE = [34, 181, 115], TERRA = [200, 100, 45], nC = 0;
    for (i = 0; i < CONT.length; i++) { var c = CONT[i], n = c[2] + ".000 pasos", zona = c[2] >= 8 && c[2] <= 12; if (texto(3, c[0], c[1], "", n, [0.74, 0.02], 34, TINTA, zona ? VERDE : c[2] === 30 ? TERRA : TINTA)) nC++; }
    r.contador = nC;
    texto(4, 0, FIN, "mi reacción a tus", "pasos diarios", [0.5, -0.075], 50, TINTA, TERRA);
    texto(5, 15.6, 16.75, "no necesitas", "20.000 pasos", [0.5, 0.2], 50, [255, 255, 255], [255, 255, 255]);
    texto(5, 16.75, FIN, "necesitas de 8.000 a 12.000", "todos los días", [0.5, 0.2], 46, [255, 255, 255], VERDE);
    // la moraleja va en blanco con sombra (cae sobre la ropa oscura y la mesa)
    for (i = 0; i < seq.videoTracks[5].clips.numItems; i++) seq.videoTracks[5].clips[i].getMGTComponent().properties.getParamForDisplayName("Sombra").setValue(true, true);
    // zona ideal
    app.project.importFiles([D + "zona ideal.png", D + "audio/ambiente botella.wav", D + "audio/ambiente reaccion.wav"], true, bin, false);
    var zi = buscar(bin, "zona ideal.png"); seq.videoTracks[2].overwriteClip(zi, 5.4); var zc = seq.videoTracks[2].clips[0]; if (zc) { zc.end = seg(FIN); var zm = mov(zc); zm[1].setValue(200, true); }
    // sonido
    function db(x) { return Math.pow(10, (x - 15) / 20); }
    function audio(p, it, s2, d, dur) { if (!it) { r.errores.push("falta audio"); return; } var tr = seq.audioTracks[p]; tr.overwriteClip(it, s2); for (var m = 0; m < tr.clips.numItems; m++) if (Math.abs(tr.clips[m].start.seconds - s2) < 0.03) { var c3 = tr.clips[m]; if (dur) { c3.end = seg(s2 + dur); c3.outPoint = seg(c3.inPoint.seconds + dur); } else if (c3.end.seconds > FIN) c3.end = seg(FIN); for (var x = 0; x < c3.components.numItems; x++) if (c3.components[x].displayName === "Volumen") c3.components[x].properties[1].setValue(db(d), true); return; } r.errores.push("no quedo " + it.name); }
    audio(0, buscar(bin, "ambiente botella.wav"), 0, -6, 0); audio(1, buscar(bin, "ambiente reaccion.wav"), 0, -10, 0);
    var S = "~/Library/CloudStorage/GoogleDrive-<EMAIL>/Mi unidad/RECURSOS DE EDICIÓN/EFECTOS DE SONIDO/", binS = bin.createBin("SFX");
    app.project.importFiles([S + "09 Interfaz y avisos/Pop up SFX.mp3", S + "02 Risers/riseer 1.MP3", S + "04 Bajos (bass drops)/Deep Bass Hit 1.wav", S + "01 Whooshes/VS_Short Whoosh 1.mp3"], true, binS, false);
    audio(3, buscar(binS, "Deep Bass Hit 1.wav"), 15.5 - 0.256, -10, 0); audio(2, buscar(binS, "riseer 1.MP3"), 15.5 - 1.787, -6, 1.8); audio(2, buscar(binS, "Pop up SFX.mp3"), 5.4 - 0.154, -10, 0.45); audio(2, buscar(binS, "VS_Short Whoosh 1.mp3"), 0, -8, 0);
    r.pistasV = []; for (i = 0; i < seq.videoTracks.numTracks; i++) r.pistasV.push(seq.videoTracks[i].clips.numItems); r.pistasA = []; for (i = 0; i < seq.audioTracks.numTracks; i++) r.pistasA.push(seq.audioTracks[i].clips.numItems); r.fin = seq.end / T;
    var ts = [1.0, 4.0, 6.5, 10.0, 14.0, 15.9, 17.4];
    for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/nt-" + i); }
    seq.setPlayerPosition("0"); app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r);
})();
