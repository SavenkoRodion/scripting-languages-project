export type BackendQuizResult = {
  quiz_id: number;
  quiz_title: string;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  score_percentage: number;
  passed: boolean;
  results: {
    question_id: number;
    correct: boolean;
    user_answer: boolean;
    correct_answer: boolean;
  }[];
};

// Example quiz (what user saw & answered) – SAME as SolveQuizPage
const exampleQuiz = {
  id: "1",
  name: "JavaScript Basics",
  questions: [
    {
      id: "1",
      text: "In JavaScript, the expression typeof null returns 'object'.",
    },
    {
      id: "2",
      text: "Variables declared with let can be redeclared in the same scope.",
    },
    {
      id: "3",
      text: "The strict equality operator (===) compares both value and type.",
    },
    {
      id: "4",
      text: "NaN === NaN evaluates to true.",
    },
    {
      id: "5",
      text: "Arrow functions have their own 'this' binding.",
    },
    {
      id: "6",
      text: "The DOM in web development stands for Document Object Model.",
    },
    {
      id: "7",
      text: "JSON is a data format that can only be used by JavaScript.",
    },
    {
      id: "8",
      text: "Array.prototype.map creates and returns a new array.",
    },
    {
      id: "9",
      text: "setTimeout with a delay of 0 milliseconds runs before all synchronous code.",
    },
    {
      id: "10",
      text: "Using const to declare an array means you can never change the array’s contents.",
    },
  ],
};

// Example backend evaluation for that quiz
const exampleResult: BackendQuizResult = {
  quiz_id: 1,
  quiz_title: "JavaScript Basics",
  total_questions: 10,
  correct_answers: 7,
  incorrect_answers: 3,
  score_percentage: 70.0,
  passed: true,
  results: [
    // Q1: correct (True, True)
    {
      question_id: 1,
      correct: true,
      user_answer: true,
      correct_answer: true,
    },
    // Q2: correct (False, False)
    {
      question_id: 2,
      correct: true,
      user_answer: false,
      correct_answer: false,
    },
    // Q3: correct (True, True)
    {
      question_id: 3,
      correct: true,
      user_answer: true,
      correct_answer: true,
    },
    // Q4: incorrect (user True, correct False)
    {
      question_id: 4,
      correct: false,
      user_answer: true,
      correct_answer: false,
    },
    // Q5: correct (False, False)
    {
      question_id: 5,
      correct: true,
      user_answer: false,
      correct_answer: false,
    },
    // Q6: correct (True, True)
    {
      question_id: 6,
      correct: true,
      user_answer: true,
      correct_answer: true,
    },
    // Q7: incorrect (user True, correct False)
    {
      question_id: 7,
      correct: false,
      user_answer: true,
      correct_answer: false,
    },
    // Q8: incorrect (user False, correct True)
    {
      question_id: 8,
      correct: false,
      user_answer: false,
      correct_answer: true,
    },
    // Q9: correct (False, False)
    {
      question_id: 9,
      correct: true,
      user_answer: false,
      correct_answer: false,
    },
    // Q10: correct (False, False)
    {
      question_id: 10,
      correct: true,
      user_answer: false,
      correct_answer: false,
    },
  ],
};

function classNames(...classes: Array<string | boolean | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ResultQuizPage() {
  // For now we ignore router state and just use example data
  const quiz = exampleQuiz;
  const result = exampleResult;

  const {
    quiz_title,
    total_questions,
    correct_answers,
    incorrect_answers,
    score_percentage,
    passed,
    results,
  } = result;

  return (
    <div className="space-y-8">
      {/* Header / summary */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {quiz_title || quiz.name}
            </h1>
            <p className="text-xs/5 text-gray-500">
              {total_questions} questions ·{" "}
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

      {/* Question-by-question breakdown */}
      <div className="space-y-5">
        {results.map((item, index) => {
          const question = quiz.questions.find(
            (q) => Number(q.id) === item.question_id
          );

          const isCorrect = item.correct;
          const userAnswerLabel = item.user_answer ? "True" : "False";
          const correctAnswerLabel = item.correct_answer ? "True" : "False";

          return (
            <div
              key={item.question_id}
              className={classNames(
                "rounded-xl border bg-white/80 p-4 shadow-sm transition-all sm:p-5",
                "hover:shadow-md",
                isCorrect
                  ? "border-green-200 bg-green-50/60"
                  : "border-red-200 bg-red-50/60"
              )}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      Question {index + 1}
                    </span>
                    <span
                      className={classNames(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                        isCorrect
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </span>

                  <p className="text-sm/6 text-gray-900">
                    {question?.text ?? "Question text not available"}
                  </p>
                </div>

                <div className="mt-1 flex flex-row gap-3 text-xs/5 text-gray-700 sm:flex-col sm:items-end">
                  <div>
                    <span className="font-medium text-gray-900">
                      Your answer:{" "}
                    </span>
                    <span
                      className={classNames(
                        "inline-flex items-center rounded-full px-2 py-0.5 font-semibold",
                        isCorrect
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {userAnswerLabel}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      Correct answer:{" "}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-gray-800">
                      {correctAnswerLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
