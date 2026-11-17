# Manual completo de edición — todo lo que sé y hago

> Actualizado el 06-11-2026: Amin es el único cliente activo. La versión anterior, con Eric y Natalia, está en `9 ARCHIVO (no se carga)/`.

Versión del 6-11-2026. Reúne en un solo archivo las skills, la memoria, las fichas de clientes, el registro de correcciones y lo aprendido en las sesiones hasta hoy. Si algo de aquí choca con una corrección nueva tuya, gana la corrección.

---

## Índice
1. Cómo trabajamos (reglas que no se negocian)
2. Orden de autoridad: qué manda cuando hay choque
3. Clientes: marca, plantillas y qué entrego a cada uno
4. Flujo de un reel de principio a fin
5. Dirección: gancho, estructura, ritmo y retención
6. Edición premium (lo que separa un reel normal de uno de nivel)
7. Subtítulos
8. Motion graphics
9. Sonido
10. Color y HDR
11. Portadas
12. Trials y vtrials (Amin)
13. Premiere por script: cómo lo manejo y sus trampas
14. Remotion, After Effects y herramientas locales
15. Rendimiento del Mac y de Premiere
16. Organización de archivos y proyectos
17. Errores que ya cometí y la regla que saqué
18. Control de calidad antes de decir "hecho"
19. Lo que no puedo hacer

---

## 1. Cómo trabajamos

**Comunicación**
- En español, directo y breve. Cada mensaje en tres partes: **Comunicado** (qué pasó), **Qué necesito de ti**, **Pendiente**.
- Primero el resultado; después los detalles.
- Separar siempre lo que hice yo de lo que vi y ya estaba.
- Decir lo que falló y lo que no comprobé (por ejemplo, "no he escuchado la mezcla").

**Reglas que no se negocian**
1. **No destruir tu trabajo.** Trabajo en una secuencia nueva o en una pista vacía nueva. Desactivo en vez de borrar. Solo borro con tu permiso y a la Papelera.
2. **Releer la línea de tiempo antes de cada cambio.** Tú editas a la vez, mueves pistas y recortas. Identifico los clips por nombre de archivo, no por número de pista.
3. **Mirar fotogramas antes de decir "hecho".**
4. **El puente de Premiere normalmente arranca solo.** Si no responde, lo compruebo; si hace falta, te pido "Ventana › Extensiones › MCP Bridge" y paro.
5. **No meter tu voz ni tu música sin preguntar.**
6. **Drive (PACKS y brutos de clientes) es de solo lectura.** Las copias ordenadas van a `Mi unidad/RECURSOS DE EDICIÓN/`.
7. Las cookies temporales se borran después de usarlas y nunca se imprimen.
8. Antes de ejecutar código de terceros, lo reviso.
9. Lo editable manda: subtítulos como texto MOGRT, zooms como escala del clip, imágenes como clips propios y motion graphics en pista aparte. Nunca un render plano para un vídeo de cliente.
10. **"No lo toques"** significa: solo la capa pedida, en pista nueva, y la versión anterior desactivada.
11. **Aplicar solo lo pedido.** Si corriges el movimiento, no toco nada más.

**Entrenamiento**
- Cuando dices **"entrénate"** o **"mira la bandeja"**:
  1. Analizo lo nuevo de `0 CLAUDE EDITOR/4 ENTRENAMIENTO/BANDEJA DE ENTRADA`: fotogramas, ritmo, letra, colores y sonido medido.
  2. Saco reglas con números.
  3. Las escribo en la ficha del cliente, en la skill o en la memoria.
  4. Lo apunto en `REGISTRO DE CORRECCIONES.md`.
  5. Muevo el material a referencias.
- Cada corrección tuya va también al registro y a la ficha, no solo a mi memoria.

---

## 2. Orden de autoridad

1. Tus correcciones directas y las de tus clientes.
2. Tus referencias y el documento de vídeos que me pasaste al principio:
   - S Project;
   - @julianealborna;
   - el collage editorial;
   - los editores premium;
   - tus propios vídeos de ejemplo.
3. Skills externas (Motion Video Director, After Effects editor, Real SFX…), solo como oficio de apoyo.

Si chocan, gana lo de arriba sin preguntar.

**Dirección general (acordada con Amin y aplicada a todos):** vídeos **naturales y elegantes, sin sobrecarga dopamínica**, en la línea de Víctor Heras y Jordan Belfort. Menos es más: corte limpio, subtítulos sencillos, pocos efectos, motion graphics solo donde aclaren una idea.

---

## 3. Clientes

### Resumen

