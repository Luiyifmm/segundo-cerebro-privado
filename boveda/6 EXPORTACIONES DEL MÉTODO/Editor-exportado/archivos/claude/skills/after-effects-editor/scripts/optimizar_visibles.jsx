// optimizar_visibles.jsx — REGLA DEL USUARIO: en la comp solo vive lo que se ve.
// Mira, fotograma a fotograma, cuándo cada capa se ve DE VERDAD (caja de su contenido proyectada con toComp,
// opacidad > 0, escala > 0, delante de la cámara) y recorta su entrada y su salida a ese tramo (+ un margen).
// - Lo que nunca se ve se informa (y se borra solo si se pide con borrarInvisibles).
// - No toca: cámaras, luces, nulos, capas de ajuste o guía, audio, capas con el ojo apagado, mates de pista y capas
//   que leen efectos o expresiones de otras capas.
// - Capas 3D que dan sombra: solo se recortan cuando su opacidad o su escala son 0 (su sombra puede verse aunque
//   ellas estén fuera del cuadro).
// - Mallas y modelos 3D, y precomps con "contraer transformaciones": la caja no vale; cuentan opacidad, escala y cámara.
// - Si una capa tiene huecos largos (≥ 1 s sin verse), se informan para partirla (splitLayer) a mano.
//
// Uso (ae_run_script):
//   $.global.OPT = {comp: "Nombre", aplicar: false, paso: 2, margen: 60, margenFr: 1, borrarInvisibles: false};
//   return $.evalFile(new File("<skill>/scripts/optimizar_visibles.jsx"));
// Primero con aplicar:false (solo informe); revisar; luego aplicar:true. ES3 y bucles con tope.
(function () {
  var O = $.global.OPT || {};
  var c = null, i, k, q;
  if (O.comp) { for (i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it instanceof CompItem && it.name === O.comp) { c = it; break; } } }
  else if (app.project.activeItem instanceof CompItem) c = app.project.activeItem;
  if (!c) return {error: "no encuentro la comp " + O.comp};
  var paso = O.paso || 2, margen = (O.margen === undefined) ? 60 : O.margen, margenFr = (O.margenFr === undefined) ? 1 : O.margenFr;
  var fd = c.frameDuration, W = c.width, H = c.height;

  // ---------- capas que otros usan (no se recortan) ----------
  var usadas = {}, porNombre = {};
  for (i = 1; i <= c.numLayers; i++) porNombre[c.layer(i).name] = i;
  function marcarUsada(idx, motivo) { if (idx >= 1 && idx <= c.numLayers && !usadas[idx]) usadas[idx] = motivo; }
  function recorrer(g, capa, prof) {
    if (prof > 8) return;
    var n = 0; try { n = g.numProperties; } catch (e0) { return; }
    for (var a = 1; a <= n; a++) {
      var p = null; try { p = g.property(a); } catch (e1) { continue; }
      var tipo = null; try { tipo = p.propertyType; } catch (e2) { continue; }
      if (tipo === PropertyType.PROPERTY) {
        try { if (p.propertyValueType === PropertyValueType.LAYER_INDEX && p.value > 0) marcarUsada(p.value, "la usa un efecto de «" + capa.name + "»"); } catch (e3) {}
        var ex = ""; try { ex = p.expression; } catch (e4) {}
        if (ex) {
          var m = ex.match(/layer\(\s*"([^"]+)"\s*\)/g) || [];
          for (var b = 0; b < m.length; b++) { var nom = m[b].replace(/layer\(\s*"/, "").replace(/"\s*\)$/, ""); if (porNombre[nom] && porNombre[nom] !== capa.index) marcarUsada(porNombre[nom], "la lee una expresión de «" + capa.name + "»"); }
          var mi = ex.match(/layer\(\s*(\d+)\s*\)/g) || [];
          for (b = 0; b < mi.length; b++) marcarUsada(parseInt(mi[b].replace(/\D/g, ""), 10), "la lee una expresión de «" + capa.name + "»");
        }
      } else if (p.numProperties) {
        // las mallas traen cientos de propiedades ocultas: arriba del todo solo se entra en lo que puede apuntar a otra capa
        if (prof === 0 && !/Effect Parade|Transform Group|Text Properties|Mask Parade|Root Vectors|Camera Options|Light Options/.test(p.matchName)) continue;
        recorrer(p, capa, prof + 1);
      }
    }
  }
  for (i = 1; i <= c.numLayers; i++) recorrer(c.layer(i), c.layer(i), 0);

  // ---------- la sonda: un nulo con 3 controles cuyas expresiones miden la capa que toque ----------
  var sonda = c.layers.addNull(c.duration); sonda.name = "__SONDA_OPTIMIZAR (se borra sola)";
  sonda.property("ADBE Effect Parade").addProperty("ADBE Point Control");
  sonda.property("ADBE Effect Parade").addProperty("ADBE Point Control");
  sonda.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
  function pMin() { return sonda.property("ADBE Effect Parade").property(1).property(1); }
  function pMax() { return sonda.property("ADBE Effect Parade").property(2).property(1); }
  function pOk() { return sonda.property("ADBE Effect Parade").property(3).property(1); }
  function exprCaja(idx, esMin) {
    var f = esMin ? "min" : "max";
    return "var L = thisComp.layer(" + idx + ");\nvar r = L.sourceRectAtTime(time, false);\n" +
      "var c = [[r.left, r.top], [r.left + r.width, r.top], [r.left, r.top + r.height], [r.left + r.width, r.top + r.height]];\n" +
      "var v = " + (esMin ? "[1e9, 1e9]" : "[-1e9, -1e9]") + ";\n" +
      "for (var i = 0; i < 4; i++) { var p = L.toComp(c[i]); v = [Math." + f + "(v[0], p[0]), Math." + f + "(v[1], p[1])]; }\nv";
  }
  // 0 = no se ve; 1 = se puede ver (mirar la caja); 2 = se ve seguro o no se puede medir (contar como visible)
  function exprOk(idx, soloOpacidadEscala, sinCaja) {
    var s = "var L = thisComp.layer(" + idx + ");\nvar ok = (L.transform.opacity > 0.4) ? 1 : 0;\n" +
      "var s = L.transform.scale; if (Math.abs(s[0] * s[1]) < 0.01) ok = 0;\n";
    if (soloOpacidadEscala) return s + "ok ? 2 : 0";
    s += "if (ok && L.threeDLayer) {\n  try {\n    var cam = thisComp.activeCamera, cp = cam.toWorld([0, 0, 0]), d = cam.toWorldVec([0, 0, 1]);\n" +
      (sinCaja ? "    var pts = [L.toWorld(L.anchorPoint)];\n" :
                 "    var r = L.sourceRectAtTime(time, false);\n    var pts = [L.toWorld([r.left, r.top]), L.toWorld([r.left + r.width, r.top]), L.toWorld([r.left, r.top + r.height]), L.toWorld([r.left + r.width, r.top + r.height])];\n") +
      "    var delante = 0;\n    for (var i = 0; i < pts.length; i++) if (dot(sub(pts[i], cp), d) > 1) delante++;\n" +
      "    if (delante === 0) ok = 0; else if (delante < pts.length) ok = 2;\n  } catch (e) {}\n}\n";
    return s + (sinCaja ? "ok ? 2 : 0" : "ok");
  }
  var usarCaja = true, marg = margen;
  function visibleEn(t) {
    var ok = pOk().valueAtTime(t, false);
    if (ok === 0) return false;
    if (!usarCaja || ok === 2) return true;
    var a = pMin().valueAtTime(t, false), b = pMax().valueAtTime(t, false);
    return (b[0] > -marg && a[0] < W + marg && b[1] > -marg && a[1] < H + marg);
  }

  var informe = [], saltadas = [], nunca = [], ahorro = 0, aplicadas = 0, tope = 0;
  for (i = 1; i <= c.numLayers; i++) {
    var L = c.layer(i);
    if (L === sonda) continue;
    var motivo = "";
    if (L instanceof CameraLayer) motivo = "cámara";
    else if (L instanceof LightLayer) motivo = "luz";
    else if (L.nullLayer) motivo = "nulo";
    else if (L.adjustmentLayer) motivo = "capa de ajuste";
    else if (L.guideLayer) motivo = "capa guía";
    else if (!L.hasVideo) motivo = "solo audio";
    else if (!L.enabled) motivo = "ojo apagado (¿mate o referencia?)";
    else if (L.isTrackMatte) motivo = "es mate de otra capa";
    else if (usadas[i]) motivo = usadas[i];
    if (motivo) { saltadas.push(L.name + " → " + motivo); continue; }
    var daSombra = false;
    if (L.threeDLayer) {
      try { if (L.property("ADBE Compositing Options Group").property("ADBE Casts Shadows").value) daSombra = true; } catch (e5) {}
      try { if (L.property("ADBE Material Options Group").property("ADBE Casts Shadows").value) daSombra = true; } catch (e6) {}
    }
    var esMalla = /ParametricMesh|ThreeDModel|3D Model/i.test(L.matchName);
    var colapsada = false; try { colapsada = L.collapseTransformation; } catch (e7) {}
    marg = (L.property("ADBE Effect Parade").numProperties > 0) ? Math.max(margen, 200) : margen;   // brillos y sombras salen de la caja
    usarCaja = !esMalla && !colapsada && !daSombra;
    pOk().expression = exprOk(L.index, daSombra, !usarCaja);
    if (usarCaja) { pMin().expression = exprCaja(L.index, true); pMax().expression = exprCaja(L.index, false); }
    var f0 = Math.max(0, Math.round(L.inPoint / fd)), f1 = Math.min(Math.round(c.duration / fd), Math.round(L.outPoint / fd)) - 1;
    var primero = -1, ultimo = -1, tramos = [], dentro = false, ini = 0, f;
    for (f = f0; f <= f1 && tope++ < 200000; f += paso) {
      if (visibleEn(f * fd + fd * 0.01)) { if (primero < 0) primero = f; ultimo = f; if (!dentro) { dentro = true; ini = f; } }
      else if (dentro) { tramos.push([ini, f - paso]); dentro = false; }
    }
    if (dentro) tramos.push([ini, ultimo]);
    if (primero > f0) { var g = primero; while (g > f0 && g > primero - paso && tope++ < 200000 && visibleEn((g - 1) * fd + fd * 0.01)) g--; primero = g; }
    if (ultimo >= 0 && ultimo < f1) { var h = ultimo; while (h < f1 && h < ultimo + paso && tope++ < 200000 && visibleEn((h + 1) * fd + fd * 0.01)) h++; ultimo = h; }
    if (primero < 0) { nunca.push(L.name); continue; }
    var antes = [Math.round(L.inPoint * 100) / 100, Math.round(L.outPoint * 100) / 100];
    var nIn = Math.max(L.inPoint, (primero - margenFr) * fd), nOut = Math.min(L.outPoint, (ultimo + 1 + margenFr) * fd);
    var gano = (nIn - L.inPoint) + (L.outPoint - nOut), huecos = [];
    for (k = 1; k < tramos.length; k++) { if ((tramos[k][0] - tramos[k - 1][1]) * fd >= 1) huecos.push([Math.round(tramos[k - 1][1] * fd * 100) / 100, Math.round(tramos[k][0] * fd * 100) / 100]); }
    if (gano >= fd) {
      ahorro += gano;
      var fila = {capa: L.name, antes: antes, visible: [Math.round(primero * fd * 100) / 100, Math.round((ultimo + 1) * fd * 100) / 100],
                  recorte: [Math.round(nIn * 100) / 100, Math.round(nOut * 100) / 100], ahorroSeg: Math.round(gano * 100) / 100};
      if (daSombra) fila.nota = "da sombra: solo se recorta lo que está a opacidad o escala 0";
      if (huecos.length) fila.huecosLargos = huecos;
      if (O.aplicar) {
        L.inPoint = nIn; L.outPoint = nOut;                                    // primero inPoint, luego outPoint
        try { fila.leido = String(Math.round(L.inPoint * 100) / 100) + " – " + String(Math.round(L.outPoint * 100) / 100); } catch (eL) { fila.leido = "(no se pudo releer)"; }
        aplicadas++;
      }
      informe.push(fila);
    } else if (huecos.length) informe.push({capa: L.name, sinRecorte: true, huecosLargos: huecos});
  }
  sonda.remove();
  if (O.aplicar && O.borrarInvisibles) {
    for (i = c.numLayers; i >= 1; i--) for (q = 0; q < nunca.length; q++) if (c.layer(i).name === nunca[q]) { c.layer(i).remove(); break; }
  }
  if (O.aplicar) app.project.save();
  return {comp: c.name, capas: c.numLayers, recortes: informe, nuncaVisibles: nunca, noTocadas: saltadas,
          ahorroCapaSegundos: Math.round(ahorro * 100) / 100, aplicado: !!O.aplicar, aplicadas: aplicadas, evaluaciones: tope};
})();
