import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import palabras from "./palabras.json";

// Motion graphics del panel superior (1080×900) y subtítulos "limpios": blanco pequeño + palabra clave grande en azul, sin caja.
const AZ = "#1E7BFF", AZ2 = "#5CC0FF", TINTA = "#141414", GRIS = "#BDB8AE";
const SF = "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Capa = any;
type Palabra = { t: string; a: number; b: number };
const P = palabras as Palabra[];
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ]/g, "");
const CLAVES = new Set(["noche", "vida", "cosa", "respetan", "tiempo", "prosperar", "innegable", "proyectas", "afuera", "mundo", "tratar", "valorar", "sigueme"]);
const LINEAS = (() => {
  const out: Palabra[][] = []; let cur: Palabra[] = [];
  for (const p of P) { const prev = cur[cur.length - 1]; if (prev && (cur.length >= 3 || p.a - prev.b > 0.3 || /[.,?]$/.test(prev.t))) { out.push(cur); cur = []; } cur.push(p); }
  if (cur.length) out.push(cur);
  // una palabra clave suelta se une a la línea anterior para que se lea "para toda la / VIDA"
  const o2: Palabra[][] = [];
  for (const l of out) { const u = o2[o2.length - 1]; if (u && l.length === 1 && CLAVES.has(norm(l[0].t)) && l[0].a - u[u.length - 1].b < 0.35 && !u.some((p) => CLAVES.has(norm(p.t)))) u.push(l[0]); else o2.push([...l]); }
  return o2;
})();

