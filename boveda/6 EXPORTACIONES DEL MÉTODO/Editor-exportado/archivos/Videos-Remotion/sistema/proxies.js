// OJO: los brutos llevan giro de -90 en metadatos; el proxy debe conservarlo (-noautorotate) o Premiere lo muestra tumbado.
// Genera proxies ligeros (H.264, 1/3 del tamaño, mismo ritmo de fotogramas y mismos canales de audio) de los brutos de uno o varios reels.
// Uso: node proxies.js <ID> [<ID>...]   → <carpeta del bruto>/Proxies/<nombre>_Proxy.mp4 y <reel>/<ID>.proxies.json (original → proxy)
const fs = require("fs"), path = require("path"), os = require("os"), { spawnSync } = require("child_process");
const BIN = path.join(os.homedir(), ".local/bin"), bd = JSON.parse(fs.readFileSync(path.join(__dirname, "reels.json"))).reels;
// --modo bandera (por defecto; iPhone IMG_*: mismo giro en metadatos) | erguido (píxeles ya girados, sin metadato: clips de cámara que Premiere SÍ gira)
// | tumbado (píxeles tal cual, sin metadato: clips que Premiere NO gira y llevan Rotación 90). --forzar rehace los que existan.
const ARG = process.argv.slice(2), MODO = ARG.includes("--modo") ? ARG[ARG.indexOf("--modo") + 1] : "bandera", FORZAR = ARG.includes("--forzar");
for (const id of ARG.filter((x, i) => !x.startsWith("--") && ARG[i - 1] !== "--modo")) { const r = bd.find((x) => x.id === id); if (!r) { console.log("no existe", id); continue; } const mapa = {};
  for (const f of r.fuentes) { const dir = path.join(path.dirname(f), "Proxies"), out = path.join(dir, path.parse(f).name + "_Proxy.mp4"); fs.mkdirSync(dir, { recursive: true });
    if (FORZAR || !fs.existsSync(out) || fs.statSync(out).size < 1e5) {
      const p = JSON.parse(spawnSync(path.join(BIN, "ffprobe"), ["-v", "error", "-show_streams", "-of", "json", f]).stdout.toString() || "{}"), v = (p.streams || []).find((s) => s.codec_type === "video"), au = (p.streams || []).filter((s) => s.codec_type === "audio" && s.codec_name && s.codec_name !== "none" && s.channels > 0);   // sin pistas de audio espacial que ffmpeg no decodifica
      const idxA = (p.streams || []).filter((s) => s.codec_type === "audio").map((s, i) => [s, i]).filter(([s]) => au.includes(s)).map(([, i]) => i);
      if (!v) { console.log("sin vídeo:", f); continue; }
      // El proxy conserva el mismo giro en metadatos que el original (cámara A001 e iPhone): así Premiere lo muestra igual que el bruto.
      const pre = MODO === "erguido" ? [] : MODO === "tumbado" ? ["-noautorotate", "-display_rotation", "0"] : ["-noautorotate"];
      const args = ["-nostdin", "-v", "error", "-y", ...pre, "-i", f, "-map", "0:v:0", ...idxA.flatMap((i) => ["-map", `0:a:${i}`]), "-vf", "scale=trunc(iw/6)*2:trunc(ih/6)*2:flags=bilinear,format=yuv420p", "-c:v", "h264_videotoolbox", "-b:v", "6M", "-g", "15", "-fps_mode", "passthrough", ...au.flatMap((s, i) => [`-c:a:${i}`, "aac", `-ac:a:${i}`, String(s.channels), `-b:a:${i}`, "160k"]), "-map_metadata", "0", "-movflags", "+faststart", out];
      const t0 = Date.now(), x = spawnSync(path.join(BIN, "ffmpeg"), args); if (x.status !== 0) { console.log("FALLO", path.basename(f), x.stderr.toString().slice(-200)); continue; }
      console.log(`proxy ${path.basename(out)}  ${(fs.statSync(out).size / 1e6).toFixed(0)} MB  ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
    mapa[f] = out; }
  fs.writeFileSync(path.join(r.dir, id + ".proxies.json"), JSON.stringify(mapa, null, 1)); }
console.log("FIN PROXIES");
