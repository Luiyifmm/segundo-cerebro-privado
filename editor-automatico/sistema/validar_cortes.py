"""Valida un montaje volviéndolo a transcribir (método de Luis: así se acaban las sílabas comidas).

Uso: uv run --with mlx-whisper python validar_cortes.py MONTAJE.mp4 PALABRAS.json
  PALABRAS.json = el que escribe montar.py ({palabras:[{w,s,e}]}, tiempos del montaje).
Compara lo que debería decir con lo que se oye de verdad y lista cada diferencia con su segundo.
Una palabra que falta o cambia junto a un corte = corte mal puesto (ajustar aire o mover el corte).
Las diferencias lejos de un corte suelen ser errores del transcriptor: escuchar antes de tocar nada.
"""
import difflib, json, re, sys, unicodedata

import mlx_whisper

MODELO = 'mlx-community/whisper-large-v3-turbo'


def norm(s):
    s = ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^\w%]', '', s)


video, pj = sys.argv[1], sys.argv[2]
esperado = json.load(open(pj))['palabras']
r = mlx_whisper.transcribe(video, path_or_hf_repo=MODELO, language='es', word_timestamps=True, condition_on_previous_text=False)
oido = [w for s in r['segments'] for w in s.get('words', [])]
a = [norm(w['w']) for w in esperado]
b = [norm(w['word']) for w in oido]
# Inicio de cada tramo del montaje (donde hay corte): saltos de «seg» o huecos entre palabras
cortes = [esperado[i]['s'] for i in range(1, len(esperado))
          if esperado[i].get('seg') != esperado[i - 1].get('seg') or esperado[i]['s'] - esperado[i - 1]['e'] > 0.05]
dif = []
for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
    if op == 'equal': continue
    t = esperado[i1]['s'] if i1 < len(esperado) else esperado[-1]['e']
    cerca = min((abs(t - c) for c in cortes), default=99) < 0.6
    dif.append({'segundo': round(t, 2), 'tipo': op, 'esperado': ' '.join(w['w'].strip() for w in esperado[i1:i2]),
                'oido': ' '.join(w['word'].strip() for w in oido[j1:j2]), 'junto_a_un_corte': cerca})
ok = sum(1 for x in dif if x['junto_a_un_corte']) == 0
print(json.dumps({'palabras_esperadas': len(a), 'palabras_oidas': len(b), 'cortes': len(cortes),
                  'veredicto': 'CORTES LIMPIOS' if ok else 'REVISAR CORTES', 'diferencias': dif,
                  'texto_oido': r['text'].strip()}, ensure_ascii=False, indent=1))
