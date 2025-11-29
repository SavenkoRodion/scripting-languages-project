// CreateQuizFormView.tsx
import type { ReactNode } from "react";
import {
  Controller,
  type FieldArrayWithId,
  type UseFormReturn,
} from "react-hook-form";
import type { QuizFormValues } from "./CreateQuizForm";

interface CreateQuizFormViewProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  form: UseFormReturn<QuizFormValues>;
  questions: FieldArrayWithId<QuizFormValues, "questions", "id">[];
  addQuestion: () => void;
  removeQuestion: (index: number) => void;
}

export default function CreateQuizFormView({
  onSubmit,
  form,
  questions,
  addQuestion,
  removeQuestion,
}: CreateQuizFormViewProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-12">
        {/* QUIZ NAME */}
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Quiz
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Name your quiz and define its questions.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="quiz-name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Quiz name
              </label>
              <div className="mt-2">
                <input
                  id="quiz-name"
                  type="text"
                  placeholder="e.g. JavaScript True/False"
                  {...register("name")}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.name.message as ReactNode}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* QUESTIONS (TRUE/FALSE) */}
        <div className="border-b border-gray-900/10 pb-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base/7 font-semibold text-gray-900">
                Questions
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Each question has a True/False answer.
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
                      onClick={() => removeQuestion(index)}
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
                        type="text"
                        {...register(`questions.${index}.text` as const)}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        placeholder="e.g. JavaScript is dynamically typed."
                      />
                    </div>
                    {errors.questions?.[index]?.text && (
                      <p className="mt-2 text-sm text-red-600">
                        {
                          errors.questions?.[index]?.text
                            ?.message as ReactNode
                        }
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="block text-sm/6 font-medium text-gray-900">
                      Correct answer
                    </span>

                    <Controller
                      name={`questions.${index}.correctAnswer` as const}
                      control={control}
                      render={({ field }) => (
                        <div className="mt-3 flex flex-wrap gap-6">
                          <label className="inline-flex items-center gap-2 text-sm/6 text-gray-900">
                            <input
                              type="radio"
                              value="true"
                              checked={field.value === true}
                              onChange={() => field.onChange(true)}
                              className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span>True</span>
                          </label>

                          <label className="inline-flex items-center gap-2 text-sm/6 text-gray-900">
                            <input
                              type="radio"
                              value="false"
                              checked={field.value === false}
                              onChange={() => field.onChange(false)}
                              className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span>False</span>
                          </label>
                        </div>
                      )}
                    />

                    {errors.questions?.[index]?.correctAnswer && (
                      <p className="mt-2 text-sm text-red-600">
                        {
                          errors.questions?.[index]?.correctAnswer
                            ?.message as ReactNode
                        }
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>
            ))}

            {typeof errors.questions?.message === "string" && (
              <p className="mt-2 text-sm text-red-600">
                {errors.questions.message}
              </p>
            )}
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
