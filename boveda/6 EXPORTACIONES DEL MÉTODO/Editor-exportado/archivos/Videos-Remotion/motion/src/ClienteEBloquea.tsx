import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Cabecera de perfil de Instagram (estilo oscuro) con glow rojo; una X roja la tacha ("bloquea mi perfil").
type Dato = [string, string];
export const ClienteEBloquea: React.FC<{ foto: string; usuario: string; nombre: string; datos: Dato[]; t: number; tX: number; y: number; rojo: string; conX?: boolean; escala?: number; tSeguir?: number }> = ({ foto, usuario, nombre, datos, t, tX, y, rojo, conX = true, escala = 1, tSeguir }) => {
  const f = useCurrentFrame(), { fps, width, durationInFrames } = useVideoConfig(), s = f / fps, c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const e = interpolate(s, [t, t + 0.55], [0, 1], { ...c, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const x1 = interpolate(s, [tX, tX + 0.2], [0, 1], { ...c, easing: Easing.out(Easing.cubic) });
  const x2 = interpolate(s, [tX + 0.15, tX + 0.35], [0, 1], { ...c, easing: Easing.out(Easing.cubic) });
  const golpe = interpolate(s, [tX + 0.33, tX + 0.42, tX + 0.7], [0, 1, 0], c);
  const flota = Math.sin((s - t) * 2.2) * 8 * e;
  const conBoton = tSeguir !== undefined, W = 1000, H = conBoton ? 450 : 330, apaga = interpolate(s, [tX, tX + 0.5], [1, 0.55], c);
  const sale = conX ? 0 : interpolate(s, [durationInFrames / fps - 0.3, durationInFrames / fps], [0, 1], { ...c, easing: Easing.in(Easing.cubic) });
  const rgb = [1, 3, 5].map((i) => parseInt(rojo.slice(i, i + 2), 16)).join(","), brilla = conX ? x2 : 0.6 + 0.4 * Math.sin(s * 3) * 0.5;
  const fuente = "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif";
  const cx = W / 2 + 100, cy = H / 2 + 100, dx = 300, dy = 210, L = Math.hypot(2 * dx, 2 * dy) + 10;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: (width - W) / 2, top: y - H / 2, width: W, height: H, opacity: e * (1 - sale), transform: `translateY(${(1 - e) * 120 + flota - sale * 40}px) scale(${(0.86 + 0.14 * e) * (1 + golpe * 0.04) * escala}) rotate(${golpe * -1.2}deg)` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 44, background: "rgba(15,17,21,0.94)", border: `3px solid rgba(${rgb},${0.5 + 0.45 * brilla})`, boxShadow: `0 0 ${40 + 45 * brilla}px rgba(${rgb},${0.45 + 0.35 * brilla}), 0 0 130px rgba(${rgb},0.25), 0 24px 48px rgba(0,0,0,0.5)` }} />
        <div style={{ position: "absolute", inset: 0, filter: conX ? `brightness(${apaga}) saturate(${apaga})` : "none" }}>
          <div style={{ position: "absolute", left: 40, top: (330 - 236) / 2, width: 236, height: 236, borderRadius: "50%", border: "6px solid #2C3038", overflow: "hidden" }}>
            <Img src={staticFile(foto)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.12)" }} />
          </div>
          <div style={{ position: "absolute", left: 318, top: 58, right: 20, fontFamily: fuente, color: "#F5F5F5" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 52, fontWeight: 700, letterSpacing: -0.6 }}>
              {usuario}
              <svg width={42} height={42} viewBox="0 0 40 40"><path d="M20 1.5l4.6 3.4 5.7-.3 1.8 5.4 4.6 3.4-1.8 5.4 1.8 5.4-4.6 3.4-1.8 5.4-5.7-.3L20 38.5l-4.6-3.4-5.7.3-1.8-5.4-4.6-3.4 1.8-5.4-1.8-5.4 4.6-3.4 1.8-5.4 5.7.3z" fill="#3897F0" /><path d="M13 20.5l4.6 4.6 9.4-9.6" stroke="white" strokeWidth={3.6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ fontSize: 29, marginTop: 14 }}>{nombre}</div>
            <div style={{ display: "flex", gap: 26, fontSize: 27, marginTop: 30, whiteSpace: "nowrap" }}>
              {datos.map(([n, l]) => <div key={l}><b>{n}</b> {l}</div>)}
            </div>
          </div>
        </div>
        {conBoton && (() => { const ts = tSeguir as number, pr = interpolate(s, [ts - 0.08, ts, ts + 0.14], [0, 1, 0], c), hecho = s >= ts, onda = interpolate(s, [ts, ts + 0.45], [0, 1], c);
          return <div style={{ position: "absolute", left: 40, right: 40, top: 330, height: 88, borderRadius: 22, background: hecho ? rojo : "#0095F6", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: fuente, fontSize: 38, fontWeight: 700, color: "white", transform: `scale(${1 - 0.06 * pr})`, boxShadow: hecho ? `0 0 34px rgba(${rgb},0.7)` : "0 8px 22px rgba(0,149,246,0.35)", overflow: "hidden" }}>
            {hecho ? "Siguiendo" : "Seguir"}
            {hecho && <svg width={30} height={30} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="white" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            {onda > 0 && onda < 1 && <div style={{ position: "absolute", left: "50%", top: "50%", width: 40 + 560 * onda, height: 40 + 560 * onda, marginLeft: -(20 + 280 * onda), marginTop: -(20 + 280 * onda), borderRadius: "50%", background: `rgba(255,255,255,${0.45 * (1 - onda)})` }} />}
            {s > ts - 0.5 && s < ts + 0.35 && <div style={{ position: "absolute", left: "50%", top: "50%", width: 70, height: 70, marginLeft: -35, marginTop: -35, borderRadius: "50%", background: "rgba(255,255,255,0.55)", border: "3px solid rgba(255,255,255,0.9)", transform: `scale(${interpolate(s, [ts - 0.5, ts - 0.1, ts, ts + 0.35], [1.6, 1, 0.75, 1.3], c)})`, opacity: interpolate(s, [ts - 0.5, ts - 0.3, ts + 0.15, ts + 0.35], [0, 1, 1, 0], c) }} />}
          </div>; })()}
        {conX && <svg width={W + 200} height={H + 200} style={{ position: "absolute", left: -100, top: -100, overflow: "visible", filter: `drop-shadow(0 0 12px ${rojo}) drop-shadow(0 0 32px ${rojo})` }}>
          <line x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy} stroke={rojo} strokeWidth={30} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - x1)} opacity={x1 > 0 ? 1 : 0} />
          <line x1={cx + dx} y1={cy - dy} x2={cx - dx} y2={cy + dy} stroke={rojo} strokeWidth={30} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - x2)} opacity={x2 > 0 ? 1 : 0} />
        </svg>}
      </div>
    </AbsoluteFill>
  );
};
