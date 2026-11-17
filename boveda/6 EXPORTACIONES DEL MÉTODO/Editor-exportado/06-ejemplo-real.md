# 06 · Ejemplo real: "Calcula esto" (ClienteE, reel de 57,2 s)

Reel educativo de fitness: cómo calcular calorías y macros a partir del peso corporal. Está grabado con cámara (archivo `A001_…_C509.mov`, 24 fps, 3840×2160 con rotación) y sin música en el bruto.

**Quién hizo qué** (importante para copiar el método):
- **Yo:** el primer corte, todas las animaciones (lista, operaciones, pizarra, suma), los sonidos de la animación, la remapeo tras cada recorte, el arreglo de canales de voz y la revisión con fotogramas.
- **El usuario:** los subtítulos (gráficos nativos de Premiere), la música, el título "CALCULA esto" y los recortes finales del audio.
- **El cliente** mandó dos rondas de correcciones (texto y audio de voz).

Los datos de montaje están en `ejemplos/01 Calcula esto (ClienteE)/`. El vídeo no se incluye (ver `00-LEEME.md`).

## 1. Cortes (tiempos en la secuencia · segundos del bruto · qué se dice)

El bruto dura unos 180 s y el reel queda en **57,2 s**: se quita casi el 70 %.

| Secuencia (s) | Bruto (s) | Texto | Por qué se corta ahí |
|---|---|---|---|
| 0,00–4,71 | 30,83–35,54 | "Calcula esto, vas a coger tu peso corporal y lo vas a multiplicar por 30" | Fuera los 30 s de antes (preparación y ensayo). Termina justo antes de "o por 35": el cliente pidió **una sola cifra** |
| 4,71–7,67 | 42,75–45,71 | "Esas son la cantidad de calorías que deberías consumir por día." | Salta 7,2 s: una toma repetida y una pausa |
| 7,67–10,58 | 52,71–55,62 | "tu peso corporal y multiplícalo por 1.6" | Sin "o por 2" (alternativa) |
| 10,58–14,71 | 57,38–61,50 | "Esta es la cantidad de proteína mínima y máxima…" | |
| 14,71–15,21 | 63,62–64,12 | "Ahora" | Enlace de 0,5 s; el resto era repetición |
| 15,21–18,00 | 81,33–84,12 | "Coge tu peso corporal y multiplícalo por 0.8" | Salta 17 s de tomas falsas. **El cliente pidió 0,8 en vez de 1** y el usuario cortó para que lo diga |
| 18,00–21,04 | 86,17–89,21 | "Esta es la cantidad de grasa…" | |
| 21,04–22,88 | 92,00–93,83 | "Coges tu peso corporal y multiplícalo" | |
| 22,88–24,00 | 94,83–95,96 | "o por 35." | **El cliente pidió 35 (agua).** Se salta "por 30" y se queda "o por 35" |
| 24,00–26,88 | 96,21–99,08 | "Esta es la cantidad de agua…" | |
| 26,88–30,83 | 112,42–116,38 | "…multiplica el número que te dio en las proteínas por 4." | Salta 13 s (repeticiones) |
| 30,83–34,38 | 118,42–121,96 | "Y ahora multiplica… las grasas por 9." | |
| 34,38–35,25 | 124,54–125,42 | "Para estos dos," | |
| 35,25–39,29 | 126,75–130,79 | "…la cantidad de calorías que llevarías entre proteínas y grasas." | |
| 39,29–42,25 | 136,83–139,79 | (resta para "completar") | Whisper se saltó este tramo; se cuadró con la energía de la voz |
| 42,25–43,12 | 140,17–141,04 | "la cantidad total." | |
| 43,12–47,75 | 142,92–147,54 | "Divídelo por 4 y esa va a ser la cantidad de carbohidratos…" | |
| 47,75–51,33 | 149,54–153,13 | "…voy a tener que consumir fibra" | |
| 51,33–55,38 | 153,58–157,62 | "…por cada mil kilocalorías debo consumir catorce gramos" | |
| 55,38–57,21 | 171,92–173,75 | "Todo lo que he hecho lo he hecho con mi peso." | Salta 14 s. En la última ronda el usuario quitó "En mi caso debería consumir 35 g de fibra", porque con 80 kg salen 33,6 g y no cuadraba |

