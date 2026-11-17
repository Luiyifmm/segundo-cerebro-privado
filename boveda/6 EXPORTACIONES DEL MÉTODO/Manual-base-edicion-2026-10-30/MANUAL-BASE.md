# Manual base de edición · 2026-10-30

Autor: Claude de Luis. 63 reglas (9 nuevas y 5 cambiadas desde el paquete del 30-10), 15 prohibiciones y 3 casos de vídeos de Amin.

**Cómo leerlo:** cada regla dice qué hacer, con qué valores, de dónde sale (`correccion`, `medicion`, `referencia` o `a_ojo`), cuánto me fío y cómo comprobarla. `amin` = solo vídeos de Amin; `cliente` = patrón sacado de otro cliente (anonimizado); `premiere` = técnica de Premiere, con su equivalente en ffmpeg/Remotion.

**Si algo choca:** las correcciones de Amin mandan sobre este manual; este manual manda sobre reglas genéricas.

**Gusto que no es regla:** qué frase lleva zoom, qué imagen concreta retiene y qué palabra es la clave dependen del vídeo. Aquí doy el criterio y el rango, no un número inventado.

## Las 15 reglas que más mejoran un vídeo

Orden por impacto según mi criterio (no medido).

1. **Edita natural y elegante: pocos efectos, pocos sonidos y un gráfico solo donde aclare una idea** (`ritmo-001`)
2. **Nunca tapes la cara** (`graficos-001`)
3. **Abre con la frase más fuerte en los primeros 3 s y nunca con el logo** (`gancho-001`)
4. **Quita toda pausa de 0,4 s o más y deja aire de 0,08 s antes y 0,15 s después de cada pieza** (`cortes-001`)
5. **Quédate con la última toma completa de cada frase repetida** (`cortes-004`)
6. **Escribe bloques de 1–3 palabras con la palabra clave al final; nunca una clave sola ni un bloque que acabe en artículo, preposición o conjunción** (`subtitulos-001`)
7. **Muestra la cifra en pantalla igual que la dice la voz** (`graficos-004`)
8. **Usa imágenes conceptuales o satíricas que retengan, no stock neutro** (`graficos-003`)
9. **En comparativas, pon lo malo arriba a la derecha y lo bueno arriba a la izquierda, en tarjetas pequeñas que no tapan la cara** (`amin-graficos-001`)
10. **Pon sonido en los cambios, no en las palabras: un sonido por cambio visual** (`sfx-001`)
11. **Deja la voz 10–18 dB por encima de la música y súbela solo 2–3 dB en los silencios** (`musica-001`)
12. **Mide los dos canales de cada bruto al recibirlo; si la voz va en uno, cópiala al otro** (`audio-001`)
13. **Termina la mezcla cerca de −14 LUFS con el pico verdadero en −1 dBTP o menos** (`audio-003`)
14. **Revisa 6–16 fotogramas del final antes de darlo por bueno: gancho, cada gráfico, cada cambio de sección, CTA y último fotograma** (`qc-001`)
15. **Al corregir, aplica solo lo pedido y vuelve a leer el montaje antes de cada cambio** (`qc-002`)

---

## Gancho

**gancho-001** · Abre con la frase más fuerte en los primeros 3 s y nunca con el logo.  
Valores: gancho_max_s: 3; gancho_youtube_largo_s: [10, 20]  
Por qué: El espectador decide en los primeros segundos.  
Origen: referencia (alta) · Referencias analizadas; caso-001 de Amin abre con 'La vulgaridad genera deseo' en el s 0.  
Comprobar: Fotograma del s 0,5: debe verse la persona hablando o el título del gancho; el primer sonido antes de 0,6 s.  
Excepciones: Si el guion ya trae el gancho delante (lo escribió el cliente), no reordenar.  
Ámbito: `general` · Estado: `igual`

**gancho-002** · Marca el arranque con un sonido en los primeros 2 s.  
Valores: primer_sonido_max_s: 2.0  
Por qué: Los reels de referencia suenan desde el principio; el silencio inicial pierde a quien llega por autoplay.  
Origen: medicion (media) · 2026-10-30: earshot critique sobre un reel terminado; referencia: primer sonido a 0,13 s de mediana. Caso-001 de Amin: riser de 0 a 1,57 s.  
Comprobar: earshot measure/timeline: primer evento antes de 2 s.  
Sin Premiere: ffmpeg `adelay` del sonido al instante 0.  
Ámbito: `general` · Estado: `nuevo`

## Cortes

**cortes-001** · Quita toda pausa de 0,4 s o más y deja aire de 0,08 s antes y 0,15 s después de cada pieza.  
Valores: pausa_min_s: 0.4; aire_antes_s: 0.08; aire_despues_s: 0.15; aire_si_corta_silabas_s: 0.12; tramo_min_s: 0.15  
Por qué: Así el ritmo es continuo sin comerse sílabas.  
Origen: medicion (alta) · Primer corte automático frente al montaje manual del usuario: 11 frases y 13 cortes coinciden con ±0,2 s.  
Comprobar: Retranscribe el audio del corte: no debe faltar ninguna palabra ni salir cortada; ninguna pausa interna ≥ 0,4 s (silencedetect).  
Excepciones: Pausas dramáticas que el guion pide.  
Sin Premiere: ffmpeg `silencedetect` + `atrim`/`concat`; umbral relativo (siguiente regla).  
Ámbito: `general` · Estado: `igual`

**cortes-002** · Calcula el umbral de silencio relativo a la sonoridad del clip: LUFS integrados menos 10 dB.  
Valores: umbral_relativo_db: -10; umbral_fijo_alternativo_db: -35; silencio_min_s: 0.45  
Por qué: Un umbral fijo falla entre clips grabados a distinto volumen.  
Origen: medicion (alta) · Probado en los primeros cortes de octubre.  
Comprobar: Comprueba que ningún tramo con palabras (transcripción) queda fuera.  
Excepciones: Brutos con puerta de ruido y apuntador: ver amin-cortes-001.  
Sin Premiere: ffmpeg `ebur128` para el LUFS + `silencedetect=noise=<LUFS-10>dB:d=0.45`.  
Ámbito: `general` · Estado: `igual`

