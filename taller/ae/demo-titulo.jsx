(function () {
    var log = [];
    app.beginUndoGroup("Claude: demo titulo");
    try {
        var comp = app.project.items.addComp("Claude - Titulo demo", 1920, 1080, 1, 3, 30);

        var texto = comp.layers.addText("MOTION GRAPHICS");
        var prop = texto.property("Source Text");
        var doc = prop.value;
        doc.fontSize = 130;
        doc.fillColor = [1, 1, 1];
        doc.justification = ParagraphJustification.CENTER_JUSTIFY;
        prop.setValue(doc);
        texto.property("Position").setValue([960, 520]);

        // Animador por caracteres: entran desde abajo con opacidad
        var animador = texto.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator");
        var props = animador.property("ADBE Text Animator Properties");
        props.addProperty("ADBE Text Position 3D").setValue([0, 80, 0]);
        props.addProperty("ADBE Text Opacity").setValue(0);
        var selector = animador.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
        var inicio = selector.property("ADBE Text Percent Start");
        inicio.setValueAtTime(0, 0);
        inicio.setValueAtTime(0.8, 100);
        var suave = new KeyframeEase(0, 75);
        inicio.setTemporalEaseAtKey(2, [suave], [suave]);

        var barra = comp.layers.addShape();
        barra.name = "Barra";
        var grupo = barra.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        var rect = grupo.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Rect");
        rect.property("ADBE Vector Rect Size").setValue([900, 8]);
        rect.property("ADBE Vector Rect Roundness").setValue(4);
        grupo.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue([1, 0.83, 0, 1]);
        barra.property("Position").setValue([960, 585]);
        var escala = barra.property("Scale");
        escala.setValueAtTime(0.2, [0, 100]);
        escala.setValueAtTime(1.0, [100, 100]);
        escala.setTemporalEaseAtKey(2, [suave, suave, suave], [suave, suave, suave]);

        var sub = comp.layers.addText("hecho con Claude + After Effects");
        var sprop = sub.property("Source Text");
        var sdoc = sprop.value;
        sdoc.fontSize = 44;
        sdoc.fillColor = [1, 1, 1];
        sdoc.justification = ParagraphJustification.CENTER_JUSTIFY;
        sprop.setValue(sdoc);
        sub.property("Position").setValue([960, 660]);
        var op = sub.property("Opacity");
        op.setValueAtTime(0.6, 0);
        op.setValueAtTime(1.2, 100);

        comp.openInViewer();
        log.push("ok comp=" + comp.name + " capas=" + comp.numLayers);
    } catch (e) {
        log.push("error: " + e.toString() + " linea " + e.line);
    }
    app.endUndoGroup();
    var f = new File("/Users/luiyi/Videos-Remotion/ae/resultado.txt");
    f.open("w"); f.write(log.join("\n")); f.close();
})();
