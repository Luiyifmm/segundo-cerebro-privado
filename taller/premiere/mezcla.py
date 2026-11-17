# Reconstruye la mezcla de 66 a 116 s con ffmpeg a partir del volcado y mide sonoridad y picos (total y por tramo).
import json, math, os, subprocess, sys
FF = os.path.expanduser('~/.local/bin/ffmpeg'); d = json.load(open(sys.argv[1])); sal = sys.argv[2]; solo = sys.argv[3] if len(sys.argv) > 3 else None
args = [FF, '-nostdin', '-v', 'error', '-y']; fl = []; n = 0
for c in d:
    if not c.get('p') or not os.path.exists(c['p']): print('sin archivo', c['n']); continue
    if solo and solo not in c['pista'] and solo not in c['n']: continue
    g = 20 * math.log10(max(c['vol'], 1e-6)) + 15; dur = c['e'] - c['s']
    args += ['-ss', '%.4f' % c['inp'], '-t', '%.4f' % dur, '-i', c['p']]
    fl.append('[%d:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=%.2fdB,adelay=%d:all=1[a%d]' % (n, g, max(0, round((c['s'] - 66) * 1000)), n)); n += 1
fl.append(''.join('[a%d]' % i for i in range(n)) + 'amix=inputs=%d:normalize=0:duration=longest[m]' % n)
subprocess.run(args + ['-filter_complex', ';'.join(fl), '-map', '[m]', '-t', '50.5', '-c:a', 'pcm_s24le', sal], check=True)
def medir(extra, nombre):
    o = subprocess.run([FF, '-nostdin', '-i', sal] + extra + ['-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    I = [l for l in o.splitlines() if ' I:' in l][-1].split()[1]; P = [l for l in o.splitlines() if 'Peak:' in l][-1].split()[1]; print('%-28s %6s LUFS  pico %6s dBFS' % (nombre, I, P))
medir([], 'total' + (' (' + solo + ')' if solo else ''))
if not solo:
    for a, b, nm in ((0, 34, 'versus 66-100'), (36.2, 39.6, 'MG escuela'), (43.3, 46.9, 'MG cadenas'), (46.9, 49.7, 'CTA')): medir(['-ss', str(a), '-t', str(b - a)], nm)
