# Álvaro Cabrera · plan de reedición (15-11-2026)

**Estado:** plan escrito con el bruto ya visto (bruto en `MEDIA/Álvaro Cabrera/`), sin montar. Basado en la auditoría (`7 TRABAJOS EN CURSO/Alumnos Trainer10x · AUDITORÍA Álvaro Cabrera (15-11).md`). Abrir `plan.html`: elegir paleta y letras, corregir las casillas y «Copiar plan».
**Tiempos:** son los de la v1 del motor (16,1 s) y solo orientan; con las tomas nuevas cambiarán.

## Lo que se descubrió con el bruto (15-11, mirando fotogramas)
- **Una sola persona hace los dos personajes**, con la cámara fija en un trípode: el entrenador (camiseta negra, libreta) y el cliente (gorra y sudadera). Nunca salen juntos en una toma. Por eso el alumno pidió «poner unos vídeos sobre otros».
- **Cinco escenas**, una por día: mesa con baguette (lunes) · la misma mesa con un croissant (martes) · puerta de madera (miércoles) · sofá (jueves) · cocina y marco de puerta (remate).
- Bruto: 898 s (casi 15 min), vertical **1440×2560** HEVC **HLG** de iPhone; salida 1080×1920 → hay un 33 % de margen para zooms sin perder calidad.
- **El audio es muy bajo** (mediana −60 dB): la transcripción solo entiende unas 74 palabras de las que sirven. Las tomas se localizan por esas palabras y por la energía del audio, y hay que **verlas** para elegir.
- **Probado en fotogramas:** cliente a la izquierda + entrenador a la derecha con una unión vertical suave hacia el 60 % del ancho (`bruto/prueba composicion/composiciones.jpg`). En mesa y croissant sale limpio. **Ojo:** la utilería (baguette, croissant) cambia de sitio entre tomas; hay que elegir tomas donde coincida. En la puerta y el sofá los personajes se solapan más y puede hacer falta una máscara.
- **Esto corrige mi plan anterior** (entrenador arriba, cliente abajo): no es lo que pidió el alumno.

## Decisiones del plan (para aprobar o cambiar)
1. **Los dos personajes en el mismo cuadro** (superposición de dos tomas con unión vertical suave), no en dos mitades apiladas. Banco `c015` solo en espíritu: hay que añadir este recurso al banco cuando salga bien.
2. **Un elemento fijo arriba, la semana** (`c012`): LUN · MAR · MIÉ · JUE. Cada día se enciende al nombrarlo; los tres «nada de…» se tachan con ✕ rojo y el jueves queda con ✓ azul.
3. **Color de su marca (DECIDIDO por Luis el 15-11):** rojo #FF5F57 = lo prohibido; azul #3A86FF = la alternativa, incluida «manzana».
4. **Letras:** dos, SF Pro (relleno) y Sequel Heavy (la palabra marcada). El motor usó tres familias.
5. **Cada día es un cambio de escena con corte seco**, que ya hace de separador.
6. **Zoom fuerte** en «¿cómo me voy a poner?», sobre la cara del cliente (hasta 130 %).
7. **Sonido:** un golpe corto igual en cada «nada de…», pop al tachar y al marcar ✓, sonido de sala en los huecos, pop al entrar el botón «Seguir». **Música: la elige Luis** (la ficha apunta «1901»).
8. **Pintura de naturaleza muerta** (`c074`): solo 0,8 s sobre «chocolate». **Botón «Seguir → Siguiendo»** (`c075`) después del remate.

## Prueba de la superposición en las 4 escenas con dos personajes (15-11, un fotograma de cada)
Imágenes en `bruto/prueba composicion/` (`composiciones.jpg`, `puerta_y_sofa_final.jpg`). Se hace en Premiere con **dos pistas y una máscara estática** (la cámara no se mueve): la toma del entrenador en V1, la del cliente en V2 con máscara.
| Escena | Máscara de la capa del cliente | Resultado |
|---|---|---|
| Mesa (lunes, martes) | Visible a la izquierda de x ≈ 60 % | Limpio. Cuidar que el pan esté en el mismo sitio en las dos tomas |
| Puerta (miércoles) | Visible a la derecha de x ≈ 40 %, borde suave | Limpio; se intuye una franja clara en la unión |
| Sofá (jueves) | Solo la zona delantera (y > 52 %) más una caja alrededor de la gorra (x 14–50 %, y > 41 %); **la cortina y la pared salen de la toma del entrenador** | Limpio con esta máscara; con una unión vertical en x = 52 % se veía una cuña de luz en el techo y la cortina. Halo leve bajo el torso del entrenador |
| Sofá, luz | La toma del cliente es un 31 % más oscura (sol distinto): **exposición +0,4 EV** a su capa | Con eso las dos tomas casan |
| Cocina (remate) | No lleva superposición | — |
La máscara por diferencia con fondo vacío se descartó: deja agujeros en la cara y se come la ventana.

## Lo que sigue sin saberse
| Qué | Cómo se resuelve |
|---|---|
| La toma exacta de cada regla (hay muchas) | Verlas con hojas por rango; candidatas por línea en `plan.html` |
| Que la utilería (pan, croissant) coincida entre las dos tomas de una escena | Mirarlo al elegir |
| Quién dice «¿Pero qué haces?» | Ver la toma de 864–893 s |
| Que la unión no parpadee en movimiento (la luz entra por la ventana) | Reproducir; solo he mirado fotogramas sueltos |
| Que los personajes no se tapen en movimiento (brazos, libreta) | Reproducir cada escena |

## Cuando esté el bruto (una orden)
```bash
~/Videos-Remotion/sistema/preparar-clip.sh "<ruta del bruto>" --idioma es --salida "~/EDICION/3 PROYECTOS/Alumnos Trainer10x/PLANES/alvaro/bruto"
```
Da transcripción por palabra, hojas de fotogramas, silencios quitados y el plan con sus miniaturas reales. Después: elegir tomas, reencuadrar y montar en una copia (flujo de `editor-maestro`, pasos 5–8).

## Reparto
Persona en pantalla ≈ 91 %, inserto ≈ 9 %.  Es un sketch: el reparto del estilo «podcast minimal» no se aplica.
