# Genera las capas PNG de la lista acumulada del 08 (2160×3840, fondo transparente). Editar ITEMS y volver a ejecutar.
import subprocess, os, sys
FFM="/Users/luiyi/.local/bin/ffmpeg"; B="/Users/luiyi/Library/Fonts/SFPRODISPLAYBOLD.OTF"; MED="/Users/luiyi/Library/Fonts/SFPRODISPLAYMEDIUM.OTF"
ITEMS=["Ponte en forma","Deja el porno","Cero móvil al despertar","Busca un mentor","No mires historias","Calla tus metas","Sal del grupo","Di no al 99 %","Aprende a vender","Cobra más caro","Que te llamen loco","Hazlo con miedo"]
X,Y0,DY,FS=150,1040,88,58
D=os.path.dirname(os.path.abspath(__file__))
def esc(t): return t.replace("\\","\\\\").replace(":","\\:").replace("'","\u2019")
for k in range(1,len(ITEMS)+1):
    dt=[]
    for i,t in enumerate(ITEMS[:k]):
        y=Y0+i*DY
        dt.append(f"drawtext=fontfile={B}:text='{i+1}':fontsize={FS}:fontcolor=COLN:x={X}:y={y}")
        dt.append(f"drawtext=fontfile={MED}:text='{esc(t)}':fontsize={FS}:expansion=none:fontcolor=COLT:x={X+95}:y={y}")
    g=",".join(dt)
    sombra=g.replace("COLN","black").replace("COLT","black"); luz=g.replace("COLN","0xF5C542").replace("COLT","white")
    f=f"[0]split[a][b];[a]{sombra},gblur=sigma=10,colorchannelmixer=aa=0.85[s];[b]{luz}[w];[s][w]overlay"
    subprocess.run([FFM,"-v","error","-y","-f","lavfi","-i","color=c=black@0:s=2160x3840,format=rgba","-filter_complex",f,"-frames:v","1",os.path.join(D,f"lista v3 {k:02d}.png")],check=True)
print("hechas",len(ITEMS))
