import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Recursos sueltos (fondo transparente) para vídeos de lista de Amin, calcados de la referencia del guion 37
// (reel "5 Mujeres Mediocres"): pastilla blanca con el título arriba y lista numerada que se va rellenando.
// paso = cuántas etiquetas hay ya escritas; la última entra animada. paso 0 = entran solo los números.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FUENTE = "'SF Pro Display', -apple-system, 'Helvetica Neue', sans-serif";
const sal = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

export const AminTitulo: React.FC<{ titulo: string }> = ({ titulo }) => {
  const t = useCurrentFrame() / useVideoConfig().fps, e = sal(interpolate(t, [0, 0.32], [0, 1], clamp));
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ marginTop: 150, padding: "26px 46px 30px", background: "#fff", borderRadius: 30, fontFamily: FUENTE, fontWeight: 600, fontSize: 88, letterSpacing: -2.5, color: "#0a0a0a", whiteSpace: "nowrap", opacity: e, transform: `scale(${0.86 + 0.14 * e}) translateY(${(1 - e) * -24}px)`, boxShadow: "0 10px 40px rgba(0,0,0,0.28)" }}>{titulo}</div>
    </AbsoluteFill>
  );
};

export const AminLista: React.FC<{ etiquetas: string[]; paso: number; color: "blanco" | "negro"; x?: number; y?: number; salto?: number; numero?: string; escala?: number }> = ({ etiquetas, paso, color, x = 640, y = 400, salto = 150, numero, escala = 1 }) => {
  const t = useCurrentFrame() / useVideoConfig().fps, tinta = color === "blanco" ? "#fff" : "#0a0a0a", sombra = color === "blanco" ? "0 2px 16px rgba(0,0,0,0.6), 0 0 3px rgba(0,0,0,0.5)" : "none";
  return (
    <AbsoluteFill style={{ fontFamily: FUENTE, color: tinta, textShadow: sombra }}>
      {etiquetas.map((et, i) => {
        const n = paso === 0 ? sal(interpolate(t, [0.05 + i * 0.07, 0.3 + i * 0.07], [0, 1], clamp)) : 1;
        const nueva = i === paso - 1, e = nueva ? interpolate(t, [0.1, 0.5], [0, 1], clamp) : 1, golpe = nueva ? interpolate(t, [0.1, 0.2, 0.42], [1, 1.22, 1], clamp) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y + i * salto, display: "flex", alignItems: "baseline", whiteSpace: "nowrap", opacity: n, transform: `translateY(${(1 - n) * 18}px)` }}>
            <span style={{ fontWeight: 800, fontSize: 68 * escala, letterSpacing: -2 * escala, color: numero || tinta, display: "inline-block", transform: `scale(${golpe})`, transformOrigin: "50% 70%" }}>{i + 1}.</span>
            {i < paso && <span style={{ marginLeft: 14 * escala, fontWeight: 500, fontSize: 44 * escala, letterSpacing: -1.2 * escala, display: "inline-block", clipPath: `inset(-20% ${(1 - sal(e)) * 100}% -20% -5%)`, opacity: 0.3 + 0.7 * e, filter: `blur(${(1 - e) * 5}px)` }}>{et}</span>}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Entrada del vídeo (petición del usuario, 11-10-2026): aparece el título y, enseguida, la lista del 1 al 5 vacía.
export const AminIntroLista: React.FC<{ titulo: string; etiquetas: string[]; color: "blanco" | "negro"; x?: number; y?: number; salto?: number; numero?: string }> = ({ titulo, etiquetas, color, x, y, salto, numero }) => (
  <AbsoluteFill>
    <AminTitulo titulo={titulo} />
    <Sequence from={9}><AminLista etiquetas={etiquetas} paso={0} color={color} x={x} y={y} salto={salto} numero={numero} /></Sequence>
  </AbsoluteFill>
);
