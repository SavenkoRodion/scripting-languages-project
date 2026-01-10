// SolveQuizForm.tsx
import { useState } from "react";
import type { QuizResponse } from "../../util/types";
import SolveQuizFormView from "./SolveQuizFormView";

export type QuizQuestion = {
  id: string;
  text: string;
};

interface SolveQuizFormProps {
  quiz: QuizResponse;
}

export type AnswerPayloadItem = {
  questionId: string;
  answer: boolean;
};

export default function SolveQuizForm({ quiz }: SolveQuizFormProps) {
  // boolean | null => null = not answered yet
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(() => {
    const initial: Record<string, boolean | null> = {};
    quiz.questions.forEach((q) => {
      initial[q.id] = null;
    });
    return initial;
  });

  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [firstUnansweredId, setFirstUnansweredId] = useState<number | null>(
    null
  );

  const handleSelectAnswer = (questionId: number, value: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    setSubmitted(false);
    setValidationError(null);
    setFirstUnansweredId(null);
  };

  const handleSubmit = () => {
    const firstUnanswered = quiz.questions.find((q) => answers[q.id] === null);

    if (firstUnanswered) {
      setSubmitted(false);
      setValidationError("Please answer all questions before submitting.");
      setFirstUnansweredId(firstUnanswered.id);
      return;
    }

    setValidationError(null);
    setFirstUnansweredId(null);

    const payload: AnswerPayloadItem[] = quiz.questions.map((q) => ({
      questionId: String(q.id),
      answer: answers[q.id] as boolean,
    }));

    console.log("Submitted answers payload:", payload);
    // later: API call

    setSubmitted(true);
  };

  const handleReset = () => {
    const reset: Record<string, boolean | null> = {};
    quiz.questions.forEach((q) => {
      reset[q.id] = null;
    });
    setAnswers(reset);
    setSubmitted(false);
    setValidationError(null);
    setFirstUnansweredId(null);
  };

  return (
    <SolveQuizFormView
      quizName={quiz.quizTitle}
      questions={quiz.questions}
      answers={answers}
      submitted={submitted}
      validationError={validationError}
      firstUnansweredId={firstUnansweredId}
      onSelectAnswer={handleSelectAnswer}
      onSubmit={handleSubmit}
      submitted={submitted}
      onReset={handleReset}
    />
  );
}
