import React, { useEffect, useState } from "react";
import { AbsoluteFill, Img, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

// "Mejores alimentos para perder grasa" (Eric): un ranking del 5 al 1 por categoría (bebidas, proteínas, carbohidratos, grasas),
// estructura de la referencia (lista numerada que se rellena) con la marca de Eric. La lista va en el lado libre,
// donde Eric señala; cada alimento aparece grande con su nombre y vuela a su hueco. Al final, resumen de los 20.
const NARANJA = "#FF5800";
const EMOJI = "'Apple Color Emoji', sans-serif";
const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type Alimento = { img: string; nombre: string; t: number };
export type Categoria = { titulo: string; emoji: string; t: number; tFin: number; lado: "izq" | "der"; items: Alimento[] };

export const EricRankingCat: React.FC<{
  cats: Categoria[]; cabecera?: string; resumen?: { t: number; tFin: number; titulo: string };
  y0?: number; paso?: number; popY?: number; vuela?: number;
}> = ({ cats, cabecera = "Alimentos para perder grasa", resumen, y0 = 470, paso = 168, popY = 1560, vuela = 0.5 }) => {
  const [h] = useState(() => delayRender("fuentes ranking cat"));
  useEffect(() => {
    Promise.all([["SeqH", "marca/f/sequel-heavy.otf"], ["SeqM", "marca/f/sequel-medium.otf"]].map(([n, f]) => new FontFace(n, `url(${staticFile(f)})`).load().then((x) => document.fonts.add(x))))
      .then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
  const f = useCurrentFrame(), { fps } = useVideoConfig(), s = f / fps;
  const sp = (t: number, d = 14) => spring({ frame: f - Math.round(t * fps), fps, config: { damping: d, stiffness: 190, mass: 0.7 } });
  const contorno = (px: number): React.CSSProperties => ({ WebkitTextStroke: `${px}px #141414`, paintOrder: "stroke fill" } as React.CSSProperties);

  const cat = cats.find((k) => s >= k.t && s < k.tFin + 0.3);
  return (
    <AbsoluteFill>
      {cat ? (() => {
        const fuera = interpolate(s, [cat.tFin, cat.tFin + 0.3], [1, 0], c);
        const pc = sp(cat.t);
        const izq = cat.lado === "izq";
        const xCol = izq ? 50 : 1080 - 50 - 500; // columna de 500 px en el lado libre
        const xPop = xCol + 250;
        const n = cat.items.length;
        return (
          <AbsoluteFill style={{ opacity: fuera }}>
            {/* cabecera: frase fija + categoría en naranja */}
            <div style={{ position: "absolute", left: xCol - 10, width: 520, top: 150, textAlign: "center", opacity: Math.min(1, pc * 1.5), transform: `translateY(${(1 - pc) * -30}px)` }}>
              <div style={{ display: "inline-block", fontFamily: "SeqM", fontSize: 40, color: "white", background: "rgba(14,14,14,0.85)", padding: "8px 20px 12px", borderRadius: 14, letterSpacing: -1 }}>{cabecera}</div><br />
              <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginTop: 10, fontFamily: "SeqH", fontSize: 74, color: "white", background: `linear-gradient(180deg, #FF8A1A 0%, ${NARANJA} 100%)`, padding: "6px 28px 14px", borderRadius: 20, letterSpacing: -3, boxShadow: "0 0 30px rgba(255,88,0,0.55), 0 8px 18px rgba(0,0,0,0.3)" }}>
                <span style={{ fontFamily: EMOJI, fontSize: 64 }}>{cat.emoji}</span>{cat.titulo}
              </div>
            </div>
            {/* huecos numerados: 5 arriba … 1 abajo */}
            {cat.items.map((_, i) => {
              const y = y0 + i * paso, a = sp(cat.t + 0.1 + i * 0.05);
              return (
                <div key={"h" + i} style={{ position: "absolute", left: xCol, top: y, width: 500, height: 140, display: "flex", alignItems: "center", gap: 16, opacity: Math.min(1, a * 1.5), transform: `translateX(${(1 - a) * (izq ? -60 : 60)}px)` }}>
                  <div style={{ width: 92, height: 92, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(180deg, #FF8A1A 0%, ${NARANJA} 100%)`, boxShadow: "0 0 20px rgba(255,88,0,0.55), 0 6px 14px rgba(0,0,0,0.3)", fontFamily: "SeqH", fontSize: 56, color: "white", paddingBottom: 6 }}>{n - i}</div>
                  <div style={{ flex: 1, height: 130, borderRadius: 22, background: "rgba(14,14,14,0.38)", border: "3px solid rgba(255,255,255,0.18)" }} />
                </div>
              );
            })}
            {/* alimentos: aparecen grandes en el lado libre y vuelan a su hueco */}
            {cat.items.map((it, i) => {
              if (s < it.t) return null;
              const p = sp(it.t, 11);
              const v = interpolate(s, [it.t + vuela, it.t + vuela + 0.32], [0, 1], { ...c, easing: Easing.out(Easing.cubic) });
              const yHueco = y0 + i * paso + 70, xImg = xCol + 92 + 16 + 70;
              const cx = interpolate(v, [0, 1], [xPop, xImg]), cy = interpolate(v, [0, 1], [popY, yHueco]);
              const tam = interpolate(v, [0, 1], [300, 112]);
              const nombreA = interpolate(v, [0.6, 1], [0, 1], c);
              return (
                <React.Fragment key={"a" + i}>
                  <Img src={staticFile(it.img)} style={{ position: "absolute", left: cx - tam / 2, top: cy - tam / 2, width: tam, height: tam, transform: `scale(${p})`, filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.45))" }} />
                  {v < 0.4 ? <div style={{ position: "absolute", left: xPop - 300, width: 600, top: popY + 165, textAlign: "center", opacity: Math.min(1, p * 1.5) * (1 - v * 2.5), fontFamily: "SeqH", fontSize: 62, letterSpacing: -2, color: "white", ...contorno(9), filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))" }}>{it.nombre}</div> : null}
                  <div style={{ position: "absolute", left: xCol + 92 + 16 + 140, top: yHueco - 40, width: 500 - 92 - 16 - 150, height: 80, display: "flex", alignItems: "center", opacity: nombreA, fontFamily: "SeqH", fontSize: it.nombre.length > 14 ? 33 : 40, lineHeight: 1.05, letterSpacing: -1, color: "white", textShadow: "0 3px 10px rgba(0,0,0,0.5)" }}>{it.nombre}</div>
                </React.Fragment>
              );
            })}
          </AbsoluteFill>
        );
      })() : null}
      {/* resumen final: las 4 categorías con sus 5 alimentos */}
      {resumen && s >= resumen.t && s < resumen.tFin + 0.3 ? (() => {
        const p = sp(resumen.t), fu = interpolate(s, [resumen.tFin, resumen.tFin + 0.3], [1, 0], c);
        return (
          <div style={{ position: "absolute", left: 40, right: 40, top: 1180, opacity: Math.min(1, p * 1.5) * fu, transform: `translateY(${(1 - p) * 60}px) scale(${0.9 + 0.1 * p})`, background: "rgba(14,14,14,0.62)", borderRadius: 32, padding: "22px 18px 18px", boxShadow: "0 0 0 3px rgba(255,88,0,0.6), 0 18px 40px rgba(0,0,0,0.35)" }}>
            <div style={{ textAlign: "center", fontFamily: "SeqH", fontSize: 50, color: "white", letterSpacing: -1.5, marginBottom: 12 }}>{resumen.titulo}</div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {cats.map((k, j) => (
                <div key={j} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: Math.min(1, sp(resumen.t + 0.12 * j) * 1.5) }}>
                  <div style={{ fontFamily: "SeqH", fontSize: 30, color: "white", background: NARANJA, borderRadius: 12, padding: "4px 12px 8px" }}>{k.titulo}</div>
                  {k.items.map((it, i) => <Img key={i} src={staticFile(it.img)} style={{ width: 86, height: 86, transform: `scale(${sp(resumen.t + 0.12 * j + 0.06 * i, 11)})` }} />)}
                </div>
              ))}
            </div>
          </div>
        );
      })() : null}
    </AbsoluteFill>
  );
};
