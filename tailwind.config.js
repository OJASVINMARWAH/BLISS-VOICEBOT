/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF3E6",
        paper: "#FFFFFF",
        paper2: "#FCF7EC",
        line: "#E8DCC6",
        wine: "#80013F",
        wine2: "#A30050",
        wineDeep: "#52002A",
        ink: "#34161F",
        gold: "#C9A227",
        gold2: "#E0C159",
        mist: "#8F7E72",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(128, 1, 63, 0.18)",
        glowSm: "0 0 18px rgba(128, 1, 63, 0.22)",
        card: "0 2px 4px rgba(82, 0, 42, 0.04), 0 12px 40px rgba(82, 0, 42, 0.10), 0 0 0 1px rgba(128,1,63,0.06)",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.75" },
          "50%": { transform: "scale(1.14)", opacity: "1" },
        },
        spinSlow: { to: { transform: "rotate(360deg)" } },
        pulseRing: {
          "0%": { transform: "scale(0.85)", opacity: "0.7" },
          "100%": { transform: "scale(2.1)", opacity: "0" },
        },
        rise: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        talkBar: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-5px) rotate(0.6deg)" },
        },
        bobTalk: {
          "0%, 100%": { transform: "translateY(0) rotate(-0.5deg)" },
          "25%": { transform: "translateY(-3px) rotate(0.5deg)" },
          "50%": { transform: "translateY(-6px) rotate(-0.3deg)" },
          "75%": { transform: "translateY(-2px) rotate(0.6deg)" },
        },
        leanIn: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-3px) scale(1.015)" },
        },
        blink: {
          "0%, 90%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(0.08)" },
        },
        mouthTalk: {
          "0%, 100%": { transform: "scaleY(0.35) scaleX(1)" },
          "25%": { transform: "scaleY(1.05) scaleX(0.92)" },
          "50%": { transform: "scaleY(0.55) scaleX(1.05)" },
          "75%": { transform: "scaleY(0.9) scaleX(0.96)" },
        },
        nod: {
          "0%, 100%": { transform: "rotate(-3deg) translateY(0)" },
          "50%": { transform: "rotate(2deg) translateY(2px)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        sparkle: {
          "0%, 100%": { transform: "translateY(0) scale(1)", opacity: "0.4" },
          "50%": { transform: "translateY(-10px) scale(1.3)", opacity: "1" },
        },
        browFurrow: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(2px) rotate(-3deg)" },
        },
        browRaise: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2.5px)" },
        },
        leafSway: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
        soundWave: {
          "0%": { transform: "scale(0.6)", opacity: "0.9" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(14px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        dotBounce: {
          "0%, 80%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "40%": { transform: "translateY(-6px)", opacity: "1" },
        },
      },
      animation: {
        breathe: "breathe 3.2s ease-in-out infinite",
        spinSlow: "spinSlow 6s linear infinite",
        pulseRing: "pulseRing 2.2s ease-out infinite",
        rise: "rise 0.35s ease-out both",
        talkBar: "talkBar 0.5s ease-in-out infinite",
        bob: "bob 3.6s ease-in-out infinite",
        bobTalk: "bobTalk 1.1s ease-in-out infinite",
        leanIn: "leanIn 1.8s ease-in-out infinite",
        blink: "blink 4.2s ease-in-out infinite",
        mouthTalk: "mouthTalk 0.42s ease-in-out infinite",
        nod: "nod 1.4s ease-in-out infinite",
        sway: "sway 3s ease-in-out infinite",
        sparkle: "sparkle 1.6s ease-in-out infinite",
        browFurrow: "browFurrow 1.8s ease-in-out infinite",
        browRaise: "browRaise 2.2s ease-in-out infinite",
        leafSway: "leafSway 4s ease-in-out infinite",
        soundWave: "soundWave 1.6s ease-out infinite",
        slideUp: "slideUp 0.3s cubic-bezier(.25,.8,.25,1) both",
        dotBounce: "dotBounce 1.2s ease-in-out infinite",
        fadeIn: "fadeIn 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};
