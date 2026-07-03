"use client";

/**
 * Ready Player Me avatar creator — embedded iframe.
 * 100% FREE. No account needed. No payment. Ever.
 *
 * RPM sends a postMessage when the user finishes — we capture
 * the GLB URL, append morph-target params, and save it to
 * localStorage so it loads automatically on every future visit.
 */

import { useEffect, useRef, useState } from "react";

interface Props {
  onAvatarReady: (url: string) => void;
}

const RPM_SUBDOMAIN = "bliss-tutor"; // free subdomain — no payment required
const RPM_IFRAME_URL =
  `https://${RPM_SUBDOMAIN}.readyplayer.me/avatar` +
  `?frameApi&clearCache&bodyType=halfbody`;

function parseRpmMessage(event: MessageEvent): string | null {
  try {
    const data =
      typeof event.data === "string" ? JSON.parse(event.data) : event.data;
    if (data?.source !== "readyplayerme") return null;
    if (data?.eventName === "v1.avatar.exported") {
      return data?.data?.url as string ?? null;
    }
  } catch {}
  return null;
}

export default function AvatarCreator({ onAvatarReady }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const url = parseRpmMessage(e);
      if (!url) return;
      // Append ARKit morph targets + texture atlas so facial animation works
      const finalUrl =
        url.split("?")[0] +
        "?morphTargets=ARKit,Oculus%20Visemes&textureAtlas=1024&lod=1";
      localStorage.setItem("bliss_avatar_url", finalUrl);
      onAvatarReady(finalUrl);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onAvatarReady]);

  return (
    <div className="flex flex-col h-full bg-paper">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-line">
        <div>
          <p className="font-display text-sm font-semibold text-ink">Design your BLISS avatar</p>
          <p className="text-xs text-mist mt-0.5">Free • No account required • Takes ~2 min</p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-[10px] font-mono text-mist px-2 py-1 rounded-full border border-line">
            Powered by Ready Player Me
          </span>
        </div>
      </div>

      {/* Tip bar */}
      <div className="shrink-0 flex gap-3 items-start px-5 py-2.5 bg-wine/5 border-b border-wine/15 text-xs text-wine">
        <span className="text-base leading-none">💡</span>
        <span>
          Pick <b>Half Body</b> · dark swept hair · short beard · black crew-neck tee — to match the reference style.
          Click <b>Next</b> until you reach "Done" and your avatar loads automatically.
        </span>
      </div>

      {/* Iframe */}
      <div className="relative flex-1 min-h-0">
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
              <p className="text-xs font-mono text-mist">Loading avatar creator…</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper z-10 px-8 text-center">
            <div>
              <p className="text-sm text-ink font-medium mb-1">Couldn't load the avatar creator</p>
              <p className="text-xs text-mist mb-4">
                Check your internet connection, then try the button below.
              </p>
              <button
                onClick={() => { setError(false); setLoading(true); }}
                className="text-xs px-4 py-2 rounded-full bg-wine text-paper"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={error ? undefined : RPM_IFRAME_URL}
          className="w-full h-full border-0"
          allow="camera *; microphone *"
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
          title="Ready Player Me Avatar Creator"
        />
      </div>
    </div>
  );
}
