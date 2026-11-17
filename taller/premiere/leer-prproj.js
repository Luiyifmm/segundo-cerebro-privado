// Lee un .prproj descomprimido y lista los clips de vídeo de cada pista con sus tiempos.
const fs = require("fs");
const xml = fs.readFileSync(process.argv[2], "utf8");
const T = 254016000000;
const objs = new Map();
for (const m of xml.matchAll(/^\t<(\w+) Object(?:ID|UID)="([^"]+)"[^>]*>[\s\S]*?^\t<\/\1>/gm)) objs.set(m[2], { tipo: m[1], x: m[0] });
const tag = (x, t) => (x.match(new RegExp(`<${t}>([^<]*)</${t}>`)) || [])[1];
const ref = (x, t) => (x.match(new RegExp(`<${t} ObjectU?Ref="([^"]+)"`)) || [])[1];
const pistas = [];
for (const [uid, o] of objs) {
  if (o.tipo !== "VideoClipTrack" && o.tipo !== "AudioClipTrack") continue;
  const items = [...o.x.matchAll(/<TrackItem Index="\d+" ObjectRef="(\d+)"/g)].map((m) => objs.get(m[1])).filter(Boolean);
  const clips = items.map((it) => {
    const sub = objs.get(ref(it.x, "SubClip"));
    const clip = sub && objs.get(ref(sub.x, "Clip"));
    return {
      nombre: sub ? tag(sub.x, "Name") : "?",
      inicio: +(+tag(it.x, "Start") / T || 0).toFixed(3),
      fin: +(+tag(it.x, "End") / T).toFixed(3),
      entrada: clip ? +((+tag(clip.x, "InPoint") || 0) / T).toFixed(3) : null,
      salida: clip ? +((+tag(clip.x, "OutPoint") || 0) / T).toFixed(3) : null,
    };
  }).sort((a, b) => a.inicio - b.inicio);
  if (clips.length) pistas.push({ uid, tipo: o.tipo, clips });
}
// Agrupa las pistas por secuencia
const secuencias = [];
for (const [uid, o] of objs) {
  if (o.tipo !== "Sequence") continue;
  const nombre = tag(o.x, "Name");
  const grupos = [...o.x.matchAll(/<Second ObjectRef="(\d+)"/g)].map((m) => objs.get(m[1])).filter(Boolean);
  const uids = grupos.flatMap((g) => [...g.x.matchAll(/<Track Index="\d+" ObjectURef="([^"]+)"/g)].map((m) => m[1]));
  secuencias.push({ nombre, pistas: uids.map((u) => pistas.find((p) => p.uid === u)).filter(Boolean) });
}
fs.writeFileSync(process.argv[3], JSON.stringify(secuencias, null, 1));
for (const s of secuencias) {
  console.log(`\n### ${s.nombre}`);
  s.pistas.forEach((p, i) => console.log(`  ${p.tipo === "VideoClipTrack" ? "V" : "A"}${i}: ${p.clips.length} clips, ${p.clips[0].inicio}–${p.clips[p.clips.length - 1].fin}s  [${[...new Set(p.clips.map((c) => c.nombre))].slice(0, 6).join(" | ")}]`));
}
