// ae_lib.jsx — funciones de ayuda probadas para construir escenas en After Effects por script.
// Uso: $.evalFile("…/herramientas/ae_lib.jsx"); y luego llamar a las funciones (ES3: sin let/const ni =>).
// Nombres internos (matchNames) en "Referencia - parámetros de efectos (matchNames).md".

// ---------- básicos ----------
function hex(h) { h = h.replace("#", ""); return [parseInt(h.substr(0, 2), 16) / 255, parseInt(h.substr(2, 2), 16) / 255, parseInt(h.substr(4, 2), 16) / 255]; }
function T(L) { return L.property("ADBE Transform Group"); }
function FX(L, mn) { return L.property("ADBE Effect Parade").addProperty(mn); }
function byName(n) { for (var i = 1; i <= app.project.numItems; i++) if (app.project.item(i).name === n) return app.project.item(i); return null; }
function folder(n) { return byName(n) || app.project.items.addFolder(n); }

// ---------- keyframes con suavizado ----------
function nE(p) { var t = p.propertyValueType; if (t === PropertyValueType.TwoD) return 2; if (t === PropertyValueType.ThreeD) return 3; return 1; }
// keys(prop, [t0,t1..], [v0,v1..], influenciaSalida, influenciaEntrada)
function keys(p, ts, vs, infl, inflIn) {
  for (var i = 0; i < ts.length; i++) p.setValueAtTime(ts[i], vs[i]);
  var n = nE(p);
  for (var k = 1; k <= p.numKeys; k++) { var eo = [], ei = []; for (var j = 0; j < n; j++) { eo.push(new KeyframeEase(0, infl || 70)); ei.push(new KeyframeEase(0, inflIn || infl || 70)); } p.setTemporalEaseAtKey(k, ei, eo); }
}
// aparición con rebote de escala (0 → 108 → 100)
function pop(L, t0, dur, to) { to = to || 100; dur = dur || 0.45; var s = T(L).property("ADBE Scale"); keys(s, [t0, t0 + dur * 0.65, t0 + dur], [[0, 0], [to * 1.08, to * 1.08], [to, to]], 65); }
// entrada: opacidad + subida desde dy px
// (la opacidad final es la que ya tenía la capa, no 100 → respeta capas semitransparentes)
function rise(L, t0, dur, dy) { dur = dur || 0.5; dy = dy === undefined ? 30 : dy; var o = T(L).property("ADBE Opacity"); var ov = o.numKeys ? 100 : o.value; keys(o, [t0, t0 + dur * 0.6], [0, ov], 60); var p = T(L).property("ADBE Position"); var v = p.value; keys(p, [t0, t0 + dur], [[v[0], v[1] + dy], v], 85); }
function fadeIn(L, t0, dur) { var o = T(L).property("ADBE Opacity"); var ov = o.numKeys ? 100 : o.value; keys(o, [t0, t0 + (dur || 0.3)], [0, ov], 60); }

