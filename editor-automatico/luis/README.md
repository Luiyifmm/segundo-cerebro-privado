# Trabajador del Claude de Luis

Edita los vídeos de las colas con el método de Luis: decide un Claude Code sin pantalla con las reglas del manual base (`editor.md`) y revisa su propio resultado con fotogramas y medidas (`revisor.md`). El resto es el motor de Amin: transcribir, frases, montar y `Reel`.

## Qué cola atiende
- **Alumnos (Trainer10x):** `t10x.videos` en `en_cola` o `corregir` → `editando` → `revisar`.
  - Se reserva con `FOR UPDATE SKIP LOCKED`, así que puede convivir con `sala_agente.py` sin pisarse.
  - Sube a R2 `final-vN.mp4`, `portada-vN.jpg`, `edl-vN.json` y `decisiones-vN.json`.
- **Sala:** todavía no. Hoy la Sala guarda los vídeos dentro de la app y publica con un commit en `main`. El trabajador no publica nunca, así que la cola de la Sala llega cuando la Sala lea los vídeos de R2 (decisión abierta nº 3).

## Instalar en el Mac de Luis
1. **Credenciales**, fuera del repo: `~/.config/claude-editor/env.json` con `chmod 600`. Las mete Amin; nunca pasan por el chat ni por git.
   ```json
   {"DATABASE_URL": "postgres://usuario_limitado:…@…neon.tech/…", "S3_ENDPOINT": "https://<cuenta>.r2.cloudflarestorage.com",
    "S3_BUCKET": "trainer10x-videos", "S3_KEY": "…", "S3_SECRET": "…", "S3_REGION": "auto", "COLAS": ["alumnos"], "MODELO": "opus"}
   ```
2. **Permisos mínimos del usuario de la base de datos:** `SELECT, UPDATE` en `t10x.videos`, y `SELECT` en `t10x.clientes` y `t10x.guiones`.
3. **Motor:** `cd motor && npm install`. La librería de sonidos y las fuentes se leen de la copia de `sala-edicion` (`SALA_APP`, por defecto `~/Proyectos/amin/sala-edicion`).
4. **LaunchAgent** (`com.luis.trabajador.plist`): lo instala Luis cuando el vídeo de prueba esté aprobado.

## Probar sin base de datos
```
uv run --python 3.12 --with mlx-whisper --with numpy python luis/trabajador.py --local BRUTO.MOV --salida CARPETA --titulo "…" --quien amin --usuario aminbusinesss
```
Deja en `CARPETA`:
- `final.mp4`, `portada.jpg`;
- `plan.json` (lo que decidió el editor);
- `edl.json` (se abre en el editor de la Sala);
- `decisiones.json` (formato de Amin);
- `revision.jpg` (la hoja que miró el revisor).

## Prueba del 30-10 (IMG_6126, «La vulgaridad vs la elegancia»)
- **Bruto y resultado:** bruto de 242 s → 44,3 s. 17 frases dentro y 25 fuera (charlas fuera de cámara, tomas repetidas y arranques en falso).
- **Audio:** −14,7 LUFS, pico −1,8 dBTP.
- **Tiempo y coste:** 13 min en un MacBook Air M5; IA 0,58 $ en la primera pasada y 0,41 $ en la segunda (precio de API, opus).
- **Fallos de la primera pasada, arreglados y comprobados en la segunda:**
  - el titular ocultaba los subtítulos del gancho → ahora, si el gancho tiene una palabra clave, el titular va con subtítulos o no va;
  - el revisor no podía corregir una palabra mal transcrita → ahora recibe los índices; en la segunda pasada cambió «alzo» por «alpha» y volvió a renderizar.
- **Pendiente:** buscar imágenes de comparativa (la edición a mano de Luis las lleva).
