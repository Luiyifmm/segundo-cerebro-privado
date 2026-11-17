# Generador común del lote 17-11 (alumnos Trainer10x). Misma mecánica que Camilo v2 (aprobado 16-11), parametrizada por spec.json.
# No toca Premiere ni el bruto. Uso:
#   <python whisperx> reel_alumno.py <spec.json> base            -> base.mov, fr/*.jpg, voz.wav
#   <python whisperx> reel_alumno.py <spec.json> anim [f1,f2..]   -> an/*.jpg (o solo esos fotogramas) y video_voz.mp4
#   <python whisperx> reel_alumno.py <spec.json> hoja             -> hoja.jpg (24 fotogramas del vídeo animado)
#   <python whisperx> reel_alumno.py <spec.json> eventos          -> eventos.json para real-sfx
# Tiempos del spec: SIEMPRE en segundos del montaje (después del corte).
import os, sys, json, math, re, subprocess, unicodedata
import numpy as np
from multiprocessing import Pool
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SPEC = os.path.abspath(sys.argv[1]); S = json.load(open(SPEC)); AQUI = os.path.dirname(SPEC)
WORK = S.get('trabajo') or os.path.join('/private/tmp/claude-501/lote-1711', os.path.basename(AQUI)); os.makedirs(WORK, exist_ok=True)
FPS = 30; W, H = 1080, 1920
TRAMOS = [tuple(x) for x in S['tramos']]
DUR = sum(e - s for s, e in TRAMOS); N = int(round(DUR * FPS))

def a_montaje(t):
    """Segundo del BRUTO -> segundo del montaje (si cae en un hueco cortado, al inicio del tramo siguiente)."""
    if t >= 99: return t
    off = 0.0
    for s, e in TRAMOS:
        if t < s - 0.06: return round(off, 3)
        if t <= e + 0.06: return round(off + max(0.0, min(t, e) - s), 3)
        off += e - s
    return round(DUR, 3)
if S.get('tiempos') == 'bruto':          # el spec se escribe con los tiempos del bruto (lo que se ve en palabras.json y en las hojas)
    m_ = a_montaje
    for e in S.get('elementos', []):
        for k in ('t0', 't1', 't_clic', 't_marca'):
            if isinstance(e.get(k), (int, float)): e[k] = m_(e[k])
        for it in e.get('items', []):
            for k in ('t', 't_col'):
                if k in it: it[k] = m_(it[k])
        if 'tiempos' in e: e['tiempos'] = [m_(x) for x in e['tiempos']]
    S['zooms'] = [[m_(a), m_(b), z] for a, b, z in S.get('zooms', [])]
    S['transiciones'] = [m_(x) for x in S.get('transiciones', [])]
    S['sin_subs'] = [[m_(a), m_(b)] for a, b in S.get('sin_subs', [])]
    S['eventos_extra'] = [dict(x, t=m_(x['t'])) for x in S.get('eventos_extra', [])]
    if 'frases_desde' in S: S['frases_desde'] = m_(S['frases_desde'])
    S['frases'] = [re.sub(r'@([\d.]+)\|', lambda g: '@%.3f|' % m_(float(g.group(1))), f) for f in S.get('frases', [])]
for k_, e_ in enumerate(S.get('elementos', [])): e_['_i'] = k_
_COLOC = None
def pos(e, dx=540, dy=330):
    """Posición del elemento; 'auto' = la que propuso componer.py (paso «colocar»)."""
    global _COLOC
    x, y = e.get('x', dx), e.get('y', dy)
    if 'auto' in (x, y):
        if _COLOC is None:
            f = os.path.join(AQUI, 'colocacion.json'); _COLOC = json.load(open(f)) if os.path.exists(f) else {}
        c = _COLOC.get(str(e['_i']))
        if c: x, y = (c[0] if x == 'auto' else x), (c[1] if y == 'auto' else y)
        else: x, y = (dx if x == 'auto' else x), (dy if y == 'auto' else y)
    return x, y
EMO = '/System/Library/Fonts/Apple Color Emoji.ttc'
FU = {
    'sf_med': os.path.expanduser('~/Proyectos/amin/trabajos/_fuentes/sfpro-medium.otf'),
    'sf_bold': os.path.expanduser('~/Proyectos/amin/trabajos/_fuentes/sfpro-bold.otf'),
    'sequel': os.path.expanduser('~/Library/Fonts/Sequel Sans Heavy Disp.otf'),
    'sequel_med': os.path.expanduser('~/Library/Fonts/Sequel Sans Medium Disp.otf'),
    'montserrat': os.path.expanduser('~/Library/Fonts/Montserrat-Black.ttf'),
    'poppins': os.path.expanduser('~/Library/Fonts/Poppins-Black.ttf'),
    'playfair': os.path.expanduser('~/Videos-Remotion/video-editor/assets/fonts/PlayfairDisplay-Italic-VF.ttf'),
}
_f = {}
def F(nombre, s):
    k = (nombre, int(s))
    if k not in _f:
        f = ImageFont.truetype(FU.get(nombre, nombre), int(s))
        if nombre == 'playfair':
            try: f.set_variation_by_name('Bold Italic')
            except Exception:
                try: f.set_variation_by_axes([700])
                except Exception: pass
        _f[k] = f
    return _f[k]
hx = lambda h: tuple(int(h.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4))
M = S['marca']; COL = {'bueno': hx(M['bueno']), 'malo': hx(M['malo']), 'crema': (245, 240, 230), 'blanco': (255, 255, 255)}
NEGRO = (14, 14, 16); COL.update({k: hx(v) for k, v in S.get('colores', {}).items()}); CLAVE_F = M.get('clave_font', 'sequel'); MAYUS = M.get('mayusculas', CLAVE_F != 'playfair')

