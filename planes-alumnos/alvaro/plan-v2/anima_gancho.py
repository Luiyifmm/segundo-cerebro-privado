# Prueba animada del gancho + lunes (0–2,6 s) del plan v2 de Álvaro. Es una PRUEBA: sale un mp4 aparte, no toca Premiere.
# Uso: <python del entorno whisperx> anima_gancho.py <base.mp4 sin gráficos> <bruto.mp4> <carpeta de trabajo> <salida.mp4>
import os, sys, math, subprocess
import numpy as np
from multiprocessing import Pool
BASE, BRUTO, WORK, SAL = sys.argv[1:5]; os.makedirs(WORK + '/fr', exist_ok=True); os.makedirs(WORK + '/an', exist_ok=True)
AQUI = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(AQUI, 'diseno.py'), encoding='utf-8').read().split('def base(')[0]      # reutiliza cristal, cuadros, emoji, texto…
exec(src.replace('SRC, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)', ''))   # sin tocar sys.argv: los procesos hijos lo vuelven a leer
FPS, N = 30, 78; PAN = '🥖'
SFXD = os.path.expanduser('~/EDICION/editing luiyi pack/Efectos de sonido/00 FAVORITOS/')
# (momento en el vídeo, archivo, punto del archivo que debe caer en ese momento, nivel de pico en dB)
SFX = [(0.03, 'Sub Bass Drop 1.wav', 0.117, -10), (0.12, 'Whoosh Deep Short.wav', 0.257, -13), (0.27, 'Ui button.wav', 0.059, -18),
       (1.20, 'Cinematic Fast Whoosh.wav', 0.546, -13), (1.50, 'Impact Normal.mp3', 0.052, -8), (2.00, 'Simple Whoosh.wav', 0.700, -15), (2.133, 'Smooth Pop.wav', 0.013, -12)]
VOZ = [(0.0, 171.55, 2.20), (2.2, 398.95, 0.45)]

eo = lambda p: 1 - (1 - min(1, max(0, p))) ** 3
eio = lambda p: (lambda p: 3 * p * p - 2 * p * p * p)(min(1, max(0, p)))
lerp = lambda a, b, p: a + (b - a) * p
X0 = (1080 - (4 * LADO + 3 * HUECO)) // 2

