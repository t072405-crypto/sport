import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchQuestions } from '@/api/questions';
import { OFFLINE_QUESTIONS, type Difficulty, type Question } from '@/data/questions';
import { teamForQuestion, type Scores } from '@/data/teams';

export const QUESTIONS_PER_GAME = 10;
/** A tiebreaker round gives each team one more question. */
const TIEBREAKER_ROUND_SIZE = 2;

export type QuizStatus = 'loading' | 'error' | 'playing';
/** What happened when the player tapped Next. */
export type NextResult = 'next' | 'finished';

function pickOffline(count: number): Question[] {
  return [...OFFLINE_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, count);
}

export function useQuiz(difficulty: Difficulty) {
  const [status, setStatus] = useState<QuizStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<Scores>([0, 0]);
  const [selected, setSelected] = useState<number | null>(null);
  /** True while tiebreaker questions are loading. */
  const [loadingTiebreaker, setLoadingTiebreaker] = useState(false);

  // Ignores responses from an older load or after unmount.
  const requestId = useRef(0);

  const total = questions.length;
  const question = questions[index] as Question | undefined;
  const answered = selected !== null;
  const currentTeam = teamForQuestion(index);
  const isTiebreaker = index >= QUESTIONS_PER_GAME;
  const tiebreakerRound = isTiebreaker
    ? Math.floor((index - QUESTIONS_PER_GAME) / TIEBREAKER_ROUND_SIZE) + 1
    : 0;

  const resetProgress = useCallback(() => {
    setIndex(0);
    setScores([0, 0]);
    setSelected(null);
    setLoadingTiebreaker(false);
  }, []);

  // Only sets state after the network call, so it is safe to run from an effect.
  const load = useCallback(
    async (id: number) => {
      try {
        const next = await fetchQuestions({
          amount: QUESTIONS_PER_GAME,
          difficulty,
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
      if (answerIndex === question.correctIndex) {
        // Only the team whose turn it is can score.
        setScores(([first, second]) =>
          currentTeam === 0 ? [first + 1, second] : [first, second + 1],
        );
      }
    },
    [selected, question, currentTeam],
  );

  /** Adds one tiebreaker round (a question for each team) and moves to it. */
  const addTiebreakerRound = useCallback(async () => {
    const id = requestId.current;
    setLoadingTiebreaker(true);
    let extra: Question[];
    try {
      extra = await fetchQuestions({
        amount: TIEBREAKER_ROUND_SIZE,
        difficulty,
      });
    } catch {
      // Never leave a tie unresolved: fall back to offline questions.
      extra = pickOffline(TIEBREAKER_ROUND_SIZE);
    }
    if (id !== requestId.current) return;
    // Unique ids so answer buttons don't reuse keys from earlier questions.
    setQuestions((current) => [
      ...current,
      ...extra.map((q, i) => ({ ...q, id: current.length + i })),
    ]);
    setIndex((i) => i + 1);
    setSelected(null);
    setLoadingTiebreaker(false);
  }, [difficulty]);

  /**
   * Moves to the next question. At the end of the questions, a tie starts a
   * tiebreaker round; otherwise the game is finished.
   */
  const next = useCallback(async (): Promise<NextResult> => {
    if (selected === null || loadingTiebreaker) return 'next';
    if (index < total - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
      return 'next';
    }
    // Every round ends after team 2's turn, so both teams have had equal turns here.
    if (scores[0] !== scores[1]) return 'finished';
    await addTiebreakerRound();
    return 'next';
  }, [selected, loadingTiebreaker, index, total, scores, addTiebreakerRound]);

  return {
    status,
    error,
    difficulty,
    question,
    index,
    total,
    scores,
    currentTeam,
    selected,
    answered,
    isTiebreaker,
    tiebreakerRound,
    loadingTiebreaker,
    select,
    next,
    /** Reloads questions after a failed load. */
    retry: start,
    playOffline,
  };
}