**cortes-003** · Coloca cada punto de corte en el mínimo de energía entre dos palabras, no en el tiempo de Whisper.  
Valores: ventana_rms_ms: 10; media_movil: 3; error_whisper_max_s: 0.5  
Por qué: Whisper se equivoca hasta 0,5 s en los tiempos e inventa palabras.  
Origen: medicion (alta) · Recortes finos de octubre; validados retranscribiendo cada montaje de prueba.  
Comprobar: Monta el audio de prueba con concat y retranscribe: si una palabra sale cortada, el corte está mal.  
Sin Premiere: Perfil RMS en Python/numpy sobre el WAV a 16 kHz; con mlx-whisper solo para localizar la zona.  
Ámbito: `general` · Estado: `igual`

**cortes-004** · Quédate con la última toma completa de cada frase repetida.  
Valores: toma: "ultima_completa"  
Por qué: Normalmente la última es la buena; las anteriores son ensayo.  
Origen: correccion (alta) · Decisión del usuario en los primeros lotes (octubre); caso-003: 4 tomas repetidas fuera.  
Comprobar: Para cada frase del guion, solo aparece una vez en el final y es la de tiempo de origen más tardío.  
Excepciones: Si la última toma tiene un fallo y otra está limpia, usar la limpia y decirlo.  
Ámbito: `general` · Estado: `igual`

**cortes-005** · Quita indicaciones fuera de guion, frases sin terminar y palabras inventadas por la transcripción.  
Valores: ejemplos: ["otra vez", "¿así?", "listo"]  
Por qué: No forman parte del mensaje.  
Origen: correccion (alta) · Caso-002: 'Dios es mi Dios' y 'Que hermana' quitadas a mano (2026-10-09).  
Comprobar: Lee la transcripción del final: no queda ninguna de esas frases.  
Ámbito: `general` · Estado: `igual`

**cortes-006** · Si cambias una cifra o una alternativa dicha, corta el audio; no cambies solo el gráfico.  
Valores: corte_en: "silencio previo a la alternativa"  
Por qué: El texto en pantalla tiene que coincidir con lo que se oye.  
Origen: correccion (alta) · 2026-10-29, corrección de un cliente (fitness): quitar del audio las cifras alternativas.  
Comprobar: Retranscribe el tramo: la cifra dicha = la del gráfico.  
Sin Premiere: ffmpeg `atrim` en el mínimo de energía antes de la 'o'.  
Ámbito: `cliente` · Estado: `igual`

**cortes-007** · Solapa como máximo 3–4 cortes por vídeo, adelantando unos fotogramas la frase siguiente.  
Valores: solapes_max: 4  
Por qué: Da continuidad, pero abusar se nota.  
Origen: correccion (media) · Truco que el usuario usa en sus ediciones de un cliente (2026-10-09).  
Comprobar: Cuenta los solapes en la línea de tiempo o en el JSON de cortes.  
Sin Premiere: ffmpeg: dos pistas de audio con `adelay` y `amix`.  
Ámbito: `general` · Estado: `igual`

**amin-cortes-001** · En brutos con puerta de ruido y apuntador, detecta silencio a −58 dB y guarda solo tramos con palabras y pico ≥ −50 dB.  
Valores: silencio_db: -58; pico_voz_min_db: -50; voz_principal_db: -35; apuntador_db: -60  
Por qué: Los brutos de Amin traen una voz baja que dicta cada frase; Whisper la transcribe.  
Origen: medicion (alta) · 2026-10-11, brutos de Amin medidos.  
Comprobar: En el final no se oye el apuntador: earshot timeline sin eventos de voz entre frases.  
Excepciones: Brutos sin apuntador.  
Sin Premiere: ffmpeg `silencedetect=noise=-58dB` + `astats` por tramo.  
Ámbito: `amin` · Estado: `igual`

## Ritmo y estilo

**ritmo-001** · Edita natural y elegante: pocos efectos, pocos sonidos y un gráfico solo donde aclare una idea.  
Valores: graficos_por_idea_max: 1; sonidos: "uno por cambio visual, no por palabra"  
Por qué: Decisión hablada con Amin: nada de sobrecarga dopamínica; referencias Víctor Heras (@herasmedia) y Jordan Belfort.  
Origen: correccion (alta) · 2026-10-10: el usuario transmite lo hablado con Amin para sus vídeos y lo extiende a los demás clientes.  
Comprobar: Cuenta los elementos añadidos por cada 10 s del final; si hay más de un gráfico por idea o un sonido sin cambio visual debajo, sobra.  
Excepciones: Trials o vídeos de prueba que pidan explícitamente un estilo más cargado.  
Ámbito: `general` · Estado: `igual`

**ritmo-002** · Pon un cambio visual cada 0,5–2 s en marca personal y deja 2–5 s por idea en educativo.  
Valores: cambio_visual_s: [0.5, 2.0]; por_idea_educativo_s: [2, 5]  
Por qué: Las referencias analizadas mantienen la atención con cambios frecuentes pero sin saturar.  
Origen: referencia (media) · Referencias del usuario analizadas en octubre (hojas de contacto de 72 de 156 vídeos).  
Comprobar: Lista los cortes, cambios de zoom, imágenes y gráficos del final; ningún tramo sin cambio > 4 s salvo plano intencionado.  
Excepciones: Momentos emocionales o de silencio buscado.  
Sin Premiere: Remotion: zooms y entradas por `Sequence`; ffmpeg: cortes con `trim`/`concat`.  
Ámbito: `general` · Estado: `igual`

**ritmo-003** · Varía el patrón: rápido, rápido, pausa; corta en la primera sílaba.  
Valores: patron: "rapido-rapido-pausa"  
Por qué: Un ritmo uniforme se vuelve monótono.  
Origen: a_ojo (baja) · Práctica propia desde 2026-10-09; rango, no número.  
Comprobar: Mira la lista de duraciones de piezas: no deben ser todas iguales (desviación > 0,4 s).  
Ámbito: `general` · Estado: `igual`

