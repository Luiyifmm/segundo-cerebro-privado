// Parte las palabras en subtítulos "línea pequeña + palabra clave" para la plantilla MOGRT "Subtitulo elegante".
// Uso: node subs-texto.js <salida.json>
const fs = require("fs");
const P = require("./src/palabras.json");
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ]/g, "");
const CLAVES = new Set(["noche", "vida", "cosa", "respetan", "tiempo", "prosperar", "innegable", "proyectas", "adentro", "afuera", "mundo", "tratar", "valorar", "sigueme"]);
const limpia = (s) => s.replace(/[.,?¿]/g, "").toLowerCase();
const subs = []; let cur = [];
const cierra = (clave) => { if (!cur.length && !clave) return; const todas = clave ? [...cur, clave] : cur; subs.push({ a: todas[0].a, b: todas[todas.length - 1].b, linea: cur.map((p) => limpia(p.t)).join(" "), clave: clave ? limpia(clave.t) : "", retraso: clave && cur.length ? Math.max(0, Math.round((clave.a - cur[0].a) * 30)) : 0 }); cur = []; };
P.forEach((p, i) => {
  const prev = cur[cur.length - 1];
  if (prev && (p.a - prev.b > 0.3 || /[.,?]$/.test(prev.t))) cierra();
  if (CLAVES.has(norm(p.t))) return cierra(p);
  if (cur.length >= 3) cierra();
  cur.push(p);
});
cierra();
// cada subtítulo dura hasta que empieza el siguiente (máximo 0,35 s después de su última palabra)
subs.forEach((s) => { s.a = +Math.max(0, s.a - 0.04).toFixed(3); });
subs.forEach((s, i) => { const sig = subs[i + 1]; s.fin = +Math.min(s.b + 0.35, sig ? sig.a : 785 / 30).toFixed(3); });
fs.writeFileSync(process.argv[2], JSON.stringify(subs));
console.log(subs.map((s) => `${s.a.toFixed(2)}-${s.fin.toFixed(2)}  ${s.linea}${s.clave ? " / " + s.clave.toUpperCase() : ""}`).join("\n"), "\n", subs.length, "subtítulos");
