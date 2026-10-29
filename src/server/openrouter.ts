// Server-only: imported by the API routes in src/app/api, never by the app.
// Expo keeps this file (and the API key it reads) out of the client bundle.

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'anthropic/claude-haiku-5.5';
const REQUEST_TIMEOUT_MS = 30000;

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

  const timeoutSignal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      signal: signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Title': 'Sports Quiz',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
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
  } catch {
    if (signal?.aborted) throw new ClientGoneError();
    throw new AiServiceError(
      timeoutSignal.aborted ? 'The AI took too long to answer.' : 'Could not reach OpenRouter.',
    );
  }

  if (res.status === 401) throw new AiServiceError('OpenRouter rejected the API key.', 500);
  if (res.status === 402) throw new AiServiceError('Your OpenRouter account is out of credit.');
  if (res.status === 429) throw new AiServiceError('OpenRouter is rate limiting requests.');
  if (!res.ok) {
    // OpenRouter explains failures in { error: { message } }, e.g. an unknown model.
    const detail = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    const reason = detail?.error?.message ? `: ${detail.error.message}` : '';
    throw new AiServiceError(`OpenRouter request failed (${res.status})${reason}`);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  try {
    return JSON.parse(data.choices?.[0]?.message?.content ?? '') as T;
  } catch {
    throw new AiServiceError('The AI returned an unreadable answer.');
  }
}
