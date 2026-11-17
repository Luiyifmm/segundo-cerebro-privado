# ERIC (@erick.eecofit) · reels de fitness

**Qué le entrego:** la propuesta COMPLETA, "digna de resultado final", sin preguntar: tomas, subtítulos, títulos, motion graphics, sonido, color y CTA.

## Marca
- **Color:** naranja #FF5800 (255,88,0); en portadas, degradado #FFD23A → #FF5800.
- **Comparativas:** malo en rojo (226,38,38) y bueno en verde (22,170,72), aunque la marca sea naranja.
- **Letra:** Sequel Sans (Medium Disp en la línea, Heavy Disp en la clave).
- **Subtítulos:** `Subtitulo Eric v3.mogrt`.
  - Tamano 52,2 · línea 77 · clave 50 · naranja.
  - Sombra 100/34/18 · entrada 6 f · clave +2 f.
  - Posición [0,5, 0,3909].
- **Títulos y números:** sus plantillas "Animación Limpia Rápida" (blanco) + "Animación Rápida Con Brillo" o "Desenfoque Con Brillo" (naranja) y "Efecto Brillo" (números "1.", "2." en [0,5, 0,616], 0,83 s).
- **CTA:** "Guárdalo / Compártelo / @erick.eecofit · Siguiendo" (`clientes/eric/ERIC_1009_01/motion/CTA guardar compartir seguir v2.mov`):
  - posición [0,5, 0,98];
  - empieza 2,2 s antes de "sígueme";
  - Pop up SFX a 0,06 al entrar y Mouse Click 01 a 0,08 en el clic.
- **Sonidos:** Cinematic Click en claves importantes (0,517), Data Collect en cifras (0,124) y **Smooth Pop** (UN pop) en emojis e ítems (0,06). **Nunca "Normal Pop".**

## Cómo lo quiere (correcciones acumuladas)
- Nada de cajas o etiquetas; la palabra clave nunca sola; bloques de 1–3 palabras + clave al final.
- **Voz:** "niquelada" (Mejorar la voz), muy por encima de la música (~18 dB).
  - Ojo: en el gimnasio NO comprimir ni subir ganancia (sube el ruido).
- **Canales:** su cámara graba la voz **en un solo canal** → "Rellenar izquierda con derecha" siempre.
- Los alimentos se quedan como miniatura acumulada para no perder el hilo.
- La píldora de contexto ("Perder grasa 🔥") dura 1–2 s como máximo.
- Gráficos de cálculo: **una operación cada vez**; solo el resultado queda fijo; al sumar o restar, se fusionan; empieza con "???".
- **Cifras (pesos, gramos, kcal): las de cada vídeo**, sacadas de lo que dice Eric en ese vídeo. No hay peso de referencia global (decisión del 06-11-2026; antes ponía "80 kg", y el render final de *Calcula esto* usó 83 kg).
- Pidió poder comparar dos versiones de la lista (numerada y sin numerar).
- **Si cambia una cifra, cortar la voz para que la diga.**
- **Música:** la elige el usuario.

## Ejemplo de referencia aprobado
"3 trucos para eliminar barriga" (TERMINADO/06): el estilo a copiar en propuestas.

## Recursos
- Componentes de Remotion: `Eric.tsx` (portadas, CTA), `EricCalculaLista2.tsx` (lista y pizarra), `EricSiQuieres.tsx` (tabla), `EricRankingCat.tsx` (ranking 5→1).
- Animaciones renderizadas: `2 MATERIALES DE EDICION/Overlays y CTA/Eric …/`.
