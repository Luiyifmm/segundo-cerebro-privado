# Fase 1 — informe (06-11-2026)

Fase 1 terminada dentro de las condiciones que pusiste. No he tocado ningún proyecto de Premiere. No he empezado las fases 2 a 7.

## 1. Cambios realizados

| Qué | Archivos |
|---|---|
| Git local, sin remoto | `~/Videos-Remotion/.gitignore` (nuevo, lista blanca), `.git/` (2 MB) |
| `reel.js` corregido | `~/Videos-Remotion/sistema/reel.js` |
| Panel regenerado (sin el reel accidental) | `~/Videos-Remotion/sistema/panel.html` |
| Recetas de Premiere con JSON | `premiere/recetas/correr-receta.sh`, `LEEME.md`, `_comun.txt` y 9 recetas: `sfx-colocar`, `lumetri-copiar`, `tincion-clips`, `mogrt-textos`, `abrir-secuencia`, `guardar-proyectos`, `proxies`, `fotogramas`, `efectos-lista` |
| Originales de la sesión conservados, sin cambios | `premiere/recetas/origen/2026-11-06 Amin IMG_6887 y rendimiento/` (32 `.jsx`) |
| HyperFrames fuera de la carga habitual | `disable-model-invocation: true` en 9 skills (figma, hyperframes, hyperframes-cli, hyperframes-registry, media-use, remotion-to-hyperframes, reverse-any-video, slideshow, style-sampling). Copia de los originales en `~/.claude/skills-respaldo/2026-11-06-antes-de-desactivar-hyperframes/` |
| Decisiones sobre contradicciones | FICHAS de Eric, Amin y Natalia; skill `clientes`; manual completo |
| Puente de Premiere: arranque automático + recuperación | skill `premiere-puente`, `~/Videos-Remotion/CLAUDE.md`, manual, memoria `video-tooling-setup` |
| `reel.js` en la documentación | skill `primer-corte` |
| Registro y memoria | `REGISTRO DE CORRECCIONES.md` (6 filas); memoria nueva `arquitectura-sistema-fases` |

Remotion está intacto. No he borrado nada: solo la carpeta vacía del reel accidental fue a la Papelera, ya antes de esta fase.

## 2. Pruebas y resultados

**`reel.js`**, probado sobre una copia de los datos en una carpeta temporal (variable `REEL_RAIZ`), con dos clips falsos en `entrada/`:

| Prueba | Esperado | Resultado |
|---|---|---|
| T1 sin argumentos | ayuda, nada escrito | ✅ salida 0, datos iguales |
| T2 `ayuda` | ayuda | ✅ |
| T3 orden desconocida | error antes de escribir | ✅ salida 1, datos iguales |
| T4 `panel` | solo el panel | ✅ panel creado, datos iguales |
| T5 `descargas` | solo lectura | ✅ nada escrito |
| T6 `parar` | modifica, sin registrar `entrada/` | ✅ 31 reels antes y después |
| T7 `sincronizar` | registra lo de `entrada/` | ✅ +1 reel |
| T8 `sincronizar` otra vez | nada nuevo | ✅ |

Las huellas (SHA-1) de `reels.json` y `panel.html` reales, y la carpeta de clientes, eran idénticas antes y después de las pruebas.

**Panel real:** confirmé 0 apariciones de ERIC_1106_01 en `reels.json` y regeneré el panel; ahora también hay 0 en el panel. `reels.json` no cambió.

**Recetas:**
- Las 9 pasan la comprobación de sintaxis.
- `correr-receta.sh` rechaza un JSON no válido y una receta sin `__CFG__`.
- ⚠️ No se han ejecutado en Premiere en su versión con JSON (Premiere está cerrado y no debía tocar proyectos). Su lógica sí funcionó hoy en la versión original con datos fijos.

**Skills de HyperFrames:** las 9 tienen la marca, comprobado leyendo el encabezado. ⚠️ El efecto real (que no se carguen en cada conversación) solo se ve en una sesión nueva.

## 3. Estado de git

- Repositorio local en `~/Videos-Remotion`, **sin remoto** (0 remotos), con el árbol limpio.
- 3 commits:
  - `87e5058` base del taller (398 archivos, 2,3 MB, revisados antes del commit);
  - `4d7ea10` `reel.js` + recetas;
  - `1797577` `CLAUDE.md`.
- **Fuera de git:**
  - vídeos, audio, imágenes, fuentes y renders;
  - XML generados, `panel.html`, `node_modules`, entornos de Python y modelos;
  - `clientes/`, `entregas/` y `referencias/`;
  - credenciales: `nt.txt`, `.env`, cookies y tokens.
- Búsqueda de secretos antes del commit: solo menciones en texto de documentación, ningún valor real.

## 4. Problemas encontrados

