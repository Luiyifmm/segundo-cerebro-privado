# Índice de referencias y estudios (sin tokens).
# Para cada vídeo de referencia: título, autor, enlace original, ruta en el PC, transcripción/medidas que tiene al lado
# y TODAS las notas que lo estudian (se buscan por id, nombre de archivo o @autor en la bóveda, skills y memoria).
# Uso: python3 indice_referencias.py [bóveda] [salida.md] [carpetas extra donde buscar estudios…]
import os, sys, json, re, glob, collections, datetime
V = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else '~/EDICION/0 CLAUDE EDITOR')
OUT = os.path.expanduser(sys.argv[2] if len(sys.argv) > 2 else os.path.join(V, '1 REFERENCIAS', '00 ÍNDICE DE REFERENCIAS Y ESTUDIOS.md'))
EXTRA = [os.path.expanduser(x) for x in sys.argv[3:]] or [os.path.expanduser('~/.claude/skills'), os.path.expanduser('~/.claude/projects/-Users-luiyi/memory'), os.path.expanduser('~/.claude/projects/-Users-luiyi-EDICION/memory')]
REF = os.path.join(V, '1 REFERENCIAS')
CHATS = os.path.expanduser(os.environ.get('CHATS', '~/segundo-cerebro-privado/chats'))   # chats en Markdown (chats_a_md.py)
chats = {p: open(p, errors='ignore').read() for p in glob.glob(os.path.join(CHATS, '**', '*.md'), recursive=True)}
MEDIA = ('.mp4', '.webm', '.mov', '.mkv', '.m4a')
def rel(p): return p.replace(os.path.expanduser('~'), '~')
# 1) notas donde buscar
notas = {}
for base in [V] + EXTRA:
    for p in glob.glob(os.path.join(base, '**', '*.md'), recursive=True):
        if any(x in p for x in ('/6 EXPORTACIONES', '/node_modules/', '/5 TALLER', '/3 SKILLS Y MEMORIA', '00 MAPA.md', '00 ÍNDICE DE REFERENCIAS')) or p == OUT: continue
        try: notas[p] = open(p, errors='ignore').read()
        except Exception: pass
# 2) referencias: fichas de yt-dlp y vídeos sueltos
refs, vistos = [], set()
for j in sorted(glob.glob(os.path.join(REF, '**', '*.info.json'), recursive=True)):
    if '/4 REFERENCIAS/' in j: continue
    try: d = json.load(open(j))
    except Exception: continue
    base = j[:-len('.info.json')]; med = next((base + e for e in MEDIA if os.path.exists(base + e)), None)
    ide = str(d.get('id') or ''); key = (d.get('webpage_url') or ide)
    if key in vistos: continue
    vistos.add(key)
    refs.append({'id': ide, 'url': d.get('webpage_url') or d.get('original_url') or '', 'titulo': (d.get('title') or d.get('fulltitle') or '').replace('\n', ' ')[:90],
                 'autor': next((x for x in [(re.match(r'Video by (\S+)', d.get('title') or '') or [None, None])[1], d.get('channel'), d.get('uploader_id'), d.get('uploader')] if x and not str(x).isdigit()), ''), 'dur': d.get('duration'), 'vistas': d.get('view_count'),
                 'ruta': med or base, 'carpeta': os.path.relpath(os.path.dirname(j), REF), 'stem': os.path.basename(base)})
for p in sorted(glob.glob(os.path.join(REF, '**', '*'), recursive=True)):
    if not p.lower().endswith(MEDIA) or '/4 REFERENCIAS/' in p or os.path.exists(os.path.splitext(p)[0] + '.info.json'): continue
    if any(x in p for x in ('/htdemucs/', '/cache/', '/stems/')): continue
    refs.append({'id': '', 'url': '', 'titulo': os.path.splitext(os.path.basename(p))[0][:90], 'autor': '', 'dur': None, 'vistas': None,
                 'ruta': p, 'carpeta': os.path.relpath(os.path.dirname(p), REF), 'stem': os.path.splitext(os.path.basename(p))[0]})
# 3) qué notas estudian cada referencia
def claves(r):
    k = [r['id']] if len(r['id']) >= 6 else []
    if len(r['stem']) >= 6 or re.fullmatch(r'r\d{2,3}', r['stem']): k.append(r['stem'])
    if r['autor'] and len(r['autor']) >= 4: k.append('@' + r['autor'].lstrip('@'))
    return [re.compile(r'(?<![\w-])' + re.escape(x) + r'(?![\w-])') for x in k]
