import axios from "axios";
import type { QuizCreateDto, QuizResponse } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getQuizList(): Promise<QuizResponse[]> {
  return (await api.get<QuizResponse[]>("quizes")).data;
}

export async function createQuiz(
  quizCreateRequest: QuizCreateDto
): Promise<QuizResponse> {
  return (await api.post<QuizResponse>("quizes/create", quizCreateRequest))
    .data;
}

// export async function deleteQuiz(id: string): Promise<boolean> {
//   // const quizList = await getQuizList();
//   // const index = quizList.findIndex((x) => x.quizId === id);
//   // quizList.splice(index, 1);
//   return true;
// }
