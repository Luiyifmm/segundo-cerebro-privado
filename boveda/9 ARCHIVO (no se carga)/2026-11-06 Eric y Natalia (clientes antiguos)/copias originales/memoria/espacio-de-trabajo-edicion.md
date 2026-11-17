---
name: espacio-de-trabajo-edicion
description: Cómo quedó organizado el Mac del usuario el 2026-10-10 (carpeta ~/EDICION), dónde van brutos, exportados y materiales, y qué no se mueve
metadata:
  type: project
---

El 2026-10-10 el usuario pidió "optimizar nuestro espacio de trabajo": organizar el PC por carpetas, descargar los brutos de sus clientes separando hechos y pendientes, borrar exportados duplicados de Premiere y juntar los materiales de edición.

Estructura creada en `~/EDICION/` (hay un `LEEME.txt`): `1 CLIENTES/<AMIN|ERIC|NATALIA>/{BRUTOS/{PENDIENTES,HECHOS},EXPORTADOS,GUIONES}`, `2 MATERIALES DE EDICION/` (efectos de sonido, música, imágenes, b-roll, overlays, plugins, fuentes, acceso a PACKS), `3 PROYECTOS/`, `4 REFERENCIAS/`, `5 TALLER DE CLAUDE` (enlace a `~/Videos-Remotion`), `9 OTROS/` (capturas, registros de la limpieza y `mapa de archivos movidos 2026-10-10.csv`).

**How to apply:**
- Material nuevo va directo a `~/EDICION`, no a Descargas ni al Escritorio: brutos a `BRUTOS/PENDIENTES/<reel>`, y al exportar un reel su carpeta pasa a `HECHOS` y el exportado a `EXPORTADOS` (solo la última versión; él eligió "dejar solo el más reciente").
- Brutos en Drive: Amin en el acceso `RAW` (CORTOS/Octubre, REUTILIZABLES, Largos), Eric en `Videos /Videos Octubre  A`, Natalia en `Videos /Videos Octubre B`. Se copian con `~/EDICION/9 OTROS/descargar-brutos.sh` (rsync, reanudable); en Drive no se toca nada.
- No mover: `~/Documents/Adobe/Premiere Pro/26.0` (proyectos y sus carpetas internas) ni `~/Videos-Remotion` (rutas fijas en scripts y proyectos). Antes de mover cualquier archivo, comprobar si algún .prproj lo enlaza (leer el .prproj con gzip y buscar `ActualMediaFilePath`); si lo enlaza, mover y reenlazar con `changeMediaPath` y guardar.
- Borrar siempre a la Papelera, nunca definitivo. El usuario NO quiso borrar mis entregas de alternativas (`Videos-Remotion/entregas`, 35 GB).
- Los proyectos antiguos (Amin, Erick, erikk, NATALIA, erick proyecto, los tres Branding) quedaron con medios por reenlazar; él lo aceptó.

Limpieza del 2026-10-17 (aprobada por el usuario): a la papelera las entregas viejas de Amin (amin-alternativas*, 35 GB), zips ya descomprimidos y animaciones sin usar. Nuevas carpetas: `1 CLIENTES/ERIC YOUTUBE (ericmentorfitness)/` (otro Eric, ver [[reparto-de-trabajo-por-cliente]]), `2 MATERIALES/Plugins y presets/LUTs/`, `4 REFERENCIAS/Plantillas y miniaturas/`, `9 OTROS/Capturas de pantalla/`. Regla usada: antes de mover algo de Descargas, comprobar con los .prproj (gunzip + grep de rutas) si algún proyecto lo usa; si lo usa, NO moverlo (rompe enlaces). Quedan en Descargas los usados por proyectos (música, Klickpin, brutos de Amin/Eric, Prozis) y los accesos directos de Drive.

2026-10-21: nueva carpeta `1 CLIENTES/<ERIC|NATALIA>/TERMINADO/<nn Título>/` (pedido del usuario: vídeos ya exportados aparte, "organizado por carpetas"): dentro, la exportación final (movida), la portada (copiada) y `BRUTOS/` si los brutos estaban en local (movidos desde BRUTOS/PENDIENTES o HECHOS). Registro en scratch `lote21/terminado-log.json`. Ojo: los proyectos LOTE 11 OCT y ERICK EDICION apuntaban a "gana o pierdes musculo", "pequeños detalles…" y "Ganar Peso Vs Perder peso" en PENDIENTES → ahora offline (reenlazar a TERMINADO si se reabren). Ese mismo día Drive cambió: los vídeos de Eric/Natalia ya no están en el atajo `15fUgc…/Videos ` sino en `Mi unidad/Contenido Octubre` (`.shortcut-targets-by-id/1rbta8w6…/Contenido Octubre/Videos /Videos Octubre  A|B`), así que los lotes del 17 oct quedan sin conexión hasta reenlazar.

2026-10-23 (permiso total del usuario, "organiza y optimiza"): proyecto de trabajo nuevo y ligero `3 PROYECTOS/Lotes de edición/ERIC y NATALIA - PARA EDITAR (octubre).prproj` (bandejas 00 SECUENCIAS · 01 ERIC · 02 NATALIA · 03 YA HECHOS · 04 B-ROLL · 05 PACKS (solo carpetas útiles en Premiere) · 06 EFECTOS DE SONIDO (Drive RECURSOS por categorías) · 07 MÚSICA; secuencias "ERIC/NATALIA · 5 PARA EDITAR (octubre)"). TERMINADO nuevos: ERIC 07–09, NATALIA 07. B-roll local en `2 MATERIALES/B-roll/{ERIC · gimnasio, NATALIA · fuerza, Pinterest y descargas}`. Registro `9 OTROS/organizacion-2026-10-23.json`. Borrados a la Papelera ~95 GB (exportaciones repetidas, autoguardados, Drive lost_and_found con proxies de Amin que Drive no podía subir, cachés de Adobe, proyectos viejos y LOTE 11 OCT). Rendimiento: el Mac es un MacBook Air M5 16 GB sin ventilador; los apagones eran WindowServer sin memoria por Media Encoder (se queda 8–11 GB con copias del proyecto entero) + Safari. Preset AME "max h264" arreglado (nivel 6.0 forzaba software). Reserva Adobe para otras apps 6 GB. El usuario quiere seguir usando Media Encoder (no exportar desde Premiere): cerrar AME tras exportar y usar proyectos ligeros.

2026-10-31 cleanup ("organiza mis carpetas y elimina lo que se pueda"):
- **Trash** (`~/.Trash/Limpieza 2026-10-31`, 3.3 GB): zips already extracted, a duplicate gym folder, the OpenClaw dmg, real-sfx.skill, ssstik copies, old exports and loose credential files.
- **Moved** (5.5 GB): exports to `ERIC/` and `NATALIA/EXPORTADOS`; unknown raws (0.mov, 1.mov, IMG_6204, Receta Napolitanas zip…) to `1 CLIENTES/_SIN CLASIFICAR`; music, fonts and graphics to `2 MATERIALES`; contracts and personal PDFs to `~/Documents/Contratos|Personal`; 9 OTROS logs and scripts to `Registros y scripts`.
- **Log:** `9 OTROS/limpieza-2026-10-31.json`.
- **Left in place:** everything a .prproj links (about 60 items in Downloads and the 17-10 screen recordings) and MVI_1418 (Eric, in use).
- **Pitfall:** macOS screenshot and recording names contain U+202F before a.m./p.m., so match them by date, not by literal name.
