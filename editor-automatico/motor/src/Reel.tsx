import React from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import {familia, useFuente} from './fuentes';

// Un archivo de la carpeta pública (p/…, lib/…) o, si ya es una URL completa, tal cual (entregas del Mac de Luis en el almacén)
export const recurso = (src: string) => (/^https?:\/\//.test(src) ? src : staticFile(src));

const ANTON = familia('anton', 'anton').fontFamily;
const SERIF = familia('serif', 'serif').fontFamily;
const INTER = familia('sans', 'sans').fontFamily;

// ---------- Tipos de la lista de edición (edl.json) ----------
export type Palabra = {w: string; s: number; e: number};
export type Comparacion = {s: number; e: number; tp: number; tr: number; pobre: string; rico: string; titulo: string};
// golpe = salto rápido (jump zoom) · suave = acercamiento lento · out = parte de cerca y se aleja hasta 1×
export type Zoom = {s: number; escala: number; tipo?: 'golpe' | 'suave' | 'out'; dur?: number};
// Efectos visuales y «plugins»: flash, temblor, desenfoque o un vídeo del pack encima (overlay)
export type Fx = {t: number; dur: number; tipo: 'flash' | 'temblor' | 'desenfoque' | 'overlay'; src?: string; modo?: 'trama' | 'alfa'; fuerza?: number};
export type Look = {tipo: 'ninguno' | 'cine' | 'calido' | 'frio' | 'vivo' | 'noir' | 'vintage' | 'premium'; fuerza?: number};
export type Pistas = {voz?: {vol?: number; mute?: boolean}; sfx?: {vol?: number; mute?: boolean}; musica?: {mute?: boolean}};
export type Sfx = {src: string; t: number; vol?: number};
export type Broll = {s: number; e: number; src: string; video?: boolean; bn?: boolean};  // bn: archivo en blanco y negro (estilo Alborna)
// Rótulo grande (método Luis, 30-10): «*palabra*» va en la segunda letra y en el color de acento; «/» parte la línea.
// detras = entre el fondo y la persona (necesita `persona`), como en las referencias premium (Guille Collado, Ashish, Natt).
export type Rotulo = {s: number; e: number; texto: string; y?: number; tam?: number; color?: string; acento?: string;
  fuente?: string; fuente2?: string; detras?: boolean; mayus?: boolean};
export type Acabado = {grano?: number; vineta?: number; particulas?: number; fondo?: number; desenfoqueFondo?: number}; // fondo/desenfoqueFondo: solo detrás de la persona
export type Estilo = {subTam?: number; claveTam?: number; subY?: number; subFuente?: string; claveFuente?: string; subColor?: string; mayus?: boolean; contorno?: number; claveMayus?: boolean};
export type Edl = {
  fps: number; duracion: number; video: string;
  cara: {x: number; y: number};          // posición de la cara en el vídeo base (1080x1920)
  palabras: Palabra[];
  claves: Record<string, string>;         // palabra -> color (sale ENORME en Anton)
  comparaciones: Comparacion[];
  zooms: Zoom[];
  bn: {s: number; e: number}[];           // tramos en blanco y negro
  broll: Broll[];
  sfx: Sfx[];
  musica?: {src: string; vol: number};
  cta?: {t: number; usuario: string; y?: number};
  colorPobre: string; colorRico: string;
  estilo?: Estilo;                        // tamaño, altura, fuente y color del subtítulo (lo toca el editor de la Sala)
  titular?: {texto: string; hasta: number; y?: number; conSubtitulos?: boolean}; // gancho escrito arriba los primeros segundos (clips). Víctor: un solo texto a la vez, así que por defecto tapa los subtítulos
  fx?: Fx[];
  look?: Look;
  pistas?: Pistas;                        // silenciar o bajar la voz, los efectos o la música (también en el render)
  rotulos?: Rotulo[];                     // títulos grandes animados (delante o detrás de la persona)
  persona?: string;                       // la persona recortada con alfa (webm VP9), mismo tiempo que `video`
  acabado?: Acabado;                      // grano, viñeta y partículas sobre todo el vídeo
};
export const EDL_VACIA: Edl = {
  fps: 30, duracion: 1, video: '', cara: {x: 540, y: 850}, palabras: [], claves: {}, comparaciones: [],
  zooms: [], bn: [], broll: [], sfx: [], colorPobre: '#E5322D', colorRico: '#F5C542',
};

const limpiar = (w: string) => w.replace(/[.,;:!?¡¿"]/g, '');
const clave = (w: string) => limpiar(w).toLowerCase();

// ---------- Vídeo de Amin con zooms (jump zoom) y blanco y negro ----------
// El encuadre (zoom, temblor, desenfoque, look) se calcula una vez y lo usan el vídeo y la persona recortada,
// para que la persona vaya exactamente encima del vídeo con los rótulos «detrás» en medio (en coordenadas de pantalla).
const useEncuadre = (edl: Edl) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const t = f / fps;
  const zs: Zoom[] = edl.zooms.length ? edl.zooms : [{s: 0, escala: 1}];
  let i = 0; while (i + 1 < zs.length && zs[i + 1].s <= t) i++;
  const fin = (z: Zoom) => (z.tipo === 'out' ? 1 : z.escala);   // dónde se queda cada zoom al acabar
  const prev = i > 0 ? fin(zs[i - 1]) : zs[0].escala;
  const z = zs[i];
  let s = z.escala;
  if (i > 0) {
    const dur = Math.max(0.1, z.dur ?? (z.tipo === 'golpe' || !z.tipo ? 7 / fps : 1.2));
    const k = !z.tipo || z.tipo === 'golpe'
      ? spring({frame: f - Math.round(z.s * fps), fps, config: {damping: 200, mass: 0.6}, durationInFrames: 7})
      : interpolate(t - z.s, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
    s = z.tipo === 'out' ? z.escala + (1 - z.escala) * k : prev + (z.escala - prev) * k;
  }
  // Efectos que tocan al vídeo: temblor y desenfoque (con subida y bajada)
  const activos = (edl.fx ?? []).filter((x) => t >= x.t && t < x.t + x.dur);
  const curva = (x: Fx) => Math.sin(Math.PI * Math.min(1, Math.max(0, (t - x.t) / x.dur)));
  const tiembla = activos.filter((x) => x.tipo === 'temblor').reduce((a, x) => a + curva(x) * (x.fuerza ?? 1), 0);
  const desenfoque = activos.filter((x) => x.tipo === 'desenfoque').reduce((a, x) => a + curva(x) * 18 * (x.fuerza ?? 1), 0);
  const jx = tiembla ? Math.sin(f * 2.7) * 22 * tiembla : 0, jy = tiembla ? Math.cos(f * 3.1) * 16 * tiembla : 0;
  // La cara va al tercio superior (y = 640) cuando hay zoom; sin zoom se queda donde está
  const objetivoY = interpolate(s, [1, 1.3], [edl.cara.y, 640], {extrapolateRight: 'clamp'});
  // Desplazamiento limitado para que nunca se vean bordes negros
  const lim = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const ty = lim(objetivoY - (960 + (edl.cara.y - 960) * s), 960 * (s - 1));
  const tx = lim(540 - (540 + (edl.cara.x - 540) * s), 540 * (s - 1));
  const enBn = edl.bn.some((r) => t >= r.s && t < r.e);
  // Enfoque de entrada (gancho): de desenfocado y un poco más cerca a nítido en 8 fotogramas
  const blurIn = interpolate(f, [0, 8], [14, 0], {extrapolateRight: 'clamp'});
  const zIn = interpolate(f, [0, 10], [1.08, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return {
    transform: `translate(${tx + jx}px, ${ty + jy}px) scale(${s * zIn * (tiembla ? 1.04 : 1)})`,
    filter: `blur(${blurIn + desenfoque}px) ${enBn ? 'grayscale(1) contrast(1.15)' : filtroLook(edl.look)}`,
  };
};

const VideoBase: React.FC<{edl: Edl}> = ({edl}) => {
  const e = useEncuadre(edl);
  return (
    <AbsoluteFill style={{transform: e.transform, filter: e.filter}}>
      <OffthreadVideo src={recurso(edl.video)} style={{width: 1080, height: 1920,
        filter: edl.persona && edl.acabado?.desenfoqueFondo ? `blur(${edl.acabado.desenfoqueFondo}px)` : undefined}}
        volume={edl.pistas?.voz?.mute ? 0 : edl.pistas?.voz?.vol ?? 1} />
      {edl.persona && edl.acabado?.fondo ? <AbsoluteFill style={{background: `rgba(0,0,0,${edl.acabado.fondo})`}} /> : null}
    </AbsoluteFill>
  );
};

// La persona recortada, con el mismo encuadre que el vídeo, encima de los rótulos de detrás
const PersonaCapa: React.FC<{edl: Edl}> = ({edl}) => {
  const e = useEncuadre(edl);
  return (
    <AbsoluteFill style={{transform: e.transform, filter: e.filter}}>
      <OffthreadVideo src={recurso(edl.persona!)} transparent muted style={{width: 1080, height: 1920}} />
    </AbsoluteFill>
  );
};

// ---------- Looks de color (como un LUT, pero en CSS para que se vea igual en el editor y en el render) ----------
const LOOKS: Record<Look['tipo'], string> = {
  ninguno: '', cine: 'contrast(1.12) saturate(0.88) sepia(0.12) brightness(0.97)', calido: 'sepia(0.28) saturate(1.2) hue-rotate(-8deg) brightness(1.03)',
  frio: 'saturate(0.9) hue-rotate(12deg) brightness(1.02) contrast(1.05)', vivo: 'saturate(1.45) contrast(1.08)',
  noir: 'grayscale(1) contrast(1.35) brightness(0.92)', premium: 'contrast(1.22) saturate(0.84) brightness(0.97) sepia(0.07)', vintage: 'sepia(0.45) contrast(0.92) saturate(0.85) brightness(1.05)',
};
export const filtroLook = (l?: Look) => {
  if (!l || l.tipo === 'ninguno' || !LOOKS[l.tipo]) return '';
  const k = Math.max(0, Math.min(1, l.fuerza ?? 1));
  // La fuerza escala cada filtro hacia su valor neutro
  return LOOKS[l.tipo].replace(/(\w[\w-]*)\(([-\d.]+)(deg)?\)/g, (_, fn, v, u) => {
    const n = Number(v), neutro = ['contrast', 'saturate', 'brightness'].includes(fn) ? 1 : 0;
    return `${fn}(${(neutro + (n - neutro) * k).toFixed(3)}${u ?? ''})`;
  });
};

// ---------- Efectos visuales encima del vídeo: flash y overlays del pack ----------
const Flash: React.FC<{dur: number; fuerza: number}> = ({dur, fuerza}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const o = interpolate(f, [0, 2, dur * fps], [0, 0.95 * fuerza, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: 'white', opacity: o}} />;
};
const Overlay: React.FC<{x: Fx}> = ({x}) => (
  <AbsoluteFill style={{mixBlendMode: x.modo === 'alfa' ? 'normal' : 'screen', opacity: Math.min(1, x.fuerza ?? 1)}}>
    <OffthreadVideo src={recurso(x.src!)} muted transparent={x.modo === 'alfa'} style={{width: '100%', height: '100%', objectFit: x.modo === 'alfa' ? 'contain' : 'cover'}} />
  </AbsoluteFill>
);

// ---------- Panel de cristal POBRE | RICO ----------
const Imagen: React.FC<{src: string; desde: number; pobre: boolean; gris: boolean}> = ({src, desde, pobre, gris}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const d = f - desde;
  if (d < 0) return null;
  const p = spring({frame: d, fps, config: {damping: 14, mass: 0.7}});
  const kb = interpolate(d, [0, fps * 4], [1.18, 1.04], {extrapolateRight: 'clamp'});
  const pan = interpolate(d, [0, fps * 4], [pobre ? -18 : 18, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: interpolate(p, [0, 1], [0, 1]), transform: `scale(${interpolate(p, [0, 1], [1.25, 1])})`,
      filter: `blur(${interpolate(p, [0, 1], [10, 0])}px) ${gris ? 'grayscale(1) brightness(0.8)' : ''}`}}>
      <Img src={recurso(src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb}) translateX(${pan}px)`}} />
    </AbsoluteFill>
  );
};

const Hueco: React.FC<{lado: 'pobre' | 'rico'; c: Comparacion; edl: Edl}> = ({lado, c, edl}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const pobre = lado === 'pobre';
  const desde = Math.round((pobre ? c.tp : c.tr) * fps);
  const color = pobre ? edl.colorPobre : edl.colorRico;
  const activo = f >= desde;
  const pulso = spring({frame: f - desde, fps, config: {damping: 10}, durationInFrames: 12});
  // Cuando ya ha salido el rico, el pobre se queda en gris
  const gris = pobre && f >= Math.round(c.tr * fps);
  return (
    <div style={{position: 'relative', flex: 1, height: '100%', borderRadius: 30, overflow: 'hidden',
      background: 'rgba(255,255,255,0.06)', boxShadow: activo ? `0 0 0 2px ${color}AA, 0 0 40px ${color}55` : 'inset 0 0 0 1px rgba(255,255,255,0.15)'}}>
      <Imagen src={pobre ? c.pobre : c.rico} desde={desde} pobre={pobre} gris={gris} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)'}} />
      <div style={{position: 'absolute', bottom: 22, width: '100%', textAlign: 'center', fontFamily: ANTON, fontSize: 78,
        color: activo ? color : 'rgba(255,255,255,0.35)', letterSpacing: 2, textShadow: '0 4px 18px rgba(0,0,0,0.6)',
        transform: `scale(${activo ? 1 + 0.15 * (1 - pulso) : 1})`}}>
        {pobre ? 'POBRE' : 'RICO'}
      </div>
    </div>
  );
};

const PanelCristal: React.FC<{edl: Edl}> = ({edl}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const t = f / fps;
  const cs = edl.comparaciones; if (!cs.length) return null;
  const ini = cs[0].s, fin = cs[cs.length - 1].e;
  if (t < ini - 0.01 || t > fin + 0.4) return null;
  const c = [...cs].reverse().find((x) => t >= x.s) || cs[0];
  const entra = spring({frame: f - Math.round(ini * fps), fps, config: {damping: 16, mass: 0.8}});
  const sale = interpolate(t, [fin, fin + 0.3], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Brillo que cruza el cristal (lo «líquido»)
  const brillo = interpolate((f % 90) / 90, [0, 1], [-60, 160]);
  const cambio = spring({frame: f - Math.round(c.s * fps), fps, config: {damping: 200}, durationInFrames: 8});
  return (
    <div style={{position: 'absolute', left: 50, top: 110, width: 980, height: 610, opacity: entra * sale,
      transform: `translateY(${interpolate(entra, [0, 1], [-60, 0])}px) scale(${interpolate(entra, [0, 1], [0.85, 1]) * interpolate(sale, [0, 1], [0.94, 1])})`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 46, background: 'linear-gradient(140deg, rgba(40,40,48,0.55), rgba(10,10,14,0.35))',
        backdropFilter: 'blur(26px) saturate(170%)', WebkitBackdropFilter: 'blur(26px) saturate(170%)',
        border: '1.5px solid rgba(255,255,255,0.45)',
        boxShadow: '0 40px 90px rgba(0,0,0,0.35), inset 0 1.5px 0 rgba(255,255,255,0.65), inset 0 -1px 0 rgba(255,255,255,0.15)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: -200, bottom: -200, width: 180, left: `${brillo}%`, transform: 'rotate(18deg)',
          background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.13), rgba(255,255,255,0))'}} />
      </div>
      <div style={{position: 'absolute', inset: 22, display: 'flex', gap: 22, opacity: cambio}}>
        <Hueco lado="pobre" c={c} edl={edl} />
        <div style={{width: 2, alignSelf: 'stretch', margin: '30px 0', background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.85), transparent)', boxShadow: '0 0 14px rgba(255,255,255,0.7)'}} />
        <Hueco lado="rico" c={c} edl={edl} />
      </div>
      <div style={{position: 'absolute', top: -30, left: '50%', transform: `translateX(-50%) scale(${interpolate(cambio, [0, 1], [0.7, 1])})`,
        padding: '10px 30px', borderRadius: 999, background: 'rgba(15,15,18,0.75)', backdropFilter: 'blur(14px)',
        border: '1.5px solid rgba(255,255,255,0.5)', color: 'white', fontFamily: SERIF, fontSize: 44, whiteSpace: 'nowrap'}}>
        {c.titulo}
      </div>
    </div>
  );
};

// ---------- Subtítulos: 1–3 palabras en serif + palabra clave ENORME ----------
type Trozo = {s: number; e: number; pal: Palabra[]; grande?: Palabra};
const trocear = (ps: Palabra[], claves: Record<string, string>): Trozo[] => {
  const out: Trozo[] = []; let cur: Palabra[] = [];
  const cerrar = (grande?: Palabra) => {
    const todas = grande ? [...cur, grande] : cur;
    if (todas.length) out.push({s: todas[0].s, e: todas[todas.length - 1].e, pal: cur, grande});
    cur = [];
  };
  ps.forEach((p, i) => {
    const prev = ps[i - 1];
    if (cur.length && prev && (p.s - prev.e > 0.35)) cerrar();
    if (claves[clave(p.w)]) { cerrar(p); return; }
    cur.push(p);
    if (cur.length >= 3 || /[.,?!]$/.test(p.w)) cerrar();
  });
  cerrar();
  return out;
};

const Subtitulos: React.FC<{edl: Edl}> = ({edl}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const t = f / fps;
  // Las fuentes van antes de cualquier «return»: los hooks tienen que ser siempre los mismos
  const sub = useFuente(edl.estilo?.subFuente, 'serif'), grande = useFuente(edl.estilo?.claveFuente, 'anton');
  const trozos = React.useMemo(() => trocear(edl.palabras, edl.claves), [edl]);
  // «Nunca texto en dos sitios a la vez» (Víctor): mientras sale el titular, sin subtítulos (salvo que se pida)
  if (edl.titular?.texto && !edl.titular.conSubtitulos && t < edl.titular.hasta) return null;
  if ((edl.rotulos ?? []).some((r) => t >= r.s && t < r.e)) return null;   // un solo texto a la vez (referencias premium)
  const i = trozos.findIndex((x, k) => t >= x.s - 0.03 && t < (trozos[k + 1] ? trozos[k + 1].s - 0.03 : x.e + 0.4));
  if (i < 0) return null;
  const tr = trozos[i];
  const enComp = edl.comparaciones.some((c) => t >= c.s && t <= c.e + 0.2);
  const es = edl.estilo ?? {};
  const y = (es.subY ?? 1010) + (enComp ? 140 : 0);
  const borde = es.contorno ? {WebkitTextStroke: `${es.contorno}px #000`, paintOrder: 'stroke fill'} as React.CSSProperties : {};
  const p = spring({frame: f - Math.round(tr.s * fps), fps, config: {damping: 14, mass: 0.5}, durationInFrames: 8});
  const pg = tr.grande ? spring({frame: f - Math.round(tr.grande.s * fps), fps, config: {damping: 9, mass: 0.6}}) : 0;
  const sombra = '0 3px 14px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.5)';
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: y, transform: `translateY(-50%) translateY(${interpolate(p, [0, 1], [18, 0])}px)`,
      opacity: p, textAlign: 'center', color: 'white'}}>
      {tr.pal.length > 0 && (
        <div style={{...sub, fontSize: es.subTam ?? 76, lineHeight: 1.05, color: es.subColor ?? 'white', textShadow: sombra, textTransform: es.mayus ? 'uppercase' : 'none', ...borde}}>
          {tr.pal.map((w) => limpiar(w.w)).join(' ')}
        </div>
      )}
      {tr.grande && t >= tr.grande.s - 0.03 && (
        <div style={{...grande, fontSize: es.claveTam ?? 190, lineHeight: 0.95, color: edl.claves[clave(tr.grande.w)], textTransform: es.claveMayus === false ? 'none' : 'uppercase', ...borde,
          textShadow: '0 8px 30px rgba(0,0,0,0.45)', transform: `scale(${interpolate(pg, [0, 1], [1.5, 1])})`, opacity: Math.min(1, pg * 1.5)}}>
          {limpiar(tr.grande.w)}
        </div>
      )}
    </div>
  );
};

// ---------- Rótulos grandes (dos letras, entrada palabra a palabra) ----------
const SUAVE = Easing.bezier(0.16, 1, 0.3, 1);
const RotuloCapa: React.FC<{r: Rotulo}> = ({r}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const t = f / fps; const dur = r.e - r.s;
  const f1 = useFuente(r.fuente, 'sfpro-bold'), f2 = useFuente(r.fuente2, 'nyght-italic');
  const tam = r.tam ?? 120, color = r.color ?? '#FFFFFF', acento = r.acento ?? '#F5C542';
  const salida = interpolate(t, [dur - 0.25, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  let n = 0;
  const lineas = r.texto.split('/').map((l) => l.trim()).filter(Boolean);
  return (
    <AbsoluteFill style={{alignItems: 'center', opacity: salida, filter: `blur(${(1 - salida) * 8}px)`}}>
      <div style={{position: 'absolute', top: r.y ?? 300, left: 50, right: 50, textAlign: 'center'}}>
        {lineas.map((l, i) => {
          // Que la línea quepa en 980 px: ~0,74 em por carácter en mayúsculas de SF Pro Bold (con 0,62 «ADMIRACIÓN» se salía: prueba del 30-10)
          const chars = l.replace(/\*/g, '').length;
          const ajuste = Math.min(1, 980 / Math.max(1, chars * tam * 0.74));
          return (
          <div key={i} style={{lineHeight: 0.98, marginTop: i ? 6 : 0, fontSize: 1, whiteSpace: 'nowrap'}}>
            {l.split(/\s+/).map((w, j) => {
              const it = /^\*.*\*$/.test(w); const txt = w.replace(/\*/g, '');
              const k = interpolate(t - 0.06 * n++, [0, 0.45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: SUAVE});
              const ff = it ? f2 : f1;
              return (
                <span key={j} style={{...ff, display: 'inline-block', margin: '0 0.14em', fontSize: (it ? tam * 1.05 : tam) * ajuste,
                  color: it ? acento : color, textTransform: !it && r.mayus !== false ? 'uppercase' : 'none',
                  opacity: k, filter: `blur(${(1 - k) * 10}px)`, transform: `translateY(${(1 - k) * 28}px)`,
                  textShadow: `0 0 28px ${(it ? acento : color)}55, 0 8px 30px rgba(0,0,0,0.35)`}}>{txt}</span>
              );
            })}
          </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Acabado: grano de película, viñeta y partículas ----------
const Acabado: React.FC<{a: Acabado}> = ({a}) => {
  const f = useCurrentFrame();
  const parts = React.useMemo(() => Array.from({length: 46}, (_, i) => {
    const r = (k: number) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
    return {x: r(1) * 1080, y: r(2) * 1920, v: 0.25 + r(3) * 0.9, d: 2 + r(4) * 5, fase: r(5) * 6.28, o: 0.25 + r(6) * 0.6};
  }), []);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {a.particulas ? parts.map((p, i) => {
        const y = ((p.y - f * p.v * 1.6) % 1920 + 1920) % 1920, x = p.x + Math.sin(f / 40 + p.fase) * 18;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: p.d, height: p.d, borderRadius: '50%',
          background: 'white', opacity: p.o * a.particulas!, filter: 'blur(1.2px)'}} />;
      }) : null}
      {a.vineta ? <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 52%, rgba(0,0,0,${a.vineta}) 100%)`}} /> : null}
      {a.grano ? (
        <AbsoluteFill style={{opacity: a.grano, mixBlendMode: 'overlay'}}>
          <svg width="1080" height="1920"><filter id={`g${f % 6}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 6} />
            <feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter={`url(#g${f % 6})`} /></svg>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- B-roll a pantalla completa ----------
const BrollCapa: React.FC<{b: Broll}> = ({b}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const dur = Math.round((b.e - b.s) * fps);
  const op = interpolate(f, [0, 4, dur - 4, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const kb = interpolate(f, [0, dur], [1.12, 1.0]);
  return (
    <AbsoluteFill style={{opacity: op, filter: b.bn ? 'grayscale(1) contrast(1.18) brightness(0.92)' : undefined}}>
      {b.video
        ? <OffthreadVideo src={recurso(b.src)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})`}} />
        : <Img src={recurso(b.src)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})`}} />}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.35))'}} />
    </AbsoluteFill>
  );
};

// ---------- Titular del gancho (arriba, los primeros segundos) ----------
const Titular: React.FC<{texto: string; hasta: number; y?: number}> = ({texto, hasta, y = 230}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const p = spring({frame: f - 3, fps, config: {damping: 13, mass: 0.6}});
  const fuera = interpolate(f, [hasta * fps - 6, hasta * fps], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: y, display: 'flex', justifyContent: 'center', opacity: fuera,
      transform: `translateY(${(1 - p) * -40}px) scale(${0.9 + 0.1 * p})`}}>
      <span style={{fontFamily: INTER, fontWeight: 800, fontSize: 62, lineHeight: 1.18, color: '#0b0b0c', background: 'white', textAlign: 'center',
        padding: '18px 30px', borderRadius: 22, boxShadow: '0 18px 50px rgba(0,0,0,.35)', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>
        {texto}
      </span>
    </div>
  );
};

// ---------- Tarjeta de «Seguir» al final ----------
const Cta: React.FC<{usuario: string; y: number}> = ({usuario, y}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const p = spring({frame: f, fps, config: {damping: 12, mass: 0.7}});
  const pulsado = f > fps * 0.9;
  return (
    <div style={{position: 'absolute', left: '50%', top: y, transform: `translateX(-50%) scale(${p})`, display: 'flex', alignItems: 'center', gap: 22,
      padding: '18px 22px 18px 30px', borderRadius: 999, background: 'rgba(255,255,255,0.92)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', fontFamily: INTER}}>
      <span style={{fontWeight: 800, fontSize: 42, color: '#111'}}>@{usuario}</span>
      <svg width="34" height="34" viewBox="0 0 24 24"><path fill="#3897F0" d="M12 1l2.6 2.2 3.4-.3.9 3.3 3 1.7-1.2 3.2 1.2 3.2-3 1.7-.9 3.3-3.4-.3L12 23l-2.6-2.2-3.4.3-.9-3.3-3-1.7 1.2-3.2-1.2-3.2 3-1.7.9-3.3 3.4.3z"/><path fill="#fff" d="M10.4 15.6l-3.2-3.2 1.4-1.4 1.8 1.8 4.9-4.9 1.4 1.4z"/></svg>
      <span style={{fontWeight: 800, fontSize: 38, color: 'white', background: pulsado ? '#262626' : '#0095F6', padding: '14px 34px', borderRadius: 999,
        transform: `scale(${pulsado ? interpolate(f, [fps * 0.9, fps * 1.0, fps * 1.15], [1, 0.9, 1], {extrapolateRight: 'clamp'}) : 1})`}}>
        {pulsado ? 'Siguiendo' : 'Seguir'}
      </span>
    </div>
  );
};

/** Altura de la tarjeta de Seguir: la elegida o, si los subtítulos van bajos (clips), por debajo de ellos. */
export const yCta = (edl: Edl) => edl.cta?.y ?? ((edl.estilo?.subY ?? 1010) > 1150 ? 1580 : 1330);

export const Reel: React.FC<Edl> = (edl) => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <VideoBase edl={edl} />
      {edl.persona && (edl.rotulos ?? []).filter((r) => r.detras).map((r, k) => (
        <Sequence key={`rd${k}`} from={Math.round(r.s * fps)} durationInFrames={Math.max(1, Math.round((r.e - r.s) * fps))}><RotuloCapa r={r} /></Sequence>
      ))}
      {edl.persona && <PersonaCapa edl={edl} />}
      {edl.broll.map((b, i) => (
        <Sequence key={i} from={Math.round(b.s * fps)} durationInFrames={Math.round((b.e - b.s) * fps)}><BrollCapa b={b} /></Sequence>
      ))}
      {(edl.fx ?? []).filter((x) => x.tipo === 'overlay' && x.src).map((x, i) => (
        <Sequence key={`o${i}`} from={Math.round(x.t * fps)} durationInFrames={Math.max(1, Math.round(x.dur * fps))}><Overlay x={x} /></Sequence>
      ))}
      <PanelCristal edl={edl} />
      {(edl.rotulos ?? []).filter((r) => !r.detras || !edl.persona).map((r, k) => (
        <Sequence key={`r${k}`} from={Math.round(r.s * fps)} durationInFrames={Math.max(1, Math.round((r.e - r.s) * fps))}><RotuloCapa r={r} /></Sequence>
      ))}
      <Subtitulos edl={edl} />
      {edl.titular?.texto && <Sequence durationInFrames={Math.round(edl.titular.hasta * fps)}><Titular texto={edl.titular.texto} hasta={edl.titular.hasta} y={edl.titular.y} /></Sequence>}
      {edl.cta && <Sequence from={Math.round(edl.cta.t * fps)}><Cta usuario={edl.cta.usuario} y={yCta(edl)} /></Sequence>}
      {(edl.fx ?? []).filter((x) => x.tipo === 'flash').map((x, i) => (
        <Sequence key={`f${i}`} from={Math.round(x.t * fps)} durationInFrames={Math.max(1, Math.round(x.dur * fps))}><Flash dur={x.dur} fuerza={x.fuerza ?? 1} /></Sequence>
      ))}
      {edl.acabado && <Acabado a={edl.acabado} />}
      {!edl.pistas?.sfx?.mute && edl.sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(s.t * fps))}><Audio src={recurso(s.src)} volume={(s.vol ?? 0.5) * (edl.pistas?.sfx?.vol ?? 1)} /></Sequence>
      ))}
      {edl.musica && !edl.pistas?.musica?.mute && <Audio src={recurso(edl.musica.src)} volume={edl.musica.vol} loop />}
    </AbsoluteFill>
  );
};
