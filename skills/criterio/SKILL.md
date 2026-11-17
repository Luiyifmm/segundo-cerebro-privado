---
name: criterio
description: Analiza un vídeo (referencia o propio) y saca el criterio de edición - qué RECURSO se usó para explicar qué IDEA y POR QUÉ se explicó así - y lo guarda en el banco de criterio para decidir las escenas de vídeos futuros. También consulta ese banco al planificar. Usar cuando el usuario diga «analiza este vídeo», «saca el criterio», «por qué funciona este vídeo», «qué recurso usarías para…», «añade esto al banco», al estudiar una referencia nueva, y SIEMPRE al hacer un plan de escenas (consultar antes de proponer).
---

# Criterio: qué recurso explica qué idea, y por qué

El criterio de un editor es saber, ante una frase, **qué enseñar y por qué eso y no otra cosa**. Aquí se acumula en un banco, vídeo a vídeo, para no decidir de cero cada vez.

- Banco: `~/EDICION/0 CLAUDE EDITOR/11 BANCO DE CRITERIO/` → `BANCO.md` (para leer; se genera solo) y `banco.jsonl` (los datos).
- Herramienta: `python3 ~/Videos-Remotion/sistema/criterio.py` (`ideas` · `buscar` · `ver` · `analizar` · `anadir` · `detallar` · `usar`).

## A. Analizar un vídeo (aprender)
1. `criterio.py analizar "<vídeo>" --nicho <fitness|negocios|…>` → deja en `11 BANCO DE CRITERIO/analisis/<nombre>/` la transcripción, las hojas (2 fotogramas por segundo) y `ficha.md` con un plano por fila.
2. **Mirar las hojas** (obligatorio: sin mirar no hay análisis) y agrupar los planos en escenas.
3. Por cada escena que enseñe algo, responder cinco preguntas, en este orden:
   - **Idea:** ¿qué tipo de cosa se está diciendo? Una palabra del vocabulario (`criterio.py ideas`): gancho, mito, desmentido, cifra, comparacion, proceso, pasos, enumeracion, abstracta, quien, objeto, tecnica, pauta, prueba, palabra, transicion, moraleja, cta, estructura.
   - **Recurso:** ¿qué se puso en pantalla? Con nombre corto y reutilizable («Barras que crecen», no «la escena del segundo 7»).
   - **Cómo se ve:** una línea que permita rehacerlo (fondo, dónde va el texto, cuánto dura, cómo entra).
   - **Por qué así:** qué gana el espectador con ESTE recurso frente al más simple (un subtítulo). Si no sé decirlo, no entra al banco.
   - **No usar si…:** el caso en que este recurso sobra o engaña.
   Y, para los recursos que vayamos a reutilizar, el **acabado** (cinco campos más; se añaden con `criterio.py detallar`):
   - **color:** qué color lleva cada parte y por qué ese (acento claro u oscuro, crema, aviso);
   - **textura:** sombras, degradados, grano, vidrio, brillo, desenfoque;
   - **letras:** familia, peso, mayúsculas, cuánto se juntan;
   - **palabras:** cómo se colocan (apilado, en línea, escalera, superpuesto, caja, píldora), cuál es la especial y dónde va el bloque;
   - **sonido:** qué efecto suena al entrar y en qué instante. Se mide, no se supone: `mcp__earshot__timeline` sobre el vídeo, con los segundos de cada escena en `cues`. Guía en el libro de reglas del estilo 10, apartado H5 (pop = objeto, whoosh = movimiento, nota tonal = dato, golpe = énfasis).
4. Escribir `entradas.json` en esa carpeta y `criterio.py anadir entradas.json`. Campos obligatorios: `idea`, `recurso`, `porque`, `fuente` (vídeo + segundo). Recomendados: `como`, `cuando_no`, `nicho`, `dice` (la frase). Acabado: `color`, `textura`, `letras`, `palabras`, `sonido`.
5. Decir al usuario cuántas entradas nuevas hay y cuáles son las 2–3 que más cambian cómo editaríamos.

**Qué NO se apunta:** el A-roll con subtítulo normal cada vez que aparece; un recurso idéntico a uno que ya está (se apunta solo si la razón es distinta); nada que no haya visto en las hojas.

## B. Consultar al planificar (usar)
Antes de proponer la escena de una línea del guion:
1. Clasificar la línea con una idea del vocabulario.
2. `criterio.py buscar --idea <idea> [--nicho <nicho>]` (o `buscar <palabra>`). Salen primero los ✅ aprobados, luego los 🧪 probados, luego los 👁 vistos.
3. Elegir uno y escribir en el plan el **motivo** con el «por qué» del banco, adaptado a la frase. Si ninguno encaja, proponer A-roll con texto: un recurso sin motivo no entra.
4. Citar el id (`c012`) en la propuesta para poder seguirle la pista.

## C. Cerrar el círculo (cómo crece el criterio)
| Pasa esto | Orden |
|---|---|
| Usé un recurso del banco en un vídeo propio | `criterio.py usar c012` |
| Luis lo aprobó tal cual | `criterio.py usar c012 --resultado aprobado` |
| Luis lo corrigió | `criterio.py usar c012 --resultado corregido` y anotar qué cambió en `4 ENTRENAMIENTO/PROPUESTAS DE REGLAS.md` |
| Luis lo quitó porque no aporta | `criterio.py usar c012 --resultado descartado` (deja de salir en las búsquedas) |
Un recurso ✅ aprobado dos veces en el mismo tipo de idea es candidato a regla del estilo (propuesta, nunca directo).

## D. Criterio frente a auditoría
- **Criterio (siempre):** se consulta en cada plan y se alimenta con cada referencia. Es barato: una búsqueda.
- **Auditoría del estilo (solo cuando hace falta):** medir un vídeo terminado contra las 16 reglas. Se hace únicamente si se cumple alguna de estas:
  1. es el **primer vídeo** de un estilo o de un cliente;
  2. Luis o el cliente **devolvieron el vídeo** con correcciones de fondo;
  3. el vídeo **rindió claramente peor** de lo normal y se quiere saber por qué;
  4. Luis lo pide («audita este»).
  En los demás vídeos basta el QC técnico y mirar la hoja. No auditar por rutina.

## Errores a evitar
- Describir lo que se ve sin decir por qué: eso es un inventario, no criterio.
- Apuntar como regla lo que salió en un solo vídeo: en el banco todo nace 👁.
- Copiar un recurso sin su condición: leer siempre «no usar si…».
