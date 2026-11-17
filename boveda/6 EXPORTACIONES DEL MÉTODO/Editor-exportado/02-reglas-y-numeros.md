# 02 · Reglas y números exactos

Tabla de consulta rápida. La explicación de cada regla está en `01-metodo.md`. "Origen" dice de dónde sale el valor:
- **U:** corrección o decisión del usuario o del cliente.
- **M:** medido con un script.
- **R:** referencia analizada.
- **O:** a ojo (se da el rango).

## Corte

| Regla | Valor | Origen |
|---|---|---|
| Umbral de silencio (corte simple) | −35 dB | O (rango −35 a −40), confirmado en el primer vídeo |
| Duración mínima de silencio | 0,45 s (0,3 si quedan pausas) | O |
| Umbral relativo (primer corte) | LUFS integrados del clip −10 dB | M |
| Cierre de frase | puntuación o pausa > 0,45 s | M |
| Pausa que se corta | ≥ 0,4 s | M |
| Aire antes / después | 0,08 s / 0,15 s (0,12 si corta sílabas) | M + O |
| Tramo mínimo | 0,15 s | M |
| Silencio con puerta de ruido + apuntador | −58 dB; pico de voz ≥ −50 dB | M |
| Error de Whisper en tiempos | hasta 0,5 s | M |
| Precisión del primer corte frente al montaje humano | ±0,2 s | M |
| Mejor toma | la última completa | U |
| Audio solapado | 3–4 por vídeo como máximo | U |
| Separación entre vídeos en una línea de tiempo | 30 s – 1 min (45 s usados) | U |

## Ritmo y estructura

| Regla | Valor | Origen |
|---|---|---|
| Gancho | ≤ 3 s (vídeos largos: 10–20 s) | R |
| CTA visible | ≥ 2 s | R |
| Cambio visual (marca personal) | cada 0,5–2 s | R |
| Por idea (educativo) | 2–5 s | R |
| Texto en pantalla | ≤ 6–8 palabras | R |
| Tiempo de lectura | 0,3 s/palabra + 0,5 s | R |
| Píldora de contexto | 1–2 s como máximo | U |

## Subtítulos

| | ClienteE | ClienteN | ClienteA |
|---|---|---|---|
| Plantilla | Subtitulo ClienteE v3 | igual que ClienteE | Subtitulo ClienteA v10 |
| Tamano / línea / clave | 52,2 / 77 / 50 | igual | 67,89 |
| Color clave | 255,88,0 | 211,38,28 (bueno 0,255,4) | 30,138,255 |
| Sombra (op/dif/dist) | 100/34/18 | igual | 100/38/16 |
| Posición | [0,5, 0,3909] | igual | y 0,4375 con clave / 0,466 sin |
| Entrada / retraso de la clave | 6 f / 2 f | igual | 3 f línea / 6 f clave |
| Palabras por bloque | ≤ 4 (línea 1–3 + clave) | igual | 1–3 |
| Subtítulos en la intro con títulos | y 0,32 | | |
| Números "1." "2." | Efecto Brillo, Inter-Black 300, [0,5, 0,616], 0,83 s | | |
| Cifras como gráfico | Inter-Black 225–300, se quitan del subtítulo | | |
| Énfasis del cierre | Tamano 74, línea 100 | | |
| En 16:9 | Tamano 52,2 + escala 40, [0,5, 0,57] | | |

Reglas de texto (U):
- La clave solo si es la última palabra del bloque.
- Nunca una clave sola.
- No acabar un bloque en artículo, preposición o conjunción.
- Bloques < 0,45 s se unen a la frase anterior.
- Comparativas: malo rojo 226,38,38, bueno verde 22,170,72.
- Revisar la ortografía.

## Seguridad en 9:16 (1080×1920)
- Arriba ≈ 220 px, abajo ≈ 420 px, derecha ≈ 140 px (R).
- Subtítulos al 60–70 % de la altura.
- **Los gráficos de lista terminan por encima de ~900 px** para no tocar la franja de subtítulos de ClienteE (≈ 915–995 px, hasta x ≈ 560–800 px) (M).

## Motion graphics

