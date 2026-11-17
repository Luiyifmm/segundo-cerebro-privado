# Auditoría del sistema de edición con IA — 6-11-2026

Solo lectura, salvo un error mío que ya está deshecho (apartado 0). No se ha instalado, borrado ni reestructurado nada, y no se ha tocado ningún proyecto de Premiere.

**Leyenda de estados**
- ✅ **Verificado:** lo ejecuté hoy y funcionó.
- 🟡 **Existe, sin probar en esta auditoría:** está instalado y en algún momento funcionó, pero hoy no lo comprobé.
- ⚠️ **Funciona con límites o fallos conocidos.**
- 💡 **Propuesto:** no existe todavía.

---

## 0. Incidencia durante la auditoría

- Ejecuté `node sistema/reel.js` **sin argumentos** pensando que mostraría la ayuda.
- Lo que hizo fue registrar un reel nuevo, **ERIC_1106_01**, con los 41 clips de `clientes/eric/entrada/ejercicio`, crear una carpeta vacía y regenerar el panel.
- **Deshecho:**
  - quité la entrada de `reels.json`, con copia previa en el scratch (`reels.json.con-error`);
  - moví la carpeta vacía a la Papelera (`error auditoria 2026-11-06`);
  - no se tocó ningún bruto.
- `panel.html` sigue mostrando esa fila hasta que se regenere.
- **Hallazgo:** `reel.js` registra automáticamente todo lo que haya en `clientes/*/entrada/` con **cualquier** orden, incluidas `panel` y la orden vacía. En `eric/entrada` hay dos carpetas sin registrar ("ejercicio" y "te quita el hambre"), así que la próxima orden las registrará. Es un efecto secundario que conviene quitar (fase 1).

---

## 1. Diagnóstico en una página

El sistema **funciona y tiene mucho valor acumulado**: un puente fiable con Premiere, más de 40 componentes de Remotion, plantillas MOGRT por cliente, transcripción local, medición de audio y unas 100 correcciones tuyas documentadas. Los problemas no son de capacidad, sino de **orden**:

1. **El conocimiento está repartido en 7 sitios** que se contradicen:
   - memoria automática (22 archivos, 93 KB);
   - 26 skills;
   - `criterio.md`;
   - las FICHAS de cliente;
   - el REGISTRO de correcciones;
   - el manual de hoy;
   - Notion.
2. **No hay "director" que se cargue siempre.** `~/Videos-Remotion/CLAUDE.md` solo se carga si la sesión se abre en esa carpeta. Esta sesión se abrió en `~` y no lo cargó. Tampoco existe `~/.claude/CLAUDE.md`.
3. **Premiere se maneja con scripts de un solo uso:** 224 `.jsx` sueltos y solo 16 recetas reutilizables. En cada tarea escribo ExtendScript desde cero, lo que cuesta tokens y repite errores ya resueltos. Además, los scripts buenos de cada sesión se quedan en carpetas temporales y se pierden (hay 32 ahora mismo).
4. **No hay control de versiones** en `~/Videos-Remotion` (sin git): ningún cambio de código se puede deshacer.
5. **Se han añadido hoy 9 skills de HyperFrames** (19:48, sin registro de quién las instaló) cuyas descripciones dicen "léeme primero para hacer cualquier vídeo". Chocan con "Premiere primero" y suman texto que se carga en cada conversación.
6. **El control de calidad depende de mi disciplina**, no de una herramienta: no hay un paso que lo compruebe solo.

---

## 2. Mapa de herramientas

### Premiere

| Pieza | Estado | Notas |
|---|---|---|
| Puente CEP "MCP Bridge" + `premiere/pr.sh` | ✅ | Hoy: abrir proyectos y secuencias, efectos (Tinción, Lumetri), SFX, proxies, fotogramas. Ahora Premiere está cerrado. |
| MCP `premiere-pro` (280 herramientas, solo 5 visibles) | ✅ (verify) / 🟡 (catálogo) | **Duplica** a `pr.sh`: usan el mismo puente. Yo uso casi siempre `pr.sh`, que gasta menos tokens. |
| Constructores (`propuesta-reel2/hablado/yt.jsx`, `plan-reel.py`) | 🟡 | Funcionaron en octubre. |
| `premiere/recetas/` (16) | 🟡 | Las únicas piezas reutilizables. |
| 224 `.jsx` sueltos en `premiere/` | ⚠️ | De un solo uso, con nombres por vídeo (`amin-v7-…`, `eric-sonda2`…). Ruido. |
| Plantillas MOGRT (`clientes/_plantillas/`) | ✅ | Usadas hoy (Subtitulo Amin v12). |
| Gráficos nativos (texto) | ⚠️ | No se pueden leer ni escribir por script: solo recolorear o desactivar. |
| "Mejorar la voz" | ⚠️ | No se puede lanzar por script. |

