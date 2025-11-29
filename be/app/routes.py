from fastapi import APIRouter, Depends

from .models import QuizAnswers, QuizCreateDto
from .services import QuizService

router = APIRouter()


@router.get("/quizes")
def get_all_quizes(quiz_service: QuizService = Depends()):
    return quiz_service.get_all_quizes()


@router.get("/quizes/{quiz_id}")
def get_quiz(quiz_id: int, quiz_service: QuizService = Depends()):
    return quiz_service.get_quiz(quiz_id)


@router.post("/quizes/create")
def create_quiz(quiz_data: QuizCreateDto, quiz_service: QuizService = Depends()):
    return quiz_service.create_quiz(quiz_data)


@router.delete("/quizes/{quiz_id}")
def delete_quiz(quiz_id: int, quiz_service: QuizService = Depends()):
    return quiz_service.delete_quiz(quiz_id)


@router.post("/quizes/{quiz_id}/check")
def check_quiz(quiz_id: int, answers: QuizAnswers, quiz_service: QuizService = Depends()):
    return quiz_service.check_quiz(quiz_id, answers)
