// edits_lib.jsx — los "presets" de la clase EDITS (videoclip con VFX). Se carga después de ae_lib.jsx y teclas_lib.jsx.
// Cada función es un efecto de la clase que se reutiliza en varias tomas (lo que el profe guarda como preset).
// Tiempos en FOTOGRAMAS a 30 fps (fr(n) = segundos). Música a 90 BPM → 1 golpe = 20 fotogramas.

var BPM = 90, GOLPE = 20;
var CLIPS = {};   // nombre corto → FootageItem (lo llena importarClips)

// ---------- importar ----------
function importarClips(carpetaDisco, lista) {
  var fol = folder("Clips (Pexels)");
  for (var i = 0; i < lista.length; i++) {
    var nom = lista[i][1], it = byName(nom);
    if (!it) {
      var io = new ImportOptions(new File(carpetaDisco + lista[i][0]));
      it = app.project.importFile(io);
      it.name = nom;
    }
    it.parentFolder = fol;
    CLIPS[lista[i][2]] = it;
  }
  return fol;
}
function clip(corto) {
  if (CLIPS[corto]) return CLIPS[corto];
  var mapa = {bailarin: "Bailarín (verde, 4K 60)", bailarina: "Bailarina (verde, 4K 60)", bokeh: "Calle de noche desenfocada", edificio: "Calle con edificio y coches"};
  CLIPS[corto] = byName(mapa[corto]);
  return CLIPS[corto];
}

// ---------- recorte del artista (lo que en la clase es la ROTOSCOPIA) ----------
// El profe usa Roto Brush (no se puede por script); aquí el artista está sobre verde → Keylight.
// Su "calado 12 y desplazamiento un poco menos" = Screen Softness (suaviza el borde) y Screen Shrink/Grow negativo (lo mete hacia dentro).
var VERDE = {bailarin: [0.565, 0.608, 0.412], bailarina: [0.40, 0.44, 0.26]};
function keylight(L, quien, o) {
  o = o || {};
  var k = FX(L, "Keylight 906");
  k.name = "Keylight (recorte del artista)";
  k.property("Keylight 906-0004").setValue(VERDE[quien]);              // Screen Colour (medido en el clip)
  k.property("Keylight 906-0005").setValue(o.gain || 110);             // Screen Gain
  k.property("Keylight 906-0006").setValue(o.balance === undefined ? 95 : o.balance);   // Screen Balance (95: fondo verde apagado)
  k.property("Keylight 906-0010").setValue(o.preblur === undefined ? 1.5 : o.preblur);  // Screen Pre-blur: quita el ruido de compresión
  k.property("Keylight 906-0012").setValue(o.clipNegro === undefined ? 18 : o.clipNegro);  // Clip Black: el fondo del todo transparente
  k.property("Keylight 906-0013").setValue(o.clipBlanco === undefined ? 75 : o.clipBlanco); // Clip White: el cuerpo del todo opaco
  k.property("Keylight 906-0015").setValue(o.encoge === undefined ? -1 : o.encoge);       // Screen Shrink/Grow ("desplazamiento")
  k.property("Keylight 906-0016").setValue(o.calado === undefined ? 1.2 : o.calado);       // Screen Softness ("calado")
  if (o.vista) k.property("Keylight 906-0002").setValue(o.vista);   // 5 = Screen Matte (ver el blanco y negro)
  return k;
}
// color: los clips vienen planos (perfil "log") y con reflejo verde; la calle es de noche y naranja
function colorArtista(L, quien) {
  var s = FX(L, "ADBE Spill2");                                    // quitar el verde que rebota en la piel/ropa
  s.property("ADBE Spill2-0003").setValue(VERDE[quien]);
  var lv = FX(L, "ADBE Easy Levels2");                             // contraste y más oscuro (luz de noche)
  lv.property("ADBE Easy Levels2-0003").setValue(0.07);
  lv.property("ADBE Easy Levels2-0004").setValue(0.95);
  lv.property("ADBE Easy Levels2-0005").setValue(0.85);
  lv.property("ADBE Easy Levels2-0007").setValue(0.84);
  var v = FX(L, "ADBE Vibrance"); v.property(1).setValue(22);
  var p = FX(L, "ADBE Photo Filter"); p.property("ADBE Photo Filter-0003").setValue(32);   // filtro cálido (farolas)
}
// precomp del artista recortado (1920×1080, 60 fps, todo el clip). Se pre-renderiza una vez (ProRes con alfa)
// porque el Keylight a 4K es lo más pesado y luego se usa muchas veces (brillo, eco de 8 copias, clones…).
// Primero el clip 4K se reduce a 1080 en su propia comp ("Fuente 1080"): así el Keylight y el color trabajan
// con 4 veces menos píxeles (medido: 47 s por segundo de clip a 4K). El video final es 1080, no se pierde nada.
function fuente1080(quien) {
  var it = clip(quien), nombre = "Fuente 1080 · " + it.name;
  var c = compNom(nombre);
  if (!c) c = app.project.items.addComp(nombre, 1920, 1080, 1, it.duration, 60);
  vaciar(c);
  c.duration = it.duration; c.frameRate = 60;
  c.parentFolder = folder("Artistas (recorte)");
  var L = c.layers.add(it);
  var s = 1920 / it.width * 100;
  T(L).property("ADBE Scale").setValue([s, s]);
  T(L).property("ADBE Position").setValue([960, 540]);
  return c;
}
function compArtista(quien, nombre, conNucleo, o) {
  var it = clip(quien), src = fuente1080(quien);
  var c = compNom(nombre);
  if (!c) c = app.project.items.addComp(nombre, 1920, 1080, 1, it.duration, 60);
  vaciar(c);
  c.duration = it.duration; c.frameRate = 60; c.bgColor = [0, 0, 0];
  c.parentFolder = folder("Artistas (recorte)");
  var L = c.layers.add(src);
  L.name = "Borde (Keylight fino)";
  // antes del recorte: suavizar SOLO el color (no el detalle). El video viene muy comprimido y, al quitar el verde,
  // las diferencias de color entre bloques de compresión salían como un "puntillado" oscuro en la ropa.
  var bc = FX(L, "S_BlurChroma"); bc.name = "Suavizar color (antes del recorte)";
  bc.property("S_BlurChroma-0050").setValue(6);
  keylight(L, quien, o);
  colorArtista(L, quien);
  if (conNucleo) {
    // núcleo: la misma clave sin suavizar + "cerrar huecos" (Matte Choker: primero ensancha, luego vuelve a encoger)
    var N = L.duplicate();
    N.name = "Núcleo (rellena huecos)";
    N.moveAfter(L);
    var k = N.property("ADBE Effect Parade").property("Keylight 906");
    k.property("Keylight 906-0015").setValue(0);
    k.property("Keylight 906-0016").setValue(0);
    var m = FX(N, "ADBE Matte Choker");
    m.property(1).setValue(3); m.property(2).setValue(-100); m.property(3).setValue(0.1);
    m.property(4).setValue(3); m.property(5).setValue(100); m.property(6).setValue(1);
    var sc = FX(N, "ADBE Simple Choker"); sc.property(2).setValue(1);
  }
  return c;
}
// footage pre-renderizado del artista (ProRes 4444 con alfa)
function artista(quien) { return byName(quien === "bailarin" ? "Bailarín recortado (alfa)" : "Bailarina recortada (alfa)"); }

