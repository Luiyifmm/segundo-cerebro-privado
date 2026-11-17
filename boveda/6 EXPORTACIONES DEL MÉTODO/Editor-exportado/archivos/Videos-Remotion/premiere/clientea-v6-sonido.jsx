// CLIENTE-A_1010_01: voz nivelada (la original queda desactivada), música de fondo, camas de ambiente bajo los dos motion graphics y zoom lento antes del segundo.
(function () { var seq = app.project.activeSequence, r = { errores: [], hecho: [] }, i, k, D = "~/Videos-Remotion/clientes/clientea/CLIENTE-A_1010_01/";
  if (seq.name.indexOf("SONIDO v2") < 0) return "secuencia inesperada: " + seq.name;
  function seg(s) { var t = new Time(); t.seconds = s; return t; }
  function db(d) { return Math.pow(10, (d - 15) / 20); }
  function pista(nombre) { for (var x = 0; x < seq.audioTracks.numTracks; x++) if (seq.audioTracks[x].name === nombre) return seq.audioTracks[x]; return null; }
  function buscar(b, nombre) { for (var x = 0; x < b.children.numItems; x++) { var c = b.children[x]; if (c.type === 2) { var h = buscar(c, nombre); if (h) return h; } else if (c.name === nombre) return c; } return null; }
  function traer(ruta) { var n = ruta.substr(ruta.lastIndexOf("/") + 1), it = buscar(app.project.rootItem, n); if (it) return it; app.project.importFiles([ruta], true, app.project.getInsertionBin(), false); return buscar(app.project.rootItem, n); }
  function poner(nomPista, ruta, s, d) { var ta = pista(nomPista), it = traer(ruta); if (!ta || !it) { r.errores.push("falta " + nomPista + " / " + ruta); return; } var n = ruta.substr(ruta.lastIndexOf("/") + 1);
    for (var m = 0; m < ta.clips.numItems; m++) { var c0 = ta.clips[m]; if (c0.name === n && Math.abs(c0.start.seconds - s) < 0.05) { r.hecho.push("ya estaba " + n); return; } if (c0.start.seconds < s + 3 && c0.end.seconds > s && c0.start.seconds > 65) { r.errores.push("ocupado " + nomPista + " en " + s); return; } }
    ta.overwriteClip(it, s); for (m = 0; m < ta.clips.numItems; m++) if (Math.abs(ta.clips[m].start.seconds - s) < 0.02) for (var y = 0; y < ta.clips[m].components.numItems; y++) if (ta.clips[m].components[y].displayName === "Volumen") { ta.clips[m].components[y].properties[1].setValue(db(d), true); r.hecho.push(n + " en " + nomPista + " " + d + " dB"); } }
  poner("SFX ICONOS", D + "sfx/ambiente MG cadenas.wav", 109.3333, -6); poner("SFX ICONOS", D + "sfx/ambiente MG escuela.wav", 102.2, -6);
  poner("Audio 2", D + "audio/musica CLIENTE-A_1010_01.wav", 66, -17);
  poner("Audio 8", D + "audio/voz corte nivelada.wav", 66, 0);
  var vz = pista("VOZ 1010"), a8 = pista("Audio 8"), nueva = false; for (i = 0; a8 && i < a8.clips.numItems; i++) if (a8.clips[i].name === "voz corte nivelada.wav") nueva = true;
  if (nueva && vz) for (i = 0; i < vz.clips.numItems; i++) if (vz.clips[i].name === "voz corte.wav") { vz.clips[i].disabled = true; r.hecho.push("voz original desactivada"); }
  // zoom lento hacia el segundo motion graphic (105,57 a 109,33)
  var v1 = seq.videoTracks[0]; for (i = 0; i < v1.clips.numItems; i++) { var c = v1.clips[i]; if (c.start.seconds > 105 && c.start.seconds < 109.4 && c.end.seconds > 105.6) { for (k = 0; k < c.components.numItems; k++) if (c.components[k].matchName === "AE.ADBE Motion") { var p = c.components[k].properties[1], e0 = p.getValue(); if (p.isTimeVarying()) { r.hecho.push("zoom ya animado " + c.start.seconds.toFixed(2)); continue; } var t0 = c.inPoint, t1 = seg(c.inPoint.seconds + (c.end.seconds - c.start.seconds)); p.setTimeVarying(true); p.addKey(t0); p.setValueAtKey(t0, e0, true); p.addKey(t1); p.setValueAtKey(t1, e0 * 1.07, true); r.hecho.push("zoom lento " + c.start.seconds.toFixed(2) + "-" + c.end.seconds.toFixed(2) + " " + e0 + " a " + (e0 * 1.07).toFixed(1)); } } }
  return JSON.stringify(r); })();
