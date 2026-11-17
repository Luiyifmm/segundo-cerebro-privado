# Vídeo completo de Camilo (0–68,8 s del corte) según el diseño aprobado el 16-11 (hoja_diseno.jpg, escenas 1–12).
# 0–9,4 s: el gancho aprobado, tal cual (se ejecuta el código de anima_gancho.py sin tocarlo). 9,4–68,8 s: escenas 5–12, misma mecánica.
# Base desde el bruto según ../tramos.json; tiempos de palabra = palabras.json (bruto) llevados al corte con tramos.json.
# No toca Premiere. Uso: <python del entorno whisperx> anima_video.py <carpeta de trabajo>
import os, sys, json, math, subprocess
import numpy as np
from multiprocessing import Pool
AQUI = os.path.dirname(os.path.abspath(__file__)); WORK = sys.argv[1]
_g = open(os.path.join(AQUI, 'anima_gancho.py'), encoding='utf-8').read().split('\ndef base():')[0]
_g = _g.replace("'%s/fr/b_%03d.png' % (WORK, f)", "'%s/fr/b_%04d.jpg' % (WORK, f)").replace("im.save('%s/an/a_%03d.png' % (WORK, f)); return f", 'return im')
exec(_g)                                     # funciones del diseño + cuadro() del gancho (devuelve la imagen)
cuadro_gancho = cuadro
TRAMOS = [tuple(x) for x in json.load(open(os.path.join(AQUI, '..', 'tramos.json')))]
DUR = sum(e - s for s, e in TRAMOS); N = int(round(DUR * FPS)); N_GANCHO = 282
GRIS = (40, 40, 44)
bo = lambda p: 1 + 2.2 * (min(1, max(0, p)) - 1) ** 3 + 1.2 * (min(1, max(0, p)) - 1) ** 2 if p < 1 else 1     # sale con un pequeño rebote
ent = lambda t, t0, d=0.22: eo((t - t0) / d)
sal = lambda t, t1, d=0.2: 1 - eo((t - t1) / d)

