// Convierte subtítulos .vtt automáticos de YouTube en texto plano con una marca de tiempo por minuto
const fs = require("fs");
const [, , input, output] = process.argv;
const lines = fs.readFileSync(input, "utf8").split("\n");
let out = [], last = "", minute = -1, t = 0;
for (const raw of lines) {
  const m = raw.match(/^(\d+):(\d+):(\d+)\.\d+ -->/);
  if (m) { t = +m[1] * 60 + +m[2]; continue; }
  const line = raw.replace(/<[^>]+>/g, "").trim();
  if (!line || line === last || /^(WEBVTT|Kind:|Language:)/.test(line)) continue;
  if (t !== minute) { minute = t; out.push(`\n[min ${t}]`); }
  out.push(line); last = line;
}
fs.writeFileSync(output, out.join(" ").replace(/ \n/g, "\n"));
