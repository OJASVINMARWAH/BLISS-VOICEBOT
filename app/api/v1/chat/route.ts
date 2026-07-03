import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getCourseContext, TUTOR_SYSTEM_PROMPT } from "@/lib/prompts";
import { checkApiKey, CORS_HEADERS } from "@/lib/apiAuth";

export const runtime = "nodejs";

/**
 * POST /api/v1/chat
 *
 * Headers:
 *   Content-Type: application/json
 *   Authorization: Bearer <BLISS_API_KEY>
 *
 * Body:
 * {
 *   "message": "What is overfitting?",          // current user message
 *   "history": [                                 // optional — prior turns
 *     { "role": "user",      "content": "..." },
 *     { "role": "assistant", "content": "..." }
 *   ],
 *   "stream": false                              // optional — reserved for future SSE
 * }
 *
 * Response 200:
 * {
 *   "reply": "Overfitting is when...",
 *   "tokens": 87
 * }
 */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  const authErr = checkApiKey(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { message, history = [] } = body as {
      message: string;
      history?: { role: "user" | "assistant"; content: string }[];
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: "message is required." }, { status: 400, headers: CORS_HEADERS });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured." }, { status: 500, headers: CORS_HEADERS });
    }

    const groq    = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const context = getCourseContext();

    const messages = [
      ...history,
      { role: "user" as const, content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 200,
      messages: [
        { role: "system", content: TUTOR_SYSTEM_PROMPT(context) },
        ...messages,
      ],
    });

    const reply  = completion.choices[0]?.message?.content ?? "";
    const tokens = completion.usage?.total_tokens ?? 0;

    return NextResponse.json({ reply, tokens }, { headers: CORS_HEADERS });
  } catch (err: any) {
    console.error("[/api/v1/chat]", err);
    return NextResponse.json({ error: err?.message ?? "Chat failed." }, { status: 500, headers: CORS_HEADERS });
  }
}
