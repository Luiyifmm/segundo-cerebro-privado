# Fase 6: informe (07-11-2026): composición visual y dirección colaborativa

**Lo que no he hecho:**
- No he tocado tus proyectos originales.
- No he sobrescrito entregas.
- No he instalado nada: Vision viene con macOS y compilé contra un SDK que ya estaba en el equipo.
- No he añadido estilos a la biblioteca.
- **No he montado la ronda 3:** está en dirección creativa, esperando tus respuestas.

## 1. Correcciones aprendidas (confirmadas y registradas)
Están en «Lecciones generales» › Gráficos y en el REGISTRO, y resumidas en el director.
- **Efectos con intención.** Antes de un destello, impacto, zoom, transición o animación, responder cinco cosas:
  1. qué idea refuerza;
  2. qué emoción busca;
  3. qué se pierde sin él;
  4. si encaja con el estilo y el ritmo;
  5. si el acabado tiene calidad.
  - Si no aporta, no entra. En la duda, montaje limpio y buena imagen.
  - Origen: los destellos de los ejercicios de la fase 5.
- **Composición con la persona.** Antes de colocar imágenes, revisar cara, cuerpo, mirada y gestos, espacio libre y subtítulos.
  - Si Amin señala, la imagen va **donde apunta y algo por encima del dedo**, sin tapar la mano.
  - Sin gesto fiable, composición equilibrada y **REVISAR**; nunca se inventa la dirección.
  - Nada de posiciones fijas. Se comprueba con fotogramas reales de Premiere.

## 2. Receta nueva de composición
Está en `~/Videos-Remotion/herramientas/composicion/` (LEEME, `sujeto` en Swift + Vision, `componer.py`).
- **Qué analiza `sujeto` (Vision de Apple):** caras con su giro, 19 puntos del cuerpo, 21 puntos de cada mano (qué dedos están extendidos y hacia dónde apunta el índice) y la silueta de la persona.
- **Qué hace `componer.py`:** propone las 3 mejores cajas con su motivo y una hoja visual. **Solo propone, no aplica nada.**
  - **Reglas duras:** zona segura, cara y pelo, subtítulos, mano que señala.
  - **Gesto fiable:** índice extendido, mano levantada o brazo separado del cuerpo, visto en 2 de 3 fotogramas y que **no apunte a su propia cara**.
  - Si no cabe, reduce la tarjeta (90 → 60 %) y lo dice.
- **Pruebas y ajustes:**
  1. Proponía el lado contrario al gesto cuando no había sitio → ahora reduce el tamaño en el lado que señala.
  2. Una propuesta tapaba la mano que señala → prohibido.
  3. Ponía las tarjetas sobre la cabeza → ahora se mide la distancia al rayo del dedo y se protege el pelo.
  4. Leía como «señalar» las manos juntas jugando con el micro (2 falsos de 2) → 0 falsos y 3/3 gestos reales.
  5. En 6122, Amin tocándose la sien contaba como señalar → excluido.

## 3. Pruebas visuales antes/después
Archivo: `3 PROYECTOS/_PRUEBAS CLAUDE/entrenamiento-6118/composicion/ANTES-DESPUES composicion 6118.jpg` (copia en la biblioteca, `ejemplos/composicion/`). Son fotogramas reales de Premiere de mi secuencia 6118; desactivé la pista de tarjetas un momento y la volví a activar.

![[8 BIBLIOTECA DE ESTILOS/ejemplos/composicion/ANTES-DESPUES composicion 6118.jpg]]

- **Antes:** tarjetas fijas a los lados de la cabeza. En el primer fotograma, la tarjeta tapa la mano con la que Amin señala.
- **Después:** cada imagen está donde apunta su dedo y por encima de él. Amin señala «noche» a la derecha y «vida» a la izquierda.
- **Coste:** las imágenes salen más pequeñas (60–90 %) en ese encuadre al 135 %. **Necesita tu ojo:** ¿prefieres imágenes más grandes aunque no estén justo en el gesto, o abrir un poco el plano?
- **Hallazgo:** tu edición de 6118 está **muy probablemente volteada en espejo**. En el mismo gesto, Vision ve la mano contraria. Así Amin señala «noche» a la izquierda, donde pusiste la imagen.
  - Eso explicaría la aparente contradicción con la regla 8: no cambiaste de lado lo malo, sino que lo pusiste donde él señala.
  - **No lo doy por confirmado:** ¿lo volteaste?

## 4. Dirección creativa antes de editar (ronda 3, IMG_6122)
- **BRIEF:** `7 TRABAJOS EN CURSO/ENTRENAMIENTO-6122 · BRIEF.md`, con todo en estado «propuesta»; enlazado a su ESTADO.
- **Análisis:**
  - formato de ronda rápida: Javi pregunta fuera de cámara y Amin da el veredicto (comprobado por la boca);
  - 10 costumbres, moraleja «aparentar frente a invertir» y CTA «comenta RICO»;
  - el veredicto de TikTok (el gancho del guion) no está grabado.
- **Propuesta:**
  - mensaje: «la riqueza se ve en lo que haces con el dinero, no en lo que enseñas»;
  - gancho «pagar a medias»;
  - quitar TikTok, Lamborghini y «quejarse»;
  - ronda ordenada para preparar la moraleja;
  - moraleja limpia;
  - pregunta en texto e imagen literal por costumbre;
  - sin efectos de sonido decorativos.
- **4 preguntas:** gancho, qué quitar, la voz de Javi y el color del veredicto.
- **Resultados del entrenamiento:** pendientes. Se montará después de tu aprobación y se evaluará contra el brief y contra tu edición (que necesito).

## 5. Qué sigue necesitando tu intervención
1. Las 4 respuestas del brief de 6122 y la exportación de tu edición de 6122.
2. Si volteaste 6118 en espejo, y si en Amin se puede voltear el plano para que señale al gráfico.
3. Imagen más grande o más fiel al gesto (sección 3).
4. **Escuchar:** sigo sin poder oír las uniones de corte (4 marcadas).
5. **Las decisiones de marca** (subtítulo, rojo, formato de imagen): siguen pendientes y bloquean el acabado final de Amin.
6. **El gusto visual del acabado:** valido técnicamente, pero tus notas (6/10) dicen que mi criterio todavía no basta sin tu revisión.