// ---------- capas de forma ----------
function newShape(comp, name) { var L = comp.layers.addShape(); L.name = name; T(L).property("ADBE Position").setValue([0, 0]); T(L).property("ADBE Anchor Point").setValue([0, 0]); return L; }
function grp(L, name) { var g = L.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"); if (name) g.name = name; return g; }
// OJO: tras addProperty las referencias hermanas quedan inválidas → se devuelve la recién creada buscándola por índice
function add(g, mn) { var v = g.property("ADBE Vectors Group"); v.addProperty(mn); return v.property(v.numProperties); }
function rectP(g, size, pos, round) { var r = add(g, "ADBE Vector Shape - Rect"); r.property("ADBE Vector Rect Size").setValue(size); r.property("ADBE Vector Rect Position").setValue(pos); r.property("ADBE Vector Rect Roundness").setValue(round || 0); return r; }
function ellP(g, size, pos) { var e = add(g, "ADBE Vector Shape - Ellipse"); e.property("ADBE Vector Ellipse Size").setValue(size); e.property("ADBE Vector Ellipse Position").setValue(pos); return e; }
function pathP(g, verts, closed, inT, outT) { var p = add(g, "ADBE Vector Shape - Group"); var s = new Shape(); s.vertices = verts; s.closed = closed; if (inT) s.inTangents = inT; if (outT) s.outTangents = outT; p.property("ADBE Vector Shape").setValue(s); return p; }
// curva Bézier de un tramo: p0 → p3 con controles p1, p2
function bez(g, p0, p1, p2, p3) { return pathP(g, [p0, p3], false, [[0, 0], [p2[0] - p3[0], p2[1] - p3[1]]], [[p1[0] - p0[0], p1[1] - p0[1]], [0, 0]]); }
function fill(g, col, op) { var f = add(g, "ADBE Vector Graphic - Fill"); f.property("ADBE Vector Fill Color").setValue(col); if (op !== undefined) f.property("ADBE Vector Fill Opacity").setValue(op); return f; }
function stroke(g, col, w, op) { var s = add(g, "ADBE Vector Graphic - Stroke"); s.property("ADBE Vector Stroke Color").setValue(col); s.property("ADBE Vector Stroke Width").setValue(w); if (op !== undefined) s.property("ADBE Vector Stroke Opacity").setValue(op); s.property("ADBE Vector Stroke Line Cap").setValue(2); return s; }
function taper(st, a, b) { var tp = st.property("ADBE Vector Stroke Taper"); tp.property("ADBE Vector Taper Start Length").setValue(a); tp.property("ADBE Vector Taper End Length").setValue(b); tp.property("ADBE Vector Taper Start Width").setValue(0); tp.property("ADBE Vector Taper End Width").setValue(0); }
function trim(g) { return add(g, "ADBE Vector Filter - Trim"); }
// volver a obtener el Trim DESPUÉS de añadir más cosas al grupo (la referencia vieja queda inválida)
function getTrim(g) { return g.property("ADBE Vectors Group").property("ADBE Vector Filter - Trim"); }
// línea que se dibuja: trazado ya creado en g → Trim (encima) + Stroke (debajo) → keys de End
function drawOn(g, col, w, t0, dur) { trim(g); stroke(g, col, w); var tr = getTrim(g); keys(tr.property("ADBE Vector Trim End"), [t0, t0 + dur], [0, 100], 80, 40); return tr; }
function roundC(g, r) { var rc = add(g, "ADBE Vector Filter - RC"); rc.property("ADBE Vector RoundCorner Radius").setValue(r); return rc; }
function merge(g, mode) { var m = add(g, "ADBE Vector Filter - Merge"); m.property("ADBE Vector Merge Type").setValue(mode); return m; } // 3 restar, 4 intersectar
// rectángulo redondeado en una sola llamada
function box(comp, name, size, pos, round, col, strokeCol, strokeW) { var L = newShape(comp, name); var g = grp(L, name); rectP(g, size, pos, round); if (col) fill(g, col); if (strokeCol) stroke(g, strokeCol, strokeW || 2); return L; }
function circle(comp, name, d, pos, col) { var L = newShape(comp, name); var g = grp(L, name); ellP(g, [d, d], pos); fill(g, col); return L; }

// ---------- efectos ----------
// Gradient Ramp: ¡reemplaza el color de TODA la capa (respeta alfa)!
function ramp(L, p1, c1, p2, c2, radial, scatter) { var r = FX(L, "ADBE Ramp"); r.property("ADBE Ramp-0001").setValue(p1); r.property("ADBE Ramp-0002").setValue(c1); r.property("ADBE Ramp-0003").setValue(p2); r.property("ADBE Ramp-0004").setValue(c2); if (radial) r.property("ADBE Ramp-0005").setValue(2); r.property("ADBE Ramp-0006").setValue(scatter === undefined ? 30 : scatter); return r; }
function glow(L, thr, rad, inten, colA, colB) { var g = FX(L, "ADBE Glo2"); g.property("ADBE Glo2-0002").setValue(thr); g.property("ADBE Glo2-0003").setValue(rad); g.property("ADBE Glo2-0004").setValue(inten); if (colA) { g.property("ADBE Glo2-0007").setValue(2); g.property("ADBE Glo2-0012").setValue(colA); g.property("ADBE Glo2-0013").setValue(colB || colA); } return g; }
function shadow(L, op, dist, soft, col, dir) { var d = FX(L, "ADBE Drop Shadow"); d.property("ADBE Drop Shadow-0001").setValue(col || [0, 0, 0]); d.property("ADBE Drop Shadow-0002").setValue(op * 2.55); d.property("ADBE Drop Shadow-0003").setValue(dir === undefined ? 180 : dir); d.property("ADBE Drop Shadow-0004").setValue(dist); d.property("ADBE Drop Shadow-0005").setValue(soft); return d; }
// "Opacidad del efecto" (Opciones de composición): permite hacer aparecer CUALQUIER efecto,
// incluso los que no se pueden animar por script (p. ej. Hue/Saturation). fxFade(efecto, t0, t1, desde, hasta)
function fxOpacity(e) { return e.property("ADBE Effect Built In Params").property("ADBE Effect Mask Opacity"); }
function fxFade(e, t0, t1, a, b) { keys(fxOpacity(e), [t0, t1], [a === undefined ? 0 : a, b === undefined ? 100 : b], 60); }
// desenfoque SIN "repetir píxeles de borde" (si no, recorta en cuadrado)
function blur(L, amt) { var b = FX(L, "ADBE Gaussian Blur 2"); b.property("ADBE Gaussian Blur 2-0001").setValue(amt); b.property("ADBE Gaussian Blur 2-0003").setValue(0); return b; }

// ---------- estilos de capa (como Photoshop): sombra interior, bisel, trazo… ----------
// Se activan con el comando de menú (la comp debe estar abierta en el visor y la capa seleccionada).
// ids: 9000 Drop Shadow, 9001 Inner Shadow, 9002 Outer Glow, 9003 Inner Glow, 9004 Bevel and Emboss,
//      9005 Satin, 9006 Color Overlay, 9007 Gradient Overlay, 9008 Stroke
var LS = {drop: ["dropShadow", 9000], inner: ["innerShadow", 9001], outerGlow: ["outerGlow", 9002], innerGlow: ["innerGlow", 9003], bevel: ["bevelEmboss", 9004], satin: ["chromeFX", 9005], colorOverlay: ["solidFill", 9006], gradOverlay: ["gradientFill", 9007], stroke: ["frameFX", 9008]};
// layerStyle(capa, "inner", {opacity:60, distance:12, blur:20, color:[1,1,1], angle:90, mode:…}) → devuelve el grupo del estilo
function layerStyle(L, kind, o) {
  var comp = L.containingComp; comp.openInViewer();
  for (var i = 1; i <= comp.numLayers; i++) comp.layer(i).selected = false;
  L.selected = true; app.executeCommand(LS[kind][1]); L.selected = false;
  var g = L.property("ADBE Layer Styles").property(LS[kind][0] + "/enabled"); var pre = LS[kind][0] + "/";
  o = o || {};
  for (var k in o) { if (!o.hasOwnProperty(k)) continue; var nm = {opacity: "opacity", distance: "distance", blur: "blur", size: "blur", color: "color", angle: "localLightingAngle", mode: "mode2", choke: "chokeMatte", spread: "chokeMatte", depth: "strengthRatio", soften: "softness", altitude: "localLightingAltitude", strokeSize: "size", position: "style", noise: "noise", useGlobal: "useGlobalAngle", highlightOpacity: "highlightOpacity", shadowOpacity: "shadowOpacity", highlightColor: "highlightColor", shadowColor: "shadowColor", bevelStyle: "bevelStyle", technique: "bevelTechnique", range: "inputRange"}[k] || k;
    var p = g.property(pre + nm); if (p) p.setValue(o[k]); }
  return g;
}

// ---------- fondos y acabado ----------
function bgRadial(comp, c1, c2, center, radius, name) { var L = comp.layers.addSolid([0, 0, 0], name || "Fondo", comp.width, comp.height, 1); center = center || [comp.width / 2, comp.height / 2]; ramp(L, center, c1, [center[0] + (radius || comp.width * 0.62), center[1]], c2, true, 40); return L; }
function bgLinear(comp, c1, c2, p1, p2, name) { var L = comp.layers.addSolid([0, 0, 0], name || "Fondo", comp.width, comp.height, 1); ramp(L, p1 || [comp.width / 2, 0], c1, p2 || [comp.width / 2, comp.height], c2, false, 40); return L; }
function vignette(comp, op, feather) { var v = comp.layers.addSolid([0, 0, 0], "Viñeta", comp.width, comp.height, 1); var m = v.property("ADBE Mask Parade").addProperty("ADBE Mask Atom"); var s = new Shape(); var k = 0.5523, cx = comp.width / 2, cy = comp.height / 2, rx = comp.width * 0.6, ry = comp.height * 0.667; s.vertices = [[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]]; s.inTangents = [[-rx * k, 0], [0, -ry * k], [rx * k, 0], [0, ry * k]]; s.outTangents = [[rx * k, 0], [0, ry * k], [-rx * k, 0], [0, -ry * k]]; s.closed = true; m.property("ADBE Mask Shape").setValue(s); m.inverted = true; m.property("ADBE Mask Feather").setValue([feather || 480, feather || 480]); T(v).property("ADBE Opacity").setValue(op === undefined ? 70 : op); return v; }
function grain(comp, amt) { var a = comp.layers.addSolid([1, 1, 1], "AJUSTE Grano", comp.width, comp.height, 1); a.adjustmentLayer = true; var n = FX(a, "ADBE Noise"); n.property("ADBE Noise-0001").setValue(amt || 3); n.property("ADBE Noise-0002").setValue(0); return a; }
// retícula de puntos con el efecto Grid (Invert Grid)
function dots(comp, spacing, dot, col, op, mode) { var d = comp.layers.addSolid([1, 1, 1], "Retícula de puntos", comp.width, comp.height, 1); var g = FX(d, "ADBE Grid"); g.property("ADBE Grid-0001").setValue([0, 0]); g.property("ADBE Grid-0002").setValue(3); g.property("ADBE Grid-0004").setValue(spacing); g.property("ADBE Grid-0005").setValue(spacing); g.property("ADBE Grid-0006").setValue(spacing - dot); g.property("ADBE Grid-0011").setValue(1); g.property("ADBE Grid-0012").setValue(col || [1, 1, 1]); g.property("ADBE Grid-0014").setValue(1); T(d).property("ADBE Opacity").setValue(op || 30); d.blendingMode = mode || BlendingMode.OVERLAY; return d; }
function guides(comp) { try { comp.addGuide(1, comp.width / 3); comp.addGuide(1, comp.width * 2 / 3); comp.addGuide(0, comp.height / 3); comp.addGuide(0, comp.height * 2 / 3); comp.addGuide(1, comp.width / 2); comp.addGuide(0, comp.height / 2); } catch (e) {} }

// ---------- texto ----------
// txt(comp, "texto", "PostScriptName", tamaño, color, [x,y], {track, just, leading})  → ancla centrada de verdad
function txt(comp, s, font, size, col, pos, o) {
  o = o || {};
  var L = comp.layers.addText(s); var td = L.property("ADBE Text Properties").property("ADBE Text Document"); var d = td.value; d.resetCharStyle();
  d.font = font; d.fontSize = size; d.fillColor = col; d.applyFill = true; d.applyStroke = false;
  d.justification = o.just || ParagraphJustification.CENTER_JUSTIFY; if (o.track !== undefined) d.tracking = o.track; if (o.leading) { d.autoLeading = false; d.leading = o.leading; }
  td.setValue(d);
  var r = L.sourceRectAtTime(0, false);
  var ax = (o.just === ParagraphJustification.LEFT_JUSTIFY) ? r.left : (o.just === ParagraphJustification.RIGHT_JUSTIFY ? r.left + r.width : r.left + r.width / 2);
  T(L).property("ADBE Anchor Point").setValue([ax, r.top + r.height / 2]); T(L).property("ADBE Position").setValue(pos);
  if (o.name) L.name = o.name;
  return L;
}
function boxText(comp, s, size, font, fsize, col, pos, o) { o = o || {}; var L = comp.layers.addBoxText(size, s); var td = L.property("ADBE Text Properties").property("ADBE Text Document"); var d = td.value; d.resetCharStyle(); d.font = font; d.fontSize = fsize; d.fillColor = col; d.applyFill = true; d.applyStroke = false; d.justification = o.just || ParagraphJustification.CENTER_JUSTIFY; if (o.leading) { d.autoLeading = false; d.leading = o.leading; } td.setValue(d); T(L).property("ADBE Position").setValue(pos); return L; }

// ---------- cámara 2D con nulo ----------
function camNull(comp, name) { var n = comp.layers.addNull(comp.duration); n.name = name || "CÁMARA 2D (nulo)"; T(n).property("ADBE Anchor Point").setValue([50, 50]); T(n).property("ADBE Position").setValue([comp.width / 2, comp.height / 2]); return n; }
// posición local (dentro del nulo con ancla 50,50) para un punto de escena (x,y)
function loc(comp, p) { return [p[0] - comp.width / 2 + 50, p[1] - comp.height / 2 + 50]; }
function parentKeep(child, parent) { child.parent = parent; T(child).property("ADBE Scale").setValue([100, 100]); }

// ---------- color (clase 04) ----------
// color_lib.jsx — HSL y rueda cromática para la clase de color (se añade a ae_lib)
function hsl(h, s, l) { // h 0-360, s/l 0-1 → [r,g,b] 0-1
  h = ((h % 360) + 360) % 360 / 360;
  function f(p, q, t) { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; }
  if (s === 0) return [l, l, l];
  var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  return [f(p, q, h + 1 / 3), f(p, q, h), f(p, q, h - 1 / 3)];
}
function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
function toHex(c) { function h2(v) { var s = Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).toUpperCase(); return s.length < 2 ? "0" + s : s; } return "#" + h2(c[0]) + h2(c[1]) + h2(c[2]); }
// sector anular (cuña de rueda) como polígono de n puntos por arco; ángulos en grados, 0 = arriba, sentido horario
function sectorPts(r0, r1, a0, a1, n) {
  var pts = [], k, a;
  for (k = 0; k <= n; k++) { a = (a0 + (a1 - a0) * k / n - 90) * Math.PI / 180; pts.push([r1 * Math.cos(a), r1 * Math.sin(a)]); }
  for (k = n; k >= 0; k--) { a = (a0 + (a1 - a0) * k / n - 90) * Math.PI / 180; pts.push([r0 * Math.cos(a), r0 * Math.sin(a)]); }
  return pts;
}
// rueda de 12 tonos x 4 anillos (exterior saturado → interior pastel). sel(hIndex) → true si ese tono va en color
// hues: rojo arriba y sentido horario rojo→magenta→violeta→azul→cian→verde→amarillo→naranja (como su rueda)
var WHEEL_HUES = [0, 330, 300, 270, 240, 210, 180, 150, 120, 90, 60, 30];
function wheel(comp, name, R, pos, sel, fadeCol) {
  var L = newShape(comp, name);
  var rings = [[0.72, 1.0, 0.5, 1.0], [0.5, 0.72, 0.62, 0.9], [0.3, 0.5, 0.75, 0.8], [0.0, 0.3, 0.88, 0.7]]; // r0, r1 (fracción de R), luminosidad, saturación
  for (var i = 0; i < 12; i++) {
    for (var j = 0; j < 4; j++) {
      var g = grp(L, "T" + i + "A" + j); var rg = rings[j];
      pathP(g, sectorPts(R * rg[0], R * rg[1], i * 30 - 15, i * 30 + 15, 8), true);
      var c = hsl(WHEEL_HUES[i], rg[3], rg[2]);
      if (sel && !sel(i)) c = mix(c, fadeCol || [0.97, 0.96, 0.93], 0.86);
      fill(g, c); stroke(g, [1, 1, 1], 1.5, 55);
    }
  }
  T(L).property("ADBE Position").setValue(pos);
  return L;
}
// ---------- clase 11: movimiento constante, 3D y ayudas ----------
// capa 3D colocada (escala en %, rotaciones [x,y,z] opcionales)
function to3D(L, pos, s, rot) { L.threeDLayer = true; T(L).property("ADBE Position").setValue(pos); if (s) T(L).property("ADBE Scale").setValue([s, s, s]); if (rot) { if (rot[0]) T(L).property("ADBE Rotate X").setValue(rot[0]); if (rot[1]) T(L).property("ADBE Rotate Y").setValue(rot[1]); if (rot[2]) T(L).property("ADBE Rotate Z").setValue(rot[2]); } return L; }
// nulo 3D (ancla 50,50,0); si tiene padre, pos es local (usar [50,50,0] + desplazamiento)
function null3D(comp, name, parent, pos) { var n = comp.layers.addNull(comp.duration); n.name = name; n.threeDLayer = true; T(n).property("ADBE Anchor Point").setValue([50, 50, 0]); if (parent) { n.parent = parent; T(n).property("ADBE Scale").setValue([100, 100, 100]); } T(n).property("ADBE Position").setValue(pos); return n; }
// "motion blur" falso (el motor "ADBE Calder" = Advanced 3D no deja activarlo en capas 3D; con "ADBE Advanced 3d" = Classic 3D
// el de verdad sí funciona, probado el 01/10/2026): Directional Blur según el desplazamiento en pantalla
var MBX = "var c0 = toComp(anchorPoint), c1 = toComp(anchorPoint, time - thisComp.frameDuration*0.5); var v = fromComp(c1) - fromComp(c0); ";
function fakeMB(L, maxLen) { var e = FX(L, "ADBE Motion Blur"); e.name = "Motion blur falso (expresión)"; e.property(1).expression = MBX + "radiansToDegrees(Math.atan2(v[0], -v[1]))"; e.property(2).expression = MBX + "Math.min(" + (maxLen || 150) + ", length(v))"; return e; }
// valor (0..1) de una curva de AE con suavizado "infl" % en ambos keyframes, para t (0..1)
function easeY(t, infl) { var a = infl / 100, lo = 0, hi = 1, u = t; for (var k = 0; k < 40; k++) { u = (lo + hi) / 2; var x = 3 * (1 - u) * (1 - u) * u * a + 3 * (1 - u) * u * u * (1 - a) + u * u * u; if (x < t) lo = u; else hi = u; } return 3 * (1 - u) * u * u + u * u * u; }
// nunca quieto: wiggle suave de posición y rotación en un nulo de cámara 2D
function alive(L, posAmp, rotAmp, freq) { freq = freq || 0.5; T(L).property("ADBE Position").expression = "wiggle(" + freq + ", " + (posAmp || 6) + ", 1)"; T(L).property("ADBE Rotate Z").expression = "wiggle(" + (freq * 0.8) + ", " + (rotAmp || 0.4) + ", 1)"; }
// máscara rectangular redondeada (en coordenadas de la capa)
function rrMask(L, w, h, r, x0, y0) { var m = L.property("ADBE Mask Parade").addProperty("ADBE Mask Atom"); var sh = new Shape(), k = 0.5523 * r; x0 = x0 || 0; y0 = y0 || 0;
  sh.vertices = [[x0 + r, y0], [x0 + w - r, y0], [x0 + w, y0 + r], [x0 + w, y0 + h - r], [x0 + w - r, y0 + h], [x0 + r, y0 + h], [x0, y0 + h - r], [x0, y0 + r]];
  sh.inTangents = [[-k, 0], [0, 0], [0, -k], [0, 0], [k, 0], [0, 0], [0, k], [0, 0]]; sh.outTangents = [[0, 0], [k, 0], [0, 0], [0, k], [0, 0], [-k, 0], [0, 0], [0, -k]]; sh.closed = true; m.property("ADBE Mask Shape").setValue(sh); return m; }
