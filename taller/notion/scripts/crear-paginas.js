// Crea un árbol de páginas en Notion (solo añade; no toca nada existente). Uso: node crear-paginas.js <spaceId> <arbol.js>
const { api, uid } = require("./api.js"); const crypto = require("crypto"), fs = require("fs");
const [space, fArbol] = process.argv.slice(2);
const now = Date.now(), u = () => crypto.randomUUID();
const op = (table, id, path, command, args) => ({ pointer: { table, id, spaceId: space }, path, command, args });
const meta = { created_time: now, last_edited_time: now, created_by_table: "notion_user", created_by_id: uid, last_edited_by_table: "notion_user", last_edited_by_id: uid, space_id: space, alive: true, version: 1 };
const rico = (s) => { const o = []; let i = 0; for (const m of s.matchAll(/\[\[([^|\]]+)\|([^\]]+)\]\]|\*\*([^*]+)\*\*/g)) { if (m.index > i) o.push([s.slice(i, m.index)]); if (m[1]) o.push([m[1], [["a", /^https?:/.test(m[2]) ? m[2] : "/" + m[2].replace(/-/g, "")]]]); else o.push([m[3], [["b"]]]); i = m.index + m[0].length; } if (i < s.length) o.push([s.slice(i)]); return o.length ? o : [[""]]; };
const TIPOS = [[/^# /, "header"], [/^## /, "sub_header"], [/^### /, "sub_sub_header"], [/^- /, "bulleted_list"], [/^\d+\. /, "numbered_list"], [/^\[\] /, "to_do"], [/^> /, "quote"], [/^!! /, "callout"]];
const ops = [], imgs = []; let n = 0;
const bloque = (item, padre, tabla) => {
  const id = u(); n++;
  if (item && item.img) { ops.push(op("block", id, [], "set", { id, type: "image", properties: {}, format: {}, parent_id: padre, parent_table: "block", ...meta })); imgs.push({ id, archivo: item.img, ancho: item.ancho || 720, pie: item.pie || "" }); }
  else if (typeof item === "string") {
    if (item === "---") ops.push(op("block", id, [], "set", { id, type: "divider", parent_id: padre, parent_table: "block", ...meta }));
    else { const t = TIPOS.find(([r]) => r.test(item)); const txt = t ? item.replace(t[0], "") : item; const b = { id, type: t ? t[1] : "text", properties: { title: rico(txt) }, parent_id: padre, parent_table: "block", ...meta }; if (b.type === "callout") b.format = { page_icon: "💡", block_color: "gray_background" }; ops.push(op("block", id, [], "set", b)); }
  } else {
    ops.push(op("block", id, [], "set", { id, type: "page", properties: { title: [[item.page]] }, format: { page_icon: item.icon || "📄" }, parent_id: padre, parent_table: tabla, ...(tabla === "space" ? { permissions: [{ type: "user_permission", role: "editor", user_id: uid }] } : {}), ...meta }));
    for (const h of item.children || []) bloque(h, id, "block");
    item.id = id;
  }
  ops.push(tabla === "space" ? op("space", padre, ["pages"], "listAfter", { id }) : op("block", padre, ["content"], "listAfter", { id }));
  return id;
};
(async () => {
  const arbol = require(require("path").resolve(fArbol));
  const raiz = process.argv[4] ? bloque(arbol, process.argv[4], "block") : bloque(arbol, space, "space");
  for (let i = 0; i < ops.length; i += 80) { await api("saveTransactionsFanout", { requestId: u(), transactions: [{ id: u(), spaceId: space, debug: { userAction: "claude-crear-paginas" }, operations: ops.slice(i, i + 80) }] }); await new Promise((r) => setTimeout(r, 900)); }
  // Imágenes: se sube cada archivo y se enlaza a su bloque
  for (const im of imgs) { const nombre = require("path").basename(im.archivo), datos = fs.readFileSync(im.archivo), tipo = /\.png$/i.test(nombre) ? "image/png" : "image/jpeg";
    const r = await api("getUploadFileUrl", { bucket: "secure", name: nombre, contentType: tipo, record: { table: "block", id: im.id, spaceId: space } });
    const put = await fetch(r.signedPutUrl, { method: "PUT", headers: { "content-type": tipo, ...(r.putHeaders ? Object.fromEntries(r.putHeaders.map((h) => [h.name, h.value])) : {}) }, body: datos });
    if (!put.ok) { console.error("no subió", nombre, put.status); continue; }
    const fid = (r.url.match(/[0-9a-f]{8}-[0-9a-f-]{27}/) || [])[0];
    await api("saveTransactionsFanout", { requestId: u(), transactions: [{ id: u(), spaceId: space, debug: { userAction: "claude-imagen" }, operations: [op("block", im.id, ["format"], "update", { display_source: r.url, block_width: im.ancho, block_page_width: true })] }] });
    console.log("imagen subida:", nombre); await new Promise((x) => setTimeout(x, 600)); }
  const ids = {}; const andar = (x) => { if (x && x.page) { ids[x.page] = x.id; (x.children || []).forEach(andar); } }; andar(arbol);
  fs.writeFileSync("paginas.json", JSON.stringify({ raiz, ids }, null, 1));
  console.log("bloques creados:", n, "\nenlace:", "https://app.notion.com/p/" + raiz.replace(/-/g, ""));
})().catch((e) => { console.error("ERROR", e.message.slice(0, 300)); process.exit(1); });
