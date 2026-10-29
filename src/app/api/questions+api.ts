import { categoryFromParam, normalizeTopic, PRESET_CATEGORIES } from '@/data/categories';
import { isDifficulty } from '@/data/questions';
import { generateQuestions } from '@/server/generateQuestions';
import { AiServiceError, ClientGoneError } from '@/server/openrouter';

const MAX_AMOUNT = 10;
const MAX_AVOID = 40;
const MAX_AVOID_LENGTH = 200;

/**
 * POST /api/questions  { amount, difficulty, category?, avoid? }  ->  { questions }
 * `category` is a preset id (e.g. "football") or a custom topic typed by the players.
 * Runs on the server, so the OpenRouter key never reaches the app.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    amount?: unknown;
    difficulty?: unknown;
    category?: unknown;
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
  const isPreset = PRESET_CATEGORIES.some((c) => c.id === body?.category);
  if (body?.category !== undefined && !isPreset && !normalizeTopic(body.category)) {
    return Response.json(
      { error: 'category must be a preset or a short topic (letters, numbers, spaces)' },
      { status: 400 },
    );
  }
  const category = categoryFromParam(body?.category);
  const avoid = Array.isArray(body?.avoid)
    ? body.avoid
        .filter((q): q is string => typeof q === 'string')
        .map((q) => q.slice(0, MAX_AVOID_LENGTH))
        .slice(-MAX_AVOID)
    : [];

  try {
    const questions = await generateQuestions({
      amount,
      difficulty,
      topic: category.topic,
      category: category.label,
      avoid,
      // Fires when the app disconnects (left the screen, reloaded, closed).
      signal: request.signal,
    });
    return Response.json({ questions });
  } catch (e) {
    // Nobody is waiting for the answer; OpenRouter was cancelled, nothing to report.
    if (e instanceof ClientGoneError) return new Response(null, { status: 499 });
    if (e instanceof AiServiceError) {
      return Response.json({ error: e.message }, { status: e.status });
    }
    console.error('generateQuestions failed', e);
    return Response.json({ error: 'Could not create questions.' }, { status: 500 });
  }
}
