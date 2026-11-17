// Primer corte automático de un reel hablado (uno o varios clips en bruto): corta por pausas, transcribe, descarta tomas repetidas
// (se queda con la última) y deja una secuencia para Premiere que apunta a los originales (sin recodificar), con subtítulos .srt sincronizados.
// Cada frase lleva un número fijo en el guion: con --quitar y --recuperar se rehace el corte en segundos (la transcripción queda guardada).
// Uso: node primer-corte.js --salida <carpeta> --nombre <id> [--cliente x] <video...> [--quitar 3,7,9-12] [--recuperar 4] [--minimo 0.45] [--aire 0.08] [--idioma spanish]
const { spawnSync } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");
const FF = path.join(os.homedir(), ".local/bin/ffmpeg"), FP = path.join(os.homedir(), ".local/bin/ffprobe");
const args = process.argv.slice(2);
const CON_VALOR = ["salida", "nombre", "cliente", "quitar", "recuperar", "minimo", "aire", "idioma", "pausa"];
const opt = (n, d) => (args.includes("--" + n) ? args[args.indexOf("--" + n) + 1] : d);
const videos = args.filter((x, i) => !x.startsWith("--") && !(i > 0 && CON_VALOR.includes(args[i - 1].slice(2)))).map((v) => path.resolve(v));
const dir = opt("salida"), nombre = opt("nombre"), cliente = opt("cliente", "");
if (!dir || !nombre || !videos.length) { console.error("Uso: node primer-corte.js --salida <carpeta> --nombre <id> <video...>"); process.exit(1); }
const minimo = +opt("minimo", 0.45), aire = +opt("aire", 0.08), idioma = opt("idioma", "spanish");
const lista = (s) => (s || "").split(",").flatMap((x) => { const [a, b] = x.split("-").map(Number); return a ? Array.from({ length: (b || a) - a + 1 }, (_, i) => a + i) : []; });
fs.mkdirSync(path.join(dir, ".cache"), { recursive: true });
const t0 = Date.now();

// Decisiones manuales (se acumulan entre ejecuciones)
const fDec = path.join(dir, "decisiones.json");
const dec = fs.existsSync(fDec) ? JSON.parse(fs.readFileSync(fDec)) : { quitar: [], recuperar: [] };
for (const n of lista(opt("quitar"))) { dec.quitar = [...new Set([...dec.quitar, n])]; dec.recuperar = dec.recuperar.filter((x) => x !== n); }
for (const n of lista(opt("recuperar"))) { dec.recuperar = [...new Set([...dec.recuperar, n])]; dec.quitar = dec.quitar.filter((x) => x !== n); }

const datos = (video) => {
  const st = JSON.parse(spawnSync(FP, ["-v", "error", "-show_streams", "-show_format", "-of", "json", video]).stdout.toString());
  const v = st.streams.find((s) => s.codec_type === "video"), a = st.streams.find((s) => s.codec_type === "audio");
  const rot = Math.abs(+(v.side_data_list?.[0]?.rotation ?? v.tags?.rotate ?? 0));
  const [W, H] = rot === 90 || rot === 270 ? [v.height, v.width] : [v.width, v.height];
  const [fn, fd] = v.r_frame_rate.split("/").map(Number);
  const fps = fn / fd, base = Math.round(fps);
  // Clips de cámara (A001_*): hay que declararlos con su tamaño REAL (apaisado, 3840x2160). Así Premiere aplica él mismo el giro de los metadatos
  // (Rotación 0 en Movimiento) y el proxy encaja. Si se declaran ya girados (2160x3840) salen tumbados y el proxy se deforma. Comprobado el 11-10-2026.
  const camara = /^A001_/i.test(path.basename(video)), [FW, FH] = camara ? [v.width, v.height] : [W, H];
  return { video, W, H, FW, FH, fps, base, ntsc: Math.abs(fps - base) > 0.005, dur: +st.format.duration, canales: a ? a.channels : 0 };
};

