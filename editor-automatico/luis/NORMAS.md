# Normas para los Claude de Amin (Claude 1, Claude 2)

Orden de Amin (31-10-2026): el Claude de Luis dirige la edición, pone las normas y da el feedback. Claude 1 y Claude 2 copian este método y piden permiso antes de cambiarlo, hasta que lo dominen. Si algo de aquí choca con otra nota, manda esto, salvo las reglas fijas de Amin, que mandan sobre todo.

## Reglas fijas de Amin (por encima de todo)
1. Música solo si la elige Amin.
2. Nada tapa la cara.
3. La cifra en pantalla es la que dice la voz.
4. Letra: SF Pro (Display Bold en la línea) + Nyght Serif cursiva en la palabra clave. Rojo `#E5322D` para lo malo y dorado `#F5C542` para lo bueno.
5. Los alumnos (Trainer10x) no se tocan hasta que Amin lo diga.

## Cómo se edita (no hay otro método)
- **Código:** `luis/trabajador.py`. No hay versión «a mano» ni `sala_agente.py` para los reels. Instrucciones del editor en `luis/editor.md`; revisión propia en `luis/revisor.md`.
- **Criterio:** el manual base (`Manual-base-edicion-2026-10-30`) y la skill `edicion-premium` del Claude de Luis.
- **Estilo por defecto: `clave`.** `profundidad` o `cine` si las instrucciones del bruto lo piden.
- **Cada vídeo:**
  1. limpieza de muletillas y repeticiones;
  2. una frase titular con rótulo en el gancho;
  3. insertos que se entienden en menos de 1 s;
  4. revisión de fotogramas y medidas antes de entregar (−14 LUFS, pico ≤ −1,5 dBTP).
- **Entrega:** `decisiones.json` con lo que se hizo y por qué.

## Quién edita qué
| | Coge | Marca |
|---|---|---|
| Mac de Luis (`IDENTIDAD=luis`) | reels en cola sin `auto` y sin `delegar` (o `delegar='luis'`) | `auto='luis'`, entrega `editado_por='luis'` |
| Mac de Amin (Claude 1, `IDENTIDAD=claude1`) | reels con `delegar='claude1'` y, si Luis no está, los que llevan más de 30 min en cola | `auto='claude1'`, entrega `editado_por='claude1'` |
| `sala_agente.py` (Amin) | solo clips de vídeo largo (`LUIS-EDITA-CLIPS` apagado) y renders `pedido` de sus propias entregas | — |

- **Saturación:** con más de `SATURACION` reels en cola (3 por defecto), el Mac de Luis marca los sobrantes con `delegar='claude1'`.
- **Renders `pedido`:** los de una entrega los hace el Mac que la editó (`renders_pedidos`). `sala_agente.py` debe saltarse `editado_por` = `luis` y `claude1`.

## Cómo pedir o proponer
- Cualquier cambio de método, de normas o de código de `luis/` se propone en un **issue** de este repo. **Se espera el «sí» del Claude de Luis** antes de hacerlo.
- **Nunca `main` sin revisión.** Ramas `claude-1/…` o `claude-2/…` con PR. El Claude de Luis revisa los de `luis/`.
- **Si una corrección de Amin choca con estas normas, se aplica la de Amin** y se avisa en un issue para actualizar las normas.

## Feedback
Cada corrección de Amin en la Sala (Correcciones, Entrenamiento) se convierte en una regla con valor, porqué y cómo comprobarla. El Claude de Luis la añade a `luis/editor.md` o a la skill; Claude 1 y Claude 2 la heredan con el siguiente `git pull`.
