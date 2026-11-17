---
tipo: estilo
estado: probado
licencia: implementación propia (números tomados de la documentación de video-editor)
uso: opción
---
# Vocabulario de animación de la casa

Cómo se mueve cada tipo de cosa. La idea central: **el movimiento significa algo**. Una palabra que llega y un objeto que aparece son sucesos distintos, así que se mueven distinto.

![[ejemplos/casa-animaciones-amin (render propio).png]]

## Las piezas
| Nombre | Para qué | Números |
|---|---|---|
| **riseIn** | Texto, tarjetas, paneles (todo lo que es "superficie" o palabra) | Sube 22 px (proporcional al tamaño: una línea de 122 px sube 30), 0,55 s, `power3.out`. La opacidad **corta** a 1; no hay fundido |
| **riseOut** | La salida de casi todo | Sube 18 px y se desvanece en 0,35 s, `power2.in` |
| **pop** | Objetos sueltos: icono, emoji, chapa, nodo | 0,90 → 1,10 en 3 fotogramas `power2.out` y 1,00 en el 4.º. El golpe es la vuelta, no el crecimiento |
| **slam** | Sello pesado: una cifra, un veredicto. Usar poco | 1,16 → 1,00 en 7 fotogramas `power2.out` |
| **drawOn** | Flechas, subrayados, círculos | El trazo se dibuja (`stroke-dashoffset`), unos 0,45 s |
| **float** | Vida en reposo | Deriva muy lenta de pocos píxeles; **nunca rotación animada** |

## Reglas
- **El texto nunca hace pop**, sube. Los objetos hacen pop.
- **Cambio en el mismo hueco = en secuencia:** la salida termina (0,35 s) antes de que empiece la entrada siguiente. Si la nueva tiene que caer en una palabra, la salida empieza 0,35 s antes.
- **El pop pasa un 10 % de tamaño durante 3 fotogramas** (el slam, un 16 %): hay que dejarle sitio o crecer hacia el lado libre.
- **Cada cambio cae en su palabra:** unos 1,5 fotogramas antes de que se diga, con una tolerancia de unos 2 fotogramas.
- **Variar por función, no por cantidad:** dos cosas distintas se mueven distinto; dos iguales, igual.
- **Opción "12 fps":** los gráficos inventados se animan a saltos de 12 fps con un poco de brillo y grano (aspecto diseñado); las capturas reales van fluidas. Solo si encaja con el vídeo.

## Cómo se hace aquí
- **HyperFrames:** `~/Videos-Remotion/hyperframes/animaciones-casa.js` (`casa.riseIn(tl, el, t)`, `casa.pop(...)`…). Ejemplo con la marca de Amin: `hyperframes/ejemplo-amin/`.
- **Render para Premiere:** `hyperframes/render-para-premiere.sh <carpeta> <salida.mov>` (transparencia que Premiere sí lee).
- **Control:** `herramientas/qc/qc-zona-segura.py <salida.mov>`.

**Estado:** ✅ probado el 06-11-2026: render de 4 s en ~11 s, importado en Premiere con alfa correcto y control de zona segura limpio.