def estudio_de(r):     # carpeta de estudio = primer nivel bajo «Analizadas por Claude» / «Tuyas»
    partes = r['carpeta'].split('/'); return '/'.join(partes[:2]) if partes[0] in ('Analizadas por Claude', 'Tuyas') and len(partes) > 1 else partes[0]
for r in refs:
    r['estudios'] = sorted({p for p, t in notas.items() for k in claves(r) if k.search(t)})
    r['grupo'] = estudio_de(r)
    r['chats'] = [] if r['estudios'] else sorted({p for p, t in chats.items() for k in claves(r) if k.search(t)})[:4]
    lado = [x for x in glob.glob(os.path.join(os.path.dirname(r['ruta']), glob.escape(r['stem']) + '*')) if not x.lower().endswith(MEDIA) and not x.endswith('.info.json')]
    r['junto'] = [os.path.basename(x) for x in lado][:6]
# 4) escribir
def enlace(p):
    n = os.path.splitext(os.path.relpath(p, V))[0] if p.startswith(V) else None
    return f'[[{n}|{os.path.basename(os.path.dirname(p)) + "/" if os.path.basename(p) in ("LEEME.md", "SKILL.md", "RESUMEN.md") else ""}{os.path.splitext(os.path.basename(p))[0]}]]' if n else f'`{rel(p)}`'
grupos = collections.OrderedDict()
for r in sorted(refs, key=lambda r: (r['grupo'], r['carpeta'])): grupos.setdefault(r['grupo'] if r['grupo'] != '.' else '(raíz)', []).append(r)
L = ['# 00 Índice de referencias y estudios', '', f'Generado por `~/Videos-Remotion/herramientas/indice_referencias.py` el {datetime.date.today():%d-%m-%Y}. No editar a mano.',
     f'{len(refs)} referencias · {sum(1 for r in refs if r["url"])} con enlace original · {sum(1 for r in refs if r["estudios"])} citadas en algún estudio.', '',
     'Cada fila: vídeo (enlace original si existe) · autor · duración · **ruta en el PC** · archivos de análisis que tiene al lado (transcripción, medidas, hoja) · **notas que lo estudian**.', '']
for g, rs in grupos.items():
    leeme = ([p for p in glob.glob(os.path.join(REF, g, '**', '*.md'), recursive=True) if '/4 REFERENCIAS/' not in p and '/desgloses/' not in p] if '/' in g else
             [p for p in glob.glob(os.path.join(REF, g, '*.md'))]) if g != '(raíz)' else []
    hoja = g.split('/')[-1]
    if g == 'referencias': hoja = 'REFERENCIAS/referencias'
    if hoja not in ('Tuyas', 'Analizadas por Claude', '(raíz)') and len(hoja) >= 6:
        leeme = leeme + sorted(p for p, t in notas.items() if hoja in t and p not in leeme)          # notas que nombran la carpeta (skills, memoria, banco…)
    otros = sorted({p for r in rs for p in r['estudios'] if p not in leeme})
    if otros: leeme = leeme + otros[:15]
    L += [f'## {g}', '']
    if not leeme and hoja and len(hoja) >= 6:
        cs = sorted(p for p, t in chats.items() if hoja in t)[:4]
        if cs: L += ['Analizado solo en la conversación: ' + ' · '.join(f'`chats/{os.path.relpath(p, CHATS)}`' for p in cs), '']
    if leeme: L += ['Estudios: ' + ' · '.join(enlace(p) for p in sorted(leeme)), '']
    for r in rs:
        t = f'[{r["titulo"] or r["stem"]}]({r["url"]})' if r['url'] else f'**{r["titulo"] or r["stem"]}**'
        meta = ' · '.join(x for x in [('@' + r['autor'].lstrip('@')) if r['autor'] else '', f'{round(r["dur"])} s' if r['dur'] else '', f'{r["vistas"]:,} visitas'.replace(',', '.') if r['vistas'] else ''] if x)
        L.append(f'- {t}' + (f' — {meta}' if meta else ''))
        L.append(f'  - PC: `{rel(r["ruta"])}`')
        if r['junto']: L.append('  - Análisis al lado: ' + ', '.join(f'`{x}`' for x in r['junto']))
        if r['estudios']: L.append('  - Estudiado en: ' + ' · '.join(enlace(p) for p in r['estudios'][:12]))
        elif r['chats']: L.append('  - Analizado solo en la conversación: ' + ' · '.join(f'`chats/{os.path.relpath(p, CHATS)}`' for p in r['chats']))
    L.append('')
os.makedirs(os.path.dirname(OUT), exist_ok=True); open(OUT, 'w').write('\n'.join(L) + '\n')
print(len(refs), 'referencias ·', sum(1 for r in refs if r['estudios']), 'con estudio ·', OUT)
