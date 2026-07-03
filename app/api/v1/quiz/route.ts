import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkApiKey, CORS_HEADERS } from "@/lib/apiAuth";

export const runtime = "nodejs";

/**
 * POST /api/v1/quiz
 *
 * Headers:
 *   Content-Type: application/json
 *   Authorization: Bearer <BLISS_API_KEY>
 *
 * Body:
 * {
 *   "count": 5           // number of questions (default 5, max = bank size)
 * }
 *
 * Response 200:
 * {
 *   "questions": [
 *     {
 *       "id": "1",
 *       "module": "Introduction to AI",
 *       "concept": "Artificial Intelligence",
 *       "difficulty": "Easy",
 *       "question": "What is AI?",
 *       "options": ["A...", "B...", "C...", "D..."],
 *       "correctIndex": 2,
 *       "explanation": "AI is..."
 *     }
 *   ]
 * }
 */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const servedIds = new Set<string>();

export async function POST(req: NextRequest) {
  const authErr = checkApiKey(req);
  if (authErr) return authErr;

  try {
    const { count = 5 } = await req.json().catch(() => ({}));
    const bankPath = path.join(process.cwd(), "lib", "quiz_bank.json");

    if (!fs.existsSync(bankPath)) {
      return NextResponse.json({ error: "quiz_bank.json not found." }, { status: 500, headers: CORS_HEADERS });
    }

    const bank: any[] = JSON.parse(fs.readFileSync(bankPath, "utf-8"));
    const safeCount   = Math.min(Math.max(1, count), bank.length);

    let fresh = bank.filter(q => !servedIds.has(q.question_id));
    if (fresh.length < safeCount) { servedIds.clear(); fresh = bank; }

    const selected = shuffle(fresh).slice(0, safeCount);
    selected.forEach(q => servedIds.add(q.question_id));

    const questions = selected.map((q: any) => {
      const opts    = shuffle(q.options as string[]);
      const correct = opts.indexOf(q.answer);
      return {
        id:           q.question_id,
        module:       q.module,
        submodule:    q.submodule,
        concept:      q.concepts?.[0] ?? q.module,
        difficulty:   q.difficulty,
        question:     q.question,
        options:      opts,
        correctIndex: correct,
        explanation:  q.explanation,
      };
    });

    return NextResponse.json({ questions }, { headers: CORS_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Quiz failed." }, { status: 500, headers: CORS_HEADERS });
  }
}