export const SubsLimpios: React.FC<{ c: Capa }> = ({ c }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const vel = c.vel || 1, t = (frame / fps) * vel;
  let l: Palabra[] | null = null;
  for (let i = LINEAS.length - 1; i >= 0; i--) if (t >= LINEAS[i][0].a - 0.04) { l = t < LINEAS[i][LINEAS[i].length - 1].b + 0.35 ? LINEAS[i] : null; break; }
  if (!l) return null;
  const filas: { clave: boolean; ps: Palabra[] }[] = [];
  for (const p of l) { const k = CLAVES.has(norm(p.t)); const u = filas[filas.length - 1]; if (!k && u && !u.clave) u.ps.push(p); else filas.push({ clave: k, ps: [p] }); }
  return (
    <div style={{ position: "absolute", top: c.y, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: SF, fontWeight: 700, lineHeight: 1 }}>
      {filas.map((f, i) => (
        <div key={i} style={{ display: "flex", gap: f.clave ? 0 : 16, marginTop: f.clave && i ? -8 : 0 }}>
          {f.ps.map((p, j) => {
            const s = spring({ frame: frame - Math.round((p.a / vel) * fps), fps, config: { damping: 13, mass: 0.45 } });
            const dentro = t >= p.a - 0.04;
            return f.clave ? (
              <span key={j} style={{ fontSize: 124, letterSpacing: -4, background: `linear-gradient(180deg, ${AZ2}, ${AZ})`, WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.55))", opacity: dentro ? 1 : 0, transform: `scale(${0.8 + 0.2 * s})`, paddingBottom: 12 }}>{p.t.replace(/[.,]$/, "").toLowerCase()}</span>
            ) : (
              <span key={j} style={{ fontSize: 58, color: "white", textShadow: "0 3px 14px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.7)", opacity: dentro ? 1 : 0, transform: `translateY(${(1 - s) * 14}px)` }}>{p.t.replace(/[.,]$/, "")}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Persona: React.FC<{ x: number; y: number; k?: number; color?: string; relleno?: boolean }> = ({ x, y, k = 1, color = TINTA, relleno = true }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`} fill={relleno ? color : "none"} stroke={color} strokeWidth={relleno ? 0 : 8}>
    <circle cx={0} cy={-78} r={34} />
    <path d="M -58 70 Q -58 -28 0 -28 Q 58 -28 58 70 Z" />
  </g>
);
const estrella = (cx: number, cy: number, R: number) => Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? R * 0.42 : R, a = -Math.PI / 2 + (i * Math.PI) / 5; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(" ");

const Rotulo: React.FC<{ a: string; b: string; s: number }> = ({ a, b, s }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: SF, fontWeight: 700, lineHeight: 1, opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * 24}px)` }}>
    <div style={{ fontSize: 46, color: TINTA }}>{a}</div>
    <div style={{ fontSize: 96, letterSpacing: -3, background: `linear-gradient(180deg, ${AZ2}, ${AZ})`, WebkitBackgroundClip: "text", color: "transparent", paddingBottom: 10 }}>{b}</div>
  </div>
);

export const Mg: React.FC<{ c: Capa }> = ({ c }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const f0 = Math.round(c.a * fps), u = frame / fps - c.a;
  const sp = (d = 0, damping = 14) => spring({ frame: frame - f0 - Math.round(d * fps), fps, config: { damping, mass: 0.6 } });
  const fuera = interpolate(frame / fps, [c.b - 0.14, c.b], [1, 0], clamp);
  const s0 = sp(0), s1 = sp(0.25), s2 = sp(0.5);
  let g: React.ReactNode = null, rot: [string, string] = ["", ""];
  if (c.que === "regla") {
    const giro = -13 * sp(0.35, 9);
    rot = ["La regla es cruel", "pero innegable"];
    g = (<>
      <line x1={540} y1={250} x2={540} y2={600} stroke={TINTA} strokeWidth={14} strokeLinecap="round" strokeDasharray={350} strokeDashoffset={350 * (1 - s0)} />
      <rect x={430} y={596} width={220} height={18} rx={9} fill={TINTA} opacity={s0} />
      <g transform={`rotate(${giro} 540 270)`} opacity={s0}>
        <line x1={290} y1={270} x2={790} y2={270} stroke={TINTA} strokeWidth={14} strokeLinecap="round" />
        {[290, 790].map((x, i) => (<g key={i} transform={`rotate(${-giro} ${x} 270)`}>
          <line x1={x} y1={270} x2={x - 70} y2={430} stroke={TINTA} strokeWidth={6} /><line x1={x} y1={270} x2={x + 70} y2={430} stroke={TINTA} strokeWidth={6} />
          <path d={`M ${x - 90} 430 Q ${x} 500 ${x + 90} 430 Z`} fill={i ? GRIS : AZ} />
          {i === 0 && <circle cx={x} cy={430 - 48 * s1 - 300 * (1 - s1)} r={46} fill={AZ} opacity={s1} />}
        </g>))}
      </g>
      <circle cx={540} cy={270} r={20} fill={TINTA} opacity={s0} /></>);
  } else if (c.que === "atrae") {
    rot = ["Atraes exactamente", "lo que proyectas"];
    g = (<>
      {[0, 1, 2].map((i) => { const r = 70 + ((u * 190 + i * 100) % 300); return <circle key={i} cx={540} cy={360} r={r} fill="none" stroke={AZ} strokeWidth={6} opacity={Math.max(0, 1 - (r - 70) / 300) * s0} />; })}
      {Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2 + 0.3, k = sp(0.25 + i * 0.07, 16), r = 430 - 300 * k; return <circle key={i} cx={540 + r * Math.cos(a)} cy={360 + r * 0.72 * Math.sin(a)} r={24} fill={AZ} opacity={Math.min(1, k * 3)} />; })}
      {Array.from({ length: 5 }, (_, i) => { const a = (i / 5) * Math.PI * 2 + 1.1, r = 250 + 260 * s2; return <rect key={i} x={540 + r * Math.cos(a) - 20} y={360 + r * 0.72 * Math.sin(a) - 20} width={40} height={40} rx={6} fill={GRIS} opacity={s0 * (1 - s2 * 0.9)} transform={`rotate(${u * 80 + i * 30} ${540 + r * Math.cos(a)} ${360 + r * 0.72 * Math.sin(a)})`} />; })}
      <circle cx={540} cy={360} r={76 * s0 * (1 + 0.05 * Math.sin(u * 9))} fill={AZ} /></>);
  } else if (c.que === "dentro") {
    rot = ["Como es adentro", "es afuera"];
    const rombo = (k: number) => `540,${350 - 70 * k} ${540 + 60 * k},350 540,${350 + 70 * k} ${540 - 60 * k},350`;
    g = (<>
      <g opacity={s0}><circle cx={540} cy={170} r={64} fill="none" stroke={TINTA} strokeWidth={12} /><path d="M 370 560 Q 370 250 540 250 Q 710 250 710 560 Z" fill="none" stroke={TINTA} strokeWidth={12} strokeLinejoin="round" /></g>
      <polygon points={rombo(s1 * (1 + 0.06 * Math.sin(u * 8)))} fill={AZ} />
      <polygon points={rombo(1 + 3.4 * s2)} fill="none" stroke={AZ} strokeWidth={10} strokeLinejoin="round" opacity={s2} />
      <polygon points={rombo(1 + 2.2 * s2)} fill="none" stroke={AZ2} strokeWidth={5} strokeLinejoin="round" opacity={s2 * 0.7} /></>);
  } else if (c.que === "mundo") {
    rot = ["Cómo te presentas al", "mundo"];
    g = (<>
      <g opacity={s0} transform={`translate(540 330) scale(${0.6 + 0.4 * s0})`} fill="none" stroke={TINTA} strokeWidth={8}>
        <circle r={230} />
        {[0, 1, 2].map((i) => <ellipse key={i} rx={230 * Math.abs(Math.cos(u * 1.3 + (i * Math.PI) / 3))} ry={230} />)}
        <line x1={-230} y1={0} x2={230} y2={0} /><path d="M -200 -112 Q 0 -70 200 -112" /><path d="M -200 112 Q 0 70 200 112" />
      </g>
      <polygon points={`540,60 ${540 - 150 * s1},620 ${540 + 150 * s1},620`} fill={AZ2} opacity={0.28 * s1} />
      <g transform={`translate(0 ${(1 - s1) * 260})`} opacity={Math.min(1, s1 * 2)}><Persona x={540} y={520} k={1.5} color={AZ} /></g></>);
  } else if (c.que === "tratar") {
    rot = ["Dicta cómo te van a", "tratar"];
    g = (<>
      {[-2, -1, 1, 2].map((i, k) => { const s = sp(0.2 + k * 0.1), x = 540 + i * 190; return (<g key={i} opacity={Math.min(1, s * 2)}>
        <Persona x={x} y={430} k={0.95} color={GRIS} />
        <path d={`M ${x - Math.sign(i) * 70} 300 q ${-Math.sign(i) * 40} -60 ${-Math.sign(i) * 95 * s2} ${-20 * s2}`} fill="none" stroke={AZ} strokeWidth={8} strokeLinecap="round" opacity={s2} />
      </g>); })}
      <g transform={`translate(540 400) scale(${0.5 + 0.5 * sp(0, 10)})`}><Persona x={0} y={0} k={1.5} color={AZ} /></g>
      <circle cx={540} cy={400} r={150 + 60 * s2} fill="none" stroke={AZ2} strokeWidth={6} opacity={s2 * 0.6} /></>);
  } else if (c.que === "valorar") {
    rot = ["y cómo te van a", "valorar"];
    g = (<>
      {[0, 1, 2, 3, 4].map((i) => { const s = sp(0.08 + i * 0.11, 9), x = 220 + i * 160; return (<g key={i}>
        <polygon points={estrella(x, 250, 66)} fill="none" stroke={GRIS} strokeWidth={8} strokeLinejoin="round" />
        <polygon points={estrella(x, 250, 66 * s)} fill={AZ} /></g>); })}
      {[0, 1, 2, 3].map((i) => { const s = sp(0.2 + i * 0.1), h = (90 + i * 60) * s; return <rect key={i} x={330 + i * 115} y={600 - h} width={80} height={h} rx={10} fill={i === 3 ? AZ : TINTA} />; })}
      <path d={`M 330 ${540 - 40 * s2} L 790 ${540 - 250 * s2}`} stroke={AZ2} strokeWidth={8} strokeLinecap="round" opacity={s2} /></>);
  } else if (c.que === "seguir") {
    rot = ["para mejorar", "tu vida"];
    const pulsado = u > 0.75, k = sp(0.75, 8), cx = 540 + 330 * (1 - sp(0.1, 18)), cy = 380 + 200 * (1 - sp(0.1, 18));
    g = (<>
      <rect x={240} y={270} width={600} height={170} rx={85} fill={pulsado ? "white" : AZ} stroke={AZ} strokeWidth={10} transform={`translate(540 355) scale(${pulsado ? 0.9 + 0.1 * k : s0}) translate(-540 -355)`} />
      <text x={540} y={382} textAnchor="middle" fontFamily={SF} fontWeight={700} fontSize={78} fill={pulsado ? AZ : "white"} opacity={s0}>{pulsado ? "Siguiendo ✓" : "Seguir"}</text>
      {pulsado && Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <line key={i} x1={540 + (330 + 20 * k) * Math.cos(a)} y1={355 + (130 + 20 * k) * Math.sin(a)} x2={540 + (330 + 70 * k) * Math.cos(a)} y2={355 + (130 + 60 * k) * Math.sin(a)} stroke={AZ2} strokeWidth={8} strokeLinecap="round" opacity={1 - k * 0.8} />; })}
      <path d={`M ${cx + 40} ${cy + 30} l 0 92 l 24 -22 l 20 44 l 18 -9 l -20 -43 l 33 0 Z`} fill={TINTA} stroke="white" strokeWidth={5} strokeLinejoin="round" opacity={s0} /></>);
  }
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 900, opacity: fuera }}>
      <svg viewBox="0 0 1080 900" width={1080} height={900} style={{ position: "absolute", top: 20 }}>{g}</svg>
      <Rotulo a={rot[0]} b={rot[1]} s={sp(0.3)} />
    </div>
  );
};
