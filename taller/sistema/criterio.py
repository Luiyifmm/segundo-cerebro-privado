#!/usr/bin/env python3
# criterio.py — banco de criterio: qué RECURSO se usó para explicar qué IDEA, y POR QUÉ. Sirve para decidir escenas en vídeos futuros.
#   criterio.py analizar <vídeo> [--nicho fitness] [--idioma auto]   → prepara el vídeo (transcripción + hojas + planos) y deja una ficha por rellenar
#   criterio.py anadir <entradas.json>                                → añade entradas al banco y regenera BANCO.md
#   criterio.py buscar <palabras…> [--idea cifra] [--nicho fitness]   → recursos ya vistos para ese tipo de idea
#   criterio.py ideas                                                 → vocabulario de tipos de idea, con cuántos recursos hay de cada uno
#   criterio.py usar <id> [--resultado aprobado|corregido|descartado] → apunta que un recurso se usó en un vídeo propio y cómo salió
#   criterio.py detallar <detalles.json>                              → añade el ACABADO a entradas que ya existen: [{"id":"c003","color":…,"textura":…,"letras":…,"palabras":…,"sonido":…}]
#   criterio.py ver <id>                                              → una entrada completa, con su acabado
# Banco: ~/EDICION/0 CLAUDE EDITOR/11 BANCO DE CRITERIO/banco.jsonl (una entrada por línea) y BANCO.md (para leer).
import sys, os, json, re, subprocess, datetime, unicodedata
B = os.path.expanduser('~/EDICION/0 CLAUDE EDITOR/11 BANCO DE CRITERIO'); BANCO = os.path.join(B, 'banco.jsonl')
IDEAS = {'gancho': 'La primera frase: promesa, pregunta o afirmación que para el dedo', 'mito': 'Una creencia u objeción del espectador', 'desmentido': 'El «no», el giro',
         'cifra': 'Un número, un resultado, un porcentaje', 'comparacion': 'Dos cosas frente a frente; antes y después', 'proceso': 'A lleva a B; una igualdad; causa y efecto',
         'pasos': 'Una lista ordenada o numerada', 'enumeracion': 'Varias cosas seguidas, rápidas', 'abstracta': 'Una idea que no se puede fotografiar',
         'quien': 'A quién le pasa; el caso; el testimonio', 'objeto': 'Una cosa concreta que se nombra (alimento, herramienta, app)', 'tecnica': 'Un ejercicio, un gesto, una postura',
         'pauta': 'Una instrucción concreta con su cantidad', 'prueba': 'Un estudio, una captura, una fuente', 'palabra': 'La palabra que resume la frase',
         'transicion': 'Frase de paso u opinión', 'moraleja': 'La conclusión', 'cta': 'Lo que se pide al espectador', 'estructura': 'El vídeo entero tiene partes que se van cumpliendo'}
ACABADO = ('color', 'textura', 'letras', 'palabras', 'sonido')
norm = lambda s: ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn')
def leer(): return [json.loads(l) for l in open(BANCO, encoding='utf-8') if l.strip()] if os.path.exists(BANCO) else []
def guardar(es):
    os.makedirs(B, exist_ok=True)
    open(BANCO, 'w', encoding='utf-8').write(''.join(json.dumps(e, ensure_ascii=False) + '\n' for e in es))
    M = ['---', 'tipo: banco', 'actualizado: ' + datetime.date.today().isoformat(), '---', '# Banco de criterio', '',
         'Qué recurso se usó para explicar qué idea, y por qué. **Se genera solo** desde `banco.jsonl` (`criterio.py`): no editar a mano.',
         'Estados: 👁 visto en una referencia · 🧪 usado en un vídeo propio · ✅ aprobado por Luis · ✖ descartado.', '', '%d recursos · %d tipos de idea.' % (len(es), len({e['idea'] for e in es})), '']
    for idea in IDEAS:
        g = [e for e in es if e['idea'] == idea]
        if not g: continue
        M += ['## %s — %s' % (idea, IDEAS[idea]), '| id | Recurso | Cómo se ve | Por qué funciona | No usar si… | Acabado (color · textura · letras · palabras · sonido) | Nicho | Fuente | Estado |', '|---|---|---|---|---|---|---|---|---|']
        for e in sorted(g, key=lambda e: -e.get('veces', 0)):
            aca = ' · '.join('**%s:** %s' % (k, e[k]) for k in ACABADO if e.get(k))
            M.append('| %s | **%s** | %s | %s | %s | %s | %s | %s | %s |' % (e['id'], e['recurso'], e.get('como', ''), e.get('porque', ''), e.get('cuando_no', ''), aca, e.get('nicho', ''), e.get('fuente', ''),
                     {'observado': '👁', 'probado': '🧪', 'aprobado': '✅', 'descartado': '✖'}.get(e.get('estado', 'observado'), '👁') + (' ×%d' % e['veces'] if e.get('veces') else '')))
        M.append('')
    open(os.path.join(B, 'BANCO.md'), 'w', encoding='utf-8').write('\n'.join(M) + '\n')
