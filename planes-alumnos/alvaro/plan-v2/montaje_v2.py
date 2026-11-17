# Álvaro · «lunes nada de pan» · reedición v2 (16-11-2026). Plan aprobado: plan-v2/LEEME.md y diseno/hoja_diseno.jpg.
# Reutiliza el montador de escenas de la v1 (../montaje_alvaro.py) y el diseño de cristal (diseno.py).
# Uso: <python del entorno whisperx> montaje_v2.py <carpeta de trabajo> <salida.mp4> [base|anim|audio|final|musica|todo]
import os, sys, math, subprocess, wave
import numpy as np
from multiprocessing import Pool
AQUI = os.path.dirname(os.path.abspath(__file__)); PASO = sys.argv[3] if len(sys.argv) > 3 else 'todo'
exec(open(os.path.join(AQUI, '..', 'montaje_alvaro.py'), encoding='utf-8').read().split('# ---------------- gráficos')[0])            # WORK, OUTV, RAW, FF, FPS, escena()…
exec(open(os.path.join(AQUI, 'diseno.py'), encoding='utf-8').read().split('def base(')[0].replace('SRC, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)', ''))
os.makedirs(WORK + '/fr', exist_ok=True); os.makedirs(WORK + '/an', exist_ok=True)
PAN, CHOCO, CENA, MANZ = '🥖', '🍫', '🍽️', '🍏'; BLANCO = (245, 242, 235)

# ---------- escenas: se quita el aire muerto antes de cada «¿día?»; en martes y jueves la voz entra 4–6 fotogramas antes del corte (corte en J) ----------
ESC = [
    dict(n='lunes',     f=66,  T=[(171.55, 66)],                C=(58.00, 'mesa')),
    dict(n='martes',    f=87,  T=[(399.355, 87)],               C=(374.885, 'mesa'), zoom=(1.445, 0.31, 0.40)),
    dict(n='miercoles', f=106, T=[(534.00, 106)],               C=(557.56, 'puerta')),
    dict(n='jueves',    f=80,  T=[(665.807, 55), (656.05, 25)], C=(588.427, 'sofa'), gain=(1.312, 1.357, 1.308)),
    dict(n='cocina',    f=48,  T=[(865.20, 48)],                C=None),
    dict(n='remate',    f=90,  T=[(891.55, 90)],                C=None),
]
G = {}; t0 = 0
for e in ESC: G[e['n']] = t0; t0 += e['f']
N = t0; TOTAL = N / FPS                                                        # 477 fotogramas = 15,9 s
VOZ = [(0.0, 171.55, 2.0), (2.0, 399.155, 1.645), (3.645, 376.33, 1.455), (5.1, 534.00, 2.32), (7.32, 559.78, 1.29),
       (8.433, 665.607, 2.023), (10.456, 656.05, 0.845), (11.3, 865.2, 1.6), (12.9, 891.55, 3.0)]
# ---------- días: de dónde sale la ventana, dónde reposa, cuándo sale («nada»/«manzana») y cuándo se sella (la palabra) ----------
DIAS_EV = [
    dict(i=0, e=PAN,   m='x', ancla=(880, 770),  rep=(540, 650),  sale=34,  sello=45,  rel='Nada de', esp='PAN',           col=ROJO, y=1075, tam=128),
    dict(i=1, e=CHOCO, m='x', ancla=(880, 850),  rep=(530, 650),  sale=81,  sello=89,  rel='Nada de', esp='CHOCOLATE',     col=ROJO, y=1560, tam=104),
    dict(i=2, e=CENA,  m='x', ancla=(360, 740),  rep=(660, 455),  sale=172, sello=179, rel='Nada de', esp='salir a cenar', col=ROJO, y=1125, tam=92),
    dict(i=3, e=MANZ,  m='v', ancla=(770, 1700), rep=(810, 1210), sale=273, sello=277, rel=None,      esp='MANZANA',       col=AZUL, y=1520, tam=100),
]
for d in DIAS_EV: d['vuela'] = d['sello'] + 11; d['cae'] = d['vuela'] + 8; d['fin_txt'] = d['cae'] + 6
# textos sueltos: (entra, sale, relleno, especial, color, y, tamaño, fotograma en que entra la especial)
TXT = [(9, 31, None, '¿LUNES?', BLANCO, 1100, 96, 9), (62, 80, None, '¿MARTES?', BLANCO, 1560, 96, 62), (122, 151, '¿Cómo me voy a poner?', None, BLANCO, 1500, 96, 0),
       (155, 171, None, '¿MIÉRCOLES?', BLANCO, 1125, 88, 155), (228, 257, 'Les digo que', 'NO', BLANCO, 1125, 128, 240), (255, 272, None, '¿JUEVES?', BLANCO, 1520, 96, 255),
       (320, 337, 'Muy bien', None, BLANCO, 1520, 96, 0), (420, 447, '¿Pero', 'QUÉ HACES?', BLANCO, 1250, 108, 423)]
