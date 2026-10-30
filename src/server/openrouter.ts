// Server-only: imported by the API routes in src/app/api, never by the app.
// Expo keeps this file (and the API key it reads) out of the client bundle.

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'anthropic/claude-haiku-5.5';
// Free model used automatically when the account is out of credit (HTTP 402),
// so the game keeps working. It must support structured outputs.
const DEFAULT_FREE_MODEL = 'nvidia/nemotron-3.5-super-vl:free';
const REQUEST_TIMEOUT_MS = 30000;
// Free models run on shared capacity and answer much more slowly.
const FREE_REQUEST_TIMEOUT_MS = 75000;

/** An error whose message is safe to show to the player. */
export class AiServiceError extends Error {
  constructor(
    message: string,
    readonly status = 502,
  ) {
    super(message);
  }
}

/** Thrown when the app disconnected before the AI answered. */
export class ClientGoneError extends Error {}

type Options = {
  /** Identifies the JSON schema in the request, e.g. "trivia_questions". */
  name: string;
  system: string;
  user: string;
  /** JSON schema the answer must follow (strict mode). */
  schema: object;
  /** Aborted when the app disconnects, so an abandoned request stops costing credit. */
  signal?: AbortSignal;
};

/** Sends one chat request to OpenRouter and returns the parsed JSON answer. */
export async function askOpenRouter<T>({ name, system, user, schema, signal }: Options): Promise<T> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new AiServiceError(
      'OPENROUTER_API_KEY is not set. Add it to .env.local and restart the dev server.',
      500,
    );
  }
  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
  const freeModel = process.env.OPENROUTER_FREE_MODEL || DEFAULT_FREE_MODEL;

  /** Posts the request and reads the whole answer, both within the time limit. */
  async function send(modelId: string, timeoutMs: number): Promise<{ status: number; body: unknown }> {
    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        signal: signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Title': 'Sports Quiz',
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
          response_format: { type: 'json_schema', json_schema: { name, strict: true, schema } },
          // Only use providers that support every parameter sent (the JSON schema above).
          // Don't add parameters the model lacks (e.g. temperature), or no provider will match.
          provider: { require_parameters: true },
        }),
      });
      // Error bodies may not be JSON; a successful body must be, so let that one throw.
      const body = res.ok ? await res.json() : await res.json().catch(() => null);
      return { status: res.status, body };
    } catch {
      if (signal?.aborted) throw new ClientGoneError();
      throw new AiServiceError(
        timeoutSignal.aborted ? 'The AI took too long to answer.' : 'Could not reach OpenRouter.',
      );
    }
  }

  let res = await send(model, REQUEST_TIMEOUT_MS);
  if (res.status === 402 && model !== freeModel) {
    // Out of credit: keep the game running on the free model until credit is added.
    console.warn(`OpenRouter: out of credit, using free model ${freeModel}`);
    res = await send(freeModel, FREE_REQUEST_TIMEOUT_MS);
  }

  if (res.status === 401) throw new AiServiceError('OpenRouter rejected the API key.', 500);
  if (res.status === 402) {
    throw new AiServiceError(
      'Your OpenRouter account is out of credit. Add credit at openrouter.ai/credits.',
    );
  }
  if (res.status === 429) throw new AiServiceError('OpenRouter is busy. Try again in a moment.');
  if (res.status < 200 || res.status >= 300) {
    // OpenRouter explains failures in { error: { message } }, e.g. an unknown model.
    const detail = res.body as { error?: { message?: string } } | null;
    const reason = detail?.error?.message ? `: ${detail.error.message}` : '';
    throw new AiServiceError(`OpenRouter request failed (${res.status})${reason}`);
  }

  const data = res.body as { choices?: { message?: { content?: string } }[] };
  try {
    return JSON.parse(data.choices?.[0]?.message?.content ?? '') as T;
  } catch {
    throw new AiServiceError('The AI returned an unreadable answer.');
  }
}