// footage (p. ej. un emoji PNG) como capa con un alto en px
function footLayer(comp, item, pos, h, name) { var L = comp.layers.add(item); if (name) L.name = name; var s = h / item.height * 100; T(L).property("ADBE Scale").setValue([s, s]); T(L).property("ADBE Position").setValue(pos); return L; }

// contorno blanco de la cuña seleccionada (selector) que se puede rotar
function wedgeOutline(comp, name, R, pos, widthDeg, extra) {
  var L = newShape(comp, name); var g = grp(L, "Selector");
  pathP(g, sectorPts(R * 0.02, R * (1 + (extra || 0.2)), -widthDeg / 2, widthDeg / 2, 10), true);
  stroke(g, [1, 1, 1], 5);
  T(L).property("ADBE Position").setValue(pos); return L;
}

// ---------- curvas (Tanda 03 · 02 "Dominando las curvas", probadas) ----------
// claveEase(prop, k, velEntrada, inflEntrada, velSalida, inflSalida): posición unificada = 1 dimensión (px/s a lo largo del trayecto)
// flowCurva(prop, k, [x1, y1, x2, y2]): aplica una curva de Flow (cubic-bezier) entre las keys k y k+1 (error < 0,2 %)
// anclarEn(capa, fx, fy): ancla en un punto de la caja (0..1) sin mover la capa · separarLetras(comp, capaFormas): una capa por grupo
// velocidad + influencia en UNA key (posición unificada: 1 dimensión = velocidad a lo largo del trayecto, en px/s)
function claveEase(p, k, velIn, inflIn, velOut, inflOut) {
  var n = 1;
  if (!p.isSpatial) { var t = p.propertyValueType; if (t === PropertyValueType.TwoD) n = 2; if (t === PropertyValueType.ThreeD) n = 3; }
  var a = [], b = [];
  for (var j = 0; j < n; j++) { a.push(new KeyframeEase(velIn, Math.max(0.1, Math.min(100, inflIn)))); b.push(new KeyframeEase(velOut, Math.max(0.1, Math.min(100, inflOut)))); }
  p.setTemporalEaseAtKey(k, a, b);
}

