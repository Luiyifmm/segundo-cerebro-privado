// Ranking tipo "top 5" sobre el vídeo (referencia @jonanutri_): columna de huecos numerados a la izquierda (medallas en 1–3),
// cada alimento aparece grande en el centro y vuela a su puesto; título arriba con la marca. Fondo transparente (se pone encima en Premiere).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Img, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
const FUENTES: [string, string][] = [["SeqH", "marca/f/sequel-heavy.otf"], ["SeqM", "marca/f/sequel-medium.otf"]];
const useFuentes = () => { const [h] = useState(() => delayRender("fuentes")); useEffect(() => { Promise.all(FUENTES.map(([n, f]) => new FontFace(n, `url(${staticFile(f)})`).load().then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h)); }, [h]); };
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export type Item = { img: string; puesto: number; t: number; nombre?: string; tam?: number; alto?: number };
export const Ranking: React.FC<{ items: Item[]; titulo: string; subtitulo: string; color?: string; huecos?: number; tTitulo?: number; tFin?: number; medallas?: boolean; popY?: number; popTam?: number; derecha?: boolean; sinTitulo?: boolean }> = ({ items, titulo, subtitulo, color = "#FF5800", huecos = 5, tTitulo = 0, tFin = 9999, medallas = true, popY = 1440, popTam = 440, derecha = false, sinTitulo = false }) => {
  useFuentes(); const f = useCurrentFrame(), { fps } = useVideoConfig(); const S = (s: number) => s * fps;
  const ent = spring({ frame: f - S(tTitulo), fps, config: { damping: 15 } }), sal = interpolate(f, [S(tFin) - 10, S(tFin)], [1, 0], cl);
  const R = 58, X0 = derecha ? 1080 - 70 - (70 + 18 + 2 * R + 10) : 70, Y0 = 330, PASO = 150;
  const med = ["#F7C948", "#C9D1D9", "#D08A4C"];
  return (
    <AbsoluteFill style={{ opacity: sal }}>
      {sinTitulo ? null : <div style={{ position: "absolute", ...(derecha ? { left: 60, textAlign: "left" as const } : { right: 60, textAlign: "right" as const }), top: 120, transform: `translateY(${(1 - ent) * -40}px)`, opacity: ent }}>
        <div style={{ display: "inline-block", background: "#0d0d0d", color: "white", fontFamily: "SeqH", fontSize: 54, padding: "10px 22px", borderRadius: 14, letterSpacing: -1 }}>{titulo}</div><br />
        <div style={{ display: "inline-block", marginTop: 8, background: color, color: "white", fontFamily: "SeqH", fontSize: 54, padding: "10px 22px", borderRadius: 14, letterSpacing: -1 }}>{subtitulo}</div>
      </div>}
      {Array.from({ length: huecos }).map((_, i) => { const y = Y0 + i * PASO, a = interpolate(f, [S(tTitulo) + i * 3, S(tTitulo) + i * 3 + 10], [0, 1], cl);
        return <div key={i} style={{ position: "absolute", left: X0, top: y, display: "flex", alignItems: "center", gap: 18, opacity: a }}>
          <div style={{ width: 70, textAlign: "center", fontFamily: "SeqH", fontSize: 56, color: medallas && i < 3 ? med[i] : "white", textShadow: "0 3px 12px rgba(0,0,0,0.7)" }}>{i + 1}</div>
          <div style={{ width: R * 2, height: R * 2, borderRadius: "50%", border: `5px dashed ${color}`, background: "rgba(0,0,0,0.18)", boxShadow: "0 4px 18px rgba(0,0,0,0.35)" }} />
        </div>; })}
      {items.map((it, k) => { const t0 = S(it.t), vuelo = interpolate(f, [t0 + 22, t0 + 40], [0, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 3) });
        const pop = spring({ frame: f - t0, fps, config: { damping: 11, stiffness: 170 } }); if (f < t0) return null;
        const cx = interpolate(vuelo, [0, 1], [540, X0 + 88 + R]), cy = interpolate(vuelo, [0, 1], [popY, Y0 + (it.puesto - 1) * PASO + R + 5]), tam = interpolate(vuelo, [0, 1], [popTam * (it.tam ?? 1), R * 2 - 8]), alto = interpolate(vuelo, [0, 1], [popTam * (it.tam ?? 1) * (it.alto ?? 1), R * 2 - 8]);
        return <div key={k} style={{ position: "absolute", left: cx - tam / 2, top: cy - alto / 2, width: tam, height: alto, transform: `scale(${pop})`, borderRadius: vuelo > 0.9 ? "50%" : 0, overflow: vuelo > 0.9 ? "hidden" : "visible" }}>
          <Img src={staticFile(it.img)} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.45))" }} />
          {it.nombre && vuelo < 0.05 ? <div style={{ position: "absolute", left: -200, right: -200, top: "100%", marginTop: 6, textAlign: "center", fontFamily: "SeqH", fontSize: 46, color: "white", textShadow: "0 3px 14px rgba(0,0,0,0.8)" }}>{it.nombre}</div> : null}
        </div>; })}
    </AbsoluteFill>
  );
};
