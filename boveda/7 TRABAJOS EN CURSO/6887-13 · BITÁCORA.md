---
tipo: bitacora
trabajo: 6887-13
cliente: amin
---
# 6887-13 · BITÁCORA (no se carga al retomar; solo para datos concretos)

## 2026-11-08 · 8C etapa 2 (corte) · sesión `32e764ad-9233-4a26-8327-dd9a059ca3f4`

### Copia y secuencia
- `Amin.prproj` copiado con `cp -n` (md5 idéntico) a `_PRUEBAS CLAUDE/6887-13/Amin · copia Claude 6887-13.prproj`. La versión en disco es del 07-11 13:56 y **no contiene «Secuencia 03»**: está solo en el Amin.prproj abierto, sin guardar. Se leyó en solo lectura (V1/A1: IMG_6887.MOV, entrada 785,652 en 0,012; A1 Volumen Nivel 1 + Limitador forzado techo 0,998 / entrada 0,767; 2160×3840, 29,97).
- Secuencia nueva «6887-13 · corte v1 (Claude)» creada con `createNewSequenceFromClips` (se quitó el clip automático en el mismo script) y ajustada a 29,97 (venía a ~30).

### Desfase
- Correlación energía del bruto vs. palabras fiables (1010–1132): máximo en 785,64 (0,557) y 785,65 (0,556). Coincide con la Secuencia 03 (785,640).

### Gancho: por qué NO se unieron las tomas
1. La retranscripción del audio unido (`prueba-corte.py`) no oye «Si quieres ganar mucho dinero»: solo «te…». La 1.ª toma está dicha baja y poco articulada.
2. Nivel: 1.ª toma −43 dB RMS frente a −36,6 de la 2.ª (≈ 7 dB).
3. «mucho» casi no existe: entre «ganar» y «dinero» la energía cae a −51/−55 dB.
4. Imagen: en la 1.ª toma Amin mira abajo con las manos quietas (tono de ensayo); en la 2.ª mira a cámara y gesticula → salto de energía y de gesto.
5. «Realmente|solo» va en habla continua (valle de −48 dB, sin silencio): el corte caería dentro del habla.
Tono: «dinero,» ~132 Hz, «solo» ~163 Hz (subida normal tras pausa; no era el problema).

### Tomas elegidas (tramo s; bruto = +785,651) y posición en el corte
| # | Bloque | Tramo | Texto | Corte (s) |
|---|---|---|---|---|
| 1 | Gancho | 1023,18–1027,70 | Realmente solo necesitas tres tipos de ingresos, y es mucho más fácil de lo que tú piensas. | 0,00 |
| 2 | Tipo 1 | 1028,32–1028,80 | Uno. | 4,50 |
| 3 | | 1031,29–1033,15 | El dinero que ganas con tu tiempo. | 5,00 |
| 4 | | 1038,38–1040,55 | Si no trabajas, no cobras. (+0,4 s de respiro) | 6,87 |
| 5 | | 1051,39–1052,80 | Te pongo un ejemplo. Un entrenador. | 9,04 |
| 6 | | 1049,87–1051,25 | Sesiones en el gimnasio. | 10,48 |
| 7 | Tipo 2 | 1057,25–1057,70 | Dos. | 11,85 |
| 8 | | 1061,07–1063,15 | El dinero que ganas sin estar presente. | 12,31 |
| 9 | | 1069,73–1073,70 | Lo que vendes por internet mientras haces otra cosa. Como cocinar. | 14,38 |
| 10 | Tipo 3 | 1082,00–1085,15 | Tres. El dinero que entra cada mes sin que hagas algo nuevo. | 18,35 |
| 11 | | 1091,37–1092,90 | Gente que te paga todos los meses por | 21,49 |
| 12 | | 1093,33–1099,75 | algo que quiere todo el mundo, que es verse mejor, y cómo lo puedes hacer, muy sencillo, como entrenador online. | 22,99 |
| 13 | Moraleja | 1106,47–1108,55 | Literalmente es el mejor negocio del mundo. | 29,40 |
| 14 | | 1109,25–1113,95 | Trabajas desde donde quieras vendiendo lo que todo el mundo quiere, que es verse mejor. | 31,46 |
| 15 | CTA | 1115,07–1117,60 | Y si tú quieres aprender a cómo puede(s) ser entrenador online, | 36,17 |
| 16 | | 1122,32–1128,30 | y ganar más de 5.000 euros al mes, comenta(r) la palabra plan y te estaré enviando a la clase gratuita donde te explico cómo. | 38,70 |
Premiere ajusta entradas/salidas al fotograma (hacia abajo); los valores reales están en `tramos_premiere.json` del scratchpad de la sesión. Duración: 44,68 s (exportación 44,71).

