// Genera src/alternativas.json: la lista de capas de cada versión (la leen Remotion y el generador del XML de Premiere).
const fs = require("fs");
const PARES = [
  { a: 0.2, m: 2.45, b: 4.85, mal: "img0.jpg", bien: "img1.jpg", malT: "UNA NOCHE", bienT: "TODA LA VIDA" },
  { a: 4.9, m: 7.7, b: 8.85, mal: "img2.jpg", bien: "img3.jpg", malT: "UNA COSA", bienT: "RESPETO" },
  { a: 8.95, m: 11.55, b: 13.45, mal: "img4.jpg", bien: "img5.jpg", malT: "PERDER EL TIEMPO", bienT: "PROSPERAR" },
];
const FINAL = [ { a: 19.75, b: 22.2, src: "img8.jpg" }, { a: 22.2, b: 23.4, src: "img6.jpg" }, { a: 23.4, b: 24.45, src: "img7.jpg" } ];
const FRASES = [
  { a: 13.5, b: 15.5, l1: "La regla es cruel", l2: "pero innegable" },
  { a: 15.5, b: 17.9, l1: "Atraes exactamente", l2: "lo que proyectas" },
  { a: 17.9, b: 19.7, l1: "Como es adentro", l2: "es afuera" },
];
const DUR = 785 / 30;
const VEL = 1.1;
const tarjetas = (L, pIzq, pDer, extra = {}) => {
  const out = [];
  PARES.forEach((p) => {
    out.push({ tipo: "tarjeta", pista: pIzq, src: p.mal, lado: "izq", ...L.izq, a: p.a, b: p.b, etiqueta: p.malT, bueno: false, ...extra });
    out.push({ tipo: "tarjeta", pista: pDer, src: p.bien, lado: "der", ...L.der, a: p.m, b: p.b, etiqueta: p.bienT, bueno: true, ...extra });
  });
  FINAL.forEach((f, i) => out.push({ tipo: "tarjeta", pista: i % 2 ? pDer : pIzq, src: f.src, lado: i % 2 ? "der" : "izq", ...(i % 2 ? L.der : L.izq), a: f.a, b: f.b, bueno: true, ...extra }));
  return out;
};
const A = { izq: { cx: 232, cy: 545, w: 420, h: 560, rot: -4 }, der: { cx: 848, cy: 545, w: 420, h: 560, rot: 4 } };
const B = { izq: { cx: 287, cy: 525, w: 470, h: 640, rot: 0 }, der: { cx: 793, cy: 525, w: 470, h: 640, rot: 0 } };
const C = { izq: { cx: 200, cy: 650, w: 250, h: 320, rot: -7 }, der: { cx: 880, cy: 650, w: 250, h: 320, rot: 7 } };
const todo = { a: 0, b: DUR };
// Segunda tanda: lados cambiados (lo "malo" a la derecha, lo "bueno" a la izquierda) y otras entradas
const tarjetas2 = (L, pIzq, pDer, extra = {}) => {
  const out = [];
  PARES.forEach((p) => {
    out.push({ tipo: "tarjeta", pista: pDer, src: p.mal, lado: "der", ...L.der, a: p.a, b: p.b, etiqueta: p.malT, bueno: false, ...extra });
    out.push({ tipo: "tarjeta", pista: pIzq, src: p.bien, lado: "izq", ...L.izq, a: p.m, b: p.b, etiqueta: p.bienT, bueno: true, ...extra });
  });
  FINAL.forEach((f, i) => out.push({ tipo: "tarjeta", pista: i % 2 ? pIzq : pDer, src: f.src, lado: i % 2 ? "izq" : "der", ...(i % 2 ? L.izq : L.der), a: f.a, b: f.b, bueno: true, ...extra }));
  return out;
};
const mitades = (pIzq, pDer) => [
  ...PARES.flatMap((p) => [
    { tipo: "mitad", pista: pDer, src: p.mal, lado: "der", a: p.a, b: p.b, etiqueta: p.malT, bueno: false },
    { tipo: "mitad", pista: pIzq, src: p.bien, lado: "izq", a: p.m, b: p.b, etiqueta: p.bienT, bueno: true },
  ]),
  ...FINAL.map((f, i) => ({ tipo: "mitad", pista: i % 2 ? pIzq : pDer, src: f.src, lado: i % 2 ? "izq" : "der", a: f.a, b: f.b, bueno: true })),
];
const PILA = { cx: 540, cy: 350, w: 500, h: 540 };
const pila = (p1, p2) => [
  ...PARES.flatMap((p) => [
    { tipo: "tarjeta", pista: p1, src: p.mal, lado: "der", ...PILA, rot: 5, a: p.a, b: p.b, bueno: false, estilo: "polaroid", entrada: "arriba" },
    { tipo: "tarjeta", pista: p2, src: p.bien, lado: "izq", ...PILA, rot: -4, a: p.m, b: p.b, bueno: true, estilo: "polaroid", entrada: "arriba" },
  ]),
  ...FINAL.map((f, i) => ({ tipo: "tarjeta", pista: i % 2 ? p2 : p1, src: f.src, lado: i % 2 ? "izq" : "der", ...PILA, rot: i % 2 ? -4 : 5, a: f.a, b: f.b, bueno: true, estilo: "polaroid", entrada: "arriba" })),
];
const palabras = (pista) => PARES.flatMap((p) => [
  { tipo: "palabra", pista, texto: p.malT, bueno: false, a: p.a, b: p.m },
  { tipo: "palabra", pista, texto: p.bienT, bueno: true, a: p.m, b: p.b },
]);
const D = { izq: { cx: 140, cy: 940, w: 230, h: 230, rot: 0 }, der: { cx: 940, cy: 940, w: 230, h: 230, rot: 0 } };
const versiones = [
  { n: 1, nombre: "1 - Fondo negro", capas: [
    { tipo: "archivo", pista: 1, archivo: "negro.mp4", ...todo },
    ...tarjetas2(A, 2, 3, { estilo: "blanco" }),
    { tipo: "persona", pista: 4, escala: 1, dy: 0, filtro: "", ...todo },
    { tipo: "subs", pista: 5, y: 1250, ...todo },
  ] },
  { n: 2, nombre: "2 - Estudio calido", capas: [
    { tipo: "habitacion", pista: 1, ...todo },
    ...tarjetas2(A, 2, 3, { estilo: "blanco" }),
    { tipo: "persona", pista: 4, escala: 1.3, dy: 233, filtro: "brightness(0.9) sepia(0.22) saturate(1.1)", sombra: true, ...todo },
    { tipo: "mesa", pista: 5, ...todo },
    { tipo: "subs", pista: 6, y: 1345, ...todo },
  ] },
  { n: 3, nombre: "3 - Pantalla partida", capas: [
    { tipo: "baseSplit", pista: 1, ...todo },
    ...tarjetas2(B, 2, 3, { estilo: "comparativa" }),
    ...FRASES.map((f) => ({ tipo: "frase", pista: 2, ...f })),
    { tipo: "frase", pista: 2, a: 24.5, b: DUR, l1: "Mejora tu vida", l2: "Sígueme" },
    { tipo: "subs", pista: 4, y: 1500, ...todo },
  ] },
  { n: 4, nombre: "4 - Cuadros en la pared", capas: [
    { tipo: "archivo", pista: 1, archivo: "base.mp4", ...todo },
    ...tarjetas2(A, 2, 3, { estilo: "cuadro" }),
    { tipo: "persona", pista: 4, escala: 1, dy: 0, filtro: "", ...todo },
    { tipo: "gancho", pista: 5, texto: "ATRAES LO QUE", clave: "PROYECTAS", ...todo },
    { tipo: "subs", pista: 6, y: 1250, ...todo },
  ] },
  { n: 5, nombre: "5 - Tarjeta podcast", capas: [
    { tipo: "basePodcast", pista: 1, ...todo },
    ...tarjetas2(C, 2, 3, { estilo: "polaroid" }),
    { tipo: "subs", pista: 4, y: 1450, ...todo },
  ] },
  { n: 6, nombre: "6 - Verde y lima (zoom desde atras)", color: "#C8FF3D", tinta: "#111", capas: [
    { tipo: "fondoMarca", pista: 1, tonos: ["#1fbf7a", "#0b6b47", "#053524", "#02160f"], ...todo },
    ...tarjetas2(A, 2, 3, { estilo: "blanco", entrada: "zoom" }),
    { tipo: "persona", pista: 4, escala: 1, dy: 0, filtro: "", espejo: true, vel: VEL, ...todo },
    { tipo: "subs", pista: 5, y: 1250, ...todo },
  ] },
  { n: 7, nombre: "7 - Mitades a pantalla completa (rojo)", color: "#FF3B30", capas: [
    { tipo: "archivo", pista: 1, archivo: "negro.mp4", ...todo },
    ...mitades(2, 3),
    { tipo: "persona", pista: 4, escala: 1, dy: 0, filtro: "", espejo: true, vel: VEL, ...todo },
    { tipo: "subs", pista: 5, y: 1250, ...todo },
  ] },
  { n: 8, nombre: "8 - Editorial naranja (suben desde abajo)", color: "#E4572E", capas: [
    { tipo: "fondoCrema", pista: 1, tonos: ["#fff7ee", "#f6e3cf", "#e8c6a6"], ...todo },
    ...tarjetas2(A, 2, 3, { estilo: "cinta", entrada: "abajo" }),
    { tipo: "persona", pista: 4, escala: 1, dy: 0, filtro: "", espejo: true, vel: VEL, ...todo },
    { tipo: "titular", pista: 5, l1: "Atraes lo que", l2: "proyectas", ...todo },
    { tipo: "subs", pista: 6, y: 1250, ...todo },
  ] },
  { n: 9, nombre: "9 - Fotos que caen arriba (amarillo)", color: "#FFD60A", tinta: "#111", capas: [
    { tipo: "video", pista: 1, src: "base.mp4", espejo: true, vel: VEL, ...todo },
    ...pila(2, 3),
    { tipo: "subs", pista: 4, y: 1250, ...todo },
  ] },
  { n: 10, nombre: "10 - Palabra gigante detras (violeta)", color: "#A855F7", capas: [
    { tipo: "archivo", pista: 1, archivo: "negro.mp4", ...todo },
    ...palabras(2),
    ...tarjetas2(D, 3, 4, { estilo: "circulo", entrada: "desenfoque" }),
    { tipo: "persona", pista: 5, escala: 1, dy: 0, filtro: "", espejo: true, vel: VEL, ...todo },
    { tipo: "subs", pista: 6, y: 1250, ...todo },
  ] },
];
// Versión 11: la 3 (pantalla partida) con el segundo juego de imágenes del usuario
{ const v3 = versiones.find((v) => v.n === 3);
  versiones.push({ n: 11, nombre: "3B - Pantalla partida (imagenes nuevas)", capas: v3.capas.map((c) => (c.tipo === "tarjeta" && /^img[0-5]\.jpg$/.test(c.src) ? { ...c, src: "set2/" + c.src } : { ...c })) }); }
