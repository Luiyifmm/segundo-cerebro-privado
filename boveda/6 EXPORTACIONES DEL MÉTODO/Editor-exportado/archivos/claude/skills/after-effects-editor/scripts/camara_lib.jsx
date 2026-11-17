// camara_lib.jsx — ayudas de la Tanda 04 · 02 "How to MASTER 3D Camera" (se carga después de ae_lib.jsx y teclas_lib.jsx).
// Comp a 60 fps (la del profe), texto que aparece letra a letra (como su preset gratis "Type Array"), marcador amarillo en
// modo Oscurecer, las 3 curvas que usa en el editor de gráficos y el "punto" (2 líneas + marcador colgados de un nulo 3D).
var F60 = 60;
function s60(f) { return f / F60; }
var AMARILLO = [1, 0.93, 0.0];       // #FFED00, el subrayador
var TINTA = [0.07, 0.07, 0.07];      // casi negro
var SERIF = "AppleGaramond-Italic", SERIF_B = "AppleGaramond-BoldItalic";

// comp nueva a 60 fps (o la misma, vaciada)
function comp60(nombre, w, h, durSeg, carpeta) {
  var c = compNom(nombre);
  if (!c) c = app.project.items.addComp(nombre, w, h, 1, durSeg, F60);
  vaciar(c);
  c.width = w; c.height = h; c.duration = durSeg; c.frameRate = F60;
  c.shutterAngle = 180; c.shutterPhase = -90;
  if (carpeta) c.parentFolder = folder(carpeta);
  return c;
}

// ---- las 3 curvas del profe (entre la key k y la k+1), cambiando solo el lado que toca
function ponSalida(p, k, vel, infl) { var ei = p.keyInTemporalEase(k), eo = []; for (var j = 0; j < ei.length; j++) eo.push(new KeyframeEase(vel, infl)); p.setTemporalEaseAtKey(k, ei, eo); }
function ponLlegada(p, k, vel, infl) { var eo = p.keyOutTemporalEase(k), ei = []; for (var j = 0; j < eo.length; j++) ei.push(new KeyframeEase(vel, infl)); p.setTemporalEaseAtKey(k, ei, eo); }
// 1) "curva de entrada": F9 y los dos tiradores a la izquierda del todo → sale disparada y pierde velocidad muy despacio
function curvaEntrada(p, k) { ponSalida(p, k, 0, 0.1); ponLlegada(p, k + 1, 0, 100); }
// 2) "montaña suave" (60 y 60 de influencia): arranca lento, gana velocidad y la pierde igual de suave
function montanaSuave(p, k) { ponSalida(p, k, 0, 60); ponLlegada(p, k + 1, 0, 60); }
// 3) "gana y pierde": F9 y solo la última key a la izquierda → sale suave (33 %) y aterriza larguísimo (100 %)
function ganaYPierde(p, k) { ponSalida(p, k, 0, 33.33); ponLlegada(p, k + 1, 0, 100); }
// 4) "que no se pare de golpe" (Tanda 04 · 04): 3 keys en una propiedad 1D (posición separada o Z): arranca (t0), una key
// CONTINUA cerca del final (t1, a "frac" del recorrido) y la última más lejos (t2). Pico de velocidad en medio (ahí va el
// corte o el destello) y una cola que frena SIEMPRE. Medido: velocidad en la continua = 2,5 × la media de la cola, salida
// de la continua 20 % y llegada final ≤ 55 % (la cola tiene que ser cóncava: si no, repunta o se pasa y vuelve).
function movConCola(p, t0, v0, t1, t2, v2, frac, inflSal, inflCont, inflFin) {
  var v1 = v0 + (v2 - v0) * frac;
  p.setValueAtTime(t0, v0); p.setValueAtTime(t1, v1); p.setValueAtTime(t2, v2);
  var velCola = (v2 - v1) / (t2 - t1) * 2.5;
  p.setTemporalEaseAtKey(1, [new KeyframeEase(0, 33)], [new KeyframeEase(0, inflSal)]);
  p.setTemporalEaseAtKey(2, [new KeyframeEase(velCola, inflCont)], [new KeyframeEase(velCola, 20)]);
  p.setTemporalContinuousAtKey(2, true);
  p.setTemporalEaseAtKey(3, [new KeyframeEase(0, Math.min(inflFin, 55))], [new KeyframeEase(0, 33)]);
}