def cuadro_uno(img, i, activo, dentro, dy=0):
    x = X0 + i * (LADO + HUECO); box = (x, Y0 + dy, x + LADO, Y0 + dy + LADO)
    if i == activo:
        sombra_caja(img, box, 42, fuerza=130, blur=20); ImageDraw.Draw(img).rounded_rectangle(box, 42, fill=(250, 250, 250))
    else: cristal(img, box, 42, claro=0.12, borde=120, sombra=False)
    d = ImageDraw.Draw(img); d.text((x + LADO / 2, Y0 + dy + 32), DIAS[i], font=F(BOLD, 28), fill=(20, 20, 24) if i == activo else (255, 255, 255), anchor='mm')
    if i in dentro:
        e, marca = dentro[i]; im = emoji(e, 92); img.paste(im, (x + (LADO - 92) // 2, Y0 + dy + 62), im)
        (prohibido if marca == 'x' else visto)(ImageDraw.Draw(img), x + LADO - 40, Y0 + dy + LADO - 38, 19, 6)
    elif i == activo: d.rounded_rectangle((x + 46, Y0 + dy + 66, x + LADO - 46, Y0 + dy + 150), 22, outline=(205, 205, 210), width=3)

def ventana2(img, centro, lado, e, sello, giro, puntos, ancla):
    """Como ventana() del diseño, con tamaño libre, sello opcional (0 = sin sello; >0 = escala del sello) y puntos opcionales."""
    cx, cy = int(centro[0]), int(centro[1]); lado = int(lado); pad = 70; L = lado + 2 * pad
    capa = Image.new('RGB', (L, L)); capa.paste(img.crop((cx - L // 2, cy - L // 2, cx + L // 2, cy + L // 2)))
    cristal(capa, (pad, pad, pad + lado, pad + lado), int(lado * .19), claro=0.26, borde=210)
    em = emoji(e, max(8, int(lado * .62))); capa.paste(em, (pad + (lado - em.size[0]) // 2, pad + (lado - em.size[1]) // 2 - int(lado * .02)), em)
    if sello > 0:
        R = int(lado * .15 * sello); mx, my = pad + lado - int(lado * .15) - 4, pad + lado - int(lado * .15) - 4
        prohibido(ImageDraw.Draw(capa), mx, my, R, max(6, R // 3))
    m = rrmask((L, L), (pad - 34, pad - 34, pad + lado + 34, pad + lado + 56), 80).filter(ImageFilter.GaussianBlur(14))
    rot = capa.convert('RGBA'); rot.putalpha(m); rot = rot.rotate(giro, resample=Image.BICUBIC)
    if puntos > 0:
        o = img.copy(); d2 = ImageDraw.Draw(o); ax, ay = ancla
        for k, r in ((0.30, 13), (0.58, 9), (0.82, 6)):
            ex, ey = cx + (ax - cx) * 0.55, cy + (ay - cy) * 0.55; px, py = ex + (ax - ex) * k, ey + (ay - ey) * k; d2.ellipse((px - r, py - r, px + r, py + r), fill=(255, 255, 255))
        img.paste(Image.blend(img, o, puntos))
    img.paste(rot, (cx - L // 2, cy - L // 2), rot)

def cuadro(f):
    im = Image.open('%s/fr/b_%03d.png' % (WORK, f)).convert('RGB')
    # 1 · zoom out + enfoque (f0–f8)
    p = eo(f / 8); z = lerp(1.3, 1.0, p)
    if z > 1.001:
        w, h = 1080 / z, 1920 / z; x0, y0 = (1080 - w) / 2, (1920 - h) * 0.56
        im = im.resize((1080, 1920), Image.BICUBIC, box=(x0, y0, x0 + w, y0 + h))
    if p < 1: im = im.filter(ImageFilter.GaussianBlur(11 * (1 - p)))
    # 2 · cuadrados: entran de izquierda a derecha, bajando 16 px, 5 fotogramas cada uno
    activo = 0 if f < 66 else 1; dentro = {0: (PAN, 'x')} if f >= 64 else {}
    for i in range(4):
        q = eo((f - (5 + 2 * i)) / 5)
        if q <= 0: continue
        c = im.copy(); cuadro_uno(c, i, activo, dentro, dy=int(-16 * (1 - q))); im = Image.blend(im, c, q) if q < 1 else c
    # 3 · ventana flotante: sale del cuaderno (f34–f40), se sella al decir «pan» (f45), vuela al cuadrado de LUN (f56–f64)
    ancla = (880, 770); reposo = (540, 650); hueco = (X0 + LADO // 2, Y0 + 108)
    if 34 <= f < 64:
        if f < 56:
            a = eo((f - 34) / 6); cen = (lerp(ancla[0], reposo[0], a), lerp(ancla[1], reposo[1], a)); lado = lerp(60, 320, a); alfa = a; giro = lerp(-14, -4, a)
            sello = 0 if f < 45 else lerp(1.5, 1.0, eo((f - 45) / 3)); puntos = a * (1 - eo((f - 50) / 5))
        else:
            b = eio((f - 56) / 8); cen = (lerp(reposo[0], hueco[0], b), lerp(reposo[1], hueco[1], b) - 60 * math.sin(math.pi * b)); lado = lerp(320, 120, b); alfa = 1; giro = lerp(-4, 0, b); sello = 1; puntos = 0
        c = im.copy(); ventana2(c, cen, lado, PAN, sello, giro, puntos, ancla); im = Image.blend(im, c, alfa) if alfa < 1 else c
    # 4 · texto
    def capa_texto(rel, esp, col, y, tam, alfa):
        nonlocal im
        if alfa <= 0: return
        c = im.copy(); texto(c, rel, esp, col, y=y, tam=tam); im = Image.blend(im, c, alfa) if alfa < 1 else c
    if 9 <= f < 31: capa_texto(None, '¿LUNES?', (245, 242, 235), 1100, 96, min(eo((f - 9) / 3), 1 - eo((f - 28) / 3)))
    if 34 <= f < 66:
        if f < 45: capa_texto('Nada de', None, None, 1075, 128, eo((f - 34) / 3))
        else: capa_texto('Nada de', 'PAN', ROJO, 1075, int(lerp(150, 128, eo((f - 45) / 3))), 1)
    if f >= 74: capa_texto(None, '¿MARTES?', (245, 242, 235), 1560, 96, eo((f - 74) / 3))
    im.save('%s/an/a_%03d.png' % (WORK, f)); return f

def leer(path, ss=None, t=None):
    c = ['ffmpeg', '-v', 'error'] + (['-ss', str(ss)] if ss is not None else []) + (['-t', str(t)] if t else []) + ['-i', path, '-ac', '1', '-ar', '48000', '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(c, capture_output=True).stdout, dtype=np.float32).copy()

def audio():
    n = int(N / FPS * 48000); voz = np.zeros(n, np.float32)
    for t0, s, d in VOZ:
        c = ['ffmpeg', '-v', 'error', '-ss', str(s), '-t', str(d), '-i', BRUTO, '-af', 'highpass=f=90,afftdn=nf=-50', '-ac', '1', '-ar', '48000', '-f', 'f32le', '-']
        a = np.frombuffer(subprocess.run(c, capture_output=True).stdout, dtype=np.float32).copy(); i = int(t0 * 48000); a = a[:n - i]; k = min(480, len(a) // 2)
        a[:k] *= np.linspace(0, 1, k); a[-k:] *= np.linspace(1, 0, k); voz[i:i + len(a)] += a
    voz *= 10 ** (-3 / 20) / (np.abs(voz).max() + 1e-9)                                     # la voz, a −3 dB de pico
    mez = voz.copy()
    for t, fn, anc, db in SFX:
        a = leer(SFXD + fn); a *= 10 ** (db / 20) / (np.abs(a).max() + 1e-9); ini = t - anc
        if fn.startswith('Sub Bass'): a = a[:int(0.85 * 48000)]; a[-16800:] *= np.linspace(1, 0, 16800)   # la cola grave no debe tapar «¿Lunes?»
        if ini < 0: a = a[int(-ini * 48000):]; ini = 0; a[:240] *= np.linspace(0, 1, 240)
        i = int(ini * 48000); a = a[:n - i]; a[-2400:] *= np.linspace(1, 0, min(2400, len(a)))[-len(a[-2400:]):]; mez[i:i + len(a)] += a
    mez = np.tanh(mez * 0.9) / 0.9 * 0.89
    import wave
    w = wave.open(WORK + '/audio.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(48000); w.writeframes((np.clip(mez, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()

if __name__ == '__main__':
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', BASE, '-frames:v', str(N), '-start_number', '0', WORK + '/fr/b_%03d.png'], check=True)
    with Pool(6) as p: p.map(cuadro, range(N))
    audio()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', WORK + '/an/a_%03d.png', '-i', WORK + '/audio.wav', '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', SAL], check=True)
    print('ok', SAL)
