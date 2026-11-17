// teclas_lib.jsx — ayudas del proyecto "Domina los Keyframes" (Tanda 03 · 03). Se carga después de ae_lib.jsx.
// Todo en 1920×1080 a 30 fps, fondo oscuro como en la clase. Los tiempos van en FOTOGRAMAS (fr(n) = segundos).
var FPS = 30;
var COL = {
  fondo1: hex("16181F"), fondo2: hex("07080B"),
  azul: hex("1F78FF"), ambar: hex("FFAA1F"), rojo: hex("F2285A"), lila: hex("A63CFF"), rosa: hex("FF3FA6"),
  cian: hex("2FD0FF"), naranja: hex("FF8A1F"), amarillo: hex("FFD23F"), verde: hex("33E08A"),
  texto: hex("F2F3F7"), gris: hex("8A90A0"), grisOsc: hex("3A3F4C")
};
var FUENTE = {negra: "Gotham-Black", media: "Gotham-Medium", libro: "Gotham-Book"};
function fr(n) { return n / FPS; }
function compNom(n) { for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === n) return it; } return null; }
function capaNom(comp, n) { for (var i = 1; i <= comp.numLayers; i++) if (comp.layer(i).name === n) return comp.layer(i); return null; }
function vaciar(comp) { var n = 0; while (comp.numLayers > 0 && n++ < 2000) { comp.layer(1).locked = false; comp.layer(1).remove(); } }
// comp nueva (o la misma vaciada) en la carpeta indicada
function nuevaComp(nombre, durFr, carpeta) {
  var c = compNom(nombre);
  if (!c) c = app.project.items.addComp(nombre, 1920, 1080, 1, durFr / FPS, FPS);
  vaciar(c);
  c.duration = durFr / FPS; c.frameRate = FPS; c.bgColor = COL.fondo2;
  c.shutterAngle = 180; c.shutterPhase = -90;
  if (carpeta) c.parentFolder = folder(carpeta);
  return c;
}
// fondo: degradado radial oscuro (sin bandas) — "fondos nunca planos"
function fondoOscuro(comp) {
  var L = bgRadial(comp, COL.fondo1, COL.fondo2, [960, 470], 1250, "Fondo");
  L.locked = true;
  return L;
}
// rótulo grande y tenue detrás del objeto (como "LINEAR" / "BEZIER" / "HOLD" en la clase)
function rotulo(comp, s, pos, col, size, op) {
  var L = txt(comp, s, FUENTE.negra, size || 96, col, pos, {track: 20, name: "Rótulo · " + s});
  T(L).property("ADBE Opacity").setValue(op === undefined ? 16 : op);
  return L;
}
// texto pequeño (explicación)
function nota(comp, s, pos, size, col, just) {
  return txt(comp, s, FUENTE.media, size || 30, col || COL.gris, pos, {just: just, name: "Nota · " + s.substr(0, 24)});
}
// cabecera de cada demo: número + título arriba a la izquierda y la idea abajo
function cabecera(comp, num, titulo, idea) {
  var a = txt(comp, num, FUENTE.negra, 34, COL.ambar, [90, 78], {just: ParagraphJustification.LEFT_JUSTIFY, name: "Cabecera · número"});
  var b = txt(comp, titulo, FUENTE.negra, 34, COL.texto, [170, 78], {just: ParagraphJustification.LEFT_JUSTIFY, track: 30, name: "Cabecera · título"});
  var c = idea ? txt(comp, idea, FUENTE.libro, 30, COL.gris, [960, 1010], {name: "Cabecera · idea"}) : null;
  return [a, b, c];
}

