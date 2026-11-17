// Crea la plantilla MOGRT "Subtitulo elegante": línea pequeña blanca + palabra clave grande en serif cursiva,
// las dos con entrada de desenfoque. Texto, color, retraso y posición quedan editables en Premiere.
(function () {
  var DIR = "~/Videos-Remotion/clientes/_plantillas";
  var out = [];
  try {
    app.beginSuppressDialogs();
    app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    var comp = app.project.items.addComp("Subtitulo elegante", 2160, 3840, 1, 6, 30);

    var ctrl = comp.layers.addNull(6); ctrl.name = "Controles"; ctrl.enabled = false;
    var fx = ctrl.property("ADBE Effect Parade");
    fx.addProperty("ADBE Color Control").name = "Color clave"; fx.property("Color clave").property(1).setValue([0.118, 0.545, 1, 1]);
    fx.addProperty("ADBE Slider Control").name = "Retraso clave"; fx.property("Retraso clave").property(1).setValue(4);
    fx.addProperty("ADBE Slider Control").name = "Altura"; fx.property("Altura").property(1).setValue(0);
    fx.addProperty("ADBE Slider Control").name = "Tamano"; fx.property("Tamano").property(1).setValue(100);

    function texto(nombre, contenido, fuente, tamano, track, y, col) {
      var l = comp.layers.addText(contenido); l.name = nombre;
      var p = l.property("ADBE Text Properties").property("ADBE Text Document"), d = p.value;
      d.resetCharStyle(); d.font = fuente; d.fontSize = tamano; d.tracking = track; d.fillColor = col; d.applyFill = true; d.applyStroke = false; d.justification = ParagraphJustification.CENTER_JUSTIFY;
      p.setValue(d);
      var tr = l.property("ADBE Transform Group");
      tr.property("ADBE Position").setValue([1080, y]);
      tr.property("ADBE Position").expression = 'value + [0, thisComp.layer("Controles").effect("Altura")(1)]';
      tr.property("ADBE Scale").expression = 's = thisComp.layer("Controles").effect("Tamano")(1); [s, s]';
      return l;
    }
    var linea = texto("Linea", "para toda la", "Montserrat-SemiBold", 92, -34, 2440, [1, 1, 1]);
    var clave = texto("Clave", "vida", "NyghtSerif-DarkItalic", 226, -18, 2640, [0.118, 0.545, 1]);
    // el punto de ancla de la escala es el mismo para las dos: el centro del bloque
    linea.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0, 60]);
    linea.property("ADBE Transform Group").property("ADBE Position").setValue([1080, 2500]);
    clave.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0, -140]);
    clave.property("ADBE Transform Group").property("ADBE Position").setValue([1080, 2500]);

    function animar(l, esClave) {
      var ef = l.property("ADBE Effect Parade");
      if (esClave) { var f = ef.addProperty("ADBE Fill"); f.property("ADBE Fill-0002").expression = 'thisComp.layer("Controles").effect("Color clave")(1)'; }
      var b = ef.addProperty("ADBE Gaussian Blur 2");
      var t0 = esClave ? 'd = thisComp.layer("Controles").effect("Retraso clave")(1) * thisComp.frameDuration; t = time - inPoint - d;' : 't = time - inPoint;';
      var dur = esClave ? 7 : 5;
      b.property("ADBE Gaussian Blur 2-0001").expression = t0 + ' e = ease(t, 0, ' + dur + ' * thisComp.frameDuration, 0, 1); (1 - e) * ' + (esClave ? 60 : 34);
      var s = ef.addProperty("ADBE Drop Shadow");
      s.property("ADBE Drop Shadow-0002").setValue(esClave ? 150 : 165);
      s.property("ADBE Drop Shadow-0003").setValue(180);
      s.property("ADBE Drop Shadow-0004").setValue(esClave ? 8 : 4);
      s.property("ADBE Drop Shadow-0005").setValue(esClave ? 52 : 26);
      l.property("ADBE Transform Group").property("ADBE Opacity").expression = t0 + ' ease(t, 0, ' + dur + ' * thisComp.frameDuration, 0, 100)';
    }
    animar(linea, false); animar(clave, true);

    comp.openInViewer();
    var n = 0;
    function egp(prop, nombre) { if (prop.canAddToMotionGraphicsTemplate(comp)) { prop.addToMotionGraphicsTemplateAs(comp, nombre); n++; } else out.push("no se puede anadir: " + nombre); }
    egp(linea.property("ADBE Text Properties").property("ADBE Text Document"), "Linea");
    egp(clave.property("ADBE Text Properties").property("ADBE Text Document"), "Palabra clave");
    egp(ctrl.property("ADBE Effect Parade").property("Color clave").property(1), "Color clave");
    egp(ctrl.property("ADBE Effect Parade").property("Retraso clave").property(1), "Retraso clave (fotogramas)");
    egp(ctrl.property("ADBE Effect Parade").property("Altura").property(1), "Altura");
    egp(ctrl.property("ADBE Effect Parade").property("Tamano").property(1), "Tamano");
    comp.motionGraphicsTemplateName = "Subtitulo elegante";
    new Folder(DIR).create();
    app.project.save(new File(DIR + "/Subtitulo elegante.aep"));
    var ok = comp.exportAsMotionGraphicsTemplate(true, DIR);
    out.push("controles: " + n, "exportado: " + ok, "archivo: " + new File(DIR + "/Subtitulo elegante.mogrt").exists);
    app.endSuppressDialogs(false);
  } catch (e) { try { app.endSuppressDialogs(false); } catch (e2) {} out.push("ERROR " + e.toString() + " linea " + e.line); }
  var f = new File("~/Videos-Remotion/ae/resultado.txt"); f.encoding = "UTF-8"; f.open("w"); f.write(out.join("\n")); f.close();
})();
