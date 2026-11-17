"""Control rápido: nivel antes/después de cada entrada y huecos (< -35 LUFS momentáneo > 0,25 s) cerca de ellas."""
import re, json, sys, subprocess, statistics as st, os
w = sys.argv[1]; S = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tmp = f'{S}/in/qc_st.txt'
subprocess.run(['ffmpeg', '-nostdin', '-nostats', '-i', w, '-af', f'ebur128=metadata=1,ametadata=print:file={tmp}', '-f', 'null', '-'],
               capture_output=True)
log = json.load(open(w + '.log.json'))['log']; n = json.load(open(f'{S}/nombres.json'))
M = []; t = None
def f(x):
    try: return float(x)
    except Exception: return -99
for l in open(tmp):
    m = re.search(r'pts_time:([\d.]+)', l)
    if m: t = float(m.group(1)); continue
    m = re.search(r'r128.M=(\S+)', l)
    if m: M.append((t, f(m.group(1))))
def med(a, b):
    v = [x for tt, x in M if a <= tt < b and x > -60]; return st.median(v) if v else -99
for l in log[1:]:
    ti = l['t_in']; pre = med(ti - 8, ti - 1); post = med(ti + 0.3, ti + 8)
    holes = []; s0 = None
    for tt, v in M:
        if ti - 6 <= tt <= ti + 6:
            if v < -35 and s0 is None: s0 = tt
            if v >= -35 and s0 is not None:
                if tt - s0 > 0.25: holes.append(f'{s0-ti:+.1f}s/{tt-s0:.1f}')
                s0 = None
    flag = ' <==' if abs(post - pre) > 2.5 or holes else ''
    print(f"{n[l['id']][:24]:24} {int(ti//60)}:{ti%60:04.1f} {l['entra']:6} antes {pre:6.1f} después {post:6.1f} salto {post-pre:+.1f} huecos {holes}{flag}")
