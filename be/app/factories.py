from typing import List
from .models import Quiz, Question, QuizResponse, QuestionResponse


class ResponseFactory:

    @staticmethod
    def quiz_to_response(quiz: Quiz) -> QuizResponse:
        question_responses = [
            ResponseFactory.question_to_response(q) for q in quiz.questions
        ]
        
        return QuizResponse(
            quizId=quiz.quizId,
            quizTitle=quiz.quizTitle,
            description=quiz.description,
            questions=question_responses
        )
    
    @staticmethod
    def question_to_response(question: Question) -> QuestionResponse:
        return QuestionResponse(
            id=question.id,
            question=question.question
        )
    
    @staticmethod
    def quizzes_to_responses(quizzes: List[Quiz]) -> List[QuizResponse]:
        return [ResponseFactory.quiz_to_response(quiz) for quiz in quizzes]
