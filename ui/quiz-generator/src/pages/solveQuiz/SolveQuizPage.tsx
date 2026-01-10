// SolveQuizPage.tsx (example usage)
import { useParams } from "react-router";
import { useQuizList } from "../../util/hooks";
import SolveQuizForm from "./SolveQuizForm";

export default function SolveQuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const { data: quizList } = useQuizList();
  const quiz = quizList?.filter((x) => String(x.quizId) === quizId)[0];

  return (
    <div className="space-y-8">
      {quizId && quiz ? <SolveQuizForm quiz={quiz} /> : "Loading..."}
    </div>
  );
}
