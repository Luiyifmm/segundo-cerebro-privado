---
tipo: bitácora
trabajo: 6887-08
actualizado: 2026-11-08
---
# 6887-08 · BITÁCORA (historia completa; NO se carga al retomar)

> El 08-11-2026 (fase 8B.1) el ESTADO pasó a ser un resumen operativo. Todo lo que había en él está aquí abajo, sin cambios. Lo nuevo se añade al final.

# 6887-08 · 08 · Haz esto y tu vida cambia en 6 meses

**Paso actual (07-11, noche):** brief APROBADO y propuesta **v1.2** montada en la copia segura. Esperando la revisión del usuario. **No enviada al cliente.**
- Informe, QC y entregables: [[6887-08 · INFORME v1.2]].
- Proyecto: `3 PROYECTOS/_PRUEBAS CLAUDE/6887-08/Amin · copia Claude 6887-08.prproj`, secuencia «6887-08 · propuesta Claude v1».
- Scripts: `~/Videos-Remotion/clientes/amin/IMG_6887-s03/08/scripts/01–15` · EDL `08/edl.json` · lista `08/lista/generar-lista.py`.
- Foto «antes»: `fotos/6887-08/antes-20261107-2324.json`. Cuando el usuario retoque: foto «despues» + `aprender.py`.
- Lo que borré: «prueba audio a/b.mp4», dos exportaciones mías de prueba de nivel, con `rm` (borrado definitivo, no a la Papelera). No eran trabajo del usuario, pero la regla pide Papelera: queda anotado.
**Origen:** IMG_6887, Secuencia 03 de `Amin.prproj` (solo lectura), tramo 0–154 s del tramo (bruto = tramo + 785,651). Lote: [[IMG_6887-s03 · LOTE FASE 7]].
**Formato:** LISTA RÁPIDA. **Referencia:** DdcnSL_tx89 (análisis en `1 REFERENCIAS/Analizadas por Claude/2026-11-07 referencias lote 6887/`).
**Audio:** mono, sin relleno de canales; −37 LUFS en el bruto (nivelar a −16 en un WAV aparte al entregar).
**Transcripción:** `voz/salida-whisperx/s03_desde_785.651.verificada.json` (coherente, 69 % fiables).

## Material
Completo y limpio frase a frase: casi todas las frases tienen una toma buena, solo el mentor sale mal en las cuatro tomas. Gancho con una sola toma (7,2–12,0). CTA largo (142,7–153,3) con un tropiezo («donde que explico»). No dice la moraleja de «mi socio y yo facturamos…».

## Falta
- Debatir y aprobar el BRIEF.
- Elegir las tomas exactas: escucharlas no es posible; comprobar con la transcripción, la imagen y prueba-corte.py.
- Registro en reel.js: no se usa, porque copia el bruto entero (9,8 GB) y su corte automático es para un vídeo por archivo.

## No comprobado
- Nada escuchado.
- No se ha medido la sincronía.

## 08-11 · Subtítulos «Jordan A» en el vídeo completo (propuesta, NO aprobada)
- **El usuario eligió «A, con menos amarillo»** y pidió:
  - título «CAMBIA TU VIDA EN 6 MESES» en amarillo;
  - números de la lista en amarillo;
  - SFX.
- **Secuencia:** «6887-08 · JORDAN A completo v1», un duplicado de la del usuario (cortes, audio, color y velocidad intactos).
  - Desactivados, no borrados: subtítulos V3, lista V4, título V5 y «tic» A5 del usuario.
  - **Subtítulos:** `Subtitulo Jordan v4` en V6 (línea) y V7 (continuación o remate). 45 bloques, 4 remates (PORNO, CARO, POR DINERO, PLAN), amarillo dentro de la línea en ~1 de cada 3 bloques.
  - **Sincronía:** anclada a los arranques medidos en la onda (o WhisperX −0,03 s), 5 f de adelanto. CARO y PLAN, sin adelanto en el bloque siguiente para que se lean ≥ 0,4 s.
  - **Título** (V8/V9): Jordan v4 en modo letras al azar; Altura 100 + Movimiento y 0,421 / 0,468. Ojo: «Altura» no pasa de 100.
  - **Lista** (V10): `lista v3` con números #F5C542, sincronizada con la voz. Título y lista se van en 19,33 (frase del dinero).
  - **SFX:**
    - A6: 12 «tic» (Ui button, −14 dB);
    - A7: «Cinematic Low Whoosh» en el título (−4 dB) y «Whoosh Deep Short» 0,26 s antes de cada remate (−12 dB, pico medido a 0,26 s).
