# ECC · qué se instaló y cómo usarlo (17-11-2026)

Estado: **PROPUESTA** (modo entrenamiento). Nada de esto cambia la FICHA, las Lecciones ni el flujo de [[editor-maestro]] hasta que Luis lo apruebe.
Origen: `github.com/affaan-m/ECC` (Everything Claude Code, MIT), commit `3f14a10`. Cada skill copiada lleva `ORIGEN-ECC.txt`.

## Qué es ECC
Un sistema para programadores: 327 skills, 72 agentes, 98 comandos, reglas de lenguajes y 29 hooks. Casi todo es de software (bases de datos, DeFi, logística, Swift…). Se instaló **solo lo que sirve a la edición, sin hooks, sin agentes y sin reglas**, copiando carpetas de skills (la vía manual que el propio ECC documenta).

## Instalado (10 skills en `~/.claude/skills/`)
| Skill | Para qué nos sirve | Cómo usarla |
|---|---|---|
| `taste-distillation` | **Medir el look de referencias**: LUT `.cube` del color, ritmo de cortes (cortes/min, duración de planos), paleta, fotogramas clave y «plates» (destellos sobre negro). Sin internet. | «Mide el look de estas referencias» → `…/entornos/ecc-taste/bin/python ~/.claude/skills/taste-distillation/scripts/mint.py --genre <nombre> --root <carpeta> --refs a.mp4 b.mp4`. **Un pack por formato/estilo**, nunca mezclar. |
| `taste-application` | Aplicar un pack: cortar al ritmo medido, gradear con la LUT, verificar con números. La parte que **genera** vídeo usa fal.ai (de pago): **no instalada ni autorizada**. | Solo modo local (`--dry-run` / material propio). |
| `tasteforge-video` | Exportar un corte como **EDL/FCPXML editable** (Premiere lo importa), entrevista de gusto, auditoría de procedencia. | «Expórtame este plan a FCPXML». Requiere el paquete `tasteforge` (no instalado aún; ver pendientes). |
| `manim-video` | Gráficos explicativos animados (diagramas, curvas). | Necesita Manim (no instalado). Alternativa a Remotion/HyperFrames para gráficos técnicos. |
| `short-video-distribution` | Comprobar un vídeo contra los límites de TikTok/Shorts/Reels y escribir títulos y textos. **Pide aprobación antes de publicar.** | «Prepara la publicación de este reel». Publicar = acción hacia fuera: siempre se pregunta. |
| `content-engine` | Guiones, copys y calendario de contenido por plataforma. | «Hazme el copy de este reel para TikTok e IG». |
| `growth-log` | Escribir lo aprendido como patrón (causa, regla, señal) y no como diario. Encaja con PROPUESTAS DE REGLAS. | Al cerrar un vídeo o una corrección. |
| `council` | Decisión difícil con 4 voces que discrepan antes de elegir. | «Haz un consejo: ¿gancho A o B?». Guarda notas en `~/.claude/notes`. |
| `search-first` | Buscar si ya existe una herramienta antes de construirla (como exige [[after-effects-editor]]). | Antes de escribir un script nuevo. |
| `skill-stocktake` | Auditar la calidad de nuestras 42 skills. | «Haz un inventario de las skills». Solo lee. |

Entorno aislado nuevo: `~/Videos-Remotion/herramientas/entornos/ecc-taste` (numpy, opencv-headless, scenedetect, requests). No toca el Python del sistema.

**Prueba hecha (17-11):** `mint.py` con las 6 favoritas → 140 planos, 1,73 s de media, **35 cortes/min**; firma de color «ámbar en tonos medios (L≈65), neutro en los extremos»; paleta `#191715 #edebeb #8b7b72 #bdaea2 #514e4b`; 12 fotogramas revisados a ojo (correctos). 35 s de proceso. Mezcla 6 estilos: vale como prueba, no como pack real.

## NO instalado y por qué (para revisarlo juntos)
| Qué | Por qué no | Choca con |
|---|---|---|
| **Los 29 hooks** (scripts que se ejecutan solos en cada acción) | `gateguard` **bloquea la primera edición de cada archivo**; `mcp-health-check` puede **bloquear llamadas a Premiere/After Effects** si las cree caídas; `format-typecheck` reformatea código JS/TS (Remotion, panel) al terminar; `continuous-learning` registra cada acción; `session:start` mete hasta 8.000 caracteres en cada sesión; `desktop-notify` y `cost-tracker` en cada respuesta. | Regla 1 y 2 (no tocar trabajo, Premiere), coste de contexto, puente de Premiere |
| `continuous-learning-v2` (instintos que se convierten solos en skills/agentes) | Aprende y **crea skills sin aprobación**. | Regla 6 y «nada pasa a regla sin su aprobación» |
| `delivery-gate` | Hook que **impide terminar** hasta pasar sus chequeos de código. | Paradas de editor-maestro |
| `strategic-compact` | Depende de un hook; Claude Code ya compacta solo. | — |
| `video-editing` | Se activa con «edita este vídeo», **la misma frase que editor-maestro**; flujo genérico (FFmpeg/Descript/CapCut/Resolve), sin Premiere ni paradas. | editor-maestro (desviaría el flujo) |
| `remotion-video-creation` | Repite `remotion-best-practices`, que ya tenemos. | Duplicado |
| `taste` | Vocabulario para videoclips «angelcore/hyperpop»; no es nuestro formato. | — |
| `fal-ai-media`, generación de `taste-application` | Generar vídeo/imagen con fal.ai: **de pago** y necesita clave. | Regla 4 (sin aprobación) |
| `videodb` | Servicio externo de pago; sube vídeo a la nube. | Privacidad de brutos de clientes |
| `social-publisher`, `crosspost`, `x-api` | Publican en redes por servicios de terceros. | Acciones hacia fuera |
| `brand-voice`, `deep-research` | Ya existen con el mismo nombre (plugins). | Duplicado/confusión |
| 72 agentes, 98 comandos, reglas de código | Son de programación (TDD, revisión de código, lenguajes). Llenarían cada sesión. | Coste de contexto |
| Resto (≈280 skills: bases de datos, seguridad, DeFi, logística, Swift, ML…) | Fuera de la edición de vídeo. | — |

## Pendiente
- Decidir si se instala el paquete `tasteforge` (exportar FCPXML a Premiere) y Manim: dependencias nuevas, esperan el sí de Luis.
- Primer pack real: por formato (p. ej. «podcast minimal» con las referencias de [[minimal-corto]]), y probar su LUT en Lumetri sobre una copia.
- Comprobar si la LUT medida mejora el color de un bruto de Amin (HLG, ver [[color-hdr]]) — NO VERIFICADO.
