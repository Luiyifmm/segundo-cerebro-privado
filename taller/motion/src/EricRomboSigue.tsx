import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Rombo oscuro (como los de la intro) que acompaña a un número ya puesto en Premiere: sube desde abajo en el centro
// y luego se desliza a un lado, con los mismos tiempos que el texto del usuario. Va por DEBAJO del texto.
export const EricRomboSigue: React.FC<{ x0: number; x1: number; y: number; subida: number; tSube: number; tDesde: number; tHasta: number; lado: number }> = ({ x0, x1, y, subida, tSube, tDesde, tHasta, lado }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig(), s = f / fps, c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const sube = interpolate(s, [0, tSube], [subida, 0], { ...c, easing: Easing.out(Easing.cubic) }), op = interpolate(s, [0, 0.2], [0, 1], c);
  const x = interpolate(s, [tDesde, tHasta], [x0, x1], { ...c, easing: Easing.inOut(Easing.cubic) });
  const gira = interpolate(s, [0, tSube], [-18, 0], { ...c, easing: Easing.out(Easing.cubic) });
  const brillo = interpolate(s, [tHasta, tHasta + 0.25, tHasta + 0.8], [0.3, 1, 0.55], c);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: x - lado / 2, top: y - lado / 2 + sube, width: lado, height: lado, opacity: op, transform: `rotate(${45 + gira}deg)`, borderRadius: lado * 0.2, background: "linear-gradient(145deg, rgba(40,40,40,0.78), rgba(8,8,8,0.66))", border: `5px solid rgba(255,249,0,${0.55 + 0.35 * brillo})`, boxShadow: `0 0 ${24 + 26 * brillo}px rgba(255,249,0,${0.25 + 0.3 * brillo}), inset 0 0 22px rgba(255,255,255,0.06), 0 18px 36px rgba(0,0,0,0.45)` }} />
    </AbsoluteFill>
  );
};
