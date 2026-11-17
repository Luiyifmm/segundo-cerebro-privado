import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, Easing, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as serif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as anton} from '@remotion/google-fonts/Anton';

/**
 * Edición «natural y elegante» (sistema adaptado del método de Luis, 30-10-2026).
 * Todo sale de un JSON de montaje (sistema/ en herramientas/edicion): vídeo cortado, voz tratada aparte, subtítulos
 * escritos por sentido, zooms solo en los cortes y gráficos ligados a la palabra que los dispara (con su segundo del bruto).
 * `capa` permite sacar cada capa por separado con alfa: 'todo' | 'subs' | 'graficos'.
 */
export type Bloque = {s: number; e: number; linea: string; clave: string; color: string; t_clave: number | null};
export type Grafico = {tipo: 'propina'; t: number; hasta: number; palabra: string; t_bruto: number};
export type Montaje = {
  fps: number; duracion: number; video: string; voz: string; subtitulos: Bloque[]; graficos: Grafico[];
  zooms: {t: number; escala: number}[]; ancla: [number, number]; sfx: {src: string; t: number; vol: number}[];
  estilo: {subtitulo: {tam: number; y_px: number; sombra: string}; clave: {tam: number}};
  capa?: 'todo' | 'subs' | 'graficos';
};

const SERIF = serif('normal', {weights: ['400']}).fontFamily;
const ANTON = anton().fontFamily;
const SALIDA = Easing.bezier(0.16, 1, 0.3, 1);

const Video: React.FC<{m: Montaje}> = ({m}) => {
  const t = useCurrentFrame() / m.fps;
  const z = [...m.zooms].reverse().find((x) => x.t <= t + 1e-3) ?? m.zooms[0];
  // Empuje muy lento dentro de cada pieza (0,6 %/s): el plano respira sin que se note.
  const empuje = 1 + Math.min(0.03, (t - z.t) * 0.006);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <OffthreadVideo src={staticFile(m.video)} muted style={{width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${z.escala * empuje})`, transformOrigin: `${m.ancla[0] * 100}% ${m.ancla[1] * 100}%`}} />
    </AbsoluteFill>
  );
};

const Subtitulos: React.FC<{m: Montaje}> = ({m}) => {
  const f = useCurrentFrame();
  const t = f / m.fps;
  const b = m.subtitulos.find((x) => t >= x.s - 0.02 && t < x.e);
  if (!b) return null;
  const k = interpolate(t - b.s, [0, 0.18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: SALIDA});
  const kc = b.t_clave != null ? interpolate(t - b.t_clave, [0, 0.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: SALIDA}) : 0;
  const st = m.estilo.subtitulo;
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: st.y_px, transform: 'translateY(-50%)', textAlign: 'center', color: '#fff'}}>
      <div style={{fontFamily: SERIF, fontSize: st.tam, lineHeight: 1.08, textShadow: st.sombra, opacity: k, transform: `translateY(${(1 - k) * 14}px)`}}>
        {b.linea}
      </div>
      {b.clave && t >= (b.t_clave ?? 0) - 0.02 && (
        <div style={{fontFamily: ANTON, fontSize: m.estilo.clave.tam, lineHeight: 0.98, color: b.color, textTransform: 'uppercase',
          textShadow: '0 8px 28px rgba(0,0,0,.45)', opacity: kc, transform: `translateY(${(1 - kc) * 18}px)`}}>{b.clave}</div>
      )}
    </div>
  );
};

/** Tarjeta de cristal: la propina, después ✕ / antes ✓. Entra con la palabra «antes» y se va al acabar la frase. */
const Propina: React.FC<{g: Grafico; fps: number}> = ({g, fps}) => {
  const f = useCurrentFrame();
  const t = f / fps;
  const dur = g.hasta - g.t;
  const entra = interpolate(t, [0, 0.24], [0, 1], {extrapolateRight: 'clamp', easing: SALIDA});
  const sale = interpolate(t, [dur - 0.25, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tacha = interpolate(t, [0.35, 0.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: SALIDA});
  const fila = (txt: string, marca: string, color: string, extra: React.CSSProperties) => (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 28, ...extra}}>
      <span style={{fontFamily: SERIF, fontSize: 54, lineHeight: 1}}>{txt}</span>
      <span style={{fontFamily: ANTON, fontSize: 38, color}}>{marca}</span>
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 300, width: 480, top: 208, padding: '18px 34px 20px', borderRadius: 28, color: '#fff',
      background: 'rgba(18,18,20,.42)', border: '1px solid rgba(255,255,255,.28)', boxShadow: '0 24px 48px -24px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.35)',
      backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', opacity: entra * sale,
      transform: `translateY(${(1 - entra) * 16}px)`, filter: `blur(${(1 - entra) * 8}px)`}}>
      <div style={{fontFamily: ANTON, fontSize: 26, letterSpacing: '0.14em', opacity: 0.75, marginBottom: 10}}>LA PROPINA</div>
      {fila('Después', '✕', '#E5322D', {opacity: 1 - tacha * 0.45, textDecoration: tacha > 0.5 ? 'line-through' : 'none', textDecorationColor: '#E5322D', marginBottom: 8})}
      {fila('Antes', '✓', '#F5C542', {color: '#F5C542'})}
    </div>
  );
};

export const Muestra: React.FC<Montaje> = (m) => {
  const capa = m.capa ?? 'todo';
  const s = (x: number) => Math.round(x * m.fps);
  return (
    <AbsoluteFill style={{background: capa === 'todo' ? '#000' : 'transparent'}}>
      {capa === 'todo' && <Video m={m} />}
      {(capa === 'todo' || capa === 'graficos') && m.graficos.map((g, i) => (
        <Sequence key={i} from={s(g.t)} durationInFrames={s(g.hasta - g.t)}><Propina g={g} fps={m.fps} /></Sequence>
      ))}
      {(capa === 'todo' || capa === 'subs') && <Subtitulos m={m} />}
      {capa === 'todo' && <Audio src={staticFile(m.voz)} />}
      {capa === 'todo' && m.sfx.map((x, i) => <Sequence key={i} from={s(x.t)}><Audio src={staticFile(x.src)} volume={x.vol} /></Sequence>)}
    </AbsoluteFill>
  );
};
