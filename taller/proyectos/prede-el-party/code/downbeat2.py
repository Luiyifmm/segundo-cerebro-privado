"""Tiempo 1 del compás: votos de bajo (golpes graves), cambios de acorde y comienzo de frases cantadas."""
import numpy as np, json, subprocess, glob, os
from scipy.signal import stft
SR = 22050
z = lambda v: (np.array(v) - np.mean(v)) / (np.std(v) + 1e-9)
for an in sorted(glob.glob('an/*.json')):
    n = os.path.basename(an)[:2]; d = json.load(open(an)); b = np.array(d['beats'])
    r = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-i', f'wav/{n}.wav', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True)
    x = np.frombuffer(r.stdout, np.float32)
    f, t, Z = stft(x, SR, nperseg=2048, noverlap=2048 - 256, boundary=None, padded=False)
    M = np.log1p(1000 * np.abs(Z)); fl = np.maximum(0, np.diff(M, axis=1))[f < 150].sum(0)
    fps = SR / 256; bi = np.clip((b * fps).astype(int), 1, len(fl) - 3)
    lowon = np.array([fl[i - 1:i + 3].max() for i in bi])
    A = [lowon[k::4].mean() for k in range(4)]
    P = np.abs(Z) ** 2; m = (f > 60) & (f < 2000); midi = np.round(12 * np.log2(f[m] / 440) + 69).astype(int) % 12
    C = np.stack([P[m][midi == k].sum(0) for k in range(12)]); C = C / (C.sum(0) + 1e-9)
    ch = np.array([C[:, bi[i]:bi[i + 1]].mean(1) if bi[i + 1] > bi[i] else C[:, bi[i]] for i in range(len(b) - 1)])
    nov = np.zeros(len(ch))
    for i in range(2, len(ch) - 2): nov[i] = np.linalg.norm(ch[i:i + 2].mean(0) - ch[i - 2:i].mean(0))
    Bv = [nov[k::4].mean() for k in range(4)]
    Cv = np.zeros(4); nl = 0
    p = os.path.expanduser(f'~/Videos-Remotion/voz/salida-whisperx/{n}.palabras.json')
    try:
        ws = json.load(open(p)); ws = ws['palabras'] if isinstance(ws, dict) else ws
        ws = [w for w in ws if w.get('inicio') is not None]
        last = -9
        for w in ws:
            if w['inicio'] - last > 1.0:
                j = int(np.argmin(np.abs(b - w['inicio'])))
                if abs(b[j] - w['inicio']) < 0.15: Cv[j % 4] += 1; nl += 1
            last = w['fin']
    except Exception:
        pass
    tot = z(A) + z(Bv) + (z(Cv) * min(1, nl / 8) if nl >= 4 else 0)
    k = int(np.argmax(tot)); s = sorted(tot, reverse=True)
    d['downbeats'] = [round(float(v), 4) for v in b[k::4]]; d['db_margin'] = float(s[0] - s[1])
    json.dump(d, open(an, 'w'))
    print(n, 'fase', k, f'margen={s[0]-s[1]:.2f}')
