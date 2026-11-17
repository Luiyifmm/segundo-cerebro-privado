// Genera un XML de montaje limpio (sin descartes) con el audio en tablero de ajedrez y solapes en los cortes elegidos:
// en esos cortes la frase siguiente entra unos fotogramas antes de que termine el audio de la anterior (más continuidad).
// Uso: node montaje-solapado.js <reel> --solapar 1,2,3,6 [--max 8] [--fin 73]
//   --solapar: números de corte (1 = entre el clip 1 y el 2). Escribe "<reel> - montaje.xml", <reel>.montaje.json y desplaza palabras.json.
const fs = require("fs"), path = require("path");
const a = process.argv.slice(2), id = a[0], op = (k, d) => { const i = a.indexOf("--" + k); return i > 0 ? a[i + 1] : d; };
const bd = JSON.parse(fs.readFileSync(path.join(__dirname, "reels.json"), "utf8")); const reel = (bd.reels || bd).find((r) => r.id === id);
const xml = fs.readFileSync(reel.xml, "utf8"), fp = path.join(reel.dir, id + ".palabras.json"), fo = path.join(reel.dir, id + ".palabras.corte.json");
if (!fs.existsSync(fo)) fs.copyFileSync(fp, fo);
const P = JSON.parse(fs.readFileSync(fo, "utf8")), FIN = +op("fin", 73) * 30, MAX = +op("max", 8), SOL = new Set(op("solapar", "").split(",").filter(Boolean).map(Number));
const num = (s, k) => +s.match(new RegExp(`<${k}>(-?\\d+)</${k}>`))[1];
const clips = [...xml.matchAll(/<clipitem id="v(\d+)">[\s\S]*?<\/clipitem>/g)].map((m) => ({ c: m[0], st: num(m[0], "start"), en: num(m[0], "end"), in: num(m[0], "in"), fid: m[0].match(/<file id="([^"]+)"/)[1], nombre: m[0].match(/<name>([^<]*)/)[1], dur: num(m[0], "duration") })).filter((c) => c.st < FIN).sort((x, y) => x.st - y.st);
const defs = {}; for (const m of xml.matchAll(/<file id="([^"]+)">[\s\S]*?<\/file>/g)) defs[m[1]] = m[0];
const rate = "<rate><timebase>30</timebase><ntsc>FALSE</ntsc></rate>", esc = (s) => s;
// solape de cada corte: limitado por el silencio que queda tras la última palabra del clip anterior
let desfase = 0, par = 0; const info = [];
clips.forEach((c, k) => {
  c.len = c.en - c.st; c.ini = c.st - desfase; c.par = par; c.recorte = 0;
  const sig = clips[k + 1];
  if (sig && SOL.has(k + 1)) {
    const ult = Math.max(...P.filter((w) => w.a < c.en / 30).map((w) => w.b)), cola = c.en / 30 - ult, O = Math.max(0, Math.min(MAX, Math.floor((cola - 0.2) * 30)));
    if (O >= 3) { c.recorte = O; desfase += O; par = 1 - par; info.push({ corte: k + 1, enSeg: +((c.en - desfase) / 30).toFixed(2), fotogramas: O, colaSeg: +cola.toFixed(2) }); }
    else info.push({ corte: k + 1, sinSolape: "poco silencio (" + cola.toFixed(2) + " s)" });
  }
  c.despl = desfase;
});
const usado = new Set();
const file = (fid) => { if (usado.has(fid)) return `<file id="${fid}"/>`; usado.add(fid); return defs[fid]; };
const links = (k, c, idx) => `<link><linkclipref>v${k}</linkclipref><mediatype>video</mediatype><trackindex>1</trackindex><clipindex>${k + 1}</clipindex></link>` + [1, 2].map((ch) => `<link><linkclipref>a${ch}_${k}</linkclipref><mediatype>audio</mediatype><trackindex>${c.par * 2 + ch}</trackindex><clipindex>${idx[c.par][k]}</clipindex></link>`).join("");
const idx = [{}, {}]; let n0 = 0, n1 = 0; clips.forEach((c, k) => { idx[c.par][k] = c.par ? ++n1 : ++n0; });
const video = clips.map((c, k) => `<clipitem id="v${k}"><name>${esc(c.nombre)}</name><enabled>TRUE</enabled><duration>${c.dur}</duration>${rate}<start>${c.ini}</start><end>${c.ini + c.len - c.recorte}</end><in>${c.in}</in><out>${c.in + c.len - c.recorte}</out>${file(c.fid)}${links(k, c, idx)}</clipitem>`).join("");
const pistaAudio = (parN, ch) => `<track>${clips.map((c, k) => (c.par !== parN ? "" : `<clipitem id="a${ch}_${k}"><name>${esc(c.nombre)}</name><enabled>TRUE</enabled><duration>${c.dur}</duration>${rate}<start>${c.ini}</start><end>${c.ini + c.len}</end><in>${c.in}</in><out>${c.in + c.len}</out><file id="${c.fid}"/><sourcetrack><mediatype>audio</mediatype><trackindex>${ch}</trackindex></sourcetrack>${links(k, c, idx)}</clipitem>`)).join("")}<enabled>TRUE</enabled><locked>FALSE</locked><outputchannelindex>${ch}</outputchannelindex></track>`;
const ult = clips[clips.length - 1], total = ult.ini + ult.len, nombre = `${id} - v2 audio solapado`;
const fmt = xml.match(/<media><video><format>[\s\S]*?<\/format>/)[0];
const out = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE xmeml>\n<xmeml version="4">\n<sequence id="montaje"><name>${nombre}</name><duration>${total}</duration>${rate}<timecode>${rate}<string>00:00:00:00</string><frame>0</frame><displayformat>NDF</displayformat></timecode>\n${fmt}<track>${video}<enabled>TRUE</enabled><locked>FALSE</locked></track></video>\n<audio><numOutputChannels>2</numOutputChannels><format><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics></format>\n${pistaAudio(0, 1)}\n${pistaAudio(0, 2)}\n${pistaAudio(1, 1)}\n${pistaAudio(1, 2)}\n</audio></media></sequence>\n</xmeml>\n`;
const salida = path.join(reel.dir, id + " - montaje.xml"); fs.writeFileSync(salida, out);
// palabras desplazadas según el clip al que pertenecen
const W = P.filter((w) => w.a < ult.en / 30).map((w) => { const c = clips.find((c) => w.a >= c.st / 30 - 0.01 && w.a < c.en / 30) || ult; const d = (c.st - c.ini) / 30; return { ...w, a: +(w.a - d).toFixed(3), b: +(w.b - d).toFixed(3) }; });
fs.writeFileSync(fp, JSON.stringify(W));
const meta = { secuencia: nombre, xml: salida, fotogramas: total, seg: +(total / 30).toFixed(2), clips: clips.map((c) => ({ ini: +(c.ini / 30).toFixed(3), fin: +((c.ini + c.len - c.recorte) / 30).toFixed(3), par: c.par, nombre: c.nombre.slice(0, 30) })), solapes: info };
fs.writeFileSync(path.join(reel.dir, id + ".montaje.json"), JSON.stringify(meta, null, 1));
console.log(JSON.stringify(meta.solapes), "\nduración", meta.seg, "s →", salida); console.log(meta.clips.map((c) => `${c.ini}-${c.fin} par${c.par} ${c.nombre}`).join("\n"));
