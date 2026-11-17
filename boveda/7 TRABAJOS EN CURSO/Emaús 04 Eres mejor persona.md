# Emaús 04 · Eres mejor persona — ESTADO (10-11-2026)

**Proyecto:** `emaus.prproj` · secuencia **«Emaús · 04 Eres mejor persona (propuesta)»** (corte de Luis, 55,5 s). Guía nº 4.
**Paso:** acabado de propuesta y revisión; falta el estilo de los subtítulos (Luis) y la exportación.

## Hecho por Claude (10-11)
- Voz igualada: clips de voz de 0–28,9 s −1,5 dB y de 28,9 s en adelante +1 dB. Resultado: −15,3 / −15,7 LUFS (antes −13,9 / −16,3).
- Música: los 6 trozos de A7 (con saltos y un hueco de 0,23 s en 45,7) están DESACTIVADOS. Sanctuary va continua en A8 desde 142,367 s de la canción, a −18,2 dB; sube a −10 dB en la tarjeta final (48,3→48,9) y tiene fundido de 53,5 a 55,5.
- Gráficos especiales (MOGRT): «¿somos mejores / PERSONAS?»; «¿somos capaces de / PERDONAR?» movido a 17,95 (con la voz) y su whoosh a 17,69 (−4 dB); «lleno de orgullo» a 39,55–40,72 y su clic a 39,55. Los dos Focus Revelation, al 80 % para que quepan.
- Zooms: 13 b-rolls a +8 % (claves en la escala).
- SFX nuevos (A9–A10): riser 31,06 → «sin embargo», golpe 34,90, whoosh 47,68 → tarjeta final.
- Subtítulos: `Emaús/Subtítulos/04 Eres mejor persona v2 · frase (Sequel).srt` + `· clave (Noteworthy).srt`, partidos por unidades de sentido. La clave entra cuando se dice la palabra. No hay subtítulo donde ya sale un gráfico especial (3,8–6,5 · 17,9–20 · 39,5–45,9).
- La receta `sfx-colocar.jsx` está corregida: con `dur` también fija `outPoint`.

## QC
- Sincronía medida (earshot): gráficos 2 f antes de la voz, golpe +24 ms, clic +1 ms. Mezcla −15,6 LUFS.
- NO RESUELTO: pico de −0,2 dBTP en la voz de 18–24 s. Hace falta un limitador a −1 dB en la pista Mezcla (lo pone Luis; por script no se tocan los efectos de pista).
- NO VERIFICADO: los solapes de voz de 5–7 f en 14,8 y 16,2 (en un lado es casi silencio, −31 dB); que suenen bien, a oído.

- Subtítulos (10-11, tarde): Luis borró la pista antigua, dio estilo a las nuevas y las convirtió a gráfico (V14: frase ×15, V15: clave ×13). Claude les puso lo mismo que en el 05: frase y = 0,72, clave y = 0,765 al 130 %, fundido de 3 f, «pop» de la clave y sombra paralela. Vistos 12 fotogramas: dentro de pantalla y sin tapar caras.

- SFX 2.ª pasada (10-11): A11, un clic suave (Mouse Click 02, −3 dB) en cada palabra clave (12; mediana 5 ms medida con earshot); A12, latido (Heartbeat sound, −6 dB) de 38,07 a 45,93 bajo «corazón lleno de orgullo, celos, críticas» (+4 dB de graves en las pausas). Mezcla −16,0 LUFS. La receta corregida ya fija bien el outPoint.

## Traspaso
Falta: limitador a −1 dB en la pista Mezcla (Luis), guardar y exportar.
