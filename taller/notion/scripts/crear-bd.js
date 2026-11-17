// Crea una base de datos de Notion (página completa) dentro de una página y, opcionalmente, inserta filas.
// Uso: node crear-bd.js <idPaginaPadre> <spaceId> <esquema.json> [filas.json]
const { api, uid } = require("./api.js");
const fs = require("fs"), crypto = require("crypto");
const [padre, space, fEsq, fFilas] = process.argv.slice(2);
const esq = JSON.parse(fs.readFileSync(fEsq));
const now = Date.now();
const u = () => crypto.randomUUID();
const op = (table, id, path, command, args) => ({ pointer: { table, id, spaceId: space }, path, command, args });
const enviar = (operations) => api("saveTransactionsFanout", { requestId: u(), transactions: [{ id: u(), spaceId: space, debug: { userAction: "claude-crear-bd" }, operations }] });
const meta = { created_time: now, last_edited_time: now, created_by_table: "notion_user", created_by_id: uid, last_edited_by_table: "notion_user", last_edited_by_id: uid, space_id: space, alive: true, version: 1 };
const COLORES = ["blue", "green", "orange", "purple", "pink", "yellow", "red", "brown", "gray", "default"];
(async () => {
  const estado = fs.existsSync("bd.json") ? JSON.parse(fs.readFileSync("bd.json")) : null;
  let bloque, col, vista, schema, claves;
  if (estado) ({ bloque, col, vista, schema, claves } = estado);
  else {
    bloque = u(); col = u(); vista = u(); schema = { title: { name: esq.titulo, type: "title" } }; claves = { [esq.titulo]: "title" };
    for (const p of esq.props) {
      const k = crypto.randomBytes(2).toString("hex").replace(/[^a-z0-9]/g, "a").slice(0, 4) + String.fromCharCode(97 + Object.keys(schema).length);
      schema[k] = { name: p.nombre, type: p.tipo };
      if (p.tipo === "select" || p.tipo === "multi_select") schema[k].options = (p.opciones || []).map((o, i) => ({ id: u(), value: o, color: COLORES[i % COLORES.length] }));
      claves[p.nombre] = k;
    }
    await enviar([
      op("block", bloque, [], "set", { id: bloque, type: "collection_view_page", collection_id: col, view_ids: [vista], parent_id: padre, parent_table: "block", format: { collection_pointer: { id: col, table: "collection", spaceId: space }, page_icon: esq.icono || "🎬" }, ...meta }),
      op("collection_view", vista, [], "set", { id: vista, type: "table", name: "Todos", parent_id: bloque, parent_table: "block", alive: true, version: 1, space_id: space, format: { table_wrap: true, table_properties: [{ property: "title", visible: true, width: 260 }, ...esq.props.map((p) => ({ property: claves[p.nombre], visible: true, width: p.ancho || 200 }))] } }),
      op("collection", col, [], "set", { id: col, name: [[esq.nombre]], description: [[esq.descripcion || ""]], icon: esq.icono || "🎬", schema, parent_id: bloque, parent_table: "block", alive: true, version: 1, space_id: space, migrated: true }),
      op("block", padre, ["content"], "listAfter", { id: bloque }),
      op("block", padre, ["last_edited_time"], "set", now),
    ]);
    fs.writeFileSync("bd.json", JSON.stringify({ bloque, col, vista, schema, claves }));
    console.log("base de datos creada:", "https://app.notion.com/p/" + bloque.replace(/-/g, ""));
  }
  if (!fFilas) return;
  const filas = JSON.parse(fs.readFileSync(fFilas));
  const tipos = Object.fromEntries(esq.props.map((p) => [p.nombre, p.tipo]));
  let n = 0;
  for (let i = 0; i < filas.length; i += 20) {
    const ops = [];
    for (const f of filas.slice(i, i + 20)) {
      const id = u(); const properties = {};
      for (const [nombre, valor] of Object.entries(f)) {
        if (valor === null || valor === undefined || valor === "") continue;
        const k = claves[nombre]; if (!k) continue;
        const t = nombre === esq.titulo ? "title" : tipos[nombre];
        properties[k] = t === "url" ? [[String(valor), [["a", String(valor)]]]] : [[String(valor).replace(/,/g, t === "select" || t === "multi_select" ? " ·" : ",")]];
      }
      ops.push(op("block", id, [], "set", { id, type: "page", properties, parent_id: col, parent_table: "collection", ...meta }));
      n++;
    }
    await enviar(ops);
    await new Promise((r) => setTimeout(r, 700));
  }
  console.log("filas insertadas:", n);
})().catch((e) => { console.error("ERROR", e.message); process.exit(1); });
