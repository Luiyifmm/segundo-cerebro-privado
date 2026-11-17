const { api } = require("./api.js"); const B = require("../tiempos/bd.json");
(async () => {
  const r = await api("syncRecordValues", { requests: [{ pointer: { table: "collection", id: B.col }, version: -1 }, { pointer: { table: "block", id: B.bloque }, version: -1 }] });
  const c = r.recordMap.collection[B.col]; const v = c.value.value || c.value;
  const blk = r.recordMap.block[B.bloque]; const bv = blk.value.value || blk.value;
  console.log("vistas:", JSON.stringify(bv.view_ids));
  for (const [k, s] of Object.entries(v.schema)) console.log("COL", k, "|", s.name, "|", s.type, s.formula ? "(fórmula)" : "", (s.options || []).map((o) => o.value).join(","));
  const vista = bv.view_ids[0];
  const q = await api("queryCollection", { collection: { id: B.col, spaceId: v.space_id }, collectionView: { id: vista, spaceId: v.space_id }, loader: { type: "reducer", reducers: { r: { type: "results", limit: 100 } }, searchQuery: "", userTimeZone: "America/Bogota" } });
  for (const id of q.result.reducerResults.r.blockIds) { const b = q.recordMap.block[id]; const x = b.value.value || b.value; const p = {}; for (const [k, val] of Object.entries(x.properties || {})) p[(v.schema[k] || {}).name || k] = val.map((a) => a[0]).join(""); console.log("FILA", id, JSON.stringify(p)); }
})().catch((e) => { console.error("ERROR", e.message.slice(0, 300)); process.exit(1); });
