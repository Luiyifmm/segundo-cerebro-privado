// Prepara el comando para el puente de Premiere: guardia de proyecto/secuencia + errores con número de línea.
// Uso (lo llama pr.sh): node envoltura.js <id> <salida.json.part> <script.jsx> <segundos>
// Variables: PR_PROYECTO, PR_SECUENCIA (guardia), PR_SIN_ENVOLTURA=1 (mandar el script tal cual).
// Sin eval (el panel lo rechaza): el guardia va primero y el script original dentro de un try;
// el resultado es el valor de su última expresión, igual que sin envoltura.
const fs = require("fs");
const [id, out, src, secs] = process.argv.slice(2);
let s = fs.readFileSync(src, "utf8");
if (!process.env.PR_SIN_ENVOLTURA) {
  const g = { proyecto: process.env.PR_PROYECTO || "", secuencia: process.env.PR_SECUENCIA || "" };
  const pre = [
    "var __l0=(function(){try{throw new Error('x');}catch(e){return e.line;}})();",
    "var __gerr=(function(){var __g=" + JSON.stringify(g) + ";",
    "if(__g.proyecto){var __p=app.project;if(!__p)return 'ERROR GUARDIA: no hay proyecto activo. No se ejecutó nada.';",
    "var __n=String(__p.name),__r=String(__p.path);",
    "if(__n!=__g.proyecto&&__n.replace(/\\.prproj$/,'')!=__g.proyecto&&__r!=__g.proyecto&&__r.indexOf(__g.proyecto)<0)",
    "return 'ERROR GUARDIA: el proyecto activo es '+__n+', no '+__g.proyecto+'. No se ejecutó nada.';}",
    "if(__g.secuencia){var __s=app.project.activeSequence;",
    "if(!__s||__s.name!=__g.secuencia)return 'ERROR GUARDIA: la secuencia activa es '+(__s?__s.name:'ninguna')+', no '+__g.secuencia+'. No se ejecutó nada.';}",
    "return '';})();",
    "if(__gerr){__gerr;}else{try{",
  ];
  const N = pre.length;
  s = pre.join("\n") + "\n" + s + "\n}catch(__e){'ERROR: '+__e.message+' @ línea '+(__e.line-(__l0-1)-" + N + ");}}";
}
fs.writeFileSync(out, JSON.stringify({ id, script: s, timeoutMs: Math.max(45000, (+secs || 60) * 1000) }));
