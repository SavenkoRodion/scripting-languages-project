from typing import List
from pydantic import BaseModel


class Question(BaseModel):
    id: int
    question: str
    answer: bool


class Quiz(BaseModel):
    quizId: int
    quizTitle: str
    description: str = ""
    questions: List[Question]


class QuestionCreateDto(BaseModel):
    question: str
    answer: bool


class QuizCreateDto(BaseModel):
    title: str
    description: str
    questions: List[QuestionCreateDto]


class AnswerDto(BaseModel):
    id: int
    answer: bool


class QuizAnswers(BaseModel):
    answers: List[AnswerDto]


class QuestionResponse(BaseModel):
    id: int
    question: str


class QuizResponse(BaseModel):
    quizId: int
    quizTitle: str
    description: str
    questions: List[QuestionResponse]
