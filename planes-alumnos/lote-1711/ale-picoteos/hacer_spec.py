import json, re
T = [[0.0, 0.66], [2.02, 4.25], [4.40, 40.45]]
def m(t):
    off = 0
    for s, e in T:
        if s - 0.05 <= t <= e + 0.05: return round(off + max(0, t - s), 2)
        off += e - s
    raise ValueError(t)
F = '../_fotos-mercadona/'
I = lambda t, tc, col, txt, img=None, emo=None, largo=None: {k: v for k, v in {"t": m(t), "t_col": m(tc), "col": col, "texto": txt, "img": (F + img + '.jpg') if img else None, "emoji": emo, "largo": largo}.items() if v is not None}
spec = {"alumno": "Alessandro Martin Afonso", "video_id": "mwjrr7jwxwqckdzy", "titulo_salida": "Alessandro - picoteos de Mercadona",
 "bruto": [b for b in ["bruto.mov", "bruto.mp4"] if __import__('os').path.exists(b)][0], "palabras": "prep/palabras.json", "tramos": T,
 "marca": {"nombre": "Alessandro Martin", "inicial": "A", "usuario": "@alessmartin.fitness", "rol": "Pérdida de grasa para mujeres", "bueno": "#34C759", "malo": "#FF3B30", "clave_font": "montserrat"},
 "cara_y": 0.36, "sub_y": 990, "degradado_desde": 0.55, "degradado_fuerza": 200,
 "elementos": [
  {"tipo": "columnas", "t0": 0.0, "t1": m(31.95), "y": 1260, "alto": 620, "y_flota": 330, "lado_flota": 230, "lado_item": 150, "celda": 265, "titulo": "Picoteos de Mercadona: ¿adelgaza o engorda?", "rodeo_x": 540, "rodeo_y": 700,
   "cabeceras": ["TE AYUDA A ADELGAZAR", "TE AYUDA A ENGORDAR"], "col_cab": ["bueno", "malo"],
   "items": [I(0.07, 2.35, 0, "Palomitas", "palomitas", largo="Palomitas caseras"),
             I(4.45, 9.79, 1, "Frutos secos*", "frutos-secos", largo="Frutos secos"),
             I(10.57, 11.95, 1, "Digestive", "digestive", largo="Galletas Digestive"),
             I(13.95, 15.47, 1, "Tortitas choco", "tortitas-chocolate", largo="Tortitas con chocolate"),
             I(19.61, 20.54, 0, "Sandía", emo="🍉"),
             I(25.06, 25.96, 0, "Pepinillos", "pepinillos"),
             I(27.34, 28.36, 0, "Helado mango", "helado-mango", largo="Helado de mango")]},
  {"tipo": "tarjeta", "t0": m(17.97), "t1": m(19.45), "x": 540, "y": 330, "lado": 300, "img": F + "tortitas-legumbres.jpg", "texto": "Mejor: de legumbre", "marca": "si", "blanca": True},
  {"tipo": "pill", "t0": m(35.27), "t1": 99, "y": 600, "emoji": "💬", "texto": "Comenta PICOTEO", "col": "bueno"},
  {"tipo": "cta", "t0": m(35.27), "y": 300, "boton": "Seguir"}
 ],
 "frases": ["Palomitas caseras.", "Son muy *poco calóricas*", "y puedes comer *en gran cantidad.*",
  "Frutos secos.", "Son grasas *saludables*", "y muy importantes *para tus hormonas,*", "pero si te pasas *!con la cantidad,*", "te ayudan *!a engordar.*",
  "Galletas Digestive.", "Te van a ayudar *!a engordar,*", "son muy, muy *!calóricas.*", "Tortitas con chocolate.", "Te van a ayudar *!a engordar,*", "son muy *!calóricas*",
  "y si quieres algo mejor,", "te recomiendo cambiarlas *por las de legumbre.*", "Sandía.", "Te ayuda *a adelgazar.*", "Para mí, la mejor fruta *para picotear:*",
  "tiene tan solo *30 calorías*", "cada *100 gramos.*", "Pepinillo.", "Ayuda a adelgazar, *clarísimo.*", "Helado de mango.", "Ayuda *a adelgazar.*",
  "Sobre todo lo recomiendo mucho", "para cuando tienes un *antojo de dulce*", "en el *postre.*", "¿Y qué otros snacks", "puedo comer para *perder peso?*",
  "Pues si quieres saberlos,", "comenta la palabra *PICOTEO*", "y te envío una lista", "con los *mejores picoteos de Mercadona*", "para perder *más de 10 kilos*", "en menos de *90 días.*"],
 "sin_subs": [],
 "eventos_extra": [{"t": 0.02, "type": "sub_drop"}], "musica": "90mh-but-it-s-a-chill-lofi-type-beat.mp3", "musica_desde": 0}
json.dump(spec, open('spec.json', 'w'), ensure_ascii=False, indent=1); print('duración', round(sum(e - s for s, e in T), 2))
