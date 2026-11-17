# Alumnos Trainer10x · lote de pendientes · ESTADO (17-11-2026)
**Paso:** v1 de cada vídeo hecha SIN aprobación previa del plan (Luis lo pidió así: «edita todos y prepárame una auditoría para corregir»). Nada subido al panel ni entregado. Nada en Premiere.
**Auditoría:** `3 PROYECTOS/Alumnos Trainer10x/PLANES/lote-1711/auditoria.html` (abrir en el navegador; «Copiar correcciones» → pegar en el chat).

## Hechos (MEDIA/<alumno>/«… v1 lote (música).mp4» y «(sin música)», −14 LUFS)
- Alessandro · qué comer y cada cuánto (3 columnas) · Álvaro · si te sientes hinchada · Álvaro · comer esto o esto (rehecho; v1 del motor en panel) · Alessandro · colores de los alimentos (rehecho)
- María · entrevista en la calle · Marc · abdominales y dolor de espalda (50 s, no 35–40) · Lorena ×3 (thrusters, elevaciones, saltos; sin voz, metáfora abogados)
- Alessandro · picoteos de Mercadona y quesos de Mercadona (rehechos con fotos oficiales de la tienda online; permiso de Luis 17-11)
## Verificación (verificar.py)
11/11 OK técnico. Arreglado tras verificar: golpes graves de más en Marc (zooms de reencuadre).
## Fuera (no editar)
Paula ×4 (clips de un vídeo ya entregado) · Miguel Á. Romero #1 (mismo bruto que el #2) · Jonatan (bruto no subido) · PRUEBA · Álvaro «lunes» (v2 hecha 16-11).

## Herramientas nuevas (sin tokens) — skill `lote-alumnos`
`panel.py` (pendientes/bajar/final) · `preparar.sh` · `reel_alumno.py` (spec.json → vídeo) · `sonido.py` (real-sfx + música + master) · `auditoria.py` · `verificar.py`. Copia estable en `~/Videos-Remotion/alumnos/`.

## No comprobado
Nada escuchado por un humano. Textos dudosos marcados en la auditoría. Colores de marca de Alessandro y morado de Álvaro: propuestas mías.

## Traspaso
Sesión nueva: cargar skill `lote-alumnos`, leer este ESTADO y las correcciones que pegue Luis. Cambios = editar `<carpeta>/spec.json` (o `hacer_spec.py`) y relanzar `anim` + `sonido.py`. Subir al panel solo con su orden.
