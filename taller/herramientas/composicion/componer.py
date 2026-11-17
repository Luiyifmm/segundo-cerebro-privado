"""componer.py — PROPONE dónde colocar imágenes o gráficos junto a la persona (Vision de Apple, sin instalar nada). No aplica nada.

Uso:
  python3 componer.py <video|imagen> --t 1.2,3.4 [--t …] --caja 310x465 [--n 1] [--subs 0.40-0.50] [--hoja salida.png] [--json salida.json]
  - Analiza cada instante (y ±0,3 s alrededor para cazar el gesto) con `sujeto` (cara, cuerpo, manos, silueta).
  - Reglas duras: dentro de la zona segura (x 70–1010, y 250–1620 en 1080×1920, proporcional), sin pisar la cara (+40 px) ni la franja de subtítulos.
  - Si Amin SEÑALA (índice extendido y los demás dedos recogidos), premia las posiciones en la dirección del dedo, a 80–520 px
    de la punta y algo por encima de ella («que parezca que la señala»). Si no hay gesto fiable, NO inventa: composición equilibrada
    a la altura de los ojos o algo más arriba, junto a la cabeza, y lo marca «REVISAR (sin gesto)».
  - Penaliza tapar el cuerpo (ocupación de la silueta) y alejarse de la cabeza.
Salida: por instante, las 3 mejores cajas [x0,y0,x1,y1] con su motivo, y una hoja visual con cara (rojo), silueta (gris), dedo (amarillo),
subtítulos (azul) y propuestas (verde = 1.ª, blanco = otras).
"""
import argparse, json, math, os, subprocess, sys, tempfile
AQUI = os.path.dirname(os.path.abspath(__file__)); FF = os.path.expanduser("~/.local/bin/ffmpeg")
a = argparse.ArgumentParser(); a.add_argument("fuente"); a.add_argument("--t", action="append", default=[]); a.add_argument("--caja", default="310x465")
a.add_argument("--n", type=int, default=1); a.add_argument("--subs", default="0.40-0.50"); a.add_argument("--hoja", default=""); a.add_argument("--json", default="")
a.add_argument("--ancho", type=int, default=1080)
o = a.parse_args()
CW, CH = [int(v) for v in o.caja.lower().split("x")]
tiempos = [float(x) for g in o.t for x in g.split(",") if x.strip()] or [0.0]
tmp = tempfile.mkdtemp(prefix="componer-")
def fotograma(t, ruta):
    if o.fuente.lower().endswith((".png", ".jpg", ".jpeg")): return o.fuente
    subprocess.run([FF, "-nostdin", "-v", "error", "-y", "-ss", f"{max(0,t):.3f}", "-i", o.fuente, "-frames:v", "1", "-vf", f"scale={o.ancho}:-2", ruta], check=True); return ruta
def analizar(rutas):
    r = subprocess.run([os.path.join(AQUI, "sujeto")] + rutas, capture_output=True, text=True)
    return [json.loads(l) for l in r.stdout.splitlines() if l.strip()]
def cara_principal(d):
    cs = sorted(d["caras"], key=lambda c: -(c["caja"][2]-c["caja"][0])*(c["caja"][3]-c["caja"][1]))
    return cs[0]["caja"] if cs else None
def solapa(A, B, m=0):
    return not (A[2] + m <= B[0] or B[2] + m <= A[0] or A[3] + m <= B[1] or B[3] + m <= A[1])