### Motion graphics

| Pieza | Estado | Notas |
|---|---|---|
| Remotion 4.0.534 (`motion/`, 2,3 GB) | ✅ | Lista sus composiciones en 4 s; renders con alfa usados hoy (EricCalculaLista v8, EricTriste, EricContador). |
| HyperFrames CLI 0.9.19 | ✅ | Prueba hoy: rótulo de 2 s, 1080×1920, **ProRes 4444 con alfa real en 8 s**. Falta importarlo en Premiere. |
| After Effects: MCP `after-effects` + `ae/run.sh` | 🟡 | AE está cerrado; no lo abrí. |
| Skill `after-effects-editor` | ⚠️ | Escrita para Windows y para su propio MCP. |
| Skill `motion-video-director` (62 KB) | ⚠️ | Flujo sin Premiere y con ElevenLabs. Solo se usa su criterio, que ya está resumido en `criterio.md`. |

### Audio

| Pieza | Estado | Notas |
|---|---|---|
| `voz/transcribir.js` (Whisper local) | ✅ | Usado hoy: 20 s de audio en 154 s con el Mac cargado. |
| MCP `earshot` | ✅ | `doctor` sin problemas; modelos en caché. |
| Skill `real-sfx` + índice de 301 sonidos | 🟡 | Los de Openverse no salen en las búsquedas (índice con duración 0). |
| Biblioteca en Drive (`RECURSOS DE EDICIÓN/EFECTOS DE SONIDO`) | ✅ | Montada en local y usada hoy. |
| Demucs (`herramientas/separar-env`) | 🟡 | Existe. |
| `voz/cortar-silencios.js` | 🟡 | Existe. Solapa con `reel.js cortar`. |

### Imagen y otros

| Pieza | Estado | Notas |
|---|---|---|
| `fondo/recortar.js`, `recorte-objetos/recortar`, `limpiar-halo.py`, `mejor-fotograma.sh` | 🟡 | Existen. |
| ffmpeg 6.0 / ffprobe 4.4 | ⚠️ | Versiones distintas. El ProRes con alfa de ffmpeg 6 no lo lee Premiere: usar el ffmpeg de Remotion (presente). |
| `yt-dlp`, `uv`, `gh`, `git` | ✅ | Presentes. |
| Python del sistema | ⚠️ | 3.9: los entornos buenos van con `uv` y Python 3.12. |

### Sistema

| Pieza | Estado | Notas |
|---|---|---|
| `sistema/reel.js` | ⚠️ | Funciona, pero registra en automático con cualquier orden (apartado 0). |
| Scripts de Notion | ⚠️ | API privada con cookie temporal; crear funciona, actualizar falla. Frágil. |
| Worker de Amin (`luis/trabajador.py`) | 🟡 | Pendiente de credenciales de Amin (R2). |
| Obsidian | ⚠️ | App instalada **sin ninguna bóveda creada** (no existe `obsidian.json`). |

### Duplicados

| Tema | Dónde está repetido |
|---|---|
| Subtítulos | `subtitulos` + `subtitulos-reels` + secciones de `edicion-video` |
| Cortar silencios | `cortar-silencios` + `primer-corte` (`reel.js cortar`) |
| Criterio de dirección | `direccion-viral` + `edicion-premium` + `criterio.md` + `motion-video-director` |
| Marca de cliente | skill `clientes` + FICHA.md + 3 memorias + manual + `edicion-video` + Notion |
| Motion graphics | Remotion + HyperFrames + After Effects + Canvas (`motion-video-director`) |
| Puente de Premiere | MCP `premiere-pro` + `pr.sh` |

---

## 3. Preferencias de clientes y correcciones: cómo se guardan hoy

