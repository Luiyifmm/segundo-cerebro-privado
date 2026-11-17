# Capa de gráficos de KEVIN · «el lunes empiezo» (plan aprobado 15-11-2026). 1080x1920, 30 fps, secuencia de PNG con transparencia.
# Tiempos = línea de tiempo del corte (42,17 s). Su bruto YA trae subtítulos y título: aquí NO hay subtítulos nuestros.
# uso: <python con PIL> montaje_kevin.py <carpeta_salida> [--stills 7.0,9.2,16.5,...]   (con --stills solo guarda esos fotogramas en <salida>/stills)
import sys, os, math, shutil
from multiprocessing import Pool
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
DUR = 42.1667; N = int(round(DUR * FPS))
OUT = sys.argv[1]
FD = os.path.expanduser('~/Library/Fonts/')
AZUL, ROJO, NAVY, CREMA, BLANCO = (47, 91, 255), (255, 59, 92), (16, 18, 52), (244, 242, 236), (255, 255, 255)
_f = {}
def font(n, s):
    k = (n, int(s))
    if k not in _f: _f[k] = ImageFont.truetype(FD + 'Poppins-%s.ttf' % n, int(s))
    return _f[k]
cl = lambda x: max(0.0, min(1.0, x))
eo = lambda x: 1 - (1 - cl(x)) ** 3
eio = lambda x: (lambda v: 4 * v ** 3 if v < .5 else 1 - (-2 * v + 2) ** 3 / 2)(cl(x))
def back(x):
    x = cl(x); c = 1.70158; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2
lerp = lambda a, b, k: a + (b - a) * k
mix = lambda a, b, k: tuple(int(lerp(x, y, k)) for x, y in zip(a, b))

# ---- tiempos (corte) ----
RING_IN = 6.55
LIT = [8.82, 13.04, 18.67, 23.21, 24.97, 28.43]      # Uno … seis
SPIN0 = 30.38                                         # «vuelta a empezar»
FS0, FS1 = 32.90, 38.55                               # pantalla completa
CHIPS = [('6 días de gym', 15.12, 18.60, 424, 0), ('cero caprichos', 17.72, 18.60, 424, 1),
         ('una cena', 20.50, 21.28, 424, 0), ('una mala semana', 21.26, 22.34, 424, 0), ('un mal día', 22.33, 23.15, 424, 0)]
CTA0, CTA1 = 41.40, 42.17

