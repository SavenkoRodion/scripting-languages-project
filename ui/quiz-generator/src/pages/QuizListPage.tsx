import { Link } from "react-router";

const quizzes = [
    {
        id: "1",
        name: "JavaScript Basics",
        description: "Test your knowledge of variables, functions, and arrays.",
        questionsCount: 10,
        difficulty: "Easy",
    },
    {
        id: "2",
        name: "TypeScript Fundamentals",
        description: "Interfaces, types, generics and more.",
        questionsCount: 12,
        difficulty: "Medium",
    },
    {
        id: "3",
        name: "React & Hooks",
        description: "useState, useEffect and component patterns.",
        questionsCount: 15,
        difficulty: "Medium",
    },
    {
        id: "4",
        name: "Web APIs & Browser",
        description: "DOM, Fetch API, localStorage and events.",
        questionsCount: 8,
        difficulty: "Hard",
    },
];

export default function QuizListPage() {
    return (
        <ul
            role="list"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
            {quizzes.map((quiz) => (
                <li
                    key={quiz.id}
                    className="col-span-1 flex flex-col rounded-lg bg-white shadow-sm border border-gray-200"
                >
                    <div className="flex flex-1 flex-col p-4">
                        <h3 className="text-sm font-medium text-gray-900">{quiz.name}</h3>
                        <p className="mt-2 text-sm text-gray-600">{quiz.description}</p>

                        <dl className="mt-4 space-y-1 text-sm text-gray-500">
                            <div className="flex justify-between">
                                <dt>Questions</dt>
                                <dd>{quiz.questionsCount}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Difficulty</dt>
                                <dd>{quiz.difficulty}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-3">
                        {/* Na razie prowadzi do ogólnej strony solve-quiz.
               Później możesz zrobić np. /solve-quiz/:id */}
                        <Link
                            to={`/quizzes/${quiz.id}`}
                            className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Solve this quiz
                        </Link>
                    </div>
                </li>
            ))}
        </ul>
    );
}
