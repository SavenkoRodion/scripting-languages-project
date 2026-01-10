import logging
from fastapi import APIRouter, Depends, HTTPException, status

from ..models import QuizAnswers, QuizCreateDto
from ..services import QuizService

logger = logging.getLogger(__name__)

router = APIRouter()

def get_quiz_service() -> QuizService:
    return QuizService()


@router.get("/quizes")
def get_all_quizes(quiz_service: QuizService = Depends(get_quiz_service)):
    logger.info("=" * 80)
    logger.info("GET /quizes - Request received")
    
    try:
        result = quiz_service.get_all_quizes()
        logger.info(f"GET /quizes - Returning {len(result)} quizzes")
        return result
    except Exception as e:
        logger.error(f"GET /quizes - Error: {type(e).__name__}: {e}")
        logger.exception("Full traceback:")
        raise


@router.get("/quizes/{quiz_id}")
def get_quiz(quiz_id: int, quiz_service: QuizService = Depends(get_quiz_service)):
    logger.info("=" * 80)
    logger.info(f"GET /quizes/{quiz_id} - Request received")
    
    try:
        result = quiz_service.get_quiz(quiz_id)
        if result:
            logger.info(f"GET /quizes/{quiz_id} - Quiz found and returned")
            return result
        else:
            logger.warning(f"GET /quizes/{quiz_id} - Quiz not found, returning 404")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Quiz with ID {quiz_id} not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"GET /quizes/{quiz_id} - Error: {type(e).__name__}: {e}")
        logger.exception("Full traceback:")
        raise


@router.post("/quizes/create", status_code=status.HTTP_201_CREATED)
def create_quiz(quiz_data: QuizCreateDto, quiz_service: QuizService = Depends(get_quiz_service)):
    logger.info("=" * 80)
    logger.info("POST /quizes/create - Request received")
    logger.info(f"Quiz title: {quiz_data.title}")
    logger.info(f"Quiz description: {quiz_data.description}")
    logger.info(f"Number of questions: {len(quiz_data.questions)}")
    
    try:
        result = quiz_service.create_quiz(quiz_data)
        logger.info(f"POST /quizes/create - Quiz created successfully with ID: {result.quizId}")
        return result
    except Exception as e:
        logger.error(f"POST /quizes/create - Error: {type(e).__name__}: {e}")
        logger.exception("Full traceback:")
        raise


@router.delete("/quizes/{quiz_id}")
def delete_quiz(quiz_id: int, quiz_service: QuizService = Depends(get_quiz_service)):
    logger.info("=" * 80)
    logger.info(f"DELETE /quizes/{quiz_id} - Request received")
    
    try:
        result = quiz_service.delete_quiz(quiz_id)
        logger.info(f"DELETE /quizes/{quiz_id} - Result: {result}")
        
        if result.get("success"):
            return result
        else:
            logger.warning(f"DELETE /quizes/{quiz_id} - Quiz not found, returning 404")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=result.get("message", f"Quiz with ID {quiz_id} not found")
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"DELETE /quizes/{quiz_id} - Error: {type(e).__name__}: {e}")
        logger.exception("Full traceback:")
        raise


@router.post("/quizes/{quiz_id}/check")
def check_quiz(quiz_id: int, answers: QuizAnswers, quiz_service: QuizService = Depends(get_quiz_service)):
    logger.info("=" * 80)
    logger.info(f"POST /quizes/{quiz_id}/check - Request received")
    logger.info(f"Number of answers submitted: {len(answers.answers)}")
    
    try:
        result = quiz_service.check_quiz(quiz_id, answers)
        
        if "error" in result:
            logger.warning(f"POST /quizes/{quiz_id}/check - Quiz not found, returning 404")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=result.get("error", f"Quiz with ID {quiz_id} not found")
            )
        
        logger.info(f"POST /quizes/{quiz_id}/check - Check completed")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"POST /quizes/{quiz_id}/check - Error: {type(e).__name__}: {e}")
        logger.exception("Full traceback:")
        raise