## Subtítulos

**subtitulos-001** · Escribe bloques de 1–3 palabras con la palabra clave al final; nunca una clave sola ni un bloque que acabe en artículo, preposición o conjunción.  
Valores: palabras_amin: [1, 3]; palabras_max_otros: 4; bloque_min_s: 0.45  
Por qué: Se lee de un vistazo y la clave remata la idea.  
Origen: correccion (alta) · 2026-10-22: propuesta rechazada por claves solas y textos cortados; caso-001: 53 bloques de 0,3–1,9 s.  
Comprobar: Recorre el JSON de subtítulos: ningún bloque > 3 palabras (Amin), ninguno termina en 'de/la/que/y', ninguno es solo la clave; ninguno < 0,45 s.  
Sin Premiere: Remotion: un componente por bloque leyendo `palabras.json`.  
Ámbito: `general` · Estado: `igual`

**subtitulos-002** · Marca como clave solo la palabra que lleva el significado y solo si es la última del bloque.  
Valores: claves_por_bloque_max: 1  
Por qué: Una clave en un conector no aporta.  
Origen: correccion (alta) · 2026-10-22.  
Comprobar: Ninguna clave es artículo, preposición, conjunción o verbo auxiliar.  
Ámbito: `general` · Estado: `igual`

**subtitulos-003** · Coloca los subtítulos sobre el pecho, nunca sobre ojos ni boca, dentro de la zona segura.  
Valores: altura_pct: [60, 70]; seguro_arriba_px: 220; seguro_abajo_px: 420; seguro_derecha_px: 140; lienzo: "1080x1920"  
Por qué: Legible y fuera de la interfaz de Instagram.  
Origen: referencia (alta) · Zonas medidas en referencias; caso-001: subtítulos a la altura del pecho.  
Comprobar: Fotograma de cada plano: el texto no toca la cara ni entra en las franjas seguras.  
Excepciones: Cuando hay títulos en la intro, subir los subtítulos de esos segundos (y≈0,32).  
Ámbito: `general` · Estado: `igual`

**subtitulos-004** · Revisa la ortografía y completa la palabra que la transcripción corta.  
Valores: —  
Por qué: Una falta en pantalla resta credibilidad.  
Origen: correccion (alta) · Correcciones repetidas del usuario en octubre.  
Comprobar: Pasa el texto de todos los bloques por un corrector y compáralo con el guion.  
Ámbito: `general` · Estado: `igual`

**subtitulos-005** · Si un gráfico muestra la operación o la cifra, quítala del subtítulo.  
Valores: —  
Por qué: Dos veces el mismo dato en pantalla estorba.  
Origen: correccion (media) · Octubre, ediciones de un cliente de fitness.  
Comprobar: En los segundos de cada gráfico con cifra, el subtítulo no repite esa cifra.  
Ámbito: `general` · Estado: `igual`

**amin-subtitulos-001** · Usa Instrument Serif en el subtítulo y Anton en la palabra clave.  
Valores: letra_linea: "Instrument Serif"; letra_clave: "Anton"  
Por qué: Marca actual de Amin.  
Origen: correccion (alta) · 2026-10-30: mensaje de Amin con su marca nueva. Sustituye a SF Pro y al azul #1E8BFF.  
Comprobar: Fotograma con subtítulo: la línea es serif y la clave es Anton.  
Sin Premiere: Remotion: `@remotion/google-fonts/InstrumentSerif` y `/Anton`.  
Ámbito: `amin` · Estado: `cambia`

**amin-subtitulos-002** · Deja la línea pegada encima de la clave como un bloque compacto alineado a la izquierda, con la clave unas 2,4 veces más grande.  
Valores: ratio_clave_linea: 2.4; alineacion: "izquierda"; sombra_op_dif_dist: [100, 38, 16]  
Por qué: Es el aspecto del vídeo de ejemplo del usuario para Amin.  
Origen: medicion (media) · 2026-10-09: medido en los primeros 4 s de su ejemplo (AMIN_1009_01). Medido con SF Pro: con Instrument Serif + Anton hay que revalidar el ratio.  
Comprobar: Fotograma: altura de la clave / altura de la línea ≈ 2,4; sin hueco visible entre ambas.  
Sin Premiere: Remotion: `flexDirection: column`, `alignItems: flex-start`, `textShadow`.  
Ámbito: `amin` · Estado: `igual`

**amin-subtitulos-003** · Anima las entradas de forma mínima: la línea con fundido de 3 fotogramas y la clave subiendo unos píxeles en 6, sin desenfoque.  
Valores: entrada_linea_f: 3; entrada_clave_f: 6; desenfoque: 0  
Por qué: El usuario pidió subtítulos sencillos y una animación minimalista.  
Origen: correccion (alta) · 2026-10-09, dos correcciones seguidas.  
Comprobar: Fotogramas del primer y sexto fotograma de un bloque: sin desenfoque ni rebote.  
Excepciones: Trials: animación libre.  
Sin Premiere: Remotion: `interpolate(frame,[0,3],[0,1])` para la opacidad.  
Ámbito: `amin` · Estado: `igual`

**amin-subtitulos-004** · Resalta solo con el color de marca; nunca en gris la palabra 'mala'.  
Valores: malo: "#E5322D"; bueno: "#F5C542"  
Por qué: Corrección del usuario: el gris para lo malo no gustó. Hoy los colores son rojo/dorado de la marca nueva.  
Origen: correccion (media) · 2026-10-09: 'pobre' en gris corregido. 2026-10-30: colores nuevos de Amin.  
Comprobar: Ninguna clave en gris; en comparativas, malo en #E5322D y bueno en #F5C542.  
Excepciones: Si la clave no es de una comparativa, ver duda para Amin sobre el color por defecto.  
Ámbito: `amin` · Estado: `cambia`

**premiere-002** · Coloca las plantillas en una pista vacía y recórtalas con clip.end y después clip.outPoint.  
Valores: —  
Por qué: importMGT mete 30 s y pisa lo de detrás; con un solo recorte el clip no se estira.  
Origen: correccion (alta) · 2026-10-19: se borraron 32 subtítulos.  
Comprobar: Cuenta los clips colocados frente a los esperados.  
Sin Premiere: No aplica (Remotion).  
Ámbito: `premiere` · Estado: `igual`

