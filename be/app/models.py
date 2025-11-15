from dataclasses import dataclass
from typing import List


@dataclass
class Question:
    id: int
    question: str
    answer: bool


@dataclass
class Quiz:
    quizId: int
    quizTitle: str
    questions: List[Question]