Cliente activo: **Amin** (@aminbusinesss). Eric, Natalia y Eric YouTube se archivaron el 06-11-2026 (`9 ARCHIVO (no se carga)/`); sus lecciones de oficio están en `4 ENTRENAMIENTO/Lecciones generales de edición.md`.

### Amin
- **Hasta el 30-10:** él editaba a mano y yo dejaba el **bruto entero** (ni silencios fuera), con marcadores con duración encima:
  - "IMAGEN derecha: …" (lo malo/pobre) e "IMAGEN izquierda: …" (lo bueno/rico), en rojo;
  - "MOTION GRAPHIC: …" y "CIERRE: seguir @aminbusinesss", en naranja;
  - la idea del gráfico en el comentario;
  - se marca la última toma de cada idea, con el número de tomas.
- **Desde el 30-10:** edito vídeos de Amin completos mediante su sistema (worker, repos en GitHub, ramas `claude-luis/*` con PR, nunca `main`). También termino lo que tú empiezas en Premiere.
- **Reglas fijas de Amin:**
  - música solo si él la elige;
  - nada tapa la cara;
  - la cifra en pantalla = la que dice la voz.
- **Subtítulos:** plantilla `Subtitulo Amin v10/v12.mogrt`.
  - Tamano 67,89; y 0,4375 con clave y 0,466 sin clave.
  - Sombra 100/38/16 y glow 0: no le gusta el halo blanco, quiere solo sombra negra marcada.
  - Clave ~2,4× la línea, como bloque compacto alineado a la izquierda, sobre el pecho.
- **Palabras resaltadas en su vídeo actual (IMG_6887):**
  - en cian 0,250,255 con "Resplandor de VR";
  - si son gráficos nativos, los recoloreo con el efecto **"Tinción"** (negro y blanco al mismo color) sin tocar el texto;
  - las nuevas van con la plantilla v12 en una pista libre.
- **Imágenes:** que retengan (Pinterest, conceptuales o satíricas), no stock.
- **Motion graphics a pantalla completa:** collage editorial (papel con cuadrícula, recortes en blanco y negro con borde blanco, círculo de color de marca detrás, saltos a 12 fps), o el estilo Julián si lo pide.
- **En los MG prefiere acción física con desenlace** (golpear, romper cadenas) a un símbolo que aparece sin más.
- **Comparativas:** lo malo a la derecha y lo bueno a la izquierda.
- **Trampas de sus brutos:**
  - traen puerta de ruido y una voz de apuntador muy baja (≈ −60 dB): silencio a −58 dB, voz con pico ≥ −50 dB;
  - Whisper falla mucho: usar el guion; *(histórico: desde el 08-11 manda la FICHA, «Transcripción»: guion = referencia, subtítulos = audio verificado, WhisperX para tiempos)*;
  - su voz llega a unos −29 LUFS: nivelarla a −16 en un WAV aparte y dejar la original desactivada.

---

## 4. Flujo de un reel

**Sistema de reels (una sola puerta):** `node ~/Videos-Remotion/sistema/reel.js <orden>`

| Dices | Hago |
|---|---|
| "Llegó material de X" | `nuevo <cliente> <archivo/carpeta/zip>` |
| "Procesa los de hoy" | `cortar` + selección de tomas |
| "Quita 3 y 7" / "recupera 4" | `quitar` / `recuperar` |
| "Abre amin 1" | `abrir` (importa en una bandeja con su ID) |
| "Empiezo X" / "paro" | reloj con `empezar` / `parar`, referencia del guion abierta, bandeja "RECURSOS DE EDICIÓN (<cliente>)" |
| "Entrega" | `entregar` (control de calidad + copia a `entregado/ID_vN.mp4`) |
| "El cliente pide…" | `cambios` |

**Pasos**
1. **Ingesta:** el material llega a Descargas (carpetas o zips de Drive). Lo asigno a un cliente (IMG_ suele ser Amin; si no está claro, pregunto) y lo registro.
2. **Medir los canales de audio** de cada bruto (voz en un solo canal = "Rellenar").
3. **Primer corte:**
   - frases numeradas y cortes por volumen real (umbral = sonoridad del clip −10 dB); pausas ≥ 0,4 s fuera;
   - las tomas repetidas y las frases sin terminar salen solas;
   - lo quitado queda al final, tras el marcador DESCARTES.
   - Para Amin en modo marcadores: bruto entero. En edición completa: corte normal.
