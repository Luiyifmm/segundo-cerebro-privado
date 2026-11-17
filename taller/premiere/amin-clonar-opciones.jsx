(function () { var seq = app.project.activeSequence, r = { antes: [], despues: [] }, i;
  if (app.project.name !== "AMIN EDICION.prproj" || seq.name !== "AMIN_1009_01 - SONIDO v2") return "secuencia inesperada: " + seq.name;
  function ids() { var o = {}; for (var x = 0; x < app.project.sequences.numSequences; x++) o[app.project.sequences[x].sequenceID] = app.project.sequences[x]; return o; }
  var N = ["AMIN_1010_01 - A sin motion graphics", "AMIN_1010_01 - B motion graphics nuevos"];
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name === N[0] || app.project.sequences[i].name === N[1]) return "ya existen";
  for (i = 0; i < 2; i++) { var a = ids(); seq.clone(); var b = ids(), k, nueva = null; for (k in b) if (!a[k]) nueva = b[k]; if (!nueva) return "no encuentro el clon " + i; nueva.name = N[i]; r.despues.push([nueva.name, nueva.sequenceID, nueva.end / 254016000000]); }
  for (i = 0; i < app.project.sequences.numSequences; i++) r.antes.push(app.project.sequences[i].name);
  return JSON.stringify(r); })();
