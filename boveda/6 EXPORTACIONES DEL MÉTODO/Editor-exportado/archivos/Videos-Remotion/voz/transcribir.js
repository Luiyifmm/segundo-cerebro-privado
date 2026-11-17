// Transcribe un vídeo o audio en local (Whisper) con tiempos por palabra.
// Uso: node transcribir.js <video> [--idioma spanish] [--modelo onnx-community/whisper-small_timestamped] [--inicio s] [--duracion s]
// Genera junto al script, en ./salida/: <nombre>.palabras.json, <nombre>.srt (1 a 3 palabras por línea) y <nombre>.txt
const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const FFMPEG = path.join(os.homedir(), ".local/bin/ffmpeg");
const args = process.argv.slice(2);
const opt = (n, d) => (args.includes("--" + n) ? args[args.indexOf("--" + n) + 1] : d);
const entrada = args[0];
if (!entrada) {
  console.error("Uso: node transcribir.js <video> [--idioma spanish] [--modelo id] [--inicio s] [--duracion s]");
  process.exit(1);
}
const idioma = opt("idioma", "spanish");
const modelo = opt("modelo", "onnx-community/whisper-small_timestamped");
const maxPalabras = +opt("palabras", 3);
const recorte = [...(opt("inicio") ? ["-ss", opt("inicio")] : []), ...(opt("duracion") ? ["-t", opt("duracion")] : [])];

const tc = (s) => {
  const ms = Math.round(s * 1000);
  const p = (n, l = 2) => String(n).padStart(l, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

(async () => {
  const { pipeline } = await import("@huggingface/transformers");
  const pcm = spawnSync(FFMPEG, ["-v", "error", ...recorte, "-i", entrada, "-vn", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], { maxBuffer: 4e9 }).stdout;
  const audio = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.length / 4);
  console.error(`Audio: ${(audio.length / 16000).toFixed(1)} s. Cargando ${modelo}…`);

  const t0 = Date.now();
  const asr = await pipeline("automatic-speech-recognition", modelo, { dtype: { encoder_model: "fp32", decoder_model_merged: "q4" } });
  const r = await asr(audio, { language: idioma, task: "transcribe", return_timestamps: "word", chunk_length_s: 30, stride_length_s: 5 });
  console.error(`Transcrito en ${((Date.now() - t0) / 1000).toFixed(0)} s`);

  const palabras = r.chunks
    .map((c) => ({ texto: c.text.trim(), inicio: c.timestamp[0], fin: c.timestamp[1] ?? c.timestamp[0] + 0.3 }))
    .filter((p) => p.texto);

  // Agrupa en líneas cortas; corta también en pausas y signos de puntuación
  const lineas = [];
  let actual = [];
  for (const p of palabras) {
    const previa = actual[actual.length - 1];
    if (previa && (actual.length >= maxPalabras || p.inicio - previa.fin > 0.35 || /[.,;:?!]$/.test(previa.texto))) {
      lineas.push(actual);
      actual = [];
    }
    actual.push(p);
  }
  if (actual.length) lineas.push(actual);

  const dir = path.join(__dirname, "salida");
  fs.mkdirSync(dir, { recursive: true });
  const base = path.join(dir, path.basename(entrada).replace(/\.[^.]+$/, ""));
  fs.writeFileSync(`${base}.palabras.json`, JSON.stringify(palabras, null, 1));
  fs.writeFileSync(`${base}.txt`, r.text.trim() + "\n");
  fs.writeFileSync(
    `${base}.srt`,
    lineas.map((l, i) => `${i + 1}\n${tc(l[0].inicio)} --> ${tc(l[l.length - 1].fin)}\n${l.map((p) => p.texto).join(" ").replace(/[.,]$/, "")}\n`).join("\n")
  );
  console.log(`${palabras.length} palabras, ${lineas.length} líneas → ${base}.srt`);
  process.exit(0);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