### Descartadas
- Gancho 1.ª toma (1017,89–1020,9) y la unión (motivo arriba). Instrucciones de Javi (1008–1017).
- «Si no trabajas, no cobras» 1.ª toma (1033,57–1037,7: «cobras» arrastrado). «Un entrenador online» (1046,38: el online es el tipo 3). «Un entrenador» 1048,26. «Sesiones en el gimnasio, por ejemplo» 1053,17 (se pega a «por ejemplo» sin pausa; redundante con «te pongo un ejemplo»).
- «Número dos» 1056,65; tipo 2 1.ª toma (1057,85–1060,6) y «Lo que vendes…» 1.ª toma (1066,5–1069,8, voz baja).
- Tipo 3 1.ª toma (1077–1082, final sin voz); «Gente que te paga todos los meses» 1088,04 (frase incompleta; la 2.ª sigue hasta «online»). Pausa de 0,55 s tras «por» quitada.
- «Literalmente es el mejor trabajo» 1103,72 (se usa «negocio»). Hueco del CTA 1117,6–1122,3. «¿Cuántos guiones quedan?» y lo posterior.

### QC técnico (OK / FALLA / NO VERIFICADO)
- `cortes-voz.py` con los tiempos reales de Premiere: OK (2.ª pasada; en la 1.ª, el redondeo de Premiere cortaba la cola de «presente.» y «por»: se alargaron 6 salidas sobre silencio medido).
- `prueba-corte.py` sobre la exportación: 155/156 palabras, 4 diferencias de pronunciación/transcriptor (sesiones→«suscesiones», «entra cada»→«tracada», puede→«poder», comentar→«comenta»). Ninguna palabra perdida ni sobrante.
- Chasquidos en las 15 uniones: OK (salto de muestra muy por debajo del de la voz alrededor).
- Sonoridad: −13,1 LUFS, LRA 2,8, pico −3,0 dBTP. Desfase audio/imagen: −20 ms constante en todas las tomas (retardo del AAC al decodificar), menor que un fotograma.
- Fotogramas: hoja de 16 (una por toma) + primero/último mirados: imagen correcta, sin negros ni quemados; mismo encuadre → saltos de plano visibles en cada unión (esperado en el corte; zooms/variación = etapa 3).
- NO VERIFICADO: naturalidad de las uniones al oído, ritmo percibido.

## 2026-11-09 · 8C corrección v1 → v2 (fallo de selección de tomas) · sesión `32e764ad-9233-4a26-8327-dd9a059ca3f4`
Detectado por el usuario: en v1 se oye a alguien leyendo el guion en lugar de Amin. Cuenta como producción en 8C.

### Diagnóstico (con las herramientas existentes; sin modelos de voz nuevos)
- **Quién habla:** se cruzaron dos medidas por palabra. (1) Nivel en el bruto: Amin −34/−42 dB y lector −47/−55 dB. (2) Movimiento de la boca de Amin en la imagen (diferencia entre fotogramas a 30 fps en la zona de la boca): Amin hablando 1,9–6, lector 0,3–0,7. Se confirmó con tiras de fotogramas (`qc-v2/tiras.png`).
- **El lector:** una voz fuera de cámara (probablemente Javi; no identificado por la voz) que dicta cada línea antes de que Amin la repita. Funciona como apuntador.
- **Lecturas del lector en el tramo:**
  - 1017,9 «Si quieres ganar mucho dinero…» (la «1.ª toma» del gancho);
  - 1031,4 «El dinero que ganas con tu tiempo»;
  - 1043,2 «un entrenador, sesiones en el gimnasio»;
  - 1057,4 «Dos. El dinero que ganas sin estar presente»;
  - 1066,5 «Lo que vendes por internet…»;
  - 1077,0 «Tres. El dinero que entra en cada mes aunque no hagas nada nuevo»;
  - 1088,0 «Gente que te paga todos los meses».
  - Las instrucciones de 1008–1017 eran del equipo.
