import type { Difficulty, Question } from '@/data/questions';

// The app's own API route (src/app/api/questions+api.ts), which calls OpenRouter.
// In development, relative URLs go to the dev server started with `npx expo start`.
const QUESTIONS_URL = '/api/questions';
// AI generation is slower than a plain API; allow time for the model to answer.
const REQUEST_TIMEOUT_MS = 45000;
// Sent to the AI so it doesn't repeat questions from recent games.
const RECENT_LIMIT = 40;

const recentQuestions: string[] = [];

type FetchOptions = {
  amount: number;
  difficulty: Difficulty;
  /** Preset category id or a custom topic (Category.id). */
  category: string;
};

export async function fetchQuestions({
  amount,
  difficulty,
  category,
}: FetchOptions): Promise<Question[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(QUESTIONS_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, difficulty, category, avoid: recentQuestions }),
    });
  } catch {
    throw new Error(
      controller.signal.aborted
        ? 'The question service took too long. Try again.'
        : 'Could not reach the question service.',
    );
  } finally {
    clearTimeout(timeout);
  }

  const data = (await res.json().catch(() => null)) as {
    questions?: Question[];
    error?: string;
  } | null;
  if (!res.ok || !data?.questions) {
    throw new Error(data?.error ?? `Question service failed (${res.status}).`);
  }

  recentQuestions.push(...data.questions.map((q) => q.text));
  recentQuestions.splice(0, Math.max(0, recentQuestions.length - RECENT_LIMIT));
  return data.questions;
}
