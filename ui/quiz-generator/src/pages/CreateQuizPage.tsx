import { type FormEvent, useState } from "react";
import { z } from "zod";
import { useAddQuiz } from "../util/hooks";
import type { QuestionCreateDto } from "../util/types";

const DifficultySchema = z.enum(["Easy", "Medium", "Hard"]);

const QuestionSchema = z.object({
  id: z.string().uuid(),
  question: z.string().trim().min(1, "Question text is required"),
  answer: z.boolean(),
});

const QuizSchema = z.object({
  title: z.string().trim().min(1, "Quiz title is required"),
  description: z.string().trim().min(1, "Description is required"),
  difficulty: DifficultySchema,
  questions: z.array(QuestionSchema).min(1, "Add at least one question"),
});

type FormErrors = {
  title?: string;
  description?: string;
  difficulty?: string;
  form?: string;
  questions?: Record<string, string>; // keyed by question.id
};

export default function CreateQuizPage() {
  const [quizTitle, setQuizTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] =
    useState<z.infer<typeof DifficultySchema>>("Easy");

  const [questions, setQuestions] = useState<
    Array<QuestionCreateDto & { id: string }>
  >([{ id: crypto.randomUUID(), question: "", answer: true }]);

  const [errors, setErrors] = useState<FormErrors>({});

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), question: "", answer: true },
    ]);
  };

  // ✅ FIX: update the "question" field (not "text")
  const updateQuestionText = (id: string, questionText: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, question: questionText } : q))
    );

    // Optional nicety: clear that question's error as you type
    setErrors((prev) => {
      if (!prev.questions?.[id]) return prev;
      const { [id]: _, ...rest } = prev.questions;
      return { ...prev, questions: rest };
    });
  };

  const updateQuestionAnswer = (id: string, answer: boolean) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answer } : q))
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => {
      if (prev.length === 1) return prev; // don't remove last question
      return prev.filter((q) => q.id !== id);
    });

    setErrors((prev) => {
      if (!prev.questions?.[id]) return prev;
      const { [id]: _, ...rest } = prev.questions;
      return { ...prev, questions: rest };
    });
  };

  const addMutation = useAddQuiz();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = QuizSchema.safeParse({
      title: quizTitle,
      description,
      difficulty,
      questions,
    });

    if (!result.success) {
      const nextErrors: FormErrors = { questions: {} };

      for (const issue of result.error.issues) {
        const [root, index, field] = issue.path;

        if (root === "title") nextErrors.title = issue.message;
        else if (root === "description") nextErrors.description = issue.message;
        else if (root === "difficulty") nextErrors.difficulty = issue.message;
        else if (root === "questions") {
          // If it's about a specific question field: ['questions', 0, 'question']
          if (typeof index === "number") {
            const qId = questions[index]?.id;
            if (qId) {
              nextErrors.questions![qId] = issue.message;
            } else {
              nextErrors.form = issue.message;
            }
          } else {
            // array-level error like "Add at least one question"
            nextErrors.form = issue.message;
          }
        } else {
          nextErrors.form = issue.message;
        }
      }

      // clean empty questions object
      if (
        nextErrors.questions &&
        Object.keys(nextErrors.questions).length === 0
      ) {
        delete nextErrors.questions;
      }

      setErrors(nextErrors);
      return;
    }

    // ✅ payload you’ll send (strip local id if backend doesn’t want it)
    const payload = {
      title: result.data.title,
      description: result.data.description,
      difficulty: result.data.difficulty, // remove if your API doesn't accept it
      questions: result.data.questions.map(({ id, ...rest }) => rest),
    };

    console.log("CreateQuiz payload:", payload);
    console.table(payload.questions);

    addMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        {/* QUIZ DETAILS */}
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Quiz details
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Define the basic information about your quiz.
          </p>

          {errors.form && (
            <p className="mt-4 text-sm text-red-600">{errors.form}</p>
          )}

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="quiz-title"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Quiz title
              </label>
              <div className="mt-2">
                <input
                  id="quiz-title"
                  name="quiz-title"
                  type="text"
                  placeholder="e.g. JavaScript True/False"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="quiz-description"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Short description
              </label>
              <div className="mt-2">
                <textarea
                  id="quiz-description"
                  name="quiz-description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="Describe what this quiz is about."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>
              <p className="mt-3 text-sm/6 text-gray-600">
                This description can be shown before someone starts the quiz.
              </p>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="difficulty"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Difficulty
              </label>
              <div className="mt-2">
                <select
                  id="difficulty"
                  name="difficulty"
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(
                      e.target.value as z.infer<typeof DifficultySchema>
                    )
                  }
                  className="block w-full rounded-md bg-white py-1.5 px-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
                {errors.difficulty && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.difficulty}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* QUESTIONS (YES/NO) */}
        <div className="border-b border-gray-900/10 pb-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base/7 font-semibold text-gray-900">
                Questions
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Each question has a Yes/No answer. Add as many as you need.
              </p>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              + Add question
            </button>
          </div>

          <div className="mt-10 space-y-6">
            {questions.map((question, index) => (
              <fieldset
                key={question.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <legend className="text-sm/6 font-semibold text-gray-900">
                    Question {index + 1}
                  </legend>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor={`q-${question.id}-text`}
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Question text
                    </label>
                    <div className="mt-2">
                      <input
                        id={`q-${question.id}-text`}
                        name={`q-${question.id}-text`}
                        type="text"
                        value={question.question}
                        onChange={(e) =>
                          updateQuestionText(question.id, e.target.value)
                        }
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        placeholder="e.g. JavaScript is dynamically typed."
                      />
                      {errors.questions?.[question.id] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.questions[question.id]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="block text-sm/6 font-medium text-gray-900">
                      Correct answer
                    </span>
                    <div className="mt-3 flex flex-wrap gap-6">
                      <label className="inline-flex items-center gap-2 text-sm/6 text-gray-900">
                        <input
                          type="radio"
                          name={`q-${question.id}-correct`}
                          value="yes"
                          checked={question.answer}
                          onChange={() =>
                            updateQuestionAnswer(question.id, true)
                          }
                          className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <span>Yes</span>
                      </label>

                      <label className="inline-flex items-center gap-2 text-sm/6 text-gray-900">
                        <input
                          type="radio"
                          name={`q-${question.id}-correct`}
                          value="no"
                          checked={!question.answer}
                          onChange={() =>
                            updateQuestionAnswer(question.id, false)
                          }
                          className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </fieldset>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save quiz
        </button>
      </div>
    </form>
  );
}
