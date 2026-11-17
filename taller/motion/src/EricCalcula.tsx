import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// "Calcula esto" (Eric): operaciones que aparecen pieza a pieza cuando él las dice.
// Números en oscuro (la pared es clara), signos en círculos naranjas y resultado en píldora naranja. Fondo transparente.
const NARANJA = "#FF5800";
const FUENTES: [string, string][] = [["SeqH", "marca/f/sequel-heavy.otf"], ["SeqM", "marca/f/sequel-medium.otf"]];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type Pieza = { txt: string; t: number; tipo?: "n" | "op" | "res"; fila?: number };

export const EricCalcula: React.FC<{ piezas: Pieza[]; y?: number; tam?: number; tFuera?: number }> = ({ piezas, y = 250, tam = 96, tFuera }) => {
  const [h] = useState(() => delayRender("fuentes calcula"));
  useEffect(() => { Promise.all(FUENTES.map(([n, f]) => new FontFace(n, `url(${staticFile(f)})`).load().then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h)); }, [h]);
  const frame = useCurrentFrame(), { fps, durationInFrames } = useVideoConfig();
  const fin = tFuera ?? durationInFrames / fps - 0.3;
  const sale = interpolate(frame / fps, [fin, fin + 0.25], [1, 0], clamp);
  const filas = Array.from(new Set(piezas.map((p) => p.fila ?? 0))).sort();

  const pieza = (p: Pieza, i: number) => {
    const s = spring({ frame: frame - Math.round(p.t * fps), fps, config: { damping: 13, stiffness: 190, mass: 0.7 } });
    const visible = frame >= Math.round(p.t * fps);
    const base: React.CSSProperties = { opacity: visible ? Math.min(1, s * 1.6) : 0, transform: `translateY(${(1 - s) * 30}px) scale(${0.55 + 0.45 * s})`, display: "inline-flex", alignItems: "center", justifyContent: "center" };
    if (p.tipo === "op") {
      const d = tam * 0.95;
      return <div key={i} style={{ ...base, transform: `${base.transform} rotate(${(1 - s) * -90}deg)`, width: d, height: d, borderRadius: d, background: NARANJA, color: "white", fontFamily: "SeqH", fontSize: tam * 0.95, lineHeight: 1, paddingBottom: tam * 0.1, boxShadow: `0 0 ${tam * 0.45}px rgba(255,88,0,0.55), 0 10px 22px rgba(0,0,0,0.22)` }}>{p.txt}</div>;
    }
    if (p.tipo === "res") {
      return <div key={i} style={{ ...base, fontFamily: "SeqH", fontSize: tam * 0.86, letterSpacing: -tam * 0.03, color: "white", background: NARANJA, padding: `${tam * 0.1}px ${tam * 0.38}px ${tam * 0.18}px`, borderRadius: tam * 0.4, boxShadow: `0 0 ${tam * 0.55}px rgba(255,88,0,0.5), 0 12px 26px rgba(0,0,0,0.25)` }}>{p.txt}</div>;
    }
    return <div key={i} style={{ ...base, fontFamily: "SeqH", fontSize: tam, letterSpacing: -tam * 0.045, color: "#161616", textShadow: "0 0 26px rgba(255,255,255,0.85), 0 6px 18px rgba(0,0,0,0.18)", paddingBottom: tam * 0.08 }}>{p.txt}</div>;
  };

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: y, left: 30, right: 30, display: "flex", flexDirection: "column", alignItems: "center", gap: tam * 0.28, opacity: sale, transform: `scale(${0.94 + 0.06 * sale})` }}>
        {filas.map((f) => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: tam * 0.24, flexWrap: "nowrap" }}>
            {piezas.map((p, i) => ((p.fila ?? 0) === f ? pieza(p, i) : null))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
