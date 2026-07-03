"use client";

import { useState } from "react";

type Question = {
  id: string;
  concept: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const DIFF_COLOR: Record<string, string> = {
  Easy: "text-wine border-wine/25 bg-wine/5",
  Medium: "text-gold border-gold/40 bg-gold/10",
  Hard: "text-wineDeep border-wineDeep/30 bg-wineDeep/5",
};

export default function QuizPanel({ onResult }: { onResult?: (r: "correct" | "wrong") => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [count, setCount] = useState(5);

  async function generateQuiz() {
    setLoading(true);
    setError("");
    setAnswers({});
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count, difficulty: "mixed" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestions(data.questions ?? []);
    } catch (e: any) {
      setError(e.message ?? "Couldn't generate a quiz right now.");
    } finally {
      setLoading(false);
    }
  }

  const answeredCount = Object.keys(answers).length;
  const score = questions.reduce(
    (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
    0
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
        <div>
          <h2 className="font-display text-sm font-semibold text-ink">Practice quiz</h2>
          <p className="text-xs text-mist mt-0.5">Generated live from your course material</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="bg-paper2 border border-line rounded-lg text-xs px-2 py-1.5 text-mist font-mono"
          >
            {[3, 5, 8, 10].map((n) => (
              <option key={n} value={n}>
                {n} Qs
              </option>
            ))}
          </select>
          <button
            onClick={generateQuiz}
            disabled={loading}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-wine text-paper hover:bg-wine2 transition-colors disabled:opacity-50"
          >
            {loading ? "Building…" : questions.length ? "Regenerate" : "Generate quiz"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {error && (
          <p className="text-xs text-wineDeep bg-wine/5 border border-wine/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {!questions.length && !loading && !error && (
          <div className="h-full flex flex-col items-center justify-center text-center text-mist py-16">
            <p className="text-sm">No quiz yet.</p>
            <p className="text-xs mt-1">Tap "Generate quiz" — BLISS will write questions straight from course_context.txt.</p>
          </div>
        )}

        {questions.map((q, idx) => {
          const selected = answers[q.id];
          const isAnswered = selected !== undefined;
          return (
            <div
              key={q.id}
              className="rounded-xl border border-line bg-paper2 p-4 animate-rise"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] text-mist">Q{idx + 1}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${DIFF_COLOR[q.difficulty] ?? "text-mist border-line"}`}>
                  {q.difficulty}
                </span>
                <span className="text-[10px] font-mono text-mist">· {q.concept}</span>
              </div>
              <p className="text-sm text-ink mb-3 leading-relaxed">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isCorrect = i === q.correctIndex;
                  const isPicked = i === selected;
                  let style = "border-line bg-paper hover:border-wine/40";
                  if (isAnswered) {
                    if (isCorrect) style = "border-emerald-500/60 bg-emerald-50 text-emerald-800";
                    else if (isPicked) style = "border-gold/60 bg-gold/10";
                    else style = "border-line bg-paper opacity-50";
                  }
                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => {
                        setAnswers((a) => ({ ...a, [q.id]: i }));
                        onResult?.(i === q.correctIndex ? "correct" : "wrong");
                      }}
                      className={`w-full text-left text-xs sm:text-sm px-3 py-2 rounded-lg border transition-colors text-ink ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {isAnswered && (
                <p className="text-xs text-mist mt-3 leading-relaxed">
                  <span className="text-emerald-700 font-medium">Explanation — </span>
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {questions.length > 0 && (
        <div className="px-5 py-3 border-t border-line flex items-center justify-between font-mono text-xs text-mist">
          <span>{answeredCount}/{questions.length} answered</span>
          <span className="text-emerald-700 font-medium">Score: {score}/{answeredCount}</span>
        </div>
      )}
    </div>
  );
}
