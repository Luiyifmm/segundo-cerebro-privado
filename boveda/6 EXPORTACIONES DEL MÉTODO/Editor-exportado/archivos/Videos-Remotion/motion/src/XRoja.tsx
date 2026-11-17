import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// X roja que se dibuja en dos trazos (estilo del "perfil bloqueado"), con brillo suave y sombra.
export const XRoja: React.FC<{ color: string; tam: number; x: number; y: number; grosor: number }> = ({ color, tam, x, y, grosor }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig(), s = f / fps, c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const t1 = interpolate(s, [0, 0.13], [0, 1], { ...c, easing: Easing.out(Easing.cubic) });
  const t2 = interpolate(s, [0.1, 0.24], [0, 1], { ...c, easing: Easing.out(Easing.cubic) });
  const golpe = interpolate(s, [0.22, 0.3, 0.45], [0, 1, 0], c);
  const h = tam / 2, L = Math.hypot(tam, tam) + 20;
  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" style={{ overflow: "visible", filter: `drop-shadow(0 0 14px ${color}aa) drop-shadow(0 10px 18px rgba(0,0,0,0.45))`, transform: `scale(${1 + golpe * 0.05})`, transformOrigin: `${x}px ${y}px` }}>
        <line x1={x - h} y1={y - h} x2={x + h} y2={y + h} stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - t1)} opacity={t1 > 0 ? 1 : 0} />
        <line x1={x + h} y1={y - h} x2={x - h} y2={y + h} stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - t2)} opacity={t2 > 0 ? 1 : 0} />
      </svg>
    </AbsoluteFill>
  );
};
