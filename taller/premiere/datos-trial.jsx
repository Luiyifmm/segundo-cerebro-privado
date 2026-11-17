(function () {
  var seq = null, r = { v1: [], img: [], pistas: [] }, i, t;
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name.indexOf("AMIN_1009_01 - corte") === 0) seq = app.project.sequences[i];
  if (!seq) return JSON.stringify({ error: "sin secuencia", abierto: app.project.name });
  for (t = 0; t < seq.videoTracks.numTracks; t++) { var tr = seq.videoTracks[t]; r.pistas.push("V" + (t + 1) + ":" + tr.clips.numItems);
    for (i = 0; i < tr.clips.numItems; i++) { var c = tr.clips[i], ruta = ""; try { ruta = c.projectItem.getMediaPath(); } catch (e) {}
      if (t === 0) r.v1.push([+c.start.seconds.toFixed(3), +c.end.seconds.toFixed(3), +c.inPoint.seconds.toFixed(3), +c.outPoint.seconds.toFixed(3)]);
      if (/\.(png|jpe?g|webp)$/i.test(c.name)) { var m = null, pos = null, esc = null; for (var k = 0; k < c.components.numItems; k++) if (c.components[k].matchName === "AE.ADBE Motion") { pos = c.components[k].properties[0].getValue(); esc = c.components[k].properties[1].getValue(); } r.img.push({ v: t + 1, a: +c.start.seconds.toFixed(2), b: +c.end.seconds.toFixed(2), ruta: ruta, pos: pos, esc: esc }); } } }
  r.fin = seq.end / 254016000000;
  return JSON.stringify(r);
})();
