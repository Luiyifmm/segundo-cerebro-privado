import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Prueba de estilo "como Julián" (@julianealborna, referencia del usuario del 10-10-2026) para AMIN_1010_01:
// fondo negro con grano, figuras blancas mates con resplandor, un solo acento (azul de Amin), líneas finas luminosas
// que se acumulan, texto fino y pequeño que se escribe palabra a palabra, cambio de escena por desenfoque.
// Frase (voz desde 98,07 s de la secuencia): "si en algún momento de tu vida quieres ser libre de verdad,
// tienes que romper con la programación mental que ya tienes".
const AZUL = "#1E8BFF";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const azar = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const suave = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const T_LIBRE = 2.96, T_CAMBIO = 3.72, T_ROMPER = 4.24, T_MENTAL = 6.14;

type Palabra = [string, number, boolean?];
const Texto: React.FC<{ lineas: Palabra[][]; x: number; y: number; t: number; tam?: number }> = ({ lineas, x, y, t, tam = 60 }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: "'SF Pro Display', -apple-system, 'Helvetica Neue', sans-serif", fontSize: tam, lineHeight: 1.12, letterSpacing: -1.6, color: "#fff" }}>
    {lineas.map((l, i) => (
      <div key={i} style={{ whiteSpace: "nowrap" }}>
        {l.map(([p, a, clave], k) => { const e = interpolate(t, [a, a + 0.2], [0, 1], clamp); return (
          <span key={k} style={{ display: "inline-block", marginRight: tam * 0.24, fontWeight: clave ? 600 : 300, opacity: t < a ? 0 : 0.35 + 0.65 * e, filter: `blur(${(1 - e) * 6}px)`, textShadow: `0 0 ${clave ? 26 : 16}px rgba(255,255,255,${clave ? 0.75 : 0.45})`, transform: `translateY(${(1 - e) * 8}px)` }}>{p}</span>); })}
      </div>
    ))}
  </div>
);

// Material mate: degradado de arcilla + copia desenfocada detrás (resplandor) + aberración de color leve.
const Mate: React.FC<{ id: string; w: number; h: number; children: React.ReactNode; glow?: number; style?: React.CSSProperties }> = ({ id, w, h, children, glow = 1, style }) => (
  <div style={{ position: "absolute", width: w, height: h, ...style }}>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", overflow: "visible", filter: "blur(34px)", opacity: 0.55 * glow }}><g fill="#fff" stroke="#fff">{children}</g></svg>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", overflow: "visible", filter: "blur(7px)", opacity: 0.7 * glow }}><g fill="#fff" stroke="#fff">{children}</g></svg>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", overflow: "visible", left: -2, opacity: 0.5, mixBlendMode: "screen" }}><g fill="#ff5a5a" stroke="#ff5a5a">{children}</g></svg>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", overflow: "visible", left: 2, opacity: 0.5, mixBlendMode: "screen" }}><g fill="#5ab4ff" stroke="#5ab4ff">{children}</g></svg>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1={w * 0.2} y1={0} x2={w * 0.8} y2={h}><stop offset="0" stopColor="#ffffff" /><stop offset="0.45" stopColor="#e2e2e4" /><stop offset="1" stopColor="#8c8c92" /></linearGradient>
        <filter id={`${id}-n`}><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="3" /><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.16 0" /><feComposite in2="SourceGraphic" operator="in" /></filter>
      </defs>
      <g fill={`url(#${id}-g)`} stroke={`url(#${id}-g)`}>{children}</g>
      <g fill="#000" stroke="#000" filter={`url(#${id}-n)`}>{children}</g>
    </svg>
  </div>
);

const Linea: React.FC<{ d: string; p: number; largo: number; ancho?: number; color?: string; o?: number }> = ({ d, p, largo, ancho = 3, color = "#fff", o = 1 }) => (
  <g opacity={o}>
    <path d={d} fill="none" stroke={color} strokeWidth={ancho * 4} strokeLinecap="round" strokeDasharray={largo} strokeDashoffset={largo * (1 - p)} opacity={0.25} style={{ filter: "blur(8px)" }} />
    <path d={d} fill="none" stroke={color} strokeWidth={ancho} strokeLinecap="round" strokeDasharray={largo} strokeDashoffset={largo * (1 - p)} />
  </g>
);