// ---- texto que aparece letra a letra (como "Type Array": cada letra 2 fotogramas después de la anterior)
// cada letra: opacidad 0 → 100, desenfoque 12 → 0 y sube 18 px, en durFr fotogramas, con salida rápida
function aparecerLetras(L, t0, retrasoFr, durFr) {
  var an = L.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator");
  an.name = "Aparece letra a letra (tipo Type Array)";
  var pr = an.property("ADBE Text Animator Properties");
  pr.addProperty("ADBE Text Opacity").setValue(0);
  pr.addProperty("ADBE Text Blur").setValue([12, 12]);
  var po = pr.addProperty("ADBE Text Position 3D");
  try { po.setValue([0, 18, 0]); } catch (e) { po.setValue([0, 18]); }
  var sel = an.property("ADBE Text Selectors").addProperty("ADBE Text Expressible Selector");
  sel.property("ADBE Text Range Type2").setValue(2);   // letras, sin contar espacios
  sel.property("ADBE Text Expressible Amount").expression =
    "// cada letra entra " + retrasoFr + " fotogramas después de la anterior (el \"Delay (Frames)\" del preset del profe)\n" +
    "var t0 = " + t0 + ", d = " + retrasoFr + " / 60, dur = " + durFr + " / 60;\n" +
    "var p = clamp((time - (t0 + (textIndex - 1) * d)) / dur, 0, 1);\n" +
    "p = 1 - Math.pow(1 - p, 3);\n" +
    "(1 - p) * 100";
  return an;
}
function letras(s) { var n = 0; for (var i = 0; i < s.length; i++) if (s.charAt(i) !== " ") n++; return n; }

// ---- un "punto" de la clase: 2 líneas de texto + subrayador amarillo en la segunda, colgados de un nulo 3D.
// El nulo lleva un deslizador "Desenfoque" que leen las 3 capas (la profundidad de campo "a mano" del profe).
// o = {pos, rotZ, tam, t0 (aparece), marcador: [t0, t1] (crece de izquierda a derecha), curvaMarcador}
function punto(comp, nombre, l1, l2, o) {
  var g = comp.layers.addNull(comp.duration); g.name = nombre; g.threeDLayer = true;
  T(g).property("ADBE Anchor Point").setValue([0, 0, 0]);
  T(g).property("ADBE Position").setValue(o.pos);
  T(g).property("ADBE Rotate Z").setValue(o.rotZ || 0);
  var sl = g.property("ADBE Effect Parade").addProperty("ADBE Slider Control"); sl.name = "Desenfoque";
  var tam = o.tam;
  var a = txt(comp, l1, SERIF, tam, TINTA, [0, 0], {name: nombre + " · " + l1});
  var b = txt(comp, l2, SERIF, tam, TINTA, [0, 0], {name: nombre + " · " + l2});
  var y1 = -0.43 * tam, y2 = 0.43 * tam;
  var r2 = b.sourceRectAtTime(0, false);
  // subrayador: rectángulo con el borde izquierdo en x = 0 de su capa (así la escala X crece desde la izquierda)
  var w = r2.width + 0.2 * tam, h = 0.42 * tam;
  var m = newShape(comp, nombre + " · subrayador");
  var gm = grp(m, "subrayador"); rectP(gm, [w, h], [w / 2, 0], 3); fill(gm, AMARILLO);
  m.blendingMode = BlendingMode.DARKEN;   // como el profe: el amarillo tiñe el fondo y la cuadrícula se ve a través
  var capas = [a, b, m];
  for (var i = 0; i < capas.length; i++) {
    var L = capas[i];
    L.threeDLayer = true; L.motionBlur = true;
    L.parent = g;
    T(L).property("ADBE Scale").setValue([100, 100, 100]);
    T(L).property("ADBE Orientation").setValue([0, 0, 0]);
    T(L).property("ADBE Rotate Z").setValue(0);
    var bl = blur(L, 0); bl = L.property("ADBE Effect Parade").property(1);
    bl.property("ADBE Gaussian Blur 2-0001").expression = "thisComp.layer(\"" + nombre + "\").effect(\"Desenfoque\")(\"Slider\")";
  }
  T(a).property("ADBE Position").setValue([0, y1, 0]);
  T(b).property("ADBE Position").setValue([0, y2, 0]);
  T(m).property("ADBE Anchor Point").setValue([0, 0, 0]);
  T(m).property("ADBE Position").setValue([-w / 2, y2 + 0.13 * tam, 3]);   // 3 px por detrás del texto: así no pelean en Z
  aparecerLetras(a, o.t0, 2, 24);
  aparecerLetras(b, o.t0 + letras(l1) * 2 / 60, 2, 24);
  var sc = T(m).property("ADBE Scale");
  sc.setValueAtTime(o.marcador[0], [0, 100, 100]); sc.setValueAtTime(o.marcador[1], [100, 100, 100]);
  (o.curvaMarcador || ganaYPierde)(sc, 1);
  return {nulo: g, l1: a, l2: b, marcador: m};
}
