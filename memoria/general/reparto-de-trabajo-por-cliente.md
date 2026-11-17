---
name: reparto-de-trabajo-por-cliente
description: Qué hace Claude en los vídeos de Amin (único cliente activo desde 06-11-2026) — marcadores o edición completa según el proyecto
metadata:
  type: feedback
---

El 2026-10-11 el usuario dijo: "de ahora en adelante los vídeos originales de Amin los editaré yo a mano; lo único que quiero que hagas es que me pongas los marcadores (eso que ponías arriba que decía de qué trataba cada cosa, dónde había un motion graphic y eso) y los pongas en la línea del tiempo. […]"

**Why:** Amin es el cliente que él cuida a mano (su estilo propio le funciona). Actualización 06-11-2026: Amin es el único cliente activo y el alcance depende del proyecto (solo marcadores o edición completa, ver [[arquitectura-sistema-fases]]). Eric y Natalia están archivados en `0 CLAUDE EDITOR/9 ARCHIVO (no se carga)/`.

**How to apply:**
- **Amin (HASTA 30-10; ahora edito vídeos completos, ver [[sistema-amin-trabajador]]):** bruto en su línea de tiempo (solo silencios fuera, sin elegir tomas), y marcadores arriba: de qué trata cada parte, tomas repetidas, qué se recortó y SUGERENCIAS de dónde iría un motion graphic o una imagen ("💡 MG: …"). No poner subtítulos, efectos ni motion graphics en sus originales salvo que los pida. (Los trials y pruebas aparte siguen siendo libres.)

Relacionado: [[lotes-de-edicion-premiere]], [[como-editar-para-el-usuario]], [[clientes-y-carga-de-trabajo]].

**Formato exacto de los marcadores de Amin** (el usuario mandó captura el 2026-10-11: "estos son los marcadores que quiero"; son los que yo ponía en `AMIN_1009_01 - SONIDO v2`): marcadores CON DURACIÓN encima de la línea de tiempo, uno por idea, que cubren el tramo donde va el recurso. Nombres: "IMAGEN derecha: …" / "IMAGEN izquierda: …" (color índice 1, rojo; lo malo/pobre a la derecha, lo bueno/rico a la izquierda), "MOTION GRAPHIC: …" y "CIERRE: seguir @aminbusinesss" (índice 3, naranja); la idea del gráfico va en el comentario. NO quiere marcadores por frase, de recortes ni con emojis. En brutos con varias tomas, se marca la última toma de cada idea (el comentario dice cuántas tomas hay). Script: `sistema/marcadores-amin.py` (reglas por vídeo) + `m.end = Time` para la duración.

**Amin, corrección final (2026-10-11, tarde):** "estos de Amin solo dame los marcadores y déjame el crudo sin cortar nada, silencios ni nada". Para Amin el bruto va ENTERO (un clip por archivo, ni silencios fuera) y encima solo los marcadores con duración. `sistema/marcadores-amin.py --crudo` calcula tiempos sobre el archivo original; `premiere` scratch `amin-crudo.jsx` fue el montaje. Lo de quitar silencios queda solo para Eric y Natalia si lo piden.
Trampa: la duración de un marcador se pone con `m.end = <segundos>` (número). Con un objeto Time no da error pero el marcador queda sin duración (pasó el 2026-10-11 y el usuario lo notó: "los marcadores tal como están en la captura"). Leer siempre `end - start` después de crearlos. Tampoco quiere marcadores de punto extra (ni "▶ VÍDEO n"): solo los de IMAGEN / MOTION GRAPHIC / CIERRE.

**Al empezar un vídeo (pedido el 2026-10-11):** "cuando empiece a editar un vídeo quiero que me dejes en bandeja una carpeta con todos los recursos de edición". Al decir "empiezo X": (1) reloj con `reel.js empezar`, (2) abrir la referencia del guion (idea ganadora) en el navegador, (3) dejar en el proyecto la bandeja "RECURSOS DE EDICIÓN (<cliente>)" con sus sonidos habituales, música, overlays y cierre (`premiere/recursos-bandeja.jsx`; origen `clientes/<cliente>/marca/` y los `sfx`/`motion` de sus reels anteriores), y (4) dejar ese vídeo justo después del ejemplo en la línea de tiempo. Si no ve el vídeo en la línea: la secuencia clonada del ejemplo tiene 15 pistas de vídeo y V1 queda fuera de la vista; hay que bajar con la rueda sobre las pistas de vídeo.

**Recursos del vídeo en curso (2026-10-11, "añade todo lo que me pueda servir para editar este vídeo"):** además de la bandeja general, descargar la referencia del guion (`yt-dlp` sin cookies funcionó), mirar cómo está editada y fabricar justo lo que usa. Para "5 mujeres" fueron pastilla de título + lista numerada que se rellena (`motion/src/AminLista.tsx`, fondo transparente, ProRes 4444 a escala 2; texto negro porque la pared de Amin es clara). Se importan con `premiere/recursos-del-video.jsx`, que trabaja sobre `app.projects[i]` sin activar el proyecto (el usuario puede estar en otro). Interpretación mía: si la referencia no lleva imágenes, no añadir imágenes.

**Quitar silencios a petición en un bruto de Amin (2026-10-11, "recorta los silencios y muletillas pero ten cuidado de no perder información"):** el audio de sus brutos viene con puerta de ruido (voz de Amin ≈ −35 dB, silencio ≈ −80) y hay una voz de apuntador muy baja (≈ −60) que le dicta cada frase; Whisper la transcribe y alarga palabras, así que no fiarse de sus tiempos. Funcionó: `silencedetect` a −58 dB unido a las palabras, y quedarse con los tramos con palabras y pico ≥ −50 dB; se conservan todas las tomas repetidas. Antes: releer la línea (el usuario ya había cortado a mano y sus marcadores se desplazan con sus cortes), clonar la secuencia, y recolocar los marcadores del tramo.
