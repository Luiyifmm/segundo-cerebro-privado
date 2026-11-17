# Lista del 08 en UNA columna (12 filas) con los 12 números visibles desde el principio; el texto de cada punto entra al decirlo.
# Salida: "lista v6 00.png" (solo números) … "lista v6 12.png". 2160×3840 transparente. Medidas por variables de entorno.
import subprocess, os
FFM="/Users/luiyi/.local/bin/ffmpeg"; B="/Users/luiyi/Library/Fonts/SFPRODISPLAYBOLD.OTF"; MED="/Users/luiyi/Library/Fonts/SFPRODISPLAYMEDIUM.OTF"
ITEMS=["Ponte en forma","Deja el porno","Cero móvil al despertar","Busca un mentor","No mires historias","Calla tus metas","Sal del grupo","Di no al 99 %","Aprende a vender","Cobra más caro","Que te llamen loco","Hazlo con miedo"]
FS=int(os.environ.get("FS",62)); DY=int(os.environ.get("DY",98)); XI=int(os.environ.get("XI",150)); YI=int(os.environ.get("YI",1000))
PRE=os.environ.get("PRE","lista v6")
D=os.path.dirname(os.path.abspath(__file__))
def esc(t): return t.replace("\\","\\\\").replace(":","\\:").replace("'","\u2019")
NC=int(FS*1.1); NW=NC+int(FS*0.35)
for k in range(0,len(ITEMS)+1):
    dt=[]
    for i,t in enumerate(ITEMS):
        y=YI+i*DY
        dt.append(f"drawtext=fontfile={B}:text='{i+1}':fontsize={FS}:fontcolor=COLN:x={XI+NC}-text_w:y={y}")
        if i<k: dt.append(f"drawtext=fontfile={MED}:text='{esc(t)}':fontsize={FS}:expansion=none:fontcolor=COLT:x={XI+NW}:y={y}")
    g=",".join(dt)
    sombra=g.replace("COLN","black").replace("COLT","black"); luz=g.replace("COLN","0xF5C542").replace("COLT","white")
    f=f"[0]split[a][b];[a]{sombra},split[s1][s2];[s1]gblur=sigma=14[g1];[s2]gblur=sigma=5[g2];[g1][g2]overlay,colorchannelmixer=aa=0.95[s];[b]{luz}[w];[s][w]overlay"
    subprocess.run([FFM,"-v","error","-y","-f","lavfi","-i","color=c=black@0:s=2160x3840,format=rgba","-filter_complex",f,"-frames:v","1",os.path.join(D,f"{PRE} {k:02d}.png")],check=True)
print("hechas",len(ITEMS)+1)
