import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Capa de "historia de Instagram" (transparente) para poner encima de una imagen en Premiere.
// Barras de progreso (la actual se llena durante el clip), avatar + usuario + tiempo, ⋯ y ✕, y barra "Enviar mensaje" con ♡ y ➤.
export const HistoriaIG: React.FC<{ usuario: string; tiempo: string; avatar: string; barras: number; actual: number; radio: number; verificado?: boolean }> = ({ usuario, tiempo, avatar, barras, actual, radio, verificado }) => {
  const f = useCurrentFrame(), { durationInFrames, width } = useVideoConfig();
  const u = width / 860, avance = interpolate(f, [0, durationInFrames - 1], [0, 1], { extrapolateRight: "clamp" });
  const sombra = "0 1px 3px rgba(0,0,0,.35)";
  return (
    <AbsoluteFill style={{ borderRadius: radio * u, overflow: "hidden", fontFamily: "SF Pro Text, -apple-system, Helvetica Neue, sans-serif" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,0) 17%, rgba(0,0,0,0) 80%, rgba(0,0,0,.45) 100%)" }} />
      <div style={{ position: "absolute", top: 18 * u, left: 16 * u, right: 16 * u, display: "flex", gap: 6 * u }}>
        {Array.from({ length: barras }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4.5 * u, borderRadius: 3 * u, background: "rgba(255,255,255,.38)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${i < actual ? 100 : i === actual ? avance * 100 : 0}%`, background: "#fff" }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 40 * u, left: 22 * u, right: 22 * u, display: "flex", alignItems: "center", color: "#fff", textShadow: sombra }}>
        <Img src={staticFile(avatar)} style={{ width: 62 * u, height: 62 * u, borderRadius: "50%", objectFit: "cover", border: `${2 * u}px solid rgba(255,255,255,.9)` }} />
        <span style={{ marginLeft: 16 * u, fontWeight: 600, fontSize: 29 * u }}>{usuario}</span>
        {verificado ? (
          <svg width={26 * u} height={26 * u} viewBox="0 0 24 24" style={{ marginLeft: 7 * u }}><path fill="#3897F0" d="M12 1l2.6 2.2 3.4-.4.9 3.3 3 1.7-1.2 3.2 1.2 3.2-3 1.7-.9 3.3-3.4-.4L12 23l-2.6-2.2-3.4.4-.9-3.3-3-1.7L3.3 13 2.1 9.8l3-1.7.9-3.3 3.4.4z" /><path d="M7.5 12.3l3 3 6-6.3" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ) : null}
        <span style={{ marginLeft: 14 * u, fontSize: 27 * u, opacity: 0.8 }}>{tiempo}</span>
        <div style={{ flex: 1 }} />
        <svg width={44 * u} height={44 * u} viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,.4))" }}><circle cx="5" cy="12" r="1.8" fill="#fff" /><circle cx="12" cy="12" r="1.8" fill="#fff" /><circle cx="19" cy="12" r="1.8" fill="#fff" /></svg>
        <svg width={40 * u} height={40 * u} viewBox="0 0 24 24" style={{ marginLeft: 18 * u, filter: "drop-shadow(0 1px 2px rgba(0,0,0,.4))" }}><path d="M5 5l14 14M19 5L5 19" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" /></svg>
      </div>
      <div style={{ position: "absolute", bottom: 30 * u, left: 22 * u, right: 22 * u, display: "flex", alignItems: "center", color: "#fff" }}>
        <div style={{ flex: 1, height: 84 * u, borderRadius: 42 * u, border: `${2.2 * u}px solid rgba(255,255,255,.85)`, display: "flex", alignItems: "center", paddingLeft: 30 * u, fontSize: 28 * u, textShadow: sombra }}>Enviar mensaje</div>
        <svg width={52 * u} height={52 * u} viewBox="0 0 24 24" style={{ marginLeft: 22 * u, filter: "drop-shadow(0 1px 2px rgba(0,0,0,.4))" }}><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.6 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.4 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" stroke="#fff" strokeWidth={1.9} fill="none" strokeLinejoin="round" /></svg>
        <svg width={50 * u} height={50 * u} viewBox="0 0 24 24" style={{ marginLeft: 20 * u, filter: "drop-shadow(0 1px 2px rgba(0,0,0,.4))" }}><path d="M21.5 2.5L10.6 13.4M21.5 2.5l-7 19-3.9-8.1-8.1-3.9z" stroke="#fff" strokeWidth={1.9} fill="none" strokeLinejoin="round" /></svg>
      </div>
    </AbsoluteFill>
  );
};
