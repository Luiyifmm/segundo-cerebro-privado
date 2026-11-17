// Montaje editable de CLIENTE-A_1009_01: cortes extra por frase, zooms como escala del clip, subtítulos de texto (plantilla) y marcadores de ideas.
(function () {
  var MOGRT = "~/Videos-Remotion/clientes/_plantillas/Subtitulo ClienteA.mogrt";
  var SUBS = [{"a":0.34,"b":0.86,"linea":"esta de aquí","clave":"","gris":false,"retraso":0,"fin":0.82},{"a":0.82,"b":1.58,"linea":"es la mujer","clave":"","gris":false,"retraso":0,"fin":1.54},{"a":1.54,"b":2.3,"linea":"del","clave":"pobre","gris":true,"retraso":8,"fin":2.26},{"a":2.26,"b":2.78,"linea":"y esta de","clave":"","gris":false,"retraso":0,"fin":2.74},{"a":2.74,"b":3.26,"linea":"aquí es la","clave":"","gris":false,"retraso":0,"fin":3.22},{"a":3.22,"b":3.87,"linea":"mujer de","clave":"rico","gris":false,"retraso":12,"fin":4.15},{"a":4.15,"b":4.47,"linea":"esto es lo","clave":"","gris":false,"retraso":0,"fin":4.43},{"a":4.43,"b":5.01,"linea":"que le gusta","clave":"","gris":false,"retraso":0,"fin":4.97},{"a":4.97,"b":5.43,"linea":"al","clave":"pobre","gris":true,"retraso":6,"fin":5.39},{"a":5.39,"b":5.76,"linea":"y esto es","clave":"","gris":false,"retraso":0,"fin":5.71},{"a":5.71,"b":6.41,"linea":"lo que el","clave":"rico","gris":false,"retraso":11,"fin":6.37},{"a":6.37,"b":6.63,"linea":"disfruta","clave":"","gris":false,"retraso":0,"fin":6.8},{"a":6.8,"b":7.56,"linea":"este de aquí","clave":"","gris":false,"retraso":0,"fin":7.52},{"a":7.52,"b":7.88,"linea":"es el fin","clave":"","gris":false,"retraso":0,"fin":7.84},{"a":7.84,"b":8.88,"linea":"de semana del","clave":"pobre","gris":true,"retraso":17,"fin":8.84},{"a":8.84,"b":9.16,"linea":"y este es","clave":"","gris":false,"retraso":0,"fin":9.12},{"a":9.12,"b":9.58,"linea":"el fin de","clave":"","gris":false,"retraso":0,"fin":9.54},{"a":9.54,"b":10.03,"linea":"semana de","clave":"rico","gris":false,"retraso":12,"fin":10.38},{"a":10.44,"b":10.8,"linea":"esto es lo","clave":"","gris":false,"retraso":0,"fin":10.76},{"a":10.76,"b":11.82,"linea":"que escucha el","clave":"pobre","gris":true,"retraso":20,"fin":11.78},{"a":11.78,"b":12.22,"linea":"y esto es","clave":"","gris":false,"retraso":0,"fin":12.18},{"a":12.18,"b":12.86,"linea":"lo que escucha","clave":"","gris":false,"retraso":0,"fin":12.82},{"a":12.82,"b":13.2,"linea":"el","clave":"rico","gris":false,"retraso":5,"fin":13.37},{"a":13.37,"b":13.93,"linea":"este es el","clave":"","gris":false,"retraso":0,"fin":13.89},{"a":13.89,"b":14.37,"linea":"interior de la","clave":"","gris":false,"retraso":0,"fin":14.33},{"a":14.33,"b":15.17,"linea":"casa del","clave":"pobre","gris":true,"retraso":13,"fin":15.13},{"a":15.13,"b":15.59,"linea":"y este es","clave":"","gris":false,"retraso":0,"fin":15.55},{"a":15.55,"b":16.15,"linea":"el interior de","clave":"","gris":false,"retraso":0,"fin":16.11},{"a":16.11,"b":16.92,"linea":"la casa del","clave":"rico","gris":false,"retraso":22,"fin":17.22},{"a":17.22,"b":17.58,"linea":"así se ","clave":"","gris":false,"retraso":0,"fin":17.54},{"a":17.54,"b":18.2,"linea":"viste un","clave":"pobre","gris":true,"retraso":11,"fin":18.16},{"a":18.16,"b":18.56,"linea":"y así se","clave":"","gris":false,"retraso":0,"fin":18.52},{"a":18.52,"b":19.44,"linea":" viste un","clave":"rico","gris":false,"retraso":14,"fin":19.48},{"a":19.48,"b":20.22,"linea":"la","clave":"riqueza","gris":false,"retraso":4,"fin":20.18},{"a":20.18,"b":20.76,"linea":"no se trata","clave":"","gris":false,"retraso":0,"fin":20.72},{"a":20.72,"b":21.16,"linea":"de lo que","clave":"","gris":false,"retraso":0,"fin":21.12},{"a":21.12,"b":21.26,"linea":"tienes","clave":"","gris":false,"retraso":0,"fin":21.4},{"a":21.4,"b":22.62,"linea":"sino es como","clave":"piensas","gris":false,"retraso":20,"fin":22.74},{"a":22.74,"b":24.16,"linea":"es la programación","clave":"mental","gris":false,"retraso":35,"fin":24.12},{"a":24.12,"b":25.02,"linea":"que inculcaron de","clave":"","gris":false,"retraso":0,"fin":24.98},{"a":24.98,"b":26.14,"linea":"ti desde pequeño","clave":"","gris":false,"retraso":0,"fin":26.18},{"a":26.18,"b":26.58,"linea":"si tú quieres","clave":"","gris":false,"retraso":0,"fin":26.72},{"a":26.72,"b":27.6,"linea":"ser una persona","clave":"","gris":false,"retraso":0,"fin":27.56},{"a":27.56,"b":28.7,"linea":"rica y","clave":"exitosa","gris":false,"retraso":17,"fin":28.85},{"a":28.85,"b":29.63,"linea":"tienes que","clave":"eliminar","gris":false,"retraso":11,"fin":29.59},{"a":29.59,"b":30.85,"linea":"esa programación","clave":"mental","gris":false,"retraso":28,"fin":30.81},{"a":30.81,"b":31.95,"linea":"de poca","clave":"abundancia","gris":false,"retraso":22,"fin":31.91},{"a":31.91,"b":32.93,"linea":"y de","clave":"pobre","gris":true,"retraso":11,"fin":32.91},{"a":32.91,"b":33.75,"linea":"para convertirte en","clave":"","gris":false,"retraso":0,"fin":33.71},{"a":33.71,"b":35.71,"linea":"una persona de","clave":"éxito","gris":false,"retraso":41,"fin":35.95},{"a":35.95,"b":36.93,"linea":"y","clave":"abundancia","gris":false,"retraso":16,"fin":37.05},{"a":37.05,"b":37.87,"linea":"si quieres empezar","clave":"","gris":false,"retraso":0,"fin":37.83},{"a":37.83,"b":38.89,"linea":"con eso puedes","clave":"","gris":false,"retraso":0,"fin":38.85},{"a":38.85,"b":39.17,"linea":"seguir","clave":"aquí","gris":false,"retraso":6,"fin":39.52}];
  var CORTES = [584, 681, 784, 986];
  var ZOOMS = [[0, 100], [3.87, 112], [6.63, 100], [10.13, 112], [13.2, 100], [17.03, 112], [19.47, 130], [22.7, 100], [26.13, 118], [28.7, 100], [32.87, 128], [36.93, 100]];
  var MARCAS = [
    [0.34, 2.26, "IMAGEN derecha: mujer del pobre", "V2. Lo malo va a la derecha, en gris"], [2.26, 4.15, "IMAGEN izquierda: mujer del rico", "V2. Lo bueno va a la izquierda, en color con borde azul"],
    [4.15, 5.39, "IMAGEN derecha: lo que le gusta al pobre", ""], [5.39, 6.8, "IMAGEN izquierda: lo que disfruta el rico", ""],
    [6.8, 8.84, "IMAGEN derecha: fin de semana del pobre", ""], [8.84, 10.38, "IMAGEN izquierda: fin de semana del rico", ""],
    [10.44, 11.78, "IMAGEN derecha: lo que escucha el pobre", ""], [11.78, 13.37, "IMAGEN izquierda: lo que escucha el rico", ""],
    [13.37, 15.13, "IMAGEN derecha: interior de la casa del pobre", ""], [15.13, 17.22, "IMAGEN izquierda: interior de la casa del rico", ""],
    [17.22, 18.16, "IMAGEN derecha: como se viste un pobre", ""], [18.16, 19.48, "IMAGEN izquierda: como se viste un rico", ""],
    [19.48, 22.74, "MOTION GRAPHIC: no es lo que tienes, es como piensas", "Idea: fondo negro, billetes tachados a un lado y una cabeza con el cerebro iluminado en azul al otro"],
    [22.74, 26.18, "MOTION GRAPHIC: programacion mental desde pequeno", "Idea: fondo papel, silueta de nino con lineas de codigo entrando en la cabeza"],
    [28.85, 32.91, "MOTION GRAPHIC: eliminar la programacion de pobre", "Idea: lista de creencias que se tachan una a una (poca abundancia, pobre)"],
    [32.91, 37.05, "MOTION GRAPHIC: exito y abundancia", "Idea: ClienteA recortado en blanco y negro sobre circulo azul, dos barras que se llenan"],
    [37.05, 39.3, "CIERRE: boton seguir @cliente_a_handle", ""]
  ];
  var r = {}, seq = null, i, T = 254016000000;
  for (i = 0; i < app.project.sequences.numSequences; i++) if (app.project.sequences[i].name.indexOf("CLIENTE-A_1009_01 - corte") === 0) seq = app.project.sequences[i];
  if (!seq) return JSON.stringify({ error: "sin secuencia" });
  app.project.openSequence(seq.sequenceID);
  if (seq.videoTracks[3].clips.numItems) return JSON.stringify({ error: "la pista V4 ya tiene clips" });
  app.enableQE();
  var q = qe.project.getActiveSequence();
  function tc(f) { function p(n) { return (n < 10 ? "0" : "") + n; } return "00:" + p(Math.floor(f / 1800)) + ":" + p(Math.floor(f / 30) % 60) + ":" + p(f % 30); }
  // 1. cortes extra por frase (vídeo y audio)
  for (i = 0; i < CORTES.length; i++) { try { q.getVideoTrackAt(0).razor(tc(CORTES[i])); for (var a = 0; a < seq.audioTracks.numTracks; a++) q.getAudioTrackAt(a).razor(tc(CORTES[i])); } catch (e) { r.errCorte = String(e); } }
  // 2. zooms como escala y posición del clip (centrados en la cara)
  var FX = 0.475, FY = 0.435, v1 = seq.videoTracks[0], zs = [];
  for (i = 0; i < v1.clips.numItems; i++) {
    var c = v1.clips[i], t = c.start.seconds, z = 100;
    if (t > 40) continue;
    for (var k = 0; k < ZOOMS.length; k++) if (t >= ZOOMS[k][0] - 0.06) z = ZOOMS[k][1];
    zs.push(t.toFixed(2) + ":" + z);
    if (z === 100) continue;
    for (var m = 0; m < c.components.numItems; m++) if (c.components[m].matchName === "AE.ADBE Motion" || c.components[m].displayName === "Movimiento") {
      var pr = c.components[m].properties, s = z / 100;
      pr[1].setValue(z, true); pr[0].setValue([FX + (0.5 - FX) * s, FY + (0.5 - FY) * s], true);
    }
  }
  r.zooms = zs.join(" "); r.clipsV1 = v1.clips.numItems;
  // 3. subtítulos de texto en V4
  var puestos = 0, fallos = [];
  for (i = 0; i < SUBS.length; i++) {
    var su = SUBS[i], linea = su.linea.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " "), ti = new Time(); ti.seconds = Math.round(su.a * 30) / 30;
    var clip = seq.importMGT(MOGRT, ti.ticks, 3, 0);
    if (!clip) { fallos.push(i); continue; }
    var fin = new Time(); fin.seconds = Math.round(su.fin * 30) / 30; clip.end = fin;
    clip.name = linea + (su.clave ? " / " + su.clave : "");
    var ps = clip.getMGTComponent().properties;
    var pl = ps.getParamForDisplayName("Linea"), pc = ps.getParamForDisplayName("Palabra clave");
    var j = JSON.parse(pl.getValue()); j.textEditValue = linea; j.fontTextRunLength = [linea.length]; pl.setValue(JSON.stringify(j), true);
    var kk = JSON.parse(pc.getValue()); kk.textEditValue = su.clave; kk.fontTextRunLength = [su.clave.length]; pc.setValue(JSON.stringify(kk), true);
    ps.getParamForDisplayName("Retraso clave (fotogramas)").setValue(su.clave && linea ? su.retraso : 0, true);
    if (su.gris) ps.getParamForDisplayName("Color clave").setColorValue(255, 205, 205, 205, true);
    puestos++;
  }
  r.subs = puestos; r.fallos = fallos;
  // 4. marcadores con las imágenes que faltan y las ideas de motion graphics
  for (i = 0; i < MARCAS.length; i++) { var mk = seq.markers.createMarker(MARCAS[i][0]); mk.name = MARCAS[i][2]; mk.comments = MARCAS[i][3]; var e2 = new Time(); e2.seconds = MARCAS[i][1]; mk.end = e2; try { mk.setColorByIndex(MARCAS[i][2].indexOf("MOTION") === 0 ? 5 : MARCAS[i][2].indexOf("CIERRE") === 0 ? 3 : 1, 0); } catch (e) {} }
  r.marcadores = MARCAS.length;
  try { seq.videoTracks[1].name = "IMAGENES"; seq.videoTracks[2].name = "MOTION GRAPHICS"; seq.videoTracks[3].name = "SUBTITULOS"; } catch (e) { r.nombresPista = String(e); }
  var tiempos = [1.9, 5.0, 20.0, 21.9, 27.9, 35.3];
  for (i = 0; i < tiempos.length; i++) { seq.setPlayerPosition(String(Math.round(tiempos[i] * T))); q.exportFramePNG(q.CTI.timecode, "/private/tmp/claude-501/-Users-USUARIO/ee0e846e-677a-48a5-82b2-eed5c985a811/scratchpad/am-" + i); }
  seq.setPlayerPosition("0");
  app.project.save();
  return JSON.stringify(r);
})();
