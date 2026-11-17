"""sfx_lib.py — síntesis de efectos de sonido con numpy (sin librerías de audio), para sincronizar con AE.

Probado en el motion graphic "La IA dominará el mundo" (Tanda 03 · 01): ver su `_material/scripts/sonido.py`
como ejemplo completo (cama que sube con un deslizador de AE, latidos, tecleo, whoosh, boom, riser, pulso que
acelera, pings, alertas, glitch, golpes, reverb, nivelador).

Uso típico:
    from sfx_lib import *
    M = Mezcla(10.0)                                  # duración en s
    M.poner(boom(), 1.8, db(-4), rev=0.25)            # señal, segundo, ganancia, paneo (−1..1), envío a reverb
    M.poner(whoosh(1.3), 1.6, db(-11), rev=0.2)
    M.guardar("salida.wav")                           # reverb + nivelador + limitador, pico −1 dBFS

Curvas de AE: exportar el valor de un deslizador cada 0,01 s a JSON (script en el APRENDIZAJE de la clase) y
usar `curva(lista, 0.01, M.t)` para que la síntesis siga la animación (volumen, tono, brillo…).
"""
import math
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def db(x):
    return 10 ** (np.asarray(x, dtype=float) / 20.0)


def suave(a, b, x):
    """smoothstep de a a b"""
    u = np.clip((np.asarray(x, dtype=float) - a) / (b - a), 0, 1)
    return u * u * (3 - 2 * u)


def curva(valores, paso, t):
    """interpola una curva exportada de AE (un valor cada `paso` s) a los tiempos t"""
    v = np.asarray(valores, dtype=float)
    return np.interp(t, np.arange(len(v)) * paso, v)


def svf(x, fc, q=0.707, modo="lp"):
    """filtro de estado variable (TPT); fc puede cambiar en cada muestra. modo: lp, bp (ganancia 1), hp"""
    x = np.asarray(x, dtype=float)
    fc = np.broadcast_to(np.asarray(fc, dtype=float), x.shape)
    g = np.tan(np.pi * np.clip(fc, 20, SR * 0.45) / SR)
    k = 1.0 / q
    a1 = 1.0 / (1.0 + g * (g + k)); a2 = g * a1; a3 = g * a2
    xs, A1, A2, A3 = x.tolist(), a1.tolist(), a2.tolist(), a3.tolist()
    ic1 = ic2 = 0.0
    lp = [0.0] * len(xs); bp = [0.0] * len(xs)
    for n in range(len(xs)):
        v3 = xs[n] - ic2
        v1 = A1[n] * ic1 + A2[n] * v3
        v2 = ic2 + A2[n] * ic1 + A3[n] * v3
        ic1 = 2 * v1 - ic1
        ic2 = 2 * v2 - ic2
        lp[n] = v2; bp[n] = v1
    lp = np.array(lp); bp = np.array(bp)
    if modo == "lp":
        return lp
    if modo == "bp":
        return bp * k
    return x - k * bp - lp


def filtro_fft(x, lo=None, hi=None, orden=2):
    """paso-alto (lo) / paso-bajo (hi) de fase cero para señales largas"""
    n = len(x); m = 1 << (n - 1).bit_length()
    X = np.fft.rfft(x, m); f = np.fft.rfftfreq(m, 1 / SR)
    H = np.ones_like(f)
    if hi:
        H *= 1 / np.sqrt(1 + (f / hi) ** (2 * orden))
    if lo:
        H *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-6)) ** (2 * orden))
    return np.fft.irfft(X * H, m)[:n]


def fase(freq):
    """frecuencia (Hz, array) → fase acumulada (para barridos de tono sin clics)"""
    return 2 * np.pi * np.cumsum(freq) / SR


def sierra(ph, brillo=0.5, nh=10):
    """diente de sierra suave por aditiva (sin aliasing); brillo 0..1 abre los armónicos (puede ser array)"""
    s = np.zeros_like(ph)
    for k in range(1, nh + 1):
        s += np.sin(k * ph) / k * (brillo ** (k - 1))
    return s


def cuadrada(ph, nh=9):
    s = np.zeros_like(ph)
    for k in range(1, nh + 1, 2):
        s += np.sin(k * ph) / k
    return s