- **En v1 había dos:**
  - toma 3, 5,005–6,874 s (bruto 1031,23–1033,10): «El dinero que ganas con tu tiempo»;
  - toma 7, 11,845–12,312 s (1057,22–1057,69): «Dos.».
- **Por qué entraron:**
  - WhisperX etiqueta al lector como «voz principal», y se eligió por texto y nivel sin comprobar quién hablaba.
  - Las lecturas bajas se trataron como «1.ª toma, voz baja» de Amin.
  - «El dinero que ganas con tu tiempo» solo existe una vez y se dio por buena.
  - «Dos.» se prefirió a «Número dos.» por coherencia con «Uno./Tres.».
- **Amin no pronuncia «El dinero que ganas con tu tiempo» en ningún momento del bruto.** Se buscó «tiempo» en toda la transcripción: solo aparece en frases de otros guiones (1202, 1210, 1219, 1239), con otro sentido.
- **Bordes revisados y descartados como voz ajena:**
  - «En» 1040,10: cola continua de «cobras»; silencio desde 1040,20.
  - «cosa.» 1069,6 y «nuevo.» 1081,9: etiquetas de WhisperX sobre silencio de −85 dB.

### v2
| v1 | Audio incorrecto | Reemplazo | Motivo |
|---|---|---|---|
| 5,00–6,87 | Lector: «El dinero que ganas con tu tiempo» | Ninguno (se quita; queda «Uno. Si no trabajas, no cobras.») | Amin no la dice en el bruto. Pendiente de aprobación. |
| 11,85–12,31 | Lector: «Dos.» | Amin: «Número dos.» (bruto 1842,174–1842,841 = tramo 1056,52–1057,19) | Su boca se mueve, −34/−38 dB; termina en silencio antes de que lea el lector (1057,30) |
- Secuencia clonada con `clonar-secuencia.jsx`. V1/A1 rehechas solo en v2 (15 tomas; tramos en `qc-v2/tramos_v2.json`). Volumen + Limitador reaplicados con los valores de la Secuencia 03. 19 marcadores recolocados (tipo 1 −1,869 s; a partir del tipo 2 −1,668 s; nota en G1).
- QC:
  - `cortes-voz`: sin palabras cortadas ni repeticiones.
  - `prueba-corte` sobre la exportación: 150 palabras esperadas y 151 oídas. La de más es «sus» («sesiones» pronunciado «sucesiones», ya pasaba en v1). Hay 4 cambios del transcriptor: trae, poder, comenta, clasera.
  - Chasquidos: el mayor salto en una unión es 0,04 veces el de la voz.
  - Nivel de voz entre tomas: diferencia máxima de ±2,3 dB.
  - Sonoridad: −13,0 LUFS, LRA 2,5, pico −3,1 dB.
  - Hoja `qc-v2/hoja_v2.png` mirada: Amin habla en las 15 tomas.
- NO VERIFICADO (oído humano): naturalidad de las uniones, sobre todo «Uno. → Si no trabajas» y el cambio a «Número dos». También si el tipo 1 se entiende sin su definición.

### 09-11 · Decisión del usuario sobre el tipo 1 y v2
- Se aprueba eliminar las dos intervenciones del lector.
- «El dinero que ganas con tu tiempo» no se regraba y no lleva voz del lector ni voz artificial. El audio queda: «Uno. Si no trabajas, no cobras.»
- La definición pasa al gráfico 1 como título DINERO POR TU TIEMPO (tiempo ↔ dinero), que no es transcripción literal. Está en BRIEF § 14.10 y se construye en la etapa 3.
- El corte v2 aún no está aprobado: falta que el usuario escuche las uniones y el ritmo. La etapa 3 sigue bloqueada. No se ha tocado Premiere ni ninguna versión.
- El fallo de selección de hablante cuenta como corrección de producción de 8C, dentro de las métricas de consumo (corrección v2: 40 llamadas, 6,00 M, 2,92 USD).

