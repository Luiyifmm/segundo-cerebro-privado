"""Analiza la edición de una carpeta de reels (.mp4).
Uso: uv run --with mlx-whisper python analizar.py CARPETA [--sin-voz]
Por cada vídeo deja en CARPETA/analisis/<id>/:
  datos.json  → duración, cortes (escenas), plano medio, volumen LUFS, palabras/seg, primera frase
  gancho.jpg  → primeros 3 s a 6 fps (lo que pasa en el gancho)
  hoja.jpg    → 24 fotogramas repartidos por todo el vídeo
Salta lo ya analizado. Al final escribe CARPETA/analisis/resumen.json."""
import sys, os, re, json, subprocess, statistics

FF = 'ffmpeg'
carpeta = sys.argv[1]
con_voz = '--sin-voz' not in sys.argv
out = os.path.join(carpeta, 'analisis'); os.makedirs(out, exist_ok=True)
vids = sorted(f for f in os.listdir(carpeta) if f.lower().endswith(('.mp4', '.mov')))
if con_voz:
    import mlx_whisper


def run(args):
    return subprocess.run(args, capture_output=True, text=True).stderr


def duracion(f):
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', run([FF, '-i', f]))
    return int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3]) if m else 0


def cortes(f):
    e = run([FF, '-i', f, '-vf', "scale=320:-2,select='gt(scene,0.32)',showinfo", '-an', '-f', 'null', '-'])
    return [round(float(x), 2) for x in re.findall(r'pts_time:([\d.]+)', e)]


def lufs(f):
    e = run([FF, '-i', f, '-af', 'ebur128', '-vn', '-f', 'null', '-'])
    m = re.findall(r'I:\s+(-?[\d.]+) LUFS', e)
    return float(m[-1]) if m else None


def hojas(f, d, dst):
    run([FF, '-y', '-v', 'error', '-t', '3', '-i', f, '-vf', 'fps=6,scale=240:-2,tile=6x3', '-frames:v', '1', f'{dst}/gancho.jpg'])
    paso = max(d / 24, 0.1)
    run([FF, '-y', '-v', 'error', '-i', f, '-vf', f'fps=1/{paso},scale=240:-2,tile=8x3', '-frames:v', '1', f'{dst}/hoja.jpg'])


resumen = []
for i, v in enumerate(vids, 1):
    vid = os.path.splitext(v)[0]; f = os.path.join(carpeta, v); dst = os.path.join(out, vid)
    dj = os.path.join(dst, 'datos.json')
    if os.path.exists(dj):
        resumen.append(json.load(open(dj))); continue
    os.makedirs(dst, exist_ok=True)
    d = duracion(f)
    if d <= 0:
        print('sin vídeo', v); continue
    c = cortes(f)
    bordes = [0] + c + [d]
    planos = [round(b - a, 2) for a, b in zip(bordes, bordes[1:]) if b - a > 0.05]
    datos = {'id': vid, 'duracion': round(d, 1), 'n_cortes': len(c), 'cortes': c,
             'plano_medio': round(statistics.mean(planos), 2), 'plano_mediana': round(statistics.median(planos), 2),
             'cortes_por_10s': round(len(c) / d * 10, 1), 'primer_corte': c[0] if c else None,
             'cortes_en_3s': sum(1 for x in c if x < 3), 'lufs': lufs(f)}
    if con_voz:
        try:
            r = mlx_whisper.transcribe(f, path_or_hf_repo='mlx-community/whisper-large-v3-turbo-q4',
                                       word_timestamps=True, condition_on_previous_text=False)
            pal = [w for s in r['segments'] for w in s.get('words', [])]
            habla = sum(w['end'] - w['start'] for w in pal)
            datos.update({'idioma': r.get('language'), 'texto': r['text'].strip(), 'n_palabras': len(pal),
                          'palabras_seg': round(len(pal) / d, 2) if d else 0,
                          'pct_voz': round(habla / d * 100) if d else 0,
                          'primera_palabra': round(pal[0]['start'], 2) if pal else None,
                          'gancho_texto': ' '.join(w['word'].strip() for w in pal if w['start'] < 4)})
        except Exception as e:
            datos['error_voz'] = str(e)[:200]
    hojas(f, d, dst)
    json.dump(datos, open(dj, 'w'), ensure_ascii=False, indent=1)
    resumen.append(datos)
    print(f'[{i}/{len(vids)}] {vid} {d:.0f}s cortes={len(c)} plano={datos["plano_medio"]}s', flush=True)

json.dump(resumen, open(os.path.join(out, 'resumen.json'), 'w'), ensure_ascii=False, indent=1)
print('FIN', len(resumen))
