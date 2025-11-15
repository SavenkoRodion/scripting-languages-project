export type QuestionMock = {
  question: string;
  correctAnswer: boolean;
};

export type QuizTypeMock = {
  id: number;
  name: string;
  questions: QuestionMock[];
};

const QUIZ_LIST_MOCK: QuizTypeMock[] = [
  {
    id: 1,
    name: "who are you?",
    questions: [
      { question: "Are you Lolek?", correctAnswer: false },
      { question: "Are you Bolek?", correctAnswer: false },
      { question: "Are you Alkoholek?", correctAnswer: true },
    ],
  },
];

export async function getQuizList(): Promise<QuizTypeMock[]> {
  return QUIZ_LIST_MOCK;
}

export async function createQuiz(quiz: QuizTypeMock): Promise<boolean> {
  QUIZ_LIST_MOCK.push(quiz);
  return true;
}

export async function deleteQuiz(id: number): Promise<boolean> {
  QUIZ_LIST_MOCK.splice(id, 1);
  return true;
}

// export function editQuiz() {
//   return QUIZ_LIST_MOCK;
// }
