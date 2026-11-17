// CLIENTE-A_1010_01: pasa los subtítulos de 66 s en adelante a la plantilla v10 (glow en la palabra clave), copiando texto, controles, posición y duración.
// Paso 1 (este script): crea los nuevos en una pista vacía. Los antiguos se quitan después, cuando la cuenta coincide.
(function () { app.enableQE(); var seq = app.project.activeSequence, r = { errores: [], viejos: 0, nuevos: 0 }, i, k, t, T = 254016000000, MOGRT = "~/Videos-Remotion/clientes/_plantillas/Subtitulo ClienteA v10.mogrt";
  if (seq.name.indexOf("SONIDO v2") < 0) return "secuencia inesperada: " + seq.name;
  function seg(s) { var x = new Time(); x.seconds = s; return x; }
  function comp(c, mn) { for (var x = 0; x < c.components.numItems; x++) if (c.components[x].matchName === mn) return c.components[x]; return null; }
  var vSub = -1, mejor = 0, vNuevo = -1; for (t = 0; t < seq.videoTracks.numTracks; t++) { var n = 0, ocup = 0, tr = seq.videoTracks[t]; for (i = 0; i < tr.clips.numItems; i++) { if (tr.clips[i].end.seconds > 65 ) { ocup++; if (tr.clips[i].getMGTComponent()) n++; } } if (n > mejor) { mejor = n; vSub = t; } if (ocup === 0) vNuevo = t; }
  if (vSub < 0 || vNuevo < 0 || vNuevo <= vSub) return "sin pistas: subs " + vSub + " nueva " + vNuevo;
  var lista = [], trS = seq.videoTracks[vSub]; for (i = 0; i < trS.clips.numItems; i++) { var c = trS.clips[i], g = c.getMGTComponent(); if (!g || c.start.seconds < 65.9) continue; var d = { s: c.start.seconds, e: c.end.seconds, p: [], off: c.disabled };
    for (k = 0; k < g.properties.numItems; k++) { var pr = g.properties[k], nm = pr.displayName, o = { n: nm }; if (nm === "Linea" || nm === "Palabra clave") { o.t = "txt"; try { o.v = JSON.parse(pr.getValue()).textEditValue; } catch (x) { o.v = ""; } } else if (nm.indexOf("Color") === 0) { o.t = "col"; try { o.v = pr.getColorValue(); } catch (x) { o.t = "nada"; } } else { o.t = "val"; o.v = pr.getValue(); } d.p.push(o); }
    var m = comp(c, "AE.ADBE Motion"); d.pos = m.properties[0].getValue(); d.esc = m.properties[1].getValue(); lista.push(d); }
  r.viejos = lista.length; lista.sort(function (a, b) { return a.s - b.s; });
  for (i = 0; i < lista.length; i++) { var L = lista[i], nc = seq.importMGT(MOGRT, seg(L.s).ticks, vNuevo, 0); if (!nc) { r.errores.push("no importa " + L.s); continue; } nc.end = seg(L.e); nc.outPoint = seg(nc.inPoint.seconds + (L.e - L.s)); var g2 = nc.getMGTComponent(), clave = "";
    for (k = 0; k < L.p.length; k++) { var o2 = L.p[k], dest = null; for (var y = 0; y < g2.properties.numItems; y++) if (g2.properties[y].displayName === o2.n) dest = g2.properties[y]; if (!dest) continue;
      try { if (o2.t === "txt") { var j = JSON.parse(dest.getValue()); j.textEditValue = o2.v; dest.setValue(JSON.stringify(j), true); if (o2.n === "Palabra clave") clave = o2.v; } else if (o2.t === "col") dest.setColorValue(o2.v[0], o2.v[1], o2.v[2], o2.v[3], true); else if (o2.t === "val") dest.setValue(o2.v, true); } catch (x) { r.errores.push(o2.n + " " + L.s.toFixed(2)); } }
    var m2 = comp(nc, "AE.ADBE Motion"); m2.properties[0].setValue(L.pos, true); m2.properties[1].setValue(L.esc, true); if (L.off) nc.disabled = true; r.nuevos++; }
  r.pistas = seq.videoTracks[vSub].name + " -> " + seq.videoTracks[vNuevo].name;
  var q = qe.project.getActiveSequence(), ts = [73.2, 79.3, 85.3, 104.9, 111.4, 115.3]; for (i = 0; i < ts.length; i++) { seq.setPlayerPosition(String(Math.round(ts[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/v7-" + i); }
  return JSON.stringify(r); })();
