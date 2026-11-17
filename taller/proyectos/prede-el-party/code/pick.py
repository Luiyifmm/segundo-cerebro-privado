"""Propone el fragmento de cada canción: 60-100 s, en compases, el tramo con más estribillo y energía."""
import json, sys, numpy as np
B = sys.argv[1]
ids = sys.argv[2].split(',')
res = {}
for n in ids:
    d = json.load(open(f'{B}/{n}.json'))
    bars = np.array(d['bars']); E = np.array(d['energy']); R = np.array(d['rep'])
    z = lambda v: (v - v.mean()) / (v.std() + 1e-9)
    sc = z(R) + z(E); nb = len(bars)
    best = None
    for L in range(16, nb + 1, 4):
        for s in range(0, nb - L + 1, 2):
            dur = bars[s + L - 1, 1] - bars[s, 0]
            if dur < 60 or dur > 100: continue
            w = sc[s:s + L]
            v = w.mean() - 0.004 * abs(dur - 80) - (0.6 if s < 4 else 0) - (0.4 if sc[s + L - 1] < -1 else 0)
            if best is None or v > best[0]: best = (v, s, L, dur)
    v, s, L, dur = best
    res[n] = dict(start=float(bars[s, 0]), end=float(bars[s + L - 1, 1]), bars=L, dur=round(float(dur), 1))
    print(f"{n}: {bars[s,0]:6.1f} -> {bars[s+L-1,1]:6.1f}  ({L} compases, {dur:.0f} s)")
json.dump(res, open(sys.argv[3], 'w'), indent=1)