## Gráficos e imágenes

**graficos-001** · Nunca tapes la cara.  
Valores: —  
Por qué: Fue la primera queja del usuario.  
Origen: correccion (alta) · 2026-10-08: imágenes que tapaban a la persona.  
Comprobar: Fotograma en cada entrada de gráfico o imagen: la caja del gráfico no corta la cara.  
Sin Premiere: Remotion: posición fija fuera de la caja de la cara; comprobar con fotogramas.  
Ámbito: `general` · Estado: `igual`

**graficos-002** · Haz que cada imagen o gráfico aparezca justo cuando se nombra lo que muestra.  
Valores: tolerancia_f: 1  
Por qué: Si llega antes o después, se pierde la relación.  
Origen: correccion (alta) · 2026-10-08 y casos 001–002 de Amin.  
Comprobar: Para cada gráfico, la palabra que lo dispara (palabras.json) cae a ±1 fotograma de su entrada.  
Sin Premiere: Remotion: `from = Math.round(inicioPalabra*fps)`.  
Ámbito: `general` · Estado: `igual`

**graficos-003** · Usa imágenes conceptuales o satíricas que retengan, no stock neutro.  
Valores: fuente: "Pinterest ideas / ilustración"; evitar: "stock genérico"  
Por qué: La imagen tiene que provocar, no decorar.  
Origen: correccion (alta) · 2026-10-10: 'sácalas de Pinterest… que generen controversia'.  
Comprobar: Revisión humana de la hoja de candidatas antes de colocar.  
Ámbito: `general` · Estado: `igual`

**graficos-004** · Muestra la cifra en pantalla igual que la dice la voz.  
Valores: —  
Por qué: Si no coinciden, el espectador desconfía.  
Origen: correccion (alta) · 2026-10-29, corrección de un cliente.  
Comprobar: Retranscribe el tramo y compara cifra dicha con cifra mostrada.  
Ámbito: `general` · Estado: `igual`

**graficos-005** · Muestra los textos de contexto (píldoras) entre 1 y 2 s como máximo.  
Valores: pildora_max_s: 2  
Por qué: Más tiempo estorba.  
Origen: correccion (alta) · 2026-10-29, corrección de un cliente.  
Comprobar: Duración de cada píldora en el JSON de gráficos ≤ 2 s.  
Ámbito: `general` · Estado: `igual`

**graficos-006** · En gráficos de cálculo, enseña una operación cada vez y deja fijo solo el resultado.  
Valores: inicio: "???"; fijos: "solo resultados"  
Por qué: Con mucho texto a la vez no se entiende.  
Origen: correccion (alta) · 2026-10-30, audio de un cliente de fitness sobre una pizarra.  
Comprobar: Fotogramas del gráfico: nunca hay dos operaciones abiertas a la vez.  
Sin Premiere: Remotion: estado por tiempo; cada operación es una `Sequence`.  
Ámbito: `cliente` · Estado: `igual`

**graficos-007** · Mide la franja real de los subtítulos y haz que los gráficos terminen por encima.  
Valores: margen_px: 15  
Por qué: Un gráfico que pisa el subtítulo obliga a rehacerlo.  
Origen: correccion (alta) · 2026-10-30: 'que no dé con los subtítulos'.  
Comprobar: Fotograma real del montaje final con subtítulos y gráfico a la vez: sin solape.  
Sin Premiere: En Remotion, subtítulos y gráficos en el mismo render: comprobar con `npx remotion still`.  
Ámbito: `general` · Estado: `igual`

**graficos-008** · Entra con opacidad o desplazamiento corto; no muevas ni agrandes lo que el usuario dejó fijo.  
Valores: spring: {"damping": 14, "stiffness": 195, "mass": 0.7}; curva: "bezier(0.16,1,0.3,1)"; salida_s: [0.2, 0.35]; escalonado_ms: [40, 80]  
Por qué: Las entradas que 'salen hacia fuera' no gustaron; movimiento suave y sin rebote.  
Origen: correccion (media) · 2026-10-29: 'no agrandes los cuadros', 'no los muevas'. Valores de spring a ojo.  
Comprobar: Fotogramas de entrada: sin rebote visible; la salida dura menos que la entrada.  
Sin Premiere: Remotion `spring()` / `Easing.bezier`.  
Ámbito: `general` · Estado: `igual`

**graficos-009** · Limita las familias de letra a 2 y el contraste del texto a ≥ 4,5:1.  
Valores: familias_max: 2; contraste_min: 4.5; titular_min_px: 120  
Por qué: Legibilidad en móvil.  
Origen: referencia (media) · Referencias analizadas.  
Comprobar: Mide el contraste texto/fondo en un fotograma.  
Ámbito: `general` · Estado: `igual`

**amin-graficos-001** · En comparativas, pon lo malo arriba a la derecha y lo bueno arriba a la izquierda, en tarjetas pequeñas que no tapan la cara.  
Valores: malo: "arriba_derecha"; bueno: "arriba_izquierda"; ancho_tarjeta_pct: [30, 40]  
Por qué: Es como lo marca y edita el usuario en los vídeos de Amin.  
Origen: medicion (alta) · Marcadores de AMIN_1009_01 (2026-10-09) y edición a mano del usuario AMIN_1018_03 (fotogramas 0,0–21,3 s, revisado 2026-10-30).  
Comprobar: Fotograma de cada pareja: la imagen 'mala' a la derecha, la 'buena' a la izquierda, ambas por encima de la cabeza.  
Sin Premiere: Remotion: dos `Img` absolutos en las esquinas superiores.  
Ámbito: `amin` · Estado: `igual`

