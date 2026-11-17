# Traspaso 13-14 nov · minero en AE + editor de alumnos

Sesión de Claude Code (app de escritorio) del 13 y 14 de noviembre de 2026. Es la continuación de una conversación que se resumió por longitud. Aquí no hay contraseñas ni llaves.

## Para retomar (lo esencial)
- **Animación del minero:** está terminada, metida en Premiere y sincronizada con «no cobras». Falta revisarla a velocidad real y guardar el proyecto de Premiere.
- **Plugins:** se reinstalan Deep Glow 2 y Shadow Studio 2, que están pagados. Shadow Studio 3 no se instala: no tiene licencia y las copias de la Papelera son piratas. Pendiente de que Luis los saque de la Papelera.
- **Editor de alumnos (Trainer10x):** desde el 14-11 funciona en el Mac de Luis (issue #8 de edicion-motor). Ver el apartado 4.

## 1. Animación «minero entra y pica» (After Effects)
- **Proyecto:** `~/Documents/trabajo.aep` (AE 2027). Está guardado.
- **Comps:**
  - «MINERO · entra y pica» (2160×3840, 29,97 fps, 3 s).
  - «PRECOMP · minero (partes)»: brazos+pico, cabeza, cuerpo y relleno, recortados con máscaras.
- **Textura:** Fabric 194XL (Texturelabs) en Superponer al 50 %, más grano, CC Lens y viñeta.
- **Golpe de pico:** brazos y cabeza con keys en 0, 12, 17 y 26 f y `loopOut()`. Así pica desde el fotograma 0. Brazos −9°/+5°, cabeza −2,5°/+3°.
- **Billete** (lo añadió Luis): «Custom Engraved One Dollar Bill.png».
  - El texto «no cobras Comp. 1» está emparentado AL billete (padre = billete), y no al revés.
  - El emparentado se hizo en 1;12 con el texto en su posición original (1046,1920 · escala 100 · rot 0).
- **Sincronía con la voz (14-11):** toda la entrada del billete se adelantó 22 f. Ahora empieza en el fotograma 19 de la comp, que es 6;01 en la secuencia, cuando arranca «no cobras». Se movieron juntos:
  - el billete;
  - la capa de formas (subrayado amarillo);
  - el cambio de «FONDO · mina» a «FONDO · mina 2» (22 f);
  - las keys de posición de «MINERO · partes».
- **Comp vinculada en Premiere:** «Amin_1 Comp. vinculada 10» (la que usa Premiere).
  - Lleva «MINERO · entra y pica» como capa 1.
  - Las 3 capas viejas (2 fotos + Vídeo transparente) están desactivadas, no borradas.
  - Duración: 3 s.

## 2. Premiere
- **Proyecto:** `3 PROYECTOS/Lotes de edición/Amin_1.prproj` · secuencia «Secuencia 03 ZOOMS (Claude)».
- **Clip «Amin_1 Comp. vinculada 10/trabajo.aep»:** está en V17, de 5;12 a 7;02. Acaba en el marcador del clip (1,668 s del clip).
- **Comprobado** con fotogramas exportados: en 6;00 no hay billete y en 6;03 ya está entrando.
- **No verificado:**
  - velocidad real;
  - que el proyecto de Premiere esté guardado (Luis lo guarda);
  - el zoom: en Premiere el clip se ve más ampliado que en AE, probablemente por la escala de Movimiento heredada.
- **Pistas tapadas:** los clips «no c…» (V16) y los subtítulos de V15 quedan debajo de la animación y no se ven mientras dura.
- **Archivos movidos:** las comps vinculadas 07, 08 y 09 salen sin conexión porque `aminnnn.aep`, `aminnn.aep` y `animacion 200. 5000.aep` se movieron de `~/Documents` a `3 PROYECTOS/After Effects/`. Hay que volver a vincularlas a mano («Vincular medios»).
- **Media sin conexión:** Premiere marca 1183 elementos sin conexión. No se revisaron.

## 3. Plugins de AE 2027
- **Con licencia:** Deep Glow 2, Shadow Studio 2 y MMDC (archivos `.lic` en `~/Library/Application Support/`).
- **Shadow Studio 3:** no comprado y no se instala. Proyectos que lo usan y que mostrarán el efecto como faltante:
  - animacion 200. 5000
  - levantarse tarde
  - adminn
  - Proyecto sin título (de Documentos)
- **Siguiente paso:**
  1. Luis arrastra `DeepGlow2.plugin` y `Shadow+Studio+2+v1.3.3.zip` (o `Shadow Studio 2.plugin`) de la Papelera a `3 PROYECTOS/_PRUEBAS CLAUDE/plugins sacados de la papelera`.
  2. Claude comprueba la firma (`codesign`, `spctl`).
  3. Claude los copia a `/Applications/Adobe After Effects 2027/Plug-ins/` (macOS pide la contraseña y la escribe Luis).
  4. Se reinicia AE.
  5. Claude busca los efectos con `ae_search_effects`.

## 4. Editor de alumnos de Trainer10x (issue #8 de edicion-motor, 14-11)
Orden de Amin (comentario del issue, 14-11): los alumnos se editan **solo en el Mac de Luis**.

- **Hecho el 14-11:**
  - PR #7 aprobado y fusionado en `main` (merge `bbd7054`).
  - `~/Proyectos/amin/edicion-motor` pasó a la rama `main` y se actualizó.
  - La configuración que pasó Amin está en `~/.config/claude-editor/alumnos.json`, con permisos 600 (carpeta 700). **Nunca en git ni en el chat.**
  - `luis/com.luis.alumnos.plist` copiado a `~/Library/LaunchAgents/` y cargado: `launchctl list` muestra `com.luis.alumnos`.
- **Registro:** `~/Proyectos/amin/trabajos/alumnos.log`. Cada minuto coge el vídeo más antiguo en cola, lo edita, lo sube y lo deja en «revisar» en el panel.
- **Guardado antes de cambiar de rama:**
  - Cambios sin confirmar de `luis/trabajador.py` (la función `publicar_sala`), en `git stash` con el mensaje «WIP trabajador.py (publicar_sala)…». Se recuperan con `git stash list` y `git stash apply`.
  - `motor/package-lock.json`, que no estaba en git, movido a `~/Proyectos/amin/_respaldo-14-11/`.
- **Dónde se toca el estilo de los alumnos:**
  - `luis/fichas/alumno.json`: aún no existe y es lo que más cambia el resultado.
  - `luis/editor.md` y `luis/revisor.md`.
  - `ESTILOS` en `luis/trabajador.py`.
  - `motor/src/Reel.tsx` y `montar.py`.
  - Lo que se cambia en el Mac se aplica al momento al siguiente vídeo; aun así conviene subirlo a `main`.
- **Probar sin tocar a los alumnos:** `python luis/trabajador.py --local video.mp4 --salida prueba/ --quien alumno --usuario cuenta`, con el `uv run` del issue. Con `--reusar-plan` se repite el render sin volver a llamar a la IA.
- **Vídeos en error:** 7 vídeos del 13-11 están en `error` porque son vídeos sin voz. Sería un caso nuevo para `editor.md`.
- **Seguridad:**
  - El JSON con las llaves se compartió en el chat de esta sesión. Recomendado: pedir a Amin que rote la contraseña de `trabajador_alumnos` y la llave R2.
  - Borrar `~/Downloads/alumnos (1).json`, a la Papelera.

## Reglas que siguen vigentes
- No tocar los proyectos reales para hacer pruebas.
- Desactivar en vez de borrar.
- No instalar nada sin aprobación.
- Las contraseñas las escribe Luis.
- Decir siempre lo que no se ha comprobado.
