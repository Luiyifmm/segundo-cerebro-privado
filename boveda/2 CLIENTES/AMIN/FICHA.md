---
tipo: ficha-cliente
cliente: amin
instagram: "@aminbusinesss"
estado: activo (único cliente activo)
actualizado: 2026-11-08
---
# AMIN · ficha operativa

Marca personal: negocios y masculinidad. Vídeo vertical 9:16 (2160×3840), busto sentado hablando a cámara.

> **Cómo se usa esta ficha:**
> - **Reglas vigentes** = lo que se aplica en todos sus vídeos.
> - **Pendiente** = no se aplica como norma.
> - Las decisiones de un solo vídeo van en su ESTADO (`7 TRABAJOS EN CURSO/`), no aquí.
> - Una regla solo entra aquí cuando el usuario la aprueba (ver `4 ENTRENAMIENTO/PROPUESTAS DE REGLAS.md`).

## Reglas vigentes
1. **Nada tapa la cara.** La cifra en pantalla = la que dice la voz. La música, solo si él la elige.
2. **Identidad: natural y elegante, sin sobrecarga dopamínica** (decidido con Amin, 10-10). Pocos efectos, pocos sonidos, motion graphics solo donde aclaren una idea.
   - **Aclaración (08-11, aprobada por el usuario):** es la identidad general, no un estilo único. No obliga a que todos sus vídeos sean minimalistas ni a usar siempre las mismas animaciones, colores o composiciones.
   - Cada vídeo recibe su dirección creativa según: formato narrativo, mensaje y objetivo, referencias concretas, paleta del material, ritmo y emoción buscados, y lo que se apruebe en su BRIEF CREATIVO.
   - Otro lenguaje visual (amarillo, rojo, zooms, otro tratamiento) vale si tiene justificación y el usuario lo aprueba en ese BRIEF.
3. **Azul #1E8BFF** (30,138,255) como color de acento **predeterminado**. Oficial provisional (06-11). Referencia por defecto, no restricción: ver la aclaración de la regla 2.
4. **Letra:** SF Pro, más una segunda fuente para dar dinamismo (Nyght Serif Italic) en los motion graphics.
5. **Subtítulos editables en Premiere, nunca renderizados:**
   - plantilla **predeterminada** `Subtitulo Amin v12.mogrt` (la estética de siempre de la v10). Otra plantilla (p. ej. `Subtitulo Jordan v4`) solo si lo aprueba el BRIEF de ese vídeo;
   - el texto de los subtítulos sale del audio grabado y verificado, no del guion (ver «Transcripción»);
   - línea blanca + palabra clave en azul unas 2,4× más grande, como bloque compacto alineado a la izquierda, sobre el pecho;
   - sombra negra 100/38/16 y **sin halo blanco** (glow 0);
   - animación mínima y fácil de editar;
   - clips estirables con el ratón (recortar con `end` y `outPoint`).
6. **Muletillas y arranques repetidos, fuera** ("pera", "espérate", frases dichas dos veces).
7. **Imágenes que retengan:** conceptuales o satíricas (Pinterest), no stock neutro.
8. **Comparativas:** lo malo a la derecha y lo bueno a la izquierda.
9. **Motion graphics con acción y desenlace** (golpear, romper cadenas), mejor que un símbolo que aparece sin más.
10. **Velocidad:** si se acelera, la voz, la imagen y los efectos van en clips separados.

## Alcance (según el proyecto)
- **Edición completa** (desde el 30-10), o terminar lo que el usuario empezó.
- **Solo marcadores:**
  - bruto ENTERO, sin cortar nada;
  - marcadores CON DURACIÓN, uno por idea:
    - "IMAGEN derecha/izquierda: …" en rojo;
    - "MOTION GRAPHIC: …" y "CIERRE: seguir @aminbusinesss" en naranja;
  - la idea va en el comentario;
  - se marca la última toma de cada idea, con el número de tomas.
  - Nada de marcadores por frase ni con emojis.
- **Trials y vtrials:** edición libre (catálogo de 20 formatos). El vtrial aprobado es el original editado dentro de una tarjeta con retícula, con una pregunta arriba en AMARILLO (el amarillo solo vale ahí).

