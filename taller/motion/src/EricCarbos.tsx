import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Cadena de emojis de iPhone con su nombre (SF Pro), glow suave debajo y líneas discontinuas que van de uno al siguiente.
// items: emoji + nombre + segundo en que aparece; lineas: [inicio, fin] en segundos de cada tramo; todo se desvanece en tFuera.
type Item = { img: string; nombre: string; t: number };
export const EricCarbos: React.FC<{ items: Item[]; y: number; tam: number; tFuera: number; glow: string }> = ({ items, y, tam, tFuera, glow }) => {
  const f = useCurrentFrame(), { fps, width } = useVideoConfig(), s = f / fps, c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const n = items.length, margen = 190, xs = items.map((_, i) => margen + (i * (width - 2 * margen)) / (n - 1));
  const fuera = interpolate(s, [tFuera, tFuera + 0.35], [1, 0], { ...c, easing: Easing.in(Easing.quad) });
  return (
    <AbsoluteFill style={{ opacity: fuera, fontFamily: "SF Pro Display, -apple-system, Helvetica Neue, sans-serif" }}>
      <svg width={width} height={1920} style={{ position: "absolute", inset: 0 }}>
        {items.slice(0, -1).map((it, i) => {
          const a = it.t + 0.18, b = items[i + 1].t - 0.02, p = interpolate(s, [a, b], [0, 1], { ...c, easing: Easing.inOut(Easing.cubic) });
          const x1 = xs[i] + tam * 0.42, x2 = xs[i + 1] - tam * 0.42, cy = y - 10, L = x2 - x1;
          return (
            <g key={i} opacity={p > 0 ? 1 : 0}>
              <line x1={x1} y1={cy} x2={x1 + L * p} y2={cy} stroke="#FF5800" strokeWidth={5} strokeLinecap="round" strokeDasharray="14 14" strokeDashoffset={-s * 60} style={{ filter: "drop-shadow(0 0 8px rgba(255,88,0,.7))" }} />
              {p > 0 && p < 1 ? <circle cx={x1 + L * p} cy={cy} r={7} fill="#FF5800" style={{ filter: "drop-shadow(0 0 10px #FF5800)" }} /> : null}
            </g>
          );
        })}
      </svg>
      {items.map((it, i) => {
        const e = spring({ frame: f - Math.round(it.t * fps), fps, config: { damping: 13, mass: 0.6 } }), o = interpolate(s, [it.t, it.t + 0.12], [0, 1], c);
        return (
          <div key={i} style={{ position: "absolute", left: xs[i] - tam, top: y - tam * 0.62, width: tam * 2, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
            <Img src={staticFile(it.img)} style={{ width: tam, height: tam, transform: `translateY(${(1 - e) * 40}px) scale(${0.6 + 0.4 * e})`, filter: "drop-shadow(0 10px 16px rgba(0,0,0,.25))" }} />
            <div style={{ marginTop: 6, fontSize: 54, fontWeight: 600, letterSpacing: -0.3, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,.45)", transform: `translateY(${(1 - e) * 18}px)` }}>{it.nombre}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
