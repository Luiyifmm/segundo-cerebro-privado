import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Tres rombos UI con bordes redondeados y número amarillo con glow; suben de abajo arriba en orden y salen suaves.
export const ClienteERombos: React.FC<{ nums: string[]; t: number; paso: number; tFuera: number; y: number; lado: number; color: string }> = ({ nums, t, paso, tFuera, y, lado, color }) => {
  const f = useCurrentFrame(), { fps, width } = useVideoConfig(), s = f / fps, c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const sep = lado * 1.62, x0 = width / 2 - sep;
  return (
    <AbsoluteFill>
      {nums.map((n, i) => {
        const a = t + i * paso, e = interpolate(s, [a, a + 0.7], [0, 1], { ...c, easing: Easing.bezier(0.16, 1, 0.3, 1) });
        const sal = interpolate(s, [tFuera + i * 0.06, tFuera + 0.35 + i * 0.06], [0, 1], { ...c, easing: Easing.in(Easing.cubic) });
        const brillo = interpolate(s, [a + 0.35, a + 0.6, a + 1.1], [0, 1, 0.55], c);
        const flota = Math.sin((s - a) * 2.2 + i) * 4 * e;
        return (
          <div key={i} style={{ position: "absolute", left: x0 + i * sep - lado / 2, top: y - lado / 2, width: lado, height: lado, opacity: e * (1 - sal), transform: `translateY(${(1 - e) * 120 + sal * -40 + flota}px) scale(${0.85 + 0.15 * e - sal * 0.1})` }}>
            <div style={{ position: "absolute", inset: 0, transform: "rotate(45deg)", borderRadius: lado * 0.2, background: "linear-gradient(145deg, rgba(40,40,40,0.72), rgba(8,8,8,0.62))", border: `3px solid rgba(255,249,0,${0.35 + 0.4 * brillo})`, boxShadow: `0 0 ${18 + 30 * brillo}px rgba(255,249,0,${0.18 + 0.32 * brillo}), inset 0 0 22px rgba(255,255,255,0.06), 0 16px 34px rgba(0,0,0,0.45)` }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sequel Sans Heavy Disp', 'SequelSans-HeavyDisp', 'SF Pro Display', sans-serif", fontWeight: 900, fontSize: lado * 0.52, color, textShadow: `0 0 10px ${color}, 0 0 ${22 + 26 * brillo}px ${color}, 0 0 ${50 + 30 * brillo}px rgba(255,249,0,0.55)` }}>{n}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
