---
name: lote-alumnos
description: Editar en lote los vídeos pendientes de los alumnos de Trainer10x con scripts que no gastan tokens - listar pendientes y duplicados del panel, bajar brutos, transcribir, montar subtítulos/gráficos/cierre desde un spec.json, sonido real + música + master, y generar la página de auditoría con «Copiar correcciones». Usar cuando Luis diga «edita los pendientes», «haz el lote», «qué hay pendiente en Trainer10x», «rehaz este alumno», o al corregir un vídeo hecho con este sistema.
---

# Lote de alumnos Trainer10x (creada 17-11-2026 a petición de Luis: «aprende lo repetitivo y hazlo sin tokens»)

Los scripts hacen el trabajo mecánico; el modelo solo decide (corte, frases, elementos) escribiendo un `spec.json`.
Herramientas: `~/Videos-Remotion/alumnos/` (copia estable; el lote 17-11 usa la suya en `PLANES/lote-1711/`). `preparar.sh` trabaja en la carpeta del lote: `LOTE=<carpeta> ~/Videos-Remotion/alumnos/preparar.sh carpeta:id`.
Python de render: `~/Videos-Remotion/herramientas/entornos/whisperx/bin/python` (PY).

## Flujo (tokens solo en los pasos marcados con ✍️)
1. `uv run -q --with "psycopg[binary]" python panel.py pendientes` → tabla con avisos: PRUEBA, SIN BRUTO, MISMO BRUTO QUE UNO ENTREGADO, TÍTULO YA ENTREGADO (pista, no veredicto: Lorena tenía 3 clips distintos con el mismo título).
2. `./preparar.sh carpeta:video_id …` → `bruto.*`, `ficha.json` (alumno, @instagram, título, nota, guion) y `prep/` (palabras verificadas + hojas a 2 f/s). En segundo plano.
   - Voz muy baja (Marc, −46 dB): la transcripción sale a trozos → `~/Videos-Remotion/voz/transcribir.sh bruto --ganancia 18 --modelo large-v3` y COPIAR al momento `salida-whisperx/bruto.verificada.json` (el nombre se pisa entre vídeos).
   - Preguntas de otra persona fuera de cámara: medir la envolvente del audio para fijar sus tramos (la transcripción las marca poco fiables).
   - `preparar.sh` ya detecta solo la transcripción rota (nivel mediano < −30 dB, fiables < 60 % o 5 palabras repetidas ≥ 4 veces) y la repite con large-v3 (+ganancia); la 1.ª queda en `prep/palabras_whisper1.json`.
3. ✍️ Mirar hojas + palabras y escribir `spec.json` con `"tiempos": "bruto"` (todo en segundos del bruto, como en palabras.json y las hojas; el generador lo lleva al montaje). Ya no hace falta `hacer_spec.py`.
   - `PY reel_alumno.py spec.json frases` → borrador de frases (cortes, claves y anclas @) para pegar y retocar: ahorra escribirlas.
   - Tarjetas/píldoras con `"x": "auto", "y": "auto"` → `PY reel_alumno.py spec.json colocar` (tras `base`) usa `componer.py`: no tapa cara ni subtítulos; deja `colocacion.json`.
4. `PY reel_alumno.py spec.json subs` (comprobar alineado) → `base` → `anim f1,f2,…` (prueba) → mirar → `anim` → `hoja`.
5. `python3 sonido.py spec.json todo` → MEDIA/<alumno>/«… v1 lote (música).mp4» y «(sin música)» a −14 LUFS + `critica_sfx.md`.
5b. `python3 verificar.py` → OK/FALLA por vídeo (1080×1920, 30 fps, duración = corte, −14 LUFS, TP ≤ −1, sin negros, hoja). Un OK no aprueba nada: mirar la hoja.
6. Añadir el vídeo a `auditoria.json` → `python3 auditoria.py` → enlaces duros de los MP4 en `videos/` → `python3 servir.py <lote> 8765 --abrir` → http://localhost:8765/auditoria.html.
   OJO: abierta como file:// o con `python -m http.server` los vídeos NO se ven en Safari (sin rangos 206). Usar siempre `servir.py`.
7. Subir al panel: solo con orden de Luis. `panel.py subir_lote <lote>` (en seco: dice qué haría) → con `--si` sube los que pasan `verificar.py` a «Para revisar». Entregar al alumno: nunca sin su orden.

## spec.json (lo esencial)
- `tramos` (s del bruto), `palabras`, `hdr` (iPhone HLG → tonemap), `audio: "ninguno"` (vídeos sin voz), `ganancia_db`.
- `marca`: bueno/malo/clave_font (sequel|montserrat|playfair|poppins), `usuario` (@ del panel: tabla `t10x.clientes.instagram`), rol.
- `frases`: literales de lo que DICE (nunca parafrasear: se desalinea). `*clave*` color bueno, `*!clave*` malo, `*~clave*` crema. Lo que va tras la clave se une a la línea de la clave. `?texto` = pregunta de otra persona (caja blanca). `@t|` ancla la frase a un tiempo del montaje (obligatorio tras cada pregunta y en saltos de toma). `frases_desde` para empezar tarde. `sin_subs` para tramos donde el gráfico ya es el texto.
- `elementos`: `titulo` (gancho), `tarjeta` (emoji + texto, `marca` si/no, `blanca`), `pildoras` (✓/✕ o `emoji`), `columnas` (alimento flota arriba al nombrarlo y vuela a su columna con `t_col`, rodeando la cara), `texto` (vídeos sin voz), `pill`, `cta` (@ + botón que cambia en `t_clic`).
- `zooms` [t0,t1,z], `transiciones` [t] (zoom + desenfoque), `cara_y`, `sub_y`, `degradado_*`, `sombra*` (fondo claro: subir), `musica`, `musica_desde`, `ganancias` por tipo de efecto.

## Lecciones del lote 17-11 (propuestas, no reglas)
- Fondo claro + color de marca pastel (coral de María) no se lee: degradado 235 desde 0,52 y sombra 255.
- Clics de píldoras quedan inaudibles bajo la voz: +8 dB; whoosh −4; `--sfx-trim-db −4` con voz.
- Pops repetidos bajan la variedad: rotar entre 9 grabaciones (`sonido.py` lo hace solo).
- Elementos que viajan no cruzan la cara (curva por el lado).
- zsh: no meter órdenes en variables ni hacer `set -- $par`; usar los scripts.
- Pedido del alumno que exige fotos de internet (productos de Mercadona): preguntar antes de descargar; no sustituir en silencio.
- Fotos de Mercadona (permiso de Luis 17-11): navegador integrado en `tienda.mercadona.es/search-results?query=…` (rechazar cookies), leer `.product-cell img` y bajar `prod-mercadona.imgix.net/images/<id>?fit=crop&h=600&w=600` a `_fotos-mercadona/`. En el spec: `"img"` en items de `columnas` y en `tarjeta`. Personas reales de internet: no.
- Zoom largo = reencuadre (ejercicios pequeños en plano): no lleva golpe (el generador solo pone golpe en zooms < 1,5 s).
- Transcripción con frases repetidas en bucle o voz < −40 dB: repetir con `--modelo large-v3` (y `--ganancia`).
- Un alumno que se contradice (palomitas «engordar porque son poco calóricas»): cortar la frase o preguntar, y decirlo en la auditoría.
- Fotos de Mercadona sin navegador: NO es posible (su buscador va tras protección antibots). Seguir con el navegador integrado.