- **Aire:** 0,08 s antes y 0,15 s después, con los cortes en el mínimo de energía entre palabras.
- **Audio en tablero:** A1/A2 alternando, con solapes de 1–3 fotogramas en algunos cortes; es el estilo del usuario.
- **Lección:** cuando el cliente cambia una cifra, **hay que cortar la voz para que la diga**. Cambiar solo el gráfico deja pantalla y voz contradiciéndose.

## 2. Gancho (0–3 s)

- 0,00 s: "Calcula esto" (el usuario pone el título grande "CALCULA ESTO").
- 1,29–2,99 s: píldora "Perder grasa 🔥" (naranja #FF5800, Sequel Heavy 70 px). Dura **1,7 s**: el cliente pidió 1–2 s como máximo, antes estaba todo el vídeo.
- 2,13 s: aparece "🧍‍♂️ 80kg". El icono de persona lo pidió el cliente "para asociar el número al peso".
- No se reordena: el guion ya abre con la orden ("Calcula esto") y la promesa.

## 3. Animación sincronizada (Remotion, 1080×1920, 30 fps, escala 200)

Todos los tiempos salen de las marcas de palabra. Están en `animacion-props-v17.json`.

| t (s) | Qué pasa | Palabra que lo dispara |
|---|---|---|
| 2,13 | "🧍‍♂️ 80kg" aparece en el hueco 1 de la lista (x 495, y 400) | "peso corporal" |
| 4,46 | → "80kg × 30" (el × en naranja) | "30" (4,49) |
| 6,15 | Se convierte en "🔥 Calorías / 2400 kcal" | "calorías" (6,14) |
| 9,85 | "80kg × 1,6" | "1.6" (9,88) |
| 12,01 | "🥩 Proteína / 128 g" | "proteína" (12,01) |
| 17,27 | "80kg × 0,8" | "0.8" |
| 19,42 | "🥑 Grasa / 64 g" | "grasa" |
| 23,47 | "80kg × 35" | "35" |
| 25,48 | "💧 Agua / 2,8 L" | "agua" |
| 27,59 | La lista se esconde y entra la pizarra "Carbohidratos" con "???" en negro | "Antes de seguir…" |
| 29,76 → 31,00 | "🥩 128 g × 4" se funde en **"512 kcal"**, que sube y se queda fijado arriba | "por 4" |
| 33,34 → 34,56 | "🥑 64 g × 9" → **"576 kcal"** fijado | "por 9" |
| 35,96 → 36,79 | Los dos fijados bajan y se fusionan: "512 + 576" → **"1088 kcal"**, más grande (×1,45) | "Para estos dos" |
| 40,65 → 42,71 | "🔥 2400 − 1088" → **"1312 kcal"** | "completar la cantidad total" |
| 43,31 → 45,71 | "1312 ÷ 4" → **"🍞 328 g"**, que se queda en grande | "Divídelo por 4" |
| 46,76 | Vuelve la lista, escalonada, con "🍞 Carbohidratos / 328 g" | |
| 51,21 → 55,75 | Pizarra "Fibra": "2400 kcal ÷ 1000" → "2,4" → "2,4 × 14" → **"🥦 33,6 g"** | "cada mil" / "catorce gramos" |
| 56,00 | Vuelve la lista con Fibra y "Total" sube hasta **2400 kcal** (+512, +576, +1312 en amarillo) | "con mi peso" |

Decisiones:
- **La pizarra esconde la lista.** Si conviven, se tapan y hay demasiada información; lo pidió el cliente.
- **Una operación cada vez y solo el resultado fijo:** "mucho texto quita el foco" (cliente).
- **Si un resultado se reutiliza en menos de 1,6 s**, no sube a fijado (evita un doble fantasma).
- **Versión B** (`animacion-props-v17-B-numerada.json`): la lista como "1. Calorías 🔥 / 2. Proteína 🥩…". Cambios para no chocar con los subtítulos del usuario (franja ≈ 915–995 px):
  - lista más compacta (tamaño 60, línea 100, desde y 300);
  - "Total" alineado a la derecha;
  - píldora más arriba (y 150).

## 4. Subtítulos (los hizo el usuario; lo que yo comprobé)

- Blancos, sobre el pecho (~950 px de 1920), con la palabra clave en naranja ("ESTO").
- Comprobé con fotogramas reales que ningún elemento de la animación tocaba un subtítulo en 0,5 / 1,8 / 7,5 / 13,2 / 14,4 / 26,2 / 40,5 / 47,8 / 56,6 / 57,15 s.

## 5. Zooms

En este reel no hay zooms: es un plano fijo explicativo y toda la atención va a la lista. Se cumple la regla de que cuanta más confianza pide el mensaje, menos adorno.

## 6. Sonido

- **Voz:** cadena del usuario (Mejorar la voz → Volumen 0 dB → Compresor de banda única → Limitador forzado) y **"Rellenar izquierda con derecha"**: la voz venía solo por el canal derecho; el izquierdo, a −91 dB.
- **Música** (la eligió el usuario): un instrumental de trap, nivel 0,259 en Premiere (≈ +3,3 dB de clip) con Limitador forzado y Mastering, que entra a los 0,0 s.
- **Efectos (míos), clavados a la animación** (`sfx-tiempos-en-secuencia.json`):

  | Pista | Sonido | Cuántos | Cuándo | Nivel |
  |---|---|---|---|---|
  | A8 | Smooth Pop | 7 | inicio (0,24 s) + cada ítem que entra en la lista (6,15 / 12,01 / 19,42 / 25,48 / 46,76 / 56,0) | 0,079 |
  | A6 | Ui button | 11 | cada "80kg" (4) y cada operación de la pizarra que empieza (7) | 0,071 |
  | A6 | VS_Short Whoosh 3 | 2 | entra la pizarra de Carbohidratos (27,34 s) y la de Fibra (termina al entrar, 50,0–51,2 s) | 0,071 |
  | A7 | Mouse Click 03 | 11 | cada "× número" (4) y cada resultado (7), 0,02 s antes | 0,089 |

- Nada en las fusiones: ya hay un sonido en ese resultado.

## 7. Imagen y exportación

- **Color:** el usuario aplicó su corrección (Lumetri base de la tabla de `02-reglas-y-numeros.md`).
- **Formato:** secuencia 2160×3840. La animación es ProRes 4444 1080×1920 escalada al 200 %, en la pista V10 (versión A) y en la V12 (versión B, alternativa).
- **Exportación:** la hace el usuario con Media Encoder, preset "max h264". Hay que esperar a que acabe "Mejorar la voz".

## 8. Versiones y por qué

| Versión | Cambio | Motivo |
|---|---|---|
| v1–v8 | Estilo de la referencia del cliente (lista que se acumula, operación que se transforma, tarjeta de cálculo) | Propuesta inicial |
| v9–v11 | Título "CALCULA esto", píldora 1–2 s, emoji + nombre + valor pequeño, pizarra que esconde la lista, suma final | 1.ª corrección del cliente |
| v12–v13 | Remapeo a los recortes del usuario; números cambiados (×1,6, ×1) | Recortes del usuario |
| v14 | Pizarra paso a paso; agua ×35 | 2.ª corrección |
| v15–v16 | 80 kg en vez de 83; grasa ×0,8; "???"; fusiones; icono de persona | Audio del cliente |
| v17 | Sin título (lo hace el usuario); final recortado; lista B numerada sin chocar con los subtítulos | Último recorte del usuario |
