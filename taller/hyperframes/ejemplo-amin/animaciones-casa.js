// Vocabulario de animación "de la casa" para HyperFrames (GSAP). Implementación PROPIA.
// Los números siguen las especificaciones documentadas en el paquete video-editor (presets/youtube/default/animations.md,
// graphics.md § Motion); no se ha copiado su código. Opciones, no reglas: cada vídeo elige.
//   riseIn  : texto/tarjetas suben 22 px (proporcional al tamaño) en 0,55 s, power3.out; la opacidad CORTA a 1, no hace fundido
//   riseOut : sube 18 px y se desvanece en 0,35 s, power2.in (la salida de todo)
//   pop     : objetos (iconos, emojis, chapas) 0,90 → 1,10 en 3 fotogramas power2.out y 1,00 en el 4.º
//   slam    : sello pesado 1,16 → 1,00 en 7 fotogramas power2.out (usar poco)
//   drawOn  : trazo (flecha, subrayado) que se dibuja con stroke-dashoffset
//   float   : vida en reposo, deriva muy lenta (sin rotación animada)
// Regla: un cambio en el mismo hueco va en secuencia (riseOut termina antes del riseIn siguiente).
(function (g) {
  const F = (n, fps) => n / (fps || 30);
  g.casa = {
    riseIn(tl, el, t, opts = {}) {
      const px = opts.px || 22 * ((opts.tam || 90) / 90);
      tl.set(el, { opacity: 1 }, t);
      tl.fromTo(el, { y: px }, { y: 0, duration: 0.55, ease: "power3.out" }, t);
    },
    riseOut(tl, el, t) { tl.to(el, { y: -18, opacity: 0, duration: 0.35, ease: "power2.in" }, t); },
    pop(tl, el, t, fps) {
      tl.set(el, { opacity: 1, scale: 0.9 }, t);
      tl.to(el, { scale: 1.1, duration: F(3, fps), ease: "power2.out" }, t);
      tl.to(el, { scale: 1.0, duration: F(1, fps), ease: "none" }, t + F(3, fps));
    },
    slam(tl, el, t, fps) {
      tl.set(el, { opacity: 1, scale: 1.16 }, t);
      tl.to(el, { scale: 1.0, duration: F(7, fps), ease: "power2.out" }, t);
    },
    drawOn(tl, path, t, dur = 0.5) {
      const L = path.getTotalLength();
      tl.set(path, { strokeDasharray: L, strokeDashoffset: L, opacity: 1 }, t);
      tl.to(path, { strokeDashoffset: 0, duration: dur, ease: "power2.inOut" }, t);
    },
    float(tl, el, t0, t1, px = 6) { tl.fromTo(el, { y: 0 }, { y: -px, duration: t1 - t0, ease: "sine.inOut" }, t0); },
  };
})(window);