## 2026-11-09 · 8C etapa 3 (propuesta completa) · sesión `32e764ad-9233-4a26-8327-dd9a059ca3f4`
- **Punto de partida:** el corte v2 con tu recorte (−0,334 s entre «otra cosa.» y «Como cocinar», hecho por ti en v2). La propuesta se clonó de ese estado.
- **J/L:**
  - La prueba por script confirmó que el audio se puede mover aparte de la imagen.
  - Con una sola cámara, un J/L con voz y Amin en pantalla desincroniza los labios, así que solo se usaron bajo gráficos:
    - **J1 · 7,174 → 7,39:** el «Te…» de la toma 4 empieza bajo G1; la imagen de Amin vuelve en «pongo», ya sincronizada. El ejemplo arranca mientras la idea sigue en pantalla.
    - **J2 · 20,988 → 21,31:** «…todos los meses por | algo» une dos tomas a mitad de frase; G3 tapa esa unión y la de 19,486. Amin vuelve en «algo».
    - **Puente visual · G1 desde 4,505:** tapa las uniones gancho → «Uno.» → «Si no trabajas», sin solapar audio.
  - **Cortes directos:** las demás uniones con Amin en pantalla. En 6 de ellas hay reencuadre fijo al 115 % (sin animar), para que el salto se lea como un cambio de plano: 8,61 · 10,64 · 15,32 · 16,35 · 27,39 · 34,17.
  - **Comparación con 6887-08:** allí tus J/L eran micro-solapes de 1–3 f en silencio y recorte de pausas. Aquí los cortes ya caen en silencio medido y sin chasquidos, así que no se añadieron solapes técnicos. Se respetó tu único recorte de pausa.
- **Gráficos (HyperFrames, animaciones de casa, render ProRes 4444):**
  - v1 azul → v2 (márgenes y sartén) → **v3 amarillo**, tras la indicación del usuario a mitad de etapa («ahora usamos el amarillo como Jordan Belfort»).
  - Fallos corregidos al mirar las hojas: las monedas de G1 aparecían antes de tiempo; el icono de ciclo de G3 parecía una «Q»; el «2», el «3» y el CTA invadían el margen superior; la respuesta del CTA rozaba el pelo.
- **Subtítulos:**
  - Primero se colocaron con v12 y después se cambiaron a Jordan v4: 50 líneas de nivel 1 (6 con amarillo fijo) y 3 énfasis («3 TIPOS DE INGRESOS», «CADA MES», «NEGOCIO DEL MUNDO»).
  - Fallos corregidos al mirar las hojas: dos énfasis largos se salían del encuadre y las líneas de más de 20 caracteres tocaban los bordes; se partieron en dos según los tiempos de las palabras.
- **SFX (CC0):** whoosh_04 (G1, −20 dB), snap (el «2», −14), whoosh_02 (G3, −14) y send (PLAN, −14). Licencias en `sonido/LICENCIAS.txt`.
- **Música:**
  - Las de tu carpeta no tienen licencia comercial verificable (YouTube Audio Library).
  - En Pixabay se descartaron 8 pistas con «Content ID Registered».
  - Elegida «Minimal Deep House» (soundoffreedom), sin Content ID, descargada con tu permiso (6,5 MB).
  - Entra en el segundo 19,59 de la pista, para que su bajada (47,0 s) caiga en la moraleja. A −25 dB, con fundidos de 0,4 y 0,6 s.
- **QC (OK / NO VERIFICADO):**
  - Duración: 42,71 s.
  - Sonoridad: −13,0 LUFS en las dos versiones; pico −2,6 dBFS con música y −2,9 sin ella.
  - Música por debajo de la voz: 18–19 dB en el gancho y los tipos; 23 dB en la moraleja y el CTA.
  - `cortes-voz`: limpio.
  - Retranscripción de la versión con música: 150/151 palabras, con las dudas de pronunciación ya conocidas.
  - Hojas mirada (22 fotogramas): sin choques entre subtítulos, gráficos y cara, todo dentro del encuadre.
  - NO VERIFICADO: escucha, movimiento a velocidad real y naturalidad de los J-cuts.
