import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Retiro de Emaús · mensaje 2 «No busques a Jesús fuera de tu historia» (19,2 s, 1080x1920, 30 fps).
// Tiempos = palabras del padre desde el inicio del corte (680,2 s del bruto).
// 0 «entra en ti mismo»: hombre triste a oscuras · 4,2 «busques… fuera»: fiesta con mujeres bailando y él sigue triste
// 9 «entra en lo más profundo»: la fiesta se apaga, el corazón empieza a brillar · 14,2 «y verás… luces de resucitado»: amanece y sube al cielo.

const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const T = { fiestaIn: 4.1, fiestaOut: 8.95, corazon: 10.2, luz: 14.2, levanta: 14.9, sube: 15.6, luces: 17.1 };

type Pose = Record<string, [number, number]>;
// de perfil, abrazado a las rodillas y con la cabeza apoyada en ellas (se lee como tristeza)
const SENTADO: Pose = {
  pel: [0, 0], cue: [30, -120], cab: [80, -126], hI: [26, -110], hD: [34, -112],
  coI: [92, -58], coD: [100, -60], maI: [112, -22], maD: [120, -24],
  caI: [-4, 0], caD: [4, 0], roI: [66, -82], roD: [74, -80], piI: [108, 36], piD: [116, 36],
};
const DE_PIE: Pose = {
  pel: [0, 0], cue: [0, -165], cab: [0, -214], hI: [-52, -152], hD: [52, -152],
  coI: [-120, -206], coD: [120, -206], maI: [-172, -262], maD: [172, -262],
  caI: [-24, 0], caD: [24, 0], roI: [-28, 95], roD: [28, 95], piI: [-34, 190], piD: [34, 190],
};
const mezcla = (a: Pose, b: Pose, p: number): Pose =>
  Object.fromEntries(Object.keys(a).map((k) => [k, [a[k][0] + (b[k][0] - a[k][0]) * p, a[k][1] + (b[k][1] - a[k][1]) * p]])) as Pose;

const azar = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const Linea: React.FC<{ a: [number, number]; b: [number, number]; w: number; color: string }> = ({ a, b, w, color }) => (
  <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={w} strokeLinecap="round" />
);

const Figura: React.FC<{ p: Pose; color: string }> = ({ p, color }) => (
  <g>
    <Linea a={p.pel} b={p.cue} w={80} color={color} />
    <Linea a={p.hI} b={p.hD} w={56} color={color} />
    <Linea a={p.caI} b={p.roI} w={40} color={color} /><Linea a={p.roI} b={p.piI} w={36} color={color} />
    <Linea a={p.caD} b={p.roD} w={40} color={color} /><Linea a={p.roD} b={p.piD} w={36} color={color} />
    <Linea a={p.hI} b={p.coI} w={32} color={color} /><Linea a={p.coI} b={p.maI} w={28} color={color} />
    <Linea a={p.hD} b={p.coD} w={32} color={color} /><Linea a={p.coD} b={p.maD} w={28} color={color} />
    <circle cx={p.cab[0]} cy={p.cab[1]} r={40} fill={color} />
  </g>
);

// mujer bailando: pelo largo, vestido, brazos arriba que se mueven al ritmo
const Mujer: React.FC<{ x: number; y: number; k: number; s: number; fase: number; color: string }> = ({ x, y, k, s, fase, color }) => {
  const b = Math.sin(s * 5.2 + fase), b2 = Math.sin(s * 5.2 + fase + 1.3);
  const cad = b * 14;
  return (
    <g transform={`translate(${x + cad * 0.6} ${y}) scale(${k}) rotate(${b * 4})`}>
      <ellipse cx={-6 + b * 6} cy={-178} rx={40} ry={62} fill={color} />
      <Linea a={[0, -60]} b={[0, -140]} w={50} color={color} />
      <path d={`M -26 -66 L 26 -66 L ${64 + b * 10} 42 L ${-64 + b * 10} 42 Z`} fill={color} strokeLinejoin="round" stroke={color} strokeWidth={12} />
      <Linea a={[-16, 40]} b={[-22 + b * 8, 150]} w={22} color={color} /><Linea a={[16, 40]} b={[20 - b * 8, 150]} w={22} color={color} />
      <Linea a={[-30, -132]} b={[-82, -186 + b * 24]} w={20} color={color} /><Linea a={[-82, -186 + b * 24]} b={[-58 + b2 * 22, -262]} w={18} color={color} />
      <Linea a={[30, -132]} b={[78, -196 - b * 20]} w={20} color={color} /><Linea a={[78, -196 - b * 20]} b={[60 - b2 * 24, -268]} w={18} color={color} />
      <circle cx={0} cy={-176} r={32} fill={color} />
    </g>
  );
};