resultados = []
for t in tiempos:
    rutas = [fotograma(t + dt, os.path.join(tmp, f"f{t:.2f}_{i}.png")) for i, dt in enumerate([0, -0.3, 0.3])]
    D = analizar(rutas); d = D[0]; W, H = d["w"], d["h"]; k = W / 1080
    SX0, SX1, SY0, SY1 = 70*k, 1010*k, 250*k*(1920/1920), 1620*(H/1920)
    s0, s1 = [float(v) for v in o.subs.split("-")]; SUB = [0, s0*H, W, s1*H]
    cara = cara_principal(d)
    # gesto FIABLE: índice extendido (resto recogido) + mano levantada por encima de los hombros o brazo separado del torso,
    # y visto en al menos 2 de los 3 fotogramas (instante y ±0,3 s) con la misma dirección. Si no, no hay gesto (no se inventa).
    def valido(dd, m):
        if not (m["apunta"] and m["indice_punta"] and m["conf"] >= 0.6): return False
        c = dd["cuerpo"]; hs = [c[j] for j in ("left_shoulder_1_joint", "right_shoulder_1_joint") if j in c]
        tx, ty = m["indice_punta"]; wx, wy = m["muneca"]
        cf = cara_principal(dd)
        if cf:   # si el rayo del dedo entra en su propia cara en < 300 px, se está señalando a sí mismo: no es un destino
            vx, vy = m["apunta"]; mg = 0.25 * (cf[2] - cf[0])
            for paso in range(0, 300, 10):
                px, py = tx + vx*paso, ty + vy*paso
                if cf[0]-mg <= px <= cf[2]+mg and cf[1]-mg <= py <= cf[3]+mg: return False
        if len(hs) == 2:
            hy = min(h[1] for h in hs); cxs = (hs[0][0] + hs[1][0]) / 2; anch = abs(hs[0][0] - hs[1][0]) or 1
            return ty < hy or abs(wx - cxs) > 0.75 * anch
        cara0 = cara_principal(dd)
        return bool(cara0) and ty < cara0[3]
    vistos = [[m for m in dd["manos"] if valido(dd, m)] for dd in D]
    gesto, origen = None, None
    for i, ms in enumerate(vistos):
        for m in ms:
            iguales = sum(1 for ms2 in vistos for m2 in ms2 if m2["apunta"][0]*m["apunta"][0] + m2["apunta"][1]*m["apunta"][1] > 0.8)
            if iguales >= 2 or (len(D) == 1):
                gesto, origen = m, ["instante", "−0,3 s", "+0,3 s"][i] + f" ({iguales}/{len(D)})"; break
        if gesto: break
    MANO = None
    if gesto:
        (tx_, ty_), (wx_, wy_) = gesto["indice_punta"], gesto["muneca"]
        MANO = [min(tx_, wx_) - 40*k, min(ty_, wy_) - 40*k, max(tx_, wx_) + 40*k, max(ty_, wy_) + 40*k]
    sil = d.get("silueta") or {}; occ = sil.get("ocupacion")
    def ocupacion(B):
        if not occ: return 0
        GY, GX = len(occ), len(occ[0]); s = n = 0
        for gy in range(GY):
            for gx in range(GX):
                cx, cy = (gx+.5)*W/GX, (gy+.5)*H/GY
                if B[0] <= cx <= B[2] and B[1] <= cy <= B[3]: s += occ[gy][gx]; n += 1
        return s / n if n else 0
    def buscar(esc):
     cw, ch = CW*k*esc, CH*k*esc; cands = []
     paso = int(20*k)
     for x0 in range(int(SX0), int(SX1 - cw) + 1, paso):
         for y0 in range(int(SY0), int(SY1 - ch) + 1, paso):
             B = [x0, y0, x0+cw, y0+ch]
             if cara and solapa(B, cara, 40*k): continue
             if cara and solapa(B, [cara[0], cara[1] - 0.45*(cara[3]-cara[1]), cara[2], cara[1]], 20*k): continue   # el pelo también
             if solapa(B, SUB): continue
             if gesto and solapa(B, MANO, 30*k): continue   # nunca tapar la mano que señala
             cx, cy = x0 + cw/2, y0 + ch/2; motivo = []
             sc = -2.0 * ocupacion(B); 
             if cara:
                 fx, fy = (cara[0]+cara[2])/2, (cara[1]+cara[3])/2; fh = cara[3]-cara[1]
                 dist = math.hypot(cx-fx, cy-fy) / W; sc -= 1.2 * dist
                 sc -= 0.8 * abs((cy - (fy - 0.6*fh)) / H) * 3   # centro de la imagen algo por encima de los ojos
             if gesto:
                 tx, ty = gesto["indice_punta"]; vx, vy = gesto["apunta"]
                 dx, dy = cx - tx, cy - ty; L = math.hypot(dx, dy) or 1
                 cosang = (dx*vx + dy*vy) / L
                 lejos = L / k
                 perp = abs(dx*vy - dy*vx) / k                              # distancia lateral al rayo del dedo
                 sc += 2.5 * max(0, cosang) ** 4 + (0.8 if 80 <= lejos <= 560 else -0.6) - 1.5 * perp / 1080
                 if y0 + ch*0.5 < ty: sc += 0.4                       # un poco por encima de la punta del dedo
                 if vy < -0.5 and y0 + ch <= ty: sc += 0.6                 # señala hacia arriba: la tarjeta entera por encima del dedo
                 motivo.append(f"en la dirección del dedo (cos {cosang:.2f}, {lejos:.0f} px)")
             else:
                 motivo.append("REVISAR (sin gesto fiable): composición equilibrada junto a la cabeza")
             cands.append((sc, [round(v) for v in B], "; ".join(motivo)))
     cands.sort(key=lambda c: -c[0]); return cands
    def coseno(c):
        try: return float(c[2].split("cos ")[1].split(",")[0])
        except Exception: return 0.0
    cands, reserva = [], []
    for e in (1.0, 0.9, 0.8, 0.7, 0.6):
        c2 = buscar(e)
        if not c2: continue
        nota = "" if e == 1.0 else f"; tarjeta al {int(e*100)} % para caber"
        if not gesto or coseno(c2[0]) >= 0.9:
            cands = [(c[0], c[1], c[2] + nota) for c in c2]; break
        if not reserva: reserva = [(c[0], c[1], c[2] + nota + "; REVISAR: no cabe bien donde señala") for c in c2]
    if not cands: cands = reserva or []
    if not cands: print("   SIN SITIO: ninguna posición cumple cara, mano, subtítulos y zona segura ni al 60 %. REVISAR (abrir plano)")
    elegidos = []
    for c in cands:
        if all(not solapa(c[1], e[1], 20*k) for e in elegidos): elegidos.append(c)
        if len(elegidos) >= max(3, o.n): break
    resultados.append({"t": t, "img": rutas[0], "w": W, "h": H, "cara": cara, "silueta": sil.get("caja"),
        "gesto": ({"mano": gesto["lado"], "punta": gesto["indice_punta"], "direccion": gesto["apunta"], "visto_en": origen} if gesto else None),
        "propuestas": [{"caja": c[1], "puntos": round(c[0], 2), "motivo": c[2]} for c in elegidos[:3]]})
    g = resultados[-1]["gesto"]
    print(f"t={t:6.2f}s  cara={cara}  gesto={'SÍ '+str(g['direccion'])+' ('+g['visto_en']+')' if g else 'no (REVISAR)'}")
    for i, p in enumerate(resultados[-1]["propuestas"]): print(f"   {i+1}. caja {p['caja']}  ·  {p['motivo']}")
