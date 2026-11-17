# Fotogramas de diseño (en parado) del plan v2 de Camilo · «sentadillas ciclista». No anima nada.
# Reutiliza el cristal, los emojis y las marcas del diseño de Álvaro (PLANES/alvaro/plan-v2/diseno.py).
# Uso: <python del entorno whisperx> diseno.py <carpeta con r_*.png> <carpeta de salida>
import os, sys, glob, math
AQUI = os.path.dirname(os.path.abspath(__file__))
SRC, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
exec(open(os.path.join(AQUI, '..', '..', 'alvaro', 'plan-v2', 'diseno.py'), encoding='utf-8').read().split('DIAS = ')[0]
     .replace('SRC, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)', ''))
LIMA, NARANJA, CREMA, NEGRO = (198, 255, 0), (255, 90, 54), (242, 235, 221), (14, 14, 16)
FT = os.path.expanduser('~/Library/Fonts/')
BOLD_S, HEAVY_S, MED_S = FT + 'sequel-sans-bold-disp.ttf', FT + 'Sequel Sans Heavy Disp.otf', FT + 'Sequel Sans Medium Disp.otf'
FOTO = glob.glob(os.path.expanduser('~/EDICION/3 PROYECTOS/Alumnos Trainer10x/MEDIA/_pruebas Claude/Robert*'))[0]

def base(t): return Image.open(os.path.join(SRC, 'r_%s.png' % t)).convert('RGB')

def degradado(img):
    """Regla 12: negro desde el 62 % del alto, para leer el texto sobre el pecho."""
    g = Image.new('L', (1, 1920), 0)
    for y in range(1190, 1920): g.putpixel((0, y), int(170 * ((y - 1190) / 730) ** 1.4))
    img.paste(Image.new('RGB', img.size, (0, 0, 0)), (0, 0), g.resize(img.size))

def sub(img, relleno, especial=None, col=LIMA, y=1430, tam=120):
    """Apilado (H4-1): relleno Sequel Medium crema encima, especial Sequel Heavy debajo; sombra suave sin caja."""
    def sombra(xy, t, f):
        s = Image.new('L', img.size, 0); ImageDraw.Draw(s).text(xy, t, font=f, fill=180, anchor='mm')
        img.paste(Image.new('RGB', img.size, (0, 0, 0)), (0, 0), s.filter(ImageFilter.GaussianBlur(12)))
    if relleno: f = F(MED_S, 50); sombra((540, y), relleno, f); ImageDraw.Draw(img).text((540, y), relleno, font=f, fill=CREMA, anchor='mm')
    if especial:
        f = F(HEAVY_S, tam); yy = y + (tam * .72 if relleno else 0)
        while ImageDraw.Draw(img).textlength(especial, font=f) > 960: tam -= 6; f = F(HEAVY_S, tam)
        sombra((540, yy), especial, f); ImageDraw.Draw(img).text((540, yy), especial, font=f, fill=col, anchor='mm')

def nombre(img):
    """Regla 11: abajo a la izquierda, una vez; un toque de acento (barra lima)."""
    d = ImageDraw.Draw(img); x, y = 100, 1690
    d.rounded_rectangle((x - 22, y - 6, x - 14, y + 74), 4, fill=LIMA)
    d.text((x, y), 'Camilo Arias', font=F(BOLD_S, 40), fill=CREMA); d.text((x, y + 50), 'fuerza para ciclistas', font=F(MED_S, 26), fill=(200, 196, 186))

