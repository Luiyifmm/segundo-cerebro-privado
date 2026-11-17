# Genera auditoria.html: la reedición v1 de Claude frente a la v1 del motor, escena por escena, con casillas para las correcciones de Luis.
import json, os, html
from urllib.parse import quote
A = os.path.dirname(os.path.abspath(__file__))
E = html.escape
VID_NEW = '../../../MEDIA/' + quote('Álvaro Cabrera/Álvaro - reedición Claude v1.mp4')
VID_OLD = '../../../MEDIA/' + quote('Álvaro Cabrera/Álvaro - editado por el motor (v1).mp4')
OK, MI, FA, NV = 'ok', 'mirar', 'falla', 'nv'
ESC = [
 dict(n='Lunes · mesa con baguette', t='0,0–2,2 s', antes=['v_1.6'], ahora=['n_1.6'],
      hice='Las dos tomas superpuestas: el cliente sentado a la izquierda y el entrenador de pie a la derecha, en el mismo cuadro (máscara estática al 60 % del ancho). «PAN» en Sequel Heavy roja (#FF5F57). Arriba, la semana: LUN se enciende y se tacha con ✕ al terminar la frase.',
      porque='Es lo que pidió el alumno: los dos personajes juntos. La semana cuenta el sketch sin añadir texto (banco c012).',
      checks=[(OK, 'Se ve a los dos con la cara dentro del cuadro (la v1 enseñaba una pared vacía)'), (OK, 'Golpe grave en «nada»: medido a −2 ms'), (MI, 'Continuidad del pan en la unión: mirado en 1 fotograma, no en movimiento')]),
 dict(n='Martes · mesa con croissant', t='2,2–5,5 s', antes=['v_3.0', 'v_4.3'], ahora=['n_2.9', 'n_3.6', 'n_5.2'],
      hice='Misma mesa, ahora con el croissant. En «chocolate», la pintura de pan y chocolate 0,75 s con «CHOCOLATE» en rojo (le borré el subtítulo que traía de la v1). Vuelve a la escena y el cliente dice «¿Cómo me voy a poner?» con un zoom al 130 % hacia su cara.',
      porque='La pintura ya no tapa la reacción (fallo de la v1). El zoom era la promesa incumplida del motor y es la reacción más cómica.',
      checks=[(OK, 'Zoom hacia la cara del cliente'), (OK, 'El audio de cada frase sale de la toma de quien habla'), (MI, 'Queda una mancha leve en la pintura donde estaba el texto'), (NV, 'Si el zoom tiembla: solo he visto fotogramas')]),
 dict(n='Miércoles · puerta', t='5,5–10,1 s', antes=['v_7.6', 'v_9.8'], ahora=['n_7.6', 'n_9.6'],
      hice='Entrenador de pie a la izquierda con la libreta; cliente sentado a la derecha con el móvil (máscara al 40 %). «salir a cenar» en rojo; «Les digo que NO» con el NO grande en blanco.',
      porque='En la v1 esta escena era una puerta sin nadie a la vista.',
      checks=[(OK, 'Los dos en cuadro'), (MI, 'Se intuye una franja más clara en la unión'), (OK, 'MIÉ se tacha justo antes del «no» del cliente')]),
 dict(n='Jueves · sofá', t='10,1–13,2 s', antes=['v_11.8', 'v_13.9'], ahora=['n_11.5', 'n_12.6'],
      hice='Entrenador de pie detrás del sofá; cliente delante comiendo la manzana (máscara solo en la parte delantera y la gorra; +0,4 EV a su toma porque el sol era distinto). «MANZANA» en el azul de su marca y JUE se marca con ✓. «Muy bien» viene de otra toma del entrenador.',
      porque='Es el único día que hace bien: el ✓ azul lo distingue de los tres ✕.',
      checks=[(OK, 'Luz de las dos tomas igualada'), (MI, 'Salto en la mitad del entrenador a 12,3 s al cambiar de toma para «Muy bien»'), (MI, 'Halo leve en el borde del respaldo')]),
 dict(n='Cocina · el cliente en la nevera', t='13,2–15,7 s', antes=['v_14.6'], ahora=['n_13.6'],
      hice='Plano solo del cliente con gorra abriendo la nevera. Sin texto. La semana sigue arriba (✕ ✕ ✕ ✓).',
      porque='Prepara el remate: el «día bueno» no lo era tanto.',
      checks=[(MI, '2,5 s sin texto ni gráfico: puede no entenderse que está picando a escondidas'), (NV, 'No hay cartel de hora («Jueves, 23:47»); sería una idea mía, no estaba en el plan')]),
 dict(n='Remate · «¿Pero qué haces?»', t='15,7–19,1 s', antes=['v_15.5', 'v_16.6'], ahora=['n_17.0', 'n_18.9'],
      hice='El entrenador en la puerta de la cocina. Al decir «haces», el ✓ azul del jueves se vuelve ✕ rojo con golpe grave. Después, el botón «Seguir → Siguiendo».',
      porque='El cambio del ✓ al ✕ es el chiste en un gesto (idea mía, fuera del plan). El botón va después del remate, no encima.',
      checks=[(OK, 'Golpe y ✕ a la vez (medido a +25 ms)'), (MI, 'El botón dura solo 0,95 s; el vídeo se acaba con la frase'), (MI, 'En el último segundo el entrenador camina hacia cámara')]),
]
GLOBAL = [
 (OK, 'Encuadre: se ve a quien habla en todo el vídeo', 'La v1 tenía 9 de 17 s sin persona'),
 (OK, 'Los dos personajes en el mismo cuadro', 'Mesa, puerta y sofá'),
 (OK, 'Dos familias de letra', 'SF Pro + Sequel Heavy (la v1, tres)'),
 (OK, 'Color de su marca', 'Rojo #FF5F57 lo prohibido, azul #3A86FF la manzana (decidido por Luis)'),
 (OK, 'Volumen', '−14,6 LUFS, pico real −1,3 dB, sin saturación'),
 (OK, 'Efectos al fotograma', '15 efectos; el 80 % cae a menos de 40 ms de su momento (mediana 10 ms)'),
 (FA, 'Huecos de sonido', '8 huecos de 0,3–1,2 s a −42/−56 LUFS: es la sala del propio bruto, pero muy baja. Prometí rellenarlos y no lo hice'),
 (NV, 'Música', 'Sin música: la eliges tú'),
 (OK, 'Duración', '19,1 s (la v1, 17,1 s)'),
 (NV, 'Velocidad real', 'No puedo ver el vídeo en movimiento: uniones, temblores y halos solo los he mirado en fotogramas'),
]
B = {OK: ('OK', '#1f9d55'), MI: ('Mirar', '#c98a00'), FA: ('Falla', '#d64545'), NV: ('No verificado', '#6d6a60')}
badge = lambda k: '<span class="b" style="background:%s">%s</span>' % (B[k][1], B[k][0])
imgs = lambda l: ''.join('<img src="img/%s.jpg" alt="">' % x for x in l)
esc = ''.join('''<section class="esc" data-n="%s"><div class="cab"><h3>%d · %s</h3><span class="t">%s</span></div>
<div class="cmp"><div><div class="lb">Antes · motor v1</div><div class="im">%s</div></div><div><div class="lb">Ahora · Claude v1</div><div class="im">%s</div></div></div>
<p><b>Qué hice.</b> %s</p><p><b>Por qué.</b> %s</p><ul>%s</ul>
<label class="co">¿Qué mejorarías aquí?<textarea placeholder="Ej.: la unión se nota, mueve el texto, quita la pintura…"></textarea></label></section>''' % (
    E(e['n']), i + 1, E(e['n']), E(e['t']), imgs(e['antes']), imgs(e['ahora']), E(e['hice']), E(e['porque']), ''.join('<li>%s %s</li>' % (badge(k), E(x)) for k, x in e['checks'])) for i, e in enumerate(ESC))
