# Entrenar un estilo: plantilla

Se usa solo en modo ENTRENAMIENTO, en copias. Nada pasa a regla sin aprobación.

## Lo que pone el usuario
- Carpeta con **10 o más** referencias del mismo estilo (mejor de un solo editor).
- Tablero (Figma o Miro) con capturas agrupadas por patrón y sus notas. Si el tablero es privado: exportarlo a PDF o imágenes, o abrirlo con sesión iniciada en el navegador de la app.

## Lo que hago yo, en este orden
1. Por cada referencia: hoja de fotogramas + transcripción por palabra + tabla `palabra · inicio · fotograma · escena · qué hay en pantalla`.
2. Diseño: paleta (hex), composición, proporciones (% del alto y del ancho), efectos, letras y pesos.
3. Lógica de animación: tipos, duración en fotogramas, velocidad, curva.
4. Relación con el guion: qué tipo de frase dispara qué tipo de escena, y cuánto antes o después de la palabra.
5. Leer el tablero del usuario y cruzarlo con lo medido. Donde no coincidan, preguntar.
6. Escribir el libro de reglas: pocas reglas, con número, cada una con su referencia.

## Carpetas del paquete
```
8 BIBLIOTECA DE ESTILOS/<NN estilo>/
  desgloses/        un .md por referencia (estudio fotograma a fotograma)
  guia/             una carpeta por tipo de escena; dentro, por animación:
                    diseño.png · fotogramas-clave.jpg · como-esta-hecho.md
  lookbook.md       paletas y letras, y cuándo usar cada una
  libro-de-reglas.md
```
Estados de cada dato: 👁 observado · 💭 interpretación · 🧪 en prueba · ✅ aprobado (fecha).

## Petición de Joseph (traducida), como guía de qué estudiar
> Aprende este estilo. Te paso 10 referencias y un tablero con el desglose. Primero, desglose fotograma a fotograma con transcripción palabra a palabra de cada vídeo. Luego estudia tres cosas: el diseño (colores, composición, efectos, proporciones, letras), la lógica de animación (tipos, tiempos, velocidad, curva) y cómo se comporta la animación respecto al guion. Después lee el tablero y escribe el libro de reglas completo. Por último, crea la skill que edita en este estilo con nuestra ayuda en el plan.

## Prueba antes de dar el estilo por bueno
Un bloque corto (gancho, 10–15 s) sobre una copia de un bruto real, comparado lado a lado con una referencia. El usuario corrige; cada corrección entra al libro de reglas como 🧪.
