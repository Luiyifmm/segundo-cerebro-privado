// En la copia SONIDO v2: cambia la música por su versión con hueco de EQ para la voz, en el mismo sitio, con el mismo tramo y volumen.
(function () {
  var r = { errores: [] }, i, t, seq = null;
  try {
    for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === "CLIENTE-A_1009_01 - SONIDO v2") seq = app.project.sequences[i];
    if (!seq) return JSON.stringify({ error: "no encuentro SONIDO v2", abierto: app.project.name });
    var pista = -1, clip = null;
    for (t = 0; t < seq.audioTracks.numTracks; t++) for (i = 0; i < seq.audioTracks[t].clips.numItems; i++) if (seq.audioTracks[t].clips[i].name.indexOf("Runaway") >= 0) { pista = t; clip = seq.audioTracks[t].clips[i]; }
    if (!clip) return JSON.stringify({ error: "no encuentro el clip de musica" });
    var d = { a: clip.start.seconds, b: clip.end.seconds, inP: clip.inPoint.seconds, nivel: null, n: seq.audioTracks[pista].clips.numItems };
    for (i = 0; i < clip.components.numItems; i++) if (clip.components[i].displayName === "Volumen") d.nivel = clip.components[i].properties[1].getValue();
    r.antes = d;
    if (d.n !== 1) return JSON.stringify({ error: "la pista de musica tiene mas de un clip; no la toco", r: r });
    var bin = null; for (i = 0; i < app.project.rootItem.children.numItems; i++) if (app.project.rootItem.children[i].name === "SFX PROCESADOS CLIENTE-A_1009_01") bin = app.project.rootItem.children[i];
    app.project.importFiles(["~/Videos-Remotion/clientes/clientea/CLIENTE-A_1009_01/sfx/musica con hueco para la voz.wav"], true, bin, false);
    var it = null; for (i = 0; i < bin.children.numItems; i++) if (bin.children[i].name.indexOf("musica con hueco") === 0) it = bin.children[i];
    if (!it) return JSON.stringify({ error: "no se importo la musica procesada" });
    clip.remove(false, false);
    var tr = seq.audioTracks[pista]; tr.overwriteClip(it, d.a);
    var c = tr.clips[0], ip = new Time(); ip.seconds = d.inP; c.inPoint = ip;
    var e = new Time(); e.seconds = d.b; c.end = e; var o = new Time(); o.seconds = c.inPoint.seconds + (d.b - c.start.seconds); c.outPoint = o;
    if (d.nivel !== null) for (i = 0; i < c.components.numItems; i++) if (c.components[i].displayName === "Volumen") c.components[i].properties[1].setValue(d.nivel, true);
    r.despues = { a: c.start.seconds, b: c.end.seconds, inP: c.inPoint.seconds, outP: c.outPoint.seconds, nombre: c.name };
    r.fin = seq.end / 254016000000;
    app.project.save();
  } catch (err) { r.errores.push("EXCEPCION " + err + " linea " + err.line); }
  return JSON.stringify(r);
})();
