// Efectos de sonido de AMIN_1009_01: obturador en cada imagen (A3), clic suave en cada palabra resaltada (A4)
// y whoosh + riser + golpe grave en el motion graphic (A5). Los tiempos se leen de la línea de tiempo actual.
(function () {
  var seq = app.project.activeSequence, r = { errores: [] }, i, t;
  try {
    if (seq.audioTracks.numTracks < 5) return JSON.stringify({ error: "faltan pistas de audio" });
    for (t = 2; t < 5; t++) if (seq.audioTracks[t].clips.numItems) return JSON.stringify({ error: "A" + (t + 1) + " ya tiene clips" });
    function buscar(bin, nombre) { for (var k = 0; k < bin.children.numItems; k++) { var c = bin.children[k]; if (c.type === 2) { var x = buscar(c, nombre); if (x) return x; } else if (c.name === nombre) return c; } return null; }
    var raiz = null; for (i = 0; i < app.project.rootItem.children.numItems; i++) if (app.project.rootItem.children[i].name === "EFECTOS DE SONIDO") raiz = app.project.rootItem.children[i];
    var S = { obt: "Camera Shutter Click 01.wav", clic: "Mouse Click 02.wav", whoosh: "Woosh Effect 8.wav", riser: "riseer 1.MP3", golpe: "Sub Bass Hit.wav" }, it = {}, k;
    for (k in S) { it[k] = buscar(raiz, S[k]); if (!it[k]) r.errores.push("no encuentro " + S[k]); }
    if (r.errores.length) return JSON.stringify(r);
    function db(x) { return Math.pow(10, (x - 15) / 20); }
    function poner(pista, item, seg, nivel) {
      var tr = seq.audioTracks[pista], antes = tr.clips.numItems; if (seg < 0) seg = 0;
      tr.overwriteClip(item, seg);
      for (var n = 0; n < tr.clips.numItems; n++) { var c = tr.clips[n]; if (Math.abs(c.start.seconds - seg) < 0.02) { for (var m = 0; m < c.components.numItems; m++) if (c.components[m].displayName === "Volumen") c.components[m].properties[1].setValue(db(nivel), true); return true; } }
      r.errores.push("no quedo en A" + (pista + 1) + " a " + seg.toFixed(2)); return false;
    }
    // tiempos
    var img = [], claves = [], mgA = -1;
    for (t = 0; t < seq.videoTracks.numTracks; t++) for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) { var c = seq.videoTracks[t].clips[i];
      if (/\.(png|jpe?g|webp)$/i.test(c.name)) img.push(c.start.seconds);
      if (c.name.indexOf("MG eliminar") === 0) mgA = c.start.seconds;
      var mg = c.getMGTComponent(); if (mg) { var kw = JSON.parse(mg.properties.getParamForDisplayName("Palabra clave").getValue()).textEditValue; if (kw) claves.push(c.start.seconds + mg.properties.getParamForDisplayName("Retraso de la palabra clave (fotogramas)").getValue() / 30); } }
    img.sort(function (a, b) { return a - b; }); claves.sort(function (a, b) { return a - b; });
    var n1 = 0, n2 = 0, ult = -9;
    for (i = 0; i < img.length; i++) { if (img[i] - ult < 0.25) continue; ult = img[i]; if (poner(2, it.obt, img[i] - 0.03, 2)) n1++; }
    ult = -9;
    for (i = 0; i < claves.length; i++) { if (claves[i] - ult < 0.2) continue; ult = claves[i]; if (poner(3, it.clic, claves[i], 4)) n2++; }
    r.obturadores = n1; r.clics = n2;
    if (mgA >= 0) { var flash = mgA + 4.2; poner(4, it.whoosh, mgA - 0.05, -6); poner(4, it.riser, flash - 1.787, -3); poner(4, it.golpe, flash, -12); r.mg = "whoosh " + mgA.toFixed(2) + ", riser hasta " + flash.toFixed(2) + ", golpe " + flash.toFixed(2); }
    try { seq.audioTracks[2].name = "SFX IMAGENES"; seq.audioTracks[3].name = "SFX CLICS"; seq.audioTracks[4].name = "SFX MOTION"; } catch (e) {}
    r.pistas = []; for (t = 0; t < seq.audioTracks.numTracks; t++) r.pistas.push("A" + (t + 1) + ":" + seq.audioTracks[t].clips.numItems);
    r.a5 = []; for (i = 0; i < seq.audioTracks[4].clips.numItems; i++) r.a5.push(seq.audioTracks[4].clips[i].name + " " + seq.audioTracks[4].clips[i].start.seconds.toFixed(2) + "-" + seq.audioTracks[4].clips[i].end.seconds.toFixed(2));
    r.voz = seq.audioTracks[0].clips.numItems + "/" + seq.audioTracks[1].clips.numItems; r.video = []; for (t = 0; t < seq.videoTracks.numTracks; t++) r.video.push(seq.videoTracks[t].clips.numItems);
    r.fin = seq.end / 254016000000;
    app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r);
})();
