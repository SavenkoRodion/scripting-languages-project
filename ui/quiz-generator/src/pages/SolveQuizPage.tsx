import { type FormEvent, useState } from "react";

const quiz = {
  id: "1",
  name: "JavaScript Basics",
  description: "Test your knowledge of core JavaScript concepts using true/false questions.",
  questionsCount: 10,
  difficulty: "Easy",
  questions: [
    {
      id: "1",
      text: "In JavaScript, the expression typeof null returns 'object'.",
      correctAnswer: true,
    },
    {
      id: "2",
      text: "Variables declared with let can be redeclared in the same scope.",
      correctAnswer: false,
    },
    {
      id: "3",
      text: "The strict equality operator (===) compares both value and type.",
      correctAnswer: true,
    },
    {
      id: "4",
      text: "NaN === NaN evaluates to true.",
      correctAnswer: false,
    },
    {
      id: "5",
      text: "Arrow functions have their own 'this' binding.",
      correctAnswer: false,
    },
    {
      id: "6",
      text: "The DOM in web development stands for Document Object Model.",
      correctAnswer: true,
    },
    {
      id: "7",
      text: "JSON is a data format that can only be used by JavaScript.",
      correctAnswer: false,
    },
    {
      id: "8",
      text: "Array.prototype.map creates and returns a new array.",
      correctAnswer: true,
    },
    {
      id: "9",
      text: "setTimeout with a delay of 0 milliseconds runs before all synchronous code.",
      correctAnswer: false,
    },
    {
      id: "10",
      text: "Using const to declare an array means you can never change the array’s contents.",
      correctAnswer: false,
    },
  ],
};

function classNames(...classes: (string | boolean | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SolveQuizPage() {
  // boolean | null => null = not answered yet
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(() => {
    const initial: Record<string, boolean | null> = {};
    quiz.questions.forEach((q) => {
      initial[q.id] = null;
    });
    return initial;
  });

  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSelect = (questionId: string, value: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    setSubmitted(false);
    setScore(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    let correct = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });

    setScore(correct);
    setSubmitted(true);
  };

  const handleReset = () => {
    const reset: Record<string, boolean | null> = {};
    quiz.questions.forEach((q) => {
      reset[q.id] = null;
    });
    setAnswers(reset);
    setSubmitted(false);
    setScore(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {quiz.name}
        </h1>
        <p className="text-sm/6 text-gray-600">{quiz.description}</p>
        <p className="text-xs/5 text-gray-500">
          Difficulty:{" "}
          <span className="font-medium text-gray-900">{quiz.difficulty}</span>{" "}
          · {quiz.questions.length} questions
        </p>
      </div>

      {/* Feedback after submit */}
      {submitted && score !== null && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          You scored{" "}
          <span className="font-semibold">
            {score} / {quiz.questions.length}
          </span>
          . You can adjust your answers and submit again if you like.
        </div>
      )}

      {/* Questions */}
      <div className="space-y-5">
        {quiz.questions.map((question, index) => {
          const userAnswer = answers[question.id];
          const isCorrect =
            submitted && userAnswer !== null && userAnswer === question.correctAnswer;

          return (
            <div
              key={question.id}
              className={classNames(
                "rounded-xl border bg-white/80 p-4 shadow-sm transition-all sm:p-5",
                "hover:shadow-md ",
                submitted && userAnswer !== null
                  ? isCorrect
                    ? "border-green-300 bg-green-50/70"
                    : "border-red-300 bg-red-50/70"
                  : "border-gray-200"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                    Question {index + 1}
                  </span>
                  <p className="text-sm/6 text-gray-900">{question.text}</p>
                  <p className="text-xs/5 text-gray-500">
                    Choose whether you think this statement is true or false.
                  </p>
                </div>

                {submitted && userAnswer !== null && (
                  <span
                    className={classNames(
                      "hidden text-xs font-semibold sm:inline-flex sm:items-center sm:rounded-full sm:px-2 sm:py-0.5",
                      isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
                    {isCorrect ? "Correct" : "Incorrect"}
                  </span>
                )}
              </div>

              {/* True/False "checkbox" group */}
              <div className="mt-4">
                <div className="inline-flex rounded-lg bg-gray-100 p-0.5">
                  {/* TRUE option */}
                  <label
                    className={classNames(
                      "relative cursor-pointer rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors",
                      userAnswer === true
                        ? "bg-green-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <input
                      type="radio"
                      name={`answer-${question.id}`}
                      value="true"
                      className="sr-only"
                      checked={userAnswer === true}
                      onChange={() => handleSelect(question.id, true)}
                    />
                    True
                  </label>

                  {/* FALSE option */}
                  <label
                    className={classNames(
                      "relative cursor-pointer rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors",
                      userAnswer === false
                        ? "bg-red-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <input
                      type="radio"
                      name={`answer-${question.id}`}
                      value="false"
                      className="sr-only"
                      checked={userAnswer === false}
                      onChange={() => handleSelect(question.id, false)}
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
      <div className="mt-6 flex items-center justify-end gap-x-4">
        <button
          type="button"
          onClick={handleReset}
          className="text-sm/6 font-semibold text-gray-900"
        >
          Reset
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Submit answers
        </button>
      </div>
    </form>
  );
}
