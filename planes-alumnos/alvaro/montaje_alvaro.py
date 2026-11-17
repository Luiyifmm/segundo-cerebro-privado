# Montaje de Álvaro Cabrera · «lunes nada de pan» (reedición v1 de Claude, 15-11-2026). Plan: PLANES/alvaro/LEEME.md
# Una sola persona hace los dos personajes con cámara fija: cada escena superpone la toma del ENTRENADOR (base) y la del CLIENTE (capa con máscara estática).
# Tomas localizadas cruzando el audio de la v1 del motor con el bruto (correlación ≥ 0,92).
# uso: <python con PIL y numpy> montaje_alvaro.py <carpeta_trabajo> <salida.mp4>
import os, sys, subprocess, json, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WORK, OUTV = sys.argv[1], sys.argv[2]
HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.expanduser('~/EDICION/3 PROYECTOS/Alumnos Trainer10x/MEDIA/Álvaro Cabrera/Álvaro - bruto.mp4')
SND = os.path.expanduser('~/EDICION/3 PROYECTOS/Alumnos Trainer10x/MEDIA/_sonido/')
FF = os.path.expanduser('~/.local/bin/ffmpeg')
FPS, W, H, RW, RH = 30, 1080, 1920, 1440, 2560
TM = 'zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=rgb24,eq=contrast=1.06:saturation=1.08:gamma=1.04'
os.makedirs(WORK, exist_ok=True)
def run(a): r = subprocess.run(a, capture_output=True, text=True); assert r.returncode == 0, r.stderr[-2000:]

# ---------------- escenas (fotogramas, fuentes en segundos del bruto) ----------------
ESC = [
    dict(n='lunes',   f=66,  T=[(171.55, 66)],              C=(58.00, 'mesa')),
    dict(n='martes',  f=99,  T=[(398.95, 99)],              C=(374.48, 'mesa'), zoom=(1.85, 0.31, 0.40)),
    dict(n='miercoles', f=137, T=[(532.97, 137)],           C=(556.53, 'puerta')),
    dict(n='jueves',  f=93,  T=[(665.38, 68), (656.05, 25)], C=(588.00, 'sofa'), gain=(1.312, 1.357, 1.308)),
    dict(n='cocina',  f=75,  T=[(865.20, 75)],              C=None),
    dict(n='remate',  f=105, T=[(891.05, 105)],             C=None),
]
t0 = 0
for e in ESC: e['g0'] = t0 / FPS; t0 += e['f']
TOTAL = t0 / FPS                       # 586 fotogramas = 19,53 s

# ---------------- máscaras estáticas de la capa del cliente (1440×2560) ----------------
yy, xx = np.mgrid[0:RH, 0:RW]; X, Y = xx / RW, yy / RH
MASK = {'mesa': X < 0.60, 'puerta': X > 0.40, 'sofa': (Y > 0.52) | ((X > 0.14) & (X < 0.50) & (Y > 0.41))}
for k, m in MASK.items():
    Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(24)).save(os.path.join(WORK, 'mask_%s.png' % k))

