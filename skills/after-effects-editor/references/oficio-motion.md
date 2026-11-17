# Oficio de motion design: números de referencia y control de calidad

> Los números del CEREBRO son probados en las clases. Los marcados *(informe)* son orientativos, de un informe externo.

## Tiempos (a 30 fps)
| Qué | Cuánto |
|---|---|
| Micro-animación de interfaz | 6–10 fotogramas *(informe)* |
| Entrada de un texto | 12–20 fotogramas *(informe)*; aparición con rebote 0 → 110 → 97 → 100 en 0,55 s (4.5) |
| Transición de escena | 15–24 fotogramas *(informe)* |
| Rótulo inferior (lower third) | entra en 15 f, se queda 4–6 s y sale en 12 f *(informe)* |
| Escalonado entre elementos | 2–4 fotogramas (0,1–0,16 s); entre letras, 1–2 *(informe)*; palabras 1,15 F y líneas 2,8 F (4.49) |
| Leer | ~0,3 s por palabra + ~1 s de respiro; mínimo ~2 s en pantalla (2.0b) |
| Rebasar (overshoot) | ≤ 5–10 % del recorrido *(informe)* |
| Zoom lento de vida | 100 → 103–105 % por escena; −3/−5 % al entrar algo nuevo (2.0d) |
| Punto lento de una curva continua | ≤ 50 px/s en pantalla (2.0e) |

## Curvas
- La influencia decide el pico: **pico = media / (1 − influencia)**. 33 % → 1,5×; 75 % → 4×; 90 % → 10× (4.110).
- Easy Ease de AE = 33,33 % y velocidad 0. Una "pro" sale al 60–75 % y llega al 85–95 % *(informe)*; entrar "con fuerza" = salida rápida y llegada larga (2.0f, 4.79).
- **Corte de acción:** curva de salida → corte en el fotograma más rápido (medido) → curva de entrada exponencial (2.0e, 4.43).
- **Nada se queda quieto nunca:** keys continuas, movimientos solapados, `wiggle` < 1 Hz y zoom lento (2.0d).

## Motion blur
- Ángulo 180° y fase −90° (`comp.shutterAngle = 180; comp.shutterPhase = -90`). Una comp creada por script salió con la fase en 0.
- **Sin motion blur si la referencia no lo tiene.**
- Advanced 3D no lo hace en capas 3D: receta 4.33 o CC Force Motion Blur.

## Zonas seguras y formatos
- **Margen seguro:** nada importante a menos del ≈9 % del ancho por los lados ni del ≈13 % del alto arriba y abajo (1.1). Títulos al 10 % y acción al 5 % *(informe)*.
- **Vertical 9:16 para TikTok, Reels o Shorts:** dejar libre ~15 % abajo y ~10 % arriba para la interfaz de la app *(informe, aproximado)*.
- Formatos: 1920×1080 o 3840×2160 (16:9), 1080×1920 (9:16), 1080×1080 (1:1); 30 o 60 fps para stream, 24/25 para cine.

## Antibandas y acabado
- Proyecto a 16 bpc + grano 1–3 % sobre los degradados (`ADBE Noise`) o Ramp Scatter (4.1).
- Fondo nunca plano: degradado + textura sutil + viñeta (3).
- Glow dosificado: 0,1–0,5 en interfaz, con picos solo en transiciones y palabras clave (3b).

## Control de calidad con números
1. **Fotogramas clave mirados:** el inicio (+1 f), el 25 %, el 50 % y el 75 %, el final (−1 f) y cada momento clave, con `ae_save_frame` o `ver_fotogramas.jsx`. **Mirar cada imagen.**
2. **Hoja de contactos** (`hoja_video.py`, `tira_video.py`) y, si hay referencia, **ORIGINAL | RÉPLICA** (`comparar_momentos.py`).
3. **Comprobaciones con números:**
   - lo centrado, centrado al píxel (≤ 1 px);
   - nada importante fuera de la zona segura y ningún solapamiento de textos;
   - el icono centrado en su forma (≤ 0,5 px);
   - posiciones enteras en textos finos;
   - **0 expresiones con error** (`expressionError`).
   La caja de cada capa en pantalla se mide con `toComp` de las 4 esquinas de `sourceRectAtTime`: es lo que hace `optimizar_visibles.jsx` por dentro.
4. **Velocidad:** suavidad (`suavidad.py`: temblor < 0,3 px) y saltos que el original no tiene (`saltos.py`, `revisar_video.py`).
5. **Si algo falla:** corregir y volver a mirar, como mucho 3 vueltas. Si persiste, contárselo al usuario con las capturas.
