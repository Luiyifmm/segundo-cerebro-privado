// Reloj para ClienteN (guion 9, "30 minutos de cardio"): sube desde abajo con rebote, gira y las agujas avanzan hasta los 30 min;
// a su lado entra "30 MIN" en su letra deportiva roja. Fondo transparente, 9:16.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const ClienteNReloj: React.FC<{ texto?: string; sub?: string; rojo?: string; y?: number; minutos?: number }> = ({ texto = "30 MIN", sub = "DE CARDIO", rojo = "#D3261C", y = 1300, minutos = 30 }) => {
  const f = useCurrentFrame(), { fps, durationInFrames: D } = useVideoConfig();
  const sube = spring({ frame: f, fps, config: { damping: 11, stiffness: 120 } });
  const giro = interpolate(f, [0, 22], [-200, 0], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const agujas = interpolate(f, [6, 34], [0, 1], { ...cl, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const txt = spring({ frame: f - 14, fps, config: { damping: 14, stiffness: 140 } });
  const sal = interpolate(f, [D - 10, D], [1, 0], cl);
  const min = 360 * (minutos / 60) * agujas + 360 * 2 * agujas, hor = 30 * agujas * 1.5;
  const X = 330, R = 150;
  return (
    <AbsoluteFill style={{ opacity: sal }}>
      <div style={{ position: "absolute", left: X - R, top: y - R + (1 - sube) * 900, width: R * 2, height: R * 2, transform: `rotate(${giro}deg) scale(${0.6 + 0.4 * sube})`, filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.45))" }}>
        <svg width={R * 2} height={R * 2} viewBox="-100 -100 200 200">
          <circle r="94" fill="white" stroke={rojo} strokeWidth="11" />
          {Array.from({ length: 12 }).map((_, i) => <line key={i} x1="0" y1="-80" x2="0" y2={i % 3 === 0 ? -66 : -72} stroke="#1a1a1a" strokeWidth={i % 3 === 0 ? 6 : 3} strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
          <path d={`M0 0 L0 -70 A70 70 0 ${minutos > 30 ? 1 : 0} 1 ${70 * Math.sin((2 * Math.PI * minutos) / 60)} ${-70 * Math.cos((2 * Math.PI * minutos) / 60)} Z`} fill={rojo} opacity={0.22 * agujas} />
          <line x1="0" y1="0" x2="0" y2="-44" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round" transform={`rotate(${hor})`} />
          <line x1="0" y1="0" x2="0" y2="-70" stroke={rojo} strokeWidth="6" strokeLinecap="round" transform={`rotate(${min})`} />
          <circle r="8" fill="#1a1a1a" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: X + R + 40, top: y - 120, opacity: txt, transform: `translateX(${(1 - txt) * -60}px)`, fontFamily: "'Futura-CondensedExtraBold', 'Futura', sans-serif", fontWeight: 800, lineHeight: 0.92, textShadow: "0 6px 24px rgba(0,0,0,0.6)" }}>
        <div style={{ fontSize: 170, color: rojo, whiteSpace: "nowrap" }}>{texto}</div>
        <div style={{ fontSize: 72, color: "white", marginTop: 6 }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};
