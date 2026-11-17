// AMIN_1009_01: coloca el cierre "seguir" tras el motion graphic, con su sonido (pop al entrar y clic al pulsar),
// y añade whoosh + riser al principio del vídeo.
(function () {
  var seq = app.project.activeSequence, r = { errores: [] }, i, t;
  try {
    var MOV = "/Users/luiyi/Videos-Remotion/clientes/amin/AMIN_1009_01/motion/CTA seguir aminbusinesss.mov";
    var vt = -1, tC = -1, finVideo = 0;
    for (t = 0; t < seq.videoTracks.numTracks; t++) for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) { var c = seq.videoTracks[t].clips[i]; if (c.name.indexOf("MG abundancia") === 0) { vt = t; tC = c.end.seconds; } if (c.name.indexOf("CTA seguir") === 0) return JSON.stringify({ error: "el cierre ya esta puesto" }); }
    for (i = 0; i < seq.videoTracks[0].clips.numItems; i++) { var e0 = seq.videoTracks[0].clips[i].end.seconds; if (e0 > finVideo && seq.videoTracks[0].clips[i].start.seconds < 42) finVideo = e0; }
    if (vt < 0) return JSON.stringify({ error: "no encuentro el motion graphic" });
    var A5 = -1, A7 = -1; for (t = 0; t < seq.audioTracks.numTracks; t++) { if (seq.audioTracks[t].name === "SFX MOTION") A5 = t; if (seq.audioTracks[t].name === "SFX ICONOS") A7 = t; }
    if (A5 < 0 || A7 < 0) return JSON.stringify({ error: "faltan las pistas de efectos" });
    function libreV(a, b) { var tr = seq.videoTracks[vt]; for (var n = 0; n < tr.clips.numItems; n++) if (tr.clips[n].start.seconds < b - 0.01 && tr.clips[n].end.seconds > a + 0.01) return false; return true; }
    function libreA(p, a, b) { var tr = seq.audioTracks[p]; for (var n = 0; n < tr.clips.numItems; n++) if (tr.clips[n].start.seconds < b - 0.01 && tr.clips[n].end.seconds > a + 0.01) return false; return true; }
    function buscar(bin, nombre) { for (var k = 0; k < bin.children.numItems; k++) { var c2 = bin.children[k]; if (c2.type === 2) { var x = buscar(c2, nombre); if (x) return x; } else if (c2.name === nombre) return c2; } return null; }
    function db(x) { return Math.pow(10, (x - 15) / 20); }
    function clipEn(tr, seg) { for (var n = 0; n < tr.clips.numItems; n++) if (Math.abs(tr.clips[n].start.seconds - seg) < 0.02) return tr.clips[n]; return null; }
    function recorta(c3, dur) { var e = new Time(); e.seconds = c3.start.seconds + dur; c3.end = e; var o = new Time(); o.seconds = c3.inPoint.seconds + dur; c3.outPoint = o; }
    function nivel(c3, d) { for (var m = 0; m < c3.components.numItems; m++) if (c3.components[m].displayName === "Volumen") c3.components[m].properties[1].setValue(db(d), true); }
    function sfx(pista, item, seg, d, dur, largo) { if (seg < 0) seg = 0; if (!libreA(pista, seg, seg + largo)) { r.errores.push("ocupado " + seq.audioTracks[pista].name + " " + seg.toFixed(2)); return null; } seq.audioTracks[pista].overwriteClip(item, seg); var c4 = clipEn(seq.audioTracks[pista], seg); if (!c4) { r.errores.push("no quedo " + item.name); return null; } if (dur) recorta(c4, dur); nivel(c4, d); return c4; }
    var raiz = null, binMG = null; for (i = 0; i < app.project.rootItem.children.numItems; i++) { var ch = app.project.rootItem.children[i]; if (ch.name === "EFECTOS DE SONIDO") raiz = ch; if (ch.name === "MOTION GRAPHICS AMIN_1009_01") binMG = ch; }
    var pop = buscar(raiz, "Pop up SFX.mp3"), clic = buscar(raiz, "Mouse Click 02.wav"), whoosh = buscar(raiz, "VS_Short Whoosh 1.mp3"), riser = buscar(raiz, "riseer 1.MP3");
    if (!pop || !clic || !whoosh || !riser) return JSON.stringify({ error: "falta algun sonido en la bandeja" });
    // 1. cierre
    var durC = Math.min(2.6, finVideo - tC);
    if (durC < 1.9) r.errores.push("queda poco tiempo para el cierre: " + durC.toFixed(2));
    if (!libreV(tC, tC + 2.6)) r.errores.push("la pista de video esta ocupada tras el motion graphic");
    else {
      app.project.importFiles([MOV], true, binMG, false);
      var item = buscar(binMG, "CTA seguir aminbusinesss.mov");
      seq.videoTracks[vt].overwriteClip(item, tC);
      var cc = clipEn(seq.videoTracks[vt], tC);
      if (cc) { if (durC < 2.6) recorta(cc, durC); r.cierre = "V" + (vt + 1) + " " + cc.start.seconds.toFixed(2) + "-" + cc.end.seconds.toFixed(2); } else r.errores.push("no quedo el cierre");
      sfx(A5, pop, tC - 0.154, -10, 0.45, 0.9);
      sfx(A5, clic, tC + 1.7, 6, 0, 0.1);
    }
    // 2. principio del vídeo: whoosh al arrancar y riser que sube hasta la segunda imagen
    var img = []; for (t = 0; t < seq.videoTracks.numTracks; t++) for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) if (/\.(png|jpe?g|webp)$/i.test(seq.videoTracks[t].clips[i].name)) img.push(seq.videoTracks[t].clips[i].start.seconds);
    img.sort(function (a, b) { return a - b; });
    var seg2 = -1; for (i = 0; i < img.length; i++) if (img[i] > 1) { seg2 = img[i]; break; }
    if (seg2 > 1.9) { sfx(A5, riser, seg2 - 1.787, -6, 1.84, 1.95); r.riserInicio = (seg2 - 1.787).toFixed(2) + " -> " + seg2.toFixed(2); }
    var w = sfx(A7, whoosh, 0, -6, 0, 1.25);
    if (w) { var ip = new Time(); ip.seconds = 0.38; try { w.inPoint = ip; } catch (e9) { r.errores.push("inPoint " + e9); } r.whooshInicio = w.start.seconds.toFixed(2) + "-" + w.end.seconds.toFixed(2) + " in " + w.inPoint.seconds.toFixed(2) + " out " + w.outPoint.seconds.toFixed(2); }
    r.pistas = []; for (t = 0; t < seq.audioTracks.numTracks; t++) r.pistas.push("A" + (t + 1) + " " + seq.audioTracks[t].name + ":" + seq.audioTracks[t].clips.numItems);
    r.fin = seq.end / 254016000000; r.finVideo = finVideo;
    app.enableQE(); var q = qe.project.getActiveSequence(), p0 = seq.getPlayerPosition().ticks, ts = [tC + 0.9, tC + 1.95], T = 254016000000;
    for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/ctaf-" + i); }
    seq.setPlayerPosition(p0);
    app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r);
})();
