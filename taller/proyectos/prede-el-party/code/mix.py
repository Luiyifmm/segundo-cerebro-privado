"""Monta el set: intro + canciones con transiciones por compás + voces + SFX. Escribe un WAV de premáster.
Uso: mix.py plan.json salida.wav"""
import json, sys, numpy as np, os
sys.path.insert(0, os.path.dirname(__file__))
from dsp import *
from scipy.signal import lfilter

S = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
plan = json.load(open(sys.argv[1]))
OUT = sys.argv[2]
TARGET = -14.0                       # loudness de cada canción antes del máster
total = int(SR * (sum(s['end'] - s['start'] for s in plan['songs']) * 1.04 + 240))
mix = np.zeros((total, 2), np.float32)   # música + efectos (se agachan bajo la voz)
fx = mix
VOX = []                                 # voces: (t, audio, ganancia, agachado dB, duración seca, hueco 1-4 kHz dB)
log = []


def put(buf, t, x, g=1.0):
    i = int(round(t * SR))
    if i < 0:
        x = x[-i:]; i = 0
    buf[i:i + len(x)] += x * g


def sfx(name):
    return load(f'{S}/sfx/{name}.wav')


def fit_riser(name, peak_at, length):
    """Estira (sin cambiar tono) el riser para que su punto más alto caiga justo en el golpe."""
    x = sfx(name); m = np.abs(x).max(1)
    env = np.convolve(m, np.ones(2205) / 2205, 'same'); pk = int(env.argmax())
    r = float(np.clip((pk / SR) / length, 0.5, 2.0))
    y = stretch(x[:pk + int(0.25 * SR)], r)
    return y, int(pk / r) / SR


def vox_entry(v, t, vx=None):
    return (t, load(v['file']) if vx is None else vx, db(v.get('gain_db', 0)),
            v.get('duck_db', plan.get('duck_db', -7)), v.get('dur'), v.get('carve', 0))


songs = {}
for s in plan['songs']:
    n = s['id']
    a = json.load(open(f'{S}/an/{n}.json'))
    beats = np.array(a['beats'])
    inb = beats[(beats > s['start'] - 25) & (beats < s['end'] + 25)]
    k_ = np.arange(len(inb)); fit = np.polyfit(k_, inb, 1)
    ok = np.abs(inb - np.polyval(fit, k_)) < 0.06          # descarta pulsos sueltos mal detectados
    bpm = 60 / np.polyfit(k_[ok], inb[ok], 1)[0]
    songs[n] = dict(s, beats=beats, bpm=bpm)

# ---------- intro ----------
intro = plan['intro']
x = load(intro['file'])[:int(intro['cut'] * SR)]
nf_ = int(intro.get('fade_s', 0.05) * SR); x[-nf_:] *= fade(nf_, 'out')
put(mix, 0, x * db(intro.get('gain_db', -3.0)))
for v in intro.get('voices', []):
    VOX.append(vox_entry(v, v['t']))
for e in intro.get('fx', []):
    put(fx, e['t'], sfx(e['name']), db(e['gain_db']))
t_next = intro['drop_at']           # aquí entra el golpe de la primera canción


