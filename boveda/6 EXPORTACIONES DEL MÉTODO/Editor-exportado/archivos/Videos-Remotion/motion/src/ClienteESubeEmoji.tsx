import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Emoji que entra pequeño y crece hasta su tamaño, con una flecha naranja hacia arriba que sube y baja a su lado. Se desvanece en tFuera.
export const ClienteESubeEmoji: React.FC<{ img: string; t: number; tFuera: number; x: number; y: number; tam: number; color: string }> = ({ img, t, tFuera, x, y, tam, color }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig(), s = f / fps, c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const crece = interpolate(s, [t, t + 0.75], [0.25, 1], { ...c, easing: Easing.out(Easing.back(1.6)) });
  const pop = spring({ frame: f - Math.round(t * fps), fps, config: { damping: 11, mass: 0.5 } });
  const o = interpolate(s, [t, t + 0.08], [0, 1], c) * interpolate(s, [tFuera, tFuera + 0.25], [1, 0], c);
  const fl = interpolate(s, [t + 0.1, t + 0.3], [0, 1], c), bota = Math.sin((s - t) * Math.PI * 2 * 1.6) * 22;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Img src={staticFile(img)} style={{ position: "absolute", left: x - tam / 2, top: y - tam / 2, width: tam, height: tam, transform: `scale(${crece * (0.9 + 0.1 * pop)})`, filter: "drop-shadow(0 12px 18px rgba(0,0,0,.28))" }} />
      <svg width={150} height={210} viewBox="0 0 150 210" style={{ position: "absolute", left: x + tam * 0.48, top: y - 120 + bota, opacity: fl, filter: `drop-shadow(0 0 14px ${color}) drop-shadow(0 0 30px ${color}99)` }}>
        <path d="M75 12 L138 92 L98 92 L98 198 L52 198 L52 92 L12 92 Z" fill={color} />
      </svg>
    </AbsoluteFill>
  );
};
