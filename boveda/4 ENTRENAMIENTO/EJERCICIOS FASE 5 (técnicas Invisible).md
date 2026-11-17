---
tipo: ejercicios
actualizado: 2026-11-07
---
# Ejercicios de la fase 5: técnicas del estudio *Invisible* dentro de una edición real

**Material:**
- bruto IMG_6123 de Amin («5 tipos de mujeres…»), del que no hay edición tuya;
- se usó su **proxy de 720p**, porque el bruto ya no está en local (hoy se reorganizó `BRUTOS`). Por eso la imagen está algo blanda.
- **Los tres ejercicios van en una misma edición de 21,4 s**, para comprobar que funcionan juntos y no como renders sueltos.

**Dónde está:**
- Proyecto: `3 PROYECTOS/_PRUEBAS CLAUDE/fase5-ejercicios/Fase 5 ejercicios Claude.prproj` › secuencia `EJERCICIOS FASE 5 · Claude v1`.
- Render: `fase5-ejercicios/Ejercicios fase 5 v1.1.mp4`. La v1 se conserva con el fallo del alfa.
- Fuentes:
  - `~/Videos-Remotion/clientes/amin/ejercicios-fase5/` (tomas, EDL, subtítulos, recorte);
  - `hyperframes/ejercicio-e1-tarjetas/` y `hyperframes/ejercicio-e3-titulo/`;
  - `premiere/recetas/impacto.jsx`.

## Estructura de la edición
| Tiempo | Qué dice | Técnica |
|---|---|---|
| 0–2,4 s | «5 tipos de mujeres con las que no puedes perder tu tiempo» | **E3:** título «5 tipos» detrás de Amin |
| 2,8–4,5 s | «La quinta es la peor y con diferencia» | **E1:** tira de 5 tarjetas sobre la cabeza; la 5.ª se enciende en «peor» |
| 4,6–9,4 s | Tipo 1: «la que utiliza la intimidad como premio o castigo…» | Plano cerrado y limpio |
| 9,4–11,9 s | «Y por quinto, la **peor**» → «la que solo pide y gasta» | **E2:** golpe de impacto en «peor» + corte a más cerrado |
| 12–21,4 s | Cajero automático, moraleja y CTA | Limpio |

## E1 · Animación y composición: tira de tarjetas (HyperFrames)
- **Técnico:**
  - 5 tarjetas de 152×270 (radio 14 px = 9,2 %, contorno blanco);
  - escalonado de 2 f, destello de 4 f, deslizamiento `expo.out` de 1,5 s;
  - se apaga el resto al 35 % en «peor»; salida 0,22 s con 1 f de escalonado.
  - QC: no pisa la cara (18/18 fotogramas). Solo se sale de la zona segura mientras entra por el lateral (3,0–3,5 s), que es lo previsto.
- **Autoevaluación:**
  - funciona como **estructura** (el espectador sabe que hay cinco y que la quinta es la peor);
  - pero los números solos aportan poco. Tu edición de 6118 me enseña que **una imagen concreta por elemento** retendría más.
  - Nota: 3/5.

## E2 · Transición y ritmo: impacto (Premiere nativo, receta)
- **Técnico:**
  - Transformar (escala +9 %, sacudida de 14 px en 4 f, obturador 360°) + Desenfoque gaussiano 3 + Lumetri (exposición +1,3, temperatura −20) + Desplazamiento turbulento 35;
  - una clave por fotograma; subida 0,30 s y bajada 0,74 s, repartidas entre dos clips (cruza el corte a 285 %).
  - Fotogramas revisados: la v1 del desenfoque (12) emborronaba todo y la bajé a 3.
  - El efecto de sonido «Impact Normal» llega ≈ 90 ms tarde respecto al pico visual (medido con earshot: pico de nivel a +0,09 s). **No corregido.**
- **Autoevaluación:**
  - es la parte más útil de la fase, porque deja una **receta reutilizable en Premiere**, editable por ti;
  - el golpe se lee bien y desaparece en 0,7 s;
  - para Amin («natural y elegante») habría que usarlo como mucho una vez por vídeo.
  - Nota: 4/5.

## E3 · Integración metraje + gráfico: título detrás de Amin (recorte + HyperFrames)
- **Técnico:**
  - recorte de la persona con `fondo/recortar.js --alfa` (4,56 s, 14,7 fps de proceso);
  - título «5» en SF Pro azul + «tipos» en Nyght Serif cursiva (las dos fuentes de la ficha);
  - revelado por letra con desenfoque 10→0 y 2 f de retraso; deriva de 1,7 %/s.
  - **Fallo encontrado y corregido:** en la v1 el título no se veía, porque Premiere ignoraba el alfa del recorte. Lo arreglé y además corregí `recortar.js` para que no vuelva a pasar.
  - Primer intento: la cabeza tapaba media palabra («tibos»). Subí el título 80 px.
- **Autoevaluación:**
  - es la integración más «real»: la mano de Amin pasa por delante de las letras;
  - pero en plano abierto, con Amin pequeño, el efecto se pierde un poco.
  - Nota: 3,5/5.

## Control técnico de la edición de ejercicios (v1.1)
| Comprobación | Resultado |
|---|---|
| Sonoridad | −16,7 LUFS, pico −2,4 dBTP, 0 muestras recortadas ✅ |
| Cortes | 0 cortes en mitad de voz salvo **«gasta»**: se recorta la cola (−47 dB, ≈ 50 ms). ⚠️ NO corregido; la prueba del corte oye «pídigas» |
| Prueba del corte | Texto completo salvo «o» de «premio o castigo» (no se oye; escuchar) |
| Colisiones | Cara libre; solo los lados al entrar la tira |
| Sincronía de animaciones con palabras | **NO VERIFICADA a ±2 f.** Los tiempos vienen de WhisperX verificado (−0,05 s de anticipación) |
