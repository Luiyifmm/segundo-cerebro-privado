// ERIC_1009_01: animación de las imágenes (entran desde abajo, se quedan en el centro y suben a su lado), whoosh profundo,
// gráfico del caramelo nuevo con sonido de contador, corrección de color y audio mejorado (voz y música reenlazadas).
(function () {
  var PLAN = [{"s": 0, "e": 3.733, "n": "pngwing.com-2.png", "tm": 0.867, "lado": "der", "origen": "marcador de clip"}, {"s": 3.8, "e": 7.9, "n": "Copia de pngwing.com-2.png", "tm": 5.133, "lado": "der", "origen": "marcador de clip"}, {"s": 7.9, "e": 12.367, "n": "pngwing.com-3.png", "tm": 10.1, "lado": "der", "origen": "marcador de clip"}, {"s": 12.367, "e": 17.133, "n": "\u2014Pngtree\u2014a glass of chocolat", "tm": 13.7, "lado": "izq", "origen": "marcador"}, {"s": 17.133, "e": 22.367, "n": "pngwing.com-4.png", "tm": 19.6, "lado": "izq", "origen": "marcador"}, {"s": 22.367, "e": 26.333, "n": "pngwing.com-5.png", "tm": 24.367, "lado": "izq", "origen": "marcador"}, {"s": 26.333, "e": 30.467, "n": "\u2014Pngtree\u2014healthy greek yogur", "tm": 28.3, "lado": "der", "origen": "marcador de clip"}, {"s": 30.467, "e": 34.667, "n": "pngwing.com-6.png", "tm": 32.034, "lado": "der", "origen": "marcador de clip"}, {"s": 34.667, "e": 39.433, "n": "pngwing.com-7.png", "tm": 36.803, "lado": "izq", "origen": "inferido"}, {"s": 39.433, "e": 43.533, "n": "pngwing.com-8.png", "tm": 41.337, "lado": "der", "origen": "inferido"}, {"s": 43.533, "e": 47.933, "n": "pngwing.com-9.png", "tm": 44.833, "lado": "izq", "origen": "marcador"}];
  var D = "/Users/luiyi/Videos-Remotion/clientes/eric/ERIC_1009_01/", seq = app.project.activeSequence, r = { errores: [] }, i, k, t, T = 254016000000;
  try {
    if (seq.name !== "ERIC_1009_01 - v2 audio solapado") return JSON.stringify({ error: seq.name });
    function seg(x) { var tm = new Time(); tm.seconds = x; return tm; }
    function pV(n) { for (var x = 0; x < seq.videoTracks.numTracks; x++) if (seq.videoTracks[x].name === n) return x; return -1; }
    function pA(n) { for (var x = 0; x < seq.audioTracks.numTracks; x++) if (seq.audioTracks[x].name === n) return x; return -1; }
    function buscar(bin, nombre) { for (var b = 0; b < bin.children.numItems; b++) { var ch = bin.children[b]; if (ch.type === 2) { var x = buscar(ch, nombre); if (x) return x; } else if (ch.name === nombre) return ch; } return null; }
    function bandeja(nombre) { var raiz = app.project.rootItem; for (var b = 0; b < raiz.children.numItems; b++) if (raiz.children[b].name === nombre && raiz.children[b].type === 2) return raiz.children[b]; return raiz.createBin(nombre); }
    function db(x) { return Math.pow(10, (x - 15) / 20); }
    function nivel(c, d) { for (var m = 0; m < c.components.numItems; m++) if (c.components[m].displayName === "Volumen") c.components[m].properties[1].setValue(db(d), true); }
    var vImg = pV("Vídeo 5"); if (vImg < 0) return JSON.stringify({ error: "no encuentro la pista de imagenes (Vídeo 5)" });
    var trI = seq.videoTracks[vImg];
    // 1. imágenes
    var hechas = 0, ya = 0;
    for (i = 0; i < PLAN.length; i++) { var p = PLAN[i], c = null; for (k = 0; k < trI.clips.numItems; k++) if (Math.abs(trI.clips[k].start.seconds - p.s) < 0.03) c = trI.clips[k];
      if (!c || !p.tm) { r.errores.push("imagen " + p.n + " no esta o no tiene momento"); continue; }
      var mo = null; for (k = 0; k < c.components.numItems; k++) if (c.components[k].matchName === "AE.ADBE Motion") mo = c.components[k].properties; if (!mo) continue;
      var pos = mo[0], esc = mo[1]; if (pos.isTimeVarying()) { ya++; continue; }
      var P0 = pos.getValue(), S0 = esc.getValue(), base = c.inPoint.seconds - p.s, tm = Math.max(p.tm, p.s + 0.45), fin = [p.lado === "der" ? 0.80 : 0.20, 0.265];
      var kp = [[p.s, [P0[0], 1.28]], [p.s + 0.3, P0], [tm, P0], [tm + 0.4, fin]], ks = [[tm, S0], [tm + 0.4, S0 * 0.55]];
      pos.setTimeVarying(true); for (k = 0; k < kp.length; k++) { pos.addKey(base + kp[k][0]); pos.setValueAtKey(base + kp[k][0], kp[k][1], true); try { pos.setInterpolationTypeAtKey(base + kp[k][0], 5, true); } catch (e1) {} }
      esc.setTimeVarying(true); for (k = 0; k < ks.length; k++) { esc.addKey(base + ks[k][0]); esc.setValueAtKey(base + ks[k][0], ks[k][1], true); try { esc.setInterpolationTypeAtKey(base + ks[k][0], 5, true); } catch (e2) {} }
      p.tmReal = tm; hechas++; }
    r.imagenes = hechas + " animadas" + (ya ? ", " + ya + " ya tenian fotogramas clave" : "");
    // 2. whoosh profundo en cada subida, hacia el lado al que va la imagen
    var aW = pA("SFX WHOOSH"); if (aW < 0) { aW = pA("Audio 10"); if (aW >= 0 && seq.audioTracks[aW].clips.numItems === 0) { try { seq.audioTracks[aW].name = "SFX WHOOSH"; } catch (e3) {} } else { app.enableQE(); var n0 = seq.audioTracks.numTracks; qe.project.getActiveSequence().addTracks(0, 0, 1, 1, n0); aW = seq.audioTracks.numTracks - 1; try { seq.audioTracks[aW].name = "SFX WHOOSH"; } catch (e4) {} } }
    var binS = bandeja("SFX PROCESADOS ERIC_1009_01"); app.project.importFiles([D + "audio/whoosh profundo izquierda.wav", D + "audio/whoosh profundo derecha.wav", D + "audio/contador digital.wav"], true, binS, false);
    var wi = buscar(binS, "whoosh profundo izquierda.wav"), wd = buscar(binS, "whoosh profundo derecha.wav"), cont = buscar(binS, "contador digital.wav"), nw = 0;
    if (seq.audioTracks[aW].clips.numItems === 0 && wi && wd) for (i = PLAN.length - 1; i >= 0; i--) { if (!PLAN[i].tmReal) continue; var s0 = PLAN[i].tmReal - 0.31, trW = seq.audioTracks[aW]; trW.overwriteClip(PLAN[i].lado === "der" ? wd : wi, s0); for (k = 0; k < trW.clips.numItems; k++) if (Math.abs(trW.clips[k].start.seconds - s0) < 0.02) { nivel(trW.clips[k], -6); nw++; } }
    r.whoosh = nw + " en " + seq.audioTracks[aW].name;
    // 3. gráfico del caramelo
    var viejo = null; for (k = 0; k < trI.clips.numItems; k++) if (trI.clips[k].name.indexOf("MG azucar no llena") === 0) viejo = trI.clips[k];
    if (viejo) { var a = viejo.start.seconds, b = viejo.end.seconds; viejo.remove(false, false); var binM = bandeja("MOTION GRAPHICS ERIC_1009_01"); app.project.importFiles([D + "motion/MG azucar no alimenta.mov"], true, binM, false); var nuevo = buscar(binM, "MG azucar no alimenta.mov");
      trI.overwriteClip(nuevo, a); for (k = 0; k < trI.clips.numItems; k++) if (Math.abs(trI.clips[k].start.seconds - a) < 0.02 && trI.clips[k].end.seconds > b + 0.01) { trI.clips[k].end = seg(b); trI.clips[k].outPoint = seg(b - a); }
      var aM = pA("SFX MOTION"); if (aM >= 0 && cont) { var trM = seq.audioTracks[aM]; for (k = trM.clips.numItems - 1; k >= 0; k--) if (trM.clips[k].name.indexOf("Swoosh") === 0 && trM.clips[k].start.seconds > a + 0.9 && trM.clips[k].start.seconds < a + 1.7) trM.clips[k].remove(false, false);
        var libre = true; for (k = 0; k < trM.clips.numItems; k++) if (trM.clips[k].start.seconds < a + 1.7 && trM.clips[k].end.seconds > a + 1.18) libre = false;
        if (libre) { trM.overwriteClip(cont, a + 1.18); for (k = 0; k < trM.clips.numItems; k++) if (Math.abs(trM.clips[k].start.seconds - (a + 1.18)) < 0.02) nivel(trM.clips[k], -3); r.contador = (a + 1.18).toFixed(2); } else r.errores.push("sin hueco para el contador"); }
      r.caramelo = a.toFixed(2) + "-" + b.toFixed(2); } else r.errores.push("no encuentro el clip MG azucar no llena");
    // 4. color: mismos valores en el fondo (V1) y en la secuencia anidada
    app.enableQE(); var q = qe.project.getActiveSequence(), fx = qe.project.getVideoEffectByName("Color de Lumetri"), VAL = { 14: 4, 20: 10, 21: -15, 22: 5, 23: 4, 24: -6, 16: 106, 42: 8 }, nc = 0;
    function lum(c2) { for (var m = 0; m < c2.components.numItems; m++) if (c2.components[m].matchName.indexOf("Lumetri") >= 0) return c2.components[m]; return null; }
    function gradar(ti) { var tr = seq.videoTracks[ti], qt = q.getVideoTrackAt(ti); for (var n = 0; n < tr.clips.numItems; n++) { var c3 = tr.clips[n]; if (!lum(c3)) { for (var m = 0; m < qt.numItems; m++) { var it = qt.getItemAt(m); if (it && it.type === "Clip" && Math.abs(it.start.secs - c3.start.seconds) < 0.02) { it.addVideoEffect(fx); break; } } } var L = lum(tr.clips[n]); if (!L) { r.errores.push("sin Lumetri en V" + (ti + 1) + " " + c3.start.seconds.toFixed(1)); continue; } for (var pp in VAL) L.properties[+pp].setValue(VAL[pp], true); nc++; } }
    gradar(0); var vN = -1; for (i = 0; i < seq.videoTracks.numTracks; i++) if (seq.videoTracks[i].clips.numItems === 1 && seq.videoTracks[i].clips[0].name.indexOf("Secuencia anidada") === 0) vN = i; if (vN >= 0) gradar(vN); else r.errores.push("no encuentro la secuencia anidada");
    r.color = nc + " clips";
    // 5. audio: voz mejorada y música con hueco para la voz (reenlace: no se mueve ningún clip)
    var vz = null, mu = null; for (t = 0; t < seq.audioTracks.numTracks; t++) for (i = 0; i < seq.audioTracks[t].clips.numItems; i++) { var ca = seq.audioTracks[t].clips[i]; if (ca.name === "IMG_1114 voz centrada.wav") vz = ca.projectItem; if (ca.name.indexOf("The Game") === 0) mu = ca.projectItem; }
    if (vz) r.voz = vz.changeMediaPath(D + "audio/IMG_1114 voz mejorada.wav", true); else r.errores.push("no encuentro la voz centrada");
    if (mu) r.musica = mu.changeMediaPath(D + "audio/musica con hueco para la voz.wav", true); else r.errores.push("no encuentro la musica");
    r.rutaVoz = vz ? vz.getMediaPath().split("/").pop() : ""; r.rutaMus = mu ? mu.getMediaPath().split("/").pop() : "";
    var p0 = seq.getPlayerPosition().ticks, ts = [0.12, 0.6, 1.05, 1.3, 3.2, 14.0, 20.5, 37.1, 45.5, 53.9];
    for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/p4f-" + i); }
    seq.setPlayerPosition(p0); app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r);
})();
