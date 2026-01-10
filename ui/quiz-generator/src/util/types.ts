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

export interface AnswerDto {
  id: number;
  answer: boolean;
}

export interface QuizAnswer {
  answers: AnswerDto[];
}

export type QuizAnswerValue = string | number | boolean | null;

export type CheckQuizResultItem = {
  questionId: number;
  correct: boolean;
  userAnswer: QuizAnswerValue;
  correctAnswer: QuizAnswerValue;
};

export interface CheckQuizSuccessResponse {
  quizId: number;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  scorePercentage: number;
  passed: boolean;
  results: CheckQuizResultItem[];
}
