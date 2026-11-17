---
tipo: guía de uso
fecha: 2026-11-15
estado: propuesta · para que Luis la corrija
---
# Cómo trabajar con Opus para que edite bien y aprenda

Sale del vídeo de Álvaro («lunes nada de pan», reedición v1) y de tus correcciones (`3 PROYECTOS/Alumnos Trainer10x/PLANES/alvaro/auditoria-v1/CORRECCIONES DE LUIS (15-11).md`).

## 1. Por qué no te gustó (qué falló de verdad)
| Lo que notaste | La causa | De quién es el fallo |
|---|---|---|
| No usó las referencias de Miro (tarjetas tipo Apple, pantalla tipo VR) | El tablero solo se miró de lejos (zoom del 2–6 %). La columna ANIMACIONES EN PANTALLA nunca se estudió pieza a pieza: Opus no podía usar lo que no está escrito | Del sistema |
| Gráficos planos (píldoras con ✕ y ✓) | Se dibujaron con un script de imágenes fijas, no con las herramientas de animación (HyperFrames, Remotion, After Effects), y se saltó el paso 5: enseñarte un fotograma de diseño antes de animar | De Opus (saltó una parada) |
| La pintura no pega con la estética | Se heredó del vídeo del motor sin preguntarse si tenía función. La regla «cada recurso necesita un motivo» ya existía | De Opus |
| Sonido pobre y sin música | 3 archivos repetidos 15 veces; no se cargó la skill `real-sfx`; no te propuso las 3–5 músicas que pide el paso 7 | De Opus (saltó el paso) |
| Sin gancho de entrada | No se cargó la skill `direccion-viral`. Además, tu gusto (zoom out + whoosh, riser o boom) no estaba escrito en ningún sitio | Mitad y mitad |
| Sin cortes en J y en L, sin zoom en el remate | No hay ninguna regla que lo pida | Del sistema |
| Estética que no encaja con un sketch | El estilo «11 Fitness con pruebas» sale de vídeos hablados de Nippard. No hay formato para sketch de humor | Del sistema |

Resumen: tres fallos son de disciplina (Opus se saltó pasos cuando dijiste «edita el vídeo») y cuatro son huecos del sistema. Los dos se arreglan de forma distinta: los primeros con cómo le hablas (§ 2), los segundos escribiendo lo que falta (§ 5).

## 2. Un vídeo = 4 mensajes, nunca uno
Si le dices «edita el vídeo», lo hace todo de golpe y elige él. Dale un paso por mensaje y no pases al siguiente sin tu «sí». Copia y pega:

**Mensaje 1 · plan (sin construir nada)**
```
Vídeo: <alumno y título>. Carga editor-maestro y haz solo los pasos 1 a 3.
En tu respuesta dime: qué skills has cargado, qué formato y estilo eliges y por qué,
y qué referencias has mirado (con su id del banco de criterio o su columna de Miro).
Para ahí y enséñame plan.html. No construyas nada.
```
**Mensaje 2 · diseño en parado**
```
Plan aprobado con estos cambios: <pega «Copiar plan»>.
Haz el paso 5: un fotograma de diseño por escena sobre un fotograma real del vídeo.
Para cada gráfico dime a qué referencia se parece. No animes nada todavía.
```
**Mensaje 3 · construir y sonido**
```
Diseño aprobado. Construye, y enséñame primero solo el gancho (los 3 primeros segundos).
Sonido con la skill real-sfx. Tráeme 3 músicas de 10 s y di qué emoción busca cada una.
```
**Mensaje 4 · auditoría**
```
Dame la auditoría con casillas. Añade arriba una tabla «paso · skill cargada · hecho o saltado»
y todo lo que no hayas podido comprobar.
```

## 3. Tres preguntas que lo delatan
Antes de aprobar cualquier paso, mira si su mensaje contesta esto. Si falta una, devuélvelo.
1. **¿Qué skills cargaste?** Si no nombra `editor-maestro`, `criterio` y la del estilo, no las usó.
2. **¿A qué referencia se parece cada gráfico?** Sin referencia nombrada, se lo ha inventado.
3. **¿Qué no comprobaste?** Si dice que todo está bien, no ha mirado.

## 4. Cómo corregir para que aprenda
- Corrige en la página de auditoría, escena por escena, como hiciste hoy. Di **qué harías tú**, no solo «no me gusta»: «tarjetas tipo Apple arriba» enseña; «feo» no.
- Si la corrección vale para todos los vídeos, escribe «siempre» o «general». Si es solo de ese vídeo, no pongas nada.
- Cada corrección entra como PENDIENTE en `4 ENTRENAMIENTO/PROPUESTAS DE REGLAS.md`. **Solo aprende cuando tú la apruebas:** una vez por semana, dile «enséñame las propuestas pendientes» y contesta sí o no a cada una. Las de hoy son 15-11-L1 a L8.
- Cuando algo te guste, dilo también («esto, siempre así»). Se guarda en el banco de criterio con `criterio.py usar`.
- Cuando no sepa qué hacer, la orden es: «mira Miro, columna X» en vez de dejarle inventar.

## 5. Lo que falta en el sistema (necesita tu sí)
| # | Qué | Por qué | Coste |
|---|---|---|---|
| G1 ✅ hecho 16-11 (faltan TEXTO NORMAL, TEXTO ESPECIAL y documental) | Estudiar Miro pieza a pieza, empezando por ANIMACIONES EN PANTALLA, HOOK y CTA, y guardar cada pieza en el banco de criterio | Es la causa principal de hoy | Una sesión con tu Chrome abierto en el tablero |
| G2 | Crear el formato «sketch de humor» (dos personajes, remate, zoom en el chiste) | Los alumnos graban sketches y solo hay estilo para vídeo hablado | Necesito 3–5 referencias tuyas |
| G3 | En `editor-maestro`: «edita el vídeo» no salta las paradas 3 y 5; el paso 7 (real-sfx + 3 músicas) es obligatorio; cada entrega lleva la tabla de skills cargadas | Cierra los tres fallos de disciplina | 15 minutos |
| G4 | Aprobar o rechazar L1–L8 (cortes en J y L, gancho con zoom out y sonido, zoom en el remate, nada fuera de la estética…) | Hasta entonces no son reglas | 5 minutos tuyos |

## 6. Qué modelo para qué
- **Plan, dirección creativa, diagnóstico y escribir skills:** el modelo más capaz que tengas (hoy Fable). Aquí se decide si el vídeo sale bien.
- **Construir con el plan y el diseño ya aprobados:** Opus sirve, con los mensajes del § 2.
- Sesión nueva por etapa. Una sesión larga pierde el detalle de las skills al resumirse; la de Álvaro se resumió varias veces.
