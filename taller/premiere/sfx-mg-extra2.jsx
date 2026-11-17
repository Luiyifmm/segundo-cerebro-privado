// Más sonido para el motion graphic de AMIN_1009_01: ambiente de vacío bajo la parte azul (pista nueva),
// un pulso grave cuando aparece el cerebro y un sonido digital cuando sale la onda azul de la parte blanca.
(function () {
  var seq = app.project.activeSequence, r = { errores: [] }, i, t;
  try {
    var mgA = -1, mgB = -1;
    for (t = 0; t < seq.videoTracks.numTracks; t++) for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) { var c = seq.videoTracks[t].clips[i]; if (c.name.indexOf("MG eliminar") === 0) mgA = c.start.seconds; if (c.name.indexOf("MG abundancia") === 0) mgB = c.start.seconds; }
    if (mgA < 0 || mgB < 0) return JSON.stringify({ error: "no encuentro los clips del motion graphic" });
    var A5 = -1; for (t = 0; t < seq.audioTracks.numTracks; t++) if (seq.audioTracks[t].name === "SFX MOTION") A5 = t;
    if (A5 < 0) return JSON.stringify({ error: "no encuentro la pista SFX MOTION" });
    // quitar la ráfaga digital anterior de la onda
    for (i = seq.audioTracks[A5].clips.numItems - 1; i >= 0; i--) if (seq.audioTracks[A5].clips[i].name.indexOf("8-bit") === 0) { seq.audioTracks[A5].clips[i].remove(false, false); r.quitado = "8-bit"; }
    app.enableQE(); var q = qe.project.getActiveSequence(), antes = seq.audioTracks.numTracks;
    q.addTracks(0, 0, 1, 1, antes); var A7 = seq.audioTracks.numTracks - 1;
    if (seq.audioTracks.numTracks !== antes + 1 || seq.audioTracks[A7].clips.numItems) return JSON.stringify({ error: "no pude crear la pista de iconos" });
    try { seq.audioTracks[A7].name = "SFX ICONOS"; } catch (e) {}
    function buscar(bin, nombre) { for (var k = 0; k < bin.children.numItems; k++) { var c2 = bin.children[k]; if (c2.type === 2) { var x = buscar(c2, nombre); if (x) return x; } else if (c2.name === nombre) return c2; } return null; }
    var raiz = null; for (i = 0; i < app.project.rootItem.children.numItems; i++) if (app.project.rootItem.children[i].name === "EFECTOS DE SONIDO") raiz = app.project.rootItem.children[i];
    var S = { pop: "Pop up SFX.mp3", icono: "Swoosh 01 - 07.wav", riser: "Sharp Riser.wav", whoosh: "VS_Short Whoosh 1.mp3" }, it = {}, k;
    for (k in S) { it[k] = buscar(raiz, S[k]); if (!it[k]) r.errores.push("no encuentro " + S[k]); }
    if (r.errores.length) return JSON.stringify(r);
    function db(x) { return Math.pow(10, (x - 15) / 20); }
    function libre(pista, a, b) { var tr = seq.audioTracks[pista]; for (var n = 0; n < tr.clips.numItems; n++) if (tr.clips[n].start.seconds < b - 0.01 && tr.clips[n].end.seconds > a + 0.01) return false; return true; }
    function poner(pista, item, seg, nivel, dur) {
      var tr = seq.audioTracks[pista];
      if (dur && !libre(pista, seg, seg + dur)) { r.errores.push("tramo ocupado en " + tr.name + " a " + seg.toFixed(2)); return; }
      tr.overwriteClip(item, seg);
      for (var n = 0; n < tr.clips.numItems; n++) { var c3 = tr.clips[n]; if (Math.abs(c3.start.seconds - seg) < 0.02) {
        if (dur) { var e = new Time(); e.seconds = seg + dur; c3.end = e; var o = new Time(); o.seconds = c3.inPoint.seconds + dur; c3.outPoint = o; }
        for (var m = 0; m < c3.components.numItems; m++) if (c3.components[m].displayName === "Volumen") c3.components[m].properties[1].setValue(db(nivel), true);
        return; } }
      r.errores.push("no quedo " + item.name);
    }
    var onda = mgB + 3.2, n;
    // onda azul: un "pop" corto (el sonido empieza 0,15 s dentro del archivo)
    poner(A5, it.pop, onda - 0.154, -10, 0.45);
    // riser que sube hasta la entrada del motion graphic y whoosh más marcado en la entrada
    poner(A5, it.riser, mgA - 1.8, -5, 1.76);
    poner(A7, it.whoosh, mgA - 0.53, -8, 0.76);
    for (n = 0; n < seq.audioTracks[A5].clips.numItems; n++) { var w = seq.audioTracks[A5].clips[n]; if (w.name.indexOf("Woosh Effect 8") === 0) for (var m2 = 0; m2 < w.components.numItems; m2++) if (w.components[m2].displayName === "Volumen") w.components[m2].properties[1].setValue(db(-2), true); }
    // un toque por cada icono que aparece: 6 en la parte azul y 4 en la blanca
    for (n = 0; n < 6; n++) poner(A7, it.icono, mgA + 0.25 + n * 0.2 + (n === 0 ? 0.02 : 0), -8, 0.18);
    for (n = 0; n < 4; n++) poner(A7, it.icono, mgB + 0.45 + n * 0.25, -8, 0.18);
    r.tiempos = "riser " + (mgA - 1.8).toFixed(2) + "-" + (mgA - 0.04).toFixed(2) + " | whoosh " + (mgA - 0.53).toFixed(2) + " | iconos desde " + (mgA + 0.25).toFixed(2) + " y " + (mgB + 0.45).toFixed(2) + " | pop " + onda.toFixed(2);
    r.pistas = []; for (t = 0; t < seq.audioTracks.numTracks; t++) { var tr2 = seq.audioTracks[t], cs = []; if (t >= A5) for (i = 0; i < tr2.clips.numItems; i++) cs.push(tr2.clips[i].name.substr(0, 18) + " " + tr2.clips[i].start.seconds.toFixed(2) + "-" + tr2.clips[i].end.seconds.toFixed(2)); r.pistas.push("A" + (t + 1) + " " + tr2.name + " (" + tr2.clips.numItems + ") " + cs.join(", ")); }
    r.fin = seq.end / 254016000000;
    app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r);
})();
