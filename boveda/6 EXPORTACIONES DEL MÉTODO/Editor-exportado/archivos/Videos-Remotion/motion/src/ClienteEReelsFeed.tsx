import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Feed de reels: tarjetas tipo Instagram que entran por la derecha, se quedan en el centro y salen deslizándose a la izquierda
// mientras entra la siguiente. Fondo oscurecido para que ClienteE quede detrás.
type Reel = { src: string; usuario: string; texto: string; noti?: string; desde?: number };
const W = 600, H = 1066;
const Icono: React.FC<{ d: string; n: string }> = ({ d, n }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#fff", fontSize: 22, fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,.6)" }}>
    <svg width={50} height={50} viewBox="0 0 24 24"><path d={d} fill="none" stroke="#fff" strokeWidth={1.9} strokeLinejoin="round" strokeLinecap="round" /></svg>{n}
  </div>
);
export const ClienteEReelsFeed: React.FC<{ reels: Reel[]; t0: number; paso: number; fin: number; oscuro: number }> = ({ reels, t0, paso, fin, oscuro }) => {
  const f = useCurrentFrame(), { fps, width, height } = useVideoConfig(), s = f / fps, c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const fondo = interpolate(s, [0, 0.35, fin - 0.35, fin], [0, oscuro, oscuro, 0], c);
  return (
    <AbsoluteFill style={{ fontFamily: "SF Pro Display, -apple-system, sans-serif" }}>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${fondo})` }} />
      {reels.map((r, i) => {
        const a = t0 + i * paso, entra = interpolate(s, [a, a + 0.45], [0, 1], { ...c, easing: Easing.bezier(0.2, 0.9, 0.25, 1) });
        const ultimo = i === reels.length - 1, b = ultimo ? fin - 0.4 : a + paso;
        const sale = interpolate(s, [b, b + 0.45], [0, 1], { ...c, easing: Easing.bezier(0.5, 0, 0.75, 0.2) });
        if (entra <= 0 || sale >= 1) return null;
        const x = width / 2 + (1 - entra) * 760 - sale * (ultimo ? 0 : 760), rot = (1 - entra) * 8 - sale * (ultimo ? 0 : 8);
        const esc = 0.86 + 0.14 * entra - sale * (ultimo ? 0.1 : 0.12), op = ultimo ? 1 - sale : 1;
        const ln = r.noti ? interpolate(s, [a + 0.45, a + 0.75], [0, 1], { ...c, easing: Easing.out(Easing.back(1.8)) }) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: x - W / 2, top: height / 2 - H / 2 - 40, width: W, height: H, borderRadius: 38, overflow: "hidden", opacity: op, transform: `rotate(${rot}deg) scale(${esc})`, boxShadow: "0 30px 80px rgba(0,0,0,.6), 0 0 0 3px rgba(255,255,255,.12)", background: "#000", zIndex: i }}>
            <OffthreadVideo src={staticFile(r.src)} startFrom={Math.round((r.desde ?? 0) * fps)} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 62%, rgba(0,0,0,.65) 100%)" }} />
            <div style={{ position: "absolute", top: 26, left: 28, color: "#fff", fontSize: 30, fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,.6)" }}>Reels</div>
            <div style={{ position: "absolute", right: 18, bottom: 150, display: "flex", flexDirection: "column", gap: 26 }}>
              <Icono d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.6 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.4 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" n="12,4K" />
              <Icono d="M4 5h16v11H9l-5 4z" n="318" />
              <Icono d="M21.5 2.5L10.6 13.4M21.5 2.5l-7 19-3.9-8.1-8.1-3.9z" n="1,2K" />
            </div>
            <div style={{ position: "absolute", left: 26, right: 100, bottom: 40, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,.7)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, fontWeight: 700 }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#feda75,#d62976,#4f5bd5)", padding: 3 }}><div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#333" }} /></div>
                {r.usuario}<span style={{ marginLeft: 6, fontSize: 22, fontWeight: 600, border: "2px solid #fff", borderRadius: 10, padding: "2px 12px" }}>Seguir</span>
              </div>
              <div style={{ marginTop: 12, fontSize: 25, fontWeight: 500, lineHeight: 1.25 }}>{r.texto}</div>
            </div>
            {r.noti ? (
              <div style={{ position: "absolute", top: 80, left: 24, right: 24, padding: "18px 20px", borderRadius: 26, background: "rgba(245,245,245,.94)", display: "flex", alignItems: "center", gap: 16, transform: `translateY(${(1 - ln) * -40}px) scale(${0.9 + 0.1 * ln})`, opacity: ln, boxShadow: "0 10px 30px rgba(0,0,0,.35)" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "#16AA48", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 32, fontWeight: 800 }}>€</div>
                <div style={{ color: "#111" }}><div style={{ fontSize: 24, fontWeight: 700 }}>Nuevo cliente 🎉</div><div style={{ fontSize: 22, fontWeight: 500, opacity: 0.75 }}>{r.noti}</div></div>
              </div>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
