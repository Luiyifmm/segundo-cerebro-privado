# Fase 5: informe (07-11-2026): entrenamiento creativo profundo + dirección creativa colaborativa

**Versión 2 del informe.** Incluye la actualización «Dirección creativa colaborativa» y tu nota de 6/10 a IMG_6124.

**Lo que no he hecho:**
- No he tocado tus proyectos originales de Premiere ni de After Effects.
- No he sobrescrito exportaciones ni materiales.
- No he instalado nada.
- Todo lo nuevo está en `3 PROYECTOS/_PRUEBAS CLAUDE/` (fase5-ejercicios, entrenamiento-6118, estudio-invisible).

## 0. Cambio de método: dirección creativa antes de montar
**Tu valoración, registrada:**
- IMG_6124: **6/10**. Debilidad principal: calidad creativa general (narrativa, ritmo, diseño, motion graphics, sonido y criterio).
- Corrección prioritaria: **definir juntos la intención y el mensaje antes de editar.**
- Mi autoevaluación era 16/25 (≈ 6,4/10): no me sobrevaloré, pero tampoco vi a tiempo lo que faltaba.
- Está en `EVALUACIÓN DE EDICIONES.md` y en el `REGISTRO DE CORRECCIONES.md`.

**Regla de flujo nueva (general, no exclusiva de Amin)**, escrita en el director (`~/.claude/CLAUDE.md`, paso 2), en «Lecciones generales» y en la skill `direccion-viral`.

Con un vídeo nuevo que pida decisiones creativas:
1. Analizo el contenido y el contexto.
2. Te presento una **propuesta breve**:
   - qué quiere decir el vídeo y qué debe sentir o pensar el espectador;
   - el gancho y por qué;
   - qué quitaría y qué reforzaría visualmente;
   - el estilo;
   - dónde dejar respirar el vídeo.
3. Te hago **de 2 a 4 preguntas concretas**, nunca algo que pueda deducir del material o de lo ya confirmado.
4. **Espero tu aprobación.** No monto nada antes.
5. Guardo las decisiones en el **BRIEF CREATIVO** y solo entonces monto.
6. Al terminar, evalúo **cuánto se acerca el resultado al mensaje acordado**, además del QC.

- **Excepciones:** correcciones técnicas puntuales, decisiones ya aprobadas o cuando me digas «ejecútalo directamente».
- **Criterio nuevo:** cada gráfico, imagen, zoom o SFX necesita una función (explicar, contrastar, emocionar, reforzar una afirmación, recuperar la atención o conectar dos partes). Si no la tiene, no entra.
- **Una lección vieja que chocaba** («montar entera la propuesta sin preguntar a medias») queda subordinada: se aplica **después** de aprobar el brief.

**BRIEF CREATIVO:**
- Plantilla en `7 TRABAJOS EN CURSO/_PLANTILLA BRIEF CREATIVO.md`, con los 14 apartados que pediste.
- Cada línea va marcada como *propuesta de Claude*, *APROBADO por ti (fecha)* o *pendiente*. Nada pasa a aprobado sin tu confirmación.
- `reel.js nuevo` crea ya, junto al ESTADO, su `<ID> · BRIEF.md` enlazado. Probado en una bóveda temporal, sin tocar el registro de reels ni el panel.

**Lo que esto cambia de las rondas anteriores:** en 6124 y 6118 monté directamente desde el guion. Con el método nuevo, varias de mis peores decisiones se habrían discutido antes de montar:
- conservar puntos débiles («Atento», dos costes, la «socia»);
- iconos dibujados frente a imágenes literales;
- el impacto sin función clara en «proyectas».

## 1. WhisperX, integrado
- **Entrada única: `voz/transcribir.sh <archivo>`**. Ejecuta WhisperX (entorno aislado) y después siempre el verificador contra el audio fuente.
  - La alternativa de antes sigue disponible: `transcribir.sh --respaldo`.
  - Actualizados: director, skills `subtitulos` y `direccion-viral`, `CLAUDE.md` del taller y LEEME del QC.
- **Límite encontrado:** el verificador **no se puede calibrar en vídeos terminados con música** (código 2). Sirve para brutos, que es lo que se usa para cortar y sincronizar.
- MediaPipe sigue experimental.

