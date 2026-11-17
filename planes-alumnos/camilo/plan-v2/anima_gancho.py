# Gancho animado de Camilo (0–9,4 s del corte) según el diseño aprobado el 16-11. Prueba en un mp4 aparte: no toca Premiere.
# Uso: <python del entorno whisperx> anima_gancho.py <carpeta de trabajo>
import os, sys, re, math, subprocess
import numpy as np
from multiprocessing import Pool
AQUI = os.path.dirname(os.path.abspath(__file__)); WORK = sys.argv[1]
for d in ('fr', 'an'): os.makedirs(os.path.join(WORK, d), exist_ok=True)
src = open(os.path.join(AQUI, 'diseno.py'), encoding='utf-8').read()
_argv = sys.argv; sys.argv = [_argv[0], WORK, os.path.join(WORK, '_d')]
exec(src.split('\nP = []')[0]); sys.argv = _argv                                     # cristal, emoji, sub, nombre, tarjeta_foto, zoom, colores y fuentes
BRUTO = os.path.expanduser('~/EDICION/3 PROYECTOS/Alumnos Trainer10x/MEDIA/Camilo Arias/Camilo - sentadillas ciclista.mov')
TRAMOS = [(7.933, 10.733), (10.767, 11.7), (13.567, 17.0), (17.0, 18.8), (34.7, 35.13)]
FPS = 30; N = 282                                                   # 9,4 s
eo = lambda p: 1 - (1 - min(1, max(0, p))) ** 3
lerp = lambda a, b, p: a + (b - a) * p
F_ = lambda t: int(round(t * FPS))
T_ZOOM, T_FOTO = 4.32, 5.10

def foto(z, seed):
    """La foto del ciclista a pantalla completa: contraste, tono cálido, brillo en las luces, viñeta y grano que cambia en cada fotograma."""
    f = Image.open(FOTO).convert('RGB'); fw, fh = f.size; cw = int(fh * 9 / 16); x0 = (fw - cw) // 2
    w, h = cw / z, fh / z; im = f.resize((1080, 1920), Image.BICUBIC, box=(x0 + (cw - w) / 2, (fh - h) * .35, x0 + (cw + w) / 2, (fh - h) * .35 + h))
    a = np.asarray(im).astype(np.float32) / 255
    a = np.clip((a - .5) * 1.12 + .5, 0, 1) * np.array([1.0, 0.98, 0.94])
    lum = a.mean(2); br = np.asarray(Image.fromarray((np.clip(lum - .62, 0, 1) / .38 * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(40))).astype(np.float32)[..., None] / 255
    a = 1 - (1 - a) * (1 - br * .35)
    yy, xx = np.mgrid[0:1920, 0:1080]; r = np.sqrt(((xx - 540) / 620) ** 2 + ((yy - 900) / 1050) ** 2)
    a *= (1 - np.clip((r - .30) / .9, 0, 1) ** 1.3 * .80)[..., None]
    g = np.random.default_rng(seed).normal(0, 1, (1920, 1080)).astype(np.float32)
    g = np.asarray(Image.fromarray(((g * 40) + 128).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.7))).astype(np.float32) / 255 - .5
    return Image.fromarray((np.clip(a + g[..., None] * .26, 0, 1) * 255).astype(np.uint8))

def mezcla(im, c, a): return c if a >= 1 else (im if a <= 0 else Image.blend(im, c, a))

