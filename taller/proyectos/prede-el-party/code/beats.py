"""Tempo y pulsos de una canción (seguimiento por programación dinámica). Uso: beats.py wav salida.json [bpm_forzado]"""
import numpy as np, sys, json, subprocess
from scipy.signal import stft
SR = 22050; HOP = 256


def load(p):
    r = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.float32)


def onset_env(x):
    f, t, Z = stft(x, SR, nperseg=2048, noverlap=2048 - HOP, boundary=None, padded=False)
    M = np.log1p(1000 * np.abs(Z))
    d = np.maximum(0, np.diff(M, axis=1))
    full = d.sum(0); low = d[f < 150].sum(0)
    full = full - np.convolve(full, np.ones(32) / 32, 'same'); full = np.maximum(full, 0)
    return full / (full.std() + 1e-9), low / (low.std() + 1e-9), np.abs(Z), f


def tempo(env, fps):
    e = env - env.mean(); ac = np.correlate(e, e, 'full')[len(e) - 1:]
    lags = np.arange(len(ac)); bpm = 60 * fps / np.maximum(lags, 1)
    w = np.exp(-0.5 * (np.log2(bpm / 115) / 0.9) ** 2); sc = ac * w; sc[(bpm < 70) | (bpm > 190)] = -np.inf
    L = int(np.argmax(sc))
    return 60 * fps / L, L


def track(env, period, tight=200):
    n = len(env); score = env.copy(); back = -np.ones(n, int)
    for i in range(n):
        lo = i - int(2 * period); hi = i - int(period / 2)
        if hi <= 0: continue
        lo = max(lo, 0); prev = np.arange(lo, hi)
        pen = -tight * (np.log((i - prev) / period)) ** 2
        j = np.argmax(score[prev] + pen); score[i] = env[i] + score[prev][j] + pen[j]; back[i] = prev[j]
    i = int(np.argmax(score[-int(period * 2):])) + n - int(period * 2); b = []
    while i >= 0: b.append(i); i = back[i]
    return np.array(b[::-1])


x = load(sys.argv[1]); fps = SR / HOP
env, low, A, f = onset_env(x)
mid = env[len(env) // 6: len(env) * 5 // 6]
bpm, L = tempo(mid, fps)
if len(sys.argv) > 3: L = int(round(60 * fps / float(sys.argv[3])))
beats = track(env, L)
bt = beats / fps
ibi = np.median(np.diff(bt)); bpm2 = 60 / ibi
ph = [low[beats[k::4]].mean() for k in range(4)]; k0 = int(np.argmax(ph))
down = bt[k0::4]
rms = []
for i in range(len(bt) - 1):
    s = x[int(bt[i] * SR):int(bt[i + 1] * SR)]; rms.append(10 * np.log10(np.mean(s ** 2) + 1e-12))
out = dict(bpm=round(float(bpm2), 2), beats=[round(float(b), 4) for b in bt], downbeats=[round(float(b), 4) for b in down],
           beat_rms=[round(float(v), 2) for v in rms], ibi_std=float(np.std(np.diff(bt))))
json.dump(out, open(sys.argv[2], 'w'))
print(f"{sys.argv[1].split('/')[-1]} bpm={bpm2:.1f}")