def env(n, ataque, caida):
    """ataque lineal (s) + caída exponencial (tau en s)"""
    tt = np.arange(n) / SR
    return np.clip(tt / max(ataque, 1e-4), 0, 1) * np.exp(-np.maximum(tt - ataque, 0) / caida)


def ruido(n):
    return rng.standard_normal(n)


def muestras(seg):
    return int(round(seg * SR))


# ------------------------------------------------------------------ sonidos listos (mono salvo que se diga)
def latido():
    n = muestras(0.5); tt = np.arange(n) / SR
    cuerpo = np.sin(fase(42 + 38 * np.exp(-tt / 0.03))) * env(n, 0.004, 0.09)
    return cuerpo + 0.4 * svf(ruido(n) * env(n, 0.0005, 0.006), 900, 0.8, "lp")


def tecla():
    n = muestras(0.02)
    return svf(ruido(n) * env(n, 0.0002, 0.004), rng.uniform(2500, 5000), 1.2, "bp")


def whoosh(dur=1.3, f0=2600, f1=300, pico=0.3):
    """estéreo: ruido con banda que baja (algo que se aleja); pico = segundos hasta el máximo"""
    n = muestras(dur); tt = np.arange(n) / SR
    fc = f0 * (f1 / f0) ** np.clip(tt / (dur * 0.85), 0, 1)
    e = suave(0, pico, tt) * (1 - suave(pico, dur * 0.92, tt))
    return np.vstack([svf(ruido(n), fc, 1.4, "bp") * e, svf(ruido(n), fc * 1.08, 1.4, "bp") * e])


def carga(dur=0.58, f0=200, f1=1200):
    """sube exponencial y se corta en seco (para ponerla justo antes de un golpe)"""
    n = muestras(dur); tt = np.arange(n) / SR
    sube = np.exp((tt - tt[-1]) / 0.18)
    x = np.sin(fase(f0 * (f1 / f0) ** (tt / tt[-1]))) * sube
    return x + 0.5 * svf(ruido(n), 800 + 5000 * tt / tt[-1], 1.0, "bp") * sube


def boom(dur=2.5):
    n = muestras(dur); tt = np.arange(n) / SR
    sub = np.sin(fase(32 + 45 * np.exp(-tt / 0.12))) * env(n, 0.005, 0.55)
    return sub + 0.5 * svf(ruido(n) * env(n, 0.001, 0.12), 500, 0.7, "lp")


def golpe(f_ini=140, f_fin=80, tau=0.3, grande=False):
    """golpe de título; grande=True añade sub y un medio saturado (para la palabra clave)"""
    n = muestras(3); tt = np.arange(n) / SR
    x = np.sin(fase(f_fin + (f_ini - f_fin) * np.exp(-tt / 0.07))) * env(n, 0.002, tau)
    x = x + 0.35 * svf(ruido(n) * env(n, 0.0003, 0.015), 3000, 0.7, "hp")
    if grande:
        x = x + np.sin(fase(26 + 40 * np.exp(-tt / 0.1))) * env(n, 0.003, 1.4)
        x = x + 0.5 * np.tanh(4 * np.sin(fase(70 + 50 * np.exp(-tt / 0.04)))) * env(n, 0.002, 0.25)
    return x


def impacto():
    """golpe enorme (sub + medio saturado + chasquido estéreo); devuelve (sub, medio, crack_estereo)"""
    n = muestras(4); tt = np.arange(n) / SR
    sub = np.sin(fase(27 + 60 * np.exp(-tt / 0.09))) * env(n, 0.003, 1.1)
    medio = np.tanh(3 * np.sin(fase(95 + 60 * np.exp(-tt / 0.05)))) * env(n, 0.002, 0.18)
    crack = svf(ruido(n) * env(n, 0.0005, 0.05), 2500, 0.7, "hp")
    return sub, medio, np.vstack([crack, np.roll(crack, 211)])


def ping(f=1046.5):
    n = muestras(0.25); tt = np.arange(n) / SR
    return np.sin(fase(f * (1 + 0.25 * np.exp(-tt / 0.012)))) * env(n, 0.001, 0.06)


