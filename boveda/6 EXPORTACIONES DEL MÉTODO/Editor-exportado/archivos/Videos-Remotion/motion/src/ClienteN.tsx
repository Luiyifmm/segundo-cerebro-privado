import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Portadas de ClienteN (cliente_handle) con la dinámica de su perfil: foto oscura y elegante, línea pequeña espaciada en blanco
// y una palabra grande en rojo con serifa (como "no eres gordo estás / INFLAMADO").
const ROJO = "#D3261C";
// "dos" (12-10-2026, petición del usuario): en vez de línea + palabra, dos títulos enfrentados con los colores de marca (rojo = malo a la izquierda,
// verde = bueno a la derecha) y "misterio": alimentos en silueta oscura con interrogación, como la portada misterio de ClienteE.
export const ClienteNPortada: React.FC<{ foto: string; linea: string; palabra: string; cola?: string; y?: number; tam?: number; estilo?: "elegante" | "deportivo" | "mixto"; persona?: string; dos?: [string, string][]; misterio?: { f: string; x: number; y: number; w: number; r: number }[]; natural?: boolean; cursiva?: string; tamLinea?: number; suave?: boolean; limpio?: boolean; pinta?: { pts: [number, number][]; color?: string; opacidad?: number } }> = ({ foto, linea, palabra, cola = "", y = 300, tam = 230, estilo = "elegante", persona, dos, misterio, natural = false, cursiva, tamLinea = 100, suave = false, limpio = false, pinta }) => {
  const FUT = "'Futura-CondensedExtraBold', 'Futura', 'Avenir Next Condensed', sans-serif", FINA = "'Avenir Next', 'Helvetica Neue', sans-serif";
  const fina = (t: string, esp: number, extra: React.CSSProperties = {}) => <div style={{ fontFamily: FINA, fontWeight: 400, fontSize: 48, letterSpacing: esp, paddingLeft: esp, color: "rgba(255,244,232,0.95)", textShadow: "0 2px 16px rgba(0,0,0,0.75)", ...extra }}>{t}</div>;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0705" }}>
      {/* corrección de color como su portada de referencia: cálida, oscura, luz dorada de ventana */}
      <Img src={staticFile(foto)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: limpio ? "brightness(1.0) contrast(1.08) saturate(1.06)" : suave ? "blur(5px) brightness(0.9) contrast(1.04) saturate(1.0)" : natural ? "blur(14px) brightness(0.62) contrast(1.15) saturate(0.9) sepia(0.32) hue-rotate(-8deg)" : "brightness(1.02) contrast(1.22) saturate(1.12) sepia(0.32) hue-rotate(-8deg)", transform: natural && !suave ? "scale(1.04)" : undefined }} />
      {!suave && !limpio ? <>
      <AbsoluteFill style={{ mixBlendMode: "multiply", background: "linear-gradient(160deg, #C98A52 0%, #8E5A34 45%, #3A2216 100%)", opacity: 0.62 }} />
      <AbsoluteFill style={{ mixBlendMode: "screen", background: "radial-gradient(900px 700px at 4% 30%, rgba(255,170,80,0.42), rgba(255,150,60,0) 70%)" }} />
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.5, background: "repeating-linear-gradient(101deg, rgba(255,180,90,0.0) 0px, rgba(255,180,90,0.0) 46px, rgba(255,186,100,0.30) 60px, rgba(255,180,90,0.0) 92px)", WebkitMaskImage: "radial-gradient(760px 620px at 12% 34%, black 20%, transparent 78%)" }} />
      <AbsoluteFill style={{ mixBlendMode: "soft-light", background: "radial-gradient(640px 800px at 50% 58%, rgba(255,222,186,0.9), rgba(0,0,0,0) 72%)" }} />
      <AbsoluteFill style={{ mixBlendMode: "screen", background: "radial-gradient(520px 640px at 50% 56%, rgba(255,190,130,0.16), rgba(0,0,0,0) 70%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(900px 1080px at 48% 56%, rgba(0,0,0,0) 48%, rgba(14,8,5,0.55) 84%, rgba(8,5,3,0.92) 100%)" }} />
      </> : null}
      {/* la persona recortada va por encima del fondo tratado: nítida y con su luz, separada de la pared */}
      {persona && !limpio ? <Img src={staticFile(persona)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: suave ? "brightness(1.02) contrast(1.05) saturate(1.0) drop-shadow(0 12px 26px rgba(0,0,0,0.22))" : natural ? "brightness(1.02) contrast(1.05) saturate(1.0) drop-shadow(0 0 40px rgba(0,0,0,0.65)) drop-shadow(0 18px 30px rgba(0,0,0,0.45))" : "brightness(1.1) contrast(1.12) saturate(1.08) sepia(0.1) drop-shadow(0 0 46px rgba(0,0,0,0.6)) drop-shadow(0 18px 30px rgba(0,0,0,0.45))" }} /> : null}
      {persona && !natural && !limpio ? <AbsoluteFill style={{ mixBlendMode: "soft-light", background: "radial-gradient(700px 600px at 6% 40%, rgba(255,176,96,0.5), rgba(0,0,0,0) 72%)" }} /> : null}
      {/* músculo pintado en rojo como en el vídeo: forma del músculo recortada por la silueta de la persona */}
      {pinta && persona ? <AbsoluteFill style={{ WebkitMaskImage: `url(${staticFile(persona)})`, WebkitMaskSize: "cover", maskImage: `url(${staticFile(persona)})`, maskSize: "cover" }}>
        <svg width="100%" height="100%" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: pinta.opacidad ?? 0.82 }}><filter id="pb"><feGaussianBlur stdDeviation="3" /></filter><polygon points={pinta.pts.map((q) => q.join(",")).join(" ")} fill={pinta.color ?? "#E5191B"} filter="url(#pb)" /></svg>
      </AbsoluteFill> : null}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,6,4,0.86) 0%, rgba(10,6,4,0.5) 22%, rgba(10,6,4,0) 40%, rgba(10,6,4,0) 74%, rgba(10,6,4,0.88) 100%)" }} />
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.1 }}><svg width="100%" height="100%"><filter id="gn"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#gn)" /></svg></AbsoluteFill>
      {dos ? dos.map((d, i) => (
        <div key={i} style={{ position: "absolute", left: i === 0 ? 30 : 550, width: 500, top: y, textAlign: "center", fontFamily: FUT, fontWeight: 800, textTransform: "uppercase", lineHeight: 0.9, color: i === 0 ? ROJO : "#00FF04", textShadow: "0 6px 26px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.6)" }}>
          <div style={{ fontSize: tam }}>{d[0]}</div><div style={{ fontSize: tam * 0.82, color: "#fff", marginTop: 6 }}>{d[1]}</div>
        </div>)) : null}
      {dos ? <div style={{ position: "absolute", left: 537, top: y - 10, width: 6, height: tam * 1.95, background: "#fff", borderRadius: 3, boxShadow: "0 0 18px rgba(0,0,0,0.6)" }} /> : null}
      {misterio ? misterio.map((a, i) => (
        <div key={i} style={{ position: "absolute", left: a.x - a.w / 2, top: a.y - a.w / 2, width: a.w, height: a.w, transform: `rotate(${a.r}deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile("clienten/" + a.f)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", filter: "brightness(0.06) contrast(1.2) drop-shadow(0 0 12px #FFE2B8) drop-shadow(0 0 30px rgba(255,214,160,0.6)) drop-shadow(0 18px 26px rgba(0,0,0,0.6))" }} />
          <div style={{ position: "relative", fontFamily: FUT, fontWeight: 800, fontSize: a.w * 0.6, color: "white", transform: `rotate(${-a.r}deg)`, textShadow: "0 0 20px #FFD9A8, 0 0 46px rgba(255,200,140,0.9), 0 4px 10px rgba(0,0,0,0.8)", lineHeight: 1 }}>?</div>
        </div>)) : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", display: dos ? "none" : "block" }}>
        {estilo === "deportivo" ? <div style={{ fontFamily: FUT, fontWeight: 800, fontSize: 92, letterSpacing: 2, color: "#fff", textTransform: "uppercase", textShadow: "0 4px 18px rgba(0,0,0,0.7)" }}>{linea}</div> : cursiva ? <div style={{ fontFamily: cursiva, fontWeight: 700, fontSize: tamLinea, lineHeight: 1.1, color: "#fff", textShadow: "0 3px 18px rgba(0,0,0,0.8)" }}>{linea}</div> : fina(linea, 13)}
        {estilo === "elegante"
          ? <div style={{ fontFamily: "'Big Caslon', 'Baskerville', 'Didot', serif", fontWeight: 500, fontSize: tam, lineHeight: 1.02, letterSpacing: 10, color: ROJO, marginTop: 14, textShadow: "0 6px 30px rgba(0,0,0,0.55)" }}>{palabra}</div>
          : <div style={{ fontFamily: FUT, fontWeight: 800, fontSize: tam, lineHeight: 0.95, color: ROJO, textTransform: "uppercase", marginTop: 16, textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>{palabra}</div>}
        {cola ? (estilo === "deportivo" ? <div style={{ fontFamily: FUT, fontWeight: 800, fontSize: tam * 0.5, letterSpacing: 2, color: "#fff", textTransform: "uppercase", marginTop: 6, textShadow: "0 4px 18px rgba(0,0,0,0.7)" }}>{cola}</div> : fina(cola, 30, { marginTop: 14 })) : null}
      </div>
    </AbsoluteFill>
  );
};

// Cierre tipo CTA de ClienteN: oscurece, "Y TÚ" fino, pregunta grande en rojo deportivo + blanco y pastilla de comentarios.
export const ClienteNCtaPregunta: React.FC<{ arriba: string; roja: string; blanca: string; pastilla: string }> = ({ arriba, roja, blanca, pastilla }) => {
  const FUT = "'Futura-CondensedExtraBold', 'Futura', 'Avenir Next Condensed', sans-serif", FINA = "'Avenir Next', 'Helvetica Neue', sans-serif";
  const f = useCurrentFrame(), { fps, durationInFrames } = useVideoConfig();
  const ent = (d: number) => spring({ frame: f - d, fps, config: { damping: 13, mass: 0.6 } });
  const fondo = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" }) * interpolate(f, [durationInFrames - 4, durationInFrames - 1], [1, 1], { extrapolateLeft: "clamp" });
  const a = ent(2), b = ent(6), c = ent(10), p = ent(18), late = 1 + 0.04 * Math.sin(Math.max(0, f - 26) / 4);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: "radial-gradient(1200px 1100px at 50% 48%, rgba(0,0,0,0.68), rgba(0,0,0,0.38) 70%)", opacity: fondo }} />
      <div style={{ textAlign: "center", marginTop: -120 }}>
        <div style={{ fontFamily: FINA, fontWeight: 500, fontSize: 56, letterSpacing: 18, paddingLeft: 18, color: "#fff", opacity: a, transform: `translateY(${(1 - a) * 30}px)`, textShadow: "0 3px 16px rgba(0,0,0,.7)" }}>{arriba}</div>
        <div style={{ fontFamily: FUT, fontWeight: 800, fontSize: 132, lineHeight: 0.95, color: ROJO, textTransform: "uppercase", marginTop: 14, transform: `scale(${0.7 + 0.3 * b})`, opacity: b, textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>{roja}</div>
        <div style={{ fontFamily: FUT, fontWeight: 800, fontSize: 112, lineHeight: 0.95, color: "#fff", textTransform: "uppercase", transform: `scale(${0.7 + 0.3 * c})`, opacity: c, textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>{blanca}</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginTop: 46, padding: "18px 38px", borderRadius: 60, background: "#fff", color: "#111", fontFamily: FINA, fontWeight: 700, fontSize: 46, opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${late})`, boxShadow: "0 10px 30px rgba(0,0,0,.35)" }}>
          <svg width={48} height={48} viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill={ROJO} /></svg>
          {pastilla}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Portada de entrevistas: pregunta arriba (fina + roja deportiva + blanca), fotos en columnas fundidas y una cifra roja por persona.
export const ClienteNPortadaGente: React.FC<{ fotos: { src: string; x: number; cifra: string }[]; fina: string; roja: string; blanca: string; arriba?: number; funde?: number }> = ({ fotos, fina, roja, blanca, arriba = 560, funde = 120 }) => {
  const FUT = "'Futura-CondensedExtraBold', 'Futura', 'Avenir Next Condensed', sans-serif", FINA = "'Avenir Next', 'Helvetica Neue', sans-serif";
  const n = fotos.length, ancho = 1080 / n, h = 1920 - arriba, vert = "linear-gradient(180deg, transparent 0px, black 300px, black 100%)";
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: arriba, height: h, WebkitMaskImage: vert, maskImage: vert }}>
        {fotos.map((f, i) => {
          const izq = i === 0 ? 0 : funde, der = i === n - 1 ? 0 : funde, w = ancho + izq / 2 + der / 2, m = `linear-gradient(90deg, transparent 0px, black ${izq}px, black ${w - der}px, transparent ${w}px)`;
          return (
            <div key={i} style={{ position: "absolute", left: i * ancho - izq / 2, top: 0, width: w, height: h, overflow: "hidden", WebkitMaskImage: m, maskImage: m }}>
              <Img src={staticFile(f.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${f.x}% 30%`, filter: "contrast(1.06) saturate(1.05)" }} />
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 30%)" }} />
      {fotos.map((f, i) => (
        <div key={"c" + i} style={{ position: "absolute", left: i * ancho, width: ancho, bottom: 120, textAlign: "center" }}>
          <span style={{ fontFamily: FUT, fontWeight: 800, fontSize: 64, color: "#fff", background: ROJO, padding: "8px 22px 4px", borderRadius: 18, boxShadow: "0 8px 24px rgba(0,0,0,.45)" }}>{f.cifra}</span>
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center" }}>
        <div style={{ fontFamily: FINA, fontWeight: 500, fontSize: 46, letterSpacing: 12, paddingLeft: 12, color: "#fff" }}>{fina}</div>
        <div style={{ fontFamily: FUT, fontWeight: 800, fontSize: 150, lineHeight: 0.95, color: ROJO, textTransform: "uppercase", marginTop: 18, textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>{roja}</div>
        <div style={{ fontFamily: FUT, fontWeight: 800, fontSize: 118, lineHeight: 0.95, color: "#fff", textTransform: "uppercase", textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>{blanca}</div>
      </div>
    </AbsoluteFill>
  );
};
