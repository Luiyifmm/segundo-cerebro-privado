// Detecta los silencios de un vídeo y genera una versión sin ellos.
// Uso: node cortar-silencios.js <video> [--umbral -35] [--minimo 0.45] [--aire 0.08] [--solo-lista] [--alto 1920]
// Genera en ./salida/: <nombre>.tramos.json (tramos que se conservan) y <nombre>-cortado.mp4
const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const FFMPEG = path.join(os.homedir(), ".local/bin/ffmpeg");
const args = process.argv.slice(2);
const opt = (n, d) => (args.includes("--" + n) ? args[args.indexOf("--" + n) + 1] : d);
const entrada = args[0];
if (!entrada) {
  console.error("Uso: node cortar-silencios.js <video> [--umbral dB] [--minimo s] [--aire s] [--solo-lista]");
  process.exit(1);
}
const umbral = +opt("umbral", -35);
const minimo = +opt("minimo", 0.45);
const aire = +opt("aire", 0.08);

const log = spawnSync(FFMPEG, ["-hide_banner", "-i", entrada, "-vn", "-af", `silencedetect=noise=${umbral}dB:d=${minimo}`, "-f", "null", "-"], { maxBuffer: 1e9 }).stderr.toString();
const dur = (() => {
  const m = log.match(/Duration: (\d+):(\d+):([\d.]+)/);
  return +m[1] * 3600 + +m[2] * 60 + +m[3];
})();
const inicios = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
const finales = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);

// Tramos con voz = huecos entre silencios, con un poco de aire a cada lado
const tramos = [];
let cursor = 0;
inicios.forEach((ini, i) => {
  if (ini - cursor > 0.15) tramos.push([Math.max(0, cursor - aire), Math.min(dur, ini + aire)]);
  cursor = finales[i] ?? dur;
});
if (dur - cursor > 0.15) tramos.push([Math.max(0, cursor - aire), dur]);

const util = tramos.reduce((s, [a, b]) => s + (b - a), 0);
const dir = path.join(__dirname, "salida");
fs.mkdirSync(dir, { recursive: true });
const base = path.join(dir, path.basename(entrada).replace(/\.[^.]+$/, ""));
fs.writeFileSync(`${base}.tramos.json`, JSON.stringify({ duracion: dur, umbral, minimo, aire, tramos: tramos.map(([a, b]) => [+a.toFixed(3), +b.toFixed(3)]) }, null, 1));
console.log(`${tramos.length} tramos con voz. ${dur.toFixed(1)} s → ${util.toFixed(1)} s (se quitan ${(dur - util).toFixed(1)} s)`);

if (!args.includes("--solo-lista")) {
  const expr = tramos.map(([a, b]) => `between(t,${a.toFixed(3)},${b.toFixed(3)})`).join("+");
  const alto = opt("alto", null);
  const escala = alto ? `,scale=-2:${alto}` : "";
  const r = spawnSync(FFMPEG, ["-v", "error", "-y", "-i", entrada,
    "-vf", `select='${expr}',setpts=N/FRAME_RATE/TB${escala}`, "-af", `aselect='${expr}',asetpts=N/SR/TB`,
    "-c:v", "libx264", "-crf", "17", "-preset", "fast", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k", `${base}-cortado.mp4`], { stdio: "inherit" });
  if (r.status !== 0) process.exit(1);
  console.log(`Vídeo cortado: ${base}-cortado.mp4`);
}