def cuadro(f):
    t = f / FPS
    if t < T_FOTO:
        im = Image.open('%s/fr/b_%03d.png' % (WORK, f)).convert('RGB')
        p = eo(f / 8); z = lerp(1.3, 1.0, p) if t < T_ZOOM else lerp(1.0, 1.25, eo((f - F_(T_ZOOM) + 1) / 3))
        if z > 1.001: im = zoom(im, z, cx=0.5 if t < T_ZOOM else 0.22, cy=0.36 if t < T_ZOOM else 0.30)
        if p < 1: im = im.filter(ImageFilter.GaussianBlur(11 * (1 - p)))
        if t >= T_FOTO - 0.1: im = im.filter(ImageFilter.GaussianBlur(14 * eo((t - T_FOTO + 0.1) / 0.1)))     # sale desenfocado
        degradado(im)
        # nombre de Camilo: entra desde la izquierda a 0,2 s y se va a 3,1 s
        q = min(eo((t - 0.2) / 0.25), 1 - eo((t - 3.0) / 0.2))
        if q > 0: c = Image.new('RGB', im.size); c.paste(im); nombre(c); c = c.transform(c.size, Image.AFFINE, (1, 0, 0, 0, 1, 0)); im = mezcla(im, c, q)
        # tarjeta del velocista: entra a 0,6 s girando y subiendo; se va a 4,1 s
        if 0.6 <= t < 4.3:
            q = eo((t - 0.6) / 0.2); fuera = eo((t - 4.05) / 0.2)
            et = ('¿TE PONDRÁS ASÍ?', LIMA) if t < 3.25 else ('SPOILER: NO', NARANJA)
            et = et if t >= 1.0 else None
            dy = int(60 * (1 - q) - 900 * fuera); c = im.copy(); tarjeta_foto(c, (650, 110 + dy, 1010, 570 + dy), lerp(14, 6, q), et); im = mezcla(im, c, q)
        # textos
        def capa(fn):
            nonlocal im
            c = im.copy(); fn(c); return c
        if 0.7 <= t < 3.2:
            dichas = [w for w, s in (('¿Esto', .70), ('te', .96), ('va', 1.14), ('a', 1.20), ('pasar', 1.24), ('si', 1.50), ('haces', 1.58)) if t >= s]
            esp = 'SENTADILLAS?' if t >= 1.80 else None
            tam = int(lerp(150, 120, eo((t - 1.80) / 0.1))) if esp else 120
            im = mezcla(im, capa(lambda c: sub(c, ' '.join(dichas), esp, LIMA, tam=tam)), 1 - eo((t - 3.1) / 0.1))
        if 3.25 <= t < 4.25: im = capa(lambda c: sub(c, None, 'NO.', NARANJA, y=1500, tam=int(lerp(300, 230, eo((t - 3.25) / 0.1)))))
        if t >= 4.32: im = capa(lambda c: sub(c, 'estas', 'PIERNAS' if t >= 4.60 else None, LIMA, tam=int(lerp(150, 120, eo((t - 4.60) / 0.1)))))
    else:
        tf = t - T_FOTO; im = foto(lerp(1.06, 1.0, min(1, tf / 4.3)), f)
        if tf < 0.1: im = im.filter(ImageFilter.GaussianBlur(14 * (1 - tf / 0.1)))                       # entra desde el desenfoque
        d = ImageDraw.Draw(im)
        if t >= 5.5:   # la caja de selección se dibuja en 8 fotogramas
            q = eo((t - 5.5) / 0.27); sx0, sy0, sx1, sy1 = 300, 860, 640, 1300; d.rectangle((sx0, sy0, lerp(sx0, sx1, q), lerp(sy0, sy1, q)), outline=LIMA, width=5)
            if q >= 1:
                for cx, cy in ((sx0, sy0), (sx1, sy0), (sx0, sy1), (sx1, sy1)): d.rectangle((cx - 10, cy - 10, cx + 10, cy + 10), fill=LIMA)
        if t < 6.46:
            esp = 'CICLISTA DE PISTA' if t >= 5.52 else None
            sub(im, 'son de un', esp, LIMA, y=1500, tam=int(lerp(130, 110, eo((t - 5.52) / 0.1))) if esp else 110)
        elif t < 7.45:
            sub(im, 'ciclista de pista', 'PROFESIONAL', LIMA, y=1500, tam=int(lerp(130, 110, eo((t - 6.46) / 0.1))))
        else:
            sub(im, 'Robert', 'FÖRSTEMANN' if t >= 8.04 else None, LIMA, y=1500, tam=int(lerp(130, 110, eo((t - 8.04) / 0.1))))
        q = eo((t - 7.45) / 0.25)
        if q > 0:
            c = im.copy(); d = ImageDraw.Draw(c); x = int(lerp(-300, 100, q)); d.rounded_rectangle((x - 22, 1684, x - 14, 1764), 4, fill=LIMA)
            d.text((x, 1690), 'Robert Förstemann', font=F(BOLD_S, 40), fill=CREMA); d.text((x, 1740), 'velocista de pista · Alemania', font=F(MED_S, 26), fill=(200, 196, 186)); im = mezcla(im, c, q)
        ImageDraw.Draw(im).text((1040, 1890), 'Foto: Roth-Foto.de · CC BY-SA 3.0', font=F(MED_S, 18), fill=(200, 200, 200), anchor='rm')
    im.save('%s/an/a_%03d.png' % (WORK, f)); return f

def base():
    a, fc = [], []
    for k, (s, e) in enumerate(TRAMOS):
        a += ['-ss', '%.3f' % s, '-t', '%.3f' % (e - s), '-i', BRUTO]
        fc.append('[%d:v]scale=1080:1920,fps=%d,setpts=PTS-STARTPTS[v%d];[%d:a]aresample=48000,asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st=%.3f:d=0.01[a%d]' % (k, FPS, k, k, e - s - 0.01, k))
    fc.append(''.join('[v%d][a%d]' % (k, k) for k in range(len(TRAMOS))) + 'concat=n=%d:v=1:a=1[v][a]' % len(TRAMOS))
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + a + ['-filter_complex', ';'.join(fc), '-map', '[v]', '-map', '[a]', '-t', '%.3f' % (N / FPS), '-c:v', 'libx264', '-crf', '14', '-c:a', 'pcm_s16le', WORK + '/base.mov'], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', WORK + '/base.mov', '-frames:v', str(N), '-start_number', '0', WORK + '/fr/b_%03d.png'], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', WORK + '/base.mov', '-vn', '-af', 'highpass=f=80,afftdn=nf=-45,acompressor=threshold=0.06:ratio=3:attack=5:release=120,loudnorm=I=-16:TP=-2', '-ar', '48000', WORK + '/voz.wav'], check=True)

if __name__ == '__main__':
    base(); print('base ok', flush=True)
    with Pool(7) as p: p.map(cuadro, range(N), chunksize=4)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-start_number', '0', '-i', WORK + '/an/a_%03d.png', '-i', WORK + '/voz.wav',
                    '-c:v', 'libx264', '-crf', '15', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-shortest', WORK + '/gancho_voz.mp4'], check=True)
    print('ok', WORK + '/gancho_voz.mp4')
