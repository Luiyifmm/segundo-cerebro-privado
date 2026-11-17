# Regenera «00 MAPA.md» de la bóveda: enlace [[…]] a cada nota viva, agrupada por carpeta, con su primera línea útil.
# Sin tokens. No toca ninguna otra nota. Uso: python3 mapa.py ["~/EDICION/0 CLAUDE EDITOR"]
import os, re, sys, datetime
V = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else '~/EDICION/0 CLAUDE EDITOR')
FUERA = ('5 TALLER', '6 EXPORTACIONES', '9 ARCHIVO', '.obsidian', 'node_modules', '/desgloses')
def resumen(p):
    for l in open(p, errors='ignore').read().splitlines():
        l = l.strip()
        if l and not l.startswith(('---', '#', '|', '>', '```')) and ':' not in l[:12] and len(l) > 25: return re.sub(r'[*`\[\]]', '', l)[:110]
    return ''
grupos = {}
for r, ds, fs in os.walk(V):
    ds.sort()
    rel = os.path.relpath(r, V)
    if any(x in '/' + rel for x in FUERA): continue
    for f in sorted(fs):
        if f.endswith('.md') and f != '00 MAPA.md': grupos.setdefault(rel.split('/')[0] if rel != '.' else '(raíz)', []).append(os.path.join(rel, f))
out = ['# 00 MAPA (automático)', '', f'Generado por `~/Videos-Remotion/herramientas/obsidian/mapa.py` el {datetime.date.today():%d-%m-%Y}. No editar a mano: se rehace.', '']
for g in sorted(grupos, key=lambda x: (x != '(raíz)', [int(t) if t.isdigit() else t for t in re.split(r'(\d+)', x)])):
    out += [f'## {g}', '']
    for p in grupos[g]:
        nombre = os.path.splitext(os.path.basename(p))[0]; r_ = resumen(os.path.join(V, p))
        enlace = os.path.splitext(p)[0].lstrip('./') if os.path.basename(p) in ('LEEME.md', 'FICHA.md', 'RESUMEN.md') else nombre
        out.append(f'- [[{enlace}|{nombre if enlace == nombre else os.path.relpath(os.path.splitext(p)[0], g)}]]' + (f' — {r_}' if r_ else ''))
    out.append('')
open(os.path.join(V, '00 MAPA.md'), 'w').write('\n'.join(out)); print(sum(len(v) for v in grupos.values()), 'notas en 00 MAPA.md')