**amin-graficos-002** · Para motion graphics a pantalla completa usa collage editorial: papel con cuadrícula, recortes en blanco y negro con borde blanco, un círculo liso de color y movimiento a saltos.  
Valores: saltos_por_s: 12  
Por qué: Es la referencia que el usuario mandó para Amin.  
Origen: referencia (media) · 2026-10-10: dos pines de Pinterest tras ver la versión con emojis.  
Comprobar: Fotograma del motion graphic: fondo papel o negro, recortes en B/N, un solo color de acento.  
Excepciones: Los motion graphics con emojis también se aceptan.  
Sin Premiere: Remotion (componentes Papel, Recorte, Circulo).  
Ámbito: `amin` · Estado: `igual`

**amin-graficos-003** · Pon un degradado oscuro detrás de los subtítulos cuando la pared clara les quite contraste.  
Valores: —  
Por qué: Lo hizo el usuario en su edición a mano.  
Origen: medicion (media) · AMIN_1018_03: 'Degradado a negro subtítulos.png' de 0 a 21,9 s.  
Comprobar: Fotograma: contraste del subtítulo ≥ 4,5:1.  
Sin Premiere: ffmpeg `overlay` de un PNG con alfa; Remotion `linear-gradient`.  
Ámbito: `amin` · Estado: `nuevo`

## Encuadre y zoom

**encuadre-001** · Simula cambios de plano alternando la escala entre piezas consecutivas.  
Valores: escalas: [100, 112, 118, 128, 130]; zoom_enfasis_pct: [105, 120]  
Por qué: Un salto de corte parece un cambio de cámara.  
Origen: medicion (alta) · Caso-002 (AMIN_1009_01): 100/112/100/112/100/112/130/100/118/100/128/100; caso-001: plano abierto/cerrado alternos.  
Comprobar: Lista de escalas por pieza: dos piezas seguidas nunca con la misma escala.  
Sin Premiere: ffmpeg `scale`+`crop` por pieza; Remotion `transform: scale()`.  
Ámbito: `general` · Estado: `igual`

**encuadre-002** · Usa empuje lento en pausas o antes de un gráfico.  
Valores: pct_por_s: [0.5, 2.0]; ejemplo: "100→107 % en ~4 s"  
Por qué: Da vida a un plano largo.  
Origen: medicion (media) · Caso-003 (AMIN_1010_01): zoom lento ×1,07 antes del segundo motion graphic.  
Comprobar: Mide la escala al inicio y al final del tramo.  
Sin Premiere: ffmpeg `zoompan`; Remotion `interpolate`.  
Ámbito: `general` · Estado: `igual`

## Voz y mezcla

**audio-001** · Mide los dos canales de cada bruto al recibirlo; si la voz va en uno, cópiala al otro.  
Valores: canal_muerto_db: -91  
Por qué: Un vídeo se exportó 'sin voz' en el móvil.  
Origen: correccion (alta) · 2026-10-30: voz solo en el canal derecho en cámaras de un cliente.  
Comprobar: ffmpeg `pan=mono|c0=c0,volumedetect` y `c0=c1`: ambos canales con nivel similar.  
Sin Premiere: ffmpeg `pan=stereo|c0=c1|c1=c1`.  
Ámbito: `general` · Estado: `igual`

**audio-002** · Mide el nivel de los silencios antes y después de procesar la voz; si el ruido sube, deja la voz sin procesar.  
Valores: subida_ruido_max_db: 2  
Por qué: Una cadena de mejora subió 5 dB el ruido de un gimnasio y el usuario lo notó.  
Origen: correccion (alta) · Octubre, cliente de fitness.  
Comprobar: earshot measure: noise floor antes/después.  
Ámbito: `general` · Estado: `igual`

**audio-003** · Termina la mezcla cerca de −14 LUFS con el pico verdadero en −1 dBTP o menos.  
Valores: lufs: -14; aviso_lufs: [-18, -11]; true_peak_max_dbtp: -1.0  
Por qué: Por encima de −1 dBTP el AAC satura en los golpes.  
Origen: medicion (alta) · 2026-10-30: dos exportaciones finales medidas con earshot por encima de 0 dBTP (+0,1 y +0,3 con 517 muestras saturadas).  
Comprobar: earshot measure del archivo final: true peak ≤ −1,0 y LUFS entre −16 y −12.  
Sin Premiere: ffmpeg `loudnorm=I=-14:TP=-1.5:LRA=11` (dos pasadas) o `alimiter`.  
Ámbito: `general` · Estado: `cambia`

**audio-004** · Normaliza la voz cruda de Amin (≈ −33 LUFS) antes de mezclar.  
Valores: voz_cruda_lufs: -33; loudnorm: "I=-15:TP=-1.5"  
Por qué: Su bruto viene muy bajo.  
Origen: medicion (alta) · Octubre, brutos de Amin.  
Comprobar: earshot measure de la voz normalizada: −15 ±1 LUFS.  
Sin Premiere: ffmpeg `loudnorm=I=-15:TP=-1.5`.  
Ámbito: `amin` · Estado: `igual`

## Música

**musica-001** · Deja la voz 10–18 dB por encima de la música y súbela solo 2–3 dB en los silencios.  
Valores: voz_sobre_musica_db: [10, 18]; subida_en_silencios_db: [2, 3]  
Por qué: La voz manda siempre.  
Origen: correccion (alta) · 2026-10-10: un cliente pidió la voz 'niquelada' muy por encima (~18 dB).  
Comprobar: Separa voz y música (stems) y mide la diferencia de LUFS por tramo.  
Sin Premiere: ffmpeg `sidechaincompress` o volumen por tramos.  
Ámbito: `general` · Estado: `igual`

**amin-musica-001** · Pon música solo si Amin la elige.  
Valores: —  
Por qué: Decisión de Amin.  
Origen: correccion (alta) · 2026-10-30: mensaje de Amin.  
Comprobar: El proyecto no lleva pista de música sin una indicación de Amin.  
Ámbito: `amin` · Estado: `cambia`

## Efectos de sonido

