import json, re
T = [[10.60, 16.40], [39.80, 43.60], [67.95, 70.15], [72.05, 75.45], [78.90, 82.40], [84.95, 86.10],
     [104.80, 106.40], [106.60, 113.05], [129.10, 132.60], [136.40, 138.20], [138.60, 142.75],
     [196.85, 198.30], [199.05, 204.30], [236.65, 242.70]]
def m(t):
    off = 0
    for s, e in T:
        if s - 0.05 <= t <= e + 0.05: return round(off + max(0, t - s), 2)
        off += e - s
    raise ValueError(t)
Z = lambda a, b, z=1.35: [m(a), m(b), z]
spec = {
 "alumno": "Marc Martínez García (Marc)", "video_id": "mwg33oqwmoj19wry", "titulo_salida": "Marc - abdominales y dolor de espalda",
 "bruto": "bruto.mov", "palabras": "palabras2.json", "tramos": T, "ganancia_db": 12,
 "marca": {"nombre": "Marc Martínez", "inicial": "M", "usuario": "@mmartinez.fitness", "rol": "Entrenador · espalda sana", "bueno": "#30D158", "malo": "#FF453A", "clave_font": "montserrat"},
 "cara_y": 0.62, "sub_y": 1500,
 "zooms": [Z(10.6, 16.4, 1.30), Z(39.8, 43.6, 1.30), Z(67.95, 86.1), Z(104.8, 113.05), Z(129.1, 142.75)],
 "transiciones": [m(39.80), m(67.95), m(104.80), m(129.10), m(196.85), m(236.65)],
 "elementos": [
  {"tipo": "titulo", "t0": 0.05, "t1": m(16.3), "y": 120, "linea1": "¿Te duele la espalda?", "linea2": "NO HAGAS ESTOS", "col": "malo"},
  {"tipo": "tarjeta", "t0": m(15.75), "t1": m(16.35), "x": 540, "y": 560, "lado": 240, "emoji": "🙅‍♂️", "texto": "Crunch", "marca": "no"},
  {"tipo": "titulo", "t0": m(42.57), "t1": m(43.55), "y": 160, "linea1": "Hay opciones", "linea2": "MEJORES", "col": "bueno"},
  {"tipo": "titulo", "t0": m(68.0), "t1": m(86.05), "y": 140, "linea1": "Ejercicio 1", "linea2": "BICHO MUERTO", "col": "bueno"},
  {"tipo": "titulo", "t0": m(104.85), "t1": m(113.0), "y": 140, "linea1": "Ejercicio 2", "linea2": "BIRD DOG", "col": "bueno"},
  {"tipo": "pill", "t0": m(113.0) - 1.6, "t1": m(113.0), "y": 520, "emoji": "⏱️", "texto": "5 s por lado", "col": "bueno"},
  {"tipo": "titulo", "t0": m(129.15), "t1": m(142.7), "y": 140, "linea1": "Ejercicio 3", "linea2": "PLANCHA LATERAL", "col": "bueno"},
  {"tipo": "pill", "t0": m(140.36), "t1": m(142.7), "y": 520, "emoji": "⏱️", "texto": "10 s y cambias", "col": "bueno"},
  {"tipo": "cta", "t0": m(240.40), "t_clic": m(241.23), "y": 160, "boton": "Mensaje", "boton_hecho": "DOLOR ✓"}
 ],
 "frases": [
  "¿Te duele la *!espalda*", "y te mando a hacer *!abdominales?*", "Vale, pero *!no a estos.*",
  "Si al hacer *!encogimientos*", "te molesta la *!espalda o el cuello,*", "hay *opciones mejores.*",
  "@%s|Número 1: *el bicho muerto.*" % 67.95, "@%s|Túmbate *boca arriba*" % 72.05, "y mira que tu *lumbar*", "no esté *despegada del suelo.*",
  "@%s|Eleva tus brazos *hacia el techo*" % 78.9, "y trata de llevar las *rodillas hacia los codos*", "@%s|sin despegar *la lumbar.*" % 84.95,
  "@%s|Número 2: *el bird dog.*" % 104.8, "@%s|Este ejercicio trata de ponerse" % 106.6, "en *cuadrupedia*", "y estirar tu *pierna y tu mano*", "de forma que queden", "completamente *horizontales*", "con *el suelo.*",
  "@%s|Número 3: *la plancha lateral*" % 129.1, "con *rodillas dobladas.*", "@%s|y ahí levantaremos *la cadera del suelo.*" % 136.4,
  "@%s|Tratemos de aguantar esta posición *unos 10 segundos*" % 138.6, "y luego *cambiamos de lado.*",
  "@%s|Tu abdomen no tiene que *doblarse más*" % 196.85, "o *más fuerte,*", "simplemente tiene que *aguantarte mejor.*",
  "@%s|Si te duele la *espalda*" % 236.65, "y no sabes qué ejercicios", "te convienen *a ti,*", "escríbeme *DOLOR*", "y me miro *tu caso.*"
 ],
 "eventos_extra": [{"t": 0.02, "type": "sub_drop"}],
 "musica": "low-mileage-hold-you-ncs-release.mp3", "musica_desde": 0
}
spec['frases'] = [re.sub(r'@([\d.]+)\|', lambda g: '@%.2f|' % m(float(g.group(1))), f) for f in spec['frases']]
json.dump(spec, open('spec.json', 'w'), ensure_ascii=False, indent=1); print('duración', round(sum(e - s for s, e in T), 2))
