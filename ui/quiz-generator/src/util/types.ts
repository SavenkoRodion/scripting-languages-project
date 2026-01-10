export interface QuestionCreateDto {
  question: string;
  answer: boolean;
}

export interface QuizCreateDto {
  title: string;
  description: string;
  questions: QuestionCreateDto[];
}

export interface AnswerDto {
  id: number;
  answer: boolean;
}

export interface QuizAnswers {
  answers: AnswerDto[];
}

export interface QuestionResponse {
  id: number;
  question: string;
}

export interface QuizResponse {
  quizId: number;
  quizTitle: string;
  description: string;
  questions: QuestionResponse[];
}