**sfx-001** · Pon sonido en los cambios, no en las palabras: un sonido por cambio visual.  
Valores: pop: "icono/imagen"; whoosh: "movimiento o entrada de tarjeta"; clic: "interfaz o botón"; obturador: "foto que entra"; riser_impacto: "revelación"  
Por qué: Un sonido sin cambio debajo es ruido.  
Origen: correccion (alta) · 2026-10-09: prueba de sonido aprobada ('ha mejorado el sonido').  
Comprobar: Para cada sonido del JSON, hay un cambio visual a ±1 fotograma.  
Ámbito: `general` · Estado: `igual`

**sfx-002** · Usa un solo pop por objeto que aparece.  
Valores: archivo_tipo: "un único golpe"; evitar: "archivos con varios pops"  
Por qué: Un archivo con varios pops parece que salen varios objetos.  
Origen: correccion (alta) · 2026-10-22.  
Comprobar: earshot describe/onsets del archivo: un solo ataque.  
Ámbito: `general` · Estado: `igual`

**sfx-003** · Coloca el ataque del sonido en el fotograma exacto del movimiento; el clic, 0,02 s antes.  
Valores: tolerancia_f: 1; adelanto_clic_s: 0.02; adelanto_obturador_s: 0.03  
Por qué: Un sonido que llega tarde se nota en el acto.  
Origen: medicion (alta) · 2026-10-30: 24 de 24 sonidos en su fotograma (verify.py) en un reel de fitness; caso-002: obturador 0,03 s antes de cada imagen.  
Comprobar: earshot timeline con los tiempos de los gráficos como cues: offset ≤ 42 ms.  
Sin Premiere: ffmpeg `adelay=<ms>` por sonido + `amix`.  
Ámbito: `general` · Estado: `igual`

**sfx-004** · Antes de añadir efectos a un montaje, escucha con earshot si ya lleva los suyos y solo sonoriza los cambios que estén en silencio.  
Valores: herramienta: "earshot timeline"; ventana_s: 0.15  
Por qué: Encima de los efectos del editor se duplican y saturan.  
Origen: medicion (alta) · 2026-10-30: un reel ya traía ~10 efectos propios; se añadieron 26 solo en rótulos sin sonido.  
Comprobar: Ningún efecto nuevo a menos de 150 ms de un evento que ya estaba en el audio original.  
Ámbito: `general` · Estado: `nuevo`

**sfx-005** · Usa solo grabaciones reales; nunca camas ni efectos sintetizados por código.  
Valores: fuentes: ["biblioteca propia", "Openverse CC0"]; comprobacion: "earshot realness p_real ≥ 0,77"  
Por qué: El usuario pidió sonidos reales; lo sintetizado suena barato.  
Origen: correccion (alta) · 2026-10-30: petición del usuario. Sustituye a las camas sintetizadas de AMIN_1010_01 (2026-10-10).  
Comprobar: earshot realness de la mezcla: p_real ≥ 0,77 en todas las ventanas.  
Ámbito: `general` · Estado: `cambia`

**sfx-006** · Separa dos sonidos largos del mismo tipo al menos 0,4 s; si no caben, deja uno.  
Valores: separacion_min_s: 0.4  
Por qué: Dos colas de 1 s encima suenan a barro.  
Origen: medicion (media) · 2026-10-30: dos 'Data Collect' de 1 s a 0,38 s; se dejó uno por par.  
Comprobar: En el JSON de sonidos, ninguna pareja del mismo tipo a < 0,4 s.  
Ámbito: `general` · Estado: `nuevo`

**sfx-007** · Bajo voz, atenúa los efectos solo 4–6 dB; con una atenuación de 13 dB desaparecen.  
Valores: atenuacion_db: [4, 6]; atenuacion_que_los_borra_db: 13  
Por qué: Si la voz suena todo el vídeo, una atenuación fuerte deja los efectos inaudibles.  
Origen: medicion (media) · 2026-10-30: real-sfx 'normal' quitó 13 dB y 5 sonidos quedaron 30 dB bajo el resto; con 'light' (5,7 dB) la voz siguió limpia (eje speech 10/10).  
Comprobar: critique.py de real-sfx: ejes audibility ≥ 8 y speech ≥ 8.  
Sin Premiere: ffmpeg `sidechaincompress=threshold=0.05:ratio=2`.  
Ámbito: `general` · Estado: `nuevo`

**sfx-008** · Quita los graves de los golpes que suenan encima de música con bajo.  
Valores: paso_alto_hz: 150  
Por qué: Se amontonan con el bajo y embarran.  
Origen: medicion (media) · 2026-10-30: eje low_end de 5,5 a 10 tras paso alto de 150 Hz en 3 golpes.  
Comprobar: critique.py: low_end ≥ 8.  
Sin Premiere: ffmpeg `highpass=f=150`.  
Ámbito: `general` · Estado: `nuevo`

**sfx-009** · Mantén una familia de sonidos por tipo de elemento en todo el vídeo (mismo pop en la lista, mismo whoosh en tarjetas).  
Valores: —  
Por qué: Es el lenguaje de interfaz del vídeo; las métricas de variedad lo marcan como fallo y no lo es.  
Origen: a_ojo (media) · 2026-10-30: real-sfx puntuó variedad 1/10 por repetir el pop de lista; se mantuvo a propósito.  
Comprobar: Un archivo por tipo de elemento; como mucho dos variantes alternas.  
Ámbito: `general` · Estado: `nuevo`

**amin-sfx-001** · Pon un obturador de cámara cada vez que entra una imagen; riser al empezar, golpe en el primer cambio de plano y pop + clic en la tarjeta de seguir.  
Valores: obturador: "entrada de cada imagen"; riser_s: [0, 1.57]; golpe_s: 2.97; cta: ["Smooth Pop al entrar", "Mouse Click 01 al pulsar"]  
Por qué: Es como lo hizo el usuario a mano.  
Origen: medicion (alta) · AMIN_1018_03 leído del proyecto de Premiere el 2026-10-30: 8 obturadores, Sharp Riser 0–1,57 s, BOOM IMPACT en 2,97 s, Smooth Pop 31,8 s, Mouse Click 33,33 s.  
Comprobar: earshot timeline del final: un evento a ±1 f de cada imagen y del CTA.  
Ámbito: `amin` · Estado: `nuevo`

