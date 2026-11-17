# Composición con la persona (fase 6, 07-11-2026)

**Para qué:** proponer dónde colocar imágenes, tarjetas o gráficos junto a Amin (o cualquier persona). Tiene en cuenta la cara, el cuerpo, el gesto de señalar, el espacio libre, los subtítulos y la zona segura. **Solo propone: no toca ningún vídeo ni proyecto.**

## Piezas
- **`sujeto`** (Swift + Vision de Apple, sin dependencias ni instalaciones). Por imagen devuelve:
  - caras con su giro (yaw);
  - puntos del cuerpo (19 articulaciones);
  - manos (21 puntos), con qué dedos están extendidos y la dirección del índice cuando señala;
  - la silueta de la persona (caja + ocupación en rejilla 12×20).
  - **Compilar:** `swiftc -O -sdk /Library/Developer/CommandLineTools/SDKs/MacOSX26.5.sdk src/sujeto.swift -o sujeto`. El SDK 27 no casa con el Swift 6.3 instalado. El binario no se versiona.
- **`componer.py`** busca las mejores cajas:
  - `python3 componer.py <vídeo|imagen> --t 1.2,3.4 --caja 310x465 --subs 0.53-0.64 --hoja h.png --json p.json`
  - `--caja` en unidades de 1080×1920 (se escala solo a 4K).
  - `--subs` = franja de subtítulos en fracción del alto. Medirla en un fotograma real: con MOGRT v12 a y 0,4375 ≈ 0,53–0,64.

## Reglas que aplica
1. **Duras:**
   - dentro de la zona segura de la ficha (x 70–1010, y 250–1620 en 1080);
   - sin pisar la cara (+40 px) ni el pelo;
   - sin pisar la franja de subtítulos;
   - **sin tapar la mano que señala**.
2. **Gesto fiable** = índice extendido y los otros tres dedos recogidos, mano por encima de los hombros o brazo separado del torso, y visto en ≥ 2 de 3 fotogramas (instante y ±0,3 s).
   - Con gesto, premia el **rayo del dedo**: poca distancia lateral, entre 80 y 560 px de la punta y **por encima de la punta** si señala hacia arriba («que parezca que la señala»).
   - Si no cabe al 100 %, prueba al 90/80/70/60 % y lo dice.
3. **Sin gesto fiable:** composición equilibrada junto a la cabeza, algo por encima de los ojos, y marca **REVISAR**. No inventa direcciones.
4. **Penaliza** tapar el cuerpo y alejarse de la cabeza.

## Pruebas (07-11, entrenamiento 6118)
- **Antes/después:** `3 PROYECTOS/_PRUEBAS CLAUDE/entrenamiento-6118/composicion/ANTES-DESPUES composicion 6118.jpg`.
  - Fotogramas reales de Premiere (pista de tarjetas desactivada un momento y vuelta a activar).
  - **Antes:** tarjetas fijas a los lados; una tapaba la mano que señala.
  - **Después:** cada imagen donde apunta el dedo, encima de la punta.
  - Coste: imágenes más pequeñas (60–90 %) en ese encuadre al 135 %.
- **Falsos positivos corregidos:** manos juntas jugando con el micro se leían como «señalar».
  - 1.ª versión: 2 de 2 falsos.
  - Tras exigir mano levantada y gesto repetido: 0 falsos, y los 3 gestos reales detectados 3/3.
- **Hallazgo:** la edición del usuario de 6118 está **volteada en espejo**, porque Vision ve la mano contraria en el mismo gesto. Así Amin señala la imagen «noche» a la izquierda. Probable, no confirmado.

## Límites
- La mirada no se usa: el giro de la cara (yaw) sale, pero Amin mira a cámara casi siempre (±3°).
- Señalar con dos dedos o con la palma no se reconoce como señalar.
- Con plano muy cerrado puede no haber sitio («SIN SITIO»). Entonces hay que abrir el plano, moverlo o cambiar el recurso.
- MediaPipe sigue experimental y no se usa aquí.
