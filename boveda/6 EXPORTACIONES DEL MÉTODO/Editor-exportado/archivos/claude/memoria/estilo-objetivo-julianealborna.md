---
name: estilo-objetivo-julianealborna
description: Cuenta de TikTok que el usuario quiere replicar en motion graphics (2026-10-10); dónde están los vídeos y la receta, y cómo se pudo acceder
metadata:
  type: reference
---

El 2026-10-10 el usuario pasó https://www.tiktok.com/@julianealborna: "tiene muy buenos vídeos y unos motion graphics excelentes que me gustaría replicar". Es referencia suya, así que manda sobre skills externas ([[prioridad-referencias-del-usuario]]).

Sus 20 últimos vídeos (más 2 antiguos) descargados en `~/Videos-Remotion/referencias/perfiles-objetivo/julianealborna/` con hojas de contacto y análisis de sonido (el usuario pidió expresamente "sus últimos 20, no te quedes solo con 5" y "analiza también su diseño de sonido"). La receta completa está en `~/.claude/skills/edicion-video/criterio.md` (sección "@julianealborna"). En una línea: fondo negro con grano, figuras 3D blancas mates con resplandor, un solo acento de color por vídeo, líneas luminosas que se acumulan, texto sans fino y pequeño que se escribe palabra a palabra, transiciones por desenfoque.

Acceso: el listado con `yt-dlp --cookies-from-browser chrome --flat-playlist <perfil>` falló al primer intento y funcionó al segundo; los vídeos sueltos bajaron sin cookies con 20 s de espera entre uno y otro (con cookies y seguidos dio 403). Las herramientas de la extensión de Chrome no aparecen en la sesión del panel de VS Code; el binario de Claude está en `~/.vscode/extensions/anthropic.claude-code-*/resources/native-binary/claude` (no hay `claude` en el PATH). Relacionado: [[estilo-objetivo-sproject]], [[estilo-collage-motion-graphics]].

Dos estilos: figuras blancas mates sobre negro (nov 2025–ene 2026) y, en los 8 más recientes, imagen en blanco y negro con un único acento neón naranja/rojo. Sonido medido: cama grave ~11 dB bajo la voz, presente el 96 % del tiempo, golpe o tic clavado en la mitad de los cortes.

Herramienta para analizar sonido: separación voz / música+efectos con Demucs en `~/Videos-Remotion/herramientas/separar-env/` (instalada el 2026-10-10; ~80 s por vídeo de 3 min). Guiones reutilizables en la carpeta `sonido/` de esta referencia: `separar-todo.sh`, `video-stats.sh`, `analizar.py`. Yo no oigo: los tipos de efecto salen de medidas, decirlo siempre.

Primera aplicación (2026-10-10, CLIENTE-A_1010_01): el usuario vio la prueba y dijo "mejoraron mucho los motion graphics"; solo pidió mejorar "lo último en azul que aparece en la cabeza" (se rehízo como cerebro de perfil con surcos, relieve y rayos). Componentes en `~/Videos-Remotion/motion/src/ClienteAJulian.tsx` (Mate, Linea, Fondo, Texto, Figura, Cerebro; composiciones `ClienteAEscuelaJulian` y `ClienteALibreJulian`). Camas de sonido sintetizadas con `clientes/clientea/CLIENTE-A_1010_01/sfx/sintetizar-*.py` (python del entorno de Demucs). Plantilla de subtítulos del mismo estilo, editable: `clientes/_plantillas/Subtitulo ClienteA fino v1.mogrt` (Frase fina palabra a palabra + Palabra clave en negrita; script `ae/mogrt-clientea-fino.jsx`).

Correcciones del usuario a esa primera aplicación (2026-10-10, noche): (1) los subtítulos NO en letra fina: quiere la estética de ClienteA de siempre (v10) y solo "jugar un poco" (orden, glow, entradas distintas) → plantilla `Subtitulo ClienteA v12.mogrt` (v11 + "Palabra clave arriba") y entradas alternas con claves de Movimiento; el estilo fino queda solo para el texto dentro de los motion graphics. (2) En el MG de la cabeza no quiere el elemento azul final: prefiere que termine cuando "se rompen las cadenas del cerebro". (3) En "si quieres ser libre de verdad" quiere acción: la figura golpeando la celda hasta romperla. Lección mía: en estos MG prefiere acción física con desenlace (golpear, romper) a un símbolo que simplemente aparece.