**sfx-010** · No digas cómo suena algo sin una medida: cita el número de earshot.  
Valores: ejemplos: ["−14,2 LUFS", "match strong z +3,9", "p_real 0,92"]  
Por qué: La IA no oye; sin medida es una invención.  
Origen: correccion (alta) · 2026-10-30: regla adoptada al instalar earshot.  
Comprobar: Cada afirmación sobre sonido en un informe lleva un número.  
Ámbito: `general` · Estado: `nuevo`

## Color

**color-001** · Trata el HDR de iPhone (HLG) antes de nada: tono a SDR o se ve quemado.  
Valores: detectar: "color_transfer=arib-std-b67"; tonemap: "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv"  
Por qué: Sin tratarlo se ve lavado o brillante en el móvil.  
Origen: medicion (alta) · Octubre, brutos de iPhone.  
Comprobar: ffprobe del final: color_transfer=bt709; fotograma sin zonas quemadas.  
Sin Premiere: ffmpeg con el filtro de 'valores'.  
Ámbito: `general` · Estado: `igual`

**color-002** · Aplica la corrección base aceptada por el usuario a todas las tomas.  
Valores: exposicion: -0.45; contraste: 14; resaltados: -45; sombras: 4; blancos: -28; negros: -8; nitidez: 12  
Por qué: Fue la corrección aceptada para material de iPhone.  
Origen: correccion (media) · Octubre, aceptada por el usuario.  
Comprobar: Todas las piezas llevan la corrección (las añadidas después llegan sin ella).  
Sin Premiere: ffmpeg aproximado: `eq=contrast=1.14:brightness=-0.03` + `curves` para resaltados; validar a ojo frente a un fotograma de Premiere.  
Ámbito: `premiere` · Estado: `igual`

## Llamada a la acción

**cta-001** · Cierra con una sola llamada a la acción, dicha y escrita, visible al menos 2 s.  
Valores: visible_min_s: 2; empieza_antes_de_sigueme_s: 2.2  
Por qué: Más de una CTA divide la acción.  
Origen: referencia (alta) · Referencias + caso-001 (tarjeta de seguir 31,8–34,2 s).  
Comprobar: Fotogramas del cierre: tarjeta visible ≥ 2 s; el botón cambia a 'Siguiendo' cuando se dice 'sígueme'.  
Sin Premiere: Remotion: componente de tarjeta con `Sequence from`.  
Ámbito: `general` · Estado: `igual`

## Revisión

**qc-001** · Revisa 6–16 fotogramas del final antes de darlo por bueno: gancho, cada gráfico, cada cambio de sección, CTA y último fotograma.  
Valores: fotogramas: [6, 16]; buscar: ["texto sobre la cara", "gráfico que pisa subtítulo", "cifra ≠ voz", "faltas", "huecos negros"]  
Por qué: Casi todos los fallos que vio el usuario se ven en un fotograma.  
Origen: correccion (alta) · Lecciones de octubre.  
Comprobar: Hoja de contacto guardada junto a la entrega.  
Sin Premiere: ffmpeg `select` + `tile`.  
Ámbito: `general` · Estado: `igual`

**qc-002** · Al corregir, aplica solo lo pedido y vuelve a leer el montaje antes de cada cambio.  
Valores: —  
Por qué: 'No agrandes los cuadros' significa solo eso; el usuario edita a la vez.  
Origen: correccion (alta) · 2026-10-29 y 2026-10-30.  
Comprobar: Diff del JSON de montaje antes/después: solo cambian los campos pedidos.  
Ámbito: `general` · Estado: `igual`

**qc-003** · Al informar, separa lo que hiciste de lo que ya estaba.  
Valores: —  
Por qué: Un informe confuso hizo creer al usuario que se habían tocado cosas.  
Origen: correccion (alta) · 2026-10-30.  
Comprobar: El informe tiene dos listas: 'hecho por mí' y 'visto, ya estaba'.  
Ámbito: `general` · Estado: `igual`

## Entrega

**entrega-001** · Exporta previsualizaciones a 1080×1920, 30 fps, H.264 CRF 17 y AAC 256 kb/s.  
Valores: resolucion: "1080x1920"; fps: 30; crf: 17; audio: "AAC 48 kHz 256 kb/s"  
Por qué: Buena calidad y peso razonable.  
Origen: medicion (alta) · Octubre.  
Comprobar: ffprobe del archivo.  
Sin Premiere: ffmpeg `-c:v libx264 -crf 17 -pix_fmt yuv420p -c:a aac -b:a 256k`.  
Ámbito: `general` · Estado: `igual`

**entrega-002** · Saca portadas del fotograma 4K más nítido (varianza del laplaciano), mirando manos y cara al 100 %.  
Valores: resolucion: "2160x3840"  
Por qué: Ampliar desde 1080 se nota.  
Origen: correccion (alta) · Octubre, portadas.  
Comprobar: La portada mide 2160×3840 y no tiene desenfoque de movimiento en manos.  
Sin Premiere: ffmpeg + OpenCV `Laplacian().var()`.  
Ámbito: `general` · Estado: `igual`

**premiere-001** · Entrega todo editable: clips cortados, zooms como escala, subtítulos como plantilla con texto y gráficos en su pista.  
Valores: —  
Por qué: El usuario revisa y pule cada vídeo.  
Origen: correccion (alta) · 2026-10-08.  
Comprobar: Abrir el proyecto: ningún texto ni zoom quemado en un render.  
Sin Premiere: Sin Premiere: guardar el montaje como JSON (cortes, subtítulos, gráficos, sonidos) para poder re-renderizar con cambios.  
Ámbito: `premiere` · Estado: `igual`

## Prohibido

