// v12 = v11 + casilla "Palabra clave arriba" (invierte el orden: palabra grande encima, línea debajo).
// Crea la plantilla MOGRT "Subtitulo Amin v12": igual que la v8 (línea pequeña blanca + palabra clave grande) y además glow en la palabra clave,
// las dos con entrada de desenfoque. Texto, color, retraso y posición quedan editables en Premiere.
(function () {
  var DIR = "/Users/luiyi/Videos-Remotion/clientes/_plantillas";
  var out = [];
  try {
    app.beginSuppressDialogs();
    app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    var comp = app.project.items.addComp("Subtitulo Amin v12", 2160, 3840, 1, 30, 30);

    var ctrl = comp.layers.addNull(6); ctrl.name = "Controles"; ctrl.enabled = false;
    var fx = ctrl.property("ADBE Effect Parade");
    fx.addProperty("ADBE Color Control").name = "Color clave"; fx.property("Color clave").property(1).setValue([0.118, 0.545, 1, 1]);
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
    fx.addProperty("ADBE Slider Control").name = "Glow clave"; fx.property("Glow clave").property(1).setValue(50);
    fx.addProperty("ADBE Checkbox Control").name = "Mostrar linea"; fx.property("Mostrar linea").property(1).setValue(1);
    fx.addProperty("ADBE Checkbox Control").name = "Clave arriba"; fx.property("Clave arriba").property(1).setValue(0);
    fx.addProperty("ADBE Slider Control").name = "Tamano"; fx.property("Tamano").property(1).setValue(50);

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
    var linea = texto("Linea", "para toda la", "SFProDisplay-Bold", 96, -22, 2440, [1, 1, 1]);
    var clave = texto("Clave", "vida", "SFProDisplay-Bold", 235, -34, 2640, [0.118, 0.545, 1]);
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
      l.property("ADBE Transform Group").property("ADBE Position").expression = t0 + ' e = easeOut(t, 0, D * 1.3, 0, 1); wL = thisComp.layer("Linea").sourceRectAtTime(time, false).width; wK = thisComp.layer("Clave").sourceRectAtTime(time, false).width; W = Math.max(wL, wK); dx = ' + C + '("Alinear izquierda")(1) == 1 ? (' + (esClave ? 'wK' : 'wL') + ' - W) / 2 * ' + C + '("Tamano")(1) * 2 / 100 : 0; value + [dx, (' + C + '("Clave arriba")(1) == 1 ? ' + (esClave ? -74 : 225) + ' * ' + C + '("Tamano")(1) * 2 / 100 : 0) + (50 - ' + C + '("Altura")(1)) * 40 + (on ? (1 - e) * ' + (esClave ? 36 : 0) + ' : 0)]';
      if (esClave) { var gl = ef.addProperty("ADBE Glo2"); gl = ef.property("ADBE Glo2"); gl.property("ADBE Glo2-0002").setValue(10); gl.property("ADBE Glo2-0003").setValue(90); try { gl.property("ADBE Glo2-0005").setValue(1); } catch (eg) { out.push("sin composite"); } gl.property("ADBE Glo2-0004").expression = 'thisComp.layer("Controles").effect("Glow clave")(1) / 50 * 0.9'; }
      ef.addProperty("ADBE Drop Shadow");
      var ds = ef.property("ADBE Drop Shadow"), CS = 'thisComp.layer("Controles").effect', mitad = esClave ? '' : ' / 2';
      ds.property("ADBE Drop Shadow-0003").setValue(180);
      ds.property("ADBE Drop Shadow-0002").expression = CS + '("Sombra")(1) == 1 ? ' + CS + '("Sombra opacidad")(1) * 2.55 : 0';
      ds.property("ADBE Drop Shadow-0004").expression = CS + '("Sombra distancia")(1)' + mitad;
      ds.property("ADBE Drop Shadow-0005").expression = CS + '("Sombra difuminado")(1)' + mitad;
      l.property("ADBE Transform Group").property("ADBE Opacity").expression = t0 + ' on ? ease(t, 0, D, 0, 100) : 100';
    }
    animar(linea, false); animar(clave, true);
    // v11: la línea se puede ocultar sin mover la palabra clave (para duplicar solo la palabra y darle efectos aparte)
    var opL = linea.property("ADBE Transform Group").property("ADBE Opacity"); opL.expression = 'v = (function () { ' + opL.expression.replace(/ on \? ease\(t, 0, D, 0, 100\) : 100$/, ' return on ? ease(t, 0, D, 0, 100) : 100;') + ' })(); thisComp.layer("Controles").effect("Mostrar linea")(1) == 1 ? v : 0';

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
    egp(ctrl.property("ADBE Effect Parade").property("Mostrar linea").property(1), "Mostrar la linea");
    egp(ctrl.property("ADBE Effect Parade").property("Clave arriba").property(1), "Palabra clave arriba");
    egp(ctrl.property("ADBE Effect Parade").property("Glow clave").property(1), "Glow de la palabra clave (0 = sin glow, 50 = normal)");
    comp.motionGraphicsTemplateName = "Subtitulo Amin v12";
    new Folder(DIR).create();
    app.project.save(new File(DIR + "/Subtitulo Amin v12.aep"));
    var ok = comp.exportAsMotionGraphicsTemplate(true, DIR);
    out.push("controles: " + n, "exportado: " + ok, "archivo: " + new File(DIR + "/Subtitulo Amin v12.mogrt").exists);
    app.endSuppressDialogs(false);
  } catch (e) { try { app.endSuppressDialogs(false); } catch (e2) {} out.push("ERROR " + e.toString() + " linea " + e.line); }
  var f = new File("/Users/luiyi/Videos-Remotion/ae/resultado.txt"); f.encoding = "UTF-8"; f.open("w"); f.write(out.join(" | ")); f.close();
})();
