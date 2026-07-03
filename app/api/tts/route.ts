import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Smallest AI Lightning TTS — https://smallest.ai
// voice_id "siddharth" = friendly, excitable Indian-accented male voice (5k calls, featured)
// Model: lightning-v3.1 | output: wav | fallback: browser speech synthesis

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    const apiKey = process.env.SMALLEST_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "SMALLEST_API_KEY missing in .env.local" },
        { status: 500 }
      );
    }

    if (!text?.trim()) {
      return NextResponse.json({ error: "No text provided." }, { status: 400 });
    }

    const safeText = text.slice(0, 1500);

    const res = await fetch(
      "https://api.smallest.ai/waves/v1/lightning-v3.1/get_speech",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: safeText,
          voice_id: "siddharth",
          sample_rate: 24000,
          output_format: "wav",
          speed: 1.0,
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error(`[SmallestAI TTS] ${res.status}: ${detail}`);
      return NextResponse.json(
        { error: `SmallestAI TTS error (${res.status}): ${detail}` },
        { status: res.status }
      );
    }

    // SmallestAI returns raw audio bytes directly (not a JSON wrapper)
    const audioBuffer = await res.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json({ audio: audioBase64 });
  } catch (err: any) {
    console.error("[SmallestAI TTS] Unexpected error:", err);
    return NextResponse.json(
      { error: err?.message ?? "TTS request failed." },
      { status: 500 }
    );
  }
}
