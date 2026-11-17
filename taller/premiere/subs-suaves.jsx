// Cambia los subtítulos de V4 por la plantilla de animación suave, conservando texto, tiempos, colores, altura y tamaño de cada uno.
(function () {
  var MOGRT = "/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin suave.mogrt";
  var r = { errores: [] }, seq = null, i;
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name.indexOf("AMIN_1009_01 - corte") === 0) seq = app.project.sequences[i];
  if (!seq) return JSON.stringify({ error: "sin secuencia" });
  var pista = seq.videoTracks[3], datos = [];
  for (i = 0; i < pista.clips.numItems; i++) {
    var c = pista.clips[i], comp = c.getMGTComponent();
    if (!comp) { r.errores.push("clip " + i + " no es plantilla: " + c.name); continue; }
    var ps = comp.properties, d = { a: c.start.ticks, b: c.end.ticks, nombre: c.name };
    d.linea = JSON.parse(ps.getParamForDisplayName("Linea").getValue()).textEditValue;
    d.clave = JSON.parse(ps.getParamForDisplayName("Palabra clave").getValue()).textEditValue;
    try { d.cc = ps.getParamForDisplayName("Color clave").getColorValue(); d.cl = ps.getParamForDisplayName("Color linea").getColorValue(); } catch (e) { r.errores.push("color " + i + " " + e); }
    d.alt = ps.getParamForDisplayName("Altura").getValue(); d.tam = ps.getParamForDisplayName("Tamano").getValue();
    datos.push(d);
  }
  r.leidos = datos.length; r.ejemplo = datos.length ? datos[2].linea + " / " + datos[2].clave + " " + String(datos[2].cc) : "";
  if (r.errores.length || datos.length !== pista.clips.numItems) return JSON.stringify(r);
  for (i = pista.clips.numItems - 1; i >= 0; i--) pista.clips[i].remove(false, false);
  var puestos = 0;
  for (i = 0; i < datos.length; i++) {
    var x = datos[i], clip = seq.importMGT(MOGRT, x.a, 3, 0);
    if (!clip) { r.errores.push("no entra " + i); continue; }
    var fin = new Time(); fin.ticks = x.b; clip.end = fin; clip.name = x.nombre;
    var q = clip.getMGTComponent().properties;
    var pl = q.getParamForDisplayName("Linea"), pc = q.getParamForDisplayName("Palabra clave");
    var j = JSON.parse(pl.getValue()); j.textEditValue = x.linea; j.fontTextRunLength = [x.linea.length]; pl.setValue(JSON.stringify(j), true);
    var k = JSON.parse(pc.getValue()); k.textEditValue = x.clave; k.fontTextRunLength = [x.clave.length]; pc.setValue(JSON.stringify(k), true);
    if (x.cc) q.getParamForDisplayName("Color clave").setColorValue(x.cc[0], x.cc[1], x.cc[2], x.cc[3], true);
    if (x.cl) q.getParamForDisplayName("Color linea").setColorValue(x.cl[0], x.cl[1], x.cl[2], x.cl[3], true);
    q.getParamForDisplayName("Altura").setValue(x.alt, true); q.getParamForDisplayName("Tamano").setValue(x.tam, true);
    puestos++;
  }
  r.puestos = puestos; r.enPista = pista.clips.numItems;
  app.enableQE(); var qs = qe.project.getActiveSequence(), T = 254016000000, pos = seq.getPlayerPosition().ticks;
  var fr = [47, 49, 51, 53, 56];
  for (i = 0; i < fr.length; i++) { seq.setPlayerPosition(String(Math.round(fr[i] / 30 * T))); qs.exportFramePNG(qs.CTI.timecode, "/private/tmp/claude-501/-Users-luiyi/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/suave-" + i); }
  seq.setPlayerPosition(pos);
  app.project.save();
  return JSON.stringify(r);
})();