- **Exportación:** `3 PROYECTOS/_PRUEBAS CLAUDE/6887-08/6887-08 JORDAN A completo v1.mp4` (+ ligera + hoja).
  - 32,53 s · −15,1 LUFS · pico −3,9 dBTP · sin negros.
  - Transcripción coherente; subtítulos 130 palabras frente a 134 oídas (variantes de transcripción y 3 nexos).
- **No verificado:** nada escuchado (ni voz ni SFX); la sincronía no está comprobada de oído.
- **Sigue mal:**
  - la lista es pequeña para el móvil;
  - la capa de color (del usuario) acaba en 31,5 s y el vídeo en 32,5.
- **Plantilla:** `~/Videos-Remotion/ae/mogrt-jordan.jsx` → `clientes/_plantillas/Subtitulo Jordan v4.mogrt`.

## 08-11 · SFX inmersivos (tras «no tienen sentido ni son inmersivos»)
- **Referencias:**
  - **Jordan:** cama de música todo el vídeo, whoosh en los cambios a B-roll, subidas y golpes antes de los remates (earshot, sin escuchar).
  - **El usuario** («Secuencia 02» y «Secuencia anidada 14», leídas sin tocar): Sharp Riser al inicio + Whoosh Deep Short + Cinematic Bass 2 de cama; Woosh Effect 2/3/5/6 cada ~3 s; clics y «type & delete» en los textos; Sub Bass Drop 9 al cierre; música (Radiohead).
- **Hecho en «JORDAN A completo v1»** (archivos de su Drive `RECURSOS DE EDICIÓN/EFECTOS DE SONIDO`, solo leídos):
  - riser al gancho, con la cresta en «Ponte» (−15 dB);
  - cama Cinematic Bass 2 de 1,5 a 9,5 s (−20 dB);
  - en PORNO, CARO y PLAN: whoosh de entrada (−16) + boom Sub Bass Drop 9 (−20, 0,8 s);
  - whoosh suave al salir la lista;
  - riser hacia el boom de POR DINERO (−9 / −18);
  - «Cinematic Money» en «decenas de miles» (−8);
  - clic en cada punto de la lista (−6).
  - Los SFX anteriores (A6/A7), desactivados.
- **Medido** (diferencia entre versiones, en la banda de la voz, 300 Hz–4 kHz):
  - SFX ≥ 13 dB bajo la voz en todos los momentos;
  - golpes a ±70 ms de su remate;
  - −15,1 LUFS, pico −3,3 dBFS.
- **Iteraciones:**
  - la v2 tapaba «seis meses» (la transcripción oía «sí mismo») y el boom igualaba a la voz;
  - corregido en la v2.4.
- **Exportación:** `6887-08 JORDAN A completo v2.4 (sfx).mp4` (+ ligera). Las v2–v2.3 son intermedias.
- **No verificado:** nada escuchado. Falta la música: el usuario la usa en sus vídeos, pero la regla dice preguntar.
- **08-11 · Música** (el usuario eligió Radiohead, «Everything In Its Right Place», instrumental):
  - pista A13 desde el inicio de la canción, como en su vídeo 1;
  - −16 dB, unos 17,6 dB bajo la voz (medido);
  - fundido de salida de 1 s.
- **Ajuste fino:**
  - riser del gancho +0,3 s (la cresta tapaba «seis meses»);
  - clic 9 a −14 dB.
- **Entregada `6887-08 JORDAN A completo v2.7 (sfx + música).mp4`** (+ ligera):
  - −15,0 LUFS, pico −3,3 dBFS, sin negros;
  - la transcripción reconoce todo el texto.
  - Margen en la banda de voz ≥ 11 dB en los momentos más bajos de voz («seis meses», «planes»: ahí es la propia música).
  - Las v2.5 y v2.6 son intermedias.
- **No verificado:** nada escuchado.

## 08-11 · Corrección: énfasis selectivo (variante A2)
- **Corrección del usuario:** había animación en demasiados textos. Estudiado «40 Years of Sales Experience in 60 Seconds», fotograma a fotograma.
- **Secuencia nueva:** «6887-08 · JORDAN A2 enfasis selectivo», duplicado de «JORDAN A completo v1». La v2.7 (A completo) no se toca.
  - **Nivel 1:** sin movimiento, entra entero ≈ 1 f antes de la voz.
  - **Nivel 2:** solo PORNO, CARO, POR DINERO y PLAN, con fundido de 5 f y subida suave (ease-out).
  - Booms y whooshes de los remates movidos +0,133 s para que caigan en la nueva entrada.