def escena(i, e):
    out = os.path.join(WORK, 'esc_%d.mp4' % i); D = e['f'] / FPS
    a, fc, k = [], [], 0
    for s, nf in e['T']:
        a += ['-ss', '%.3f' % s, '-t', '%.3f' % (nf / FPS + 0.2), '-i', RAW]
        fc.append('[%d:v]%s,scale=%d:%d,fps=%d,trim=end_frame=%d,setpts=PTS-STARTPTS[t%d]' % (k, TM, RW, RH, FPS, nf, k)); k += 1
    fc.append(''.join('[t%d]' % j for j in range(k)) + 'concat=n=%d:v=1:a=0[tb]' % k if k > 1 else '[t0]null[tb]')
    last = 'tb'
    if e['C']:
        cs, mk = e['C']
        a += ['-ss', '%.3f' % cs, '-t', '%.3f' % (D + 0.2), '-i', RAW, '-loop', '1', '-t', '%.3f' % (D + 0.2), '-i', os.path.join(WORK, 'mask_%s.png' % mk)]
        g = e.get('gain'); gf = ',colorchannelmixer=rr=%.3f:gg=%.3f:bb=%.3f' % g if g else ''
        fc.append('[%d:v]%s,scale=%d:%d,fps=%d,trim=end_frame=%d,setpts=PTS-STARTPTS%s,format=rgba[c]' % (k, TM, RW, RH, FPS, e['f'], gf))
        fc.append('[%d:v]format=gray,fps=%d,trim=end_frame=%d,setpts=PTS-STARTPTS[m]' % (k + 1, FPS, e['f']))
        fc.append('[c][m]alphamerge[ca];[tb][ca]overlay=format=auto[comp]'); last = 'comp'
    if e.get('zoom'):                                      # zoom fuerte a la cara del cliente desde zt segundos
        zt, cx, cy = e['zoom']
        z = "if(lt(it\\,%.3f)\\,1\\,1+0.30*min(1\\,(it-%.3f)/0.7))" % (zt, zt)
        fc.append("[%s]zoompan=z='%s':x='max(0\\,min(iw-iw/zoom\\,iw*%.2f-iw/zoom/2))':y='max(0\\,min(ih-ih/zoom\\,ih*%.2f-ih/zoom/2))':d=1:s=%dx%d:fps=%d,format=yuv420p[v]" % (last, z, cx, cy, W, H, FPS))
    else:
        fc.append('[%s]scale=%d:%d:flags=lanczos,format=yuv420p[v]' % (last, W, H))
    run([FF, '-v', 'error', '-y'] + a + ['-filter_complex', ';'.join(fc), '-map', '[v]', '-frames:v', str(e['f']), '-r', str(FPS), '-c:v', 'libx264', '-crf', '14', '-preset', 'medium', out])
    return out

# ---------------- gráficos ----------------
SF = os.path.expanduser('~/Proyectos/amin/trabajos/sala/'); SEQ = os.path.expanduser('~/Library/Fonts/Sequel Sans Heavy Disp.otf')
ROJO, AZUL, BLANCO, NEGRO = (255, 95, 87), (58, 134, 255), (255, 255, 255), (14, 15, 20)
_f = {}
def font(p, s):
    k = (p, int(s))
    if k not in _f: _f[k] = ImageFont.truetype(p, int(s))
    return _f[k]
FM, FB = SF + 'SFPRODISPLAYMEDIUM.OTF', SF + 'SFPRODISPLAYBOLD.OTF'
cl = lambda x: max(0.0, min(1.0, x)); eo = lambda x: 1 - (1 - cl(x)) ** 3
def back(x): x = cl(x); c = 1.70158; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2

g = {e['n']: e['g0'] for e in ESC}
# subtítulos: (desde, hasta, [(texto, aparece, estilo)]) · estilo: n = relleno, R/B/W = palabra especial roja/azul/blanca, s = cola pequeña
SUBS = [
    (0.20, 2.15, [('¿Lunes?', 0.25, 'n'), ('Nada de', 1.15, 'n'), ('PAN', 1.42, 'R')]),
    (2.40, 3.30, [('¿Martes?', 2.45, 'n'), ('Nada de', 3.05, 'n')]),
    (4.05, 5.45, [('¿Cómo me voy a poner?', 4.12, 'n')]),
    (5.65, 8.70, [('¿Miércoles?', 5.70, 'n'), ('Nada de', 7.10, 'n'), ('salir a cenar', 7.38, 'R'), ('afuera con amigos', 7.90, 's')]),
    (8.90, 10.02, [('Les digo que', 8.95, 'n'), ('NO', 9.27, 'W')]),
    (10.25, 12.25, [('¿Jueves?', 10.30, 'n'), ('MANZANA', 11.06, 'B'), ('para cenar', 11.46, 's')]),
    (12.40, 13.12, [('Muy bien.', 12.45, 'n')]),
    (15.82, 18.10, [('¿Pero qué haces?', 15.87, 'n')]),
]
PINT = (3.30, 4.05)                                   # inserto de la pintura sobre «chocolate»
DIAS = [('LUN', 0.25, 1.75, None), ('MAR', 2.45, 3.85, None), ('MIÉ', 5.70, 8.62, None), ('JUE', 10.30, None, 12.10)]
FINAL_X = 17.95                                        # el ✓ del jueves se vuelve ✕ al pillarle
SEGUIR, SIGUIENDO = 18.20, 18.65
pint = Image.open(os.path.join(HERE, 'assets', 'pintura.png')).convert('RGBA').resize((W, H))

