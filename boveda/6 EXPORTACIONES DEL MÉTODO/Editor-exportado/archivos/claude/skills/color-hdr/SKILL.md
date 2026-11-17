---
name: color-hdr
description: Corrección de color y problema de brillo HDR de los brutos de iPhone (HLG) en Premiere y en fotogramas/portadas. Usar cuando el usuario diga que el vídeo exportado "se ve brillante/quemado", pida corrección de color, o al sacar fotogramas de clips de iPhone.
---
# Color y HDR

## Diagnóstico
- iPhone graba HLG BT.2020 10 bits (`ffprobe … color_transfer` = `arib-std-b67`). Al exportar a Rec.709 se ve más brillante que en el monitor.
- Antes de corregir, comprobar: (1) que exporta la secuencia correcta (no un RESPALDO), (2) que TODAS las tomas tienen Lumetri — los clips que el usuario añade o corta después llegan sin él (fue la causa en ClienteN g16).

## Corrección aceptada por el usuario (Lumetri, índices de la skill premiere-puente)
- Exposición −0.45 · Contraste +14 · Resaltados −45 · Sombras +4 · Blancos −28 · Negros −8 · Nitidez 12.
- ClienteE: temperatura +3, saturación 108, intensidad 14. ClienteN (pared amarilla): temperatura 0, saturación 100, intensidad 8.
- Receta: `~/Videos-Remotion/premiere/recetas/lumetri-hdr-iphone.jsx` (añade Lumetri vía QE solo si falta y fija valores).
- Si el usuario dice "no le apliques corrección", dejar Lumetri neutro (no se puede quitar por script) y, si luego pide "déjala como antes", restaurar estos valores.

## Fotogramas / portadas desde HLG
- `zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=rgb24`
- Herramienta: `~/Videos-Remotion/herramientas/fotogramas/mejor-fotograma.sh <video> <desde> <dur> <salida.png>` (elige el más nítido y convierte).
