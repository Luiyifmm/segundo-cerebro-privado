import React, { useEffect, useState } from "react";
import { AbsoluteFill, Img, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Piezas de ClienteE (CLIENTE-E_1009_01, "Te quita el hambre"), con fondo transparente:
//  ClienteEResumen: tres emojis (fibra, proteína, volumen) que suben desde abajo; después se recortan con la silueta de ClienteE para que salgan por detrás.
//  ClienteECierre: guardar, compartir y seguir.
const NARANJA = "#FF5800";
const FUENTES: [string, string][] = [["SeqH", "marca/f/sequel-heavy.otf"], ["SeqM", "marca/f/sequel-medium.otf"]];
const EMOJI = "'Apple Color Emoji', sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useFuentes = () => { const [h] = useState(() => delayRender("fuentes clientee")); useEffect(() => { Promise.all(FUENTES.map(([n, f]) => new FontFace(n, `url(${staticFile(f)})`).load().then((x) => document.fonts.add(x)))).then(() => continueRender(h)).catch(() => continueRender(h)); }, [h]); };

export const ClienteEResumen: React.FC<{ items: { e: string; t: number; x: number; y: number; txt: string }[] }> = ({ items }) => {
  useFuentes();
  const frame = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const sale = interpolate(frame, [durationInFrames - 8, durationInFrames - 1], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: sale }}>
      {items.map((it, i) => {
        const s = spring({ frame: frame - Math.round(it.t * fps), fps, config: { damping: 13, mass: 0.8, stiffness: 110 } });
        if (frame < Math.round(it.t * fps)) return null;
        const y = it.y + (1 - s) * (1500 - it.y), flota = Math.sin((frame / fps) * 1.8 + i) * 8;
        return (
          <div key={i} style={{ position: "absolute", left: it.x - 170, top: y - 150 + flota, width: 340, textAlign: "center", transform: `rotate(${(1 - s) * (i % 2 ? 14 : -14)}deg) scale(${0.7 + 0.3 * s})` }}>
            <div style={{ fontFamily: EMOJI, fontSize: 230, lineHeight: 1.1, filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.45))" }}>{it.e}</div>
            <div style={{ fontFamily: "SeqH", fontSize: 44, letterSpacing: -1, color: "white", textShadow: "0 3px 14px rgba(0,0,0,0.75)", marginTop: -6, opacity: interpolate(s, [0.7, 1], [0, 1], clamp) }}>{it.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Icono: React.FC<{ tipo: "guardar" | "compartir"; activo: number; pop: number; color?: string }> = ({ tipo, activo, pop, color = NARANJA }) => (
  <div style={{ width: 170, height: 170, borderRadius: 48, background: activo > 0.5 ? color : "rgba(255,255,255,0.96)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop * (1 + 0.12 * Math.sin(Math.min(1, activo) * Math.PI))})`, boxShadow: activo > 0.5 ? `0 16px 44px ${color}88` : "0 16px 44px rgba(0,0,0,0.35)" }}>
    <svg width={92} height={92} viewBox="0 0 24 24" fill={activo > 0.5 && tipo === "guardar" ? "white" : "none"} stroke={activo > 0.5 ? "white" : "#111"} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
      {tipo === "guardar" ? <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.6L5 21V4.5a1 1 0 0 1 1-1z" /> : <><path d="M21.5 2.5 10.8 13.2" /><path d="M21.5 2.5 14.6 21.5l-3.8-8.3L2.5 9.4z" /></>}
    </svg>
  </div>
);

export const ClienteECierre: React.FC<{ tGuardar: number; tCompartir: number; tSeguir: number; cuenta: string; y: number; soloSeguir?: boolean; soloGuardar?: boolean; color?: string; x?: number }> = ({ tGuardar, tCompartir, tSeguir, cuenta, y, soloSeguir = false, soloGuardar = false, color = NARANJA, x }) => {
  useFuentes();
  const frame = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps, sp = (a: number) => spring({ frame: frame - Math.round(a * fps), fps, config: { damping: 13, mass: 0.6 } });
  const sale = interpolate(frame, [durationInFrames - 6, durationInFrames - 1], [1, 0], clamp);
  const seg = sp(tSeguir), pulsa = interpolate(t, [tSeguir + 0.75, tSeguir + 0.85, tSeguir + 1.0], [0, 1, 0], clamp), hecho = t >= tSeguir + 0.85;
  return (
    <AbsoluteFill style={{ opacity: sale }}>
      <div style={{ position: "absolute", left: x === undefined ? 0 : x - 120, ...(x === undefined ? { right: 0 } : { width: 240 }), top: y, display: soloSeguir ? "none" : "flex", justifyContent: "center", gap: 60 }}>
        <div style={{ textAlign: "center" }}><Icono tipo="guardar" color={color} activo={interpolate(t, [tGuardar, tGuardar + 0.18], [0, 1], clamp)} pop={sp(tGuardar - 0.25)} /><div style={{ fontFamily: "SeqM", fontSize: 34, color: "white", marginTop: 14, textShadow: "0 3px 12px rgba(0,0,0,0.7)", opacity: sp(tGuardar - 0.25) }}>Guárdalo</div></div>
        <div style={{ textAlign: "center", display: soloGuardar ? "none" : "block" }}><Icono tipo="compartir" activo={interpolate(t, [tCompartir, tCompartir + 0.18], [0, 1], clamp)} pop={sp(tCompartir - 0.25)} /><div style={{ fontFamily: "SeqM", fontSize: 34, color: "white", marginTop: 14, textShadow: "0 3px 12px rgba(0,0,0,0.7)", opacity: sp(tCompartir - 0.25) }}>Compártelo</div></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: y + 290, display: soloGuardar ? "none" : "flex", justifyContent: "center", opacity: Math.min(1, seg * 1.5), transform: `translateY(${(1 - seg) * 40}px) scale(${0.92 + 0.08 * seg})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, background: "rgba(255,255,255,0.97)", borderRadius: 70, padding: "18px 20px 18px 38px", boxShadow: "0 20px 56px rgba(0,0,0,0.4)" }}>
          <span style={{ fontFamily: "SeqH", fontSize: 44, letterSpacing: -1.4, color: "#111" }}>@{cuenta}</span>
          <span style={{ fontFamily: "SeqH", fontSize: 34, letterSpacing: -0.6, color: hecho ? "#111" : "white", background: hecho ? "#E9EDF2" : NARANJA, borderRadius: 50, padding: "16px 32px", transform: `scale(${1 - 0.08 * pulsa})` }}>{hecho ? "Siguiendo" : "Seguir"}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// "Pura azúcar": emoji, flecha digital (segmentos que se encienden uno a uno) y texto con resplandor naranja. Fondo transparente.
export const ClienteEAzucar: React.FC<{ emoji: string; texto: string; tEmoji: number; tFlecha: number; tTexto: number }> = ({ emoji, texto, tEmoji, tFlecha, tTexto }) => {
  useFuentes();
  const frame = useCurrentFrame(); const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps, sale = interpolate(frame, [durationInFrames - 6, durationInFrames - 1], [1, 0], clamp);
  const e = spring({ frame: frame - Math.round(tEmoji * fps), fps, config: { damping: 11, mass: 0.7 } });
  const tx = spring({ frame: frame - Math.round(tTexto * fps), fps, config: { damping: 12, mass: 0.6 } });
  const N = 9, enc = Math.max(0, Math.min(N + 1, Math.floor((t - tFlecha) * fps / 1.2)));
  const P0 = [385, 300], P1 = [520, 190], P2 = [650, 210], P3 = [742, 352];
  const bz = (u: number) => [0, 1].map((k) => Math.pow(1 - u, 3) * P0[k] + 3 * Math.pow(1 - u, 2) * u * P1[k] + 3 * (1 - u) * u * u * P2[k] + Math.pow(u, 3) * P3[k]);
  const glow = `drop-shadow(0 2px 6px rgba(0,0,0,0.5)) drop-shadow(0 0 16px ${NARANJA}cc)`, parp = t - tFlecha > 0 && t - tFlecha < 0.5 ? 0.75 + 0.25 * Math.sin(frame * 2.4) : 1;
  return (
    <AbsoluteFill style={{ opacity: sale }}>
      {frame >= Math.round(tEmoji * fps) && <div style={{ position: "absolute", left: 95, top: 190, fontFamily: EMOJI, fontSize: 250, lineHeight: 1.1, transform: `scale(${e}) rotate(${(1 - e) * -25 - 8}deg)`, filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.45))" }}>{emoji}</div>}
      <svg width={1080} height={1920} style={{ position: "absolute", filter: glow, opacity: parp }}>
        {Array.from({ length: N }, (_, i) => { if (i >= enc) return null; const a = bz((i + 0.16) / N), b = bz((i + 0.74) / N); return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={NARANJA} strokeWidth={13} strokeLinecap="butt" />; })}
        {enc > N && <><line x1={690} y1={318} x2={748} y2={362} stroke={NARANJA} strokeWidth={13} /><line x1={748} y1={362} x2={757} y2={290} stroke={NARANJA} strokeWidth={13} /></>}
      </svg>
      {frame >= Math.round(tTexto * fps) && <div style={{ position: "absolute", left: 450, width: 600, top: 398, textAlign: "center", fontFamily: "SeqH", fontSize: 98, letterSpacing: -3.5, lineHeight: 0.95, color: NARANJA, textShadow: `0 3px 10px rgba(0,0,0,0.55), 0 0 26px ${NARANJA}cc, 0 0 60px ${NARANJA}99`, transform: `scale(${0.7 + 0.3 * tx}) rotate(-4deg)`, opacity: Math.min(1, tx * 1.6) }}>{texto}</div>}
    </AbsoluteFill>
  );
};

// Portada del reel (1080×1920; lo importante dentro de la franja central 3:4 que se ve en la cuadrícula del perfil)
const Sello: React.FC<{ ok: boolean }> = ({ ok }) => (
  <div style={{ position: "absolute", right: -18, top: -18, width: 104, height: 104, borderRadius: 52, background: ok ? NARANJA : "#1B1B1B", border: "6px solid white", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 26px rgba(0,0,0,0.45)" }}>
    <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round">{ok ? <path d="M4.5 12.5l5 5L19.5 7" /> : <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>}</svg>
  </div>
);
export const ClienteEPortada: React.FC<{ l1: string; grande: string; l3: string }> = ({ l1, grande, l3 }) => {
  useFuentes();
  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <Img src={staticFile("clientee/portada-base.jpg")} style={{ position: "absolute", width: 1080 * 1.32, left: -1080 * 0.2, top: -70 }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 26%, rgba(0,0,0,0) 46%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.6) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 285, textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontFamily: "SeqM", fontSize: 78, letterSpacing: -2.6, color: "white", textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>{l1}</div>
        <div style={{ fontFamily: "SeqH", fontSize: 236, letterSpacing: -11, marginTop: -8, backgroundImage: "linear-gradient(180deg, #FFD23A 0%, #FF8A1A 48%, #FF5800 100%)", WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.5))", paddingBottom: 14 }}>{grande}</div>
        <div style={{ fontFamily: "SeqH", fontSize: 118, letterSpacing: -5, color: "white", marginTop: -30, textShadow: "0 5px 20px rgba(0,0,0,0.6)" }}>{l3}</div>
      </div>
      <div style={{ position: "absolute", left: 50, top: 1270, width: 330, transform: "rotate(-7deg)" }}><Img src={staticFile("clientee/malo.png")} style={{ width: "100%", filter: "drop-shadow(0 22px 34px rgba(0,0,0,0.55))" }} /><Sello ok={false} /></div>
      <div style={{ position: "absolute", right: 46, top: 1250, width: 380, transform: "rotate(6deg)" }}><Img src={staticFile("clientee/bueno.png")} style={{ width: "100%", filter: "drop-shadow(0 22px 34px rgba(0,0,0,0.55))" }} /><Sello ok /></div>
    </AbsoluteFill>
  );
};

// Portada "misterio": los dos títulos del vídeo arriba y cinco alimentos en silueta oscura con interrogación
export const ClienteEPortada2: React.FC = () => {
  useFuentes();
  const A = [{ f: "a1.png", x: 150, y: 1210, w: 250, r: -10 }, { f: "a2.png", x: 345, y: 1390, w: 300, r: 6 }, { f: "a4.png", x: 540, y: 1215, w: 290, r: -4 }, { f: "a3.png", x: 745, y: 1410, w: 330, r: -8 }, { f: "a5.png", x: 930, y: 1215, w: 250, r: 9 }];
  const T: React.CSSProperties = { fontFamily: "SeqH", color: NARANJA, lineHeight: 0.92, textShadow: "0 5px 22px rgba(0,0,0,0.55)", textAlign: "center", position: "absolute" };
  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <Img src={staticFile("clientee/portada2-base.jpg")} style={{ position: "absolute", width: "100%", height: "100%" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.3) 22%, rgba(0,0,0,0) 38%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
      <div style={{ ...T, left: 40, width: 480, top: 300 }}><div style={{ fontSize: 96, letterSpacing: -4 }}>NO QUITA</div><div style={{ fontSize: 79, letterSpacing: -3 }}>EL HAMBRE</div></div>
      <div style={{ ...T, left: 580, width: 470, top: 280 }}><div style={{ fontSize: 132, letterSpacing: -6 }}>QUITA</div><div style={{ fontSize: 76, letterSpacing: -3 }}>EL HAMBRE</div></div>
      {A.map((a, i) => (
        <div key={i} style={{ position: "absolute", left: a.x - a.w / 2, top: a.y - a.w / 2, width: a.w, height: a.w, transform: `rotate(${a.r}deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile("clientee/" + a.f)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", filter: `brightness(0.07) contrast(1.2) drop-shadow(0 0 14px ${NARANJA}) drop-shadow(0 0 34px ${NARANJA}99) drop-shadow(0 18px 26px rgba(0,0,0,0.6))` }} />
          <div style={{ position: "relative", fontFamily: "SeqH", fontSize: a.w * 0.62, color: "white", transform: `rotate(${-a.r}deg)`, textShadow: `0 0 22px ${NARANJA}, 0 0 50px ${NARANJA}, 0 4px 10px rgba(0,0,0,0.8)`, lineHeight: 1 }}>?</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ClienteN: banda de "zona ideal" sobre la botella (franja verde translúcida con rótulo). Fondo transparente.
export const ZonaIdeal: React.FC<{ x1: number; x2: number; y1: number; y2: number; texto: string }> = ({ x1, x2, y1, y2, texto }) => {
  useFuentes(); const V = "#22B573";
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: x1, top: y1, width: x2 - x1, height: y2 - y1, background: `${V}40`, borderTop: `7px dashed ${V}`, borderBottom: `7px dashed ${V}`, boxSizing: "border-box" }} />
      <div style={{ position: "absolute", left: x1, width: x2 - x1, top: y1 - 62, display: "flex", justifyContent: "center" }}><div style={{ background: V, color: "white", fontFamily: "SeqH", fontSize: 34, letterSpacing: -0.6, padding: "9px 22px", borderRadius: 30, boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}>{texto}</div></div>
    </AbsoluteFill>
  );
};

// Portada con foto propia del vídeo (sin pegatinas de alimentos): mismo bloque de título de marca que ClienteEPortada.
// Hecha el 12-10-2026 para "Perder grasa sin perder músculo"; la foto debe traer al sujeto por debajo del título.
export const ClienteEPortada3: React.FC<{ foto: string; l1: string; grande: string; l3: string; tam?: number; tam3?: number; bajar?: number; zoom?: number; top?: number }> = ({ foto, l1, grande, l3, tam = 236, tam3 = 150, bajar = 0, zoom = 1, top = 250 }) => {
  useFuentes();
  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <Img src={staticFile(foto)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `translateY(${bajar}px) scale(${zoom})`, transformOrigin: "50% 100%", filter: "contrast(1.18) saturate(1.22) brightness(0.96)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.62) 26%, rgba(0,0,0,0.08) 44%, rgba(0,0,0,0) 66%, rgba(0,0,0,0.7) 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(1000px 1300px at 55% 62%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontFamily: "SeqM", fontSize: 84, letterSpacing: -2.6, color: "white", textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>{l1}</div>
        <div style={{ fontFamily: "SeqH", fontSize: tam, letterSpacing: -tam * 0.045, marginTop: -4, backgroundImage: "linear-gradient(180deg, #FFD23A 0%, #FF8A1A 48%, #FF5800 100%)", WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.5))", paddingBottom: 14 }}>{grande}</div>
        <div style={{ fontFamily: "SeqH", fontSize: tam3, letterSpacing: -tam3 * 0.04, color: "white", marginTop: -26 * tam3 / 150, textShadow: "0 5px 20px rgba(0,0,0,0.6)" }}>{l3}</div>
      </div>
    </AbsoluteFill>
  );
};

// Portada "Calcula esto": fondo naranja intenso, ClienteE recortado grande con borde blanco y tarjetas con operaciones del vídeo.
export const ClienteEPortadaCalcula: React.FC<{ persona: string; l1: string; grande: string; ops: { e: string; a: string; b: string; x: number; y: number; r: number; s?: number }[]; zoom?: number; cx?: number; oy?: number; dx?: number; dy?: number; tam?: number; fondo?: string }> = ({ persona, l1, grande, ops, zoom = 1.55, cx = 594, oy = 97, dx = -54, dy = 0, tam = 150, fondo }) => {
  useFuentes();
  const tr = { transform: `translate(${dx}px, ${dy}px) scale(${zoom})`, transformOrigin: `${cx}px ${oy}px` };
  if (fondo) return (
    <AbsoluteFill style={{ backgroundColor: "#111", overflow: "hidden" }}>
      {/* versión natural: su propio fotograma, con la misma escala que el recorte */}
      <Img src={staticFile(fondo)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...tr, filter: "contrast(1.12) saturate(1.15) brightness(0.97)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(1000px 1300px at 55% 60%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0) 36%)" }} />
      {ops.map((o, i) => (
        <div key={i} style={{ position: "absolute", left: o.x, top: o.y, transform: `rotate(${o.r}deg) scale(${o.s ?? 1})`, background: "white", borderRadius: 30, padding: "22px 34px 24px", boxShadow: "0 18px 40px rgba(0,0,0,0.35)", fontFamily: "SeqH", lineHeight: 1.05, whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 58, letterSpacing: -1.5, color: "#1a1a1a" }}>{o.e} {o.a}</div>
          <div style={{ fontSize: 76, letterSpacing: -2.5, color: "#FF5800", marginTop: 4 }}>{o.b}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontFamily: "SeqM", fontSize: 86, letterSpacing: -2.6, color: "white", textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>{l1}</div>
        <div style={{ fontFamily: "SeqH", fontSize: tam, letterSpacing: -tam * 0.045, marginTop: 6, backgroundImage: "linear-gradient(180deg, #FFD23A 0%, #FF8A1A 48%, #FF5800 100%)", WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.5))", paddingBottom: 12 }}>{grande}</div>
      </div>
    </AbsoluteFill>
  );
  const simbolos = ["×", "÷", "=", "+", "%", "×", "=", "÷", "+", "×", "=", "÷"];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(1100px 1300px at 50% 62%, #FF8A1E 0%, #FF5A00 45%, #C83A00 78%, #5A1800 100%)", overflow: "hidden" }}>
      {/* rayos de luz y símbolos de operación de fondo */}
      <AbsoluteFill style={{ background: "repeating-conic-gradient(from 0deg at 50% 58%, rgba(255,230,160,0.13) 0deg 7deg, rgba(255,230,160,0) 7deg 18deg)", WebkitMaskImage: "radial-gradient(900px 1100px at 50% 58%, black 10%, transparent 75%)" }} />
      {simbolos.map((t, i) => (
        <div key={i} style={{ position: "absolute", left: (i * 263) % 1000 - 20, top: 380 + ((i * 397) % 1450), fontFamily: "SeqH", fontSize: 150 + (i % 3) * 60, color: "rgba(255,255,255,0.10)", transform: `rotate(${(i % 2 ? 1 : -1) * (8 + i * 3)}deg)` }}>{t}</div>
      ))}
      {/* ClienteE: borde blanco tipo pegatina + sombra */}
      <Img src={staticFile(persona)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `translate(${dx}px, ${dy}px) scale(${zoom})`, transformOrigin: `${cx}px ${oy}px`, filter: "contrast(1.1) saturate(1.15) drop-shadow(0 0 0 white) drop-shadow(5px 0 0 white) drop-shadow(-5px 0 0 white) drop-shadow(0 5px 0 white) drop-shadow(0 -5px 0 white) drop-shadow(0 30px 40px rgba(60,15,0,0.55))" }} />
      {/* oscurecido arriba para el título */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(40,10,0,0.78) 0%, rgba(40,10,0,0.35) 20%, rgba(40,10,0,0) 34%)" }} />
      {ops.map((o, i) => (
        <div key={i} style={{ position: "absolute", left: o.x, top: o.y, transform: `rotate(${o.r}deg) scale(${o.s ?? 1})`, transformOrigin: "50% 50%", background: "white", borderRadius: 30, padding: "22px 34px 24px", boxShadow: "0 18px 40px rgba(60,15,0,0.45)", fontFamily: "SeqH", lineHeight: 1.05, whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 58, letterSpacing: -1.5, color: "#1a1a1a" }}>{o.e} {o.a}</div>
          <div style={{ fontSize: 76, letterSpacing: -2.5, color: "#FF5800", marginTop: 4 }}>{o.b}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontFamily: "SeqM", fontSize: 86, letterSpacing: -2.6, color: "white", textShadow: "0 4px 18px rgba(0,0,0,0.55)" }}>{l1}</div>
        <div style={{ fontFamily: "SeqH", fontSize: tam, letterSpacing: -tam * 0.045, marginTop: 6, color: "#FFE600", textShadow: "0 6px 0 #2a0c00, 0 10px 30px rgba(0,0,0,0.55)" }}>{grande}</div>
      </div>
    </AbsoluteFill>
  );
};

// Portada de vídeos de comparación por columnas (guion 17 "Tres cardios"): título arriba en negro y una columna por máquina.
export const ClienteEPortadaColumnas: React.FC<{ fotos: { src: string; x: number; zoom?: number; etiqueta: string }[]; l1: string; grande: string; l3: string; tam?: number; arriba?: number }> = ({ fotos, l1, grande, l3, tam = 300, arriba = 640 }) => {
  useFuentes(); const ancho = 1080 / fotos.length;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0b" }}>
      {fotos.map((f, i) => (
        <div key={i} style={{ position: "absolute", left: i * ancho, top: arriba, width: ancho, height: 1920 - arriba, overflow: "hidden" }}>
          <Img src={staticFile(f.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${f.x}% 100%`, transform: `scale(${f.zoom ?? 1})`, transformOrigin: `${f.x}% 100%`, filter: "contrast(1.12) saturate(1.08) brightness(0.92)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center" }}>
            <span style={{ fontFamily: "SeqM", fontSize: 34, letterSpacing: 2, color: "white", background: "rgba(0,0,0,0.62)", padding: "10px 20px", borderRadius: 40 }}>{f.etiqueta}</span>
          </div>
          {i > 0 && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: "white" }} />}
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: arriba - 2, height: 220, background: "linear-gradient(180deg, rgba(11,11,11,1) 0%, rgba(11,11,11,0) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 260, background: "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontFamily: "SeqM", fontSize: 88, letterSpacing: -2.6, color: "white" }}>{l1}</div>
        <div style={{ fontFamily: "SeqH", fontSize: tam, letterSpacing: -tam * 0.045, marginTop: -6, backgroundImage: "linear-gradient(180deg, #FFD23A 0%, #FF8A1A 48%, #FF5800 100%)", WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.5))", paddingBottom: 10 }}>{grande}</div>
        <div style={{ fontFamily: "SeqH", fontSize: 120, letterSpacing: -5, color: "white", marginTop: -30 }}>{l3}</div>
      </div>
    </AbsoluteFill>
  );
};

// Variante sin líneas: fotos a toda altura que se funden entre sí, sombreado superior suave, título arriba y sello central (p. ej. "1 MES").
export const ClienteEPortadaColumnas2: React.FC<{ fotos: { src: string; x: number; y?: number; zoom?: number; etiqueta: string; baja?: number; dx?: number }[]; l1: string; grande: string; l3: string; centro?: string; tam?: number; funde?: number; arriba?: number; fundeArriba?: number; fondo?: string; centroY?: number; baja?: number; abajo?: number; abajoAlto?: number }> = ({ fotos, l1, grande, l3, centro, tam = 230, funde = 130, arriba = 520, fundeArriba = 260, fondo = "linear-gradient(180deg, #3a332f 0%, #241f1c 100%)", centroY = 1080, baja = 0, abajo = 0.4, abajoAlto = 300 }) => {
  useFuentes(); const n = fotos.length, ancho = 1080 / n, h = 1920 - arriba;
  const vert = `linear-gradient(180deg, transparent 0px, transparent ${baja}px, black ${baja + fundeArriba}px, black 100%)`;
  return (
    <AbsoluteFill style={{ background: fondo }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: arriba, height: h, WebkitMaskImage: vert, maskImage: vert }}>
        {fotos.map((f, i) => {
          const izq = i === 0 ? 0 : funde, der = i === n - 1 ? 0 : funde, w = ancho + izq / 2 + der / 2, left = i * ancho - izq / 2;
          const m = `linear-gradient(90deg, transparent 0px, black ${izq}px, black ${w - der}px, transparent ${w}px)`;
          return (
            <div key={i} style={{ position: "absolute", left, top: 0, width: w, height: h, overflow: "hidden", WebkitMaskImage: m, maskImage: m }}>
              {(f.zoom ?? 1) < 1 ? <Img src={staticFile(f.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(28px) brightness(0.7)", transform: "scale(1.15)" }} /> : null}
              {(f.zoom ?? 1) < 1 ? (
                <div style={{ position: "absolute", left: 0, top: f.baja ?? baja, width: "100%", height: "100%", transform: `translateX(${f.dx ?? 0}px) scale(${f.zoom})`, transformOrigin: `${f.x}% 0%`, WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 9%, black 91%, transparent 100%)", maskImage: "linear-gradient(90deg, transparent 0%, black 9%, black 91%, transparent 100%)" }}>
                  <Img src={staticFile(f.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${f.x}% ${f.y ?? 100}%`, filter: "contrast(1.08) saturate(1.06) brightness(0.95)", WebkitMaskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)", maskImage: "linear-gradient(180deg, black 0%, black 80%, transparent 100%)" }} />
                </div>
              ) : (<Img src={staticFile(f.src)} style={{ position: "absolute", left: 0, top: f.baja ?? baja, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${f.x}% ${f.y ?? 100}%`, transform: `scale(${f.zoom ?? 1})`, transformOrigin: (f.zoom ?? 1) < 1 ? `${f.x}% 0%` : `${f.x}% 100%`, filter: "contrast(1.08) saturate(1.06) brightness(0.95)" }} />)}
            </div>
          );
        })}
      </div>
      {fotos.map((f, i) => !f.etiqueta ? null : (
        <div key={"e" + i} style={{ position: "absolute", left: i * ancho, width: ancho, bottom: 70, textAlign: "center" }}>
          <span style={{ fontFamily: "SeqM", fontSize: 34, letterSpacing: 2, color: "white", background: "rgba(0,0,0,0.55)", padding: "10px 20px", borderRadius: 40 }}>{f.etiqueta}</span>
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: abajoAlto, background: `linear-gradient(0deg, rgba(0,0,0,${abajo}) 0%, rgba(0,0,0,${abajo * 0.55}) 35%, rgba(0,0,0,0) 100%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontFamily: "SeqM", fontSize: 92, letterSpacing: -2.6, color: "white", textShadow: "0 4px 18px rgba(0,0,0,0.45)" }}>{l1}</div>
        <div style={{ fontFamily: "SeqH", fontSize: tam, letterSpacing: -tam * 0.045, marginTop: -6, backgroundImage: "linear-gradient(180deg, #FFD23A 0%, #FF8A1A 48%, #FF5800 100%)", WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.5))", paddingBottom: 10 }}>{grande}</div>
        <div style={{ fontFamily: "SeqH", fontSize: 96, letterSpacing: -4, color: "white", marginTop: -24, textShadow: "0 4px 18px rgba(0,0,0,0.45)" }}>{l3}</div>
      </div>
      {centro ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: centroY, display: "flex", justifyContent: "center" }}>
          <div style={{ fontFamily: "SeqH", fontSize: 120, letterSpacing: -4, color: "white", background: "#FF5800", padding: "6px 46px 14px", borderRadius: 36, boxShadow: "0 0 50px rgba(255,88,0,0.55), 0 14px 30px rgba(0,0,0,0.35)" }}>{centro}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Animación "Suscríbete" del canal de YouTube de ClienteE (16:9, fondo transparente para poner encima del vídeo): entra la tarjeta del canal,
// el cursor pulsa "Suscribirse", pasa a "Suscrito" con la campana sonando, y sale. 50 fps (los brutos de cámara de ClienteE van a 50).
export const ClienteESuscribirse: React.FC<{ nombre?: string; usuario?: string; subs?: string; avatar?: string; acento?: string; boton?: string; hecho?: string; icono?: "campana" | "check" }> = ({ nombre = "Ericmentorfitness", usuario = "@cliente_e2_handle", subs = "3,28 K suscriptores", avatar = "clientee/avatar-canal.png", acento = "#FF0000", boton = "Suscribirse", hecho = "Suscrito", icono = "campana" }) => {
  useFuentes(); const f = useCurrentFrame(), { fps, durationInFrames: D } = useVideoConfig();
  const ent = spring({ frame: f, fps, config: { damping: 16, stiffness: 140 } }), sal = interpolate(f, [D - 18, D - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const CLIC = Math.round(fps * 1.7), pulsado = f >= CLIC, pr = interpolate(f, [CLIC - 4, CLIC, CLIC + 6], [1, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cx = interpolate(f, [fps * 0.7, CLIC - 3], [1720, 1372], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const cy = interpolate(f, [fps * 0.7, CLIC - 3], [1080, 792], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const cOp = interpolate(f, [fps * 0.6, fps * 0.8, CLIC + fps * 0.6, CLIC + fps * 0.9], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const T0 = CLIC + Math.round(fps * 0.25), cam = f > T0 ? Math.sin((f - T0) / fps * 28) * 22 * Math.exp(-(f - T0) / fps * 3.2) : 0;
  const onda = interpolate(f, [CLIC, CLIC + fps * 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(ent, [0, 1], [220, 0]) + sal * 220, op = Math.min(ent * 1.4, 1) * (1 - sal);
  const N = acento;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 360, top: 700, width: 1200, height: 200, transform: `translateY(${y}px)`, opacity: op, background: "rgba(15,15,15,0.94)", borderRadius: 100, boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 34px", boxSizing: "border-box" }}>
        <div style={{ width: 150, height: 150, borderRadius: "50%", overflow: "hidden", flexShrink: 0, boxShadow: `0 0 0 4px ${pulsado ? N : "rgba(255,255,255,0.15)"}` }}>
          <Img src={staticFile(avatar)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.06) translateY(-2%)" }} />
        </div>
        <div style={{ marginLeft: 34, flex: 1, lineHeight: 1.15 }}>
          <div style={{ fontFamily: "SeqH", fontSize: 58, color: "white", letterSpacing: -1.5 }}>{nombre}</div>
          <div style={{ fontFamily: "SeqM", fontSize: 30, color: "rgba(255,255,255,0.62)", marginTop: 6 }}>{usuario} · {subs}</div>
        </div>
        <div style={{ position: "relative", transform: `scale(${pr})`, display: "flex", alignItems: "center", gap: 14, height: 92, padding: "0 40px", borderRadius: 46, background: pulsado ? "rgba(255,255,255,0.14)" : "white", color: pulsado ? "white" : "#0f0f0f", fontFamily: "SeqH", fontSize: 38, letterSpacing: -0.5 }}>
          {pulsado ? <>
            {icono === "check" ? <svg width="40" height="40" viewBox="0 0 24 24" style={{ transform: `scale(${1 + Math.max(0, cam) / 60})` }}><path fill="none" stroke={N} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" d="M4 12.5l5 5L20 6.5" /></svg> : <svg width="40" height="40" viewBox="0 0 24 24" style={{ transform: `rotate(${cam}deg)`, transformOrigin: "50% 10%" }}><path fill={N} d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1Z" /></svg>}
            {hecho}
          </> : boton}
          {pulsado ? <div style={{ position: "absolute", inset: -6, borderRadius: 52, border: `4px solid ${N}`, opacity: 1 - onda, transform: `scale(${1 + onda * 0.35})` }} /> : null}
        </div>
      </div>
      <svg width="64" height="64" viewBox="0 0 24 24" style={{ position: "absolute", left: cx, top: cy + y, opacity: cOp * op, transform: `scale(${pulsado && f < CLIC + 6 ? 0.85 : 1})`, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6))" }}>
        <path d="M4 2 L4 19 L8.5 15 L11.5 22 L14.5 20.7 L11.6 14 L17.5 14 Z" fill="white" stroke="black" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};

// Versión vertical (reels 9:16) de la tarjeta de seguir: reutiliza ClienteESuscribirse escalada en la parte baja.
export const ClienteESeguirReel: React.FC<React.ComponentProps<typeof ClienteESuscribirse> & { y?: number }> = ({ y = 1180, ...p }) => (
  <AbsoluteFill><div style={{ position: "absolute", left: (1080 - 1920 * 0.62) / 2, top: y - 1080 * 0.62 * 0.55, width: 1920, height: 1080, transform: "scale(0.62)", transformOrigin: "0 0" }}><ClienteESuscribirse {...p} /></div></AbsoluteFill>
);

// Portada "Mejores desayunos parte 2": título como la parte 1, ClienteE recortado a la derecha y columna de comidas a la izquierda.
export const ClienteEPortadaLista: React.FC<{ persona: string; comidas: { img: string; alto?: number }[]; l1: string; grande: string; l3: string; etiqueta?: string; tam?: number; px?: number; py?: number; pz?: number; colY?: number; colAncho?: number }> = ({ persona, comidas, l1, grande, l3, etiqueta, tam = 236, px = 250, py = 170, pz = 1.05, colY = 760, colAncho = 360 }) => {
  useFuentes();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #151210 0%, #2a221c 22%, #8a6f55 45%, #e6c8a2 62%, #c9a983 82%, #5a4838 100%)" }}>
      <AbsoluteFill style={{ background: "radial-gradient(900px 1100px at 40% 62%, rgba(255,230,200,0.35) 0%, rgba(0,0,0,0) 70%)" }} />
      <Img src={staticFile(persona)} style={{ position: "absolute", left: px, top: py, width: 1080 * pz, height: 1920 * pz, objectFit: "contain", filter: "contrast(1.1) saturate(1.12) drop-shadow(0 20px 40px rgba(0,0,0,0.35))" }} />
      <div style={{ position: "absolute", left: 30, top: colY, width: colAncho, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        {comidas.map((c, i) => <Img key={i} src={staticFile(c.img)} style={{ width: colAncho * (c.alto && c.alto > 0.8 ? 0.82 : 0.95), objectFit: "contain", filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.45))" }} />)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", lineHeight: 1 }}>
        <div style={{ fontFamily: "SeqM", fontSize: 84, letterSpacing: -2.6, color: "white", textShadow: "0 4px 18px rgba(0,0,0,0.6)" }}>{l1}</div>
        <div style={{ fontFamily: "SeqH", fontSize: tam, letterSpacing: -tam * 0.045, marginTop: -4, backgroundImage: "linear-gradient(180deg, #FFD23A 0%, #FF8A1A 48%, #FF5800 100%)", WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.5))", paddingBottom: 14 }}>{grande}</div>
        <div style={{ fontFamily: "SeqH", fontSize: 120, letterSpacing: -4.8, color: "white", marginTop: -20, textShadow: "0 5px 20px rgba(0,0,0,0.6)" }}>{l3}</div>
        {etiqueta ? <div style={{ display: "inline-block", marginTop: 18, fontFamily: "SeqH", fontSize: 54, letterSpacing: -1, color: "white", background: "#FF5800", padding: "8px 26px 12px", borderRadius: 40, boxShadow: "0 8px 22px rgba(0,0,0,0.35)" }}>{etiqueta}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
