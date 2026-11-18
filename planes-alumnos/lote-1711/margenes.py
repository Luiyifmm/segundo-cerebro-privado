# Márgenes de Instagram Reels (Luis, 18-11: «ten cuidado con los márgenes de Instagram»). Sin tokens: lee el spec y calcula cajas.
# Zonas que tapa la interfaz en 1080x1920: arriba < 240 (cabecera), abajo > 1580 (texto del post, música, botones),
# derecha > 960 entre y 900 y 1700 (columna de iconos: me gusta, comentar, compartir). Los b-roll a pantalla completa no cuentan.
# Uso: python3 margenes.py [carpeta ...]   (sin argumentos: todo el lote)
import json, os, sys, math
LOTE = os.path.dirname(os.path.abspath(__file__))
ARR, ABA, DER, DER_Y = 240, 1580, 975, (900, 1700)
def cajas(S):
    out = []; st = S.get('subs_tam', [52, 118]); y = S.get('sub_y', 1430)
    if S.get('frases'): w_ = S.get('subs_ancho', 940) / 2; out.append(('subtítulos', (540 - w_, y - st[0] * .7, 540 + w_, y + st[1] * .78 + st[1] * .55)))
    for e in S.get('elementos', []):
        t = e['tipo']; nombre = t + ' ' + str(e.get('texto', e.get('linea1', e.get('titulo', ''))))[:28]
        if t == 'titulo': yy = e.get('y', 260); out.append((nombre, (110, yy, 970, yy + (70 if e.get('linea1') else 0) + (130 if e.get('linea2') else 0) + 50)) if e.get('x', 540) == 540 else (nombre, (0, 0, 0, 0)))
        elif t == 'tarjeta':
            x, yy = e.get('x', 540), e.get('y', 330); L = e.get('lado', 300)
            if x == 'auto' or yy == 'auto': continue
            out.append((nombre, (x - L / 2, yy - L / 2, x + L / 2, yy + L / 2 + (L * .4 + 70 if e.get('suelta') else 0))))
        elif t == 'pill':
            x, yy = e.get('x', 540), e.get('y', 600); w = len(e.get('texto', '')) * e.get('tam', 46) * .55 + 140
            if x == 'auto' or yy == 'auto': continue
            out.append((nombre, (x - w / 2, yy - 55, x + w / 2, yy + 55)))
        elif t == 'pildoras':
            yy = e.get('mover', [0, e.get('y', 250)])[1] if e.get('mover') else e.get('y', 250); n = len(e['items'])
            w = max(len(i['texto']) for i in e['items']) * e.get('tam', 42) * .55 + 190
            x1 = 540 + w / 2 if (e.get('ui') or e.get('lado') == 'centro') else (1040 if e.get('lado', 'der') == 'der' else 40 + w)
            out.append((nombre, (x1 - w, e.get('y', 250), x1, e.get('y', 250) + (n - 1) * (122 if e.get('ui') else 124) + 100)))
            if e.get('mover'): out.append((nombre + ' (tras mover)', (x1 - w, yy, x1, yy + (n - 1) * 122 + 100)))
        elif t == 'columnas':
            yy = e.get('y', 1060); AN = e.get('ancho', 1000); out.append((nombre, ((1080 - AN) / 2, yy - (110 if e.get('titulo') else 0), (1080 + AN) / 2, yy + e.get('alto', 800))))
        elif t == 'cta': yy = e.get('y', 1220); out.append((nombre, (110, yy, 970, yy + 190)))
        elif t == 'texto': yy = e.get('y', 330); w_ = min(960, max(len(l) * (e.get('tam_esp', 96) if l.startswith('*') else e.get('tam', 58)) * .5 for l in e['lineas'])) / 2; out.append((nombre, (540 - w_, yy - 50, 540 + w_, yy + sum((e.get('tam_esp', 96) if l.startswith('*') else e.get('tam', 58)) * 1.25 for l in e['lineas']))))
        elif t == 'calendario':
            n = e.get('dias', 21); AN = e.get('ancho', 1000); L = (AN - 72) / 7; yy = e.get('y', 300)
            out.append((nombre, ((1080 - AN) / 2, yy - 110, (1080 + AN) / 2, yy + math.ceil(n / 7) * (L + 12))))
            for it in e.get('orbita', []): out.append(('  órbita ' + it.get('texto', ''), (it['x'] - it.get('lado', 170) / 2, it['y'] - it.get('lado', 170) / 2, it['x'] + it.get('lado', 170) / 2, it['y'] + it.get('lado', 170) / 2 + 50)))
        elif t == 'color': yy = e.get('y', 70); out.append((nombre, (60, yy, 1020, yy + (540 if e.get('img') else 430))))
        elif t == 'mensaje': x, yy = 540, e.get('y', 330); out.append((nombre, (x - e.get('ancho', 900) / 2, yy, x + e.get('ancho', 900) / 2, yy + 330)))
        elif t == 'broll':
            if e.get('etiquetas'): yy = e.get('y_etiquetas', 1430); out.append((nombre + ' etiquetas', (200, yy, 880, yy + (len(e['etiquetas']) - 1) * 122 + 100)))
            if e.get('texto_grande'): tg = e['texto_grande']; yy = tg.get('y', 1250); k = tg.get('tam', 120); w_ = min(960, len(tg['texto']) * k * .58) / 2; out.append((nombre + ' texto', (540 - w_, yy - k * (1.4 if tg.get('arriba') else .6), 540 + w_, yy + k * .6)))
        if t in ('tarjeta',) and e.get('orbita'):
            for it in e['orbita']: out.append(('  órbita ' + it.get('texto', ''), (it['x'] - it.get('lado', 170) / 2, it['y'] - it.get('lado', 170) / 2, it['x'] + it.get('lado', 170) / 2, it['y'] + it.get('lado', 170) / 2 + 50)))
    return out
dirs = sys.argv[1:] or sorted(d for d in os.listdir(LOTE) if os.path.exists(os.path.join(LOTE, d, 'spec.json')))
total = 0
for d in dirs:
    S = json.load(open(os.path.join(LOTE, d, 'spec.json'))); malos = []
    for n, (x0, y0, x1, y1) in cajas(S):
        p = []
        if y0 < ARR: p.append('arriba %d' % y0)
        if y1 > ABA: p.append('abajo %d' % y1)
        if x1 > DER and y1 > DER_Y[0] and y0 < DER_Y[1]: p.append('iconos derecha x=%d' % x1)
        if p: malos.append('%s: %s' % (n, ', '.join(p)))
    total += len(malos); print('%-15s %s' % (d, 'OK' if not malos else '%d fuera de margen' % len(malos)))
    for m in malos: print('    ', m)
print('total', total)