1. **Un error mío durante la auditoría** (`reel.js` sin orden registró un reel). Deshecho, y es la causa de la corrección de esta fase.
2. **`~/.claude/skills` y la memoria no están bajo git.** Los cambios de hoy en las skills (`clientes`, `premiere-puente`, `primer-corte` y las 9 de HyperFrames) solo tienen la copia manual de las de HyperFrames.
3. **`hyperframes skills update`** (o un `init` sin `HYPERFRAMES_SKIP_SKILLS=1`) puede reescribir esas 9 skills y quitarles la marca de desactivadas.
4. **En `eric/entrada` hay dos carpetas sin registrar** ("ejercicio" y "te quita el hambre"). Ya no se registran solas; si las quieres como reels, hay que hacerlo con `sincronizar` o `nuevo`.
5. **El `.gitignore` excluye `*token*`, `*secret*` y `*credencial*` por nombre.** Si algún día un script de código se llama así, quedaría fuera; se ve con `git status --ignored`.
6. Hay ejecutables compilados (`recortar`, `emoji`, `medir-texto`) fuera de git; sus fuentes `.swift` sí están dentro.

## 5. Carpeta `~/Downloads/video-editor` (tu punto 1)

**Qué es:** un sistema completo, "Claude es el editor", versión 2026.10.16.
- Pipeline de 8 pasos: entrada → corte → audio → color → gráficos → SFX → revisión → exportación.
- Guías por app (Premiere, Resolve, CapCut, Final Cut), estilos predefinidos, unos 100 scripts y 25 skills.
- No he ejecutado nada; su instalación no se ha corrido nunca en este Mac.

**No lo instalaría tal cual:**
- Funciona como proyecto propio con sus estilos fijos (LUT "Autumn", subtítulos en mayúsculas), que no son los de tus clientes.
- Trae su propio HyperFrames fijado en 0.8.105 (tú tienes 0.9.19) y su `CLAUDE.md` pesa 45 KB.
- Su configuración da permisos automáticos amplios (`brew`, `npm` y `pip install`, `git clone`) y un gancho de inicio que escribe en `~/.video-editor`.
- Su vía para Premiere exige clonar otro MCP; el nuestro ya funciona.
- No tiene una licencia general (solo una parte es MIT): **adaptar ideas, no copiar código.**

**Lo que sí vale la pena adoptar** (por fases, adaptado a lo nuestro):
1. **Un archivo de estado por trabajo** (su `RUN.md`): en qué paso va cada vídeo y qué se saltó. Sobrevive a la compactación del contexto y evita releer todo. Menos tokens y más autonomía.
2. **Un contrato del puente:**
   - una sola línea de respuesta, con `ERROR: <mensaje> @ línea <n>` si falla, en vez de "evalScript failed";
   - lecturas largas por páginas;
   - **un guardia de proyecto activo**: no escribir si el proyecto abierto no es el del trabajo (a ellos les cayeron 37 gráficos en el proyecto equivocado; con dos proyectos abiertos nos puede pasar).
3. **Pruebas automáticas antes de enseñarte nada:**
   - `frame-proof`: limpiar la caché de previsualización antes de sacar fotogramas; explica los fotogramas viejos que nos devuelve Premiere;
   - `cut-proof`: exportar el audio del corte, transcribirlo y compararlo con el guion, para cazar sílabas cortadas o palabras dobles;
   - control de gráficos 9:16 (zona segura y 200–1620).
4. **Aprender de tus retoques a mano:**
   - `timeline-dump --diff` compara la secuencia antes y después de que la toques;
   - `place-sfx --diff/--adopt` convierte tus ajustes de sonido en la regla siguiente.

   Es exactamente el "aprender de tus correcciones".
5. **Al terminar cada vídeo** (su `bake-preset`): una línea con lo que enseñó ese vídeo, a la nota del cliente.
6. **Reglas de oficio:**
   - arreglar la fuente, nunca apilar correcciones encima;
   - cambios quirúrgicos;
   - en la revisión solo llegan decisiones de gusto, porque los defectos objetivos ya están corregidos;
   - ante tomas repetidas, la última.
7. **Correcciones de transcripción por nombre** (Amin, Eric, eecofit…) en un archivo que se aplica una vez.
8. **Exportar sin Media Encoder** (`exportAsMediaDirect`): evitaría los 10 GB de memoria. Tú prefieres AME, así que queda como opción.

## 6. Propuesta para la fase 2

Objetivo: menos errores y menos tokens, sin añadir agentes.

1. **Director corto en `~/.claude/CLAUDE.md`** (≤ 3 KB), para que se cargue sin importar la carpeta en la que abra la sesión:
   - reglas que no se negocian;
   - el flujo por pasos;
   - tabla tarea → skill → nota de la bóveda;
   - "antes de escribir ExtendScript, mirar recetas".
2. **Archivo de estado por trabajo** (idea 1): `ESTADO.md` en la carpeta de cada reel, con paso actual, decisiones, qué falta y qué no se comprobó. Lo leo al retomar en vez de reconstruir.
3. **Contrato y guardia del puente** (idea 2) en `pr.sh`:
   - respuesta de una línea y `ERROR @ línea`;
   - comprobación de que la secuencia y el proyecto activos son los del trabajo antes de escribir.

   Lo probaría con una secuencia de prueba que crearía yo, no con las tuyas.
4. **Versionar también las skills y la memoria** (en el mismo git local o en otro), para poder deshacer los cambios de documentación.
5. **Probar en Premiere las 9 recetas con JSON**, sobre una secuencia de prueba.

La bóveda de Obsidian (índice + "reglas vigentes" por cliente), las pruebas automáticas, el aprendizaje desde tus retoques y el piloto de HyperFrames quedan para las fases 3 a 6, tal como está en la auditoría.
