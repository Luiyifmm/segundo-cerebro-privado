import React, { useEffect, useState } from "react";
import { AbsoluteFill, Img, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Cierre sencillo "seguir": tarjeta de perfil de Instagram (foto, usuario verificado, nombre) con el botón Seguir que se pulsa
// y pasa a "Siguiendo". Fondo transparente para ponerla encima del vídeo.
const AZUL = "#1E8BFF";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FUENTES: [string, string][] = [["SFB", "marca/f/sfpro-bold.otf"], ["SFM", "marca/f/sfpro-medium.otf"]];

export const Cta: React.FC<{ usuario: string; nombre: string; pulsa: number; y: number }> = ({ usuario, nombre, pulsa, y }) => {
  const [h] = useState(() => delayRender("fuentes cta"));
  useEffect(() => { Promise.all(FUENTES.map(([n, f]) => new FontFace(n, `url(${staticFile(f)})`).load().then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h)); }, [h]);
  const frame = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const entra = spring({ frame, fps, config: { damping: 16, mass: 0.7 } });
  const sale = interpolate(frame, [durationInFrames - 6, durationInFrames - 1], [1, 0], clamp);
  const toque = interpolate(t, [pulsa - 0.1, pulsa, pulsa + 0.14], [0, 1, 0], clamp);
  const hecho = t >= pulsa;
  const cambio = spring({ frame: frame - Math.round(pulsa * fps), fps, config: { damping: 14, mass: 0.5 } });
  const dedo = interpolate(t, [pulsa - 0.45, pulsa - 0.05], [0, 1], clamp), dedoFuera = interpolate(t, [pulsa + 0.2, pulsa + 0.45], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, right: 90, top: y, opacity: Math.min(1, entra * 1.4) * sale, transform: `translateY(${(1 - entra) * 60}px) scale(${0.92 + 0.08 * entra})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, background: "rgba(255,255,255,0.97)", borderRadius: 54, padding: "30px 34px", boxShadow: "0 30px 80px rgba(0,0,0,0.35), 0 4px 14px rgba(0,0,0,0.12)" }}>
          <div style={{ width: 150, height: 150, borderRadius: 75, padding: 5, background: `linear-gradient(135deg, ${AZUL}, #7CC4FF)`, flexShrink: 0 }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", border: "4px solid white", boxSizing: "border-box" }}><Img src={staticFile("clientea/avatar-ig.png")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.09)" }} /></div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "SFB", fontSize: 46, letterSpacing: -1.2, color: "#0B0D10", lineHeight: 1.1 }}>
              {usuario}
              <svg width={40} height={40} viewBox="0 0 40 40"><path d="M20 1.5l4.3 3.4 5.4-.7 2.1 5 5 2.1-.7 5.4 3.4 4.3-3.4 4.3.7 5.4-5 2.1-2.1 5-5.4-.7-4.3 3.4-4.3-3.4-5.4.7-2.1-5-5-2.1.7-5.4L.5 21l3.4-4.3-.7-5.4 5-2.1 2.1-5 5.4.7z" fill="#0095F6" /><path d="M12.5 20.5l5 5 10-10.5" fill="none" stroke="white" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ fontFamily: "SFM", fontSize: 29, letterSpacing: -0.4, color: "#6B7280", marginTop: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nombre}</div>
          </div>
          <div style={{ position: "relative", flexShrink: 0, width: 232, height: 92, borderRadius: 26, background: hecho ? "#E9EDF2" : AZUL, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transform: `scale(${1 - 0.08 * toque + (hecho ? 0.05 * (1 - cambio) : 0)})`, boxShadow: hecho ? "none" : `0 10px 26px ${AZUL}66` }}>
            <span style={{ fontFamily: "SFB", fontSize: 36, letterSpacing: -0.8, color: hecho ? "#0B0D10" : "white" }}>{hecho ? "Siguiendo" : "Seguir"}</span>
            {/* toque */}
            <div style={{ position: "absolute", left: 116 - 60, top: 46 - 60, width: 120, height: 120, borderRadius: 60, border: `4px solid ${hecho ? AZUL : "white"}`, opacity: toque * 0.9, transform: `scale(${0.5 + toque * 0.9})` }} />
            <div style={{ position: "absolute", left: 150, top: 54 + (1 - dedo) * 90, width: 54, height: 54, borderRadius: 27, background: "rgba(255,255,255,0.92)", border: "3px solid rgba(0,0,0,0.25)", boxShadow: "0 8px 20px rgba(0,0,0,0.3)", opacity: dedo * dedoFuera, transform: `scale(${1 - 0.2 * toque})` }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
