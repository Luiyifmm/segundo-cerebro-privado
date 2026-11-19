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
    if t == 99 or t >= 999: return t       # 99 = «hasta el final» (antes: >= 99, rompía brutos de más de 99 s)
    off = 0.0
    for s, e in TRAMOS:
        if t < s - 0.06: return round(off, 3)
        if t <= e + 0.06: return round(off + max(0.0, min(t, e) - s), 3)
        off += e - s
    return round(DUR, 3)
if S.get('tiempos') == 'bruto':          # el spec se escribe con los tiempos del bruto (lo que se ve en palabras.json y en las hojas)
    m_ = a_montaje
    for e in S.get('elementos', []):
        for k in ('t0', 't1', 't_clic', 't_marca', 't_zoom'):
            if isinstance(e.get(k), (int, float)): e[k] = m_(e[k])
        for it in e.get('items', []):
            for k in ('t', 't_col'):
                if k in it: it[k] = m_(it[k])
        if 'tiempos' in e: e['tiempos'] = [m_(x) for x in e['tiempos']]
        for it in e.get('etiquetas', []): it['t'] = m_(it['t'])
        for it in e.get('piezas', []):
            if 't' in it: it['t'] = m_(it['t'])
        if 't_sub' in e: e['t_sub'] = m_(e['t_sub'])
        for ln in e.get('texto_fondo', []):
            if 't' in ln: ln['t'] = m_(ln['t'])
        if 't_texto' in e: e['t_texto'] = m_(e['t_texto'])
        for it in e.get('orbita', []):
            if 't' in it: it['t'] = m_(it['t'])
        for it in e.get('gira', []):
            if 't' in it: it['t'] = m_(it['t'])
        if e.get('texto_grande'): e['texto_grande']['t'] = m_(e['texto_grande']['t'])
        if e.get('mover'): e['mover'][0] = m_(e['mover'][0])
        if e.get('t_llenar'): e['t_llenar'] = [m_(x) for x in e['t_llenar']]
        for it in e.get('por_dia', {}).values(): it['t'] = m_(it['t'])
        for k in ('t', 't2'):
            if isinstance(e.get('especial', {}).get(k), (int, float)): e['especial'][k] = m_(e['especial'][k])
    S['capas_sonido'] = [dict(x, t=m_(x['t'])) for x in S.get('capas_sonido', [])]
    S['musicas'] = [dict(x, t0=m_(x['t0'])) for x in S.get('musicas', [])]
    S['stopdowns'] = [m_(x) for x in S.get('stopdowns', [])]
    S['zooms'] = [[m_(zm[0]), m_(zm[1])] + list(zm[2:]) for zm in S.get('zooms', [])]
    S['transiciones'] = [m_(x) for x in S.get('transiciones', [])]
    S['sin_subs'] = [[m_(a), m_(b)] for a, b in S.get('sin_subs', [])]
    S['subs_arriba'] = [[m_(a), m_(b)] for a, b in S.get('subs_arriba', [])]
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
    'mano': os.path.expanduser('~/Library/Fonts/PermanentMarker-Regular.ttf'),
    'mano2': os.path.expanduser('~/Library/Fonts/ShadowsIntoLight-Regular.ttf'),
    'script': os.path.expanduser('~/Library/Fonts/Aston Script.ttf'),
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
    if k not in _fo and ruta.endswith('.cut.png'):     # v2: recorte con transparencia (croma de Flow): sin baldosa, con sombra suave
        im = Image.open(os.path.join(AQUI, ruta)).convert('RGBA'); im.thumbnail((int(lado * .92), int(lado * .92)), Image.LANCZOS)
        t = Image.new('RGBA', (lado, lado), (0, 0, 0, 0)); x0, y0 = (lado - im.size[0]) // 2, (lado - im.size[1]) // 2
        sh = Image.new('RGBA', (lado, lado), (0, 0, 0, 0)); sh.paste((0, 0, 0, 110), (x0, y0 + int(lado * .04)), im.split()[3])
        t = Image.alpha_composite(t, sh.filter(ImageFilter.GaussianBlur(lado * .04))); t.paste(im, (x0, y0), im); _fo[k] = t
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
            if tx.startswith('&'): col, tx = 'bueno|playfair', tx[1:]          # v3 (Miro texto especial): clave en serif elegante
            elif tx.startswith('$'): col, tx = 'bueno|script', tx[1:]          # clave en letra script
            elif tx.startswith('!'): col, tx = 'malo', tx[1:]
            elif tx.startswith('~'): col, tx = 'crema', tx[1:]
            elif tx.startswith('%'): col, tx = tx[1:].split('%', 1)
            for sub in tx.split():
                j = i; hit = None
                while j < min(len(ws), i + 6):
                    a_, b_ = norm(ws[j][0]), norm(sub)
                    if a_ and (a_ == b_ or (min(len(a_), len(b_)) >= 4 and (a_.startswith(b_) or b_.startswith(a_)))): hit = j; break
                    j += 1
                if hit is None: t = filas[-1][1] if filas else (tsync if tsync is not None else (ws[i][1] if i < len(ws) else DUR))   # v2: frase anclada sin palabras transcritas -> aparece en su ancla
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
        arriba = S.get('subs_arriba', []) + ([[e['t0'], e['t1']] for e in S.get('elementos', []) if e['tipo'] in ('broll', 'post_ig')] if S.get('subs_broll') else [])
        if any(a <= t < b for a, b in arriba) and filas[0][3] != 'pregunta':      # v3 (Luis): en b-roll, subtítulo pequeño y minimalista arriba
            vis = [(w.lstrip('^'), c_) for w, s_, c_, col in filas if t >= s_ - 0.02]
            if vis:
                tx = ' '.join(w for w, c_ in vis); d = ImageDraw.Draw(im); f, _ = ajusta(d, tx, 'sf_med', S.get('subs_arriba_tam', 40), 860); ya = S.get('subs_arriba_y', 330)
                sombra_texto(im, (540, ya), tx, f, fuerza=220, blur=10); ImageDraw.Draw(im).text((540, ya), tx, font=f, fill=(255, 255, 255), anchor='mm')
            return
        if any(a <= t < b for a, b in S.get('sin_subs', [])): return
        if any(t0 < b <= t and a < t1 for a, b in S.get('sin_subs', [])): return   # v3 (pacing): un subtítulo que empezó antes de un b-roll no reaparece al volver
        if filas[0][3] == 'pregunta':
            txt = ' '.join(w for w, s, c, col in filas)
            px, py = S.get('pregunta_xy', [540, y])             # v2: la pregunta puede ir sobre la cabeza de quien la hace
            d = ImageDraw.Draw(im); f, _ = ajusta(d, txt, 'sf_bold', 50, 860); tw = d.textlength(txt, font=f); q = eo((t - t0) / 0.15)
            px = min(max(px, tw / 2 + 60), W - tw / 2 - 60)
            bx = (px - tw / 2 - 40, py - 50 + 20 * (1 - q), px + tw / 2 + 40, py + 50 + 20 * (1 - q))
            def fn(c):
                sombra_caja(c, bx, 26, fuerza=120, blur=16, dy=8); ImageDraw.Draw(c).rounded_rectangle(bx, 26, fill=(255, 255, 255))
                ImageDraw.Draw(c).text((px, (bx[1] + bx[3]) / 2), txt, font=f, fill=NEGRO, anchor='mm')
                if S.get('pregunta_quien'): ImageDraw.Draw(c).text((bx[0] + 10, bx[1] - 26), S['pregunta_quien'], font=F('sf_bold', 28), fill=(255, 255, 255), anchor='lm')
            im.paste(capa(im, fn, q)); return
        k0 = next((k for k, x in enumerate(filas) if x[2]), len(filas))           # lo que va tras la clave se une a la clave
        col0 = filas[k0][3] if k0 < len(filas) else 'bueno'
        rel = ' '.join(w for w, s, c, col in filas[:k0] if t >= s - 0.02)
        cl = [(w, s, col0) for w, s, c, col in filas[k0:] if t >= s - 0.02 or c]
        d = ImageDraw.Draw(im)
        todo = [(w, s_) for w, s_, c, col in filas[:k0]]
        if rel and S.get('subs_palabra', True):            # v3 (referencias): cada palabra entra en su sitio con un pequeño deslizamiento y fundido
            linea = ' '.join(w for w, s_ in todo); f, _ = ajusta(d, linea, S.get('subs_fuente', 'sf_bold'), S.get('subs_tam', [52, 118])[0], S.get('subs_ancho', 940))
            x = 540 - d.textlength(linea, font=f) / 2; sp = d.textlength(' ', font=f)
            sh = Image.new('L', im.size, 0); ds = ImageDraw.Draw(sh); l = Image.new('RGBA', im.size, (0, 0, 0, 0)); dl = ImageDraw.Draw(l)
            for w, s_ in todo:
                p = eo((t - s_ + 0.02) / 0.14); ww = d.textlength(w, font=f)
                if p > 0:
                    yy_ = y + 12 * (1 - p); ds.text((x, yy_), w, font=f, fill=int(S.get('sombra', 190) * p), anchor='lm')
                    dl.text((x, yy_), w, font=f, fill=(255, 255, 255, int(255 * p)), anchor='lm')
                x += ww + sp
            im.paste(Image.new('RGB', im.size, (0, 0, 0)), (0, 0), sh.filter(ImageFilter.GaussianBlur(S.get('sombra_blur', 12)))); im.paste(l, (0, 0), l)
        elif rel:
            f, _ = ajusta(d, rel, 'sf_bold', S.get('subs_tam', [52, 118])[0], S.get('subs_ancho', 940)); sombra_texto(im, (540, y), rel, f); ImageDraw.Draw(im).text((540, y), rel, font=f, fill=COL['blanco'], anchor='mm')
        if cl and t >= cl[0][1] - 0.02:
            caja = cl[0][0].startswith('^'); cl = [(w.lstrip('^'), s_, c_) for w, s_, c_ in cl]
            txt = ' '.join(w for w, s_, col in cl); txt = txt.upper() if MAYUS else txt
            cn, fk = (cl[0][2].split('|') + [CLAVE_F])[:2]; col = COL[cn]; te = cl[0][1]
            if fk in ('playfair', 'script'): txt = ' '.join(w for w, s_, c_ in cl)          # serif/script: sin mayúsculas
            base_t = S.get('subs_tam', [52, 118])[1] if fk not in ('playfair', 'script') else int(S.get('subs_tam', [52, 118])[1] * (1.12 if fk == 'playfair' else 1.35))
            p = eo((t - te) / 0.16); tam = int(lerp(base_t * 1.12, base_t, p))
            f, tam = ajusta(d, txt, fk, tam, S.get('subs_ancho', 960))
            yy = y + (base_t * .78 if rel else 0) + 10 * (1 - p)
            if caja:                                            # v3: clave dentro de una caja del color de marca (referencia «So the TRUTH»)
                tw = d.textlength(txt, font=f); bx = (540 - tw / 2 - 18, yy - tam * .62, 540 + tw / 2 + 18, yy + tam * .62)
                ImageDraw.Draw(im).rounded_rectangle(bx, 10, fill=col); ImageDraw.Draw(im).text((540, yy), txt, font=f, fill=(255, 255, 255) if sum(col) < 560 else NEGRO, anchor='mm')
            else:                                               # v3 (Luis): más sombra y un brillo suave del color de la clave para que se lea mejor
                sombra_texto(im, (540, yy + 4), txt, f, fuerza=255, blur=S.get('sombra_blur', 12) + 6); sombra_texto(im, (540, yy), txt, f, fuerza=200, blur=5)
                gl = Image.new('L', im.size, 0); ImageDraw.Draw(gl).text((540, yy), txt, font=f, fill=S.get('glow', 120) + (90 if fk in ('playfair', 'script') else 0), anchor='mm')
                im.paste(Image.new('RGB', im.size, col), (0, 0), gl.filter(ImageFilter.GaussianBlur(16)))
                ImageDraw.Draw(im).text((540, yy), txt, font=f, fill=col, anchor='mm')
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
    if e.get('desenfoca'):
        ci, cf = contiguo(e)
        if ci and t >= e['t0'] - 0.01: q = 1.0
        if cf and t < e['t1'] + 0.01: s = 1.0
    if q <= 0 or s <= 0: return im
    (x, y), L = pos(e), e.get('lado', 300); sc = eo((t - e['t0']) / 0.4)   # v3: entrada suave, sin rebote
    def fn(c):
        Ls = int(L * (0.85 + 0.15 * sc)); bx = (x - Ls / 2, y - Ls / 2 + int(40 * (1 - s)), x + Ls / 2, y + Ls / 2 + int(40 * (1 - s)))
        if e.get('suelta'):           # v3: motion graphic centrado como las referencias (fondo limpio, círculos, texto a dos niveles, órbitas suaves)
            claro = e.get('claro', False); tl = t - e['t0']
            if e.get('desenfoca'): fondo_mg(c, e.get('grid', False), claro)
            est = deco_mg(c, t, e) if (claro and e.get('deco', True)) else None
            sin_circ = est == 'objetos'          # con objetos en las esquinas, sin círculo de color (Luis 18-11)
            if e.get('orbita'): orbita(c, e['orbita'], t, e['t0'], claro)
            p = eo(tl / 0.45); lado = int(L * .8 * lerp(0.82, 1.0, p)); bob = 7 * math.sin(tl * 1.8); cy = y + 30 * (1 - p) + bob
            gira = [it for it in e.get('gira', []) if t >= it.get('t', e['t0'])]
            def pos_g(k, it):
                g = it; a_ = g.get('fase', k * 2 * math.pi / max(1, len(gira))) + (t - it.get('t', e['t0'])) * g.get('vel', 0.9)
                return x + g.get('r', 330) * math.cos(a_), cy + g.get('r', 330) * g.get('elipse', 0.32) * math.sin(a_), math.sin(a_)
            def pinta_g(front):
                for k, it in enumerate(gira):
                    gx, gy, z = pos_g(k, it)
                    if (z >= 0) != front: continue
                    q_ = eo((t - it.get('t', e['t0'])) / 0.35); ld = max(8, int(it.get('lado', 130) * lerp(0.7, 1.08, (z + 1) / 2) * q_)); v = visual(it, ld)
                    if not front: v = v.filter(ImageFilter.GaussianBlur(2.5)); v.putalpha(v.split()[3].point(lambda a: int(a * .8)))
                    c.paste(v, (int(gx - ld / 2), int(gy - ld / 2)), v)
                    if it.get('texto') and front: texto_capa(c, (gx, gy + ld / 2 + 28), it['texto'], 'sf_bold', 34, NEGRO if claro else (255, 255, 255), q_, sombra=not claro)
            pinta_g(False)
            if e.get('circulo') and not sin_circ:
                R = int(lado * .62); l = Image.new('RGBA', c.size, (0, 0, 0, 0))
                ImageDraw.Draw(l).ellipse((x - R, cy - R + 18, x + R, cy + R + 18), fill=(0, 0, 0, 60)); c.paste(l.filter(ImageFilter.GaussianBlur(26)), (0, 0), l.filter(ImageFilter.GaussianBlur(26)))
                cc_ = colr(e['circulo']) if isinstance(e['circulo'], str) else COL['bueno']
                gl = Image.new('L', c.size, 0); ImageDraw.Draw(gl).ellipse((x - R * 1.25, cy - R * 1.25, x + R * 1.25, cy + R * 1.25), fill=150)   # glow del círculo
                c.paste(Image.new('RGB', c.size, cc_), (0, 0), gl.filter(ImageFilter.GaussianBlur(45)))
                ImageDraw.Draw(c).ellipse((x - R, cy - R, x + R, cy + R), fill=cc_); lado = int(lado * .72)
            em = visual(e, lado)
            if not e.get('circulo') or sin_circ:
                sh = Image.new('L', c.size, 0); sh.paste(em.split()[3], (int(x - lado / 2), int(cy - lado / 2 + 24))); c.paste(Image.new('RGB', c.size, (0, 0, 0)), (0, 0), sh.filter(ImageFilter.GaussianBlur(22)).point(lambda v: v * .45))
            c.paste(em, (int(x - lado / 2), int(cy - lado / 2)), em)
            pinta_g(True)
            R0 = int(L * .8 * .62) if (e.get('circulo') and not sin_circ) else lado / 2
            if e.get('texto_arriba'):
                q_ = eo((tl - 0.15) / 0.3); texto_capa(c, (x, cy - R0 - 70 + 14 * (1 - q_)), e['texto_arriba'], 'sf_bold', e.get('tam_arriba', 56), NEGRO if claro else (255, 255, 255), q_, sombra=not claro)
            if e.get('texto_abajo'):
                q_ = eo((tl - e.get('t_abajo', 0.35)) / 0.3); tx = e['texto_abajo'].upper() if MAYUS and e.get('mayus', True) else e['texto_abajo']
                texto_capa(c, (x, cy + R0 + 95 + 14 * (1 - q_)), tx, CLAVE_F, e.get('tam_abajo', 96), COL[e.get('col', 'bueno')], q_, sombra=not claro)
            if e.get('texto'):
                tx = e['texto']; q_ = eo((tl - 0.15) / 0.3)
                texto_capa(c, (x, cy + lado / 2 + 70 + 12 * (1 - q_)), tx, e.get('fuente', 'sf_bold'), e.get('tam', 64), NEGRO if claro else COL.get(e.get('col', 'blanco'), (255, 255, 255)), q_, sombra=not claro)
            if claro and e.get('deco', True): mg_post(c, t)
            return
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
    cab = e['cabeceras']; n = len(cab); G = 18; AN = e.get('ancho', 1000); Wc = (AN - G * (n - 1)) // n; x0 = (W - AN) // 2; y0 = e.get('y', 1060); Hc = e.get('alto', 800)
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
                p = eo((t - it['t']) / 0.35); lado = int(LF * (0.7 + 0.3 * p)); cx_, cy_ = 540, e.get('y_flota', 300); hw = max(170, LF // 2 + 40)
                bxf = (cx_ - hw, cy_ - LF * .8, cx_ + hw, cy_ + LF * .5 + 110); cristal(c, bxf, 48, claro=0.12, oscuro=0.25, borde=200, blur=26)
                em = visual(it, lado); c.paste(em, (int(cx_ - lado / 2), int(cy_ - LF * .65 + (LF - lado) / 2)), em)
                d = ImageDraw.Draw(c); f, _ = ajusta(d, it.get('largo', it['texto']), 'sf_bold', 40, 2 * hw - 30); d.text((cx_, cy_ + LF * .5 + 50), it.get('largo', it['texto']), font=f, fill=COL['blanco'], anchor='mm')
                continue
            p = (lambda u: u * u * (3 - 2 * u))(min(1, max(0, (t - it['t_col']) / (VUELO * 1.5)))); y0f = e.get('y_flota', 300) - 25
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
    if e.get('t0') is not None and t < e['t0']: return im
    if e.get('ui'):                       # v2: píldoras UI del mismo ancho, texto centrado; «mover» [t, y_nueva] las lleva a otra zona (p. ej. al degradado de un b-roll)
        if e.get('mover'): y = lerp(y, e['mover'][1], eo((t - e['mover'][0]) / 0.45))
        c = im.copy(); pildoras_ui(c, e['items'], t, int(y), e.get('tam', 42), cx=e.get('x', 540)); return mezcla(im, c, s)
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
        d = ImageDraw.Draw(c); d.ellipse((150, y + dy + 45, 250, y + dy + 145), fill=COL['bueno'])
        foto = e.get('foto') or M.get('foto')
        if foto:                                          # v2: foto de perfil de su Instagram en el círculo
            fi = Image.open(os.path.join(AQUI, foto)).convert('RGB'); m_ = min(fi.size); fi = fi.crop(((fi.size[0] - m_) // 2, (fi.size[1] - m_) // 2, (fi.size[0] + m_) // 2, (fi.size[1] + m_) // 2)).resize((94, 94), Image.LANCZOS)
            mk = Image.new('L', (94, 94), 0); ImageDraw.Draw(mk).ellipse((0, 0, 93, 93), fill=255); c.paste(fi, (153, y + dy + 48), mk)
        else: d.text((200, y + dy + 95), M.get('inicial', M['nombre'][0]), font=F('sf_bold', 52), fill=NEGRO, anchor='mm')
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
        dy = int(-50 * (1 - q)); bx = (60, y0 + dy, 1020, y0 + dy + (470 if e.get('img') else 430))
        cristal(c, bx, 44, claro=0.10, oscuro=0.40, borde=190, blur=28)
        d = ImageDraw.Draw(c); f = F(CLAVE_F, 70); hb = (bx[0] + 24, bx[1] + 22, bx[2] - 24, bx[1] + 122)
        d.rounded_rectangle(hb, 30, fill=col); d.text((540, (hb[1] + hb[3]) / 2), e['nombre'].upper(), font=f, fill=NEGRO if sum(col) > 380 else (255, 255, 255), anchor='mm')
        f2, _ = ajusta(d, e['texto'], 'sf_bold', 42, 900); d.text((540, bx[1] + 168), e['texto'], font=f2, fill=(255, 255, 255), anchor='mm')
        if e.get('img'):                                  # v2: foto real del grupo de alimentos (Flow, croma) en vez de la fila de emojis
            p = bo((t - e['t0'] - 0.12) / 0.3) if t >= e['t0'] + 0.12 else 0
            if p > 0:
                im_ = Image.open(os.path.join(AQUI, e['img'])).convert('RGBA'); im_.thumbnail((int(820 * (0.7 + 0.3 * p)), int(230 * (0.7 + 0.3 * p))), Image.LANCZOS)
                c.paste(im_, (int(540 - im_.size[0] / 2), int(bx[1] + 215 + (230 - im_.size[1]) / 2)), im_)
            return
        n = len(e['emojis']); L = 112; G = 16; x = 540 - (n * L + (n - 1) * G) / 2
        for k, ch in enumerate(e['emojis']):
            tk = e['t0'] + 0.15 + k * 0.09
            if t < tk: break
            p = bo((t - tk) / 0.25); lado = max(10, int(L * (0.6 + 0.4 * p))); em = emoji(ch, lado)
            c.paste(em, (int(x + k * (L + G) + (L - lado) / 2), int(bx[1] + 225 + (L - lado) / 2)), em)
    return capa(im, fn, min(q, s_))

# ---------------- v2 (17-11 noche, correcciones de Luis): b-roll animado tipo AE, mensaje, calendario ----------------

_GRID = None
_GRIDC = None
def fondo_mg(c, grid=True, claro=False):
    """Fondo de motion graphic (Miro: «en el centro con grid difuminado»): la persona desenfocada y oscurecida + cuadrícula fina.
    claro=True (pedido de Luis 18-11): fondo blanco limpio con cuadrícula gris suave, como un motion graphic de estudio."""
    global _GRID, _GRIDC
    if claro:
        c.paste(Image.new('RGB', c.size, (247, 247, 249)))
        if _GRIDC is None:
            g = Image.new('L', (W, H), 0); d = ImageDraw.Draw(g)
            for x in range(0, W, 90): d.line((x, 0, x, H), fill=255, width=2)
            for y in range(0, H, 90): d.line((0, y, W, y), fill=255, width=2)
            yy, xx = np.mgrid[0:H, 0:W]; r = np.sqrt(((xx - W / 2) / (W * .6)) ** 2 + ((yy - H * .45) / (H * .5)) ** 2)
            _GRIDC = Image.fromarray((np.asarray(g) * np.clip(1.1 - r, 0, 1)).astype(np.uint8), 'L')
        c.paste(Image.new('RGB', c.size, (222, 222, 228)), (0, 0), _GRIDC); return
    c.paste(Image.blend(c.filter(ImageFilter.GaussianBlur(20)), Image.new('RGB', c.size, (8, 8, 12)), 0.45))
    if grid:
        if _GRID is None:
            g = Image.new('L', (W, H), 0); d = ImageDraw.Draw(g)
            for x in range(0, W, 90): d.line((x, 0, x, H), fill=255, width=2)
            for y in range(0, H, 90): d.line((0, y, W, y), fill=255, width=2)
            yy, xx = np.mgrid[0:H, 0:W]; r = np.sqrt(((xx - W / 2) / (W * .55)) ** 2 + ((yy - H * .42) / (H * .45)) ** 2)
            _GRID = Image.fromarray((np.asarray(g) * np.clip(1 - r, 0, 1) * 0.16).astype(np.uint8), 'L').filter(ImageFilter.GaussianBlur(1.2))
        c.paste(Image.new('RGB', c.size, (255, 255, 255)), (0, 0), _GRID)
def orbita(c, items, t, t0, claro=False):
    """Elementos a los extremos que entran con rebote y flotan (motion graphic)."""
    for k, it in enumerate(items):
        tk = it.get('t', t0 + 0.15 + k * 0.12)
        if t < tk: continue
        p = eo((t - tk) / 0.45); lado = max(8, int(it.get('lado', 170) * (0.75 + 0.25 * p))); bob = 6 * math.sin((t - tk) * 1.6 + k)   # v3: más suave
        v = visual(it, lado); c.paste(v, (int(it['x'] - lado / 2), int(it['y'] - lado / 2 + bob)), v)
        if it.get('texto'):
            d = ImageDraw.Draw(c); f = F('sf_bold', it.get('tam', 34))
            if not claro: sombra_texto(c, (it['x'], it['y'] + lado / 2 + 30 + bob), it['texto'], f)
            ImageDraw.Draw(c).text((it['x'], it['y'] + lado / 2 + 30 + bob), it['texto'], font=f, fill=(40, 40, 46) if claro else (255, 255, 255), anchor='mm')

_ESQ = {}
def esquinas(c, t, items=None):
    """Objetos del tema en las esquinas (pesas, plato…) en blanco y negro, desenfocados y saliendo por el borde (pedido de Luis 18-11)."""
    items = items if items is not None else S.get('mg_esquinas', [])
    sitios = {'si': (-20, 230, -18), 'sd': (1100, 300, 16), 'ii': (-10, 1700, 14), 'id': (1090, 1650, -12)}   # v3: casi fuera de cuadro
    for k, it in enumerate(items[:2]):
        clave = (json.dumps(it, sort_keys=True))
        if clave not in _ESQ:
            v = visual(it, it.get('lado', 760)).convert('RGBA'); a = v.split()[3]; g = v.convert('L').convert('RGB'); g.putalpha(a)
            g = g.rotate(sitios[it.get('pos', 'si')][2], expand=True, resample=Image.BICUBIC).filter(ImageFilter.GaussianBlur(it.get('blur', 5)))
            g.putalpha(g.split()[3].point(lambda x: int(x * it.get('alfa', 0.55)))); _ESQ[clave] = g
        g = _ESQ[clave]; x, y, _ = sitios[it.get('pos', 'si')]; dx = 10 * math.sin(t * 0.5 + k); dy = 8 * math.cos(t * 0.4 + k)
        c.paste(g, (int(x - g.size[0] / 2 + dx), int(y - g.size[1] / 2 + dy)), g)

_TELA = None
def tela(c):
    """Textura de tela muy suave (trama fina) para el estilo «objetos»."""
    global _TELA
    if _TELA is None:
        yy, xx = np.mgrid[0:H, 0:W]; rng = np.random.default_rng(3)
        t_ = (np.sin(xx * 0.9) * np.sin(yy * 0.9) * 3 + np.sin((xx + yy) * 0.35) * 1.5 + rng.normal(0, 2.2, (H, W)))
        _TELA = np.clip(t_ + 128, 0, 255).astype(np.uint8)
    a = np.asarray(c, dtype=np.int16) + (_TELA.astype(np.int16)[..., None] - 128); c.paste(Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)))
def anillos(c, t):
    """Formas minimalistas (referencia «If you had 200 followers»): dos anillos enormes en gris casi blanco entrando por dos esquinas."""
    l = Image.new('L', (W, H), 0); d = ImageDraw.Draw(l)
    for (cx, cy, R, g), k in zip([(-60, 120, 560, 150), (1180, 1820, 640, 170)], range(2)):
        cx += 12 * math.sin(t * 0.3 + k); cy += 10 * math.cos(t * 0.25 + k)
        d.ellipse((cx - R, cy - R, cx + R, cy + R), fill=255); d.ellipse((cx - R + g, cy - R + g, cx + R - g, cy + R - g), fill=0)
    c.paste(Image.new('RGB', c.size, (236, 236, 239)), (0, 0), l.filter(ImageFilter.GaussianBlur(1.5)))
def deco_mg(c, t, e):
    """Decoración del fondo según S['mg_deco'] (o e['deco_estilo']): 'objetos' | 'formas' | 'circulos'."""
    est = e.get('deco_estilo', S.get('mg_deco', 'formas'))
    if est == 'objetos': tela(c); esquinas(c, t, e.get('esquinas'))
    elif est == 'formas': anillos(c, t)
    else: circulos(c, t, COL['bueno']); esquinas(c, t, e.get('esquinas'))
    return est

def pantalla_llena(x): return x['tipo'] in ('broll', 'post_ig', 'cartel') or (x.get('desenfoca') and x['tipo'] in ('tarjeta', 'calendario'))
def contiguo(e):
    """(llega_otra_al_entrar, sigue_otra_al_salir): entre dos pantallas completas seguidas, corte directo sin que asome la persona."""
    els = S.get('elementos', [])
    return (any(x is not e and pantalla_llena(x) and abs(x.get('t1', -9) - e['t0']) < 0.08 for x in els),
            any(x is not e and pantalla_llena(x) and abs(x['t0'] - e.get('t1', -9)) < 0.08 for x in els))

_BR = {}
def broll_capas(ruta, margen=1.14):
    """Capas del b-roll: fondo con hueco rellenado + sujeto recortado (preparar_broll.py), escaladas a cubrir 9:16 con margen."""
    if (ruta, margen) not in _BR:
        f = os.path.join(AQUI, ruta); b = os.path.splitext(f)[0]
        base_ = Image.open(f).convert('RGB')
        bg = Image.open(b + '.bg.png').convert('RGB') if os.path.exists(b + '.bg.png') else base_
        fg = Image.open(b + '.fg.png').convert('RGBA') if os.path.exists(b + '.fg.png') else None
        s = max(W / base_.size[0], H / base_.size[1]) * margen; tam = (int(base_.size[0] * s), int(base_.size[1] * s))
        _BR[(ruta, margen)] = (bg.resize(tam, Image.LANCZOS), fg.resize(tam, Image.LANCZOS) if fg else None)
    return _BR[(ruta, margen)]
def ventana(capa_, z, ox, oy, out=(W, H)):
    cw, ch = capa_.size; w, h = out[0] / z, out[1] / z; x0 = (cw - w) / 2 + ox; y0 = (ch - h) / 2 + oy
    x0 = min(max(0, x0), cw - w); y0 = min(max(0, y0), ch - h)
    return capa_.resize(out, Image.BICUBIC, box=(x0, y0, x0 + w, y0 + h))
_VIG = {}
def vineta(size, fuerza):
    k = (size, fuerza)
    if k not in _VIG:
        w, h = size; yy, xx = np.mgrid[0:h, 0:w]; r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
        _VIG[k] = Image.fromarray((np.clip((r - 0.55) / 0.85, 0, 1) ** 1.6 * fuerza).astype(np.uint8), 'L')
    return _VIG[k]
def grano(img, amp, semilla):
    rng = np.random.default_rng(semilla); n = rng.normal(0, amp, (img.size[1] // 2, img.size[0] // 2, 1)).repeat(3, 2)
    n = np.array(Image.fromarray(np.clip(n + 128, 0, 255).astype(np.uint8)).resize(img.size, Image.BILINEAR), dtype=np.int16) - 128
    return Image.fromarray(np.clip(np.asarray(img, dtype=np.int16) + n, 0, 255).astype(np.uint8))
def degradado_color(img, col, desde=0.52, fuerza=235):
    g = Image.new('L', (1, H), 0); y0 = int(H * desde)
    for y in range(y0, H): g.putpixel((0, y), int(fuerza * ((y - y0) / (H - y0)) ** 1.15))
    img.paste(Image.new('RGB', img.size, col), (0, 0), g.resize(img.size))
def pinta_broll(e, t, size=(W, H)):
    """Imagen animada como en After Effects: el fondo se acerca despacio y el sujeto (capa recortada) más rápido y en sentido contrario
    = parallax 2.5D; textura documental (grano, viñeta, algo de desaturado) y degradado del color de marca de abajo arriba."""
    bg, fg = broll_capas(e['img'], e.get('margen', 1.14)); d_ = max(0.5, e['t1'] - e['t0']); p = min(1, max(0, (t - e['t0']) / d_))
    sent = e.get('sentido', 1); mov = e.get('mov', 1.0)
    zb = lerp(1.0, 1.0 + 0.06 * mov, p); zf = lerp(1.0, 1.0 + 0.13 * mov, p)
    q = ent(t, e['t0'], 0.28); zb *= lerp(1.16, 1.0, q); zf *= lerp(1.16, 1.0, q)       # entrada: golpe de zoom
    im = ventana(bg, zb, sent * lerp(-22, 22, p) * mov, lerp(10, -10, p) * mov + e.get('sube', 0), size)
    for k, ln in enumerate(e.get('texto_fondo', [])):      # v3: letras detrás del sujeto, como parte del ambiente («sin hambre de / LOBO»)
        q_ = eo((t - ln.get('t', e['t0'])) / 0.4)
        if q_ > 0:
            tx_ = ln['texto'].upper() if ln.get('mayus', True) else ln['texto']; fu_ = {'marca': CLAVE_F}.get(ln.get('fuente', 'marca'), ln.get('fuente', 'marca')); xy_ = (size[0] / 2, ln['y'] + 20 * (1 - q_))
            if ln.get('glow'):
                gl = Image.new('L', im.size, 0); f_, _ = ajusta(ImageDraw.Draw(gl), tx_, fu_, ln.get('tam', 150), 1040); ImageDraw.Draw(gl).text(xy_, tx_, font=f_, fill=int(200 * q_), anchor='mm')
                im.paste(Image.new('RGB', im.size, colr(ln.get('col', 'blanco'))), (0, 0), gl.filter(ImageFilter.GaussianBlur(28)))
            texto_capa(im, xy_, tx_, fu_, ln.get('tam', 150), colr(ln.get('col', 'blanco')), q_ * ln.get('opacidad', 0.85), ancho=1040)
    if fg is not None and e.get('parallax', True):
        l = ventana(fg, zf, -sent * lerp(-30, 30, p) * mov, e.get('sube', 0), size); im.paste(l, (0, 0), l)
    if e.get('doc', True):
        im = Image.blend(im, im.convert('L').convert('RGB'), e.get('desat', 0.22))
        im.paste(Image.new('RGB', im.size, (0, 0, 0)), (0, 0), vineta(im.size, e.get('vineta', 150)))
    if e.get('tinte'): degradado_color(im, hx(e['tinte']), e.get('tinte_desde', 0.50), e.get('tinte_fuerza', 235))
    else: degradado(im, 0.60, 170)
    if e.get('doc', True): im = grano(im, e.get('grano', 9), int(t * FPS))
    bl = 12 * (1 - q)
    return im.filter(ImageFilter.GaussianBlur(bl)) if bl > 0.4 else im
def el_broll(im, e, t):
    if not (e['t0'] - 0.01 <= t < e['t1'] + 0.01): return im
    sigue = any(x is not e and x['tipo'] == 'broll' and abs(x['t0'] - e['t1']) < 0.08 for x in S.get('elementos', []))
    s = 1.0 if sigue else sal(t, e['t1'] - 0.18, 0.18)          # dos b-roll seguidos: corte directo, sin que asome la persona
    if e.get('modo') == 'ventana':                      # «pantalla tipo VR»: ventana de cristal flotando junto a la persona, fondo desenfocado
        vw, vh = e.get('tam', [760, 1010]); x, y = pos(e, 540, 640); q = ent(t, e['t0'], 0.3)
        c = im.filter(ImageFilter.GaussianBlur(16 * q)); c = Image.blend(c, Image.new('RGB', c.size, (0, 0, 0)), 0.25 * q)
        sc = lerp(0.82, 1.0, bo((t - e['t0']) / 0.35)); w_, h_ = int(vw * sc), int(vh * sc)
        v = pinta_broll(dict(e, doc=e.get('doc', False)), t, (w_, h_)); bob = 8 * math.sin((t - e['t0']) * 2.2)
        bx = (int(x - w_ / 2), int(y - h_ / 2 + bob), int(x - w_ / 2) + w_, int(y - h_ / 2 + bob) + h_)
        sombra_caja(c, bx, 44, fuerza=150, blur=30, dy=20); c.paste(v, bx[:2], rrmask(v.size, (0, 0, w_ - 1, h_ - 1), 44))
        o = Image.new('RGBA', c.size, (0, 0, 0, 0)); ImageDraw.Draw(o).rounded_rectangle(bx, 44, outline=(255, 255, 255, 200), width=3); c.paste(o, (0, 0), o)
        return mezcla(im, c, min(q, s))
    c = pinta_broll(e, t)
    tg = e.get('texto_grande')
    if tg and t >= tg['t']:
        p = eo((t - tg['t']) / 0.3); d = ImageDraw.Draw(c); tx = tg['texto'].upper() if MAYUS else tg['texto']
        f, tam = ajusta(d, tx, CLAVE_F, tg.get('tam', 120), 960); yy = tg.get('y', 1250) + int(40 * (1 - p))
        if tg.get('arriba'):
            fa, _ = ajusta(d, tg['arriba'], 'sf_bold', 46, 900); sombra_texto(c, (540, yy - tam * .85), tg['arriba'], fa)
            ImageDraw.Draw(c).text((540, yy - tam * .85), tg['arriba'], font=fa, fill=(255, 255, 255), anchor='mm')
        sombra_texto(c, (540, yy), tx, f); l = Image.new('RGBA', c.size, (0, 0, 0, 0))
        ImageDraw.Draw(l).text((540, yy), tx, font=f, fill=COL.get(tg.get('col', 'blanco'), (255, 255, 255)) + (int(255 * p),), anchor='mm'); c.paste(l, (0, 0), l)
    if e.get('etiquetas'):
        pildoras_ui(c, e['etiquetas'], t, e.get('y_etiquetas', 1430), e.get('tam_etiquetas', 42))
    return mezcla(im, c, s)

def pildoras_ui(c, items, t, y, tam=42, ancho=None, alto=100, paso=122, oscuro=0.18, cx=540):
    """Píldoras de cristal elegantes (UI de Apple) del MISMO ancho, texto centrado; entran una a una desde abajo."""
    d = ImageDraw.Draw(c); f = F('sf_bold', tam)
    ancho = ancho or max(d.textlength(it['texto'], font=f) for it in items) + (190 if any(it.get('emoji') or it.get('marca') for it in items) else 120)
    yy = y
    for it in items:
        if t < it['t']: yy += paso; continue
        p = eo((t - it['t']) / 0.25); dy = int(36 * (1 - p)); bx = (cx - ancho / 2, yy + dy, cx + ancho / 2, yy + dy + alto)
        cc = c.copy(); cristal(cc, bx, alto // 2, claro=0.16, oscuro=oscuro, borde=210, blur=26); dd = ImageDraw.Draw(cc)
        if it.get('emoji'): em = emoji(it['emoji'], int(alto * .56)); cc.paste(em, (int(bx[0] + 28), int(yy + dy + alto * .22)), em)
        elif it.get('marca'): (visto if it['marca'] == 'si' else prohibido)(dd, bx[0] + 52, yy + dy + alto / 2, 24, 7, COL['bueno'] if it['marca'] == 'si' else COL['malo'])
        dd.text((cx, yy + dy + alto / 2), it['texto'], font=f, fill=(255, 255, 255), anchor='mm')
        c.paste(mezcla(c, cc, p)); yy += paso

def el_mensaje(im, e, t):
    """Mensaje de chat que llega (clienta que escribe): cabecera con avatar y nombre, «escribiendo…» y luego la burbuja."""
    q = ent(t, e['t0'], 0.25); s = sal(t, e['t1'], 0.2)
    if q <= 0 or s <= 0: return im
    x, y = pos(e, 540, 330); escr = e.get('escribiendo', 0.7)
    def fn(c):
        dy = int(-50 * (1 - q)); w_ = e.get('ancho', 900); d = ImageDraw.Draw(c); f = F('sf_med', e.get('tam', 44))
        lineas = []; ln = ''
        for pal in e['texto'].split():
            if d.textlength((ln + ' ' + pal).strip(), font=f) > w_ - 150: lineas.append(ln); ln = pal
            else: ln = (ln + ' ' + pal).strip()
        lineas.append(ln); hb = 40 + len(lineas) * int(e.get('tam', 44) * 1.3) + 30
        bx = (x - w_ / 2, y + dy, x + w_ / 2, y + dy + 110 + hb + 30)
        cristal(c, bx, 46, claro=0.12, oscuro=0.42, borde=190, blur=28); d = ImageDraw.Draw(c)
        d.ellipse((bx[0] + 30, bx[1] + 25, bx[0] + 100, bx[1] + 95), fill=COL['bueno']); em = emoji(e.get('emoji', '👩'), 46); c.paste(em, (int(bx[0] + 42), int(bx[1] + 37)), em)
        d.text((bx[0] + 122, bx[1] + 47), e.get('de', 'Clienta'), font=F('sf_bold', 38), fill=(255, 255, 255), anchor='lm')
        d.text((bx[0] + 122, bx[1] + 82), e.get('sub', 'ahora'), font=F('sf_med', 26), fill=(200, 200, 205), anchor='lm')
        bb = (bx[0] + 30, bx[1] + 115, bx[2] - 30, bx[1] + 115 + hb)
        if t < e['t0'] + escr:                            # escribiendo…
            bb2 = (bb[0], bb[1], bb[0] + 170, bb[1] + 80); d.rounded_rectangle(bb2, 40, fill=(235, 235, 240))
            for k in range(3):
                a = 0.5 + 0.5 * math.sin((t - e['t0']) * 10 - k * 0.9); r = 10 + 3 * a
                d.ellipse((bb2[0] + 45 + k * 40 - r, bb2[1] + 40 - r, bb2[0] + 45 + k * 40 + r, bb2[1] + 40 + r), fill=(120, 120, 128))
        else:
            d.rounded_rectangle(bb, 36, fill=(240, 240, 244)); yy = bb[1] + 35 + e.get('tam', 44) * .6
            for ln in lineas: d.text((bb[0] + 34, yy), ln, font=f, fill=NEGRO, anchor='lm'); yy += int(e.get('tam', 44) * 1.3)
    return capa(im, fn, min(q, s))

def el_calendario(im, e, t):
    """Calendario de cristal (días como cuadrados, lo pidió Luis): en cada día va cayendo el mismo plato; un día especial
    (p. ej. el 10) recibe otra cosa (pizza) y un emoji que se ríe."""
    q = ent(t, e['t0'], 0.3); s = sal(t, e['t1'], 0.25)
    if e.get('desenfoca'):
        ci, cf = contiguo(e)
        if ci and t >= e['t0'] - 0.01: q = 1.0
        if cf and t < e['t1'] + 0.01: s = 1.0
    if q <= 0 or s <= 0: return im
    n = e.get('dias', 21); cols = 7; filas = math.ceil(n / cols); G = 12; AN = e.get('ancho', 1000); L = (AN - G * (cols - 1)) // cols; x0 = (W - AN) // 2; y0 = e.get('y', 300); claro = e.get('claro', False)
    t_a, t_b = e.get('t_llenar', [e['t0'] + 0.3, e['t0'] + 2.5]); esp = e.get('especial', {})
    def fn(c):
        if e.get('desenfoca'): fondo_mg(c, e.get('grid', True), claro)
        if claro and e.get('deco', True): deco_mg(c, t, e)
        if e.get('orbita'): orbita(c, e['orbita'], t, e['t0'], claro)
        dy = int(-60 * (1 - q)); d = ImageDraw.Draw(c)
        if e.get('titulo'): pill(c, 540, y0 + dy - 70, e['titulo'], NEGRO, COL['blanco'], 'sf_bold', 38)
        for k in range(n):
            i, j = k % cols, k // cols; bx = (x0 + i * (L + G), y0 + dy + j * (L + G), x0 + i * (L + G) + L, y0 + dy + j * (L + G) + L)
            dia = k + 1; es = esp and dia == esp.get('dia')
            if claro:
                sombra_caja(c, bx, 22, fuerza=40, blur=12, dy=6); d = ImageDraw.Draw(c)
                d.rounded_rectangle(bx, 22, fill=(255, 255, 255), outline=COL['bueno'] if es and t >= esp.get('t', 99) else (228, 228, 234), width=3 if es else 2)
                d.text((bx[0] + 14, bx[1] + 18), str(dia), font=F('sf_bold', 22), fill=(150, 150, 158), anchor='lm')
            else:
                cristal(c, bx, 22, claro=0.10, oscuro=0.30, borde=170 if not es else 255, blur=22, sombra=False); d = ImageDraw.Draw(c)
                d.text((bx[0] + 14, bx[1] + 18), str(dia), font=F('sf_bold', 24), fill=(235, 235, 235), anchor='lm')
            pd = e.get('por_dia', {}).get(str(dia))                 # v2: contenido propio de un día (viernes pizza, sábado cañas…)
            tk = esp['t'] if es else (pd['t'] if pd else lerp(t_a, t_b, k / max(1, n - 1)))
            if t >= tk:
                p = bo((t - tk) / 0.25); lado = max(8, int(L * .62 * p)); it = esp if es else (pd or e)
                v = visual(it, lado) if it.get('img') or it.get('emoji') else None
                if v: c.paste(v, (int((bx[0] + bx[2]) / 2 - lado / 2), int((bx[1] + bx[3]) / 2 - lado / 2 + 10)), v)
            if es and esp.get('emoji2') and t >= esp.get('t2', esp['t'] + 0.5):
                p = bo((t - esp.get('t2', esp['t'] + 0.5)) / 0.3); lado = int(L * .55 * p) + 1; v = emoji(esp['emoji2'], lado)
                c.paste(v, (int(bx[2] - lado * .6), int(bx[1] - lado * .4)), v)
        if claro and e.get('deco', True): mg_post(c, t)
    return capa(im, fn, min(q, s))


def el_post_ig(im, e, t):
    """La imagen a pantalla completa se aleja y queda dentro de una publicación de Instagram (cabecera, me gusta, comentarios)."""
    if not (e['t0'] - 0.01 <= t < e['t1'] + 0.01): return im
    tz = e.get('t_zoom', e['t0'] + 1.0); p = eo((t - tz) / 0.9) if t >= tz else 0.0; sc = lerp(1.0, e.get('escala', 0.66), p)
    full = pinta_broll(dict(e, texto_grande=None, etiquetas=None, tinte=None), t)
    if p <= 0: return mezcla(im, full, sal(t, e['t1'] - 0.18, 0.18))
    c = Image.blend(full.filter(ImageFilter.GaussianBlur(28)), Image.new('RGB', (W, H), (10, 10, 14)), 0.55 * p)
    w_, h_ = int(W * sc), int(H * sc * lerp(1.0, 0.80, p)); fx = full.resize((w_, int(H * sc)), Image.LANCZOS).crop((0, int((H * sc - h_) / 2), w_, int((H * sc - h_) / 2) + h_))
    hd, ft = int(96 * p), int(150 * p); x0 = (W - w_) // 2; y0 = (H - h_ - hd - ft) // 2 - 40
    caja = (x0, y0, x0 + w_, y0 + hd + h_ + ft); sombra_caja(c, caja, 28, fuerza=int(170 * p), blur=34, dy=20)
    ImageDraw.Draw(c).rounded_rectangle(caja, int(28 * p), fill=(255, 255, 255)); c.paste(fx, (x0, y0 + hd))
    if p > 0.35:
        d = ImageDraw.Draw(c); a = int(255 * min(1, (p - 0.35) / 0.4))
        l = Image.new('RGBA', c.size, (0, 0, 0, 0)); dl = ImageDraw.Draw(l)
        dl.ellipse((x0 + 22, y0 + 20, x0 + 78, y0 + 76), fill=COL['bueno'] + (a,)); dl.text((x0 + 50, y0 + 48), e.get('inicial', '⚖'), font=F('sf_bold', 30), fill=(255, 255, 255, a), anchor='mm')
        dl.text((x0 + 96, y0 + 48), e.get('usuario', '@despacho'), font=F('sf_bold', 32), fill=(20, 20, 20, a), anchor='lm')
        yb = y0 + hd + h_ + 46
        for k, ch in enumerate(['🤍', '💬', '📩']):
            em = emoji(ch, 44); em.putalpha(em.split()[3].point(lambda v: v * a // 255)); l.paste(em, (x0 + 30 + k * 70, yb - 24), em)
        dl.text((x0 + 30, yb + 62), e.get('likes', '1.248 Me gusta'), font=F('sf_bold', 30), fill=(20, 20, 20, a), anchor='lm')
        c.paste(l, (0, 0), l)
    sigue = any(x is not e and x['tipo'] in ('broll', 'post_ig') and abs(x['t0'] - e['t1']) < 0.08 for x in S.get('elementos', []))
    return c if sigue else mezcla(im, c, sal(t, e['t1'] - 0.18, 0.18))

# ---------------- v3 (18-11, segunda auditoría de Luis) ----------------
def mg_post(c, t, deco=True):
    """Acabado de motion graphic de referencia: círculos de color de marca difuminados que salen por los bordes,
    bordes desenfocados, textura (grano) y viñeta suave."""
    if not deco: return
    m = Image.new('L', c.size, 0); d = ImageDraw.Draw(m)
    yy, xx = np.mgrid[0:H:8, 0:W:8]; r = np.sqrt(((xx - W / 2) / (W * .55)) ** 2 + ((yy - H / 2) / (H * .52)) ** 2)
    borde = Image.fromarray((np.clip((r - 0.62) / 0.5, 0, 1) * 255).astype(np.uint8), 'L').resize(c.size, Image.BILINEAR)
    c.paste(c.filter(ImageFilter.GaussianBlur(10)), (0, 0), borde)                       # bordes desenfocados
    c.paste(Image.new('RGB', c.size, (40, 36, 48)), (0, 0), borde.point(lambda v: v * 60 // 255))   # viñeta (más marcada, pedido 18-11)
    c.paste(grano(c, 6, int(t * FPS)))
def circulos(c, t, col, claro=True):
    """Tres círculos grandes y difuminados del color de marca que derivan despacio (decoración de borde)."""
    l = Image.new('RGBA', (W // 4, H // 4), (0, 0, 0, 0)); d = ImageDraw.Draw(l)
    for k, (cx, cy, R, a) in enumerate([(0.02, 0.10, 0.26, 70), (1.0, 0.55, 0.22, 60), (0.10, 0.93, 0.30, 55)]):
        x = (cx + 0.02 * math.sin(t * 0.5 + k)) * W / 4; y = (cy + 0.015 * math.cos(t * 0.4 + k)) * H / 4; rr = R * W / 4
        d.ellipse((x - rr, y - rr, x + rr, y + rr), fill=col + (a if claro else a // 2,))
    l = l.filter(ImageFilter.GaussianBlur(10)).resize((W, H), Image.BILINEAR); c.paste(l, (0, 0), l)
def texto_capa(c, xy, txt, fuente, tam, col, alpha=1.0, anchor='mm', sombra=False, ancho=980):
    d = ImageDraw.Draw(c); f, tam = ajusta(d, txt, fuente, tam, ancho)
    if sombra: sombra_texto(c, xy, txt, f, anchor=anchor)
    l = Image.new('RGBA', c.size, (0, 0, 0, 0)); ImageDraw.Draw(l).text(xy, txt, font=f, fill=tuple(col) + (int(255 * alpha),), anchor=anchor); c.paste(l, (0, 0), l)
    return tam
def colr(x): return COL[x] if isinstance(x, str) and x in COL else (hx(x) if isinstance(x, str) else tuple(x))

def el_rotulo(im, e, t):
    """Rótulo compuesto (referencias: «and be / LIKE», «I'm gonna / systemize»): piezas de texto con su posición, alineación,
    letra (sf_med, sf_bold, la de marca, playfair cursiva, mano), color y caja; cada una entra a su tiempo deslizando y fundiendo."""
    if not (e['t0'] - 0.01 <= t < e['t1'] + 0.2): return im
    s_ = sal(t, e['t1'], 0.2); c = im.copy(); d = ImageDraw.Draw(c)
    for pz in e['piezas']:
        tk = pz.get('t', e['t0'])
        if t < tk: continue
        p = eo((t - tk) / 0.22) * s_; fu = {'marca': CLAVE_F}.get(pz.get('fuente', 'sf_bold'), pz.get('fuente', 'sf_bold'))
        txt = pz['texto'].upper() if pz.get('mayus') else pz['texto']; f, tam = ajusta(d, txt, fu, pz.get('tam', 60), pz.get('ancho', 900))
        al = pz.get('align', 'centro'); anchor = {'izq': 'lm', 'der': 'rm', 'centro': 'mm'}[al]; x, y = pz['x'], pz['y'] + 18 * (1 - p)
        col = colr(pz.get('col', 'blanco'))
        if pz.get('caja'):
            tw = d.textlength(txt, font=f); x0 = x - (tw / 2 if al == 'centro' else (tw if al == 'der' else 0))
            bx = (x0 - 16, y - tam * .62, x0 + tw + 16, y + tam * .62); l = Image.new('RGBA', c.size, (0, 0, 0, 0))
            ImageDraw.Draw(l).rounded_rectangle(bx, 10, fill=colr(pz['caja']) + (int(255 * p),)); c.paste(l, (0, 0), l)
        elif pz.get('sombra', True):
            sh = Image.new('L', c.size, 0); ImageDraw.Draw(sh).text((x, y), txt, font=f, fill=int(S.get('sombra', 190) * p), anchor=anchor)
            c.paste(Image.new('RGB', c.size, (0, 0, 0)), (0, 0), sh.filter(ImageFilter.GaussianBlur(S.get('sombra_blur', 12))))
        l = Image.new('RGBA', c.size, (0, 0, 0, 0)); ImageDraw.Draw(l).text((x, y), txt, font=f, fill=col + (int(255 * p),), anchor=anchor); c.paste(l, (0, 0), l)
    return c

def el_dm(im, e, t):
    """Mensajes directos de Instagram: solo burbujas (sin tarjeta), «escribiendo…» antes de cada mensaje que llega,
    cada burbuja sube y empuja a las anteriores."""
    if not (e['t0'] - 0.01 <= t < e['t1'] + 0.2): return im
    s_ = sal(t, e['t1'], 0.2); c = im.copy(); y_base = e.get('y', 1300); tam = e.get('tam', 42); f = F('sf_med', tam); d = ImageDraw.Draw(c)
    visibles = []
    for it in e['items']:
        te = it['t'] - (e.get('escribiendo', 0.6) if it.get('de', 'ella') != 'yo' else 0)
        if t < te: continue
        escribiendo = t < it['t'] and it.get('de', 'ella') != 'yo'
        lineas = []; ln = ''
        for pal in it.get('texto', '').split():
            if d.textlength((ln + ' ' + pal).strip(), font=f) > e.get('ancho', 640): lineas.append(ln); ln = pal
            else: ln = (ln + ' ' + pal).strip()
        lineas.append(ln); h = 40 + len(lineas) * int(tam * 1.25) if not escribiendo else 90
        visibles.append((it, escribiendo, lineas, h, eo((t - te) / 0.25)))
    y = y_base
    for it, esc, lineas, h, p in reversed(visibles):
        yo = it.get('de', 'ella') == 'yo'
        w_ = 150 if esc else max(d.textlength(l, font=f) for l in lineas) + 60
        x0 = (1000 - w_) if yo else 150; bx = (x0, y - h + 20 * (1 - p), x0 + w_, y + 20 * (1 - p))
        a = int(255 * p * s_); l = Image.new('RGBA', c.size, (0, 0, 0, 0)); dl = ImageDraw.Draw(l)
        sh = Image.new('L', c.size, 0); ImageDraw.Draw(sh).rounded_rectangle(bx, 38, fill=int(90 * p * s_)); c.paste(Image.new('RGB', c.size, (0, 0, 0)), (0, 12), sh.filter(ImageFilter.GaussianBlur(16)))
        if yo: dl.rounded_rectangle(bx, 38, fill=(124, 58, 237, a))
        else: dl.rounded_rectangle(bx, 38, fill=(239, 239, 242, a))
        if not yo:
            dl.ellipse((70, bx[3] - 64, 130, bx[3] - 4), fill=COL['bueno'] + (a,))
            em = emoji(e.get('emoji', '🙋‍♀️'), 40); em.putalpha(em.split()[3].point(lambda v: v * a // 255)); l.paste(em, (80, int(bx[3] - 54)), em)
        if esc:
            for k in range(3):
                q_ = 0.5 + 0.5 * math.sin(t * 10 - k * 0.9); r = 9 + 3 * q_; cx = bx[0] + 42 + k * 34; cy = (bx[1] + bx[3]) / 2
                dl.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(140, 140, 148, a))
        else:
            yy = bx[1] + 20 + tam * .62
            for ln in lineas: dl.text((bx[0] + 30, yy), ln, font=f, fill=((255, 255, 255) if yo else (20, 20, 24)) + (a,), anchor='lm'); yy += int(tam * 1.25)
        c.paste(l, (0, 0), l); y = bx[1] - 22
    return c

def el_foco(im, e, t):
    """Cuadrado sobre un objeto (el móvil): fuera del cuadrado la imagen pasa a blanco y negro; el borde se dibuja solo."""
    q = ent(t, e['t0'], 0.3); s_ = sal(t, e['t1'], 0.2)
    if q <= 0 or s_ <= 0: return im
    x0, y0, x1, y1 = e['caja']; g = im.convert('L').convert('RGB'); m = Image.new('L', im.size, int(255 * min(q, s_)))
    ImageDraw.Draw(m).rounded_rectangle((x0, y0, x1, y1), 26, fill=0); c = im.copy(); c.paste(g, (0, 0), m)
    per = 2 * ((x1 - x0) + (y1 - y0)); L = per * eo((t - e['t0']) / 0.5); d = ImageDraw.Draw(c); col = colr(e.get('col', 'blanco')); w = 7
    tramos = [((x0, y0), (x1, y0)), ((x1, y0), (x1, y1)), ((x1, y1), (x0, y1)), ((x0, y1), (x0, y0))]
    for (ax, ay), (bx_, by) in tramos:
        lg = abs(bx_ - ax) + abs(by - ay)
        if L <= 0: break
        k = min(1, L / lg); d.line((ax, ay, ax + (bx_ - ax) * k, ay + (by - ay) * k), fill=col, width=w); L -= lg
    return mezcla(im, c, s_) if s_ < 1 else c

def el_cartel(im, e, t):
    """Cartel a pantalla completa: fondo de color con textura de papel, texto grande y un subrayado de rotulador que se dibuja."""
    if not (e['t0'] - 0.01 <= t < e['t1'] + 0.01): return im
    fondo = colr(e.get('fondo', 'bueno')); c = Image.new('RGB', (W, H), fondo); p = eo((t - e['t0']) / 0.3)
    n = np.random.default_rng(7).normal(0, 9, (H // 3, W // 3, 1)).repeat(3, 2)
    c = Image.fromarray(np.clip(np.asarray(c, dtype=np.int16) + np.asarray(Image.fromarray(np.clip(n + 128, 0, 255).astype(np.uint8)).resize((W, H)), dtype=np.int16) - 128, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(c); fu = {'marca': CLAVE_F}.get(e.get('fuente', 'marca'), e.get('fuente', 'marca')); txt = e['texto'].upper() if e.get('mayus', True) else e['texto']
    f, tam = ajusta(d, txt, fu, int(e.get('tam', 170) * lerp(1.08, 1.0, p)), 940); y = e.get('y', 900)
    if e.get('arriba'): d.text((540, y - tam * .95), e['arriba'], font=F('sf_bold', e.get('tam_arriba', 54)), fill=colr(e.get('col_arriba', e.get('col', 'blanco'))), anchor='mm')
    tw = d.textlength(txt, font=f)
    if e.get('subrayado'):
        q = eo((t - e.get('t_sub', e['t0'] + 0.35)) / 0.35)
        if q > 0:
            x0 = 540 - tw / 2 - 10; pts = [(x0 + (tw + 20) * k / 20 * q, y + tam * .55 + 6 * math.sin(k * 0.9)) for k in range(21)]
            d.line(pts, fill=colr(e['subrayado']), width=int(tam * .16), joint='curve')
    d.text((540, y), txt, font=f, fill=colr(e.get('col', 'blanco')), anchor='mm')
    c.paste(grano(c, 5, int(t * FPS)))
    return mezcla(im, c, min(1, (t - e['t0'] + 0.01) / 0.08))

def el_flecha(im, e, t):
    """Flecha dibujada a mano que sale de un punto (la zona roja de la espalda) y acaba en un texto con letra manuscrita."""
    if not (e['t0'] - 0.01 <= t < e['t1'] + 0.2): return im
    s_ = sal(t, e['t1'], 0.2); c = im.copy(); d = ImageDraw.Draw(c); (ax, ay), (bx_, by) = e['desde'], e['hasta']; k = e.get('curva', 0.25)
    mx, my = (ax + bx_) / 2 + (by - ay) * k, (ay + by) / 2 - (bx_ - ax) * k; p = eo((t - e['t0']) / 0.45)
    pts = [((1 - u) ** 2 * ax + 2 * (1 - u) * u * mx + u * u * bx_, (1 - u) ** 2 * ay + 2 * (1 - u) * u * my + u * u * by) for u in [p * i / 30 for i in range(31)]]
    sh = Image.new('L', c.size, 0); ImageDraw.Draw(sh).line(pts, fill=160, width=12, joint='curve'); c.paste(Image.new('RGB', c.size, (0, 0, 0)), (0, 0), sh.filter(ImageFilter.GaussianBlur(6)))
    d.line(pts, fill=(255, 255, 255), width=9, joint='curve')
    if p > 0.95:
        (x1, y1), (x2, y2) = pts[-2], pts[-1]; ang = math.atan2(y2 - y1, x2 - x1)
        for da in (2.6, -2.6): d.line((x2, y2, x2 + 46 * math.cos(ang + da), y2 + 46 * math.sin(ang + da)), fill=(255, 255, 255), width=9)
    tt = e.get('t_texto', e['t0'] + 0.4)
    if t >= tt:
        q = eo((t - tt) / 0.25); f = F(e.get('fuente', 'mano'), e.get('tam', 96)); x = e.get('x_texto', bx_); y = e.get('y_texto', by - 90)
        partes = re.findall(r'\*[^*]+\*|[^*]+', e['texto']); tot = sum(d.textlength(pt.strip('*'), font=f) for pt in partes); xx = x - tot / 2
        for pt in partes:
            col = COL['malo'] if pt.startswith('*') else (255, 255, 255); tx = pt.strip('*')
            sh = Image.new('L', c.size, 0); ImageDraw.Draw(sh).text((xx, y + 14 * (1 - q)), tx, font=f, fill=int(200 * q), anchor='lm'); c.paste(Image.new('RGB', c.size, (0, 0, 0)), (0, 0), sh.filter(ImageFilter.GaussianBlur(8)))
            l = Image.new('RGBA', c.size, (0, 0, 0, 0)); ImageDraw.Draw(l).text((xx, y + 14 * (1 - q)), tx, font=f, fill=col + (int(255 * q),), anchor='lm'); c.paste(l, (0, 0), l)
            xx += d.textlength(tx, font=f)
    return mezcla(im, c, s_) if s_ < 1 else c

TIPOS = {'rotulo': el_rotulo, 'dm': el_dm, 'foco': el_foco, 'cartel': el_cartel, 'flecha': el_flecha, 'post_ig': el_post_ig, 'broll': el_broll, 'mensaje': el_mensaje, 'calendario': el_calendario, 'color': el_color,'pill': el_pill, 'titulo': el_titulo, 'tarjeta': el_tarjeta, 'columnas': el_columnas, 'pildoras': el_pildoras, 'texto': el_texto, 'cta': el_cta}

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
    for zm in S.get('zooms', []):
        a, b, zz = zm[:3]
        if a <= t < b:
            if len(zm) >= 5:                          # v3: «falso zoom» (Luis): reencuadre con su propio centro y entrada con desenfoque
                z = zz; cx, cy = zm[3], zm[4]; blur = max(blur, 16 * (1 - eo((t - a) / 0.16)))
            else: z = max(z, lerp(1.0, zz, eo((t - a) / 0.08)))
    for tt in S.get('transiciones', []):
        dt = t - tt
        if -0.12 <= dt < 0.12:
            p = 1 - abs(dt) / 0.12; z = max(z, 1 + 0.22 * p); blur = max(blur, 16 * p)
    if z > 1.001 or blur > 0.3: im = zoom(im, z, cx, cy, blur)
    if S.get('degradado', True): degradado(im, S.get('degradado_desde', 0.60), S.get('degradado_fuerza', 170))
    if S.get('degradado_arriba'): degradado_arriba(im)
    detras = [e for e in S.get('elementos', []) if e.get('detras')]
    for e in detras: im = TIPOS[e['tipo']](im, e, t)
    sj = '%s/sujeto/s_%04d.png' % (WORK, f)
    if detras and os.path.exists(sj):            # v2: la persona recortada (Vision) vuelve a ir delante de lo marcado «detras»
        p_ = Image.open(sj).convert('RGBA')
        if p_.size != (W, H): p_ = p_.resize((W, H))
        if z > 1.001 or blur > 0.3: p_ = zoom(p_, z, cx, cy, blur)
        b_ = Image.open('%s/fr/b_%04d.jpg' % (WORK, f)).convert('RGB')
        if z > 1.001 or blur > 0.3: b_ = zoom(b_, z, cx, cy, blur)
        if S.get('degradado', True): degradado(b_, S.get('degradado_desde', 0.60), S.get('degradado_fuerza', 170))
        im.paste(b_, (0, 0), p_.split()[3])
    for e in S.get('elementos', []):
        if not e.get('detras'): im = TIPOS[e['tipo']](im, e, t)
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
                        'volume=%sdB,highpass=f=80,afftdn=nf=-45,equalizer=f=250:t=q:w=1.2:g=-2,treble=g=3:f=5500,acompressor=threshold=0.06:ratio=3:attack=5:release=120,loudnorm=I=-16:TP=-2' % g, '-ar', '48000', '-ac', '2', WORK + '/voz.wav'], check=True)
    print('base ok', N, 'fotogramas', round(DUR, 2), 's')

def video():
    entrada = ['-i', WORK + '/voz.wav'] if os.path.exists(WORK + '/voz.wav') and S.get('audio', 'voz') == 'voz' else ['-f', 'lavfi', '-t', '%.3f' % DUR, '-i', 'anullsrc=r=48000:cl=stereo']
    subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-y', '-framerate', str(FPS), '-start_number', '0', '-i', WORK + '/an/a_%04d.jpg'] + entrada +
                   ['-c:v', 'libx264', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-shortest', WORK + '/video_voz.mp4'], check=True)
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
    ev = [{'t': 0.0, 'type': 'whoosh'}, {'t': 0.05, 'type': 'hit'}] if S.get('gancho', {}).get('sonido', True) else []   # v2: no todos los ganchos llevan whoosh+golpe
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
        elif e['tipo'] == 'broll':
            ev.append({'t': max(0, e['t0'] - 0.15), 'type': 'whoosh', 'len': 0.5})
            if e.get('golpe', True): ev.append({'t': e['t0'], 'type': 'hit', 'g': 0.6})
            ev += [{'t': it['t'], 'type': 'click'} for it in e.get('etiquetas', [])]
            if e.get('texto_grande'): ev.append({'t': e['texto_grande']['t'], 'type': 'pop'})
        elif e['tipo'] == 'dm': ev += [{'t': it['t'], 'type': 'pop'} for it in e['items']]
        elif e['tipo'] == 'rotulo': ev += [{'t': pz.get('t', e['t0']), 'type': 'click'} for pz in e['piezas'] if pz.get('caja') or pz.get('fuente') == 'marca']
        elif e['tipo'] == 'cartel': ev.append({'t': e['t0'], 'type': 'hit'}); ev += ([{'t': e.get('t_sub', e['t0'] + 0.35), 'type': 'whoosh', 'len': 0.35}] if e.get('subrayado') else [])
        elif e['tipo'] == 'flecha': ev.append({'t': e['t0'], 'type': 'whoosh', 'len': 0.45}); ev.append({'t': e.get('t_texto', e['t0'] + 0.4), 'type': 'pop'})
        elif e['tipo'] == 'foco': ev.append({'t': e['t0'], 'type': 'whoosh', 'len': 0.4})
        elif e['tipo'] == 'post_ig': ev.append({'t': max(0, e['t0'] - 0.15), 'type': 'whoosh', 'len': 0.5}); ev.append({'t': e.get('t_zoom', e['t0'] + 1), 'type': 'whoosh', 'len': 0.8}); ev.append({'t': e.get('t_zoom', e['t0'] + 1) + 0.9, 'type': 'pop'})
        elif e['tipo'] == 'mensaje': ev.append({'t': e['t0'], 'type': 'pop'}); ev.append({'t': e['t0'] + e.get('escribiendo', 0.7), 'type': 'chime'})
        elif e['tipo'] == 'calendario':
            ev.append({'t': e['t0'], 'type': 'swoosh'}); a, b = e.get('t_llenar', [e['t0'] + .3, e['t0'] + 2.5]); nd = min(21, e.get('dias', 21))
            ev += [{'t': a + (b - a) * k / max(1, nd - 1), 'type': 'tick'} for k in range(nd)]          # v3: un tic por día
            if e.get('especial'): ev.append({'t': e['especial']['t'], 'type': 'hit'}); ev.append({'t': e['especial'].get('t2', e['especial']['t'] + .5), 'type': 'pop'})
        elif e['tipo'] == 'cta':
            ev.append({'t': e['t0'], 'type': 'swoosh'})
            if e.get('t_clic'): ev.append({'t': e['t_clic'], 'type': 'click'})
    ev += [{'t': max(0, tt - 0.12), 'type': 'whoosh'} for tt in S.get('transiciones', [])]
    ev += [{'t': zm[0], 'type': 'hit'} for zm in S.get('zooms', []) if zm[2] >= 1.15 and zm[1] - zm[0] < 1.5 and len(zm) < 5]
    ev += [{'t': max(0, zm[0] - 0.05), 'type': 'whoosh', 'len': 0.3} for zm in S.get('zooms', []) if len(zm) >= 5]   # solo golpes de zoom cortos, no reencuadres
    for e in S.get('elementos', []):
        if e['tipo'] in ('broll', 'cartel', 'post_ig') and e.get('golpe', True): ev.append({'t': e['t0'], 'type': 'drop', 'g': 0.45})
        if e['tipo'] == 'tarjeta' and e.get('suelta'): ev.append({'t': max(0, e['t0'] - 0.12), 'type': 'whoosh', 'len': 0.4}); ev.append({'t': e['t0'], 'type': 'hit', 'g': 0.6})
        if e['tipo'] == 'calendario' and e.get('desenfoca'): ev.append({'t': e['t0'], 'type': 'hit', 'g': 0.5})
    off = 0.0                                                   # v3 (earshot): ningún corte sin sonido
    for k_, (a_, b_) in enumerate(TRAMOS[:-1]):
        off += b_ - a_
        if not any(abs(x['t'] - off) < 0.15 for x in ev): ev.append({'t': max(0, off - 0.08), 'type': 'whoosh', 'len': 0.25, 'g': 0.45})
    for e in (S.get('elementos', []) if S.get('ticks_auto', True) else []):
        for k in ('t0',):
            tt = e.get(k)
            if isinstance(tt, (int, float)) and tt < DUR - 0.2 and not any(abs(x['t'] - tt) < 0.15 for x in ev): ev.append({'t': tt, 'type': 'tick', 'g': 0.5})
    if S.get('audio', 'voz') != 'voz': ev.append({'t': max(0, DUR - 0.75), 'type': 'hit'})
    ev += S.get('eventos_extra', [])
    json.dump({'capas_sonido': S.get('capas_sonido', []), 'musicas': S.get('musicas', []), 'stopdowns': S.get('stopdowns', [])}, open(os.path.join(WORK, 'tiempos_v2.json'), 'w'), indent=1)
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
    elif paso == 'sujeto':
        # v2: recorta a la persona (Vision, «levantar sujeto») en los fotogramas donde hay elementos «detras» -> sujeto/s_NNNN.png
        os.makedirs(WORK + '/sujeto', exist_ok=True); fs = set()
        for e in S.get('elementos', []):
            if e.get('detras'):
                t0_ = e.get('t0', min((it['t'] for it in e.get('items', [])), default=0)); fs |= set(range(max(0, int(t0_ * FPS) - 2), min(N, int(e.get('t1', t0_ + 3) * FPS) + 8)))
        fs = sorted(f for f in fs if not os.path.exists('%s/sujeto/s_%04d.png' % (WORK, f)))
        REC = os.path.expanduser('~/Videos-Remotion/herramientas/recorte-objetos/recortar')
        for k in range(0, len(fs), 40):
            par = sum([['%s/fr/b_%04d.jpg' % (WORK, f), '%s/sujeto/s_%04d.png' % (WORK, f)] for f in fs[k:k + 40]], [])
            subprocess.run([REC, '--lienzo'] + par, capture_output=True)
        print('sujeto', len(fs), 'fotogramas')
    elif paso == 'caras':
        # v3: «no le tapes la cara… son cosas básicas que no pueden fallar». Cada 0,25 s (fuera de pantallas completas):
        # cara con Vision en el fotograma base -> misma transformación de zoom -> diferencia con el fotograma animado dentro de la cara.
        def lleno(t):
            for e in S.get('elementos', []):
                if e['tipo'] in ('post_ig', 'cartel') or (e['tipo'] == 'broll' and e.get('modo') != 'ventana') or (e.get('desenfoca') and e['tipo'] in ('tarjeta', 'calendario')):
                    if e['t0'] - 0.05 <= t < e.get('t1', e['t0']) + 0.25: return True
            return False
        def zp(f):
            t = f / FPS; g = S.get('gancho', {}); z, blur = 1.0, 0
            if g.get('zoom_out', True) and f < 9: return None
            for zm in S.get('zooms', []):
                if zm[0] <= t < zm[1]:
                    if len(zm) >= 5: return None if t - zm[0] < 0.2 else ('c', zm[2], zm[3], zm[4])
                    z = max(z, lerp(1.0, zm[2], eo((t - zm[0]) / 0.08)))
            for tt in S.get('transiciones', []):
                if abs(t - tt) < 0.15: return None
            return z
        fs = [f for f in range(0, N, int(FPS / 4)) if not lleno(f / FPS) and zp(f) is not None and os.path.exists('%s/an/a_%04d.jpg' % (WORK, f))]
        out = subprocess.run([os.path.expanduser('~/Videos-Remotion/herramientas/composicion/sujeto')] + ['%s/fr/b_%04d.jpg' % (WORK, f) for f in fs], capture_output=True, text=True).stdout
        malos = []
        for f, ln in zip(fs, [l for l in out.splitlines() if l.startswith('{')]):
            dd = json.loads(ln); cs = sorted(dd.get('caras', []), key=lambda c: -(c['caja'][2] - c['caja'][0]))
            if not cs: continue
            x0, y0, x1, y1 = cs[0]['caja']; z = zp(f); cx, cy = 0.5, S.get('cara_y', 0.40)
            if isinstance(z, tuple): _, z, cx, cy = z
            wz, hz = W / z, H / z; ox, oy = (W - wz) * cx, (H - hz) * cy; bx = [(x0 - ox) * z, (y0 - oy) * z, (x1 - ox) * z, (y1 - oy) * z]
            b = Image.open('%s/fr/b_%04d.jpg' % (WORK, f)).convert('RGB')
            if z > 1.001: b = zoom(b, z, cx, cy)
            if S.get('degradado', True): degradado(b, S.get('degradado_desde', 0.60), S.get('degradado_fuerza', 170))
            a_ = Image.open('%s/an/a_%04d.jpg' % (WORK, f)).convert('RGB'); bx = [int(max(0, bx[0])), int(max(0, bx[1])), int(min(W, bx[2])), int(min(H, bx[3]))]
            df = np.abs(np.asarray(a_.crop(bx), dtype=np.int16) - np.asarray(b.crop(bx), dtype=np.int16)).mean()
            if df > 22: malos.append((round(f / FPS, 2), round(float(df), 1), bx))
        print('caras: %d fotogramas mirados, %d con la cara tapada' % (len(fs), len(malos)))
        for m in malos: print('   t=%.2f s  diferencia %.0f  cara %s' % m)
        json.dump(malos, open(os.path.join(AQUI, 'caras.json'), 'w'))
    elif paso == 'hoja': hoja()
    elif paso == 'eventos': eventos()
