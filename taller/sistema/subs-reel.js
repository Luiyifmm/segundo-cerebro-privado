// Parte las palabras de un reel cortado en subtítulos "línea pequeña + palabra clave" para la plantilla MOGRT de subtítulos.
// Uso: node subs-reel.js <reel> --claves rico,riqueza --gris pobre [--cambia "tiene=tienes;tu=tú"] [--desde aquí=36]
// Escribe <reel>.subs.json en la carpeta del reel.
const fs = require("fs"), path = require("path");
const a = process.argv.slice(2), id = a[0];
const op = (k, d = "") => { const i = a.indexOf("--" + k); return i > 0 ? a[i + 1] : d; };
const reel = JSON.parse(fs.readFileSync(path.join(__dirname, "reels.json"), "utf8")).reels?.find?.((r) => r.id === id) || JSON.parse(fs.readFileSync(path.join(__dirname, "reels.json"), "utf8")).find?.((r) => r.id === id);
const dir = reel.dir;
const P = JSON.parse(fs.readFileSync(path.join(dir, id + ".palabras.json"), "utf8"));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ]/g, "");
const lista = (k) => new Set(op(k).split(",").filter(Boolean).map(norm));
const CLAVES = lista("claves"), GRIS = lista("gris");
const cambia = Object.fromEntries(op("cambia").split(";").filter(Boolean).map((x) => x.split("=")));
const desde = Object.fromEntries(op("desde").split(";").filter(Boolean).map((x) => { const [k, v] = x.split("="); return [norm(k), +v]; }));
const limpia = (s) => { const t = s.replace(/[.,?¿!¡]/g, "").toLowerCase(); return cambia[t] ?? t; };
const esClave = (p) => { const n = norm(p.t); return (CLAVES.has(n) || GRIS.has(n)) && !(desde[n] > p.a); };
const subs = []; let cur = [];
const cierra = (clave) => { if (!cur.length && !clave) return; const todas = clave ? [...cur, clave] : cur; subs.push({ a: todas[0].a, b: todas[todas.length - 1].b, linea: cur.map((p) => limpia(p.t)).join(" "), clave: clave ? limpia(clave.t) : "", gris: !!clave && GRIS.has(norm(clave.t)), retraso: clave && cur.length ? Math.max(0, Math.round((clave.a - cur[0].a) * 30)) : 0 }); cur = []; };
for (const p of P) {
  const prev = cur[cur.length - 1];
  if (prev && (p.a - prev.b > 0.3 || /[.,?]$/.test(prev.t))) cierra();
  if (esClave(p)) { cierra(p); continue; }
  if (cur.length >= 3) cierra();
  cur.push(p);
}
cierra();
const fin = P[P.length - 1].b + 0.4;
subs.forEach((s) => { s.a = +Math.max(0, s.a - 0.04).toFixed(3); });
subs.forEach((s, i) => { const sig = subs[i + 1]; s.fin = +Math.min(s.b + 0.35, sig ? sig.a : fin).toFixed(3); });
fs.writeFileSync(path.join(dir, id + ".subs.json"), JSON.stringify(subs));
console.log(subs.map((s) => `${s.a.toFixed(2)}-${s.fin.toFixed(2)}  ${s.linea}${s.clave ? " / " + s.clave.toUpperCase() + (s.gris ? " (gris)" : "") : ""}`).join("\n"), "\n", subs.length, "subtítulos →", path.join(dir, id + ".subs.json"));
