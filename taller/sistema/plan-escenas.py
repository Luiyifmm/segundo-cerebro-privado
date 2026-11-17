#!/usr/bin/env python3
# Documento de plan de escenas, versión 2 (14-11-2026), como el de Joseph:
#   · EL ASPECTO: 3–5 paletas PROPUESTAS (sacadas de los colores del propio vídeo + la marca si se da), con sus 4 colores y su papel,
#     y 4 familias de letra, con una VISTA PREVIA que cambia al elegir.
#   · EL CORTE, LÍNEA A LÍNEA: a la IZQUIERDA la casilla «¿Qué se ve en pantalla?» (con mi propuesta si se pasa),
#     en el centro la vista previa del subtítulo sobre el fotograma real, a la DERECHA la línea del guion con su tiempo.
#   · Arriba: reparto de pantalla, aviso de más de 5 s de A-roll y «Copiar plan».
# uso: <python con PIL> plan-escenas.py <palabras.json> --salida <carpeta> [--video v.mp4] [--tramos tramos.json] [--titulo "…"]
#        [--marca "Nombre:#acento,#oscuro"] [--propuestas propuestas.json] [--max 9] [--pausa 0.35]
#   propuestas.json: [{"n":1,"tipo":"A-roll + texto","texto":"…","especial":"…"}, …]
import json, os, html, argparse, subprocess, colorsys
a = argparse.ArgumentParser(); a.add_argument('palabras'); a.add_argument('--salida', required=True); a.add_argument('--titulo', default='')
a.add_argument('--video'); a.add_argument('--tramos'); a.add_argument('--marca'); a.add_argument('--propuestas')
a.add_argument('--max', type=int, default=9); a.add_argument('--pausa', type=float, default=0.35)
o = a.parse_args()
FF = os.path.expanduser('~/.local/bin/ffmpeg')
d = json.load(open(o.palabras, encoding='utf-8'))
pal = d if isinstance(d, list) else (d.get('palabras') or d.get('words') or [])
pal = [w for w in pal if w.get('inicio') is not None and w.get('fiable', True)]
if o.tramos:
    t = json.load(open(o.tramos, encoding='utf-8')); t = t.get('tramos', t) if isinstance(t, dict) else t
    tr = [(x['inicio'], x['fin']) if isinstance(x, dict) else (x[0], x[1]) for x in t]
    def mapa(s):
        ac = 0.0
        for a_, b_ in tr:
            if s < a_: return ac
            if s <= b_: return ac + (s - a_)
            ac += b_ - a_
        return ac
    pal = [w for w in pal if any(a_ - 0.08 <= (w['inicio'] + w['fin']) / 2 <= b_ + 0.08 for a_, b_ in tr)]   # fuera lo que el corte quitó
    for w in pal: w['inicio'], w['fin'] = mapa(w['inicio']), mapa(w['fin'])
lineas, act = [], []
for i, w in enumerate(pal):
    act.append(w); tx = w['texto'].strip(); sig = pal[i + 1] if i + 1 < len(pal) else None
    fuerte = tx[-1:] in '.?!…'; coma = tx[-1:] in ',;:'
    if sig is None or fuerte or (sig['inicio'] - w['fin'] >= o.pausa) or len(act) >= o.max or (coma and len(act) >= 4):
        lineas.append(act); act = []
VACIAS = set('el la los las un una unos unas de del al a en y o que se su sus mi me te lo le es no si por para con the a an of to in is it and or that this for on you i'.split())
def especial(ws):   # propuesta de palabra especial: la última palabra «con contenido» y, si es corta, la anterior también
    lim = [w.strip('.,;:?!…¿¡"«»') for w in ws]; idx = [i for i, w in enumerate(lim) if w.lower() not in VACIAS and len(w) > 2]
    if not idx: return lim[-1] if lim else ''
    j = idx[-1]; return ' '.join(lim[j - 1:j + 1]) if j > 0 and len(lim[j]) < 6 and lim[j - 1].lower() not in VACIAS else lim[j]