if o.json: json.dump(resultados, open(o.json, "w"), ensure_ascii=False, indent=1)
if o.hoja:
    piezas = []
    for i, r in enumerate(resultados):
        dib = []
        def caja(B, c, t=4): dib.append(f"drawbox=x={B[0]:.0f}:y={B[1]:.0f}:w={B[2]-B[0]:.0f}:h={B[3]-B[1]:.0f}:color={c}:t={t}")
        caja([0, float(o.subs.split('-')[0])*r['h'], r['w'], float(o.subs.split('-')[1])*r['h']], "blue@0.5", 3)
        if r["silueta"]: caja(r["silueta"], "gray@0.6", 2)
        if r["cara"]: caja(r["cara"], "red", 5)
        for j, p in reversed(list(enumerate(r["propuestas"]))): caja(p["caja"], "lime" if j == 0 else "white@0.7", 8 if j == 0 else 3)
        if r["gesto"]:
            tx, ty = r["gesto"]["punta"]; vx, vy = r["gesto"]["direccion"]
            for s in range(0, 260, 26): dib.append(f"drawbox=x={tx+vx*s-7:.0f}:y={ty+vy*s-7:.0f}:w=14:h=14:color=yellow:t=fill")
        out = os.path.join(tmp, f"h{i}.png")
        subprocess.run([FF, "-nostdin", "-v", "error", "-y", "-i", r["img"], "-vf", ",".join(dib + ["scale=360:-2"]), out], check=True); piezas.append(out)
    lista = os.path.join(tmp, "l.txt"); open(lista, "w").write("".join(f"file '{p}'\n" for p in piezas))
    subprocess.run([FF, "-nostdin", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lista, "-vf", f"tile={len(piezas)}x1", "-frames:v", "1", o.hoja], check=True)
    print("hoja:", o.hoja)
