// The app's own API route (src/app/api/categories+api.ts), which calls OpenRouter.
const CATEGORIES_URL = '/api/categories';
const REQUEST_TIMEOUT_MS = 60000;
// Ideas already shown are sent back, so every refresh (and every visit) brings new ones.
const HISTORY_LIMIT = 30;

const shownIdeas: string[] = [];

/** Asks the AI for fresh category ideas it hasn't suggested before. */
export async function fetchCategorySuggestions(): Promise<string[]> {
  const avoid = [...shownIdeas];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(CATEGORIES_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avoid }),
    });
  } catch {
    throw new Error(controller.signal.aborted ? 'The AI took too long.' : 'Could not reach the AI.');
  } finally {
    clearTimeout(timeout);
  }

  const data = (await res.json().catch(() => null)) as {
    suggestions?: string[];
    error?: string;
  } | null;
  if (!res.ok || !data?.suggestions) {
    throw new Error(data?.error ?? `Category ideas failed (${res.status}).`);
  }
  shownIdeas.push(...data.suggestions);
  shownIdeas.splice(0, Math.max(0, shownIdeas.length - HISTORY_LIMIT));
  return data.suggestions;
}
