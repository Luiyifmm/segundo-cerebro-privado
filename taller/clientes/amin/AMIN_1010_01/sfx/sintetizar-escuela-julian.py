# Cama y efectos del MG "escuela" en estilo Julián (3,37 s): misma receta que la prueba (grave, oscura, golpes clavados).
import sys, numpy as np, soundfile as sf
sr=48000; D=3.37; n=int(sr*D); t=np.arange(n)/sr; rng=np.random.default_rng(11)
def lp(x,fc):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/sr); return np.fft.irfft(X/(1+(f/fc)**4),len(x))
def bp(x,a,b):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/sr); return np.fft.irfft(X*(1/(1+(a/np.maximum(f,1))**4))*(1/(1+(f/b)**4)),len(x))
def env(t0,at,de):
    x=t-t0; return np.where(x<0,0,np.minimum(x/at,1)*np.exp(-np.maximum(x-at,0)/de))
def golpe(t0,f0,g,de):
    x=np.maximum(t-t0,0); return np.where(t>=t0,np.sin(2*np.pi*(f0*x+18*(1-np.exp(-x*14))/14))*np.exp(-x/de),0)*g
dron=0.5*np.sin(2*np.pi*49*t)+0.35*np.sin(2*np.pi*49.6*t)+0.3*np.sin(2*np.pi*73.5*t+0.4)
ruido=lp(np.cumsum(rng.standard_normal(n))/60,160); ruido/=np.abs(ruido).max()
nivel=np.interp(t,[0,0.3,1.23,1.6,2.72,D-0.25,D],[0,0.5,0.65,0.85,0.95,0.9,0.3])
m=(dron*0.5+ruido*0.5)*nivel*0.22
m+=golpe(0.02,50,0.4,0.5)+golpe(1.23,58,0.45,0.6)+golpe(2.72,44,0.6,0.7)
for t0 in [1.93,2.18,2.43]: m+=golpe(t0,70,0.22,0.12)+bp(rng.standard_normal(n),600,2400)*env(t0,0.001,0.02)*0.08   # sello de cada empleado
m+=sum(np.sin(2*np.pi*f*t+p) for f,p in [(110,0),(164.8,1),(220,2)])*env(1.23,0.2,1.2)*0.035                                # zumbido de la puerta
for t0 in [0.07,1.6,2.15]: m+=np.sin(2*np.pi*1500*t)*env(t0,0.001,0.012)*0.045
m=lp(m,3800); lado=lp(rng.standard_normal(n),140); lado/=np.abs(lado).max(); lado*=nivel*0.05
L=m+lado; R=m-lado; sf.write(sys.argv[1],np.stack([L,R],1)/max(np.abs(L).max(),np.abs(R).max())*0.7,sr,subtype='PCM_24')
