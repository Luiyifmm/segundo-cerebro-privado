// Cronómetro de fases de edición → base "⏱️ Tiempos de edición" de Notion.
// Uso: node reloj.js empezar <fase> "<vídeo>" <Cliente> | node reloj.js terminar | node reloj.js estado
// Fases: recorte, subtitulos, color, vfx, material, sfx. La sesión de Notion se exporta de Brave al escribir y se borra después.
const fs = require("fs"), path = require("path"), cp = require("child_process"), crypto = require("crypto");
const EST = path.join(__dirname, "reloj-estado.json"), REG = path.join(__dirname, "reloj-registro.json");
const COL = { recorte: ["recA", "Recorte"], subtitulos: ["subA", "Subtítulos"], "subtítulos": ["subA", "Subtítulos"], color: ["colA", "Color"], vfx: ["vfxA", "VFX"], material: ["matA", "Buscando material"], sfx: ["sfxA", "SFX"] };
const leer = (f, d) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { return d; } };
const mmss = (ms) => { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`; };
const [cmd, a1, a2, a3] = process.argv.slice(2);
(async () => {
  const est = leer(EST, {});
  if (cmd === "empezar") {
    const fase = (a1 || "").toLowerCase(); if (!COL[fase]) throw new Error("fase desconocida: " + a1);
    if (est.inicio) throw new Error(`ya está corriendo ${est.fase} de ${est.video}`);
    const video = a2 || est.video, cliente = a3 || est.cliente; if (!video) throw new Error("falta el vídeo");
    fs.writeFileSync(EST, JSON.stringify({ video, cliente, fase, inicio: Date.now() }));
    console.log(`▶ ${COL[fase][1]} · ${video} · empezó ${new Date().toLocaleTimeString("es-ES")}`); return;
  }
  if (cmd === "estado") { console.log(est.inicio ? `⏱ ${COL[est.fase][1]} · ${est.video} · lleva ${mmss(Date.now() - est.inicio)}` : `parado · último vídeo: ${est.video || "-"}`); return; }
  if (cmd !== "terminar") throw new Error("orden: empezar | terminar | estado");
  if (!est.inicio) throw new Error("no hay ninguna fase corriendo");
  const ms = Date.now() - est.inicio, min = Math.round(ms / 600) / 100, [key, nom] = COL[est.fase];
  // sesión temporal de Notion (yt-dlp sale con error porque la página no es un vídeo, pero exporta la sesión)
  const nt = path.join(__dirname, "../scripts/nt.txt");
  let total = 0, valor = min;
  try {
    try { cp.execFileSync(process.env.HOME + "/.local/bin/yt-dlp", ["--cookies-from-browser", "brave", "--cookies", nt, "--skip-download", "--no-warnings", "-q", "https://www.notion.so/login"], { stdio: "ignore" }); } catch (e) {}
    if (!fs.existsSync(nt)) throw new Error("no pude leer la sesión de Notion en Brave");
    const { api, uid } = require("../scripts/api.js"); const B = require("./bd.json"), SPACE = "72c1a3f6-1a4c-8136-9913-00030eb75646";
    const r = await api("syncRecordValues", { requests: [{ pointer: { table: "block", id: B.bloque }, version: -1 }] }); const bv = r.recordMap.block[B.bloque].value; const vista = (bv.value || bv).view_ids[0];
    const q = await api("queryCollection", { collection: { id: B.col, spaceId: SPACE }, collectionView: { id: vista, spaceId: SPACE }, loader: { type: "reducer", reducers: { r: { type: "results", limit: 200 } }, searchQuery: "", userTimeZone: "America/Bogota" } });
    let fila = null, props = {};
    for (const id of q.result.reducerResults.r.blockIds) { const x = q.recordMap.block[id].value; const v = x.value || x; const t = ((v.properties || {}).title || []).map((a) => a[0]).join(""); if (t.trim() === est.video.trim()) { fila = id; props = v.properties || {}; } }
    const u = () => crypto.randomUUID(), now = Date.now(), ops = [], op = (id, p, command, args) => ops.push({ pointer: { table: "block", id, spaceId: SPACE }, path: p, command, args });
    const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
    if (!fila) { fila = u(); op(fila, [], "set", { id: fila, type: "page", properties: { title: [[est.video]], cliA: [[est.cliente || ""]] }, parent_id: B.col, parent_table: "collection", created_time: now, last_edited_time: now, created_by_table: "notion_user", created_by_id: uid, last_edited_by_table: "notion_user", last_edited_by_id: uid, space_id: SPACE, alive: true, version: 1 }); }
    const prev = parseFloat(((props[key] || [[""]])[0] || [""])[0]) || 0; valor = Math.round((prev + min) * 100) / 100;
    op(fila, ["properties", key], "set", [[String(valor)]]);
    if (!props.fecA) op(fila, ["properties", "fecA"], "set", [["‣", [["d", { type: "date", start_date: hoy }]]]]);
    op(fila, ["last_edited_time"], "set", now);
    await api("saveTransactionsFanout", { requestId: u(), transactions: [{ id: u(), spaceId: SPACE, debug: { userAction: "claude-reloj" }, operations: ops }] });
    for (const k of ["recA", "subA", "colA", "vfxA", "matA", "sfxA"]) total += k === key ? valor : parseFloat(((props[k] || [[""]])[0] || [""])[0]) || 0;
  } finally { try { fs.unlinkSync(nt); } catch (e) {} }
  const reg = leer(REG, []); reg.push({ video: est.video, fase: est.fase, inicio: est.inicio, fin: Date.now(), min }); fs.writeFileSync(REG, JSON.stringify(reg, null, 1));
  fs.writeFileSync(EST, JSON.stringify({ video: est.video, cliente: est.cliente }));
  console.log(`■ ${nom} · ${est.video}: ${mmss(ms)} (${min} min)${valor !== min ? ` → acumulado ${valor} min` : ""} | total del vídeo: ${Math.round(total * 100) / 100} min | guardado en Notion`);
})().catch((e) => { console.error("ERROR", e.message.slice(0, 300)); process.exit(1); });