# ---------- subtítulos (apilados: relleno Medium crema que se escribe al decirse; clave Heavy que entra al decirla) ----------
# (desde, hasta, [(palabra, s)], clave, s_clave, color, y)
SUBS = [
    (9.50, 11.70, [('y', 9.50), ('cada', 9.60), ('vez', 9.82), ('que', 10.00), ('digo', 10.15), ('que', 10.34), ('hagas', 10.47)], 'SENTADILLAS', 10.75, LIMA, 1430),
    (11.73, 13.22, [('alguien', 11.73), ('me', 11.99), ('dice…', 12.13)], None, 0, LIMA, 1430),
    (13.25, 14.37, [], 'PASO', 13.25, CREMA, 1430),
    (14.39, 16.55, [('mejor…', 14.39)], 'PASO', 16.16, CREMA, 1430),
    (16.58, 17.50, [('que', 16.58), ('me', 16.72), ('pongo', 16.86)], 'GRANDE', 17.14, NARANJA, 1430),
    (17.52, 18.92, [('y', 17.52), ('subo', 17.56)], 'PEOR', 18.20, NARANJA, 1430),
    (18.94, 20.77, [('mira,', 18.94), ('yo', 19.20), ('era', 19.31), ('muy', 19.48)], 'DELGADO', 19.62, LIMA, 1430),
    (20.79, 21.50, [('y', 20.79), ('ganar', 20.87)], 'MÚSCULO', 21.17, LIMA, 1430),
    (21.53, 23.25, [('me', 21.53), ('ha', 21.59), ('costado', 21.69), ('un', 21.99)], 'MONTÓN DE TRABAJO', 22.09, LIMA, 1430),
    (23.28, 25.68, [('y', 23.28), ('aún', 23.28), ('así', 23.48), ('sigo', 23.74), ('compitiendo', 24.02), ('en', 24.54)], 'DESCENSO', 24.64, LIMA, 1430),
    (25.72, 27.42, [('para', 25.72), ('tener', 25.94), ('unas', 26.22)], 'PIERNAS COMO ESAS', 26.42, CREMA, 1430),
    (27.44, 28.74, [('hace', 27.44), ('falta', 27.70)], 'MUCHOS AÑOS', 28.20, NARANJA, 1430),
    (28.76, 30.28, [('entrenando', 28.76)], 'SOLO PARA ESO', 29.46, CREMA, 1430),
    (30.31, 31.62, [('comiendo', 30.31)], 'MUCHÍSIMO', 30.73, NARANJA, 1430),
    (31.64, 33.16, [('y', 31.64), ('una', 31.67)], 'GENÉTICA ESPECIAL', 31.81, NARANJA, 1430),
    (33.18, 35.98, [('tú', 33.18), ('vas', 33.30), ('a', 33.46), ('hacer', 33.50), ('solo', 33.82)], 'DOS DÍAS DE FUERZA', 34.10, LIMA, 1430),
    (36.02, 39.20, [('comiendo', 36.02), ('para', 36.36), ('bajar', 36.58), ('el', 36.84), ('porcentaje', 36.96), ('de', 37.50)], 'GRASA', 37.62, LIMA, 1430),
    (39.22, 41.58, [('y', 39.22), ('montando', 39.32)], 'EL FIN DE SEMANA', 40.04, LIMA, 1430),
    (41.61, 44.42, [('no', 41.61), ('te', 41.71), ('vas', 41.83), ('a', 41.99), ('despertar', 42.03), ('un', 42.53), ('día', 42.65), ('con', 42.91)], 'ESAS PIERNAS', 43.11, LIMA, 1430),
    (44.45, 45.95, [('lo', 44.45), ('que', 44.55), ('sí', 44.65), ('vas', 44.77), ('a', 44.93), ('tener', 45.03), ('es', 45.27)], 'MÁS FUERZA', 45.45, LIMA, 1430),
    (45.97, 47.55, [('para', 45.97)], 'EMPUJAR EL PEDAL', 46.15, LIMA, 1430),
    (47.59, 49.60, [('más', 47.59), ('aguante', 47.79), ('en', 48.10), ('las', 48.25)], 'SUBIDAS', 48.41, LIMA, 1430),
    (49.64, 51.95, [('y', 49.64), ('un', 49.64), ('cuerpo', 49.80), ('que', 50.08), ('aguanta', 50.20), ('mejor', 50.58), ('las', 50.88)], 'CAÍDAS', 51.07, LIMA, 1430),
    (51.98, 55.02, [('las', 51.98), ('pesas', 52.20), ('no', 52.58), ('te', 52.68), ('van', 52.80), ('a', 52.94), ('convertir', 53.02), ('en', 53.44), ('un', 53.56)], 'VELOCISTA DE PISTA', 53.66, CREMA, 1430),
    (55.04, 56.90, [('te', 55.04), ('van', 55.18), ('a', 55.30), ('hacer', 55.36), ('un', 55.58)], None, 0, LIMA, 1600),   # ver escena 11
    (56.92, 57.90, [('que', 56.92)], 'SUBE MEJOR', 57.06, LIMA, 1430),
    (57.92, 59.38, [('y', 57.92), ('se', 57.92), ('ve', 58.06)], 'MEJOR', 58.22, LIMA, 1430),
    (59.42, 60.88, [('si', 59.42), ('quieres', 59.57), ('entrenar', 59.83)], 'FUERZA', 60.25, LIMA, 1430),
    (60.91, 62.85, [('sin', 60.91), ('miedo', 61.17), ('a', 61.75), ('ponerte', 61.85)], 'GRANDE', 62.29, NARANJA, 1430),
    (62.89, 64.50, [('ni', 62.89), ('a', 63.05), ('subir', 63.13)], 'PEOR', 63.47, NARANJA, 1430),
    (64.56, 65.10, [], 'SÍGUEME', 64.56, LIMA, 1330),
    (65.14, 66.25, [('porque', 65.14), ('aquí', 65.32), ('te', 65.48), ('enseño', 65.56)], 'A HACERLO', 65.88, LIMA, 1330),
    (66.28, 99.0, [('como', 66.28), ('ciclista,', 66.50), ('no', 67.45), ('como', 67.77)], 'CULTURISTA', 67.99, NARANJA, 1330),
]
# zooms de golpe en los remates (se sueltan en un corte del montaje para que no se note): (desde, hasta, z)
ZOOMS = [(18.20, 18.63, 1.10), (31.81, 32.83, 1.10), (43.11, 44.13, 1.10), (55.66, 58.80, 1.18), (67.99, 99.0, 1.12)]

