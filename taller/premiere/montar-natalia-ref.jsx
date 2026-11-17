// NATALIA_1010_01, versión como la referencia: Natalia a pantalla completa, título fijo y contador de pasos en texto blanco con contorno.
(function () {
  var D = "/Users/luiyi/Videos-Remotion/clientes/natalia/NATALIA_1010_01/", MOGRT = "/Users/luiyi/Videos-Remotion/clientes/_plantillas/Texto nativo.mogrt", NOMBRE = "NATALIA_1010_01 - como la referencia";
  var CONT = [[0.5,1.329,1],[1.329,2.157,2],[2.157,2.986,3],[2.986,3.814,4],[3.814,4.643,5],[4.643,5.471,6],[5.471,6.3,7],[6.3,6.94,8],[6.94,7.58,9],[7.58,8.22,10],[8.22,8.86,11],[8.86,9.5,12],[9.5,10.086,13],[10.086,10.671,14],[10.671,11.257,15],[11.257,11.843,16],[11.843,12.429,17],[12.429,13.014,18],[13.014,13.6,19],[13.6,14,20],[14,14.4,21],[14.4,14.8,22],[14.8,15.2,23],[15.2,15.6,24],[15.6,16,25],[16,18.5,30]], FIN = 18.5, r = { errores: [] }, seq = null, i, T = 254016000000;
  try {
    if (app.project.name !== "NATALIA EDICION.prproj") return JSON.stringify({ error: "abre NATALIA EDICION", abierto: app.project.name });
    for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === NOMBRE) return JSON.stringify({ error: "la secuencia ya existe" });
    function seg(x) { var tm = new Time(); tm.seconds = x; return tm; }
    var bin = null; for (i = 0; i < app.project.rootItem.children.numItems; i++) if (app.project.rootItem.children[i].name === "NATALIA_1010_01") bin = app.project.rootItem.children[i]; if (!bin) bin = app.project.rootItem.createBin("NATALIA_1010_01");
    app.project.importFiles([D + "NATALIA_1010_01 - como la referencia.xml", D + "audio/ambiente reaccion completo.wav"], true, bin, false);
    for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === NOMBRE) seq = app.project.sequences[i]; if (!seq) return JSON.stringify({ error: "no se importo" });
    app.project.openSequence(seq.sequenceID); app.enableQE(); var q = qe.project.getActiveSequence();
    while (seq.videoTracks.numTracks < 4) q.addTracks(1, seq.videoTracks.numTracks, 0);
    try { seq.videoTracks[0].name = "REACCION"; seq.videoTracks[1].name = "TITULO"; seq.videoTracks[2].name = "CONTADOR"; seq.videoTracks[3].name = "MORALEJA"; seq.audioTracks[0].name = "AMBIENTE"; } catch (e0) {}
    function mov(c) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === "AE.ADBE Motion") return c.components[x].properties; return null; }
    mov(seq.videoTracks[0].clips[0])[4].setValue(90, true);
    function texto(pista, a, b, txt, y, tam) { var clip = seq.importMGT(MOGRT, seg(a).ticks, pista, 0); if (!clip) { r.errores.push("texto " + a); return null; } clip.end = seg(b); clip.outPoint = seg(b - a); clip.name = txt.replace(/\r/g, " ");
      var ps = clip.getMGTComponent().properties, pt = ps.getParamForDisplayName("Texto"), j = JSON.parse(pt.getValue()); j.textEditValue = txt; j.fontTextRunLength = [txt.length]; pt.setValue(JSON.stringify(j), true);
      ps.getParamForDisplayName("Tamano (50 = normal, 100 = doble)").setValue(tam, true); mov(clip)[0].setValue([0.5, y], true); return clip; }
    texto(1, 0, FIN, "Mi reacción a los pasos\rdiarios de la gente", 0.18, 50);
    var n = 0; for (i = 0; i < CONT.length; i++) if (texto(2, CONT[i][0], CONT[i][1], CONT[i][2] + ".000 pasos", 0.29, 66)) n++; r.contador = n;
    texto(3, 16.3, FIN, "No necesitas 20.000 pasos.\rNecesitas de 8.000 a 12.000\rtodos los días", 0.74, 46);
    var wav = null; for (i = 0; i < bin.children.numItems; i++) if (bin.children[i].name === "ambiente reaccion completo.wav") wav = bin.children[i];
    if (wav) { seq.audioTracks[0].overwriteClip(wav, 0); var ca = seq.audioTracks[0].clips[0]; if (ca) { ca.end = seg(FIN); for (i = 0; i < ca.components.numItems; i++) if (ca.components[i].displayName === "Volumen") ca.components[i].properties[1].setValue(Math.pow(10, (-8 - 15) / 20), true); } }
    r.pistas = []; for (i = 0; i < seq.videoTracks.numTracks; i++) r.pistas.push(seq.videoTracks[i].clips.numItems); r.fin = seq.end / T;
    var ts = [0.2, 3.0, 7.5, 11.0, 15.0, 16.1, 17.5];
    for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/nr-" + i); }
    seq.setPlayerPosition("0"); app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r);
})();
