// SolveQuizForm.tsx
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import SolveQuizFormView from "./SolveQuizFormView";

export type QuizQuestion = {
  id: string;
  text: string;
};

export type Quiz = {
  id: string;
  name: string;
  questions: QuizQuestion[];
};

interface SolveQuizFormProps {
  quiz: Quiz;
}

export type AnswerPayloadItem = {
  questionId: string;
  answer: boolean;
};

export default function SolveQuizForm({ quiz }: SolveQuizFormProps) {
  const navigate = useNavigate();

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
  const [firstUnansweredId, setFirstUnansweredId] = useState<string | null>(
    null
  );

  const handleSelectAnswer = (questionId: string, value: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    setSubmitted(false);
    setValidationError(null);
    setFirstUnansweredId(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const firstUnanswered = quiz.questions.find(
      (q) => answers[q.id] === null
    );

    if (firstUnanswered) {
      setSubmitted(false);
      setValidationError("Please answer all questions before submitting.");
      setFirstUnansweredId(firstUnanswered.id);
      return;
    }

    setValidationError(null);
    setFirstUnansweredId(null);

    const payload: AnswerPayloadItem[] = quiz.questions.map((q) => ({
      questionId: q.id,
      answer: answers[q.id] as boolean,
    }));

    console.log("Submitted answers payload:", payload);
    // later: API call

    setSubmitted(true);

    // redirect to result page; adjust path to match your routing
    navigate(`/quizzes/${quiz.id}/results`, {
      state: {
        quizId: quiz.id,
        quizName: quiz.name,
        answers: payload,
      },
    });
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
      quizName={quiz.name}
      questions={quiz.questions}
      answers={answers}
      submitted={submitted}
      validationError={validationError}
      firstUnansweredId={firstUnansweredId}
      onSelectAnswer={handleSelectAnswer}
      onSubmit={handleSubmit}
      onReset={handleReset}
    />
  );
}
