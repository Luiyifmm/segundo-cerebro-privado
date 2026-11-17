---
tipo: estado
trabajo: IMG_6887
cliente: amin
actualizado: 2026-11-07
---
# IMG_6887 · vídeo de Amin (terminar resaltados, SFX y color)

**Paso actual:** propuesta entregada; falta que el usuario la escuche.
**Dónde está:** proyecto `~/EDICION/3 PROYECTOS/Lotes de edición/Amin.prproj` · secuencia `IMG_6887` (2160×3840; tramo editado 0–39,97 s; el bruto sigue hasta 622 s).
**Alcance:** terminar lo que empezó el usuario.

## Hecho (06-11)
- **Palabras resaltadas:**
  - 6 gráficos nativos del usuario teñidos de cian 0,250,255 con "Tinción" + "Resplandor de VR" copiado de sus azules;
  - 4 claves nuevas con `Subtitulo Amin v12` en la V30 ("sesión", "tiempo", "libre", "dinero");
  - sus 4 trozos en V25, desactivados (no borrados).
- **Color:** capa de ajuste nueva en V2 (0–39,97 s) con el Lumetri copiado de "Secuencia 01". Todas las pistas de encima subieron un número. Comprobado con fotogramas: +16 % de luminancia, más cálido.
- **SFX** en A9–A12, bandeja "SFX (Claude)":
  - UI en los números (−8 dB);
  - clic en las claves (−6);
  - glitch en el gancho (−10);
  - pops en los gráficos (−12);
  - whoosh (−10);
  - reloj (−14);
  - contador (−12);
  - caja (−14);
  - notificación (−8).

## Decisiones
- El cian se usó porque el usuario ya lo tenía en sus azules de este vídeo. La norma oficial sigue siendo #1E8BFF (cian pendiente de confirmar).

## Falta
- Que el usuario escuche la mezcla. En la lista (2–16 s) coinciden muchos sonidos: ofrecí quitar los pops de los gráficos.

## No comprobado / riesgos
- La mezcla de SFX no se ha escuchado ni medido.
- Recetas usadas, ya generalizadas: `sfx-colocar`, `lumetri-copiar`, `tincion-clips`, `mogrt-textos` (originales en `premiere/recetas/origen/2026-11-06…`).

## Correcciones del usuario en este vídeo
- (ninguna todavía)

## 07-11 · «Secuencia anidada 14» (primer vídeo) y vídeo 5
**Paso actual:** corte del vídeo 5 lanzado; el puente de Premiere dejó de responder al crear la secuencia «IMG_6887 · vídeo 5 (Claude)». Comprobar si existe antes de repetir. Script del corte: `premiere/recetas/origen/2026-11-07-corte-video5.jsx` (se niega si la secuencia ya existe).
- **Primer vídeo (0–49 s):** resaltados de cian a dorado (Tinción negro 140,95,0 → blanco 255,225,95; MOGRT contador y números a 245,197,66; «MÁS DE» con tinción 0 %). Audio natural: «Mejorar la voz» quitado; el resto de efectos de clip y los de pista de A1/A2 en Derivar; voz −11,3 dB + Limitador forzado (techo −1); SFX A3–A6 −6 dB. Medido: −15,7 LUFS, pico −0,6 dBFS. Respaldo: «RESPALDO Secuencia anidada 14 (antes de audio natural 07-11)».
- **Error mío corregido:** el compresor de pista de A2 quedó a +30 dB (fotograma clave) por pruebas de setParamValue; ahora en Derivar. Aviso en `premiere/recetas/LEEME.md`.
- **Tramo 221,6–406,3 s (bruto 785,651–970,356):** dos vídeos: vídeo 5 (0–153 s del tramo) y el inicio del vídeo 6 (154 s en adelante, cortado a mitad de frase; sigue en el bruto).
- **Vídeo 5, tomas elegidas** (segundos del bruto = tramo + 785,651): 10,08–12,12 · 29,60–31,28 · 42,70–44,08 · 59,20–61,22 · 73,66–77,08 · 83,56–85,22 · 86,90–90,42 · 95,50–96,82 · 100,90–102,20 · 135,00–137,88 (subida de orden) · 111,80–114,95 · 124,30–126,10 · 142,48–153,45 (CTA). Total 37,1 s. Transcripción verificada: `~/Videos-Remotion/voz/salida-whisperx/IMG_6887_785.651.verificada.json` (61 % fiables) + Whisper turbo para 85–140 s.
- **Falta (vídeo 5):** color (lumetri-copiar desde la capa de V2 de «Secuencia anidada 14»), voz a −16 LUFS (+8 dB y limitador), subtítulos v12 con clave dorada, SFX suaves, QC con fotogramas.
- **No comprobado:** nada del vídeo 5 se ha visto ni medido todavía.
