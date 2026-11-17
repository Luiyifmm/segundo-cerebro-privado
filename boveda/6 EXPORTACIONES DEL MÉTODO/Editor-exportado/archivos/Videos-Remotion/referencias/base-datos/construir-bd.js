// Une las notas de análisis, los datos de Instagram, los ganchos transcritos y el audio en filas para Notion y un CSV.
const fs = require("fs"), path = require("path");
const L = path.join(process.env.HOME, "Videos-Remotion/referencias/lote");
const leer = (f, d) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f)) : d);
const idx = Object.fromEntries(leer(path.join(L, "indice.json"), []).map((r) => [r.id, r]));
const ganchos = leer(path.join(L, "ganchos.json"), {});
const audio = leer(path.join(L, "audio.json"), {});
const orden = Object.fromEntries(fs.readFileSync(path.join(L, "orden.tsv"), "utf8").trim().split("\n").map((l) => l.split("\t")).map(([n, id, c]) => [n, { id, c }]));
const notas = fs.readdirSync(__dirname).filter((f) => /^notas-\d+\.txt$/.test(f)).sort().flatMap((f) => fs.readFileSync(path.join(__dirname, f), "utf8").split("\n")).filter((l) => /^\d{3}\|/.test(l)).map((l) => l.split("|"));
const familia = (f) =>
  /Lista/.test(f) ? "Lista numerada" : /Comparativa|Clasificación|A vs B/.test(f) ? "Comparativa A vs B" : /Encuesta/.test(f) ? "Encuesta / votación" : /Collage/.test(f) ? "Collage de b-roll con persona recortada" :
  /Gancho fijo|título fijo|Título fijo/i.test(f) ? "Gancho fijo arriba" : /tarjeta|avatares/i.test(f) ? "Busto con tarjetas de apoyo" : /Podcast|entrevista|conferencia|Conversación|orador|llamada/i.test(f) ? "Podcast / entrevista / clip" :
  /Tutorial|Pantalla partida|Captura|pantalla|Demostración|Clase|capturas|gráfico/i.test(f) ? "Tutorial / pantalla / diagrama" : /Motion|Animación|Explicativo|Ilustración|Afirmaciones|ensayo|Documental/i.test(f) ? "Motion graphics / sin cara" :
  /Busto|Monólogo|palabra/i.test(f) ? "Busto simple" : "Montaje / lifestyle / meme";
const tipoGancho = (g) => !g ? "Sin voz al inicio" : /\?|¿/.test(g.slice(0, 140)) ? "Pregunta" : /^\W*(\d+|dos|tres|cuatro|cinco|seis|siete|diez|five|ten|four|three)\b/i.test(g) || /\b\d+\s+(reglas|hábitos|habitos|cosas|formas|temas|trucos|libros|hobbies|años|days|ways|things|people)/i.test(g.slice(0, 120)) ? "Número o lista" :
  /^\W*(si |if |cuando |when )/i.test(g) ? "Condicional (si tú…)" : /^\W*(no |nunca |deja |aprende |necesitas |act |stop |never |don't )/i.test(g) ? "Orden o prohibición" : /\b(yo |me |mi |i |my |tengo|hace \d)/i.test(g.slice(0, 60)) ? "Historia personal" : "Afirmación rotunda";
const primera = (g) => { const m = (g || "").trim().match(/^(.{20,170}?[.?!])(\s|$)/); return (m ? m[1] : (g || "").trim().slice(0, 170)).trim(); };
const musica = (id) => { const a = audio[id]; if (!a || !a.tipo) return "Sin dato"; if (a.cancion) return `Canción: ${a.cancion} — ${a.artista || "?"}`; return `Audio original${a.autorAudio ? " de @" + a.autorAudio : ""} (si hay música, va mezclada en la edición; no identificable)`; };
const filas = notas.map(([n, formato, edicion, fuentes, colores, broll, porque]) => {
  const o = orden[n]; const r = idx[o.id] || {}; const g = ganchos[n] || {}; const a = audio[o.id] || {};
  return { Reel: `@${o.c} · ${formato}`, Cuenta: "@" + o.c, Enlace: `https://www.instagram.com/reel/${o.id}/`, Formato: familia(formato), "Formato detallado": formato, "Gancho (primeras palabras)": primera(g.gancho), "Tipo de gancho": tipoGancho(g.gancho),
    "Estilo de edición": edicion, Fuentes: fuentes, Colores: colores, "B-roll": broll, "Música": musica(o.id), "Por qué funciona": porque, Likes: r.likes || null, Comentarios: r.com || null, Reproducciones: a.reproducciones || null, "Duración (s)": g.dur || null, "Texto de la publicación": (r.desc || "").slice(0, 120) };
});
fs.writeFileSync(path.join(__dirname, "filas.json"), JSON.stringify(filas, null, 1));
const cols = Object.keys(filas[0]);
fs.writeFileSync(path.join(__dirname, "reels-analisis.csv"), "﻿" + [cols, ...filas.map((f) => cols.map((c) => f[c] ?? ""))].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n"));
const cuenta = (k) => Object.entries(filas.reduce((m, f) => ((m[f[k]] = (m[f[k]] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]).map(([a, b]) => `${a}: ${b}`).join(" | ");
console.log("filas", filas.length, "\nFORMATOS →", cuenta("Formato"), "\nGANCHOS →", cuenta("Tipo de gancho"), "\nsin gancho transcrito:", filas.filter((f) => !f["Gancho (primeras palabras)"]).length, "| música con dato:", filas.filter((f) => f["Música"] !== "Sin dato").length);
