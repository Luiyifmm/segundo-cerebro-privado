// mapa_proyecto.jsx — REGLA DEL USUARIO: que el humano sepa dónde está todo para cambiarlo fácil.
// Escribe "MAPA DEL PROYECTO.md" junto al .aep (solo lee el proyecto; no cambia nada en AE):
//   · qué comps hay, cuál es la final (la que no usa ninguna otra), tamaño, fps, duración y motor 3D;
//   · DÓNDE ESTÁ CADA TEXTO (comp → capa → lo que dice → fuente y tamaño) y cómo cambiarlo;
//   · cada imagen, vídeo, audio o textura (con su ruta) y en qué comps se usa → "Reemplazar metraje";
//   · las capas CONTROL (nulos con deslizadores/colores) y sus valores;
//   · las propiedades expuestas en Gráficos esenciales (si las hay) y los marcadores de cada comp.
// Uso (ae_run_script):  $.global.MAPA = {salida: ""};  return $.evalFile(new File("<skill>/scripts/mapa_proyecto.jsx"));
//   (salida vacía = junto al .aep; el proyecto tiene que estar guardado)
(function () {
  var P = $.global.MAPA || {};
  if (!app.project.file && !P.salida) return {error: "guarda el proyecto antes (el mapa va junto al .aep)"};
  var ruta = P.salida || (app.project.file.parent.fsName + "/MAPA DEL PROYECTO.md");
  var i, j, k, L = [], comps = [], usadaEn = {};
  function seg(t) { return (Math.round(t * 100) / 100).toString().replace(".", ","); }
  function carpeta(it) { var r = [], f = it.parentFolder, n = 0; while (f && f !== app.project.rootFolder && n++ < 20) { r.unshift(f.name); f = f.parentFolder; } return r.length ? r.join(" / ") : "(raíz)"; }
  for (i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem) comps.push(it); }
  // quién usa a quién
  for (i = 0; i < comps.length; i++) for (j = 1; j <= comps[i].numLayers; j++) {
    var ly = comps[i].layer(j); var src = null; try { src = ly.source; } catch (e0) {}
    if (src) { var id = src.id; if (!usadaEn[id]) usadaEn[id] = []; usadaEn[id].push(comps[i].name + " → capa «" + ly.name + "»"); }
  }
  L.push("# MAPA DEL PROYECTO");
  L.push("");
  L.push("- Proyecto: `" + (app.project.file ? app.project.file.fsName : "(sin guardar)") + "`");
  L.push("- Generado: " + new Date().toLocaleString() + " · After Effects " + app.version);
  var finales = [];
  for (i = 0; i < comps.length; i++) if (!usadaEn[comps[i].id] && !/^PRUEBA|__/i.test(comps[i].name)) finales.push(comps[i].name);
  L.push("- **Comps finales** (no las usa ninguna otra; son las que se renderizan): " + (finales.length ? "«" + finales.join("», «") + "»" : "ninguna"));
  L.push("");
  L.push("## Cómo cambiar las cosas");
  L.push("- **Un texto:** abre la comp que se indica, doble clic en la capa de texto y escribe. Si está dentro de una precomp y aparece en «Propiedades esenciales», se cambia desde la comp de arriba sin entrar.");
  L.push("- **Una imagen, vídeo o textura:** en el panel Proyecto, clic derecho sobre el archivo → *Reemplazar metraje* → *Archivo…*. Cambia en todas las capas que lo usan.");
  L.push("- **Colores, tamaños o tiempos generales:** la capa CONTROL de cada comp (arriba del todo), en *Controles de efectos*.");
  L.push("");
  // textos
  L.push("## Textos (dónde está cada uno)");
  L.push("| Comp | Capa | Dice | Fuente · tamaño | Tramo (s) |");
  L.push("|---|---|---|---|---|");
  var nTextos = 0;
  for (i = 0; i < comps.length; i++) for (j = 1; j <= comps[i].numLayers; j++) {
    var t = comps[i].layer(j);
    if (!(t instanceof TextLayer)) continue;
    var d = null; try { d = t.property("ADBE Text Properties").property("ADBE Text Document").value; } catch (e1) {}
    if (!d) continue;
    var s = String(d.text).replace(/[\r\n]+/g, " / "); if (s.length > 70) s = s.substr(0, 67) + "…";
    var tieneExpr = false; try { tieneExpr = t.property("ADBE Text Properties").property("ADBE Text Document").expression !== ""; } catch (e2) {}
    L.push("| " + comps[i].name + " | " + t.name + " | " + s.replace(/\|/g, "/") + (tieneExpr ? " *(lo calcula una expresión)*" : "") + " | " + d.font + " · " + Math.round(d.fontSize) + " | " + seg(t.inPoint) + "–" + seg(t.outPoint) + " |");
    nTextos++;
  }
  if (!nTextos) L.push("| — | — | (no hay capas de texto) | — | — |");
  L.push("");
  // medios
  L.push("## Imágenes, vídeos, audio y texturas");
  L.push("| Elemento | Carpeta del proyecto | Archivo | Se usa en |");
  L.push("|---|---|---|---|");
  var nMedios = 0;
  for (i = 1; i <= app.project.numItems; i++) {
    var f = app.project.item(i);
    if (!(f instanceof FootageItem)) continue;
    var archivo = "(sólido o color)";
    try { if (f.file) archivo = "`" + f.file.fsName + "`" + (f.footageMissing ? " ⚠️ FALTA" : ""); } catch (e3) {}
    if (archivo === "(sólido o color)") continue;
    L.push("| " + f.name + " | " + carpeta(f) + " | " + archivo + " | " + (usadaEn[f.id] ? usadaEn[f.id].join("; ") : "*(no se usa)*") + " |");
    nMedios++;
  }
  if (!nMedios) L.push("| — | — | (no hay archivos importados) | — |");
  L.push("");
  // controles
  L.push("## Capas CONTROL y deslizadores");
  var nCtrl = 0;
  for (i = 0; i < comps.length; i++) for (j = 1; j <= comps[i].numLayers; j++) {
    var c = comps[i].layer(j), fxs = null; try { fxs = c.property("ADBE Effect Parade"); } catch (e4) {}
    if (!fxs || !fxs.numProperties) continue;
    var lineas = [];
    for (k = 1; k <= fxs.numProperties; k++) {
      var e = fxs.property(k);
      if (!/Slider Control|Color Control|Angle Control|Checkbox Control|Point Control|Point3D Control|Dropdown Control|Layer Control/.test(e.matchName)) continue;
      var v = ""; try { v = String(e.property(1).value); } catch (e5) {}
      lineas.push("  - «" + e.name + "» = " + v);
    }
    if (lineas.length) { L.push("- **" + comps[i].name + " → " + c.name + "**"); L = L.concat(lineas); nCtrl++; }
  }
  if (!nCtrl) L.push("- (no hay controles de expresión)");
  L.push("");
  // comps
  L.push("## Comps");
  for (i = 0; i < comps.length; i++) {
    var cp = comps[i];
    var mot = ""; try { mot = cp.renderer; } catch (e6) {}
    var nombreMot = (mot === "ADBE Advanced 3d") ? "Classic 3D" : (mot === "ADBE Calder" ? "Advanced 3D" : (mot === "ADBE Ernst" ? "Cinema 4D" : mot));
    L.push("### " + cp.name);
    L.push("- " + cp.width + "×" + cp.height + " · " + Math.round(cp.frameRate * 100) / 100 + " fps · " + seg(cp.duration) + " s · motor " + nombreMot + " · carpeta: " + carpeta(cp) + " · " + cp.numLayers + " capas");
    if (usadaEn[cp.id]) L.push("- Se usa dentro de: " + usadaEn[cp.id].join("; "));
    var mg = 0; try { mg = cp.motionGraphicsTemplateControllerCount; } catch (e7) {}
    if (mg) { var nm = []; for (k = 1; k <= mg; k++) { try { nm.push(cp.getMotionGraphicsTemplateControllerName(k)); } catch (e8) {} } L.push("- Gráficos esenciales (se editan desde fuera): " + nm.join(", ")); }
    var mk = cp.markerProperty, marcas = [];
    for (k = 1; k <= mk.numKeys && k <= 40; k++) marcas.push(seg(mk.keyTime(k)) + " s «" + mk.keyValue(k).comment + "»");
    if (marcas.length) L.push("- Marcadores: " + marcas.join(" · "));
    var capas = [];
    for (j = 1; j <= cp.numLayers && j <= 80; j++) {
      var y = cp.layer(j);
      // ⚠️ en ExtendScript, varios "? :" seguidos SIN paréntesis se evalúan mal (de izquierda a derecha): if/else
      var tipo = "capa";
      if (y instanceof TextLayer) tipo = "texto";
      else if (y instanceof CameraLayer) tipo = "cámara";
      else if (y instanceof LightLayer) tipo = "luz";
      else if (y instanceof ShapeLayer) tipo = "forma";
      else if (y.nullLayer) tipo = "nulo";
      else if (y.adjustmentLayer) tipo = "ajuste";
      else if (/ParametricMesh/.test(y.matchName)) tipo = "malla 3D";
      try {
        if (y.source instanceof CompItem) tipo = "precomp";
        else if (y.source && y.source.mainSource instanceof FileSource) tipo = "archivo";
        else if (tipo === "capa" && y.source && y.source.mainSource instanceof SolidSource) tipo = "sólido";
      } catch (e9) {}
      capas.push("  " + j + ". " + y.name + " *(" + tipo + (y.threeDLayer ? ", 3D" : "") + (y.enabled ? "" : ", oculta") + ")* " + seg(y.inPoint) + "–" + seg(y.outPoint) + " s");
    }
    if (capas.length) { L.push("- Capas:"); L = L.concat(capas); }
    if (cp.numLayers > 80) L.push("  … y " + (cp.numLayers - 80) + " más");
    L.push("");
  }
  var out = new File(ruta); out.encoding = "UTF-8"; out.open("w"); out.write(L.join("\n")); out.close();
  return {mapa: out.fsName, comps: comps.length, textos: nTextos, medios: nMedios, controles: nCtrl, finales: finales};
})();