4. **Guion:** tú lo revisas en 5 min.
5. **Montaje.**
6. **Marca, subtítulos, MG, sonido y color:** yo, sobre tu corte actual.
7. **Exportar** a `<reel>/export/` y `entregar`. Al final, una frase de mejora.

**Objetivo:** pasar de 4–6 h por reel a unos 90 min.

**Lotes en Premiere**
- Una línea de tiempo por cliente: tu vídeo de ejemplo al principio y los demás detrás, separados unos 30–45 s.
- Marcadores arriba con texto de qué trata cada parte.
- Proxies siempre.
- Cada propuesta, en una bandeja "PROPUESTAS DE CLAUDE".

**Antes de montar una propuesta:** comprobar en EXPORTADOS/HECHOS que ese vídeo no esté ya hecho. Pasó con "Buenas y malas proteínas".

---

## 5. Dirección: gancho, estructura y ritmo

**Estructura**
- Gancho (0–3 s) → problema → solución → prueba → llamada a la acción (una sola, dicha y escrita, visible ≥ 2 s).
- Gancho: la frase más fuerte o rara primero, con un título grande y la palabra fuerte en color. En Instagram la gente se va a los 3 s.
- Una idea por plano. Texto en pantalla ≤ 6–8 palabras. Tiempo de lectura ≈ 0,3 s por palabra + 0,5 s.

**Ritmo y montaje**
- Lo que engancha es la variación, no la velocidad: rápido–rápido–pausa.
- Cortar en la primera sílaba.
- Movimiento cada 3–4 s (un zoom suave basta).
- Más de 4 s sin cambio es demasiado; cambiar tanto que canse, también.
- Truco de continuidad: la frase siguiente empieza un poco antes de que acabe el audio anterior, sin abusar.

**Intensidad según el tipo de vídeo:** cuanta más confianza pide el mensaje, menos adorno. Educativo: medio, con flechas, resaltados y contadores.

**Reel hablado 9:16**
- Datos y fórmulas arriba como rótulo; si el rótulo ya lo dice, quitar del subtítulo la operación y dejar el resultado.
- Imágenes de apoyo 2×2 con línea blanca, provocadoras.
- Comparativas: malo en rojo y bueno en verde.

**Método eficiente**
1. Transcribir todo de una vez (`voz/transcribir.js`).
2. Guion en tabla.
3. Plan en Python → JSON.
4. Constructor `.jsx` en Premiere.
5. Fotogramas de control en 6–8 momentos.
6. Corregir y entregar.

**Si el bruto trae instrucciones del creador** (por ejemplo, un clip de instrucciones para el editor), cumplirlas.

---

## 6. Edición premium

Sale de tus referencias: Alborna, Belfort, Víctor Heras, Guille Collado, Natt Jongsala, Marco Said, Ashish Kumar y Zane Hoyer.

1. **Contención.** Un acento de color, dos letras como mucho, efectos "como especias". De 1,6 a 4,5 cortes por cada 10 s, con un plano mediano de ~2,5 s.
2. **La imagen nunca está quieta.** Empuje lento del 3–5 % por plano; los saltos de corte alternan encuadre base y +10 %.
3. **Profundidad.** Texto detrás de la persona, fondo oscurecido un 30–35 % y desenfocado, viñeta, grano y partículas.
4. **Tipografía con contraste.** Palo seco grueso + cursiva serif en el color de acento; tamaños asimétricos; un solo texto a la vez.
5. **Movimiento con curva.**
   - Entradas que frenan (bezier 0.16, 1, 0.3, 1), de desenfocado a nítido (10 px → 0 en 0,45 s).
   - 60 ms entre palabras; salidas más rápidas (0,25 s).
6. **Insertos que ilustran lo que se dice**, cada 8–12 s, de 1,5–3 s.
   - Ley del uno: una imagen = una idea entendible en menos de 1 s.
   - Archivo en blanco y negro para lo histórico.
7. **Color con intención.** Un look por vídeo; desaturado + un acento.
8. **Sonido sutil pero siempre presente.** Silenciar la música en la palabra importante.
9. **Historia antes que efectos.** El premontaje ("el chorizo") tiene que gustar sin efectos.

**Zona de foco (Natt)**
- Ojos a la misma altura, subtítulo siempre en el mismo sitio y gráficos justo debajo.
- Los títulos de delante van en la zona del subtítulo (debajo de la barbilla), y el subtítulo se oculta mientras están.
- Los de detrás acaban a mitad de la cabeza.

**Tres recetas:** `cine` (Alborna), `clave` (Belfort / Heras) y `profundidad` (Natt / Guille). Valores en la skill `edicion-premium`.