// Curva de Flow (cubic-bezier [x1, y1, x2, y2], como las de la biblioteca "Mios") -> suavizado de AE entre las keys k y k+1.
// Salida de k:  influencia = x1,  velocidad = (y1/x1) * velocidad media
// Entrada de k+1: influencia = 1 - x2, velocidad = ((1-y2)/(1-x2)) * velocidad media
// (x = 0 o x = 1 es un tirador vertical: se usa 0,1 % de influencia y la pendiente de 1/0,001)
function flowCurva(p, k, curva) {
  var x1 = curva[0], y1 = curva[1], x2 = curva[2], y2 = curva[3];
  var t0 = p.keyTime(k), t1 = p.keyTime(k + 1), v0 = p.keyValue(k), v1 = p.keyValue(k + 1);
  var dur = t1 - t0, n = 1, dist = [];
  if (p.isSpatial) {
    // longitud aproximada del trayecto (muestreando la posición)
    var L = 0, prev = p.valueAtTime(t0, true);
    for (var s = 1; s <= 60; s++) { var q = p.valueAtTime(t0 + dur * s / 60, true); var dd = 0; for (var c = 0; c < q.length; c++) dd += (q[c] - prev[c]) * (q[c] - prev[c]); L += Math.sqrt(dd); prev = q; }
    dist = [L];
  } else if (v0 instanceof Array) { n = v0.length; for (var j = 0; j < n; j++) dist.push(v1[j] - v0[j]); }
  else dist = [v1 - v0];
  var io = Math.max(x1, 0.001), ii = Math.max(1 - x2, 0.001);
  var sal = [], ent = [];
  for (var i = 0; i < dist.length; i++) {
    var media = dist[i] / dur;
    sal.push(new KeyframeEase(media * y1 / io, Math.max(0.1, io * 100)));
    ent.push(new KeyframeEase(media * (1 - y2) / ii, Math.max(0.1, ii * 100)));
  }
  // conservar el lado que no se toca
  var eIn0 = p.keyInTemporalEase(k), eOut1 = p.keyOutTemporalEase(k + 1);
  p.setTemporalEaseAtKey(k, eIn0, sal);
  p.setTemporalEaseAtKey(k + 1, ent, eOut1);
}

