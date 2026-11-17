"""Herramientas DSP para el set: carga, loudness BS.1770, filtros que se mueven, eco, backspin, estirado."""
import numpy as np, subprocess, os, tempfile
from scipy.signal import sosfilt, butter, lfilter

SR = 44100


def load(path, sr=SR):
    r = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-i', path, '-ac', '2', '-ar', str(sr),
                        '-f', 'f32le', '-'], capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.float32).reshape(-1, 2).copy()


def save(path, x, sr=SR):
    p = subprocess.Popen(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '2',
                          '-i', '-', '-c:a', 'pcm_f32le', path], stdin=subprocess.PIPE)
    p.stdin.write(np.ascontiguousarray(x, np.float32).tobytes()); p.stdin.close(); p.wait()


def stretch(x, ratio):
    """ratio>1 = más rápido. ffmpeg atempo (mantiene el tono)."""
    if abs(ratio - 1) < 1e-4:
        return x
    with tempfile.TemporaryDirectory() as d:
        a, b = os.path.join(d, 'a.wav'), os.path.join(d, 'b.wav')
        save(a, x)
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', a, '-af', f'atempo={ratio:.6f}',
                        '-c:a', 'pcm_f32le', b], check=True)
        return load(b)


def _kweight(sr=SR):
    import math
    G, Q, fc = 3.99984385397, 0.7071752369554193, 1681.9744509555319
    K = math.tan(math.pi * fc / sr); Vh = 10 ** (G / 20); Vb = Vh ** 0.499666774155
    a0 = 1 + K / Q + K * K
    b1 = [(Vh + Vb * K / Q + K * K) / a0, 2 * (K * K - Vh) / a0, (Vh - Vb * K / Q + K * K) / a0]
    a1 = [1, 2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0]
    Q, fc = 0.5003270373253953, 38.13547087613982
    K = math.tan(math.pi * fc / sr)
    b2 = [1, -2, 1]; a2 = [1, 2 * (K * K - 1) / (1 + K / Q + K * K), (1 - K / Q + K * K) / (1 + K / Q + K * K)]
    return b1, a1, b2, a2


def lufs(x, sr=SR):
    b1, a1, b2, a2 = _kweight(sr)
    y = lfilter(b2, a2, lfilter(b1, a1, x, axis=0), axis=0)
    blk, hop = int(0.4 * sr), int(0.1 * sr)
    n = 1 + (len(y) - blk) // hop
    if n < 1:
        return -70.0
    ms = np.array([np.mean(y[i * hop:i * hop + blk] ** 2, axis=0).sum() for i in range(n)])
    l = -0.691 + 10 * np.log10(ms + 1e-12)
    g = ms[l > -70]
    if len(g) == 0:
        return -70.0
    rel = -0.691 + 10 * np.log10(g.mean()) - 10
    g2 = ms[(l > -70) & (l > rel)]
    return float(-0.691 + 10 * np.log10(g2.mean()))


def sweep(x, kind, f_start, f_end, order=2, curve='exp', blk=512):
    """Filtro pasa-altos/pasa-bajos cuya frecuencia va de f_start a f_end a lo largo de x."""
    n = len(x); out = np.empty_like(x)
    zi = None; nb = int(np.ceil(n / blk))
    for i in range(nb):
        t = (i + 0.5) / nb
        fc = f_start * (f_end / f_start) ** t if curve == 'exp' else f_start + (f_end - f_start) * t
        fc = float(np.clip(fc, 20, SR / 2 * 0.95))
        sos = butter(order, fc, btype='highpass' if kind == 'hp' else 'lowpass', fs=SR, output='sos')
        if zi is None:
            zi = np.zeros((sos.shape[0], 2, 2))
        seg = x[i * blk:(i + 1) * blk]
        y, zi = sosfilt(sos, seg, axis=0, zi=zi)
        out[i * blk:(i + 1) * blk] = y
    return out


def static(x, kind, fc, order=4):
    sos = butter(order, fc, btype='highpass' if kind == 'hp' else 'lowpass', fs=SR, output='sos')
    return sosfilt(sos, x, axis=0).astype(np.float32)


def echo_tail(x, delay_s, fb=0.55, n_rep=10, hp=250, lp=6000, width=0.35):
    """Eco a tempo, cada repetición más filtrada; alterna izquierda/derecha."""
    d = int(round(delay_s * SR)); L = len(x) + d * n_rep
    out = np.zeros((L, 2), np.float32)
    src = static(static(x, 'hp', hp, 2), 'lp', lp, 2)
    g = 1.0
    for k in range(1, n_rep + 1):
        g *= fb
        pan = np.array([1 - width, 1 + width]) if k % 2 else np.array([1 + width, 1 - width])
        out[k * d:k * d + len(x)] += src * g * pan
        src = static(src, 'lp', max(1500, lp * 0.8 ** k), 1)
    return out


def backspin(x, end_idx, dur=1.4, max_speed=-3.2):
    """Backspin de plato con el propio audio: frena, gira hacia atrás y se para."""
    n = int(dur * SR); t = np.arange(n) / SR
    t1 = 0.18
    v = np.where(t < t1, 1 + (max_speed - 1) * (t / t1), max_speed * (1 - (t - t1) / (dur - t1)) ** 1.6)
    pos = end_idx + np.cumsum(v)
    pos = np.clip(pos, 0, len(x) - 2)
    i0 = pos.astype(int); fr = (pos - i0)[:, None]
    y = x[i0] * (1 - fr) + x[i0 + 1] * fr
    env = np.clip(np.abs(v) / abs(max_speed), 0.15, 1)[:, None] * np.linspace(1, 0.0, n)[:, None] ** 0.7
    return (static(y, 'hp', 90, 2) * env).astype(np.float32)


def fade(n, kind='in', shape='eq'):
    t = np.linspace(0, 1, n, dtype=np.float32)
    if shape == 'eq':
        y = np.sin(t * np.pi / 2)
    elif shape == 'lin':
        y = t
    else:
        y = t ** 2
    return (y if kind == 'in' else y[::-1])[:, None]


def db(v):
    return 10 ** (v / 20)
