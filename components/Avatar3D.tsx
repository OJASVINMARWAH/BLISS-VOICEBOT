"use client";

import Character from "./avatar3d/Character";
import type { AvatarState } from "./Avatar";

const STATE_LABEL: Record<AvatarState, string> = {
  idle: "Idle",
  listening: "Listening…",
  thinking: "Thinking…",
  talking: "Speaking",
};

export default function Avatar3D({
  state,
  framing = "full",
}: {
  state: AvatarState;
  framing?: "full" | "bust";
}) {
  const accent = state === "thinking" ? "#C9A227" : "#80013F";

  if (framing === "bust") {
    return (
      <div className="w-full h-full">
        <Character state={state} />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="pointer-events-none absolute -inset-x-8 top-0 bottom-10 rounded-[3rem] blur-3xl bg-wine/[0.06]" />
      <div className="relative w-[270px] sm:w-[290px] h-[300px] sm:h-[310px]">
        <Character state={state} />
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
