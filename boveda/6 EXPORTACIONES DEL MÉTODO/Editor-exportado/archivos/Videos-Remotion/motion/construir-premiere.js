// Exporta cada capa de las versiones como clip suelto y genera un XML (Final Cut 7) que Premiere importa con las 5 secuencias montadas.
// Uso: node construir-premiere.js <carpeta-de-salida>
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const datos = require("./src/alternativas.json");
// SOLO=6-10 limita las versiones; TITULO cambia el nombre de los XML y de la secuencia
if (process.env.SOLO) { const [d, h] = process.env.SOLO.split("-").map(Number); datos.versiones = datos.versiones.filter((v) => v.n >= d && v.n <= (h || d)); }
const TITULO = process.env.TITULO || "ClienteA - 5 alternativas";
const ENTRAN = new Set(["tarjeta", "mitad", "palabra", "mg", "mini", "espejo", "seguir", "mgPantalla"]);
const palabras = require("./src/palabras.json");

const salida = process.argv[2];
const medios = path.join(salida, "medios");
fs.mkdirSync(medios, { recursive: true });
const ESCALA = +(process.env.ESCALA || 1);
const ANCHO = 1080 * ESCALA, ALTO = 1920 * ESCALA;
const FPS = datos.fps;
const TOTAL = +(process.env.FRAMES || datos.frames);
const VOZ = process.env.VOZ || "voz.wav";
const VEL = +(process.env.VEL || 1);
const OPACAS = new Set(["habitacion", "baseSplit", "basePodcast", "fondoMarca", "fondoCrema", "video", "baseElegante"]);
const f = (s) => Math.min(TOTAL, Math.round(s * FPS));
const npx = path.join(process.env.HOME, ".local/node/bin/npx");

// 1. Empaquetar una vez y renderizar cada capa única
if (!fs.existsSync("build/index.html")) spawnSync(npx, ["remotion", "bundle", "src/index.ts"], { stdio: "inherit" });
const hechas = new Map();
for (const v of datos.versiones)
  for (const c of v.capas) {
    if (hechas.has(c.id)) continue;
    if (c.tipo === "archivo") {
      hechas.set(c.id, { archivo: c.archivo, frames: TOTAL, alfa: false });
      continue;
    }
    const opaca = OPACAS.has(c.tipo);
    const archivo = c.id + (opaca ? ".mp4" : ".mov");
    const destino = path.join(medios, archivo);
    const a = f(c.a), b = f(c.b) - 1;
    hechas.set(c.id, { archivo, frames: b - a + 1, alfa: !opaca });
    if (fs.existsSync(destino)) continue;
    const props = path.join(medios, ".props.json");
    fs.writeFileSync(props, JSON.stringify({ v: v.n, id: c.id }));
    const codec = opaca ? ["--codec", "h264", "--crf", "16"] : ["--codec", "prores", "--prores-profile", "4444", "--image-format", "png", "--pixel-format", "yuva444p10le"];
    const r = spawnSync(npx, ["remotion", "render", "build", "Capa", destino + ".tmp" + path.extname(archivo), `--props=${props}`, `--frames=${a}-${b}`, "--muted", "--log=error", `--scale=${ESCALA}`, ...codec], { stdio: "inherit" });
    if (r.status !== 0) { console.error("FALLO", c.id); process.exit(1); }
    fs.renameSync(destino + ".tmp" + path.extname(archivo), destino);
    console.log(`capa ${hechas.size} lista: ${archivo} (${b - a + 1} fotogramas)`);
  }
fs.rmSync(path.join(medios, ".props.json"), { force: true });

