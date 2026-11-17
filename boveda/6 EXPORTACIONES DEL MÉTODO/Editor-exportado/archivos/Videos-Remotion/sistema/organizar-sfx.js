// Copia ordenada y sin duplicados de los efectos de sonido. No toca el origen.
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const [origen, destino] = process.argv.slice(2);
const REGLAS = [
  ["05 Cámara", /camera|camara|shutter|flash/i],
  ["01 Whooshes", /wh?oosh|swoosh|whip|cinetransitions|^sound effect 2/i],
  ["02 Risers", /rise+r/i],
  ["03 Booms e impactos", /boom|impact|grand hit/i],
  ["04 Bajos (bass drops)", /bass|downer/i],
  ["06 Teclado y clics", /keyboard|tecla|typ(e|ing)|mouse|lighter|click/i],
  ["07 Rotulador y escritura", /resaltador|subrayado|bol[ií]grafo|marker/i],
  ["08 Ambiente y drones", /drone|wind(?!ows)|thunder|pulse|warhorn/i],
  ["09 Interfaz y avisos", /pop up|notification|error|among us|counter|acierto|censored|cash|disappear|reloj/i],
];
const AUDIO = /\.(wav|mp3|m4a|mpeg|aif+)$/i;
const andar = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? andar(path.join(d, e.name)) : [path.join(d, e.name)]));
const vistos = new Map(), nombres = new Set(), informe = {}, saltados = [];
let dup = 0;
for (const f of andar(origen).sort((a, b) => a.length - b.length)) {
  if (!AUDIO.test(f)) { saltados.push(path.relative(origen, f)); continue; }
  const buf = fs.readFileSync(f);
  const h = crypto.createHash("md5").update(buf).digest("hex");
  if (vistos.has(h)) { dup++; continue; }
  let nombre = path.basename(f).normalize("NFC").replace(/^Copia de /i, "").replace(/\.wav\.wav$/i, ".wav").replace(/^-/, "");
  const cat = (REGLAS.find(([, r]) => r.test(nombre)) || ["10 Varios"])[0];
  let fin = nombre, i = 2;
  while (nombres.has((cat + "/" + fin).toLowerCase())) fin = nombre.replace(/(\.[^.]+)$/, ` (${i++})$1`);
  nombres.add((cat + "/" + fin).toLowerCase());
  vistos.set(h, fin);
  fs.mkdirSync(path.join(destino, cat), { recursive: true });
  fs.writeFileSync(path.join(destino, cat, fin), buf);
  (informe[cat] ||= []).push(fin);
}
for (const c of Object.keys(informe).sort()) console.log(c, informe[c].length);
console.log("duplicados quitados:", dup, "| no son audio:", saltados.length);
fs.writeFileSync(path.join(destino, "LEEME.txt"), "Copia ordenada de PACKS/SOUND EFFECTS, sin duplicados.\nEl pack original no se ha tocado.\n\n" + Object.keys(informe).sort().map((c) => c + " (" + informe[c].length + ")\n  " + informe[c].sort().join("\n  ")).join("\n\n") + "\n");