**Revisión "como un editor grande" (hoja de un fotograma por segundo)**
1. Gancho.
2. Un solo foco.
3. Legibilidad.
4. Profundidad.
5. Ritmo.
6. Coherencia.
7. Sonido.
8. Final.

---

## 7. Subtítulos

**Transcripción**
- Whisper small en local: `voz/transcribir.js <video> [--inicio --duracion]`. Salen `.srt`, `.palabras.json` y `.txt`.
- Transcribir el vídeo ya cortado, no el bruto.
- Si Whisper se salta un tramo, re-transcribir solo esos segundos. Ojo: sobrescribe los archivos del bruto, así que antes copio el `.palabras.json`.
- Corregir nombres propios, faltas y palabras cortadas; quitar muletillas.

**Colocación en Premiere**
- Siempre en una pista VACÍA y en orden de tiempo: `importMGT` entra con 30 s y pisa lo que haya detrás.
- Recortar con `clip.end` Y después con `clip.outPoint`, para que se puedan estirar con el ratón.
- Las plantillas duran 30 s como máximo: un texto más largo se parte en dos clips.
- Filtrar por nombre de plantilla + pista, nunca por nombre de propiedad.
- Contar los colocados frente a los esperados.

**Estética**
- 1–4 palabras.
- Palabra clave 2–4× la línea y en el color de marca.
- Sobre el pecho, nunca sobre ojos o boca.
- Zona segura 9:16: libres unos 220 px arriba, 420 abajo y 140 a la derecha.

**Correcciones que haces y aplico solas**
- Subir los subtítulos (y 0,32) durante las animaciones de título de la intro.
- Números de punto con Efecto Brillo.
- Cifras como gráfico, fuera del texto.
- Clave a destiempo en la pista de encima.
- Énfasis más grande en el cierre.

**Gráficos nativos (Gráficos esenciales):** su texto no se puede leer ni escribir por script.
- Solo puedo recolorearlos ("Tinción") o desactivarlos.
- Para textos en serie: un `.srt` por estilo → pista de subtítulos → tú aplicas el estilo.

---

## 8. Motion graphics

**Método**
- Para cada frase, decidir qué objeto la representa (su metáfora). Si no hay metáfora clara, texto limpio y nada más.
- Planificar por plano: tiempo, frase, qué se ve, movimiento, transición, sonido y texto. Los tiempos salen de las marcas de palabra de la voz real.
- Todo se construye acumulando: lo anterior se queda y lo nuevo se suma.
- Revisar con hojas de contacto del tramo, no con fotogramas sueltos.
- Comprobar colisiones con fotogramas reales de Premiere y con tus subtítulos, no solo con el render suelto.

**Estilos que manejo**
- **S Project:** sofisticado y minimalista. Fondo negro de marca + brillo del acento + rejilla de puntos.
- **@julianealborna:**
  - A) figuras 3D blancas mates con resplandor sobre negro con grano;
  - B) blanco y negro con un único acento neón naranja/rojo;
  - en ambos: líneas luminosas que se acumulan, texto sans fino y pequeño palabra a palabra, transiciones por desenfoque.
  - Ejemplo hecho: "y sigues en el mismo punto", con persona triste en blanco y negro, fondo que sube, persona que entra y sale por el lado, balanceo y grano.
- **Collage editorial (Amin):** papel, recortes en blanco y negro con borde, círculo de color y saltos tipo stop motion.
- **Emojis:** siguen siendo válidos (a ti te funcionan), con emoji de Apple + flecha a mano + texto con brillo. Siempre como PNG de Apple, y comprobando que el emoji significa lo que se pide.
- **Contadores estilo "Viral Pro":** número verde con brillo y "$$$" en contorno detrás (por ejemplo 0→2000 y luego 2000→3000).
- **Listas y gráficos de cálculo:** una operación cada vez, el resultado fijo, la cifra = la voz (ver `4 ENTRENAMIENTO/Lecciones generales de edición.md`).

**Animación**
- Nunca lineal. Entradas de 200–500 ms que frenan; salidas más rápidas; 40–80 ms de escalonado.
- Rebote solo en marcas desenfadadas.
- Entrada por palabra: desenfoque 12→0, opacidad 0→1 y 20 px de subida.
- Zoom de énfasis en metraje: 105–120 %.

**Acabado (para que no se vea plano)**
- Fondo con degradado y viñeta, grano encima.
- Sombra proyectada en textos y tarjetas; resplandor leve en el acento.
- Barrido de luz suave; desenfoque breve al entrar y salir.
- Las fotos se integran con un punto menos de saturación y el mismo tinte que el resto.

