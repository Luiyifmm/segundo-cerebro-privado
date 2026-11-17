// Crea la plantilla MOGRT "Texto ClienteN v1": línea pequeña blanca + palabra clave grande en serif cursiva,
// las dos con entrada de desenfoque. Texto, color, retraso y posición quedan editables en Premiere.
(function () {
  var DIR = "~/Videos-Remotion/clientes/_plantillas";
  var out = [];
  try {
    app.beginSuppressDialogs();
    app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    var comp = app.project.items.addComp("Texto ClienteN v1", 2160, 3840, 1, 30, 30);

    var ctrl = comp.layers.addNull(6); ctrl.name = "Controles"; ctrl.enabled = false;
    var fx = ctrl.property("ADBE Effect Parade");
    fx.addProperty("ADBE Color Control").name = "Color clave"; fx.property("Color clave").property(1).setValue([1, 0.345, 0, 1]);
    fx.addProperty("ADBE Color Control").name = "Color linea"; fx.property("Color linea").property(1).setValue([1, 1, 1, 1]);
    fx.addProperty("ADBE Checkbox Control").name = "Animacion"; fx.property("Animacion").property(1).setValue(1);
    fx.addProperty("ADBE Checkbox Control").name = "Alinear izquierda"; fx.property("Alinear izquierda").property(1).setValue(1);
    fx.addProperty("ADBE Checkbox Control").name = "Sombra"; fx.property("Sombra").property(1).setValue(1);
    fx.addProperty("ADBE Slider Control").name = "Sombra opacidad"; fx.property("Sombra opacidad").property(1).setValue(62);
    fx.addProperty("ADBE Slider Control").name = "Sombra difuminado"; fx.property("Sombra difuminado").property(1).setValue(52);
    fx.addProperty("ADBE Slider Control").name = "Sombra distancia"; fx.property("Sombra distancia").property(1).setValue(8);
    fx.addProperty("ADBE Slider Control").name = "Duracion entrada"; fx.property("Duracion entrada").property(1).setValue(6);
    fx.addProperty("ADBE Slider Control").name = "Retraso clave"; fx.property("Retraso clave").property(1).setValue(2);
    fx.addProperty("ADBE Slider Control").name = "Altura"; fx.property("Altura").property(1).setValue(50);
    fx.addProperty("ADBE Slider Control").name = "Tamano"; fx.property("Tamano").property(1).setValue(50);
    fx.addProperty("ADBE Slider Control").name = "Tamano linea"; fx.property("Tamano linea").property(1).setValue(77);

    function texto(nombre, contenido, fuente, tamano, track, y, col) {
      var l = comp.layers.addText(contenido); l.name = nombre;
      var p = l.property("ADBE Text Properties").property("ADBE Text Document"), d = p.value;
      d.resetCharStyle(); d.font = fuente; d.fontSize = tamano; d.tracking = track; d.fillColor = col; d.applyFill = true; d.applyStroke = false; d.justification = ParagraphJustification.CENTER_JUSTIFY;
      p.setValue(d);
      var tr = l.property("ADBE Transform Group");
      tr.property("ADBE Position").setValue([1080, y]);
      tr.property("ADBE Position").expression = 'value + [0, thisComp.layer("Controles").effect("Altura")(1)]';
      tr.property("ADBE Scale").expression = 's = thisComp.layer("Controles").effect("Tamano")(1) * 2; [s, s]';
      return l;
    }
    var linea = texto("Linea", "para toda la", "SequelSans-MediumDisp", 96, -30, 2440, [1, 1, 1]);
    var clave = texto("Clave", "vida", "SequelSans-HeavyDisp", 226, -40, 2640, [1, 0.345, 0]);
    // el punto de ancla de la escala es el mismo para las dos: el centro del bloque
    linea.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0, 60]);
    linea.property("ADBE Transform Group").property("ADBE Position").setValue([1080, 2500]);
    clave.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0, -114]);
    clave.property("ADBE Transform Group").property("ADBE Position").setValue([1080, 2500]);

    function animar(l, esClave) {
      var ef = l.property("ADBE Effect Parade");
      var f = ef.addProperty("ADBE Fill"); f.property("ADBE Fill-0002").expression = 'thisComp.layer("Controles").effect("' + (esClave ? 'Color clave' : 'Color linea') + '")(1)';
      var C = 'thisComp.layer("Controles").effect';
      var t0 = 'on = ' + C + '("Animacion")(1) == 1; fd = thisComp.frameDuration; D = Math.max(1, ' + C + '("Duracion entrada")(1)) * fd' + (esClave ? '' : ' / 2') + '; t = time - inPoint - ' + (esClave ? C + '("Retraso clave")(1) * fd' : '0') + ';';
      l.property("ADBE Transform Group").property("ADBE Position").expression = t0 + ' e = easeOut(t, 0, D * 1.3, 0, 1); wL = thisComp.layer("Linea").sourceRectAtTime(time, false).width; wK = thisComp.layer("Clave").sourceRectAtTime(time, false).width; W = Math.max(wL, wK); dx = ' + C + '("Alinear izquierda")(1) == 1 ? (' + (esClave ? 'wK' : 'wL') + ' - W) / 2 * ' + C + '("Tamano")(1) * 2 / 100 : 0; value + [dx, (50 - ' + C + '("Altura")(1)) * 40 + (on ? (1 - e) * ' + (esClave ? 36 : 0) + ' : 0)]';
      ef.addProperty("ADBE Drop Shadow");
      var ds = ef.property("ADBE Drop Shadow"), CS = 'thisComp.layer("Controles").effect', mitad = esClave ? '' : ' / 2';
      ds.property("ADBE Drop Shadow-0003").setValue(180);
      ds.property("ADBE Drop Shadow-0002").expression = CS + '("Sombra")(1) == 1 ? ' + CS + '("Sombra opacidad")(1) * 2.55 : 0';
      ds.property("ADBE Drop Shadow-0004").expression = CS + '("Sombra distancia")(1)' + mitad;
      ds.property("ADBE Drop Shadow-0005").expression = CS + '("Sombra difuminado")(1)' + mitad;
      l.property("ADBE Transform Group").property("ADBE Opacity").expression = t0 + ' on ? ease(t, 0, D, 0, 100) : 100';
    }
    animar(linea, false); animar(clave, true);
    // v2: la línea tiene su propio tamaño (más grande respecto a la clave, como lo dejó el usuario a mano) y baja un poco al crecer
    function ajustar(l, esClave) {
      var C = 'thisComp.layer("Controles").effect';
      var t0 = 'on = ' + C + '("Animacion")(1) == 1; fd = thisComp.frameDuration; D = Math.max(1, ' + C + '("Duracion entrada")(1)) * fd' + (esClave ? '' : ' / 2') + '; t = time - inPoint - ' + (esClave ? C + '("Retraso clave")(1) * fd' : '0') + ';';
      var esc = ' sK = ' + C + '("Tamano")(1) * 2 / 100; TL = ' + C + '("Tamano linea")(1) / 50; sL = sK * TL;';
      l.property("ADBE Transform Group").property("ADBE Position").expression = t0 + esc + ' e = easeOut(t, 0, D * 1.3, 0, 1); wL = thisComp.layer("Linea").sourceRectAtTime(time, false).width * sL; wK = thisComp.layer("Clave").sourceRectAtTime(time, false).width * sK; W = Math.max(wL, wK); dx = ' + C + '("Alinear izquierda")(1) == 1 ? (' + (esClave ? 'wK' : 'wL') + ' - W) / 2 : 0; value + [dx, (50 - ' + C + '("Altura")(1)) * 40 + ' + (esClave ? '0' : '91 * (TL - 1)') + ' + (on ? (1 - e) * ' + (esClave ? 36 : 0) + ' : 0)]';
      if (!esClave) l.property("ADBE Transform Group").property("ADBE Scale").expression = esc + ' [sL * 100, sL * 100]';
    }
    ajustar(linea, false); ajustar(clave, true);

    comp.openInViewer();
    var n = 0;
    function egp(prop, nombre) { if (prop.canAddToMotionGraphicsTemplate(comp)) { prop.addToMotionGraphicsTemplateAs(comp, nombre); n++; } else out.push("no se puede anadir: " + nombre); }
    egp(linea.property("ADBE Text Properties").property("ADBE Text Document"), "Linea");
    egp(clave.property("ADBE Text Properties").property("ADBE Text Document"), "Palabra clave");
    egp(ctrl.property("ADBE Effect Parade").property("Color clave").property(1), "Color clave");
    egp(ctrl.property("ADBE Effect Parade").property("Color linea").property(1), "Color linea");
    egp(ctrl.property("ADBE Effect Parade").property("Animacion").property(1), "Animacion de entrada");
    egp(ctrl.property("ADBE Effect Parade").property("Alinear izquierda").property(1), "Alinear a la izquierda");
    egp(ctrl.property("ADBE Effect Parade").property("Sombra").property(1), "Sombra");
    egp(ctrl.property("ADBE Effect Parade").property("Sombra opacidad").property(1), "Sombra: opacidad (0 a 100)");
    egp(ctrl.property("ADBE Effect Parade").property("Sombra difuminado").property(1), "Sombra: difuminado");
    egp(ctrl.property("ADBE Effect Parade").property("Sombra distancia").property(1), "Sombra: distancia");
    egp(ctrl.property("ADBE Effect Parade").property("Duracion entrada").property(1), "Duracion de la entrada (fotogramas)");
    egp(ctrl.property("ADBE Effect Parade").property("Retraso clave").property(1), "Retraso de la palabra clave (fotogramas)");
    egp(ctrl.property("ADBE Effect Parade").property("Altura").property(1), "Altura (50 = normal, mas = sube)");
    egp(ctrl.property("ADBE Effect Parade").property("Tamano").property(1), "Tamano (50 = normal, 100 = doble)");
    egp(ctrl.property("ADBE Effect Parade").property("Tamano linea").property(1), "Tamano de la linea (50 = pequena, 77 = grande)");
    comp.motionGraphicsTemplateName = "Texto ClienteN v1";
    new Folder(DIR).create();
    app.project.save(new File(DIR + "/Texto ClienteN v1.aep"));
    var ok = comp.exportAsMotionGraphicsTemplate(true, DIR);
    out.push("controles: " + n, "exportado: " + ok, "archivo: " + new File(DIR + "/Texto ClienteN v1.mogrt").exists);
    app.endSuppressDialogs(false);
  } catch (e) { try { app.endSuppressDialogs(false); } catch (e2) {} out.push("ERROR " + e.toString() + " linea " + e.line); }
  var f = new File("~/Videos-Remotion/ae/resultado.txt"); f.encoding = "UTF-8"; f.open("w"); f.write(out.join(" | ")); f.close();
})();
