# Director creativo (árbitro) para los alumnos de Trainer10x · PROPUESTA (14-11)

Estado: **PROPUESTA, sin aprobar.** No hay nada montado.

## Qué hay hoy
- **Editor** (`luis/editor.md`): elige tomas, palabras clave, zooms, rótulo del gancho, tarjetas y efectos.
  - No piensa el vídeo entero: no tiene un mensaje ni una emoción objetivo.
- **Revisor** (`luis/revisor.md`): solo caza fallos sueltos:
  - la cara tapada;
  - una cifra mal;
  - faltas;
  - demasiadas claves;
  - el audio.

  No juzga si el vídeo se entiende, si tiene ritmo o si le faltan elementos.
- **Elementos que la plantilla sabe hacer:**
  - subtítulos con palabra clave;
  - rótulos;
  - tarjetas;
  - zooms;
  - efectos;
  - música.
  - **Comparación malo/bueno:** la plantilla ya la tiene, pero el motor nunca la usa.
- **Elementos que la plantilla no tiene:** lista por pasos, contador de cifras, flechas o señalar.

## Propuesta en 3 fases (se aprueban una a una)

### Fase 1 · Director antes de editar (`luis/director.md`)
Lee el guion, la transcripción y la marca del alumno. Escribe un brief corto que luego sigue el editor:
- qué quiere decir el vídeo y qué debe sentir quien lo ve;
- el gancho elegido y por qué;
- estructura: gancho → historia → moraleja → CTA, con lo que sobra;
- **qué elemento explica cada idea y dónde:** comparación, cifra, tarjeta, zoom o pausa. Cada elemento lleva su motivo; si no tiene motivo, no entra (la regla de Luis);
- **revisión del guion:** si lo grabado cumple el guion, qué falta y qué sobra. Se avisa al alumno en la respuesta.

Coste: 1 llamada de IA más por vídeo (≈ 0,2-0,4 $ y 1-2 min).

### Fase 2 · Árbitro después del render (sustituye al revisor)
Lo mide el código:
- contraste de cada subtítulo y clave con su fondo (el caso de la clave roja sobre el pantalón fucsia);
- tamaño y tiempo en pantalla de cada palabra;
- tramos de más de 3-4 s sin cambio visual;
- volumen de la música bajo la voz.

Lo juzga el árbitro mirando una hoja de fotogramas densa, con una nota por apartado:
- se entiende;
- ritmo;
- elementos que pedía el brief;
- gancho;
- sonido;
- mensaje.

Si algo suspende, corrige y vuelve a renderizar (máximo 1-2 vueltas). Si sigue mal, lo deja en «revisar» con la nota explicada para Luis.

Coste: la revisión de ahora, más una segunda vuelta cuando haga falta.

### Fase 3 · Elementos nuevos en la plantilla
- conectar la **comparación malo/bueno**, que ya existe;
- **lista por pasos**, para vídeos tipo «6 pasos» como el de Kevin;
- **cifra o contador grande**, para kilos, minutos o porcentajes.

Coste: código nuevo en Remotion y pruebas, varias horas.

## Requisito previo
El Claude sin pantalla necesita el **token** (`claude setup-token`). Sin él no funciona ni el editor, ni el director, ni el árbitro.

## Decisiones de Luis (14-11)
- **Guiones:** se revisan al editar. Lo grabado se compara con el guion y se avisa al alumno en la respuesta.
- **Árbitro:** corrige y vuelve a renderizar hasta 2 veces. Si sigue mal, lo deja en «revisar» con una nota.
- **Elementos:** antes de añadir nada, buscar referencias y formatos del mismo tipo de vídeo.
- **Orden:** primero el director.

## Fase 1 · hecha en una copia del motor (no en el real ni en `main`)
- `luis/formatos.md`: fichas de los 7 formatos de los alumnos:
  - MITO vs REALIDAD;
  - LISTA / PASOS;
  - TRANSFORMACIÓN;
  - POV / SKETCH;
  - CONSEJO;
  - SIN VOZ;
  - EJERCICIO / TÉCNICA.

  Cada ficha dice estructura, elementos, ritmo y error típico. Salen del método de Luis, de los 40 vídeos reales y de guías de reels para entrenadores.
- `luis/director.md`: el director identifica el formato y escribe un brief. Contiene:
  - formato, mensaje y emoción;
  - gancho y estructura;
  - qué sobra;
  - qué elementos van, dónde y con qué función;
  - ritmo;
  - la revisión del guion y un aviso para el alumno.
- `trabajador.py`:
  - `dirigir()` se ejecuta antes de `decidir()` (solo con alumnos), y el editor recibe el brief;
  - el brief se guarda en `brief.json` y en `decisiones.json`;
  - el aviso sobre el guion se añade a la respuesta que ve el alumno.
- **Comprobado:** compila. Si el director falla, se sigue sin brief y el montaje no se rompe.
- **Sin probar:** la calidad del brief. Hace falta el token del Claude sin pantalla.

## Fase 1 · APROBADA y en `main` (14-11)
- PR #11 de edicion-motor, merge `95886b5`.
- **Token:** se guarda en `~/.config/claude-editor/claude-token` (permisos 600, 1 año, fuera de git). `trabajador.py` lo carga.
- **Probado** con 3 vídeos completos (Miguel Santos, Camilo, Kevin): unos 0,65 $ y 6-25 min por vídeo. Briefs correctos:
  - formato bien identificado;
  - revisión del guion útil (a Kevin le faltó grabar la historia y la moraleja).
- **Fallos vistos, para la fase 2:**
  - si el bruto ya viene editado (Kevin), los rótulos del director se pierden: hay que avisar al director antes;
  - las claves de dos palabras probablemente no se pintan;
  - en las tarjetas se pierde el «·».

## Luis no está satisfecho con los resultados (14-11) → los edita él en Premiere
- **Proyecto:** `3 PROYECTOS/Alumnos Trainer10x/ALUMNOS TRAINER10X - 14 NOV.prproj`. Lleva una secuencia por vídeo:
  - MIGUEL SANTOS · mochila de partido;
  - CAMILO ARIAS · sentadillas ciclista;
  - KEVIN PALACIOS · el lunes empiezo.
- **Qué lleva cada secuencia (lo que decidió el sistema):**
  - V1/A1: las tomas del montaje, con el zoom en Movimiento > Escala;
  - A2: efectos de sonido;
  - A3: música a −20 dB;
  - 3 pistas de subtítulos nativos (SRT): SUBTÍTULOS, PALABRAS CLAVE y RÓTULOS Y TARJETAS. Kevin solo lleva la de rótulos, porque su bruto ya trae subtítulos;
  - marcadores con el brief del director.
- **Foto «antes»:** `fotos/alumnos-t10x-{miguel,camilo,kevin}/antes-20261114-1048.json`.
- **Cuando Luis termine:**
  1. foto «despues» de cada secuencia;
  2. `aprender.py`;
  3. las correcciones van como propuestas PENDIENTES a `4 ENTRENAMIENTO/PROPUESTAS DE REGLAS.md`;
  4. con las que apruebe, se ajustan `director.md`, `formatos.md`, `editor.md` y las fichas.

## Siguiente
1. ~~Token y probar el director~~ Hecho.
2. Fase 2: el árbitro.
3. Fase 3: los elementos nuevos que pidan las referencias de cada formato.
