"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { AvatarState } from "@/components/Avatar";
import ChatPanel from "@/components/ChatPanel";
import QuizPanel from "@/components/QuizPanel";
import HolographicBg from "@/components/HolographicBg";

// Robot uses Three.js + browser APIs — client-only
const RobotAvatar = dynamic(() => import("@/components/RobotAvatar"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <span className="font-mono text-[11px] text-mist animate-pulse">Initialising avatar…</span>
    </div>
  ),
});

export default function Home() {
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [mode, setMode] = useState<"chat" | "quiz">("chat");
  const [voiceOn, setVoiceOn] = useState(true);
  const [quizResult, setQuizResult] = useState<{ type: "correct" | "wrong"; tick: number } | null>(null);

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-6 sm:py-10">
      <div
        className="w-full max-w-md flex flex-col rounded-[2.5rem] shadow-card"
        style={{
          height: "92vh",
          maxHeight: "860px",
          background: "linear-gradient(180deg,#FEFAF3 0%,#FAF3E6 100%)",
          border: "1px solid rgba(128,1,63,0.10)",
        }}
      >

        {/* ══════════ HEADER ══════════ */}
        <div className="shrink-0 relative overflow-hidden" style={{ minHeight: 72, borderRadius: "2.5rem 2.5rem 0 0" }}>
          {/* Deep wine gradient fill */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg,#52002A 0%,#80013F 40%,#6B0034 70%,#3D001E 100%)",
          }}/>
          {/* Noise texture overlay */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
            opacity: 0.5,
          }}/>
          {/* Gold shimmer sweep */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(105deg, transparent 30%, rgba(201,162,39,0.14) 50%, transparent 70%)",
            animation: "gradientShift 4s ease-in-out infinite",
            backgroundSize: "200% 100%",
          }}/>
          {/* Decorative arcs */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} aria-hidden="true">
            <circle cx="380" cy="36" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>
            <circle cx="380" cy="36" r="52" fill="none" stroke="rgba(201,162,39,0.12)" strokeWidth="1"/>
            <circle cx="-20" cy="36" r="60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5"/>
            {/* Dot nodes */}
            {[[320,14],[348,50],[360,26],[18,22],[6,52]].map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r="2" fill="rgba(201,162,39,0.55)"/>
            ))}
          </svg>
          {/* Bottom border line — gold */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "1.5px",
            background: "linear-gradient(90deg,transparent,rgba(201,162,39,0.50),rgba(201,162,39,0.70),rgba(201,162,39,0.50),transparent)",
          }}/>

          {/* Content */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
            {/* Left — brand */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Logo glow mark */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 42, height: 42,
                  background: "linear-gradient(145deg,rgba(255,255,255,0.18) 0%,rgba(255,255,255,0.06) 100%)",
                  border: "1.5px solid rgba(201,162,39,0.55)",
                  borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 16px rgba(201,162,39,0.25), inset 0 1px 0 rgba(255,255,255,0.20)",
                  backdropFilter: "blur(8px)",
                }}>
                  <span style={{
                    fontSize: 20, fontWeight: 900, lineHeight: 1,
                    color: "#FAF3E6",
                    letterSpacing: "-0.04em",
                    textShadow: "0 0 12px rgba(201,162,39,0.6), 0 2px 4px rgba(0,0,0,0.4)",
                  }}>B</span>
                </div>
                {/* Live dot */}
                <span style={{
                  position: "absolute", top: -3, right: -3,
                  width: 11, height: 11,
                  background: "#22C55E",
                  borderRadius: "50%",
                  border: "2px solid #80013F",
                  boxShadow: "0 0 8px rgba(34,197,94,0.8)",
                  animation: "blissLivePulse 2s ease-in-out infinite",
                }}/>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{
                    fontSize: 18, fontWeight: 800, lineHeight: 1,
                    color: "#FAF3E6",
                    letterSpacing: "-0.04em",
                    textShadow: "0 1px 8px rgba(0,0,0,0.4)",
                  }}>BLISS</span>
                  <span style={{
                    fontSize: 9, fontWeight: 600,
                    color: "#E0C159",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    background: "rgba(201,162,39,0.18)",
                    border: "1px solid rgba(201,162,39,0.35)",
                    borderRadius: 4,
                    padding: "1px 5px",
                  }}>AI</span>
                </div>
                <p style={{
                  fontSize: 9, fontFamily: "monospace",
                  color: "rgba(250,243,230,0.55)",
                  letterSpacing: "0.06em",
                  marginTop: 3,
                  textTransform: "uppercase" as const,
                }}>CoE DSai · TIET-UQ</p>
              </div>
            </div>

            {/* Right — controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* Clear */}
              <button title="Clear chat"
                onClick={() => { document.querySelector<HTMLElement>("[data-clear-chat]")?.click(); }}
                style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)", color: "rgba(250,243,230,0.65)", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {/* Voice */}
              <button onClick={() => setVoiceOn(v => !v)} aria-pressed={voiceOn}
                style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s",
                  background: voiceOn ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.08)",
                  border: voiceOn ? "1px solid rgba(34,197,94,0.50)" : "1px solid rgba(255,255,255,0.16)",
                  color: voiceOn ? "#86EFAC" : "rgba(250,243,230,0.55)",
                }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M4 9v6h4l5 5V4L8 9H4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  {voiceOn && <path d="M17 9a4 4 0 0 1 0 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>}
                  {!voiceOn && <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>}
                </svg>
              </button>
              {/* Quiz */}
              <button onClick={() => setMode(m => m === "quiz" ? "chat" : "quiz")}
                style={{ padding: "5px 13px", borderRadius: 20, fontSize: 10, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.10em", cursor: "pointer", transition: "all 0.2s",
                  ...(mode === "quiz"
                    ? { background: "linear-gradient(135deg,#E0C159,#C9A227)", color: "#52002A", border: "none", boxShadow: "0 2px 10px rgba(201,162,39,0.45)" }
                    : { background: "rgba(255,255,255,0.10)", border: "1px solid rgba(201,162,39,0.45)", color: "#E0C159" }
                  ),
                }}>
                {mode === "quiz" ? "← CHAT" : "✦ QUIZ"}
              </button>
            </div>
          </div>

          <style>{`
            @keyframes blissLivePulse {
              0%,100% { box-shadow:0 0 8px rgba(34,197,94,0.8); }
              50%      { box-shadow:0 0 14px rgba(34,197,94,1),0 0 0 4px rgba(34,197,94,0.15); }
            }
          `}</style>
        </div>

        {/* ── AVATAR STAGE — light parchment with soft holographic glow ── */}
        <div
          className="shrink-0 relative mx-3 rounded-3xl"
          style={{
            height: "248px",
            background: "radial-gradient(ellipse 90% 80% at 50% 40%, #FAF3E6 0%, #F0E4CC 55%, #E8D8BE 100%)",
            border: "1px solid rgba(128,1,63,0.12)",
            boxShadow: "inset 0 -1px 12px rgba(128,1,63,0.05)",
          }}
        >
          {/* Layer 0 — fluid holographic blobs behind everything */}
          <HolographicBg state={avatarState} />

          {/* Layer 1 — very soft centre-to-edge vignette, cream-toned */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
              background: "radial-gradient(ellipse 70% 70% at 50% 48%, transparent 30%, rgba(240,228,204,0.45) 100%)",
            }}
          />

          {/* Layer 2 — bottom blend into card body */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "48px",
              zIndex: 2, pointerEvents: "none",
              background: "linear-gradient(to bottom, transparent, rgba(240,228,204,0.60))",
            }}
          />

          {/* Layer 3 — Robot avatar iframe on top of everything */}
          <div
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              paddingBottom: "8px",
              zIndex: 3,
            }}
          >
            <RobotAvatar state={avatarState} quizResult={quizResult} />
          </div>
        </div>

        {/* ── CHAT / QUIZ PANEL ── */}
        <div className="flex-1 min-h-0 mt-1" style={{ borderRadius: "0 0 2.5rem 2.5rem", overflow: "hidden" }}>
          {mode === "chat" ? (
            <ChatPanel onStateChange={setAvatarState} voiceOn={voiceOn} />
          ) : (
            <QuizPanel onResult={(r) => {
                setQuizResult({ type: r, tick: Date.now() });
                setTimeout(() => setQuizResult(null), 3500);
              }} />
          )}
        </div>
      </div>

      <p className="text-center text-[11px] font-mono text-mist mt-4 opacity-70">
        Prepared for CoE DSai TIET-UQ
      </p>
    </main>
  );
}