**Imágenes**
- Que retengan: ilustración satírica o conceptual de Pinterest (páginas `pinterest.com/ideas/...`), anotando el origen en `fuentes.json`.
- Wikimedia Commons solo revisando la hoja de candidatas a ojo.
- Alimentos: emojis o recortes con Vision de Apple (`herramientas/recorte-objetos/recortar`).

---

## 9. Sonido

**Tres pasadas, en este orden**
1. **Voz:**
   - reducción de ruido suave → EQ de limpieza (corte < 80 Hz y > 12–16 kHz) → compresor 2:1 → de-esser → limitador;
   - en Premiere, "Mejorar la voz";
   - medir el ruido antes y después; si sube, dejar la voz sin procesar.
2. **Efectos:**
   - buscar, afinar (tono más grave = peso; más agudo = chispa);
   - ampliar en capas grave + medio + agudo;
   - colocar el pico de la onda en el fotograma del movimiento (±1 f);
   - ambiente muy bajo.
3. **Música:**
   - por emoción, unos 10–18 dB bajo la voz, con hueco de EQ en los medios;
   - subir la cama 2–3 dB dentro del MG y crecer un segundo antes de una revelación;
   - para las frases importantes, bajar la cama, no cortarla.

**Qué sonido para qué**
- Whoosh: movimiento, transición, imagen que entra.
- Pop: icono, emoji o imagen que aparece (un solo pop).
- Clic: palabra clave importante, botón de seguir.
- Interfaz / UI: números, datos, contadores.
- Notificación: aviso en pantalla.
- Riser → impacto: revelación o cambio de sección.
- Golpe grave: dato grande, logo.
- Obturador: foto o congelado.
- Acierto / error: comparativas.
- Reloj: tiempo.
- Caja registradora: dinero.
- Glitch: parpadeos.
- **No uno por palabra.** El sonido marca cambios. Variar muestras y usar una sola familia por vídeo.

**Niveles que uso en Premiere** (componente "Volumen", con nivel en dB):
- UI en números ≈ −8 dB;
- clic en claves ≈ −6;
- pop en gráficos ≈ −12;
- whoosh ≈ −10;
- glitch ≈ −10;
- reloj y caja ≈ −14;
- contador ≈ −12.

Siempre en pistas de audio nuevas y en la bandeja "SFX (Claude)".

**Mezcla final:** −14 LUFS (Alborna ronda −16; S Project, −11/−12) y pico ≤ −1,5 dBTP.

**Biblioteca:** `Mi unidad/RECURSOS DE EDICIÓN/EFECTOS DE SONIDO/`
- `01 Whooshes`
- `06 Teclado y clics`
- `09 Interfaz y avisos`
- … y así hasta `10 Varios`.

**Para "escuchar"**
- `earshot` (medir LUFS, sincronía, elegir entre candidatos) y `real-sfx` (sonidos reales de tus bibliotecas).
- Nunca `earshot llm`: sube el audio a Gemini.
- **Yo no oigo:** los tipos de sonido salen de medidas, y lo digo siempre.

**Exportar con "Mejorar la voz"**
- Si se exporta justo después de tocarla, la voz sale "superpuesta".
- Hay que esperar a que termine el análisis y comprobar transcribiendo la exportación.

---

## 10. Color y HDR

**iPhone graba en HLG BT.2020** (10 bits): al exportar a Rec.709 se ve más brillante.

**Antes de corregir:** comprobar que se exporta la secuencia correcta y que todas las tomas llevan Lumetri (los clips añadidos después llegan sin él).

**Corrección aceptada:** exposición −0,45, contraste +14, resaltados −45, sombras +4, blancos −28, negros −8, nitidez 12.

**Índices de Lumetri por script:** 14 temperatura, 16 saturación, 19 exposición, 20 contraste, 21 resaltados, 22 sombras, 23 blancos, 24 negros, 41 nitidez, 42 intensidad.

**Copiar tu gradación de un vídeo anterior** (hecho con IMG_6887):
1. Leer el "Color de Lumetri" del clip de la secuencia anterior.
2. Crear una **capa de ajuste en una pista nueva justo encima del vídeo**, para que afecte solo a la imagen y no a los textos.
3. Copiar las 130 propiedades con getValue/setValue.
4. Comprobar con fotogramas con y sin la capa.

**Orden de gradación con criterio** (cada paso en su propia capa de ajuste):
1. Corrección (exposición y balance).
2. Contraste con curva S suave y negros algo levantados.
3. Paleta: cálidos hacia el naranja, fríos hacia el cian.
4. Azul en sombras y naranja en medios.
5. Piel aparte.
6. Acabado: bloom, viñeta y grano.

