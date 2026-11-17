// Marcadores de un reel cortado: uno por frase (inicio de la frase en la línea de tiempo del corte, texto de la frase).
// Uso: node marcadores.js <ID>...  → <reel>/<ID>.marcadores.json  [{t, nombre, tipo: gancho|frase|cta}]
const fs = require("fs"), path = require("path"); const bd = JSON.parse(fs.readFileSync(path.join(__dirname, "reels.json"))).reels;
for (const id of process.argv.slice(2)) { const r = bd.find((x) => x.id === id), P = JSON.parse(fs.readFileSync(path.join(r.dir, id + ".palabras.json"))), M = []; let cur = [];
  const cierra = () => { if (cur.length) M.push({ t: +cur[0].a.toFixed(3), nombre: cur.map((p) => p.t).join(" ").slice(0, 70) }); cur = []; };
  for (const p of P) { const prev = cur[cur.length - 1]; if (prev && (/[.?!]$/.test(prev.t) || p.a - prev.b > 0.6)) cierra(); cur.push(p); } cierra();
  M.forEach((m, i) => (m.tipo = i === 0 ? "gancho" : i === M.length - 1 ? "cta" : "frase"));
  fs.writeFileSync(path.join(r.dir, id + ".marcadores.json"), JSON.stringify(M, null, 1)); console.log(id, M.length, "marcadores"); }