// 2. Subtítulos .srt editables
const tc = (s) => { const ms = Math.round(s * 1000); const p = (n, l = 2) => String(n).padStart(l, "0"); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };
const lineas = []; let cur = [];
for (const p of palabras) { const prev = cur[cur.length - 1]; if (prev && (cur.length >= 3 || p.a - prev.b > 0.3 || /[.,?]$/.test(prev.t))) { lineas.push(cur); cur = []; } cur.push(p); }
if (cur.length) lineas.push(cur);
fs.writeFileSync(path.join(salida, "subtitulos.srt"), lineas.map((l, i) => `${i + 1}\n${tc(l[0].a / VEL)} --> ${tc(l[l.length - 1].b / VEL)}\n${l.map((p) => p.t).join(" ").replace(/[.,]$/, "")}\n`).join("\n"));

// 3. XML de secuencias
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const url = (archivo) => "file://localhost" + encodeURI(path.join(medios, archivo));
const rate = `<rate><timebase>${FPS}</timebase><ntsc>FALSE</ntsc></rate>`;
const definidos = new Set();
let nClip = 0;
const fileXml = (archivo, frames, tipo) => {
  const id = "file-" + archivo.replace(/[^a-zA-Z0-9]/g, "_");
  if (definidos.has(id)) return `<file id="${id}"/>`;
  definidos.add(id);
  const media = tipo === "video"
    ? `<media><video><samplecharacteristics>${rate}<width>${ANCHO}</width><height>${ALTO}</height><anamorphic>FALSE</anamorphic><pixelaspectratio>square</pixelaspectratio><fielddominance>none</fielddominance></samplecharacteristics></video></media>`
    : `<media><audio><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics><channelcount>${tipo === "estereo" ? 2 : 1}</channelcount></audio></media>`;
  return `<file id="${id}"><name>${esc(archivo)}</name><pathurl>${url(archivo)}</pathurl>${rate}<duration>${frames}</duration>${media}</file>`;
};
const clipVideo = (nombre, archivo, frames, inicio, alfa) =>
  `<clipitem id="clip-${++nClip}"><name>${esc(nombre)}</name><enabled>TRUE</enabled><duration>${frames}</duration>${rate}<start>${inicio}</start><end>${inicio + frames}</end><in>0</in><out>${frames}</out>${alfa ? "<alphatype>straight</alphatype>" : "<alphatype>none</alphatype>"}${fileXml(archivo, frames, "video")}</clipitem>`;
const clipAudio = (nombre, archivo, frames, inicio, canal, tipo) =>
  `<clipitem id="clip-${++nClip}"${tipo === "estereo" ? ' premiereChannelType="stereo"' : ' premiereChannelType="mono"'}><name>${esc(nombre)}</name><enabled>TRUE</enabled><duration>${frames}</duration>${rate}<start>${inicio}</start><end>${inicio + frames}</end><in>0</in><out>${frames}</out>${fileXml(archivo, frames, tipo)}<sourcetrack><mediatype>audio</mediatype><trackindex>${canal}</trackindex></sourcetrack></clipitem>`;