const Fondo: React.FC<{ suelo: number; frame: number }> = ({ suelo, frame }) => (
  <>
    <AbsoluteFill style={{ background: "radial-gradient(900px 1100px at 50% 46%, #0e0e11 0%, #060608 60%, #020203 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: suelo, bottom: 0, background: "linear-gradient(#1a1a1e 0%, #0d0d10 22%, #040405 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: suelo - 2, height: 4, background: "rgba(255,255,255,0.10)", filter: "blur(3px)" }} />
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.1 }}><svg width="100%" height="100%"><filter id="grano"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 11} /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#grano)" /></svg></AbsoluteFill>
  </>
);

// Escena 1 (corrección del usuario, 10-10-2026): la figura golpea los barrotes de la celda y al final ("libre") los rompe y sale.
const GOLPES = [0.78, 1.32, 2.02];
const Escena1: React.FC<{ t: number }> = ({ t }) => {
  const SUELO = 1240, entra = suave((t - 0.05) / 0.4), rota = t - T_LIBRE, libre = suave(rota / 0.3), pulso = 1 + 0.08 * Math.sin(t * 7);
  const pu = (g: number) => (t < g - 0.09 ? 0 : t < g ? (t - (g - 0.09)) / 0.09 : Math.max(0, 1 - (t - g) / 0.24));
  const p = Math.max(pu(GOLPES[0]), pu(GOLPES[1]), pu(GOLPES[2]), t < T_LIBRE - 0.1 ? 0 : t < T_LIBRE ? (t - (T_LIBRE - 0.1)) / 0.1 : Math.max(0.25, 1 - rota / 0.5));
  const ultimo = [...GOLPES, T_LIBRE].filter((g) => t >= g).pop(), dt = ultimo === undefined ? 9 : t - ultimo, vib = Math.sin(dt * 95) * Math.exp(-dt * 9);
  const sale = suave((t - T_LIBRE - 0.12) / 0.55) * 150, PX = 390 + p * 14 + sale, FX = 236 + p * 62, FY = 340 - p * 168;
  const barras = [330, 400, 470, 540, 610, 680, 750];
  const cuerpo = (<>
    <circle cx={150 + p * 6} cy={62} r={54} stroke="none" />
    <path d="M92 138 Q150 116 208 138 L216 338 Q150 356 84 338 Z" stroke="none" />
    <line x1={86} y1={150} x2={64 - p * 10} y2={340} strokeWidth={40} strokeLinecap="round" />
    <line x1={214} y1={150} x2={FX} y2={FY} strokeWidth={40} strokeLinecap="round" />
    <circle cx={FX} cy={FY} r={26} stroke="none" />
    <line x1={118} y1={340} x2={104 - p * 8} y2={596} strokeWidth={50} strokeLinecap="round" />
    <line x1={182} y1={340} x2={196 + p * 8} y2={596} strokeWidth={50} strokeLinecap="round" />
  </>);
  const IX = 680, IY = SUELO - 620 + 172;   // punto de impacto
  return (<>
    <Fondo suelo={SUELO} frame={Math.round(t * 30)} />
    <div style={{ position: "absolute", left: PX, top: SUELO + 6, width: 300, height: 620, transform: "scaleY(-0.55)", transformOrigin: "50% 0", opacity: 0.1 * entra, filter: "blur(10px)" }}><svg width={300} height={620}><g fill="#fff" stroke="#fff">{cuerpo}</g></svg></div>
    <Mate id="f1" w={300} h={620} style={{ left: PX, top: SUELO - 620, opacity: entra }} glow={0.9 + libre * 0.4}>{cuerpo}</Mate>
    {/* acento: único punto de color, se enciende al romper */}
    <div style={{ position: "absolute", left: PX + 150 - 90, top: SUELO - 620 + 215 - 90, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${AZUL} 0%, ${AZUL}aa 28%, ${AZUL}00 68%)`, opacity: libre, transform: `scale(${libre * pulso})`, filter: "blur(6px)", mixBlendMode: "screen" }} />
    <div style={{ position: "absolute", left: PX + 150 - 20, top: SUELO - 620 + 215 - 20, width: 40, height: 40, borderRadius: "50%", background: "#d7ecff", boxShadow: `0 0 26px 10px ${AZUL}`, opacity: libre, transform: `scale(${libre * pulso})` }} />
    <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
      {barras.map((x, i) => { const pd = suave((t - 0.2 - i * 0.05) / 0.4), cerca = i >= 4 ? 1 : 0.25, dx = vib * 11 * cerca * (dt < 0.6 ? 1 : 0);
        if (i >= 4 && rota > 0) { // barrote roto en tres trozos que salen despedidos
          return [0, 1, 2].map((k) => { const y0 = 600 + k * (SUELO - 600) / 3, y1 = y0 + (SUELO - 600) / 3 - 14, r = rota, vx = 260 + azar(i * 7 + k) * 420, vy = -380 + k * 260 + azar(i + k * 3) * 160, x2 = x + vx * r, yy = vy * r + 900 * r * r, giro = (azar(i * 3 + k) - 0.3) * 520 * r, o = interpolate(r, [0, 0.45, 0.75], [1, 0.9, 0], clamp);
            return <g key={`${i}-${k}`} transform={`translate(${x2 - x} ${yy}) rotate(${giro} ${x} ${(y0 + y1) / 2})`} opacity={o}><Linea d={`M${x} ${y0} L${x} ${y1}`} p={1} largo={y1 - y0} ancho={3.4} /></g>; }); }
        return <Linea key={i} d={`M${x + dx} 600 Q${x + dx * 2.2} ${IY} ${x + dx} ${SUELO}`} p={pd} largo={SUELO - 590} ancho={3} o={0.9} />; })}
      {rota <= 0 ? <Linea d="M330 600 L750 600" p={suave((t - 0.55) / 0.4)} largo={420} ancho={3} o={0.9} /> : <><Linea d="M330 600 L575 600" p={1} largo={245} ancho={3} o={0.9} /><g transform={`translate(${rota * 300} ${-rota * 260 + 900 * rota * rota}) rotate(${rota * 160} 660 600)`} opacity={interpolate(rota, [0, 0.45, 0.75], [1, 0.9, 0], clamp)}><Linea d="M585 600 L750 600" p={1} largo={165} ancho={3} /></g></>}
      {/* chispa en cada golpe */}
      {[...GOLPES, T_LIBRE].map((g, k) => { const d = t - g; if (d < 0 || d > 0.3) return null; const fuerte = k === 3 ? 1.9 : 1, e = d / 0.3; return <g key={k} opacity={1 - e}>
        <circle cx={IX} cy={IY} r={(18 + e * 90) * fuerte} fill="none" stroke={k === 3 ? "#bfe0ff" : "#fff"} strokeWidth={5 * (1 - e) + 1} />
        {Array.from({ length: k === 3 ? 14 : 8 }).map((_, j) => { const a = j / (k === 3 ? 14 : 8) * Math.PI * 2 + k, r0 = (26 + e * 60) * fuerte, r1 = (46 + e * 130) * fuerte; return <line key={j} x1={IX + Math.cos(a) * r0} y1={IY + Math.sin(a) * r0} x2={IX + Math.cos(a) * r1} y2={IY + Math.sin(a) * r1} stroke="#fff" strokeWidth={3} strokeLinecap="round" />; })}</g>; })}
    </svg>
    <Texto t={t} x={150} y={330} lineas={[[["si", 0.34], ["en", 0.56], ["algún", 0.78], ["momento", 1.32]], [["de", 1.58], ["tu", 1.76], ["vida", 2.02], ["quieres", 2.28], ["ser", 2.58]], [["libre", T_LIBRE, true], ["de", 3.16], ["verdad", 3.48]]]} />
  </>);
};

// Cerebro de perfil: silueta con circunvoluciones, surcos, cerebelo y tallo.
const C_BORDE = "M95 270 C80 200 120 130 190 110 C230 85 300 85 340 105 C400 110 440 160 440 215 C455 250 440 300 400 315 C390 350 340 365 300 350 C280 372 240 372 222 352 C190 385 130 370 118 330 C95 320 88 295 95 270 Z";
const C_BULTOS: [number, number, number][] = [[112, 250, 34], [128, 190, 36], [170, 140, 36], [225, 112, 34], [285, 106, 34], [345, 124, 34], [398, 160, 34], [422, 215, 32], [418, 270, 30], [380, 310, 30], [330, 338, 28], [280, 344, 26]];
const C_SURCOS = ["M408 296 C350 276 296 292 232 252", "M296 96 C272 150 306 196 268 250", "M352 122 C330 170 372 200 350 250 S372 280 352 300", "M232 106 C214 150 250 180 222 226 S214 262 190 280", "M166 138 C150 180 186 206 160 250 S150 286 130 300", "M408 176 C386 190 400 226 430 232", "M250 262 C286 282 318 276 340 318", "M120 232 C140 222 150 244 176 236", "M196 300 C230 286 262 310 300 330", "M126 326 C150 314 186 316 214 334", "M124 342 C152 330 190 334 218 348", "M134 358 C160 348 190 352 212 362"];
const C_FORMA = (<><path d={C_BORDE} stroke="none" />{C_BULTOS.map(([x, y, r], k) => <circle key={k} cx={x} cy={y} r={r} stroke="none" />)}<path d="M236 340 C240 380 252 410 276 432 L306 420 C286 398 280 370 282 340 Z" stroke="none" /></>);

// Escena 2 (corrección del usuario): cabeza de perfil con el cerebro encadenado; las cadenas se rompen una a una
// ("romper", "programación", "mental") y ahí termina, con el cerebro libre y encendido. Sin elemento azul.
const CABEZA = "M250 30 C110 30 30 140 30 280 C30 400 90 470 150 520 C170 560 170 620 150 700 L-120 800 L-120 1300 L760 1300 L760 860 C600 800 440 740 400 690 C390 650 395 610 410 585 C450 590 490 575 500 540 C505 520 498 505 500 490 C503 475 512 470 510 455 C540 450 552 440 540 420 C525 385 505 350 500 320 C500 180 420 30 250 30 Z";
const T_PROG = 5.24;
const CADENAS: { a: [number, number]; c: [number, number]; b: [number, number]; rompe: number }[] = [
  { a: [70, 170], c: [260, 140], b: [462, 300], rompe: T_ROMPER }, { a: [78, 332], c: [270, 336], b: [452, 150], rompe: T_PROG },
  { a: [150, 86], c: [176, 262], b: [334, 414], rompe: T_MENTAL }, { a: [384, 88], c: [362, 262], b: [188, 414], rompe: T_MENTAL + 0.04 }];
const bez = (q: typeof CADENAS[number], u: number): [number, number, number] => { const x = (1 - u) * (1 - u) * q.a[0] + 2 * u * (1 - u) * q.c[0] + u * u * q.b[0], y = (1 - u) * (1 - u) * q.a[1] + 2 * u * (1 - u) * q.c[1] + u * u * q.b[1], dx = 2 * (1 - u) * (q.c[0] - q.a[0]) + 2 * u * (q.b[0] - q.c[0]), dy = 2 * (1 - u) * (q.c[1] - q.a[1]) + 2 * u * (q.b[1] - q.c[1]); return [x, y, Math.atan2(dy, dx) * 180 / Math.PI]; };
const Escena2: React.FC<{ t: number }> = ({ t }) => {
  const E = 1.45, X = 170, Y = 800, rotas = CADENAS.filter((q) => t >= q.rompe).length, libre = suave((t - T_MENTAL) / 0.4), pulso = 1 + 0.03 * Math.sin((t - T_MENTAL) * 6) * libre, N = 17;
  const brillo = 0.35 + rotas * 0.12 + libre * 0.55;
  return (<>
    <Fondo suelo={1700} frame={Math.round(t * 30)} />
    <div style={{ position: "absolute", left: X, top: Y, transform: `scale(${E})`, transformOrigin: "0 0" }}>
      <Mate id="f2" w={640} h={1300} glow={0.8}><path d={CABEZA} stroke="none" /></Mate>
      <div style={{ position: "absolute", left: 262 - 205, top: 250 - 178, width: 410, height: 356, borderRadius: "50%", background: "radial-gradient(closest-side, #060608 0%, #0b0b0e 78%, rgba(11,11,14,0) 100%)", opacity: suave((t - T_CAMBIO) / 0.3) * 0.94 }} />
      {/* cerebro: apagado mientras está encadenado, se enciende al quedar libre */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 640, height: 1300, transform: `scale(${0.74 * pulso})`, transformOrigin: "268px 240px", opacity: suave((t - T_CAMBIO - 0.05) / 0.3), filter: `brightness(${brillo})` }}>
        <Mate id="cb" w={640} h={1300} glow={0.25 + libre * 1.1}>{C_FORMA}</Mate>
        <svg width={640} height={1300} style={{ position: "absolute", overflow: "visible" }}><defs><clipPath id="cbclip">{C_FORMA}</clipPath></defs><g clipPath="url(#cbclip)">{C_SURCOS.map((d, k) => <path key={k} d={d} fill="none" stroke="#3a3a42" strokeWidth={8} strokeLinecap="round" opacity={0.55} />)}</g></svg>
      </div>
      <svg width={640} height={1300} style={{ position: "absolute", overflow: "visible" }}>
        {/* rayos finos al quedar libre */}
        {Array.from({ length: 9 }).map((_, k) => { const a = (-200 + k * 26) * Math.PI / 180, r0 = 215, r1 = 300 + azar(k + 3) * 90, d = t - T_MENTAL, pp = suave((d - 0.08 - k * 0.025) / 0.35), o = interpolate(d, [0.08, 0.45, 1.2], [0, 0.9, 0.35], clamp), x0 = 268 + Math.cos(a) * r0, y0 = 232 + Math.sin(a) * r0 * 0.86, x1 = 268 + Math.cos(a) * r1, y1 = 232 + Math.sin(a) * r1 * 0.86; return <Linea key={k} d={`M${x0} ${y0} L${x1} ${y1}`} p={pp} largo={Math.hypot(x1 - x0, y1 - y0)} ancho={2.2} o={o} />; })}
        {/* cadenas: eslabones a lo largo de cada curva */}
        {CADENAS.map((q, ci) => Array.from({ length: N }).map((_, k) => { const u = k / (N - 1), [x, y, ang] = bez(q, u), ap = suave((t - T_CAMBIO - 0.08 - ci * 0.05 - k * 0.012) / 0.14), r = Math.max(0, t - q.rompe - Math.abs(u - 0.5) * 0.12);
          const lado = u < 0.5 ? -1 : 1, dx = r > 0 ? lado * (40 + azar(ci * 31 + k) * 260) * r + (azar(k + ci) - 0.5) * 80 * r : 0, dy = r > 0 ? (-120 - azar(ci * 17 + k * 3) * 160) * r + 760 * r * r : 0, giro = r > 0 ? (azar(ci * 5 + k) - 0.5) * 700 * r : 0, o = ap * interpolate(r, [0, 0.7, 1.15], [1, 0.85, 0], clamp);
          const tension = r <= 0 && t > q.rompe - 0.25 ? Math.sin(t * 80 + k) * 1.6 : 0;
          return <g key={`${ci}-${k}`} transform={`translate(${x + dx + tension} ${y + dy}) rotate(${ang + giro})`} opacity={o}>
            {k % 2 === 0 ? <ellipse cx={0} cy={0} rx={15} ry={8.5} fill="none" stroke="#fff" strokeWidth={4.2} style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.8))" }} /> : <line x1={-13} y1={0} x2={13} y2={0} stroke="#fff" strokeWidth={5.5} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.8))" }} />}
          </g>; }))}
        {/* chispa en cada rotura */}
        {CADENAS.slice(0, 3).map((q, k) => { const d = t - q.rompe; if (d < 0 || d > 0.32) return null; const e = d / 0.32, [x, y] = bez(q, 0.5), f = k === 2 ? 2 : 1.1; return <g key={k} opacity={1 - e}><circle cx={k === 2 ? 268 : x} cy={k === 2 ? 240 : y} r={(20 + e * 110) * f} fill="none" stroke="#fff" strokeWidth={5 * (1 - e) + 1} /></g>; })}
      </svg>
    </div>
    <Texto t={t} x={120} y={300} lineas={[[["tienes", 3.88], ["que", 4.02], ["romper", T_ROMPER, true]], [["con", 4.86], ["la", 4.98], ["programación", T_PROG]], [["mental", T_MENTAL, true], ["que", 6.42], ["ya", 6.64], ["tienes", 7.14]]]} />
  </>);
};

export const AminLibreJulian: React.FC = () => {
  const frame = useCurrentFrame(), { fps, durationInFrames } = useVideoConfig(), t = frame / fps;
  const sale1 = interpolate(t, [T_CAMBIO - 0.22, T_CAMBIO + 0.05], [0, 1], clamp), entra2 = interpolate(t, [T_CAMBIO - 0.05, T_CAMBIO + 0.3], [0, 1], clamp);
  const R = [[T_LIBRE, 0.3, 12], [T_ROMPER, 0.22, 10], [T_PROG, 0.26, 12], [T_MENTAL, 0.5, 20]];
  let destello = 0, golpe = 0; R.forEach(([g, f, s]) => { destello = Math.max(destello, interpolate(t, [g - 0.03, g + 0.03, g + 0.24], [0, f, 0], clamp)); if (t > g && t < g + 0.3) golpe = (azar(frame) - 0.5) * s * (1 - (t - g) / 0.3); });
  const fin = interpolate(frame, [durationInFrames - 5, durationInFrames - 1], [1, 0], clamp), ini = interpolate(frame, [0, 4], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#030304", opacity: Math.min(fin, ini) }}>
      {t < T_CAMBIO + 0.06 && <AbsoluteFill style={{ transform: `translate(${t < T_CAMBIO - 0.2 ? golpe : 0}px, 0px) scale(${1 + t * 0.014 + suave(sale1) * 0.9})`, transformOrigin: "50% 42%", filter: `blur(${sale1 * 30}px) brightness(${1 + sale1 * 0.8})`, opacity: 1 - interpolate(sale1, [0.7, 1], [0, 1], clamp) }}><Escena1 t={t} /></AbsoluteFill>}
      {t >= T_CAMBIO - 0.05 && <AbsoluteFill style={{ transform: `translate(${golpe}px, ${-golpe * 0.6}px) scale(${0.82 + 0.18 * suave(entra2) + (t - T_CAMBIO) * 0.012})`, transformOrigin: "50% 60%", filter: `blur(${(1 - entra2) * 30}px) brightness(${1 + (1 - entra2) * 0.8})`, opacity: interpolate(entra2, [0, 0.35], [0, 1], clamp) }}><Escena2 t={t} /></AbsoluteFill>}
      <AbsoluteFill style={{ background: "#fff", opacity: destello, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(1100px 1500px at 50% 45%, transparent 48%, rgba(0,0,0,0.78) 100%)" }} />
    </AbsoluteFill>
  );
};

// "La escuela te programa para ser un empleado obediente" (3,4 s; voz desde 94,8 s): entra un niño por la línea,
// la puerta se enciende en azul (el programa) y salen empleados idénticos, con la cabeza baja y colgados de hilos.
const T_PROGRAMA = 1.23, T_OBEDIENTE = 2.72;
const Figura: React.FC<{ id: string; x: number; suelo: number; esc: number; o?: number; baja?: number; corbata?: boolean; glow?: number }> = ({ id, x, suelo, esc, o = 1, baja = 0, corbata, glow = 0.8 }) => (
  <div style={{ position: "absolute", left: x - 150 * esc, top: suelo - 620 * esc, width: 300, height: 620, transform: `scale(${esc})`, transformOrigin: "0 0", opacity: o }}>
    <Mate id={id} w={300} h={620} glow={glow}>
      <g transform={`rotate(${baja * 24} 150 118) translate(0 ${baja * 10})`}><circle cx={150} cy={62} r={54} stroke="none" /></g>
      <path d="M92 138 Q150 116 208 138 L216 338 Q150 356 84 338 Z" stroke="none" />
      <line x1={86} y1={150} x2={64} y2={340} strokeWidth={40} strokeLinecap="round" />
      <line x1={214} y1={150} x2={236} y2={340} strokeWidth={40} strokeLinecap="round" />
      <line x1={118} y1={340} x2={112} y2={596} strokeWidth={50} strokeLinecap="round" />
      <line x1={182} y1={340} x2={188} y2={596} strokeWidth={50} strokeLinecap="round" />
    </Mate>
    {corbata && <svg width={300} height={620} style={{ position: "absolute" }}><path d="M138 136 L162 136 L158 160 L170 250 L150 276 L130 250 L142 160 Z" fill="#17171b" /></svg>}
  </div>
);
export const AminEscuelaJulian: React.FC = () => {
  const frame = useCurrentFrame(), { fps, durationInFrames } = useVideoConfig(), t = frame / fps, SUELO = 1250, PX = 380;
  const ini = interpolate(frame, [0, 4], [0, 1], clamp), sale = interpolate(frame, [durationInFrames - 7, durationInFrames - 1], [0, 1], clamp);
  const edificio = suave((t - 0.05) / 0.45), nino = interpolate(t, [0.25, 1.2], [0, 1], clamp), prog = suave((t - T_PROGRAMA) / 0.3), pulso = 1 + 0.1 * Math.sin(t * 9), obed = suave((t - T_OBEDIENTE) / 0.3);
  const emp = [1.93, 2.18, 2.43].map((a, i) => ({ p: suave((t - a) / 0.38), x: PX + (300 + i * 135) * suave((t - a) / 0.38), k: i }));
  return (
    <AbsoluteFill style={{ backgroundColor: "#030304", opacity: ini }}>
      <AbsoluteFill style={{ transform: `scale(${1 + t * 0.016 + sale * 0.5})`, transformOrigin: "50% 48%", filter: `blur(${sale * 26}px) brightness(${1 + sale * 0.7})`, opacity: 1 - interpolate(sale, [0.75, 1], [0, 1], clamp) }}>
        <Fondo suelo={SUELO} frame={frame} />
        <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}><Linea d={`M-20 ${SUELO} L1100 ${SUELO}`} p={suave(t / 0.6)} largo={1120} ancho={3} o={0.8} /></svg>
        {/* niño que entra */}
        <Figura id="nino" x={-60 + nino * (PX + 60)} suelo={SUELO - Math.abs(Math.sin(nino * Math.PI * 5)) * 10} esc={0.3} o={interpolate(nino, [0, 0.08, 0.88, 1], [0, 1, 1, 0], clamp)} />
        {/* escuela */}
        <div style={{ position: "absolute", left: 0, top: 0, opacity: edificio, transform: `translateY(${(1 - edificio) * 30}px)` }}>
          <Mate id="esc" w={1080} h={1920} glow={0.75}>
            <rect x={150} y={SUELO - 390} width={460} height={390} stroke="none" />
            <path d={`M118 ${SUELO - 390} L380 ${SUELO - 560} L642 ${SUELO - 390} Z`} stroke="none" />
            <rect x={350} y={SUELO - 650} width={60} height={110} stroke="none" />
            <path d={`M336 ${SUELO - 650} L380 ${SUELO - 700} L424 ${SUELO - 650} Z`} stroke="none" />
          </Mate>
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            {[190, 270, 440, 520].map((x) => [SUELO - 340, SUELO - 210].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width={50} height={86} rx={4} fill="#0b0b0e" opacity={0.92} />))}
            <circle cx={380} cy={SUELO - 455} r={30} fill="#0b0b0e" opacity={0.92} />
            <rect x={PX - 46} y={SUELO - 170} width={92} height={170} rx={6} fill="#08080a" />
          </svg>
          {/* acento único: la puerta-programa */}
          <div style={{ position: "absolute", left: PX - 46, top: SUELO - 170, width: 92, height: 170, borderRadius: 6, background: `linear-gradient(#cfe6ff, ${AZUL} 55%, #0a3f93)`, opacity: prog, boxShadow: `0 0 ${50 * pulso}px ${14 * pulso}px ${AZUL}, 0 0 160px 40px ${AZUL}66` }} />
          <div style={{ position: "absolute", left: PX - 220, top: SUELO - 6, width: 440, height: 200, background: `radial-gradient(closest-side, ${AZUL}66, ${AZUL}00)`, opacity: prog * 0.7, transform: "scaleY(0.35)", transformOrigin: "50% 0", filter: "blur(10px)" }} />
        </div>
        {/* empleados idénticos + hilos */}
        <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>{emp.map((e) => <Linea key={e.k} d={`M${e.x} 600 L${e.x} ${SUELO - 620 * 0.42 + 8}`} p={suave((t - T_OBEDIENTE - e.k * 0.05) / 0.3)} largo={SUELO - 620 * 0.42 - 592} ancho={2.2} o={0.85} />)}
          <Linea d={`M${PX + 270} 600 L${PX + 600} 600`} p={suave((t - T_OBEDIENTE) / 0.35)} largo={330} ancho={3} o={0.85} /></svg>
        {emp.map((e) => <Figura key={e.k} id={`e${e.k}`} x={e.x} suelo={SUELO} esc={0.42} o={interpolate(e.p, [0, 0.25], [0, 1], clamp)} baja={obed} corbata glow={0.7} />)}
        <Texto t={t} x={120} y={300} lineas={[[["la", 0.07], ["escuela", 0.4], ["te", 0.95]], [["programa", T_PROGRAMA, true], ["para", 1.6], ["ser", 1.78]], [["un", 1.93], ["empleado", 2.15], ["obediente", T_OBEDIENTE, true]]]} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(1100px 1500px at 50% 45%, transparent 48%, rgba(0,0,0,0.78) 100%)" }} />
    </AbsoluteFill>
  );
};
