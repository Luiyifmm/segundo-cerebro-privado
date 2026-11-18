# Control de cortes a media palabra (lo cazó Luis en María «entrenar», Álvaro «sostenible», Alessandro «caseras»).
# Para cada tramo del spec: avisa si el inicio o el final cae DENTRO de una palabra de la transcripción (con margen).
# Uso: python3 cortes.py [carpeta ...]   (sin argumentos: todas las carpetas del lote)   --arreglar  -> propone tramos corregidos
import json, os, sys
LOTE = os.path.dirname(os.path.abspath(__file__)); arreglar = '--arreglar' in sys.argv
dirs = [a for a in sys.argv[1:] if not a.startswith('--')] or sorted(d for d in os.listdir(LOTE) if os.path.exists(os.path.join(LOTE, d, 'spec.json')))
M = 0.04   # margen: el final del tramo debe quedar al menos 40 ms después del final de la palabra
for d in dirs:
    S = json.load(open(os.path.join(LOTE, d, 'spec.json')))
    if not S.get('palabras') or not os.path.exists(os.path.join(LOTE, d, S['palabras'])): print(d, ': sin transcripción'); continue
    j = json.load(open(os.path.join(LOTE, d, S['palabras']))); ws = j['palabras'] if isinstance(j, dict) and 'palabras' in j else j
    ws = [(w.get('texto', w.get('palabra', '')), w.get('inicio', w.get('start')), w.get('fin', w.get('end')), w.get('fiable', True)) for w in ws]
    ws = [w for w in ws if w[1] is not None and w[2] - w[1] < 1.5]          # palabras «estiradas» (>1,5 s, poco fiables) no cuentan
    malos = []; nuevos = []
    for k, (s, e) in enumerate(S['tramos']):
        ns, ne = s, e
        for tx, a, b, fi in ws:
            if a < e < b + M - 0.001 and b - e < 0.6: malos.append('tramo %d termina en %.2f dentro de «%s» (%.2f-%.2f)' % (k, e, tx, a, b)); ne = max(ne, round(b + 0.06, 2))
            if a - 0.02 < s < b and s - a > 0.03: malos.append('tramo %d empieza en %.2f dentro de «%s» (%.2f-%.2f)' % (k, s, tx, a, b)); ns = min(ns, round(a - 0.05, 2))
        if k + 1 < len(S['tramos']): ne = min(ne, S['tramos'][k + 1][0])
        nuevos.append([ns, ne])
    print('%-15s %s' % (d, 'OK' if not malos else 'MEDIA PALABRA'))
    for m in malos: print('   ', m)
    if malos and arreglar: print('    tramos propuestos:', json.dumps(nuevos))