def sub2(img, relleno, especial, col, y, tam):
    def sombra(xy, t, f):
        s = Image.new('L', img.size, 0); ImageDraw.Draw(s).text(xy, t, font=f, fill=180, anchor='mm')
        img.paste(Image.new('RGB', img.size, (0, 0, 0)), (0, 0), s.filter(ImageFilter.GaussianBlur(12)))
    d = ImageDraw.Draw(img)
    if relleno:
        tr = 50; f = F(MED_S, tr)
        while d.textlength(relleno, font=f) > 940: tr -= 3; f = F(MED_S, tr)
        sombra((540, y), relleno, f); d.text((540, y), relleno, font=f, fill=CREMA, anchor='mm')
    if especial:
        f = F(HEAVY_S, tam); yy = y + (120 * .72 if relleno else 0)
        while d.textlength(especial, font=f) > 960: tam -= 6; f = F(HEAVY_S, tam)
        sombra((540, yy), especial, f); d.text((540, yy), especial, font=f, fill=col, anchor='mm')
        return yy, d.textlength(especial, font=f)

def subtitulo(im, t):
    for t0, t1, pal, esp, te, col, y in SUBS:
        if t0 <= t < t1:
            rel = ' '.join(w for w, s in pal if t >= s - 0.02) or None
            if 51.98 <= t0 < 52 and t >= 54.40:      # «velocista de pista» se tacha
                r = sub2(im, rel, esp, CREMA, y, 120)
                if r:
                    yy, tw = r; q = eo((t - 54.40) / 0.2); x0 = 540 - tw / 2 - 14
                    ImageDraw.Draw(im).line((x0, yy + 6, x0 + (tw + 28) * q, yy + 6 - 10 * q), fill=NARANJA, width=14)
                return
            k = esp if (esp and t >= te - 0.02) else None
            tam = int(lerp(150, 120, eo((t - te) / 0.1))) if k else 120
            sub2(im, rel, k, col, y, tam); return

# ---------- elementos de las escenas 5–12 ----------
def capa(im, fn, q):
    if q <= 0: return im
    c = im.copy(); fn(c); return mezcla(im, c, q)

def burbuja2(img, t, dy):
    """Escena 5: burbuja de mensaje de cristal sobre la cabeza que se escribe (puntos mientras «alguien me dice»)."""
    bx = (150, 260 + dy, 930, 470 + dy); cristal(img, bx, 60, claro=0.10, borde=200, blur=26)
    d = ImageDraw.Draw(img); d.polygon([(560, 470 + dy), (600, 470 + dy), (575, 515 + dy)], fill=(232, 232, 232))
    em = emoji('🙅', 96); img.paste(em, (180, 317 + dy), em)
    partes = [('Paso,', GRIS, 13.25), ('que', GRIS, 16.58), ('me', GRIS, 16.72), ('pongo', GRIS, 16.86), ('GRANDE', NARANJA, 17.14), ('y', GRIS, 17.52), ('subo', GRIS, 17.56), ('PEOR', NARANJA, 18.20)]
    vis = [p for p in partes if t >= p[2]]
    if not vis:          # escribiendo…
        for i in range(3):
            a = .5 + .5 * math.sin((t * 7) - i * .9); r = 11 + 3 * a
            d.ellipse((330 + i * 44 - r, 365 + dy - r, 330 + i * 44 + r, 365 + dy + r), fill=(int(45 + 70 * (1 - a)),) * 3)
        return
    x = 300; y = 330 + dy
    for txt, col, s in vis:
        fo = F(HEAVY_S, 46) if col != GRIS else F(BOLD_S, 42)
        if x + d.textlength(txt, font=fo) > 900: x = 300; y += 64
        if col != GRIS and t - s < 0.12:      # la palabra clave entra con un pequeño golpe
            fo = F(HEAVY_S, int(lerp(60, 46, eo((t - s) / 0.12))))
        d.text((x, y), txt, font=fo, fill=col, anchor='lm'); x += d.textlength(txt + ' ', font=F(HEAVY_S, 46) if col != GRIS else F(BOLD_S, 42))