// capa del artista recortado, a tamaño de la comp (los clips son 4K → 50 %), con su tramo del clip
// desde/hasta en SEGUNDOS del clip; vel = velocidad (1 normal, 0.5 = cámara lenta, que con 60 fps queda suave)
// quien: "bailarin" / "bailarina" / "bokeh" / "edificio" (clip original) o "@bailarin" / "@bailarina" (ya recortado, con alfa)
function capaClip(comp, quien, desde, f0, durFr, vel, nombre) {
  var it = quien.charAt(0) === "@" ? artista(quien.substr(1)) : clip(quien);
  var L = comp.layers.add(it);
  L.name = nombre || it.name;
  var s = comp.width / it.width * 100;
  T(L).property("ADBE Scale").setValue([s, s]);
  T(L).property("ADBE Position").setValue([comp.width / 2, comp.height / 2]);
  vel = vel || 1;
  L.stretch = 100 / vel;
  // el fotograma f0 de la comp muestra el segundo "desde" del clip
  L.startTime = fr(f0) - desde / vel;
  L.inPoint = fr(f0);
  L.outPoint = fr(f0 + durFr);
  return L;
}

// el clip AL REVÉS (lo que en la clase es Ctrl+Alt+R), con Time Remap: de tClip hacia atrás a velocidad vel.
// OJO: con Estirar en negativo (stretch -100), After Effects también da la vuelta a las keys de la capa (opacidad,
// posición…) y aparecían en otro sitio; con Time Remap las keys se quedan donde se ponen.
function capaAlReves(comp, quien, tClip, vel, f0, durFr, nombre) {
  var it = artista(quien);
  var L = comp.layers.add(it);
  L.name = nombre;
  var s = comp.width / it.width * 100;
  T(L).property("ADBE Scale").setValue([s, s]);
  T(L).property("ADBE Position").setValue([comp.width / 2, comp.height / 2]);
  L.startTime = 0;
  L.timeRemapEnabled = true;
  var tr = L.property("ADBE Time Remapping");
  tr.setValueAtTime(fr(f0), tClip);
  tr.setValueAtTime(fr(f0 + durFr), Math.max(0, tClip - durFr / FPS * vel));
  var n = 0;
  for (var k = tr.numKeys; k >= 1 && n++ < 20; k--) {
    var tk = tr.keyTime(k);
    if (Math.abs(tk - fr(f0)) > 0.001 && Math.abs(tk - fr(f0 + durFr)) > 0.001) tr.removeKey(k);
  }
  for (k = 1; k <= tr.numKeys; k++) tr.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR);
  L.inPoint = fr(f0); L.outPoint = fr(f0 + durFr);
  return L;
}

