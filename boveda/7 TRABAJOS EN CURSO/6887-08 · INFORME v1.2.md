---
tipo: informe de entrega
trabajo: 6887-08
cliente: amin
version: v1.2 (propuesta para el usuario; NO enviada al cliente)
actualizado: 2026-11-07
---
# 6887-08 · «Haz esto y tu vida cambia en 6 meses» · propuesta v1.2

## Entregables
| Qué | Dónde |
|---|---|
| Vídeo de revisión (720p, 3,3 MB) | `3 PROYECTOS/_PRUEBAS CLAUDE/6887-08/6887-08 propuesta Claude v1.2 (revisión, ligera).mp4` |
| Alta calidad (2160×3840, H.264 alta tasa) | `…/6887-08 propuesta Claude v1.2.mp4` |
| Proyecto editable | `…/Amin · copia Claude 6887-08.prproj`, secuencia «6887-08 · propuesta Claude v1» |
| Hoja de fotogramas (2 fps) | `…/hoja 6887-08 v1.2.png` |
| Brief aprobado | [[6887-08 · BRIEF]] |
| Foto «antes» (ciclo de aprendizaje) | `7 TRABAJOS EN CURSO/fotos/6887-08/antes-20261107-2324.json` |

`Amin.prproj` (el original) no se ha tocado: es una copia hecha desde el disco.

## Capas (todo editable)
| Pista | Qué | Notas |
|---|---|---|
| V1 / A1 | 13 tomas de IMG_6887 | Escala 100 en el gancho y la lista; 125 en la frase del dinero y el CTA |
| V2 | Capa de ajuste con el Lumetri de «Secuencia anidada 14» (tu vídeo 1) | Medido: +2,6 % de luminancia y algo más cálido que el bruto |
| V3 | 42 subtítulos `Subtitulo Amin v12` | Glow 0, sombra 100/38/16, clave azul #1E8BFF |
| V4 | Lista acumulada: 12 PNG, una por estado | Se regeneran con `clientes/amin/IMG_6887-s03/08/lista/generar-lista.py`, cambiando ITEMS |
| V5 | Título v12 «TU VIDA EN / 6 MESES» | 0–20,7 s. Una plantilla v12 no puede pasar de 30 s, y así la frase del dinero queda limpia |
| A1 (efectos) | Volumen +15 dB · Limitador · Amplificación (+~8 dB) · Limitador (techo −1 dB) | El bruto estaba a −39,6 LUFS |
| A5 | 12 «tic» (Ui button.wav, −14 dB) | Uno por punto de la lista |

## Decisiones creativas (del brief aprobado y de lo que vi al montar)
1. **Tomas:** una por frase, elegidas con los tiempos palabra a palabra y comprobadas transcribiendo la exportación.
   - Cambié «Hazlo con miedo» a la 1.ª toma: la 2.ª no se entiende ni aislada.
   - El mentor es la 4.ª toma (la única con «esté»).
2. **La lista no podía ir con la plantilla v12:** la centra en mitad de la pantalla y tapa la cara.
   - La hice como capas PNG alineadas a la izquierda, en la pared libre, bajo el título.
   - Recorté textos para que no rozaran el pelo («Calla tus metas», «Di no al 99 %»).
3. **Plano fijo a 100 durante la lista** (no alterno 100/110 como decía el brief): a 110 la lista quedaba casi pegada al pelo. Los saltos entre tomas se ven, como en la referencia.
4. **«en 6 meses» del gancho sin clave:** repetía el título.
5. **CTA:** termina en «la clase gratuita». El final con tropiezo («donde que explico…») está fuera, con una bajada de volumen de 3 fotogramas.
6. **No hay moraleja de «mi socio y yo facturamos…»:** no se dijo en el bruto.

## QC técnico
| Comprobación | Resultado |
|---|---|
| Exportación y duración | ✅ 33,43 s · 2160×3840 · 30 fps · sin fotogramas negros |
| Sonoridad / picos | ✅ −15,2 LUFS integrados · pico −3,8 dBFS · 0 muestras recortadas (medido) |
| Ruido de fondo | ⚠ −54 dBFS tras subir la voz unos 23 dB (bruto −87). Medido; **no escuchado** |
| Cobertura de subtítulos | ✅ 125/125 palabras. Diferencias solo de transcripción («6/seis», «le/te», «llamar/llevar») |
| Sincronía de subtítulos | ⚠ 4 bloques adelantados a su palabra. Precisión de WhisperX ±50–100 ms: **±2 f NO VERIFICADO** |
| Cortes dentro de palabra (`cortes-voz`) | ✅ Corregidos «planes» y el final del CTA. 0 restantes según la medida |
| Colisiones cara / lista / título / subtítulos | ✅ en las hojas de fotogramas de Premiere (revisión visual). `qc-colisiones.py` no se pasó: la lista es PNG y no se exportó con alfa |
| Zona segura | ✅ título y subtítulos dentro; lista en x 150–760 e y 1040–2060 (a 4K) |
| Huecos en la línea de tiempo | ✅ ninguno (se cerró uno de 1 fotograma) |

## QC creativo (mi revisión; la aprobación es tuya)
1. **Idea:** se entiende «12 cosas → la del dinero → CTA». La lista ayuda a no perder la cuenta.
2. **Redundancia:** los subtítulos repiten lo que dice la voz y la lista lo resume. Es una repetición deliberada (sirve para guardar el vídeo), pero hay mucho texto en pantalla a la vez.
3. **Lectura en móvil:** **el punto débil.** La lista mide unos 58 px a 4K (≈ 1,5 % del alto): en un móvil se lee justa. Con más grande no cabe sin tocar el pelo.
4. **Ritmo:** seco y sin pausas largas. Los saltos entre tomas en el mismo plano se notan (decisión de formato).
5. **Estilo:** SF Pro, azul de Amin, sin efectos. Encaja con «natural y elegante».
6. **Cortes:** todos con razón (una toma por frase). «Di que no» se transcribe como «Y que no»: el «Di» es débil en el bruto.
7. **Sonido:** solo un tic por punto; sin música (ficha).
8. **Lo que haría un editor top:** dar más aire a la lista (otro encuadre o un recorte que mueva a Amin a la derecha) para ponerla más grande, y una música de fondo muy baja si Amin la elige.

## Pendiente / no verificado
- **Nada escuchado:** el ruido de fondo, los «tic», la «Y» antes del CTA (posible respiración) y cómo suena el «Di».
- Sincronía ±2 f no medida.
- `qc-colisiones.py` no pasado (solo revisión visual con fotogramas de Premiere).
- WAV de voz aparte a −16 LUFS: se hará al entregar al cliente.
- **CTA PLAN:** comprobar que vuestra automatización responde a PLAN (el guion decía FIT).

## Tiempo (aproximado, por las marcas de la sesión)
- Preparación del lote (transcripción de 33 min, mapa, guiones, 5 referencias, 6 briefs): ~1 h 40 min.
- Edición del 08 desde la aprobación del brief hasta la v1.2: ~45 min de reloj (unos 10 min fueron una prueba de corte que se colgó).
