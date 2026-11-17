// Plantilla "Etiqueta ClienteE v1": texto (Sequel Sans Bold) sobre una caja redondeada que se ajusta sola al texto, con entrada corta.
// Para vídeos de ClienteE de texto en pantalla (comparativas en dos columnas, listas). Controles en Premiere: Texto, Color del texto,
// Color de la caja, Opacidad de la caja, Tamaño y Animación de entrada.
(function () {
  var DIR = "~/Videos-Remotion/clientes/_plantillas", NOMBRE = "Etiqueta ClienteE v1", out = [];
  try {
    app.beginSuppressDialogs(); app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    var comp = app.project.items.addComp(NOMBRE, 2160, 3840, 1, 30, 30);
    var ctrl = comp.layers.addNull(30); ctrl.name = "Controles"; ctrl.enabled = false; var fx = ctrl.property("ADBE Effect Parade");
    fx.addProperty("ADBE Slider Control").name = "Tamano"; fx.property("Tamano").property(1).setValue(50);
    fx.addProperty("ADBE Color Control").name = "Color texto"; fx.property("Color texto").property(1).setValue([1, 1, 1, 1]);
    fx.addProperty("ADBE Color Control").name = "Color caja"; fx.property("Color caja").property(1).setValue([0.04, 0.04, 0.04, 1]);
    fx.addProperty("ADBE Slider Control").name = "Opacidad caja"; fx.property("Opacidad caja").property(1).setValue(100);
    fx.addProperty("ADBE Checkbox Control").name = "Entrada"; fx.property("Entrada").property(1).setValue(1);
    var l = comp.layers.addText("Antes de las pesas"); l.name = "Texto";
    var p = l.property("ADBE Text Properties").property("ADBE Text Document"), d = p.value;
    d.resetCharStyle(); d.font = "SequelSans-BoldDisp"; d.fontSize = 96; d.tracking = -10; d.leading = 108; d.fillColor = [1, 1, 1]; d.applyFill = true; d.applyStroke = false; d.justification = ParagraphJustification.CENTER_JUSTIFY; p.setValue(d);
    var an = l.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator"); an.name = "Color";
    an.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color").expression = 'thisComp.layer("Controles").effect("Color texto")(1)';
    var ENT = 'c = thisComp.layer("Controles"); e = c.effect("Entrada")(1) == 1 ? ease(time - inPoint, 0, 5 / 30, 0, 1) : 1;';
    var tr = l.property("ADBE Transform Group");
    tr.property("ADBE Anchor Point").expression = 'r = sourceRectAtTime(time, false); [r.left + r.width / 2, r.top + r.height / 2]';
    tr.property("ADBE Position").setValue([1080, 1920]);
    tr.property("ADBE Scale").expression = ENT + ' s = c.effect("Tamano")(1) * 2 * (0.88 + 0.12 * e); [s, s]';
    tr.property("ADBE Opacity").expression = ENT + ' 100 * e';
    var sh = comp.layers.addShape(); sh.name = "Caja"; sh.moveAfter(l);
    var g = sh.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"), gc = g.property("ADBE Vectors Group");
    var rc = gc.addProperty("ADBE Vector Shape - Rect");
    rc.property("ADBE Vector Rect Size").expression = 't = thisComp.layer("Texto"); r = t.sourceRectAtTime(time, false); [r.width + 78, r.height + 52]';
    rc.property("ADBE Vector Rect Roundness").setValue(26);
    var fl = gc.addProperty("ADBE Vector Graphic - Fill"); fl.property("ADBE Vector Fill Color").expression = 'thisComp.layer("Controles").effect("Color caja")(1)';
    var st = sh.property("ADBE Transform Group");
    st.property("ADBE Position").expression = 'thisComp.layer("Texto").transform.position';
    st.property("ADBE Scale").expression = 'thisComp.layer("Texto").transform.scale';
    st.property("ADBE Opacity").expression = 'thisComp.layer("Texto").transform.opacity * thisComp.layer("Controles").effect("Opacidad caja")(1) / 100';
    var ds = sh.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow"); ds = sh.property("ADBE Effect Parade").property("ADBE Drop Shadow"); ds.property("ADBE Drop Shadow-0002").setValue(90); ds.property("ADBE Drop Shadow-0003").setValue(180); ds.property("ADBE Drop Shadow-0004").setValue(8); ds.property("ADBE Drop Shadow-0005").setValue(40);
    out.push("fuente: " + l.property("ADBE Text Properties").property("ADBE Text Document").value.font);
    comp.openInViewer(); var n = 0;
    function egp(prop, nombre) { if (prop.canAddToMotionGraphicsTemplate(comp)) { prop.addToMotionGraphicsTemplateAs(comp, nombre); n++; } else out.push("no: " + nombre); }
    var E = ctrl.property("ADBE Effect Parade");
    egp(l.property("ADBE Text Properties").property("ADBE Text Document"), "Texto");
    egp(E.property("Color texto").property(1), "Color del texto");
    egp(E.property("Color caja").property(1), "Color de la caja");
    egp(E.property("Opacidad caja").property(1), "Opacidad de la caja");
    egp(E.property("Tamano").property(1), "Tamano (50 = normal, 100 = doble)");
    egp(E.property("Entrada").property(1), "Animacion de entrada");
    comp.motionGraphicsTemplateName = NOMBRE;
    app.project.save(new File(DIR + "/" + NOMBRE + ".aep"));
    var ok = comp.exportAsMotionGraphicsTemplate(true, DIR);
    out.push("controles: " + n, "exportado: " + ok, "archivo: " + new File(DIR + "/" + NOMBRE + ".mogrt").exists);
    app.endSuppressDialogs(false);
  } catch (e) { try { app.endSuppressDialogs(false); } catch (e2) {} out.push("ERROR " + e.toString() + " linea " + e.line); }
  var f = new File("~/Videos-Remotion/ae/resultado.txt"); f.encoding = "UTF-8"; f.open("w"); f.write(out.join(" | ")); f.close();
})();
