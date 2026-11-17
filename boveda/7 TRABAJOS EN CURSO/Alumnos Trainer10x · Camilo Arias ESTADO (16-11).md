# Camilo Arias · «sentadillas ciclista» · ESTADO (16-11-2026)
**Paso:** Luis lo vio y le gustó (16-11). Único cambio: fuera el «contador» Data Collect (6,46 s, nada se movía) → Ui Enter a 5,50 s cuando aparece el cuadrado lima; MP4 rehechos. **SUBIDO al panel (16-11)** por R2 + base de datos (método en memoria `subir-videos-panel-trainer10x`): vídeo `mwc5fojxf6ybbvya`, versión 2 (Space Cadet), estado «Para revisar»; la v1 sigue guardada en el almacén. **ENTREGADO a Camilo (16-11, 20:22 UTC)** por orden de Luis («Entrégala ya»), con el botón del panel: estado «entregado», versión 2. La foto de Förstemann sale sin el sí de Amin (Luis lo sabía).
- Lección (para PROPUESTAS, sin aprobar): un sonido de contador/datos solo si algo cuenta o se mueve en pantalla.

## Salidas (MEDIA/Camilo Arias/)
- `Camilo - v2 completo (Space Cadet).mp4` y `Camilo - v2 completo (sin música).mp4` · 68,8 s · 1080×1920 · 30 fps · −14,0 LUFS.
- Generador: `PLANES/camilo/plan-v2/anima_video.py` (0–9,4 s = `anima_gancho.py` sin tocar; 9,4–68,8 s = escenas 5–12). Hoja: `plan-v2/hoja_video_completo.jpg`.
- Sonido: `plan-v2/sonido/` (cues.json, critique.md con 6 rondas, pista de efectos WAV, `escuchar.wav` = 5 momentos para oír).
- Música: Space Cadet desde 33,9 s, −25 LUFS sola (8,9 LU bajo voz+efectos), fundido final 2 s; master −14 LUFS, pico −0,9 dBFS.

## Decisiones vigentes
- Plan aprobado 16-11 (`plan-v2/LEEME.md`) · diseño aprobado (hoja_diseno.jpg, ciclista a pantalla completa con grano y viñeta).
- Marca: Sequel Medium/Heavy · lima #C6FF00 (bueno) · naranja #FF5A36 (malo/mito) · crema para claves neutras.
- Sin fotos de Cami: tarjetas «foto pendiente» 19–25 s. «paso… mejor… paso» se deja. Crédito pequeño de la foto de Förstemann.
- Zooms de golpe en remates (PEOR, GENÉTICA ESPECIAL, ESAS PIERNAS, CICLISTA MÁS FUERTE, CULTURISTA); se sueltan en un corte.
- Efectos: los 15 del gancho aprobado sin tocar; los nuevos priorizan favoritos de Luis y se varían para no repetir.

## No comprobado
- Nadie lo ha oído: niveles medidos, no escuchados. Oír `sonido/escuchar.wav` y el vídeo con cascos y en móvil.
- «Graves» 5,5/10 en la crítica: son los 3 golpes del GANCHO aprobado (1,8 · 3,25 · 5,52 s) sobre los graves de la voz; no los toqué.
- Premiere: nada importado. Foto de Förstemann (CC BY-SA): falta el sí de Amin. Fotos de antes/ahora: faltan.
- Pico tras AAC −0,9 dBFS de muestra; true peak no medido tras codificar.

## Traspaso
Sesión nueva: leer este ESTADO. Luis ve los dos MP4 y corrige; cambios en `anima_video.py` (SUBS, ZOOMS, funciones por escena) y `sonido/cues.json` (real-sfx `mix.py --voice-safe`). Música y master: comandos en la BITÁCORA. Si llegan las fotos de Cami: sustituir las tarjetas en `antes_ahora()`.
