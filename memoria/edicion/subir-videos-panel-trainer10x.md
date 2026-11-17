---
name: subir-videos-panel-trainer10x
description: "Luis quiere que yo suba y baje los vídeos del panel Trainer10x yo mismo (R2 + Neon con ~/.config/claude-editor/alumnos.json), no él a mano"
metadata:
  node_type: memory
  type: feedback
  originSessionId: e56e3b49-fb3b-4484-a3bc-33ed251ac751
  modified: 2026-11-16T20:21:39.044Z
---

Luis (16-11-2026): «la idea es que tú seas el editor principal, que puedas subir los vídeos tú mismo y descargarlos tú mismo; tienes acceso al código de la aplicación». No mandarle a subir a mano ni usar la subida de Chrome (tope 10 MB).

**Why:** soy el editor principal de los alumnos de Trainer10x; el panel es solo la ventana.

**How to apply:** replicar `subidaEditor` + `confirmarEditor` de `~/Proyectos/amin/trainer10x-contenido/src/app/panel/edicion/acciones.ts`:
1. Credenciales: `~/.config/claude-editor/alumnos.json` (la de alumnos; `env.json` es la de la Sala, otro bucket). Nunca imprimir claves.
2. PUT firmado (SigV4 en la URL) a `alumnos/<cliente_id>/<video_id>/final-editor-<base36 ms>.mp4`; comprobar con HEAD que el tamaño coincide.
3. `UPDATE t10x.videos SET final=clave, portada='', estado='revisar', version=version+1, respuesta=…, historial=historial||…` (python con `uv run --with "psycopg[binary]"`).
4. No borrar el final anterior (el panel lo borra; yo lo dejo como respaldo).
5. Subir deja el vídeo en «Para revisar»: el alumno deja de verlo hasta «Entregar». Entregar al alumno es otra decisión: preguntar.
Descargar: GET firmado con la misma clave de `final`/`bruto`. Scripts de ejemplo: BITÁCORA de Camilo (16-11). Relacionado: [[sistema-amin-trabajador]].
