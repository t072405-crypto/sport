import { AiServiceError, ClientGoneError } from '@/server/openrouter';
import { suggestCategories } from '@/server/suggestCategories';

const MAX_AVOID = 30;
const MAX_AVOID_LENGTH = 60;

/**
 * POST /api/categories  { avoid? }  ->  { suggestions }
 * Asks OpenRouter for fresh category ideas. Runs on the server, so the key stays secret.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { avoid?: unknown } | null;
  const avoid = Array.isArray(body?.avoid)
    ? body.avoid
        .filter((c): c is string => typeof c === 'string')
        .map((c) => c.slice(0, MAX_AVOID_LENGTH))
        .slice(-MAX_AVOID)
    : [];

  try {
    const suggestions = await suggestCategories({ avoid, signal: request.signal });
    return Response.json({ suggestions });
  } catch (e) {
    // Nobody is waiting for the answer; OpenRouter was cancelled, nothing to report.
    if (e instanceof ClientGoneError) return new Response(null, { status: 499 });
    if (e instanceof AiServiceError) {
      return Response.json({ error: e.message }, { status: e.status });
    }
    console.error('suggestCategories failed', e);
    return Response.json({ error: 'Could not suggest categories.' }, { status: 500 });
  }
}
