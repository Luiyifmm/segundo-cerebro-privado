# Miniaturas acumuladas v2 (7 imagenes; se quito arrow_025406). Posicion = ultima clave de Movimiento de cada clip.
import subprocess, os
A="/Users/luiyi/Documents/Adobe/Premiere Pro/26.0/Arrow/"
# nombre, w, h, escala final, crop [L,T,R,B], pos final (x,y) normalizada
I=[("arrow_025507_101026.png",667,1000,45.29,[2,8,2,28],(0.14,0.1768)),
   ("arrow_025633_101026.png",464,700,47.078,[0,2,0,10],(0.36,0.1684)),
   ("arrow_025657_101026.png",736,1104,36.483,[0,0,0,28],(0.86,0.1797)),
   ("arrow_025914_101026.png",1200,1200,31.798,[15,12,10,12],(0.1356,0.275)),
   ("arrow_030014_101026.png",736,981,41.058,[15,20,0,8],(0.6295,0.1587)),
   ("arrow_030117_101026.png",736,736,56.289,[30,30,0,0],(0.3312,0.2588)),
   ("arrow_030210_101026.png",612,816,56.411,[10,22,10,15],(0.86,0.2708))]
for n in range(1,len(I)+1):
    cmd=["ffmpeg","-nostdin","-v","error","-y","-f","lavfi","-i","color=c=black@0.0:s=2160x3840,format=rgba"]
    fc=[];prev="0:v"
    for k,(f,w,h,e,c,p) in enumerate(I[:n]):
        cmd+=["-i",A+f]
        W=round(w*e/100);H=round(h*e/100);cw=round(W*(1-(c[0]+c[2])/100));ch=round(H*(1-(c[1]+c[3])/100));cx=round(W*c[0]/100);cy=round(H*c[1]/100)
        x=round(p[0]*2160-W/2+cx);y=round(p[1]*3840-H/2+cy)
        fc.append(f"[{k+1}:v]format=rgba,scale={W}:{H}:flags=lanczos,crop={cw}:{ch}:{cx}:{cy}[i{k}];[{prev}][i{k}]overlay={x}:{y}:format=auto[o{k}]");prev=f"o{k}"
    out=f"v2/miniaturas amin v2 {n:02d}.png"
    subprocess.check_call(cmd+["-filter_complex",";".join(fc),"-map",f"[{prev}]","-frames:v","1",out]); print(out)