def alerta(f1=988, f2=740):
    n1, n2 = muestras(0.06), muestras(0.09)
    a = cuadrada(2 * np.pi * f1 * np.arange(n1) / SR) * env(n1, 0.002, 0.05)
    b = cuadrada(2 * np.pi * f2 * np.arange(n2) / SR) * env(n2, 0.002, 0.07)
    return svf(np.concatenate([a, np.zeros(muestras(0.015)), b]), 5000, 0.7, "lp")


def chirp_ui(f0=600, f1=2400):
    n = muestras(0.12); tt = np.arange(n) / SR
    return np.sin(fase(f0 * (f1 / f0) ** np.clip(tt / 0.08, 0, 1))) * env(n, 0.002, 0.03)


def pulso(frec=110.0):
    n = muestras(0.14); tt = np.arange(n) / SR
    return svf(sierra(2 * np.pi * frec * tt, 0.55, 8) * env(n, 0.002, 0.045), 1800, 0.7, "lp")


def brillo_letras(dur=1.0):
    """estéreo: siseo agudo corto (letras que se juntan, destellos)"""
    n = muestras(dur); e = env(n, 0.02, 0.3)
    return np.vstack([svf(ruido(n), 6000, 0.7, "hp") * e, svf(ruido(n), 6000, 0.7, "hp") * e])