def ring(t):
    k = eio((t - FS0) / 0.45) if t >= FS0 else 0.0                    # 0 = lateral · 1 = grande
    cx, cy, R, dr = lerp(905, 540, k), lerp(625, 1040, k), lerp(92, 330, k), lerp(19, 58, k)
    ra = eo((t - RING_IN) / 0.27)
    if t >= FS1: ra *= 1 - cl((t - FS1) / 0.2)
    if ra <= 0: return None
    sc = 0.6 + 0.4 * back((t - RING_IN) / 0.3) if t < RING_IN + 0.35 else 1.0
    R, dr = R * sc, dr * sc
    rot = 360 * eio((t - SPIN0) / 0.9)
    r_out = R + dr * 2.6 + 30
    x0, y0, x1, y1 = int(max(0, cx - r_out)), int(max(0, cy - r_out)), int(min(W, cx + r_out)), int(min(H, cy + r_out))
    s = 2; lay = Image.new('RGBA', ((x1 - x0) * s, (y1 - y0) * s), (0, 0, 0, 0)); d = ImageDraw.Draw(lay, 'RGBA')
    X = lambda x: (x - x0) * s; Y = lambda y: (y - y0) * s
    def circ(x, y, r, fill=None, outline=None, w=1):
        d.ellipse((X(x - r), Y(y - r), X(x + r), Y(y + r)), fill=fill, outline=outline, width=int(w * s))
    if k < 1: circ(cx, cy, R + dr + 26, fill=NAVY + (int(150 * (1 - k)),))
    circ(cx, cy, R, outline=mix(BLANCO, NAVY, k) + (int(lerp(150, 80, k)),), w=lerp(3, 5, k))
    ang = lambda i: math.radians(-90 + 60 * i) + math.radians(rot)
    pops = lambda i: [LIT[i]] + ([31.35] if i == 0 else [FS0 + 0.1 + 0.07 * i])
    def lit(i):
        b = t >= LIT[i]
        if i > 0 and t >= SPIN0 + 0.17 + 0.08 * i: b = False
        if i > 0 and t >= FS0 + 0.1 + 0.07 * i: b = True
        return b
    for i in range(6):
        px, py = cx + R * math.cos(ang(i)), cy + R * math.sin(ang(i))
        red = (i == 4 and 34.70 <= t < 35.95) or (i == 1 and t >= 36.40)
        on = lit(i); col = ROJO if red else AZUL
        sz = 1.0
        for pt in pops(i) + ([36.40] if i == 1 else []):
            if 0 <= t - pt < 0.30: sz = max(sz, 1 + 0.5 * (1 - eo((t - pt) / 0.30)))
            if 0 <= t - pt < 0.40: circ(px, py, dr * lerp(1.0, 2.4, eo((t - pt) / 0.40)), outline=col + (int(150 * (1 - (t - pt) / 0.40)),), w=3)
        if i == 1 and t >= 36.40: sz = max(sz, 1.25)
        r = dr * sz
        if on or red: circ(px, py, r, fill=col + (255,), outline=BLANCO + (int(255 * (1 - k)),), w=2.5)
        else: circ(px, py, r, fill=mix(BLANCO, NAVY, k) + (int(lerp(85, 28, k)),), outline=mix(BLANCO, NAVY, k) + (int(lerp(170, 90, k)),), w=2)
        tc = BLANCO + (255,) if (on or red) else mix(BLANCO, NAVY, k) + (int(lerp(235, 200, k)),)
        d.text((X(px), Y(py) + 1 * s), str(i + 1), font=font('Black', dr * 1.1 * s * (sz if (on or red) else 1)), fill=tc, anchor='mm')
        if i == 4 and 34.70 <= t < 35.95:                               # «?» de lo que cree todo el mundo
            bx, by, br = px + dr * 1.1, py - dr * 1.1, dr * 0.62 * (1 + 0.08 * math.sin(t * 14))
            circ(bx, by, br, fill=BLANCO + (255,), outline=ROJO + (255,), w=3)
            d.text((X(bx), Y(by) + 1 * s), '?', font=font('Black', br * 1.5 * s), fill=ROJO + (255,), anchor='mm')
    if 35.95 <= t < 36.40:                                              # el rojo recorre el bucle de 5 a 2
        u = eio((t - 35.95) / 0.45); a = math.radians(150 + 180 * u)
        for tr in range(5, -1, -1):                                     # estela
            ua = max(0, u - tr * 0.045); aa = math.radians(150 + 180 * eio(max(0, (t - 35.95 - tr * 0.02) / 0.45)))
            circ(cx + R * math.cos(aa), cy + R * math.sin(aa), dr * (1 - tr * 0.1), fill=ROJO + (int(255 - tr * 40),))
    out = lay.resize((x1 - x0, y1 - y0), Image.LANCZOS)
    if ra < 1: out.putalpha(out.getchannel('A').point(lambda v: int(v * ra)))
    return out, (x0, y0)

