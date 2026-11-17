// Plantilla MOGRT "Subtitulo Jordan v1" (referencia: reel de Jordan Belfort, ssstik.io_1793410908702, analizado el 08-11-2026).
// Una línea centrada en sans geométrica gruesa (Avenir Next Bold: Poppins no está instalada), blanca, con:
//  - revelado escalonado por PALABRA (retraso y fundido en fotogramas, desenfoque y subida opcionales);
//  - modo LETRAS en orden aleatorio (para énfasis tipo «skill» / «10 years»);
//  - resaltado de N palabras DENTRO de la línea en un segundo color (amarillo por defecto);
//  - sombra suave.
// Todo editable en Premiere. Fuente de 30 s para estirar el clip. Una segunda línea = otro clip en otra pista.
(function () {
  var DIR = "/Users/luiyi/Videos-Remotion/clientes/_plantillas", NOM = "Subtitulo Jordan v4", out = [];
  try {
    app.beginSuppressDialogs();
    if (app.project.file && app.project.file.fsName.indexOf("/clientes/_plantillas/") < 0 && app.project.numItems > 0) throw new Error("hay otro proyecto abierto en After Effects; no lo cierro");
    app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    var comp = app.project.items.addComp(NOM, 2160, 3840, 1, 30, 30);
    var ctrl = comp.layers.addNull(30); ctrl.name = "Controles"; ctrl.enabled = false;
    var fx = ctrl.property("ADBE Effect Parade");
    function ctl(tipo, nombre, v) { fx.addProperty(tipo).name = nombre; fx.property(nombre).property(1).setValue(v); }
    ctl("ADBE Color Control", "Color", [1, 1, 1, 1]);
    ctl("ADBE Color Control", "Color resaltado", [245 / 255, 197 / 255, 66 / 255, 1]);
    ctl("ADBE Slider Control", "Resaltar desde palabra", 1);
    ctl("ADBE Slider Control", "Palabras resaltadas", 0);
    ctl("ADBE Slider Control", "Tamano", 50);
    ctl("ADBE Slider Control", "Altura", 50);
    ctl("ADBE Slider Control", "Retraso por palabra (f)", 2);
    ctl("ADBE Slider Control", "Fundido (f)", 2);
    ctl("ADBE Slider Control", "Desenfoque de entrada", 0);
    ctl("ADBE Slider Control", "Subida de entrada (px)", 0);
    ctl("ADBE Checkbox Control", "Letras aleatorias", 0);
    ctl("ADBE Slider Control", "Duracion letras (f)", 9);
    ctl("ADBE Slider Control", "Sombra", 35);
    var C = 'thisComp.layer("Controles").effect';

    var l = comp.layers.addText("working for the guy"); l.name = "Linea";
    var p = l.property("ADBE Text Properties").property("ADBE Text Document"), d = p.value;
    d.resetCharStyle(); d.font = "AvenirNext-Bold"; d.fontSize = 168; d.tracking = -10; d.fillColor = [1, 1, 1]; d.applyFill = true; d.applyStroke = false;
    d.justification = ParagraphJustification.CENTER_JUSTIFY; p.setValue(d);
    var tr = l.property("ADBE Transform Group");
    tr.property("ADBE Anchor Point").setValue([0, -60]);
    tr.property("ADBE Position").expression = '[1080, 2380 + (50 - ' + C + '("Altura")(1)) * 30]';
    tr.property("ADBE Scale").expression = 's = ' + C + '("Tamano")(1) * 2; [s, s]';

    var ef = l.property("ADBE Effect Parade");
    var s = ef.addProperty("ADBE Drop Shadow");
    s.property("ADBE Drop Shadow-0002").expression = C + '("Sombra")(1) * 2.55';
    s.property("ADBE Drop Shadow-0003").setValue(180); s.property("ADBE Drop Shadow-0004").setValue(10); s.property("ADBE Drop Shadow-0005").setValue(40);

    var anims = l.property("ADBE Text Properties").property("ADBE Text Animators");
    // 1) Color base (relleno) del texto
    var a0 = anims.addProperty("ADBE Text Animator"); a0.name = "Color base";
    a0.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color").expression = C + '("Color")(1)';
    a0.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
    // 2) Resaltado: N palabras desde la palabra K
    var a1 = anims.addProperty("ADBE Text Animator"); a1.name = "Resaltado";
    a1.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color").expression = C + '("Color resaltado")(1)';
    var r1 = a1.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
    var adv = r1.property("ADBE Text Range Advanced");
    adv.property("ADBE Text Range Units").setValue(2);      // índice
    adv.property("ADBE Text Range Type2").setValue(3);      // palabras
    r1.property("ADBE Text Index Start").expression = 'Math.max(0, ' + C + '("Resaltar desde palabra")(1) - 1)';
    r1.property("ADBE Text Index End").expression = 'Math.max(0, ' + C + '("Resaltar desde palabra")(1) - 1) + Math.max(0, Math.round(' + C + '("Palabras resaltadas")(1)))';
    // 3) Revelado por palabras (opacidad + desenfoque + subida)
    var a2 = anims.addProperty("ADBE Text Animator"); a2.name = "Revelado palabras";
    var p2 = a2.property("ADBE Text Animator Properties");
    p2.addProperty("ADBE Text Opacity").setValue(0);
    p2.addProperty("ADBE Text Blur").expression = 'b = ' + C + '("Desenfoque de entrada")(1); [b, b]';
    p2.addProperty("ADBE Text Position 3D").expression = '[0, ' + C + '("Subida de entrada (px)")(1), 0]';
    var x2 = a2.property("ADBE Text Selectors").addProperty("ADBE Text Expressible Selector");
    x2.property("ADBE Text Range Type2").setValue(3);       // palabras
    x2.property("ADBE Text Expressible Amount").expression =
      'if (thisComp.layer("Controles").effect("Letras aleatorias")(1) == 1) { [0,0,0] } else {' +
      ' var t=(time-thisLayer.inPoint)/thisComp.frameDuration+1; var paso=thisComp.layer("Controles").effect("Retraso por palabra (f)")(1); var dur=Math.max(1,thisComp.layer("Controles").effect("Fundido (f)")(1));' +
      ' var k=Math.min(1,Math.max(0,(t-(textIndex-1)*paso)/dur)); k=1-Math.pow(1-k,2); var v=100*(1-k); [v,v,v] }';
    // 4) Revelado por letras en orden aleatorio (énfasis)
    var a3 = anims.addProperty("ADBE Text Animator"); a3.name = "Revelado letras";
    var p3 = a3.property("ADBE Text Animator Properties");
    p3.addProperty("ADBE Text Opacity").setValue(0);
    p3.addProperty("ADBE Text Position 3D").setValue([0, 70, 0]);
    var x3 = a3.property("ADBE Text Selectors").addProperty("ADBE Text Expressible Selector");
    x3.property("ADBE Text Range Type2").setValue(1);       // caracteres
    x3.property("ADBE Text Expressible Amount").expression =
      'if (thisComp.layer("Controles").effect("Letras aleatorias")(1) != 1) { [0,0,0] } else {' +
      ' seedRandom(textIndex, true); var t=(time-thisLayer.inPoint)/thisComp.frameDuration+1; var tot=Math.max(1,thisComp.layer("Controles").effect("Duracion letras (f)")(1));' +
      ' var ini=random(0, Math.max(0, tot-3)); var k=Math.min(1,Math.max(0,(t-ini)/3)); k=1-Math.pow(1-k,2); var v=100*(1-k); [v,v,v] }';
    var LA=comp.layer("Linea").property("ADBE Text Properties").property("ADBE Text Animators"), errs=[];
    for (var q=1;q<=LA.numProperties;q++){var A=LA.property(q),S=A.property("ADBE Text Selectors");for(var z=1;z<=S.numProperties;z++){var se=S.property(z);try{var am=se.property("ADBE Text Expressible Amount");if(am)errs.push(A.name+": "+(am.expressionError||"ok"));}catch(e){}}}
    out.push("expresiones: "+errs.join(" / "));

    comp.openInViewer();
    var n = 0;
    function egp(prop, nombre) { if (prop.canAddToMotionGraphicsTemplate(comp)) { prop.addToMotionGraphicsTemplateAs(comp, nombre); n++; } else out.push("no se puede anadir: " + nombre); }
    egp(p, "Texto");
    var L = [["Color", "Color del texto"], ["Color resaltado", "Color resaltado"], ["Resaltar desde palabra", "Resaltar desde la palabra n"], ["Palabras resaltadas", "Palabras resaltadas (0 = ninguna)"],
             ["Tamano", "Tamano (50 = normal)"], ["Altura", "Altura (50 = normal, mas = sube)"], ["Retraso por palabra (f)", "Retraso por palabra (fotogramas)"], ["Fundido (f)", "Fundido de cada palabra (fotogramas)"],
             ["Desenfoque de entrada", "Desenfoque de entrada"], ["Subida de entrada (px)", "Subida de entrada (px)"], ["Letras aleatorias", "Letras en orden aleatorio"], ["Duracion letras (f)", "Duracion del revelado de letras (fotogramas)"], ["Sombra", "Sombra (0 a 100)"]];
    for (var i = 0; i < L.length; i++) egp(fx.property(L[i][0]).property(1), L[i][1]);
    comp.motionGraphicsTemplateName = NOM;
    app.project.save(new File(DIR + "/" + NOM + ".aep"));
    var ok = comp.exportAsMotionGraphicsTemplate(true, DIR);
    out.push("controles: " + n, "exportado: " + ok, "archivo: " + new File(DIR + "/" + NOM + ".mogrt").exists);
    app.endSuppressDialogs(false);
  } catch (e) { try { app.endSuppressDialogs(false); } catch (e2) {} out.push("ERROR " + e.toString() + " linea " + e.line); }
  var f = new File("/Users/luiyi/Videos-Remotion/ae/resultado.txt"); f.encoding = "UTF-8"; f.open("w"); f.write(out.join(" | ")); f.close();
})();
