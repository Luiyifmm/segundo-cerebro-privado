# Método de trabajo: un encargo y una réplica de tutorial

## A. Un encargo (intro, título, explicativo, anuncio, alerta de stream…)
1. **Entender:**
   - formato (16:9 1920×1080, 9:16 1080×1920, 1:1), fps (30 normal; 60 para gaming o UI; 24/25 cine), duración y voz o música;
   - el **contexto** (misterio, gaming, corporativo, Apple…): fija intensidad, velocidad, fuentes, color y assets (`diseno-y-dinamismo.md` 2.0);
   - el entregable: MP4, ProRes con alfa, WebM para OBS o .mogrt;
   - pedir referencias o proponer 2–3 estilos.
2. **Investigar (regla 1):**
   - qué efectos, plugins o funciones nativas hacen cada parte (`reglas-de-oro.md`, `catalogo-efectos-instalados.md`, `efectos-y-plugins.md`);
   - qué recetas del CEREBRO aplican (`recetas/indice.md`);
   - si falta algo, buscar en la web.
3. **Diseñar el fotograma final antes de animar** (50–80 % del esfuerzo): composición, jerarquía, márgenes, paleta y profundidad (las 5 leyes). Plan corto: escenas, capas, timing en fotogramas y qué se anima.
4. **Construir por script**, organizado desde el principio (regla 3):
   - una carpeta del trabajo con el .aep, `_material/` (scripts, medios, referencias), `render/` y las notas;
   - un `construir.jsx` que abre o crea el .aep y monta los pasos, y un script por escena con los parámetros en ARGS;
   - nombres, carpetas, CONTROL y colores de etiqueta desde la primera capa.
5. **Mirar y corregir:**
   - `ae_save_frame` en los momentos clave y hojas de fotogramas;
   - compararlo con la referencia si la hay;
   - pasar la checklist (`checklist.md` y `oficio-motion.md`).
6. **Optimizar (regla 2):** `scripts/optimizar_visibles.jsx` (informe → aplicar), y medir el tiempo por fotograma.
7. **Organizar para entregar (regla 3):** `scripts/organizar_proyecto.jsx` y `scripts/mapa_proyecto.jsx` (escribe `MAPA DEL PROYECTO.md`).
8. **Render** (`render-y-entrega.md`): avisar de los minutos, master → MP4 y revisar el MP4 a velocidad real.
9. **Contar al usuario,** en simple:
   - qué se hizo y dónde está (render, proyecto, mapa);
   - cómo cambiar los textos y las texturas;
   - qué no quedó como se pidió, y por qué.

## B. Replicar un tutorial (lo que se hizo del 29/09 al 02/10/2026)
- **FASE 0 · Releer** el conocimiento (esta skill: SKILL.md y las referencias del tema).
- **FASE 1 · Estudiar el vídeo entero:**
  - transcripción con Whisper large-v3 en la GPU (nombres con emojis: lanzarla desde un .py con glob);
  - hojas de fotogramas (`hojas_resumen.py` para vídeos largos, `hojas_de_fotogramas.py`);
  - fotogramas a tamaño completo de cada valor que salga en pantalla (`recortes_ui.py` lee los paneles del profe).
- **FASE 2 · Plan:** qué enseña, qué se replica y qué efectos o plugins hacen falta (y sus alternativas).
- **FASE 3 · Réplica por script** como la enseña el profe (sus keys, sus curvas): un .aep por clase, visible en AE.
- **FASE 4 · Comparar A OJO** con el original, en una hoja ORIGINAL | RÉPLICA por momentos (`comparar_momentos.py`), y arreglar solo lo que se note.
  - Después, si encaja, **una pieza propia** que use lo aprendido (demuestra que se entendió).
  - Medir es para entender (tamaños, tiempos), no para calcar al píxel. El método de medida (4.54/4.55) solo si el usuario pide una copia exacta.
  - **Tiempo proporcionado:** una animación de 5 s es un trabajo corto, no horas de medidas.
- **FASE 5 · Verificar:** fotogramas, render H.264, checklist; si hay movimiento, `suavidad.py` y `saltos.py`.
- **FASE 6 · Documentar** lo aprendido (APRENDIZAJE de la clase + recetas y trampas nuevas).
- **FASE 7 · Avisar al usuario** al terminar cada tutorial: qué aprendí, qué hice, dónde está y qué no quedó igual.
- **Referencia grabada en pantalla:** comprobar la velocidad del reproductor (`velocidad_reproduccion.py`: una iba al 0,8x) y los rebobinados antes de medir tiempos.

## C. Comunicación con el usuario
- Pensada para editores de vídeo (Premiere, OBS, After Effects). Si importa, preguntar la versión de AE y el PC.
- **En español y con palabras simples.** No sabe programar: **nunca pedirle que ejecute comandos**. Hacerlo y contarle qué se hizo y qué salió.
- **Directo:** si algo está mal o no se puede, decirlo con el dato que lo demuestra. Si una decisión es de verdad suya, preguntarla; si no, decidir y decir qué se decidió.
- **Antes de descargar algo, pedir permiso** (qué archivo, de dónde y cuánto pesa). Las descargas van a la carpeta Descargas y luego a `_material` del proyecto.
- **Nunca** contraseñas, cuentas ni instaladores. Sin caras reales ni marcas de otros, salvo que lo pida.
- Todo lo que se haga se tiene que ver en la pantalla de AE: `comp.openInViewer()`, la capa con el efecto seleccionada y el tiempo en un momento representativo.
