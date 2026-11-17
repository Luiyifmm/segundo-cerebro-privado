import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, continueRender, delayRender} from 'remotion';
import {loadFont as caveat} from '@remotion/google-fonts/Caveat';

/**
 * Prueba de 10 s con el estilo de @marcoosaid (30-10-2026): revelado pixelado, nombre a mano con flecha
 * dibujada sobre B/N, láminas de tipografía condensada que se «encienden» palabra a palabra con una foto
 * entre las palabras, vídeo dentro de un visor con esquinas sobre blanco, título con brillo, recortes que
 * saltan encima del vídeo y subtítulos condensados en minúscula.
 */

const FPS = 30;
const s = (t: number) => Math.round(t * FPS);
const MANO = caveat('normal', {weights: ['600']}).fontFamily;
const TEAL = '#15252a';

let balboa = '';
const cargarBalboa = () => {
  if (balboa) return balboa;
  balboa = 'balboa';
  if (typeof document !== 'undefined') {
    const h = delayRender('balboa');
    const f = new FontFace('balboa', `url('${staticFile('fuentes/balboa.otf')}')`);
    document.fonts.add(f);
    f.load().then(() => continueRender(h), () => continueRender(h));
  }
  return balboa;
};

/* Palabras con su tiempo dentro del clip (segundos). */
const P: [string, number][] = [
  ['la', 0.1], ['riqueza', 0.4], ['no', 0.8], ['se', 1.0], ['trata', 1.2], ['de', 1.4], ['lo', 1.6], ['que', 1.65], ['tienes,', 1.8],
  ['sino', 2.1], ['es', 2.3], ['como', 2.4], ['piensas.', 2.6], ['es', 3.3], ['la', 3.6], ['programación', 3.8], ['mental', 4.4],
  ['que', 4.8], ['inculcaron', 5.0], ['en', 5.55], ['ti', 5.7], ['desde', 5.8], ['pequeño.', 6.1], ['si', 6.7], ['tú', 6.9],
  ['quieres', 7.0], ['ser', 7.3], ['una', 7.4], ['persona', 7.6], ['rica', 7.9], ['y', 8.4], ['exitosa.', 8.6],
];

/** El vídeo de Amin, con la opción de verse pixelado (bloques de `px`), en blanco y negro o más oscuro. */
const Video: React.FC<{desde: number; px?: number; bn?: boolean; luz?: number; zoom?: number}> = ({desde, px = 1, bn, luz = 1, zoom = 1}) => {
  const k = Math.max(1, px);
  return (
    <AbsoluteFill style={{overflow: 'hidden', filter: `${bn ? 'grayscale(1) contrast(1.15)' : ''} brightness(${luz})`}}>
      <div style={{width: 1080 / k, height: 1920 / k, transform: `scale(${k * zoom})`, transformOrigin: '0 0', imageRendering: 'pixelated'}}>
        <OffthreadVideo src={staticFile('clip.mp4')} startFrom={s(desde)} muted style={{width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated'}} />
      </div>
    </AbsoluteFill>
  );
};

/** Subtítulo del momento: las palabras que caen en [ini, fin), de 3 en 3, condensadas y en minúscula. */
const Subs: React.FC<{ini: number; fin: number; y?: number; color?: string}> = ({ini, fin, y = 1180, color = '#fff'}) => {
  const f = useCurrentFrame();
  const t = ini + f / FPS;
  const ws = P.filter(([, w]) => w >= ini && w < fin);
  const i = ws.findIndex(([, w], j) => t >= w && (j === ws.length - 1 || t < ws[j + 1][1]));
  if (i < 0) return null;
  const grupo = Math.floor(i / 3) * 3;
  const txt = ws.slice(grupo, i + 1).map(([w]) => w.replace(/[.,]/g, '')).join(' ');
  return (
    <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', fontFamily: cargarBalboa(), fontSize: 76, color, letterSpacing: '-0.01em',
      textShadow: color === '#fff' ? '0 3px 18px rgba(0,0,0,.55)' : 'none'}}>{txt}</div>
  );
};

