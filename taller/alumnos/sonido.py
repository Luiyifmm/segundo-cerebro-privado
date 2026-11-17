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
    e = subprocess.run(['ffmpeg', '-nostdin', '-i', entrada_audio, '-af', 'loudnorm=I=-14:TP=-1:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    j = json.loads(e[e.rindex('{'):e.rindex('}') + 1])
    af = 'loudnorm=I=-14:TP=-1:LRA=11:measured_I=%s:measured_TP=%s:measured_LRA=%s:measured_thresh=%s:offset=%s:linear=true' % (j['input_i'], j['input_tp'], j['input_lra'], j['input_thresh'], j['target_offset'])
    run('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', video, '-i', entrada_audio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', af, '-ar', '48000', '-c:a', 'aac', '-b:a', '256k', '-shortest', salida)
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
    run(PY, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'reel_alumno.py'), SPEC, 'eventos')
    ev = os.path.join(AQUI, 'eventos.json'); cues = os.path.join(SFX, 'cues.json')
    run('python3', RS + '/scripts/from_cues.py', ev, '--video', WORK + '/video_voz.mp4', '--out', cues, '--ui', 'library', cwd=RS)
    variar(cues)
    if S.get('sfx_edits'): run('python3', RS + '/scripts/sheet.py', 'apply', cues, os.path.join(AQUI, S['sfx_edits']), cwd=RS)
    run('python3', RS + '/scripts/mix.py', cues, '--out', SFX + '/video_sfx.mp4', *(['--voice-safe'] if VOZ else []), '--sfx-trim-db', str(S.get('sfx_trim', -4 if VOZ else 0)), cwd=RS)
    r = subprocess.run(['python3', RS + '/scripts/critique.py', SFX + '/video_sfx_resolved_cues.json', SFX + '/video_sfx_sfx_track.wav'], capture_output=True, text=True, cwd=RS)
    open(os.path.join(AQUI, 'critica_sfx.md'), 'w').write(r.stdout + r.stderr); print(r.stdout[-1500:])

def musica():
    os.makedirs(MEDIA, exist_ok=True)
    v = SFX + '/video_sfx.mp4'; dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', v], capture_output=True, text=True).stdout)
    base = WORK + '/mezcla_sin_musica.wav'; run('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', v, '-vn', '-ar', '48000', '-ac', '2', base)
    titulo = S.get('titulo_salida', S['alumno'].split(' (')[0].split()[0] + ' - ' + os.path.basename(AQUI))
    if VOZ: master(base, v, os.path.join(MEDIA, titulo + ' - v1 lote (sin música).mp4'))   # sin voz, «sin música» serían solo efectos
    if not S.get('musica'): return
    desde = S.get('musica_desde', 0); m = WORK + '/mus_cruda.wav'
    run('ffmpeg', '-v', 'error', '-nostdin', '-y', '-ss', str(desde), '-t', '%.3f' % dur, '-i', MUS + S['musica'], '-af', 'afade=t=in:d=0.3,afade=t=out:st=%.3f:d=2' % max(0, dur - 2), '-ar', '48000', '-ac', '2', m)
    obj = S.get('musica_lufs', -25 if VOZ else -16); g = obj - lufs(m)
    mix = WORK + '/mezcla_con_musica.wav'
    run('ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', base, '-i', m, '-filter_complex', '[1:a]volume=%.2fdB[m];[0:a][m]amix=inputs=2:normalize=0:duration=first[a]' % g, '-map', '[a]', '-ar', '48000', mix)
    master(mix, v, os.path.join(MEDIA, titulo + ' - v1 lote (música).mp4'))

if PASO in ('efectos', 'todo'): efectos()
if PASO in ('musica', 'todo'): musica()
