// Recorta a la persona de un vídeo con IA local (Robust Video Matting) y la pone sobre un fondo nuevo.
// Uso: node recortar.js <video> <fondo.jpg|png> <salida-sin-extension> [--inicio 0] [--duracion 10] [--ancho 1080]
// Genera: <salida>-mate.mp4 (máscara), <salida>.mp4 (compuesto) y, con --alfa, <salida>-alfa.mov (ProRes 4444 para Premiere)
const { spawn, spawnSync } = require("child_process");
const path = require("path");
const os = require("os");
const ort = require("onnxruntime-node");

const FFMPEG = path.join(os.homedir(), ".local/bin/ffmpeg");
const FFPROBE = path.join(os.homedir(), ".local/bin/ffprobe");
const args = process.argv.slice(2);
const opt = (n, d) => (args.includes("--" + n) ? args[args.indexOf("--" + n) + 1] : d);
const [entrada, fondo, salida] = args;
if (!entrada || !fondo || !salida) {
  console.error("Uso: node recortar.js <video> <fondo> <salida> [--inicio s] [--duracion s] [--ancho px] [--alfa]");
  process.exit(1);
}
const inicio = opt("inicio", null);
const duracion = opt("duracion", null);
const ancho = +opt("ancho", 1080);
const conAlfa = args.includes("--alfa");

// Dimensiones ya rotadas (los vídeos de iPhone guardan la rotación como metadato)
const probe = JSON.parse(
  spawnSync(FFPROBE, ["-v", "error", "-select_streams", "v:0", "-show_streams", "-of", "json", entrada]).stdout.toString()
).streams[0];
const rot = Math.abs(+(probe.side_data_list?.[0]?.rotation ?? probe.tags?.rotate ?? 0));
const [w0, h0] = rot === 90 || rot === 270 ? [probe.height, probe.width] : [probe.width, probe.height];
const W = ancho - (ancho % 2);
const H = Math.round((W * h0) / w0 / 2) * 2;
const [fn, fd] = probe.r_frame_rate.split("/").map(Number);
const fps = Math.round((fn / fd) * 1000) / 1000;
const recorte = [...(inicio ? ["-ss", inicio] : []), ...(duracion ? ["-t", duracion] : [])];

async function mate() {
  const sesion = await ort.InferenceSession.create(path.join(__dirname, "rvm_mobilenetv3_fp32.onnx"));
  const dec = spawn(FFMPEG, ["-v", "error", ...recorte, "-i", entrada, "-vf", `scale=${W}:${H}`, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { stdio: ["ignore", "pipe", "inherit"] });
  const enc = spawn(FFMPEG, ["-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", `${W}x${H}`, "-r", String(fps), "-i", "-", "-c:v", "libx264", "-crf", "10", "-pix_fmt", "yuv420p", `${salida}-mate.mp4`], { stdio: ["pipe", "inherit", "inherit"] });

  const px = W * H;
  const tam = px * 3;
  const src = new Float32Array(tam);
  const cero = () => new ort.Tensor("float32", new Float32Array(1), [1, 1, 1, 1]);
  let rec = [cero(), cero(), cero(), cero()];
  // El modelo trabaja internamente a unos 512 px de lado mayor
  const ratio = new ort.Tensor("float32", new Float32Array([Math.min(1, 512 / Math.max(W, H))]), [1]);
  const gris = Buffer.alloc(px);
  let pendiente = Buffer.alloc(0);
  let n = 0;
  const t0 = Date.now();

  for await (const trozo of dec.stdout) {
    pendiente = pendiente.length ? Buffer.concat([pendiente, trozo]) : trozo;
    while (pendiente.length >= tam) {
      const f = pendiente.subarray(0, tam);
      for (let i = 0, j = 0; i < px; i++, j += 3) {
        src[i] = f[j] / 255;
        src[px + i] = f[j + 1] / 255;
        src[2 * px + i] = f[j + 2] / 255;
      }
      const r = await sesion.run({ src: new ort.Tensor("float32", src, [1, 3, H, W]), r1i: rec[0], r2i: rec[1], r3i: rec[2], r4i: rec[3], downsample_ratio: ratio });
      rec = [r.r1o, r.r2o, r.r3o, r.r4o];
      const pha = r.pha.data;
      for (let i = 0; i < px; i++) gris[i] = pha[i] * 255;
      if (!enc.stdin.write(Buffer.from(gris))) await new Promise((ok) => enc.stdin.once("drain", ok));
      pendiente = pendiente.subarray(tam);
      if (++n % 30 === 0) process.stderr.write(`\r${n} fotogramas, ${(n / ((Date.now() - t0) / 1000)).toFixed(1)} fps`);
    }
  }
  enc.stdin.end();
  await new Promise((ok) => enc.on("close", ok));
  process.stderr.write(`\nMáscara lista: ${n} fotogramas en ${((Date.now() - t0) / 1000).toFixed(0)} s\n`);
}

function ffmpeg(a) {
  const r = spawnSync(FFMPEG, ["-v", "error", "-y", ...a], { stdio: "inherit" });
  if (r.status !== 0) throw new Error("ffmpeg falló");
}

(async () => {
  await mate();
  const persona = `[0:v]scale=${W}:${H},format=rgba[p];[1:v]format=gray[m];[p][m]alphamerge[pa]`;
  ffmpeg([...recorte, "-i", entrada, "-i", `${salida}-mate.mp4`, "-loop", "1", "-i", fondo,
    "-filter_complex", `${persona};[2:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}[bg];[bg][pa]overlay=shortest=1,format=yuv420p[v]`,
    "-map", "[v]", "-map", "0:a?", "-c:v", "libx264", "-crf", "17", "-c:a", "aac", "-shortest", `${salida}.mp4`]);
  console.log("Compuesto:", `${salida}.mp4`);
  if (conAlfa) {
    ffmpeg([...recorte, "-i", entrada, "-i", `${salida}-mate.mp4`, "-filter_complex", `${persona}`, "-map", "[pa]", "-map", "0:a?",
      "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le", "-c:a", "pcm_s16le", `${salida}-alfa.mov`]);
    // Premiere 2026 ignora el alfa del ProRes del ffmpeg del sistema (comprobado 06-11 y otra vez 07-11 con este script:
    // el recorte tapaba lo de debajo con el fondo original). Se recodifica con el ffmpeg de Remotion, que Premiere sí lee.
    const RD = path.join(os.homedir(), "Videos-Remotion/motion/node_modules/@remotion/compositor-darwin-arm64");
    const r2 = require("child_process").spawnSync("./ffmpeg", ["-nostdin", "-v", "error", "-y", "-i", `${salida}-alfa.mov`, "-c:v", "prores_ks", "-profile:v", "4444",
      "-pix_fmt", "yuva444p10le", "-c:a", "pcm_s16le", `${salida}-alfa-premiere.mov`], { cwd: RD, stdio: "inherit" });
    if (r2.status === 0) { require("fs").renameSync(`${salida}-alfa-premiere.mov`, `${salida}-alfa.mov`); }
    else console.error("AVISO: no se pudo recodificar con el ffmpeg de Remotion; Premiere puede ignorar el alfa.");
    console.log("Con transparencia (lista para Premiere):", `${salida}-alfa.mov`);
  }
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
