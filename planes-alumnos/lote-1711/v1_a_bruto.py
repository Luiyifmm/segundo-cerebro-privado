# Convierte segundos del MONTAJE de un spec v1 (sin "tiempos": "bruto") a segundos del BRUTO, para rehacerlo como v2 sin perder lo hecho.
import json, re
def conversor(tramos):
    def m2b(t):
        off = 0.0
        for s, e in tramos:
            if t < off + (e - s) - 1e-6: return round(s + (t - off), 3)
            off += e - s
        return round(tramos[-1][1], 3)
    return m2b
def spec_a_bruto(S):
    if S.get('tiempos') == 'bruto': return S
    f = conversor(S['tramos'])
    for e in S.get('elementos', []):
        for k in ('t0', 't1', 't_clic', 't_marca'):
            if isinstance(e.get(k), (int, float)) and e[k] < 99: e[k] = f(e[k])
        for it in e.get('items', []):
            for k in ('t', 't_col'):
                if k in it: it[k] = f(it[k])
        if 'tiempos' in e: e['tiempos'] = [f(x) for x in e['tiempos']]
    S['zooms'] = [[f(a), f(b), z] for a, b, z in S.get('zooms', [])]
    S['transiciones'] = [f(x) for x in S.get('transiciones', [])]
    S['sin_subs'] = [[f(a), f(b)] for a, b in S.get('sin_subs', [])]
    S['eventos_extra'] = [dict(x, t=f(x['t'])) for x in S.get('eventos_extra', [])]
    if 'frases_desde' in S: S['frases_desde'] = f(S['frases_desde'])
    S['frases'] = [re.sub(r'@([\d.]+)\|', lambda g: '@%.2f|' % f(float(g.group(1))), x) for x in S.get('frases', [])]
    S['tiempos'] = 'bruto'; return S