- **no-001** · Tapar la cara con texto, imagen o gráfico. Primera queja del usuario. _(2026-10-08.)_
- **no-002** · Usar stock neutro como imagen de apoyo. No retiene. _(2026-10-10.)_
- **no-003** · Dejar una palabra clave sola en pantalla o acabar un bloque en artículo/preposición. Se lee mal. _(2026-10-22: propuesta rechazada.)_
- **no-004** · Usar archivos con varios pops seguidos ('Normal Pop.wav'). Parecen varios objetos. _(2026-10-22.)_
- **no-005** · Meter voz y efectos en el mismo clip acelerado. Suena a ardilla o con eco y los efectos desaparecen. _(2026-10-12. Arreglo: acelerar imagen y voz por separado, efectos a velocidad normal.)_
- **no-006** · Separar el estéreo de la voz en dos pistas. El usuario oía un solo lado. _(2026-10-12. Arreglo: un clip estéreo y rellenar el canal vacío.)_
- **no-007** · Mostrar una cifra distinta de la que dice la voz. Rompe la confianza. _(2026-10-29.)_
- **no-008** · Añadir efectos encima de los que el montaje ya trae. Se duplican. _(2026-10-30: comprobado con earshot timeline antes de sonorizar.)_
- **no-009** · Usar sonidos o camas sintetizados por código. Suenan baratos; el usuario pidió sonidos reales. _(2026-10-30. Error previo: camas sintetizadas en AMIN_1010_01 (2026-10-10).)_
- **no-010** · Subir audio o vídeo de clientes a servicios externos (Gemini u otros) para revisarlo. Es material del cliente; earshot corre en local. _(2026-10-30: regla de la skill de edición.)_
- **no-011** · Exportar con el pico verdadero por encima de −1 dBTP. Satura al codificar. _(2026-10-30: dos exportaciones medidas a +0,1 y +0,3 dBTP.)_
- **no-012** · Usar gris para la palabra 'mala' en los subtítulos de Amin. Corrección del usuario. _(2026-10-09 (AMIN_1009_01: 'pobre' en gris).)_
- **no-013** · Confiar en los tiempos de Whisper para cortar. Error de hasta 0,5 s y palabras inventadas. _(Octubre, medido.)_
- **no-014** · Tocar vídeo, audio o subtítulos cuando el usuario dice 'no lo toques, solo X'. Solo se cambia la capa pedida. _(2026-10-30.)_
- **no-015** · Calcular fotogramas de Remotion con un fps distinto al de la composición. Se desplazan los gráficos. _(Octubre: 24 en vez de 30. Arreglo: frame = s × fps real.)_

## Casos reales de Amin

- **caso-001 · AMIN_1018_03 · La vulgaridad vs la elegancia** (`casos/caso-001`): Edición a mano del usuario: 14 cortes en 34 s, 53 subtítulos de 1–3 palabras, imágenes malo derecha / bueno izquierda con obturador, riser + golpe al inicio y tarjeta de seguir. Mezcla −13,1 LUFS con pico +0,3 dBTP (a corregir).
- **caso-002 · AMIN_1009_01 · Rico vs pobre** (`casos/caso-002`): Primera edición completa de Amin: 10 de 12 frases, zoom alterno por pieza, imágenes pobre derecha / rico izquierda, 4 motion graphics y sonido en capas aprobado. Aquí se corrigió la clave en gris.
- **caso-003 · AMIN_1010_01 · La escuela te programa** (`casos/caso-003`): Corte de 222 s a 54 s (luego 42 s a mano), tomas repetidas fuera, motion graphics que pasaron a collage editorial por referencia del usuario, imágenes de Pinterest y camas sintetizadas que hoy están prohibidas.

## Lo nuevo desde el paquete del 30-10

- `nuevo` **gancho-002**: Marca el arranque con un sonido en los primeros 2 s.
- `cambia` **amin-subtitulos-001**: Usa Instrument Serif en el subtítulo y Anton en la palabra clave.
- `cambia` **amin-subtitulos-004**: Resalta solo con el color de marca; nunca en gris la palabra 'mala'.
- `nuevo` **amin-graficos-003**: Pon un degradado oscuro detrás de los subtítulos cuando la pared clara les quite contraste.
- `cambia` **audio-003**: Termina la mezcla cerca de −14 LUFS con el pico verdadero en −1 dBTP o menos.
- `cambia` **amin-musica-001**: Pon música solo si Amin la elige.
- `nuevo` **sfx-004**: Antes de añadir efectos a un montaje, escucha con earshot si ya lleva los suyos y solo sonoriza los cambios que estén en silencio.
- `cambia` **sfx-005**: Usa solo grabaciones reales; nunca camas ni efectos sintetizados por código.
- `nuevo` **sfx-006**: Separa dos sonidos largos del mismo tipo al menos 0,4 s; si no caben, deja uno.
- `nuevo` **sfx-007**: Bajo voz, atenúa los efectos solo 4–6 dB; con una atenuación de 13 dB desaparecen.
- `nuevo` **sfx-008**: Quita los graves de los golpes que suenan encima de música con bajo.
- `nuevo` **sfx-009**: Mantén una familia de sonidos por tipo de elemento en todo el vídeo (mismo pop en la lista, mismo whoosh en tarjetas).
- `nuevo` **amin-sfx-001**: Pon un obturador de cámara cada vez que entra una imagen; riser al empezar, golpe en el primer cambio de plano y pop + clic en la tarjeta de seguir.
- `nuevo` **sfx-010**: No digas cómo suena algo sin una medida: cita el número de earshot.

## Dudas para Amin

1. Tamaños y posición exactos de Instrument Serif (línea) y Anton (clave) en 1080×1920: no tengo valores medidos con la marca nueva.
2. ¿La clave va en dorado #F5C542 por defecto, o solo en comparativas (malo rojo / bueno dorado) y si no en blanco?
3. ¿Siguen las imágenes en comparativa con lo malo a la derecha y lo bueno a la izquierda (como en AMIN_1018_03)?
4. Ahora que editas vídeos completos: ¿se quitan todas las pausas ≥ 0,4 s, o mantienes algunas pausas para un ritmo más pausado?
5. La tarjeta de 'Seguir' del cierre usaba el azul antiguo: ¿la rehacemos con tus colores nuevos?
6. Sin música, ¿quieres igualmente efectos (obturador, riser, golpe) como en AMIN_1018_03, o más sobrios?
7. ¿Qué objetivo de sonoridad prefieres: −14 LUFS (estándar) o −13 como tu edición del 18-10?
