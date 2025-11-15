import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../main";
import { createQuiz, deleteQuiz, getQuizList, type QuizTypeMock } from "./util";

export const useQuizList = () => {
  return useQuery({
    queryKey: ["quizList"],
    queryFn: async () => await getQuizList(),
  });
};

export const useAddQuiz = (quiz: QuizTypeMock) => {
  return useMutation({
    mutationFn: async () => {
      await createQuiz(quiz);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizList"] });
    },
  });
};

export const useRemoveQuiz = (id: number) => {
  return useMutation({
    mutationFn: async () => {
      await deleteQuiz(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizList"] });
    },
  });
};
