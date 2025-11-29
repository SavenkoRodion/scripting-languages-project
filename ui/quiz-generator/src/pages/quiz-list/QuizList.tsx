import { useQuizList } from "../../util/hooks";

export default function QuizList() {
  const { data: quizList } = useQuizList();
  return (
    <div>
      <h1>QuizList</h1>
      {quizList?.length && quizList.map((x) => <>quiz name: {x.name}</>)}
    </div>
  );
}
