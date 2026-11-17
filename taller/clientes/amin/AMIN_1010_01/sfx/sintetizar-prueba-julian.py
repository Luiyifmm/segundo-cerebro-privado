# Cama y efectos de la prueba "estilo Julián" (7,6 s). Receta medida en @julianealborna: cama grave y oscura siempre presente,
# sin brillo por encima de 4 kHz, golpe clavado en el cambio, subida un segundo antes de la revelación, tics cortos al entrar texto.
import sys, numpy as np, soundfile as sf
sr=48000; D=7.6; n=int(sr*D); t=np.arange(n)/sr; rng=np.random.default_rng(7)
T_LIBRE,T_CAMBIO,T_ROMPER,T_MENTAL=2.96,3.72,4.24,6.14
def lp(x,fc):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/sr); return np.fft.irfft(X/(1+(f/fc)**4),len(x))
def bp(x,a,b):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/sr); return np.fft.irfft(X*(1/(1+(a/np.maximum(f,1))**4))*(1/(1+(f/b)**4)),len(x))
def env(t0,at,de): 
    x=t-t0; return np.where(x<0,0,np.minimum(x/at,1)*np.exp(-np.maximum(x-at,0)/de))
# cama: dron grave con batido lento + ruido marrón filtrado
dron=0.5*np.sin(2*np.pi*49*t)+0.35*np.sin(2*np.pi*49.6*t)+0.3*np.sin(2*np.pi*73.5*t+0.4)+0.12*np.sin(2*np.pi*98*t)
ruido=lp(np.cumsum(rng.standard_normal(n))/60,160); ruido/=np.abs(ruido).max()
nivel=np.interp(t,[0,0.35,3.0,T_ROMPER-0.02,T_ROMPER+0.25,T_MENTAL,D-0.5,D],[0,0.5,0.55,1.0,0.6,0.85,0.8,0])   # crece hasta "romper", se recoge y abre en "mental"
cama=(dron*0.5+ruido*0.5)*nivel*0.22
# subida antes de romper: tono que sube + aire filtrado
k=(t>=T_ROMPER-1.1)&(t<T_ROMPER); x=(t[k]-(T_ROMPER-1.1))/1.1
sub=np.zeros(n); f=60+90*x**2; sub[k]=np.sin(2*np.pi*np.cumsum(f)/sr)*x**2*0.16
aire=np.zeros(n); aire[k]=x**2.2; aire=bp(rng.standard_normal(n),300,2600)*aire*0.05
# golpes graves (clavados en el fotograma)
def golpe(t0,f0,g,de): 
    x=np.maximum(t-t0,0); return np.where(t>=t0,np.sin(2*np.pi*(f0*x+18*(1-np.exp(-x*14))/14))*np.exp(-x/de),0)*g
g=golpe(0.02,52,0.25,0.5)+golpe(T_CAMBIO,46,0.32,0.5)+golpe(T_ROMPER,42,0.75,0.75)+golpe(T_MENTAL,55,0.4,0.9)
clic=bp(rng.standard_normal(n),500,2800)*env(T_ROMPER,0.002,0.05)*0.3
# fragmentos que caen tras romper
frag=np.zeros(n)
for i in range(14):
    t0=T_ROMPER+0.05+rng.random()*0.75; frag+=bp(rng.standard_normal(n),900,3200)*env(t0,0.001,0.012)*(0.05+0.05*rng.random())
# tics al entrar cada línea de texto (oscuros, cortos)
tic=np.zeros(n)
for t0 in [0.34,1.58,T_LIBRE,4.86,6.42]: tic+=np.sin(2*np.pi*1500*t)*env(t0,0.001,0.012)*0.05
# colchón tonal al encenderse el acento azul (libre: leve; mental: pleno)
def acorde(t0,g,de): return sum(np.sin(2*np.pi*f*t+p) for f,p in [(110,0),(164.8,1),(220,2),(329.6,0.5)])*env(t0,0.18,de)*g
pad=acorde(T_LIBRE,0.02,0.7)+acorde(T_MENTAL,0.05,1.6)
m=cama+sub+aire+g+clic+frag+tic+pad
m=lp(m,3800)                       # nada de brillo
# estéreo: cama abierta (lados ~0,4), golpes al centro
lado=lp(rng.standard_normal(n),140); lado/=np.abs(lado).max(); lado*=nivel*0.05
L=m+lado; R=m-lado; pico=max(np.abs(L).max(),np.abs(R).max()); 
sf.write(sys.argv[1],np.stack([L,R],1)/pico*0.7,sr,subtype='PCM_24')
