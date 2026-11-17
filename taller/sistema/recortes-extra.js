// Quita tramos del corte ya generado (repeticiones dentro de una misma frase) y corrige palabras mal transcritas.
// Uso: node recortes-extra.js <reel> --quitar "54.90-60.20,64.73-69.66" [--palabras "pata ta cosida=patata cocida;asiantes=saciante"]
// Los tiempos son de la línea de tiempo del corte. Cada tramo debe empezar en el inicio de un clip. Reescribe el XML y palabras.json.
const fs = require("fs"), path = require("path");
const a = process.argv.slice(2), id = a[0], op = (k) => { const i = a.indexOf("--" + k); return i > 0 ? a[i + 1] : ""; };
const bd = JSON.parse(fs.readFileSync(path.join(__dirname, "reels.json"), "utf8")); const reel = (bd.reels || bd).find((r) => r.id === id);
const fx = reel.xml, fp = path.join(reel.dir, id + ".palabras.json");
let xml = fs.readFileSync(fx, "utf8"), P = JSON.parse(fs.readFileSync(fp, "utf8"));
const tramos = op("quitar").split(",").filter(Boolean).map((t) => t.split("-").map(Number)).sort((x, y) => y[0] - x[0]);   // de derecha a izquierda
const num = (s, k) => +s.match(new RegExp(`<${k}>(-?\\d+)</${k}>`))[1], pon = (s, k, v) => s.replace(new RegExp(`<${k}>-?\\d+</${k}>`), `<${k}>${v}</${k}>`);
for (const [ta, tb] of tramos) {
  const fa = Math.round(ta * 30), n = Math.round((tb - ta) * 30); let tocados = 0;
  xml = xml.replace(/<clipitem [^>]*>[\s\S]*?<\/clipitem>/g, (c) => {
    const st = num(c, "start"), en = num(c, "end");
    if (st === fa) { tocados++; return pon(pon(c, "in", num(c, "in") + n), "end", en - n); }
    if (st > fa) return pon(pon(c, "start", st - n), "end", en - n);
    return c; });
  if (!tocados) { console.error("ningún clip empieza en", ta); process.exit(1); }
  P = P.filter((w) => !(w.a >= ta - 0.02 && w.a < tb)).map((w) => (w.a >= tb ? { ...w, a: +(w.a - n / 30).toFixed(3), b: +(w.b - n / 30).toFixed(3) } : w));
  console.log(`quitado ${ta}-${tb} (${n} fotogramas, ${tocados} clips recortados)`);
}
for (const par of op("palabras").split(";").filter(Boolean)) {
  const [de, por] = par.split("="), D = de.split(" "), N = por.split(" "), limpio = (s) => s.toLowerCase().replace(/[.,?¿!¡]/g, "");
  for (let i = 0; i + D.length <= P.length; i++) if (D.every((d, k) => limpio(P[i + k].t) === d)) {
    const cola = (P[i + D.length - 1].t.match(/[.,?]$/) || [""])[0], ini = P[i].a, fin = P[i + D.length - 1].b, paso = (fin - ini) / N.length;
    P.splice(i, D.length, ...N.map((t, k) => ({ t: t + (k === N.length - 1 ? cola : ""), a: +(ini + k * paso).toFixed(3), b: +(ini + (k + 1) * paso).toFixed(3) })));
    console.log("corregido:", de, "→", por); }
}
fs.writeFileSync(fx, xml); fs.writeFileSync(fp, JSON.stringify(P));
