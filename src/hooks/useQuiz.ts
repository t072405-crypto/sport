import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchQuestions } from '@/api/opentdb';
import { OFFLINE_QUESTIONS, type Difficulty, type Question } from '@/data/questions';

export const QUESTIONS_PER_GAME = 10;
/** OpenTDB category 21: Sports. */
const SPORTS_CATEGORY_ID = 21;

export type QuizStatus = 'loading' | 'error' | 'playing' | 'finished';

export function useQuiz(difficulty: Difficulty) {
  const [status, setStatus] = useState<QuizStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  // Ignores responses from an older load or after unmount.
  const requestId = useRef(0);

  const total = questions.length;
  const question = questions[index] as Question | undefined;
  const answered = selected !== null;

  const resetProgress = useCallback(() => {
    setIndex(0);
    setScore(0);
    setSelected(null);
  }, []);

  // Only sets state after the network call, so it is safe to run from an effect.
  const load = useCallback(
    async (id: number) => {
      try {
        const next = await fetchQuestions({
          amount: QUESTIONS_PER_GAME,
          difficulty,
          categoryId: SPORTS_CATEGORY_ID,
        });
        if (id !== requestId.current) return;
        setQuestions(next);
        setStatus('playing');
      } catch (e) {
        if (id !== requestId.current) return;
        setError(e instanceof Error ? e.message : 'Something went wrong.');
        setStatus('error');
      }
    },
    [difficulty],
  );

  /** Starts a new game with fresh questions. */
  const start = useCallback(() => {
    const id = ++requestId.current;
    setStatus('loading');
    setError(null);
    resetProgress();
    load(id);
  }, [load, resetProgress]);

  const playOffline = useCallback(() => {
    requestId.current++;
    resetProgress();
    setError(null);
    setQuestions(OFFLINE_QUESTIONS);
    setStatus('playing');
  }, [resetProgress]);

  // First game loads on mount; state already starts as 'loading'.
  useEffect(() => {
    const counter = requestId;
    load(++counter.current);
    return () => {
      counter.current++;
    };
  }, [load]);

  const select = useCallback(
    (answerIndex: number) => {
      if (!question || selected !== null) return;
      setSelected(answerIndex);
      if (answerIndex === question.correctIndex) setScore((s) => s + 1);
    },
    [selected, question],
  );

  const next = useCallback(() => {
    if (selected === null) return;
    if (index === total - 1) {
      setStatus('finished');
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }, [selected, index, total]);

  return {
    status,
    error,
    difficulty,
    question,
    index,
    total,
    score,
    selected,
    answered,
    select,
    next,
    playAgain: start,
    playOffline,
  };
}
