---
tipo: referencia
fecha: 2026-11-14
---
# Editar con Claude: Joseph + Santiago Siciliano

| Vídeo | Qué enseña | Dónde quedó |
|---|---|---|
| Joseph, «How to Edit VIRAL Talking Head Videos Using Fable 5.2» (lnF3TUIWkO4, 22 min) | 4 principios del estilo premium minimal, método para entrenar un estilo (10 referencias + tablero + desglose), flujo de edición con documento de plan | skill `talking-head-premium` |
| Santiago Siciliano, «Cómo convertir a Claude en tu editor de vídeos» (fyn0iTuUb90, 15 min) | Una skill por estilo, vista previa del gancho, cada corrección se guarda, una sesión por cliente, cola de edición | skill `talking-head-premium`, apartado 4 |

**Cómo se estudió:** transcripción completa de los dos + hojas de fotogramas (`hojas/`: `j_` Joseph cada 10 s, `s_` Santiago cada 12 s). La de Joseph la hizo Whisper en local y la tradujo mal al español: se entiende el contenido, no vale para citas literales. El libro de reglas de Joseph se leyó de un fotograma pequeño (👁, sin probar).

**La «galaxia» y las «oficinas» de Santiago (visto en fotogramas 4:08–4:45):**
- Galaxia = vista de grafo de Obsidian sobre su carpeta `video-editor`. Esta bóveda ya es de Obsidian: se abre con «Vista de grafo».
- Oficinas = sesiones con nombre en la barra lateral de la app de Claude (HUGO, VSL JOSEPH LEON, B ROLL PRIME, OFICINA ICN, MOTION › Graphify-Labs…), todas sobre la misma carpeta, con worktree. No es un repo.
- Cola de edición = un artefacto por lote (vídeo, CTA, tema musical, estado).

## Repos evaluados (GitHub, datos del 14-11-2026; **ninguno instalado ni probado**)
| Repo | ★ | Licencia | Para qué | Veredicto |
|---|---|---|---|---|
| Graphify-Labs/graphify | 147 k | Apache-2.0 | Convierte una carpeta en un grafo consultable; el que usa Santiago | **Probar** sobre la bóveda y el taller |
| mksglu/context-mode | 34 k | sin declarar | Deja fuera del contexto la salida larga de las herramientas (ffmpeg, registros) | **Probar**; revisar la licencia antes |
| obsidianmd/obsidian-skills | 52 k | MIT | Skills oficiales para manejar Obsidian (Markdown, Bases, CLI) | Útil si se quiere que yo mantenga el grafo |
| browser-use/video-use | 31 k | MIT | Editar vídeo conversando, con ffmpeg | Leer para copiar ideas; se pisa con lo que hay |
| heygen-com/hyperframes | 84 k | Apache-2.0 | HTML → vídeo; el motor que usa Santiago | **Ya instalado** |
| remotion-dev/skills | 7 k | — | Skills de Remotion | **Ya instalado** (`remotion-best-practices`) |
| rtk-ai/rtk | 87 k | Apache-2.0 | Comprime la salida de git, tests… | Poco que ganar: es para programar |
| thedotmack/claude-mem | 117 k | Apache-2.0 | Memoria automática con un observador | No: gasta tokens y duplica ESTADO/BITÁCORA |
| JuliusBrussee/caveman | 120 k | Apache-2.0 | Respuestas telegráficas | No: choca con el formato de mensajes acordado |
| OpenMontageInc/OpenMontage | 80 k | AGPL-3.0 | Sistema completo de producción (700 skills) | No: enorme y duplicado |
| digitalsamba/claude-code-video-toolkit | 2,6 k | MIT | Guion, voz IA, clips IA, render | No ahora: es para vídeo sin cámara |
| basicmachines-co/basic-memory | 4,6 k | AGPL-3.0 | Memoria en Markdown por MCP | No: la bóveda ya lo hace |

Las cifras de ahorro que anuncian (60–90 %, «71×») son de sus autores y de proyectos de código; aquí no están medidas.
