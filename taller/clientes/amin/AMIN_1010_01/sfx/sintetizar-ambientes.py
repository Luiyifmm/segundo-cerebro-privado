# Camas de ambiente para los dos motion graphics de AMIN_1010_01 (síntesis propia, sin muestras). Uso: python3 sintetizar-ambientes.py <carpeta de salida>
import math, random, struct, sys, wave
SR = 48000; random.seed(7)
def pista(seg): return [[0.0, 0.0] for _ in range(int(seg * SR))]
def env(t, a, d, dur):  # ataque lineal, caída exponencial
    if t < 0 or t > dur: return 0.0
    return min(1.0, t / a) * math.exp(-max(0.0, t - a) / d) if a > 0 else math.exp(-t / d)
def suma(buf, ini, dur, f, pan=0.0):  # f(t) -> muestra; pan -1 izquierda … 1 derecha
    gl, gr = math.cos((pan + 1) * math.pi / 4), math.sin((pan + 1) * math.pi / 4); n0 = int(ini * SR)
    for i in range(int(dur * SR)):
        j = n0 + i
        if 0 <= j < len(buf): v = f(i / SR); buf[j][0] += v * gl; buf[j][1] += v * gr
def ruido_filtrado(dur, bajo, alto):  # ruido con paso banda simple (dos filtros de un polo)
    a1 = math.exp(-2 * math.pi * alto / SR); a2 = math.exp(-2 * math.pi * bajo / SR); lp = hp = 0.0; out = []
    for _ in range(int(dur * SR)):
        x = random.uniform(-1, 1); lp = (1 - a1) * x + a1 * lp; hp = (1 - a2) * lp + a2 * hp; out.append(lp - hp)
    return out
def fundidos(buf, entra, sale):
    n = len(buf)
    for i in range(n):
        g = min(1.0, i / (entra * SR)) * min(1.0, (n - i) / (sale * SR)); buf[i][0] *= g; buf[i][1] *= g