def opt(a, n, d=None): return a[a.index(n) + 1] if n in a else d
a = sys.argv[1:]
if not a or a[0] in ('-h', '--help'): print(open(__file__, encoding='utf-8').read().split('import sys')[0]); sys.exit(0)
if a[0] == 'ideas':
    es = leer()
    for k, v in IDEAS.items(): print('%-12s %2d  %s' % (k, sum(1 for e in es if e['idea'] == k), v))
elif a[0] == 'anadir':
    es = leer(); nuevas = json.load(open(a[1], encoding='utf-8')); n0 = len(es); num = max([int(e['id'][1:]) for e in es] + [0])
    for e in nuevas:
        if e.get('idea') not in IDEAS: sys.exit('ERROR: idea «%s» no está en el vocabulario (criterio.py ideas)' % e.get('idea'))
        for k in ('recurso', 'porque', 'fuente'):
            if not e.get(k): sys.exit('ERROR: falta «%s» en %s' % (k, json.dumps(e, ensure_ascii=False)[:80]))
        if any(x['idea'] == e['idea'] and norm(x['recurso']) == norm(e['recurso']) and x.get('fuente') == e.get('fuente') for x in es): continue
        num += 1; e = dict(id='c%03d' % num, fecha=datetime.date.today().isoformat(), estado='observado', veces=0, **{k: v for k, v in e.items() if k not in ('id',)}); es.append(e)
    guardar(es); print('añadidas %d (total %d) → %s' % (len(es) - n0, len(es), os.path.join(B, 'BANCO.md')))
elif a[0] == 'buscar':
    es = leer(); idea, nicho = opt(a, '--idea'), opt(a, '--nicho'); pal = [norm(x) for x in a[1:] if not x.startswith('--') and x not in (idea, nicho)]
    r = [e for e in es if (not idea or e['idea'] == idea) and (not nicho or nicho in e.get('nicho', '') or e.get('nicho') == 'cualquiera') and all(p in norm(json.dumps(e, ensure_ascii=False)) for p in pal) and e.get('estado') != 'descartado']
    orden = {'aprobado': 0, 'probado': 1, 'observado': 2}
    for e in sorted(r, key=lambda e: (orden.get(e.get('estado'), 3), -e.get('veces', 0))):
        print('%s [%s·%s·%s] %s — %s | por qué: %s%s | %s' % (e['id'], e['idea'], e.get('nicho', ''), e.get('estado'), e['recurso'], e.get('como', ''), e['porque'], (' | no si: ' + e['cuando_no']) if e.get('cuando_no') else '', e.get('fuente', '')))
        if any(e.get(k) for k in ACABADO): print('     acabado → ' + ' · '.join('%s: %s' % (k, e[k]) for k in ACABADO if e.get(k)))
    print('%d resultados' % len(r))
