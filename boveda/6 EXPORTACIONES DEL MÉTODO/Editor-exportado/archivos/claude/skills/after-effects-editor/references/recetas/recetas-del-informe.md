# Recetas · Del informe externo (septiembre de 2026), adaptadas

> Recetas cortas de un informe externo. **No se probaron en las clases**: antes de usarlas, aplicar las reglas de oro (investigar, optimizar y organizar) y comprobarlas con `ae_save_frame`. Lo corregido con lo probado aquí va marcado con ⚠️.

1. **Logo 3D extruido.**
   - Comp 1920×1080 a 30 fps.
   - El SVG se importa como capas de forma (26.0+) y se hace 3D.
   - ⚠️ Para extruir por script, con el motor que funciona aquí: **Cinema 4D (`"ADBE Ernst"`)**, con `ADBE Extrsn Depth` 40, `ADBE Bevel Depth` 3, metal 100 y reflexión 60 (4.48, 4.97). En Advanced 3D (`"ADBE Calder"`) la extrusión salió sin luz ni bisel en la Tanda 03 · 05.
   - Luz de entorno (HDRI) + foco con sombra. Cámara colgada de un nulo con Y 0 → 30° y curva 75/85.
   - Para un logo exacto, mejor un GLB desde Blender.
2. **Rótulo inferior (lower third) que se ajusta al texto.**
   - Capa "TEXTO · nombre" y una barra de forma con las expresiones de tamaño y posición de `expresiones.md` (caja que se ajusta al texto).
   - La entrada, con Trim Paths.
   - Source Text y color expuestos en Gráficos esenciales (regla 3). Se entrega una comp "EJEMPLO de uso".
3. **Tipografía cinética.** Animador con `ADBE Text Position 3D` [0, 80, 0] y `ADBE Text Opacity` 0. El selector de rango lleva el Offset de 0 a 100 % con *Ease High/Low*. Cámara con dolly.
4. **Texto que vuela hacia la cámara.** Texto 3D (extruido con Cinema 4D, o plano en Classic 3D), Z de −3000 a 0, motion blur (Classic) y desenfoque de cámara.
5. **Transiciones:**
   - **whip pan:** Transform (`ADBE Geometry2`) con su propio motion blur (obturador 360) en una capa de ajuste;
   - **glitch:** Shift Channels + Mosaic con `posterizeTime`, o S_DigitalDamage (4.74);
   - **barridos con formas:** Repeater de rectángulos + Trim Paths.
6. **Confeti y partículas:** **CC Particle World** con *Birth Rate* en un pico de 2 fotogramas, o S_Sparkles. NUNCA una capa por partícula (regla 1).
7. **Neón:** texto con trazo + Deep Glow 2 (aquí es mejor que dos Glow de radio 10 y 60) + parpadeo con `wiggle(8, 20)` en la opacidad, o keys de retención (4.64).
8. **Infografías:**
   - barras de forma cuya escala Y lee deslizadores;
   - o datos de un JSON importado como metraje: `footage("datos.json").sourceData`.
9. **Fondos en bucle:**
   - Fractal Noise con *Evolution* = `time*360/duraciónBucle` y *Cycle Evolution* activado;
   - Curl Noise (26.3);
   - fondo "caro" en 4 capas (4.1).
10. **Logo que se dibuja con trazos:** Trim Paths End 0 → 100 con el Offset escalonado por grupo.
11. **Alertas y botones para stream (OBS):**
    - comp 1080p con fondo transparente: entra en 0,5 s, se queda 4 s y sale en 0,4 s;
    - render en ProRes 4444 con alfa → **WebM VP9 con alfa** con ffmpeg (`render-y-entrega.md`).
12. **Producto GLB:** importar el modelo (motor Advanced 3D), órbita de cámara, *shadow catcher* (24.5+) y luz de entorno. Si se necesita un render de producto con reflejos de estudio: Element 3D (4.102–4.105).
13. **Parallax 2.5D con una foto:**
    - separar la foto por capas (recortes), cada una con su Z, en Classic 3D;
    - compensar la escala con `(z + 1000)/1000·100` para que no cambie el encuadre (4.106 lo hace exacto con el plano final).
14. **Visualizador de audio:** Audio Spectrum o Audio Waveform, o formas que leen *Audio Amplitude* (Convert Audio to Keyframes).
