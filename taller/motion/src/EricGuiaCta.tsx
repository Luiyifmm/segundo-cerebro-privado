import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, continueRender, delayRender } from "remotion";

// Vídeo «Las 5 fases» de Eric (31-10). Dos capas con alfa para Premiere (secuencia 720x1280 a 50 fps → escala 66,67 %).
// Zona libre: debajo de los subtítulos (62 % del alto) y encima de la interfaz de Instagram (~78 %).

const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const NARANJA = "#FF5800", AMARILLO = "#FFC93C";

const useSequel = () => {
  const [h] = React.useState(() => delayRender("Sequel"));
  React.useEffect(() => {
    const f = new FontFace("Sequel", `url(${staticFile("fonts/SequelHeavy.otf")})`);
    f.load().then((x) => { document.fonts.add(x); continueRender(h); }).catch(() => continueRender(h));
  }, [h]);
};

// 1) «…le dé una oportunidad a mi plan de acción gratuito»: aparece una guía flotando con glow amarillo (sin oscurecer ni ❓, pedido del 31-10)
export const EricGuia: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(), { fps } = useVideoConfig(), s = f / fps;
  const entra = spring({ frame: f, fps, config: { damping: 12, mass: 0.6 } });
  const sale = interpolate(s, [dur - 0.3, dur], [1, 0], c);
  const flota = Math.sin(s * Math.PI * 2 * 0.7) * 16, gira = Math.sin(s * Math.PI * 2 * 0.5) * 5;
  const latido = 0.75 + 0.25 * Math.sin(s * Math.PI * 2 * 1.2);
  const X = 540, Y = 1440, TAM = 270;   // debajo de los subtítulos de Eric (62 % del alto); con 1385 el ❓ los rozaba
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: sale }}>
        <Img src={staticFile("eric/guia/libro.png")} style={{ position: "absolute", left: X - TAM / 2, top: Y - TAM / 2 + flota, width: TAM, height: TAM,
          transform: `scale(${0.35 + 0.65 * entra}) rotate(${gira}deg)`,
          // glow con la silueta del libro (sin halo redondo, pedido del 31-10): suave y con un latido leve
          filter: `drop-shadow(0 0 ${8 + 4 * latido}px ${AMARILLO}CC) drop-shadow(0 0 ${22 + 10 * latido}px ${AMARILLO}66) drop-shadow(0 10px 18px rgba(0,0,0,.35))` }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 2) CTA «comenta la palabra FIT» como barra de buscador: entra, se escribe FIT cuando lo dice y el botón naranja late
export const EricBuscador: React.FC<{ palabra: string; tEscribe: number }> = ({ palabra, tEscribe }) => {
  useSequel();
  const f = useCurrentFrame(), { fps } = useVideoConfig(), s = f / fps;
  const entra = spring({ frame: f, fps, config: { damping: 14, mass: 0.6 } });
  const letras = Math.max(0, Math.min(palabra.length, Math.floor((s - tEscribe) / 0.09) + 1));
  const escrita = s >= tEscribe ? palabra.slice(0, letras) : "";
  const cursor = Math.floor(s * 2.2) % 2 === 0;
  const listo = interpolate(s, [tEscribe + palabra.length * 0.09, tEscribe + palabra.length * 0.09 + 0.25], [0, 1], c);
  const late = 1 + 0.06 * listo * Math.sin(s * Math.PI * 2 * 1.5);
  const W = 860, H = 132, X = 540 - W / 2, Y = 1330;
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, entra * 1.3) }}>
      <div style={{ position: "absolute", left: X, top: Y + (1 - entra) * 60, width: W, height: H, borderRadius: H / 2, background: "white",
        boxShadow: "0 18px 50px rgba(0,0,0,.35), 0 0 0 2px rgba(255,255,255,.6)", display: "flex", alignItems: "center", transform: `scale(${0.9 + 0.1 * entra})` }}>
        {/* lupa */}
        <svg width={60} height={60} viewBox="0 0 24 24" style={{ marginLeft: 38 }}>
          <circle cx="10" cy="10" r="6.5" fill="none" stroke="#8a8a8a" strokeWidth="2.6" />
          <line x1="15" y1="15" x2="21" y2="21" stroke="#8a8a8a" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
        <div style={{ marginLeft: 26, fontFamily: "Sequel", fontSize: 58, color: escrita ? "#111" : "#9a9a9a", letterSpacing: escrita ? 4 : 0, flex: 1, display: "flex", alignItems: "center" }}>
          {escrita || <span style={{ fontSize: 40, fontFamily: "Sequel" }}>Comenta la palabra…</span>}
          {(escrita || s < tEscribe) && cursor ? <span style={{ display: "inline-block", width: 4, height: 62, background: NARANJA, marginLeft: 8 }} /> : null}
        </div>
        <div style={{ marginRight: 16, height: H - 32, padding: "0 34px", borderRadius: (H - 32) / 2, background: NARANJA, color: "white", fontFamily: "Sequel",
          fontSize: 36, display: "flex", alignItems: "center", transform: `scale(${late})`,
          boxShadow: `0 0 ${18 + 26 * listo}px ${NARANJA}${listo > 0.5 ? "CC" : "66"}` }}>Comentar</div>
      </div>
    </AbsoluteFill>
  );
};
