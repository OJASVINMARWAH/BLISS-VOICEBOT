import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

type BankQ = {
  question_id: string;
  module: string;
  submodule: string;
  concepts: string[];
  learning_objective: string;
  difficulty: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Track which IDs have been served this session (in-memory; resets on server restart)
const servedIds = new Set<string>();

function sampleQuestions(bank: BankQ[], count: number): BankQ[] {
  // Filter out already-served questions (no duplicates within a server session)
  const fresh = bank.filter(q => !servedIds.has(q.question_id));

  // If we've exhausted all questions, reset and start fresh
  if (fresh.length < count) {
    servedIds.clear();
    return shuffle(bank).slice(0, Math.min(count, bank.length));
  }

  const selected = shuffle(fresh).slice(0, count);
  selected.forEach(q => servedIds.add(q.question_id));
  return selected;
}

export async function POST(req: NextRequest) {
  try {
    const { count = 5 } = await req.json();

    // Load the quiz bank from disk
    const bankPath = path.join(process.cwd(), "lib", "quiz_bank.json");
    if (!fs.existsSync(bankPath)) {
      return NextResponse.json({ error: "quiz_bank.json not found in lib/." }, { status: 500 });
    }

    const bank: BankQ[] = JSON.parse(fs.readFileSync(bankPath, "utf-8"));
    const safeCount = Math.min(count, bank.length);
    const selected  = sampleQuestions(bank, safeCount);

    // Transform to the shape QuizPanel already expects
    const questions = selected.map((q) => {
      const correctIndex = q.options.indexOf(q.answer);
      // Shuffle options so the correct one isn't always first
      const shuffledOptions = shuffle(q.options);
      const newCorrectIndex = shuffledOptions.indexOf(q.answer);

      return {
        id:           q.question_id,
        concept:      q.concepts[0] ?? q.module,
        difficulty:   q.difficulty as "Easy" | "Medium" | "Hard",
        question:     q.question,
        options:      shuffledOptions,
        correctIndex: newCorrectIndex,
        explanation:  q.explanation,
        module:       q.module,
        submodule:    q.submodule,
      };
    });

    return NextResponse.json({ questions });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message ?? "Quiz sampling failed." }, { status: 500 });
  }
}
