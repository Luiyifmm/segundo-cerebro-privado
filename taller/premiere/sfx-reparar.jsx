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
    // el riser, al entrar con su duración completa, pisó el whoosh corto y el arranque del pulso: se quita el pulso recortado y se reponen los dos
    for (i = seq.audioTracks[A5].clips.numItems - 1; i >= 0; i--) if (seq.audioTracks[A5].clips[i].name.indexOf("deep throbbing") === 0) { seq.audioTracks[A5].clips[i].remove(false, false); r.quitado = "pulso recortado"; }
    function buscar(bin, nombre) { for (var k = 0; k < bin.children.numItems; k++) { var c2 = bin.children[k]; if (c2.type === 2) { var x = buscar(c2, nombre); if (x) return x; } else if (c2.name === nombre) return c2; } return null; }
    var raiz = null; for (i = 0; i < app.project.rootItem.children.numItems; i++) if (app.project.rootItem.children[i].name === "EFECTOS DE SONIDO") raiz = app.project.rootItem.children[i];
    var S = { pulso: "deep throbbing slow energy pulse.wav", w8: "Woosh Effect 8.wav" }, it = {}, k;
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
    poner(A5, it.w8, mgA - 0.05, -2, 0.3);
    poner(A5, it.pulso, mgA + 0.35, -4, 1.85);
    r.pistas = []; for (t = 0; t < seq.audioTracks.numTracks; t++) { var tr2 = seq.audioTracks[t], cs = []; if (t >= A5) for (i = 0; i < tr2.clips.numItems; i++) cs.push(tr2.clips[i].name.substr(0, 18) + " " + tr2.clips[i].start.seconds.toFixed(2) + "-" + tr2.clips[i].end.seconds.toFixed(2)); r.pistas.push("A" + (t + 1) + " " + tr2.name + " (" + tr2.clips.numItems + ") " + cs.join(", ")); }
    r.fin = seq.end / 254016000000;
    app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r);
})();