- **Siete sitios.** Cada corrección se ha ido añadiendo como historia ("el 10-10 dijo…, el 12-10 corrigió…"), en vez de **sustituir la regla vigente**. Para saber qué vale hoy hay que leer toda la historia.
- **Contradicciones detectadas** (necesito que me digas cuál vale):
  1. **Eric, peso de referencia:** la FICHA dice "80 kg (no 83)", pero el render final de *Calcula esto* (v8) usa valores de **83 kg**.
  2. **Amin, color de resaltado:** la marca dice azul #1E8BFF, pero en IMG_6887 tus palabras están en **cian 0,250,255**. ¿El cian es el nuevo estándar?
  3. **Natalia, subtítulos:** una memoria dice verde 0,255,4 / rojo 255,45,45; la corrección posterior dice todo en rojo #D3261C. La ficha marca "decisión mía sin confirmar".
  4. **Amin, qué entrego:** la ficha dice "solo marcadores"; desde el 30-10 edito vídeos completos.
  5. **Puente:** una memoria dice "hay que pulsar Start Bridge"; hoy arranca solo.
- La memoria mezcla inglés y español, y algunas notas pesan 17 KB (`reparto-de-trabajo-por-cliente`).

---

## 4. Dónde se gastan tokens sin necesidad

| Qué | Cuándo se carga | Tamaño aprox. |
|---|---|---|
| Descripciones de las 26 skills locales (+ las de plugins) | en **cada** conversación | ~10 KB (~3.000 tokens) |
| De ellas, 9 de HyperFrames añadidas hoy (figma, slideshow, style-sampling…) | en cada conversación | ~2,7 KB |
| Índice de memoria (MEMORY.md) | en cada conversación | 3 KB, aceptable |
| Memorias largas (93 KB en total) | cuando las leo | hasta ~25.000 tokens |
| `edicion-video` (35 KB, cajón de sastre con datos viejos) | cuando la cargo | ~10.000 tokens |
| `motion-video-director` 62 KB · `real-sfx` 50 KB · `earshot` 22 KB · `after-effects-editor` 22 KB | cuando se cargan | 4.000–17.000 tokens cada una |
| Escribir ExtendScript desde cero en cada tarea | siempre que toco Premiere | lo más caro en la práctica |
| Salidas largas (líneas de tiempo enteras, transcripciones completas) | según la tarea | variable |

**Mayor ahorro posible:**
1. Una librería de funciones de Premiere probadas, a las que se llama con un JSON corto.
2. Una sola fuente de conocimiento, con reglas vigentes cortas.
3. Quitar del contexto diario las skills que no se usan.

---

## 5. Arquitectura propuesta 💡

```
                ┌──────────────────────────────┐
                │ DIRECTOR (1 archivo, ≤ 3 KB) │  ~/.claude/CLAUDE.md
                │ reglas · flujo · a dónde ir  │  (se carga siempre)
                └──────────────┬───────────────┘
        ┌──────────────────────┼───────────────────────┐
        ▼                      ▼                       ▼
  CONOCIMIENTO            HERRAMIENTAS             SUPERVISOR DE CALIDAD
  Bóveda Obsidian         skills cortas            skill "qc" + script
  (fuente única)          (solo el "cómo")         que se ejecuta antes de
  índice + 1 nota         + librería Premiere      decir "hecho"
  por cliente             + Remotion/HyperFrames
  + correcciones          + audio/transcripción
```

- **Director:** no es un agente, es un archivo corto.
  - Reglas que no se negocian.
  - Flujo por estados: ingesta → corte → propuesta → QC → entrega.
  - Tabla "tarea → skill → nota de la bóveda".
- **Herramientas:** las skills actuales se adelgazan a procedimientos. La memoria de gusto sale de ellas y pasa a la bóveda.
  - Librería `premiere/lib/` con funciones probadas: leer la línea, colocar MOGRT en pista vacía, aplicar un efecto comprobando el nombre, copiar Lumetri, colocar SFX con nivel, marcadores con duración, fotogramas de control.
  - Recetas que reciben JSON.
- **Supervisor de calidad:** un paso obligatorio, no un agente.
  - Hoja de fotogramas con la zona segura dibujada.
  - Recuento de subtítulos frente a los esperados.
  - LUFS y pico del audio exportado (earshot `measure`).
  - Lista de cosas que no se pudieron comprobar.
- **Agentes:** ninguno por ahora. Solo los propondría con datos:
  - tareas paralelas e independientes (por ejemplo, analizar 20 vídeos de referencia);
  - o una revisión con contexto limpio, si el QC dentro de la conversación resulta demasiado caro.

---

## 6. Obsidian como memoria

- **Estado:** la app está instalada, pero no hay ninguna bóveda.
- **Propuesta:** que la bóveda sea `~/EDICION/0 CLAUDE EDITOR/`, que ya es Markdown (FICHAS, REGISTRO, manual).
  - **No hace falta un MCP:** yo leo los archivos directamente y busco con grep. Un MCP más añadiría herramientas y tokens en cada conversación.
  - Obsidian es tu interfaz: enlaces, grafo y edición cómoda.
