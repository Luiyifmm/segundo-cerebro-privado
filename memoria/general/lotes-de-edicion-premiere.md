---
name: lotes-de-edicion-premiere
description: Cómo preparo un "lote" por cliente en Premiere (ejemplo del usuario + reels cortados con subtítulos, marcadores y proxies) y las trampas de giro, proxies y puente
metadata:
  type: project
---

El 2026-10-10/11 el usuario pidió un proyecto de Premiere por cliente con su vídeo de ejemplo (el que editó él) y cuatro brutos ya recortados, con subtítulos sencillos y editables, marcadores y proxies, "para sacarlos lo más rápido posible". Proyectos creados en `~/EDICION/3 PROYECTOS/Lotes de edición/<CLIENTE> - LOTE 11 OCT.prproj`: bandeja "00 EJEMPLO (editado por ti)" + una bandeja numerada por reel. Ejemplos elegidos por él: Amin = "Mujer para una noche" (secuencia IMG_6118 de Amin.prproj).

**Cómo se hace (scripts en `~/Videos-Remotion`):**
1. `sistema/reel.js nuevo <cliente> <carpeta de BRUTOS/PENDIENTES> "título"` y `cortar`; elegir tomas con `quitar`/`recuperar` leyendo el guion numerado.
2. `sistema/subs-reel.js <ID> --claves ... [--gris ...] [--cambia ...]` (unidades línea + palabra clave) y `sistema/marcadores.js <ID>` (un marcador por frase: GANCHO, frases, CTA).
3. `sistema/proxies.js [--modo bandera|erguido|tumbado] [--forzar] <ID>` → `<carpeta del bruto>/Proxies/`.
4. Premiere: `premiere/lote-crear-proyecto.jsx` (newProject + importSequences del ejemplo), `premiere/lote.py <cliente> <ID> "<bandeja>"` genera el .jsx de `lote-reel.jsx` (importa el XML, subtítulos con la plantilla y ajustes del ejemplo, marcadores, proxies), `lote-orientar.jsx`, `lote-ordenar.jsx`. Reels sin guion hablado (solo tomas de acción): `lote-importar-brutos.jsx` + `lote-tomas.jsx` (todas las tomas en orden, marcador por toma).
Plantillas y ajustes de Amin: `Subtitulo Amin v10` (tamaño 67,89; pos y 0,4375 con clave / 0,466 sin; sombra 100/38/16; glow 0; azul 30,138,255).

**Trampas comprobadas:**
- Giro: los clips de cámara `A001_*` (3840×2160 con giro −90 en metadatos) deben declararse en el XML con su tamaño real; Premiere decide por archivo si los gira. Leer `getProjectMetadata()` → `VideoInfo`: "2160 x 3840" = ya girado (Rotación 0); "3840 x 2160" = no girado (Rotación 90). Lo hace `lote-orientar.jsx`.
- Proxies: para `A001_*` que Premiere gira → proxy "erguido" (píxeles girados, sin metadato); si no los gira → "tumbado"; para iPhone `IMG_*` → "bandera" (mismo metadato). Si se regenera un proxy ya enlazado, usar OTRO nombre de archivo: Premiere guarda en caché el anterior y lo muestra deformado con una franja verde.
- No comparar original y proxy exportando fotogramas en el mismo script ni en el mismo instante: `exportFramePNG` devuelve caché. Un script por estado y otro tiempo.
- Puente: el panel espera 45 s por defecto; `premiere/pr.sh <jsx> <segundos>` ya envía `timeoutMs`. Un script largo sigue ejecutándose aunque el puente dé "timed out"; no lanzar otro encima (se encolan y parece colgado; el menú Archivo sale desactivado mientras corre un script, no es un aviso).
- `rsync -a` desde Drive copia carpetas sin permiso de escritura: `chmod -R u+rwX` antes de crear `Proxies/`.
- Mover brutos de PENDIENTES a HECHOS rompe enlaces: reenlazar con `changeMediaPath` (mapa en `~/EDICION/9 OTROS/mapa-brutos-*.json`) y corregir `sistema/reels.json`.

**Notion:** `notion/scripts/sincronizar-pipeline.js` crea una tarjeta por reel en su base "🎥 Pipeline de Producción de Video" (cliente, estado, asignado; mapa en `notion/pipeline-filas.json`). Crear funciona; ACTUALIZAR tarjetas existentes falla (ValidationError sin diagnosticar) y Notion rechaza añadir columnas por esta vía: si quiere "Minutos de edición" y "Qué mejoraría", que cree él las columnas. Cookies de Brave vía `yt-dlp --cookies-from-browser brave`, borradas tras cada uso.
Relacionado: [[espacio-de-trabajo-edicion]], [[direccion-edicion-natural-y-elegante]], [[como-editar-para-el-usuario]], [[notion-estudio-de-edicion]].

