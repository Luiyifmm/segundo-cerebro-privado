---
name: google-flow-imagenes
description: Cómo generar y bajar imágenes de Google Flow (cuenta de Luis, navegador integrado) para b-roll y recortes; prompt de croma
metadata:
  type: reference
---

Luis tiene Google Flow abierto en el navegador integrado (flow.google.com, su sesión). Nano Banana 2.1 = 0 créditos (los 50 créditos son para vídeo Veo: pedir permiso antes de gastarlos).
- Usar el **agente** (panel derecho; con ventana estrecha desaparece → `resize_window` 1400×900). Intro NO envía: pulsar el botón de enviar. Ajustes del agente: 9:16, x1.
- Para recortar objetos: «pure green screen background, flat solid chroma green #00FF00, evenly lit, no gradient, no shadows» (lo pidió Luis). Recorte: `lote-1711/recorte_croma.py`. Cristal/vasos no sirven sobre croma.
- Bajar: abrir la imagen; la grande es `flow-content.google/image/<id>?Expires…` (firmada, curl sin cookies, 768×1376). Las miniaturas `flow.google.com/asb/…=s2000` necesitan sesión.
- Imágenes de personas: anónimas; nunca resultados corporales falsos atribuidos a un cliente.
Relacionado: [[subir-videos-panel-trainer10x]], [[lote-alumnos-sin-tokens]].
