"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { AvatarState } from "./Avatar";

type Msg = { role: "user" | "assistant"; content: string; ts: string; partial?: boolean };

// Seed pills shown before the user has sent anything
const SEED_SUGGESTIONS = [
  "What is Artificial Intelligence?",
  "How does AI learn from data?",
  "Give me a real-world AI example",
];

// Generate 3 follow-up suggestions from the last assistant reply
async function fetchSuggestions(lastReply: string): Promise<string[]> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `Given this AI tutor reply: "${lastReply.slice(0, 300)}"
Return exactly 3 short follow-up questions a student might ask next.
Rules: plain text only, no numbers/bullets, each under 8 words, newline-separated, nothing else.`,
          },
        ],
      }),
    });
    const data = await res.json();
    const lines = (data.reply as string)
      .split("\n")
      .map((l: string) => l.trim().replace(/^[\d\-\.\*]+\s*/, ""))
      .filter((l: string) => l.length > 3 && l.length < 80)
      .slice(0, 3);
    return lines.length === 3 ? lines : SEED_SUGGESTIONS;
  } catch {
    return SEED_SUGGESTIONS;
  }
}

const SESSION_KEY = "bliss_chat_v1";

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ── Chat wallpaper ── */
function ChatWallpaper() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="wallBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FAF3E6" /><stop offset="55%" stopColor="#F5ECD8" /><stop offset="100%" stopColor="#EFE3CC" />
        </linearGradient>
        <radialGradient id="glowTL" cx="0%" cy="0%" r="70%">
          <stop offset="0%" stopColor="#80013F" stopOpacity="0.055" /><stop offset="100%" stopColor="#80013F" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowBR" cx="100%" cy="100%" r="65%">
          <stop offset="0%" stopColor="#C9A227" stopOpacity="0.06" /><stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
        </radialGradient>
        <pattern id="dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="11" cy="11" r="1.1" fill="#80013F" opacity="0.09" />
        </pattern>
        <pattern id="diag" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M0 32 L32 0" stroke="#80013F" strokeWidth="0.5" opacity="0.045" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wallBg)" />
      <rect width="100%" height="100%" fill="url(#diag)" />
      <rect width="100%" height="100%" fill="url(#dots)" />
      <rect width="100%" height="100%" fill="url(#glowTL)" />
      <rect width="100%" height="100%" fill="url(#glowBR)" />
      <circle cx="-40" cy="-40" r="210" fill="none" stroke="#80013F" strokeWidth="1" opacity="0.045" />
      <circle cx="-40" cy="-40" r="290" fill="none" stroke="#80013F" strokeWidth="0.7" opacity="0.03" />
      <circle cx="110%" cy="110%" r="240" fill="none" stroke="#C9A227" strokeWidth="1" opacity="0.04" />
      {[44,140,82,200,30,170,120,60].map((x,i)=>(<rect key={i} x={i%2===0?x:x+20} y={[56,22,148,88,200,170,300,340][i]} width="5" height="5" rx="1" transform={`rotate(45 ${(i%2===0?x:x+20)+2.5} ${[56,22,148,88,200,170,300,340][i]+2.5})`} fill="#80013F" opacity="0.055"/>))}
    </svg>
  );
}

/* ── Copy button ── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); }} title="Copy"
      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 w-6 h-6 rounded-md flex items-center justify-center"
      style={{ background: "rgba(128,1,63,0.08)", border: "1px solid rgba(128,1,63,0.15)" }}>
      {copied
        ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#80013F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        : <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="#80013F" strokeWidth="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="#80013F" strokeWidth="2"/></svg>
      }
    </button>
  );
}

/* ── Message bubble ── */
function Bubble({ msg, prev }: { msg: Msg; prev?: Msg }) {
  const isUser  = msg.role === "user";
  const isFirst = !prev || prev.role !== msg.role;
  return (
    <div className={`flex items-end gap-2 animate-slideUp ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold mb-0.5 transition-opacity ${isFirst ? "opacity-100" : "opacity-0"}`}
        style={{ background: isUser ? "linear-gradient(135deg,#A30050,#80013F)" : "linear-gradient(135deg,#E8DCC6,#D4C6AC)", color: isUser ? "#FAF3E6" : "#52002A" }}>
        {isUser ? "U" : "B"}
      </div>
      <div className={`group flex items-end gap-1.5 max-w-[82%] ${isUser ? "flex-row-reverse" : ""}`}>
        <div style={isUser ? {
            background: "linear-gradient(135deg,#A30050 0%,#80013F 55%,#5C002A 100%)",
            boxShadow: "0 4px 18px rgba(128,1,63,0.28),0 1px 4px rgba(128,1,63,0.18)",
            color: "#FAF3E6", borderRadius: "18px 18px 4px 18px",
          } : {
            background: "linear-gradient(135deg,#FFFFFF 0%,#FAF3E6 60%,#F2E8D5 100%)",
            boxShadow: "0 2px 12px rgba(82,0,42,0.08),0 1px 3px rgba(82,0,42,0.06)",
            color: "#34161F", border: "1px solid rgba(128,1,63,0.10)", borderRadius: "18px 18px 18px 4px",
          }} className="px-4 py-2.5 text-sm leading-relaxed">
          {msg.content}
          {msg.partial && <span className="inline-block w-0.5 h-3.5 ml-0.5 align-middle rounded-full bg-wine/60 animate-pulse"/>}
        </div>
        {!isUser && !msg.partial && <CopyBtn text={msg.content}/>}
      </div>
    </div>
  );
}

