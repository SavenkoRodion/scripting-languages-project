import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../main";
import type {
  CheckQuizSuccessResponse,
  QuizAnswers,
  QuizCreateDto,
} from "./types";
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

export const useCheckQuiz = () => {
  return useMutation({
    mutationFn: async ({
      quizId,
      completedQuiz,
    }: {
      quizId: number;
      completedQuiz: QuizAnswers;
    }): Promise<CheckQuizSuccessResponse> => {
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
