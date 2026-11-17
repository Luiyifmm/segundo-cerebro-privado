---
name: minimal-corto
description: Editar clips cortos hablados (podcast, entrevista, busto; 25-55 s, 9:16) en el estilo «podcast minimal» de Dope Motions, el del vídeo de Joseph - mitad persona con texto sobre el pecho, mitad escenas diseñadas sobre fondo claro, un solo color de acento sacado del plano. Tiene las 16 reglas con números medidos en 10 referencias del usuario, las 5 variantes de letra, el catálogo de escenas, el mapa frase → escena y la auditoría que puntúa cada vídeo contra las reglas. Usar cuando el usuario pida «estilo minimal», «minimalista», «como Dope Motions», «como el de Joseph», «clip de podcast premium», un plan de escenas en este estilo, o «audita este vídeo».
---

# Minimal corto (podcast minimal)

**Fuente de verdad:** `~/EDICION/0 CLAUDE EDITOR/8 BIBLIOTECA DE ESTILOS/10 Podcast minimal (Dope Motions).md` (libro de reglas, lookbook, catálogo, mapa frase → escena). **Leerlo entero antes de diseñar**; aquí solo va el resumen y el orden de trabajo.
Estudio: `1 REFERENCIAS/Analizadas por Claude/2026-11-14 estilo minimal podcast/` (desgloses palabra a palabra, hojas). Ejemplos: `8 BIBLIOTECA DE ESTILOS/ejemplos/10 podcast minimal/`.

**Estado:** 🟡 medido en referencias, **nada aprobado por el usuario** y ningún vídeo entero construido. Es una opción: mandan el BRIEF y la FICHA del cliente. El método general (plan, bloques, vista previa) está en la skill `talking-head-premium`.

## Las reglas en una pantalla
| # | Regla | Número |
|---|---|---|
| 1 | Reparto | A-roll con texto 45–60 %; el resto, b-roll y pantalla completa |
| 2 | A-roll seguido | máximo 5 s |
| 3 | Apertura | ampliado y desenfocado → nítido en 8 fotogramas; primera palabra al decirse |
| 4 | Primera escena diseñada | entre 1,5 y 3,0 s; la recompensa literal del gancho |
| 5 | Plano | mediana 1,3–2,4 s; montaje de b-roll a 0,5 s y una palabra por plano |
| 6 | Corte | 1–3 fotogramas antes de la palabra |
| 7 | Cierre | A-roll, 1,5–2,5 s |
| 8 | Texto | sobre el pecho, 47–62 % del alto, centrado en el eje del cuerpo |
| 9 | Tamaños | relleno ≈ 2,5 % del alto; especial ≈ 6–7 % (2,3–2,6×), ≤ 60 % del ancho; letras muy juntas |
| 10 | Página | una cláusula: relleno + UNA frase especial; palabra a palabra |
| 11 | Nombre | abajo a la izquierda (62–68 % del alto, margen 10 %), una vez por hablante |
| 12 | Degradado | negro desde el 60–70 % en todo el A-roll |
| 13 | Color | un acento del plano: claro sobre oscuro, saturado sobre claro; + blanco roto y negro |
| 14 | Letras | dos familias o pesos; elegir una variante del lookbook |
| 15 | Pantalla completa | fondo claro, texto arriba, un concepto, 2–5 s, corte seco al entrar y desenfoque de 3–4 fotogramas al salir |
| 16 | Animación | entradas de 2–6 fotogramas sin rebote; cajas que barren; gráficos en 10–14 fotogramas; nada del todo quieto |

**Acabado (color por elemento, texturas, letras, cómo se colocan las palabras y qué sonido acompaña a cada cosa):** apartado H del libro de reglas. Leerlo antes de diseñar el primer fotograma y antes del sonido.

## Orden de trabajo
1. **Elegir variante y acento** mirando el bruto (geométrica, editorial, caligráfica, mayúsculas y píldoras, cartel). Si el cliente tiene marca aprobada, se usa la suya.
2. **Plan de escenas** (tabla frase → escena con su motivo) usando el mapa D del libro. Comprobar el reparto (regla 1) y que no haya más de 5 s de A-roll seguido (regla 2) **antes** de construir. Lo decide el usuario.
3. **Colocar según la persona:** la regla 8 se adapta al plano (manos, micro, logotipos). Texto de acento solo sobre zonas oscuras o dentro de una caja.
4. **Fotograma de diseño** de cada escena sobre un fotograma real → aprobación → animar.
5. **Vista previa del gancho** (hasta la primera escena diseñada incluida).
6. Construir el resto; capas transparentes con `~/Videos-Remotion/hyperframes/render-para-premiere.sh` o secuencia de PNG; mirar un fotograma en Premiere antes de seguir.
7. QC técnico y mirar la hoja; **auditar solo si toca** (abajo).

## Auditoría (solo cuando hace falta)
Se audita si es el primer vídeo del estilo o del cliente, si el vídeo volvió con correcciones de fondo, si rindió mal o si Luis lo pide. En los demás basta el QC técnico y mirar la hoja. Para decidir escenas se usa la skill `criterio`, no la auditoría.
`~/EDICION/0 CLAUDE EDITOR/8 BIBLIOTECA DE ESTILOS/10 Podcast minimal · AUDITORÍA.md`
```
python3 ~/Videos-Remotion/herramientas/qc/auditar-estilo-minimal.py <exportación.mp4> [carpeta]
```
Medir → mirar las hojas y rellenar las 16 reglas → comparar con una referencia de la misma variante. Sale una nota de 0 a 16, las correcciones y, si un fallo se repite o el usuario corrige algo dado por bueno, una PROPUESTA de regla. Lo no medible se dice NO VERIFICADO.

## Lo que este estilo todavía no sabe
Sonido y música (sin estudiar), CTA en pantalla, la curva exacta de movimiento y las fuentes reales. El estilo documental del tablero es otro estilo.
