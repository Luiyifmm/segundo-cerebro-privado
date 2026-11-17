"""encuadre.py — propone encuadres 9:16 medidos sobre la cara/hombros (NO toca Premiere; solo calcula y previsualiza).

Uso: <python con numpy> encuadre.py <datos de mp-caras.json> [--vision vision.jsonl] [--prev salida.png]
Modos (lienzo 1080×1920; ideas del Talking Head Explainer, implementación propia):
  W  plano tal cual (escala 100 %)
  T  "cerrado": la cara ocupa ~400 px de alto, centrada en y≈866, cuello/hombros en x=540
  S  "partido": panel arriba (y 0–960), cabeza abajo con el pelo ~100 px bajo la mitad (pelo ≈ frente − 0,45·(barbilla − frente))
Valores de salida: escala (%) y posición del centro del clip (px) como en Movimiento de Premiere, usando la MEDIANA del tramo
(sin temblores). Si faltan medidas fiables → NO VERIFICADO.
"""
import argparse, json, statistics as st, subprocess
a = argparse.ArgumentParser(); a.add_argument("mp"); a.add_argument("--vision", default=""); a.add_argument("--prev", default="")
o = a.parse_args()
D = json.load(open(o.mp)); W, H = D["w"], D["h"]
caras_mp = [d["caras"][0] for d in D["datos"] if d["caras"]]
fr = [d["frente_y"] for d in D["datos"] if d["frente_y"]]; ba = [d["barbilla_y"] for d in D["datos"] if d["barbilla_y"]]
ho = [d["hombros"] for d in D["datos"] if d["hombros"]]
vis = []
if o.vision:
    for l in open(o.vision):
        c = json.loads(l)["caras"]
        if c: vis.append(c[0])
res = {"fotogramas": len(D["datos"]), "fuente_cara": "Vision" if vis else "MediaPipe"}
caras = vis or caras_mp
if len(caras) < len(D["datos"]) * 0.6 or not ho:
    print(json.dumps({"veredicto": "NO VERIFICADO: cara u hombros en menos del 60 % de los fotogramas"})); raise SystemExit(3)
cx = st.median([(c[0] + c[2]) / 2 for c in caras]); cy = st.median([(c[1] + c[3]) / 2 for c in caras]); ch = st.median([c[3] - c[1] for c in caras])
hx = st.median([h[0] for h in ho]); hy = st.median([h[1] for h in ho])
modos = {"W": {"escala": 100.0, "pos": [540.0, 960.0]}}
# T: la cara a 400 px de alto, centrada en y 866, hombros en x 540
eT = 400 / ch; modos["T"] = {"escala": round(100 * eT, 1), "pos": [round(540 - (hx - W / 2) * eT, 1), round(866 - (cy - H / 2) * eT, 1)]}
if fr and ba:
    f, b = st.median(fr), st.median(ba); pelo = f - 0.45 * (b - f)
    eS = 1.0  # en S se conserva la escala del plano; la cabeza baja hasta que el pelo queda en y≈1060
    modos["S"] = {"escala": 100.0, "pos": [round(540 - (hx - W / 2), 1), round(960 + (1060 - pelo), 1)], "pelo_y": round(pelo), "barbilla_y": round(b)}
else:
    modos["S"] = "NO VERIFICADO: sin puntos de frente/barbilla"
res.update({"cara_centro": [round(cx), round(cy)], "cara_alto": round(ch), "hombros": [round(hx), round(hy)], "modos": modos,
            "nota": "propuesta para revisar; no se aplica a ningún proyecto"})
print(json.dumps(res, ensure_ascii=False))
if o.prev:
    vid = D["video"]; t = D["datos"][len(D["datos"]) // 2]["t"]; FF = "/Users/luiyi/.local/bin/ffmpeg"; partes = []
    for k, m in modos.items():
        if not isinstance(m, dict): continue
        e = m["escala"] / 100; px, py = m["pos"]
        sw, sh = int(W * e) // 2 * 2, int(H * e) // 2 * 2
        ox, oy = int(px - sw / 2), int(py - sh / 2)
        vf = (f"scale={sw}:{sh},pad=w=max(iw\\,1080)+2*abs({ox}):h=max(ih\\,1920)+2*abs({oy}):x=abs({ox})+{ox}:y=abs({oy})+{oy}:color=black,"
              f"crop=1080:1920:abs({ox}):abs({oy})")
        if k == "S": vf += ",drawbox=x=0:y=0:w=1080:h=960:color=0x1E8BFF@0.55:t=fill"
        vf += f",drawtext=text='{k}':x=30:y=30:fontsize=90:fontcolor=white,scale=360:-1"
        out = f"/tmp/encuadre-{k}.png"; subprocess.run([FF, "-nostdin", "-v", "error", "-y", "-ss", str(t), "-i", vid, "-frames:v", "1", "-vf", vf, out]); partes.append(out)
    subprocess.run([FF, "-nostdin", "-v", "error", "-y"] + sum([["-i", p] for p in partes], []) + ["-filter_complex", "".join(f"[{i}]" for i in range(len(partes))) + f"hstack={len(partes)}", o.prev])
    print("previsualización:", o.prev)
