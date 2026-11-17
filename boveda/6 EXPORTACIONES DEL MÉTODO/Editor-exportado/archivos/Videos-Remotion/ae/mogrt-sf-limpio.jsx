// Plantilla MOGRT "Subtitulo SF limpio v1" (referencia del usuario 22-10-2026, reel con subtítulos mínimos):
// una línea de 1-2 palabras en SF Pro Display Bold blanca, espaciado muy cerrado, sombra suave, entrada corta.
// Texto, tamaño, altura, sombra, color y animación editables en Premiere. Fuente de 30 s para poder estirar el clip.
(function () {
  var DIR = "~/Videos-Remotion/clientes/_plantillas", NOM = "Subtitulo SF limpio v1", out = [];
  try {
    app.beginSuppressDialogs();
    if (app.project.file && app.project.file.fsName.indexOf("/clientes/_plantillas/") < 0 && app.project.numItems > 0) throw new Error("hay otro proyecto abierto en After Effects; no lo cierro");
    app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    var comp = app.project.items.addComp(NOM, 2160, 3840, 1, 30, 30);
    var ctrl = comp.layers.addNull(30); ctrl.name = "Controles"; ctrl.enabled = false;
    var fx = ctrl.property("ADBE Effect Parade");
    function ctl(tipo, nombre, v) { fx.addProperty(tipo).name = nombre; fx.property(nombre).property(1).setValue(v); }
    ctl("ADBE Color Control", "Color", [1, 1, 1, 1]); ctl("ADBE Slider Control", "Tamano", 50); ctl("ADBE Slider Control", "Altura", 50);
    ctl("ADBE Slider Control", "Sombra", 50); ctl("ADBE Checkbox Control", "Animacion", 1);
    var C = 'thisComp.layer("Controles").effect';
    var l = comp.layers.addText("entendió algo"); l.name = "Linea";
    var p = l.property("ADBE Text Properties").property("ADBE Text Document"), d = p.value;
    d.resetCharStyle(); d.font = "SFProDisplay-Bold"; d.fontSize = 112; d.tracking = -45; d.fillColor = [1, 1, 1]; d.applyFill = true; d.applyStroke = false; d.justification = ParagraphJustification.CENTER_JUSTIFY; p.setValue(d);
    var tr = l.property("ADBE Transform Group");
    tr.property("ADBE Anchor Point").setValue([0, -40]);
    var t0 = 'on = ' + C + '("Animacion")(1) == 1; t = time - inPoint; e = on ? ease(t, 0, 4 * thisComp.frameDuration, 0, 1) : 1;';
    tr.property("ADBE Position").expression = t0 + ' [1080, 2080 + (50 - ' + C + '("Altura")(1)) * 30 + (1 - e) * 14]';
    tr.property("ADBE Scale").expression = 's = ' + C + '("Tamano")(1) * 2; [s, s]';
    tr.property("ADBE Opacity").expression = t0 + ' e * 100';
    var ef = l.property("ADBE Effect Parade");
    ef.addProperty("ADBE Fill").property("ADBE Fill-0002").expression = C + '("Color")(1)';
    var s = ef.addProperty("ADBE Drop Shadow");
    s.property("ADBE Drop Shadow-0002").expression = C + '("Sombra")(1) * 2.55';
    s.property("ADBE Drop Shadow-0003").setValue(180); s.property("ADBE Drop Shadow-0004").setValue(4); s.property("ADBE Drop Shadow-0005").setValue(34);
    comp.openInViewer();
    var n = 0;
    function egp(prop, nombre) { if (prop.canAddToMotionGraphicsTemplate(comp)) { prop.addToMotionGraphicsTemplateAs(comp, nombre); n++; } else out.push("no se puede anadir: " + nombre); }
    egp(p, "Texto");
    egp(fx.property("Tamano").property(1), "Tamano (50 = normal)"); egp(fx.property("Altura").property(1), "Altura (50 = normal, mas = sube)");
    egp(fx.property("Sombra").property(1), "Sombra"); egp(fx.property("Color").property(1), "Color"); egp(fx.property("Animacion").property(1), "Animacion de entrada");
    comp.motionGraphicsTemplateName = NOM;
    app.project.save(new File(DIR + "/" + NOM + ".aep"));
    var ok = comp.exportAsMotionGraphicsTemplate(true, DIR);
    out.push("controles: " + n, "exportado: " + ok, "archivo: " + new File(DIR + "/" + NOM + ".mogrt").exists);
    app.endSuppressDialogs(false);
  } catch (e) { try { app.endSuppressDialogs(false); } catch (e2) {} out.push("ERROR " + e.toString() + " linea " + e.line); }
  var f = new File("~/Videos-Remotion/ae/resultado.txt"); f.encoding = "UTF-8"; f.open("w"); f.write(out.join(" | ")); f.close();
})();
