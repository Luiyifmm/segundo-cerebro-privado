import json
T = [[7.95, 10.98], [21.95, 24.95], [26.55, 31.40]]
def m(t):
    off = 0
    for s, e in T:
        if s - 0.05 <= t <= e + 0.05: return round(off + max(0, t - s), 2)
        off += e - s
    raise ValueError(t)
F = '../_fotos-mercadona/'
spec = {"alumno": "Alessandro Martin Afonso", "video_id": "mwjr3evgnmlkk47l", "titulo_salida": "Alessandro - Mercadona engorda o adelgaza",
 "bruto": "bruto.mov", "palabras": "palabras2.json", "tramos": T,
 "marca": {"nombre": "Alessandro Martin", "inicial": "A", "usuario": "@alessmartin.fitness", "rol": "Pérdida de grasa para mujeres", "bueno": "#34C759", "malo": "#FF3B30", "clave_font": "montserrat"},
 "cara_y": 0.36, "sub_y": 990, "degradado_desde": 0.55, "degradado_fuerza": 200, "transiciones": [m(21.95), m(26.55)],
 "elementos": [
  {"tipo": "columnas", "t0": 0.0, "t1": 99, "y": 1260, "alto": 620, "y_flota": 330, "lado_flota": 230, "lado_item": 210, "celda": 300, "rodeo_x": 540, "rodeo_y": 700,
   "titulo": "Quesos de Mercadona: ¿engorda o adelgaza?", "cabeceras": ["ADELGAZA", "ENGORDA"], "col_cab": ["bueno", "malo"],
   "items": [{"t": m(8.04), "t_col": m(9.08), "col": 1, "texto": "Para fundir", "largo": "Queso para fundir", "img": F + "queso-fundir.jpg"},
             {"t": m(22.05), "t_col": m(23.13), "col": 1, "texto": "Emmental", "largo": "Queso emmental", "img": F + "emmental.jpg"},
             {"t": m(26.65), "t_col": m(30.03), "col": 0, "texto": "Babybel", "largo": "Mini Babybel", "img": F + "babybel.jpg"}]},
  {"tipo": "cta", "t0": m(30.40), "t_clic": m(31.0), "y": 300, "boton": "Seguir"}
 ],
 "frases": ["@%.2f|Queso para fundir." % m(7.95), "*!Engorda.*", "Literalmente tiene de todo *!menos queso.*",
  "@%.2f|Queso emmental." % m(21.95), "También *!engorda.*", "Te sueles pasar mucho *!las cantidades.*",
  "@%.2f|Queso Babybel." % m(26.55), "Perfecto *para tus snacks.*", "*Adelgaza.*"],
 "eventos_extra": [{"t": 0.02, "type": "sub_drop"}], "musica": "90mh-but-it-s-a-chill-lofi-type-beat.mp3", "musica_desde": 0}
json.dump(spec, open('spec.json', 'w'), ensure_ascii=False, indent=1); print('duración', round(sum(e - s for s, e in T), 2))
