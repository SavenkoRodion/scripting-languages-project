import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../main";
import type { QuizAnswer, QuizCreateDto } from "./types";
import { checkQuiz, createQuiz, getQuizList } from "./util";

export const useQuizList = () => {
  return useQuery({
    queryKey: ["quizList"],
    queryFn: async () => await getQuizList(),
  });
};

export const useAddQuiz = () => {
  return useMutation({
    mutationFn: async (quiz: QuizCreateDto) => {
      await createQuiz(quiz);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizList"] });
    },
  });
};

export const useCheckQuiz = (quizId: number, completedQuiz: QuizAnswer) => {
  return useQuery({
    queryKey: ["quizAnswer", quizId, completedQuiz],
    queryFn: async () => {
      return await checkQuiz(quizId, completedQuiz);
    },
  });
};

// export const useRemoveQuiz = (id: string) => {
//   return useMutation({
//     mutationFn: async () => {
//       await deleteQuiz(id);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["quizList"] });
//     },
//   });
// };