/* ── Typing dots ── */
function TypingDots() {
  return (
    <div className="flex items-end gap-2 animate-slideUp">
      <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
        style={{ background: "linear-gradient(135deg,#E8DCC6,#D4C6AC)", color: "#52002A" }}>B</div>
      <div style={{ background: "linear-gradient(135deg,#FFFFFF,#FAF3E6,#F2E8D5)", boxShadow: "0 2px 12px rgba(82,0,42,.08)", border: "1px solid rgba(128,1,63,.10)", borderRadius: "18px 18px 18px 4px" }}
        className="px-4 py-3 flex gap-1.5 items-center">
        {[0,0.18,0.36].map((d,i)=>(
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-wine/40 animate-dotBounce" style={{animationDelay:`${d}s`}}/>
        ))}
      </div>
    </div>
  );
}

export default function ChatPanel({
  onStateChange, voiceOn,
}: {
  onStateChange: (s: AvatarState) => void;
  voiceOn: boolean;
}) {
  const INIT: Msg[] = [{ role: "assistant", content: "Hey, I'm BLISS! Ask me anything about your course — type it or just hit the mic. I'll keep it quick and clear. ✦", ts: timestamp() }];

  const [messages, setMessages]   = useState<Msg[]>(INIT);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [listening, setListening] = useState(false);
  const [ttsWarning, setTtsWarning] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(SEED_SUGGESTIONS);

  const scrollRef      = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef       = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef    = useRef<AudioContext | null>(null);
  const audioRafRef    = useRef<number>(0);
  const typeRafRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voiceOnRef     = useRef(voiceOn);
  // BUG FIX 1+3: track whether a response is already in flight so a 2nd submit is ignored
  const busyRef        = useRef(false);
  voiceOnRef.current   = voiceOn;

  /* ── STOP everything currently playing/typing ── */
  const stopCurrent = useCallback(() => {
    // Kill typewriter
    if (typeRafRef.current) { clearTimeout(typeRafRef.current); typeRafRef.current = null; }
    // Kill audio playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current = null;
    }
    // Kill Web Audio analyser RAF
    cancelAnimationFrame(audioRafRef.current);
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    // Kill browser speech
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    // Seal any partial bubble
    setMessages(msgs => msgs.map(m => m.partial ? { ...m, partial: false } : m));
    onStateChange("idle");
    busyRef.current = false;
  }, [onStateChange]);

  /* ── Session persistence ── */
  useEffect(() => {
    try { const s = sessionStorage.getItem(SESSION_KEY); if (s) { const p = JSON.parse(s); if (p?.length) setMessages(p.map((m: Msg) => ({ ...m, partial: false }))); } } catch {}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  /* ── Auto-scroll ── */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  /* ── Speech recognition setup ── */
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false; rec.interimResults = false; rec.lang = "en-IN";
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setInput(t);
      setListening(false);          // stop listening state before send
      sendMessage(t);
    };
    rec.onend  = () => { setListening(false); if (!busyRef.current) onStateChange("idle"); };
    rec.onerror = () => { setListening(false); if (!busyRef.current) onStateChange("idle"); };
    recognitionRef.current = rec;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* BUG FIX 4: proper mic toggle — uses a dedicated listeningRef so closure captures fresh value */
  const listeningRef = useRef(false);
  listeningRef.current = listening;

  function toggleMic() {
    if (!recognitionRef.current) { setTtsWarning("Voice input unsupported — try Chrome."); return; }
    if (listeningRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      if (!busyRef.current) onStateChange("idle");
    } else {
      // Stop any ongoing response before listening
      stopCurrent();
      setInput("");
      try { recognitionRef.current.start(); } catch {}
      setListening(true);
      onStateChange("listening");
    }
  }

  /* ── Typewriter — speed adapts to audio duration ── */
  const typewrite = useCallback((fullText: string, insertIdx: number, durationMs: number) => {
    const perChar = Math.max(12, Math.min(40, durationMs / Math.max(fullText.length, 1)));
    let i = 0;
    const step = () => {
      i++;
      setMessages(msgs => msgs.map((m, idx) =>
        idx === insertIdx ? { ...m, content: fullText.slice(0, i), partial: i < fullText.length } : m
      ));
      if (i < fullText.length) typeRafRef.current = setTimeout(step, perChar);
    };
    typeRafRef.current = setTimeout(step, perChar);
  }, []);

  /* ── TTS — returns audio element pre-loaded, ready to .play() instantly ── */
  async function prepareAudio(text: string): Promise<HTMLAudioElement | null> {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!data.audio) throw new Error(data.error || "No audio");
      setTtsWarning("");
      const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
      // Pre-load so duration is available immediately on play
      await new Promise<void>((res, rej) => {
        audio.oncanplaythrough = () => res();
        audio.onerror = () => rej(new Error("Audio decode failed"));
        audio.load();
        setTimeout(res, 3000); // fallback: don't wait forever
      });
      return audio;
    } catch (err: any) {
      const short = (err?.message ?? "TTS error").toString().slice(0, 120);
      setTtsWarning(`Using browser voice. (${short})`);
      return null;
    }
  }

  /* ── Send — BUG FIX 1: if already busy, abort new request ── */
  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content) return;

    // BUG FIX 1: hard-stop any existing in-progress response before starting a new one
    stopCurrent();

    const next: Msg[] = [...messages, { role: "user", content, ts: timestamp() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    busyRef.current = true;
    onStateChange("thinking");

    try {
      // Run TTS fetch and LLM fetch in parallel
      const [chatRes, ] = await Promise.all([
        fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
        }),
        // Small warmup delay so avatar is settled in "thinking" state
        new Promise(r => setTimeout(r, 100)),
      ]);

      const chatData = await chatRes.json();
      if (chatData.error) throw new Error(chatData.error);
      const reply = chatData.reply as string;

      // Prepare audio while we set up the bubble (saves ~200ms)
      const insertIdx = next.length;
      setMessages(m => [...m, { role: "assistant", content: "", ts: timestamp(), partial: true }]);
      setLoading(false);

      // Refresh suggestions in background based on the new reply
      fetchSuggestions(reply).then(setSuggestions).catch(() => {});

      let audioDurationMs = reply.length * 55; // fallback estimate: ~55ms per char

      if (voiceOnRef.current) {
        const audio = await prepareAudio(reply);
        if (!busyRef.current) return; // cancelled while fetching TTS

        if (audio) {
          audioRef.current = audio;
          const knownDuration = Number.isFinite(audio.duration) && audio.duration > 0;
          if (knownDuration) audioDurationMs = audio.duration * 1000;

          // Wire up analyser for robot lip-sync
          try {
            const ctx = new AudioContext();
            audioCtxRef.current = ctx;
            const src = ctx.createMediaElementSource(audio);
            const an = ctx.createAnalyser(); an.fftSize = 256;
            src.connect(an); an.connect(ctx.destination);
            const buf = new Uint8Array(an.frequencyBinCount);
            const tick = () => {
              an.getByteFrequencyData(buf);
              const avg = buf.reduce((s: number, v: number) => s + v, 0) / buf.length / 255;
              window.dispatchEvent(new CustomEvent("bliss:volume", { detail: avg * 3 }));
              audioRafRef.current = requestAnimationFrame(tick);
            };
            audioRafRef.current = requestAnimationFrame(tick);
          } catch {}

          audio.onended = () => {
            cancelAnimationFrame(audioRafRef.current);
            audioCtxRef.current?.close().catch(() => {});
            audioCtxRef.current = null;
            busyRef.current = false;
            onStateChange("idle");
          };

          // BUG FIX: start typewriter AND audio simultaneously
          onStateChange("talking");
          typewrite(reply, insertIdx, audioDurationMs);
          await audio.play().catch(() => {});
        } else {
          // Browser speech fallback
          onStateChange("talking");
          typewrite(reply, insertIdx, audioDurationMs);
          if ("speechSynthesis" in window) {
            const utter = new SpeechSynthesisUtterance(reply);
            utter.rate = 1.05; utter.pitch = 1.15;
            utter.onend = () => { busyRef.current = false; onStateChange("idle"); };
            window.speechSynthesis.speak(utter);
          } else {
            busyRef.current = false;
            onStateChange("idle");
          }
        }
      } else {
        // Voice off — just typewrite at comfortable reading pace
        onStateChange("talking");
        typewrite(reply, insertIdx, reply.length * 30);
        setTimeout(() => { busyRef.current = false; onStateChange("idle"); }, reply.length * 30 + 200);
      }

    } catch (e: any) {
      setLoading(false);
      busyRef.current = false;
      onStateChange("idle");
      setMessages(m => [...m, { role: "assistant", content: `Sorry, something went wrong — ${e.message ?? "please try again."}`, ts: timestamp() }]);
    }
  }

  function clearChat() {
    stopCurrent();
    setMessages(INIT);
    setSuggestions(SEED_SUGGESTIONS);
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  }

  return (
    <div className="flex flex-col h-full min-h-0 relative">
      <div className="absolute inset-0 overflow-hidden"><ChatWallpaper /></div>

      {/* Hidden clear trigger */}
      <button data-clear-chat onClick={clearChat} className="hidden" aria-hidden="true"/>

      {/* Messages */}
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto px-4 pt-5 pb-3 space-y-2.5">
        {messages.map((m, i) => <Bubble key={i} msg={m} prev={messages[i - 1]} />)}
        {loading && <TypingDots />}
        {ttsWarning && <p className="text-[10px] text-gold/80 text-center font-mono px-4 py-1 animate-fadeIn">{ttsWarning}</p>}
      </div>

      {/* Suggestion pills — context-aware, refresh after each reply */}
      <div className="relative px-4 pb-2.5 flex flex-wrap gap-1.5">
        {suggestions.map((s, i) => (
          <button key={`${s}-${i}`} onClick={() => sendMessage(s)} disabled={loading}
            style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.85),rgba(242,232,213,0.9))", boxShadow: "0 1px 6px rgba(128,1,63,0.08)", border: "1px solid rgba(128,1,63,0.14)", backdropFilter: "blur(6px)", animationDelay: `${i * 0.08}s` }}
            className="text-[11px] px-3 py-1.5 rounded-full text-wine/80 hover:text-wine hover:border-wine/30 transition-all disabled:opacity-40 animate-slideUp">
            {s}
          </button>
        ))}
      </div>

      {/* Composer */}
      <div className="relative px-4 pb-5">
        <div style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.92),rgba(250,243,230,0.96))", boxShadow: "0 4px 24px rgba(128,1,63,0.12),0 1px 4px rgba(128,1,63,0.08),inset 0 1px 0 rgba(255,255,255,0.8)", border: "1px solid rgba(128,1,63,0.14)", backdropFilter: "blur(12px)" }}
          className="flex items-center gap-2 rounded-2xl pl-1.5 pr-1.5 py-1.5">
          <button onClick={toggleMic} aria-pressed={listening} aria-label={listening ? "Stop listening" : "Start voice input"}
            style={listening
              ? { background: "linear-gradient(135deg,#E0A820,#C9A227)", boxShadow: "0 2px 10px rgba(201,162,39,0.45)" }
              : { background: "linear-gradient(135deg,#2D9A5A,#1E7A42)", boxShadow: "0 2px 10px rgba(45,154,90,0.35)" }}
            className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${listening ? "animate-pulse" : ""}`}>
            {listening
              ? /* square STOP icon when active */
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
              : /* mic icon when idle */
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z" stroke="#fff" strokeWidth="2.2"/><path d="M19 11a7 7 0 0 1-14 0M12 18v3" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
            }
          </button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder={listening ? "Listening… tap ■ to stop" : "Ask anything from Bliss"}
            className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-mist/70 font-body"/>
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} aria-label="Send"
            style={(!input.trim() || loading)
              ? { background: "linear-gradient(135deg,#D4C6AC,#C4B499)" }
              : { background: "linear-gradient(135deg,#A30050,#80013F,#5C002A)", boxShadow: "0 2px 12px rgba(128,1,63,0.45)" }}
            className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 11l18-7-7 18-3-7-8-4Z" stroke="#FAF3E6" strokeWidth="2.2" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
