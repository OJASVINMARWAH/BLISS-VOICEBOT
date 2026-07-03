"use client";

import { useEffect, useRef } from "react";
import type { AvatarState } from "./Avatar";

/*
  Siri-style fluid holographic orb:
  - Circular clip
  - 4 morphing blobs rotating at different speeds
  - idle   → warm cream, barely moving
  - listening → slate-grey, slow gentle pulse
  - thinking → amber-gold swirl
  - talking  → deep violet-purple, fast energetic
  The robot iframe sits on top, cropped to the same circle.
*/

type OrbState = AvatarState;

const PALETTES: Record<OrbState, [string, string, string, string]> = {
  idle:      ["#E8D8C0","#D4C4A8","#C8B490","#DDD0B8"],
  listening: ["#8090A4","#6878A0","#90A0B4","#5870A0"],
  thinking:  ["#B89030","#D4A820","#906820","#C8A040"],
  talking:   ["#7030C0","#9040E0","#5020A0","#8840CC"],
};

const SPEED: Record<OrbState, number> = {
  idle:      0.003,
  listening: 0.007,
  thinking:  0.011,
  talking:   0.020,
};

const ALPHA: Record<OrbState, number> = {
  idle:      0.55,
  listening: 0.70,
  thinking:  0.65,
  talking:   0.85,
};

// 4 blobs — each with own freq, amplitude, phase, radius, stretch
const BLOBS = [
  { fX:0.40, fY:0.31, aX:0.28, aY:0.24, r:0.62, sX:1.35, sY:0.75, phase:0.00, rF:0.08 },
  { fX:0.55, fY:0.44, aX:0.22, aY:0.30, r:0.52, sX:0.72, sY:1.28, phase:1.30, rF:0.10 },
  { fX:0.45, fY:0.37, aX:0.26, aY:0.20, r:0.56, sX:1.20, sY:0.82, phase:2.60, rF:0.07 },
  { fX:0.62, fY:0.50, aX:0.20, aY:0.28, r:0.44, sX:0.85, sY:1.18, phase:1.90, rF:0.12 },
];

export default function SiriOrb({
  state,
  size = 224,
  children,
}: {
  state: OrbState;
  size?: number;
  children?: React.ReactNode;
}) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const stateRef   = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let t   = 0;
    let raf = 0;

    const draw = () => {
      const s  = stateRef.current;
      t += SPEED[s];

      const W = size, H = size;
      const cx = W / 2, cy = H / 2;

      ctx.clearRect(0, 0, W, H);

      // White base so blobs show clearly
      ctx.fillStyle = "#FAF3E6";
      ctx.beginPath();
      ctx.arc(cx, cy, cx - 2, 0, Math.PI * 2);
      ctx.fill();

      const pal   = PALETTES[s];
      const alpha = ALPHA[s];

      for (let i = 0; i < BLOBS.length; i++) {
        const b  = BLOBS[i];
        const bx = cx + Math.sin(t * b.fX + b.phase)        * cx * b.aX;
        const by = cy + Math.cos(t * b.fY + b.phase * 0.75) * cy * b.aY;
        const r  = cx * b.r * (1 + 0.14 * Math.sin(t * b.fX * 1.6 + b.phase));
        const sX = b.sX + 0.20 * Math.sin(t * b.rF * 1.3 + b.phase);
        const sY = b.sY + 0.20 * Math.cos(t * b.rF * 1.1 + b.phase + 1);
        const angle = t * b.rF + b.phase;

        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(angle);
        ctx.scale(sX, sY);

        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0,    hexToRgba(pal[i], alpha));
        g.addColorStop(0.45, hexToRgba(pal[i], alpha * 0.50));
        g.addColorStop(0.80, hexToRgba(pal[i], alpha * 0.14));
        g.addColorStop(1,    hexToRgba(pal[i], 0));

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Gaussian blur approximation via multiple overlapping layers at reduced opacity
      // (real blur needs compositing; we fake it with a soft inner circle overlay)
      const blur = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
      blur.addColorStop(0,   "rgba(255,255,255,0.00)");
      blur.addColorStop(0.70,"rgba(255,255,255,0.00)");
      blur.addColorStop(0.88,"rgba(255,255,255,0.30)");
      blur.addColorStop(1,   "rgba(255,255,255,0.75)");
      ctx.fillStyle = blur;
      ctx.beginPath();
      ctx.arc(cx, cy, cx, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [size]);

  const borderColor: Record<OrbState, string> = {
    idle:      "rgba(200,180,150,0.55)",
    listening: "rgba(100,120,170,0.65)",
    thinking:  "rgba(180,140,30,0.60)",
    talking:   "rgba(120,50,200,0.75)",
  };

  const outerGlow: Record<OrbState, string> = {
    idle:      "0 0 0 3px rgba(200,180,150,0.25)",
    listening: "0 0 0 4px rgba(100,120,170,0.28), 0 0 20px rgba(80,100,160,0.20)",
    thinking:  "0 0 0 3px rgba(180,140,30,0.30), 0 0 18px rgba(180,140,30,0.18)",
    talking:   "0 0 0 4px rgba(120,50,200,0.40), 0 0 28px rgba(120,50,200,0.28), 0 0 52px rgba(100,30,180,0.14)",
  };

  return (
    // Outer wrapper: shows the glow box-shadow — NO overflow:hidden
    <div style={{
      position: "relative",
      width: size,
      height: size,
      borderRadius: "50%",
      boxShadow: outerGlow[state],
      transition: "box-shadow 0.6s ease",
      flexShrink: 0,
    }}>
      {/* Inner clip: border + overflow:hidden so canvas & children stay circular */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        overflow: "hidden",
        border: `2.5px solid ${borderColor[state]}`,
        transition: "border-color 0.6s ease",
      }}>
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            filter: "blur(14px) saturate(1.4)",
            borderRadius: "50%",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
}