def oenv(z):
    m_ = np.abs(z).mean(1); e_ = m_[:len(m_) // 256 * 256].reshape(-1, 256).mean(1)
    return np.maximum(0, np.diff(np.log(e_ + 1e-6)))


def lag_s(A, Bx):
    """Retraso (s) que necesita Bx para que sus golpes graves coincidan con los de A."""
    ea, eb = oenv(static(A, 'lp', 200)), oenv(static(Bx, 'lp', 200))
    n_ = min(len(ea), len(eb)); ea, eb = ea[:n_], eb[:n_]
    lags = list(range(-16, 17))
    cc = [np.dot(ea[max(0, l):n_ + min(0, l)], eb[max(0, -l):n_ - max(0, l)]) for l in lags]
    return lags[int(np.argmax(cc))] * 256 / SR


prev = None
t_out = t_next
for k, s in enumerate(plan['songs']):
    n = s['id']; S_ = songs[n]
    raw = load(f'{S}/wav/{n}.wav')
    for a_, b_, g_ in s.get('sec_gain', []):     # ganancia solo en un tramo del tema (rampas de 0,3 s)
        env_ = np.ones(len(raw), np.float32); i0_, i1_ = int(a_ * SR), int(b_ * SR); r_ = int(0.3 * SR)
        env_[i0_:i1_] = db(g_); env_[i0_ - r_:i0_] = np.linspace(1, db(g_), r_); env_[i1_:i1_ + r_] = np.linspace(db(g_), 1, r_)
        raw = raw * env_[:, None]
    ratio = 1.0
    if s.get('in') == 'blend' and prev is not None:
        ratio = prev['bpm_eff'] / S_['bpm']
        if abs(ratio - 1) > 0.026:
            print(f'AVISO {n}: mezcla con {abs(ratio-1)*100:.1f}% de diferencia -> corte'); s['in'] = 'cut'; ratio = 1.0
    beat = 60 / S_['bpm']; bar = 4 * beat
    pre = 8 * bar if s.get('in') == 'blend' else (s.get('rise_bars', 8) * bar if s.get('in') == 'rise' else 0.0)
    tail = 8 * bar
    a0 = max(0, int((s['start'] - pre) * SR)); a1 = min(len(raw), int((s['end'] + tail) * SR))
    g = db(TARGET - lufs(raw[int(s['start'] * SR):int(s['end'] * SR)])) * db(s.get('gain_db', 0))
    seg = stretch(raw[a0:a1] * g, ratio)
    off = (s['start'] - a0 / SR) / ratio
    body_len = (s['end'] - s['start']) / ratio
    beat_e = beat / ratio; bar_e = 4 * beat_e
    S_['bpm_eff'] = S_['bpm'] * ratio; s['bpm_eff'] = S_['bpm_eff']
    t_in = t_next
    i_in = int(off * SR)
    kind = s.get('in', 'cut')
    head = seg[:i_in]; body = seg[i_in:i_in + int(body_len * SR)]; after = seg[i_in + int(body_len * SR):]

    if kind == 'rise' and len(head) > 0:
        # entrada gradual bajo la intro: se abre el filtro y sube el volumen
        h = sweep(head, 'lp', 220, 16000)
        nh = len(h); tt = np.linspace(0, 1, nh, dtype=np.float32)
        put(mix, t_in - nh / SR, h * db(-28 + 26 * tt ** 0.6)[:, None])
    if kind == 'blend' and len(head) > 0:
        nh = len(head); i1 = int(t_in * SR)
        sh = lag_s(mix[i1 - nh:i1], head); t_in += sh
        h = sweep(head, 'hp', 1800, 300)                        # entra por arriba, sin bajo ni cuerpo de voz
        ramp = (db(-24 + 15 * np.linspace(0, 1, nh, dtype=np.float32) ** 1.5))[:, None]
        i1 = int(t_in * SR)
        S_['qc_corr_ms'] = round(sh * 1000, 1)
        S_['qc_lag_ms'] = round(lag_s(mix[i1 - nh:i1], head) * 1000, 1)   # tras corregir
        put(mix, t_in - nh / SR, h * ramp)
    body = body.copy(); body[:64] *= fade(64, 'in', 'lin')
    put(mix, t_in, body)
    if s.get('impact'):
        put(fx, t_in, sfx(s['impact']), db(s.get('impact_db', -9)))
    t_out = t_in + len(body) / SR

    # ---- salida hacia la siguiente ----
    nxt = plan['songs'][k + 1] if k + 1 < len(plan['songs']) else None
    out_kind = nxt.get('in', 'cut') if nxt else plan.get('ending', 'echo')
    if out_kind == 'blend':
        tl = after[:int(1 * bar_e * SR)]
        if len(tl):
            put(mix, t_out, sweep(tl, 'hp', 150, 1500) * fade(len(tl), 'out'))
        t_next = t_out
    elif out_kind == 'echo':
        last = body[-int(beat_e * SR):] * fade(int(beat_e * SR), 'out', 'lin') ** 0.3
        put(mix, t_out - len(last) / SR,
            echo_tail(last, 0.75 * beat_e, fb=0.68, n_rep=10, hp=150) * 1.25 * db(s.get('echo_db', 0)))
        t_next = t_out + (2 * beat_e if nxt else 0)
    elif out_kind == 'riser':
        # 4 compases con filtro que sube + riser que culmina en el golpe; silencio corto real antes del golpe
        L = 4 * bar_e; i0 = len(body) - int(L * SR); sil = min(0.5 * bar_e, 0.45)
        a = body[i0:].copy(); cut = int((L - sil) * SR)
        a[:cut] = sweep(a[:cut], 'hp', 30, 900)
        a[cut:] = 0; a[cut - 256:cut] *= fade(256, 'out', 'lin')
        mix[int(t_out * SR) - len(a):int(t_out * SR)] -= body[i0:]
        put(mix, t_out - len(a) / SR, a)
        y, pk = fit_riser(s.get('riser', '02_056'), L, L)
        y = y[:int((pk - sil + 0.05) * SR)].copy(); y[-int(0.05 * SR):] *= fade(int(0.05 * SR), 'out', 'lin')
        put(fx, t_out - pk, y, db(s.get('riser_db', -12)))
        j0, j1 = int((t_out - sil) * SR), int(t_out * SR); f_ = 256
        mix[j0 - f_:j0] *= fade(f_, 'out', 'lin'); mix[j0:j1] = 0
        t_next = t_out
    elif out_kind == 'spin':
        d = 1.3
        put(mix, t_out, backspin(seg, i_in + len(body), dur=d) * 0.9)
        t_next = t_out + d - 0.15
    elif out_kind == 'filter':
        L = 2 * bar_e; i0 = len(body) - int(L * SR)
        a = sweep(body[i0:], 'lp', 16000, 250)
        mix[int(t_out * SR) - len(a):int(t_out * SR)] -= body[i0:]
        put(mix, t_out - len(a) / SR, a)
        w = sfx(s.get('whoosh', '01_003')); m = np.abs(w).max(1); pk = int(np.convolve(m, np.ones(1000), 'same').argmax())
        put(fx, t_out - pk / SR, w, db(s.get('whoosh_db', -12)))
        t_next = t_out
    else:   # cut
        t_next = t_out
    log.append(dict(id=n, t_in=round(t_in, 2), t_out=round(t_out, 2), bpm=round(float(S_['bpm_eff']), 1),
                    ratio=round(float(ratio), 4), entra=kind, sale=out_kind,
                    corregido_ms=S_.get('qc_corr_ms'), desfase_ms=S_.get('qc_lag_ms')))
    for v in s.get('voices', []):
        vx = load(v['file'])
        if 'end_before_out' in v:            # la voz seca termina X s antes de la salida
            sil_ = min(0.5 * bar_e, 0.45); ebo = v['end_before_out']
            eb = {'riser': sil_ + 0.2, 'riser_bar': sil_ + 0.2 + bar_e, 'beat': beat_e + 0.1}.get(ebo, ebo)
            tv = t_out - eb - v['dur']
            if ebo in ('riser', 'riser_bar'):        # la reverb se corta donde empieza el silencio antes del golpe
                k_ = int((t_out - sil_ - tv) * SR)
                if 0 < k_ < len(vx):
                    vx = vx[:k_].copy(); f2 = int(0.03 * SR); vx[-f2:] *= fade(f2, 'out', 'lin')
        else:
            tv = t_out - v['before_out'] if 'before_out' in v else t_in + v['after_in']
        VOX.append(vox_entry(v, tv, vx))
    prev = s

if plan.get('end_impact'):
    put(fx, t_out, sfx(plan['end_impact']), db(plan.get('end_impact_db', -8)))
for v in plan.get('end_voices', []):
    VOX.append(vox_entry(v, t_out + v['after_out']))
end = t_out + plan.get('end_tail', 4.5)
ne = int(end * SR); nf = int(1.0 * SR)
mix[ne - nf:ne] *= fade(nf, 'out', 'eq')
N = int(end * SR)


# ---- hueco de frecuencias para la voz (EQ de pico a 2,3 kHz, Q 0,7) ----
def peq(x, f0, gdb, q):
    import math
    A = 10 ** (gdb / 40); w = 2 * math.pi * f0 / SR; al = math.sin(w) / (2 * q)
    b = [1 + al * A, -2 * math.cos(w), 1 - al * A]; a = [1 + al / A, -2 * math.cos(w), 1 - al / A]
    return lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=0).astype(np.float32)


