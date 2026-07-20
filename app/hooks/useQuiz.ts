// hooks/useQuiz.ts
import { useState, useCallback } from 'react';

type AnswerState = 'idle' | 'correct' | 'wrong';

interface UseQuizProps {
  correctAnswer: number;
  onCorrect?: () => void;
  onWrong?: () => void;
}

export function useQuiz({ correctAnswer, onCorrect, onWrong }: UseQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [state, setState] = useState<AnswerState>('idle');

  const handleAnswer = useCallback(
    (value: number) => {
      if (state !== 'idle') return;
      setSelectedAnswer(value);

      if (value === correctAnswer) {
        setState('correct');
        setScore((prev) => prev + 10);
        onCorrect?.();
      } else {
        setState('wrong');
        onWrong?.();
      }
    },
    [correctAnswer, state, onCorrect, onWrong]
  );

  const reset = useCallback(() => {
    setSelectedAnswer(null);
    setState('idle');
  }, []);

  return {
    selectedAnswer,
    score,
    state,
    handleAnswer,
    reset,
  };
}