F_ZOOM, F_ROMPE, F_SEGUIR = 420, 425, 448

eo = lambda p: 1 - (1 - min(1, max(0, p))) ** 3
eio = lambda p: (lambda p: 3 * p * p - 2 * p * p * p)(min(1, max(0, p)))
lerp = lambda a, b, p: a + (b - a) * p
X0 = (1080 - (4 * LADO + 3 * HUECO)) // 2

def cuadro_uno(img, i, activo, dentro, dy=0, sello_p=1.0):
    x = X0 + i * (LADO + HUECO); box = (x, Y0 + dy, x + LADO, Y0 + dy + LADO)
    if i == activo:
        sombra_caja(img, box, 42, fuerza=130, blur=20); ImageDraw.Draw(img).rounded_rectangle(box, 42, fill=(250, 250, 250))
    else: cristal(img, box, 42, claro=0.12, borde=120, sombra=False)
    d = ImageDraw.Draw(img); d.text((x + LADO / 2, Y0 + dy + 32), DIAS[i], font=F(BOLD, 28), fill=(20, 20, 24) if i == activo else (255, 255, 255), anchor='mm')
    if i in dentro:
        e, marca = dentro[i]; im = emoji(e, 92); img.paste(im, (x + (LADO - 92) // 2, Y0 + dy + 62), im)
        (prohibido if marca == 'x' else visto)(ImageDraw.Draw(img), x + LADO - 40, Y0 + dy + LADO - 38, int(19 * sello_p), 6)
    elif i == activo: d.rounded_rectangle((x + 46, Y0 + dy + 66, x + LADO - 46, Y0 + dy + 150), 22, outline=(205, 205, 210), width=3)

def ventana2(img, centro, lado, e, marca, sello, giro, puntos, ancla):
    cx, cy = int(centro[0]), int(centro[1]); lado = int(lado); pad = 70; L = lado + 2 * pad
    capa = Image.new('RGB', (L, L)); capa.paste(img.crop((cx - L // 2, cy - L // 2, cx + L // 2, cy + L // 2)))
    cristal(capa, (pad, pad, pad + lado, pad + lado), int(lado * .19), claro=0.26, borde=210)
    em = emoji(e, max(8, int(lado * .62))); capa.paste(em, (pad + (lado - em.size[0]) // 2, pad + (lado - em.size[1]) // 2 - int(lado * .02)), em)
    if sello > 0:
        R = int(lado * .15 * sello); mx, my = pad + lado - int(lado * .15) - 4, pad + lado - int(lado * .15) - 4
        (prohibido if marca == 'x' else visto)(ImageDraw.Draw(capa), mx, my, R, max(6, R // 3))
    m = rrmask((L, L), (pad - 34, pad - 34, pad + lado + 34, pad + lado + 56), 80).filter(ImageFilter.GaussianBlur(14))
    rot = capa.convert('RGBA'); rot.putalpha(m); rot = rot.rotate(giro, resample=Image.BICUBIC)
    if puntos > 0:
        o = img.copy(); d2 = ImageDraw.Draw(o); ax, ay = ancla
        for k, r in ((0.30, 13), (0.58, 9), (0.82, 6)):
            ex, ey = cx + (ax - cx) * 0.55, cy + (ay - cy) * 0.55; px, py = ex + (ax - ex) * k, ey + (ay - ey) * k; d2.ellipse((px - r, py - r, px + r, py + r), fill=(255, 255, 255))
        img.paste(Image.blend(img, o, puntos))
    img.paste(rot, (cx - L // 2, cy - L // 2), rot)

def mezcla(im, c, a): return c if a >= 1 else Image.blend(im, c, a)

def cuadro(f):
    im = Image.open('%s/fr/b_%03d.png' % (WORK, f)).convert('RGB')
    p = eo(f / 8); z = lerp(1.3, 1.0, p)                                           # 1 · gancho: zoom out + enfoque
    if f >= F_ZOOM: z = lerp(1.0, 1.28, eo((f - F_ZOOM + 1) / 3))                   # remate: zoom de golpe al entrenador
    if z > 1.001:
        w, h = 1080 / z, 1920 / z; x0, y0 = ((1080 - w) / 2, (1920 - h) * 0.56) if f < F_ZOOM else ((1080 - w) * 0.89, (1920 - h) * 0.59)
        im = im.resize((1080, 1920), Image.BICUBIC, box=(x0, y0, x0 + w, y0 + h))
    if p < 1: im = im.filter(ImageFilter.GaussianBlur(11 * (1 - p)))
    activo = 0 if f < G['martes'] else 1 if f < G['miercoles'] else 2 if f < G['jueves'] else 3      # 2 · cuadrados
    dentro = {d['i']: (d['e'], d['m']) for d in DIAS_EV if f >= d['cae']}; sp = 1.0
    if f >= F_ROMPE: dentro[3] = (MANZ, 'x'); sp = lerp(1.9, 1.0, eo((f - F_ROMPE) / 4))
    for i in range(4):
        q = eo((f - (5 + 2 * i)) / 5)
        if q <= 0: continue
        c = im.copy(); cuadro_uno(c, i, activo, dentro, dy=int(-16 * (1 - q)), sello_p=sp if i == 3 else 1.0); im = mezcla(im, c, q)
    for d in DIAS_EV:                                                              # 3 · ventana de cada día
        if not (d['sale'] <= f < d['cae']): continue
        hueco = (X0 + d['i'] * (LADO + HUECO) + LADO // 2, Y0 + 108); g0 = -4 if d['rep'][0] < d['ancla'][0] else 4
        if f < d['vuela']:
            a = eo((f - d['sale']) / 6); cen = (lerp(d['ancla'][0], d['rep'][0], a), lerp(d['ancla'][1], d['rep'][1], a)); lado = lerp(60, 310, a); giro = lerp(g0 * 3.5, g0, a)
            sello = 0 if f < d['sello'] else lerp(1.5, 1.0, eo((f - d['sello']) / 3)); puntos = a * (1 - eo((f - d['vuela'] + 6) / 5)); alfa = a
        else:
            b = eio((f - d['vuela']) / 8); cen = (lerp(d['rep'][0], hueco[0], b), lerp(d['rep'][1], hueco[1], b) - 60 * math.sin(math.pi * b)); lado = lerp(310, 120, b); giro = lerp(g0, 0, b); sello = 1; puntos = 0; alfa = 1
        c = im.copy(); ventana2(c, cen, lado, d['e'], d['m'], sello, giro, puntos, d['ancla']); im = mezcla(im, c, alfa)
    def capa_texto(rel, esp, col, y, tam, alfa):                                    # 4 · textos
        nonlocal im
        if alfa > 0: c = im.copy(); texto(c, rel, esp, col, y=y, tam=tam); im = mezcla(im, c, alfa)
    for d in DIAS_EV:
        ini = d['sale'] if d['rel'] else d['sello']
        if ini <= f < d['fin_txt']:
            sal = 1 - eo((f - d['fin_txt'] + 3) / 3)
            if f < d['sello']: capa_texto(d['rel'], None, None, d['y'], d['tam'], eo((f - ini) / 3))
            else: capa_texto(d['rel'], d['esp'], d['col'], d['y'], int(lerp(d['tam'] * 1.17, d['tam'], eo((f - d['sello']) / 3))), sal)
    for a, b, rel, esp, col, y, tam, fe in TXT:
        if a <= f < b:
            alfa = min(eo((f - a + 1) / 3), 1 - eo((f - b + 3) / 3)); e2 = esp if (esp and f >= fe) else None
            if rel or e2: capa_texto(rel, e2, col, y, int(lerp(tam * 1.17, tam, eo((f - fe) / 3))) if e2 else tam, alfa)
    if f >= F_SEGUIR:                                                              # 5 · botón Seguir de cristal
        c = im.copy(); bx = (330, 1610, 750, 1716); cristal(c, bx, 53, claro=0.18, borde=190); dd = ImageDraw.Draw(c); dd.ellipse((346, 1626, 420, 1700), fill=AZUL)
        dd.line((383, 1645, 383, 1681), fill='white', width=7); dd.line((365, 1663, 401, 1663), fill='white', width=7); dd.text((585, 1663), 'Seguir', font=F(BOLD, 46), fill='white', anchor='mm')
        im = mezcla(im, c, eo((f - F_SEGUIR + 1) / 4))
    im.save('%s/an/a_%03d.png' % (WORK, f)); return f

# ---------- sonido: efectos de la carpeta 00 FAVORITOS de Luis; (momento, archivo, punto del archivo que cae ahí, pico en dB, duración máx.) ----------
SFXD = os.path.expanduser('~/EDICION/editing luiyi pack/Efectos de sonido/00 FAVORITOS/')
SFX = [(0.03, 'Sub Bass Drop 1.wav', 0.117, -10, 0.85), (0.12, 'Whoosh Deep Short.wav', 0.257, -13, 0), (0.27, 'Ui button.wav', 0.059, -18, 0),
       (3.75, 'VS_Short Whoosh 3.mp3', 0.570, -15, 0), (240 / 30, 'Impact Normal.mp3', 0.052, -11, 0.9),
       (F_ZOOM / 30, 'Sub Bass Drop 1.wav', 0.117, -8, 1.4), (F_ZOOM / 30 + 0.03, 'Whoosh Deep Short.wav', 0.257, -13, 0), (F_ROMPE / 30, 'Impact Normal.mp3', 0.052, -9, 0.9), (F_SEGUIR / 30, 'Ui button.wav', 0.059, -15, 0)]
for d in DIAS_EV:
    SFX += [(d['sale'] / 30 + 0.07, 'Cinematic Fast Whoosh.wav', 0.546, -14, 0), ((d['vuela'] + 4) / 30, 'Simple Whoosh.wav', 0.700, -16, 0), (d['cae'] / 30, 'Smooth Pop.wav', 0.013, -12, 0),
            (d['sello'] / 30, 'Impact Normal.mp3', 0.052, -9, 0.9) if d['m'] == 'x' else (d['sello'] / 30, 'Ui Enter.wav', 0.077, -9, 0)]

def leer(path, extra=()):
    return np.frombuffer(subprocess.run([FF, '-v', 'error', *extra, '-i', path, '-ac', '1', '-ar', '48000', '-f', 'f32le', '-'], capture_output=True).stdout, dtype=np.float32).copy()
def wav(path, a):
    w = wave.open(path, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(48000); w.writeframes((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()

def audio():
    n = int(TOTAL * 48000); voz = np.zeros(n, np.float32)
    for t, s, d in VOZ:
        a = leer(RAW, ('-ss', '%.3f' % s, '-t', '%.3f' % d)); i = int(t * 48000); a = a[:n - i]; k = 1440; a[:k] *= np.linspace(0, 1, k); a[-k:] *= np.linspace(1, 0, k); voz[i:i + len(a)] += a
    wav(WORK + '/voz_cruda.wav', voz / (np.abs(voz).max() + 1e-9) * 0.5)
    run([FF, '-v', 'error', '-y', '-i', WORK + '/voz_cruda.wav', '-af', 'highpass=f=80,afftdn=nf=-50,acompressor=threshold=0.05:ratio=3:attack=5:release=120,loudnorm=I=-16:TP=-2:LRA=7', '-ar', '48000', WORK + '/voz.wav'])
    voz = leer(WORK + '/voz.wav')[:n]; voz = np.pad(voz, (0, n - len(voz))); fx = np.zeros(n, np.float32)
    for t, fn, anc, db, mx in SFX:
        a = leer(SFXD + fn); a *= 10 ** (db / 20) / (np.abs(a).max() + 1e-9); ini = t - anc
        if mx: a = a[:int(mx * 48000)]; k = int(len(a) * 0.4); a[-k:] *= np.linspace(1, 0, k)
        if ini < 0: a = a[int(-ini * 48000):]; ini = 0; a[:240] *= np.linspace(0, 1, 240)
        i = int(ini * 48000); a = a[:n - i]; k = min(2400, len(a)); a[-k:] *= np.linspace(1, 0, k); fx[i:i + len(a)] += a
    wav(WORK + '/fx.wav', fx); mez = voz + fx; wav(WORK + '/mezcla.wav', np.tanh(mez * 0.9) / 0.9 * 0.89)

def final(musica=None, salida=None, nivel=-24):
    salida = salida or OUTV; ins = ['-framerate', str(FPS), '-i', WORK + '/an/a_%03d.png', '-i', WORK + '/mezcla.wav']; af = '[1:a]anull[m]'
    if musica:
        ins += ['-ss', str(musica[1]), '-t', '%.3f' % TOTAL, '-i', musica[0]]
        af = '[2:a]loudnorm=I=%d:TP=-3,afade=t=in:d=0.05,afade=t=out:st=%.2f:d=0.6[mu];[1:a][mu]amix=inputs=2:normalize=0[m]' % (nivel, TOTAL - 0.6)
    run([FF, '-v', 'error', '-y'] + ins + ['-filter_complex', af + ';[m]alimiter=limit=0.89,loudnorm=I=-14:TP=-1.5:LRA=9[a]', '-map', '0:v', '-map', '[a]',
         '-c:v', 'libx264', '-crf', '15', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-t', '%.3f' % TOTAL, salida])

if __name__ == '__main__':
    if PASO in ('todo', 'base'):
        lista = WORK + '/lista.txt'
        with open(lista, 'w') as fh:
            for i, e in enumerate(ESC): fh.write("file '%s'\n" % escena(i, e)); print('escena', e['n'], flush=True)
        run([FF, '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', WORK + '/base.mp4'])
        run([FF, '-v', 'error', '-y', '-i', WORK + '/base.mp4', '-frames:v', str(N), '-start_number', '0', WORK + '/fr/b_%03d.png'])
    if PASO in ('todo', 'anim'):
        with Pool(7) as p: p.map(cuadro, range(N), chunksize=4)
        print('animación ok', flush=True)
    if PASO in ('todo', 'audio'): audio(); print('audio ok', flush=True)
    if PASO in ('todo', 'final'): final(); print('ok', OUTV)
    if PASO == 'musica':                                   # 3 muestras de 10 s con la voz y los efectos encima
        M = os.path.expanduser('~/EDICION/editing luiyi pack/Música/')
        for nom, ruta, ss in (('A 1901', M + 'Música de fondo (pack)/Phoenix - 1901 (Instrumental) HQ.mp3', float(sys.argv[4])), ('B funky', M + 'Wild Cherry - Play That Funky Music (instrumental).mp3', float(sys.argv[5])),
                              ('C rapp snitch', M + 'Música de fondo (pack)/MF Doom - Rapp Snitch Knishes [Instrumental].mp3', float(sys.argv[6]))):
            final((ruta, ss), OUTV.replace('.mp4', ' · música %s.mp4' % nom)); print('música', nom, flush=True)