def antes_ahora(img, t):
    """Escena 6: dos tarjetas de cristal «foto pendiente» (faltan sus fotos)."""
    for i, (txt, x, t0) in enumerate((('ANTES', 140, 19.31), ('AHORA', 600, 20.87))):
        q = ent(t, t0, 0.25) * sal(t, 25.45)
        if q <= 0: continue
        dy = int(70 * (1 - q) - 600 * (1 - sal(t, 25.45))) if t >= 25.45 else int(70 * (1 - q))
        def fn(c, x=x, dy=dy, i=i, txt=txt):
            bx = (x, 150 + dy, x + 340, 560 + dy); cristal(c, bx, 40, claro=0.10, borde=170)
            ImageDraw.Draw(c).text((x + 170, 350 + dy), 'foto\npendiente', font=F(MED_S, 34), fill=(255, 255, 255), anchor='mm', align='center')
            p = (x + 100, 500 + dy, x + 240, 550 + dy); ImageDraw.Draw(c).rounded_rectangle(p, 25, fill=NEGRO if i == 0 else LIMA)
            ImageDraw.Draw(c).text((x + 170, 525 + dy), txt, font=F(BOLD_S, 28), fill=(255, 255, 255) if i == 0 else NEGRO, anchor='mm')
        img = capa(img, fn, min(1, q * 1.4))
    return img

