---
name: clientes
description: Marca, plantillas y forma de entrega de cada cliente del usuario (ClienteA, ClienteE, ClienteN) y quién edita qué. Usar al empezar cualquier vídeo, rótulo, subtítulo o portada de un cliente, o cuando el usuario diga "recuerda el branding".
---
# Clientes — ficha rápida (detalle: memoria `reparto-de-trabajo-por-cliente.md`, `clientes-y-carga-de-trabajo.md`)

| | ClienteA | ClienteE | ClienteN |
|---|---|---|---|
| Color | azul #1E8BFF | naranja #FF5800 (degradado #FFD23A→#FF5800 en portadas); comparativas: malo rojo 226,38,38 / bueno verde 22,170,72 | ROJO #D3261C (211,38,28) en TODO: palabras clave, fórmulas, títulos, cajas. Nada de texto gráfico en negro. Verde #00FF04 solo "lo bueno" en comparativas |
| Letra | SF Pro + segunda fuente | Sequel Sans (Bold/Medium/Heavy Disp) | Futura Condensed ExtraBold (tipo Nike) en la palabra grande; resto fina |
| Quién edita | el usuario a mano; Claude solo marcadores y recursos (crudo entero, sin cortar) | propuesta COMPLETA "digna de resultado final", sin preguntar | igual que ClienteE |
| Música | — | la de su referencia, potente (~−15 LUFS) | la del ejemplo |

- **CTA de seguir aprobado para ClienteE de reels (@cliente_e_handle):** animación "Guárdalo / Compártelo / @cliente_e_handle · Siguiendo" → `clientes/clientee/CLIENTE-E_1009_01/motion/CTA guardar compartir seguir v2.mov` (2160×3840 con alfa, 3,6 s; componente `ClienteECierre`). Sigue el "sígueme" (el clic a 1,35 s). NO usar la tarjeta de YouTube (`ClienteESuscribirse`/`ClienteESeguirReel`), que es del otro ClienteE.
- **ClienteE de YouTube (@cliente_e2_handle) es OTRO cliente**: acento ROJO #FF0000 (no el naranja), 16:9; subtítulos del usuario: ClienteE amarillo #FFF900, entrevistados verde #1CFF00, rechazos rojo; Sequel Sans Heavy 64. Tarjeta de suscribirse: `ClienteESuscribirse` (motion/src/ClienteE.tsx, prop `acento`).
- Dirección general: natural, elegante, sencillo (skill **direccion-viral**). Siempre marcadores y proxies.
- Proxies: nunca en carpetas de Drive (solo lectura) → `~/EDICION/3 PROYECTOS/Proxies/<proyecto>`.
- Brutos de Drive y PACKS: solo lectura.

## Plantillas MOGRT (`~/Videos-Remotion/clientes/_plantillas/`, fuentes AE en `~/Videos-Remotion/ae/mogrt-*.jsx`, ejecutar con `ae/run.sh`)
- `Subtitulo ClienteE v3`: Linea + Palabra clave (grande debajo) + Color clave + "Tamano clave". Vertical: Tamano 52.2, pos [0.5,0.39]. **16:9: Tamano 52.2 + escala de Movimiento 40, pos [0.5,0.57]** (bajar Tamano descuadra línea y clave).
- `Subtitulo ClienteE YT v1` (16:9, frase completa): Sequel Sans Medium, minúsculas, ClienteE verde #1CFF00 / entrevistado amarillo #FFF900, sombra suave (55 %, dist 4, suav 25). Tamano 57.
- `Etiqueta ClienteE v1`: caja + texto. En 16:9 usar la MITAD de Tamano (p. ej. 25–35).
- `Texto ClienteN deportivo v2`: títulos/fórmulas (Color, Tamano).
- ClienteA: `Subtitulo ClienteA v12` (estética de siempre), `Subtitulo elegante`.
- Las plantillas verticales en secuencias 16:9 salen enormes y con desplazamiento vertical: probar con 5 clips y un fotograma antes de meter cientos.