// ---------- montaje ----------
// las tomas (fotograma de inicio y duración en el montaje). Cada toma es una precomp ("precomponer" de la clase).
var TOMAS = [
  {n: 1, nombre: "Toma 1 · Brillo detrás del artista", f0: 0, dur: 120},
  {n: 2, nombre: "Toma 2 · Dos zooms (tac, tac)", f0: 120, dur: 80},
  {n: 3, nombre: "Toma 3 · Fondo infinito", f0: 200, dur: 100},
  {n: 4, nombre: "Toma 4 · Cara fija + zoom", f0: 300, dur: 80},
  {n: 5, nombre: "Toma 5 · Texto 3D", f0: 380, dur: 100},
  {n: 6, nombre: "Toma 6 · Eco fantasma", f0: 480, dur: 80},
  {n: 7, nombre: "Toma 7 · Entra + clones", f0: 560, dur: 100},
  {n: 8, nombre: "Toma 8 · Giro + meterse en el camión", f0: 660, dur: 140}
];
var MASTER = "EDITS · Videoclip", DUR_TOTAL = 800;
function toma(n) { return TOMAS[n - 1]; }
function compToma(n) {
  var t = toma(n);
  var c = nuevaComp(t.nombre, t.dur, "Tomas");
  c.bgColor = [0, 0, 0];
  return c;
}
// capa de ajuste del largo indicado (fotogramas de la comp)
function ajuste(comp, nombre, f0, f1) {
  var A = comp.layers.addSolid([1, 1, 1], nombre, comp.width, comp.height, 1);
  A.adjustmentLayer = true;
  A.inPoint = fr(f0 === undefined ? 0 : f0);
  A.outPoint = fr(f1 === undefined ? comp.duration * FPS : f1);
  return A;
}
// keys de una propiedad desde [[f, v], …] con curva de Flow entre cada par (curva = [x1, y1, x2, y2])
function keysFlow(p, lista, curva) {
  var n = 0; while (p.numKeys > 0 && n++ < 500) p.removeKey(1);
  for (var i = 0; i < lista.length; i++) p.setValueAtTime(fr(lista[i][0]), lista[i][1]);
  if (curva) for (var k = 1; k < p.numKeys; k++) flowCurva(p, k, curva);
  return p;
}
// curvas de Flow que usa el profe
var CURVA = {
  lentoRapidoLento: [0.7, 0, 0.3, 1],     // "arranca lento, va rápido y termina lento" (su favorita, zooms)
  rapidoLento: [0.1, 0.9, 0.25, 1],        // "empieza rápido, frena lento" (entradas, texto que cae)
  lentoRapido: [0.75, 0, 0.9, 0.35],       // "arranca lento y acelera" (fondo infinito, salidas, zambullida)
  rapidoLentoRapido: [0.1, 0.65, 0.9, 0.35] // "empieza rápido, va lento y termina rápido" (zoom de los clones)
};

// ---------- lista de parámetros de un efecto (para conocerlo antes de usarlo) ----------
function listarParams(e) {
  var o = [];
  for (var i = 1; i <= e.numProperties; i++) {
    var p = e.property(i), v = "";
    try { if (p.propertyValueType !== PropertyValueType.NO_VALUE) { v = p.value; if (v instanceof Array) v = "[" + v.join(", ") + "]"; } } catch (x) { v = "?"; }
    o.push(i + " " + p.name + " | " + p.matchName + " = " + v);
  }
  return o;
}
