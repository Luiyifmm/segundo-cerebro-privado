import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// "Si quieres – Debes" (Eric), estructura de la referencia de @salvatfit_ con la marca de Eric:
// píldora "Perder grasa 🔥" arriba y tabla de dos columnas (Si quieres | Debes) con filas vacías
// que se rellenan cuando lo dice. Columna izquierda oscura, derecha naranja. Fondo transparente.
const NARANJA = "#FF5800";
const EMOJI = "'Apple Color Emoji', sans-serif";
const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type Fila = { izq: string; der: string; tI: number; tD: number; resalta?: boolean };

export const EricSiQuieres: React.FC<{
  filas: Fila[]; tIn: number; tOut: number; pildora?: { txt: string; t: number; tFin: number };
  y?: number; x0?: number; x1?: number; medio?: number; filaH?: number; hueco?: number; tam?: number; vivo?: boolean; tPop?: number;
}> = ({ filas, tIn, tOut, pildora, y = 1000, x0 = 80, x1 = 1000, medio = 24, filaH = 66, hueco = 12, tam = 40, vivo = false, tPop = 1.0 }) => {
  // vivo: 'Si quieres' naranja y 'Debes' verde, con glow; la casilla sale hacia fuera al decirla
  const VERDE = "#19C24A", VERDE2 = "#4BEA74";
  const col = (i: number) => (i === 0 ? { a: "#FF8A1A", b: NARANJA, glow: "255,88,0" } : { a: VERDE2, b: VERDE, glow: "25,194,74" });
  const [h] = useState(() => delayRender("fuentes siquieres"));
  useEffect(() => {
    Promise.all([["SeqH", "marca/f/sequel-heavy.otf"], ["SeqM", "marca/f/sequel-medium.otf"]].map(([n, f]) => new FontFace(n, `url(${staticFile(f)})`).load().then((x) => document.fonts.add(x))))
      .then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
  const f = useCurrentFrame(), { fps } = useVideoConfig(), s = f / fps;
  const sp = (t: number, d = 14) => spring({ frame: f - Math.round(t * fps), fps, config: { damping: d, stiffness: 200, mass: 0.7 } });
  const sal = interpolate(s, [tOut, tOut + 0.35], [1, 0], c);
  const anchoCol = (x1 - x0 - medio) / 2;
  const xs = [x0, x0 + anchoCol + medio];
  const sombraTxt = "0 3px 10px rgba(0,0,0,0.45)";

  const cab = (txt: string, i: number) => {
    const p = sp(tIn + i * 0.08);
    return (
      <div key={"c" + i} style={{ position: "absolute", left: xs[i], width: anchoCol, top: y, height: filaH * 1.05, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 18, background: vivo ? `linear-gradient(180deg, ${col(i).a} 0%, ${col(i).b} 100%)` : i === 0 ? "rgba(18,18,18,0.82)" : NARANJA, boxShadow: vivo ? `0 0 34px rgba(${col(i).glow},0.75), 0 0 12px rgba(${col(i).glow},0.9), 0 8px 18px rgba(0,0,0,0.25)` : i === 1 ? "0 0 26px rgba(255,88,0,0.5), 0 8px 18px rgba(0,0,0,0.25)" : "0 8px 18px rgba(0,0,0,0.3)", opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px) scale(${0.8 + 0.2 * p})` }}>
        <span style={{ fontFamily: "SeqH", fontSize: tam * 1.2, letterSpacing: -tam * 0.04, color: "white", textShadow: sombraTxt }}>{txt}</span>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ opacity: sal }}>
      {pildora && s >= pildora.t && s < pildora.tFin + 0.3 ? (() => {
        const p = sp(pildora.t), fu = interpolate(s, [pildora.tFin, pildora.tFin + 0.3], [1, 0], c);
        return (
          <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, opacity: Math.min(1, p * 1.5) * fu, transform: `scale(${0.7 + 0.3 * p})` }}>
            <div style={{ fontFamily: "SeqH", fontSize: 64, letterSpacing: -2.4, color: "white", background: NARANJA, padding: "8px 26px 14px", borderRadius: 20, boxShadow: "0 0 26px rgba(255,88,0,0.45), 0 8px 18px rgba(0,0,0,0.25)" }}>{pildora.txt}</div>
            <div style={{ fontFamily: EMOJI, fontSize: 84, transform: `rotate(${Math.sin(s * 5) * 6}deg)` }}>🔥</div>
          </div>
        );
      })() : null}
      {s >= tIn ? <>
        {cab("Si quieres", 0)}
        {cab("Debes", 1)}
        {filas.map((fl, k) => {
          const yF = y + filaH * 1.05 + hueco * 1.5 + k * (filaH + hueco);
          const pBar = sp(tIn + 0.2 + k * 0.07);
          return [0, 1].map((i) => {
            const tTxt = i === 0 ? fl.tI : fl.tD, txt = i === 0 ? fl.izq : fl.der;
            const lleno = s >= tTxt, q = sp(tTxt, 12);
            const flash = lleno ? interpolate(s, [tTxt, tTxt + 0.12, tTxt + 0.5], [0, 1, 0], c) : 0;
            const res = fl.resalta && i === 1 && lleno ? 0.5 + 0.5 * Math.sin((s - tTxt) * 6) : 0;
            const fondo = vivo
              ? (lleno ? `rgba(${col(i).glow},${0.42 + 0.56 * (vivo && s >= tTxt ? interpolate(s, [tTxt, tTxt + 0.18, tTxt + tPop, tTxt + tPop + 0.3], [0, 1, 1, 0], c) : 0)})` : `linear-gradient(180deg, ${col(i).a} 0%, ${col(i).b} 100%)`)
              : i === 0
              ? `rgba(18,18,18,${lleno ? 0.62 : 0.32})`
              : lleno ? `linear-gradient(180deg, #FF8A1A 0%, ${NARANJA} 100%)` : "rgba(255,88,0,0.38)";
            // salida hacia fuera: crece desde su borde exterior, se mantiene mientras lo dice y vuelve a su sitio
            const pop = vivo && lleno ? interpolate(s, [tTxt, tTxt + 0.18, tTxt + tPop, tTxt + tPop + 0.3], [0, 1, 1, 0], c) * (0.85 + 0.15 * q) : 0;
            // al revés: vacía = sólida con glow; con texto = translúcida sin glow (solo sombra mientras sale)
            const glowV = !vivo ? "none" : lleno ? (pop > 0.01 ? `0 ${10 * pop}px ${24 * pop}px rgba(0,0,0,${0.35 * pop})` : "none") : `0 0 22px rgba(${col(i).glow},0.7), 0 0 8px rgba(${col(i).glow},0.85)`;
            return (
              <div key={k + "-" + i} style={{ position: "absolute", left: xs[i], width: anchoCol, top: yF, height: filaH, borderRadius: 14, background: fondo, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", opacity: Math.min(1, pBar * 1.4), zIndex: pop > 0.01 ? 5 : 1, transformOrigin: i === 0 ? "0% 50%" : "100% 50%", transform: `scaleX(${0.6 + 0.4 * pBar}) translateX(${vivo ? 0 : (i === 0 ? -1 : 1) * 14 * pop}px) scale(${vivo ? 1 : 1 + 0.05 * flash + 0.32 * pop})`, boxShadow: vivo ? glowV : i === 1 && lleno ? `0 0 ${18 + 22 * Math.max(flash, res)}px rgba(255,88,0,${0.35 + 0.35 * Math.max(flash, res)})` : "none" }}>
                {lleno ? <span style={{ fontFamily: i === 0 ? "SeqM" : "SeqH", fontSize: tam, letterSpacing: -tam * 0.03, color: "white", whiteSpace: "nowrap", textShadow: sombraTxt, opacity: Math.min(1, q * 1.6), transform: `translateY(${(1 - q) * 16}px) scale(${0.7 + 0.3 * q})` }}>{txt}</span> : null}
                <div style={{ position: "absolute", inset: 0, background: "white", opacity: 0.35 * flash, borderRadius: 14 }} />
              </div>
            );
          });
        })}
      </> : null}
    </AbsoluteFill>
  );
};
