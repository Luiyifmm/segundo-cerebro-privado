"""Subtítulos por SENTIDO, no cada N palabras (reglas de Luis + las de Amin).

Uso: python3 subtitulos.py PALABRAS.json FICHA.json SALIDA.json
  PALABRAS.json: {palabras:[{w,s,e}]} en tiempos del montaje (lo escribe montar.py).
  FICHA.json: la ficha de estilo (claves con su color, máx. de palabras, correcciones de texto).

Reglas:
- Se corta en punto, interrogación o exclamación; la coma es un buen sitio para cortar si el bloque ya tiene 2+ palabras.
- Máximo `max_palabras` por bloque (4 por defecto) y pausa > 0,35 s = bloque nuevo.
- Nunca acabar un bloque en conector (de, la, que, y, ni, se, le…): pasa al bloque siguiente.
- Palabra clave: solo si es la ÚLTIMA del bloque y nunca sola; si quedaría sola, se queda como texto normal.
- Bloques de menos de 0,45 s: se evitan al repartir; si aun así queda alguno, el siguiente entra un poco después (≤ 0,3 s).
- El reparto automático busca la mejor partición entre todas (no corta de izquierda a derecha): 30-10-2026.
- `correcciones` arregla lo que el transcriptor oye mal o una elisión al hablar («mira los ojos» → «mira a los ojos»);
  nunca cambia cifras ni el sentido.
"""
import json, re, sys

CONECTORES = {'de', 'del', 'la', 'las', 'el', 'los', 'lo', 'que', 'y', 'e', 'o', 'u', 'ni', 'se', 'le', 'les', 'a', 'al', 'en', 'con',
              'por', 'para', 'un', 'una', 'unos', 'unas', 'tu', 'tus', 'mi', 'mis', 'su', 'sus', 'es', 'muy', 'sin', 'como', 'cuando', 'si', 'te', 'me'}
limpia = lambda w: re.sub(r'[^\wáéíóúüñÁÉÍÓÚÜÑ%]', '', w).lower()


FIN_FRASE = re.compile(r'[.?!…]$')
# Palabras que piden la siguiente («muy poca gente», «tu buena voluntad»): se puede cortar detrás, pero cuesta.
DEBILES = {'muy', 'tan', 'más', 'menos', 'poca', 'poco', 'pocas', 'pocos', 'mucha', 'mucho', 'muchas', 'muchos', 'buena', 'buen',
           'buenas', 'buenos', 'mala', 'mal', 'cada', 'todo', 'toda', 'todos', 'todas', 'otro', 'otra', 'este', 'esta', 'ese', 'esa',
           'solo', 'sólo', 'nuestro', 'nuestra', 'vuestro', 'vuestra', 'cuál', 'qué'}


def _particion(pal, maxp, claves):
    """Reparto óptimo en bloques (programación dinámica sobre todas las particiones posibles).
    Duras: máximo `maxp` palabras y nunca acabar en conector (salvo al final de todo).
    Costes: cortar a mitad de frase, frases o pausas dentro de un bloque, bloques de una palabra
    y bloques que se verían menos de 0,45 s. Sustituye al reparto voraz, que fallaba 5 de 7 casos
    de la regresión de Claude 2 (30-10-2026)."""
    n = len(pal)
    INF = float('inf')
    # Fin de frase: puntuación, o la palabra siguiente empieza en mayúscula (Whisper a veces pone coma donde hay punto).
    fin_frase = [bool(FIN_FRASE.search(p['w'])) or (k + 1 < n and p['w'].endswith(',') and pal[k + 1]['w'][:1].isupper())
                 for k, p in enumerate(pal)]
    mejor, corte = [INF] * (n + 1), [n] * (n + 1)
    mejor[n] = 0.0
    for i in range(n - 1, -1, -1):
        for j in range(i + 1, min(n, i + maxp) + 1):
            ult = pal[j - 1]['w']
            c = 1.0
            if j < n and limpia(ult) in CONECTORES and not re.search(r'[.?!,…;:]$', ult): c += 50  # casi prohibido
            if j < n and limpia(ult) in DEBILES and not re.search(r'[.?!,…;:]$', ult): c += 4
            if j < n:
                if fin_frase[j - 1]: pass
                elif re.search(r'[,;:]$', ult): c += 1
                else: c += 3
                if pal[j]['s'] - pal[j - 1]['e'] > 0.35: c -= 2  # cortar en una pausa es bueno
            for k in range(i, j - 1):
                w = pal[k]['w']
                if fin_frase[k]: c += 4
                elif w.endswith(','): c += 0.5
                if pal[k + 1]['s'] - pal[k]['e'] > 0.35: c += 8
                if limpia(w) in claves and k > i: c += 1  # una clave queda mejor al final de su bloque
            if limpia(ult) in claves and j - i >= 2: c -= 1
            if j - i == 1: c += 2
            fin = min(pal[j]['s'], pal[j - 1]['e'] + 0.6) if j < n else pal[j - 1]['e'] + 0.6
            d = fin - pal[i]['s']
            if d < 0.45: c += 6 + 20 * (0.45 - d)
            if c + mejor[j] < mejor[i]: mejor[i], corte[i] = c + mejor[j], j
    out, i = [], 0
    while i < n:
        out.append(pal[i:corte[i]]); i = corte[i]
    return out


