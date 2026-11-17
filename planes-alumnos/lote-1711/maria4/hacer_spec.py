# Spec de María #4 escrito en tiempos del BRUTO y llevado al montaje con los tramos.
import json, re
T = [[1.15, 2.85], [3.10, 5.72], [8.35, 10.55], [11.02, 13.25], [15.10, 16.05], [16.62, 19.25], [20.80, 21.70], [22.70, 29.55],
     [31.22, 31.65], [32.88, 34.45], [46.05, 46.45], [48.15, 57.65], [59.05, 59.75], [67.90, 73.15], [74.95, 82.95], [84.85, 91.50]]
def m(t):
    off = 0
    for s, e in T:
        if s - 0.05 <= t <= e + 0.05: return round(off + max(0, t - s), 2)
        off += e - s
    raise ValueError(t)
P = lambda items, t1, y=560, tam=40: {"tipo": "pildoras", "t1": m(t1), "y": y, "lado": "der", "tam": tam, "items": [{"t": m(t), "texto": x, "emoji": e} for t, e, x in items]}
spec = {
 "alumno": "María Morales García", "video_id": "mwif2pvezkk5quo0", "titulo_salida": "María - entrevista en la calle",
 "bruto": "bruto.mov", "palabras": "prep/palabras.json", "tramos": T,
 "marca": {"nombre": "María Morales", "inicial": "M", "usuario": "@mariadmoraless", "rol": "Mamá fitness · entrenadora", "bueno": "#F2A07B", "malo": "#D64545", "clave_font": "playfair", "mayusculas": False},
 "cara_y": 0.30, "degradado_desde": 0.52, "degradado_fuerza": 235, "sombra": 255, "sombra_blur": 9, "sub_y": 1470, "pregunta_quien": "Amiga", "degradado": True,
 "zooms": [[m(76.33), m(77.25), 1.08], [m(80.89), m(81.45), 1.10], [m(88.58), m(89.6), 1.08]],
 "elementos": [
  {"tipo": "titulo", "t0": 0.05, "t1": m(2.75), "y": 1000, "linea1": "De dependienta con 600 € a…", "linea2": "−15 kg siendo mamá", "col": "bueno"},
  P([(3.20, "🛍️", "Dependienta"), (3.76, "💶", "600 € al mes"), (5.22, "💃", "Bailando de noche")], 5.70),
  P([(11.54, "👶", "Siendo mamá"), (12.66, "🙅‍♀️", "Sin matarse a entrenar")], 13.20),
  P([(23.67, "🚶‍♀️", "Caminar 40 min"), (25.43, "🍗", "Proteína y verdura"), (26.63, "🌙", "Cenar ligero"), (27.55, "📵", "Móvil fuera a las 9")], 29.50),
  {"tipo": "tarjeta", "t0": m(33.85), "t1": m(34.40), "x": 820, "y": 760, "lado": 300, "emoji": "📉", "texto": "−6 kg en 1 mes", "blanca": True},
  P([(49.32, "🍑", "Glúteo 3× semana"), (50.38, "🏃‍♀️", "Cardio"), (51.50, "🚫", "Cero alcohol"), (52.48, "🍬", "Cero azúcar")], 53.60),
  P([(67.95, "👶", "Mamás con niños"), (69.67, "⏱️", "Sin tiempo"), (70.63, "💼", "Con trabajo")], 73.10),
  {"tipo": "cta", "t0": m(85.10), "t_clic": m(88.58), "y": 980, "boton": "Mensaje", "boton_hecho": "CAMBIO ✓"}
 ],
 "frases": [
  "?@1.15|¿A qué te dedicabas antes de esto?",
  "@3.10|*Dependienta,*", "*600 euros* al mes", "y por la noche, *bailando.*",
  "?@8.35|¿Y cómo bajaste 15 kilos con esa vida?",
  "@11.02|Pues siendo *mamá,*", "dejando de *!matarme* a entrenar.",
  "?@15.10|¿Dejando de entrenar?",
  "@16.62|No, dejando de *!matarme,*", "que *no es lo mismo.*",
  "?@20.80|¿Entonces qué hacías?",
  "@22.70|Muy *simple:*", "caminar *40 minutos* al día,", "comer *proteína y verdura,*", "cenar *ligero*", "y apagar el móvil *a las nueve*", "para *dormir.*",
  "?@31.22|¿Y ya?",
  "@32.88|Y en un mes, *seis kilos menos.*",
  "?@46.05|¿Y ahora?",
  "@48.15|Ahora, tres veces *glúteo* a la semana,", "*cardio,*", "*cero alcohol,*", "*cero azúcar*", "y cada semana *acompaño*", "a *mujeres como yo*", "a conseguir *lo mismo.*",
  "?@59.05|¿Mujeres como tú?",
  "@67.90|*Mamás* con niño,", "*sin tiempo,*", "*con trabajo,*", "exactamente igual que *estaba yo.*",
  "@74.95|No necesitas tener", "una *vida perfecta.*", "De hecho, yo *tampoco la tenía.*", "Lo que necesitas es tener *un plan*", "que se adapte a *la vida que tienes.*",
  "@84.85|Si yo pude *con esa vida,*", "tú también puedes *con la tuya.*", "Escríbeme *CAMBIO*", "por *mensaje privado*", "y vemos por dónde *empiezas tú.*"
 ],
 "eventos_extra": [{"t": 0.02, "type": "sub_drop"}],
 "musica": "ardie-son-infinite-circles-no-backing-vocals.mp3", "musica_desde": 0
}
spec['frases'] = [re.sub(r'@([\d.]+)\|', lambda g: '@%.2f|' % m(float(g.group(1))), f) for f in spec['frases']]
json.dump(spec, open('spec.json', 'w'), ensure_ascii=False, indent=1); print('duración', round(sum(e - s for s, e in T), 2))
