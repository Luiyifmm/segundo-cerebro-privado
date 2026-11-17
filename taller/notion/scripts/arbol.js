const fs = require("fs"), os = require("os"), path = require("path");
const R = path.join(os.homedir(), "Videos-Remotion");
const reels = JSON.parse(fs.readFileSync(R + "/sistema/reels.json")).reels;
const marca = (c) => JSON.parse(fs.readFileSync(`${R}/clientes/${c}/marca/marca.json`));
const L = { agencia: "3db1a3f6-1a4c-81d6-926f-f3f593746e67", research: "3db1a3f6-1a4c-818a-a099-cf507a3f060b", git: "3db1a3f6-1a4c-81d2-a9e7-e604c2d23d48", recicla: "3db1a3f6-1a4c-8113-9d2f-e52bdcbf7e2d", blueprint: "3d91a3f6-1a4c-815c-b1fd-ff1aee004a7f", plataforma: "3d91a3f6-1a4c-8191-9b53-ea792911fc8d", reelsBD: "762937e2-2516-448e-9a34-d733adbac2c9", workflows: "3d91a3f6-1a4c-8171-be64-ddf370dc4656", agentes: "3d91a3f6-1a4c-8194-b160-f29b687faae7", sistema: "3a41a3f6-1a4c-8314-9654-81e33bffdd4b", cerebro: "d811a3f6-1a4c-8247-a8c2-8179dcd4ba30" };
const cliente = (c, nombre, icon, carga, extra) => { const m = marca(c); const rs = reels.filter((r) => r.cliente === c); return { page: nombre, icon, children: [
  `!! ${carga} · Proyecto de marca en Premiere: «${nombre.split(" ")[0]} Branding.prproj» (Documentos › Adobe › Premiere Pro › 26.0)`,
  "## Marca (sacada de su vídeo ya editado)",
  `- **Subtítulos:** ${m.subtitulos.fuente}, color ${m.subtitulos.color || "blanco"}, ${m.subtitulos.palabras_por_bloque || "1 a 3"} palabras por bloque, ${m.subtitulos.segundos_por_bloque} s por bloque`,
  `- **Plantillas de texto:** ${m.plantillas_de_texto.map((p) => p.nombre + " ×" + p.usos).join(", ") || "ninguna"}`,
  `- **Efectos de sonido:** ${m.sfx.map((p) => p.nombre.replace(/\.\w+$/, "") + " ×" + p.usos).join(", ")}`,
  `- **Música del ejemplo:** ${m.musica.map((p) => p.nombre.replace(/\.\w+$/, "")).join(", ") || "—"}`,
  `- **Overlays y fondos:** ${m.overlays.join(", ") || "ninguno"}`,
  `- **Ritmo:** ${m.ritmo.efectos_de_sonido_por_10s} efectos de sonido cada 10 s · ${m.capas_de_ajuste} capas de ajuste en ${m.duracion_ejemplo_s} s`,
  ...extra,
  "## Reels",
  ...(rs.length ? rs.map((r) => `- **${r.id}** — ${r.titulo} · ${r.estado}${r.corte ? ` · corte de ${r.corte.seg} s (bruto ${r.corte.bruto} s)` : ""}`) : ["- Sin reels registrados"]),
  "## Pendiente", ...(c === "amin" ? ["[] Elegir plantilla entre las 10 alternativas", "[] Confirmar el código exacto del azul de marca"] : ["[] Confirmar colores de marca (solo tengo fuente, textos y sonidos)", "[] Revisar el kit en Premiere y decir qué sobra"]),
] }; };
module.exports = { page: "Estudio de Edición — Segundo Cerebro", icon: "🎬", children: [
  "!! Aquí vive todo lo que hacemos juntos en edición de vídeo: cómo trabajamos, la marca de cada cliente, el sistema, lo aprendido y lo pendiente. Lo mantiene Claude; tú solo corriges.",
  "## Empieza por aquí",
  { page: "Cómo trabajamos", icon: "🧭", children: [
    "!! Objetivo: 90 minutos por reel (antes: 4 a 6 horas). 4 reels al día: Amin ×2, Eric ×1, Natalia ×1.",
    "## El flujo de cada reel",
    "1. **Entrada** — Tú: «llegó material de Natalia». 1 min",
    "2. **Corte** — Claude quita pausas, tomas repetidas y tomas malas. Sin ti",
    "3. **Guion** — Tú lees el guion numerado en el panel y corriges: «quita 3 y 7». 5 min",
    "4. **Montaje** — Tú en Premiere: orden, imágenes, ritmo, música. 40 min",
    "5. **Marca** — Claude aplica subtítulos y gráficos de la plantilla del cliente. Sin ti",
    "6. **Entrega** — Exportas a la carpeta export; Claude revisa calidad y archiva con nombre. 10 min",
    "7. **Cierre** — Una frase: «apunta que mejoraría…». 1 min",
    "## La rutina del día",
    "1. Escribes «buenos días».", "2. Claude busca el material nuevo en Descargas, lo registra, lo corta y elige tomas.", "3. Abres el panel: arriba dice qué toca y en qué orden.", "4. Editas los 4 seguidos; «empiezo amin 1» y «entrega» en cada uno.",
    "## Frases que entiende Claude",
    "- «Llegó material de X» · «Procesa los de hoy»", "- «En amin 1 quita 3 y 7» · «recupera 4»", "- «Abre amin 1» (con el panel MCP Bridge abierto en Premiere)", "- «Empiezo amin 1» · «paro» · «entrega»", "- «Natalia 1: el cliente pide cambiar…»", "- «Apunta que mejoraría…»",
    "## Reglas", "- El sistema sirve a la producción, no la reemplaza: si un paso no ahorra trabajo, se quita.", "- Nombre de cada pieza: CLIENTE_MMDD_nn_vN (ejemplo: AMIN_1008_01_v1).", "- Lo que Claude quita nunca se pierde: queda al final de la secuencia, tras el marcador DESCARTES.", "- Agrupar por tarea: primero cortar todo, luego editar todo.",
  ] },
  { page: "Clientes", icon: "👥", children: [
    cliente("amin", "Amin Business", "🔵", "2 reels al día · @aminbusinesss · color de marca: azul", ["- **Regla de comparativas:** lo «malo» entra por la derecha y lo «bueno» por la izquierda.", "- **Regla de imágenes:** nunca tapan a quien habla; van detrás de la persona recortada o fuera de su silueta.", "- **Formato:** 2160×3840."]),
    cliente("eric", "Eric", "🟣", "1 reel al día · nutrición", ["- **Estilo observado:** muchos textos animados, flechas, imágenes de alimentos, grabaciones de pantalla como prueba."]),
    cliente("natalia", "Natalia", "🌸", "1 reel al día · alimentación y grasa · manda varios clips por reel", ["- **Estilo observado:** listas rápidas «más hincha / más desinflama» con imagen del alimento y sonido de error o acierto en cada par; comentario destacado al final como llamada a la acción."]),
  ] },
  { page: "Reels en curso", icon: "🎞️", children: [
    "!! Foto del 8 de octubre de 2026. El estado al minuto está en el panel del Mac: Videos-Remotion/sistema/panel.html",
    ...reels.map((r) => `- **${r.id}** · ${r.cliente} · ${r.titulo} · ${r.estado}${r.corte ? ` · ${r.corte.seg} s de ${r.corte.bruto} s` : ""}`),
    "## Dudas abiertas por reel", "- **Amin 2:** la frase 23 queda sin remate; la 50-51 repite «esta es la diferencia exacta».", "- **Amin 3:** se dejó «es de hombre de alto valor» y se quitó «es de hombre de verdad».", "- **Eric 1:** 84 s, puede quedar largo; la frase 11 repite «lo más curioso es».", "- **Natalia 1:** el gancho está al final; la frase 20 lleva un «otra vez» dentro.",
  ] },
  { page: "Sistema y herramientas", icon: "🧰", children: [
    "## Qué hace cada pieza",
    "- **Primer corte automático:** transcribe, numera las frases, quita repetidas y corta por volumen real. Prueba: 138 s → 28 s, igual que el montaje manual (26 s) con ±0,2 s.",
    "- **Panel de reels:** estado, qué toca ahora, tiempo por reel, guion numerado.",
    "- **Control de calidad:** formato, duración, negros, congelados, silencios y volumen antes de entregar.",
    "- **Gráficos por capas:** Remotion exporta cada capa con transparencia y entra en Premiere ya montada.",
    "- **Recorte de persona y cambio de fondo:** en el propio Mac, sin apps externas.",
    "- **Conexión con Premiere:** panel MCP Bridge (CEP). Con él abierto, Claude importa, ordena bandejas y separa secuencias.",
    "## Dónde está cada cosa (en el Mac)",
    "- Videos-Remotion/clientes/<cliente>/ → entrada, marca, reels y entregado", "- Videos-Remotion/sistema/ → panel.html y control de reels", "- Documentos › Adobe › Premiere Pro › 26.0 → Amin Branding, Eric Branding, Natalia Branding, NATALIA", "- Mi unidad › RECURSOS DE EDICIÓN › EFECTOS DE SONIDO → 159 sonidos en 10 carpetas",
    "## Límites conocidos", "- Repeticiones dentro de una misma frase sin pausa: se recortan a mano.", "- El orden de los clips va por nombre de archivo.", "- Claude elige tomas leyendo, no escuchando.", "- Instagram frena la lectura de perfiles por script.",
  ] },
  { page: "Aprendizajes de edición", icon: "📚", children: [
    `!! Base completa: [[Reels de referencia — 150 reels analizados|${L.reelsBD}]]`,
    "## Qué dicen los 150 reels", "- **Ganchos:** afirmación rotunda 83 · pregunta 19 · historia personal 15 · número o lista 14 · condicional 9 · orden o prohibición 7.", "- **Formatos:** montaje de estilo de vida 25 · tutorial con pantalla o diagrama 22 · busto simple 18 · lista numerada 18 · podcast o entrevista 14 · gancho fijo arriba 13 · comparativa A vs B 12.", "- **Música:** 126 de 156 usan audio original; solo 19 llevan canción con licencia. En este estilo manda la voz.",
    "## Lo que hemos probado con Amin", "- 10 alternativas del mismo vídeo en 2160×3840: fondo negro, estudio cálido, pantalla partida, cuadros en la pared, tarjeta podcast, color de marca con zoom, mitades a pantalla completa, editorial, fotos que caen arriba, palabra gigante detrás.", "- Variantes probadas: espejo, velocidad 1,1× sin cambiar el tono, graves añadidos a la voz, un color por versión.",
    "## Correcciones tuyas que ya son regla", "- Las imágenes no pueden tapar a quien habla ni salir en el sitio equivocado.", "- Las propuestas van dentro de Premiere, por capas y editables.", "- Varias alternativas en una sola línea de tiempo, separadas 30 s.", "- Nada suelto en la raíz del proyecto: todo en bandejas.",
  ] },
  { page: "Contenido con IA — mapa de lo que ya tienes", icon: "🤖", children: [
    "!! No he movido ni cambiado ninguna de tus páginas: esto es un índice ordenado con lo que cada una aporta y lo que ya aplicamos.",
    "## Proyecto", `- [[AI Content Agency — Proyecto V1|${L.agencia}]] — el proyecto madre: una capa que orquesta herramientas, no «otro editor con IA».`, `- [[Agentic Intelligence Platform|${L.plataforma}]] — la plataforma de agentes de la que cuelga.`, `- [[Blueprint técnico V1|${L.blueprint}]] — especificación de implementación.`,
    "## Investigación", `- [[Research & Intelligence|${L.research}]] — competencia (OpusClip, Higgsfield, Reuters) y repos a evaluar (Pireel, DaVinci-MCP, mcpCut, MakeMyClip).`, `- [[Proyectos Git — inventario|${L.git}]] — criterio para decidir integrar, adaptar o descartar.`, `- [[Qué reciclaremos|${L.recicla}]] — decisiones de arquitectura.`,
    "## Qué de todo eso ya está funcionando", "- **Transcripción como interfaz de edición** → el guion numerado («quita 3 y 7»).", "- **Material en bruto → producción → revisión humana mínima** → el flujo de 7 pasos.", "- **Reglas editoriales explícitas** → la ficha de marca de cada cliente.", "- **Control de calidad antes de exportar** → el paso de entrega.", "- **FFmpeg y Whisper como motores; XML como puente con el editor** → primer corte y entrega a Premiere.", "- **MCP como capa de conexión** → el panel MCP Bridge de Premiere.",
    "## Qué falta de tu plan", "[] Auditar los repos oficiales de Higgsfield (CLI y Skills, licencia MIT) antes de construir generación propia", "[] Índice semántico del material (buscar tomas e imágenes por contenido)", "[] Rúbrica de evaluación creativa, no solo técnica", "[] Memoria de decisiones creativas por cliente (empezada en Clientes)",
    "## Propuesta de orden (no aplicada)", "- Las 10 páginas numeradas de la plataforma están casi vacías: yo dejaría solo las que tengan contenido y archivaría el resto.", "- «Research», «Proyectos Git» y «Qué reciclaremos» se solapan: una sola página con tres secciones se lee mejor.", "- Dime «aplica el orden» y lo hago; mientras tanto no toco nada.",
  ] },
  { page: "Registro de decisiones", icon: "📝", children: [
    "## 8 de octubre de 2026", "- Un reel es una carpeta, no un archivo (Natalia manda varios clips).", "- Los cortes se calculan por volumen real, no por los tiempos del transcriptor.", "- Rutina diaria aprobada por ti.", "- Comparativas de Amin: malo a la derecha, bueno a la izquierda.", "- Un proyecto «Branding» por cliente con kit (una muestra de cada elemento) y el ejemplo real.", "- El vídeo de Natalia se separó del de Eric y vive en NATALIA.prproj.", "- Efectos de sonido: copia ordenada en tu unidad, porque PACKS es de solo lectura.",
  ] },
  "## Relacionado en tu Notion", `- [[Luiyi — Segundo Cerebro|${L.cerebro}]] (tu plantilla de áreas, proyectos, notas y tareas)`, `- [[Mi sistema operativo personal|${L.sistema}]] (horarios, pipeline de producción, práctica deliberada)`, `- [[Reels de referencia|${L.reelsBD}]]`,
] };