**Corrección del usuario (2026-10-11, madrugada) — así quiere los lotes, sustituye a lo de arriba donde difiera:**
- UNA sola línea de tiempo por cliente: su vídeo editado al comienzo y los otros cuatro detrás "siguiendo la regla de los treinta segundos" (interpretación mía, sin confirmar: 30 s de separación entre un vídeo y el siguiente, como ya hacía Amin en su línea).
- "No me entregues los vídeos cortados: entrégamelos en crudo y solamente corta la parte donde haya silencio." No elegir tomas ni quitar repeticiones; él elige.
- Los marcadores que le sirven son los de arriba de la línea de tiempo con TEXTO sobre de qué trata cada parte (no uno por frase suelta), y en ellos se anota qué se ha recortado.
- Hecho con `sistema/linea.py <cliente> <IDs>` (plan: silencios por volumen, o por huecos entre palabras si hay ruido de fondo; marcadores por idea agrupando tomas repetidas "(3 tomas) …" y anotando "✂ se quitaron X s") y en Premiere `premiere/linea.py preparar|video`, `linea-todo.sh <cliente> <fin del ejemplo>`, `linea-ordenar.jsx`. La secuencia se llama "<CLIENTE> · LÍNEA DE TIEMPO (ejemplo + 4 brutos)"; los brutos van importados de forma nativa en la bandeja "BRUTOS ENTEROS" (así Premiere los gira bien) y los cortes automáticos anteriores quedaron en "99 Cortes automáticos con subtítulos (referencia)". Sin subtítulos en los brutos (no tienen sentido hasta elegir tomas).

**Espejo en Premiere 2026 (2026-10-11):** el efecto se llama "Volteado horizontal" (no "Voltear horizontal"). `qe.project.getVideoEffectByName()` devuelve un objeto vacío (sin `.name`) cuando el nombre no existe y `addVideoEffect` no falla, así que hay que comprobar `fx.name` y releer los componentes del clip. `qe.project.getVideoEffectList()` da los nombres reales.

**Acelerar una edición entera y "retumbe" (2026-10-12, corrección de Amin a "5 mujeres": "métele un poco más de velocidad y que la música haga el retumbado cuando toque"):** `seq.setInPoint/setOutPoint` + `seq.createSubsequence(true)` saca el tramo editado a una secuencia propia; `app.project.createNewSequenceFromClips(nombre, [sub.projectItem], bin)` la anida y `qeClip.setSpeed(1.08, "", false, false, true)` (vídeo y audio) la acelera — comprobado: 43,67 → 40,43 s. No sé cuál de los booleanos es "mantener tono": pedir al usuario que lo escuche. Retumbe: `BASS DROP (10).wav` (golpe en 0) de 2,4 s en pista nueva sobre cada título de punto + música con bajada previa (×0,45) y subida en el golpe (×1,9 → base en 1,6 s).

**Acelerar: NO meter todo en un clip (corrección del usuario, 2026-10-12).** Con la edición entera anidada y acelerada: sin mantener tono "se escucha como una ardilla"; manteniéndolo, "peor, como un eco, y los sfx no se escuchan… no los metas en el mismo clip". En `qeClip.setSpeed(v, "", false, MANTENER_TONO, true)` el 4.º argumento es mantener tono. Forma correcta (scratch `rapido2.jsx`): imagen anidada acelerada (sin su audio), voz en su propio anidado "solo voz" (copia de la base con solo los clips de voz y sus efectos) acelerada manteniendo tono, y efectos de sonido, golpes y música como clips sueltos a velocidad NORMAL recolocados en tiempo/velocidad, con sus niveles y fotogramas clave.

**Amin, lote 18 oct (2026-10-18):** brutos de octubre que faltaban = IMG_6132 (guion 43 niñato), IMG_6121 (guion 35 pobre/rico), IMG_6126 (guion 39 vulgaridad/elegancia); el resto (6118, 6127, 6131, 6130, 6122, 6123, 6124) ya los editó él. Proyecto `AMIN - LOTE 18 OCT.prproj`: una secuencia por bruto entero (AMIN_1018_01..03) con marcadores de duración y proxies; script en scratch `amin18/lote.tpl.jsx` (newProject + importFiles + attachProxy + createNewSequenceFromClips + markers). En septiembre quedan brutos en REUTILIZABLES sin saber si se publicaron.
