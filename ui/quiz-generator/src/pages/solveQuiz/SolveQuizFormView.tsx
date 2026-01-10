// SolveQuizFormView.tsx
import { useEffect } from "react";
import type { QuestionResponse } from "../../util/types";

function classNames(...classes: Array<string | boolean | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface SolveQuizFormViewProps {
  quizName: string;
  questions: QuestionResponse[];
  answers: Record<string, boolean | null>;
  submitted: boolean;
  validationError: string | null;
  firstUnansweredId: number | null;
  onSubmit: () => void;
  onReset: () => void;
  onSelectAnswer: (questionId: number, value: boolean) => void;
}

export default function SolveQuizFormView({
  quizName,
  questions,
  answers,
  submitted,
  validationError,
  firstUnansweredId,
  onSubmit,
  onReset,
  onSelectAnswer,
}: SolveQuizFormViewProps) {
  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q) => answers[q.id] !== null).length;

  // Scroll to first unanswered question when validation fails
  useEffect(() => {
    if (!firstUnansweredId) return;

    const el = document.getElementById(`question-${firstUnansweredId}`);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      const input = el.querySelector(
        'input[type="radio"]'
      ) as HTMLInputElement | null;
      input?.focus();
    }
  }, [firstUnansweredId]);

  const correct_answers = 1;
  const incorrect_answers = 1;
  const passed = 1;
  const score_percentage = 1;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-8"
    >
      {/* Header */}
      {!submitted ? (
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {quizName}
          </h1>
          <p className="text-xs/5 text-gray-500">
            {totalQuestions} questions ·{" "}
            <span className="font-medium text-gray-900">
              {answeredCount}/{totalQuestions}
            </span>{" "}
            answered
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {quizName}
              </h1>
              <p className="text-xs/5 text-gray-500">
                {totalQuestions} questions ·{" "}
                <span className="font-medium text-gray-900">
                  {correct_answers} correct
                </span>{" "}
                ·{" "}
                <span className="font-medium text-gray-900">
                  {incorrect_answers} incorrect
                </span>
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <span
                className={classNames(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                  passed
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                {passed ? "Passed" : "Failed"}
              </span>
              <div className="text-sm text-gray-700">
                Score:{" "}
                <span className="font-semibold text-gray-900">
                  {score_percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2">
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className={classNames(
                  "h-2 rounded-full",
                  passed ? "bg-green-500" : "bg-red-500"
                )}
                style={{ width: `${Math.min(score_percentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Global validation error */}
      {validationError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {validationError}
        </div>
      )}

      {/* Feedback after successful submit */}
      {submitted && !validationError && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          Your answers have been submitted.
        </div>
      )}

      {/* Questions */}
      <div className="space-y-5">
        {questions.map((question, index) => {
          const userAnswer = answers[question.id];
          const isFirstUnansweredWithError =
            !!validationError &&
            firstUnansweredId === question.id &&
            userAnswer === null;

          return (
            <div
              key={question.id}
              id={`question-${question.id}`}
              className={classNames(
                "rounded-xl border bg-white/80 p-4 shadow-sm transition-all sm:p-5",
                "hover:shadow-md",
                isFirstUnansweredWithError
                  ? "border-red-300 bg-red-50/70"
                  : "border-gray-200"
              )}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                    Question {index + 1}
                  </span>
                  <p className="text-sm/6 text-gray-900">{question.question}</p>
                  <p className="text-xs/5 text-gray-500">
                    Choose whether you think this statement is true or false.
                  </p>
                </div>

                {isFirstUnansweredWithError && (
                  <span className="mt-1 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
                    Please answer this question
                  </span>
                )}
              </div>

              {/* True/False "button" group, mobile-friendly */}
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-2 sm:inline-flex sm:gap-3 sm:bg-gray-100 sm:p-0.5 sm:rounded-lg">
                  {/* TRUE option */}
                  <label
                    className={classNames(
                      "relative flex items-center justify-center rounded-md px-3 py-2 text-xs sm:text-sm font-medium transition-colors border",
                      "focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-1",
                      userAnswer === true
                        ? "bg-green-600 text-white border-green-600 shadow-sm"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50 sm:bg-transparent sm:hover:bg-gray-200"
                    )}
                  >
                    <input
                      type="radio"
                      name={`answer-${question.id}`}
                      value="true"
                      className="sr-only"
                      checked={userAnswer === true}
                      onChange={() => onSelectAnswer(question.id, true)}
                    />
                    True
                  </label>

                  {/* FALSE option */}
                  <label
                    className={classNames(
                      "relative flex items-center justify-center rounded-md px-3 py-2 text-xs sm:text-sm font-medium transition-colors border",
                      "focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-1",
                      userAnswer === false
                        ? "bg-red-600 text-white border-red-600 shadow-sm"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50 sm:bg-transparent sm:hover:bg-gray-200"
                    )}
                  >
                    <input
                      type="radio"
                      name={`answer-${question.id}`}
                      value="false"
                      className="sr-only"
                      checked={userAnswer === false}
                      onChange={() => onSelectAnswer(question.id, false)}
                    />
                    False
                  </label>
                </div>

                {/* Little text showing current selection */}
                <p className="mt-2 text-xs/5 text-gray-500">
                  Selected:{" "}
                  {userAnswer === null ? (
                    <span className="italic text-gray-400">none</span>
                  ) : userAnswer ? (
                    <span className="font-medium text-green-700">True</span>
                  ) : (
                    <span className="font-medium text-red-700">False</span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
        <button
          type="button"
          onClick={() => {
            onReset();
          }}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 sm:w-auto"
        >
          Reset
        </button>
        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
        >
          Submit answers
        </button>
      </div>
    </form>
  );
}