LUT creativo con la intensidad bajada.

**"No le apliques corrección":** dejar Lumetri neutro, porque no se puede quitar por script.

**Fotogramas desde HLG:** `herramientas/fotogramas/mejor-fotograma.sh` (tonemap hable).

---

## 11. Portadas

1. **Fotograma** a 2160×3840 desde el 4K, en PNG.
   - Elegir el más nítido (varianza del laplaciano) y mirar manos y cara al 100 %.
   - Correr sale movido: usar planos caminando.
2. **Recorte de personas** con `recortar --lienzo`, más limpieza del halo de pared con filtro estricto (distancia < 0,16; si no, se come piel y orejas).
3. **Fondo natural:** la persona sobre su propio fondo oscurecido y desenfocado, sin sepia.
4. **Render** con Remotion: `NataliaPortada` (estilo "mixto"), `EricPortada3` y `EricPortadaColumnas`.
   - Ojo: `--props` se mezcla con los valores por defecto (pasar `persona:""` si no se quiere).
5. **Texto corto con gancho** (pregunta o promesa). Ofrecer una alternativa, no más.
6. **Guardar** en `1 CLIENTES/<C>/EXPORTADOS/Portadas/` sin sobrescribir (versión nueva al lado).

**Por cliente**

---

## 12. Trials y vtrials (Amin)

- Edición libre: no es su formato de marca.
- Cada idea se publica dos veces: normal y Trials.
- Cuando una gana: "sácame las 20 alternativas".
- **Catálogo de 20 formatos numerados:**
  1. Base con barras
  2. Pantalla completa
  3. Tarjeta redondeada
  4. Tarjeta con brillo azul
  5. Fondo desenfocado
  6. Azul noche
  7. Blanco y negro con azul
  8. Primer plano
  9. Descentrado
  10. Palabra a palabra
  11. Frase entera
  12. Portada + bucle
  13. Rápido
  14. Corto
  15. Pantalla partida
  16. Estudio
  17. Miniaturas elegantes
  18. Póster
  19. Palabra gigante
  20. Fotos que caen
- **Vtrial aprobado:** tu original ya editado, entero, dentro de una tarjeta sobre fondo oscuro con retícula, y arriba una pregunta con palabras en AMARILLO (`VtrialReticula.tsx`). No rehacer la edición.
- **Siempre:** la misma familia de letra (2–3 como máximo) y las reglas básicas de marca.

---

## 13. Premiere por script

**Conexión**
- `~/Videos-Remotion/premiere/pr.sh <archivo.jsx> <segundos>` (máximo 590). Leo solo la línea `result`.
- Un script largo sigue corriendo aunque el puente diga "timed out": no lanzar otro encima.

**Patrones**
- **Tiempo:** ticks = segundos × 254016000000.
- **MOGRT:**
  - `seq.importMGT(ruta, ticks, pista, 0)`;
  - texto: JSON → `textEditValue` + `fontTextRunLength`;
  - color: `setColorValue(255,r,g,b,true)`.
- **Efectos (QE):**
  - `qe.project.getVideoEffectByName("…")` + `addVideoEffect`, buscando el clip QE por `start.secs`;
  - nombres en español: "Color de Lumetri", "Tinción", "Resplandor de VR", "Volteado horizontal", "Sombra paralela", "Rellenar derecha con izquierda";
  - un nombre que no existe devuelve un objeto vacío y no da error: comprobar siempre `fx.name`.
- **Pistas:** `addTracks(nV, después, 0)`; las de audio con `addTracks(0,0,n,1,después)`.
- **Movimiento:** 0 posición, 1 escala, 4 rotación, 7–10 recorte.
- **Marcadores:** `m.end = <número de segundos>`. Con un objeto Time no da error, pero queda sin duración.
- **Fotogramas:** `exportFramePNG` tras `setPlayerPosition`. Repetir el mismo instante devuelve caché.
- **Reenlazar:** `changeMediaPath`. Antes de mover un archivo, buscar en los .prproj (gunzip + grep) si alguno lo usa.
- **Abrir otro proyecto:** `app.openDocument(ruta)`; luego `openSequence` del proyecto correcto en `app.projects`.
- **Proxies:** `app.setEnableProxies(1)` activa la reproducción con proxy; `projectItem.hasProxy()` dice si un clip tiene.

