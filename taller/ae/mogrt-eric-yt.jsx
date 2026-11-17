// Plantilla "Subtitulo Eric YT v1": subtítulo de frase completa para los vídeos de YouTube de Eric (16:9), copiando el estilo que puso el usuario
// (Sequel Sans Medium, minúsculas, verde #1CFF00, centrado abajo) con una sombra paralela suave. Controles: Texto, Color, Tamaño, Altura y sombra.
(function () {
  var DIR = "/Users/luiyi/Videos-Remotion/clientes/_plantillas", NOMBRE = "Subtitulo Eric YT v1", out = [];
  try {
    app.beginSuppressDialogs(); app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    var comp = app.project.items.addComp(NOMBRE, 1280, 720, 1, 30, 30);
    var ctrl = comp.layers.addNull(30); ctrl.name = "Controles"; ctrl.enabled = false; var fx = ctrl.property("ADBE Effect Parade");
    function sl(n, v) { fx.addProperty("ADBE Slider Control").name = n; fx.property(n).property(1).setValue(v); }
    sl("Tamano", 50); sl("Altura", 50); sl("Sombra opacidad", 55); sl("Sombra distancia", 4); sl("Sombra suavidad", 25);
    fx.addProperty("ADBE Color Control").name = "Color"; fx.property("Color").property(1).setValue([28 / 255, 1, 0, 1]);
    var l = comp.layers.addText("estoy entrevistando a gente por andorra"); l.name = "Texto";
    var p = l.property("ADBE Text Properties").property("ADBE Text Document"), d = p.value;
    d.resetCharStyle(); d.font = "SequelSans-MediumDisp"; d.fontSize = 40; d.tracking = -10; d.fillColor = [28 / 255, 1, 0]; d.applyFill = true; d.applyStroke = false; d.justification = ParagraphJustification.CENTER_JUSTIFY; p.setValue(d);
    var an = l.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator"); an.name = "Color";
    an.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color").expression = 'thisComp.layer("Controles").effect("Color")(1)';
    var tr = l.property("ADBE Transform Group"), C = 'c = thisComp.layer("Controles"); ';
    tr.property("ADBE Anchor Point").expression = 'r = sourceRectAtTime(time, false); [r.left + r.width / 2, r.top + r.height]';
    tr.property("ADBE Position").expression = C + '[640, 683 - (c.effect("Altura")(1) - 50) * 6]';
    tr.property("ADBE Scale").expression = C + 's = c.effect("Tamano")(1) * 2; [s, s]';
    var ds = l.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow"); ds = l.property("ADBE Effect Parade").property("ADBE Drop Shadow");
    ds.property("ADBE Drop Shadow-0001").setValue([0, 0, 0, 1]);
    ds.property("ADBE Drop Shadow-0002").expression = C + 'c.effect("Sombra opacidad")(1) * 2.55';
    ds.property("ADBE Drop Shadow-0003").setValue(135);
    ds.property("ADBE Drop Shadow-0004").expression = C + 'c.effect("Sombra distancia")(1)';
    ds.property("ADBE Drop Shadow-0005").expression = C + 'c.effect("Sombra suavidad")(1)';
    out.push("fuente: " + p.value.font + " | opac rango " + ds.property("ADBE Drop Shadow-0002").maxValue);
    comp.openInViewer(); var n = 0;
    function egp(prop, nombre) { if (prop.canAddToMotionGraphicsTemplate(comp)) { prop.addToMotionGraphicsTemplateAs(comp, nombre); n++; } else out.push("no: " + nombre); }
    var E = ctrl.property("ADBE Effect Parade");
    egp(p, "Texto"); egp(E.property("Color").property(1), "Color");
    egp(E.property("Tamano").property(1), "Tamano (50 = normal, 100 = doble)"); egp(E.property("Altura").property(1), "Altura (50 = normal, mas = sube)");
    egp(E.property("Sombra opacidad").property(1), "Sombra: opacidad (0 a 100)"); egp(E.property("Sombra distancia").property(1), "Sombra: distancia"); egp(E.property("Sombra suavidad").property(1), "Sombra: suavidad");
    comp.motionGraphicsTemplateName = NOMBRE; comp.time = 0;
    comp.saveFrameToPng(0, new File(DIR + "/" + NOMBRE + " (muestra).png"));
    app.project.save(new File(DIR + "/" + NOMBRE + ".aep"));
    var ok = comp.exportAsMotionGraphicsTemplate(true, DIR);
    out.push("controles: " + n, "exportado: " + ok, "archivo: " + new File(DIR + "/" + NOMBRE + ".mogrt").exists);
    app.endSuppressDialogs(false);
  } catch (e) { try { app.endSuppressDialogs(false); } catch (e2) {} out.push("ERROR " + e.toString() + " linea " + e.line); }
  var f = new File("/Users/luiyi/Videos-Remotion/ae/resultado.txt"); f.encoding = "UTF-8"; f.open("w"); f.write(out.join(" | ")); f.close();
})();
