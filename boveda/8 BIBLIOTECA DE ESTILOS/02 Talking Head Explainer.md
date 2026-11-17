---
tipo: estilo
estado: documentado
licencia: video-editor sin licencia general — solo ideas y números, sin código
uso: opción
formato: 9:16
---
# Talking Head Explainer (vertical)

Una persona habla a una cámara fija y **demuestra lo que dice en pantalla mientras lo dice**. Reels de 60–150 s. El estilo salió de un vídeo aprobado tras 7 rondas de corrección y se refinó con un segundo vídeo.

## Las diez leyes, resumidas
1. **La cara convence; la mitad de arriba demuestra.**
2. **El encuadre es el ritmo.** Con una sola cámara, cambiar de encuadre es el "nuevo plano". Se rota entre cinco, por corte seco:

   | Código | Qué se ve | Para qué | Duración típica | Peso |
   |---|---|---|---|---|
   | S (partida) | Panel opaco arriba (y 0–960) y la cara abajo | Una frase que nombra o enseña algo | 1,2–12 s | ~60 % |
   | T (cerrado) | Cara ampliada, sin gráfico | Promesa, opinión, énfasis | 1,5–4,5 s | ~8 % |
   | W (abierto) | El plano tal cual | Respiro, conector | 0,6–1,7 s | ~6 % |
   | F (pantalla completa) | Gráfico a toda la pantalla | Cuando lo que se enseña necesita toda la altura | 5–7 s | ~10 % |
   | O (tarjeta) | Tarjeta pequeña sobre la cabeza en el plano abierto | Algo real que le pasa en directo | lo que dure | ~17 % |

3. **Enseñar, no repetir:** el gráfico representa la frase; el subtítulo lleva las palabras. Los textos grandes, racionados.
4. **Lo real antes que lo inventado:** capturas propias (su cuenta, su web) antes que ilustraciones; nunca inventar pruebas.
5. **En la palabra, medido:** imagen, salto de subtítulo y sonido caen a menos de 2 fotogramas de la palabra, comprobado en el render.
6. **Legible = entero, plano, grande, centrado y quieto.** Una página real llena la mitad de arriba.
7. **La cara y el subtítulo son sagrados:** nada sobre la cara o el pelo; el gráfico se mueve, la cara y el subtítulo no.
8. **Dos texturas:**
   - lo inventado, a 12 fps con brillo y grano sobre una rejilla casi negra;
   - lo real (capturas), fluido con un brillo leve y líneas de barrido.

   Todo "apenas perceptible".
9. **El sonido es el objeto literal** de un suceso visible (un teléfono que suena, no un "whoosh genérico"). La cara, los subtítulos y las salidas van en silencio.
10. **Tu mano es la verdad:** cada defecto objetivo tengo que encontrarlo yo antes; tu revisión es solo de gusto.

## Números de ritmo (para calibrar, no son cuota)
- ~20 cambios de encuadre cada 2 min.
- Un cambio de imagen cada ~3 s, más un pequeño suceso dentro del panel cada ~1 s.
- Cara visible ~90 % del tiempo; gráficos en pantalla ~85 %.

## Subtítulos de este estilo (opción, no el de Amin)
- SF Mono Bold, 44 px, mayúsculas, interletrado 3.
- Caja negra al 90 %, radio 16, una línea cada vez.
- Entran y salen con corte, **sin resaltar palabras** ("el énfasis lo pone el gráfico").
- La persona en blanco; una segunda voz, entera en amarillo.

## Encaje con Amin
- Útil cuando Amin **demuestra algo** (cifras, capturas, procesos): pantalla partida con la prueba arriba.
- Choca con lo suyo en los subtítulos: Amin resalta la palabra clave en azul. **Mantener los suyos.**
- Su regla "nada sobre la cara" coincide con la de Amin.

## Cómo se haría aquí
- Panel y gráficos en HyperFrames (con `animaciones-casa.js`), encuadres como claves de Movimiento en Premiere, y `qc-zona-segura.py`.
- **Falta construir:** el calculador de encuadre por cara (ellos usan MediaPipe, que no está instalado; habría que pedir aprobación).
