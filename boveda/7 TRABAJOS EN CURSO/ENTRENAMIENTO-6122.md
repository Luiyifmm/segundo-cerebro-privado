---
tipo: estado
trabajo: ENTRENAMIENTO-6122
cliente: amin
actualizado: 2026-11-07
---
# ENTRENAMIENTO-6122 · «¿De rico o de pobre?» (ronda 3, método de dirección creativa)

**Paso actual (07-11, noche):** entregada `propuesta Claude 6122 v2.3.mp4` (secuencia «ENTRENAMIENTO 6122 · v2.2»). Esperando revisión.
- Cambios pedidos sobre la v2.1, todos aplicados:
  - color solo donde hace falta y en una única palabra (POBRE / RICO / MEDIOCRE, más RICO en el CTA); el resto, en línea blanca;
  - palabra resaltada más pequeña (tamaño 45 en lugar de 67,89);
  - todos los textos más arriba (altura 56 en lugar de 50);
  - la moraleja y el CTA, sin columnas, con plano cerrado sobre Amin (160 / 180 / 160 / 185);
  - las tarjetas entran con la palabra «pobre» o «rico» (en medias, con «mediocre»), con un fundido de 0,25 s que empieza 0,1 s antes, y salen de golpe cuando entra la siguiente; las parejas (logos + simple, casa + invertir) se quedan juntas; cocinar sale en las dos columnas («o eres pobre» / «o eres muy rico»).
- Pistas:
  - nuevas en V9 (POBRE), V10 (RICO) y V11 (etiquetas);
  - V5–V7 de la v2.1, desactivadas.
  - La secuencia «v2 formato» (v2.1) queda intacta.
- Límite de la plantilla v12: la proporción entre la línea y la palabra clave es fija (≈2,45). Por eso «de» sale pequeño encima de la palabra. Cambiarlo exige una plantilla nueva en AE.
- **QC:** 38,36 s, −19,2 LUFS, sin negros; fotogramas revisados.
- **No verificado:**
  - cómo suena;
  - la sincronía de ±2 f;
  - las licencias de las imágenes.
- El render de la v2.2 se exportó antes de estos cambios: no vale.
- Scripts 31–34 en `montaje/`.
- **Qué lleva la v2.1:**
  - V1 con todo a escala 100 (plano general fijo);
  - V2–V4 de la v1.5 DESACTIVADAS, no borradas;
  - V5: tarjetas en la columna POBRE (medias, iPhone, logos, coche, casa, banco);
  - V6: tarjetas en la columna RICO (simple, invertir, cocinar);
  - V7: etiquetas 0–26,24;
  - V8: 37 textos (preguntas en blanco; veredictos en un bloque de color, partidos según las palabras dichas; moraleja en blanco a tamaño fijo 28; «COMENTA RICO» en azul).
- **Decisiones mías, pendientes de su visto bueno:**
  - coche solo en POBRE, aunque el veredicto acaba en «pero de rico»;
  - cocinar en RICO, porque «o eres muy rico» es el remate;
  - moraleja sin color.
- Mientras no responda (plano fijo / alternar, música, momento de la tarjeta), se aplica lo mismo que en la prueba.
- **QC:**
  - 38,36 s, −19,2 LUFS, sin negros;
  - la transcripción del render es coherente y no aparece la voz de Javi;
  - hojas de fotogramas revisadas: las tarjetas no pisan la cabeza ni los textos.
- **No verificado:**
  - cómo suena;
  - la sincronía de ±2 f;
  - las licencias de las imágenes (siguen provisionales);
  - coche e invertir: originales de 626 px ampliados unas 2,2 veces;
  - qc-colisiones por script (solo revisión visual).
- Scripts 28–30 en `montaje/`.
- Análisis del reel de referencia: `0 CLAUDE EDITOR/10 BIBLIOTECA DE FORMATOS/COMPARACIONES RÁPIDAS.md`.
- Lo que hace la prueba (secuencia 4,93–9,71):
  - V1 a escala 100: el bruto entero, como plano general fijo;
  - V5–V6: tarjetas verticales de 680×900 en huecos fijos (POBRE a la izquierda, RICO a la derecha), con un fundido de entrada de 0,2 s;
  - V7: etiquetas fijas POBRE/RICO;
  - V8: la pregunta como un bloque blanco y el veredicto como un único bloque de color («DE POBRE», «DE RICO»);
  - lo de v1.5 en V2–V4 está DESACTIVADO, no borrado. Audio sin tocar.
