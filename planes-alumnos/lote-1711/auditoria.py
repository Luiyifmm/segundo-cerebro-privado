# Genera auditoria.html (local, sin tokens) a partir de auditoria.json.
# Cada vídeo: reproductor (MP4 de MEDIA), hoja de fotogramas, lo que pidió el alumno, decisiones con «Vale / Cambiar» + nota, y lo no comprobado.
# Botón «Copiar correcciones»: Markdown con solo lo marcado «Cambiar» o con nota, listo para pegar en el chat.
# Uso: python3 auditoria.py [auditoria.json] -> auditoria.html junto al json
import json, os, sys, html, unicodedata
from urllib.parse import quote
SRC = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'auditoria.json'))
D = json.load(open(SRC)); AQUI = os.path.dirname(SRC)
e = html.escape
def rel(p): return quote(unicodedata.normalize('NFC', os.path.relpath(os.path.expanduser(p), AQUI)))

tarjetas = []
for v in D['videos']:
    filas = ''.join(f'''<tr data-v="{e(v['clave'])}" data-i="{k}"><td class="z">{e(d['zona'])}</td><td>{e(d['que'])}<div class="pq">{e(d.get('porque', ''))}</div></td>
      <td class="b"><label><input type="radio" name="{e(v['clave'])}-{k}" value="ok">Vale</label><label><input type="radio" name="{e(v['clave'])}-{k}" value="cambiar">Cambiar</label>
      <textarea placeholder="qué harías tú"></textarea></td></tr>''' for k, d in enumerate(v['decisiones']))
    nv = ''.join(f'<li>{e(x)}</li>' for x in v.get('no_verificado', []))
    src_ = v.get('video_local') or rel(v["video"]); vid = f'<div><video controls playsinline preload="metadata" src="{e(src_)}"></video><a class="abrir" href="{e(src_)}" target="_blank">Abrir vídeo ↗</a></div>' if v.get('video') else '<div class="sin">Sin vídeo nuevo</div>'
    hoja = f'<a href="{e(rel(v["hoja"]))}" target="_blank"><img src="{e(rel(v["hoja"]))}" loading="lazy"></a>' if v.get('hoja') else ''
    p = v.get('panel') or {}; ctx = ''
    if p:
        g = p.get('guion') or {}
        import re as _re; g = {k: _re.sub(r'\n\s*\n', '\n', t) for k, t in g.items()}
        gu = ''.join(f'<p><b>{e(k.capitalize())}:</b> {e(t)}</p>' for k, t in g.items())
        fil = [('Título completo en el dashboard', p.get('titulo_panel')), ('Nota del alumno', p.get('nota_alumno')), ('Correcciones pedidas', p.get('correcciones'))]
        ctx = f'''<div class="ctx"><div class="dash"><b>Dashboard Trainer10x:</b> pestaña <b>{e(p.get('pestaña', ''))}</b> · v{e(str(p.get('version', '')))} · último: {e(p.get('ultimo', ''))}
          <div class="pq">{'La versión del dashboard es la del editor automático, NO esta de la auditoría (esta no se ha subido).' if not p.get('es_nuestra') else 'Esta versión es la que está en el dashboard.'}</div></div>
          {''.join(f'<p><b>{e(t)}:</b> {e(x)}</p>' for t, x in fil if x)}
          {f'<details open><summary><b>Guion</b></summary>{gu}</details>' if gu else '<p class="pq">Sin guion asociado en el dashboard (el pedido va en el título).</p>'}
          {f'<details><summary>Respuesta que ve el alumno en el dashboard (editor automático)</summary><p>{e(p.get("respuesta_panel"))}</p></details>' if p.get('respuesta_panel') else ''}</div>'''
    tarjetas.append(f'''<section id="{e(v['clave'])}"><h2>{e(v['alumno'])} · {e(v['titulo'])} <span class="est {e(v.get('estado_clase', ''))}">{e(v.get('estado', ''))}</span></h2>
      <div class="meta">{e(v.get('meta', ''))}</div>
      <div class="pedido"><b>Pidió el alumno:</b> {e(v.get('pedido', '—'))}</div>{ctx}
      <div class="media">{vid}{hoja}</div>
      <table><tr><th>Zona</th><th>Qué hice y por qué</th><th>Tu veredicto</th></tr>{filas}</table>
      <div class="nv"><b>No comprobado</b><ul>{nv}</ul></div>
      <label class="gen">Nota general de este vídeo<textarea data-gen="{e(v['clave'])}"></textarea></label></section>''')
