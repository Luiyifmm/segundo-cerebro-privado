// Plantilla "Texto contorno": una sola capa de texto blanco con contorno negro, tipo texto de la app (TikTok/Instagram). Editable en Premiere.
(function () {
  var DIR = "/Users/luiyi/Videos-Remotion/clientes/_plantillas", out = [];
  try {
    app.beginSuppressDialogs(); app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    var comp = app.project.items.addComp("Texto contorno", 2160, 3840, 1, 30, 30);
    var ctrl = comp.layers.addNull(30); ctrl.name = "Controles"; ctrl.enabled = false; var fx = ctrl.property("ADBE Effect Parade");
    fx.addProperty("ADBE Slider Control").name = "Tamano"; fx.property("Tamano").property(1).setValue(50);
    var l = comp.layers.addText("1,000 pasos"); l.name = "Texto";
    var p = l.property("ADBE Text Properties").property("ADBE Text Document"), d = p.value;
    d.resetCharStyle(); d.font = "SFProDisplay-Bold"; d.fontSize = 132; d.tracking = -38; d.leading = 150; d.fillColor = [1, 1, 1]; d.applyFill = true; d.applyStroke = true; d.strokeColor = [0, 0, 0]; d.strokeWidth = 16; d.strokeOverFill = false; d.justification = ParagraphJustification.CENTER_JUSTIFY; p.setValue(d);
    var tr = l.property("ADBE Transform Group");
    tr.property("ADBE Anchor Point").expression = 'r = sourceRectAtTime(time, false); [r.left + r.width / 2, r.top + r.height / 2]';
    tr.property("ADBE Position").setValue([1080, 1920]);
    tr.property("ADBE Scale").expression = 's = thisComp.layer("Controles").effect("Tamano")(1) * 2; [s, s]';
    out.push("fuente: " + l.property("ADBE Text Properties").property("ADBE Text Document").value.font);
    comp.openInViewer(); var n = 0;
    function egp(prop, nombre) { if (prop.canAddToMotionGraphicsTemplate(comp)) { prop.addToMotionGraphicsTemplateAs(comp, nombre); n++; } else out.push("no: " + nombre); }
    egp(l.property("ADBE Text Properties").property("ADBE Text Document"), "Texto");
    egp(ctrl.property("ADBE Effect Parade").property("Tamano").property(1), "Tamano (50 = normal, 100 = doble)");
    comp.motionGraphicsTemplateName = "Texto contorno";
    app.project.save(new File(DIR + "/Texto contorno.aep"));
    var ok = comp.exportAsMotionGraphicsTemplate(true, DIR);
    out.push("controles: " + n, "exportado: " + ok, "archivo: " + new File(DIR + "/Texto contorno.mogrt").exists);
    app.endSuppressDialogs(false);
  } catch (e) { try { app.endSuppressDialogs(false); } catch (e2) {} out.push("ERROR " + e.toString() + " linea " + e.line); }
  var f = new File("/Users/luiyi/Videos-Remotion/ae/resultado.txt"); f.encoding = "UTF-8"; f.open("w"); f.write(out.join(" | ")); f.close();
})();