L3, G3, Y3 = 250, 24, 230
X3 = [(1080 - (3 * L3 + 2 * G3)) // 2 + i * (L3 + G3) for i in range(3)]
MAL = [('⏳', 'años', 28.54), ('🍝', 'comer muchísimo', 30.73), ('🧬', 'genética', 31.81)]
TU = [('🏋️', '2 días de fuerza', 34.10), ('🔥', 'bajar grasa', 36.58), ('🚵', 'montar el finde', 39.32)]
T_TU = 33.18

def un_cuadro(c, i, cara, item, t, dy):
    x = X3[i]; box = (x, Y3 + dy, x + L3, Y3 + L3 + dy)
    if cara == 'tu': sombra_caja(c, box, 52, fuerza=120, blur=20); ImageDraw.Draw(c).rounded_rectangle(box, 52, fill=(250, 250, 250))
    else: cristal(c, box, 52, claro=0.14 if item else 0.08, borde=150 if item else 110)
    if item and t >= item[2] - 0.02:
        e, txt, s = item; p = (t - s) / 0.25; lado = max(8, int(110 * bo(p)))
        em = emoji(e, lado); c.paste(em, (x + (L3 - lado) // 2, Y3 + dy + 38 + (110 - lado) // 2), em)
        ImageDraw.Draw(c).text((x + L3 / 2, Y3 + dy + 192), txt, font=F(BOLD_S, 30), fill=NEGRO if cara == 'tu' else (255, 255, 255), anchor='mm')
        if p >= .6:
            (visto if cara == 'tu' else prohibido)(ImageDraw.Draw(c), x + L3 - 30, Y3 + dy + 30, 22, 7)
    else:
        ImageDraw.Draw(c).rounded_rectangle((x + 70, Y3 + dy + 60, x + L3 - 70, Y3 + dy + L3 - 60), 30, outline=(200, 200, 200) if cara == 'tu' else (230, 230, 230), width=3)

def cuadros_escena(im, t):
    """Escenas 7 y 8: píldora-título + tres cuadrados que se llenan; con «Tú» giran uno a uno a su cara blanca (✓ lima)."""
    fuera = 1 - sal(t, 41.40); dyf = int(-700 * fuera)
    # píldora
    tu = t >= T_TU
    tit = 'TÚ' if tu else 'PARA ESAS PIERNAS'; qp = ent(t, 25.72) if not tu else 1
    def pild(c):
        f = F(HEAVY_S, 40); tw = ImageDraw.Draw(c).textlength(tit, font=f); s = bo((t - T_TU) / 0.25) if tu else 1
        w2 = (tw / 2 + 30) * s; px = (540 - w2, 140 + dyf, 540 + w2, 204 + dyf)
        sombra_caja(c, px, 32, fuerza=110, blur=16, dy=8); ImageDraw.Draw(c).rounded_rectangle(px, 32, fill=LIMA if tu else NEGRO)
        if s > .7: ImageDraw.Draw(c).text((540, 172 + dyf), tit, font=f, fill=NEGRO if tu else (255, 255, 255), anchor='mm')
    im = capa(im, pild, qp * sal(t, 41.40))
    for i in range(3):
        t_in = 25.95 + i * 0.08; q = ent(t, t_in, 0.25)
        if q <= 0: continue
        dy = int(80 * (1 - q)) + dyf
        tg = T_TU + i * 0.10; giro = (t - tg) / 0.28          # el giro dura 0,28 s
        if giro <= 0.5: cara, item = 'mal', MAL[i]
        else: cara, item = 'tu', TU[i]
        if 0 < giro < 1:
            sx = abs(math.cos(math.pi * giro))
            c = im.copy(); un_cuadro(c, i, cara, item, t, dy)
            x = X3[i]; box = (x, Y3 + dy, x + L3, Y3 + L3 + dy)
            tile = c.crop(box); m = rrmask((L3, L3), (0, 0, L3, L3), 52)
            w = max(2, int(L3 * sx)); tile = tile.resize((w, L3), Image.BICUBIC); m = m.resize((w, L3), Image.BICUBIC)
            im.paste(tile, (x + (L3 - w) // 2, Y3 + dy), m)
        else:
            im = capa(im, lambda c: un_cuadro(c, i, cara, item, t, dy), min(1, q * 1.3) * sal(t, 41.40))
    return im

def ciclista_tachado(im, t):
    """Escena 9: vuelve el ciclista en pequeño y se tacha con «esas piernas»."""
    q = ent(t, 41.61, 0.25); fuera = 1 - sal(t, 44.20, 0.18)
    dx = int(420 * (1 - q) + 700 * fuera)
    return capa(im, lambda c: tarjeta_foto(c, (640 + dx, 230, 940 + dx, 620), lerp(14, 6, q), seleccion=False, tachar=t >= 43.11), min(1, q * 1.3))

PILDORAS = [('fuerza en el pedal', 45.65), ('aguante en subidas', 47.79), ('aguanta las caídas', 50.20)]
def pildoras2(im, t):
    """Escena 10: tres píldoras de cristal con ✓ que entran una a una a la derecha de la cara."""
    for k, (txt, s) in enumerate(PILDORAS):
        q = ent(t, s, 0.25) * sal(t, 51.80)
        if q <= 0: continue
        dx = int(260 * (1 - ent(t, s, 0.25))) + int(700 * (1 - sal(t, 51.80)))
        y = 250 + 124 * k
        def fn(c, txt=txt, dx=dx, y=y):
            f = F(BOLD_S, 40); tw = ImageDraw.Draw(c).textlength(txt, font=f); bx = (1040 - tw - 120 + dx, y, 1040 + dx, y + 96)
            cristal(c, bx, 48, claro=0.10, borde=200, blur=24); visto(ImageDraw.Draw(c), bx[0] + 50, y + 48, 26, 8)
            ImageDraw.Draw(c).text((bx[0] + 92, y + 48), txt, font=f, fill=(255, 255, 255), anchor='lm')
        im = capa(im, fn, min(1, q * 1.3))
    return im

def moraleja(im, t):
    """Escena 11 (55,04–56,9 s): «velocista de pista» tachado arriba y «CICLISTA MÁS FUERTE» en lima con zoom de golpe."""
    tachado(im, 'velocista de pista', 1420, tam=64)
    if t >= 55.64: sub2(im, None, 'CICLISTA MÁS FUERTE', LIMA, 1530, int(lerp(140, 110, eo((t - 55.66) / 0.1))))

def boton(im, t):
    """Escena 12: botón «Seguir» de cristal con su @; a 65,3 s se pulsa y pasa a «Siguiendo»."""
    q = ent(t, 64.56, 0.25)
    if q <= 0: return im
    dy = int(90 * (1 - q)); pul = t >= 65.30; s = 1 - .06 * math.sin(math.pi * min(1, max(0, (t - 65.30) / 0.16)))
    def fn(c):
        cx, cy = 540, 1656 + dy; hw, hh = 310 * s, 56 * s; bx = (cx - hw, cy - hh, cx + hw, cy + hh)
        cristal(c, bx, 56, claro=0.16, borde=200); d = ImageDraw.Draw(c); ox = bx[0] + 56
        d.ellipse((ox - 38, cy - 38, ox + 38, cy + 38), fill=LIMA)
        if pul: d.line((ox - 16, cy + 1, ox - 4, cy + 14, ox + 18, cy - 12), fill=NEGRO, width=8, joint='curve')
        else: d.line((ox, cy - 20, ox, cy + 20), fill=NEGRO, width=8); d.line((ox - 20, cy, ox + 20, cy), fill=NEGRO, width=8)
        d.text((ox + 59, cy - 16), '@camiloariasfittmtb', font=F(BOLD_S, 30), fill=(255, 255, 255), anchor='lm')
        d.text((ox + 59, cy + 24), 'Siguiendo' if pul else 'Seguir', font=F(HEAVY_S, 30), fill=CREMA if pul else LIMA, anchor='lm')
    return capa(im, fn, min(1, q * 1.3))

def cuadro_resto(f):
    t = f / FPS
    im = Image.open('%s/fr/b_%04d.jpg' % (WORK, f)).convert('RGB')
    for a, b, z in ZOOMS:
        if a <= t < b: im = zoom(im, lerp(1.0, z, eo((t - a) * FPS / 3)))
    degradado(im)
    if 12.13 <= t < 18.95:                                   # escena 5
        q = ent(t, 12.13, 0.22); fuera = 1 - sal(t, 18.75)
        im = capa(im, lambda c: burbuja2(c, t, int(60 * (1 - q) - 600 * fuera)), min(1, q * 1.3) * sal(t, 18.75))
    if 19.2 <= t < 25.7: im = antes_ahora(im, t)             # escena 6
    if 25.7 <= t < 41.65: im = cuadros_escena(im, t)         # escenas 7 y 8
    if 41.6 <= t < 44.45: im = ciclista_tachado(im, t)       # escena 9
    if 45.6 <= t < 52.0: im = pildoras2(im, t)               # escena 10
    if 55.04 <= t < 56.90: moraleja(im, t)                   # escena 11
    else: subtitulo(im, t)
    if t >= 64.56: im = boton(im, t)                         # escena 12
    return im

def hazlo(f):
    im = cuadro_gancho(f) if f < N_GANCHO else cuadro_resto(f)
    im.save('%s/an/a_%04d.jpg' % (WORK, f), quality=95, subsampling=0); return f

def base():
    a, fc = [], []
    for k, (s, e) in enumerate(TRAMOS):
        a += ['-ss', '%.3f' % s, '-t', '%.3f' % (e - s), '-i', BRUTO]
        fc.append('[%d:v]scale=1080:1920,fps=%d,setpts=PTS-STARTPTS[v%d];[%d:a]aresample=48000,asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st=%.3f:d=0.01[a%d]' % (k, FPS, k, k, e - s - 0.01, k))
    fc.append(''.join('[v%d][a%d]' % (k, k) for k in range(len(TRAMOS))) + 'concat=n=%d:v=1:a=1[v][a]' % len(TRAMOS))
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + a + ['-filter_complex', ';'.join(fc), '-map', '[v]', '-map', '[a]', '-t', '%.3f' % (N / FPS), '-c:v', 'libx264', '-crf', '14', '-c:a', 'pcm_s16le', WORK + '/base.mov'], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', WORK + '/base.mov', '-frames:v', str(N), '-start_number', '0', '-q:v', '2', WORK + '/fr/b_%04d.jpg'], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', WORK + '/base.mov', '-vn', '-af', 'highpass=f=80,afftdn=nf=-45,acompressor=threshold=0.06:ratio=3:attack=5:release=120,loudnorm=I=-16:TP=-2', '-ar', '48000', WORK + '/voz.wav'], check=True)

if __name__ == '__main__':
    solo = [int(x) for x in sys.argv[2].split(',')] if len(sys.argv) > 2 else None      # prueba: solo esos fotogramas
    if not os.path.exists(WORK + '/fr/b_%04d.jpg' % (N - 1)): base(); print('base ok', N, flush=True)
    with Pool(7) as p: p.map(hazlo, solo or range(N), chunksize=4)
    if solo: print('ok prueba'); sys.exit()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-start_number', '0', '-i', WORK + '/an/a_%04d.jpg', '-i', WORK + '/voz.wav',
                    '-c:v', 'libx264', '-crf', '15', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-shortest', WORK + '/video_voz.mp4'], check=True)
    print('ok', WORK + '/video_voz.mp4')
