import React, { useEffect, useState } from "react";
import { AbsoluteFill, OffthreadVideo, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Vtrial "retícula" (petición del usuario, 12-10-2026): el vídeo ORIGINAL ya editado, entero y sin tocar, dentro de una tarjeta sobre un fondo
// oscuro con retícula, y arriba un título en pregunta con palabras en amarillo. partes = trozos del título: [texto, resaltado].
const AMARILLO = "#FFD21F";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// modo "fondo" = solo retícula y marco (para Premiere); modo "titulo" = solo el título sobre transparente.
export const VtrialReticula: React.FC<{ video: string; partes: [string, boolean][]; modo?: "completo" | "fondo" | "titulo" }> = ({ video, partes, modo = "completo" }) => {
  const [h] = useState(() => delayRender("fuente"));
  useEffect(() => { new FontFace("SFB", `url(${staticFile("marca/f/sfpro-bold.otf")})`).load().then((x) => { document.fonts.add(x); continueRender(h); }).catch(() => continueRender(h)); }, [h]);
  const frame = useCurrentFrame(), { fps } = useVideoConfig(), t = frame / fps, e = 1 - Math.pow(1 - interpolate(t, [0.05, 0.5], [0, 1], clamp), 3);
  const W = 800, H = Math.round((W * 16) / 9), X = (1080 - W) / 2, Y = 372, paso = 60, d = (t * 6) % paso;
  return (
    <AbsoluteFill style={{ backgroundColor: modo === "titulo" ? "transparent" : "#06080C" }}>
      {modo !== "titulo" && <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.17) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.17) 2px, transparent 2px)", backgroundSize: `${paso}px ${paso}px`, backgroundPosition: `${30}px ${modo === "fondo" ? 0 : d}px` }} />}
      {modo !== "titulo" && <AbsoluteFill style={{ background: "radial-gradient(900px 1300px at 50% 52%, rgba(6,8,12,0) 55%, rgba(6,8,12,0.72) 100%)" }} />}
      {modo !== "fondo" && <div style={{ position: "absolute", left: 40, right: 40, top: 168, textAlign: "center", fontFamily: "SFB", fontSize: 94, letterSpacing: -3.2, lineHeight: 1.05, color: "white", opacity: modo === "titulo" ? 1 : e, transform: `translateY(${modo === "titulo" ? 0 : (1 - e) * 18}px)`, filter: `blur(${modo === "titulo" ? 0 : (1 - e) * 6}px)`, textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}>
        {partes.map(([txt, res], i) => <span key={i} style={{ color: res ? AMARILLO : "white" }}>{txt}</span>)}
      </div>}
      {modo !== "titulo" && <div style={{ position: "absolute", left: X - 3, top: Y - 3, width: W + 6, height: H + 6, borderRadius: 43, background: "rgba(255,255,255,0.16)", boxShadow: "0 30px 90px rgba(0,0,0,0.7)" }} />}
      {modo === "completo" && <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, borderRadius: 40, overflow: "hidden", background: "#000" }}>
        <OffthreadVideo src={staticFile(video)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>}
    </AbsoluteFill>
  );
};
