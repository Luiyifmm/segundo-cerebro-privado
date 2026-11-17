# El MCP de After Effects (23d1/after-effects-mcp) — cómo instalarlo y usarlo bien

> Se instala clonando github.com/23d1/after-effects-mcp en la carpeta de usuario (`~/after-effects-mcp`), con `npm install` y `npm run build`, y se registra con `claude mcp add --scope user after-effects -- node "<ruta>/dist/index.js"` (comprobarlo con `claude mcp list` y, con AE abierto, con `npm run doctor`). No moverlo después. No tiene panel en AE: cada orden se guarda como .jsx, se lanza con `AfterFX.exe -r` y el resultado vuelve por un archivo.
> - Necesita AE abierto con un proyecto y *Allow Scripts to Write Files and Access Network* activado.
> - **No instalar ningún otro MCP de After Effects.** Si hay otro MCP de After Effects instalado, avisar al usuario: solo debe haber uno.

## Herramientas
| Grupo | Herramientas |
|---|---|
| proyecto | `ae_status` · `ae_project_info` · `ae_open_project` · `ae_save_project` · `ae_import` · `ae_undo` |
| comps | `ae_list_comps` · `ae_comp_info` · `ae_create_comp` · `ae_set_comp_settings` · `ae_set_time` |
| capas | `ae_add_layer` · `ae_set_layer` · `ae_set_text` · `ae_layer_op` · `ae_select` |
| animación | `ae_set_keyframes` · `ae_set_property` · `ae_get_property` · `ae_set_expression` · `ae_remove_keyframes` |
| efectos | `ae_search_effects` · `ae_apply_effect` · `ae_list_effect_params` · `ae_remove_effect` |
| salida | `ae_save_frame` (devuelve la imagen) · `ae_render` · `ae_render_templates` |
| comodines | `ae_run_script` · `ae_exec_menu` · `ae_list_fonts` |

## Reglas de uso
1. **Empezar con `ae_status`.**
   - Si AE no está abierto, pedir al usuario que lo abra con un proyecto.
   - Si el proyecto abierto tiene cambios sin guardar, no cerrarlo ni descartar nada.
   - **Si el proyecto abierto no es el nuestro (el usuario está trabajando en lo suyo), no tocarlo:** ni sondas, ni capas temporales, ni abrir otro proyecto sin preguntar.
2. **Construir con `ae_run_script`:** una librería + un script por escena + scripts de arreglo pequeños.
   - El cuerpo corre dentro de una función: devolver datos con `return` (con `$.evalFile`: `return $.evalFile(...)`).
   - Los datos entran por `args` y llegan como `ARGS`. Textos con tildes y rutas, siempre por `args`.
   - **`undoLabel` en todo lo que cambie algo** (un Ctrl+Z lo deshace entero). `timeoutSeconds` para lo largo (máx. 3600).
   - Librerías: `$.evalFile(new File(ARGS.lib))`. Las funciones cargadas DENTRO de otro script no se ven desde fuera: volver a cargarlas.
   - **Guardar el proyecto al final de CADA script.**
3. **Mirar lo que se hace:** `ae_save_frame {comp, time (en segundos), maxSize}` después de cada cambio importante.
   - El fondo de la comp sale transparente; si hace falta, poner un sólido.
   - Para varios fotogramas de una vez: `scripts/ver_fotogramas.jsx` (`saveFrameToPng` es asíncrono: esperar a que existan los PNG).
   - El tiempo, en segundos (un texto como `"149f"` entre comillas dio "NaN").
4. **Una sola orden a la vez:** nada de herramientas de AE en paralelo, tampoco para mirar.
5. **Las ventanas modales cuelgan el MCP** (todas las órdenes dan timeout):
   - nunca `alert`, `confirm` ni `prompt`;
   - nunca palabras reservadas como clave de objeto (`in`, `super`, `class`…): abren "Illegal use of reserved word";
   - probar cada plugin nuevo solo y aparte;
   - crear las carpetas antes de `saveFrameToPng` o `ae_render`;
   - si todo da timeout, pedir al usuario que mire AE y **que lea el texto de la ventana antes de cerrarla**.
   - Con permiso del usuario, el control de pantalla vale **solo dentro de AE** para leer y cerrar sus ventanas (avisar antes y al terminar).
6. **Una orden que dio timeout porque AE estaba ocupado se ejecuta igual más tarde:** mirar `ae_status` antes de repetirla.
7. **Render:** `ae_render` falla si el archivo existe, salvo con `overwrite: true`. Ver `render-y-entrega.md`.
8. **ExtendScript es ES3:** sin `let`/`const`, sin flechas, sin JSON, sin `forEach`/`map`/`indexOf` de arrays, sin `Object.keys` ni `trim`. **Tope en todos los `while`**: un bucle infinito colgó AE y hubo que cerrarlo a la fuerza.
9. Si algo deja de responder: `npm run doctor` en la carpeta del MCP dice qué paso falla.

## Control de pantalla (computer-use)
- Solo en After Effects y solo con permiso (concedido el 01/10/2026 para ventanas de AE, Element 3D, Roto Brush / Object Matte, el rastreador, presets y Optical Flares).
- Mientras se controla, el usuario no puede usar el PC: avisar antes de empezar y al terminar, y soltarlo en cuanto acaben los clics.
- Lo que se pueda hacer por script, por script (más rápido y exacto).