elif a[0] == 'usar':
    es = leer(); res = opt(a, '--resultado', 'probado'); ok = False
    for e in es:
        if e['id'] == a[1]:
            e['veces'] = e.get('veces', 0) + 1; ok = True
            e['estado'] = {'aprobado': 'aprobado', 'descartado': 'descartado'}.get(res, 'probado' if e.get('estado') == 'observado' else e['estado'])
            if res == 'corregido': e['nota'] = (e.get('nota', '') + ' · corregido ' + datetime.date.today().isoformat()).strip(' ·')
    if not ok: sys.exit('ERROR: no existe ' + a[1])
    guardar(es); print('apuntado', a[1], res)
elif a[0] == 'analizar':
    v = os.path.abspath(a[1]); nicho = opt(a, '--nicho', ''); idi = opt(a, '--idioma', 'auto'); n = os.path.splitext(os.path.basename(v))[0][:60]
    sal = os.path.join(B, 'analisis', n); os.makedirs(sal, exist_ok=True)
    subprocess.run([os.path.expanduser('~/Videos-Remotion/sistema/preparar-clip.sh'), v, '--salida', sal, '--idioma', idi, '--sin-corte'], check=True, stdout=subprocess.DEVNULL)
    ct = os.path.join(sal, 'cortes.txt')
    subprocess.run([os.path.expanduser('~/.local/bin/ffmpeg'), '-v', 'error', '-i', v, '-vf', "select='gt(scene,0.25)',metadata=print:file=" + ct.replace("'", "\\'").replace(':', '\\:'), '-an', '-f', 'null', '-'])
    dur = float(subprocess.run([os.path.expanduser('~/.local/bin/ffprobe'), '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', v], capture_output=True, text=True).stdout)
    cortes = [float(x) for x in re.findall(r'pts_time:([\d.]+)', open(ct).read())] if os.path.exists(ct) else []
    d = json.load(open(os.path.join(sal, 'palabras.json'), encoding='utf-8')); pal = [w for w in (d if isinstance(d, list) else d.get('palabras', [])) if w.get('inicio') is not None]
    lim = [0.0] + cortes + [dur]
    F = ['# Criterio · ' + n, '', 'Nicho: %s · %.1f s · %d planos. Hojas en `hojas/` (2 fotogramas por segundo).' % (nicho or '¿?', dur, len(lim) - 1), '',
         '**Cómo rellenar:** mirar las hojas y, por cada plano o grupo de planos que forme UNA escena, escribir idea (del vocabulario), recurso, cómo se ve y por qué se explicó así y no de otra forma.',
         'Solo entran al banco los recursos que enseñan algo; un A-roll con subtítulo normal no se apunta cada vez.', '',
         '| Plano | Inicio | Dura | Lo que se dice | Idea | Recurso | Cómo se ve | Por qué así | No usar si… |', '|---|---|---|---|---|---|---|---|---|']
    for i in range(len(lim) - 1):
        ws = ' '.join(w['texto'].strip() for w in pal if lim[i] <= w['inicio'] < lim[i + 1])
        F.append('| %d | %.2f | %.2f | %s |  |  |  |  |  |' % (i + 1, lim[i], lim[i + 1] - lim[i], ws))
    F += ['', '## Entradas para el banco', 'Escribir `entradas.json` en esta carpeta y ejecutar `criterio.py anadir entradas.json`:', '```json',
          '[{"idea":"cifra","recurso":"…","como":"…","porque":"…","cuando_no":"…","nicho":"%s","fuente":"%s 0:07","dice":"…"}]' % (nicho or 'cualquiera', n[:30]), '```',
          'Vocabulario de ideas: ' + ', '.join(IDEAS)]
    open(os.path.join(sal, 'ficha.md'), 'w', encoding='utf-8').write('\n'.join(F) + '\n'); print('ficha por rellenar →', os.path.join(sal, 'ficha.md'))
elif a[0] == 'detallar':
    es = leer(); n = 0
    for dct in json.load(open(a[1], encoding='utf-8')):
        for e in es:
            if e['id'] == dct.get('id'):
                for k in ACABADO:
                    if dct.get(k): e[k] = dct[k]
                n += 1
    guardar(es); print('detalladas', n)
elif a[0] == 'ver':
    for e in leer():
        if e['id'] == a[1]: print(json.dumps(e, ensure_ascii=False, indent=1))
else: sys.exit('orden desconocida: ' + a[0])