glob = ''.join('<tr><td>%s</td><td><b>%s</b></td><td>%s</td></tr>' % (badge(k), E(a), E(b)) for k, a, b in GLOBAL)
n_ok = sum(1 for k, *_ in GLOBAL if k == OK)
H = '''<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Auditoría · Álvaro v1</title><style>
:root{--f:#f5f4f0;--p:#fff;--x:#16150f;--m:#6d6a60;--l:#dedbd2;--az:#3A86FF;--r:#FF5F57}
@media(prefers-color-scheme:dark){:root{--f:#12110d;--p:#1b1a15;--x:#f1efe8;--m:#a09c90;--l:#34322a}}
*{box-sizing:border-box}body{background:var(--f);color:var(--x);font:16px/1.5 Inter,-apple-system,sans-serif;margin:0;padding:28px 18px 90px}main{max-width:1100px;margin:auto}
h1{font-size:32px;letter-spacing:-.02em;margin:0}h1 span{color:var(--m);font-weight:400}.in{color:var(--m);margin:6px 0 20px}
h2{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--m);margin:28px 0 10px}
.card{background:var(--p);border:1px solid var(--l);border-radius:14px;padding:18px;margin-bottom:12px}
.vids{display:grid;grid-template-columns:1fr 1fr;gap:16px}.vids video{width:100%%;border-radius:12px;background:#000;max-height:70vh}.vids .lb{margin-bottom:6px}
.look{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.sw b{display:block;height:64px;border-radius:10px;border:1px solid #0002}.sw small{color:var(--m)}
.fx{display:flex;gap:28px;align-items:baseline;flex-wrap:wrap}.fx .a{font-family:-apple-system,"SF Pro Display";font-weight:700;font-size:28px}.fx .b2{font-family:"Sequel Sans","Sequel Sans Heavy Disp";font-weight:900;font-size:44px;color:var(--r)}
table{width:100%%;border-collapse:collapse}td{padding:9px 8px;border-top:1px solid var(--l);vertical-align:top;font-size:15px}
.b{display:inline-block;color:#fff;font-size:12px;font-weight:700;padding:2px 9px;border-radius:999px;margin-right:6px;white-space:nowrap}
.esc{background:var(--p);border:1px solid var(--l);border-radius:14px;padding:18px;margin-top:14px}.cab{display:flex;justify-content:space-between;align-items:baseline;gap:10px}.cab h3{margin:0;font-size:21px}.t{color:var(--m);font-size:14px}
.cmp{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:12px 0}.lb{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--m);margin-bottom:6px}.im{display:flex;gap:6px}.im img{width:100%%;max-width:150px;border-radius:8px;display:block}
ul{padding-left:0;list-style:none;margin:10px 0}li{margin:5px 0}
.co{display:block;font-weight:600;margin-top:10px}.co textarea{display:block;width:100%%;min-height:74px;margin-top:6px;border:1.5px dashed var(--l);border-radius:10px;padding:10px;background:transparent;color:var(--x);font:inherit}
.co textarea:focus{outline:2px solid var(--az);border-color:transparent}
#bar{position:sticky;top:0;z-index:5;background:var(--f);padding:10px 0;border-bottom:1px solid var(--l);display:flex;gap:14px;align-items:center;flex-wrap:wrap}
button{padding:9px 16px;border-radius:999px;border:0;background:var(--x);color:var(--f);font:inherit;font-weight:600;cursor:pointer}
@media(max-width:760px){.vids,.cmp{grid-template-columns:1fr}.look{grid-template-columns:1fr 1fr}}</style><main>
<h1>Álvaro · lunes nada de pan <span>· Auditoría v1</span></h1>
<p class="in">Reedición de Claude frente a la versión del motor. Escribe en cada escena qué mejorarías; al final pulsa «Copiar correcciones» y pégamelo. Cada corrección la guardo como propuesta de regla y en el banco de criterio.</p>
<div id="bar"><span><b>%(nok)d</b> de %(ng)d comprobaciones generales en OK</span><button id="cp">Copiar correcciones</button></div>
<h2>El vídeo</h2><div class="card vids"><div><div class="lb">Ahora · Claude v1 (19,1 s)</div><video controls playsinline src="%(vn)s"></video></div><div><div class="lb">Antes · motor v1 (17,1 s)</div><video controls playsinline src="%(vo)s"></video></div></div>
<h2>El aspecto</h2><div class="card"><div class="look">
<div class="sw"><b style="background:#FF5F57"></b><span>Rojo de su marca</span><br><small>#FF5F57 · lo prohibido, ✕</small></div>
<div class="sw"><b style="background:#3A86FF"></b><span>Azul de su marca</span><br><small>#3A86FF · la manzana, ✓</small></div>
<div class="sw"><b style="background:#ffffff"></b><span>Blanco</span><br><small>texto y semana encendida</small></div>
<div class="sw"><b style="background:#0e0f14"></b><span>Negro</span><br><small>semana apagada, botón</small></div></div>
<p class="fx" style="margin-top:14px"><span class="a">SF Pro Bold · relleno</span><span class="b2">PAN</span><span style="color:var(--m)">Sequel Heavy · palabra especial</span></p></div>
<h2>Comprobaciones generales</h2><div class="card"><table>%(glob)s</table>
<label class="co" data-n="General">¿Qué mejorarías en general (ritmo, sonido, color, letras)?<textarea placeholder="Ej.: más rápido, música X, la semana más grande…"></textarea></label></div>
<h2>Escena por escena</h2>%(esc)s
</main><script>
const K='auditoria-alvaro-v1',ta=[...document.querySelectorAll('textarea')];
try{const g=JSON.parse(localStorage.getItem(K)||'[]');ta.forEach((t,i)=>{if(g[i])t.value=g[i]})}catch(e){}
document.addEventListener('input',()=>{try{localStorage.setItem(K,JSON.stringify(ta.map(t=>t.value)))}catch(e){}});
document.getElementById('cp').onclick=e=>{let s='CORRECCIONES · Auditoría Álvaro v1\\n';
document.querySelectorAll('[data-n]').forEach(el=>{const t=el.querySelector('textarea');if(t&&t.value.trim())s+='\\n['+el.dataset.n+'] '+t.value.trim()});
if(s.split('\\n').length<3)s+='\\n(sin correcciones)';const ok=()=>{e.target.textContent='Copiado';setTimeout(()=>e.target.textContent='Copiar correcciones',1500)};
const plan=()=>{const a=document.createElement('textarea');a.value=s;a.style.cssText='position:fixed;left:5%%;top:15%%;width:90%%;height:60%%;z-index:9;padding:14px;font:15px/1.4 sans-serif';document.body.appendChild(a);a.select();let h=false;try{h=document.execCommand('copy')}catch(x){}
if(h){a.remove();ok()}else{e.target.textContent='Selecciona el texto y copia (Cmd+C)';a.onblur=()=>{a.remove();e.target.textContent='Copiar correcciones'}}};
if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(s).then(ok,plan);else plan()};
</script></html>''' % dict(nok=n_ok, ng=len(GLOBAL), vn=VID_NEW, vo=VID_OLD, glob=glob, esc=esc)
open(os.path.join(A, 'auditoria.html'), 'w', encoding='utf-8').write(H)
json.dump(dict(escenas=ESC, general=GLOBAL), open(os.path.join(A, 'auditoria.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok', os.path.join(A, 'auditoria.html'))
