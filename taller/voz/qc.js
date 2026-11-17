// Control de calidad técnico de un vídeo final. Devuelve APROBADO, REVISAR o BLOQUEADO con la evidencia.
// Uso: node qc.js <video> [--ancho 1080] [--alto 1920] [--min 15] [--max 90]
const { spawnSync } = require("child_process");
const os = require("os");
const path = require("path");
const FF = path.join(os.homedir(), ".local/bin/ffmpeg"), FP = path.join(os.homedir(), ".local/bin/ffprobe");
const args = process.argv.slice(2);
const opt = (n, d) => (args.includes("--" + n) ? +args[args.indexOf("--" + n) + 1] : d);
const video = args[0];
if (!video) { console.error("Uso: node qc.js <video>"); process.exit(1); }
const info = JSON.parse(spawnSync(FP, ["-v", "error", "-show_streams", "-show_format", "-of", "json", video]).stdout.toString());
const v = info.streams.find((s) => s.codec_type === "video"), a = info.streams.find((s) => s.codec_type === "audio");
const dur = +info.format.duration;
const log = spawnSync(FF, ["-hide_banner", "-nostdin", "-i", video, "-vf", "blackdetect=d=0.2:pix_th=0.05,freezedetect=n=0.003:d=2", "-af", "silencedetect=noise=-40dB:d=1.2,ebur128=peak=true", "-f", "null", "-"], { maxBuffer: 1e9 }).stderr.toString();
const negros = [...log.matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)].map((m) => [+m[1], +m[2]]);
const congelados = [...log.matchAll(/freeze_start: ([\d.]+)/g)].map((m) => +m[1]);
const silencios = [...log.matchAll(/silence_end: ([\d.]+) \| silence_duration: ([\d.]+)/g)].map((m) => [+(m[1] - m[2]).toFixed(2), +(+m[2]).toFixed(2)]);
const resumen = log.slice(log.lastIndexOf("Summary:"));
const lufs = +((resumen.match(/I:\s+(-?[\d.]+) LUFS/) || [])[1] ?? NaN);
const pico = +((resumen.match(/Peak:\s+(-?[\d.]+) dBFS/) || [])[1] ?? NaN);
const fallos = [], avisos = [];
const W = opt("ancho", 1080), H = opt("alto", 1920);
if (!v) fallos.push("sin pista de vídeo");
else if (v.width / v.height !== W / H && Math.abs(v.width / v.height - W / H) > 0.01) fallos.push(`formato ${v.width}x${v.height}, se esperaba proporción ${W}:${H}`);
if (!a) fallos.push("sin audio");
if (dur < opt("min", 15) || dur > opt("max", 90)) avisos.push(`duración ${dur.toFixed(1)} s fuera de ${opt("min", 15)}–${opt("max", 90)} s`);
if (negros.length) avisos.push(`fotogramas negros en ${negros.map((n) => n[0].toFixed(1) + "s").join(", ")}`);
if (congelados.length) avisos.push(`imagen congelada desde ${congelados.map((c) => c.toFixed(1) + "s").join(", ")}`);
if (silencios.length) avisos.push(`silencios largos: ${silencios.map((s) => `${s[0]}s (${s[1]}s)`).join(", ")}`);
if (!isNaN(lufs) && (lufs < -18 || lufs > -11)) avisos.push(`volumen ${lufs} LUFS (recomendado para Reels: cerca de -14)`);
if (!isNaN(pico) && pico > -0.5) avisos.push(`pico de audio ${pico} dBFS: riesgo de saturación`);
const veredicto = fallos.length ? "BLOQUEADO" : avisos.length ? "REVISAR" : "APROBADO";
console.log(JSON.stringify({ veredicto, video: path.basename(video), formato: v ? `${v.width}x${v.height}` : null, fps: v ? v.r_frame_rate : null, duracion: +dur.toFixed(2), volumenLUFS: lufs, picoDBFS: pico, fallos, avisos }, null, 1));