// anclaje de una capa de forma a un punto de su caja (0..1, 0..1) sin que se mueva en pantalla (sin giro)
function anclarEn(L, fx, fy) {
  var r = L.sourceRectAtTime(0, false);
  var tr = T(L), an = tr.property("ADBE Anchor Point"), po = tr.property("ADBE Position"), sc = tr.property("ADBE Scale");
  var a0 = an.value, p0 = po.value, s = sc.value;
  var a1 = [r.left + r.width * fx, r.top + r.height * fy];
  an.setValue([a1[0], a1[1]]);
  po.setValue([p0[0] + (a1[0] - a0[0]) * s[0] / 100, p0[1] + (a1[1] - a0[1]) * s[1] / 100]);
  return a1;
}

// separar una capa de formas con un grupo por letra en una capa por letra (lo que hace el profe con Motion Tools)
function separarLetras(comp, L) {
  var root = L.property("ADBE Root Vectors Group");
  var nombres = [];
  for (var g = 1; g <= root.numProperties; g++) nombres.push(root.property(g).name);
  var capas = [];
  for (var i = 0; i < nombres.length; i++) {
    var D = L.duplicate();
    D.name = nombres[i];
    var rv = D.property("ADBE Root Vectors Group");
    var n = 0;
    for (var k = rv.numProperties; k >= 1 && n++ < 50; k--) if (rv.property(k).name !== nombres[i]) rv.property(k).remove();
    capas.push(D);
  }
  L.remove();
  return capas;
}
