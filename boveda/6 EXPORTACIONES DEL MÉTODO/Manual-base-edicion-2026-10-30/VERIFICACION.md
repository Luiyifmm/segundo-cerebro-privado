# Verificación · qué está comprobado y qué es memoria

Fecha de este manual: 2026-10-30. Todo lo de abajo lo hizo Claude de Luis en su Mac.

## Comprobado hoy (2026-10-30)

| Qué | Cómo |
|---|---|
| Cortes, imágenes, sonidos y CTA del caso-001 (AMIN_1018_03) | Leí la secuencia del proyecto de Premiere `AMIN - LOTE 18 OCT.prproj` con un lector de .prproj (segundos de secuencia y de bruto de cada clip) |
| Lado de las imágenes en el caso-001 (malo derecha / bueno izquierda), subtítulos sobre el pecho, degradado, tarjeta de seguir | Hoja de 51 fotogramas del vídeo final (1 cada 0,67 s), revisada a ojo |
| Mezcla del caso-001: −13,1 LUFS, pico verdadero +0,3 dBTP, 517 muestras saturadas | `earshot measure` sobre el archivo final |
| Frases dentro/fuera, tomas repetidas, duraciones de los casos 002 y 003 | Informes JSON del primer corte guardados en octubre |
| Zooms, marcadores y niveles de sonido de los casos 002 y 003 | Leí los scripts de colocación usados en octubre (`montar-amin-1009.jsx`, `marcas-amin-1009.jsx`, `sfx-poner.jsx`, `amin-v6-sonido.jsx`, `amin-1010-b.jsx`) |
| Reglas nuevas de efectos (sfx-004 a sfx-010, audio-003, gancho-002) | Trabajo de hoy en un reel de otro cliente con Real SFX y earshot: tres rondas de crítica, `verify.py` (24/24 en su fotograma), `earshot critique` (23/23 medidas dentro de rango) y `earshot measure` |
| Que el JSON cumple el formato pedido | Script de validación: campos exactos, valores permitidos en `area`, `origen`, `ambito`, `confianza` y `estado`, ids únicos |
| Que no hay datos de otros clientes ni claves | Búsqueda de nombres de clientes, usuarios y palabras como token, password o .env en toda la carpeta |

## Memoria o inferencia (no lo he vuelto a comprobar hoy)

- Las reglas con estado `igual` salen del paquete «Editor-exportado» del 30-10, de mis notas de memoria y del registro de correcciones. Fueron ciertas cuando las escribí, pero hoy no he vuelto a medirlas.
- **Marca nueva de Amin** (Instrument Serif, Anton, #E5322D, #F5C542, música solo si la elige): copiada de su mensaje. No he visto ningún vídeo con ella.
- **amin-subtitulos-002**: el ratio clave/línea de 2,4 se midió con SF Pro. Con las letras nuevas hay que volver a medirlo.
- **Orden de las 15 reglas de más impacto**: criterio mío, no medido.
- **Valores de spring y escalonado** (graficos-008) y **ritmo-003**: a ojo.
- **Equivalentes en ffmpeg y Remotion**: son la forma en que lo haría; no los he probado uno a uno en tu sistema.
- **Caso-003**: el final exportado (42 s) se recortó a mano después de mi corte de 54 s. Los cortes de `cortes.json` son los del corte de 54 s y los tiempos de sus motion graphics son aproximados.
- **Subtítulos del caso-001**: son subtítulos nativos de Premiere y su texto no se puede leer por script. Solo hay tiempos; el texto se ve en el vídeo.
- **Niveles en dB del caso-001**: el lector no los expone. Solo está medida la mezcla final.

## Vídeos incluidos

En `casos/caso-00N/`, `bruto-720p.mp4` y `final-720p.mp4`: H.264 720×1280, CRF 28, AAC 128 kb/s, sacados de los originales de Amin.