def glitch_digital(n_total, bloques_hz=15, prob=0.55):
    """ruido digital (tonos aleatorios cada 12-40 ms, bitcrush) + máscara en bloques como posterizeTime.
    Multiplicarlo por la curva GLITCH de AE."""
    gl = np.zeros(n_total)
    pos = 0
    for _ in range(20000):                                     # tope del bucle
        if pos >= n_total:
            break
        largo = muestras(rng.uniform(0.012, 0.04))
        tt = np.arange(largo) / SR
        f = float(rng.choice([180, 360, 720, 1440, 2880, 5000])) * rng.uniform(0.9, 1.1)
        tipo = rng.integers(0, 3)
        if tipo == 0:
            s = np.sign(np.sin(2 * np.pi * f * tt))
        elif tipo == 1:
            s = ruido(largo)
        else:
            s = np.sin(2 * np.pi * f * tt) * np.sign(np.sin(2 * np.pi * 37 * tt))
        s = np.round(s * 4) / 4
        s = np.repeat(s[::6], 6)[:largo]
        k = max(0, min(largo, n_total - pos))
        gl[pos:pos + k] = s[:k]
        pos += largo
    bloque = int(SR / bloques_hz)
    mascara = np.repeat((rng.random(n_total // bloque + 1) < prob).astype(float), bloque)[:n_total]
    return gl * (0.35 + 0.65 * mascara)


def instantes_acelerando(tasa, t0, t1):
    """instantes (s) de pulsos cuya frecuencia (pulsos/s, array a SR) cambia con el tiempo"""
    acum = np.cumsum(tasa) / SR
    a0, a1 = muestras(t0), muestras(t1)
    idx = np.nonzero(np.diff(np.floor(acum[a0:a1])) > 0)[0] + a0 + 1
    return idx / SR


# ------------------------------------------------------------------ mezcla
class Mezcla:
    def __init__(self, dur):
        self.dur = float(dur)
        self.N = muestras(dur)
        self.t = np.arange(self.N) / SR
        self.L = np.zeros(self.N); self.R = np.zeros(self.N)
        self.rL = np.zeros(self.N); self.rR = np.zeros(self.N)
        self.eventos = []

    def poner(self, sig, t0, gan=1.0, pan=0.0, rev=0.0, nombre=None):
        """suma una señal mono (n) o estéreo (2, n) desde t0 (paneo de potencia constante)"""
        if nombre:
            self.eventos.append((round(t0, 3), nombre))
        sig = np.asarray(sig, dtype=float)
        if sig.ndim == 1:
            a = (pan + 1) * math.pi / 4
            sig = np.vstack([sig * math.cos(a), sig * math.sin(a)]) * math.sqrt(2)
        i0 = muestras(t0)
        if i0 < 0:
            sig = sig[:, -i0:]; i0 = 0
        n = min(sig.shape[1], self.N - i0)
        if n <= 0:
            return
        g = np.asarray(gan, dtype=float)
        self.L[i0:i0 + n] += sig[0, :n] * g; self.R[i0:i0 + n] += sig[1, :n] * g
        if rev:
            self.rL[i0:i0 + n] += sig[0, :n] * g * rev; self.rR[i0:i0 + n] += sig[1, :n] * g * rev

    def _reverb(self, rt60=2.4, largo=2.8, pre=0.02):
        n = muestras(largo); tt = np.arange(n) / SR
        dec = np.exp(-6.91 * tt / rt60)
        ir = []
        for _ in range(2):
            h = filtro_fft(ruido(n) * dec, hi=5000, orden=1)
            h = np.concatenate([np.zeros(muestras(pre)), h])
            ir.append(h / np.sqrt(np.sum(h ** 2)))
        m = 1 << (self.N + len(ir[0])).bit_length()
        yL = np.fft.irfft(np.fft.rfft(self.rL, m) * np.fft.rfft(ir[0], m), m)[:self.N]
        yR = np.fft.irfft(np.fft.rfft(self.rR, m) * np.fft.rfft(ir[1], m), m)[:self.N]
        return yL, yR

    @staticmethod
    def _media_movil(x, seg):
        k = max(1, muestras(seg))
        c = np.concatenate([[0.0], np.cumsum(x)])
        i = np.arange(len(x))
        a = np.clip(i - k // 2, 0, len(x)); b = np.clip(i + k // 2 + 1, 0, len(x))
        return (c[b] - c[a]) / (b - a)

    def guardar(self, ruta, humedo=0.55, nivelar=(-3, 6, 0.35), fundido=0.25, drive=1.6, pico_db=-1.0):
        """reverb + nivelador lento (baja hasta −3 dB, sube hasta +6 dB) + fundido final + limitador suave"""
        wL, wR = self._reverb()
        mL = self.L + humedo * wL; mR = self.R + humedo * wR
        if nivelar:
            e = np.sqrt(self._media_movil(((mL + mR) / 2) ** 2, 0.3) + 1e-12)
            nivel = 20 * np.log10(e)
            obj = 20 * np.log10(np.percentile(e, 90))
            g = self._media_movil(np.clip(-nivelar[2] * (nivel - obj), nivelar[0], nivelar[1]), 0.2)
            mL = mL * db(g); mR = mR * db(g)
        if fundido:
            fin = 1 - suave(self.dur - fundido, self.dur, self.t)
            mL = mL * fin; mR = mR * fin
        mL = filtro_fft(mL, lo=25); mR = filtro_fft(mR, lo=25)
        p = max(np.abs(mL).max(), np.abs(mR).max(), 1e-9)
        mL = np.tanh(drive * mL / p) / np.tanh(drive) * db(pico_db)
        mR = np.tanh(drive * mR / p) / np.tanh(drive) * db(pico_db)
        pcm = (np.clip(np.vstack([mL, mR]).T, -1, 1) * 32767).astype("<i2")
        with wave.open(str(ruta), "wb") as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes(pcm.tobytes())
        rms = lambda x: 20 * math.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
        por_seg = [rms((mL[s * SR:(s + 1) * SR] + mR[s * SR:(s + 1) * SR]) / 2) for s in range(int(self.dur))]
        return {"pico_db": pico_db, "rms_db": round(rms((mL + mR) / 2), 1), "rms_por_segundo": [round(v) for v in por_seg]}


if __name__ == "__main__":
    import sys
    salida = sys.argv[1] if len(sys.argv) > 1 else "prueba_sfx.wav"
    M = Mezcla(4.0)
    M.poner(latido(), 0.2, db(-5), nombre="latido")
    M.poner(carga(), 0.6, db(-13), rev=0.2, nombre="carga")
    M.poner(whoosh(), 1.0, db(-11), rev=0.2, nombre="whoosh")
    M.poner(boom(), 1.2, db(-4), rev=0.25, nombre="boom")
    for k, x in enumerate(instantes_acelerando(np.linspace(3, 14, M.N), 1.8, 2.9)):
        M.poner(pulso(110 if k % 4 else 82.41), x, db(-14))
    sub, medio, crack = impacto()
    M.poner(sub, 3.0, db(-2), nombre="impacto"); M.poner(medio, 3.0, db(-9), rev=0.5); M.poner(crack, 3.0, db(-10), rev=0.6)
    print(M.guardar(salida))
    print(M.eventos)
