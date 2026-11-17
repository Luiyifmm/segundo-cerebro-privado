# Fotogramas de diseño (parados) del plan v2 de Álvaro: cuadrados de cristal por día, ventana flotante con emoji, remate. No anima nada.
# Corrección de Luis (16-11): las imágenes son elementos de FUERA del vídeo (emoji, imagen buscada), nunca recortes del propio plano;
# los días son CUADRADOS y lo que se dice acaba dentro del cuadrado de su día.
# Uso: <python del entorno whisperx> diseno.py <carpeta con b_*.png> <carpeta de salida>
import os, sys, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont
SRC, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
SF = os.path.expanduser('~/Proyectos/amin/trabajos/sala/'); SEQ = os.path.expanduser('~/Library/Fonts/Sequel Sans Heavy Disp.otf')
EMO = '/System/Library/Fonts/Apple Color Emoji.ttc'
ROJO, AZUL = (255, 95, 87), (58, 134, 255)
_f = {}
def F(p, s):
    k = (p, s)
    if k not in _f: _f[k] = ImageFont.truetype(p, int(s))
    return _f[k]
BOLD, MED = SF + 'SFPRODISPLAYBOLD.OTF', SF + 'SFPRODISPLAYMEDIUM.OTF'

def emoji(ch, lado):
    """Emoji del sistema como imagen RGBA cuadrada (la fuente solo trae 160 px: se escala)."""
    im = Image.new('RGBA', (220, 220), (0, 0, 0, 0)); ImageDraw.Draw(im).text((110, 110), ch, font=F(EMO, 160), embedded_color=True, anchor='mm')
    return im.crop(im.getbbox()).resize((lado, lado), Image.LANCZOS)

def rrmask(size, box, r):
    m = Image.new('L', size, 0); ImageDraw.Draw(m).rounded_rectangle(box, r, fill=255); return m

def sombra_caja(img, box, r, fuerza=120, blur=25, dy=16):
    x0, y0, x1, y1 = box; sh = Image.new('L', img.size, 0); ImageDraw.Draw(sh).rounded_rectangle((x0, y0 + dy, x1, y1 + dy + 6), r, fill=fuerza)
    img.paste(Image.new('RGB', img.size, (0, 0, 0)), (0, 0), sh.filter(ImageFilter.GaussianBlur(blur)))

def cristal(img, box, r, claro=0.16, borde=150, sombra=True, blur=22):
    """Vidrio: desenfoca lo de detrás, lo aclara un poco, borde claro fino y sombra suave."""
    if sombra: sombra_caja(img, box, r)
    m = rrmask(img.size, box, r)
    b = img.filter(ImageFilter.GaussianBlur(blur)); b = Image.blend(b, Image.new('RGB', img.size, (255, 255, 255)), claro)
    img.paste(b, (0, 0), m)
    o = Image.new('RGBA', img.size, (0, 0, 0, 0)); ImageDraw.Draw(o).rounded_rectangle(box, r, outline=(255, 255, 255, borde), width=2)
    img.paste(o, (0, 0), o)

def prohibido(d, cx, cy, R, w, fondo=True):
    if fondo: d.ellipse((cx - R - 5, cy - R - 5, cx + R + 5, cy + R + 5), fill=(255, 255, 255))
    d.ellipse((cx - R, cy - R, cx + R, cy + R), outline=ROJO, width=w)
    a = math.radians(45); dx, dy = (R - w / 2) * math.cos(a), (R - w / 2) * math.sin(a)
    d.line((cx - dx, cy - dy, cx + dx, cy + dy), fill=ROJO, width=w)

def visto(d, cx, cy, R, w, fondo=True):
    if fondo: d.ellipse((cx - R - 5, cy - R - 5, cx + R + 5, cy + R + 5), fill=(255, 255, 255))
    d.ellipse((cx - R, cy - R, cx + R, cy + R), fill=AZUL)
    d.line((cx - R * .45, cy + R * .02, cx - R * .1, cy + R * .38, cx + R * .48, cy - R * .32), fill='white', width=w, joint='curve')