filas = []
for i, l in enumerate(lineas):
    ws = [w['texto'].strip() for w in l]
    filas.append(dict(n=i + 1, ini=l[0]['inicio'], fin=l[-1]['fin'], texto=' '.join(ws), especial=especial(ws)))
for i, f in enumerate(filas): f['dur'] = (filas[i + 1]['ini'] if i + 1 < len(filas) else f['fin']) - f['ini']
total = filas[-1]['fin'] if filas else 0
os.makedirs(os.path.join(o.salida, 'plan_img'), exist_ok=True)
tit = o.titulo or os.path.basename(o.palabras).split('.')[0]
prop = {}
if o.propuestas: prop = {int(p['n']): p for p in json.load(open(o.propuestas, encoding='utf-8'))}
# ---------- miniaturas y paletas (del propio vídeo) ----------
hx = lambda r, g, b: '#%02X%02X%02X' % (round(r * 255), round(g * 255), round(b * 255))
def paleta(h, nombre):   # h en 0..1 → vivo, oscuro rico, blanco teñido, negro teñido
    return dict(nombre=nombre, c=[hx(*colorsys.hls_to_rgb(h, .70, .82)), hx(*colorsys.hls_to_rgb(h, .34, .55)), hx(*colorsys.hls_to_rgb(h, .93, .40)), hx(*colorsys.hls_to_rgb(h, .07, .25))])
NOMBRES = [(0.035, 'Rojo'), (0.09, 'Naranja'), (0.15, 'Dorado'), (0.22, 'Lima'), (0.40, 'Verde'), (0.52, 'Turquesa'), (0.68, 'Azul'), (0.80, 'Violeta'), (0.93, 'Rosa'), (1.01, 'Rojo')]
nom = lambda h: next(n for lim, n in NOMBRES if h < lim)
paletas = []
if o.marca:
    n_, cs = o.marca.split(':', 1); cs = [c.strip() for c in cs.split(',')]
    r, g, b = [int(cs[0][i:i + 2], 16) / 255 for i in (1, 3, 5)]; h = colorsys.rgb_to_hls(r, g, b)[0]; p = paleta(h, 'Marca · ' + n_.strip())
    p['c'][0] = cs[0].upper()
    if len(cs) > 1: p['c'][1] = cs[1].upper()
    paletas.append(p)