for tv, vx, g, dd, vd, cv in VOX:
    if not cv: continue
    r_ = int(0.06 * SR); i0 = int(tv * SR) - r_; i1 = int((tv + (vd or len(vx) / SR)) * SR) + r_
    seg = mix[i0 - 2048:i1].copy(); y = peq(seg, 2300, -cv, 0.7)[2048:]; seg = seg[2048:]
    w_ = np.ones(len(seg), np.float32); w_[:r_] = np.linspace(0, 1, r_); w_[-r_:] = np.linspace(1, 0, r_)
    mix[i0:i1] = seg * (1 - w_[:, None]) + y * w_[:, None]

# ---- ducking: la música baja solo mientras suena la voz seca (entra ~20 ms, vuelve ~40 ms) ----
D = 100
act = np.zeros(N // D + 1, np.float32)
for tv, vx, g, dd, vd, cv in VOX:
    e = np.abs(vx).max(1) * g; i0 = int(tv * SR) // D
    if vd: e = e[:int((vd + 0.05) * SR)]
    ee = (e[:len(e) // D * D].reshape(-1, D).max(1) > 0.02) * float(-dd)
    act[i0:i0 + len(ee)] = np.maximum(act[i0:i0 + len(ee)], ee[:len(act) - i0])
from scipy.ndimage import maximum_filter1d
hold = maximum_filter1d(act, 30, origin=-14)
cur = 0.0; duck = np.zeros_like(act)
for i, a_ in enumerate(hold):
    cur += (a_ - cur) * (0.12 if a_ > cur else 0.06); duck[i] = cur
gfull = np.interp(np.arange(N) / D, np.arange(len(duck)), 10 ** (-duck / 20)).astype(np.float32)
final = mix[:N] * gfull[:, None]
for tv, vx, g, dd, vd, cv in VOX:
    i = int(tv * SR); final[i:i + len(vx)] += vx[:N - i] * g
save(OUT, final)
json.dump(dict(log=log, end=end), open(OUT + '.log.json', 'w'), indent=1)
for l in log: print(l['id'], f"{int(l['t_in']//60)}:{l['t_in']%60:04.1f}", l['entra'], l.get('desfase_ms'))
print('duración', round(end / 60, 2), 'min')
