"""Recorta las tomas de ElevenLabs por silencios (sin las etiquetas habladas) y las procesa con la voz grave
«tipo narrador»: -4 semitonos, capa de pecho una octava abajo, graves, compresión, reverb grande, delay en nombres."""
import json, re, os, sys, subprocess, numpy as np
sys.path.insert(0, os.path.dirname(__file__)); from dsp import *
from scipy.signal import fftconvolve
S = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
names = ['V01', 'V02', 'V03', 'V04', 'V05', 'V06', 'V07', 'V08', 'V09', 'V10', 'V11', 'V12', 'M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07']
lab = re.compile(r'^[VBM]-?\d+[.,]?$')
PICK = {'V01': 'B', 'V02': 'A', 'V03': 'A', 'V04': 'A', 'V05': 'B', 'V06': 'A', 'V07': 'A', 'V08': 'B', 'V09': 'B', 'V10': 'B',
        'V11': 'A', 'V12': 'A', 'M01': 'A', 'M02': 'B', 'M03': 'A', 'M04': 'B', 'M05': 'A', 'M06': 'A', 'M07': 'B'}


def cortar():
    for x in 'AB':
        ws = json.load(open(os.path.expanduser(f'~/Videos-Remotion/voz/salida-whisperx/{x}.palabras.json')))
        ws = ws['palabras'] if isinstance(ws, dict) else ws
        a = load(f'{S}/vox/{x}.wav')[:, 0]; w = int(0.01 * SR)
        e = 20 * np.log10(np.convolve(np.abs(a), np.ones(w) / w, 'same')[::w] + 1e-9)
        segs = []; st = None; gap = 0
        for i, v in enumerate(e > -42):
            if v:
                if st is None: st = i
                gap = 0; en = i
            elif st is not None:
                gap += 1
                if gap >= 15: segs.append([st / 100, (en + 1) / 100]); st = None
        if st is not None: segs.append([st / 100, (en + 1) / 100])
        segs = [s for s in segs if s[0] > 26.3]
        labt = [w_['inicio'] for w_ in ws if w_['inicio'] > 29 and (lab.match(w_['texto']) or w_['texto'] in ('Tres.', '3.', 'Menciones', 'Archivo.', 'Pegar.'))]
        islab = [False] * len(segs)
        for t in labt:
            j = [k for k, s in enumerate(segs) if s[0] >= t - 0.3][0]; islab[j] = True
        takes = []; cur = []
        for s, l in zip(segs, islab):
            if l:
                if cur: takes.append(cur); cur = []
            else: cur.append(s)
        if cur: takes.append(cur)
        assert len(takes) == 19, (x, len(takes))
        for nm, tk in zip(names, takes):
            s0 = int((tk[0][0] - 0.03) * SR); s1 = int((tk[-1][1] + 0.12) * SR)
            seg = a[s0:s1].copy(); f = int(0.03 * SR); seg[-f:] *= np.linspace(1, 0, f); seg[:64] *= np.linspace(0, 1, 64)
            save(f'{S}/vox/{nm}_{x}.wav', np.stack([seg, seg], 1))


def run(src, af, out):
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', src, '-af', af, '-ac', '2', '-c:a', 'pcm_f32le', out], check=True)


def shift(st):
    r = 2 ** (st / 12); tempo = 1 / r; chain = []
    while tempo > 2.0: chain.append('atempo=2.0'); tempo /= 2.0
    chain.append(f'atempo={tempo:.5f}')
    return f'asetrate={int(44100*r)},aresample=44100,' + ','.join(chain)


EQ = ("highpass=f=55:poles=2,equalizer=f=110:t=q:w=0.9:g=4,equalizer=f=220:t=q:w=1.0:g=2,equalizer=f=450:t=q:w=1.2:g=-3,"
      "equalizer=f=3000:t=q:w=1.0:g=4.5,highshelf=f=8000:g=1,deesser=i=0.4,"
      "acompressor=threshold=-26dB:ratio=5:attack=3:release=120:knee=4:makeup=4,asoftclip=type=tanh:threshold=0.97,alimiter=limit=0.89:level=disabled")
rng = np.random.default_rng(11)


def ir(dec=2.6, pre=0.04):
    n = int(dec * 1.5 * SR); t = np.arange(n) / SR
    y = rng.standard_normal((n, 2)).astype(np.float32) * np.exp(-6.9 * t / dec)[:, None]
    y = static(static(y, 'lp', 5000, 2), 'hp', 200, 2)
    y = np.concatenate([np.zeros((int(pre * SR), 2), np.float32), y]); return y / np.sqrt((y ** 2).sum(0))


IR = ir()


def proceso(src, name, rv=-11, delay_tail=0.0, st=-4):
    a = f'{S}/vox/proc/{name}_a.wav'; b = f'{S}/vox/proc/{name}_b.wav'; tmp = f'{S}/vox/proc/{name}_m.wav'
    run(src, 'highpass=f=80,' + shift(st), a)
    run(src, 'highpass=f=80,' + shift(st - 8) + ',lowpass=f=320', b)
    x = load(a); y = load(b); n = min(len(x), len(y))
    save(tmp, x[:n] + y[:n] * db(-13)); run(tmp, EQ, a)
    d = load(a); d = d / (np.abs(d).max() + 1e-9) * db(-3)
    dry = np.concatenate([d, np.zeros((int(3.0 * SR), 2), np.float32)])
    wet = np.stack([fftconvolve(dry[:, c], IR[:, c])[:len(dry)] for c in range(2)], 1).astype(np.float32)
    out = dry + wet * db(rv) * 3
    if delay_tail:
        last = d[-int(delay_tail * SR):]; e = echo_tail(last, 0.42, fb=0.5, n_rep=5, hp=300, lp=4500, width=0.7)
        i0 = len(d) - len(last); out[i0:i0 + len(e)] += e[:len(out) - i0] * db(-7)
    out = out / (np.abs(out).max() + 1e-9) * db(-1.5)
    save(f'{S}/vox/proc/{name}.wav', out)
    for f_ in (a, b, tmp): os.remove(f_)
    return round(len(d) / SR, 3)


if __name__ == '__main__':
    cortar()
    dur = {}
    C = load(f'{S}/vox/C.wav'); x = C[int(0.06 * SR):int(5.45 * SR)].copy()
    x[-int(0.03 * SR):] *= fade(int(0.03 * SR), 'out'); x[:64] *= fade(64, 'in', 'lin')
    save(f'{S}/vox/FRASE2_raw.wav', x)
    dur['FRASE2'] = proceso(f'{S}/vox/FRASE2_raw.wav', 'FRASE2', rv=-14, delay_tail=0.7)
    cfg = {'M01': (-13, 0.35), 'M02': (-13, 0.45), 'M03': (-13, 0), 'M04': (-13, 0.45), 'M05': (-13, 0),
           'V07': (-13, 0.7), 'V06': (-13, 0.5), 'V08': (-12, 0.45)}
    for n, (rv, dl) in cfg.items():
        dur[n + 'g'] = proceso(f'{S}/vox/{n}_{PICK[n]}.wav', n + 'g', rv=rv, delay_tail=dl)
    json.dump(dur, open(f'{S}/vox/proc/dur_grave.json', 'w')); print(dur)
