import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Calendario que marca un fin de semana, pasa 2 páginas y marca otro ("un fin de semana cada dos meses").
type Mes = { nombre: string; primero: number; dias: number; finde: number }; // primero: 0 = lunes; finde: día del sábado marcado
const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const F = `@font-face{font-family:'SeqH';src:url('${staticFile("fonts/SequelHeavy.otf")}') format('opentype');} @font-face{font-family:'SeqB';src:url('${staticFile("fonts/SequelBold.ttf")}') format('truetype');}`;
const W = 600, H = 560, CELDA = 76, X0 = (W - CELDA * 7) / 2, Y0 = 170;

const Hoja: React.FC<{ m: Mes; marca: number; color: string }> = ({ m, marca, color }) => {
  const celdas = [];
  for (let d = 1; d <= m.dias; d++) {
    const i = m.primero + d - 1, col = i % 7, fil = Math.floor(i / 7), finde = col >= 5;
    celdas.push(<div key={d} style={{ position: "absolute", left: X0 + col * CELDA, top: Y0 + fil * 62, width: CELDA, textAlign: "center", fontFamily: "'SeqB', sans-serif", fontSize: 30, color: finde ? "#9a9a9a" : "#1d1d1f" }}>{d}</div>);
  }
  const i = m.primero + m.finde - 1, col = i % 7, fil = Math.floor(i / 7);
  const cx = X0 + col * CELDA + CELDA, cy = Y0 + fil * 62 + 18, rx = CELDA * 1.08, ry = 36, L = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2) * 1.15;
  // elipse a mano: algo más de una vuelta, ligeramente girada
  const d = Array.from({ length: 61 }, (_, k) => { const a = -Math.PI * 0.9 + (k / 60) * Math.PI * 2.25, r = 1 + 0.06 * Math.sin(k / 6); return `${k ? "L" : "M"}${(cx + Math.cos(a) * rx * r).toFixed(1)},${(cy + Math.sin(a) * ry * r).toFixed(1)}`; }).join(" ");
  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: 34, background: "#fff", overflow: "hidden", boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.04)" }}>
      <div style={{ height: 96, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'SeqH', sans-serif", fontSize: 44, color: "#fff", letterSpacing: 2 }}>{m.nombre}</div>
      {["L", "M", "X", "J", "V", "S", "D"].map((t, k) => <div key={t} style={{ position: "absolute", left: X0 + k * CELDA, top: 118, width: CELDA, textAlign: "center", fontFamily: "'SeqH', sans-serif", fontSize: 24, color: k >= 5 ? color : "#8e8e93" }}>{t}</div>)}
      {celdas}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={d} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - marca)} style={{ filter: `drop-shadow(0 0 6px ${color}88)` }} />
      </svg>
    </div>
  );
};

export const ClienteECalendario: React.FC<{ meses: Mes[]; tMarca1: number; tPasa: number; tMarca2: number; y: number; color: string; escala?: number }> = ({ meses, tMarca1, tPasa, tMarca2, y, color, escala = 1 }) => {
  const f = useCurrentFrame(), { fps, durationInFrames, width } = useVideoConfig(), s = f / fps, fin = durationInFrames / fps;
  const e = interpolate(s, [0, 0.35], [0, 1], { ...c, easing: Easing.bezier(0.16, 1, 0.3, 1) }), sale = interpolate(s, [fin - 0.3, fin], [0, 1], { ...c, easing: Easing.in(Easing.cubic) });
  const m1 = interpolate(s, [tMarca1, tMarca1 + 0.45], [0, 1], { ...c, easing: Easing.inOut(Easing.cubic) });
  const m2 = interpolate(s, [tMarca2, tMarca2 + 0.45], [0, 1], { ...c, easing: Easing.inOut(Easing.cubic) });
  const p1 = interpolate(s, [tPasa, tPasa + 0.28], [0, 1], { ...c, easing: Easing.in(Easing.quad) });
  const p2 = interpolate(s, [tPasa + 0.3, tPasa + 0.58], [0, 1], { ...c, easing: Easing.in(Easing.quad) });
  const flota = Math.sin(s * 2.2) * 6;
  const hoja = (k: number, giro: number, marca: number, z: number) => (
    <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 0%", transform: `rotateX(${giro * 180}deg)`, backfaceVisibility: "hidden", zIndex: z, opacity: giro > 0.5 ? 0 : 1 }}>
      <Hoja m={meses[k]} marca={marca} color={color} />
    </div>);
  return (
    <AbsoluteFill>
      <style>{F}</style>
      <div style={{ position: "absolute", left: (width - W) / 2, top: y - H / 2 + flota, width: W, height: H, perspective: 1800, opacity: e * (1 - sale), transform: `translateY(${(1 - e) * 120 - sale * 40}px) scale(${(0.85 + 0.15 * e) * escala}) rotate(${-2 + 2 * e}deg)`, filter: "drop-shadow(0 26px 40px rgba(0,0,0,0.35))" }}>
        {/* anillas de la agenda */}
        {[0.2, 0.4, 0.6, 0.8].map((x) => <div key={x} style={{ position: "absolute", left: W * x - 9, top: -22, width: 18, height: 46, borderRadius: 9, background: "linear-gradient(#e8e8e8,#9b9b9b)", zIndex: 10 }} />)}
        {hoja(2, 0, m2, 1)}
        {hoja(1, p2, 0, 2)}
        {hoja(0, p1, m1, 3)}
      </div>
    </AbsoluteFill>
  );
};
