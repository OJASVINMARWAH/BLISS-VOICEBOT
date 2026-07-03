"use client";

export type AvatarState = "idle" | "listening" | "thinking" | "talking";

const STATE_LABEL: Record<AvatarState, string> = {
  idle: "Idle",
  listening: "Listening…",
  thinking: "Thinking…",
  talking: "Speaking",
};

export default function Avatar({ state }: { state: AvatarState }) {
  const isThinking = state === "thinking";
  const isTalking = state === "talking";
  const isListening = state === "listening";

  const bodyAnim = isTalking ? "animate-bobTalk" : isListening ? "animate-leanIn" : "animate-bob";
  const accent = isThinking ? "#C9A227" : isListening ? "#80013F" : "#80013F";

  return (
    <div className="relative flex flex-col items-center">
      {/* ambient stage glow */}
      <div
        className={`pointer-events-none absolute -inset-x-10 top-2 bottom-6 rounded-[3rem] blur-3xl transition-colors duration-700 ${
          isThinking ? "bg-gold/10" : "bg-wine/[0.07]"
        }`}
      />

      {/* thought bubble, only while thinking */}
      {isThinking && (
        <div className="absolute right-2 top-0 flex flex-col items-end z-10">
          <div className="flex gap-1 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-paper border border-gold/50" />
            <span className="w-2 h-2 rounded-full bg-paper border border-gold/50" />
          </div>
          <div className="bg-paper border border-gold/40 rounded-2xl rounded-br-sm px-2.5 py-1.5 shadow-card">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gold animate-sparkle"
                  style={{ animationDelay: `${i * 0.22}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* listening sound rings near ear */}
      {isListening && (
        <div className="absolute left-[16%] top-[26%] z-10">
          <span className="absolute w-7 h-7 -left-3.5 -top-3.5 rounded-full border-2 border-wine/50 animate-soundWave" />
          <span
            className="absolute w-7 h-7 -left-3.5 -top-3.5 rounded-full border-2 border-wine/50 animate-soundWave"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
      )}

      <svg viewBox="0 0 280 360" className="relative w-[230px] sm:w-[260px] h-auto">
        <defs>
          <radialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E0C159" stopOpacity="1" />
            <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sweater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8C1248" />
            <stop offset="100%" stopColor="#5C0030" />
          </linearGradient>
          <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F0C9A0" />
            <stop offset="100%" stopColor="#DFAE7E" />
          </linearGradient>
          <radialGradient id="cheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E08A6E" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#E08A6E" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2B1A12" />
            <stop offset="100%" stopColor="#180E09" />
          </linearGradient>
          <clipPath id="eyeClipL">
            <ellipse cx="118" cy="113" rx="7.5" ry="6" />
          </clipPath>
          <clipPath id="eyeClipR">
            <ellipse cx="162" cy="113" rx="7.5" ry="6" />
          </clipPath>
        </defs>

        {/* backpack strap hint */}
        <rect x="178" y="150" width="14" height="120" rx="7" fill="#3A0A1F" opacity="0.4" />

        <g className={bodyAnim} style={{ transformOrigin: "140px 300px" }}>
          {/* body / sweater */}
          <path
            d="M86 360 L90 228 C90 196 115 176 140 176 C165 176 190 196 190 228 L194 360 Z"
            fill="url(#sweater)"
            stroke="#52002A"
            strokeWidth="2"
          />
          {/* collar */}
          <path d="M118 180 L140 204 L162 180" fill="none" stroke="#FAF3E6" strokeWidth="4" strokeLinecap="round" />
          {/* BLISS chest text */}
          <text x="140" y="244" textAnchor="middle" fontSize="15" fontWeight="700" fill="#E0C159" fontFamily="var(--font-display)" letterSpacing="0.5">
            BLISS
          </text>

          {/* neck */}
          <rect x="126" y="158" width="28" height="30" fill="url(#skin)" />
          <path d="M126 168 Q140 176 154 168" stroke="#C99366" strokeWidth="1.5" fill="none" opacity="0.5" />

          {/* ===== HEAD ===== */}
          <g
            className={isListening ? "animate-nod" : ""}
            style={{
              transformOrigin: "140px 175px",
              transform: isThinking ? "rotate(-4deg) translateY(2px)" : undefined,
              transition: "transform 0.4s ease",
            }}
          >
            {/* ears */}
            <ellipse cx="96" cy="118" rx="8" ry="11" fill="url(#skin)" />
            <ellipse cx="184" cy="118" rx="8" ry="11" fill="url(#skin)" />

            {/* head shape — softer, more organic jaw */}
            <path
              d="M140 56
                 C168 56 190 76 191 106
                 C192 128 188 146 178 158
                 C168 170 154 176 140 176
                 C126 176 112 170 102 158
                 C92 146 88 128 89 106
                 C90 76 112 56 140 56 Z"
              fill="url(#skin)"
            />

            {/* cheek blush */}
            <ellipse cx="112" cy="132" rx="11" ry="7" fill="url(#cheek)" />
            <ellipse cx="168" cy="132" rx="11" ry="7" fill="url(#cheek)" />

            {/* hair — layered, side-swept fringe with strands */}
            <path
              d="M86 100
                 C78 56 108 32 140 32
                 C174 32 204 56 196 102
                 C193 78 184 92 174 76
                 C166 92 152 70 142 84
                 C132 68 118 90 106 78
                 C98 90 90 84 86 100 Z"
              fill="url(#hairGrad)"
            />
            <path d="M88 96 C84 84 90 72 100 70" stroke="#180E09" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M192 96 C196 84 190 72 180 70" stroke="#180E09" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M118 60 Q128 50 140 52" stroke="#3A2418" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M150 52 Q164 52 172 62" stroke="#3A2418" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />

            {/* glasses */}
            <g stroke="#34161F" strokeWidth="3" fill="rgba(255,255,255,0.35)">
              <circle cx="118" cy="113" r="16" />
              <circle cx="162" cy="113" r="16" />
              <line x1="134" y1="111" x2="146" y2="111" />
              <line x1="102" y1="108" x2="92" y2="104" strokeLinecap="round" />
              <line x1="178" y1="108" x2="188" y2="104" strokeLinecap="round" />
            </g>

            {/* eyebrows */}
            <g
              className={isThinking ? "animate-browFurrow" : isListening ? "animate-browRaise" : ""}
              style={{ transformOrigin: "140px 92px" }}
            >
              <path d="M105 95 Q117 89 130 92" stroke="#180E09" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M150 92 Q163 89 175 95" stroke="#180E09" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>

            {/* eyes — sclera + iris (shift gaze while thinking) + blink lid */}
            <g>
              <ellipse cx="118" cy="113" rx="7.5" ry="6" fill="#FFFFFF" />
              <ellipse cx="162" cy="113" rx="7.5" ry="6" fill="#FFFFFF" />
              <g
                style={{
                  transform: isThinking ? "translate(2px, -2px)" : "translate(0,0)",
                  transition: "transform 0.5s ease",
                }}
              >
                <circle cx="119.5" cy="113" r="3.6" fill="#34161F" />
                <circle cx="163.5" cy="113" r="3.6" fill="#34161F" />
                <circle cx="121" cy="111" r="1" fill="#fff" />
                <circle cx="165" cy="111" r="1" fill="#fff" />
              </g>
              {/* blinking eyelids, clipped to eye shape */}
              {!isThinking && (
                <g className="animate-blink" style={{ transformOrigin: "140px 113px" }}>
                  <rect x="108" y="104" width="20" height="9" fill="url(#skin)" clipPath="url(#eyeClipL)" />
                  <rect x="152" y="104" width="20" height="9" fill="url(#skin)" clipPath="url(#eyeClipR)" />
                </g>
              )}
            </g>

            {/* nose */}
            <path d="M138 118 Q136 126 140 128 Q144 126 142 118" stroke="#C99366" strokeWidth="1.6" fill="none" opacity="0.6" />

            {/* mouth */}
            {isTalking ? (
              <ellipse
                cx="140"
                cy="142"
                rx="8"
                ry="6"
                fill="#7A3B2E"
                className="animate-mouthTalk"
                style={{ transformOrigin: "140px 142px" }}
              />
            ) : isThinking ? (
              <path d="M131 142 Q140 140 150 143" stroke="#7A3B2E" strokeWidth="3" strokeLinecap="round" fill="none" />
            ) : isListening ? (
              <path d="M128 140 Q140 150 152 140" stroke="#7A3B2E" strokeWidth="3" strokeLinecap="round" fill="none" />
            ) : (
              <path d="M128 140 Q140 147 152 140" stroke="#7A3B2E" strokeWidth="3" strokeLinecap="round" fill="none" />
            )}
          </g>

          {/* ===== ARM + GESTURE ===== */}
          {isListening ? (
            // hand cupped near ear
            <g>
              <path d="M90 226 C72 218 64 198 70 178" stroke="url(#skin)" strokeWidth="16" strokeLinecap="round" fill="none" />
              <ellipse cx="74" cy="170" rx="13" ry="11" fill="url(#skin)" />
            </g>
          ) : isThinking ? (
            // hand resting thoughtfully near chin
            <g className="animate-sway" style={{ transformOrigin: "100px 200px" }}>
              <path d="M96 226 C82 214 100 196 118 158" stroke="url(#skin)" strokeWidth="15" strokeLinecap="round" fill="none" />
              <circle cx="120" cy="152" r="10" fill="url(#skin)" />
            </g>
          ) : (
            // raised hand with glowing knowledge orb (idle / talking)
            <g className={isTalking ? "" : "animate-sway"} style={{ transformOrigin: "60px 200px" }}>
              <path d="M92 230 C70 224 58 206 56 184" stroke="url(#skin)" strokeWidth="16" strokeLinecap="round" fill="none" />
              <circle cx="54" cy="176" r="11" fill="url(#skin)" />
              <circle cx="54" cy="148" r="22" fill="url(#orbGlow)" className="animate-breathe" />
              <circle cx="54" cy="148" r="9" fill={isTalking ? "#A30050" : "#80013F"} />
              {isTalking && (
                <circle cx="0" cy="0" r="3" fill="#E0C159" transform="translate(54 148)">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 0 0"
                    to="360 0 0"
                    dur="2s"
                    repeatCount="indefinite"
                    additive="sum"
                  />
                </circle>
              )}
            </g>
          )}
        </g>
      </svg>

      {/* talking waveform */}
      <div className="flex items-end gap-[3px] h-6">
        {isTalking &&
          [0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-[3px] h-full bg-wine rounded-full origin-bottom animate-talkBar"
              style={{ animationDelay: `${i * 0.09}s` }}
            />
          ))}
      </div>

      <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-paper2 border border-line">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
        <span className="font-mono text-[11px] tracking-wide text-mist uppercase">
          {STATE_LABEL[state]}
        </span>
      </div>
    </div>
  );
}
