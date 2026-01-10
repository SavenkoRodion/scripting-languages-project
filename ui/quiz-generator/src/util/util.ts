import axios from "axios";
import type { QuizAnswer, QuizCreateDto, QuizResponse } from "./types";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getQuizList(): Promise<QuizResponse[]> {
  console.log(`api call to ${import.meta.env.VITE_BACKEND_URL}`);
  return (await api.get<QuizResponse[]>("quizes")).data;
}

export async function createQuiz(
  quizCreateRequest: QuizCreateDto
): Promise<QuizResponse> {
  return (await api.post<QuizResponse>("quizes/create", quizCreateRequest))
    .data;
}

export async function checkQuiz(
  quizId: number,
  quizCheckRequest: QuizAnswer
): Promise<QuizResponse> {
  return (
    await api.post<QuizResponse>(`quizes/${quizId}/check`, quizCheckRequest)
  ).data;
}

// export async function deleteQuiz(id: string): Promise<boolean> {
//   // const quizList = await getQuizList();
//   // const index = quizList.findIndex((x) => x.quizId === id);
//   // quizList.splice(index, 1);
//   return true;
// }
