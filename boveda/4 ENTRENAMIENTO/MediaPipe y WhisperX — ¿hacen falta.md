---
tipo: decision-pendiente
actualizado: 2026-11-06
---
# MediaPipe y WhisperX: ¿hacen falta?

No se ha instalado ninguno. Esto es lo que hoy **no** podemos resolver con lo que ya hay, medido en las pruebas del 06-11.

## MediaPipe (pose y cara)
- **Lo que ya cubre lo nuestro:**
  - Vision de Apple (`herramientas/qc/caras`, compilado aquí sin instalar nada) detecta la cara de Amin con confianza 0,87–0,92, en su bruto y en su edición;
  - con eso funcionan las comprobaciones de colisión con la cara.
- **Lo que añadiría MediaPipe:** la línea de los hombros y la del pelo, para encuadres medidos tipo "Talking Head Explainer" (cara centrada en el cuello, el pelo 100 px bajo la mitad).
- **Alternativa sin instalar:** Vision también trae pose del cuerpo y puntos de la cara; está sin probar.
- **Recomendación:** **no instalar.** Si algún día usamos los encuadres medidos, probar antes la pose de Vision.

## WhisperX (alineado palabra a palabra)
**Problemas reales encontrados hoy con Whisper small:**
1. **La transcripción guardada del bruto IMG_6887 no coincide con la voz de Amin:**
   - en 20–26 s colocaba "te tiene justo 10 horas en el gimnasio…" mientras el audio está en silencio (−80 dB);
   - en 8,5–17,5 s lo que Amin dice de verdad es charla ("vamos, espera, dame una segunda…").
   - Probablemente transcribe la voz baja de apuntador. Un gráfico sincronizado con eso (piloto 02 v2) caía sobre palabras inexistentes.
2. **Tiempos estirados:** "gimnasio" de 10,5 a 14,96 s (4,5 s para una palabra).
3. **Sincronía ±2 fotogramas no medible:**
   - en la edición final (voz continua con música), las 5 palabras del piloto 02 quedaron **NO VERIFICADAS**;
   - el arranque de voz solo se mide bien cuando hay silencio delante.
4. **Cortes:** el nivel en el punto de corte sí se mide bien con el audio (detectó el corte en plena voz), pero **qué palabra se corta** depende de la transcripción y queda orientativo.

**Lo que aportaría WhisperX:**
- límites de palabra alineados con el audio (wav2vec2), con un error típico de decenas de milisegundos;
- con eso la sincronía de ±2 fotogramas pasaría de "no verificada" a medida, y el aviso de corte nombraría la palabra correcta.

**Lo que NO arregla:** la voz de apuntador seguiría ahí. Ese problema se resuelve aparte (separar voces o transcribir solo por encima del umbral de la voz de Amin).

**Coste:**
- instalación pesada: entorno Python con torch y modelos de ~1–3 GB;
- más tiempo de transcripción.

**Propuesta:** una prueba aislada (entorno aparte con `uv`, sin tocar lo existente) sobre los mismos 5 audios del piloto 02, comparando las 5 palabras con Whisper small. Se instala solo si mide la sincronía donde hoy no podemos. **Necesita tu aprobación.**
