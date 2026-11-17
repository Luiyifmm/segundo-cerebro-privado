---
name: cambiar-fondo
description: Recorta a la persona de un vídeo y le cambia el fondo, sin apps externas. Usar cuando el usuario pida cambiar el fondo, quitar el fondo, recortar a la persona o sacar un vídeo con transparencia.
---

# Cambiar el fondo

1. `export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"; cd ~/Videos-Remotion/fondo`
2. `node recortar.js "<video>" "<fondo.jpg>" <salida> [--inicio s] [--duracion s] [--ancho 1080] [--alfa]`
3. Salida: `<salida>.mp4` (compuesto), `<salida>-mate.mp4` (máscara) y con `--alfa` `<salida>-alfa.mov` (ProRes 4444 transparente para Premiere).

- Necesita solo el clip y la imagen de fondo. Unos 14 fotogramas por segundo a 1080×1920.
- Recorta solo a la persona: sillón, mesa y objetos desaparecen. Avisarlo siempre. Para conservarlos, el usuario hace la máscara en Premiere o se coloca la persona de modo que el corte quede fuera de cuadro (escalar y bajar).
- Probar primero 4 s (`--inicio`, `--duracion`), mirar fotogramas del resultado y solo entonces procesar el clip entero.
- Para que no parezca pegado: desenfocar un poco el fondo, igualar temperatura de color y añadir una sombra suave.
- No genero imágenes: el fondo lo aporta el usuario.
