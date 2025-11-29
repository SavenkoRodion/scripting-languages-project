export type QuizTypeMock = {
  id: string;
  name: string;
  description: string;
  questionsCount: number;
  difficulty: string;
};

export type YesNo = "yes" | "no";

export interface QuestionMock {
  id: number;
  text: string;
  correctAnswer: YesNo;
}

export type CreateQuizPayloadMock = {
  title: string;
  description: string;
  difficulty: string;
  questions: QuestionMock[];
};

const QUIZ_LIST_MOCK: QuizTypeMock[] = [
  {
    id: "1",
    name: "JavaScript Basics",
    description: "Test your knowledge of variables, functions, and arrays.",
    questionsCount: 10,
    difficulty: "Easy",
  },
  {
    id: "2",
    name: "TypeScript Fundamentals",
    description: "Interfaces, types, generics and more.",
    questionsCount: 12,
    difficulty: "Medium",
  },
  {
    id: "3",
    name: "React & Hooks",
    description: "useState, useEffect and component patterns.",
    questionsCount: 15,
    difficulty: "Medium",
  },
  {
    id: "4",
    name: "Web APIs & Browser",
    description: "DOM, Fetch API, localStorage and events.",
    questionsCount: 8,
    difficulty: "Hard",
  },
];

export async function getQuizList() {
  return QUIZ_LIST_MOCK;
}

export async function createQuiz(
  quiz: CreateQuizPayloadMock
): Promise<boolean> {
  //This mess has only one purpose - to get largest id
  const { id: largestId } = QUIZ_LIST_MOCK.reduce((maxObj, current) => {
    const currentIdNum = parseInt(current.id, 10);
    const maxIdNum = parseInt(maxObj.id, 10);
    return currentIdNum > maxIdNum ? current : maxObj;
  }, QUIZ_LIST_MOCK[0]);
  const newId = `${largestId + 1}`;
  QUIZ_LIST_MOCK.push({
    id: newId,
    name: quiz.title,
    questionsCount: quiz.questions.length,
    ...quiz,
  });

  return true;
}

export async function deleteQuiz(id: string): Promise<boolean> {
  const index = QUIZ_LIST_MOCK.findIndex((x) => x.id === id);
  QUIZ_LIST_MOCK.splice(index, 1);
  return true;
}
