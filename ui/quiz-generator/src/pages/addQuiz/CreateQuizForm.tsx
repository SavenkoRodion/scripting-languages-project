// CreateQuizForm.tsx
import { z } from "zod";
import {
  useForm,
  useFieldArray,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateQuizFormView from "./CreateQuizFormView";

const quizSchema = z.object({
  name: z.string().min(1, "Quiz name is required"),
  questions: z
    .array(
      z.object({
        text: z.string().min(1, "Question text is required"),
        correctAnswer: z.boolean({
          message: "Please select the correct answer",
        }),
      })
    )
    .min(1, "Add at least one question"),
});


export type QuizFormValues = z.infer<typeof quizSchema>;

export default function CreateQuizForm() {
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      name: "",
      questions: [
        {
          text: "",
          correctAnswer: true,
        },
      ],
    },
    mode: "onSubmit",
  });

  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit: SubmitHandler<QuizFormValues> = (values) => {
    const payload = {
      name: values.name,
      questions: values.questions.map((q, index) => ({
        id: index + 1,
        text: q.text,
        correctAnswer: q.correctAnswer,
      })),
    };

    console.log("Quiz to save:", payload);
    // later: API / localStorage / navigation etc.
  };

  const handleAddQuestion = () => {
    append({ text: "", correctAnswer: true });
  };

  const handleRemoveQuestion = (index: number) => {
    if (fields.length <= 1) return; // don't remove last question
    remove(index);
  };

  return (
    <CreateQuizFormView
      onSubmit={handleSubmit(onSubmit)}
      form={form}
      questions={fields}
      addQuestion={handleAddQuestion}
      removeQuestion={handleRemoveQuestion}
    />
  );
}
