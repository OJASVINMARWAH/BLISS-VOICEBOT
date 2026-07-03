import { NextResponse } from "next/server";
import { CORS_HEADERS } from "@/lib/apiAuth";

export const runtime = "nodejs";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "BLISS AI Tutor API",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      endpoints: {
        "POST /api/v1/chat":  "Send a message, get a tutor reply",
        "POST /api/v1/quiz":  "Sample questions from quiz bank",
        "POST /api/v1/tts":   "Convert text to speech (base64 WAV)",
        "GET  /api/v1/health":"This health-check",
      },
    },
    { headers: CORS_HEADERS }
  );
}
