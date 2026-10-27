import type { Difficulty, Question } from '@/data/questions';

// Docs: https://opentdb.com/api_config.php
const BASE_URL = 'https://opentdb.com';
// OpenTDB allows one question request per IP every 5 seconds; keep a small margin.
const RATE_LIMIT_MS = 5500;
const MAX_ATTEMPTS = 4;
// A request that takes longer than this is aborted and retried.
const REQUEST_TIMEOUT_MS = 10000;

const ResponseCode = {
  Success: 0,
  NoResults: 1,
  InvalidParameter: 2,
  TokenNotFound: 3,
  TokenEmpty: 4,
  RateLimit: 5,
} as const;

type ApiQuestion = {
  type: string;
  difficulty: Difficulty;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

type QuestionsResponse = { response_code: number; results: ApiQuestion[] };
type TokenResponse = { response_code: number; token: string };

/** Errors worth retrying: rate limited or no response in time. */
class RetryableError extends Error {}

// A session token stops OpenTDB from repeating questions across games.
// Stored as a promise so concurrent callers share one token request.
let sessionToken: Promise<string> | null = null;

async function getJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    // OpenTDB signals its rate limit with HTTP 429 as well as response_code 5.
    if (res.status === 429) throw new RetryableError('Rate limited');
    if (!res.ok) throw new Error(`OpenTDB request failed (${res.status})`);
    return (await res.json()) as T;
  } catch (e) {
    if (controller.signal.aborted) throw new RetryableError('Request timed out');
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}

// Question requests run one at a time, at least RATE_LIMIT_MS apart, so
// overlapping loads (e.g. a quick "Play again") don't trip the rate limit.
let requestQueue: Promise<unknown> = Promise.resolve();
let lastRequestAt = 0;

function getQuestions(url: string): Promise<QuestionsResponse> {
  const request = requestQueue.then(async () => {
    const delay = lastRequestAt + RATE_LIMIT_MS - Date.now();
    if (delay > 0) await wait(delay);
    lastRequestAt = Date.now();
    try {
      return await getJson<QuestionsResponse>(url);
    } catch (e) {
      // Treated like OpenTDB's own rate-limit code: wait for the queue and retry.
      if (e instanceof RetryableError) return { response_code: ResponseCode.RateLimit, results: [] };
      throw e;
    }
  });
  requestQueue = request.catch(() => undefined);
  return request;
}

function getToken() {
  if (!sessionToken) {
    sessionToken = getJson<TokenResponse>(`${BASE_URL}/api_token.php?command=request`).then(
      (data) => data.token,
    );
    // Don't cache a failed request.
    sessionToken.catch(() => {
      sessionToken = null;
    });
  }
  return sessionToken;
}

async function resetToken(token: string) {
  await getJson<TokenResponse>(`${BASE_URL}/api_token.php?command=reset&token=${token}`);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function toQuestion(item: ApiQuestion, id: number): Question {
  const correct = decodeURIComponent(item.correct_answer);
  const answers = shuffle([correct, ...item.incorrect_answers.map(decodeURIComponent)]);
  return {
    id,
    text: decodeURIComponent(item.question),
    answers,
    correctIndex: answers.indexOf(correct),
    category: decodeURIComponent(item.category),
    difficulty: item.difficulty,
  };
}

type FetchOptions = {
  amount: number;
  difficulty: Difficulty;
  categoryId: number;
};

export async function fetchQuestions({ amount, difficulty, categoryId }: FetchOptions) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const token = await getToken();
    // url3986 encoding avoids HTML entities like &quot; in the text.
    const url =
      `${BASE_URL}/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}` +
      `&type=multiple&encode=url3986&token=${token}`;
    const data = await getQuestions(url);

    switch (data.response_code) {
      case ResponseCode.Success:
        return data.results.map(toQuestion);
      case ResponseCode.NoResults:
        throw new Error('Not enough questions for this difficulty. Try another one.');
      case ResponseCode.TokenNotFound:
        sessionToken = null;
        break;
      case ResponseCode.TokenEmpty:
        await resetToken(token);
        break;
      case ResponseCode.RateLimit:
        // Retry; the request queue already waits RATE_LIMIT_MS between requests.
        break;
      default:
        throw new Error(`OpenTDB error (code ${data.response_code})`);
    }
  }
  throw new Error('Could not load questions from OpenTDB');
}
