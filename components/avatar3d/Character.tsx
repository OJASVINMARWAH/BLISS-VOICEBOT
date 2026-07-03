"use client";

import { useEffect, useRef, useState } from "react";
import type { AvatarState } from "../Avatar";

export default function Character({ state }: { state: AvatarState }) {
  const [mouth, setMouth] = useState(0);       // 0..1 jaw open
  const [blink, setBlink] = useState(false);
  const rafRef = useRef<number>(0);
  const t = useRef(0);

  /* ── Talking mouth ── */
  useEffect(() => {
    if (state === "talking") {
      const tick = (ts: number) => {
        const v =
          Math.abs(Math.sin(ts * 0.011)) * 0.6 +
          Math.abs(Math.sin(ts * 0.017 + 1.4)) * 0.35;
        setMouth(Math.min(v, 1));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafRef.current);
    } else {
      cancelAnimationFrame(rafRef.current);
      setMouth(0);
    }
  }, [state]);

  /* ── Blink ── */
  useEffect(() => {
    let alive = true;
    const sched = () => {
      if (!alive) return;
      const delay = 2600 + Math.random() * 3800;
      const tid = setTimeout(() => {
        setBlink(true);
        const tid2 = setTimeout(() => {
          if (alive) { setBlink(false); sched(); }
        }, 110);
        return () => clearTimeout(tid2);
      }, delay);
      return () => clearTimeout(tid);
    };
    const cleanup = sched();
    return () => { alive = false; cleanup?.(); };
  }, []);

  /* Per-state expression */
  const thinking  = state === "thinking";
  const listening = state === "listening";
  const talking   = state === "talking";

  const tiltDeg   = listening ? -7 : thinking ? 6 : 0;
  const browLift  = listening ? -6 : 0;
  const browFrown = thinking  ?  4 : 0;
  const gazeX     = thinking  ?  6 : 0;
  const gazeY     = thinking  ? -5 : 0;
  const smileAmt  = (talking || listening) ? 3 : 0; // y-offset on smile curve

  const mouthH = mouth * 22; // pixel open amount

  return (
    <svg
      viewBox="0 0 480 520"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%", height: "100%",
        transform: `rotate(${tiltDeg}deg)`,
        transformOrigin: "50% 78%",
        transition: "transform 0.5s cubic-bezier(.25,.8,.25,1)",
      }}
    >
      <defs>
        {/* ── Backgrounds ── */}
        <radialGradient id="bgGrad" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#EFC5B5"/>
          <stop offset="100%" stopColor="#D9A898"/>
        </radialGradient>

        {/* ── Skin ── */}
        <radialGradient id="skinMain" cx="38%" cy="28%" r="70%">
          <stop offset="0%"   stopColor="#FDE8CE"/>
          <stop offset="40%"  stopColor="#F5C99A"/>
          <stop offset="80%"  stopColor="#E8AC78"/>
          <stop offset="100%" stopColor="#D08C55"/>
        </radialGradient>
        <radialGradient id="skinJaw" cx="50%" cy="10%" r="80%">
          <stop offset="0%" stopColor="#F0BD8A"/>
          <stop offset="100%" stopColor="#C87F48"/>
        </radialGradient>
        <radialGradient id="skinNeck" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#EDB87A"/>
          <stop offset="100%" stopColor="#C07A42"/>
        </radialGradient>
        <radialGradient id="earShade" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#E8A870"/>
          <stop offset="100%" stopColor="#B87040"/>
        </radialGradient>

        {/* ── Hair — glossy deep black ── */}
        <linearGradient id="hairBase" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor="#211209"/>
          <stop offset="45%"  stopColor="#160C05"/>
          <stop offset="100%" stopColor="#0C0703"/>
        </linearGradient>
        <radialGradient id="hairSheen1" cx="32%" cy="18%" r="46%">
          <stop offset="0%"   stopColor="#6B4428" stopOpacity="1"/>
          <stop offset="40%"  stopColor="#3A2010" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#1A0C06" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="hairSheen2" cx="65%" cy="25%" r="32%">
          <stop offset="0%"   stopColor="#4A2E18" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#1A0C06" stopOpacity="0"/>
        </radialGradient>

        {/* ── Eyes ── */}
        <radialGradient id="sclera" cx="38%" cy="32%" r="66%">
          <stop offset="0%"   stopColor="#FFFFFF"/>
          <stop offset="80%"  stopColor="#F4EDE4"/>
          <stop offset="100%" stopColor="#E8DDD0"/>
        </radialGradient>
        <radialGradient id="iris" cx="35%" cy="30%" r="62%">
          <stop offset="0%"   stopColor="#9B6A3A"/>
          <stop offset="42%"  stopColor="#5C3618"/>
          <stop offset="75%"  stopColor="#2E1808"/>
          <stop offset="100%" stopColor="#170C04"/>
        </radialGradient>
        <radialGradient id="pupilGrad" cx="40%" cy="35%" r="55%">
          <stop offset="0%"   stopColor="#1A0A04"/>
          <stop offset="100%" stopColor="#0A0402"/>
        </radialGradient>

        {/* ── Beard ── */}
        <linearGradient id="beardGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%"   stopColor="#211209"/>
          <stop offset="100%" stopColor="#0C0703"/>
        </linearGradient>
        <radialGradient id="beardFade" cx="50%" cy="30%" r="60%">
          <stop offset="0%"   stopColor="#211209" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#0C0703" stopOpacity="0.25"/>
        </radialGradient>

        {/* ── Shirt ── */}
        <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="10%" y2="100%">
          <stop offset="0%"   stopColor="#1A1A1A"/>
          <stop offset="100%" stopColor="#080808"/>
        </linearGradient>
        <radialGradient id="shirtHighlight" cx="40%" cy="8%" r="50%">
          <stop offset="0%"   stopColor="#333333" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#111111" stopOpacity="0"/>
        </radialGradient>

        {/* ── Blush ── */}
        <radialGradient id="blushL" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#E87050" stopOpacity="0.32"/>
          <stop offset="100%" stopColor="#E87050" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="blushR" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#E87050" stopOpacity="0.32"/>
          <stop offset="100%" stopColor="#E87050" stopOpacity="0"/>
        </radialGradient>

        {/* Shadow under jaw */}
        <radialGradient id="jawShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#8B5830" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="#8B5830" stopOpacity="0"/>
        </radialGradient>

        {/* Clip circles for eyeballs */}
        <clipPath id="eyeClipL">
          <ellipse cx="162" cy="224" rx="32" ry="30"/>
        </clipPath>
        <clipPath id="eyeClipR">
          <ellipse cx="318" cy="224" rx="32" ry="30"/>
        </clipPath>
      </defs>

      {/* ════════════ BACKGROUND ════════════ */}
      <rect width="480" height="520" fill="url(#bgGrad)"/>

      {/* ════════════ SHIRT ════════════ */}
      {/* Wide shoulder base */}
      <path
        d="M -20 520 L -20 440
           C 60 414 130 400 175 396
           L 200 406 L 240 412 L 280 406
           L 305 396
           C 350 400 420 414 500 440
           L 500 520 Z"
        fill="url(#shirtGrad)"
      />
      <path
        d="M -20 520 L -20 440
           C 60 414 130 400 175 396
           L 200 406 L 240 412 L 280 406
           L 305 396
           C 350 400 420 414 500 440
           L 500 520 Z"
        fill="url(#shirtHighlight)"
      />
      {/* Crew neck — subtle arc */}
      <path
        d="M 185 404 Q 240 424 295 404"
        stroke="#111111" strokeWidth="15" fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 185 404 Q 240 420 295 404"
        stroke="#222222" strokeWidth="7" fill="none"
        strokeLinecap="round"
      />

      {/* ════════════ NECK ════════════ */}
      <path
        d="M 202 366 Q 198 398 200 406 L 280 406 Q 282 398 278 366 Z"
        fill="url(#skinNeck)"
      />
      {/* neck side shadow */}
      <path d="M 204 368 Q 200 396 202 404" stroke="#B07040" strokeWidth="5" fill="none" opacity="0.35" strokeLinecap="round"/>
      <path d="M 276 368 Q 280 396 278 404" stroke="#B07040" strokeWidth="5" fill="none" opacity="0.35" strokeLinecap="round"/>

      {/* ════════════ EARS ════════════ */}
      <ellipse cx="104" cy="240" rx="20" ry="27" fill="url(#skinMain)"/>
      <ellipse cx="376" cy="240" rx="20" ry="27" fill="url(#skinMain)"/>
      {/* Inner ear */}
      <ellipse cx="104" cy="240" rx="11" ry="18" fill="#B87040" opacity="0.5"/>
      <ellipse cx="376" cy="240" rx="11" ry="18" fill="#B87040" opacity="0.5"/>
      <ellipse cx="376" cy="240" rx="5" ry="10" fill="#9A5C2E" opacity="0.4"/>
      <ellipse cx="104" cy="240" rx="5" ry="10" fill="#9A5C2E" opacity="0.4"/>

      {/* ════════════ HEAD ════════════ */}
      {/* Main face ellipse */}
      <ellipse cx="240" cy="242" rx="136" ry="152" fill="url(#skinMain)"/>
      {/* Jaw / chin taper */}
      <ellipse cx="240" cy="348" rx="96" ry="66" fill="url(#skinJaw)"/>
      {/* Side face shadow */}
      <ellipse cx="152" cy="272" rx="52" ry="72" fill="#D09060" opacity="0.14"/>
      <ellipse cx="328" cy="272" rx="52" ry="72" fill="#D09060" opacity="0.14"/>
      {/* Jaw shadow */}
      <ellipse cx="240" cy="368" rx="100" ry="36" fill="url(#jawShadow)"/>

      {/* ════════════ BEARD ════════════ */}
      {/* Cheek stubble left */}
      <ellipse cx="163" cy="306" rx="66" ry="52" fill="url(#beardFade)"/>
      {/* Cheek stubble right */}
      <ellipse cx="317" cy="306" rx="66" ry="52" fill="url(#beardFade)"/>
      {/* Connecting band across upper chin */}
      <ellipse cx="240" cy="334" rx="80" ry="26" fill="url(#beardGrad)" opacity="0.72"/>
      {/* Main goatee — smooth Bezier teardrop */}
      <path
        d="M 172 326
           Q 170 362 182 386
           Q 198 414 240 420
           Q 282 414 298 386
           Q 310 362 308 326
           Q 284 344 240 346
           Q 196 344 172 326 Z"
        fill="url(#beardGrad)"
      />
      {/* Mustache — two lobes meeting centre */}
      <path
        d="M 186 292
           Q 200 282 240 286
           Q 280 282 294 292
           Q 272 305 240 302
           Q 208 305 186 292 Z"
        fill="url(#beardGrad)"
      />
      {/* Fade edges of mustache into cheek */}
      <path
        d="M 186 292 Q 180 300 182 310" stroke="#211209" strokeWidth="6" fill="none" opacity="0.5" strokeLinecap="round"/>
      <path
        d="M 294 292 Q 300 300 298 310" stroke="#211209" strokeWidth="6" fill="none" opacity="0.5" strokeLinecap="round"/>

      {/* ════════════ HAIR ════════════ */}
      {/* 
        Strategy: one single compound shape that traces the entire
        silhouette — back of head, then the swept wave across the forehead,
        leaving the hairline exposed, exactly like the reference.
      */}

      {/* Back-of-head cap — sits BEHIND the face */}
      <ellipse cx="240" cy="200" rx="148" ry="148" fill="url(#hairBase)"/>

      {/* Front hairline + swept wave shape
          This clips away to show forehead skin, with the wave
          sweeping from left to right */}
      <path
        d="
          M 108 216
          C 100 176 106 136 122 112
          C 138 88 172 72 240 70
          C 308 72 342 88 358 112
          C 374 136 380 176 372 216
          C 370 196 364 176 352 162
          C 336 144 310 132 284 132
          C 272 132 258 136 246 142
          C 234 130 218 120 200 116
          C 188 114 174 116 162 124
          C 148 132 134 148 120 168
          C 112 182 108 200 108 216 Z
        "
        fill="url(#hairBase)"
      />

      {/* The swept fringe — single sculpted wave going left→right.
          This is what makes the reference look distinctive. */}
      <path
        d="
          M 113 214
          C 106 182 108 152 118 130
          C 108 148 102 174 104 204

          C 110 172 120 148 136 132
          C 122 148 116 172 118 200

          C 128 168 142 148 162 136
          C 150 156 146 178 150 200

          C 162 168 180 150 204 140
          C 194 162 190 186 194 208

          C 210 170 236 152 266 148
          C 256 172 252 196 256 218

          C 272 176 298 156 328 152
          C 316 178 314 202 318 224

          C 334 186 354 166 372 160
          C 374 182 372 206 366 222

          C 358 202 348 186 340 182
          C 348 196 352 212 346 226

          C 332 204 316 188 308 184
          C 316 200 320 218 312 232

          C 296 208 276 192 264 186
          C 248 182 234 186 220 190
          C 204 196 192 208 184 220

          C 180 206 180 190 184 178
          C 170 188 162 204 160 218

          C 152 200 148 182 150 166
          C 138 178 130 196 126 212
          C 118 196 114 178 113 214 Z
        "
        fill="url(#hairBase)"
      />

      {/* Hair gloss — two overlapping sheen blobs */}
      <ellipse cx="200" cy="118" rx="90" ry="54" fill="url(#hairSheen1)"/>
      <ellipse cx="300" cy="136" rx="60" ry="36" fill="url(#hairSheen2)"/>

      {/* ════════════ EYEBROWS — thick, arched ════════════ */}
      <g style={{
        transform: `translateY(${browLift + browFrown}px)`,
        transition: "transform 0.35s ease",
        transformOrigin: "50% 50%"
      }}>
        {/* Left brow */}
        <path
          d={`M ${152+browFrown*0.5} ${190+browFrown} Q 178 ${180+browFrown} 198 ${185+browFrown}`}
          stroke="#16090400" strokeWidth="0" fill="#16090400"
        />
        <path
          d={`M ${150} ${190+browFrown} Q 176 ${179+browFrown} 198 ${184+browFrown}`}
          stroke="#160904" strokeWidth="12" fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M ${151} ${190+browFrown} Q 177 ${180+browFrown} 197 ${184+browFrown}`}
          stroke="#221208" strokeWidth="8" fill="none"
          strokeLinecap="round"
        />
        {/* Right brow */}
        <path
          d={`M 282 ${184+browFrown} Q 304 ${179-browFrown*0.2} ${330-browFrown*0.5} ${190+browFrown*0.5}`}
          stroke="#160904" strokeWidth="12" fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M 283 ${184+browFrown} Q 303 ${180-browFrown*0.2} ${329-browFrown*0.5} ${190+browFrown*0.5}`}
          stroke="#221208" strokeWidth="8" fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* ════════════ EYES ════════════ */}
      {/* ── Left eye ── */}
      <g style={{
        transform: `translate(${gazeX}px, ${gazeY}px)`,
        transition: "transform 0.4s ease"
      }}>
        {/* Sclera */}
        <ellipse cx="162" cy="224" rx="32" ry="30" fill="url(#sclera)"/>
        {/* Iris */}
        <ellipse cx="162" cy="226" rx="22" ry="22" fill="url(#iris)"/>
        {/* Pupil */}
        <circle cx="162" cy="226" r="13" fill="url(#pupilGrad)"/>
        {/* Catchlights */}
        <circle cx="170" cy="218" r="6.5" fill="white" opacity="0.95"/>
        <circle cx="155" cy="232" r="2.8" fill="white" opacity="0.5"/>
        {/* Rim around iris */}
        <circle cx="162" cy="226" r="22" fill="none" stroke="#0C0602" strokeWidth="1.5" opacity="0.6"/>
        {/* Upper lash line */}
        {!blink && (
          <path d="M 130 210 Q 162 202 194 210" stroke="#160904" strokeWidth="5" fill="none" strokeLinecap="round"/>
        )}
        {/* Lower lash */}
        {!blink && (
          <path d="M 132 237 Q 162 242 192 237" stroke="#160904" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
        )}
        {/* Blink */}
        {blink && (
          <ellipse cx="162" cy="224" rx="34" ry="32" fill="url(#skinMain)"/>
        )}
      </g>

      {/* ── Right eye ── */}
      <g style={{
        transform: `translate(${gazeX}px, ${gazeY}px)`,
        transition: "transform 0.4s ease"
      }}>
        <ellipse cx="318" cy="224" rx="32" ry="30" fill="url(#sclera)"/>
        <ellipse cx="318" cy="226" rx="22" ry="22" fill="url(#iris)"/>
        <circle cx="318" cy="226" r="13" fill="url(#pupilGrad)"/>
        <circle cx="326" cy="218" r="6.5" fill="white" opacity="0.95"/>
        <circle cx="311" cy="232" r="2.8" fill="white" opacity="0.5"/>
        <circle cx="318" cy="226" r="22" fill="none" stroke="#0C0602" strokeWidth="1.5" opacity="0.6"/>
        {!blink && (
          <path d="M 286 210 Q 318 202 350 210" stroke="#160904" strokeWidth="5" fill="none" strokeLinecap="round"/>
        )}
        {!blink && (
          <path d="M 288 237 Q 318 242 348 237" stroke="#160904" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
        )}
        {blink && (
          <ellipse cx="318" cy="224" rx="34" ry="32" fill="url(#skinMain)"/>
        )}
      </g>

      {/* ════════════ NOSE ════════════ */}
      {/* Bridge shadow */}
      <path d="M 232 248 C 228 268 226 280 228 290 Q 240 298 252 290 C 254 280 252 268 248 248"
        stroke="#C88050" strokeWidth="2.5" fill="none" opacity="0.45" strokeLinecap="round"/>
      {/* Nostril shading */}
      <ellipse cx="226" cy="290" rx="11" ry="7" fill="#C07840" opacity="0.50"/>
      <ellipse cx="254" cy="290" rx="11" ry="7" fill="#C07840" opacity="0.50"/>
      {/* Nose tip highlight */}
      <ellipse cx="240" cy="284" rx="9" ry="6" fill="#FDDCB0" opacity="0.35"/>

      {/* ════════════ CHEEK BLUSH ════════════ */}
      <ellipse cx="148" cy="262" rx="46" ry="30" fill="url(#blushL)"/>
      <ellipse cx="332" cy="262" rx="46" ry="30" fill="url(#blushR)"/>

      {/* ════════════ MOUTH ════════════ */}
      {mouthH > 2 ? (
        // Open mouth — talking
        <g>
          {/* Upper lip */}
          <path
            d={`M 194 308 Q 218 300 240 302 Q 262 300 286 308 Q 268 ${314+smileAmt} 240 ${316+smileAmt} Q 212 ${314+smileAmt} 194 308 Z`}
            fill="#8B3020"
          />
          {/* Dark interior */}
          <ellipse cx="240" cy={308 + mouthH * 0.55} rx="36" ry={mouthH * 0.5 + 3} fill="#1C0806"/>
          {/* Lower lip */}
          <path
            d={`M 194 308 Q 216 ${308 + mouthH * 0.85 + smileAmt} 240 ${310 + mouthH * 0.9 + smileAmt} Q 264 ${308 + mouthH * 0.85 + smileAmt} 286 308`}
            stroke="#A04038" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7"
          />
          {/* Teeth hint */}
          {mouthH > 8 && (
            <ellipse cx="240" cy={308 + mouthH * 0.25} rx="26" ry={mouthH * 0.22 + 1} fill="#F0EAE0" opacity="0.85"/>
          )}
        </g>
      ) : (
        // Closed — gentle smile
        <g>
          <path
            d={`M 194 308 Q 218 300 240 302 Q 262 300 286 308`}
            stroke="#8B3020" strokeWidth="3.5" fill="none" strokeLinecap="round"
          />
          <path
            d={`M 194 308 Q 216 ${318+smileAmt} 240 ${320+smileAmt} Q 264 ${318+smileAmt} 286 308`}
            stroke="#8B3020" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7"
          />
          {/* Lip fill */}
          <path
            d={`M 194 308 Q 218 300 240 302 Q 262 300 286 308 Q 264 ${318+smileAmt} 240 ${320+smileAmt} Q 216 ${318+smileAmt} 194 308 Z`}
            fill="#9B3828" opacity="0.55"
          />
          {/* Corner dimples */}
          <circle cx="194" cy="308" r="3" fill="#A04030" opacity="0.55"/>
          <circle cx="286" cy="308" r="3" fill="#A04030" opacity="0.55"/>
        </g>
      )}

      {/* ════════════ EYELID SHADING (upper shadow for depth) ════════════ */}
      {!blink && (<>
        <path d="M 130 210 Q 162 206 194 210 Q 162 215 130 210 Z" fill="#E8B880" opacity="0.28"/>
        <path d="M 286 210 Q 318 206 350 210 Q 318 215 286 210 Z" fill="#E8B880" opacity="0.28"/>
      </>)}
    </svg>
  );
}
