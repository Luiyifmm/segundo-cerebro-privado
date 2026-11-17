---
name: estilo-collage-motion-graphics
description: Referencia de motion graphics que pidió el usuario el 2026-10-10 para Amin — collage de recortes en vez de emojis o pictogramas
metadata:
  node_type: memory
  type: feedback
  originSessionId: ee0e846e-677a-48a5-82b2-eed5c985a811
  modified: 2026-10-10T08:40:10.913Z
---

El 2026-10-10, en el vídeo AMIN_1010_01, el usuario vio los motion graphics con emojis y con pictogramas y respondió con dos pines de Pinterest ("algo como esto"): collage editorial de recortes — papel con cuadrícula, fotos recortadas en blanco y negro con borde blanco, círculo de color liso detrás, movimiento a saltos tipo stop motion.

**Why:** pidió antes "una alternativa sin emojis" y luego mandó estas referencias; es el aspecto que busca para los motion graphics a pantalla completa (interpretación mía: aplica a Amin; no dijo que valga para Eric o Natalia).

**How to apply:** partir de `motion/src/AminCollage.tsx` (Papel, Recorte, Circulo, saltos a 12 por segundo), con el círculo en el color de marca. Fotos libres (Wikimedia Commons / Openverse, mejor antiguas de dominio público o estatuas), recorte con `fondo/recortar.js` sobre un vídeo de 0,4 s de la foto y caja calculada desde el alfa (cropdetect falla). Fondo oscuro donde haya subtítulos blancos encima. Referencias guardadas en `referencias/motion-graphics/pin *.mp4`. Relacionado: [[estilo-objetivo-sproject]], [[como-editar-para-el-usuario]].