if o.video and os.path.exists(o.video):
    for f in filas:
        subprocess.run([FF, '-v', 'error', '-y', '-ss', '%.2f' % (f['ini'] + min(0.3, f['dur'] / 2)), '-i', o.video, '-frames:v', '1', '-vf', 'scale=270:-2',
                        os.path.join(o.salida, 'plan_img', 'L%02d.jpg' % f['n'])])
    try:
        from PIL import Image
        bins = [0.0] * 24; hs = [[] for _ in range(24)]
        for f in filas[::max(1, len(filas) // 10)]:
            p_ = os.path.join(o.salida, 'plan_img', 'L%02d.jpg' % f['n'])
            if not os.path.exists(p_): continue
            px = Image.open(p_).convert('RGB').resize((48, 85)).tobytes()
            for r, g, b in zip(px[0::3], px[1::3], px[2::3]):
                h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
                if s > 0.22 and 0.15 < l < 0.9: k = int(h * 24) % 24; bins[k] += s; hs[k].append(h)
        usados = []
        for k in sorted(range(24), key=lambda k: -bins[k]):
            if bins[k] <= 0 or len(usados) >= 3: break
            if any(min(abs(k - u), 24 - abs(k - u)) < 3 for u in usados): continue
            usados.append(k); h = sum(hs[k]) / len(hs[k]); paletas.append(paleta(h, nom(h) + ' · del plano'))
    except Exception as e:
        print('aviso: sin paletas del vídeo (%s)' % e)
if not paletas: paletas = [paleta(0.13, 'Dorado'), paleta(0.40, 'Verde'), paleta(0.75, 'Violeta')]
paletas.append(dict(nombre='Neutra (crema y negro)', c=['#F4EFE4', '#8A8478', '#F6F3EC', '#14130F']))
LETRAS = [dict(nombre='Sans', det='Sequel Sans', rf="'Sequel Sans',Inter,sans-serif", rw=300, ef="'Sequel Sans',Inter,sans-serif", ew=800, es='normal', k=1.0),
          dict(nombre='Sans + serif', det='Inter + Nyght Serif', rf='Inter,sans-serif', rw=300, ef="'Nyght Serif','Cormorant Garamond',serif", ew=700, es='italic', k=1.08),
          dict(nombre='Serif', det='Cormorant Garamond', rf="'Cormorant Garamond',serif", rw=300, ef="'Cormorant Garamond',serif", ew=700, es='normal', k=1.2),
          dict(nombre='Sans + caligráfica', det='Inter + Aston Script', rf='Inter,sans-serif', rw=300, ef="'Aston Script Bold','Amsterdam',cursive", ew=700, es='normal', k=1.35)]
json.dump(dict(filas=filas, paletas=paletas, letras=[l['nombre'] for l in LETRAS]), open(os.path.join(o.salida, 'plan.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
# ---------- Markdown ----------
M = ['# Plan de escenas · ' + tit, '', 'Duración %.1f s · %d líneas.' % (total, len(filas)), '', '**Paletas propuestas** (especiales · formas · texto · fondo):']
M += ['- %s: %s' % (p['nombre'], ' · '.join(p['c'])) for p in paletas]
M += ['', '**Letras:** ' + ' / '.join('%s (%s)' % (l['nombre'], l['det']) for l in LETRAS), '',
      '| ¿Qué se ve en pantalla? (tipo · qué · motivo) | Palabra especial | # | Tiempo | Línea del guion |', '|---|---|---|---|---|']
M += ['| %s | %s | %d | %.2f–%.2f | %s |' % (((prop[f['n']].get('tipo', '') + ': ' + prop[f['n']].get('texto', '')) if f['n'] in prop else ''),
                                             prop.get(f['n'], {}).get('especial', f['especial']), f['n'], f['ini'], f['fin'], f['texto']) for f in filas]
open(os.path.join(o.salida, 'plan.md'), 'w', encoding='utf-8').write('\n'.join(M) + '\n')
# ---------- HTML ----------
TIPOS = ['', 'A-roll + texto', 'A-roll con tarjeta', 'B-roll con texto', 'Montaje de b-roll', 'Pantalla completa: gráfico o cifra', 'Pantalla completa: metáfora',
         'Pantalla completa: lista', 'Dos personajes en el mismo cuadro (superposición)', 'Inserto breve (cuadro, objeto)', 'Caja de palabra', 'Demostración sobre el cuerpo', 'Prueba (estudio, captura)', 'Comparación', 'Elemento fijo de progreso', 'Otra']
E = html.escape
def fila_html(f):
    p = prop.get(f['n'], {}); ops = ''.join('<option%s>%s</option>' % (' selected' if x == p.get('tipo') else '', E(x)) for x in TIPOS)
    img = 'plan_img/L%02d.jpg' % f['n']; hay = os.path.exists(os.path.join(o.salida, img))
    return '''<section class="l" data-dur="%.3f" data-n="%d"><div class="e"><select aria-label="Tipo de escena">%s</select>
<div class="c" contenteditable data-ph="¿Qué se ve en pantalla? Qué, dónde y por qué">%s</div>
<label class="esp">Palabra especial <input value="%s"></label></div>
<div class="v"><div class="marco">%s<div class="deg"></div><div class="sub"><span class="re"></span><span class="es"></span></div></div></div>
<div class="g"><div class="t"><b>L%02d</b> %.2f – %.2f s</div><p>%s</p></div></section>''' % (
        f['dur'], f['n'], ops, E(p.get('texto', '')), E(p.get('especial', f['especial'])), ('<img src="%s" alt="">' % img) if hay else '', f['n'], f['ini'], f['fin'], E(f['texto']))
H = '''<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Plan · %(t)s</title><style>
:root{--f:#f5f4f0;--p:#fff;--x:#16150f;--m:#6d6a60;--l:#dedbd2;--az:#2f7fe0;--r:#d9442a}
@media(prefers-color-scheme:dark){:root{--f:#12110d;--p:#1b1a15;--x:#f1efe8;--m:#a09c90;--l:#34322a}}
*{box-sizing:border-box}body{background:var(--f);color:var(--x);font:16px/1.45 Inter,-apple-system,sans-serif;margin:0;padding:28px 20px 80px}
main{max-width:1180px;margin:auto}h1{font-size:34px;letter-spacing:-.02em;margin:0}h1 span{color:var(--m);font-weight:400}
.in{color:var(--m);margin:6px 0 22px}.in b{color:var(--x)}h2{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--m);margin:26px 0 10px}
.card{background:var(--p);border:1px solid var(--l);border-radius:14px;padding:22px;margin-bottom:14px;display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:center}
.card h3{margin:0 0 2px;font-size:22px;letter-spacing:-.01em}.card small{color:var(--m)}
.ops{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.op{display:flex;align-items:center;gap:10px;border:1px solid var(--l);border-radius:10px;padding:10px 12px;cursor:pointer;color:var(--m)}
.op input{accent-color:var(--az)}.op.on{border:2px solid var(--az);color:var(--x);font-weight:600;padding:9px 11px}.op i{margin-left:auto;display:flex;gap:3px}.op i b{width:14px;height:14px;border-radius:4px;border:1px solid #0002}
.op em{font-style:normal;font-weight:400;color:var(--m);font-size:13px}
.sw{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.sw div b{display:block;height:92px;border-radius:12px;border:1px solid #0002}.sw div span{display:block;font-weight:600;margin-top:8px}.sw div small{font-size:12px}
.pv{border-radius:12px;padding:26px 28px;min-height:120px;display:flex;flex-direction:column;justify-content:center}
.pv .re{font-size:20px;letter-spacing:-.02em}.pv .es{font-size:46px;line-height:1.02;letter-spacing:-.035em}
#res{position:sticky;top:0;z-index:5;background:var(--f);padding:10px 0;border-bottom:1px solid var(--l);display:flex;gap:16px;flex-wrap:wrap;align-items:center;font-size:14px}
#res b{font-variant-numeric:tabular-nums}.mal{color:var(--r);font-weight:600}button{padding:9px 16px;border-radius:999px;border:0;background:var(--x);color:var(--f);font-weight:600;cursor:pointer;font:inherit;font-weight:600}
.l{background:var(--p);border:1px solid var(--l);border-radius:14px;padding:16px;margin-top:12px;display:grid;grid-template-columns:minmax(0,1.5fr) 150px minmax(0,1fr);gap:20px}
select{width:100%%;padding:8px;border:1px solid var(--l);border-radius:9px;background:transparent;color:inherit;font:inherit;font-size:14px;margin-bottom:8px}
.c{min-height:118px;border:1px solid var(--l);border-radius:10px;padding:12px;font-size:17px}.c:empty:before{content:attr(data-ph);color:var(--m);opacity:.7}.c:focus{outline:2px solid var(--az);border-color:transparent}
.esp{display:flex;gap:8px;align-items:center;font-size:13px;color:var(--m);margin-top:8px}.esp input{flex:1;padding:6px 8px;border:1px solid var(--l);border-radius:8px;background:transparent;color:var(--x);font:inherit}
.marco{position:relative;width:150px;aspect-ratio:9/16;border-radius:10px;overflow:hidden;background:#222}.marco img{width:100%%;height:100%%;object-fit:cover;display:block}
.deg{position:absolute;inset:55%% 0 0 0;background:linear-gradient(#0000,#000c)}.sub{position:absolute;left:4%%;right:4%%;top:50%%;text-align:center;display:flex;flex-direction:column;gap:1px;text-shadow:0 1px 6px #000a}
.sub .re{font-size:7px;letter-spacing:-.02em}.sub .es{font-size:15px;line-height:1.02;letter-spacing:-.035em}
.g .t{color:var(--m);font-size:14px;font-variant-numeric:tabular-nums}.g .t b{color:var(--x);font-size:17px;margin-right:6px}.g p{font-size:21px;line-height:1.3;margin:6px 0 0;letter-spacing:-.01em}
@media(max-width:860px){.card{grid-template-columns:1fr}.l{grid-template-columns:1fr 110px}.l .g{grid-column:1/-1;order:-1}.marco{width:110px}.sw div b{height:60px}.ops{grid-template-columns:1fr}}</style><main>
<h1>%(t)s <span>· Plan</span></h1><p class="in"><b>Tu plan.</b> Cada línea del corte está a la derecha. La casilla de la izquierda es tuya: escribe qué se ve en pantalla. %(d).1f s · %(n)d líneas.</p>
<h2>El aspecto</h2>
<div class="card"><div><h3>Paleta de color</h3><small>Una paleta para todo el clip. Salen de los colores del propio vídeo.</small><div class="ops" id="pal"></div></div><div class="sw" id="sw"></div></div>
<div class="card"><div><h3>Familia de letras</h3><small>Relleno fino; palabra especial gruesa y con el acento.</small><div class="ops" id="let"></div></div><div class="pv" id="pv"><span class="re"></span><span class="es"></span></div></div>
<h2>El corte, línea a línea</h2>
<div id="res"><span>Persona en pantalla <b id="pa">0</b> %%</span><span>B-roll <b id="pb">0</b> %%</span><span>Pantalla completa y otras <b id="pf">0</b> %%</span><span>Sin decidir <b id="pn">100</b> %%</span><span id="av"></span><button id="cp">Copiar plan</button></div>
%(r)s</main><script>
const P=%(P)s,L=%(L)s,ROL=['especiales','formas','texto','fondo'],K='plan:'+%(k)s;let st={p:0,l:0};try{st=Object.assign(st,JSON.parse(localStorage.getItem(K)||'{}').st||{})}catch(e){}
const $=s=>document.querySelector(s),filas=[...document.querySelectorAll('.l')],tot=filas.reduce((s,r)=>s+ +r.dataset.dur,0);
function ops(el,arr,key,pinta){el.innerHTML='';arr.forEach((o,i)=>{const d=document.createElement('label');d.className='op'+(st[key]==i?' on':'');d.innerHTML='<input type=radio name='+key+(st[key]==i?' checked':'')+'> '+o.nombre+(o.det?' <em>'+o.det+'</em>':'')+(o.c?'<i>'+o.c.map(c=>'<b style="background:'+c+'"></b>').join('')+'</i>':'');d.querySelector('input').onchange=()=>{st[key]=i;pinta()};el.appendChild(d)})}
function parte(t,e){const i=e?t.toLowerCase().lastIndexOf(e.toLowerCase()):-1;return i<0?[t,'']:[(t.slice(0,i)+' '+t.slice(i+e.length)).replace(/\\s+/g,' ').trim(),t.slice(i,i+e.length)]}
function estilo(re,es,k){const p=P[st.p],l=L[st.l];re.style.cssText='font-family:'+l.rf+';font-weight:'+l.rw+';color:'+p.c[2];es.style.cssText='font-family:'+l.ef+';font-weight:'+l.ew+';font-style:'+l.es+';color:'+p.c[0]+(k?';font-size:'+(k*l.k)+'px':'')}
function pinta(){ops($('#pal'),P,'p',pinta);ops($('#let'),L,'l',pinta);const p=P[st.p];$('#sw').innerHTML=p.c.map((c,i)=>'<div><b style="background:'+c+'"></b><span>'+['Acento','Oscuro','Claro','Fondo'][i]+'</span><small>'+c+' · '+ROL[i]+'</small></div>').join('');
const pv=$('#pv');pv.style.background=p.c[3];const f0=filas[0],[a,b]=parte(f0.querySelector('.g p').textContent,f0.querySelector('.esp input').value);pv.children[0].textContent=a;pv.children[1].textContent=b;estilo(pv.children[0],pv.children[1],46);
filas.forEach(r=>{const [a,b]=parte(r.querySelector('.g p').textContent,r.querySelector('.esp input').value),s=r.querySelector('.sub');s.children[0].textContent=a;s.children[1].textContent=b;estilo(s.children[0],s.children[1],15);
const g=grupo(r.querySelector('select').value);s.style.display=(g=='f')?'none':'flex'});calc();guarda()}
function grupo(v){if(!v)return'n';if(v.startsWith('A-roll')||v.startsWith('Dos personajes')||v.startsWith('Elemento fijo')||v=='Caja de palabra')return'a';if(v.startsWith('Inserto'))return'b';if(/b-roll/i.test(v))return'b';return'f'}
function calc(){const s={a:0,b:0,f:0,n:0};let racha=0,peor=0;filas.forEach(r=>{const g=grupo(r.querySelector('select').value);s[g]+= +r.dataset.dur;if(r.querySelector('select').value=='A-roll + texto'){racha+= +r.dataset.dur;peor=Math.max(peor,racha)}else racha=0});
for(const k in s)$('#p'+k).textContent=Math.round(100*s[k]/tot);const av=[];if(s.n==0){const pa=100*s.a/tot;if(pa<45||pa>75)av.push('persona en pantalla fuera de 45–75 %%')}if(peor>5.5)av.push(peor.toFixed(1)+' s seguidos de persona sola, sin nada nuevo (máx. 5)');$('#av').textContent=av.join(' · ');$('#av').className=av.length?'mal':''}
function guarda(){try{localStorage.setItem(K,JSON.stringify({st,f:filas.map(r=>[r.querySelector('select').value,r.querySelector('.c').innerText,r.querySelector('.esp input').value])}))}catch(e){}}
try{const g=JSON.parse(localStorage.getItem(K)||'{}').f;if(g)g.forEach((v,i)=>{const r=filas[i];if(!r)return;r.querySelector('select').value=v[0];r.querySelector('.c').innerText=v[1];r.querySelector('.esp input').value=v[2]})}catch(e){}
document.addEventListener('input',pinta);document.addEventListener('change',pinta);
$('#cp').onclick=e=>{const p=P[st.p],l=L[st.l];let t='PLAN DE ESCENAS · '+%(k)s+'\\nPaleta: '+p.nombre+' ('+p.c.join(', ')+')\\nLetras: '+l.nombre+' ('+l.det+')\\n';
filas.forEach(r=>{t+='\\n['+r.querySelector('.t').textContent.trim()+'] '+r.querySelector('.g p').textContent+'\\n  → '+(r.querySelector('select').value||'SIN DECIDIR')+': '+r.querySelector('.c').innerText.trim()+'\\n  especial: '+r.querySelector('.esp input').value});
const ok=()=>{e.target.textContent='Copiado';setTimeout(()=>e.target.textContent='Copiar plan',1500)};
const plano=()=>{const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;left:5%%;top:15%%;width:90%%;height:60%%;z-index:99;padding:14px;font:15px/1.4 sans-serif';document.body.appendChild(a);a.select();let h=false;try{h=document.execCommand('copy')}catch(x){}
if(h){a.remove();ok()}else{e.target.textContent='Selecciona el texto y copia (Cmd+C)';a.onblur=()=>{a.remove();e.target.textContent='Copiar plan'}}};
if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(ok,plano);else plano()};pinta();</script></html>''' % dict(
    t=E(tit), d=total, n=len(filas), r=''.join(fila_html(f) for f in filas), P=json.dumps(paletas, ensure_ascii=False), L=json.dumps(LETRAS, ensure_ascii=False), k=json.dumps(tit, ensure_ascii=False))
open(os.path.join(o.salida, 'plan.html'), 'w', encoding='utf-8').write(H)
print('%d líneas · %.1f s · %d paletas → %s' % (len(filas), total, len(paletas), os.path.join(o.salida, 'plan.html')))
