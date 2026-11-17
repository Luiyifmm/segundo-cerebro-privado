import json,sys
TP=('Posición','Escala','Rotación','Opacidad','Punto de anclaje','Orientación','Rotación X','Rotación Y','Rotación Z')
def kf(a):
    return " ".join(f"{k['t']}s={k['v']}[{k.get('i')} in{k.get('ein')} out{k.get('eout')}]" for k in a.get('keys',[])[:8])+(f" (+{len(a['keys'])-8})" if len(a.get('keys',[]))>8 else "")
for cid in sys.argv[1:]:
    c=json.load(open(f"c{cid}.json"))
    print(f"\n=== [{cid}] {c['n']} {c['w']}x{c['h']} {c['d']}s {c['fps']}fps motionblur={c['mb']} shutter={c['shutter']}")
    for L in c['layers']:
        T=L.get('T',{})
        print(f"#{L['i']} {L['kind']} {L['n']!r}{'' if L['on'] else ' (OFF)'} {L['ini']}–{L['out']}s src={L.get('src')!r} 3d={L.get('three')} mb={L.get('mb')} blend={L.get('blend')} matte={L.get('matte')}→{L.get('matteL')} par={L['par']} remap={L.get('timeRemap')} | pos={T.get('Posición')} esc={T.get('Escala')} rot={T.get('Rotación',T.get('Rotación Z'))} op={T.get('Opacidad')}")
        if L.get('text'): t=L['text']; print(f"    texto={t['text']!r} {t['font']} {t['size']}px track={t['track']} fill={t['fill']}")
        for e in L.get('fx',[]):
            if e['n'].startswith('TextEvo'):
                p=e['params']; print(f"    FX {e['n']}: "+", ".join(f"{k}={v}" for k,v in p.items() if v not in (0,False,None))[:400])
            else:
                print(f"    FX {e['n']} ({e['mn']}){'' if e['on'] else ' OFF'}: "+", ".join(f"{k}={v}" for k,v in list(e['params'].items())[:18])[:500])
        for m in L.get('masks',[]): print("    MÁSCARA",m)
        for a in L['anim']:
            if a.get('expr','').startswith('var fx= effect("TextEvo') and not a.get('keys'): continue
            if 'TextEvo' in a['p'] and 'Strength' in a['p']: continue
            print("    ANIM",a['p'], ("EXPR: "+a['expr'][:160].replace('\n',' ')) if a.get('expr') else "", kf(a))
