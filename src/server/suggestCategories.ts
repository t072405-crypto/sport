// Server-only: imported by src/app/api/categories+api.ts, never by the app.
import { normalizeTopic, PRESET_CATEGORIES } from '@/data/categories';
import { AiServiceError, askOpenRouter } from '@/server/openrouter';

export const SUGGESTION_COUNT = 4;
// Ask for spares; some may fail normalizeTopic or duplicate a preset.
const EXTRA_SUGGESTIONS = 3;

const SYSTEM_PROMPT = `You suggest fun, specific categories for a two-team sports trivia quiz.
Rules:
- Each category is 2 to 4 words, at most 30 characters, letters, numbers and spaces only.
- Be specific and surprising, not generic: each one names a particular sport plus an angle such as an era, a competition, a famous team, a rivalry, records or venues.
- Every category in a list must be about a different sport; include less obvious sports too (cycling, golf, rugby, boxing, cricket, motorsport, winter sports, athletics).
- Do not list examples from these instructions; invent new ones each time.
- Each category must have plenty of well-known, verifiable facts for trivia questions.
- No offensive or political topics.`;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    categories: { type: 'array', items: { type: 'string' } },
  },
  required: ['categories'],
  additionalProperties: false,
};

type Options = {
  /** Categories already shown, so a refresh brings new ideas. */
  avoid: string[];
  signal?: AbortSignal;
};

export async function suggestCategories({ avoid, signal }: Options): Promise<string[]> {
  // Presets are already on screen, so never suggest them again.
  const taken = [...PRESET_CATEGORIES.map((c) => c.label), ...avoid];
  const user =
    `Suggest ${SUGGESTION_COUNT + EXTRA_SUGGESTIONS} categories.\n` +
    `Do not suggest these or close variants:\n- ${taken.join('\n- ')}`;

  const parsed = await askOpenRouter<{ categories?: string[] }>({
    name: 'quiz_categories',
    system: SYSTEM_PROMPT,
    user,
    schema: RESPONSE_SCHEMA,
    signal,
  });

  const seen = new Set(taken.map((t) => t.toLowerCase()));
  const suggestions: string[] = [];
  for (const raw of parsed.categories ?? []) {
    const topic = normalizeTopic(raw);
    if (!topic || seen.has(topic.toLowerCase())) continue;
    seen.add(topic.toLowerCase());
    suggestions.push(topic);
    if (suggestions.length === SUGGESTION_COUNT) break;
  }
  if (suggestions.length === 0) throw new AiServiceError('The AI returned no usable categories.');
  return suggestions;
}