## 2. Estudio «Invisible – Marco Said»
- **Análisis con medidas separadas de interpretaciones:** `4 ENTRENAMIENTO/ESTUDIO Invisible (Marco Said) — análisis.md`.
- **Ficha:** `8 BIBLIOTECA DE ESTILOS/08 Invisible (Marco Said).md`.
- **Cómo se leyó:** el AEP estaba **abierto en tu After Effects con cambios sin guardar** (no míos). Lo leí solo por script, sin guardar, cerrar ni descartar.
  - Hay una copia verificada en `estudio-invisible/copia/`.
  - Revisé las expresiones antes de nada: una de terceros está ofuscada, pero no accede al sistema.
- **Lo esencial medido:**
  - un efecto fuerte, una vez: entrada de 1,46 s; impacto de ≈ 1,5 s con subida de 0,29 s y bajada de 0,5–0,8 s;
  - escalonado de 2 f; destello de 4 f; curvas exponenciales;
  - acercamiento continuo de 1,7 %/s;
  - el subtítulo baja un 8,3 % cuando entra un gráfico;
  - **el gráfico demuestra lo que dice la voz**;
  - en Marco, B-roll literal en las enumeraciones y plano limpio en el argumento.
- **No analizable:** el render exacto con Sapphire y BCC (no instalados), un efecto desconocido y el sonido escuchado (solo medido).
- **Encaja con el método nuevo:** el estudio enseña sobre todo **cuándo NO poner nada**.

## 3. Tres ejercicios dentro de una edición
`4 ENTRENAMIENTO/EJERCICIOS FASE 5 (técnicas Invisible).md` · render `fase5-ejercicios/Ejercicios fase 5 v1.1.mp4` (21,4 s).
- **E1, tarjetas (HyperFrames):** técnicamente correcto; los números solos aportan poco. 3/5.
  - **Función:** estructurar la lista. Era débil, y con el criterio nuevo lo habría cuestionado antes.
- **E2, impacto (receta nueva de Premiere `impacto.jsx`):** reutilizable y editable por ti. 4/5.
  - **Función:** reforzar una afirmación. Como mucho una vez por vídeo.
- **E3, título detrás de Amin (recorte + HyperFrames):** la mano pasa por delante de las letras. 3,5/5.
  - **Función:** gancho y profundidad.
- **Fallos míos corregidos:**
  - desenfoque excesivo;
  - subtítulos al doble de tamaño en 1080;
  - el recorte tapaba el título. **Corregí la herramienta** `fondo/recortar.js`.
- **Sin corregir:** la cola de «gasta» (≈ 50 ms) y el efecto de impacto ≈ 90 ms tarde.
- **Límite:** los ejercicios se hicieron antes del método nuevo, sin brief.

## 4. Fase 4: P1–P9
- No se ha convertido ninguna en regla.
- **P3 (rojo) y P4 (subtítulo pequeño)** son **variantes visuales pendientes**: no cambian la identidad de Amin sin tu autorización.
- En `PROPUESTAS DE REGLAS.md` cada propuesta indica si es de **marca** o de **criterio**.
- La única regla nueva aprobada es la de **flujo** de la sección 0, porque la pediste tú expresamente.

## 5 y 6. Segunda ronda: IMG_6118 («Mujer para una noche»)
`7 TRABAJOS EN CURSO/ENTRENAMIENTO IMG_6118 … ronda 2.md` · render `entrenamiento-6118/propuesta Claude 6118 v1.2.mp4`.
- **Por qué 6118:** hoy a las 10:40 los brutos pasaron a Drive (`RAW/CORTOS/Octubre/`) y casi todas tus exportaciones salieron de `EXPORTADOS`. Solo quedan en local las de 6118 y 6124.
  - Correspondencia por contenido: 81 % frente a ≤ 4 %.
  - **Aviso:** en octubre ya analicé tu 6118, así que hay algo de contaminación.
- **Proceso (anterior al método nuevo):** plan escrito, edición sin mirar tu versión y QC.
  - QC: −16,2 LUFS, sin recortes, cara libre, 0 palabras cortadas, 3 uniones para escuchar.
- **Comparación:**
  - **Igual:** las mismas tomas en **11/12** bloques, la misma estructura e imágenes alternas en cada «esta».
  - **Tú, mejor:**
    - quitaste un bloque redundante;
    - **una pareja de imágenes nueva y literal por frase**;
    - **fondo cambiado detrás de Amin** en la moraleja;
    - subtítulos palabra a palabra y tipografía apilada grande;
    - viñeta de color y música.
  - **Yo, de sobra:** el impacto y el bloque de la socia.
  - **Choque con la ficha:** pones lo malo a la izquierda, y la regla 8 dice lo contrario.
