// Server-only: imported by src/app/api/questions+api.ts, never by the app.
// Expo keeps this file (and the API key it reads) out of the client bundle.
import type { Difficulty, Question } from '@/data/questions';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'anthropic/claude-haiku-5.5';
const REQUEST_TIMEOUT_MS = 30000;
// Ask for a couple of spares in case some fail validation.
const EXTRA_QUESTIONS = 2;
const MAX_QUESTION_LENGTH = 160;
const MAX_ANSWER_LENGTH = 50;

/** An error whose message is safe to show to the player. */
export class QuestionServiceError extends Error {
  constructor(
    message: string,
    readonly status = 502,
  ) {
    super(message);
  }
}

const DIFFICULTY_GUIDE: Record<Difficulty, string> = {
  easy: 'widely known facts that casual fans would know',
  medium: 'facts that regular sports fans would know',
  hard: 'detailed facts that only dedicated experts would know',
};

const SYSTEM_PROMPT = `You write multiple-choice sports trivia questions for a quiz game.
Rules:
- Every fact must be accurate and verifiable. If you are not sure, write a different question.
- Avoid answers that change over time (current champions, active records) unless the question names a specific year or event.
- Each question has exactly one correct answer and exactly three plausible but clearly wrong answers.
- Mix different sports: football (soccer), basketball, tennis, the Olympics, Formula 1, cricket, athletics and others.
- Questions under ${MAX_QUESTION_LENGTH} characters, answers under ${MAX_ANSWER_LENGTH} characters.
- Do not reveal the answer in the question.`;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          correct_answer: { type: 'string' },
          incorrect_answers: { type: 'array', items: { type: 'string' } },
        },
        required: ['question', 'correct_answer', 'incorrect_answers'],
        additionalProperties: false,
      },
    },
  },
  required: ['questions'],
  additionalProperties: false,
};

type AiQuestion = { question: string; correct_answer: string; incorrect_answers: string[] };

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Returns a game-ready question, or null if the AI output breaks the rules. */
function toQuestion(item: AiQuestion, id: number, difficulty: Difficulty): Question | null {
  const text = item.question?.trim();
  const correct = item.correct_answer?.trim();
  const wrong = (item.incorrect_answers ?? []).map((a) => a?.trim()).filter(Boolean);
  if (!text || !correct || text.length > MAX_QUESTION_LENGTH || wrong.length !== 3) return null;

  const answers = [correct, ...wrong];
  const unique = new Set(answers.map((a) => a.toLowerCase()));
  if (unique.size !== 4 || answers.some((a) => a.length > MAX_ANSWER_LENGTH)) return null;

  // The AI tends to list the correct answer first, so shuffle here.
  const shuffled = shuffle(answers);
  return {
    id,
    text,
    answers: shuffled,
    correctIndex: shuffled.indexOf(correct),
    category: 'Sports',
    difficulty,
  };
}

type Options = {
  amount: number;
  difficulty: Difficulty;
  /** Recently asked questions the AI should not repeat. */
  avoid: string[];
};

export async function generateQuestions({ amount, difficulty, avoid }: Options) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new QuestionServiceError(
      'OPENROUTER_API_KEY is not set. Add it to .env.local and restart the dev server.',
      500,
    );
  }

  let userPrompt =
    `Write ${amount + EXTRA_QUESTIONS} ${difficulty} sports trivia questions ` +
    `(${DIFFICULTY_GUIDE[difficulty]}).`;
  if (avoid.length > 0) {
    userPrompt += `\nDo not repeat or closely paraphrase these questions:\n- ${avoid.join('\n- ')}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Title': 'Sports Quiz',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'trivia_questions', strict: true, schema: RESPONSE_SCHEMA },
        },
        // Only use providers that support every parameter sent (the JSON schema above).
        // Don't add parameters the model lacks (e.g. temperature), or no provider will match.
        provider: { require_parameters: true },
      }),
    });
  } catch {
    throw new QuestionServiceError(
      controller.signal.aborted ? 'The AI took too long to answer.' : 'Could not reach OpenRouter.',
    );
  } finally {
    clearTimeout(timeout);
  }

  if (res.status === 401) throw new QuestionServiceError('OpenRouter rejected the API key.', 500);
  if (res.status === 402) throw new QuestionServiceError('Your OpenRouter account is out of credit.');
  if (res.status === 429) throw new QuestionServiceError('OpenRouter is rate limiting requests.');
  if (!res.ok) {
    // OpenRouter explains failures in { error: { message } }, e.g. an unknown model.
    const detail = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    const reason = detail?.error?.message ? `: ${detail.error.message}` : '';
    throw new QuestionServiceError(`OpenRouter request failed (${res.status})${reason}`);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  let parsed: { questions?: AiQuestion[] };
  try {
    parsed = JSON.parse(data.choices?.[0]?.message?.content ?? '');
  } catch {
    throw new QuestionServiceError('The AI returned an unreadable answer.');
  }

  const questions = (parsed.questions ?? [])
    .map((item, i) => toQuestion(item, i, difficulty))
    .filter((q): q is Question => q !== null)
    .slice(0, amount)
    .map((q, i) => ({ ...q, id: i }));
  if (questions.length < amount) {
    throw new QuestionServiceError('The AI returned too few valid questions.');
  }
  return questions;
}
