// Crea la base "Tiempos de edición" en el hub con columna total por fórmula. Uso: node crear.js
const { api, uid } = require("../scripts/api.js"), fs = require("fs"), crypto = require("crypto");
const SPACE = "72c1a3f6-1a4c-8136-9913-00030eb75646", PADRE = "8bdb898b-7076-440e-b9c3-dcd4245729d6", u = () => crypto.randomUUID(), now = Date.now();
const op = (table, id, path, command, args) => ({ pointer: { table, id, spaceId: SPACE }, path, command, args });
const enviar = (operations) => api("saveTransactionsFanout", { requestId: u(), transactions: [{ id: u(), spaceId: SPACE, debug: { userAction: "claude-tiempos" }, operations }] });
const meta = { created_time: now, last_edited_time: now, created_by_table: "notion_user", created_by_id: uid, last_edited_by_table: "notion_user", last_edited_by_id: uid, space_id: SPACE, alive: true, version: 1 };
const N = [["recA", "Recorte (min)"], ["subA", "Subtítulos (min)"], ["colA", "Color (min)"], ["vfxA", "VFX (min)"], ["matA", "Buscando material (min)"], ["sfxA", "SFX (min)"]];
const prop = ([id, name]) => ({ type: "property", id, name, result_type: "number" });
let f = prop(N[0]); for (const n of N.slice(1)) f = { type: "operator", operator: "+", name: "add", result_type: "number", args: [f, prop(n)] };
const schema = { title: { name: "Vídeo", type: "title" }, cliA: { name: "Cliente", type: "select", options: [["Amin", "blue"], ["Eric", "orange"], ["Natalia", "red"]].map(([value, color]) => ({ id: u(), value, color })) }, fecA: { name: "Fecha", type: "date" } };
for (const [k, n] of N) schema[k] = { name: n, type: "number", number_format: "number" };
schema.totA = { name: "Tiempo total (min)", type: "formula", formula: f };
const bloque = u(), col = u(), vista = u();
const filas = [["ERIC_1017_01 · Mejores desayunos p1", "Eric"], ["ERIC_1017_02", "Eric"], ["ERIC_1017_03", "Eric"], ["ERIC_1017_04", "Eric"], ["ERIC_1017_05", "Eric"], ["NATALIA_1017_01", "Natalia"], ["NATALIA_1017_02 · Este error no te deja adelgazar", "Natalia"], ["NATALIA_1017_03", "Natalia"], ["AMIN_1018_01 · La mujer del niñato vs la del hombre", "Amin"], ["AMIN_1018_02 · Pobre vs rico: esto y esto", "Amin"], ["AMIN_1018_03 · La vulgaridad vs la elegancia", "Amin"]];
(async () => {
  await enviar([
    op("block", bloque, [], "set", { id: bloque, type: "collection_view_page", collection_id: col, view_ids: [vista], parent_id: PADRE, parent_table: "block", format: { collection_pointer: { id: col, table: "collection", spaceId: SPACE }, page_icon: "⏱️" }, ...meta }),
    op("collection_view", vista, [], "set", { id: vista, type: "table", name: "Todos", parent_id: bloque, parent_table: "block", alive: true, version: 1, space_id: SPACE, format: { table_wrap: true, table_properties: [{ property: "title", visible: true, width: 300 }, { property: "cliA", visible: true, width: 110 }, { property: "fecA", visible: true, width: 130 }, ...N.map(([k]) => ({ property: k, visible: true, width: 140 })), { property: "totA", visible: true, width: 160 }] } }),
    op("collection", col, [], "set", { id: col, name: [["Tiempos de edición"]], description: [["Minutos por fase en cada vídeo. El total se suma solo."]], icon: "⏱️", schema, parent_id: bloque, parent_table: "block", alive: true, version: 1, space_id: SPACE, migrated: true }),
    op("block", PADRE, ["content"], "listAfter", { id: bloque }),
    ...filas.map(([t, c]) => { const id = u(); return op("block", id, [], "set", { id, type: "page", properties: { title: [[t]], cliA: [[c]] }, parent_id: col, parent_table: "collection", ...meta }); }),
  ]);
  fs.writeFileSync("bd.json", JSON.stringify({ bloque, col, vista }));
  console.log("https://app.notion.com/p/" + bloque.replace(/-/g, ""));
})().catch((e) => { console.error("ERROR", e.message.slice(0, 300)); process.exit(1); });
