// Plantilla "Texto Natalia deportivo v1": texto grueso tipo marca deportiva (Futura Condensed ExtraBold, mayúsculas), relleno de color editable,
// contorno negro y sombra. Controles en Premiere: Texto, Color, Tamaño.
(function () {
  var DIR = "/Users/luiyi/Videos-Remotion/clientes/_plantillas", NOMBRE = "Texto Natalia deportivo v1", out = [];
  try {
    app.beginSuppressDialogs(); app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    var comp = app.project.items.addComp(NOMBRE, 2160, 3840, 1, 30, 30);
    var ctrl = comp.layers.addNull(30); ctrl.name = "Controles"; ctrl.enabled = false; var fx = ctrl.property("ADBE Effect Parade");
    fx.addProperty("ADBE Slider Control").name = "Tamano"; fx.property("Tamano").property(1).setValue(50);
    fx.addProperty("ADBE Color Control").name = "Color"; fx.property("Color").property(1).setValue([1, 1, 1, 1]);
    var l = comp.layers.addText("7,000 PASOS"); l.name = "Texto";
    var p = l.property("ADBE Text Properties").property("ADBE Text Document"), d = p.value;
    d.resetCharStyle(); d.font = "Futura-CondensedExtraBold"; d.fontSize = 190; d.tracking = 4; d.leading = 190; d.fillColor = [1, 1, 1]; d.applyFill = true; d.applyStroke = true; d.strokeColor = [0, 0, 0]; d.strokeWidth = 22; d.strokeOverFill = false; d.justification = ParagraphJustification.CENTER_JUSTIFY;
    try { d.fontCapsOption = FontCapsOption.FONT_ALL_CAPS; } catch (e1) { out.push("sin mayusculas automaticas"); }
    p.setValue(d);
    var an = l.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator"); an.name = "Color";
    var fc = an.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color"); fc.expression = 'thisComp.layer("Controles").effect("Color")(1)';
    var tr = l.property("ADBE Transform Group");
    tr.property("ADBE Anchor Point").expression = 'r = sourceRectAtTime(time, false); [r.left + r.width / 2, r.top + r.height / 2]';
    tr.property("ADBE Position").setValue([1080, 1920]);
    tr.property("ADBE Scale").expression = 's = thisComp.layer("Controles").effect("Tamano")(1) * 2; [s, s]';
    var ds = l.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow"); ds = l.property("ADBE Effect Parade").property("ADBE Drop Shadow"); ds.property("ADBE Drop Shadow-0002").setValue(170); ds.property("ADBE Drop Shadow-0003").setValue(180); ds.property("ADBE Drop Shadow-0004").setValue(14); ds.property("ADBE Drop Shadow-0005").setValue(40);
    out.push("fuente: " + l.property("ADBE Text Properties").property("ADBE Text Document").value.font);
    comp.openInViewer(); var n = 0;
    function egp(prop, nombre) { if (prop.canAddToMotionGraphicsTemplate(comp)) { prop.addToMotionGraphicsTemplateAs(comp, nombre); n++; } else out.push("no: " + nombre); }
    egp(l.property("ADBE Text Properties").property("ADBE Text Document"), "Texto");
    egp(ctrl.property("ADBE Effect Parade").property("Color").property(1), "Color");
    egp(ctrl.property("ADBE Effect Parade").property("Tamano").property(1), "Tamano (50 = normal, 100 = doble)");
    comp.motionGraphicsTemplateName = NOMBRE;
    app.project.save(new File(DIR + "/" + NOMBRE + ".aep"));
    var ok = comp.exportAsMotionGraphicsTemplate(true, DIR);
    out.push("controles: " + n, "exportado: " + ok, "archivo: " + new File(DIR + "/" + NOMBRE + ".mogrt").exists);
    app.endSuppressDialogs(false);
  } catch (e) { try { app.endSuppressDialogs(false); } catch (e2) {} out.push("ERROR " + e.toString() + " linea " + e.line); }
  var f = new File("/Users/luiyi/Videos-Remotion/ae/resultado.txt"); f.encoding = "UTF-8"; f.open("w"); f.write(out.join(" | ")); f.close();
})();
