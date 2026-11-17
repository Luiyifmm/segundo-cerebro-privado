// Línea de tiempo de lote, paso 2 (uno por vídeo): coloca el bruto con los silencios quitados a partir de CFG.inicio y pone sus marcadores.
(function () { var CFG = __CFG__, r = { hecho: [], errores: [] }, i, k, T = 254016000000; if (app.project.name !== CFG.proyecto) return JSON.stringify({ error: "activa " + CFG.proyecto });
  var L = null; for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === CFG.linea) L = app.project.sequences[i]; if (!L) return JSON.stringify({ error: "sin línea" });
  app.project.openSequence(L.sequenceID); var vt = L.videoTracks[0];
  for (i = 0; i < vt.clips.numItems; i++) if (vt.clips[i].end.seconds > CFG.inicio - 0.5 && vt.clips[i].start.seconds < CFG.inicio + CFG.dur) return JSON.stringify({ error: "ese tramo de V1 ya está ocupado" });
  var root = app.project.rootItem, bin = null, items = {}; for (i = 0; i < root.children.numItems; i++) if (root.children[i].type === 2 && root.children[i].name === CFG.bin) bin = root.children[i]; if (!bin) return JSON.stringify({ error: "sin bandeja de brutos" });
  for (i = 0; i < bin.children.numItems; i++) { try { items[bin.children[i].getMediaPath()] = bin.children[i]; } catch (e) {} }
  var n = 0; for (i = 0; i < CFG.piezas.length; i++) { var p = CFG.piezas[i], it = items[p.f]; if (!it) { r.errores.push("sin bruto " + p.f.substr(-24)); continue; } try { it.setInPoint(p.a, 4); it.setOutPoint(p.b, 4); vt.overwriteClip(it, CFG.inicio + p.t); n++; } catch (e) { r.errores.push("pieza " + i + ": " + e); } }
  for (k in items) { try { items[k].clearInPoint(); items[k].clearOutPoint(); } catch (e) {} }
  r.hecho.push("piezas colocadas: " + n + " de " + CFG.piezas.length);
  // giro de los brutos que Premiere interpreta apaisados y tamaño de los que no llenan el cuadro
  var ng = 0; for (i = 0; i < vt.clips.numItems; i++) { var c = vt.clips[i]; if (c.start.seconds < CFG.inicio - 0.01 || c.start.seconds > CFG.inicio + CFG.dur + 1) continue; var mp = ""; try { mp = c.projectItem.getMediaPath(); } catch (e) {} var inf = CFG.info[mp]; if (!inf) continue; for (k = 0; k < c.components.numItems; k++) if (c.components[k].matchName === "AE.ADBE Motion") { var M = c.components[k]; if (inf[0] > inf[1]) { M.properties[4].setValue(90, true); M.properties[1].setValue(Math.max(L.frameSizeVertical / inf[0], L.frameSizeHorizontal / inf[1]) * 100, true); ng++; } else { var e2 = Math.max(L.frameSizeHorizontal / inf[0], L.frameSizeVertical / inf[1]) * 100; if (Math.abs(e2 - 100) > 1) M.properties[1].setValue(e2, true); } } }
  if (ng) r.hecho.push("clips girados: " + ng);
  var nm = 0; function marca(t, nombre, com, col) { try { var mk = L.markers.createMarker(t); mk.name = nombre; mk.comments = com || ""; try { mk.setColorByIndex(col); } catch (e) {} nm++; } catch (e) { r.errores.push("marcador: " + e); } }
  marca(CFG.inicio, "▶ VÍDEO " + CFG.num + " · " + CFG.titulo, CFG.resumen, 5);
  for (i = 0; i < CFG.marcadores.length; i++) { var m = CFG.marcadores[i]; marca(CFG.inicio + Math.max(0.2, m.t), m.n, m.c, m.col); }
  r.hecho.push("marcadores: " + nm); r.fin = L.end / T;
  try { app.project.save(); r.hecho.push("guardado"); } catch (e) {} return JSON.stringify(r); })();