const NOMBRE = { tarjeta: "Imagen", persona: "Persona recortada", subs: "Subtitulos animados", mesa: "Mesa (delante)", habitacion: "Fondo habitacion", baseSplit: "Base pantalla partida", basePodcast: "Base tarjeta podcast", mitad: "Media pantalla", mg: "Motion graphic", subsLimpios: "Subtitulos (clave en azul)", video: "Video original (espejo)", palabra: "Palabra gigante", fondoMarca: "Fondo azul de marca", fondoCrema: "Fondo crema", titular: "Titular superior", frase: "Frase", gancho: "Gancho superior", archivo: "Fondo", baseElegante: "Video con zooms y degradado", subsElegantes: "Subtitulos elegantes (clave en crema)", versus: "VS", espejo: "Grafico proyectas - atraes", seguir: "Boton seguir", mgPantalla: "Motion graphic pantalla completa" };
const secuencias = datos.versiones.map((v) => {
  definidos.clear();
  const pistas = [...new Set(v.capas.map((c) => c.pista))].sort((a, b) => a - b);
  const video = pistas.map((p) => {
    const clips = v.capas.filter((c) => c.pista === p).sort((a, b) => a.a - b.a).map((c) => {
      const h = hechas.get(c.id);
      const nombre = c.tipo === "tarjeta" || c.tipo === "mitad" || c.tipo === "mini" ? `Imagen ${c.src} (${c.lado})` : c.tipo === "palabra" ? "Palabra " + c.texto : c.tipo === "mg" ? "Motion graphic: " + c.que : c.tipo === "archivo" ? c.archivo : NOMBRE[c.tipo];
      return clipVideo(nombre, h.archivo, h.frames, f(c.a), h.alfa);
    });
    return `<track>${clips.join("")}<enabled>TRUE</enabled><locked>FALSE</locked></track>`;
  });
  const entradas = v.capas.filter((c) => ENTRAN.has(c.tipo)).map((c) => f(c.a)).sort((a, b) => a - b);
  const audio = [
    `<track>${clipAudio("Voz", VOZ, TOTAL, 0, 1, "mono")}<enabled>TRUE</enabled><locked>FALSE</locked><outputchannelindex>1</outputchannelindex></track>`,
    `<track>${clipAudio("Musica (baja)", "musica.wav", TOTAL, 0, 1, "estereo")}<enabled>TRUE</enabled><locked>FALSE</locked><outputchannelindex>1</outputchannelindex></track>`,
    `<track>${clipAudio("Musica (baja)", "musica.wav", TOTAL, 0, 2, "estereo")}<enabled>TRUE</enabled><locked>FALSE</locked><outputchannelindex>2</outputchannelindex></track>`,
    `<track>${entradas.filter((e, i) => i === 0 || e - entradas[i - 1] >= 24).map((e) => clipAudio("Whoosh", "whoosh.wav", 24, Math.max(0, e - 2), 1, "mono")).join("")}<enabled>TRUE</enabled><locked>FALSE</locked><outputchannelindex>1</outputchannelindex></track>`,
  ];
  return `<sequence id="seq-${v.n}"><name>${esc("ClienteA " + v.nombre)}</name><duration>${TOTAL}</duration>${rate}<timecode>${rate}<string>00:00:00:00</string><frame>0</frame><displayformat>NDF</displayformat></timecode>
<media><video><format><samplecharacteristics>${rate}<width>${ANCHO}</width><height>${ALTO}</height><anamorphic>FALSE</anamorphic><pixelaspectratio>square</pixelaspectratio><fielddominance>none</fielddominance><colordepth>24</colordepth></samplecharacteristics></format>
${video.join("\n")}
</video><audio><numOutputChannels>2</numOutputChannels><format><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics></format>
<outputs><group><index>1</index><numchannels>1</numchannels><downmix>0</downmix><channel><index>1</index></channel></group><group><index>2</index><numchannels>1</numchannels><downmix>0</downmix><channel><index>2</index></channel></group></outputs>
${audio.join("\n")}
</audio></media></sequence>`;
});

