# Contrato de BD para el trabajador del Mac de Luis

**Solo la Sala de edición** (esquema `edicion`), por decisión de Amin del 31-10. Otros esquemas: permiso denegado.
Rol `trabajador_luis` (permisos exactos en `rol_trabajador_luis.py`). La cadena de conexión no está aquí: Amin te la pasa en mano.
El formato de entrega lo decides tú: Claude 1 aplica lo que pidas en un issue de este repo.
Mientras el agente del Mac de Amin siga encendido, los dos leéis la misma cola: **coge siempre con `FOR UPDATE SKIP LOCKED` en una sola sentencia.**

## Qué puedes hacer

| Tabla | Leer | Escribir |
|---|---|---|
| `edicion.items` | todo (brutos, entregas, correcciones, referencias, reglas) | INSERT solo `tipo='entrega'`; UPDATE solo brutos, entregas y correcciones (RLS) |
| `edicion.versiones` | todo | INSERT y UPDATE |
| `edicion.entreno` | todo (lo que Amin enseña en la Sala) | — |

No se puede borrar nada, ni crear o alterar tablas. Para rehacer, crea una versión nueva (`numero` + 1) en vez de borrar.
`autor` es clave foránea a `edicion.usuarios`: usa `'editor'` o déjalo en NULL.

## Coger trabajo

```sql
-- Bruto 'en cola' sin datos.auto → 'editando' → 'entregado'
UPDATE edicion.items SET estado='editando', datos = datos || '{"auto":"luis"}', updated_at=now() WHERE id = (
  SELECT id FROM edicion.items WHERE tipo='bruto' AND estado='en cola' AND coalesce(datos->>'auto','')=''
  ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED)
RETURNING id, datos;
```

## Lo que hace hoy la Sala de Amin (para que diseñes encima)

- Una entrega sin `datos.editor` se ve sin el botón «Abrir en el editor»; si lleva `datos.url`, sale el enlace (sirve para descargar el final).
- Con `datos.editor.base` en `https://…/`, el editor de la Sala lee `p/<entrega>/X` de `base + X` (sala-edicion PR #2). `r2:` no está soportado.
- El agente de Amin solo renderiza versiones en `estado='pedido'`, y nunca las de entregas con `datos.editado_por='luis'`: esas las renderizas tú.
- `qc_versiones.py` se salta las versiones cuyo `archivo` no está en el Mac de Amin (una URL, por ejemplo): no borra tu `qc`.
- Las correcciones de Amin son `items` con `tipo='correccion'`. Puedes leerlas y cerrarlas (`estado`, `respuesta`).

## Cosas del agente de Amin que te afectan (mientras esté encendido)

- Los brutos con `datos.auto='trabajando'` y más de 2 h vuelven a la cola. Con `"auto":"luis"` no los toca, pero si tu trabajador se cae, se quedan ahí: devuélvelos tú.
- Las versiones en `estado='renderizando'` vuelven a `pedido` cada minuto, salvo las de tus entregas (`editado_por='luis'`).
- Interruptores del Mac de Amin: `LUIS-EDITA-REELS` (deja de coger brutos de reel) y `LUIS-EDITA-CLIPS` (deja los de clips). Claude 1 los crea cuando Amin diga «enciende».
