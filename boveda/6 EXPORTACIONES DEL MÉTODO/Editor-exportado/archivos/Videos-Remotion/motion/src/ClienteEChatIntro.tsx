import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Diálogo de intro estilo TikTok: emoji + texto blanco entre comillas, una línea debajo de otra, cada una entra en su segundo.
export const ClienteEChatIntro: React.FC<{ lineas: { img: string; texto: string; t: number }[]; y: number; tam: number }> = ({ lineas, y, tam }) => {
  const f = useCurrentFrame(), { fps, durationInFrames } = useVideoConfig();
  const fuera = interpolate(f, [durationInFrames - 6, durationInFrames - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fuera, fontFamily: "SF Pro Display, -apple-system, Helvetica Neue, sans-serif" }}>
      {lineas.map((l, i) => {
        const e = spring({ frame: f - Math.round(l.t * fps), fps, config: { damping: 15, mass: 0.6 } });
        return (
          <div key={i} style={{ position: "absolute", left: 60, right: 60, top: y + i * tam * 2.2, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, opacity: e, transform: `translateY(${(1 - e) * 24}px)` }}>
            <Img src={staticFile(l.img)} style={{ width: tam * 1.9, height: tam * 1.9, margin: -tam * 0.25, flexShrink: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.35))" }} />
            <div style={{ color: "#fff", fontSize: tam, fontWeight: 600, lineHeight: 1.15, textAlign: "center", whiteSpace: "nowrap", textShadow: "0 0 3px rgba(0,0,0,.9), 0 2px 10px rgba(0,0,0,.55)" }}>{l.texto}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
