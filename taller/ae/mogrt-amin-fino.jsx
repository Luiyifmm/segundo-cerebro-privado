// Plantilla MOGRT "Subtitulo Amin fino v1" (estilo de @julianealborna, referencia del usuario del 10-10-2026):
// frase en letra fina y pequeña que se escribe palabra a palabra, palabra clave más gruesa debajo, resplandor suave.
// Texto, color, velocidad, altura, tamaño, resplandor y sombra editables en Premiere.
(function () {
  var DIR = "/Users/luiyi/Videos-Remotion/clientes/_plantillas", NOM = "Subtitulo Amin fino v1", out = [];
  try {
    app.beginSuppressDialogs();
    if (app.project.file && app.project.file.fsName.indexOf("/clientes/_plantillas/") < 0 && app.project.numItems > 0) throw new Error("hay otro proyecto abierto en After Effects; no lo cierro");
    app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    var comp = app.project.items.addComp(NOM, 2160, 3840, 1, 30, 30);
    var ctrl = comp.layers.addNull(6); ctrl.name = "Controles"; ctrl.enabled = false;
    var fx = ctrl.property("ADBE Effect Parade");
    function ctl(tipo, nombre, v) { fx.addProperty(tipo).name = nombre; fx.property(nombre).property(1).setValue(v); }
    ctl("ADBE Color Control", "Color frase", [1, 1, 1, 1]); ctl("ADBE Color Control", "Color clave", [1, 1, 1, 1]);
    ctl("ADBE Slider Control", "Velocidad", 11); ctl("ADBE Slider Control", "Altura", 50); ctl("ADBE Slider Control", "Tamano", 50);
    ctl("ADBE Slider Control", "Resplandor", 50); ctl("ADBE Slider Control", "Sombra", 55); ctl("ADBE Checkbox Control", "Animacion", 1);
    var C = 'thisComp.layer("Controles").effect';
    function texto(nombre, contenido, fuente, tamano, track) {
      var l = comp.layers.addText(contenido); l.name = nombre;
      var p = l.property("ADBE Text Properties").property("ADBE Text Document"), d = p.value;
      d.resetCharStyle(); d.font = fuente; d.fontSize = tamano; d.tracking = track; d.fillColor = [1, 1, 1]; d.applyFill = true; d.applyStroke = false; d.justification = ParagraphJustification.CENTER_JUSTIFY; p.setValue(d);
      l.property("ADBE Transform Group").property("ADBE Scale").expression = 's = ' + C + '("Tamano")(1) * 2; [s, s]';
      return l;
    }
    var frase = texto("Frase", "si en algún momento", "SFProDisplay-Regular", 118, -28), clave = texto("Clave", "libre", "SFProDisplay-Bold", 150, -30);
    frase.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0, 80]); clave.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0, -88]);
    var PY = '[1080, 2500 + (50 - ' + C + '("Altura")(1)) * 40]';
    frase.property("ADBE Transform Group").property("ADBE Position").expression = PY; clave.property("ADBE Transform Group").property("ADBE Position").expression = PY;
    var NP = 'n = thisComp.layer("Frase").text.sourceText.toString().replace(/^\\s+|\\s+$/g, "").split(/\\s+/).length; P = Math.max(1, ' + C + '("Velocidad")(1)) / 100;';
    function animador(l, exprInicio, porPalabras) {
      var an = l.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator"); an.name = "Entrada";
      var pr = an.property("ADBE Text Animator Properties"); pr.addProperty("ADBE Text Opacity").setValue(0); pr.addProperty("ADBE Text Blur").setValue([16, 16]); pr.addProperty("ADBE Text Position 3D").setValue([0, 14, 0]);
      var se = an.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
      se.property("ADBE Text Percent Start").expression = exprInicio;
      var av = se.property("ADBE Text Range Advanced"); if (porPalabras) av.property("ADBE Text Range Type2").setValue(3); try { av.property("ADBE Text Range Shape").setValue(1); av.property("ADBE Text Selector Smoothness").setValue(100); } catch (e) { out.push("avanzado: " + e); }
    }
    animador(frase, NP + ' ' + C + '("Animacion")(1) == 1 ? linear(time - inPoint, 0, n * P, 0, 100) : 100', true);
    animador(clave, NP + ' ' + C + '("Animacion")(1) == 1 ? ease(time - inPoint, n * P, n * P + 0.2, 0, 100) : 100', false);
    function acabado(l, color) {
      var ef = l.property("ADBE Effect Parade");
      ef.addProperty("ADBE Fill").property("ADBE Fill-0002").expression = C + '("' + color + '")(1)';
      var s1 = ef.addProperty("ADBE Drop Shadow"); s1 = ef.property(2); s1.name = "Sombra";
      s1.property("ADBE Drop Shadow-0001").setValue([0, 0, 0, 1]); s1.property("ADBE Drop Shadow-0003").setValue(180); s1.property("ADBE Drop Shadow-0004").setValue(6); s1.property("ADBE Drop Shadow-0005").setValue(34);
      s1.property("ADBE Drop Shadow-0002").expression = C + '("Sombra")(1) * 2.55';
      var s2 = ef.addProperty("ADBE Drop Shadow"); s2 = ef.property(3); s2.name = "Resplandor";
      s2.property("ADBE Drop Shadow-0003").setValue(0); s2.property("ADBE Drop Shadow-0004").setValue(0); s2.property("ADBE Drop Shadow-0005").setValue(46);
      s2.property("ADBE Drop Shadow-0001").expression = C + '("' + color + '")(1)'; s2.property("ADBE Drop Shadow-0002").expression = C + '("Resplandor")(1) * 2.55 * 0.9';
    }
    acabado(frase, "Color frase"); acabado(clave, "Color clave");
    comp.openInViewer(); var n = 0;
    function egp(prop, nombre) { if (prop.canAddToMotionGraphicsTemplate(comp)) { prop.addToMotionGraphicsTemplateAs(comp, nombre); n++; } else out.push("no se puede anadir: " + nombre); }
    egp(frase.property("ADBE Text Properties").property("ADBE Text Document"), "Frase");
    egp(clave.property("ADBE Text Properties").property("ADBE Text Document"), "Palabra clave");
    var E = ctrl.property("ADBE Effect Parade");
    egp(E.property("Color frase").property(1), "Color de la frase"); egp(E.property("Color clave").property(1), "Color de la palabra clave");
    egp(E.property("Animacion").property(1), "Animacion palabra a palabra"); egp(E.property("Velocidad").property(1), "Velocidad (centesimas de segundo por palabra)");
    egp(E.property("Altura").property(1), "Altura (50 = normal, mas = sube)"); egp(E.property("Tamano").property(1), "Tamano (50 = normal, 100 = doble)");
    egp(E.property("Resplandor").property(1), "Resplandor (0 a 100)"); egp(E.property("Sombra").property(1), "Sombra (0 a 100)");
    comp.motionGraphicsTemplateName = NOM; new Folder(DIR).create(); app.project.save(new File(DIR + "/" + NOM + ".aep"));
    var ok = comp.exportAsMotionGraphicsTemplate(true, DIR); out.push("controles: " + n, "exportado: " + ok, "archivo: " + new File(DIR + "/" + NOM + ".mogrt").exists);
    app.endSuppressDialogs(false);
  } catch (e) { try { app.endSuppressDialogs(false); } catch (e2) {} out.push("ERROR " + e.toString() + " linea " + e.line); }
  var f = new File("/Users/luiyi/Videos-Remotion/ae/resultado.txt"); f.encoding = "UTF-8"; f.open("w"); f.write(out.join(" | ")); f.close();
})();