// Secuencia única: las versiones una detrás de otra, cada una empieza SEPARACION segundos después de la anterior
const SEP = Math.round(+(process.env.SEPARACION || 30) * FPS);
definidos.clear();
const maxPista = Math.max(...datos.versiones.flatMap((v) => v.capas.map((c) => c.pista)));
const pistasLinea = [];
for (let p = 1; p <= maxPista; p++) {
  const clips = datos.versiones.flatMap((v, i) => v.capas.filter((c) => c.pista === p).sort((a, b) => a.a - b.a).map((c) => {
    const h = hechas.get(c.id);
    const nombre = `V${v.n} · ` + (c.tipo === "tarjeta" || c.tipo === "mitad" || c.tipo === "mini" ? `Imagen ${c.src} (${c.lado})` : c.tipo === "palabra" ? "Palabra " + c.texto : c.tipo === "mg" ? "Motion graphic: " + c.que : c.tipo === "archivo" ? c.archivo : NOMBRE[c.tipo]);
    return clipVideo(nombre, h.archivo, h.frames, i * SEP + f(c.a), h.alfa);
  }));
  pistasLinea.push(`<track>${clips.join("")}<enabled>TRUE</enabled><locked>FALSE</locked></track>`);
}
const audioLinea = [
  `<track>${datos.versiones.map((v, i) => clipAudio(`V${v.n} · Voz`, VOZ, TOTAL, i * SEP, 1, "mono")).join("")}<enabled>TRUE</enabled><locked>FALSE</locked><outputchannelindex>1</outputchannelindex></track>`,
  `<track>${datos.versiones.map((v, i) => clipAudio(`V${v.n} · Musica`, "musica.wav", TOTAL, i * SEP, 1, "estereo")).join("")}<enabled>TRUE</enabled><locked>FALSE</locked><outputchannelindex>1</outputchannelindex></track>`,
  `<track>${datos.versiones.map((v, i) => clipAudio(`V${v.n} · Musica`, "musica.wav", TOTAL, i * SEP, 2, "estereo")).join("")}<enabled>TRUE</enabled><locked>FALSE</locked><outputchannelindex>2</outputchannelindex></track>`,
  `<track>${datos.versiones.flatMap((v, i) => { const e = v.capas.filter((c) => ENTRAN.has(c.tipo)).map((c) => f(c.a)).sort((a, b) => a - b); return e.filter((x, k) => k === 0 || x - e[k - 1] >= 24).map((x) => clipAudio("Whoosh", "whoosh.wav", 24, i * SEP + Math.max(0, x - 2), 1, "mono")); }).join("")}<enabled>TRUE</enabled><locked>FALSE</locked><outputchannelindex>1</outputchannelindex></track>`,
];
if (process.env.PISTA_VACIA) pistasLinea.push(`<track><enabled>TRUE</enabled><locked>FALSE</locked></track>`);
const durLinea = (datos.versiones.length - 1) * SEP + TOTAL;
const marcadores = datos.versiones.map((v, i) => `<marker><name>${esc(v.nombre)}</name><comment></comment><in>${i * SEP}</in><out>-1</out></marker>`).join("");
const linea = `<sequence id="seq-linea"><name>${esc(TITULO)} EN LINEA</name><duration>${durLinea}</duration>${rate}<timecode>${rate}<string>00:00:00:00</string><frame>0</frame><displayformat>NDF</displayformat></timecode>
<media><video><format><samplecharacteristics>${rate}<width>${ANCHO}</width><height>${ALTO}</height><anamorphic>FALSE</anamorphic><pixelaspectratio>square</pixelaspectratio><fielddominance>none</fielddominance><colordepth>24</colordepth></samplecharacteristics></format>
${pistasLinea.join("\n")}
</video><audio><numOutputChannels>2</numOutputChannels><format><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics></format>
<outputs><group><index>1</index><numchannels>1</numchannels><downmix>0</downmix><channel><index>1</index></channel></group><group><index>2</index><numchannels>1</numchannels><downmix>0</downmix><channel><index>2</index></channel></group></outputs>
${audioLinea.join("\n")}
</audio></media>${marcadores}</sequence>`;
fs.writeFileSync(path.join(salida, TITULO + " EN LINEA.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE xmeml>\n<xmeml version="4">\n${linea}\n</xmeml>\n`);
console.log("XML en línea listo");
definidos.clear();
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE xmeml>\n<xmeml version="4">\n<bin><name>${esc(TITULO)}</name><children>\n${secuencias.join("\n")}\n</children></bin>\n</xmeml>\n`;
fs.writeFileSync(path.join(salida, TITULO + ".xml"), xml);
console.log("XML listo:", path.join(salida, TITULO + ".xml"), `(${hechas.size} archivos de medios)`);
