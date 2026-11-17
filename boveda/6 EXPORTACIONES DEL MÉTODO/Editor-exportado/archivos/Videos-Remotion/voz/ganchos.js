// Transcribe los primeros segundos de cada reel del lote (el gancho hablado) y guarda duración.
const { spawnSync } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");
const FF = path.join(os.homedir(), ".local/bin/ffmpeg"), FP = path.join(os.homedir(), ".local/bin/ffprobe");
const dir = path.join(os.homedir(), "Videos-Remotion/referencias/lote");
const orden = fs.readFileSync(path.join(dir, "orden.tsv"), "utf8").trim().split("\n").map((l) => l.split("\t"));
const salida = path.join(dir, "ganchos.json");
const idx = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(dir, "indice.json"))).map((r) => [r.id, r]));
const ingles = (d) => ((d || "").toLowerCase().match(/\b(the|you|your|and|with|this|that|for|how|will)\b/g) || []).length >= 3;
const hechos = fs.existsSync(salida) ? JSON.parse(fs.readFileSync(salida)) : {};
(async () => {
  const { pipeline } = await import("@huggingface/transformers");
  const asr = await pipeline("automatic-speech-recognition", "onnx-community/whisper-small_timestamped", { dtype: { encoder_model: "fp32", decoder_model_merged: "q4" } });
  for (const [n, id] of orden) {
    if (hechos[n]) continue;
    const f = path.join(dir, id + ".mp4");
    const dur = +spawnSync(FP, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).stdout.toString();
    const pcm = spawnSync(FF, ["-v", "error", "-nostdin", "-t", "9", "-i", f, "-vn", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], { maxBuffer: 1e9 }).stdout;
    let texto = "";
    if (pcm.length > 16000) {
      try { texto = (await asr(new Float32Array(pcm.buffer, pcm.byteOffset, pcm.length / 4), { task: "transcribe", language: ingles((idx[id] || {}).desc) ? "english" : "spanish" })).text.trim(); } catch (e) { texto = ""; }
    }
    hechos[n] = { id, dur: Math.round(dur), gancho: texto };
    fs.writeFileSync(salida, JSON.stringify(hechos, null, 1));
  }
  console.log("ganchos:", Object.keys(hechos).length);
  process.exit(0);
})();
