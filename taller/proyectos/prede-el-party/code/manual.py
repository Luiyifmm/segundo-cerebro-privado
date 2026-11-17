"""Fragmentos elegidos a mano (por la letra o por el árbitro), cuadrados al compás."""
import json, numpy as np
want = {'05': (150, 80), '01': (17.0, 74), '02': (0.0, 76), '16': (62, 80), '18': (38, 76), '24': (27.0, 79),
        '27': (8, 118), '29': (40, 80), '32': (0, 72), '33': (45.3, 80), '34': (28, 72)}
out = {}
for n, (s0, dur) in want.items():
    d = json.load(open(f'bars/{n}.json')); b = np.array(d['bars'])
    i = int(np.argmin(np.abs(b[:, 0] - s0)))
    if b[i, 0] < s0 - 1.5 and i + 1 < len(b): i += 1
    best = None
    for L in range(16, len(b) - i + 1, 4):
        dd = b[i + L - 1, 1] - b[i, 0]
        if best is None or abs(dd - dur) < abs(best[1] - dur): best = (L, dd)
    L, dd = best
    out[n] = dict(start=float(b[i, 0]), end=float(b[i + L - 1, 1]), bars=L, dur=round(float(dd), 1))
    print(n, out[n])
json.dump(out, open('pick_manual.json', 'w'), indent=1)
