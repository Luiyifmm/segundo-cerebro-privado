# Sonido del lote 17-11: efectos reales (real-sfx, biblioteca de Luis, sin síntesis) + música de la biblioteca de la Sala + master.
# Uso: python3 sonido.py <spec.json> [efectos|musica|todo]
#  efectos: eventos.json (de reel_alumno.py) -> from_cues --ui library -> mix (--voice-safe si hay voz) -> critique
#  musica:  música desde S['musica_desde'] con fundido final; bajo voz a -25 LUFS (sin voz: -16); master -14 LUFS / TP -1 (dos pasadas)
# Salidas en MEDIA/<alumno>/: «<titulo> - v1 lote (música).mp4» y «(sin música).mp4».
import os, sys, json, re, subprocess
SPEC = os.path.abspath(sys.argv[1]); S = json.load(open(SPEC)); AQUI = os.path.dirname(SPEC); PASO = sys.argv[2] if len(sys.argv) > 2 else 'todo'
WORK = S.get('trabajo') or os.path.join('/private/tmp/claude-501/lote-1711', os.path.basename(AQUI))
RS = os.path.expanduser('~/.claude/skills/real-sfx'); LOTE = os.path.dirname(AQUI)
PY = os.path.expanduser('~/Videos-Remotion/herramientas/entornos/whisperx/bin/python')
MUS = os.path.expanduser('~/Proyectos/amin/sala-edicion/public/lib/musica/')
MEDIA = os.path.expanduser('~/EDICION/3 PROYECTOS/Alumnos Trainer10x/MEDIA/' + S['alumno'])
VOZ = S.get('audio', 'voz') == 'voz'
SFX = os.path.join(WORK, 'sfx'); os.makedirs(SFX, exist_ok=True)
def run(*a, **kw): print('>', ' '.join(str(x) for x in a)[:200], flush=True); return subprocess.run([str(x) for x in a], check=True, **kw)
def lufs(f):
    e = subprocess.run(['ffmpeg', '-nostdin', '-i', f, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = re.findall(r'I:\s+(-?[\d.]+) LUFS', e); return float(m[-1]) if m else None
def master(entrada_audio, video, salida):
    """loudnorm en dos pasadas, lineal, a -14 LUFS y -1 dBTP; vídeo copiado."""
    e = subprocess.run(['ffmpeg', '-nostdin', '-i', entrada_audio, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    j = json.loads(e[e.rindex('{'):e.rindex('}') + 1])
    af = 'loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s:linear=true,alimiter=limit=0.8:level=false' % (j['input_i'], j['input_tp'], j['input_lra'], j['input_thresh'], j['target_offset'])
    run('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', video, '-i', entrada_audio, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '20', '-maxrate', '14M', '-bufsize', '28M', '-pix_fmt', 'yuv420p', '-af', af, '-ar', '48000', '-c:a', 'aac', '-b:a', '256k', '-shortest', salida)
    print('master', salida, lufs(salida), 'LUFS')

POOL = {'pop': [303, 296, 297, 301, 560, 846, 1183, 853, 859, 852], 'tick': None}
def variar(cues):
    """Variedad: los pops rotan entre grabaciones distintas de la biblioteca; los ticks (aterrizajes) bajan 6 dB; nada de síntesis."""
    d = json.load(open(cues)); k = 0
    for c in d['cues']:
        if c.get('label') == 'pop' and not c.get('id'):
            c.pop('pick', None); c['id'] = POOL['pop'][k % len(POOL['pop'])]; k += 1
        if c.get('label') == 'tick': c['gain_db'] = c.get('gain_db', 0) - 3
        g = {'whoosh': -4, 'click': 8, 'tick': 3, 'hit': -2, 'swoosh': -3}; g.update(S.get('ganancias', {}))
        if c.get('label') in g: c['gain_db'] = c.get('gain_db', 0) + g[c['label']]
    json.dump(d, open(cues, 'w'), ensure_ascii=False, indent=1)

def efectos():
    run(PY, os.path.join(LOTE, 'reel_alumno.py'), SPEC, 'eventos')
    ev = os.path.join(AQUI, 'eventos.json'); cues = os.path.join(SFX, 'cues.json')
    run('python3', RS + '/scripts/from_cues.py', ev, '--video', WORK + '/video_voz.mp4', '--out', cues, '--ui', 'library', cwd=RS)
    variar(cues)
    if S.get('sfx_edits'): run('python3', RS + '/scripts/sheet.py', 'apply', cues, os.path.join(AQUI, S['sfx_edits']), cwd=RS)
    run('python3', RS + '/scripts/mix.py', cues, '--out', SFX + '/video_sfx.mp4', *(['--voice-safe'] if VOZ else []), '--sfx-trim-db', str(S.get('sfx_trim', -4 if VOZ else 0)), cwd=RS)
    r = subprocess.run(['python3', RS + '/scripts/critique.py', SFX + '/video_sfx_resolved_cues.json', SFX + '/video_sfx_sfx_track.wav'], capture_output=True, text=True, cwd=RS)
    open(os.path.join(AQUI, 'critica_sfx.md'), 'w').write(r.stdout + r.stderr); print(r.stdout[-1500:])

VER = S.get('version', 'v1')
def ruta_mus(n):
    p = os.path.expanduser(n); return p if os.path.exists(p) else MUS + n
def capas(base, dur):
    """v2: sonidos concretos por archivo (aullido, ambiente de oficina, notificación…) con su volumen y fundidos.
    Para cortes J/L se adelanta 't' antes de que entre la imagen (J) y se alarga 'dur' tras volver a la persona (L)."""
    cs = S.get('capas_sonido', [])
    if not cs: return base
    a = ['-i', base]; fc = []
    for k, c in enumerate(cs):
        d = c.get('dur', 2.0); a += ['-ss', str(c.get('desde', 0)), '-t', '%.3f' % d, '-i', os.path.expanduser(c['archivo'])]
        fc.append('[%d:a]aresample=48000,aformat=channel_layouts=stereo,volume=%sdB,afade=t=in:d=%s,afade=t=out:st=%.3f:d=%s,adelay=%d|%d[c%d]' % (
            k + 1, c.get('db', -10), c.get('fade_in', 0.3), max(0, d - c.get('fade_out', 0.6)), c.get('fade_out', 0.6), int(c['t'] * 1000), int(c['t'] * 1000), k))
    fc.append('[0:a]' + ''.join('[c%d]' % k for k in range(len(cs))) + 'amix=inputs=%d:normalize=0:duration=first[a]' % (len(cs) + 1))
    out = WORK + '/mezcla_capas.wav'; run('ffmpeg', '-v', 'error', '-nostdin', '-y', *a, '-filter_complex', ';'.join(fc), '-map', '[a]', '-ar', '48000', out); return out
def pista_musicas(dur):
    """v2: una o varias músicas («musicas»: archivo, desde, t0) con fundido cruzado de 'cruce' s entre una y la siguiente."""
    ms = S.get('musicas') or [{'archivo': S['musica'], 'desde': S.get('musica_desde', 0), 't0': 0}]
    obj = S.get('musica_lufs', -21 if VOZ else -15); partes = []
    for k, m_ in enumerate(ms):
        t0 = m_['t0']; t1 = ms[k + 1]['t0'] if k + 1 < len(ms) else dur; cr = m_.get('cruce', 1.2) if k + 1 < len(ms) else 0
        d = t1 - t0 + cr; p = WORK + '/mus_%d.wav' % k
        run('ffmpeg', '-v', 'error', '-nostdin', '-y', '-stream_loop', '-1', '-ss', str(m_.get('desde', 0)), '-t', '%.3f' % d, '-i', ruta_mus(m_['archivo']), '-af',
            m_.get('filtro', 'anull') + ',' + 'afade=t=in:d=%s,afade=t=out:st=%.3f:d=%s' % (0.15 if k == 0 else ms[k - 1].get('cruce', 1.2), max(0, d - (cr or 0.7)), cr or 0.7), '-ar', '48000', '-ac', '2', p)
        g = obj + m_.get('db', 0) - lufs(p); q = p + '.g.wav'
        run('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', p, '-af', 'volume=%.2fdB,adelay=%d|%d' % (g, int(t0 * 1000), int(t0 * 1000)), q); partes.append(q)
    m = WORK + '/mus_cruda.wav'
    if len(partes) == 1: run('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', partes[0], '-t', '%.3f' % dur, m)
    else: run('ffmpeg', '-v', 'error', '-nostdin', '-y', *sum([['-i', x] for x in partes], []), '-filter_complex', ''.join('[%d:a]' % k for k in range(len(partes))) + 'amix=inputs=%d:normalize=0:duration=longest,atrim=0:%.3f[a]' % (len(partes), dur), '-map', '[a]', m)
    return m

def musica():
    os.makedirs(MEDIA, exist_ok=True)
    tj = os.path.join(WORK, 'tiempos_v2.json')              # capas y músicas con los tiempos ya llevados al montaje (paso «eventos»)
    if os.path.exists(tj): S.update({k: v for k, v in json.load(open(tj)).items() if v})
    v = SFX + '/video_sfx.mp4'; dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', v], capture_output=True, text=True).stdout)
    base = WORK + '/mezcla_sin_musica.wav'; run('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', v, '-vn', '-ar', '48000', '-ac', '2', base)
    base = capas(base, dur)
    titulo = S.get('titulo_salida', S['alumno'].split(' (')[0].split()[0] + ' - ' + os.path.basename(AQUI))
    if VOZ: master(base, v, os.path.join(MEDIA, titulo + ' - %s lote (sin música).mp4' % VER))   # sin voz, «sin música» serían solo efectos
    if not (S.get('musica') or S.get('musicas')): return
    m = pista_musicas(dur); g = 0
    mix = WORK + '/mezcla_con_musica.wav'; voz = WORK + '/voz.wav'
    sd = ''.join(",volume=enable='between(t,%.3f,%.3f)':volume=0.05" % (t_ - 0.35, t_ - 0.02) for t_ in S.get('stopdowns', []))   # v3: silencio breve antes del golpe
    if VOZ and os.path.exists(voz):      # v3 (earshot vs favoritas): música más presente y que se aparta sola cuando habla la voz (3-6 dB)
        fc = '[1:a]volume=%.2fdB%s[m];[2:a]aresample=48000,aformat=channel_layouts=stereo,asplit=1[k];[m][k]sidechaincompress=threshold=0.04:ratio=3:attack=25:release=350:makeup=1[md];[0:a][md]amix=inputs=2:normalize=0:duration=first[a]' % (g, sd)
        run('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', base, '-i', m, '-i', voz, '-filter_complex', fc, '-map', '[a]', '-ar', '48000', mix)
    else:
        run('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', base, '-i', m, '-filter_complex', '[1:a]volume=%.2fdB%s[m];[0:a][m]amix=inputs=2:normalize=0:duration=first[a]' % (g, sd), '-map', '[a]', '-ar', '48000', mix)
    master(mix, v, os.path.join(MEDIA, titulo + ' - %s lote (música).mp4' % VER))

if PASO in ('efectos', 'todo'): efectos()
if PASO in ('musica', 'todo'): musica()