def sombra(img, xy, txt, f, fill, anchor='mm', r=8, a=170):
    lay = Image.new('RGBA', img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    d.text((xy[0], xy[1] + 4), txt, font=f, fill=(0, 0, 0, a), anchor=anchor); lay = lay.filter(ImageFilter.GaussianBlur(r))
    img.alpha_composite(lay); ImageDraw.Draw(img).text(xy, txt, font=f, fill=fill, anchor=anchor)

def semana(img, t):
    pw, ph, gap = 196, 78, 18; x0 = (W - (4 * pw + 3 * gap)) / 2; y0 = 150
    lay = Image.new('RGBA', (W * 2, 260 * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(lay, 'RGBA')
    for i, (nom, on, x_t, ok_t) in enumerate(DIAS):
        x = (x0 + i * (pw + gap)) * 2; y = 30 * 2
        lit = t >= on; tach = x_t is not None and t >= x_t; ok = ok_t is not None and t >= ok_t and t < FINAL_X; fin = ok_t is not None and t >= FINAL_X
        pop = 1 + 0.18 * (1 - eo((t - on) / 0.25)) if 0 <= t - on < 0.25 else 1
        if tach or fin: fondo, borde, tc = (40, 18, 18, 230), ROJO + (255,), (255, 255, 255, 150)
        elif ok: fondo, borde, tc = AZUL + (255,), BLANCO + (255,), BLANCO + (255,)
        elif lit: fondo, borde, tc = BLANCO + (245,), BLANCO + (255,), NEGRO + (255,)
        else: fondo, borde, tc = (14, 15, 20, 150), (255, 255, 255, 90), (255, 255, 255, 170)
        cx, cy = x + pw, y + ph; hw, hh = pw * pop, ph * pop
        d.rounded_rectangle((cx - hw, cy - hh, cx + hw, cy + hh), int(hh), fill=fondo, outline=borde, width=4)
        d.text((cx, cy + 2), nom, font=font(FB, 40 * 2 * pop), fill=tc, anchor='mm')
        for tt, col in (([x_t] if x_t else []) + ([FINAL_X] if fin else []), ROJO),:
            for ts in tt:
                if t >= ts:                             # ✕ que se dibuja en 0,15 s
                    u = eo((t - ts) / 0.15); r = 30 * 2
                    d.line((cx - r, cy - r, cx - r + 2 * r * u, cy - r + 2 * r * u), fill=col + (255,), width=12)
                    if u > 0.5: d.line((cx + r, cy - r, cx + r - 2 * r * (u - 0.5) * 2, cy - r + 2 * r * (u - 0.5) * 2), fill=col + (255,), width=12)
        if ok:
            u = eo((t - ok_t) / 0.2); d.line((cx - 30, cy + 2, cx - 8, cy + 26, cx + 40, cy - 26), fill=BLANCO + (int(255 * u),), width=12, joint='curve')
    lay = lay.resize((W, 260), Image.LANCZOS); a = eo((t - 0.1) / 0.25)
    if a < 1: lay.putalpha(lay.getchannel('A').point(lambda v: int(v * a)))
    img.alpha_composite(lay, (0, 120))

def subtitulos(img, t):
    for t0, t1, parts in SUBS:
        if not (t0 <= t < t1): continue
        fo = 1 - cl((t - (t1 - 0.12)) / 0.12)
        rel = [(p, ts) for p, ts, s in parts if s == 'n' and t >= ts]
        esp = [(p, ts, s) for p, ts, s in parts if s in 'RBW' and t >= ts]
        cola = [(p, ts) for p, ts, s in parts if s == 's' and t >= ts]
        y = 1330
        if rel:
            txt = ' '.join(p for p, _ in rel); a = eo((t - rel[-1][1]) / 0.12)
            lay = Image.new('RGBA', img.size, (0, 0, 0, 0)); sombra(lay, (W / 2, y), txt, font(FB, 58), BLANCO + (255,))
            if fo < 1: lay.putalpha(lay.getchannel('A').point(lambda v: int(v * fo)))
            img.alpha_composite(lay); y += 92
        for p, ts, s in esp:
            u = back((t - ts) / 0.22); col = {'R': ROJO, 'B': AZUL, 'W': BLANCO}[s]
            size = (132 if len(p) <= 8 else 104) * (0.8 + 0.2 * u)
            lay = Image.new('RGBA', img.size, (0, 0, 0, 0)); sombra(lay, (W / 2, y + 20), p, font(SEQ, size), col + (255,), r=10, a=200)
            f2 = cl((t - ts) / 0.08) * fo
            if f2 < 1: lay.putalpha(lay.getchannel('A').point(lambda v: int(v * f2)))
            img.alpha_composite(lay); y += 150
        for p, ts in cola:
            lay = Image.new('RGBA', img.size, (0, 0, 0, 0)); sombra(lay, (W / 2, y), p, font(FM, 48), BLANCO + (255,))
            if fo < 1: lay.putalpha(lay.getchannel('A').point(lambda v: int(v * fo)))
            img.alpha_composite(lay)

def seguir(img, t):
    if t < SEGUIR: return
    u = back((t - SEGUIR) / 0.25); w, h = 640, 96; s = 0.85 + 0.15 * u
    lay = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(lay, 'RGBA')
    d.rounded_rectangle((0, 0, w * 2 - 1, h * 2 - 1), h, fill=(255, 255, 255, 245))
    d.text((44, h), '@alvarocabrerafitness', font=font(FB, 52), fill=NEGRO + (255,), anchor='lm')
    sig = t >= SIGUIENDO; bw = 260 if sig else 200
    d.rounded_rectangle((w * 2 - bw - 18, 22, w * 2 - 18, h * 2 - 22), 70, fill=(NEGRO if sig else AZUL) + (255,))
    d.text((w * 2 - bw / 2 - 18, h), 'Siguiendo' if sig else 'Seguir', font=font(FB, 48), fill=BLANCO + (255,), anchor='mm')
    lay = lay.resize((int(w * s), int(h * s)), Image.LANCZOS)
    img.alpha_composite(lay, (int(W / 2 - lay.width / 2), int(1560 - lay.height / 2)))

def grafico(i):
    t = i / FPS; img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    if PINT[0] <= t < PINT[1]:
        u = (t - PINT[0]) / (PINT[1] - PINT[0]); sc = 1.0 + 0.05 * u
        p = pint.resize((int(W * sc), int(H * sc)), Image.BILINEAR).crop((int(W * (sc - 1) / 2), int(H * (sc - 1) / 2), int(W * (sc - 1) / 2) + W, int(H * (sc - 1) / 2) + H))
        a = cl((t - PINT[0]) / 0.1)
        if a < 1: p.putalpha(p.getchannel('A').point(lambda v: int(v * a)))
        img.alpha_composite(p)
        lay = Image.new('RGBA', img.size, (0, 0, 0, 0)); sombra(lay, (W / 2, 1420), 'CHOCOLATE', font(SEQ, 124), ROJO + (255,), r=10, a=210); img.alpha_composite(lay)
    semana(img, t); subtitulos(img, t); seguir(img, t)
    return img

# ---------------- sonido ----------------
VOZ = [(0.0, 171.55, 2.20), (2.2, 398.95, 1.85), (4.05, 376.33, 1.47), (5.5, 532.97, 3.35), (8.75, 559.78, 1.29),
       (g['jueves'], 665.38, 2.25), (g['jueves'] + 2.25, 656.05, 0.85), (g['cocina'], 865.2, 2.5), (g['remate'], 891.05, TOTAL - g['remate'])]
SFX = [(t, 'sub-bass-hit.mp3', -10, 0.9) for t in (1.15, 3.05, 7.10)] + [(FINAL_X, 'sub-bass-hit.mp3', -8, 1.2)] + \
      [(t, 'pop-up-sfx.mp3', -14, 0.5) for t in (0.25, 1.75, 2.45, 3.85, 5.70, 8.62, 10.30, 12.10)] + \
      [(SEGUIR, 'pop-up-sfx.mp3', -12, 0.5), (SIGUIENDO, 'pop-up-sfx.mp3', -12, 0.5), (3.26, 'swhoosh.mp3', -14, 0.6)]

def audio(out):
    a, fc = [], []
    for k, (g0, s, d) in enumerate(VOZ):
        a += ['-ss', '%.3f' % s, '-t', '%.3f' % d, '-i', RAW]
        fc.append('[%d:a]aformat=sample_rates=48000:channel_layouts=stereo,afade=t=in:d=0.02,afade=t=out:st=%.3f:d=0.03,adelay=%d|%d[v%d]' % (k, d - 0.03, int(g0 * 1000), int(g0 * 1000), k))
    n = len(VOZ)
    fc.append(''.join('[v%d]' % k for k in range(n)) + 'amix=inputs=%d:normalize=0,highpass=f=80,afftdn=nf=-50,acompressor=threshold=0.05:ratio=3:attack=5:release=120,loudnorm=I=-16:TP=-2:LRA=7,apad=whole_dur=%.3f[voz]' % (n, TOTAL))
    OFF = {'pop-up-sfx.mp3': 0.15, 'swhoosh.mp3': 0.40, 'sub-bass-hit.mp3': 0.0}   # silencio inicial de cada archivo (medido): el golpe cae en el fotograma
    for j, (t, f, db, d) in enumerate(SFX):
        a += ['-i', SND + f]; k = n + j; t = max(0.0, t - OFF.get(f, 0)); d = d + OFF.get(f, 0)
        fc.append('[%d:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:%.2f,afade=t=out:st=%.2f:d=0.1,volume=%ddB,adelay=%d|%d[s%d]' % (k, d, d - 0.1, db, int(t * 1000), int(t * 1000), j))
    fc.append('[voz]' + ''.join('[s%d]' % j for j in range(len(SFX))) + 'amix=inputs=%d:normalize=0:duration=first,alimiter=limit=0.89,loudnorm=I=-14:TP=-1.5:LRA=8[aout]' % (len(SFX) + 1))
    run([FF, '-v', 'error', '-y'] + a + ['-filter_complex', ';'.join(fc), '-map', '[aout]', '-t', '%.3f' % TOTAL, '-ar', '48000', out])

def _guardar(a):
    i, gd = a; grafico(i).save(os.path.join(gd, 'g_%04d.png' % i), compress_level=1)

if __name__ == '__main__':
    import multiprocessing as mp
    paso = sys.argv[3] if len(sys.argv) > 3 else 'todo'
    if paso in ('todo', 'escenas'):
        with mp.Pool(3) as p: outs = p.starmap(escena, list(enumerate(ESC)))
        open(os.path.join(WORK, 'lista.txt'), 'w').write(''.join("file '%s'\n" % o for o in outs))
        run([FF, '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', os.path.join(WORK, 'lista.txt'), '-c', 'copy', os.path.join(WORK, 'base.mp4')]); print('escenas ok')
    if paso in ('todo', 'graficos'):
        gd = os.path.join(WORK, 'graf'); os.makedirs(gd, exist_ok=True)
        with mp.Pool(4) as p: p.map(_guardar, [(i, gd) for i in range(int(round(TOTAL * FPS)))], chunksize=12)
        print('gráficos ok')
    if paso in ('todo', 'audio'): audio(os.path.join(WORK, 'audio.wav')); print('audio ok')
    if paso in ('todo', 'final'):
        run([FF, '-v', 'error', '-y', '-i', os.path.join(WORK, 'base.mp4'), '-framerate', str(FPS), '-i', os.path.join(WORK, 'graf', 'g_%04d.png'), '-i', os.path.join(WORK, 'audio.wav'),
             '-filter_complex', '[0:v][1:v]overlay=format=auto,format=yuv420p[v]', '-map', '[v]', '-map', '2:a', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', OUTV])
        print('final ok →', OUTV, '%.2f s' % TOTAL)