(async () => {
  // 1. Transcripción con tiempo por palabra (guardada por archivo: los recortes posteriores no vuelven a transcribir)
  let asr = null;
  const fuentes = [];
  for (const video of videos) {
    const m = datos(video), s = fs.statSync(video);
    const cache = path.join(dir, ".cache", path.basename(video) + ".json"), firma = s.size + "-" + Math.round(s.mtimeMs) + "-" + idioma;
    let palabras = fs.existsSync(cache) && JSON.parse(fs.readFileSync(cache)).firma === firma ? JSON.parse(fs.readFileSync(cache)).palabras : null;
    if (!palabras) {
      if (!asr) { const { pipeline } = await import("@huggingface/transformers"); asr = await pipeline("automatic-speech-recognition", "onnx-community/whisper-small_timestamped", { dtype: { encoder_model: "fp32", decoder_model_merged: "q4" } }); }
      const pcm = spawnSync(FF, ["-v", "error", "-nostdin", "-i", video, "-vn", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], { maxBuffer: 4e9 }).stdout;
      const r = await asr(new Float32Array(pcm.buffer, pcm.byteOffset, pcm.length / 4), { language: idioma, task: "transcribe", return_timestamps: "word", chunk_length_s: 30, stride_length_s: 5 });
      palabras = r.chunks.map((c) => ({ t: c.text.trim(), a: c.timestamp[0], b: c.timestamp[1] ?? c.timestamp[0] + 0.3 })).filter((p) => p.t);
      fs.writeFileSync(cache, JSON.stringify({ firma, palabras }));
    }
    // Tramos con voz real: los tiempos del transcriptor se desvían hasta medio segundo; el volumen da el corte exacto
    const vol = spawnSync(FF, ["-hide_banner", "-nostdin", "-i", video, "-vn", "-af", "ebur128", "-f", "null", "-"], { maxBuffer: 1e9 }).stderr.toString();
    const I = +((vol.slice(vol.lastIndexOf("Summary:")).match(/I:\s+(-?[\d.]+) LUFS/) || [])[1] ?? -30);
    const sil = spawnSync(FF, ["-hide_banner", "-nostdin", "-i", video, "-vn", "-af", `highpass=f=100,silencedetect=noise=${(I - 10).toFixed(1)}dB:d=0.25`, "-f", "null", "-"], { maxBuffer: 1e9 }).stderr.toString();
    const si = [...sil.matchAll(/silence_start: ([\d.]+)/g)].map((x) => +x[1]), sf = [...sil.matchAll(/silence_end: ([\d.]+)/g)].map((x) => +x[1]);
    const habla = []; let cur0 = 0;
    si.forEach((x, i) => { if (x - cur0 > 0.08) habla.push([cur0, x]); cur0 = sf[i] ?? m.dur; });
    if (m.dur - cur0 > 0.08) habla.push([cur0, m.dur]);
    fuentes.push({ ...m, palabras, habla });
  }

  // 2. Frases: cada frase (punto, interrogación o pausa mayor que "minimo") es una unidad numerada que se puede quitar o recuperar
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9ñ ]/g, "").split(/\s+/).filter(Boolean);
  const clips = [];
  fuentes.forEach((f, k) => {
    let g = [];
    const cerrar = () => { if (g.length) clips.push({ k, palabras: g, ini: g[0].a, ult: g[g.length - 1].a, fin: g[g.length - 1].b, texto: g.map((p) => p.t).join(" ") }); g = []; };
    for (const p of f.palabras) { const prev = g[g.length - 1]; if (prev && (p.a - prev.b > minimo || /[.?!…]$/.test(prev.t))) cerrar(); g.push(p); }
    cerrar();
  });
  clips.forEach((c, i) => {
    c.n = i + 1;
    const prev = clips[i - 1]?.k === c.k ? clips[i - 1] : null, sig = clips[i + 1]?.k === c.k ? clips[i + 1] : null, f = fuentes[c.k];
    // Trozos con voz de esta frase; si comparte trozo con la frase vecina, el límite lo pone el transcriptor
    let ps = f.habla.filter(([s, e]) => e > c.ini - 0.15 && s < c.ult + 0.15).map(([s, e]) => [prev && prev.ult > s - 0.05 ? Math.max(s, c.ini - 0.05) : Math.max(s, c.ini - 0.6), sig && sig.ini < e - 0.05 ? Math.min(e, sig.ini - 0.02) : Math.min(e, c.ult + 1.2)]).filter(([s, e]) => e - s > 0.05);
    if (!ps.length) ps = [[Math.max(0, c.ini - aire), Math.min(f.dur, c.ult + 0.5)]];
    c.piezas = ps.map(([s, e]) => ({ k: c.k, n: c.n, a: Math.max(0, s - aire), b: Math.min(f.dur, e + 0.15), previo: e <= c.ini + 0.1 }));
    if (c.piezas.some((p) => !p.previo)) c.previos = c.piezas.filter((p) => p.previo), (c.piezas = c.piezas.filter((p) => !p.previo));
  });

  // Arranques en falso que el transcriptor no escribe: si una frase dura mucho más de lo que su texto pide, sobran sus primeros trozos
  const sueltos = clips.flatMap((c) => (c.previos || []).map((p) => ({ ...p, n2: c.n, suelto: true })));
  fuentes.forEach((f, k) => {
    const rs = clips.filter((c) => c.k === k && c.piezas.length === 1 && c.texto.length > 15).map((c) => c.texto.length / (c.piezas[0].b - c.piezas[0].a)).sort((a, b) => a - b);
    const ritmo = rs.length ? rs[Math.floor(rs.length / 2)] : 15;
    for (const c of clips.filter((c) => c.k === k && c.piezas.length > 1)) {
      const esperado = c.texto.length / ritmo, dur = (ps) => ps.reduce((x, p) => x + p.b - p.a, 0);
      // un trozo que contiene palabras transcritas de la frase no es un arranque en falso
      const conTexto = (pz) => c.palabras.some((w) => (w.a + w.b) / 2 > pz.a && (w.a + w.b) / 2 < pz.b);
      while (c.piezas.length > 1 && !conTexto(c.piezas[0]) && dur(c.piezas) > esperado * 1.3 && dur(c.piezas.slice(1)) >= esperado * 0.8) sueltos.push({ ...c.piezas.shift(), n2: c.n, suelto: true });
    }
  });

  // 3. Descartes automáticos: palabras inventadas por el transcriptor en silencios y tomas repetidas (queda la última)
  for (const c of clips) {
    const w = norm(c.texto);
    if (w.length >= 2 && new Set(w).size === 1) c.fuera = "ruido (palabra repetida)";
    else if (w.length === 1 && c.fin - c.ini > 2.5) c.fuera = "ruido";
    else if (/subtitulos (realizados|por la comunidad)|gracias por ver/.test(w.join(" "))) c.fuera = "ruido";
    else if (/(\.\.\.|…)\W*$/.test(c.texto.trim())) c.fuera = "frase sin terminar";
  }
  const veces = {};
  for (const c of clips) { const t = c.k + norm(c.texto).join(" "); veces[t] = (veces[t] || 0) + 1; }
  for (const c of clips) { const w = norm(c.texto); if (w.length <= 2 && veces[c.k + w.join(" ")] >= 3) c.fuera = "ruido (palabra repetida)"; }
  const vivos = clips.filter((c) => !c.fuera);
  vivos.forEach((c, i) => {
    const w1 = norm(c.texto); if (w1.length < 3) return;
    for (const d of vivos.slice(i + 1, i + 5)) {
      const w2 = norm(d.texto); const comun = w1.filter((w) => w2.includes(w)).length;
      const prefijo = w1.length >= 2 && w1.join(" ") === w2.slice(0, w1.length).join(" ");
      if ((comun / w1.length >= 0.85 && w2.length >= w1.length * 0.8) || prefijo) { c.fuera = "toma repetida"; break; }
    }
  });
  for (const c of clips) { if (dec.quitar.includes(c.n)) c.fuera = "quitada a mano"; if (dec.recuperar.includes(c.n)) delete c.fuera; }

  // 4. Línea de tiempo: trozos con voz de las frases que se conservan; las pausas menores que "pausa" no se cortan
  const S = fuentes[0], pausa = +opt("pausa", 0.4);
  const unir = (ps) => { const o = []; for (const p of ps) { const u = o[o.length - 1]; if (u && u.k === p.k && p.n - u.n2 <= 1 && p.a + aire - (u.b - 0.15) < pausa && p.a >= u.a) { u.b = Math.max(u.b, p.b); u.n2 = p.n; } else o.push({ ...p, n2: p.n }); } return o; };
  const buenos = unir(clips.filter((c) => !c.fuera).flatMap((c) => c.piezas));
  const descartes = [...clips.filter((c) => c.fuera).map((c) => ({ k: c.k, n: c.n, n2: c.n, a: c.piezas[0].a, b: c.piezas[c.piezas.length - 1].b })), ...sueltos].sort((x, y) => x.k - y.k || x.a - y.a);
  const textoDe = (t) => clips.filter((c) => c.n >= t.n && c.n <= t.n2).map((c) => c.texto).join(" ");
  const largo = (c) => Math.max(1, Math.round((c.b - c.a) * S.fps));
  let pos = 0;
  for (const c of buenos) { c.start = pos; c.len = largo(c); c.texto = textoDe(c); pos += c.len; }
  const total = pos;
  if (descartes.length) pos += S.base * 5;
  for (const c of descartes) { c.start = pos; c.len = largo(c); c.texto = c.suelto ? "(arranque en falso antes de la frase)" : textoDe(c); pos += c.len; }
  const enPista = [...buenos, ...descartes];

  // 5. Subtítulos re-sincronizados con el corte y guion numerado
  const tc = (s) => { const ms = Math.round(s * 1000); const p = (n, l = 2) => String(n).padStart(l, "0"); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };
  const enLinea = (c, t) => { const ts = buenos.filter((x) => x.k === c.k && c.n >= x.n && c.n <= x.n2); if (!ts.length) return 0; const x = ts.reduce((m, y) => (Math.abs(Math.min(Math.max(t, y.a), y.b) - t) < Math.abs(Math.min(Math.max(t, m.a), m.b) - t) ? y : m)); return x.start / S.fps + Math.min(Math.max(t - x.a, 0), x.len / S.fps); };
  const nuevas = clips.filter((c) => !c.fuera).flatMap((c) => c.palabras.map((p) => { const a = enLinea(c, p.a); return { t: p.t, a, b: Math.max(a + 0.05, enLinea(c, Math.min(p.b, p.a + 0.6))) }; }));
  const lineas = []; let cur = [];
  for (const p of nuevas) { const prev = cur[cur.length - 1]; if (prev && (cur.length >= 3 || p.a - prev.b > 0.3 || /[.,?!]$/.test(prev.t))) { lineas.push(cur); cur = []; } cur.push(p); }
  if (cur.length) lineas.push(cur);
  fs.writeFileSync(path.join(dir, `${nombre}.srt`), lineas.map((l, i) => `${i + 1}\n${tc(l[0].a)} --> ${tc(Math.max(l[l.length - 1].b, l[0].a + 0.2))}\n${l.map((p) => p.t).join(" ").replace(/[.,]$/, "")}\n`).join("\n"));
  const guion = clips.map((c) => ({ n: c.n, dentro: !c.fuera, motivo: c.fuera || null, seg: +c.piezas.reduce((x, p) => x + p.b - p.a, 0).toFixed(1), clip: path.basename(fuentes[c.k].video), texto: c.texto }));
  fs.writeFileSync(path.join(dir, `${nombre}.guion.txt`), "Guion numerado. [x] = fuera del corte. Para cambiarlo: \"quita 3, 7\" o \"recupera 4\".\n\n" + guion.map((g) => `${String(g.n).padStart(2, "0")} ${g.dentro ? "   " : "[x]"} ${g.texto}${g.motivo ? "   ← " + g.motivo : ""}`).join("\n") + "\n");
  fs.writeFileSync(path.join(dir, `${nombre}.palabras.json`), JSON.stringify(nuevas.map((p) => ({ t: p.t, a: +p.a.toFixed(2), b: +p.b.toFixed(2) }))));

  // 6. Secuencia para Premiere (XML de Final Cut 7) apuntando a los originales
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const rateDe = (f) => `<rate><timebase>${f.base}</timebase><ntsc>${f.ntsc ? "TRUE" : "FALSE"}</ntsc></rate>`;
  const rate = rateDe(S), canales = Math.min(2, Math.max(...fuentes.map((f) => f.canales)));
  const definidos = new Set();
  const file = (k) => { const f = fuentes[k]; if (definidos.has(k)) return `<file id="bruto${k}"/>`; definidos.add(k);
    return `<file id="bruto${k}"><name>${esc(path.basename(f.video))}</name><pathurl>file://localhost${encodeURI(f.video)}</pathurl>${rateDe(f)}<duration>${Math.round(f.dur * f.fps)}</duration><media><video><samplecharacteristics>${rateDe(f)}<width>${f.FW}</width><height>${f.FH}</height><anamorphic>FALSE</anamorphic><pixelaspectratio>square</pixelaspectratio><fielddominance>none</fielddominance></samplecharacteristics></video>${f.canales ? `<audio><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics><channelcount>${f.canales}</channelcount></audio>` : ""}</media></file>`; };
  const enlaces = (i) => `<link><linkclipref>v${i}</linkclipref><mediatype>video</mediatype><trackindex>1</trackindex><clipindex>${i + 1}</clipindex></link>` + Array.from({ length: canales }, (_, k) => `<link><linkclipref>a${k + 1}_${i}</linkclipref><mediatype>audio</mediatype><trackindex>${k + 1}</trackindex><clipindex>${i + 1}</clipindex></link>`).join("");
  const clip = (id, c, extra) => { const f = fuentes[c.k], ent = Math.round(c.a * f.fps); return `<clipitem id="${id}"><name>${esc(String(c.n).padStart(2, "0") + " " + c.texto.slice(0, 40))}</name><enabled>TRUE</enabled><duration>${Math.round(f.dur * f.fps)}</duration>${rateDe(f)}<start>${c.start}</start><end>${c.start + c.len}</end><in>${ent}</in><out>${ent + c.len}</out>${file(c.k)}${extra}</clipitem>`; };
  const vTrack = enPista.map((c, i) => clip(`v${i}`, c, enlaces(i))).join("");
  const aTracks = Array.from({ length: canales }, (_, k) => `<track>${enPista.map((c, i) => clip(`a${k + 1}_${i}`, c, `<sourcetrack><mediatype>audio</mediatype><trackindex>${k + 1}</trackindex></sourcetrack>${enlaces(i)}`)).join("")}<enabled>TRUE</enabled><locked>FALSE</locked><outputchannelindex>${k + 1}</outputchannelindex></track>`).join("\n");
  dec.v = (dec.v || 0) + 1;
  fs.writeFileSync(fDec, JSON.stringify(dec));
  const secuencia = `${nombre} - corte ${dec.v}`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE xmeml>\n<xmeml version="4">\n<sequence id="corte"><name>${esc(secuencia)}</name><duration>${pos}</duration>${rate}<timecode>${rate}<string>00:00:00:00</string><frame>0</frame><displayformat>NDF</displayformat></timecode>
