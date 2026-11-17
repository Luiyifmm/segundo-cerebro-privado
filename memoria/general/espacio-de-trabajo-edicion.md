---
name: espacio-de-trabajo-edicion
description: Cómo quedó organizado el Mac del usuario el 2026-10-10 (carpeta ~/EDICION), dónde van brutos, exportados y materiales, y qué no se mueve
metadata:
  type: project
---

El 2026-10-10 el usuario pidió "optimizar nuestro espacio de trabajo": organizar el PC por carpetas, descargar los brutos de sus clientes separando hechos y pendientes, borrar exportados duplicados de Premiere y juntar los materiales de edición.

Estructura creada en `~/EDICION/` (hay un `LEEME.txt`): `1 CLIENTES/<CLIENTE>/{BRUTOS/{PENDIENTES,HECHOS},EXPORTADOS,GUIONES}`, `2 MATERIALES DE EDICION/` (efectos de sonido, música, imágenes, b-roll, overlays, plugins, fuentes, acceso a PACKS), `3 PROYECTOS/`, `4 REFERENCIAS/`, `5 TALLER DE CLAUDE` (enlace a `~/Videos-Remotion`), `9 OTROS/` (capturas, registros de la limpieza y `mapa de archivos movidos 2026-10-10.csv`).

**How to apply:**
- Material nuevo va directo a `~/EDICION`, no a Descargas ni al Escritorio: brutos a `BRUTOS/PENDIENTES/<reel>`, y al exportar un reel su carpeta pasa a `HECHOS` y el exportado a `EXPORTADOS` (solo la última versión; él eligió "dejar solo el más reciente").
- Brutos en Drive: Amin en el acceso `RAW` (CORTOS/Octubre, REUTILIZABLES, Largos). Se copian con `~/EDICION/9 OTROS/descargar-brutos.sh` (rsync, reanudable); en Drive no se toca nada.
- No mover: `~/Documents/Adobe/Premiere Pro/26.0` (proyectos y sus carpetas internas) ni `~/Videos-Remotion` (rutas fijas en scripts y proyectos). Antes de mover cualquier archivo, comprobar si algún .prproj lo enlaza (leer el .prproj con gzip y buscar `ActualMediaFilePath`); si lo enlaza, mover y reenlazar con `changeMediaPath` y guardar.
- Borrar siempre a la Papelera, nunca definitivo. El usuario NO quiso borrar mis entregas de alternativas (`Videos-Remotion/entregas`, 35 GB).
- Los proyectos antiguos (Amin y otros de clientes antiguos) quedaron con medios por reenlazar; él lo aceptó.

Limpieza del 2026-10-17 (aprobada por el usuario): a la papelera las entregas viejas de Amin (amin-alternativas*, 35 GB), zips ya descomprimidos y animaciones sin usar. Nuevas carpetas: `2 MATERIALES/Plugins y presets/LUTs/`, `4 REFERENCIAS/Plantillas y miniaturas/`, `9 OTROS/Capturas de pantalla/`. Regla usada: antes de mover algo de Descargas, comprobar con los .prproj (gunzip + grep de rutas) si algún proyecto lo usa; si lo usa, NO moverlo (rompe enlaces). Quedan en Descargas los usados por proyectos (música, Klickpin, brutos de Amin/Eric, Prozis) y los accesos directos de Drive.

2026-10-23 ("organiza y optimiza"): rendimiento del Mac (MacBook Air M5 16 GB sin ventilador): los apagones eran WindowServer sin memoria por Media Encoder (se queda 8–11 GB) + Safari. Preset AME "max h264" arreglado (nivel 6.0 forzaba software). Reserva Adobe para otras apps 6 GB. El usuario quiere seguir usando Media Encoder: cerrarlo tras exportar y usar proyectos ligeros. Registro `9 OTROS/organizacion-2026-10-23.json`.

2026-10-31 cleanup ("organiza mis carpetas y elimina lo que se pueda"):
- **Trash** (`~/.Trash/Limpieza 2026-10-31`, 3.3 GB): zips already extracted, a duplicate gym folder, the OpenClaw dmg, real-sfx.skill, ssstik copies, old exports and loose credential files.
- **Log:** `9 OTROS/limpieza-2026-10-31.json`.
- **Pitfall:** macOS screenshot and recording names contain U+202F before a.m./p.m., so match them by date, not by literal name.


2026-11-06: Eric y Natalia dejaron de ser clientes. Sus carpetas (brutos, exportados, TERMINADO, proyectos de Premiere) siguen en disco SIN TOCAR; su información de marca está archivada en `0 CLAUDE EDITOR/9 ARCHIVO (no se carga)/`.
