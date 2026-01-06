import { Link } from "react-router";
import { useQuizList } from "../util/hooks";

export default function QuizListPage() {
  const { data: quizList } = useQuizList();

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {quizList?.length
        ? quizList.map((quiz) => (
            <li
              key={quiz.quizId}
              className="col-span-1 flex flex-col rounded-lg bg-white shadow-sm border border-gray-200"
            >
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-medium text-gray-900">
                  {quiz.quizTitle}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{quiz.description}</p>

                <dl className="mt-4 space-y-1 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <dt>Questions</dt>
                    <dd>{quiz.questions.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Difficulty</dt>
                    <dd>{/* TODO */}Difficulty mock</dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-gray-200 px-4 py-3">
                {/* Na razie prowadzi do ogólnej strony solve-quiz.
               Później możesz zrobić np. /solve-quiz/:id */}
                <Link
                  to={`/quizzes/${quiz.quizId}`}
                  className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Solve this quiz
                </Link>
              </div>
            </li>
          ))
        : "There is no quiz created yet!"}
    </ul>
  );
}
