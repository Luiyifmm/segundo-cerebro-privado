import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// "Calcula esto" v2 (correcciones de Eric, 29 oct):
// - Título de entrada "CALCULA esto" (CALCULA grande en naranja) y la píldora "Perder grasa 🔥" solo 1–2 s.
// - Cada línea de la lista: emoji + nombre en blanco (Calorías, Proteína…) y el resultado pequeño debajo.
// - Mientras está la pizarra de cálculo, la lista desaparece; al terminar vuelve línea a línea.
// - Al final, la lista vuelve con una suma de kcal que se va acumulando hasta el total.
const NARANJA = "#FF5800";
const EMOJI = "'Apple Color Emoji', sans-serif";
const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type Item = { emoji: string; nombre: string; valor: string; kcal?: number; t: number };
export type Op = { t: number; pasos: [number, string][]; tFin: number; slot: number; icono?: string };
export type Pieza = [number, string, ("n" | "op" | "res" | "e")?];
// Pizarra "paso a paso" (corrección de Eric, 30 oct): una operación cada vez, en grande; al dar el resultado
// la operación se va y solo el resultado queda fijado arriba; al sumar/restar, los fijados que se usan desaparecen.
export type Paso = { t: number; piezas: Pieza[]; tRes: number; res: string; emoji?: string; consume?: number[] };
export type Tarjeta = { t: number; tFin: number; titulo?: string; filas: Pieza[][]; y?: number; vuelta?: number; pasos?: Paso[]; pregunta?: boolean };

