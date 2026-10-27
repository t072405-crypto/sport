import { useCallback, useState } from 'react';

import { QUESTIONS, type Question } from '@/data/questions';

export function useQuiz(questions: Question[] = QUESTIONS) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const question = questions[index];
  const answered = selected !== null;

  const select = useCallback(
    (answerIndex: number) => {
      if (selected !== null) return;
      setSelected(answerIndex);
      if (answerIndex === question.correctIndex) setScore((s) => s + 1);
    },
    [selected, question],
  );

  const next = useCallback(() => {
    if (selected === null) return;
    if (index === total - 1) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }, [selected, index, total]);

  const reset = useCallback(() => {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  }, []);

  return { question, index, total, score, selected, answered, finished, select, next, reset };
}