| Regla | Valor | Origen |
|---|---|---|
| Lienzo / fps | 1080×1920 / 30 | M |
| Escala en una secuencia 4K | 200 | M |
| Spring de entrada | damping 14, stiffness 190–200, mass 0.7 | O |
| Curva de movimiento | bezier(0.16, 1, 0.3, 1) / out-cubic | R |
| Escalonado | 40–80 ms (0,05–0,3 s) | R + O |
| Salida | fundido 0,2–0,35 s | O |
| Zoom de énfasis | 105–120 % (YouTube 108–118 %) | R |
| Empuje lento | 0,5–2 %/s | R |
| Reencuadre para hueco lateral | escala 125, posición x 0,375 o 0,625, y 0,52 | O |
| Entrada por palabra (trials) | desenfoque 12→0, opacidad 0→1, +20 px, 180–250 ms | R |
| Familias de letra | máximo 2 (+1 de acento) | R |
| Contraste del texto | ≥ 4,5:1 | R |
| Titulares en móvil | ≥ 120 px en 1080×1920 | R |

## Sonido

| Regla | Valor | Origen |
|---|---|---|
| Mezcla final | −14 LUFS, pico ≤ −1,5 dBTP | R |
| Aviso del QC | < −18 o > −11 LUFS | M |
| Voz cruda de ClienteA | ≈ −33 LUFS → loudnorm I=−15, TP=−1,5 | M |
| Voz frente a música | 10–15 dB por encima (ClienteE: ~18 dB) | R + U |
| Música bajo voz | −20 / −24 dB (sin cara: −25 dB) | R |
| Subida de la música en silencios | ~2–3 dB | R |
| Nivel en Premiere | Nivel = 10^((dB−15)/20); 0 dB = 0,1778 | M |
| Cinematic Click | 0,517 | U |
| Data Collect | 0,124 | U |
| Smooth Pop | 0,06 | U |
| Pop up SFX | 0,06 (0–0,62 s) | U |
| Mouse Click 01 | 0,08 | U |
| Sincronía del efecto | ±1 fotograma; clic 0,02 s antes | M |
| Whoosh de tarjeta | termina en el momento en que entra la tarjeta | O |
| CTA de seguir | empieza 2,2 s antes de "sígueme"; posición [0,5, 0,98] | U |
| Voz en un canal | rellenar el otro canal | M |
| Ruido de gimnasio de ClienteE | no comprimir ni subir ganancia | U |

## Color (Lumetri, índices de Corrección básica)

| | 14 temp | 16 sat | 19 exp | 20 contr | 21 resalt | 22 somb | 23 blancos | 24 negros | 41 nitidez | 42 intens |
|---|---|---|---|---|---|---|---|---|---|---|
| Base HDR iPhone (U) | — | — | −0,45 | +14 | −45 | +4 | −28 | −8 | 12 | — |
| ClienteE (U) | +3 | 108 | ″ | ″ | ″ | ″ | ″ | ″ | ″ | 14 |
| ClienteN (U) | 0 | 100 | ″ | ″ | ″ | ″ | ″ | ″ | ″ | 8 |
| ClienteE, gimnasio gris (O) | +9 | 120 | +0,12 | +24 | −14 | −6 | +8 | −12 | 14 | 16 |

## Exportación

| | Valor |
|---|---|
| Final (Media Encoder "max h264") | H.264 2160×3840, VBR objetivo ~60, máximo ~72 Mb/s |
| Previsualización / trial | 1080×1920, 30 fps, H.264 yuv420p CRF 17, AAC 48 kHz 256 kb/s |
| Overlay | ProRes 4444, yuva444p10le, 1080×1920, 30 fps |
| Portada | PNG 2160×3840 desde el fotograma 4K |

## Marca por cliente

| | Color | Letra | Entrega |
|---|---|---|---|
| ClienteA | azul #1E8BFF | SF Pro (+ serifa itálica solo en motion graphics) | bruto entero + marcadores |
| ClienteE | naranja #FF5800 (degradado #FFD23A→#FF5800 en portadas) | Sequel Sans Bold / Medium / Heavy Disp | propuesta completa |
| ClienteN | rojo #D3261C en todo; verde solo para "lo bueno" | Futura Condensed ExtraBold en la palabra grande; resto fina | propuesta completa |
