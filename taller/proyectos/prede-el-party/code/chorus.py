"""Por compás: energía + cuánto se repite (estribillo). Guarda bars.json por canción."""
import numpy as np, json, sys, subprocess
from scipy.signal import stft
SR = 22050
wav, an, out = sys.argv[1], sys.argv[2], sys.argv[3]
r = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-i', wav, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True)
x = np.frombuffer(r.stdout, np.float32)
d = json.load(open(an))
down = np.array(d['downbeats'])
f, t, Z = stft(x, SR, nperseg=4096, noverlap=4096 - 1024, boundary=None, padded=False)
P = np.abs(Z) ** 2
m = (f > 80) & (f < 4000)
midi = np.round(12 * np.log2(f[m] / 440) + 69).astype(int) % 12
C = np.stack([P[m][midi == k].sum(0) for k in range(12)])
edges = np.geomspace(60, 10000, 21)
T = np.log(np.stack([P[(f >= edges[i]) & (f < edges[i + 1])].sum(0) for i in range(20)]) + 1e-9)
bars = []
for i in range(len(down) - 1):
    a, b = np.searchsorted(t, down[i]), np.searchsorted(t, down[i + 1])
    if b <= a: continue
    c = C[:, a:b].mean(1); c = c / (np.linalg.norm(c) + 1e-9)
    tm = T[:, a:b].mean(1)
    seg = x[int(down[i] * SR):int(down[i + 1] * SR)]
    e = 10 * np.log10(np.mean(seg ** 2) + 1e-12)
    bars.append((down[i], down[i + 1], c, tm, e))
n = len(bars)
Cb = np.stack([b[2] for b in bars]); Tb = np.stack([b[3] for b in bars])
Tb = (Tb - Tb.mean(0)) / (Tb.std(0) + 1e-9); Tb /= np.linalg.norm(Tb, axis=1, keepdims=True) + 1e-9
S = 0.6 * (Cb @ Cb.T) + 0.4 * (Tb @ Tb.T)
W = 4; rep = np.zeros(n)
for i in range(n - W):
    sims = []
    for j in range(n - W):
        if abs(i - j) < 8: continue
        sims.append(np.mean([S[i + k, j + k] for k in range(W)]))
    sims = np.array(sims) if sims else np.zeros(1)
    rep[i] = np.sort(sims)[-3:].mean()
E = np.array([b[4] for b in bars])
json.dump({'bars': [[round(b[0], 4), round(b[1], 4)] for b in bars], 'energy': E.round(2).tolist(),
           'rep': rep.round(3).tolist()}, open(out, 'w'))
print(wav.split('/')[-1], n, 'compases')