<media><video><format><samplecharacteristics>${rate}<width>${S.W}</width><height>${S.H}</height><anamorphic>FALSE</anamorphic><pixelaspectratio>square</pixelaspectratio><fielddominance>none</fielddominance></samplecharacteristics></format><track>${vTrack}<enabled>TRUE</enabled><locked>FALSE</locked></track></video>
<audio><numOutputChannels>2</numOutputChannels><format><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics></format>
${aTracks}
</audio></media>${descartes.length ? `<marker><name>DESCARTES</name><comment>Tomas fuera del corte: arrastra de vuelta la que prefieras</comment><in>${total + S.base * 5}</in><out>-1</out></marker>` : ""}</sequence>\n</xmeml>\n`;
  const fXml = path.join(dir, `${nombre} - primer corte.xml`);
  fs.writeFileSync(fXml, xml);
  const resumen = { cliente, nombre, secuencia, xml: fXml, clipsBrutos: videos.length, formato: `${S.W}x${S.H} a ${S.fps.toFixed(2)} fps`, duracionBruto: +fuentes.reduce((s, f) => s + f.dur, 0).toFixed(1), duracionCorte: +(total / S.fps).toFixed(1), frases: clips.length, dentro: clips.filter((c) => !c.fuera).length, fuera: descartes.length, cortes: buenos.length, segundosDeProceso: Math.round((Date.now() - t0) / 1000), guion };
  fs.writeFileSync(path.join(dir, `${nombre}.informe.json`), JSON.stringify(resumen, null, 1));
  console.log(JSON.stringify({ ...resumen, guion: undefined }, null, 1));
  console.log(fs.readFileSync(path.join(dir, `${nombre}.guion.txt`), "utf8"));
  process.exit(0);
})().catch((e) => { console.error(e.stack || e.message); process.exit(1); });
