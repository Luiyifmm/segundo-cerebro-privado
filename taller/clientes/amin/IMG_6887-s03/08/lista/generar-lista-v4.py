# Lista del 08 en DOS COLUMNAS (1–6 a la izquierda, 7–12 a la derecha), más grande. 2160×3840 transparente.
# v5 = ESPEJO=1: columna derecha alineada a la derecha con los números por fuera (a la derecha).
# Uso: python3 generar-lista-v4.py [prefijo]  → "lista v4 NN.png" (NN = puntos visibles). Editar ITEMS / medidas y repetir.
import subprocess, os, sys
FFM="/Users/luiyi/.local/bin/ffmpeg"; B="/Users/luiyi/Library/Fonts/SFPRODISPLAYBOLD.OTF"; MED="/Users/luiyi/Library/Fonts/SFPRODISPLAYMEDIUM.OTF"
ITEMS=["Ponte en forma","Deja el porno","Cero móvil al despertar","Busca un mentor","No mires historias","Calla tus metas","Sal del grupo","Di no al 99 %","Aprende a vender","Cobra más caro","Que te llamen loco","Hazlo con miedo"]
FS=int(os.environ.get("FS",66)); DY=int(os.environ.get("DY",106))
XI=int(os.environ.get("XI",150))     # izquierda: columna de números desde XI (zona segura de Amin: x ≥ 140)
XR=int(os.environ.get("XR",1413))    # derecha: columna de números desde XR; el punto más largo acaba en ≈ 2025 (zona segura: x ≤ 2020 + margen sin botones por encima de y 2200)
YI=int(os.environ.get("YI",1000)); YD=int(os.environ.get("YD",1600))  # izquierda arriba (pared libre), derecha abajo (junto a la cara, sin tapar la lámpara)
PRE=sys.argv[1] if len(sys.argv)>1 else "lista v4"
D=os.path.dirname(os.path.abspath(__file__))
def esc(t): return t.replace("\\","\\\\").replace(":","\\:").replace("'","\u2019")
NC=int(FS*1.1)   # ancho de la columna de números (alineados a la derecha, caben 2 cifras)
NW=NC+int(FS*0.35)  # el texto empieza aquí
for k in range(1,len(ITEMS)+1):
    dt=[]
    for i,t in enumerate(ITEMS[:k]):
        if i<6:
            y=YI+i*DY
            dt.append(f"drawtext=fontfile={B}:text='{i+1}':fontsize={FS}:fontcolor=COLN:x={XI+NC}-text_w:y={y}")
            dt.append(f"drawtext=fontfile={MED}:text='{esc(t)}':fontsize={FS}:expansion=none:fontcolor=COLT:x={XI+NW}:y={y}")
        else:
            y=YD+(i-6)*DY
            if os.environ.get("ESPEJO"):
                XE=int(os.environ.get("XE",2025))  # borde derecho de los números
                dt.append(f"drawtext=fontfile={B}:text='{i+1}':fontsize={FS}:fontcolor=COLN:x={XE}-text_w:y={y}")
                dt.append(f"drawtext=fontfile={MED}:text='{esc(t)}':fontsize={FS}:expansion=none:fontcolor=COLT:x={XE-NW}-text_w:y={y}")
            else:
                dt.append(f"drawtext=fontfile={B}:text='{i+1}':fontsize={FS}:fontcolor=COLN:x={XR+NC}-text_w:y={y}")
                dt.append(f"drawtext=fontfile={MED}:text='{esc(t)}':fontsize={FS}:expansion=none:fontcolor=COLT:x={XR+NW}:y={y}")
    g=",".join(dt)
    sombra=g.replace("COLN","black").replace("COLT","black"); luz=g.replace("COLN","0xF5C542").replace("COLT","white")
    f=f"[0]split[a][b];[a]{sombra},split[s1][s2];[s1]gblur=sigma=14[g1];[s2]gblur=sigma=5[g2];[g1][g2]overlay,colorchannelmixer=aa=0.95[s];[b]{luz}[w];[s][w]overlay"  # sombra doble: halo ancho + borde corto (se lee sobre la pared clara)
    subprocess.run([FFM,"-v","error","-y","-f","lavfi","-i","color=c=black@0:s=2160x3840,format=rgba","-filter_complex",f,"-frames:v","1",os.path.join(D,f"{PRE} {k:02d}.png")],check=True)
print("hechas",len(ITEMS))
