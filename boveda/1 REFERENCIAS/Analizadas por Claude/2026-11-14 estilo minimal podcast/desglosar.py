# Genera el desglose palabra a palabra de cada referencia: palabra · inicio · fotograma · plano,
# la lista de planos (cortes detectados por ffmpeg, umbral 0,25) y las medidas de ritmo.
# uso: python3 desglosar.py r16 r17 …   (lee trans/<n>.palabras.json, medidas/<n>_cortes.txt, src/<n>.mp4)
import json, re, sys, subprocess, statistics as st, os
B = os.path.dirname(os.path.abspath(__file__))
NOTAS = json.load(open(os.path.join(B, 'notas-escenas.json'), encoding='utf-8')) if os.path.exists(os.path.join(B, 'notas-escenas.json')) else {}

def probe(n):
    o = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate:format=duration',
                        '-of', 'csv=p=0', os.path.join(B, 'src', n + '.mp4')], capture_output=True, text=True).stdout.split()
    a, b = o[0].split('/'); return float(a) / float(b), float(o[1])

resumen = []
for n in sys.argv[1:]:
    fps, dur = probe(n)
    pal = json.load(open(os.path.join(B, 'trans', n + '.palabras.json'), encoding='utf-8'))
    cortes = [float(x) for x in re.findall(r'pts_time:([\d.]+)', open(os.path.join(B, 'medidas', n + '_cortes.txt')).read())]
    lim = [0.0] + cortes + [dur]
    planos = [(lim[i], lim[i + 1]) for i in range(len(lim) - 1)]
    def plano(t):
        for i, (a, b) in enumerate(planos):
            if a <= t < b: return i + 1
        return len(planos)
    notas = NOTAS.get(n, {})
    L = ['# %s · desglose' % n, '', 'Duración %.1f s · %.2f fps · %d palabras · %d planos (cortes automáticos, umbral 0,25).' % (dur, fps, len(pal), len(planos)), '']
    if notas.get('ficha'): L += ['## Ficha de estilo', notas['ficha'], '']
    if notas.get('escenas'):
        L += ['## Escenas (miradas a 2 fotogramas por segundo)', '| De | A | Tipo | Qué hay en pantalla |', '|---|---|---|---|']
        L += ['| %s | %s | %s | %s |' % tuple(e) for e in notas['escenas']]; L.append('')
    L += ['## Planos y lo que se dice en cada uno', '| Plano | Inicio | Dura | Palabras | Texto |', '|---|---|---|---|---|']
    ppp = []
    for i, (a, b) in enumerate(planos):
        ws = [w for w in pal if a <= w['inicio'] < b]; ppp.append(len(ws))
        L.append('| %d | %.2f | %.2f | %d | %s |' % (i + 1, a, b - a, len(ws), ' '.join(w['texto'] for w in ws)))
    L += ['', '## Palabra a palabra', '| # | Palabra | Inicio | Fin | Fotograma | Plano |', '|---|---|---|---|---|---|']
    for i, w in enumerate(pal):
        L.append('| %d | %s | %.2f | %.2f | f%d | %d |' % (i + 1, w['texto'], w['inicio'], w['fin'], round(w['inicio'] * fps), plano(w['inicio'])))
    # medidas
    d = [b - a for a, b in planos]
    des = []
    for c in cortes:
        cerca = min(pal, key=lambda w: abs(w['inicio'] - c)) if pal else None
        if cerca and abs(cerca['inicio'] - c) < 0.5: des.append(c - cerca['inicio'])
    hab = (pal[-1]['fin'] - pal[0]['inicio']) if pal else 0
    m = dict(n=n, dur=dur, planos=len(planos), plano_med=st.median(d), plano_min=min(d), pal=len(pal), pps=len(pal) / hab if hab else 0,
             ppp=st.median(ppp), des=st.median(des) if des else None, des_n=len(des), antes=sum(1 for x in des if x < -0.03), despues=sum(1 for x in des if x > 0.03))
    resumen.append(m)
    L += ['', '## Medidas', '- Plano: mediana %.2f s, mínimo %.2f s.' % (m['plano_med'], m['plano_min']),
          '- Habla: %.1f palabras por segundo; mediana de %d palabras por plano.' % (m['pps'], m['ppp']),
          '- Corte respecto a la palabra más cercana: mediana %s s (negativo = el corte llega antes que la palabra); %d antes, %d después, de %d.' % ('%.2f' % m['des'] if m['des'] is not None else '—', m['antes'], m['despues'], m['des_n']),
          '- Transcripción de WhisperX; el verificador de voz falla en estos vídeos por la música, así que los tiempos son orientativos (±0,1 s), no para sincronía fina.']
    open(os.path.join(B, 'desgloses', n + '.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print('| Vídeo | Dura | Planos | Plano mediana | Pal/s | Pal/plano | Corte−palabra | antes/después |\n|---|---|---|---|---|---|---|---|')
for m in resumen:
    print('| %s | %.1f | %d | %.2f | %.1f | %d | %s | %d/%d |' % (m['n'], m['dur'], m['planos'], m['plano_med'], m['pps'], m['ppp'], '%.2f' % m['des'] if m['des'] is not None else '—', m['antes'], m['despues']))