- Archivos: `imagenes/prueba-formato/` y scripts `montaje/21-…`, `22-…`, `23-…`.
- Premiere se colgó con el script 23. El usuario lo desbloqueó y el cambio sí se había aplicado: las etiquetas blancas están bien.
- La transcripción de la prueba detectó «de pobre… **mediocre**». Se añadió «MEDIOCRE» en rojo (7,23–7,72). Al hacerlo, el MOGRT pisó los dos textos siguientes de V8; se repusieron (script 27) y la lección está en `recetas/LEEME.md`.
- **Entregada:** `prueba formato logos-simple v3.mp4` y su versión ligera, más `hoja prueba formato v3.png` (4,82 s, sin negros). La v1 y la v2 no valen: a la v2 le faltaban textos.
- No verificado: cómo suena; la sincronía de ±2 f (los textos van a las palabras de WhisperX, sin medir).
**Formato:** [[10 BIBLIOTECA DE FORMATOS/COMPARACIONES RÁPIDAS]].
**Proyecto de pruebas:** `3 PROYECTOS/_PRUEBAS CLAUDE/entrenamiento-6122/Entrenamiento 6122 Claude.prproj` · secuencia «ENTRENAMIENTO 6122 · propuesta Claude v1» · render `propuesta Claude 6122 v1.5.mp4` (38,4 s). Scripts y plan: `~/Videos-Remotion/clientes/amin/entrenamiento-6122/montaje/` (plan.py, plan.json, 01–14 *.jsx).
**Brief creativo:** [[ENTRENAMIENTO-6122 · BRIEF]] · estado: APROBADO (07-11)
**Dónde está:** bruto en Drive `RAW/CORTOS/Octubre/IMG_6122.MOV` · trabajo en `~/Videos-Remotion/clientes/amin/entrenamiento-6122/`
**Alcance:** edición completa de entrenamiento (proyecto de pruebas)

## Hecho
- 07-11:
  - transcripción verificada (82 % fiables);
  - guion n.º 36 localizado;
  - comprobado por la boca quién habla (Javi pregunta, Amin responde);
  - análisis de composición con `componer.py` (sin gestos de señalar fiables: composición equilibrada y REVISAR).

  - (sesión 2) Revisión por la boca de cada pregunta (fotogramas de boca, 8 por pregunta):
    - **Amin dice la pregunta** (boca en movimiento): pagar a medias 115,2 · coche 131,5 · casa vivir 161,2 · invertir 171,9 · logos 181,9 · ropa simple 191,8 · banco 205,8 y 229,8 (dos tomas).
    - **No la dice Amin** (boca cerrada, mano en la barbilla → la dice Javi): iPhone 93,2 · cocinar 99,6–104,8 (dudoso).
    - En 212 s Amin pide a Javi silencio para que «Luis pueda cortar el audio y a mí se me vea callado»: los planos callados son intencionados.
    - Esto corrige la tabla del BRIEF («Javi pregunta» solo vale para iPhone y cocinar).
  - (sesión 2) **Montaje v1.3** en el proyecto de pruebas (el original y la edición del usuario sin tocar):
    - Estructura: gancho pagar a medias → iPhone → logos → ropa simple → coche → casa vivir → invertir → banco → cocinar → moraleja (aparentar / conocimiento) → CTA (toma 315 s, «comenta Rico»). 38,4 s.
    - Pregunta: voz de Amin en A2; imagen = plano callado tomado JUSTO ANTES de su veredicto, así el paso pregunta → respuesta es el mismo plano continuo (sin corte). Pausa de 0,4 s antes del veredicto. Nueve planos callados revisados por la boca (8 fotogramas cada uno): boca cerrada en todos.
    - Encuadre: plano medio, 190/215 % alternando por bloque para disimular el salto entre momentos; moraleja 215/190/230; CTA 190. Sin movimiento añadido.
    - Textos (Subtitulo Amin v12, glow 0, tamaño 67,89, sombra 100/38/16): pregunta en blanco encima de la cabeza (V2); veredicto POBRE/MEDIOCRE rojo 230,40,40 y RICO azul 30,138,255 (V3); subtítulos de moraleja y CTA en azul.
    - Audio: +14 dB y techo −1 dB (voz-nivelar); preguntas que sonaban 7–11 dB más fuertes, bajadas a su respuesta; bloque iPhone −7 dB. Integrado −19,2 LUFS.
    - QC técnico: sin fotogramas negros (blackdetect; se cerraron 6 huecos de 1 fotograma por redondeo); transcripción del render coherente (83 % fiables) y en orden, sin frases de Javi; texto «¿Y llevar…?» corregido a «¿Llevar ropa simple?» por lo que se oye.
    - Foto «antes» de la secuencia hecha (ciclo de aprendizaje).
  - (sesión 2) **Imágenes v1.5** (permiso del usuario para buscar y descargar, 07-11):
    - Fuente: Bing Imágenes (Pinterest no carga con el panel del navegador oculto). Descargadas en carpeta aislada; tarjetas PNG con esquinas de 36 px en `3 PROYECTOS/_PRUEBAS CLAUDE/entrenamiento-6122/imagenes/`.
    - medias: dos móviles pagando por separado (people.com) · iPhone en la mano (Pinterest) · logos: look LV de pies a cabeza con bolsas (Pinterest) · simple: old money camisa de lino (Pinterest) · coche: hombre firmando la financiación (freepik, 626 px) · casa: casa moderna (Pinterest) · invertir: casa y llave sobre billetes (freepik, 626 px) · banco: hucha de hielo derritiéndose con billetes (scivest.com, generada por IA) · cocinar: él cocinando para ella (aol.com).
    - Descartada la hucha de dreamstime (marca de agua).
    - `componer.py` (sin gesto fiable: REVISAR) solo cabía al 70–80 % junto a la cabeza y chocaba con la pregunta → se **abrió sitio** desplazando a Amin a un lado (posición fija por bloque, sin movimiento) y la tarjeta grande (115 %) al otro, entre la pregunta y el veredicto.
    - **Lado según la regla 8 de la ficha:** veredicto POBRE → imagen a la derecha; RICO → izquierda (simple, invertir, cocinar). Sombra paralela por defecto. Entra y sale al corte (sin animación).
    - Comprobado en fotogramas: no tapa cara, pregunta ni veredicto (en simple, invertir y cocinar hubo que mover a Amin a 0,76–0,77).

  - (sesión 2) Revisión del usuario sobre la v1.3 («v1.4»: subtítulos incompletos, preguntas pequeñas, partículas sueltas en los veredictos, licencias de las imágenes, moraleja) **en pausa** por el cambio de enfoque. Queda hecha una copia sin tocar, «ENTRENAMIENTO 6122 · v1.6» (= v1.5), en el proyecto de pruebas. La transcripción del render v1.5 con large-v3 se lanzó para cruzar los subtítulos.
  - Licencias: TODAS las imágenes de la v1.5 tienen origen o permiso sin verificar → solo referencias o marcadores provisionales, nunca para una entrega comercial.

