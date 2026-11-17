import json, re
T = [[36.30, 38.55], [52.95, 55.00], [59.92, 61.75], [67.30, 69.45], [72.45, 72.70], [72.70, 74.95], [102.80, 105.90]]
def m(t):
    off = 0
    for s, e in T:
        if s - 0.05 <= t <= e + 0.05: return round(off + max(0, t - s), 2)
        off += e - s
    raise ValueError(t)
C = lambda a, b, n, col, txt, em: {"tipo": "color", "t0": m(a), "t1": m(b), "nombre": n, "col": col, "texto": txt, "emojis": em, "y": 70}
spec = {"alumno": "Alessandro Martin Afonso", "video_id": "mwjrnsx6smtzgb5f", "titulo_salida": "Alessandro - colores de los alimentos",
 "bruto": "bruto.mov", "palabras": "palabras2.json", "tramos": T,
 "marca": {"nombre": "Alessandro Martin", "inicial": "A", "usuario": "@alessmartin.fitness", "rol": "Pérdida de grasa para mujeres", "bueno": "#34C759", "malo": "#FF3B30", "clave_font": "montserrat"},
 "cara_y": 0.36, "colores": {"rojo": "#FF3B30", "verde": "#34C759", "naranja": "#FF9500", "morado": "#C77DFF", "amarillo": "#FFCC00"}, "sub_y": 1480, "transiciones": [m(52.95), m(59.92), m(67.30), m(72.70), m(102.80)],
 "elementos": [
  {"tipo": "titulo", "t0": 0.0, "t1": 1.30, "y": 120, "linea1": "Come de todos los colores", "linea2": "5 COLORES", "col": "bueno"},
  C(37.0, 38.5, "Rojo", "#FF3B30", "Presión arterial saludable", ["🍓", "🍉", "🍅", "🍒", "🌶️"]),
  C(52.95, 54.95, "Verde", "#34C759", "Colesterol en niveles buenos", ["🍏", "🥑", "🥒", "🥬", "🥦", "🫛"]),
  C(59.92, 61.70, "Naranja", "#FF9500", "Salud intestinal", ["🥕", "🍊", "🍑", "🎃", "🍠"]),
  C(67.30, 72.68, "Morado", "#AF52DE", "Azúcar en sangre estable", ["🍇", "🫐", "🍆"]),
  C(72.70, 74.90, "Amarillo", "#FFCC00", "Náuseas y dolor de estómago", ["🍌", "🍋", "🫚", "🥔", "🍵"]),
  {"tipo": "cta", "t0": m(104.84), "t_clic": m(105.0), "y": 160, "boton": "Seguir"}
 ],
 "frases": ["@%s|El rojo ayuda a mantener" % 36.30, "la *%rojo%presión arterial saludable.*", "@%s|El verde ayuda a niveles" % 52.95, "*%verde%buenos de colesterol.*",
  "@%s|El naranja apoya" % 59.92, "la *%naranja%salud intestinal.*", "@%s|El morado ayuda a mantener" % 67.30, "niveles buenos de *%morado%azúcar en sangre.*",
  "@%s|El amarillo te ayuda con síntomas" % 72.70, "como *%amarillo%náuseas o dolor estomacal.*",
  "@%s|Y si quieres saber más" % 102.80, "sobre *pérdida de grasa y nutrición,*", "*sígueme.*"],
 "eventos_extra": [{"t": 0.02, "type": "sub_drop"}], "musica": "90mh-but-it-s-a-chill-lofi-type-beat.mp3", "musica_desde": 0}
spec['frases'] = [re.sub(r'@([\d.]+)\|', lambda g: '@%.2f|' % m(float(g.group(1))), f) for f in spec['frases']]
json.dump(spec, open('spec.json', 'w'), ensure_ascii=False, indent=1); print('duración', round(sum(e - s for s, e in T), 2))
