# Cama y efectos del MG "libre" v3 (7,6 s): tres puñetazos a la celda, rotura en "libre", y tres roturas de cadena
# ("romper", "programación", "mental"). Receta medida en @julianealborna: grave, oscura, golpes clavados, sin brillo.
import sys, numpy as np, soundfile as sf
sr=48000; D=7.6; n=int(sr*D); t=np.arange(n)/sr; rng=np.random.default_rng(21)
GOLPES=[0.78,1.32,2.02]; T_LIBRE,T_CAMBIO,T_ROMPER,T_PROG,T_MENTAL=2.96,3.72,4.24,5.24,6.14
def lp(x,fc):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/sr); return np.fft.irfft(X/(1+(f/fc)**4),len(x))
def bp(x,a,b):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/sr); return np.fft.irfft(X*(1/(1+(a/np.maximum(f,1))**4))*(1/(1+(f/b)**4)),len(x))
def env(t0,at,de):
    x=t-t0; return np.where(x<0,0,np.minimum(x/at,1)*np.exp(-np.maximum(x-at,0)/de))
def golpe(t0,f0,g,de):
    x=np.maximum(t-t0,0); return np.where(t>=t0,np.sin(2*np.pi*(f0*x+18*(1-np.exp(-x*14))/14))*np.exp(-x/de),0)*g
def metal(t0,g,de=0.22):   # barrote/eslabón: parciales inarmónicos, oscuros
    return sum(np.sin(2*np.pi*f*t+p)*a for f,a,p in [(311,1,0),(467,0.7,1),(742,0.5,2),(1130,0.3,0.5),(1680,0.18,1.3)])*env(t0,0.002,de)*g
def trozos(t0,dur,k,g):
    o=np.zeros(n)
    for i in range(k):
        ti=t0+0.04+rng.random()*dur; o+=metal(ti,g*(0.4+0.6*rng.random()),0.05)+bp(rng.standard_normal(n),900,3000)*env(ti,0.001,0.012)*g*0.6
    return o
dron=0.5*np.sin(2*np.pi*49*t)+0.35*np.sin(2*np.pi*49.6*t)+0.3*np.sin(2*np.pi*73.5*t+0.4)+0.12*np.sin(2*np.pi*98*t)
ruido=lp(np.cumsum(rng.standard_normal(n))/60,160); ruido/=np.abs(ruido).max()
nivel=np.interp(t,[0,0.3,2.3,T_LIBRE,T_LIBRE+0.3,T_ROMPER,T_PROG,5.5,T_MENTAL-0.02,T_MENTAL+0.3,D-0.5,D],[0,0.5,0.6,1.0,0.55,0.7,0.75,0.8,1.0,0.7,0.65,0])
m=(dron*0.5+ruido*0.5)*nivel*0.22
for g0 in GOLPES: m+=golpe(g0,62,0.42,0.22)+metal(g0,0.07)                      # puñetazos a la celda
m+=golpe(T_LIBRE,42,0.8,0.8)+metal(T_LIBRE,0.12,0.4)+trozos(T_LIBRE,0.6,12,0.035)  # la celda se rompe
m+=golpe(T_CAMBIO,48,0.25,0.4)
m+=golpe(T_ROMPER,50,0.5,0.5)+metal(T_ROMPER,0.09)+trozos(T_ROMPER,0.5,7,0.03)
m+=golpe(T_PROG,48,0.55,0.55)+metal(T_PROG,0.09)+trozos(T_PROG,0.5,7,0.03)
k=(t>=T_MENTAL-0.9)&(t<T_MENTAL); x=(t[k]-(T_MENTAL-0.9))/0.9; sub=np.zeros(n); sub[k]=np.sin(2*np.pi*np.cumsum(60+90*x**2)/sr)*x**2*0.16; m+=sub   # subida antes de la última
m+=golpe(T_MENTAL,40,0.85,0.9)+metal(T_MENTAL,0.13,0.45)+trozos(T_MENTAL,0.7,14,0.035)
m+=sum(np.sin(2*np.pi*f*t+p) for f,p in [(110,0),(164.8,1),(220,2),(329.6,0.5)])*env(T_MENTAL+0.05,0.25,1.4)*0.045             # el cerebro queda libre
for t0 in [0.34,1.58,4.86,6.42]: m+=np.sin(2*np.pi*1500*t)*env(t0,0.001,0.012)*0.045
m=lp(m,3800); lado=lp(rng.standard_normal(n),140); lado/=np.abs(lado).max(); lado*=nivel*0.05
L=m+lado; R=m-lado; sf.write(sys.argv[1],np.stack([L,R],1)/max(np.abs(L).max(),np.abs(R).max())*0.7,sr,subtype='PCM_24')
