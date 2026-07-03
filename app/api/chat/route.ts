import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getCourseContext, TUTOR_SYSTEM_PROMPT } from "@/lib/prompts";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is missing. Add it to your .env.local file." },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const context = getCourseContext();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 400,
      messages: [
        { role: "system", content: TUTOR_SYSTEM_PROMPT(context) },
        ...messages,
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message ?? "Chat request failed." },
      { status: 500 }
    );
  }
}
