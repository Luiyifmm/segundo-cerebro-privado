const { api } = require("./api.js");
(async () => { const r = await api("syncRecordValues", { requests: [{ pointer: { table: "collection", id: "ca333f60-44df-4e44-b1cf-f9dd93e466ba" }, version: -1 }] });
  const c = r.recordMap.collection["ca333f60-44df-4e44-b1cf-f9dd93e466ba"]; const v = c.value.value || c.value;
  for (const [k, s] of Object.entries(v.schema)) console.log(k, "|", s.name, "|", s.type, "|", (s.options || []).map((o) => o.value + ":" + o.color).join(", "));
  console.log("space", v.space_id, "parent", v.parent_id);
  const q = await api("queryCollection", { collection: { id: v.id }, collectionView: { id: "3f3ddac3-e919-4c3e-8266-386af178a206" }, loader: { type: "reducer", reducers: { r: { type: "results", limit: 50 } }, searchQuery: "", userTimeZone: "America/Bogota" } });
  const ids = q.result.reducerResults.r.blockIds; for (const id of ids) { const b = q.recordMap.block[id]; const x = b.value.value || b.value; console.log("FILA", id, JSON.stringify(x.properties).slice(0, 400)); }
})().catch((e) => { console.error("ERROR", e.message.slice(0, 300)); process.exit(1); });
