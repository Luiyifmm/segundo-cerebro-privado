import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

// Copia del MOGRT "Estilo Viral Pro" (verde, $$$ en contorno detrás) con contador:
// 0 → 2000, luego guion y 2000 → 3000. Fondo transparente.
const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ClienteEContador: React.FC<{ a?: number; b?: number; t1?: [number, number]; t2?: [number, number]; y?: number; tam?: number; verde?: string; fondo?: string; tFuera?: number }> = ({
  a = 2000, b = 3000, t1 = [0.16, 0.66], t2 = [0.75, 1.3], y = 1032, tam = 186, verde = "#32F91A", fondo = "$$$", tFuera,
}) => {
  const [h] = useState(() => delayRender("fuentes contador"));
  useEffect(() => {
    Promise.all([["AkiraX", "fuentes/akira.otf"], ["InterV", "fuentes/inter-var.ttf"]].map(([n, f]) => new FontFace(n, `url(${staticFile(f)})`, { weight: "100 900" }).load().then((x) => document.fonts.add(x))))
      .then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
  const f = useCurrentFrame(), { fps, width, durationInFrames } = useVideoConfig(), s = f / fps;
  const fin = tFuera ?? durationInFrames / fps - 0.2;
  const sal = interpolate(s, [fin, fin + 0.2], [1, 0], c);
  const ent = interpolate(s, [0, 0.2], [0, 1], { ...c, easing: Easing.out(Easing.cubic) });
  const ease = Easing.out(Easing.cubic);
  const n1 = Math.round(interpolate(s, [t1[0], t1[1]], [0, a], { ...c, easing: ease }));
  const n2 = Math.round(interpolate(s, [t2[0], t2[1]], [a, b], { ...c, easing: ease }));
  // al llegar la segunda cifra, la fila se reparte: el 2000 se va a la izquierda y se encoge
  const k = interpolate(s, [t2[0] - 0.08, t2[0] + 0.14], [0, 1], { ...c, easing: Easing.inOut(Easing.cubic) });
  const tamF = tam * (1 - 0.27 * k);
  const pop1 = 1 + 0.08 * Math.sin(Math.PI * interpolate(s, [t1[1] - 0.05, t1[1] + 0.12], [0, 1], c));
  const pop2 = 1 + 0.08 * Math.sin(Math.PI * interpolate(s, [t2[1] - 0.05, t2[1] + 0.12], [0, 1], c));
  const brillo = `0 0 ${tam * 0.03}px ${verde}, 0 0 ${tam * 0.14}px ${verde}99, 0 0 ${tam * 0.4}px ${verde}44`;
  const num: React.CSSProperties = { fontFamily: "InterV", fontWeight: 800, fontSize: tamF, letterSpacing: -tamF * 0.037, color: verde, textShadow: brillo, lineHeight: 1, fontVariantNumeric: "tabular-nums" };
  const desp = -width * 0.225 * k; // centro del primer número
  return (
    <AbsoluteFill style={{ opacity: ent * sal }}>
      {/* $$$ en contorno detrás */}
      <div style={{ position: "absolute", left: 0, right: 0, top: y - 170, textAlign: "center", fontFamily: "AkiraX", fontSize: 330, letterSpacing: -8, lineHeight: 1, color: "transparent", WebkitTextStroke: `4px ${verde}`, opacity: 0.67, filter: `drop-shadow(0 0 14px ${verde})`, transform: `scale(${0.85 + 0.15 * ent})` }}>{fondo}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: y - tamF * 0.5, height: tamF, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "absolute", left: width / 2 + desp, transform: `translateX(-50%) scale(${pop1})`, ...num }}>{n1}</div>
        {k > 0 ? (
          <>
            <div style={{ position: "absolute", left: width / 2, transform: `translateX(-50%) scaleX(${k})`, ...num, opacity: k }}>–</div>
            <div style={{ position: "absolute", left: width / 2 + width * 0.225 + (1 - k) * 120, transform: `translateX(-50%) scale(${pop2})`, ...num, opacity: k }}>{n2}</div>
          </>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
