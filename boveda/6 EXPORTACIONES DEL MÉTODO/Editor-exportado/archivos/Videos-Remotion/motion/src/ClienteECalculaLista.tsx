import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

// "Calcula esto" (ClienteE), estilo del ejemplo de @salvatfit_ con la marca de ClienteE:
// píldora "Perder grasa 🔥" y una lista que se acumula; cada línea nace como operación ("80kg × 30")
// y se transforma en el resultado con emoji ("🔥 2400 kcal"). Fondo transparente.
const NARANJA = "#FF5800";
const EMOJI = "'Apple Color Emoji', sans-serif";
const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Una operación: aparece en t, cambia de texto en cada paso y en tFin se convierte en línea de la lista (si lleva "item") o se va.
export type Op = { t: number; pasos: [number, string][]; tFin: number; item?: { emoji: string; txt: string }; oculta?: boolean };
// Tarjeta de cálculo: filas que se escriben pieza a pieza y se quedan; "res" en naranja, signos en naranja.
export type Pieza = [number, string, ("n" | "op" | "res" | "e")?];
export type Tarjeta = { t: number; tFin: number; titulo?: string; filas: Pieza[][]; y?: number };
// Resaltes de líneas de la lista: [índice de línea, desde, hasta]
export type Resalte = [number, number, number];