def tarjeta_foto(img, caja, giro, etiqueta=None, seleccion=True, tachar=False):
    """Foto del velocista en tarjeta de cristal con sombra larga (H2) y caja de selección lima en el muslo."""
    x0, y0, x1, y1 = caja; w, h = x1 - x0, y1 - y0; pad = 16
    foto = Image.open(FOTO).convert('RGB'); fw, fh = foto.size; r = (w - 2 * pad) / (h - 2 * pad)
    cw = fw; ch = int(cw / r)
    if ch > fh: ch = fh; cw = int(ch * r)
    foto = foto.crop(((fw - cw) // 2, int(fh * .06), (fw - cw) // 2 + cw, int(fh * .06) + ch)).resize((w - 2 * pad, h - 2 * pad), Image.LANCZOS)
    capa = Image.new('RGBA', (w + 120, h + 160), (0, 0, 0, 0)); ox, oy = 60, 50
    sh = Image.new('L', capa.size, 0); ImageDraw.Draw(sh).rounded_rectangle((ox, oy + 30, ox + w, oy + h + 40), 44, fill=150)
    capa.paste(Image.new('RGBA', capa.size, (0, 0, 0, 255)), (0, 0), sh.filter(ImageFilter.GaussianBlur(28)))
    d = ImageDraw.Draw(capa); d.rounded_rectangle((ox, oy, ox + w, oy + h), 44, fill=(255, 255, 255, 70), outline=(255, 255, 255, 210), width=2)
    capa.paste(foto, (ox + pad, oy + pad), rrmask(foto.size, (0, 0, foto.size[0], foto.size[1]), 32))
    if seleccion:   # el muslo de la foto: ~30–48 % del ancho, 42–64 % del alto
        sx0, sy0 = ox + pad + int(foto.size[0] * .26), oy + pad + int(foto.size[1] * .44); sx1, sy1 = ox + pad + int(foto.size[0] * .50), oy + pad + int(foto.size[1] * .66)
        d.rectangle((sx0, sy0, sx1, sy1), outline=LIMA, width=4)
        for cx, cy in ((sx0, sy0), (sx1, sy0), (sx0, sy1), (sx1, sy1)): d.rectangle((cx - 8, cy - 8, cx + 8, cy + 8), fill=LIMA)
    if tachar:
        o = Image.new('RGBA', capa.size, (0, 0, 0, 0)); ImageDraw.Draw(o).rounded_rectangle((ox, oy, ox + w, oy + h), 44, fill=(10, 10, 12, 110)); capa.alpha_composite(o)
        d = ImageDraw.Draw(capa); prohibido(d, ox + w // 2, oy + h // 2, int(w * .30), int(w * .06), fondo=False)
    rot = capa.rotate(giro, resample=Image.BICUBIC, expand=False); img.paste(rot, (x0 - ox, y0 - oy), rot)
    if etiqueta:   # píldora de cristal pegada debajo de la tarjeta
        t, col = etiqueta; f = F(HEAVY_S, 38); tw = ImageDraw.Draw(img).textlength(t, font=f); bx = (x1 - tw - 60, y1 + 10, x1 + 8, y1 + 84)
        sombra_caja(img, bx, 42, fuerza=120, blur=18, dy=10); ImageDraw.Draw(img).rounded_rectangle(bx, 42, fill=NEGRO); ImageDraw.Draw(img).text(((bx[0] + bx[2]) / 2, y1 + 47), t, font=f, fill=col, anchor='mm')

def ficha(img):
    """c014: la tarjeta crece a ficha; nombre arriba, «velocista de pista · Alemania» y crédito pequeño."""
    tarjeta_foto(img, (380, 70, 700, 470), 0, seleccion=True)
    d = ImageDraw.Draw(img); bx = (250, 495, 830, 625); cristal(img, bx, 36, claro=0.06, borde=200, blur=26)
    d = ImageDraw.Draw(img); d.text((540, 540), 'ROBERT FÖRSTEMANN', font=F(HEAVY_S, 44), fill=(255, 255, 255), anchor='mm')
    d.text((540, 592), 'velocista de pista · Alemania', font=F(MED_S, 30), fill=LIMA, anchor='mm')
    d.text((1040, 1890), 'Foto: Roth-Foto.de · CC BY-SA 3.0', font=F(MED_S, 18), fill=(220, 220, 220), anchor='rm')

def burbuja(img, partes):
    """Burbuja de mensaje de cristal sobre la cabeza, sin usuario ni foto (la objeción típica, no un comentario real)."""
    bx = (150, 260, 930, 470); cristal(img, bx, 60, claro=0.10, borde=200, blur=26)
    d = ImageDraw.Draw(img); d.polygon([(560, 470), (600, 470), (575, 515)], fill=(232, 232, 232)); em = emoji('🙅', 96); img.paste(em, (180, 317), em)
    x = 300; y = 365; d = ImageDraw.Draw(img)
    for t, col, f in partes:
        fo = F(HEAVY_S if col != (40, 40, 44) else BOLD_S, 46 if col != (40, 40, 44) else 42)
        if x + d.textlength(t, font=fo) > 900: x = 300; y += 62
        d.text((x, y), t, font=fo, fill=col, anchor='lm'); x += d.textlength(t + ' ', font=fo)

def cuadros3(img, titulo, items, col_marca, cara):
    """c088 / L10: tres cuadrados de cristal sobre la cabeza; dentro, un emoji y su etiqueta. cara: 'mal' (rojo apagado) o 'tu' (lima)."""
    L, G, y0 = 250, 24, 230; x = (1080 - (3 * L + 2 * G)) // 2
    d = ImageDraw.Draw(img); f = F(HEAVY_S, 40); tw = d.textlength(titulo, font=f); px = (540 - tw / 2 - 30, 140, 540 + tw / 2 + 30, 204)
    sombra_caja(img, px, 32, fuerza=110, blur=16, dy=8); ImageDraw.Draw(img).rounded_rectangle(px, 32, fill=col_marca if cara == 'tu' else NEGRO)
    ImageDraw.Draw(img).text((540, 172), titulo, font=f, fill=NEGRO if cara == 'tu' else (255, 255, 255), anchor='mm')
    for i in range(3):
        box = (x, y0, x + L, y0 + L)
        if i < len(items):
            if cara == 'tu': sombra_caja(img, box, 52, fuerza=120, blur=20); ImageDraw.Draw(img).rounded_rectangle(box, 52, fill=(250, 250, 250))
            else: cristal(img, box, 52, claro=0.14, borde=150)
            e, t = items[i]; em = emoji(e, 110); img.paste(em, (x + (L - 110) // 2, y0 + 38), em)
            ImageDraw.Draw(img).text((x + L / 2, y0 + 192), t, font=F(BOLD_S, 30), fill=NEGRO if cara == 'tu' else (255, 255, 255), anchor='mm')
            if cara == 'tu': visto(ImageDraw.Draw(img), x + L - 30, y0 + 30, 22, 7)
            else: prohibido(ImageDraw.Draw(img), x + L - 30, y0 + 30, 22, 7)
        else:
            cristal(img, box, 52, claro=0.08, borde=110, sombra=False); ImageDraw.Draw(img).rounded_rectangle((x + 70, y0 + 60, x + L - 70, y0 + L - 60), 30, outline=(230, 230, 230), width=3)
        x += L + G

def pildoras(img, items):
    """c011 / c019: píldoras de cristal con ✓ lima que entran una a una a la derecha de la cara."""
    y = 250
    for t in items:
        f = F(BOLD_S, 40); tw = ImageDraw.Draw(img).textlength(t, font=f); bx = (1040 - tw - 120, y, 1040, y + 96)
        cristal(img, bx, 48, claro=0.10, borde=200, blur=24); visto(ImageDraw.Draw(img), bx[0] + 50, y + 48, 26, 8)
        ImageDraw.Draw(img).text((bx[0] + 92, y + 48), t, font=f, fill=(255, 255, 255), anchor='lm'); y += 124

def tachado(img, t, y, col=NARANJA, tam=72):
    d = ImageDraw.Draw(img); f = F(HEAVY_S, tam); tw = d.textlength(t, font=f); d.text((540, y), t, font=f, fill=(235, 235, 235), anchor='mm')
    d.line((540 - tw / 2 - 14, y + 4, 540 + tw / 2 + 14, y - 4), fill=col, width=12)

def zoom(img, z, cx=0.5, cy=0.36, blur=0):
    w, h = 1080 / z, 1920 / z; x0, y0 = (1080 - w) * cx / 0.5 / 2 * 1, (1920 - h) * cy / 0.5 / 2
    im = img.resize((1080, 1920), Image.BICUBIC, box=(x0, y0, x0 + w, y0 + h)); return im.filter(ImageFilter.GaussianBlur(blur)) if blur else im

P = []
im = zoom(base('8.133'), 1.3, blur=11); P.append(('1 · Gancho 0,00 s · ampliado y borroso; golpe grave + whoosh', im))
im = base('9.433'); degradado(im); tarjeta_foto(im, (650, 110, 1010, 570), 6, ('¿TE PONDRÁS ASÍ?', LIMA)); sub(im, '¿Esto te va a pasar si haces', 'SENTADILLAS?'); nombre(im)
P.append(('2 · Gancho 0,9 s · foto en la pared + caja en el muslo', im))
im = base('11.267'); degradado(im); tarjeta_foto(im, (650, 110, 1010, 570), 6, ('SPOILER: NO', NARANJA)); sub(im, None, 'NO.', NARANJA, y=1500, tam=230); nombre(im)
P.append(('3 · 3,3 s · «NO.» enorme + golpe', im))
def foto_pantalla(z=1.06):
    """Corrección de Luis (16-11): la foto del ciclista a pantalla completa con textura y viñeta, como sus animaciones de AE
    (receta de profundidad de la skill after-effects-editor: viñeta + textura + brillo). Zoom lento de 1,06 a 1,0 en movimiento."""
    import numpy as np
    f = Image.open(FOTO).convert('RGB'); fw, fh = f.size; cw = int(fh * 9 / 16); x0 = (fw - cw) // 2
    w, h = cw / z, fh / z; im = f.resize((1080, 1920), Image.LANCZOS, box=(x0 + (cw - w) / 2, (fh - h) * .35, x0 + (cw + w) / 2, (fh - h) * .35 + h))
    a = np.asarray(im).astype(np.float32) / 255
    a = np.clip((a - .5) * 1.12 + .5, 0, 1) * np.array([1.0, 0.98, 0.94])                          # algo más de contraste, tono cálido
    lum = a.mean(2, keepdims=True); brillo = np.asarray(Image.fromarray((np.clip(lum - .62, 0, 1) / .38 * 255).astype(np.uint8)[..., 0]).filter(ImageFilter.GaussianBlur(40))).astype(np.float32)[..., None] / 255
    a = 1 - (1 - a) * (1 - brillo * .35)                                                        # brillo suave en las luces (pantalla)
    yy, xx = np.mgrid[0:1920, 0:1080]; r = np.sqrt(((xx - 540) / 620) ** 2 + ((yy - 900) / 1050) ** 2)
    a *= (1 - np.clip((r - .30) / .9, 0, 1) ** 1.3 * .80)[..., None]                                   # viñeta
    rng = np.random.default_rng(7); g = rng.normal(0, 1, (1920, 1080)).astype(np.float32)
    g = np.asarray(Image.fromarray(((g * 40) + 128).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.7))).astype(np.float32) / 255 - .5
    a = np.clip(a + g[..., None] * .26, 0, 1)                                                   # grano de película
    return Image.fromarray((a * 255).astype(np.uint8))

im = zoom(base('11.267'), 1.25, cx=0.22, cy=0.30); degradado(im); sub(im, 'estas', 'PIERNAS', LIMA)
P.append(('4a · 4,3 s · zoom de golpe a Camilo + whoosh', im))
im = foto_pantalla(); d = ImageDraw.Draw(im)
sx0, sy0, sx1, sy1 = 300, 860, 640, 1300; d.rectangle((sx0, sy0, sx1, sy1), outline=LIMA, width=5)
for cx, cy in ((sx0, sy0), (sx1, sy0), (sx0, sy1), (sx1, sy1)): d.rectangle((cx - 10, cy - 10, cx + 10, cy + 10), fill=LIMA)
sub(im, 'son de un', 'CICLISTA DE PISTA', y=1500)
d = ImageDraw.Draw(im); d.rounded_rectangle((78, 1684, 86, 1764), 4, fill=LIMA); d.text((100, 1690), 'Robert Förstemann', font=F(BOLD_S, 40), fill=CREMA)
d.text((100, 1740), 'velocista de pista · Alemania', font=F(MED_S, 26), fill=(200, 196, 186)); d.text((1040, 1890), 'Foto: Roth-Foto.de · CC BY-SA 3.0', font=F(MED_S, 18), fill=(200, 200, 200), anchor='rm')
P.append(('4b · 4,6–9 s · foto a pantalla completa, grano y viñeta', im))
P.append(('4 · 4–9 s · ficha del velocista', im))
im = base('44.167'); degradado(im); burbuja(im, [('Paso, que me pongo', (40, 40, 44), None), ('GRANDE', NARANJA, None), ('y subo', (40, 40, 44), None), ('PEOR', NARANJA, None)]); sub(im, 'que me pongo', 'GRANDE', NARANJA)
P.append(('5 · 9–18 s · la objeción en una burbuja', im))
im = base('75.701') if os.path.exists(os.path.join(SRC, 'r_75.701.png')) else base('35.734'); degradado(im); sub(im, 'yo era muy', 'DELGADO')
d = ImageDraw.Draw(im)
for i, (t, x) in enumerate((('ANTES', 140), ('AHORA', 600))):
    bx = (x, 150, x + 340, 560); cristal(im, bx, 40, claro=0.10, borde=170); ImageDraw.Draw(im).text((x + 170, 350), 'foto\npendiente', font=F(MED_S, 34), fill=(255, 255, 255), anchor='mm', align='center')
    p = (x + 100, 500, x + 240, 550); ImageDraw.Draw(im).rounded_rectangle(p, 25, fill=NEGRO if i == 0 else LIMA); ImageDraw.Draw(im).text((x + 170, 525), t, font=F(BOLD_S, 28), fill=(255, 255, 255) if i == 0 else NEGRO, anchor='mm')
P.append(('6 · 19–25 s · antes / ahora (faltan sus fotos)', im))
im = base('109.468'); degradado(im); cuadros3(im, 'PARA ESAS PIERNAS', [('⏳', 'años'), ('🍝', 'comer muchísimo'), ('🧬', 'genética')], NARANJA, 'mal'); sub(im, 'y una', 'GENÉTICA ESPECIAL', NARANJA)
P.append(('7 · 25–33 s · tres cuadrados: lo que hace falta', im))
im = base('138.167'); degradado(im); cuadros3(im, 'TÚ', [('🏋️', '2 días de fuerza'), ('🔥', 'bajar grasa'), ('🚵', 'montar el finde')], LIMA, 'tu'); sub(im, 'solo', 'DOS DÍAS DE FUERZA')
P.append(('8 · 33–41 s · los cuadrados giran a «TÚ»', im))
im = base('150.467'); degradado(im); tarjeta_foto(im, (640, 230, 940, 620), 6, seleccion=False, tachar=True); sub(im, 'no te vas a despertar con', 'ESAS PIERNAS')
P.append(('9 · 41–44 s · vuelve el ciclista, tachado', im))
im = base('203.767'); degradado(im); pildoras(im, ['fuerza en el pedal', 'aguante en subidas', 'aguanta las caídas']); sub(im, 'más fuerza para', 'EMPUJAR EL PEDAL')
P.append(('10 · 44–51 s · tres píldoras ✓', im))
im = zoom(base('228.335'), 1.18); degradado(im); tachado(im, 'velocista de pista', 1420, tam=64); sub(im, None, 'CICLISTA MÁS FUERTE', LIMA, y=1530, tam=110)
P.append(('11 · 52–58 s · moraleja con zoom de golpe', im))
im = base('285.634'); degradado(im); sub(im, 'como ciclista, no como', 'CULTURISTA', NARANJA, y=1330)
bx = (230, 1600, 850, 1712); cristal(im, bx, 56, claro=0.16, borde=200); d = ImageDraw.Draw(im); d.ellipse((248, 1618, 324, 1694), fill=LIMA)
d.line((286, 1636, 286, 1676), fill=NEGRO, width=8); d.line((266, 1656, 306, 1656), fill=NEGRO, width=8)
d.text((345, 1640), '@camiloariasfittmtb', font=F(BOLD_S, 30), fill=(255, 255, 255), anchor='lm'); d.text((345, 1680), 'Seguir', font=F(HEAVY_S, 30), fill=LIMA, anchor='lm')
P.append(('12 · 59–68 s · CTA: botón Seguir de cristal', im))

for i, (t, im) in enumerate(P): im.save(os.path.join(OUT, 'diseno_%02d.png' % (i + 1)))
cw, ch, m = 330, 587, 16; cols = 7; rows = 2; H = Image.new('RGB', (cols * (cw + m) + m, rows * (ch + 58) + m), (18, 18, 22)); d = ImageDraw.Draw(H)
for i, (t, im) in enumerate(P):
    x, y = m + (i % cols) * (cw + m), m + (i // cols) * (ch + 58); H.paste(im.resize((cw, ch), Image.LANCZOS), (x, y)); d.text((x, y + ch + 10), t[:46], font=F(MED, 17), fill=(235, 235, 235))
H.save(os.path.join(OUT, 'hoja_diseno.jpg'), quality=90); print('ok', len(P))
