"use client";

import { useEffect, useRef } from "react";
import type { AvatarState } from "./Avatar";

/*
  Fluid molten holographic Siri-like effect — light palette edition.

  Uses morphing ellipses (not plain circles) that rotate and stretch
  independently, producing organic teardrop/amoeba forms similar to
  Apple's Siri waveform — without needing WebGL or a dark stage.

  Colors are soft, semi-transparent pastels so they sit beautifully
  on the warm cream/parchment background without overpowering it.
*/

const BLOBS = [
  // [r, g, b]  phase   freqX  freqY  ampX   ampY   baseR  sX     sY   rotFreq
  { rgb:[160, 20, 70],  phase:0.00, fX:0.32, fY:0.25, aX:0.30, aY:0.22, r:110, sX:1.45, sY:0.68, rF:0.07 },
  { rgb:[185,135, 10],  phase:1.30, fX:0.48, fY:0.38, aX:0.26, aY:0.32, r: 95, sX:0.72, sY:1.38, rF:0.09 },
  { rgb:[175, 20,110],  phase:2.60, fX:0.41, fY:0.32, aX:0.28, aY:0.21, r:100, sX:1.28, sY:0.75, rF:0.06 },
  { rgb:[ 95, 25,165],  phase:0.70, fX:0.55, fY:0.45, aX:0.22, aY:0.29, r: 76, sX:0.82, sY:1.22, rF:0.10 },
  { rgb:[200, 70,  5],  phase:1.90, fX:0.44, fY:0.52, aX:0.33, aY:0.20, r: 84, sX:1.35, sY:0.70, rF:0.08 },
  { rgb:[210, 45,130],  phase:3.20, fX:0.62, fY:0.35, aX:0.18, aY:0.27, r: 65, sX:0.65, sY:1.30, rF:0.11 },
  { rgb:[130, 55,190],  phase:2.10, fX:0.36, fY:0.58, aX:0.24, aY:0.24, r: 72, sX:1.20, sY:0.82, rF:0.07 },
];

// Max alpha per state — slightly richer, still sits well on the cream bg
const ALPHA: Record<AvatarState, number> = {
  idle:      0.34,
  listening: 0.42,
  thinking:  0.30,
  talking:   0.52,
};
const SPEED: Record<AvatarState, number> = {
  idle:      0.008,
  listening: 0.016,
  thinking:  0.012,
  talking:   0.022,
};
const RSCALE: Record<AvatarState, number> = {
  idle:      1.00,
  listening: 1.10,
  thinking:  0.88,
  talking:   1.25,
};

export default function HolographicBg({ state }: { state: AvatarState }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    const resize = () => {
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let t   = 0;
    let raf = 0;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const s = stateRef.current;
      t += SPEED[s];

      ctx.clearRect(0, 0, W, H);

      const scale = W / (380 * dpr); // normalise to design width

      for (const b of BLOBS) {
        const bx = W * 0.5 + Math.sin(t * b.fX + b.phase)        * W * b.aX;
        const by = H * 0.5 + Math.cos(t * b.fY + b.phase * 0.75) * H * b.aY;
        const r  = b.r * scale * RSCALE[s]
                     * (1 + 0.16 * Math.sin(t * b.fX * 1.5 + b.phase));

        // Animate the stretch ratios so blobs morph between wide/tall
        const sX = b.sX + 0.22 * Math.sin(t * b.rF * 1.3 + b.phase);
        const sY = b.sY + 0.22 * Math.cos(t * b.rF * 1.1 + b.phase + 1);
        const angle = t * b.rF + b.phase;

        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(angle);
        ctx.scale(sX, sY);

        const a  = ALPHA[s];
        const [R, G, B] = b.rgb;
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0,    `rgba(${R},${G},${B},${a.toFixed(2)})`);
        g.addColorStop(0.40, `rgba(${R},${G},${B},${(a * 0.48).toFixed(2)})`);
        g.addColorStop(0.75, `rgba(${R},${G},${B},${(a * 0.14).toFixed(2)})`);
        g.addColorStop(1,    `rgba(${R},${G},${B},0)`);

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        /* Blur keeps blobs fluid; saturate lifts the pastel tones;
           normal blend mode works perfectly on the light cream stage */
        filter: "blur(22px) saturate(1.5)",
        mixBlendMode: "normal",
        opacity: 0.85,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
