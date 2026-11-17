// Sincroniza mis reels (sistema/reels.json) con la base del usuario "🎥 Pipeline de Producción de Video":
// una tarjeta por vídeo con cliente, estado, minutos de edición y qué mejoraría. Se puede relanzar: actualiza, no duplica.
// Añade dos columnas si faltan ("Minutos de edición", "Qué mejoraría"); no toca las demás ni las tarjetas que no son mías.
const { api, uid } = require("./api.js"); const fs = require("fs"), crypto = require("crypto"), os = require("os"), path = require("path");
const COL = "ca333f60-44df-4e44-b1cf-f9dd93e466ba", SPACE = "72c1a3f6-1a4c-8136-9913-00030eb75646", MAPA = path.join(__dirname, "..", "pipeline-filas.json");
const u = () => crypto.randomUUID(), now = Date.now();
const op = (table, id, p, command, args) => ({ pointer: { table, id, spaceId: SPACE }, path: p, command, args });
const enviar = (operations) => api("saveTransactionsFanout", { requestId: u(), transactions: [{ id: u(), spaceId: SPACE, debug: { userAction: "claude-pipeline" }, operations }] });
const ESTADO = { pendiente: "🔴 Raw", cortado: "✂️ Recortado", editando: "🎬 En edición", cambios: "🔁 Correcciones", entregado: "✅ Listo" };
const NOMBRE = { amin: "Amin", eric: "Eric", natalia: "Natalia" };
(async () => {
  const r = await api("syncRecordValues", { requests: [{ pointer: { table: "collection", id: COL }, version: -1 }] });
  const c = r.recordMap.collection[COL], col = c.value.value || c.value, schema = col.schema, clave = (n) => Object.keys(schema).find((k) => schema[k].name === n);
  // Notion rechaza por esta vía añadir columnas: si el usuario crea "Minutos de edición" (número) y "Qué mejoraría" (texto) se rellenan; si no, van en "Comentarios de revisión".
  // los valores de las listas se toman tal cual de la base (los emojis escritos a mano pueden no coincidir carácter a carácter)
  const opcion = (col2, palabra) => { const o = ((schema[clave(col2)] || {}).options || []).find((q) => q.value.toLowerCase().includes(palabra.toLowerCase())); return o ? o.value : null; };
  for (const [k, palabra] of [["pendiente", "Raw"], ["cortado", "Recortado"], ["editando", "En edición"], ["cambios", "Correcciones"], ["entregado", "Listo"]]) ESTADO[k] = opcion("Estado", palabra) || ESTADO[k];
  const LUIS = opcion("Asignado a", "Luis") || "Luis", NORMAL = opcion("Prioridad", "Normal") || "🙂 Normal";
  const K = { cliente: clave("Cliente / Proyecto"), estado: clave("Estado"), asignado: clave("Asignado a"), prioridad: clave("Prioridad"), min: clave("Minutos de edición"), mejora: clave("Qué mejoraría"), coment: clave("Comentarios de revisión") };
  const reels = JSON.parse(fs.readFileSync(path.join(os.homedir(), "Videos-Remotion/sistema/reels.json"))).reels, mapa = fs.existsSync(MAPA) ? JSON.parse(fs.readFileSync(MAPA)) : {};
  const meta = { created_time: now, last_edited_time: now, created_by_table: "notion_user", created_by_id: uid, last_edited_by_table: "notion_user", last_edited_by_id: uid, space_id: SPACE, alive: true, version: 1 };
  let creadas = 0, puestas = 0; const fallos = [];
  for (const x of reels) {
    if (/^IMG_6130$/.test(x.titulo) && x.id !== "AMIN_1010_01") continue;   // copias de trabajo del mismo bruto                                                   // copia de trabajo sin vídeo propio
    const min = Math.round((x.sesiones || []).reduce((s, q) => s + (new Date(q.fin || Date.now()) - new Date(q.ini)) / 60000, 0));
    const titulo = /^IMG_\d+$/.test(x.titulo) ? `${x.id} (${x.titulo})` : `${x.titulo} — ${x.id}`;
    const props = { title: [[titulo]], [K.cliente]: [[NOMBRE[x.cliente] || x.cliente]], [K.estado]: [[ESTADO[x.estado] || "🔴 Raw"]], [K.asignado]: [[LUIS]] };
    const notas = [];
    if (min > 0) { if (K.min) props[K.min] = [[String(min)]]; else notas.push("⏱ " + min + " min de edición"); }
    if ((x.mejoras || []).length) { if (K.mejora) props[K.mejora] = [[x.mejoras.join(" · ")]]; else notas.push("Mejoraría: " + x.mejoras.join(" · ")); }
    if ((x.cambios || []).length) notas.push("Cambios del cliente: " + x.cambios.join(" · "));
    if (notas.length) props[K.coment] = [[notas.join(" | ")]];
    if (mapa[x.id]) { try { // se leen las propiedades actuales y se mezclan: lo que el usuario haya escrito a mano en la tarjeta se conserva
        const cur = await api("syncRecordValues", { requests: [{ pointer: { table: "block", id: mapa[x.id] }, version: -1 }] }); const b = cur.recordMap.block[mapa[x.id]], v = b && (b.value.value || b.value);
        if (!v || v.alive === false) { fallos.push(x.id + " (tarjeta borrada en Notion: no la recreo)"); continue; }
        const mezcla = { ...(v.properties || {}), ...props }; if (v.properties && K.coment && v.properties[K.coment] && !props[K.coment]) mezcla[K.coment] = v.properties[K.coment];
        await enviar([op("block", mapa[x.id], [], "update", { properties: mezcla, last_edited_time: now })]); puestas++; } catch (e) { fallos.push(x.id + " (actualizar)"); } }
    else { const id = u(); props[K.prioridad] = [[NORMAL]]; try { await enviar([op("block", id, [], "set", { id, type: "page", properties: props, parent_id: COL, parent_table: "collection", ...meta })]); mapa[x.id] = id; creadas++; } catch (e) { fallos.push(x.id + " (crear)"); } }
    await new Promise((r2) => setTimeout(r2, 350));
  }
  fs.writeFileSync(MAPA, JSON.stringify(mapa, null, 1)); console.log(`tarjetas nuevas: ${creadas}, actualizadas: ${puestas}` + (fallos.length ? `, fallos: ${fallos.join(", ")}` : ""));
})().catch((e) => { console.error("ERROR", e.message.slice(0, 1500)); process.exit(1); });
