"""De la transcripción de Whisper a FRASES de verdad, para que ningún clip ni montaje empiece o acabe a medias.

Whisper parte por trozos de ~5 s que no respetan las frases («…vamos a la tercera fuga. La» | «tercera fuga es…»).
Aquí se juntan todas las palabras y se vuelven a partir donde acaba la frase (. ? ! …) o hay una pausa larga.
También se arreglan los números que Whisper separa («4» «.000» → «4.000», «20» «%» → «20%»).

Uso: python3 frases.py TRANSCRIPCION.json SALIDA.json   (misma forma: {"segments": [{start, end, text, words}]})
"""
import json, re, sys

FIN = re.compile(r'[.?!…]["»”)]*$')
PEGA = re.compile(r'^([.,]\d|%|€|\$|º|ª)')  # trozos que van pegados a la palabra de antes


def palabras(segs):
    out = []
    for s in segs:
        for w in s.get('words') or []:
            t = w['w'].strip()
            if not t: continue
            if out and PEGA.match(t) and w['s'] - out[-1]['e'] < 0.6:
                out[-1] = {**out[-1], 'w': out[-1]['w'] + t, 'e': w['e']}
            else:
                out.append({**w, 'w': t})
    return out


def frases(segs, pausa=0.8, maximo=32):
    ws, out, cur = palabras(segs), [], []
    def cerrar():
        if cur: out.append({'start': cur[0]['s'], 'end': cur[-1]['e'], 'text': ' '.join(x['w'] for x in cur), 'words': list(cur)})
        cur.clear()
    for i, w in enumerate(ws):
        hueco = w['s'] - cur[-1]['e'] if cur else 0
        largo = cur[-1]['e'] - cur[0]['s'] if cur else 0
        # Sin puntuación (Whisper a veces no la pone): partir en la pausa natural cuando la frase ya es larga
        if cur and (hueco > pausa or (largo > 8 and hueco > 0.18) or largo > 18): cerrar()
        cur.append(w)
        if FIN.search(w['w']): cerrar()
        elif len(cur) >= maximo and re.search(r'[,;:]$', w['w']): cerrar()  # frase eterna: partir en la coma
    cerrar()
    return out


if __name__ == '__main__':
    t = json.load(open(sys.argv[1]))
    json.dump({**t, 'segments': frases(t['segments'])}, open(sys.argv[2], 'w'), ensure_ascii=False)
    print(len(t['segments']), 'trozos de Whisper →', len(frases(t['segments'])), 'frases')