- **Prueba corta:** `pruebas…/prueba A2 enfasis selectivo (corta).mp4` (11,5 s). Vídeo completo: `6887-08 JORDAN A2 enfasis selectivo.mp4` (−15,0 LUFS, pico −2,9).
- **Biblioteca:** `8 BIBLIOTECA DE ESTILOS/09 Subtítulos Jordan Belfort.md`.
- **Matiz medido:** en la referencia el énfasis **sube** unos 12 px de 1280; no baja desde arriba.
- **No verificado:** nada escuchado.

## 08-11 · A3: zoom out al inicio, zooms de Jordan y lista en dos columnas
- **Secuencia nueva:** «6887-08 · JORDAN A3 zooms + lista 2 col», duplicado de A2. A2 y la v2.7 no se tocan.
  - Audio, cortes, color y subtítulos: los de A2.
  - En A3 la lista v3 está desactivada, no borrada.
- **Zoom** en una pista nueva (V3): capa de ajuste con «Transformar», como haces tú. Está encima del color y debajo de todos los textos.
  - **Desenfoque de movimiento:** obturación 360 sin la de la composición, como en tus capas.
  - **Inicio:** tu receta, 130,9 % → 100 % en 1,8 s (la tuya va a 105,7 % en 2,16 s).
  - **Durante el vídeo, zooms medidos en Jordan:** +8 % en 0,4 s con frenada al final, uno cada 2–3 s al empezar una idea:
    - cero móvil · deja de mirar · sal del grupo · di que no · aprende a vender · te van a odiar · acostúmbrate · por dinero · si tú quieres · decenas de miles · PLAN;
    - en el cierre, +3 % lento.
  - **En tu corte a 125 % (19,5 s)** el zoom vuelve a 100 % de golpe: el salto lo da tu plano.
  - **Entre 13,7 y 15,8 s** («aprende a vender», mientras se inclina) el acercamiento lleva un paneo de 80 px a la izquierda. Sin él, el pelo tocaba la columna derecha.
- **Lista v4 en dos columnas** (`08/lista/generar-lista-v4.py`, pista V12, mismos tiempos que la v3):
  - 1–6 a la izquierda, arriba, en la pared libre;
  - 7–12 a la derecha, más abajo, junto a la sien, para no tapar la lámpara;
  - 66 px (antes 58) y más interlineado (106 frente a 88);
  - sombra doble para leerse sobre la pared clara.
  - **Por qué no es más grande:** la columna derecha no cabe entre la cara y el margen de Instagram (x ≤ 2020).
- **Medido:** caja de la cara contra las filas, a 10 fps. Hueco mínimo: derecha +4 px y izquierda −5 px respecto a la caja de BlazeFace, que es más ancha que la cara. En los 4 momentos más justos, mirados uno a uno, no hay roce.
- **Exportación:** `6887-08 JORDAN A3 zooms + lista 2 col v3.mp4` (+ ligera). La v1 y la v2 son intermedias (rozaba).
- **Referencia:** `1 REFERENCIAS/Analizadas por Claude/2026-11-08 jordan 40 years/ZOOMS.md`.
- **No verificado:**
  - no lo he visto en movimiento a velocidad real, solo en fotogramas;
  - nada escuchado (el audio no cambia respecto a A2).

## 08-11 · A4 (lista en una columna + clic mínimo) y A5 (franjas negras, sin zooms)
- **A4 · «6887-08 · JORDAN A4 lista 1 col + clic»** (duplicado de A3):
  - **lista v6** (`08/lista/generar-lista-v6.py`): una columna de 12; los números se ven desde el segundo 0 y el texto entra al decirse (62 px);
  - **clic:** «Mouse Click 02» (Drive, `06 Teclado y clics`, de solo lectura) en la pista nueva A14, a −8 dB, ≈ 0,05 s antes de que aparezca cada punto;
  - el «Uu Click Digital» (A12) y la lista v4 están desactivados, no borrados;
  - los zooms siguen, sin el paneo.
- **A5 · «6887-08 · JORDAN A5 franjas negras sin zoom»** (duplicado de A4):
  - franjas negras con PNG en una pista nueva (`franjas negras 960-2900.png`): arriba 0–960 y abajo 2900–3840;
  - título «**12 HÁBITOS** PARA CAMBIAR / TU VIDA EN **6 MESES**» en la franja de arriba, con la plantilla Jordan v4 (editable). Va en dos tramos porque la plantilla dura 30 s; el segundo, sin animación;
  - capa de zoom y título anterior desactivados.
  - Tu salto a 125 % de las 19,5 s se mantiene: es tu corte.
