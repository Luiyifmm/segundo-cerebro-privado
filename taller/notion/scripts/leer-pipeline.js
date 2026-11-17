// Solo lectura: busca la base "Pipeline de Producción de Video" y vuelca su esquema, vistas y filas.
const { api, uid } = require("./api.js"); const fs = require("fs");
const txt = (t) => (t || []).map((x) => x[0]).join("");
(async () => {
  const sp = await api("getSpaces", {}); const u = Object.values(sp)[0]; const spaceId = Object.keys(u.space)[0];
  const s = await api("search", { type: "BlocksInSpace", query: "Pipeline de Producción de Video", spaceId, limit: 10, filters: { isDeletedOnly: false, excludeTemplates: false, navigableBlockContentOnly: false, requireEditPermissions: false, ancestors: [], createdBy: [], editedBy: [], lastEditedTime: {}, createdTime: {} }, sort: { field: "relevance" }, source: "quick_find" });
  const out = { spaceId, resultados: [] };
  for (const r of s.results || []) { const b = s.recordMap.block[r.id]; const v = b && (b.value.value || b.value); if (!v) continue; out.resultados.push({ id: r.id, type: v.type, titulo: txt(v.properties && v.properties.title), parent: v.parent_id, collection_id: v.collection_id, view_ids: v.view_ids, content: (v.content || []).length }); }
  fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1)); console.log(JSON.stringify(out.resultados.slice(0, 8), null, 1));
})().catch((e) => { console.error("ERROR", e.message.slice(0, 300)); process.exit(1); });