DIAS = ['LUN', 'MAR', 'MIÉ', 'JUE']; LADO, HUECO, Y0 = 176, 20, 70
def cuadros(img, activo, dentro):
    """Cuatro cuadrados de cristal. dentro: {indice: (emoji, 'x' | 'v')} = lo que ya se dijo ese día. El del día actual va en blanco."""
    x = (1080 - (4 * LADO + 3 * HUECO)) // 2
    for i, t in enumerate(DIAS):
        box = (x, Y0, x + LADO, Y0 + LADO)
        if i == activo:
            sombra_caja(img, box, 42, fuerza=130, blur=20); ImageDraw.Draw(img).rounded_rectangle(box, 42, fill=(250, 250, 250))
        else: cristal(img, box, 42, claro=0.12, borde=120, sombra=False)
        d = ImageDraw.Draw(img); d.text((x + LADO / 2, Y0 + 32), t, font=F(BOLD, 28), fill=(20, 20, 24) if i == activo else (255, 255, 255), anchor='mm')
        if i in dentro:
            e, marca = dentro[i]; im = emoji(e, 92); img.paste(im, (x + (LADO - 92) // 2, Y0 + 62), im)
            (prohibido if marca == 'x' else visto)(ImageDraw.Draw(img), x + LADO - 40, Y0 + LADO - 38, 19, 6)
        elif i == activo: d.rounded_rectangle((x + 46, Y0 + 66, x + LADO - 46, Y0 + 150), 22, outline=(205, 205, 210), width=3)   # hueco donde caerá el objeto
        x += LADO + HUECO

def ventana(img, centro, lado, e, marca, ancla, giro=-4):
    """Ventana flotante tipo visionOS: cristal + emoji grande + marca (x / v) + puntos hacia el ancla (de dónde sale)."""
    cx, cy = centro; pad = 70; L = lado + 2 * pad
    capa = img.crop((cx - L // 2, cy - L // 2, cx + L // 2, cy + L // 2)).convert('RGB')
    cristal(capa, (pad, pad, pad + lado, pad + lado), 62, claro=0.26, borde=210)
    em = emoji(e, int(lado * .62)); capa.paste(em, (pad + (lado - em.size[0]) // 2, pad + (lado - em.size[1]) // 2 - 6), em)
    d = ImageDraw.Draw(capa); R = int(lado * .15); mx, my = pad + lado - R - 4, pad + lado - R - 4
    (prohibido if marca == 'x' else visto)(d, mx, my, R, max(8, R // 3))
    m = rrmask((L, L), (pad - 34, pad - 34, pad + lado + 34, pad + lado + 56), 80).filter(ImageFilter.GaussianBlur(14))
    rot = capa.convert('RGBA'); rot.putalpha(m); rot = rot.rotate(giro, resample=Image.BICUBIC)
    ax, ay = ancla; d2 = ImageDraw.Draw(img)
    for k, r in ((0.30, 13), (0.58, 9), (0.82, 6)):
        ex, ey = cx + (ax - cx) * 0.55, cy + (ay - cy) * 0.55; px, py = ex + (ax - ex) * k, ey + (ay - ey) * k
        d2.ellipse((px - r, py - r, px + r, py + r), fill=(255, 255, 255))
    img.paste(rot, (cx - L // 2, cy - L // 2), rot)

def texto(img, relleno, especial, color, y=1300, tam=128):
    def sombra(xy, t, f):
        s = Image.new('L', img.size, 0); ImageDraw.Draw(s).text(xy, t, font=f, fill=170, anchor='mm')
        img.paste(Image.new('RGB', img.size, (0, 0, 0)), (0, 0), s.filter(ImageFilter.GaussianBlur(12)))
    if relleno:
        f = F(BOLD, 56); sombra((540, y), relleno, f); ImageDraw.Draw(img).text((540, y), relleno, font=f, fill=(245, 242, 235), anchor='mm')
    if especial:
        f = F(SEQ, tam); yy = y + (tam * .62 if relleno else 0); sombra((540, yy), especial, f); ImageDraw.Draw(img).text((540, yy), especial, font=f, fill=color, anchor='mm')

def base(nombre): return Image.open(os.path.join(SRC, nombre)).convert('RGB')
PAN, CHOCO, CENA, MANZ = '🥖', '🍫', '🍽️', '🍏'
P = []
im = base('b_0.5.png'); w, h = int(1080 / 1.3), int(1920 / 1.3); x0, y0 = (1080 - w) // 2, 250
im = im.crop((x0, y0, x0 + w, y0 + h)).resize((1080, 1920), Image.LANCZOS).filter(ImageFilter.GaussianBlur(11)); P.append(('1 · Gancho · 0,00 s · ampliado y borroso', im))
im = base('b_0.5.png'); cuadros(im, 0, {}); texto(im, None, '¿LUNES?', (245, 242, 235), y=1100, tam=96); P.append(('2 · Gancho · 0,25 s · cuadrados, LUN con su hueco', im))
im = base('b_1.5.png'); cuadros(im, 0, {}); ventana(im, (540, 650), 320, PAN, 'x', (880, 770)); texto(im, 'Nada de', 'PAN', ROJO, y=1075); P.append(('3 · Lunes · la ventana sale del cuaderno', im))
im = base('b_1.5.png'); cuadros(im, 0, {0: (PAN, 'x')}); texto(im, 'Nada de', 'PAN', ROJO, y=1075); P.append(('4 · Lunes · el pan ya está en su cuadrado', im))
im = base('b_3.6.png'); cuadros(im, 1, {0: (PAN, 'x')}); ventana(im, (530, 650), 320, CHOCO, 'x', (880, 850)); texto(im, 'Nada de', 'CHOCOLATE', ROJO, y=1560, tam=104); P.append(('5 · Martes · misma mecánica', im))
im = base('b_7.6.png'); cuadros(im, 2, {0: (PAN, 'x'), 1: (CHOCO, 'x')}); ventana(im, (680, 520), 300, CENA, 'x', (360, 740), giro=4); texto(im, 'Nada de', 'salir a cenar', ROJO, y=1125, tam=92); P.append(('6 · Miércoles', im))
im = base('b_11.5.png'); cuadros(im, 3, {0: (PAN, 'x'), 1: (CHOCO, 'x'), 2: (CENA, 'x')}); ventana(im, (810, 1210), 290, MANZ, 'v', (770, 1700), giro=5); texto(im, None, 'MANZANA', AZUL, y=1520, tam=100); P.append(('7 · Jueves · sale de la mano, con ✓ azul', im))
im = base('b_17.6.png'); w, h = int(1080 / 1.28), int(1920 / 1.28); x0, y0 = 210, 250
im = im.crop((x0, y0, x0 + w, y0 + h)).resize((1080, 1920), Image.LANCZOS); cuadros(im, 3, {0: (PAN, 'x'), 1: (CHOCO, 'x'), 2: (CENA, 'x'), 3: (MANZ, 'x')}); texto(im, '¿Pero', 'QUÉ HACES?', (245, 242, 235), y=1250, tam=108)
bx = (330, 1610, 750, 1716); cristal(im, bx, 53, claro=0.18, borde=190); d = ImageDraw.Draw(im); d.ellipse((346, 1626, 420, 1700), fill=AZUL); d.line((383, 1645, 383, 1681), fill='white', width=7); d.line((365, 1663, 401, 1663), fill='white', width=7)
d.text((585, 1663), 'Seguir', font=F(BOLD, 46), fill='white', anchor='mm'); P.append(('8 · Remate · zoom + el ✓ de JUE pasa a prohibido', im))

for i, (t, im) in enumerate(P): im.save(os.path.join(OUT, 'diseno_%d.png' % (i + 1)))
cw, ch, m = 432, 768, 22; cols = 4; rows = 2; H = Image.new('RGB', (cols * (cw + m) + m, rows * (ch + 64) + m), (18, 18, 22)); d = ImageDraw.Draw(H)
for i, (t, im) in enumerate(P):
    x, y = m + (i % cols) * (cw + m), m + (i // cols) * (ch + 64); H.paste(im.resize((cw, ch), Image.LANCZOS), (x, y)); d.text((x, y + ch + 12), t, font=F(MED, 21), fill=(235, 235, 235))
H.save(os.path.join(OUT, 'hoja_diseno.jpg'), quality=90); print('ok', len(P))
