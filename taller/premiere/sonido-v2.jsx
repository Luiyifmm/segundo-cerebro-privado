// Prueba de sonido sobre una COPIA de la secuencia de AMIN_1009_01 (la original no se toca):
// menos clics, obturadores en capas con panorama, whoosh/golpe en capas y riser + impacto en el cambio de sección.
(function () {
  var PROY = "/Users/luiyi/Documents/Adobe/Premiere Pro/26.0/AMIN EDICION.prproj", DIR = "/Users/luiyi/Videos-Remotion/clientes/amin/AMIN_1009_01/sfx/";
  var r = { errores: [], antes: app.project.path }, i, t, k;
  try {
    if (app.project.path !== PROY) app.openDocument(PROY, true, true, true);
    if (app.project.path !== PROY) return JSON.stringify({ error: "no pude abrir el proyecto de Amin", abierto: app.project.path });
    var orig = null, ya = null;
    for (i = 0; i < app.project.sequences.numSequences; i++) { var sn = app.project.sequences[i].name; if (sn === "AMIN_1009_01 - corte 3") orig = app.project.sequences[i]; if (sn === "AMIN_1009_01 - SONIDO v2") ya = app.project.sequences[i]; }
    if (ya) return JSON.stringify({ error: "ya existe la secuencia SONIDO v2" });
    if (!orig) return JSON.stringify({ error: "no encuentro la secuencia original" });
    var ids = {}; for (i = 0; i < app.project.sequences.numSequences; i++) ids[app.project.sequences[i].sequenceID] = 1;
    orig.clone(); var seq = null;
    for (i = 0; i < app.project.sequences.numSequences; i++) if (!ids[app.project.sequences[i].sequenceID]) seq = app.project.sequences[i];
    seq.name = "AMIN_1009_01 - SONIDO v2"; app.project.openSequence(seq.sequenceID);
    function pista(nombre) { for (var a = 0; a < seq.audioTracks.numTracks; a++) if (seq.audioTracks[a].name === nombre) return a; return -1; }
    var aImg = pista("SFX IMAGENES"), aClic = pista("SFX CLICS"), aMot = pista("SFX MOTION"), aIco = pista("SFX ICONOS");
    if (aImg < 0 || aClic < 0 || aMot < 0 || aIco < 0) return JSON.stringify({ error: "faltan pistas de efectos", p: [aImg, aClic, aMot, aIco] });
    app.enableQE(); var q = qe.project.getActiveSequence(), n0 = seq.audioTracks.numTracks;
    q.addTracks(0, 0, 1, 1, n0); var aCap = seq.audioTracks.numTracks - 1;
    if (seq.audioTracks.numTracks !== n0 + 1 || seq.audioTracks[aCap].clips.numItems) return JSON.stringify({ error: "no pude crear la pista SFX CAPAS" });
    try { seq.audioTracks[aCap].name = "SFX CAPAS"; } catch (e0) {}
    // sonidos procesados
    var bin = app.project.rootItem.createBin("SFX PROCESADOS AMIN_1009_01");
    app.project.importFiles([DIR + "obturador izquierda.wav", DIR + "obturador derecha.wav", DIR + "whoosh en capas.wav", DIR + "golpe en capas.wav", DIR + "impacto en capas.wav"], true, bin, false);
    function item(nombre, donde) { for (var c = 0; c < donde.children.numItems; c++) { var ch = donde.children[c]; if (ch.type === 2) { var x = item(nombre, ch); if (x) return x; } else if (ch.name === nombre) return ch; } return null; }
    var raizSfx = null; for (i = 0; i < app.project.rootItem.children.numItems; i++) if (app.project.rootItem.children[i].name === "EFECTOS DE SONIDO") raizSfx = app.project.rootItem.children[i];
    var I = { izq: item("obturador izquierda.wav", bin), der: item("obturador derecha.wav", bin), whoosh: item("whoosh en capas.wav", bin), golpe: item("golpe en capas.wav", bin), impacto: item("impacto en capas.wav", bin), riser: item("riseer 1.MP3", raizSfx) };
    for (k in I) if (!I[k]) r.errores.push("falta " + k);
    if (r.errores.length) return JSON.stringify(r);
    function db(x) { return Math.pow(10, (x - 15) / 20); }
    function poner(p, it, seg, nivel) { if (seg < 0) seg = 0; var tr = seq.audioTracks[p]; tr.overwriteClip(it, seg); for (var n = 0; n < tr.clips.numItems; n++) if (Math.abs(tr.clips[n].start.seconds - seg) < 0.02) { var c = tr.clips[n]; for (var m = 0; m < c.components.numItems; m++) if (c.components[m].displayName === "Volumen") c.components[m].properties[1].setValue(db(nivel), true); return c; } r.errores.push("no quedo " + it.name + " a " + seg.toFixed(2)); return null; }
    // datos de vídeo: imágenes (lado), subtítulos con palabra clave, motion graphic
    var imgs = [], claves = [], mgA = -1;
    for (t = 0; t < seq.videoTracks.numTracks; t++) for (i = 0; i < seq.videoTracks[t].clips.numItems; i++) { var v = seq.videoTracks[t].clips[i];
      if (/\.(png|jpe?g|webp)$/i.test(v.name)) { var px = 0.5; for (k = 0; k < v.components.numItems; k++) if (v.components[k].matchName === "AE.ADBE Motion") px = v.components[k].properties[0].getValue()[0]; imgs.push({ a: v.start.seconds, x: px }); }
      if (v.name.indexOf("MG eliminar") === 0) mgA = v.start.seconds;
      var g = v.getMGTComponent(); if (g) { var kw = JSON.parse(g.properties.getParamForDisplayName("Palabra clave").getValue()).textEditValue; if (kw) claves.push({ a: v.start.seconds, k: kw }); } }
    imgs.sort(function (a, b) { return a.a - b.a; }); claves.sort(function (a, b) { return a.a - b.a; });
    // 1. obturadores: en capas y con panorama según el lado de la imagen
    var trI = seq.audioTracks[aImg]; for (i = trI.clips.numItems - 1; i >= 0; i--) trI.clips[i].remove(false, false);
    var nIzq = 0, nDer = 0, ult = -9;
    for (i = 0; i < imgs.length; i++) { if (imgs[i].a - ult < 0.4) continue; ult = imgs[i].a; var izq = imgs[i].x < 0.5; if (poner(aImg, izq ? I.izq : I.der, imgs[i].a - 0.1, 6)) { if (izq) nIzq++; else nDer++; } }
    r.obturadores = nIzq + " a la izquierda, " + nDer + " a la derecha";
    // 2. clics: solo en las palabras que importan
    var IMPORTA = { riqueza: 1, piensas: 1, exitosa: 1, eliminar: 1, "aquí": 1 }, guardar = [], primeraMental = true, ultAbund = -1;
    for (i = 0; i < claves.length; i++) { var c2 = claves[i]; if (IMPORTA[c2.k]) guardar.push(c2.a); if (c2.k === "mental" && primeraMental) { guardar.push(c2.a); primeraMental = false; } if (c2.k === "abundancia") ultAbund = c2.a; }
    if (ultAbund >= 0) guardar.push(ultAbund);
    var trC = seq.audioTracks[aClic], quitados = 0;
    for (i = trC.clips.numItems - 1; i >= 0; i--) { var s0 = trC.clips[i].start.seconds, vale = false; for (k = 0; k < guardar.length; k++) if (Math.abs(s0 - guardar[k]) < 0.25) vale = true; if (!vale) { trC.clips[i].remove(false, false); quitados++; } }
    r.clics = "quedan " + trC.clips.numItems + ", quitados " + quitados;
    // 3. motion graphic: whoosh y golpe en capas (se quitan los de una sola capa)
    if (mgA >= 0) {
      var trIc = seq.audioTracks[aIco], trM = seq.audioTracks[aMot];
      for (i = trIc.clips.numItems - 1; i >= 0; i--) if (trIc.clips[i].name.indexOf("VS_Short Whoosh") === 0 && trIc.clips[i].start.seconds > 5) trIc.clips[i].remove(false, false);
      for (i = trM.clips.numItems - 1; i >= 0; i--) if (trM.clips[i].name.indexOf("Sub Bass Hit") === 0) trM.clips[i].remove(false, false);
      poner(aCap, I.golpe, mgA + 4.2 - 0.014, -12);
      poner(aCap, I.whoosh, mgA - 0.74, -9);
    }
    // 4. cambio de sección ("la riqueza..."): riser que rompe en un impacto
    var tR = -1; for (i = 0; i < claves.length; i++) if (claves[i].k === "riqueza") tR = claves[i].a;
    if (tR > 3) {
      var libre = true, trM2 = seq.audioTracks[aMot]; for (i = 0; i < trM2.clips.numItems; i++) if (trM2.clips[i].start.seconds < tR + 0.2 && trM2.clips[i].end.seconds > tR - 1.8) libre = false;
      if (libre) poner(aMot, I.riser, tR - 1.787, -6); else r.errores.push("sin hueco para el riser del cambio de seccion");
      poner(aCap, I.impacto, tR - 0.32, -10);
      r.cambio = "riser " + (tR - 1.787).toFixed(2) + " -> impacto " + tR.toFixed(2);
    }
    r.pistas = []; for (t = 0; t < seq.audioTracks.numTracks; t++) r.pistas.push("A" + (t + 1) + " " + seq.audioTracks[t].name + ":" + seq.audioTracks[t].clips.numItems);
    r.capas = []; for (i = 0; i < seq.audioTracks[aCap].clips.numItems; i++) r.capas.push(seq.audioTracks[aCap].clips[i].name + " " + seq.audioTracks[aCap].clips[i].start.seconds.toFixed(2) + "-" + seq.audioTracks[aCap].clips[i].end.seconds.toFixed(2));
    r.original = orig.name + " audio " + orig.audioTracks.numTracks + " pistas";
    app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r);
})();
