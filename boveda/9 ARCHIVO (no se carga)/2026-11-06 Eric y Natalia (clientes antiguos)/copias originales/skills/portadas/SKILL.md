---
name: portadas
description: Hacer portadas (miniaturas 9:16) para los vídeos de los clientes - elegir fotograma nítido, recortar personas, fondo, texto con la marca y control de calidad. Usar cuando el usuario pida una portada, miniatura o cover.
---
# Portadas

## Flujo (≈10 min)
1. Fotograma: `herramientas/fotogramas/mejor-fotograma.sh <bruto> <desde> <dur> <salida.png>` → 2160×3840 PNG, ya en SDR. Elegir plano donde se vean caras y manos nítidas (los de correr salen movidos: usar caminar). Mirarlo al 100 % (manos, pelo).
2. Copiar a `~/Videos-Remotion/motion/public/<cliente>/`.
3. Si hay que "sacarlos del fondo": `herramientas/recorte-objetos/recortar --lienzo foto.png persona.png` (incluye objetos que sostienen) y limpiar halo de pared con `herramientas/recorte-objetos/limpiar-halo.py` (filtro estricto: umbral amplio se come piel/orejas). Revisar el pelo al 100 % sobre fondo oscuro.
4. Render: `cd ~/Videos-Remotion/motion && npx remotion still src/index.ts <Comp> out.png --scale=2 --props='{…}'`. `--props` se MEZCLA con los defaultProps de Root.tsx: anular lo que sobre (p. ej. `"persona":""`).
5. Guardar en `~/EDICION/1 CLIENTES/<CLIENTE>/EXPORTADOS/Portadas/Portada - <tema>.png` y abrirla. Nunca sobrescribir la anterior: versión nueva al lado.

## Componentes (`motion/src/`)
- `NataliaPortada` (Natalia.tsx): `linea` fina + `palabra` grande roja Futura + `cola`; `estilo` "mixto" (el aceptado); `dos` (dos títulos enfrentados), `misterio` (siluetas con ?), `persona` (recorte encima), `natural:true` (fondo desenfocado y oscuro, personas sin sepia).
- `EricPortada3` (Eric.tsx): foto + l1 / grande (degradado naranja) / l3. `EricPortadaColumnas`: columnas por máquina/opción con franja negra de título (vídeos de comparación).
- Amin: ver memoria `clientes-y-carga-de-trabajo.md`.

## Texto
- Corto y con gancho: pregunta o promesa ("¿cuánta PROTEÍNA necesitas al día?", "Estás haciendo MAL tu cardio"). Ofrecer 1 alternativa, no más.
