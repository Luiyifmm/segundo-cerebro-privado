# Alumnos Trainer10x · prueba de la skill `talking-head-premium` (14-11-2026)

Modo: ENTRENAMIENTO sobre copias. Proyecto `3 PROYECTOS/Alumnos Trainer10x/ALUMNOS TRAINER10X - 14 NOV.prproj`. Nada de esto está aprobado.

## Traspaso (lo esencial)
- **Premiere quedó colgado** al sustituir la capa de prueba (script `cambiar.jsx`: quitar clip de V2 + importar + colocar). No sé en qué punto se paró. Mirar si hay un diálogo abierto; si no responde, cerrar y abrir Premiere. **No sé si el proyecto estaba guardado.**
- Secuencia de prueba: «CAMILO · PRUEBA gancho talking-head-premium (Claude)» (copia; la original no se tocó). En V2 debería haber una sola capa de 0 a 9 s, o ninguna.
- Capas en `MEDIA/_pruebas Claude/`: `…v1.mov` (ffmpeg prores_ks) y `…v2.mov` (ProRes de Apple). Con la v1 Premiere **no reconoció la transparencia** (fondo negro, incluso tras poner «alfa directo»). La v2 no llegó a comprobarse.
- Generador: copiar `scratchpad/tools/gancho_camilo.py` si se va a seguir (el scratchpad se borra).

## Los tres vídeos (panel → Entregados)
| Secuencia | Guion | Petición del alumno | Estado en Premiere |
|---|---|---|---|
| CAMILO ARIAS · sentadillas ciclista (68,8 s) | «¿Esto te va a pasar si haces sentadillas? Spoiler: no» | Foto del ciclista de pista detrás, texto «¿TE PONDRÁS ASÍ?», nombre y foto del ciclista, foto de Cami flaco y foto de ahora | Corte + 4 SFX + música. Sin gráficos. Subtítulos SRT en pista de subtítulos |
| KEVIN PALACIOS · el lunes empiezo (42,2 s) | Bucle de 6 pasos; falla en el 2; caso Francys (−13 kg en 3 meses) | — (el bruto ya viene con sus subtítulos metidos: pedirle el bruto limpio) | Corte |
| MIGUEL SANTOS · mochila de partido (34,6 s) | Qué comer antes del partido y en el descanso | «Ya está todo cortado; los subtítulos siempre en rojo con neón» | Corte |

## Plan de escenas · Camilo (propuesta, decide Luis)
Paleta: lima #C6FF00 (acento), rojo #FF5A36 (el «no»), blanco y negro teñidos. Letras: Sequel Sans Light/Medium (relleno) + Heavy (palabra especial). Es su marca aprobada.
Los subtítulos van **sobre la camiseta negra** (68–78 % del alto): más arriba tapan la mano y el micro; sobre la pared gris la lima no se lee.

| Tiempo | Frase | Escena | Motivo |
|---|---|---|---|
| 0,0–2,8 | ¿Esto te va a pasar si haces sentadillas? | A-roll. Tarjeta con la foto del ciclista en la pared + etiqueta «¿TE PONDRÁS ASÍ?» + caja de selección en el muslo. «sentadillas?» en Heavy lima. Rótulo «Camilo Arias» abajo a la izquierda, una vez | Lo pide su guion; la imagen temprana promete nivel |
| 2,8–4,0 | No. | «No.» grande en rojo; la etiqueta pasa a «SPOILER: NO» | El golpe del gancho (ya tiene sub-bass) |
| 4,0–8,9 | Estas piernas son de un ciclista de pista profesional. Robert Förstemann | Pantalla completa: la tarjeta crece hasta llenar; «ciclista de pista» en lima; caja en el muslo; nombre 150 ms antes de decirlo | Recompensa del gancho, hecha literal |
| 9,2–18,5 | …alguien me dice: «paso, que me pongo grande y subo peor» | A-roll; la objeción entre comillas, «grande» en rojo | Es la voz del espectador |
| 18,6–25,1 | Yo era muy delgado… sigo compitiendo en descenso | Lado a lado: foto de Cami antes / ahora | **Faltan sus fotos: pedirlas** |
| 25,4–32,5 | Para tener unas piernas como esa: años, comer muchísimo, genética | Pantalla completa, 3 elementos que se van sumando | Lista de componentes |
| 32,8–40,5 | Tú: 2 días de fuerza, bajar grasa, montar el finde | La misma estructura de 3, en lima, para contrastar con la anterior | Comparación directa |
| 40,8–43,9 | No te vas a despertar un día con esas piernas | A-roll con zoom; vuelve la tarjeta del ciclista, tachada | Motivo visual repetido |
| 44,2–51,5 | Más fuerza, más aguante, aguanta las caídas | B-roll MTB con texto en el tercio inferior (uno por beneficio) | Algo que hay que ver. **Falta b-roll suyo** |
| 51,7–58,5 | Moraleja | A-roll, «ciclista más fuerte» en lima | Respirar |
| 59,1–68,6 | CTA | A-roll + «CICLISTA, NO CULTURISTA» | Cierre en A-roll |

Reparto: A-roll ≈ 55 %, b-roll/imagen ≈ 20 %, pantalla completa ≈ 25 %.

## Kevin y Miguel (apunte, sin montar)
- **Kevin:** el guion pide contar con los dedos → contador 1–6 que se va llenando (tipo «cifras»); el paso 2 se marca en rojo cuando dice «falla en el dos»; tarjeta de Francys con «−13 kg · 3 meses». Bloqueado mientras el bruto traiga sus subtítulos.
- **Miguel:** manda su petición (rojo con neón). El estilo minimal no encaja con neón: usar su rojo como acento y dejar el neón solo en la palabra especial; lista «me llevo / no me llevo» como dos columnas.

## Lo comprobado y lo que no
- ✅ Fotogramas de diseño sobre fotogramas reales de Premiere (0–8 s): composición, legibilidad y posición sobre la camiseta.
- ❌ La capa dentro de Premiere con transparencia. ❌ Movimiento a velocidad real. ❌ Sonido. ❌ Zoom de apertura 117→100 (no hecho). ❌ Ocultar la pista de subtítulos SRT (no hay API: se hace con el ojo de la pista).
- Foto: «Robert Förstemann.jpg», Roth-Foto.de, CC BY-SA 3.0 de (Wikimedia Commons). Exige atribución; confirmar con Amin si vale para publicar.
- «Fuerza para ciclistas · MTB» bajo su nombre es mío, no suyo.

## Propuestas para la skill (pendientes)
- 🧪 Capa transparente para Premiere: comprobar `alphaUsage` al importar y mirar un fotograma **antes** de seguir; ffmpeg `prores_ks` 4444 no fue reconocido.
- 🧪 Subtítulos «en el pecho» depende del plano: aquí bajan al 68–78 % por la mano y el micro.
- 🧪 Con pared clara, el texto de acento va solo sobre zonas oscuras (camiseta) o dentro de una píldora oscura.
