"""Corte base (jump cut): se queda con los segmentos (frases) elegidos de la transcripción, quita silencios
entre palabras, ajusta cada corte al silencio real del audio y recalcula los tiempos de cada palabra en el vídeo montado.
Uso: python3 montar.py VIDEO TRANSCRIPCION.json SALIDA_DIR "i,j,k" [hueco_max=0.18] [margen=0.07]
  "i,j,k" = índices de segmentos a conservar (en orden de salida), ver el .txt de la transcripción.
Escribe SALIDA_DIR/montaje.mp4 y SALIDA_DIR/palabras.json ([{w,s,e,seg}] en tiempo del montaje)."""
import sys, json, subprocess, os, re

video, tj, outd, idx = sys.argv[1:5]
hueco = float(sys.argv[5]) if len(sys.argv) > 5 else 0.18
margen = float(sys.argv[6]) if len(sys.argv) > 6 else 0.07
os.makedirs(outd, exist_ok=True)
segs = json.load(open(tj))['segments']
orden = [int(x) for x in idx.split(',')]

# Tramos [a,b] del original: se parte un segmento donde haya un silencio > hueco entre palabras
tramos = []  # (a, b, [palabras], seg)
MULETILLA = re.compile(r'^(e+h*m*|m+|u+[hm]*|a+h+|ehm+)[.,…]*$', re.I)
for k in orden:
    ws = segs[k]['words']
    if os.environ.get('MULETILLAS') == '1':  # quita «eh», «em», «mmm»… (como «Remove fillers» de Opus)
        ws = [w for w in ws if not MULETILLA.match(w['w'].strip())] or ws
    grupo = [ws[0]]
    for w in ws[1:]:
        if w['s'] - grupo[-1]['e'] > hueco + 2 * margen:
            tramos.append((grupo[0]['s'] - margen, grupo[-1]['e'] + margen, grupo, k)); grupo = [w]
        else: grupo.append(w)
    tramos.append((grupo[0]['s'] - margen, grupo[-1]['e'] + margen, grupo, k))

# Ajuste de cada corte al silencio real del audio. Whisper suele dar el final de la palabra un poco antes de
# tiempo: cortar en un punto fijo se comía las últimas sílabas. Aquí cada corte busca dónde baja la voz de verdad,
# sin pasarse nunca a la palabra de al lado (aunque no se haya elegido).
def ajustar(tramos):
    try:
        import numpy as np
    except ImportError:
        return tramos
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', video, '-vn', '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
    x = np.frombuffer(raw, np.int16).astype(np.float32)
    if not len(x): return tramos
    F = len(x) // 160
    rms = np.sqrt((x[:F * 160].reshape(F, 160) ** 2).mean(axis=1))  # un valor cada 10 ms
    umbral = np.percentile(rms, 70) * 0.12
    todas = sorted((w for sg in segs for w in sg.get('words') or []), key=lambda w: w['s'])
    inicios = [w['s'] for w in todas]
    import bisect
    fr = lambda t: max(0, min(F - 1, int(round(t * 100))))
    out = []
    for a, b, grupo, k in tramos:
        s0, e0 = grupo[0]['s'], grupo[-1]['e']
        i0 = bisect.bisect_left(inicios, s0)
        antes = todas[i0 - 1]['e'] if i0 > 0 else 0.0
        j0 = bisect.bisect_right(inicios, grupo[-1]['s'])
        despues = todas[j0]['s'] if j0 < len(todas) else F / 100
        # Inicio: hacia atrás desde la palabra hasta el primer silencio (como mucho 0,3 s y sin tocar la palabra anterior)
        lim = fr(max(antes + 0.01, s0 - 0.30)); i = fr(s0)
        while i > lim and rms[i] >= umbral: i -= 1
        na = max(antes + 0.005, i / 100 - 0.02)
        # Final: hacia delante hasta que la voz baje de verdad 30 ms seguidos (como mucho 0,4 s)
        lim = fr(min(despues - 0.01, e0 + 0.40)); j = fr(e0)
        while j < lim and not (rms[j:j + 3] < umbral).all(): j += 1
        nb = min(despues - 0.005, j / 100 + 0.04)
        out.append((na, nb, grupo, k) if nb - na > 0.15 else (a, b, grupo, k))
    return out


tramos = ajustar(tramos)
# Dos tramos seguidos del bruto no pueden pisarse: cada uno se estira hacia el hueco entre sus palabras y, si las
# frases van pegadas, el trozo del medio salía DOS veces (0,1-0,23 s repetidos en cada corte; Kevin, 09-11).
# El corte queda en el centro del solape, que siempre cae en el hueco entre la última palabra y la siguiente.
for n in range(1, len(tramos)):
    a0, b0, g0, k0 = tramos[n - 1]; a1, b1, g1, k1 = tramos[n]
    if a0 <= a1 < b0:
        m = round((a1 + b0) / 2, 3)
        tramos[n - 1] = (a0, max(m, g0[-1]['e']), g0, k0); tramos[n] = (min(m, g1[0]['s']), b1, g1, k1)
        if tramos[n][0] < tramos[n - 1][1]: tramos[n] = (tramos[n - 1][1], b1, g1, k1)
palabras, t, filtros, etiquetas, mapa = [], 0.0, [], '', []
for n, (a, b, grupo, k) in enumerate(tramos):
    a = max(0, a)
    mapa.append({'montaje': round(t, 3), 'bruto_ini': round(a, 3), 'bruto_fin': round(b, 3), 'seg': k})
    for w in grupo:
        palabras.append({'w': w['w'], 's': round(t + w['s'] - a, 3), 'e': round(t + w['e'] - a, 3), 'seg': k})
    filtros.append(f"[0:v]trim={a:.3f}:{b:.3f},setpts=PTS-STARTPTS[v{n}];"
                   f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={b-a-0.02:.3f}:d=0.02[a{n}];")
    etiquetas += f'[v{n}][a{n}]'
    t += b - a
fc = ''.join(filtros) + f'{etiquetas}concat=n={len(tramos)}:v=1:a=1[v][a]'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-filter_complex', fc, '-map', '[v]', '-map', '[a]',
                '-c:v', 'h264_videotoolbox', '-b:v', os.environ.get('BITRATE', '16M'), '-c:a', 'aac', '-b:a', '256k', '-r', '30',
                os.path.join(outd, 'montaje.mp4')], check=True)
# `tramos`: dónde empieza cada pieza en el montaje y de qué segundos del bruto sale. Sirve para colocar zooms
# justo en los cortes y para recolocar gráficos por su segundo del bruto si luego se recorta (método de Luis).
json.dump({'duracion': round(t, 3), 'cortes': len(tramos), 'palabras': palabras, 'tramos': mapa},
          open(os.path.join(outd, 'palabras.json'), 'w'), ensure_ascii=False, indent=1)
print(f'montaje {t:.1f} s, {len(tramos)} tramos, {len(palabras)} palabras')
