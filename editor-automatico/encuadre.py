"""Reencuadre a vertical 9:16 siguiendo a quien habla (como el «active speaker» de Opus/Vizard).

1. `caras` (Vision de Apple) da cada 0,25 s dónde está cada cara y cuánto abre la boca.
2. Las caras se agrupan en personas por su posición.
3. Con una persona: el recorte la sigue, suavizado (solo se mueve si se aleja de verdad).
   Con varias: habla quien más mueve la boca en ese momento; el plano cambia a esa persona con un
   mínimo de 1,5 s por plano para que no parpadee.
4. ffmpeg recorta con `sendcmd`, que mueve la ventana de recorte en los momentos calculados.

Uso suelto: python3 encuadre.py ENTRADA SALIDA  → imprime {"cara": {...}, "personas": n, "planos": n}
"""
import json, os, statistics, subprocess, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
CARAS = os.path.join(AQUI, 'caras')
PASO = 0.25


def personas(muestras):
    """Agrupa las caras en personas por su posición horizontal."""
    pistas = []  # {x, y, n, obs: {i: (x, y, boca)}}
    for i, m in enumerate(muestras):
        for x, y, w, h, boca in m['caras']:
            if w < 0.03: continue  # caras de fondo o falsos positivos
            p = min(pistas, key=lambda p: abs(p['x'] - x), default=None)
            if p is None or abs(p['x'] - x) > 0.12:
                p = {'x': x, 'y': y, 'n': 0, 'obs': {}}; pistas.append(p)
            if i in p['obs']: continue
            p['obs'][i] = (x, y, boca); p['n'] += 1
            p['x'] += (x - p['x']) * 0.2; p['y'] += (y - p['y']) * 0.2
    return [p for p in pistas if p['n'] >= max(3, len(muestras) * 0.15)]


def quien_habla(ps, n):
    """Para cada muestra, la persona que más mueve la boca alrededor de ese instante."""
    v = int(0.75 / PASO)
    act = []
    for i in range(n):
        mejor, quien = -1, 0
        for k, p in enumerate(ps):
            bocas = [p['obs'][j][2] for j in range(max(0, i - v), min(n, i + v + 1)) if j in p['obs']]
            s = statistics.pstdev(bocas) if len(bocas) >= 3 else 0
            if s > mejor: mejor, quien = s, k
        act.append(quien)
    # Planos de al menos 1,5 s: un cambio solo cuenta si dura.
    minimo = int(1.5 / PASO)
    planos, i = [], 0
    while i < n:
        k = act[i]; j = i
        while j < n and act[j] == k: j += 1
        if planos and j - i < minimo: planos[-1][2] = j
        elif planos and planos[-1][0] == k: planos[-1][2] = j
        else: planos.append([k, i, j])
        i = j
    return planos


def trayectoria(muestras, ps):
    """Centro x (0-1) que hay que encuadrar en cada muestra."""
    n = len(muestras)
    if len(ps) == 1:
        p = ps[0]; xs = []; ult = p['x']
        for i in range(n):
            if i in p['obs']: ult = p['obs'][i][0]
            xs.append(ult)
        # Mediana móvil de 1 s y solo moverse si se aleja más de un 4 % del ancho.
        suave, cur = [], None
        for i in range(n):
            med = statistics.median(xs[max(0, i - 2):i + 3])
            if cur is None or abs(med - cur) > 0.04: cur = med
            suave.append(cur)
        return suave, p['y'], 1
    planos = quien_habla(ps, n)
    xs = [0.5] * n
    for k, a, b in planos:
        obs = [ps[k]['obs'][j][0] for j in range(a, b) if j in ps[k]['obs']]
        x = statistics.median(obs) if obs else ps[k]['x']
        for j in range(a, b): xs[j] = x
    return xs, statistics.median(p['y'] for p in ps), len(planos)


def reencuadrar(entrada, salida, w, h, respaldo=None):
    """Recorta `entrada` (horizontal) a 1080x1920 siguiendo a quien habla. Devuelve dónde queda la cara."""
    cw = int(h * 9 / 16) // 2 * 2
    try:
        d = json.loads(subprocess.run([CARAS, entrada, str(PASO)], capture_output=True, text=True, check=True).stdout)
        muestras = d['muestras']; ps = personas(muestras)
    except Exception:
        muestras, ps = [], []
    if ps:
        xs, fy, planos = trayectoria(muestras, ps)
    else:
        fx, fy = respaldo() if respaldo else (0.5, 0.4)
        xs, planos = [fx], 1
    x0s = [int(min(w - cw, max(0, x * w - cw / 2))) for x in xs]
    cmds, prev = [], None
    for i, x0 in enumerate(x0s):
        if x0 != prev: cmds.append(f'{i * PASO:.2f} crop@c x {x0};'); prev = x0
    f = salida + '.cmd'
    open(f, 'w').write('\n'.join(cmds) + '\n')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', entrada, '-vf',
                    f"sendcmd=f='{f}',crop@c={cw}:{h}:{x0s[0]}:0,scale=1080:1920:flags=lanczos",
                    '-c:v', 'h264_videotoolbox', '-b:v', '20M', '-c:a', 'copy', salida], check=True)
    os.remove(f)
    return {'cara': {'x': 540, 'y': round(fy * 1920)}, 'personas': len(ps), 'planos': planos}


if __name__ == '__main__':
    import re
    info = subprocess.run(['ffmpeg', '-hide_banner', '-i', sys.argv[1]], capture_output=True, text=True).stderr
    w, h = map(int, re.search(r'Video:.*?(\d{3,5})x(\d{3,5})', info).groups())
    print(json.dumps(reencuadrar(sys.argv[1], sys.argv[2], w, h)))
