# uso: python analizar.py <id> ...   (lee stems/htdemucs/<id>/{vocals,no_vocals}.wav, sonido/<id>.cortes.txt, sonido/<id>.video.txt)
import sys, json, numpy as np, soundfile as sf
def db(x): return 20*np.log10(np.maximum(x,1e-9))
def stft(x, n=2048, h=512):
    w=np.hanning(n); k=1+(len(x)-n)//h
    idx=np.arange(n)[None,:]+h*np.arange(k)[:,None]
    return np.abs(np.fft.rfft(x[idx]*w,axis=1))
def run(id):
    v,sr=sf.read(f'stems/htdemucs/{id}/vocals.wav'); m,_=sf.read(f'stems/htdemucs/{id}/no_vocals.wav')
    side=(m[:,0]-m[:,1])/2; mid=m.mean(1); vm=v.mean(1); dur=len(mid)/sr
    h=512; S=stft(mid); V=stft(vm); fr=np.fft.rfftfreq(2048,1/sr); t=np.arange(len(S))*h/sr
    e=np.sqrt((S**2).sum(1))/1024; ev=np.sqrt((V**2).sum(1))/1024
    Ldb=db(e); Vdb=db(ev)
    voz=Vdb>np.percentile(Vdb,75)-18
    band=lambda a,b:np.sqrt((S[:,(fr>=a)&(fr<b)]**2).sum(1))/1024
    sub,lo,midb,hi=band(20,120),band(120,500),band(500,4000),band(4000,18000)
    cent=(S*fr).sum(1)/np.maximum(S.sum(1),1e-9)
    flat=np.exp(np.log(S[:,5:600]+1e-9).mean(1))/np.maximum(S[:,5:600].mean(1),1e-9)
    # eventos: flujo espectral
    lg=np.log1p(50*S); flux=np.maximum(lg[1:]-lg[:-1],0).sum(1); flux=np.r_[0,flux]
    k=int(0.25*sr/h); med=np.array([np.median(flux[max(0,i-k):i+k+1]) for i in range(len(flux))])
    thr=med*1.6+np.percentile(flux,60)*0.6
    pk=[i for i in range(4,len(flux)-4) if flux[i]>thr[i] and flux[i]==flux[i-3:i+4].max() and Ldb[i:i+4].max()>np.percentile(Ldb,50)-6]
    ev_=[]
    for i in pk:
        j=i; base=e[max(0,i-6):i].mean()+1e-9
        while j+1<len(e) and e[j+1]>max(base*1.5, e[i:i+3].max()*0.35) and j-i<int(2*sr/h): j+=1
        d=(j-i+1)*h/sr; seg=slice(i,j+1)
        tot=sub[seg].mean()+lo[seg].mean()+midb[seg].mean()+hi[seg].mean()+1e-9
        fs,fh=sub[seg].mean()/tot, hi[seg].mean()/tot
        tipo='grave' if fs>0.45 else ('clic' if d<0.12 and cent[seg].mean()>2500 else ('silbido' if d>=0.25 and flat[seg].mean()>0.25 else ('tonal' if flat[seg].mean()<0.08 else 'otro')))
        ev_.append((t[i],d,tipo,float(Ldb[seg].max())))
    cortes=[float(x) for x in open(f'sonido/{id}.cortes.txt') if x.strip()]
    et=np.array([x[0] for x in ev_]) if ev_ else np.array([0.])
    conson=[c for c in cortes if np.min(np.abs(et-c))<=0.12]
    desf=[float(et[np.argmin(np.abs(et-c))]-c) for c in conson]
    # subidas (risers): energia creciente >=0.8 s antes de un corte
    def nivel(a,b):
        i0,i1=int(a*sr/h),int(b*sr/h); return Ldb[max(0,i0):max(1,i1)].mean() if i1>i0 else -120
    ris=[c for c in cortes if c>1.5 and nivel(c-0.4,c)-nivel(c-1.4,c-0.9)>=5]
    caida=[c for c in cortes if c>1 and c<dur-1 and nivel(c,c+0.4)-nivel(c-0.5,c)<=-8]
    # tempo
    env=flux-flux.mean(); ac=np.correlate(env,env,'full')[len(env)-1:]
    lags=np.arange(len(ac))*h/sr; ok=(lags>0.3)&(lags<1.2); bpm=60/lags[ok][np.argmax(ac[ok])]; fuerza=ac[ok].max()/ac[0]
    # secciones de video
    sec=None
    try:
        vid=[l.split() for l in open(f'sonido/{id}.video.txt')]; tt=np.array([float(a) for a,_,_ in vid]); ya=np.array([float(b) for _,b,_ in vid]); sa=np.array([float(c) for _,_,c in vid])
        mg=(sa<4)
        mgi=np.interp(t,tt,mg.astype(float))>0.5
        sec=dict(pct_mg=round(100*mg.mean()), musica_en_mg=round(float(np.median(Ldb[mgi])),1) if mgi.any() else None, musica_en_busto=round(float(np.median(Ldb[~mgi])),1),
                 eventos_por_10s_mg=round(10*sum(1 for x in ev_ if mgi[min(len(mgi)-1,int(x[0]*sr/h))])/max(1e-9,mgi.mean()*dur),1),
                 eventos_por_10s_busto=round(10*sum(1 for x in ev_ if not mgi[min(len(mgi)-1,int(x[0]*sr/h))])/max(1e-9,(1-mgi.mean())*dur),1))
    except Exception as ex: sec=dict(error=str(ex))
    tipos={k:sum(1 for x in ev_ if x[2]==k) for k in ['grave','clic','silbido','tonal','otro']}
    r=dict(id=id,dur=round(dur),cortes=len(cortes),
      voz_dB=round(float(np.median(Vdb[voz])),1), musica_bajo_voz_dB=round(float(np.median(Ldb[voz])),1), musica_sin_voz_dB=round(float(np.median(Ldb[~voz])),1),
      dif_voz_musica=round(float(np.median(Vdb[voz])-np.median(Ldb[voz])),1), sube_en_huecos=round(float(np.median(Ldb[~voz])-np.median(Ldb[voz])),1),
      pct_tiempo_con_musica=round(float(100*(Ldb>-55).mean())), rango_musica_p10_p90=[round(float(np.percentile(Ldb,10)),1),round(float(np.percentile(Ldb,90)),1)],
      graves_pct=round(float(100*(sub**2).sum()/((sub**2).sum()+(lo**2).sum()+(midb**2).sum()+(hi**2).sum()))), agudos_pct=round(float(100*(hi**2).sum()/((sub**2).sum()+(lo**2).sum()+(midb**2).sum()+(hi**2).sum())),1),
      planitud=round(float(np.median(flat)),3), ancho_estereo=round(float(np.sqrt((side**2).mean())/max(1e-9,np.sqrt((mid**2).mean()))),2),
      eventos=len(ev_), eventos_cada_s=round(dur/max(1,len(ev_)),1), tipos=tipos,
      cortes_con_sonido=f'{len(conson)}/{len(cortes)}', desfase_medio_ms=round(1000*float(np.median(desf))) if desf else None,
      subidas_antes_de_corte=len(ris), caidas_tras_corte=len(caida), bpm=round(float(bpm)), pulso_fuerza=round(float(fuerza),2), video=sec)
    json.dump(dict(r,eventos_lista=[(round(a,2),round(b,2),c,round(d,1)) for a,b,c,d in ev_]),open(f'sonido/{id}.analisis.json','w'))
    print(json.dumps(r,ensure_ascii=False))
for id in sys.argv[1:]:
    try: run(id)
    except Exception as ex: print(id,'ERROR',ex)
