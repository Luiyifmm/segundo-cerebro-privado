// Añade un reel cortado a un proyecto de lote: importa el corte en su bandeja, pone subtítulos sencillos y editables (plantilla del cliente),
// un marcador por frase y enlaza los proxies. Los ajustes de la plantilla son los del vídeo de ejemplo del usuario.
(function () { app.enableQE(); var CFG = __CFG__, r = { hecho: [], errores: [] }, i, k, T = 254016000000, pr = null;
  for (i = 0; i < app.projects.numProjects; i++) if (app.projects[i].name === CFG.proyecto) pr = app.projects[i]; if (!pr) return JSON.stringify({ error: "proyecto cerrado: " + CFG.proyecto });
  if (app.project.name !== CFG.proyecto) { app.openDocument(CFG.ruta, true, true, true); if (app.project.name !== CFG.proyecto) return JSON.stringify({ error: "no puedo activar el proyecto" }); }
  function seg(s) { var x = new Time(); x.seconds = s; return x; }
  function sec(parte) { for (var x = 0; x < app.project.sequences.numSequences; x++) if (app.project.sequences[x].name.indexOf(parte) === 0) return app.project.sequences[x]; return null; }
  var root = app.project.rootItem, bin = null; for (i = 0; i < root.children.numItems; i++) if (root.children[i].type === 2 && root.children[i].name === CFG.bin) bin = root.children[i]; if (!bin) bin = root.createBin(CFG.bin);
  var s = sec(CFG.id + " · "); if (s) return JSON.stringify({ error: "ese reel ya está en el proyecto" });
  app.project.importFiles([CFG.xml], true, bin, false); s = sec(CFG.id + " - corte"); if (!s) return JSON.stringify({ error: "no aparece la secuencia del corte" });
  s.name = CFG.id + " · " + CFG.titulo; app.project.openSequence(s.sequenceID); r.hecho.push("secuencia: " + s.name + " (" + (s.end / T).toFixed(1) + " s)");
  // pista libre arriba para los subtítulos
  var q = qe.project.getActiveSequence(), n0 = s.videoTracks.numTracks; try { q.addTracks(1, n0, 0); } catch (e) { r.errores.push("addTracks: " + e); }
  var vt = s.videoTracks.numTracks - 1, tr = s.videoTracks[vt]; if (tr.clips.numItems > 0) return JSON.stringify({ error: "la pista superior no está libre", r: r });
  try { tr.name = "SUBTITULOS"; } catch (e) {}
  var A = CFG.ajustes, puestos = 0;
  for (i = 0; i < CFG.subs.length; i++) { var u = CFG.subs[i], clip = s.importMGT(CFG.plantilla, String(Math.round(u.a * T)), vt, 0); if (!clip) { r.errores.push("no entra sub " + i); continue; }
    clip.end = seg(u.fin); try { clip.outPoint = seg(clip.inPoint.seconds + (u.fin - u.a)); } catch (e) {}
    var P = clip.getMGTComponent().properties, linea = String(u.linea || ""), clave = String(u.clave || "");
    for (k = 0; k < P.numItems; k++) { var p = P[k], nm = p.displayName; try {
        if (nm === "Linea" || nm === "Palabra clave") { var tx = nm === "Linea" ? linea : clave, j = JSON.parse(p.getValue()); j.textEditValue = tx; j.fontTextRunLength = [tx.length]; p.setValue(JSON.stringify(j), true); }
        else if (nm === "Color clave") { var c = u.gris && CFG.colorGris ? CFG.colorGris : CFG.colorClave; p.setColorValue(255, c[0], c[1], c[2], true); }
        else if (nm === "Color linea") p.setColorValue(255, 255, 255, 255, true);
        else if (A.props[nm] !== undefined) p.setValue(A.props[nm], true);
        else if (nm.indexOf("Retraso") === 0) p.setValue(Math.max(0, Math.min(8, u.retraso || 2)), true);
      } catch (e) { r.errores.push(nm + ": " + e); } }
    for (k = 0; k < clip.components.numItems; k++) if (clip.components[k].matchName === "AE.ADBE Motion") clip.components[k].properties[0].setValue(clave ? A.posCon : A.posSin, true);
    clip.name = (linea + " " + clave).replace(/^\s+|\s+$/g, "").substr(0, 30); puestos++; }
  r.hecho.push("subtitulos: " + puestos + " de " + CFG.subs.length + " en pista " + (vt + 1));
  var COL = { gancho: 6, frase: 4, cta: 5 }, nm2 = 0; for (i = 0; i < CFG.marcadores.length; i++) { var m = CFG.marcadores[i]; try { var mk = s.markers.createMarker(m.t); mk.name = (m.tipo === "gancho" ? "GANCHO: " : m.tipo === "cta" ? "CTA: " : "") + m.nombre; mk.comments = ""; try { mk.setColorByIndex(COL[m.tipo] || 4); } catch (e2) {} nm2++; } catch (e) { r.errores.push("marcador: " + e); } }
  r.hecho.push("marcadores: " + nm2);
  var np = 0, sinp = 0; function rec(b) { for (var x = 0; x < b.children.numItems; x++) { var c2 = b.children[x]; if (c2.type === 2) { rec(c2); continue; } var mp = ""; try { mp = c2.getMediaPath(); } catch (e) {} var px = CFG.proxies[mp]; if (!px) continue; try { if (c2.hasProxy && c2.hasProxy()) { np++; continue; } if (c2.canProxy()) { c2.attachProxy(px, 0); np++; } else sinp++; } catch (e) { r.errores.push("proxy " + c2.name + ": " + e); } } } rec(bin);
  r.hecho.push("proxies enlazados: " + np + (sinp ? " (no admiten: " + sinp + ")" : ""));
  s.setPlayerPosition("0"); try { app.project.save(); r.hecho.push("guardado"); } catch (e) { r.errores.push("guardar: " + e); }
  return JSON.stringify(r); })();