_chip = {}
def chip(text):
    if text in _chip: return _chip[text]
    f = font('Bold', 88); tw = f.getlength(text); w, h = int(tw + 180), 208
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im, 'RGBA')
    d.rounded_rectangle((2, 2, w - 3, h - 3), 96, fill=NAVY + (235,), outline=BLANCO + (80,), width=4)
    d.ellipse((48, h / 2 - 22, 94, h / 2 + 22), fill=AZUL + (255,))
    d.text((120, h / 2 + 3), text, font=f, fill=BLANCO + (255,), anchor='lm')
    _chip[text] = im.resize((w // 2, h // 2), Image.LANCZOS); return _chip[text]

def paste(img, lay, xy, alpha=1.0):
    if alpha <= 0: return
    if alpha < 1: lay = lay.copy(); lay.putalpha(lay.getchannel('A').point(lambda v: int(v * alpha)))
    img.alpha_composite(lay, (int(xy[0]), int(xy[1])))

def frame(i):
    t = i / FPS
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    # ---- pantalla completa ----
    bg = eio((t - FS0) / 0.3) * (1 - cl((t - FS1) / 0.2)) if t >= FS0 else 0
    if bg > 0:
        lay = Image.new('RGBA', (W, H), CREMA + (255,)); dec = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dd = ImageDraw.Draw(dec, 'RGBA')
        dd.ellipse((710, -450, 1310, 150), fill=AZUL + (30,)); dd.ellipse((-140, 1700, 330, 2170), fill=AZUL + (26,))
        lay.alpha_composite(dec); paste(img, lay, (0, 0), bg)
        d = ImageDraw.Draw(img, 'RGBA'); fo = 1 - cl((t - (FS1 - 0.1)) / 0.15)
        def T(t0, t1, xy, f, fill, txt, anchor='mm'):
            if t0 <= t < t1:
                a = eo((t - t0) / 0.2) * fo * (1 - cl((t - (t1 - 0.1)) / 0.1)); dy = 22 * (1 - eo((t - t0) / 0.2))
                d.text((xy[0], xy[1] + dy), txt, font=f, fill=fill[:3] + (int(fill[3] * a),) if len(fill) > 3 else fill + (int(255 * a),), anchor=anchor)
        T(33.00, 33.82, (540, 330), font('Black', 112), NAVY, '¿Dónde falla?')
        T(33.82, 35.44, (540, 262), font('Medium', 54), NAVY, 'Todo el mundo dice')
        T(33.82, 35.44, (540, 384), font('Black', 128), NAVY, 'el número 5')
        T(35.44, FS1, (540, 262), font('Medium', 54), NAVY, 'La verdad')
        f2 = font('Black', 128); w1 = f2.getlength('falla en el ') + 22; w2 = f2.getlength('2'); x0 = 540 - (w1 + w2) / 2
        T(35.44, FS1, (x0, 384), f2, NAVY, 'falla en el ', 'lm')
        if t >= 36.28: T(36.28, FS1, (x0 + w1, 384), f2, ROJO, '2', 'lm')
        T(36.90, FS1, (540, 1530), font('Bold', 74), NAVY + (170,), 'plan perfecto')
        if t >= 37.32:
            wp = font('Bold', 74).getlength('plan perfecto'); u = eio((t - 37.32) / 0.3); a = fo
            d.line((540 - wp / 2 - 14, 1536, 540 - wp / 2 - 14 + (wp + 28) * u, 1536), fill=ROJO + (int(255 * a),), width=10)
    # ---- anillo ----
    r = ring(t)
    if r: paste(img, r[0], r[1])
    # ---- píldoras ----
    for txt, t0, t1, y, slot in CHIPS:
        if t0 - 0.02 <= t < t1:
            lay = chip(txt); a = eo((t - t0) / 0.18) * (1 - cl((t - (t1 - 0.12)) / 0.12)); dx = -50 * (1 - eo((t - t0) / 0.22))
            paste(img, lay, (40 + dx + (chip(CHIPS[0][0]).width + 18 if slot else 0), y), a)
    # ---- CTA ----
    if CTA0 <= t < CTA1 + 0.5:
        d = ImageDraw.Draw(img, 'RGBA'); a1 = eo((t - CTA0) / 0.15)
        f = font('Medium', 52); d.text((540, 900 + 14 * (1 - a1)), 'comenta la palabra', font=f, fill=BLANCO + (int(255 * a1),), anchor='mm')
        if t >= CTA0 + 0.2:
            bw, bh = 900, 230; im = Image.new('RGBA', (bw * 2, bh * 2), (0, 0, 0, 0)); dd = ImageDraw.Draw(im, 'RGBA')
            dd.rounded_rectangle((0, 0, bw * 2 - 1, bh * 2 - 1), 60, fill=AZUL + (255,))
            dd.text((bw, bh + 6), '“BUCLE”', font=font('Black', 190), fill=BLANCO + (255,), anchor='mm')
            u = back((t - CTA0 - 0.2) / 0.22); sc = 0.8 + 0.2 * u; im = im.resize((int(bw * sc), int(bh * sc)), Image.LANCZOS)
            paste(img, im, (540 - im.width / 2, 1090 - im.height / 2), eo((t - CTA0 - 0.2) / 0.1))
    return img

def save(i):
    frame(i).save(os.path.join(OUT, 'k_%04d.png' % i), compress_level=1); return i

if __name__ == '__main__':
    if '--stills' in sys.argv:
        ts = [float(x) for x in sys.argv[sys.argv.index('--stills') + 1].split(',')]
        os.makedirs(os.path.join(OUT, 'stills'), exist_ok=True)
        for t in ts: frame(int(round(t * FPS))).save(os.path.join(OUT, 'stills', 's_%05.2f.png' % t))
        print('stills', len(ts)); sys.exit(0)
    os.makedirs(OUT, exist_ok=True)
    vacio = os.path.join(OUT, '_vacio.png'); Image.new('RGBA', (W, H), (0, 0, 0, 0)).save(vacio, compress_level=1)
    activos = [i for i in range(N) if (RING_IN - 0.05 <= i / FPS <= FS1 + 0.3) or (CTA0 - 0.05 <= i / FPS)]
    for i in range(N):
        if i not in set(activos): shutil.copy(vacio, os.path.join(OUT, 'k_%04d.png' % i))
    with Pool(4) as p: p.map(save, activos, chunksize=8)
    os.remove(vacio); print('ok', N, 'fotogramas,', len(activos), 'con contenido')
