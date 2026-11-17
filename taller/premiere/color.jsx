// Corrección de color sencilla (Lumetri › Corrección básica) en todos los clips del bruto IMG_6131 de la secuencia activa
// y de la secuencia anidada, con los mismos valores para que no haya saltos.
(function () {
  var VAL = { 20: 12, 21: -12, 22: 6, 23: 5, 24: -8, 16: 108, 42: 10 };   // contraste, resaltados, sombras, blancos, negros, saturación, intensidad
  var r = { errores: [], sec: [] }, principal = app.project.activeSequence, T = 254016000000;
  function lum(c) { for (var i = 0; i < c.components.numItems; i++) if (c.components[i].matchName.indexOf("Lumetri") >= 0) return c.components[i]; return null; }
  function tratar(seq) {
    app.project.openSequence(seq.sequenceID); app.enableQE();
    var q = qe.project.getActiveSequence(), fx = qe.project.getVideoEffectByName("Color de Lumetri"), hechos = 0, ya = 0, t, i, k;
    for (t = 0; t < seq.videoTracks.numTracks; t++) {
      var tr = seq.videoTracks[t], qt = q.getVideoTrackAt(t);
      for (i = 0; i < tr.clips.numItems; i++) {
        var c = tr.clips[i], ruta = ""; try { ruta = c.projectItem.getMediaPath(); } catch (e0) {} if (String(ruta).indexOf("IMG_6131") < 0) continue;
        if (!lum(c)) { var puesto = false; for (k = 0; k < qt.numItems; k++) { var it = qt.getItemAt(k); if (it && it.type === "Clip" && Math.abs(it.start.secs - c.start.seconds) < 0.02) { it.addVideoEffect(fx); puesto = true; break; } } if (!puesto) { r.errores.push(seq.name + " V" + (t + 1) + " " + c.start.seconds.toFixed(2) + ": no pude poner Lumetri"); continue; } } else ya++;
        var L = lum(tr.clips[i]); if (!L) { r.errores.push("sin Lumetri tras ponerlo " + c.start.seconds.toFixed(2)); continue; }
        for (var p in VAL) L.properties[+p].setValue(VAL[p], true);
        hechos++;
      }
    }
    r.sec.push(seq.name + ": " + hechos + " clips (" + ya + " ya tenian Lumetri)");
  }
  try {
    app.enableQE(); var q0 = qe.project.getActiveSequence(), p0 = principal.getPlayerPosition().ticks;
    principal.setPlayerPosition(String(Math.round(20.3 * T))); q0.exportFramePNG(q0.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/col-antes");
    for (var s = 0; s < app.project.sequences.numSequences; s++) if (app.project.sequences[s].name.indexOf("Secuencia anidada") === 0) tratar(app.project.sequences[s]);
    tratar(principal);
    app.project.openSequence(principal.sequenceID); app.enableQE(); var q1 = qe.project.getActiveSequence();
    principal.setPlayerPosition(String(Math.round(20.3 * T))); q1.exportFramePNG(q1.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/col-despues");
    principal.setPlayerPosition(String(Math.round(1.9 * T))); q1.exportFramePNG(q1.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/col-inicio");
    principal.setPlayerPosition(p0);
    app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); try { app.project.openSequence(principal.sequenceID); } catch (e2) {} }
  return JSON.stringify(r);
})();