eo = lambda p: 1 - (1 - min(1, max(0, p))) ** 3
lerp = lambda a, b, p: a + (b - a) * p
bo = lambda p: 1 + 2.2 * (min(1, max(0, p)) - 1) ** 3 + 1.2 * (min(1, max(0, p)) - 1) ** 2 if p < 1 else 1
ent = lambda t, t0, d=0.22: eo((t - t0) / d)
sal = lambda t, t1, d=0.2: 1 - eo((t - t1) / d)

# ---------------- utilidades de dibujo (las de Álvaro/Camilo) ----------------
def emoji(ch, lado):
    im = Image.new('RGBA', (220, 220), (0, 0, 0, 0)); ImageDraw.Draw(im).text((110, 110), ch, font=F(EMO, 160), embedded_color=True, anchor='mm')
    return im.crop(im.getbbox()).resize((lado, lado), Image.LANCZOS)
_fo = {}
def foto_tile(ruta, lado):
    """Foto de producto (fondo blanco) en una baldosa blanca redondeada."""
    k = (ruta, lado)
    if k not in _fo:
        im = Image.open(os.path.join(AQUI, ruta)).convert('RGB'); pad = int(lado * .08); w = lado - 2 * pad
        im.thumbnail((w, w), Image.LANCZOS); t = Image.new('RGBA', (lado, lado), (0, 0, 0, 0))
        ImageDraw.Draw(t).rounded_rectangle((0, 0, lado - 1, lado - 1), int(lado * .16), fill=(255, 255, 255, 255))
        t.paste(im, ((lado - im.size[0]) // 2, (lado - im.size[1]) // 2)); _fo[k] = t
    return _fo[k]
def visual(it, lado): return foto_tile(it['img'], lado) if it.get('img') else emoji(it['emoji'], lado)

def rrmask(size, box, r):
    m = Image.new('L', size, 0); ImageDraw.Draw(m).rounded_rectangle(box, r, fill=255); return m
def sombra_caja(img, box, r, fuerza=120, blur=25, dy=16):
    x0, y0, x1, y1 = box; sh = Image.new('L', img.size, 0); ImageDraw.Draw(sh).rounded_rectangle((x0, y0 + dy, x1, y1 + dy + 6), r, fill=fuerza)
    img.paste(Image.new('RGB', img.size, (0, 0, 0)), (0, 0), sh.filter(ImageFilter.GaussianBlur(blur)))
def cristal(img, box, r, claro=0.16, borde=150, sombra=True, blur=22, tinte=(255, 255, 255), oscuro=0.0):
    if sombra: sombra_caja(img, box, r)
    m = rrmask(img.size, box, r)
    b = img.filter(ImageFilter.GaussianBlur(blur)); b = Image.blend(b, Image.new('RGB', img.size, tinte), claro)
    if oscuro: b = Image.blend(b, Image.new('RGB', img.size, (0, 0, 0)), oscuro)
    img.paste(b, (0, 0), m)
    o = Image.new('RGBA', img.size, (0, 0, 0, 0)); ImageDraw.Draw(o).rounded_rectangle(box, r, outline=(255, 255, 255, borde), width=2)
    img.paste(o, (0, 0), o)
def visto(d, cx, cy, R, w, col):
    d.ellipse((cx - R - 5, cy - R - 5, cx + R + 5, cy + R + 5), fill=(255, 255, 255)); d.ellipse((cx - R, cy - R, cx + R, cy + R), fill=col)
    d.line((cx - R * .45, cy + R * .02, cx - R * .1, cy + R * .38, cx + R * .48, cy - R * .32), fill='white', width=w, joint='curve')
def prohibido(d, cx, cy, R, w, col):
    d.ellipse((cx - R - 5, cy - R - 5, cx + R + 5, cy + R + 5), fill=(255, 255, 255)); d.ellipse((cx - R, cy - R, cx + R, cy + R), outline=col, width=w)
    a = math.radians(45); dx, dy = (R - w / 2) * math.cos(a), (R - w / 2) * math.sin(a); d.line((cx - dx, cy - dy, cx + dx, cy + dy), fill=col, width=w)
def mezcla(im, c, a): return c if a >= 1 else (im if a <= 0 else Image.blend(im, c, a))
def capa(im, fn, q):
    if q <= 0: return im
    c = im.copy(); fn(c); return mezcla(im, c, q)
def degradado(img, desde=0.60, fuerza=170):
    g = Image.new('L', (1, H), 0); y0 = int(H * desde)
    for y in range(y0, H): g.putpixel((0, y), int(fuerza * ((y - y0) / (H - y0)) ** 1.4))
    img.paste(Image.new('RGB', img.size, (0, 0, 0)), (0, 0), g.resize(img.size))
def degradado_arriba(img, hasta=0.30, fuerza=150):
    g = Image.new('L', (1, H), 0); y1 = int(H * hasta)
    for y in range(0, y1): g.putpixel((0, y), int(fuerza * ((y1 - y) / y1) ** 1.4))
    img.paste(Image.new('RGB', img.size, (0, 0, 0)), (0, 0), g.resize(img.size))
def zoom(img, z, cx=0.5, cy=0.40, blur=0):
    w, h = W / z, H / z; x0, y0 = (W - w) * cx, (H - h) * cy
    im = img.resize((W, H), Image.BICUBIC, box=(x0, y0, x0 + w, y0 + h)); return im.filter(ImageFilter.GaussianBlur(blur)) if blur else im
def sombra_texto(img, xy, t, f, anchor='mm', fuerza=None, blur=None):
    fuerza = fuerza or S.get('sombra', 190); blur = blur or S.get('sombra_blur', 12)
    s = Image.new('L', img.size, 0); ImageDraw.Draw(s).text(xy, t, font=f, fill=fuerza, anchor=anchor)
    img.paste(Image.new('RGB', img.size, (0, 0, 0)), (0, 0), s.filter(ImageFilter.GaussianBlur(blur)))
def ajusta(d, txt, nombre, tam, ancho):
    f = F(nombre, tam)
    while d.textlength(txt, font=f) > ancho and tam > 20: tam -= 4; f = F(nombre, tam)
    return f, tam

# ---------------- palabras: transcripción del bruto llevada al montaje ----------------
def norm(w): return re.sub(r'[^a-z0-9ñ]', '', ''.join(c for c in unicodedata.normalize('NFD', w.lower()) if unicodedata.category(c) != 'Mn'))
def palabras_montaje():
    p = S.get('palabras')
    if not p: return []
    d = json.load(open(os.path.join(AQUI, p))); ws = d['palabras'] if isinstance(d, dict) and 'palabras' in d else (d.get('words') if isinstance(d, dict) else d)
    out, off = [], 0.0
    for s, e in TRAMOS:
        for w in ws:
            t0 = w.get('inicio', w.get('start')); t1 = w.get('fin', w.get('end'))
            if t0 is None: continue
            if t0 > 1000: t0, t1 = t0 / 1000, t1 / 1000           # en ms
            if s - 0.02 <= t0 < e - 0.03: out.append((w.get('palabra', w.get('word', w.get('texto', ''))).strip(), off + t0 - s, off + min(t1, e) - s))
        off += e - s
    return out
def construir_subs():
    """S['frases']: lista de frases del montaje. *palabra* = clave (color bueno), *!palabra* = clave color malo, *~palabra* = clave crema.
    Se alinean en orden con las palabras del montaje; cada frase dura hasta la siguiente."""
    ws = palabras_montaje(); subs = []; i = 0
    while i < len(ws) and ws[i][1] < S.get('frases_desde', 0) - 0.05: i += 1
    for fr in S.get('frases', []):
        tsync = None; mm = re.match(r'^(\??)@([\d.]+)\|', fr)
        if mm:
            tsync = float(mm.group(2)); fr = mm.group(1) + fr[mm.end():]
            i = 0
            while i < len(ws) and ws[i][1] < tsync - 0.05: i += 1
        if fr.startswith('?') and tsync is not None:
            subs.append([(w, tsync, False, 'pregunta' if k == 0 else 'x') for k, w in enumerate(fr.lstrip('?').split())]); continue
        toks = re.findall(r'\*[^*]+\*|\S+', fr); filas = []
        for tk in toks:
            clave = tk.startswith('*'); tx = tk.strip('*'); col = 'bueno'
            if tx.startswith('!'): col, tx = 'malo', tx[1:]
            elif tx.startswith('~'): col, tx = 'crema', tx[1:]
            elif tx.startswith('%'): col, tx = tx[1:].split('%', 1)
            for sub in tx.split():
                j = i; hit = None
                while j < min(len(ws), i + 6):
                    a_, b_ = norm(ws[j][0]), norm(sub)
                    if a_ and (a_ == b_ or (min(len(a_), len(b_)) >= 4 and (a_.startswith(b_) or b_.startswith(a_)))): hit = j; break
                    j += 1
                if hit is None: t = filas[-1][1] if filas else (ws[i][1] if i < len(ws) else DUR)
                else: t = ws[hit][1]; i = hit + 1
                filas.append((sub, t, clave, col))
        if filas:
            if fr.startswith('?'): filas[0] = (filas[0][0].lstrip('?'), filas[0][1], filas[0][2], 'pregunta')
            subs.append(filas)
    res = []
    for k, filas in enumerate(subs):
        t0 = filas[0][1]; t1 = subs[k + 1][0][1] - 0.02 if k + 1 < len(subs) else DUR + 1
        res.append((t0, t1, filas))
    return res

# ---------------- subtítulo apilado: relleno SF Medium que se escribe al decirse, clave de marca que entra al decirla ----------------
def subtitulo(im, t, SUBS):
    y = S.get('sub_y', 1430)
    for k, (t0, t1, filas) in enumerate(SUBS):
        if not (t0 - 0.02 <= t < t1): continue
        if any(t0 <= a < b and a <= t < b for a, b in S.get('sin_subs', [])): return
        if filas[0][3] == 'pregunta':
            txt = ' '.join(w for w, s, c, col in filas)
            d = ImageDraw.Draw(im); f, _ = ajusta(d, txt, 'sf_bold', 50, 860); tw = d.textlength(txt, font=f); q = eo((t - t0) / 0.15)
            bx = (540 - tw / 2 - 40, y - 50 + 20 * (1 - q), 540 + tw / 2 + 40, y + 50 + 20 * (1 - q))
            def fn(c):
                sombra_caja(c, bx, 26, fuerza=120, blur=16, dy=8); ImageDraw.Draw(c).rounded_rectangle(bx, 26, fill=(255, 255, 255))
                ImageDraw.Draw(c).text((540, (bx[1] + bx[3]) / 2), txt, font=f, fill=NEGRO, anchor='mm')
                if S.get('pregunta_quien'): ImageDraw.Draw(c).text((bx[0] + 10, bx[1] - 26), S['pregunta_quien'], font=F('sf_bold', 28), fill=(255, 255, 255), anchor='lm')
            im.paste(capa(im, fn, q)); return
        k0 = next((k for k, x in enumerate(filas) if x[2]), len(filas))           # lo que va tras la clave se une a la clave
        col0 = filas[k0][3] if k0 < len(filas) else 'bueno'
        rel = ' '.join(w for w, s, c, col in filas[:k0] if t >= s - 0.02)
        cl = [(w, s, col0) for w, s, c, col in filas[k0:] if t >= s - 0.02 or c]
        d = ImageDraw.Draw(im)
        if rel:
            f, _ = ajusta(d, rel, 'sf_bold', 52, 940); sombra_texto(im, (540, y), rel, f); ImageDraw.Draw(im).text((540, y), rel, font=f, fill=COL['blanco'], anchor='mm')
        if cl and t >= cl[0][1] - 0.02:
            txt = ' '.join(w for w, s, col in cl); txt = txt.upper() if MAYUS else txt
            col = COL[cl[0][2]]; te = cl[0][1]
            base_t = 118 if CLAVE_F != 'playfair' else 128
            tam = int(lerp(base_t * 1.25, base_t, eo((t - te) / 0.1)))
            f, tam = ajusta(d, txt, CLAVE_F, tam, 960)
            yy = y + (base_t * .78 if rel else 0)
            sombra_texto(im, (540, yy), txt, f); ImageDraw.Draw(im).text((540, yy), txt, font=f, fill=col, anchor='mm')
        return

# ---------------- elementos ----------------
def pill(img, cx, cy, txt, col_fondo, col_txt, fuente='sf_bold', tam=40, pad=34):
    d = ImageDraw.Draw(img); f = F(fuente, tam); tw = d.textlength(txt, font=f); bx = (cx - tw / 2 - pad, cy - tam * .9, cx + tw / 2 + pad, cy + tam * .9)
    sombra_caja(img, bx, int(tam * .9), fuerza=120, blur=16, dy=8); ImageDraw.Draw(img).rounded_rectangle(bx, int(tam * .9), fill=col_fondo)
    ImageDraw.Draw(img).text((cx, cy), txt, font=f, fill=col_txt, anchor='mm'); return bx

def el_titulo(im, e, t):
    """Título del gancho: tarjeta de cristal arriba, línea 1 blanca + línea 2 en la letra de la marca; entra con rebote y sube al salir."""
    q = ent(t, e['t0'], 0.25); s = sal(t, e['t1'], 0.2)
    if q <= 0 or s <= 0: return im
    y = e.get('y', 260); dy = int(80 * (1 - bo((t - e['t0']) / 0.3))) - int(300 * (1 - s))
    def fn(c):
        d = ImageDraw.Draw(c); l1 = e.get('linea1', ''); l2 = e.get('linea2', ''); l2 = l2.upper() if (MAYUS and l2) else l2
        f1, _ = ajusta(d, l1, 'sf_bold', 52, 860) if l1 else (None, 0); f2, _ = ajusta(d, l2, CLAVE_F, 104 if CLAVE_F != 'playfair' else 112, 880) if l2 else (None, 0)
        w_ = max(d.textlength(l1, font=f1) if l1 else 0, d.textlength(l2, font=f2) if l2 else 0) + 110; h_ = (70 if l1 else 0) + (130 if l2 else 0) + 50
        bx = (540 - w_ / 2, y + dy, 540 + w_ / 2, y + dy + h_)
        cristal(c, bx, 46, claro=0.10, oscuro=0.38, borde=170, blur=28)
        yy = y + dy + 25
        if l1: ImageDraw.Draw(c).text((540, yy + 35), l1, font=f1, fill=COL['blanco'], anchor='mm'); yy += 70
        if l2: ImageDraw.Draw(c).text((540, yy + 65), l2, font=f2, fill=COL[e.get('col', 'bueno')], anchor='mm')
    return capa(im, fn, min(q, s))

def el_tarjeta(im, e, t):
    """Tarjeta de cristal tipo Apple con emoji y etiqueta (imagen de fuera del vídeo, L9)."""
    q = ent(t, e['t0'], 0.22); s = sal(t, e['t1'], 0.18)
    if q <= 0 or s <= 0: return im
    (x, y), L = pos(e), e.get('lado', 300); sc = bo((t - e['t0']) / 0.3)
    def fn(c):
        Ls = int(L * (0.85 + 0.15 * sc)); bx = (x - Ls / 2, y - Ls / 2 + int(40 * (1 - s)), x + Ls / 2, y + Ls / 2 + int(40 * (1 - s)))
        if e.get('blanca'): sombra_caja(c, bx, 56, fuerza=130, blur=22); ImageDraw.Draw(c).rounded_rectangle(bx, 56, fill=(250, 250, 250))
        else: cristal(c, bx, 56, claro=0.14, borde=180)
        lado = int(Ls * (.5 if e.get('img') else .42)); em = visual(e, lado); c.paste(em, (int(x - lado / 2), int(bx[1] + Ls * (.08 if e.get('img') else .14))), em)
        if e.get('texto'):
            d = ImageDraw.Draw(c); f, _ = ajusta(d, e['texto'], 'sf_bold', int(Ls * .12), Ls - 30)
            d.text((x, bx[1] + Ls * .76), e['texto'], font=f, fill=NEGRO if e.get('blanca') else COL['blanco'], anchor='mm')
        if e.get('marca') in ('si', 'no') and t >= e.get('t_marca', e['t0']):
            d = ImageDraw.Draw(c); R = int(Ls * .09)
            (visto if e['marca'] == 'si' else prohibido)(d, bx[2] - R - 14, bx[1] + R + 14, R, max(5, R // 3), COL['bueno'] if e['marca'] == 'si' else COL['malo'])
    return capa(im, fn, min(q, s))

def el_columnas(im, e, t):
    """Columnas de cristal con cabecera. Cada alimento aparece grande arriba al nombrarlo (it['t']) y vuela a su columna
    cuando se dice la frecuencia (it['t_col']); allí se queda en una rejilla de 2 por fila."""
    q = ent(t, e['t0'], 0.3); s = sal(t, e['t1'], 0.25)
    if q <= 0 or s <= 0: return im
    cab = e['cabeceras']; n = len(cab); G = 18; Wc = (1000 - G * (n - 1)) // n; x0 = 40; y0 = e.get('y', 1060); Hc = e.get('alto', 800)
    cols = e.get('col_cab', ['bueno'] * n); VUELO = 0.32; CEL = e.get('celda', 168); LI = e.get('lado_item', 86); LF = e.get('lado_flota', 190)
    def hueco(it):
        i = it['col']; k = [x for x in e['items'] if x['col'] == i].index(it)
        bx0 = x0 + i * (Wc + G); return (bx0 + Wc / 4 + (k % 2) * Wc / 2, y0 + 118 + (k // 2) * CEL - 30 + LI / 2)
    def fn(c):
        dy = int(-60 * (1 - q)) + int(900 * (1 - s))
        if e.get('titulo'):
            pill(c, 540, y0 + dy - 70, e['titulo'], NEGRO, COL['blanco'], 'sf_bold', 38)
        for i, h in enumerate(cab):
            bx = (x0 + i * (Wc + G), y0 + dy, x0 + i * (Wc + G) + Wc, y0 + dy + Hc)
            cristal(c, bx, 36, claro=0.10, oscuro=e.get('oscuro', 0.34), borde=170, blur=26)
            hb = (bx[0] + 12, bx[1] + 12, bx[2] - 12, bx[1] + 92)
            ImageDraw.Draw(c).rounded_rectangle(hb, 24, fill=COL[cols[i]])
            d = ImageDraw.Draw(c); f, _ = ajusta(d, h, 'sf_bold', 34, Wc - 40); d.text(((hb[0] + hb[2]) / 2, (hb[1] + hb[3]) / 2), h, font=f, fill=NEGRO if cols[i] != 'malo' else COL['blanco'], anchor='mm')
        for it in e['items']:
            if t < it['t']: continue
            hx_, hy_ = hueco(it); hy_ += dy
            if t < it['t_col']:                     # flotando arriba, grande, mientras lo nombra
                p = bo((t - it['t']) / 0.28); lado = int(LF * (0.7 + 0.3 * p)); cx_, cy_ = 540, e.get('y_flota', 300); hw = max(170, LF // 2 + 40)
                bxf = (cx_ - hw, cy_ - LF * .8, cx_ + hw, cy_ + LF * .5 + 110); cristal(c, bxf, 48, claro=0.12, oscuro=0.25, borde=200, blur=26)
                em = visual(it, lado); c.paste(em, (int(cx_ - lado / 2), int(cy_ - LF * .65 + (LF - lado) / 2)), em)
                d = ImageDraw.Draw(c); f, _ = ajusta(d, it.get('largo', it['texto']), 'sf_bold', 40, 2 * hw - 30); d.text((cx_, cy_ + LF * .5 + 50), it.get('largo', it['texto']), font=f, fill=COL['blanco'], anchor='mm')
                continue
            p = eo((t - it['t_col']) / VUELO); y0f = e.get('y_flota', 300) - 25
            kx = e.get('rodeo_x', 980) if abs(hx_ - 540) < 200 else hx_; ky = e.get('rodeo_y', 600)      # rodea la cara por el lado
            cx_ = (1 - p) ** 2 * 540 + 2 * (1 - p) * p * kx + p * p * hx_; cy_ = (1 - p) ** 2 * y0f + 2 * (1 - p) * p * ky + p * p * hy_; lado = int(lerp(LF, LI, p))
            em = visual(it, lado); c.paste(em, (int(cx_ - lado / 2), int(cy_ - lado / 2 + 30)), em)
            if p >= 1:
                d = ImageDraw.Draw(c); f, _ = ajusta(d, it['texto'], 'sf_bold', 29, Wc / 2 - 6)
                d.text((hx_, hy_ + 30 + LI / 2 + 22), it['texto'], font=f, fill=COL['blanco'], anchor='mm')
    return capa(im, fn, min(q, s))

def el_pildoras(im, e, t):
    """Lista de píldoras de cristal con ✓ (o ✕) que entran una a una."""
    if t < e['items'][0]['t'] - 0.01 or sal(t, e['t1']) <= 0: return im
    s = sal(t, e['t1']); y = e.get('y', 250); lado = e.get('lado', 'der')
    def fn(c):
        yy = y
        for it in e['items']:
            if t < it['t']: break
            p = eo((t - it['t']) / 0.22); f = F('sf_bold', e.get('tam', 42)); tw = ImageDraw.Draw(c).textlength(it['texto'], font=f)
            w_ = tw + 130; x1 = 1040 if lado == 'der' else 40 + w_
            if lado == 'centro': x1 = 540 + w_ / 2
            dx = int(120 * (1 - p)) * (1 if lado != 'izq' else -1); bx = (x1 - w_ + dx, yy, x1 + dx, yy + 100)
            cristal(c, bx, 50, claro=0.10, oscuro=0.25, borde=200, blur=24)
            d = ImageDraw.Draw(c)
            if it.get('emoji'): em = emoji(it['emoji'], 58); c.paste(em, (int(bx[0] + 23), int(yy + 21)), em)
            else: (visto if it.get('marca', 'si') == 'si' else prohibido)(d, bx[0] + 52, yy + 50, 26, 8, COL['bueno'] if it.get('marca', 'si') == 'si' else COL['malo'])
            d.text((bx[0] + 96, yy + 50), it['texto'], font=f, fill=COL['blanco'], anchor='lm'); yy += 124
    return capa(im, fn, s)

def el_texto(im, e, t):
    """Texto en pantalla (vídeos sin voz): líneas que entran una a una; la marcada con * va en la letra de la marca y su color."""
    q = ent(t, e['t0'], 0.25); s = sal(t, e['t1'], 0.25)
    if q <= 0 or s <= 0: return im
    y = e.get('y', 330); paso = e.get('paso', 0.45)
    def fn(c):
        yy = y
        for k, ln in enumerate(e['lineas']):
            tk = e['t0'] + k * paso if 'tiempos' not in e else e['tiempos'][k]
            if t < tk: break
            p = eo((t - tk) / 0.25); esp = ln.startswith('*'); tx = ln.strip('*'); col = COL[e.get('col', 'bueno')] if esp else COL['blanco']
            if esp and MAYUS: tx = tx.upper()
            d = ImageDraw.Draw(c); f, tam = ajusta(d, tx, CLAVE_F if esp else 'sf_bold', (e.get('tam_esp', 96) if esp else e.get('tam', 58)), 960)
            y_ = yy + int(30 * (1 - p)); sombra_texto(c, (540, y_), tx, f, fuerza=210, blur=14)
            l = Image.new('RGBA', c.size, (0, 0, 0, 0)); ImageDraw.Draw(l).text((540, y_), tx, font=f, fill=col + (int(255 * p),), anchor='mm'); c.paste(l, (0, 0), l)
            yy += int(tam * 1.25)
    return capa(im, fn, min(q, s))

def el_cta(im, e, t):
    """Cierre: tarjeta de cristal abajo con el usuario y botón; el botón pasa a «Siguiendo» o muestra la palabra clave."""
    q = ent(t, e['t0'], 0.25)
    if q <= 0: return im
    y = e.get('y', 1220)
    def fn(c):
        dy = int(70 * (1 - bo((t - e['t0']) / 0.3))); bx = (110, y + dy, 970, y + dy + 190)
        cristal(c, bx, 48, claro=0.12, oscuro=0.30, borde=190, blur=26)
        d = ImageDraw.Draw(c); d.ellipse((150, y + dy + 45, 250, y + dy + 145), fill=COL['bueno']); d.text((200, y + dy + 95), M.get('inicial', M['nombre'][0]), font=F('sf_bold', 52), fill=NEGRO, anchor='mm')
        hecho = t >= e.get('t_clic', 99)
        b = e.get('boton_hecho', 'Siguiendo') if hecho else e.get('boton', 'Seguir')
        f = F('sf_bold', 36); tw = max(d.textlength(e.get('boton_hecho', 'Siguiendo'), font=f), d.textlength(e.get('boton', 'Seguir'), font=f)); bb = (930 - tw - 60, y + dy + 62, 930, y + dy + 128)
        fu, _ = ajusta(d, e.get('usuario', M.get('usuario', M['nombre'])), 'sf_bold', 40, bb[0] - 300); fs, _ = ajusta(d, e.get('sub', M.get('rol', '')), 'sf_med', 30, bb[0] - 300)
        d.text((280, y + dy + 70), e.get('usuario', M.get('usuario', M['nombre'])), font=fu, fill=COL['blanco'], anchor='lm')
        d.text((280, y + dy + 122), e.get('sub', M.get('rol', '')), font=fs, fill=(215, 215, 215), anchor='lm')
        d.rounded_rectangle(bb, 33, fill=(60, 60, 64) if hecho else COL['bueno']); d.text(((bb[0] + bb[2]) / 2, (bb[1] + bb[3]) / 2), b, font=f, fill=COL['blanco'] if hecho else NEGRO, anchor='mm')
        if e.get('t_clic') and abs(t - e['t_clic']) < 0.25:      # dedo que pulsa
            p = (t - e['t_clic'] + 0.25) / 0.5; r = int(36 * (1 - abs(p - .5) * 2) + 22)
            d.ellipse(((bb[0] + bb[2]) / 2 - r, (bb[1] + bb[3]) / 2 - r, (bb[0] + bb[2]) / 2 + r, (bb[1] + bb[3]) / 2 + r), outline=(255, 255, 255), width=4)
    return capa(im, fn, q)

def el_pill(im, e, t):
    """Píldora de aviso (p. ej. «📝 Formulario en mi bio»): entra con rebote."""
    q = ent(t, e['t0'], 0.22); s_ = sal(t, e.get('t1', 99), 0.2)
    if q <= 0 or s_ <= 0: return im
    def fn(c):
        px_, py_ = pos(e, 540, 600); dy = int(50 * (1 - bo((t - e['t0']) / 0.3))); y = py_ + dy
        d = ImageDraw.Draw(c); f = F('sf_bold', e.get('tam', 46)); tw = d.textlength(e['texto'], font=f); lado = int(e.get('tam', 46) * 1.4)
        cx = px_; w_ = tw + lado + 110; bx = (cx - w_ / 2, y - 55, cx + w_ / 2, y + 55)
        sombra_caja(c, bx, 55, fuerza=130, blur=18, dy=10); ImageDraw.Draw(c).rounded_rectangle(bx, 55, fill=COL[e.get('col', 'bueno')])
        if e.get('emoji'): em = emoji(e['emoji'], lado); c.paste(em, (int(bx[0] + 40), int(y - lado / 2)), em)
        ImageDraw.Draw(c).text((bx[0] + 40 + lado + 20, y), e['texto'], font=f, fill=NEGRO, anchor='lm')
    return capa(im, fn, min(q, s_))

def el_color(im, e, t):
    """Panel de un color: cabecera con su color, beneficio y emojis de alimentos que entran en cascada."""
    q = ent(t, e['t0'], 0.22); s_ = sal(t, e['t1'], 0.15)
    if q <= 0 or s_ <= 0: return im
    col = hx(e['col']); y0 = e.get('y', 70)
    def fn(c):
        dy = int(-50 * (1 - q)); bx = (60, y0 + dy, 1020, y0 + dy + 430)
        cristal(c, bx, 44, claro=0.10, oscuro=0.40, borde=190, blur=28)
        d = ImageDraw.Draw(c); f = F(CLAVE_F, 70); hb = (bx[0] + 24, bx[1] + 22, bx[2] - 24, bx[1] + 122)
        d.rounded_rectangle(hb, 30, fill=col); d.text((540, (hb[1] + hb[3]) / 2), e['nombre'].upper(), font=f, fill=NEGRO if sum(col) > 380 else (255, 255, 255), anchor='mm')
        f2, _ = ajusta(d, e['texto'], 'sf_bold', 42, 900); d.text((540, bx[1] + 168), e['texto'], font=f2, fill=(255, 255, 255), anchor='mm')
        n = len(e['emojis']); L = 112; G = 16; x = 540 - (n * L + (n - 1) * G) / 2
        for k, ch in enumerate(e['emojis']):
            tk = e['t0'] + 0.15 + k * 0.09
            if t < tk: break
            p = bo((t - tk) / 0.25); lado = max(10, int(L * (0.6 + 0.4 * p))); em = emoji(ch, lado)
            c.paste(em, (int(x + k * (L + G) + (L - lado) / 2), int(bx[1] + 225 + (L - lado) / 2)), em)
    return capa(im, fn, min(q, s_))

TIPOS = {'color': el_color, 'pill': el_pill, 'titulo': el_titulo, 'tarjeta': el_tarjeta, 'columnas': el_columnas, 'pildoras': el_pildoras, 'texto': el_texto, 'cta': el_cta}

# ---------------- cuadro ----------------
SUBS = None
def cuadro(f):
    global SUBS
    if SUBS is None: SUBS = construir_subs()
    t = f / FPS
    im = Image.open('%s/fr/b_%04d.jpg' % (WORK, f)).convert('RGB')
    g = S.get('gancho', {})
    # zoom: gancho (zoom out desde 1,3 con enfoque, gusto de Luis), golpes en remates y transiciones de zoom en los cortes
    z, blur, cx, cy = 1.0, 0, 0.5, S.get('cara_y', 0.40)
    if g.get('zoom_out', True) and f < 9:
        p = eo(f / 8); z = lerp(1.3, 1.0, p); blur = 11 * (1 - p)
    for a, b, zz in S.get('zooms', []):
        if a <= t < b: z = max(z, lerp(1.0, zz, eo((t - a) / 0.08)))
    for tt in S.get('transiciones', []):
        dt = t - tt
        if -0.12 <= dt < 0.12:
            p = 1 - abs(dt) / 0.12; z = max(z, 1 + 0.22 * p); blur = max(blur, 16 * p)
    if z > 1.001 or blur > 0.3: im = zoom(im, z, cx, cy, blur)
    if S.get('degradado', True): degradado(im, S.get('degradado_desde', 0.60), S.get('degradado_fuerza', 170))
    if S.get('degradado_arriba'): degradado_arriba(im)
    for e in S.get('elementos', []): im = TIPOS[e['tipo']](im, e, t)
    if SUBS: subtitulo(im, t, SUBS)
    if S.get('credito'): ImageDraw.Draw(im).text((1040, 1890), S['credito'], font=F('sf_med', 18), fill=(210, 210, 210), anchor='rm')
    im.save('%s/an/a_%04d.jpg' % (WORK, f), quality=93); return f

# ---------------- base ----------------
def base():
    os.makedirs(WORK + '/fr', exist_ok=True)
    br = os.path.join(AQUI, S['bruto']); a, fc = [], []
    hdr = S.get('hdr'); cov = 'scale=%d:%d:force_original_aspect_ratio=increase,crop=%d:%d' % (W, H, W, H)
    tm = 'zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p,' if hdr else ''
    crop = S.get('recorte')       # [x,y,w,h] en el bruto ya girado (opcional)
    cr = ('crop=%d:%d:%d:%d,' % (crop[2], crop[3], crop[0], crop[1])) if crop else ''
    con_audio = S.get('audio', 'voz') == 'voz'
    for k, (s, e) in enumerate(TRAMOS):
        a += ['-ss', '%.3f' % s, '-t', '%.3f' % (e - s), '-i', br]
        fc.append('[%d:v]%s%s%s,fps=%d,setpts=PTS-STARTPTS[v%d]' % (k, tm, cr, cov, FPS, k))
        if con_audio: fc.append('[%d:a:0]aresample=48000,aformat=channel_layouts=mono,asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st=%.3f:d=0.012[a%d]' % (k, max(0, e - s - 0.012), k))
    n = len(TRAMOS)
    if con_audio:
        fc.append(''.join('[v%d][a%d]' % (k, k) for k in range(n)) + 'concat=n=%d:v=1:a=1[v][a]' % n); mp = ['-map', '[v]', '-map', '[a]', '-c:a', 'pcm_s16le']
    else:
        fc.append(''.join('[v%d]' % k for k in range(n)) + 'concat=n=%d:v=1:a=0[v]' % n); mp = ['-map', '[v]']
    subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-y'] + a + ['-filter_complex', ';'.join(fc)] + mp + ['-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', WORK + '/base.mov'], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', WORK + '/base.mov', '-frames:v', str(N), '-start_number', '0', '-q:v', '2', WORK + '/fr/b_%04d.jpg'], check=True)
    if con_audio:
        g = S.get('ganancia_db', 0)
        subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', WORK + '/base.mov', '-vn', '-af',
                        'volume=%sdB,highpass=f=80,afftdn=nf=-45,acompressor=threshold=0.06:ratio=3:attack=5:release=120,loudnorm=I=-16:TP=-2' % g, '-ar', '48000', '-ac', '2', WORK + '/voz.wav'], check=True)
    print('base ok', N, 'fotogramas', round(DUR, 2), 's')

def video():
    entrada = ['-i', WORK + '/voz.wav'] if os.path.exists(WORK + '/voz.wav') and S.get('audio', 'voz') == 'voz' else ['-f', 'lavfi', '-t', '%.3f' % DUR, '-i', 'anullsrc=r=48000:cl=stereo']
    subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-y', '-framerate', str(FPS), '-start_number', '0', '-i', WORK + '/an/a_%04d.jpg'] + entrada +
                   ['-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-shortest', WORK + '/video_voz.mp4'], check=True)
    print('ok', WORK + '/video_voz.mp4')

def hoja(origen=None, destino=None, n=24):
    origen = origen or WORK + '/video_voz.mp4'; destino = destino or os.path.join(AQUI, 'hoja.jpg')
    tmp = WORK + '/_h'; os.makedirs(tmp, exist_ok=True)
    ts = S.get('hoja_t') or [round(DUR * (k + .5) / n, 2) for k in range(n)]
    for k, t in enumerate(ts):
        subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-y', '-ss', '%.2f' % t, '-i', origen, '-frames:v', '1', '-vf',
                        "scale=270:480,drawtext=fontfile=%s:text='%.2f':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6" % (FU['sf_bold'], t), '%s/%02d.jpg' % (tmp, k)], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', tmp + '/%02d.jpg', '-vf', 'tile=8x%d' % math.ceil(len(ts) / 8), '-frames:v', '1', destino], check=True)
    print('hoja', destino)

def eventos():
    """Momentos para real-sfx (tipos de references/typed-cues.md). Pocos y con función: gancho, entradas de elementos, transiciones, clic del CTA."""
    ev = [{'t': 0.0, 'type': 'whoosh'}, {'t': 0.05, 'type': 'hit'}]
    for e in S.get('elementos', []):
        if e['tipo'] == 'titulo': ev.append({'t': e['t0'], 'type': 'pop'})
        elif e['tipo'] == 'tarjeta': ev.append({'t': e['t0'], 'type': 'pop'})
        elif e['tipo'] == 'columnas':
            ev.append({'t': e['t0'], 'type': 'swoosh'}); ev += [{'t': it['t'], 'type': 'pop'} for it in e['items']]
            ev += [{'t': it['t_col'], 'type': 'tick'} for it in e['items'] if 't_col' in it]
        elif e['tipo'] == 'pildoras': ev += [{'t': it['t'], 'type': 'click'} for it in e['items']]
        elif e['tipo'] == 'texto': ev.append({'t': e['t0'], 'type': 'swoosh'})
        elif e['tipo'] == 'pill': ev.append({'t': e['t0'], 'type': 'pop'})
        elif e['tipo'] == 'color': ev.append({'t': e['t0'], 'type': 'swoosh'}); ev.append({'t': e['t0'] + 0.15, 'type': 'pop'})
        elif e['tipo'] == 'cta':
            ev.append({'t': e['t0'], 'type': 'swoosh'})
            if e.get('t_clic'): ev.append({'t': e['t_clic'], 'type': 'click'})
    ev += [{'t': max(0, tt - 0.12), 'type': 'whoosh'} for tt in S.get('transiciones', [])]
    ev += [{'t': a, 'type': 'hit'} for a, b, z in S.get('zooms', []) if z >= 1.15 and b - a < 1.5]   # solo golpes de zoom cortos, no reencuadres
    ev += S.get('eventos_extra', [])
    ev = sorted(ev, key=lambda x: x['t']); json.dump(ev, open(os.path.join(AQUI, 'eventos.json'), 'w'), indent=1); print(len(ev), 'eventos')

if __name__ == '__main__':
    paso = sys.argv[2]
    if paso == 'base': base()
    elif paso == 'anim':
        os.makedirs(WORK + '/an', exist_ok=True)
        fs = [int(x) for x in sys.argv[3].split(',')] if len(sys.argv) > 3 else list(range(N))
        with Pool(7) as p: p.map(cuadro, fs, chunksize=4)
        if len(sys.argv) <= 3: video()
    elif paso == 'frases':
        # Borrador de «frases» desde la transcripción (tiempos del bruto): corta en puntuación, pausas > 0,35 s o 6 palabras;
        # marca como clave la última palabra con contenido (≥ 5 letras) y pone ancla @ al empezar cada tramo. Se revisa a mano.
        d = json.load(open(os.path.join(AQUI, S['palabras']))); ws = d['palabras'] if isinstance(d, dict) else d; out = []; act = []; prev = None
        VACIAS = set('para pero porque cuando como donde sobre entre desde hasta tienes tiene puedes puede quieres quiere hacer estas estos esta este'.split())
        def cierra():
            if not act: return
            k = max((i for i, (w, t) in enumerate(act) if len(norm(w)) >= 5 and norm(w) not in VACIAS), default=None)
            txt = ' '.join(('*' + w + '*') if i == k else w for i, (w, t) in enumerate(act))
            if any(abs(act[0][1] - s0) < 0.3 for s0, e0 in TRAMOS): txt = '@%.2f|' % act[0][1] + txt
            out.append(txt); act.clear()
        for w in ws:
            t = w.get('inicio', w.get('start')); tx = w.get('texto', w.get('palabra', '')).strip()
            if not any(s0 - 0.05 <= t < e0 for s0, e0 in TRAMOS): continue
            if act and (t - prev > 0.35 or len(act) >= 6 or any(abs(t - s0) < 0.06 for s0, e0 in TRAMOS)): cierra()
            act.append((tx, t)); prev = w.get('fin', t)
            if tx[-1:] in '.?!,;:' and len(act) >= 2: cierra()
        cierra(); print(json.dumps(out, ensure_ascii=False, indent=1)); print('# tiempos del bruto: usar con "tiempos": "bruto" en el spec', file=sys.stderr)
    elif paso == 'colocar':
        # Pide a componer.py (Vision de Apple) dónde poner cada tarjeta/píldora con x o y = "auto": sin tapar la cara ni los subtítulos.
        sy = S.get('sub_y', 1430); res = {}
        for e in S.get('elementos', []):
            if 'auto' not in (e.get('x'), e.get('y')) or e['tipo'] not in ('tarjeta', 'pill'): continue
            t = (e['t0'] + min(e.get('t1', e['t0'] + 1.5), e['t0'] + 3)) / 2
            cw, ch = ((e.get('lado', 300),) * 2) if e['tipo'] == 'tarjeta' else (len(e.get('texto', '')) * 25 + 160, 110)
            fj = os.path.join(WORK, 'comp_%d.json' % e['_i'])
            subprocess.run(['python3', os.path.expanduser('~/Videos-Remotion/herramientas/composicion/componer.py'), WORK + '/base.mov', '--t', '%.2f' % t,
                            '--caja', '%dx%d' % (cw, ch), '--subs', '%.2f-%.2f' % ((sy - 90) / H, (sy + 200) / H), '--json', fj], check=True, capture_output=True)
            p0 = json.load(open(fj))[0]['propuestas'][0]; b = p0['caja']
            res[str(e['_i'])] = [round((b[0] + b[2]) / 2), round((b[1] + b[3]) / 2), p0['motivo']]
            print(e['tipo'], e.get('texto', e.get('emoji', '')), '->', res[str(e['_i'])])
        json.dump(res, open(os.path.join(AQUI, 'colocacion.json'), 'w'), ensure_ascii=False, indent=1)
    elif paso == 'subs':
        for t0, t1, filas in construir_subs(): print('%.2f-%.2f' % (t0, t1), ' '.join(('[%s %.2f]' % (w, s)) if c else w for w, s, c, col in filas))
    elif paso == 'hoja': hoja()
    elif paso == 'eventos': eventos()
