/**
 * BLISS Floating Widget
 * Drop this on any website with:
 *   <script src="https://YOUR-DOMAIN/widget.js"></script>
 *
 * Optional config (set before the script tag):
 *   window.BLISS_CONFIG = { url: "https://YOUR-DOMAIN", position: "bottom-right" };
 */
(function () {
  const cfg = window.BLISS_CONFIG || {};
  const BASE = cfg.url || (document.currentScript
    ? new URL(document.currentScript.src).origin
    : window.location.origin);
  const POS = cfg.position === "bottom-left" ? "left:20px" : "right:20px";

  // ── Inject styles ──
  const style = document.createElement("style");
  style.textContent = `
    #bliss-widget-btn {
      position: fixed; bottom: 22px; ${POS}; z-index: 99998;
      width: 60px; height: 60px; border-radius: 50%;
      background: linear-gradient(145deg,#A30050,#80013F,#52002A);
      box-shadow: 0 4px 20px rgba(128,1,63,0.45), 0 0 0 0 rgba(128,1,63,0.35);
      border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      animation: bliss-pulse 3s ease-in-out infinite;
    }
    #bliss-widget-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(128,1,63,0.55), 0 0 0 0 rgba(128,1,63,0.2);
    }
    #bliss-widget-btn.open { animation: none; transform: rotate(45deg) scale(1.05); }
    #bliss-widget-btn svg { transition: transform 0.25s ease; }

    #bliss-widget-bubble {
      position: fixed; bottom: 92px; ${POS}; z-index: 99997;
      background: white; border-radius: 12px; padding: 10px 14px;
      font-family: system-ui, sans-serif; font-size: 13px; font-weight: 500;
      color: #34161F; white-space: nowrap;
      box-shadow: 0 4px 20px rgba(82,0,42,0.15);
      border: 1px solid rgba(128,1,63,0.12);
      animation: bliss-bubble-in 0.4s cubic-bezier(.34,1.56,.64,1) both;
      pointer-events: none;
    }
    #bliss-widget-bubble::after {
      content: ''; position: absolute; bottom: -7px;
      ${POS === "right:20px" ? "right:20px" : "left:20px"};
      width: 14px; height: 7px;
      background: white; clip-path: polygon(0 0,100% 0,50% 100%);
    }

    #bliss-widget-panel {
      position: fixed; bottom: 92px; ${POS}; z-index: 99999;
      width: 400px; height: 700px;
      max-width: calc(100vw - 40px); max-height: calc(100vh - 110px);
      border-radius: 24px; overflow: hidden;
      box-shadow: 0 12px 48px rgba(82,0,42,0.22), 0 0 0 1px rgba(128,1,63,0.10);
      transform-origin: bottom right;
      animation: bliss-panel-in 0.3s cubic-bezier(.25,.8,.25,1) both;
      display: none;
    }
    #bliss-widget-panel.visible { display: block; }
    #bliss-widget-panel iframe { width: 100%; height: 100%; border: none; display: block; }

    @keyframes bliss-pulse {
      0%,100% { box-shadow: 0 4px 20px rgba(128,1,63,0.45),0 0 0 0 rgba(128,1,63,0.35); }
      50%      { box-shadow: 0 4px 20px rgba(128,1,63,0.45),0 0 0 10px rgba(128,1,63,0); }
    }
    @keyframes bliss-bubble-in {
      from { opacity:0; transform:translateY(8px) scale(0.92); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    @keyframes bliss-panel-in {
      from { opacity:0; transform:scale(0.9) translateY(16px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // ── "Hi!" greeting bubble ──
  const bubble = document.createElement("div");
  bubble.id = "bliss-widget-bubble";
  bubble.textContent = "Hi! I'm BLISS 👋";
  document.body.appendChild(bubble);
  setTimeout(() => { if (bubble.parentNode) bubble.parentNode.removeChild(bubble); }, 4500);

  // ── FAB button ──
  const btn = document.createElement("button");
  btn.id = "bliss-widget-btn";
  btn.setAttribute("aria-label", "Open BLISS AI Tutor");
  btn.innerHTML = `
    <svg id="bliss-icon-chat" width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" fill="rgba(255,255,255,0.95)"/>
      <circle cx="8" cy="11" r="1.2" fill="#80013F"/>
      <circle cx="12" cy="11" r="1.2" fill="#80013F"/>
      <circle cx="16" cy="11" r="1.2" fill="#80013F"/>
    </svg>
    <svg id="bliss-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" style="display:none">
      <path d="M18 6L6 18M6 6l12 12" stroke="rgba(255,255,255,0.95)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`;
  document.body.appendChild(btn);

  // ── Panel (iframe) ──
  const panel = document.createElement("div");
  panel.id = "bliss-widget-panel";
  const iframe = document.createElement("iframe");
  iframe.src = BASE;
  iframe.title = "BLISS AI Tutor";
  iframe.allow = "microphone";
  panel.appendChild(iframe);
  document.body.appendChild(panel);

  // ── Toggle logic ──
  let open = false;
  btn.addEventListener("click", function () {
    open = !open;
    panel.classList.toggle("visible", open);
    btn.classList.toggle("open", open);
    document.getElementById("bliss-icon-chat").style.display = open ? "none" : "block";
    document.getElementById("bliss-icon-close").style.display = open ? "block" : "none";
    btn.setAttribute("aria-label", open ? "Close BLISS" : "Open BLISS AI Tutor");
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && open) btn.click();
  });
})();