- **Ninguna de las referencias guardadas tiene franjas negras** (los dos vídeos de Jordan y los otros dos reels): el formato es mío; falta que el usuario lo confirme.
- **Exportaciones:** `… A4 lista 1 col + clic v3.mp4` y `… A5 franjas negras sin zoom v3.mp4` (+ ligeras). Las v1 y v2 son intermedias: clic alto o adelantado.
  - −15,0 LUFS, pico −2,9 dBFS.
- **No verificado:** nada escuchado, tampoco el clic nuevo. Solo está medido.
- **Decisión del usuario (08-11):** se quedan las dos, A4 (con zooms) y A5 (franjas negras, sin zooms). No se borra nada; las exportaciones intermedias también se quedan.
- **08-11 · A5: submezcla de voz.** El script añadió «Submezcla 1» (estéreo); el usuario lo confirma en el mezclador.
  - El usuario asigna la salida de A1 y A2 a la submezcla: Premiere no deja hacerlo por script.
  - A1 y A2 siguen en damero, con sus solapes J/L intactos.
- **Aprendizaje:** `qe…addTracks(0,nV,0,1,nA,1,1,0)` crea una submezcla, aunque el DOM no la cuenta.
- **08-11 · A5: voz menos aplastada** (script 64):
  - **Cadena del usuario en los 21 clips de voz:** Volumen +15 dB → limitador → Amplificación → limitador. La voz salía aplastada contra un techo de −5,5 dBFS (solo voz: −13,5 LUFS, LRA 1,8).
  - **Barrido medido en el clon «_MEDIDA voz A5»**, solo voz y sin «Mejorar la voz»:

| Volumen | Sonoridad | LRA |
|---|---|---|
| +15 dB | −13,5 LUFS | 1,8 |
| +3 dB | −15,2 LUFS | 2,5 |
| 0 dB | −16,2 LUFS | 3,5 |
| −6 dB | −19,3 LUFS | 6,4 |
| −12 dB | −24,6 LUFS | 8,1 (sin limitar) |

  - Subir la Amplificación vuelve a aplastar. El techo del 2.º limitador (0,975 → 1) no cambia nada.
  - **Aplicado:** Volumen −6 dB (en los dos clips con claves, −21 dB relativos), Amplificación 0,80 y «Mejorar la voz» en omitir, no borrado.
    - Solo voz: −16,5 LUFS, LRA 3,7.
    - Mezcla completa: −16,3 LUFS (antes −15,0), pico −3,3.
  - **Submezcla recreada.** Falta que el usuario asigne A1 y A2 a «Submezcla 1» y suba su fader unos +3 dB para recuperar el nivel.
  - **No verificado:** nada escuchado; la onda que dibuja la línea de tiempo puede depender de la ganancia del clip, que no se puede leer por script.
- **08-11 · A4: el mismo ajuste de voz que A5** (script 65): Volumen −6 dB, Amplificación 0,80 y submezcla recreada. A4 no tenía «Mejorar la voz». El usuario tiene que asignar A1 y A2 a la submezcla y subir su fader unos +3 dB.
  - **Medido después:** la mezcla de A4 sale en −24,7 LUFS (A5: −16,3), con la cadena de clips idéntica.
    - Separando señales, la voz en A4 suena unos 12,6 dB más baja que en A5.
    - La v3 de A4 exportada antes estaba en −15,0, así que el cambio está en el mezclador de A4 (salida, fader o submezcla), que no se puede leer por script. Pendiente de revisar con el usuario.

## 08-11 · Incidencia de audio de A4 (abierta)
- **Medido:**
  - mezcla de A4 −24,7 LUFS frente a −16,3 de A5;
  - separando señales, la voz de A4 suena ≈ 12,6 dB más baja; música y efectos, iguales;
  - clips y efectos de voz idénticos en las dos secuencias.
- **Diagnóstico en disco: imposible.** El `.prproj` guardado (01:47) y el último autoguardado (10:56) son anteriores a la creación de A4, así que su mezclador no está en ningún archivo.
- **Para cerrarla falta una de dos:**
  - (a) una captura del mezclador de A4: salida («Mezcla») y fader de Audio 1 y Audio 2, y fader de cada submezcla;
  - (b) permiso para guardar la copia de pruebas y leer en su XML la salida y el volumen de cada pista.