// Versión 12: la 2 (estudio cálido) con el tercer juego de imágenes, subtítulos en rojo y las 3 imágenes finales centradas subiendo desde abajo
{ const v2 = versiones.find((v) => v.n === 2), FIN = { "img8.jpg": "fin0.jpg", "img6.jpg": "fin1.jpg", "img7.jpg": "fin2.jpg" };
  versiones.push({ n: 12, nombre: "2B - Estudio calido (imagenes nuevas, subtitulos rojos)", capas: v2.capas.map((c) => {
    if (c.tipo === "tarjeta" && /^img[0-5]\.jpg$/.test(c.src)) return { ...c, src: "set3/" + c.src };
    if (c.tipo === "tarjeta" && FIN[c.src]) return { ...c, src: "set3/" + FIN[c.src], cx: 540, cy: 520, rot: 0, entrada: "abajo", bueno: false };
    if (c.tipo === "subs") return { ...c, color: "#E5261F" };
    return { ...c }; }) }); }
// Versión 13: la 11 con motion graphics en vez de frases e imágenes finales, subtítulos limpios (palabra clave en azul) y 1,1× de velocidad
{ const v11 = versiones.find((v) => v.n === 11), MG = [[13.5, 15.5, "regla"], [15.5, 17.9, "atrae"], [17.9, 19.7, "dentro"], [19.75, 22.2, "mundo"], [22.2, 23.4, "tratar"], [23.4, 24.45, "valorar"], [24.5, DUR, "seguir"]];
  const k = (x) => +(x / VEL).toFixed(3);
  versiones.push({ n: 13, nombre: "3C - Pantalla partida con motion graphics", frames: Math.round(785 / VEL), capas: [
    { tipo: "baseSplit", pista: 1, vel: VEL, a: 0, b: k(DUR) },
    ...v11.capas.filter((c) => c.tipo === "tarjeta" && /^set2\//.test(c.src)).map((c) => ({ ...c, a: k(c.a), b: k(c.b) })),
    ...MG.map(([a, b, que]) => ({ tipo: "mg", pista: 2, que, a: k(a), b: k(b) })),
    { tipo: "subsLimpios", pista: 4, y: 1450, vel: VEL, a: 0, b: k(DUR) },
  ] }); }
// Versión 14: prueba del estilo elegante (referencia S Project): plano completo con cortes de zoom, miniaturas redondeadas
// (lo "malo" a la derecha, lo "bueno" a la izquierda), subtítulo pequeño + palabra clave en serif cursiva, un gráfico de línea fina y cierre
{ const M = { w: 290, h: 390, cy: 400 }, ET = { "UNA NOCHE": "una noche", "TODA LA VIDA": "toda la vida", "UNA COSA": "una cosa", "RESPETO": "la respetan", "PERDER EL TIEMPO": "perder el tiempo", "PROSPERAR": "prosperar" };
  versiones.push({ n: 14, nombre: "Trial - Estilo elegante (referencia S Project)", capas: [
    { tipo: "baseElegante", pista: 1, ...todo },
    ...PARES.flatMap((p) => [
      { tipo: "mini", pista: 2, src: "set2/" + p.mal, lado: "der", cx: 850, rot: 3, ...M, a: p.a, b: p.b, etiqueta: ET[p.malT], bueno: false },
      { tipo: "mini", pista: 3, src: "set2/" + p.bien, lado: "izq", cx: 230, rot: -3, ...M, a: p.m, b: p.b, etiqueta: ET[p.bienT], bueno: true },
      { tipo: "versus", pista: 4, y: 384, a: p.m + 0.1, b: p.b },
    ]),
    { tipo: "espejo", pista: 2, a: 15.6, b: 19.78, viaje: 16.5, junta: 17.94 },
    { tipo: "seguir", pista: 2, y: 420, cuenta: "aminbusinesss", a: 24.6, b: DUR },
    { tipo: "subsElegantes", pista: 5, y: 1175, ...todo },
  ] }); }
// Versión 15: la 14 con el azul de marca de Amin, motion graphics a pantalla completa y sin capa de subtítulos
// (los subtítulos se colocan en Premiere como plantillas de texto editables, una por frase)
{ const v14 = versiones.find((v) => v.n === 14), AZUL = "#1E8BFF";
  versiones.push({ n: 15, nombre: "Trial - Estilo elegante azul", capas: [
    ...v14.capas.filter((c) => !["espejo", "subsElegantes"].includes(c.tipo)).map((c) => (c.tipo === "mini" ? { ...c, color: AZUL } : { ...c })),
    { tipo: "mgPantalla", pista: 4, que: "proyectas", color: AZUL, a: 15.6, b: 19.78, viaje: 16.5, junta: 17.94 },
    { tipo: "mgPantalla", pista: 4, que: "valor", color: AZUL, a: 21.68, b: 24.52, t1: 22.6, t2: 23.7 },
  ] }); }
// Versión 16: la 15 con motion graphics tipo póster (referencias de Pinterest del usuario): negro con detalles técnicos,
// papel crema con cuadrícula, y Amin recortado en blanco y negro sobre un círculo azul
{ const v15 = versiones.find((v) => v.n === 15), AZUL = "#1E8BFF";
  versiones.push({ n: 16, nombre: "Trial - Estilo elegante azul v2", capas: [
    ...v15.capas.filter((c) => c.tipo !== "mgPantalla").map((c) => ({ ...c })),
    { tipo: "mgPantalla", pista: 4, que: "proyectas", color: AZUL, a: 15.6, b: 17.94, viaje: 16.4 },
    { tipo: "mgPantalla", pista: 4, que: "dentro", color: AZUL, a: 17.94, b: 19.78, fuera: 19.2 },
    { tipo: "mgPantalla", pista: 4, que: "persona", color: AZUL, a: 21.68, b: 24.52, t1: 22.6, t2: 23.7 },
  ] }); }
// Versiones 6-10: color propio, espejo y vídeo acelerado (los tiempos se comprimen; la voz se acelera aparte sin cambiar el tono)
for (const v of versiones.filter((v) => v.n >= 6 && v.n <= 10)) {
  v.vel = VEL; v.frames = Math.round(785 / VEL);
  for (const c of v.capas) {
    c.a = +(c.a / VEL).toFixed(3); c.b = +(c.b / VEL).toFixed(3);
    if (c.tipo === "subs") c.vel = VEL;
    if (["tarjeta", "mitad", "palabra", "titular", "subs"].includes(c.tipo)) { c.color = v.color; if (c.tipo === "subs" && v.tinta) c.tinta = v.tinta; }
  }
}
// Identificador estable por contenido: capas idénticas en varias versiones comparten archivo
const crypto = require("crypto");
for (const v of versiones) for (const c of v.capas) {
  const { pista, ...resto } = c;
  c.id = c.tipo === "archivo" ? c.archivo : c.tipo + "-" + crypto.createHash("md5").update(JSON.stringify(resto)).digest("hex").slice(0, 8);
}
fs.writeFileSync(__dirname + "/alternativas.json", JSON.stringify({ fps: 30, frames: 785, versiones }, null, 1));
const unicas = new Set(versiones.flatMap((v) => v.capas.map((c) => c.id)));
console.log(versiones.map((v) => v.nombre + ": " + v.capas.length + " capas").join("\n"), "\ncapas únicas:", unicas.size);