indice = ''.join(f'<a href="#{e(v["clave"])}">{e(v["alumno"].split(" (")[0])} · {e(v["titulo"])}</a>' for v in D['videos'])
fuera = ''.join(f'<li>{e(x)}</li>' for x in D.get('fuera', []))
pagina = f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Auditoría lote {e(D['fecha'])}</title><style>
:root{{--bg:#f6f5f2;--tx:#1b1b1d;--mu:#6b6b70;--li:#e3e1dc;--ca:#fff;--ac:#2f6fed}}
@media (prefers-color-scheme:dark){{:root{{--bg:#151517;--tx:#ececee;--mu:#9a9aa1;--li:#2c2c30;--ca:#1d1d20;--ac:#7aa2ff}}}}
body{{margin:0;background:var(--bg);color:var(--tx);font:15px/1.45 -apple-system,system-ui,sans-serif}}
header{{position:sticky;top:0;background:var(--bg);border-bottom:1px solid var(--li);padding:12px 16px;z-index:2;display:flex;gap:12px;align-items:center;flex-wrap:wrap}}
header h1{{font-size:17px;margin:0;flex:1}} button{{font:inherit;padding:8px 14px;border-radius:8px;border:0;background:var(--ac);color:#fff;cursor:pointer}}
nav{{display:flex;flex-wrap:wrap;gap:6px;padding:10px 16px}} nav a{{font-size:13px;color:var(--ac);text-decoration:none;border:1px solid var(--li);border-radius:20px;padding:3px 10px}}
main{{max-width:1200px;margin:0 auto;padding:0 16px 80px}} section{{background:var(--ca);border:1px solid var(--li);border-radius:14px;padding:16px;margin:18px 0}}
h2{{font-size:18px;margin:0 0 4px}} .meta{{color:var(--mu);font-size:13px}} .pedido{{margin:10px 0;padding:8px 10px;border-left:3px solid var(--ac);background:var(--bg);border-radius:6px}}
.media{{display:grid;grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:12px;align-items:start}} video{{width:100%;border-radius:10px;background:#000;aspect-ratio:9/16}}
.media img{{width:100%;border-radius:8px}} @media (max-width:760px){{.media{{grid-template-columns:1fr}}}}
table{{width:100%;border-collapse:collapse;margin-top:12px;font-size:14px}} th,td{{text-align:left;vertical-align:top;padding:8px;border-top:1px solid var(--li)}}
td.z{{white-space:nowrap;color:var(--mu);font-size:13px}} .pq{{color:var(--mu);font-size:13px;margin-top:2px}} td.b{{width:34%}} td.b label{{margin-right:10px;white-space:nowrap}}
textarea{{width:100%;box-sizing:border-box;min-height:34px;margin-top:4px;font:inherit;font-size:13px;background:var(--bg);color:var(--tx);border:1px solid var(--li);border-radius:6px;padding:5px}}
.nv{{margin-top:10px;font-size:13px;color:var(--mu)}} .gen{{display:block;margin-top:10px;font-size:13px}} .est{{font-size:12px;font-weight:500;border-radius:12px;padding:2px 8px;background:var(--li)}}
.abrir{{display:inline-block;margin-top:6px;font-size:13px;color:var(--ac)}} .sin{{padding:40px;text-align:center;color:var(--mu);border:1px dashed var(--li);border-radius:10px}} .fuera{{font-size:14px}} .ctx{{font-size:14px;margin:8px 0 12px;padding:8px 12px;border:1px solid var(--li);border-radius:8px}} .ctx p{{margin:6px 0;white-space:pre-wrap}} .dash{{padding:6px 0;border-bottom:1px solid var(--li)}} details{{margin:6px 0}} summary{{cursor:pointer}}
</style></head><body><header><h1>Auditoría · lote {e(D['fecha'])} · {len(D['videos'])} vídeos</h1><span id="n" class="meta"></span><button id="copiar">Copiar correcciones</button></header>
<nav>{indice}</nav><main><section class="fuera"><h2>Cómo usarla</h2><p>{e(D.get('intro', ''))}</p><b>Fuera del lote (no editados) y por qué</b><ul>{fuera}</ul></section>{''.join(tarjetas)}</main>
<script>
const K='aud-{e(D['fecha'])}';let st={{}};try{{st=JSON.parse(localStorage.getItem(K)||'{{}}')}}catch(e){{}}
const guarda=()=>{{try{{localStorage.setItem(K,JSON.stringify(st))}}catch(e){{}};cuenta()}};
document.querySelectorAll('tr[data-v]').forEach(tr=>{{const id=tr.dataset.v+'-'+tr.dataset.i,s=st[id]||{{}};
 tr.querySelectorAll('input').forEach(r=>{{if(s.v===r.value)r.checked=true;r.onchange=()=>{{st[id]={{...st[id],v:r.value}};guarda()}}}});
 const t=tr.querySelector('textarea');t.value=s.n||'';t.oninput=()=>{{st[id]={{...st[id],n:t.value}};guarda()}}}});
document.querySelectorAll('textarea[data-gen]').forEach(t=>{{const id='gen-'+t.dataset.gen;t.value=(st[id]||{{}}).n||'';t.oninput=()=>{{st[id]={{n:t.value}};guarda()}}}});
function cuenta(){{const n=Object.values(st).filter(x=>x.v==='cambiar'||(x.n||'').trim()).length;document.getElementById('n').textContent=n+' correcciones'}}cuenta();
document.getElementById('copiar').onclick=()=>{{let md='# Correcciones lote {e(D['fecha'])}\\n';
 document.querySelectorAll('section[id]').forEach(sec=>{{const v=sec.id;let b='';
  sec.querySelectorAll('tr[data-v]').forEach(tr=>{{const s=st[v+'-'+tr.dataset.i]||{{}};if(s.v==='cambiar'||(s.n||'').trim())b+='- ['+tr.querySelector('.z').textContent+'] '+tr.children[1].childNodes[0].textContent.trim()+' → '+(s.v==='cambiar'?'CAMBIAR':'vale')+((s.n||'').trim()?': '+s.n.trim():'')+'\\n'}});
  const g=(st['gen-'+v]||{{}}).n;if(g&&g.trim())b+='- General: '+g.trim()+'\\n';
  if(b)md+='\\n## '+sec.querySelector('h2').childNodes[0].textContent.trim()+' ('+v+')\\n'+b}});
 navigator.clipboard.writeText(md).then(()=>{{document.getElementById('copiar').textContent='Copiado ✓';setTimeout(()=>document.getElementById('copiar').textContent='Copiar correcciones',1500)}})}};
</script></body></html>'''
open(os.path.join(AQUI, 'auditoria.html'), 'w').write(pagina); print('ok', os.path.join(AQUI, 'auditoria.html'))
