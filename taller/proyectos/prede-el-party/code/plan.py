"""Orden del set, transiciones, voces e intro. Uso: plan.py carpeta_proyecto salida.json"""
import json, sys
S = sys.argv[1]; pk = json.load(open(f'{S}/pick_auto.json'))
try: pk.update(json.load(open(f'{S}/pick_manual.json')))
except FileNotFoundError: pass
# (id, cómo entra, extras). Lo que define cómo SALE un tema es el 'in' del siguiente.
order = [('14', 'rise', dict(impact='03_069', impact_db=-12)),
         ('13', 'blend', {}), ('12', 'blend', dict(riser='02_056')),
         ('23', 'riser', dict(impact='03_075', impact_db=-11)),
         ('01', 'cut', dict(impact='04_085', impact_db=-10, gain_db=-0.5)),
         ('28', 'filter', dict(impact='04_087', impact_db=-13)), ('02', 'echo', {}),
         ('07', 'spin', dict(impact='04_084', impact_db=-12, riser='02_061')),
         ('26', 'riser', dict(impact='03_069', impact_db=-11)),
         ('27', 'filter', dict(impact='04_087', impact_db=-13)),
         ('19', 'echo', {}), ('16', 'cut', dict(impact='03_075', impact_db=-12)),
         ('35', 'riser', dict(impact='03_069', impact_db=-11)),
         ('09', 'echo', {}),
         ('03', 'cut', dict(impact='03_072', impact_db=-12)),
         ('15', 'spin', dict(impact='03_072', impact_db=-12)),
         ('11', 'echo', dict(riser='02_056')),
         ('30', 'riser', dict(impact='03_075', impact_db=-11)),
         ('33', 'cut', dict(impact='03_075', impact_db=-9)),
         ('36', 'filter', dict(impact='04_084', impact_db=-12)),
         ('31', 'echo', {}),
         ('34', 'riser', dict(impact='03_069', impact_db=-10, echo_db=-3, sec_gain=[(90.3, 102.5, -2)])),
         ('32', 'echo', {}), ('05', 'cut', dict(impact='03_075', impact_db=-12)),
         ('04', 'filter', dict(impact='04_087', impact_db=-13)),
         ('18', 'echo', {}), ('10', 'riser', dict(impact='03_072', impact_db=-12)),
         ('22', 'spin', dict(impact='04_087', impact_db=-13, riser='02_061', riser_db=-14)),
         ('24', 'riser', dict(impact='03_075', impact_db=-11)),
         ('06', 'cut', dict(impact='04_084', impact_db=-12)),
         ('29', 'echo', dict(sec_gain=[(70.4, 85.4, -3)])),
         ('20', 'filter', dict(impact='04_087', impact_db=-13, riser='02_064', riser_db=-9)),
         ('25', 'riser', dict(impact='03_069', impact_db=-9)),
         ('21', 'echo', {})]
songs = []
for i, (n, kind, ex) in enumerate(order):
    d = dict(id=n, **{k: pk[n][k] for k in ('start', 'end')}, **ex); d['in'] = kind
    songs.append(d)

dg = json.load(open(f'{S}/vox/proc/dur_grave.json'))
V = lambda n: f'{S}/vox/proc/{n}.wav'
# intro original completa con su narrador; tras «Bienvenidos», el locutor grave; la canción 1 sube por debajo
intro = dict(file=f'{S}/in/intro.wav', cut=51.5, fade_s=0.8, drop_at=51.6 + 4 * 60 / 129.37, gain_db=-4,
             voices=[dict(file=V('FRASE2'), t=46.75, gain_db=2, duck_db=-13, dur=dg['FRASE2'])], fx=[])
# voz en los últimos segundos del tema indicado (antes de su salida)
ment = {'12': ('M01', 'riser'), '07': ('M02', 'riser'), '16': ('M03', 'riser'), '11': ('M04', 'riser'),
        '31': ('M05', 'riser'), '18': ('V06', 'riser'), '20': ('V08', 3.0), '05': ('V07', 'beat'), '24': ('V07', 'beat')}
G = {'M01': -3, 'M02': 0, 'M03': -1, 'M04': -3, 'M05': 0, 'V06': -1, 'V08': 0, 'V07': -3}
for d in songs:
    if d['id'] in ment:
        m, eb = ment[d['id']]
        d['voices'] = [dict(file=V(m + 'g'), dur=dg[m + 'g'], end_before_out=eb, gain_db=G[m],
                            duck_db=(-10 if m in ('M02', 'M03', 'V08', 'V07') else -7),
                            carve=(8 if m in ('M03', 'V08') else 0))]
    if d['id'] == '16':   # tag sobre el primer compás (instrumental) de Calimeño
        d['voices'] = d.get('voices', []) + [dict(file=V('V07g'), dur=dg['V07g'], after_in=0.35, gain_db=-1, duck_db=-9, carve=6)]
json.dump(dict(intro=intro, songs=songs, ending='echo', end_impact='03_069', end_impact_db=-4,
               end_voices=[dict(file=V('V07g'), after_out=0.3, gain_db=-1, dur=dg['V07g'])], end_tail=4.5, duck_db=-7),
          open(sys.argv[2], 'w'), indent=1)
print(len(songs), 'canciones')
