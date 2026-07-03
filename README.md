# BLISS — Voice-Enabled AI Tutor & Quiz Assistant

A mini Next.js implementation of the BLISS PRD: a course-aware tutor you can talk to, with an animated avatar and on-the-fly quiz generation. Built to be light — no database, no auth, two free-tier APIs.

## Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind |
| LLM (chat + quiz) | Groq — `llama-3.3-70b-versatile` |
| Speech-to-text | Browser Web Speech API (free, no key) |
| Text-to-speech | Sarvam AI TTS, `bulbul:v3` with the `tarun` voice — a young, energetic Indian-accented voice that fits BLISS's teen-tutor persona — with automatic fallback to the browser's built-in speech synthesis if the key is missing or the request fails |
| Avatar | A real 3D character built with Three.js / React Three Fiber — procedural geometry, PBR materials (clearcoat skin, glass lenses, emissive orb), three-point studio lighting, contact shadow, and smooth state-interpolated animation across idle / listening / thinking / talking. No external 3D model downloads. |

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```
GROQ_API_KEY=...      # free at https://console.groq.com/keys
SARVAM_API_KEY=...    # free tier at https://dashboard.sarvam.ai
```

If you skip `SARVAM_API_KEY`, voice output still works — it just falls back to the browser's own speech synthesis instead of Sarvam.

```bash
npm run dev
```

Open http://localhost:3000. Voice input needs a Chromium-based browser (Web Speech API support).

## Grounding the tutor in your own course

Edit `lib/course_context.txt` — that's the single source the chat and quiz generator are grounded in (this mirrors the PRD's `course_context.txt` requirement). Swap in your own notes, and BLISS's explanations and quiz questions will follow.

## What's implemented (MVP scope from the PRD)

- Chat interface (text input)
- Voice input (Web Speech API → text → backend)
- Voice output (Sarvam TTS → audio playback, with browser-TTS fallback)
- Groq integration with conversation history sent each turn
- Context-aware tutoring grounded in `course_context.txt`
- Quiz generation (configurable question count, mixed difficulty, MCQ with explanations)
- Animated avatar with idle / thinking / talking states synced to the conversation

## What's intentionally left out (per "mini project" scope)

- Auth, persistence/database, multi-language voice, analytics dashboard, scenario-based question types — these are flagged as "Future" / "Nice to have" in the PRD and can be layered on later without restructuring what's here.

## Folder map

```
app/
  api/chat/route.ts    Groq chat completion, grounded in course context
  api/quiz/route.ts    Groq quiz generation (JSON mode)
  api/tts/route.ts     Sarvam AI text-to-speech
  page.tsx             Main UI (avatar + chat/quiz)
  layout.tsx, globals.css
components/
  Avatar.tsx            AvatarState type definition (shared)
  Avatar3D.tsx           Canvas wrapper: camera, studio lighting, contact shadow
  avatar3d/Character.tsx Procedural 3D character mesh + per-state animation
  ChatPanel.tsx          Chat UI + mic + TTS playback
  QuizPanel.tsx          Quiz UI
lib/
  course_context.txt    Your course material — edit this
  prompts.ts             System prompt builder
```

---

## Getting the exact avatar from your reference image

The reference image uses the **Ready Player Me** art style — a free avatar platform used by thousands of apps. BLISS is wired to load any RPM GLB URL.

### 5-minute setup

1. Go to **https://readyplayer.me** → Create free account
2. Click **Try it now** → Select **Half Body**
3. Customise:
   - Male
   - Skin tone: light/medium
   - Hair: dark, swept/messy (matches reference)
   - Beard: short full beard
   - Outfit: black crew-neck t-shirt
4. Click **Done** → you'll see a URL like:
   `https://models.readyplayer.me/YOUR_ID_HERE.glb`
5. Open **`lib/avatar-url.ts`** and replace the URL:

```ts
export const AVATAR_URL =
  "https://models.readyplayer.me/YOUR_ID_HERE.glb" +
  "?morphTargets=ARKit,Oculus%20Visemes&textureAtlas=1024&lod=1";
```

6. Save — the avatar loads instantly in your running dev server. Done.

The `?morphTargets=ARKit,...` params are required — they add the 52 facial blend shapes BLISS uses for blinking, brow expressions, and jaw animation.

### What the demo URL does

The default URL in `lib/avatar-url.ts` points to a public RPM sample avatar so you can see the system working immediately, without creating an account first.
