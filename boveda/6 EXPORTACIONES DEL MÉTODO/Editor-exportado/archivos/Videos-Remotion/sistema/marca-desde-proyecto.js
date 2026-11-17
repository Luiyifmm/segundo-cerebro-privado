// Saca la marca de cada cliente de sus proyectos de Premiere ya editados: fuentes, plantillas de texto, sonidos, música y overlays.
// Copia esos recursos a clientes/<cliente>/marca/ y escribe marca.json + "<Cliente> Branding.xml" (bandejas importables en Premiere).
// Uso: node marca-desde-proyecto.js <carpeta con clientee.xml/.json y ClienteA.xml/.json>
const fs = require("fs"), path = require("path"), os = require("os");
const D = process.argv[2], RAIZ = path.join(os.homedir(), "Videos-Remotion/clientes");
const AUDIO = /\.(wav|mp3|m4a)$/i;
const rutas = (xml) => { const m = {}; for (const x of xml.matchAll(/<ActualMediaFilePath>([^<]+)/g)) { const p = x[1].replace(/&amp;/g, "&"); m[path.basename(p).normalize("NFC").replace(/ #[0-9a-f]+(\.\w+)$/, "$1")] = p; m[path.basename(p).normalize("NFC")] = p; } return m; };
const fuentesDe = (xml, filtro) => { const c = {}; for (const m of xml.matchAll(/<StartKeyframeValue Encoding="base64"[^>]*>([^<]+)</g)) { const s = Buffer.from(m[1].replace(/\s/g, ""), "base64").toString("latin1"); if (filtro && !filtro(s)) continue; for (const f of s.matchAll(/[A-Z][A-Za-z0-9]+-[A-Za-z0-9]+/g)) c[f[0]] = (c[f[0]] || 0) + 1; } return Object.entries(c).sort((a, b) => b[1] - a[1]).map(([f, n]) => ({ fuente: f, usos: n })); };
const casos = [
  { cliente: "clientea", nombre: "ClienteA", xml: "ClienteA", sec: "IMG_6118", de: 0, a: 1e9, overlays: ["Degradado a negro subtítulos.png", "OVERLAY 1.mp4", "super 8 frame.png"], extra: [path.join(os.homedir(), "Downloads/overlay_seguir_ig_cliente_a_handle.mov")] },
  { cliente: "clientee", nombre: "ClienteE", xml: "clientee", sec: "Secuencia 01", de: 0, a: 84.4, overlays: [], extra: [] },
  { cliente: "clienten", nombre: "ClienteN", xml: "clientee", sec: "Secuencia 01", de: 84.4, a: 1e9, overlays: [], extra: [] },
];
for (const c of casos) {
  const xml = fs.readFileSync(path.join(D, c.xml + ".xml"), "utf8"), R = rutas(xml);
  const sec = JSON.parse(fs.readFileSync(path.join(D, c.xml + ".json"))).find((s) => s.nombre === c.sec);
  const usados = {}; let subt = [];
  sec.pistas.forEach((p, i) => p.clips.filter((k) => k.inicio >= c.de && k.inicio < c.a).forEach((k) => { const t = p.tipo[0] === "V" ? "V" : "A"; (usados[t + "|" + k.nombre] ||= []).push(+(k.inicio - c.de).toFixed(1)); if (k.nombre === "Gráfico") subt.push(k.fin - k.inicio); }));
  const lista = (t, f) => Object.entries(usados).filter(([k]) => k[0] === t && f(k.slice(2))).map(([k, v]) => ({ nombre: k.slice(2), usos: v.length, momentos: v.slice(0, 8) })).sort((x, y) => y.usos - x.usos);
  const dur = Math.max(...sec.pistas.filter((p) => p.tipo[0] === "V").flatMap((p) => p.clips.filter((k) => k.inicio >= c.de && k.inicio < c.a).map((k) => k.fin))) - c.de;
  const sfx = lista("A", (n) => AUDIO.test(n) && !usados["A|" + n].some((_, i) => false) && !(R[n] || "").includes("MÚSICA DE FONDO") && (usados["A|" + n].length > 1 || !/ - /.test(n) || /boom|bass|woosh|whoosh|riser|click|shutter|transition/i.test(n)));
  const musica = lista("A", (n) => AUDIO.test(n) && !sfx.some((s) => s.nombre === n));
  const plantillas = lista("V", (n) => !/\.\w{2,4}$/.test(n) && !/^(Gráfico|Capa de ajuste|\?|Secuencia)/.test(n));
  const dir = path.join(RAIZ, c.cliente, "marca");
  const copia = (sub, nombres) => nombres.map((n) => { const src = R[n.normalize("NFC")] || (fs.existsSync(n) ? n : null); if (!src || !fs.existsSync(src)) return { nombre: path.basename(n), falta: true }; const dst = path.join(dir, sub, path.basename(n)); fs.mkdirSync(path.dirname(dst), { recursive: true }); if (!fs.existsSync(dst)) fs.copyFileSync(src, dst); return { nombre: path.basename(n), archivo: dst }; });
  const aSfx = copia("sfx", sfx.map((s) => s.nombre)), aMus = copia("musica", musica.map((s) => s.nombre)), aOv = copia("overlays", [...c.overlays, ...c.extra]);
  const esc = (c.xml === "clientee") ? (s) => true : null;
  const fts = fuentesDe(xml).filter((f) => !/^(Faux|FS)/.test(f.fuente));
  const previa = fs.existsSync(path.join(dir, "marca.json")) ? JSON.parse(fs.readFileSync(path.join(dir, "marca.json"))) : {};
  const marca = { ...previa, cliente: c.nombre, origen: `${c.xml}.prproj › ${c.sec}` + (c.xml === "clientee" ? ` (${c.de ? "desde 1:24" : "hasta 1:21"})` : ""), duracion_ejemplo_s: +dur.toFixed(1),
    subtitulos: { ...(previa.subtitulos || {}), fuente: c.cliente === "clientea" ? "SF Pro Bold" : "Sequel Sans Medium Disp (resaltado: Heavy Disp)", color: "blanco", bloques: subt.length, segundos_por_bloque: +(subt.reduce((a, b) => a + b, 0) / (subt.length || 1)).toFixed(2), palabras_por_bloque: "1 a 3" },
    fuentes_en_el_proyecto: c.xml === "clientee" ? fts.map((f) => f.fuente + " (compartido ClienteE/ClienteN)") : fts.map((f) => f.fuente),
    plantillas_de_texto: plantillas, capas_de_ajuste: (usados["V|Capa de ajuste"] || []).length, sfx, musica, overlays: aOv.map((o) => o.nombre),
    ritmo: { efectos_de_sonido_por_10s: +((sfx.reduce((a, s) => a + s.usos, 0) / dur) * 10).toFixed(1) } };
  fs.writeFileSync(path.join(dir, "marca.json"), JSON.stringify(marca, null, 2));
  // XML con bandejas para importar en Premiere
  const e = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  let n = 0; const clip = (a) => `<clip id="c${++n}"><name>${e(a.nombre)}</name><duration>300</duration><rate><timebase>30</timebase><ntsc>FALSE</ntsc></rate><file id="f${n}"><name>${e(a.nombre)}</name><pathurl>file://localhost${encodeURI(a.archivo)}</pathurl></file></clip>`;
  const bin = (t, l) => `<bin><name>${t}</name><children>${l.filter((a) => a.archivo).map(clip).join("")}</children></bin>`;
  fs.writeFileSync(path.join(dir, `${c.nombre} Branding.xml`), `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE xmeml>\n<xmeml version="4">\n<bin><name>${c.nombre} Branding</name><children>${bin("01 SFX", aSfx)}${bin("02 MUSICA", aMus)}${bin("03 OVERLAYS Y FONDOS", aOv)}</children></bin>\n</xmeml>\n`);
  console.log(`\n== ${c.nombre}: ${dur.toFixed(0)} s de ejemplo`); console.log("  subtítulos:", marca.subtitulos.fuente, "·", subt.length, "bloques de", marca.subtitulos.segundos_por_bloque, "s"); console.log("  plantillas:", plantillas.map((p) => p.nombre + "×" + p.usos).join(", ") || "—"); console.log("  sfx:", sfx.map((p) => p.nombre + "×" + p.usos).join(", ")); console.log("  música:", musica.map((p) => p.nombre).join(", ") || "—"); console.log("  overlays:", aOv.map((o) => o.nombre + (o.falta ? " (FALTA)" : "")).join(", ") || "—"); console.log("  faltan:", [...aSfx, ...aMus].filter((a) => a.falta).map((a) => a.nombre).join(", ") || "nada"); console.log("  sfx cada 10 s:", marca.ritmo.efectos_de_sonido_por_10s);
}