export const EricCalculaLista2: React.FC<{
  intro: { t: number; tFin: number; grande: string; peque: string };
  pildora: { t: number; tFin: number; txt: string };
  items: Item[]; ops: Op[]; tarjetas: Tarjeta[];
  suma?: { t: number; total: number; etiqueta?: string };
  x?: number; y?: number; yLista?: number; tam?: number; lineaH?: number; tamTarjeta?: number; tarjetaX?: [number, number]; escalonado?: number; numerada?: boolean; totalDerecha?: boolean;
}> = ({ intro, pildora, items, ops, tarjetas, suma, x = 560, y = 250, yLista = 420, tam = 62, lineaH = 122, tamTarjeta = 0.66, tarjetaX = [150, 930], escalonado = 0.3, numerada = false, totalDerecha = false }) => {
  const [h] = useState(() => delayRender("fuentes lista2"));
  useEffect(() => {
    Promise.all([["SeqH", "marca/f/sequel-heavy.otf"], ["SeqM", "marca/f/sequel-medium.otf"]].map(([n, f]) => new FontFace(n, `url(${staticFile(f)})`).load().then((x) => document.fonts.add(x))))
      .then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
  const f = useCurrentFrame(), { fps, durationInFrames } = useVideoConfig(), s = f / fps;
  const fin = durationInFrames / fps - 0.35;
  const sal = interpolate(s, [fin, fin + 0.3], [1, 0], c);
  const sp = (t: number) => spring({ frame: f - Math.round(t * fps), fps, config: { damping: 14, stiffness: 200, mass: 0.7 } });
  const contorno = (px: number): React.CSSProperties => ({ WebkitTextStroke: `${px}px #141414`, paintOrder: "stroke fill" } as React.CSSProperties);

  // pizarra activa → la lista se esconde; al acabar, vuelve escalonada
  const tjActiva = tarjetas.find((tj) => s >= tj.t - 0.05 && s < tj.tFin + 0.25);
  const ultimaVuelta = tarjetas.filter((tj) => s >= tj.tFin + 0.25).map((tj) => tj.vuelta ?? tj.tFin + 0.25).pop();
  const ocultar = tjActiva ? interpolate(s, [tjActiva.t - 0.05, tjActiva.t + 0.2], [0, 1], c) : 0;

  // suma de kcal final: cada item con kcal suma al aparecer
  const tVuelta = (i: number) => (ultimaVuelta != null ? ultimaVuelta + i * escalonado : null);
  const enSuma = suma && s >= suma.t;
  let acumulado = 0;
  if (enSuma) items.forEach((it, i) => { const tv = tVuelta(i); if (it.kcal && tv != null) acumulado += it.kcal * interpolate(s, [tv + 0.05, tv + 0.4], [0, 1], c); });

  const pIntro = sp(intro.t), fIntro = interpolate(s, [intro.tFin - 0.15, intro.tFin], [1, 0], c);
  const pPil = sp(pildora.t), fPil = interpolate(s, [pildora.tFin - 0.2, pildora.tFin], [1, 0], c);

  return (
    <AbsoluteFill style={{ opacity: sal }}>
      {/* título de entrada */}
      {s >= intro.t && s < intro.tFin ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", lineHeight: 0.92, opacity: Math.min(1, pIntro * 1.5) * fIntro, transform: `scale(${0.75 + 0.25 * pIntro})` }}>
          <div style={{ fontFamily: "SeqH", fontSize: 190, letterSpacing: -8, color: NARANJA, ...contorno(16), filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.35))" }}>{intro.grande}</div>
          <div style={{ fontFamily: "SeqH", fontSize: 92, letterSpacing: -3, color: "white", ...contorno(10), marginTop: 6 }}>{intro.peque}</div>
        </div>
      ) : null}
      {/* píldora corta */}
      {s >= pildora.t && s < pildora.tFin ? (
        <div style={{ position: "absolute", right: 170, top: y, display: "flex", alignItems: "center", gap: 10, opacity: Math.min(1, pPil * 1.5) * fPil, transform: `translateX(${(1 - pPil) * 80}px) scale(${0.7 + 0.3 * pPil})`, transformOrigin: "100% 50%" }}>
          <div style={{ fontFamily: "SeqH", fontSize: 70, letterSpacing: -2.6, color: "white", background: NARANJA, padding: "10px 28px 16px", borderRadius: 21, boxShadow: "0 0 26px rgba(255,88,0,0.45), 0 8px 18px rgba(0,0,0,0.25)" }}>{pildora.txt}</div>
          <div style={{ fontFamily: EMOJI, fontSize: 92, transform: `rotate(${Math.sin(s * 5) * 6}deg)` }}>🔥</div>
        </div>
      ) : null}
      {/* lista */}
      {items.map((it, i) => {
        // primera aparición: cuando la operación se convierte en línea (o tras su pizarra)
        const tv = tVuelta(i);
        let tAp = it.t;
        if (tv != null && tv > it.t) tAp = tv; // tras una pizarra la lista vuelve escalonada
        if (s < tAp) return null;
        const p = sp(tAp);
        const vis = Math.min(1, p * 1.4) * (1 - ocultar);
        if (vis <= 0.001) return null;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: yLista + i * lineaH, display: "flex", alignItems: "center", gap: 16, opacity: vis, transform: `translateY(${(1 - p) * 26 + ocultar * -20}px) scale(${0.8 + 0.2 * p})`, transformOrigin: "0 50%" }}>
            {numerada ? <span style={{ display: "inline-block", width: tam * 1.0, textAlign: "right", fontFamily: "SeqH", fontSize: tam, letterSpacing: -tam * 0.035, color: NARANJA, ...contorno(tam * 0.11), alignSelf: "flex-start", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))" }}>{i + 1}.</span> : <span style={{ fontFamily: EMOJI, fontSize: tam * 1.05, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}>{it.emoji}</span>}
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontFamily: "SeqH", fontSize: tam, letterSpacing: -tam * 0.035, color: "white", ...contorno(tam * 0.11), filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))", whiteSpace: "nowrap" }}>{it.nombre}{numerada ? <span style={{ fontFamily: EMOJI, fontSize: tam * 0.95, marginLeft: 12, WebkitTextStroke: "0px" } as React.CSSProperties}>{it.emoji}</span> : null}</span>
              <span style={{ fontFamily: "SeqH", fontSize: tam * 0.58, letterSpacing: -tam * 0.02, color: "white", ...contorno(tam * 0.08), marginTop: 6, opacity: 0.95 }}>{it.valor}</span>
            </div>
          </div>
        );
      })}
      {/* operación en curso (nace en su hueco de la lista) */}
      {ops.map((o, i) => {
        if (s < o.t || s >= o.tFin + 0.01) return null;
        let txt = o.pasos[0][1], tCambio = o.pasos[0][0];
        for (const [t, v] of o.pasos) if (s >= t) { txt = v; tCambio = t; }
        const p = sp(Math.max(o.t, tCambio)), sale = interpolate(s, [o.tFin - 0.18, o.tFin], [0, 1], c);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: yLista + o.slot * lineaH + 14, opacity: (1 - sale) * Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 50}px) scale(${(0.85 + 0.15 * p) * (1 - 0.2 * sale)})`, transformOrigin: "0 50%", fontFamily: "SeqH", fontSize: tam * 0.95, letterSpacing: -tam * 0.03, color: "white", ...contorno(tam * 0.11), whiteSpace: "nowrap", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))" }}>
            {o.icono ? <Img src={staticFile(o.icono)} style={{ display: "inline-block", width: tam * 1.05, height: tam * 1.05, marginRight: 12, verticalAlign: "middle", transform: `translateY(-6px) scale(${Math.min(1.15, 0.4 + sp(o.t) * 0.8)}) rotate(${Math.sin(s * 4) * 4}deg)`, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }} /> : null}
            {txt.split(/([×÷+−=])/).map((part, k) => /[×÷+−=]/.test(part) ? <span key={k} style={{ color: NARANJA }}>{part}</span> : <span key={k}>{part}</span>)}
          </div>
        );
      })}
      {/* suma final de kcal */}
      {enSuma ? (() => {
        const p = sp(suma!.t);
        const yS = yLista + items.length * lineaH + 10;
        const lleno = acumulado >= suma!.total - 0.5;
        const brillo = lleno ? interpolate(s, [s - 0.001, s], [1, 1]) : 0;
        return (
          <div style={{ position: "absolute", ...(totalDerecha ? { right: 40 } : { left: x - 6 }), top: yS, opacity: Math.min(1, p * 1.5) * (1 - ocultar), transform: `translateY(${(1 - p) * 30}px) scale(${(0.85 + 0.15 * p) * (lleno ? 1.06 : 1)})`, transformOrigin: totalDerecha ? "100% 50%" : "0 50%", display: "flex", alignItems: "center", gap: 14, background: NARANJA, borderRadius: 26, padding: "12px 26px 16px", boxShadow: `0 0 ${lleno ? 40 : 20}px rgba(255,88,0,${0.4 + 0.3 * brillo}), 0 10px 22px rgba(0,0,0,0.3)` }}>
            <span style={{ fontFamily: "SeqM", fontSize: tam * 0.62, color: "white" }}>{suma!.etiqueta ?? "Total"}</span>
            <span style={{ fontFamily: "SeqH", fontSize: tam * 0.95, letterSpacing: -2, color: "white", fontVariantNumeric: "tabular-nums" }}>{Math.round(acumulado)} kcal</span>
          </div>
        );
      })() : null}
      {/* "+664 kcal" que salta al aparecer cada línea con kcal en la suma */}
      {enSuma ? items.map((it, i) => {
        const tv = tVuelta(i); if (!it.kcal || tv == null || s < tv || s > tv + 0.7) return null;
        const q = interpolate(s, [tv, tv + 0.7], [0, 1], c);
        return <div key={"k" + i} style={{ position: "absolute", left: x + 255, top: yLista + i * lineaH + tam * 1.02 - q * 22, opacity: interpolate(q, [0, 0.2, 0.75, 1], [0, 1, 1, 0]), fontFamily: "SeqH", fontSize: tam * 0.6, color: "#FFE600", ...contorno(6) }}>+{it.kcal}</div>;
      }) : null}
      {/* pizarra paso a paso */}
      {tarjetas.map((tj, i) => {
        if (!tj.pasos || s < tj.t || s > tj.tFin + 0.3) return null;
        const p = sp(tj.t), fuera = interpolate(s, [tj.tFin, tj.tFin + 0.3], [0, 1], c);
        const P = tj.pasos, ancho = tarjetaX[1] - tarjetaX[0];
        const tBig = 66, tChip = 46;
        // fin de cada paso: el resultado se queda ~0,9 s en grande y sube a fijado (el último se queda hasta el final)
        const usaDe = (k: number) => P.find((q) => q.consume?.includes(k));
        const finPaso = (k: number) => { if (k === P.length - 1) return tj.tFin; const u = usaDe(k); if (u && u.t - P[k].tRes < 1.6) return P[k + 1].t - 0.05; return Math.min(P[k].tRes + 0.9, P[k + 1].t - 0.05); };
        // cuándo se usa cada resultado fijado: baja y se funde en la operación que lo usa
        const usa = P.map((_, k) => P.find((q) => q.consume?.includes(k)));
        // si el resultado se usa enseguida (<0,8 s), no sube a fijado: se queda en el centro hasta que empieza la siguiente
        const directo = P.map((_, k) => !!usa[k] && usa[k]!.t - P[k].tRes < 1.6);
        const chips = P.map((q, k) => ({ q, k, ini: finPaso(k) })).filter(({ k, ini }) => k < P.length - 1 && !directo[k] && s >= ini && (!usa[k] || s < usa[k]!.t + 0.4));
        const color = (tipo?: string) => (tipo === "op" || tipo === "res" ? NARANJA : "#161616");
        const pregunta = tj.pregunta && s < P[0].t + 0.2;
        return (
          <div key={"t" + i} style={{ position: "absolute", left: tarjetaX[0], width: ancho, top: tj.y ?? 1000, height: 420, opacity: Math.min(1, p * 1.5) * (1 - fuera), transform: `translateY(${(1 - p) * 60 + fuera * 40}px) scale(${0.92 + 0.08 * p})`, transformOrigin: "50% 0", background: "rgba(255,255,255,0.94)", borderRadius: 30, boxShadow: "0 18px 50px rgba(0,0,0,0.28), 0 0 0 3px rgba(255,88,0,0.55)", overflow: "hidden" }}>
            {tj.titulo ? <div style={{ position: "absolute", left: 30, top: 22, fontFamily: "SeqH", fontSize: 40, color: NARANJA, letterSpacing: -1 }}>{tj.titulo}</div> : null}
            {/* "???": cómo conseguirlos */}
            {pregunta ? (() => {
              const a = sp(tj.t + 0.15), o = interpolate(s, [P[0].t - 0.05, P[0].t + 0.2], [1, 0], c);
              return <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: "SeqH", fontSize: 150, letterSpacing: 6, color: "#161616", opacity: Math.min(1, a * 1.5) * o, transform: `scale(${(0.6 + 0.4 * a) * (1 + 0.04 * Math.sin(s * 6))})` }}>???</div>;
            })() : null}
            {/* resultados fijados arriba */}
            <div style={{ position: "absolute", left: 24, right: 24, top: 80, height: 80, display: "flex", gap: 14, alignItems: "center" }}>
              {chips.map(({ q, k, ini }) => {
                const a = sp(ini), u = usa[k];
                const b = u ? interpolate(s, [u.t, u.t + 0.4], [0, 1], { ...c, easing: Easing.in(Easing.cubic) }) : 0;
                return (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px 10px", borderRadius: 18, background: "rgba(255,88,0,0.12)", border: "2px solid rgba(255,88,0,0.5)", opacity: Math.min(1, a * 1.5) * (1 - b), transform: `translateY(${(1 - a) * 110 + b * 120}px) scale(${(0.6 + 0.4 * a) * (1 + 0.3 * b)})`, whiteSpace: "nowrap" }}>
                    {q.emoji ? <span style={{ fontFamily: EMOJI, fontSize: tChip }}>{q.emoji}</span> : null}
                    <span style={{ fontFamily: "SeqH", fontSize: tChip, color: NARANJA, letterSpacing: -1 }}>{q.res}</span>
                  </div>
                );
              })}
            </div>
            {/* operación en curso: aparecen los números, se juntan y se convierten en el resultado */}
            {P.map((q, k) => {
              const fin = finPaso(k), ultimo = k === P.length - 1;
              if (s < q.t || s > fin + 0.25) return null;
              const junta = interpolate(s, [q.tRes - 0.05, q.tRes + 0.2], [0, 1], { ...c, easing: Easing.in(Easing.cubic) });
              const r = s >= q.tRes + 0.1 ? sp(q.tRes + 0.1) : 0;
              const dir = !ultimo && (() => { const u = P.find((x) => x.consume?.includes(k)); return !!u && u.t - q.tRes < 1.6; })();
              const sube = ultimo || dir ? 0 : interpolate(s, [fin, fin + 0.22], [0, 1], { ...c, easing: Easing.in(Easing.cubic) });
              const funde = dir ? interpolate(s, [fin, fin + 0.15], [1, 0], c) : 1;
              const grande = q.consume ? 1.45 : 1.25;
              return (
                <div key={k} style={{ position: "absolute", left: 0, right: 0, top: 170, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {junta < 1 ? (
                    <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 14 * (1 - junta) - 30 * junta, whiteSpace: "nowrap", opacity: 1 - junta, transform: `scale(${1 - 0.5 * junta})` }}>
                      {q.piezas.map(([t, txt, tipo], j) => {
                        if (s < t) return null;
                        const a = sp(t);
                        return <span key={j} style={{ display: "inline-block", opacity: Math.min(1, a * 1.6), transform: `translateY(${(1 - a) * 18}px) scale(${0.7 + 0.3 * a})`, fontFamily: tipo === "e" ? EMOJI : "SeqH", fontSize: tipo === "e" ? tBig * 0.9 : tBig, letterSpacing: -tBig * 0.035, color: color(tipo) }}>{txt}</span>;
                      })}
                    </div>
                  ) : null}
                  {r > 0 ? (
                    <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap", opacity: Math.min(1, r * 1.6) * (1 - sube) * funde, transform: `translateY(${sube * -150}px) scale(${(0.5 + 0.5 * r) * (1 - 0.45 * sube)})` }}>
                      {q.emoji ? <span style={{ fontFamily: EMOJI, fontSize: tBig * grande * 0.85 }}>{q.emoji}</span> : null}
                      <span style={{ fontFamily: "SeqH", fontSize: tBig * grande, color: NARANJA, letterSpacing: -3, filter: `drop-shadow(0 0 ${14 * (1 - Math.min(1, r))}px rgba(255,88,0,0.6))` }}>{q.res}</span>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
      {/* pizarra de cálculo (más pequeña) */}
      {tarjetas.map((tj, i) => {
        if (tj.pasos || s < tj.t || s > tj.tFin + 0.3) return null;
        const p = sp(tj.t), fuera = interpolate(s, [tj.tFin, tj.tFin + 0.3], [0, 1], c);
        const tf = tam * tamTarjeta * 1.4, filaH = tf * 1.38;
        return (
          <div key={"t" + i} style={{ position: "absolute", left: tarjetaX[0], right: 1080 - tarjetaX[1], top: tj.y ?? 1000, opacity: Math.min(1, p * 1.5) * (1 - fuera), transform: `translateY(${(1 - p) * 60 + fuera * 40}px) scale(${0.92 + 0.08 * p})`, transformOrigin: "50% 0", background: "rgba(255,255,255,0.94)", borderRadius: 30, padding: `${tf * 0.5}px ${tf * 0.6}px ${tf * 0.4}px`, boxShadow: "0 18px 50px rgba(0,0,0,0.28), 0 0 0 3px rgba(255,88,0,0.55)" }}>
            {tj.titulo ? <div style={{ fontFamily: "SeqH", fontSize: tf * 0.72, color: NARANJA, letterSpacing: -1, marginBottom: tf * 0.2 }}>{tj.titulo}</div> : null}
            {tj.filas.map((fila, j) => (
              <div key={j} style={{ height: filaH, display: "flex", alignItems: "center", gap: tf * 0.26, whiteSpace: "nowrap" }}>
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
    </AbsoluteFill>
  );
};