**Trampas comprobadas**
- `seq.clone()` cambia la secuencia activa a la copia.
- Velocidad: nunca voz y efectos en el mismo clip acelerado.
  - Imagen anidada y acelerada;
  - voz en su propio anidado manteniendo el tono (4.º argumento de `setSpeed`);
  - efectos y música sueltos a velocidad normal.
- Clips A001 girados: leer `VideoInfo`. Un proxy regenerado necesita otro nombre de archivo.
- `overwriteClip` de un efecto entra con la duración completa y pisa lo siguiente: colocar en pista libre.
- Las pistas de subtítulos copiadas en subsecuencias no son accesibles.
- Leer un proyecto sin el puente: `gunzip -c proyecto.prproj` y buscar nombres o rutas (así encontré la secuencia de "La vulgaridad").

---

## 14. Remotion, After Effects y herramientas

**Remotion** (`~/Videos-Remotion/motion`)
- Render con alfa para Premiere (ProRes 4444): `--codec=prores --prores-profile=4444 --image-format=png --pixel-format=yuva444p10le --muted`.
- Escala 2 para secuencias 4K.
- Duración desde props con `calculateMetadata`.
- `frame = s × fps` real; nunca `Infinity` en `interpolate`.
- **Componentes por cliente:**
  - de clientes antiguos (archivados; útiles solo como ejemplos técnicos): `Eric*.tsx`, `Natalia.tsx`;
  - Amin: `AminCollage`, `AminJulian`, `AminLista`, `Trials6118`, `VtrialReticula`;
  - generales: `Elegante.tsx`.

**After Effects:** `ae/run.sh <jsx>`. Las plantillas MOGRT se generan con `ae/mogrt-*.jsx` y viven en `clientes/_plantillas/`.

**Herramientas locales**

| Herramienta | Uso |
|---|---|
| `voz/transcribir.js` | Transcripción |
| `voz/cortar-silencios.js` | Cortar silencios |
| `fondo/recortar.js` | Recortar a la persona, cambiar fondo (~14 fps a 1080) |
| `herramientas/recorte-objetos/` | Recortar objetos (Vision) |
| `herramientas/fotogramas/` | Elegir el fotograma más nítido |
| Demucs (`herramientas/separar-env`) | Separar voz y música para analizar referencias |
| ffmpeg y yt-dlp (`~/.local/bin`) | Vídeo y descargas |
| `earshot`, `real-sfx` | Escuchar, medir y elegir sonidos |

**Ojo con el entorno:** Node está en `~/.local/node/bin`, que no está en el PATH: hay que añadirlo antes de usar `node`.

---

## 15. Rendimiento del Mac y de Premiere

**Equipo:** MacBook Air M5, 16 GB, sin ventilador.

**Causa de la lentitud (6-11):** memoria llena. Premiere tenía 15 GB, Media Encoder 10 GB sin exportar nada, y el disco estaba haciendo de memoria de emergencia (16 GB).

**Arreglos en orden de efecto**
1. **Cerrar Media Encoder** cuando no exporta: libera 8–11 GB. Abrirlo solo para exportar.
2. **Reiniciar Premiere** cada pocas horas (acumula memoria) y abrir **un solo proyecto**.
3. **Activar los proxies** (botón del monitor): era lo que más frenaba con la memoria ya bien.
4. **Reproducción a 1/2 o 1/4**, y **renderizar previsualización (Enter)** en los tramos con muchos MOGRT, Lumetri o anidados.
5. Cerrar pestañas de navegador (4–5 GB).
6. Proyectos ligeros por lote. Reserva para otras apps: 6 GB.

Los auxiliares de Creative Cloud se pueden cerrar sin problema. **No cerrar:**
- `aerendercore`: dibuja los MOGRT;
- `dynamiclinkmanager`;
- `CEPHtmlEngine`: el panel del puente.

**Para diagnosticar:** `memory_pressure`, `sysctl vm.swapusage` y `top -o mem`.

---

## 16. Organización

**`~/EDICION/`**
- `0 CLAUDE EDITOR/`: referencias, fichas de clientes, skills y memoria, entrenamiento, exportaciones del método.
- `1 CLIENTES/<C>/`: BRUTOS (PENDIENTES y HECHOS), EXPORTADOS, TERMINADO y GUIONES.
- `2 MATERIALES DE EDICION/`: sonidos, música, overlays y CTA, B-roll, LUTs y fuentes.
- `3 PROYECTOS/Lotes de edición/`: Amin.prproj, AMIN - LOTE 18 OCT, etc. (los de clientes antiguos siguen en disco) Los proxies van en `3 PROYECTOS/Proxies/`.
- `9 OTROS/`: registros de limpieza, mapas de archivos movidos, capturas.

