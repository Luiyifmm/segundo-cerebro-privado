---
tipo: estado
trabajo: PILOTO-HF
cliente: amin (material de prueba)
actualizado: 2026-11-06
---
# Piloto HyperFrames · 3 pruebas (fase 3)

**Paso actual:** pendiente de tu opinión.
**Dónde está:**
- fuentes editables en `~/Videos-Remotion/hyperframes/piloto/<01|02|03>/index.html` (en git);
- renders, hojas de QC y la secuencia de Premiere "Piloto HF" en `~/EDICION/3 PROYECTOS/_PRUEBAS CLAUDE/` (proyecto de pruebas, nada real).
**Material:** bruto `IMG_6887.MOV` y tu edición `IMG_6887_1.mp4`, ambos solo leídos.

| Prueba | Idea creativa (por qué así) | Versión final | Nota |
|---|---|---|---|
| **01 Blue pill · tipografía cinética** | Panel claro en la mitad de arriba (layout "S" del Talking Head Explainer): la frase sobre su cabeza, nunca sobre la cara. Una sola palabra en azul de Amin, que cae como sello (`slam`), porque es la idea. Etiqueta y losetas de icono que hacen pop y flotan: el "SaaS limpio" del Blue pill sin perder su azul | v2 · `01-blue-pill v2.mov` | 19/25 |
| **02 Explicativo con números y objetos** | La frase "cambiar tu tiempo por dinero" se cuenta como dos modelos: arriba lo que vende (reloj → moneda: 1 h → 30 €), debajo lo que propone (portátil "online" → ×100). Cada objeto llega en su palabra: el número como sello, los objetos con pop, las flechas que se dibujan | v3 · `02-explicativo v3.mov` | 17/25 |
| **03 Collage Vox en azul Amin** | Inserto a pantalla completa: Amin recortado en blanco y negro sobre papel crema con borde blanco, tinta marina y desregistro cian, amarillo SOLO en la flecha final y movimiento a saltos de 12 fps. Es su collage editorial aprobado llevado al lenguaje Vox | v3 · `03-vox-collage v3.mov` | 18/25 |

## Decisiones
- Todas las pruebas usan `animaciones-casa.js` (riseIn / pop / slam / drawOn / float) y el render para Premiere `render-para-premiere.sh`.
- El piloto 02 se rehízo sobre su voz REAL: la transcripción del bruto no correspondía a lo que dice Amin.

## Falta
- Tu opinión sobre las 3 (notas, qué estilo te convence para Amin).
- Si alguna gusta, probarla en un vídeo real de Amin, con tu permiso.

## No comprobado / riesgos
- Sincronía ±2 f: **no verificada** (Whisper small no da precisión de palabra en voz continua).
- No se ha probado con el render a 4K (2160×3840): las pruebas son 1080×1920, escaladas ×2 en una secuencia 4K.

## Correcciones del usuario en este vídeo
- (ninguna todavía)
