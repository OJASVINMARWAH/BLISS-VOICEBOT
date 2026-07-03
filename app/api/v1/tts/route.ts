import { NextRequest, NextResponse } from "next/server";
import { checkApiKey, CORS_HEADERS } from "@/lib/apiAuth";

export const runtime = "nodejs";

/**
 * POST /api/v1/tts
 *
 * Headers:
 *   Content-Type: application/json
 *   Authorization: Bearer <BLISS_API_KEY>
 *
 * Body:
 * {
 *   "text": "Hello, I am BLISS!",
 *   "voice_id": "siddharth"   // optional — defaults to siddharth
 * }
 *
 * Response 200:
 * {
 *   "audio": "<base64-encoded WAV string>",
 *   "format": "wav",
 *   "sample_rate": 24000
 * }
 *
 * Play in browser:
 *   const audio = new Audio(`data:audio/wav;base64,${response.audio}`);
 *   audio.play();
 */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  const authErr = checkApiKey(req);
  if (authErr) return authErr;

  try {
    const { text, voice_id = "siddharth" } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "text is required." }, { status: 400, headers: CORS_HEADERS });
    }

    const apiKey = process.env.SMALLEST_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "SMALLEST_API_KEY not configured." }, { status: 500, headers: CORS_HEADERS });
    }

    const res = await fetch("https://api.smallest.ai/waves/v1/lightning-v3.1/get_speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.slice(0, 1500), voice_id, sample_rate: 24000, output_format: "wav", speed: 1.0 }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json({ error: `TTS error (${res.status}): ${detail}` }, { status: res.status, headers: CORS_HEADERS });
    }

    const buf    = await res.arrayBuffer();
    const audio  = Buffer.from(buf).toString("base64");
    return NextResponse.json({ audio, format: "wav", sample_rate: 24000 }, { headers: CORS_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "TTS failed." }, { status: 500, headers: CORS_HEADERS });
  }
}