- Imágenes: coche e invertir son de freepik a 626 px (algo blandas, con aire de stock); banco es una imagen generada por IA con un rótulo de tienda inventado. Cambiar si el usuario quiere.
- Revisión conjunta de v1.3 y ajustes.
- Nivel final −16 LUFS en WAV aparte al entregar (ahora −19,2).
- Respuestas del usuario a las 4 preguntas → brief APROBADO → montaje → QC → evaluación contra el brief.
- La exportación del usuario de 6122, solo para la comparación final.

## No comprobado / riesgos
- **Escuchar:** no puedo oír. No verificado que las preguntas suenen a Amin (lo confirma el usuario), que la unión de audio pregunta → respuesta suene natural, ni el tono de las preguntas bajadas 7–11 dB.
- Sincronía de los textos: colocada a partir de palabras fiables del bruto; ±2 f NO MEDIDO sobre el render.
- La pregunta de cocinar: elegida la toma 104,1 s de las cuatro que hay; no sé si es la mejor.
- Banco: se oye «porque te arruina» / «da ruina» (dudoso); el texto solo dice «de POBRE».
- iPhone y cocinar: **el usuario confirma de oído (07-11) que la pregunta está en la voz de Amin.** Por la boca no se ve hablar (boca cerrada a 4 fps); el canal estéreo es mono duplicado, así que el audio no separa voces. Manda el oído del usuario.
- Quién habla en cada pregunta se ha visto por la boca, no por el audio (los niveles de Javi y de Amin se solapan: −22 a −38 dB los dos).
- El veredicto de «TikTok» no aparece en el bruto (el tramo 3–30 s es ruido o voz baja ininteligible).
- El verificador no separa la voz de Javi de la de Amin, porque tienen un nivel parecido.

## Decisiones (y por qué) · 07-11, del usuario, solo para este vídeo
- **Preguntas:** voz de Amin + un plano real de Amin callado (de otro momento del bruto). La voz de Javi fuera. Sin acelerar, congelar ni fabricar movimiento.
- **Respuestas:** sincronizadas. **Veredicto:** POBRE rojo / RICO azul.
- **Fuera:** TikTok, Lamborghini y quejarse. **Gancho:** pagar a medias.
- **Imágenes:** grandes, legibles y relacionadas con el gesto; abrir el plano si hace falta.
- **Moraleja:** sin efectos decorativos.
- Estas variantes **no** pasan a la ficha de Amin.