/** Lámina de tipografía: cada palabra se enciende (gris → color) cuando se dice; `foto` va entre dos palabras. */
const Lamina: React.FC<{ini: number; palabras: [string, number][]; foto?: {src: string; tras: number}; fondo: string; tinta: string; tam?: number}> = ({ini, palabras, foto, fondo, tinta, tam = 150}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = ini + f / fps;
  const apagada = fondo === TEAL ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.16)';
  const entra = spring({frame: f - 2, fps, config: {damping: 13, stiffness: 160}});
  return (
    <AbsoluteFill style={{background: fondo, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 26, flexWrap: 'wrap', justifyContent: 'center', padding: '0 70px',
        fontFamily: cargarBalboa(), fontSize: tam, lineHeight: 1, letterSpacing: '-0.02em', transform: `scale(${interpolate(f, [0, 20], [1.06, 1], {extrapolateRight: 'clamp'})})`}}>
        {palabras.map(([w, at], i) => (
          <React.Fragment key={i}>
            <span style={{color: t >= at ? tinta : apagada, transition: 'none'}}>{w}</span>
            {foto && i === foto.tras && (
              <div style={{width: 250, height: 320, background: '#fff', padding: 10, boxShadow: '0 20px 50px rgba(0,0,0,.45)',
                transform: `scale(${entra}) rotate(${interpolate(entra, [0, 1], [-14, -3])}deg)`}}>
                <Img src={staticFile(foto.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Nombre escrito a mano con una flecha que se dibuja hacia la cara. */
const Nombre: React.FC<{txt: string}> = ({txt}) => {
  const f = useCurrentFrame();
  const trazo = interpolate(f, [6, 22], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const letras = Math.round(interpolate(f, [2, 14], [0, txt.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 640, top: 300, fontFamily: MANO, fontSize: 120, color: '#fff', transform: 'rotate(-8deg)', textShadow: '0 4px 16px rgba(0,0,0,.4)'}}>{txt.slice(0, letras)}</div>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <path d="M 760 470 C 830 580, 760 700, 640 790 M 640 790 l 42 -4 M 640 790 l 8 -40" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={trazo} />
      </svg>
    </AbsoluteFill>
  );
};

/** Vídeo dentro de un visor con esquinas, sobre blanco, acercándose poco a poco. */
const Visor: React.FC<{desde: number; ini: number; fin: number}> = ({desde, ini, fin}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, s(fin - ini)], [0.9, 1], {extrapolateRight: 'clamp'});
  const esq = (st: React.CSSProperties) => <div style={{position: 'absolute', width: 46, height: 46, borderColor: '#1f6f78', borderStyle: 'solid', borderWidth: 0, ...st}} />;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #ffffff, #e9ecef)', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'relative', width: 700, height: 1100, transform: `scale(${z})`}}>
        <div style={{position: 'absolute', inset: 0, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,.25)'}}>
          <div style={{width: 1080, height: 1920, transform: 'scale(0.648)', transformOrigin: '0 0', marginTop: -50}}>
            <OffthreadVideo src={staticFile('clip.mp4')} startFrom={s(desde)} muted style={{width: 1080, height: 1920, objectFit: 'cover'}} />
          </div>
          <Subs ini={ini} fin={fin} y={760} />
        </div>
        {esq({left: -40, top: -40, borderLeftWidth: 6, borderTopWidth: 6})}
        {esq({right: -40, top: -40, borderRightWidth: 6, borderTopWidth: 6})}
        {esq({left: -40, bottom: -40, borderLeftWidth: 6, borderBottomWidth: 6})}
        {esq({right: -40, bottom: -40, borderRightWidth: 6, borderBottomWidth: 6})}
      </div>
    </AbsoluteFill>
  );
};

/** Título que se enciende con brillo (parpadeo corto y halo). */
const Brillo: React.FC<{txt: string; color: string; y?: number; tam?: number}> = ({txt, color, y = 640, tam = 130}) => {
  const f = useCurrentFrame();
  const on = interpolate(f, [0, 3, 5, 7, 12], [0, 1, 0.35, 1, 1], {extrapolateRight: 'clamp'});
  const halo = 30 + Math.sin(f / 4) * 6;
  return (
    <div style={{position: 'absolute', top: y, width: '100%', textAlign: 'center', fontFamily: cargarBalboa(), fontSize: tam, color: '#fff', opacity: on, lineHeight: 0.95,
      textShadow: `0 0 12px #fff, 0 0 ${halo}px ${color}, 0 0 ${halo * 2.2}px ${color}, 0 0 ${halo * 4}px ${color}`}}>{txt}</div>
  );
};

/** Recorte que salta encima del vídeo. */
const Recorte: React.FC<{src: string; x: number; y: number; rot: number; w?: number; h?: number}> = ({src, x, y, rot, w = 360, h = 440}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = spring({frame: f, fps, config: {damping: 11, stiffness: 190}});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: '#fff', padding: 9, boxShadow: '0 22px 50px rgba(0,0,0,.5)',
      transform: `scale(${e}) rotate(${rot * e}deg)`}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </div>
  );
};

/** Paso pixelado de una escena a otra: bloques grandes que se resuelven. */
const pixel = (f: number, dur = 9) => interpolate(f, [0, dur], [48, 1], {extrapolateRight: 'clamp'});

const Escena: React.FC<{de: number; a: number; children: React.ReactNode}> = ({de, a, children}) => (
  <Sequence from={s(de)} durationInFrames={s(a) - s(de)}>{children}</Sequence>
);

const Pix: React.FC<{desde: number; bn?: boolean; luz?: number; zoom?: [number, number]; dur?: number}> = ({desde, bn, luz, zoom = [1, 1], dur = 9}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return <Video desde={desde} px={pixel(f, dur)} bn={bn} luz={luz} zoom={interpolate(f, [0, durationInFrames], zoom)} />;
};

export const Marco: React.FC = () => {
  const sfx = (src: string, t: number, v = 0.5) => <Sequence from={s(t)}><Audio src={staticFile(`sfx/${src}`)} volume={v} /></Sequence>;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* 1 · Revelado pixelado + nombre a mano sobre blanco y negro */}
      <Escena de={0} a={1.5}><Pix desde={0} bn zoom={[1.05, 1.12]} dur={12} /><Nombre txt="Amin" /><Subs ini={0} fin={1.5} /></Escena>
      {/* 2 · Lámina oscura: «de lo que [foto] tienes» */}
      <Escena de={1.5} a={2.1}><Lamina ini={1.5} fondo={TEAL} tinta="#fff" palabras={[['lo que', 1.6], ['tienes', 1.8]]} foto={{src: 'img/2r.jpg', tras: 0}} /></Escena>
      {/* 3 · Visor con esquinas sobre blanco */}
      <Escena de={2.1} a={3.2}><Visor desde={2.1} ini={2.1} fin={3.2} /></Escena>
      {/* 4 · Título con brillo sobre el vídeo oscurecido */}
      <Escena de={3.2} a={4.8}><Pix desde={3.2} luz={0.42} zoom={[1.15, 1.22]} dur={6} /><Sequence from={s(0.55)}><Brillo txt="programación mental" color="#ff8a1f" /></Sequence></Escena>
      {/* 5 · Lámina blanca que se enciende palabra a palabra */}
      <Escena de={4.8} a={5.8}><Lamina ini={4.8} fondo="#f4f4f2" tinta="#111" tam={170} palabras={[['que', 4.8], ['inculcaron', 5.0], ['en ti', 5.55]]} /></Escena>
      {/* 6 · Vuelta al vídeo pixelada + recorte que salta */}
      <Escena de={5.8} a={7.6}><Pix desde={5.8} zoom={[1, 1.08]} /><Subs ini={5.8} fin={7.6} /><Sequence from={s(1.1)}><Recorte src="img/1r.jpg" x={90} y={250} rot={-7} /></Sequence></Escena>
      {/* 7 · Lámina oscura: «persona [foto] rica» */}
      <Escena de={7.6} a={8.5}><Lamina ini={7.6} fondo={TEAL} tinta="#fff" palabras={[['persona', 7.6], ['rica', 7.9]]} foto={{src: 'img/5r.jpg', tras: 0}} /></Escena>
      {/* 8 · Golpe de zoom y «exitosa» con brillo dorado */}
      <Escena de={8.5} a={9.9}><Pix desde={8.5} zoom={[1.35, 1.25]} dur={4} luz={0.6} /><Sequence from={s(0.1)}><Brillo txt="exitosa" color="#f5c542" y={1420} tam={190} /></Sequence></Escena>

      <Audio src={staticFile('clip.mp4')} />
      <Audio src={staticFile('musica.wav')} volume={0.12} />
      {sfx('flash.wav', 0, 0.35)}
      {sfx('woosh_largo.wav', 1.42, 0.45)}{sfx('pop.wav', 1.55, 0.6)}
      {sfx('click.wav', 2.1, 0.5)}
      {sfx('woosh_largo.wav', 3.12, 0.4)}{sfx('flash.wav', 3.75, 0.4)}
      {sfx('click.wav', 4.8, 0.5)}
      {sfx('pop.wav', 6.9, 0.6)}
      {sfx('woosh_largo.wav', 7.52, 0.45)}{sfx('pop.wav', 7.65, 0.6)}
      {sfx('impacto.wav', 8.5, 0.55)}
    </AbsoluteFill>
  );
};