def guardar(buf, ruta, pico=0.5):
    m = max(max(abs(a), abs(b)) for a, b in buf) or 1.0; k = pico / m
    w = wave.open(ruta, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(b"".join(struct.pack("<hh", int(a * k * 32767), int(b * k * 32767)) for a, b in buf)); w.close()
seno = lambda f, t: math.sin(2 * math.pi * f * t)

def escuela():
    b = pista(3.9)
    suma(b, 0, 3.9, lambda t: 0.16 * (seno(55, t) + 0.6 * seno(82.4, t) + 0.3 * seno(110.3, t)) * (0.8 + 0.2 * seno(0.7, t)))  # zumbido grave
    aire = ruido_filtrado(3.9, 300, 1800); suma(b, 0, 3.9, lambda t: 0.05 * aire[int(t * SR)])
    for f, g in ((1318.5, 0.10), (1975.5, 0.07), (2637, 0.05), (3951, 0.02)): suma(b, 0.04, 1.3, lambda t, f=f, g=g: g * seno(f, t) * env(t, 0.003, 0.33, 1.3) * (1 + 0.3 * seno(11, t)), -0.2)  # campana de escuela
    for k in range(5): suma(b, 0.14 + k * 0.17, 0.12, lambda t: 0.16 * seno(150 - 400 * t, t) * env(t, 0.002, 0.03, 0.12), -0.7 + k * 0.2)  # pasos
    suma(b, 0.93, 0.25, lambda t: 0.2 * seno(95 - 150 * t, t) * env(t, 0.004, 0.07, 0.25), 0.3)  # la puerta se la traga
    suma(b, 1.12, 0.95, lambda t: 0.06 * (seno(330 - 115 * t + 4 * seno(5.5, t), t) + 0.4 * seno(2 * (330 - 115 * t), t)) * env(t, 0.12, 0.6, 0.95), 0.5)  # nota que cae: el empleado
    suma(b, 2.12, 1.5, lambda t: 0.5 * seno(74 - 30 * min(t, 1.0) , t) * env(t, 0.01, 0.55, 1.5))  # caída grave del jefe
    golpe = ruido_filtrado(0.5, 30, 400); suma(b, 2.12, 0.5, lambda t: 0.5 * golpe[int(t * SR)] * env(t, 0.002, 0.09, 0.5))
    chis = ruido_filtrado(1.3, 2500, 9000)
    suma(b, 2.42, 0.22, lambda t: (0.22 * chis[int(t * SR)] + 0.08 * (2 * ((95 * t) % 1) - 1)) * (0.4 + 0.6 * t / 0.22), -0.4)  # la línea de los ojos se dibuja
    suma(b, 2.62, 1.1, lambda t: (0.035 * (2 * ((60 * t) % 1) - 1) + 0.05 * chis[int(t * SR)] * (1 if seno(23, t) > 0.3 else 0.15)) * env(t, 0.01, 1.0, 1.1), -0.4)  # zumbido eléctrico que parpadea
    suma(b, 2.5, 0.3, lambda t: 0.18 * seno(110 - 180 * t, t) * env(t, 0.003, 0.06, 0.3), 0.6)  # rodillas al suelo
    fundidos(b, 0.05, 0.45); return b

def cadenas():
    b = pista(4.6); R = 1.45
    suma(b, 0, R + 0.05, lambda t: 0.2 * (seno(49, t) + 0.7 * seno(73.4, t) + 0.5 * seno(51.2, t)) * (0.5 + 0.5 * t / R))  # tensión con batido
    for lat in (0.18, 0.72, 1.16):
        for d in (0, 0.14): suma(b, lat + d, 0.2, lambda t: 0.4 * seno(62 - 60 * t, t) * env(t, 0.004, 0.05, 0.2))  # latido
    met = ruido_filtrado(0.7, 2500, 11000)
    suma(b, 0.85, 0.6, lambda t: 0.28 * met[int(t * SR)] * (0.5 + 0.5 * seno(27, t)) ** 3 * (0.2 + 0.8 * t / 0.6))  # traqueteo de cadenas
    for k in range(7): suma(b, 0.88 + k * 0.08, 0.2, lambda t, k=k: 0.05 * (seno(2100 + 370 * (k % 3), t) + seno(3170 + 210 * (k % 4), t)) * env(t, 0.001, 0.04, 0.2), (-1) ** k * 0.6)
    roto = ruido_filtrado(0.4, 3000, 14000); suma(b, R, 0.4, lambda t: 0.6 * roto[int(t * SR)] * env(t, 0.001, 0.05, 0.4))  # chasquido metálico
    for f, g, p in ((1810, 0.12, -0.5), (2725, 0.1, 0.5), (4140, 0.07, -0.2), (5630, 0.04, 0.3)): suma(b, R, 1.2, lambda t, f=f, g=g: g * seno(f, t) * env(t, 0.001, 0.28, 1.2), p)
    for k in range(6): suma(b, R + 0.25 + k * 0.11, 0.25, lambda t, k=k: 0.035 * seno(2400 + 300 * k, t) * env(t, 0.001, 0.05, 0.25), (-1) ** k * 0.8)  # eslabones que caen
    for f, g in ((261.6, 0.08), (329.6, 0.07), (392, 0.07), (523.3, 0.05), (784, 0.03)): suma(b, R + 0.02, 3.1, lambda t, f=f, g=g: g * seno(f, t) * min(1, t / 0.45) * (0.85 + 0.15 * seno(0.9 + f / 900, t)))  # acorde abierto: libertad
    viento = ruido_filtrado(3.1, 700, 3800); suma(b, R, 3.1, lambda t: 0.10 * viento[int(t * SR)] * math.sin(math.pi * min(1, t / 2.6)) ** 2)
    for k in range(8): suma(b, R + 0.35 + k * 0.27, 0.5, lambda t, k=k: 0.022 * seno((1568, 2093, 2637, 3136)[k % 4], t) * env(t, 0.004, 0.16, 0.5), (-1) ** k * 0.7)  # destellos
    fundidos(b, 0.04, 1.2); return b

sal = sys.argv[1]; guardar(escuela(), sal + "/ambiente MG escuela.wav"); guardar(cadenas(), sal + "/ambiente MG cadenas.wav"); print("ok")