const Nube: React.FC<{ x: number; y: number; k: number; o: number }> = ({ x, y, k, o }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`} opacity={o} filter="url(#suave)">
    {[[-120, 10, 70], [-50, -30, 95], [40, -20, 85], [120, 15, 65], [0, 25, 90]].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill="#FFFFFF" />
    ))}
  </g>
);

export const EmausFuera: React.FC = () => {
  const f = useCurrentFrame(), { fps } = useVideoConfig(), s = f / fps;

  // escenas (opacidades)
  const fiesta = interpolate(s, [T.fiestaIn, T.fiestaIn + 0.35, T.fiestaOut, T.fiestaOut + 0.6], [0, 1, 1, 0], c);
  const flash = interpolate(s, [T.fiestaIn, T.fiestaIn + 0.12, T.fiestaIn + 0.5], [0, 0.55, 0], c);
  const corazon = interpolate(s, [T.corazon, 13.2], [0, 1], { ...c, easing: io });
  const amanece = interpolate(s, [T.luz, 16.6], [0, 1], { ...c, easing: io });
  const cielo = interpolate(s, [16.2, 18.4], [0, 1], { ...c, easing: io });
  const estallido = interpolate(s, [T.luces, T.luces + 0.25, T.luces + 1.6], [0, 1, 0.55], c);

  // pose: sentado y hundido → levanta la cabeza con el corazón → de pie con brazos abiertos
  const sollozo = Math.max(0, Math.sin(s * 7.5)) * 5 * (1 - corazon);
  const p = interpolate(s, [T.levanta, T.sube + 0.6], [0, 1], { ...c, easing: io });
  const pose = mezcla(SENTADO, DE_PIE, p);
  pose.cab = [pose.cab[0] - corazon * 26 * (1 - p), pose.cab[1] - corazon * 30 * (1 - p) + sollozo];  // levanta la cabeza cuando le brilla el corazón
  pose.hI = [pose.hI[0], pose.hI[1] + sollozo * 0.6]; pose.hD = [pose.hD[0], pose.hD[1] + sollozo * 0.6];

  const SUELO = 1330, K = 1.75;
  const baseY = SUELO - (38 + (190 - 38) * p) * K;
  const subida = interpolate(s, [T.sube, 19.2], [0, 1], { ...c, easing: Easing.inOut(Easing.quad) });
  const figY = baseY - subida * 520 + Math.sin(s * 1.6) * 8 * subida;
  const pecho: [number, number] = [540 - 55 * (1 - p) + (36 - 20 * p) * K, figY + (pose.pel[1] + (pose.cue[1] - pose.pel[1]) * 0.62) * K];

  // color de la figura: silueta negra → figura de luz
  const luzFig = interpolate(s, [15.4, 17.4], [0, 1], c);
  const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
  const colorFig = mix([6, 7, 12], [255, 246, 224], luzFig);

  // cámara: acerca al pecho cuando brilla el corazón, abre cuando sube
  const zoom = 1 + 0.04 * (s / 9) + 0.22 * interpolate(s, [T.corazon, 13.8], [0, 1], { ...c, easing: io }) - 0.26 * amanece;
  const camY = interpolate(s, [T.corazon, 13.8, T.sube, 19.2], [0, -120, -120, 260], { ...c, easing: io });

  const latido = 1 + 0.12 * Math.pow(Math.max(0, Math.sin(s * Math.PI * 2 * 1.1)), 6) + 0.06 * Math.pow(Math.max(0, Math.sin(s * Math.PI * 2 * 1.1 - 0.9)), 6);
  const radioGlow = 40 + 160 * corazon + 900 * amanece;

  return (
    <AbsoluteFill style={{ background: "#05070d" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <radialGradient id="foco" cx="50%" cy="0%" r="100%"><stop offset="0%" stopColor="#c9d6ff" stopOpacity={0.32} /><stop offset="100%" stopColor="#c9d6ff" stopOpacity={0} /></radialGradient>
          <radialGradient id="charco" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8fa4d8" stopOpacity={0.35} /><stop offset="100%" stopColor="#8fa4d8" stopOpacity={0} /></radialGradient>
          <linearGradient id="fiestaBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a0433" /><stop offset="55%" stopColor="#5b0a6b" /><stop offset="100%" stopColor="#c2185b" /></linearGradient>
          <linearGradient id="alba" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1c2b5e" /><stop offset="45%" stopColor="#7a5fa8" /><stop offset="75%" stopColor="#f5a25d" /><stop offset="100%" stopColor="#ffe3a8" /></linearGradient>
          <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6fa8ff" /><stop offset="60%" stopColor="#cfe3ff" /><stop offset="100%" stopColor="#fff4dc" /></linearGradient>
          <radialGradient id="glow"><stop offset="0%" stopColor="#fff2c2" stopOpacity={1} /><stop offset="25%" stopColor="#ffc94a" stopOpacity={0.75} /><stop offset="60%" stopColor="#ff8a3d" stopOpacity={0.25} /><stop offset="100%" stopColor="#ff8a3d" stopOpacity={0} /></radialGradient>
          <radialGradient id="bola"><stop offset="0%" stopColor="#ffffff" /><stop offset="60%" stopColor="#b9b9c9" /><stop offset="100%" stopColor="#55556a" /></radialGradient>
          <filter id="suave"><feGaussianBlur stdDeviation="14" /></filter>
          <filter id="brillo" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="grano"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 30} /><feColorMatrix type="saturate" values="0" /></filter>
        </defs>

        {/* fondos */}
        <rect width={1080} height={1920} fill="#070a14" />
        <rect width={1080} height={1920} fill="url(#fiestaBg)" opacity={fiesta} />
        <rect width={1080} height={1920} fill="url(#alba)" opacity={amanece} />
        <rect width={1080} height={1920} fill="url(#cielo)" opacity={cielo} />

        {/* rayos de luz detrás de la figura */}
        <g opacity={amanece * 0.55 + estallido * 0.45} transform={`translate(540 ${figY - 200}) rotate(${s * 6})`}>
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d="M 0 0 L -60 -1600 L 60 -1600 Z" fill="#fff6d8" opacity={0.35} transform={`rotate(${(i * 360) / 14})`} />
          ))}
        </g>

        <g transform={`translate(540 ${960 + camY}) scale(${zoom}) translate(-540 -960)`}>
          {/* foco cenital de la escena oscura */}
          <g opacity={(1 - fiesta) * (1 - amanece)}>
            <path d="M 430 -50 L 650 -50 L 900 1400 L 180 1400 Z" fill="url(#foco)" />
            <ellipse cx={540} cy={SUELO + 10} rx={320} ry={48} fill="url(#charco)" />
            {Array.from({ length: 26 }, (_, i) => (
              <circle key={i} cx={300 + azar(i) * 480} cy={((azar(i + 50) * 1300 + s * (10 + azar(i + 9) * 18)) % 1300) + 60} r={1.5 + azar(i + 3) * 2.5} fill="#dfe6ff" opacity={0.35} />
            ))}
          </g>

          {/* fiesta: haces de luz, bola de discoteca, confeti y mujeres bailando */}
          <g opacity={fiesta}>
            {[["#ff4fd8", 0], ["#3df2ff", 2.1], ["#ffe14d", 4.2], ["#a35cff", 1]].map(([col, ph], i) => (
              <path key={i} d="M 0 0 L -170 1700 L 170 1700 Z" fill={col as string} opacity={0.22} style={{ mixBlendMode: "screen" }}
                transform={`translate(540 230) rotate(${Math.sin(s * 1.4 + (ph as number)) * 38})`} />
            ))}
            <line x1={540} y1={0} x2={540} y2={160} stroke="#888" strokeWidth={4} />
            <circle cx={540} cy={230} r={72} fill="url(#bola)" />
            {Array.from({ length: 18 }, (_, i) => {
              const a = (i / 18) * Math.PI * 2 + s * 1.6;
              return <rect key={i} x={540 + Math.cos(a) * 52 - 6} y={230 + Math.sin(a * 0.7) * 50 - 6} width={12} height={12} fill="#fff" opacity={0.4 + 0.6 * Math.max(0, Math.cos(a))} />;
            })}
            {Array.from({ length: 60 }, (_, i) => {
              const x = azar(i) * 1080 + Math.sin(s * 2 + i) * 20, y = ((azar(i + 100) * 1500 + (s - T.fiestaIn) * (180 + azar(i + 7) * 160)) % 1500) + 280;
              const col = ["#ff4fd8", "#3df2ff", "#ffe14d", "#ffffff"][i % 4];
              return <rect key={i} x={x} y={y} width={10} height={18} fill={col} opacity={0.8} transform={`rotate(${s * 200 + i * 40} ${x + 5} ${y + 9})`} />;
            })}
            <Mujer x={420} y={1080} k={1.05} s={s} fase={0.5} color="#12031c" />
            <Mujer x={170} y={1180} k={1.45} s={s} fase={0} color="#0a0210" />
            <Mujer x={900} y={1170} k={1.4} s={s} fase={2.2} color="#0a0210" />
            <Mujer x={690} y={1070} k={1.0} s={s} fase={3.6} color="#12031c" />
          </g>

          {/* sombra en el suelo (se va cuando sube) */}
          <ellipse cx={540} cy={SUELO + 6} rx={150} ry={22} fill="#000" opacity={0.45 * (1 - subida) * (1 - cielo)} />

          {/* el hombre */}
          <g transform={`translate(${540 - 55 * (1 - p)} ${figY}) scale(${K})`} filter={luzFig > 0.05 ? "url(#brillo)" : undefined}>
            <Figura p={pose} color={colorFig} />
          </g>

          {/* corazón que brilla y late */}
          <g opacity={Math.max(corazon, amanece)}>
            <circle cx={pecho[0]} cy={pecho[1]} r={radioGlow * latido} fill="url(#glow)" style={{ mixBlendMode: "screen" }} />
            <path d="M 0 24 C -52 -8 -40 -54 0 -30 C 40 -54 52 -8 0 24 Z" fill={mix([255, 70, 60], [255, 214, 120], amanece)}
              transform={`translate(${pecho[0]} ${pecho[1]}) scale(${(0.55 + 0.45 * corazon) * latido})`} filter="url(#brillo)" />
          </g>

          {/* nubes: aparecen debajo cuando sube */}
          {[[200, 1500, 1.4], [860, 1560, 1.6], [540, 1700, 2.0], [80, 1780, 1.5], [1000, 1820, 1.3], [380, 1300, 1.0], [760, 1280, 0.9]].map(([x, y, k], i) => (
            <Nube key={i} x={x + Math.sin(s * 0.4 + i) * 20} y={y + 420 - subida * 520} k={k} o={0.92 * cielo} />
          ))}
        </g>

        {/* destello al entrar la fiesta y al decir «luces» */}
        <rect width={1080} height={1920} fill="#ffffff" opacity={flash * 0.6 + estallido * 0.3 * (1 - cielo * 0.5)} />
        {/* viñeta y grano */}
        <rect width={1080} height={1920} fill="url(#foco)" opacity={0} />
        <rect width={1080} height={1920} filter="url(#grano)" opacity={0.07} style={{ mixBlendMode: "overlay" }} />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)", opacity: 1 - cielo * 0.7 }} />
    </AbsoluteFill>
  );
};