- **Las 4 preguntas que te habría hecho con el método nuevo, antes de montar:**
  1. ¿Cuál es la emoción: provocación o lección? (Decide entre imágenes provocativas o elegantes.)
  2. ¿Quitamos la «socia», que repite «prosperar»?
  3. ¿Imagen literal por frase o dos personajes fijos?
  4. ¿La moraleja limpia o con cambio de fondo?

  Tu edición contesta tres de ellas de forma distinta a como yo decidí solo.

## 7. ¿Ha mejorado el criterio?
| | Ronda 1 (6124) | Ronda 2 (6118) |
|---|---|---|
| Tomas iguales a las tuyas | 9/11 (82 %) | 11/12 (92 %) |
| Duración frente a la tuya | −4 % | **+15 %** (me sobró un bloque) |
| Imágenes | Iconos dibujados (tú: reales) | Reales (tú: reales y una por frase) |
| Recursos que sobraron | Espejo, overlay, iconos | El impacto |
| Mi nota | 16/25 (≈ 6,4/10) | 17/25 (≈ 6,8/10) |
| **Tu nota** | **6/10** | (pendiente) |
| Mis vueltas antes de enseñarlo | 2 | 4 |
| Tiempo | ~25 min | ~45 min |

**Conclusión:** la mejora es **pequeña y no concluyente**.
- **Mejor:** elección de tomas e imágenes reales.
- **Igual de mal:** recortar contenido, la moraleja y decidir solo lo que debía discutirse.
- **No es comparable del todo:** 6118 es más fácil y estaba algo contaminado.
- Tu 6/10 confirma que el problema no es técnico, sino de **intención**. Por eso la prueba que cuenta es la ronda 3 con el método nuevo.

## 8. Propuesta concreta para la fase 6
1. **Ronda 3 con el método nuevo** (lo que pides en la sección 6 de tu actualización), con un vídeo que no haya visto (necesito una exportación tuya: rico/pobre 6122 o vulgaridad 6126; los brutos están en Drive):
   1. analizo el bruto;
   2. te presento la propuesta de dirección creativa y de 2 a 4 preguntas;
   3. espero tus respuestas;
   4. relleno el BRIEF;
   5. monto lo aprobado;
   6. evalúo la distancia al mensaje acordado y a tu edición.
   - **Métricas:** tu nota sobre 10, número de cambios que pidas, tiempo y cuánto del brief se cumplió.
2. **Cuatro decisiones de marca** que bloquean el estilo de Amin (las resolvemos en esa misma conversación):
   - (a) lado de lo malo y lo bueno (regla 8);
   - (b) subtítulo: v12, palabra a palabra o apilado en la moraleja;
   - (c) rojo para lo negativo;
   - (d) formato de imagen.
3. **Receta «fondo detrás de Amin»** en Premiere (recorte + imagen), solo si la aprobamos en el brief de la ronda 3.
4. **Imágenes por frase:** hoja de 3 candidatas por frase para elegir en la conversación de dirección.
5. **Escucha:** las 4 uniones marcadas (2 en ejercicios, 2 en 6118).

## Archivos nuevos o modificados
- **Taller (`~/Videos-Remotion`, git):**
  - `voz/transcribir.sh`, `fondo/recortar.js`;
  - `sistema/reel.js` (BRIEF junto al ESTADO);
  - `premiere/recetas/impacto.jsx`, `exportar.jsx`, `voz-nivelar.jsx`, `LEEME.md`;
  - `herramientas/ae-estudio/`;
  - tres composiciones de HyperFrames;
  - fuentes de los ejercicios y de 6118;
  - `CLAUDE.md`, `herramientas/qc/LEEME.md`.
- **`~/.claude` (git):** `CLAUDE.md` (paso de dirección creativa), skills `subtitulos` y `direccion-viral`, memoria.
- **Bóveda (git):**
  - este informe;
  - `_PLANTILLA BRIEF CREATIVO.md` y `_PLANTILLA ESTADO.md`;
  - análisis, ejercicios, ficha 08 e índice de la biblioteca;
  - evaluación (con tu 6/10), propuestas, REGISTRO y Lecciones generales;
  - ESTADO de 6118.
- **Fuera de git:** proyectos de prueba, renders e imágenes de Pinterest (con su origen anotado).
