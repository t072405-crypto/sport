import { isDifficulty } from '@/data/questions';
import {
  ClientGoneError,
  generateQuestions,
  QuestionServiceError,
} from '@/server/generateQuestions';

const MAX_AMOUNT = 10;
const MAX_AVOID = 40;

/**
 * POST /api/questions  { amount, difficulty, avoid? }  ->  { questions }
 * Runs on the server, so the OpenRouter key never reaches the app.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    amount?: unknown;
    difficulty?: unknown;
    avoid?: unknown;
  } | null;

  const amount = Number(body?.amount);
  if (!Number.isInteger(amount) || amount < 1 || amount > MAX_AMOUNT) {
    return Response.json({ error: `amount must be 1–${MAX_AMOUNT}` }, { status: 400 });
  }
  const difficulty = body?.difficulty;
  if (!isDifficulty(difficulty)) {
    return Response.json({ error: 'difficulty must be easy, medium or hard' }, { status: 400 });
  }
  const avoid = Array.isArray(body?.avoid)
    ? body.avoid.filter((q): q is string => typeof q === 'string').slice(-MAX_AVOID)
    : [];

  try {
    const questions = await generateQuestions({
      amount,
      difficulty,
      avoid,
      // Fires when the app disconnects (left the screen, reloaded, closed).
      signal: request.signal,
    });
    return Response.json({ questions });
  } catch (e) {
    // Nobody is waiting for the answer; OpenRouter was cancelled, nothing to report.
    if (e instanceof ClientGoneError) return new Response(null, { status: 499 });
    if (e instanceof QuestionServiceError) {
      return Response.json({ error: e.message }, { status: e.status });
    }
    console.error('generateQuestions failed', e);
    return Response.json({ error: 'Could not create questions.' }, { status: 500 });
  }
}
