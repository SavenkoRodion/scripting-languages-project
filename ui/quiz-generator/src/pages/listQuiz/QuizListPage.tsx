// src/pages/listQuiz/QuizListPage.tsx
import { Link } from "react-router";

type QuizListItem = {
  id: string;
  name: string;
};

const quizzes: QuizListItem[] = [
  { id: "1", name: "JavaScript Basics" },
  { id: "2", name: "TypeScript Fundamentals" },
  { id: "3", name: "React & Hooks" },
  { id: "4", name: "Web APIs & Browser" },
];

export default function QuizListPage() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Available quizzes
        </h1>
        <p className="text-sm text-gray-600">
          Pick a quiz to solve. Each one is a True/False quiz.
        </p>
      </header>

      <ul
        role="list"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {quizzes.map((quiz) => (
          <li
            key={quiz.id}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex flex-1 flex-col gap-2 p-4">
              <h3 className="text-sm font-semibold text-gray-900">
                {quiz.name}
              </h3>
              <p className="text-xs text-gray-500">
                True/False quiz · click below to start.
              </p>
            </div>

            <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
              <Link
                to={`/quizzes/${quiz.id}`}
                className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition group-hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Solve this quiz
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
