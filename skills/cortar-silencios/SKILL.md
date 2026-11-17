---
name: cortar-silencios
description: Quita los silencios de un vídeo en bruto. Usar cuando el usuario pida cortar silencios, limpiar un bruto, quitar pausas o hacer el primer corte de un vídeo hablado.
---

# Cortar silencios

1. `export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"; cd ~/Videos-Remotion/voz`
2. `node cortar-silencios.js "<video>" [--umbral -35] [--minimo 0.45] [--aire 0.08] [--alto 1920] [--solo-lista]`
3. Salida en `salida/`: `<nombre>-cortado.mp4` y `<nombre>.tramos.json` (tramos con voz, en segundos del original).

- Decir siempre cuántos segundos se quitaron y abrir el resultado en QuickTime para que el usuario lo revise.
- Solo quita silencios. No detecta tomas repetidas ni errores: para eso, transcribir con la skill `subtitulos` y proponer qué frases repetidas eliminar.
- Si corta sílabas, subir `--aire` a 0.12 o bajar `--umbral` a -40. Si deja pausas, bajar `--minimo` a 0.3.
- Para cortar dentro de Premiere en vez de exportar: usar `--solo-lista` y aplicar los tramos a la secuencia activa por el puente (ver skill `edicion-video`). Confirmar antes de modificar una secuencia del usuario.
- **Flujo completo (transcripción + hojas + silencios + plan de escenas) en una orden:** `~/Videos-Remotion/sistema/preparar-clip.sh "<vídeo>" [--idioma es|en]` (ver skill `editor-maestro`).
