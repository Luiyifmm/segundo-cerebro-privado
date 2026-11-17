(function () { var r = {}, seq = app.project.activeSequence, t = new Time(); t.seconds = 60;
  var c = seq.importMGT("/Users/luiyi/Videos-Remotion/clientes/_plantillas/Subtitulo Amin v5.mogrt", t.ticks, 4, 0);
  if (!c) return JSON.stringify({ error: "no importa" });
  var ps = c.getMGTComponent().properties, p = ps.getParamForDisplayName("Tamano"), a = ps.getParamForDisplayName("Altura");
  p.setValue(180, true); a.setValue(-400, true); r.tam = p.getValue(); r.alt = a.getValue(); r.item = c.projectItem.name;
  c.remove(false, false); r.fin = seq.end / 254016000000; r.enPista = seq.videoTracks[4].clips.numItems;
  return JSON.stringify(r); })();
