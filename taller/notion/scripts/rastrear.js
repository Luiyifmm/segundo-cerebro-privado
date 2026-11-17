// Solo lectura: recorre todo el espacio de Notion y vuelca el texto de cada página.
const { api: api0 } = require("./api.js"); const api = async (a, b) => { await new Promise((r) => setTimeout(r, 900)); return api0(a, b); }; const fs = require("fs");
const txt = (t) => (t || []).map((x) => x[0]).join("");
const V = (x) => (x && x.value && x.value.value !== undefined && x.value.role === undefined && typeof x.value.value === "object" ? x.value.value : x && x.value && x.value.value && x.value.value.id ? x.value.value : x ? x.value : undefined);
const vistos = new Set(), out = [];
async function pagina(id, nivel, ruta) {
  if (vistos.has(id) || vistos.size > 600) return; vistos.add(id);
  let rec = {}, cursor = { stack: [] }, n = 0;
  do { const r = await api("loadPageChunk", { pageId: id, limit: 100, cursor, chunkNumber: n++, verticalColumns: false }); Object.assign(rec, r.recordMap.block || {}); rec.__col = { ...(rec.__col || {}), ...(r.recordMap.collection || {}) }; cursor = r.cursor; } while (cursor.stack.length && n < 30);
  const col = rec.__col; delete rec.__col;
  const b = V(rec[id]); if (!b || !b.alive) return;
  const titulo = b.type === "collection_view_page" || b.type === "collection_view" ? txt(V(Object.values(col)[0])?.name) : txt(b.properties?.title);
  const yo = ruta + " / " + (titulo || "(sin título)");
  const lineas = [], hijos = [];
  const andar = (bid, prof) => { const x = V(rec[bid]); if (!x || !x.alive) return;
    if (bid !== id) { if (x.type === "page" || x.type === "collection_view_page") { hijos.push(bid); lineas.push("  ".repeat(prof) + "→ [subpágina] " + txt(x.properties?.title)); return; }
      if (x.type === "collection_view") hijos.push("col:" + x.collection_id + ":" + (x.view_ids || [])[0]);
      const s = txt(x.properties?.title); if (s) lineas.push("  ".repeat(prof) + ({ header: "# ", sub_header: "## ", sub_sub_header: "### ", bulleted_list: "- ", numbered_list: "1. ", to_do: "[ ] ", quote: "> ", callout: "!! ", code: "```" }[x.type] || "") + s); }
    for (const h of x.content || []) andar(h, prof + (bid === id ? 0 : 1)); };
  andar(id, 0);
  out.push(`\n\n===== ${yo} =====\n` + lineas.join("\n"));
  if (b.type === "collection_view_page") hijos.push("col:" + b.collection_id + ":" + (b.view_ids || [])[0]);
  for (const h of hijos) { if (h.startsWith("col:")) { const [, cid, vid] = h.split(":"); try { const q = await api("queryCollection", { collection: { id: cid }, collectionView: { id: vid }, loader: { type: "reducer", reducers: { r: { type: "results", limit: 200 } }, searchQuery: "", userTimeZone: "America/Bogota" } }); const ids = q.result?.reducerResults?.r?.blockIds || []; const sch = V(Object.values(q.recordMap.collection || {})[0])?.schema || {};
        out.push(`\n-- base de datos en "${yo}": ${ids.length} filas; columnas: ${Object.values(sch).map((s) => s.name).join(", ")}`);
        if (ids.length <= 60) for (const r of ids) await pagina(r, nivel + 1, yo); else for (const r of ids.slice(0, 200)) { const v = V(q.recordMap.block[r]); if (v) out.push("   · " + txt(v.properties?.title)); } } catch (e) { out.push("  (colección no leída: " + e.message.slice(0, 80) + ")"); } }
    else await pagina(h, nivel + 1, yo); }
}
(async () => { for (const id of process.argv.slice(3)) await pagina(id, 0, "Notion"); fs.writeFileSync(process.argv[2], out.join("\n")); console.log("páginas:", vistos.size, "caracteres:", out.join("\n").length); })().catch((e) => { fs.writeFileSync(process.argv[2], out.join("\n")); console.error("ERROR", e.message.slice(0, 120), "páginas:", vistos.size); });
