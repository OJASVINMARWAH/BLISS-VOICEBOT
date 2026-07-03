"use client";

import { useEffect, useRef } from "react";
import type { AvatarState } from "./Avatar";
import SiriOrb from "./SiriOrb";

const STATE_LABEL: Record<AvatarState, string> = {
  idle: "Idle", listening: "Listening…", thinking: "Thinking…", talking: "Speaking",
};
const ACCENT: Record<AvatarState, string> = {
  idle:"#80013F", listening:"#6878A0", thinking:"#C9A227", talking:"#7030C0",
};

interface Props {
  state: AvatarState;
  quizResult?: { type: "correct" | "wrong"; tick: number } | null;
}

export default function RobotAvatar({ state, quizResult }: Props) {
  const iframeRef  = useRef<HTMLIFrameElement>(null);
  const readyRef   = useRef(false);
  const stateRef   = useRef(state);
  stateRef.current = state;

  // Track last sent state to avoid redundant sends
  const lastSentState = useRef<AvatarState | null>(null);

  function send(msg: object) {
    try { iframeRef.current?.contentWindow?.postMessage(msg, "*"); } catch {}
  }

  /* ── Apply a state to robot — single source of truth ── */
  function applyState(s: AvatarState) {
    if (s === "talking") {
      // Speaking: clear any gesture first, then activate
      send({ type: "bliss:speaking", value: true });
      send({ type: "bliss:volume",   value: 0.75 });
    } else {
      send({ type: "bliss:speaking", value: false });
      send({ type: "bliss:volume",   value: 0 });
      if (s === "thinking") {
        // Small delay so setSpeaking(false) is processed first
        setTimeout(() => send({ type: "bliss:thinking" }), 80);
      }
    }
    lastSentState.current = s;
  }

  /* ── Wait for robot bliss:ready, then send current state ── */
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data?.type === "bliss:ready") {
        readyRef.current = true;
        applyState(stateRef.current);
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  /* ── Real-time volume from ChatPanel audio analyser ── */
  useEffect(() => {
    function onVol(e: Event) {
      send({ type: "bliss:volume", value: Math.min((e as CustomEvent<number>).detail, 1) });
    }
    window.addEventListener("bliss:volume", onVol);
    return () => window.removeEventListener("bliss:volume", onVol);
  }, []);

  /* ── State changes → robot (only send when actually changed) ── */
  useEffect(() => {
    if (!readyRef.current) return;   // robot not ready yet; will be applied on bliss:ready
    if (lastSentState.current === state) return; // no change
    applyState(state);
  }, [state]);

  /* ── Quiz result → robot celebration/sarcasm ── */
  useEffect(() => {
    if (!quizResult) return;
    const msgType = quizResult.type === "correct" ? "bliss:quiz-correct" : "bliss:quiz-wrong";
    // Retry a few times in case the iframe was still loading
    const attempts = [0, 150, 400];
    attempts.forEach(delay => {
      setTimeout(() => send({ type: msgType }), delay);
    });
  }, [quizResult?.tick]); // only tick as dep — fires every new answer even if same type

  const accent    = ACCENT[state];
  const isTalking = state === "talking";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      {/* Siri orb — no overflow:hidden on parent so glow shadow isn't cut */}
      <SiriOrb state={state} size={220}>
        <iframe
          ref={iframeRef}
          src="/robot.html"
          title="BLISS Robot Avatar"
          scrolling="no"
          style={{ width: "100%", height: "100%", border: "none", background: "transparent", display: "block", borderRadius: "50%" }}
          allow="microphone"
        />
      </SiriOrb>

      {/* State badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "3px 12px", borderRadius: 20,
        background: "linear-gradient(135deg,rgba(255,255,255,0.88),rgba(242,232,213,0.92))",
        border: "1px solid rgba(128,1,63,0.13)",
        boxShadow: "0 1px 6px rgba(128,1,63,0.08)",
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: "50%",
          background: accent, boxShadow: `0 0 6px ${accent}`,
          display: "inline-block",
          transition: "all 0.4s ease",
          animation: isTalking ? "blissDotPulse 0.8s ease-in-out infinite" : "none",
        }}/>
        <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8F7E72" }}>
          {STATE_LABEL[state]}
        </span>
      </div>
      <style>{`
        @keyframes blissDotPulse {
          0%,100% { transform:scale(1); opacity:1; }
          50%      { transform:scale(1.5); opacity:0.7; }
        }
      `}</style>
    </div>
  );
}