// ---------- icono de key: mitad izquierda = LLEGADA (in), mitad derecha = SALIDA (out) ----------
// tipos: "lin" (rombo: velocidad constante), "bez" (reloj de arena: suavizado), "hold" (cuadrado: salto), "auto" (círculo: auto bézier)
function mitadIcono(tipo, lado, r) {
  var s = lado;                       // -1 izquierda, +1 derecha
  var v, i, o;
  if (tipo === "lin") { v = [[0, -r], [s * r, 0], [0, r]]; }
  else if (tipo === "bez") { v = [[0, -r], [s * 0.86 * r, -r], [s * 0.22 * r, 0], [s * 0.86 * r, r], [0, r]]; }
  else if (tipo === "hold") { v = [[0, -r], [s * 0.92 * r, -r], [s * 0.92 * r, r], [0, r]]; }
  else { var k = 0.5523 * r; v = [[0, -r], [s * r, 0], [0, r]]; i = [[0, 0], [0, -k], [s * k, 0]]; o = [[s * k, 0], [0, k], [0, 0]]; }
  if (!i) { i = []; o = []; for (var n = 0; n < v.length; n++) { i.push([0, 0]); o.push([0, 0]); } }
  return {v: v, i: i, o: o};
}
function capaIcono(comp, nombre, tipoIzq, tipoDer, r, col, pos) {
  var L = newShape(comp, nombre);
  var halves = [["Salida (out)", tipoDer, 1, col], ["Llegada (in)", tipoIzq, -1, mix(col, [0, 0, 0], 0.22)]];
  for (var h = 0; h < 2; h++) {
    var m = mitadIcono(halves[h][1], halves[h][2], r);
    var g = grp(L, halves[h][0]);
    pathP(g, m.v, true, m.i, m.o);
    fill(g, halves[h][3]);
  }
  T(L).property("ADBE Position").setValue(pos);
  return L;
}
// pelota con volumen: sólido con máscara circular + degradado radial (brillo arriba a la izquierda)
function capaBola(comp, nombre, radio, cLuz, cSombra, pos) {
  var d = Math.round(radio * 2);
  var L = comp.layers.addSolid([1, 1, 1], nombre, d, d, 1);
  var m = L.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
  var sh = new Shape(), k = 0.5523 * radio, c = radio;
  sh.vertices = [[c, 0], [d, c], [c, d], [0, c]];
  sh.inTangents = [[-k, 0], [0, -k], [k, 0], [0, k]];
  sh.outTangents = [[k, 0], [0, k], [-k, 0], [0, -k]];
  sh.closed = true;
  m.property("ADBE Mask Shape").setValue(sh);
  ramp(L, [d * 0.34, d * 0.3], cLuz, [d * 0.34 + radio * 1.55, d * 0.3], cSombra, true, 12);
  T(L).property("ADBE Position").setValue(pos);
  return L;
}
// keys desde una lista: [{f, v, vIn, iIn, vOut, iOut, lin, hold, rov}] (f en fotogramas; velocidades en unidades/s)
function ponerKeys(p, lista) {
  var n = 0; while (p.numKeys > 0 && n++ < 500) p.removeKey(1);
  for (var a = 0; a < lista.length; a++) p.setValueAtTime(fr(lista[a].f), lista[a].v);
  var holds = [];
  for (var b = 0; b < lista.length; b++) {
    var q = lista[b], k = b + 1;
    if (q.lin) p.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR);
    else if (q.vIn !== undefined || q.vOut !== undefined || q.iIn !== undefined || q.iOut !== undefined)
      claveEase(p, k, q.vIn || 0, q.iIn === undefined ? 33.33 : q.iIn, q.vOut || 0, q.iOut === undefined ? 33.33 : q.iOut);
    if (q.hold) holds.push(k);
  }
  // las retenciones al final (setTemporalEaseAtKey las quita)
  for (var h = 0; h < holds.length; h++) p.setInterpolationTypeAtKey(holds[h], KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD);
  return p;
}
// tiradores del trayecto (posición): lista de [inT, outT] por key; null = esquina
function tiradores(p, lista) {
  for (var k = 1; k <= p.numKeys && k <= lista.length; k++) {
    p.setSpatialAutoBezierAtKey(k, false);
    var t = lista[k - 1] || [[0, 0], [0, 0]];
    p.setSpatialContinuousAtKey(k, !!(lista[k - 1] && lista[k - 1][2]));
    p.setSpatialTangentsAtKey(k, [t[0][0], t[0][1], 0], [t[1][0], t[1][1], 0]);
  }
}
// "puntitos" del trayecto: la posición en cada fotograma (lo que AE dibuja en el visor), para verlo en el render
function puntosFotograma(comp, capa, f0, f1, col, tam, op) {
  var p = T(capa).property("ADBE Position");
  var L = newShape(comp, "Fotogramas · " + capa.name);
  var g = grp(L, "puntos");
  for (var f = f0; f <= f1; f++) {
    var v = p.valueAtTime(fr(f), false);
    ellP(g, [tam || 7, tam || 7], [v[0], v[1]]);
  }
  fill(g, col);
  T(L).property("ADBE Opacity").setValue(op === undefined ? 70 : op);
  L.moveAfter(capa);
  return L;
}
// eco (lo que usa el profe para enseñar la velocidad): capa de ajuste arriba con Echo hacia atrás
function eco(comp, copias, caida) {
  var A = comp.layers.addSolid([1, 1, 1], "AJUSTE · Eco (estela de fotogramas)", 1920, 1080, 1);
  A.adjustmentLayer = true;
  var e = FX(A, "ADBE Echo");
  e.property(1).setValue(-1 / FPS);          // Echo Time: un fotograma hacia atrás
  e.property(2).setValue(copias || 10);       // Number of Echoes
  e.property(3).setValue(1);                  // Starting Intensity
  e.property(4).setValue(caida || 0.78);      // Decay
  e.property(5).setValue(5);                  // Echo Operator: Composite In Back (lo actual, delante)
  A.moveToBeginning();
  return A;
}
// gráfico de velocidad de una capa (lo que se ve en el editor de gráficos), dibujado en la comp + cabezal que se mueve
function grafVelocidad(comp, capa, f0, f1, rect, col, titulo) {
  var p = T(capa).property("ADBE Position");
  var pasos = (f1 - f0) * 4, vs = [], vmax = 1;
  for (var n = 0; n <= pasos; n++) {
    // dentro del tramo (en las keys justas, la diferencia mezclaría el antes y el después)
    var t = Math.min(fr(f1) - 0.003, Math.max(fr(f0) + 0.003, fr(f0) + (fr(f1) - fr(f0)) * n / pasos));
    var a = p.valueAtTime(t - 0.002, false), b = p.valueAtTime(t + 0.002, false);
    var v = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])) / 0.004;
    vs.push(v); if (v > vmax) vmax = v;
  }
  var x0 = rect[0], y0 = rect[1], w = rect[2], h = rect[3];
  var L = newShape(comp, "Gráfico de velocidad · " + capa.name);
  var ga = grp(L, "ejes");
  pathP(ga, [[x0, y0], [x0, y0 + h], [x0 + w, y0 + h]], false);
  stroke(ga, COL.grisOsc, 2);
  var gc = grp(L, "curva");
  var pts = [];
  for (var m = 0; m < vs.length; m++) pts.push([x0 + w * m / pasos, y0 + h - (h - 6) * vs[m] / vmax]);
  pathP(gc, pts, false);
  stroke(gc, col, 4);
  var et = txt(comp, titulo || "velocidad", FUENTE.media, 22, COL.gris, [x0, y0 - 18], {just: ParagraphJustification.LEFT_JUSTIFY, name: "Gráfico · rótulo · " + capa.name});
  // cabezal: un punto que recorre la curva (lee la velocidad real de la capa)
  var D = newShape(comp, "Gráfico · cabezal · " + capa.name);
  var gd = grp(D, "punto");
  ellP(gd, [18, 18], [0, 0]);
  fill(gd, COL.texto);
  stroke(gd, col, 4);
  T(D).property("ADBE Position").expression =
    "// recorre el gráfico: x = tiempo, y = velocidad de la capa \"" + capa.name + "\"\n" +
    "var p = thisComp.layer(\"" + capa.name + "\").transform.position;\n" +
    "var t = clamp(time, " + fr(f0) + ", " + fr(f1) + ");\n" +
    "var v = length(p.velocityAtTime(t));\n" +
    "[" + x0 + " + " + w + " * (t - " + fr(f0) + ") / " + (fr(f1) - fr(f0)) + ", " + (y0 + h) + " - " + (h - 6) + " * Math.min(v, " + vmax + ") / " + vmax + "]";
  return {curva: L, cabezal: D, rotulo: et, vmax: vmax};
}