def bloques(pal, ficha):
    claves = {k.lower(): v for k, v in ficha.get('claves', {}).items()}
    maxp = ficha.get('max_palabras', 4)
    res = _particion([{**p, 'w': p['w'].strip()} for p in pal if p['w'].strip()], maxp, claves)
    final = []
    for j, b in enumerate(res):
        ult = limpia(b[-1]['w'])
        clave = ult if ult in claves and len(b) >= 2 else None
        palabras = b[:-1] if clave else b
        linea = ' '.join(x['w'] for x in palabras).strip()
        for mal, bien in ficha.get('correcciones', {}).items():
            linea = linea.replace(mal, bien)
        linea = re.sub(r'[.,;:]+$', '', linea)
        sig = res[j + 1][0]['s'] if j + 1 < len(res) else b[-1]['e'] + 0.4
        final.append({'s': round(b[0]['s'], 3), 'e': round(min(sig, b[-1]['e'] + 0.6), 3), 'linea': linea,
                      'clave': re.sub(r'[.,;:?!]+$', '', b[-1]['w']) if clave else '', 'color': claves.get(clave, ''),
                      't_clave': round(b[-1]['s'], 3) if clave else None, '_fin_voz': b[-1]['e']})
    # Pasada final: un bloque que se vería menos de 0,45 s retrasa la entrada del siguiente (como mucho 0,3 s,
    # y solo si al siguiente le quedan sus 0,45 s). Es lo mismo que hace el modo manual con las claves.
    for j in range(len(final) - 1):
        b, sig = final[j], final[j + 1]
        falta = round(b['s'] + 0.45 - b['e'], 3)
        if falta > 0 and falta <= 0.3 and sig['e'] - (sig['s'] + falta) >= 0.45:
            sig['s'] = round(sig['s'] + falta, 3); b['e'] = sig['s']
    for b in final: b.pop('_fin_voz', None)
    return final


def manual(pal, lineas, ficha):
    """Bloques escritos a mano (como hace Luis), alineados con los tiempos de palabra.
    Una línea por bloque: «texto|clave». Cada palabra cuenta como una del transcriptor, salvo las que llevan «+»
    delante (añadidas al escribir: «mira +a los ojos»). Si el recuento no cuadra con la transcripción, para con error."""
    claves = {k.lower(): v for k, v in ficha.get('claves', {}).items()}
    out, i = [], 0
    for ln in [x.rstrip('\n') for x in lineas if x.strip() and not x.startswith('#')]:
        texto, _, clave = ln.partition('|')
        toks = texto.split() + (clave.split() if clave else [])
        n = sum(1 for t in toks if not t.startswith('+'))
        if i + n > len(pal): raise SystemExit(f'Faltan palabras para: {ln}')
        ws = pal[i:i + n]; i += n
        out.append({'s': round(ws[0]['s'], 3), 'e': round(ws[-1]['e'], 3), 'linea': ' '.join(t.lstrip('+') for t in texto.split()),
                    'clave': clave.strip(), 'color': claves.get(clave.strip().lower(), ficha.get('colores', {}).get('bueno', '')) if clave else '',
                    't_clave': round(ws[-1]['s'], 3) if clave else None,
                    'transcripcion': ' '.join(w['w'].strip() for w in ws)})
    if i != len(pal): raise SystemExit(f'Sobran {len(pal) - i} palabras de la transcripción sin bloque')
    # Una clave tiene que leerse: al menos 0,7 s en pantalla. Si la frase siguiente entra antes, espera
    # (como mucho 0,5 s y dejándole 0,6 s propios). Prueba del 30-10: sin esto DESPUÉS duraba 0,34 s.
    for j in range(len(out) - 1):
        b, sig = out[j], out[j + 1]
        if b['clave'] and b['t_clave'] is not None:
            nuevo = min(b['t_clave'] + 0.7, sig['s'] + 0.5, sig['e'] - 0.6)
            if nuevo > sig['s']: sig['s'] = round(nuevo, 3)
    for j, b in enumerate(out):  # cada bloque se queda hasta que entra el siguiente (sin huecos de parpadeo)
        b['e'] = round(min(out[j + 1]['s'], b['e'] + 0.6), 3) if j + 1 < len(out) else round(b['e'] + 0.4, 3)
        if j + 1 < len(out) and b['clave']: b['e'] = out[j + 1]['s']
    return out


if __name__ == '__main__':
    pal = json.load(open(sys.argv[1]))['palabras']
    ficha = json.load(open(sys.argv[2]))
    b = manual(pal, open(sys.argv[4]).readlines(), ficha) if len(sys.argv) > 4 else bloques(pal, ficha)
    json.dump(b, open(sys.argv[3], 'w'), ensure_ascii=False, indent=1)
    for x in b: print(f"{x['s']:6.2f}-{x['e']:6.2f}  {x['linea']}" + (f"  [{x['clave'].upper()}]" if x['clave'] else ''))