**`~/Videos-Remotion/`:** el taller (motion, premiere, ae, voz, fondo, sistema, herramientas). No se mueve: los scripts y proyectos dependen de sus rutas.

**Reglas**
- Material nuevo directo a `~/EDICION`, no a Descargas.
- Exportado: solo la última versión.
- Borrar siempre a la Papelera, después de comprobar que ningún .prproj usa el archivo (gunzip + grep del nombre).
- Los nombres de capturas de macOS llevan un espacio especial antes de a.m./p.m.: buscarlas por fecha.

**Notion:** hub "Estudio de Edición", base "⏱️ Tiempos de edición" y "Pipeline de Producción de Video". Crear tarjetas funciona; actualizarlas falla.

---

## 17. Errores que ya cometí y su regla

| Error | Regla |
|---|---|
| Imágenes tapando la cara | Nada sobre la cara, nunca |
| Entregar un render plano | Todo editable por capas |
| Subtítulos animados en cliente | Sencillos; los animados, solo para trials |
| Tratar los trials como marca del cliente | Son variantes de prueba |
| Proponer un vídeo ya hecho | Mirar EXPORTADOS/HECHOS antes |
| Acelerar todo junto (voz de ardilla o eco) | Voz, imagen y efectos por separado |
| Separar canales en A1/A2 | Audio como el original + "Rellenar" |
| Marcadores sin duración | `m.end` en número |
| Cajas y un pop múltiple en una propuesta | Las plantillas del cliente y un solo pop por objeto |
| Cifra en pantalla distinta de la voz | Cortar el audio si cambia la cifra |
| "Tablero" en otro sitio | La tarjeta aparece donde está lo que sustituye |
| Cambiar más de lo pedido (glow, tamaño, movimiento) | Solo lo pedido |
| Asumir que la línea sigue igual | Releer antes de cada cambio |
| Parecer que cambié lo que ya estaba | Separar lo hecho de lo visto |
| La voz no se oía en la exportación | Medir canales en la ingesta |
| `importMGT` borró 32 subtítulos | Pista vacía y en orden |
| El filtro por nombre de propiedad sobrescribió textos | Filtrar por plantilla + pista |
| Tinte con nombre equivocado ("Tinta", "Tinte") que falló sin avisar | Listar efectos; el nombre es "Tinción" |
| Teñir el clip equivocado (otra pista) | Identificar por contenido y tiempo, no por pista |
| Vista previa compuesta sobre un fotograma que ya tenía el overlay | Usar un fotograma limpio de fondo |
| Título que se salía | Anclarlo por la derecha |
| Lista pisando los subtítulos | Medir la franja real de subtítulos en Premiere |
| Pedir "cerrar Premiere" y que no se cerrara | Comprobar el proceso tras pedirlo; si no responde, avisar y ofrecer forzar |
| ProRes de ffmpeg 6 con alfa ilegible | Usar el ffmpeg de Remotion |
| Bucles `while read` + ffmpeg | `ffmpeg -nostdin` |

---

## 18. Control de calidad antes de decir "hecho"

1. Fotogramas en el gancho, en cada número o MG y en el cierre: nada se pisa (texto, números, cara) y todo dentro de la zona segura.
2. Subtítulos iguales a la voz, sin faltas, y el número colocado = el esperado.
3. Sonidos en su fotograma; nada tapa la voz; −14 LUFS; pico ≤ −1,5 dBTP.
4. Gancho ≤ 3 s; cierre con una sola llamada a la acción ≥ 2 s.
5. Sin halos en recortes ni parpadeos.
6. Exportación H.264 yuv420p, AAC 48 kHz. Exportar la secuencia correcta, no un RESPALDO.
7. Proyecto guardado.
8. Mensaje final:
   - qué hice, dónde está (pista, bandeja, secuencia) y qué no comprobé;
   - lo hecho por mí, separado de lo que ya estaba.

---

## 19. Lo que no puedo hacer

- **Oír:** mido el sonido; no lo escucho.
- **Ver tu pantalla:** necesito capturas o el puente de Premiere.
- **Escribir el texto de gráficos nativos de Premiere:** solo recolorearlos o desactivarlos.
- **Lanzar "Mejorar la voz" por script.**
- **Cerrar apps que muestran un aviso:** tienes que responderlo tú.
- **Enviar WhatsApp.**
- **Bajar perfiles de Instagram sin sesión.**
- **Activar "Permitir JavaScript desde Apple Events" en Brave:** no lo hago.