## Valores técnicos
- **Subtítulos v12:** Tamano 67,89 · y 0,4375 con clave / 0,466 sin clave · sombra 100/38/16 · azul 30,138,255.
- **Zona segura** (1080×1920): x 70–1010, y 250–1620. A 4K, ×2.
- **Brutos:** puerta de ruido y una voz de apuntador baja. Silencio a −58 dB; voz con pico ≥ −50 dB. Su voz llega a unos −29 LUFS: nivelarla a −16 en un WAV aparte.
- **Transcripción (aclarada el 08-11, aprobada por el usuario):**
  - **Guion (Google Doc):** referencia narrativa y de contenido.
  - **Audio grabado, una vez verificado:** decide lo que dicen los subtítulos finales.
  - **WhisperX** (`~/Videos-Remotion/voz/transcribir.sh`): localiza palabras y tiempos. Revisar sus errores de reconocimiento y las diferencias con el audio.
  - No copiar el guion en los subtítulos si Amin dice otra cosa. Si una diferencia cambia el sentido del mensaje, señalarla para revisión.
  - Histórico (antes del 08-11): «falla mucho con sus brutos; usar el guion». Se sustituye por lo anterior.
- **Proxies** siempre: `~/EDICION/3 PROYECTOS/Proxies/`.

## Estilos aprobados
| Estilo | Para qué | Dónde |
|---|---|---|
| S Project (elegante, minimalista) | Aspecto general | memoria `estilo-objetivo-sproject` |
| Motion graphics estilo @julianealborna ("mejoraron mucho", 10-10) | Gráficos a pantalla completa | skill `edicion-video` › `criterio.md` |
| Collage editorial (papel, recortes en blanco y negro, círculo azul) | Gráficos a pantalla completa | memoria `estilo-collage-motion-graphics` |
| Emojis + flecha + texto con brillo | Gráficos rápidos (sigue siendo válido) | — |
| Recetas premium `cine` / `clave` / `profundidad` | Sistema de Amin (worker) | skill `edicion-premium` |
| Biblioteca de estilos (opciones aún no aprobadas para Amin) | Probar | [[8 BIBLIOTECA DE ESTILOS/00 Índice]] |

## Referencias
- Vídeo de ejemplo editado por el usuario: "Mujer para una noche" (IMG_6118).
- Análisis de su estilo: `1 REFERENCIAS/Analizadas por Claude/2026-10-30 estilo Amin/LEEME.md`.
- Referencias premium: `1 REFERENCIAS/Analizadas por Claude/2026-10-30 premium/`.
- Catálogo de formatos para Trials: carpeta "Catálogo de formatos trial" (aquí al lado).

## Correcciones confirmadas (fecha → regla)
| Fecha | Regla |
|---|---|
| 09-10 | Subtítulos sencillos, editables y con animación mínima |
| 09-10 | Clave en SF Pro azul, ~2,4×, bloque compacto a la izquierda |
| 10-10 | Sin halo blanco en las claves: sombra negra 100/38/16 |
| 10-10 | Subtítulos con la estética de siempre (no letra fina) |
| 10-10 | Imágenes de Pinterest que retengan, no stock |
| 10-10 | Motion graphics con acción y desenlace |
| 10-10 | Natural y elegante, sin sobrecarga |
| 11-10 | Marcadores con duración, solo IMAGEN / MOTION GRAPHIC / CIERRE |
| 12-10 | Acelerar sin mezclar voz y efectos en un clip |
| 12-10 | Vtrial: original + retícula + pregunta en amarillo |
| 30-10 | Quitar muletillas y arranques repetidos; SF Pro + una segunda fuente |
| 08-11 | Identidad general ≠ estilo único: dirección según formato y BRIEF; v12 y azul son predeterminados |
| 08-11 | Guion = referencia; subtítulos = audio verificado; WhisperX para tiempos, revisando errores |

Detalle y origen: `4 ENTRENAMIENTO/REGISTRO DE CORRECCIONES.md` y la memoria de Claude (`como-editar-para-el-usuario`, `reparto-de-trabajo-por-cliente`).

## Pendiente de confirmar (no aplicar como norma)
- **Cian 0,250,255** en las palabras resaltadas (lo usó el usuario en IMG_6887). Si un vídeo ya lo lleva, seguir ese vídeo.
- **Color de la palabra clave en el sistema automático de Amin:** la corrección del 30-10 para el worker dice Nyght cursiva en rojo u oro; en Premiere la clave va en SF Pro azul. ¿Son dos contextos distintos o hay que unificar?
- **Insertos a pantalla completa cada 8–12 s** y título grande cuando se dice un número (anotado el 30-10 como "falta", sin confirmar como regla).

## Historial
- Versión anterior de esta ficha: en git (`git log -- "2 CLIENTES/AMIN/FICHA.md"`).
- Decisiones de cada vídeo: `7 TRABAJOS EN CURSO/`.