export const ClienteECalculaLista: React.FC<{ titulo?: string; tTitulo?: number; ops: Op[]; x?: number; y?: number; tam?: number; lineaH?: number; tFuera?: number; tamTitulo?: number; tituloDerecha?: number; yLista?: number; tarjetas?: Tarjeta[]; resaltes?: Resalte[]; yTarjeta?: number; tarjetaX?: [number, number]; tamTarjeta?: number; guias?: boolean }> = ({
  titulo = "Perder grasa", tTitulo = 0.2, ops, x = 700, y = 300, tam = 54, lineaH = 84, tFuera, tamTitulo, tituloDerecha, yLista: yListaP, tarjetas = [], resaltes = [], yTarjeta = 1170, tarjetaX = [50, 1030], tamTarjeta = 0.9, guias = false,
}) => {
  const [h] = useState(() => delayRender("fuentes lista"));
  useEffect(() => {
    Promise.all([["SeqH", "marca/f/sequel-heavy.otf"], ["SeqM", "marca/f/sequel-medium.otf"]].map(([n, f]) => new FontFace(n, `url(${staticFile(f)})`).load().then((x) => document.fonts.add(x))))
      .then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
  const f = useCurrentFrame(), { fps, durationInFrames } = useVideoConfig(), s = f / fps;
  const fin = tFuera ?? durationInFrames / fps - 0.35;
  const sal = interpolate(s, [fin, fin + 0.3], [1, 0], c);
  const sp = (t: number) => spring({ frame: f - Math.round(t * fps), fps, config: { damping: 14, stiffness: 200, mass: 0.7 } });

  const contorno: React.CSSProperties = { WebkitTextStroke: `${tam * 0.11}px #141414`, paintOrder: "stroke fill" } as React.CSSProperties;
  const itemsHechos = ops.filter((o) => o.item);
  const yLista = yListaP ?? y + 120;
  const tT = tamTitulo ?? tam;
  // cuántas líneas hay ya en la lista en este momento (para colocar la operación debajo)
  const enLista = itemsHechos.filter((o) => s >= o.tFin).length;
  const pTitulo = sp(tTitulo);

  return (
    <AbsoluteFill style={{ opacity: sal }}>
      {/* píldora */}
      <div style={{ position: "absolute", ...(tituloDerecha != null ? { right: tituloDerecha } : { left: x }), top: y, display: "flex", alignItems: "center", gap: 10, opacity: Math.min(1, pTitulo * 1.5), transform: `translateX(${(1 - pTitulo) * 80}px) scale(${0.7 + 0.3 * pTitulo})`, transformOrigin: tituloDerecha != null ? "100% 50%" : "0 50%" }}>
        <div style={{ fontFamily: "SeqH", fontSize: tT * 0.8, letterSpacing: -tT * 0.03, color: "white", background: NARANJA, padding: `${tT * 0.12}px ${tT * 0.32}px ${tT * 0.2}px`, borderRadius: tT * 0.24, boxShadow: "0 0 26px rgba(255,88,0,0.45), 0 8px 18px rgba(0,0,0,0.25)" }}>{titulo}</div>
        <div style={{ fontFamily: EMOJI, fontSize: tT * 1.05, transform: `rotate(${Math.sin(s * 5) * 6}deg)` }}>🔥</div>
      </div>
      {/* lista acumulada */}
      {itemsHechos.map((o, i) => {
        if (s < o.tFin) return null;
        const p = sp(o.tFin);
        const r = resaltes.filter(([k]) => k === i).reduce((m, [, a, b]) => Math.max(m, interpolate(s, [a, a + 0.12, b - 0.15, b], [0, 1, 1, 0], c)), 0);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: yLista + i * lineaH, display: "flex", alignItems: "center", gap: 14, opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 26}px) scale(${(0.8 + 0.2 * p) * (1 + 0.12 * r)})`, transformOrigin: "0 50%", padding: "0 14px", marginLeft: -14, borderRadius: 18, background: `rgba(255,88,0,${0.18 * r})`, boxShadow: r > 0 ? `0 0 ${30 * r}px rgba(255,88,0,${0.45 * r})` : "none" }}>
            <span style={{ fontFamily: EMOJI, fontSize: tam * 0.92 }}>{o.item!.emoji}</span>
            <span style={{ fontFamily: "SeqH", fontSize: tam, letterSpacing: -tam * 0.035, color: NARANJA, ...contorno, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.25))" }}>{o.item!.txt}</span>
          </div>
        );
      })}
      {/* operación en curso */}
      {ops.map((o, i) => {
        if (o.oculta || s < o.t || s >= o.tFin + 0.01) return null;
        let txt = o.pasos[0][1];
        let tCambio = o.pasos[0][0];
        for (const [t, v] of o.pasos) if (s >= t) { txt = v; tCambio = t; }
        const p = sp(Math.max(o.t, tCambio));
        const vaALista = !!o.item;
        const sale = interpolate(s, [o.tFin - 0.18, o.tFin], [0, 1], c);
        const slot = vaALista ? itemsHechos.indexOf(o) : enLista;
        const yOp = yLista + slot * lineaH;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: yOp, opacity: (1 - sale) * Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 50}px) scale(${(0.85 + 0.15 * p) * (1 - 0.2 * sale)})`, transformOrigin: "0 50%", fontFamily: "SeqH", fontSize: tam * 0.86, letterSpacing: -tam * 0.03, color: "white", ...contorno, whiteSpace: "nowrap", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))" }}>
            {txt.split(/([×÷+−=])/).map((part, k) => /[×÷+−=]/.test(part) ? <span key={k} style={{ color: NARANJA }}>{part}</span> : <span key={k}>{part}</span>)}
          </div>
        );
      })}
      {/* tarjetas de cálculo */}
      {tarjetas.map((tj, i) => {
        if (s < tj.t || s > tj.tFin + 0.3) return null;
        const p = sp(tj.t), fuera = interpolate(s, [tj.tFin, tj.tFin + 0.3], [0, 1], c);
        const tf = tam * tamTarjeta, filaH = tf * 1.38;
        return (
          <div key={i} style={{ position: "absolute", left: tarjetaX[0], right: 1080 - tarjetaX[1], top: tj.y ?? yTarjeta, opacity: Math.min(1, p * 1.5) * (1 - fuera), transform: `translateY(${(1 - p) * 60 + fuera * 40}px) scale(${0.92 + 0.08 * p})`, transformOrigin: "50% 0", background: "rgba(255,255,255,0.93)", borderRadius: 34, padding: `${tf * 0.55}px ${tf * 0.7}px ${tf * 0.45}px`, boxShadow: "0 18px 50px rgba(0,0,0,0.28), 0 0 0 3px rgba(255,88,0,0.55)" }}>
            {tj.titulo ? <div style={{ fontFamily: "SeqH", fontSize: tf * 0.72, color: NARANJA, letterSpacing: -1, marginBottom: tf * 0.25 }}>{tj.titulo}</div> : null}
            {tj.filas.map((fila, j) => (
              <div key={j} style={{ height: filaH, display: "flex", alignItems: "center", gap: tf * 0.28, whiteSpace: "nowrap" }}>
                {fila.map(([t, txt, tipo], k) => {
                  if (s < t) return null;
                  const q = sp(t);
                  const col = tipo === "op" || tipo === "res" ? NARANJA : "#161616";
                  return <span key={k} style={{ display: "inline-block", opacity: Math.min(1, q * 1.6), transform: `translateY(${(1 - q) * 14}px) scale(${0.7 + 0.3 * q})`, fontFamily: tipo === "e" ? EMOJI : "SeqH", fontSize: tipo === "e" ? tf * 0.95 : tipo === "res" ? tf * 1.08 : tf, letterSpacing: -tf * 0.03, color: col }}>{txt}</span>;
                })}
              </div>
            ))}
          </div>
        );
      })}
      {guias ? <div style={{ position: "absolute", left: 70, top: 250, width: 850, height: 1220, border: "4px dashed #00e5ff" }} /> : null}
    </AbsoluteFill>
  );
};
