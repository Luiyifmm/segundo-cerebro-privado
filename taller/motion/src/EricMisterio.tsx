import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Rombos oscuros flotando con un emoji en silueta oscura y un "?" amarillo: estrategias sin revelar.
export const EricMisterio: React.FC<{ iconos: string[]; t: number; paso: number; y: number; lado: number; color: string; rgb?: string; x?: number }> = ({ iconos, t, paso, y, lado, color, rgb = "255,249,0", x }) => {
  const f = useCurrentFrame(), { fps, width } = useVideoConfig(), s = f / fps, c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const sep = lado * 1.55, x0 = (x ?? width / 2) - sep * (iconos.length - 1) / 2, dur = useVideoConfig().durationInFrames, sale = interpolate(f, [dur - 8, dur - 1], [1, 0], c);
  return (
    <AbsoluteFill style={{ opacity: sale }}>
      {iconos.map((ic, i) => {
        const a = t + i * paso, e = interpolate(s, [a, a + 0.6], [0, 1], { ...c, easing: Easing.bezier(0.16, 1, 0.3, 1) });
        const flota = Math.sin((s - a) * 2.4 + i * 1.7) * 14 * e, ladeo = Math.sin((s - a) * 1.8 + i) * 4 * e;
        const brillo = interpolate(s, [a + 0.3, a + 0.55, a + 1.0], [0, 1, 0.6], c);
        return (
          <div key={i} style={{ position: "absolute", left: x0 + i * sep - lado / 2, top: y - lado / 2 + (i === 1 ? -lado * 0.6 : 0), width: lado, height: lado, opacity: e, transform: `translateY(${(1 - e) * 140 + flota}px) rotate(${ladeo}deg) scale(${0.8 + 0.2 * e})` }}>
            <div style={{ position: "absolute", inset: 0, transform: "rotate(45deg)", borderRadius: lado * 0.2, background: "linear-gradient(145deg, rgba(40,40,40,0.78), rgba(8,8,8,0.66))", border: `4px solid rgba(${rgb},${0.5 + 0.35 * brillo})`, boxShadow: `0 0 ${22 + 28 * brillo}px rgba(${rgb},${0.25 + 0.3 * brillo}), inset 0 0 22px rgba(255,255,255,0.05), 0 18px 34px rgba(0,0,0,0.45)` }} />
            <Img src={staticFile(ic)} style={{ position: "absolute", left: lado * 0.18, top: lado * 0.18, width: lado * 0.64, height: lado * 0.64, filter: `grayscale(1) brightness(0.35) contrast(1.4) drop-shadow(0 0 3px rgba(${rgb},0.9)) drop-shadow(0 0 10px rgba(${rgb},0.4))`, opacity: 0.97 }} />
            <div style={{ position: "absolute", right: lado * 0.06, bottom: lado * 0.02, fontFamily: "'BootzyF', 'Bootzy TM', 'SF Pro Display', sans-serif", fontSize: lado * 0.34, color, textShadow: `0 0 10px ${color}, 0 0 ${24 + 20 * brillo}px ${color}, 0 3px 10px rgba(0,0,0,0.6)` }}>?</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