- **Estructura propuesta:**
  - `00 ÍNDICE.md` (≤ 1,5 KB): lo único que el director manda leer al empezar.
  - `Clientes/<Cliente>.md`: "Reglas vigentes" (corto, se **sustituye** cuando corriges) + "Historial" (se lee solo si hace falta). Con frontmatter `actualizado:`.
  - `Correcciones/REGISTRO.md`: una línea por corrección.
  - `Recetas/`: cómo se hace cada cosa, con enlace al script.
  - `Referencias/` (ya existe) y `Decisiones.md` (cosas acordadas).
- **Regla de carga:** al empezar, el índice; por tarea, solo la nota del cliente y la receta que toque; para dudas concretas, búsqueda.
- **La memoria automática** (`~/.claude/.../memory`) queda solo con punteros a la bóveda. No la enlazaría dentro de la bóveda al principio.
- **Ciclo de aprendizaje:** corriges → actualizo "Reglas vigentes" de ese cliente y añado una línea al REGISTRO. Nada más.

---

## 7. HyperFrames: viabilidad

**Verificado**
- CLI 0.9.19 instalado, con Chrome en caché local.
- Render de prueba en 8 s a ProRes 4444 con alfa válido para superponer.

**Ventajas**
- Composiciones en HTML/GSAP, más fáciles de retocar que React.
- Registro de unos 450 bloques: títulos, transiciones, tipografía cinética.
- Herramientas de control útiles para el supervisor de calidad: `snapshot`, `inspect`, `audio`, `diff`, `measure`.

**Riesgos**
- Duplica Remotion, que ya tiene más de 40 componentes de clientes que funcionan.
- Sus skills piden cargarse para "cualquier vídeo" y pueden desviar el trabajo de Premiere.
- Algunas funciones son de nube o de pago (`publish`, `billing`, `templates`, HeyGen): se usaría solo en local.

**Falta probar**
- Importarlo en una secuencia 4K de Premiere.
- Tus fuentes locales (Sequel Sans, SF Pro) y los emojis de Apple.
- Tiempo de render en piezas de 30–60 s.
- Si envía datos de uso.

**Recomendación:** piloto, no migración. Hacer los próximos 3 motion graphics nuevos en HyperFrames, con Remotion intacto, y decidir con datos: tiempo, tokens y tus correcciones.

---

## 8. Plan por fases (nada empieza sin tu aprobación)

| Fase | Qué | Riesgo | Toca algo tuyo |
|---|---|---|---|
| **1. Red de seguridad** | `git init` local en `~/Videos-Remotion` (sin remoto, excluyendo vídeos); guardar en `premiere/recetas/` los scripts buenos de hoy (SFX, Tinción, copiar Lumetri); que `reel.js` solo registre con `nuevo` o `descargas` | Bajo | No |
| **2. Director** | Crear `~/.claude/CLAUDE.md` corto (reglas + flujo + tabla de rutas) | Bajo | No |
| **3. Bóveda Obsidian** | Crear la bóveda sobre `0 CLAUDE EDITOR`, `00 ÍNDICE.md` y una nota por cliente con "Reglas vigentes" (tras resolver las 5 contradicciones) | Medio: reorganiza conocimiento, no borra | Notas, no proyectos |
| **4. Adelgazar** | Skills solo con el "cómo"; memoria a punteros; sacar del contexto diario las skills que no usas (figma, slideshow, style-sampling…), moviéndolas a una carpeta "desactivadas" sin borrarlas | Medio | No |
| **5. Librería de Premiere + QC** | `premiere/lib/` + recetas JSON + skill y script de QC; probar cada función en una secuencia de prueba | Medio | Solo secuencias de prueba |
| **6. Piloto HyperFrames** | 3 motion graphics reales en paralelo a Remotion; comparar | Bajo | Pistas nuevas |
| **7. Agentes (si hace falta)** | Solo con métricas de tokens o tiempo que lo justifiquen | — | — |

---

## 9. Lo que necesito de ti

1. ¿Apruebas la **fase 1** (git local, guardar recetas y quitar el registro automático de `reel.js`)?
2. Las **5 contradicciones** del apartado 3: cuál vale en cada caso.
3. ¿La bóveda de Obsidian en `0 CLAUDE EDITOR` te parece bien, o prefieres otra carpeta?
4. ¿Instalaste tú HyperFrames y sus 9 skills hoy? ¿Las mantengo activas o las paso a "desactivadas" hasta el piloto?
