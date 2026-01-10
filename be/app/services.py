import json
import logging
from typing import List, Optional
from pathlib import Path

from .decorators import singleton
from .models import Quiz, Question, QuizResponse, QuizAnswers, QuizCreateDto
from .factories import ResponseFactory

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@singleton
class RepositoryService:
    def __init__(self, file_path: str = "/data/quizzes.json"):
        self._file_path = Path(file_path)
        logger.info(f"RepositoryService initialized with file_path: {self._file_path}")
        logger.info(f"File path absolute: {self._file_path.absolute()}")
        logger.info(f"File exists: {self._file_path.exists()}")

    def getAllQuizzes(self) -> List[Quiz]:
        logger.info("=" * 80)
        logger.info("getAllQuizzes called")
        logger.info(f"File path: {self._file_path}")
        logger.info(f"File path absolute: {self._file_path.absolute()}")
        logger.info(f"File exists: {self._file_path.exists()}")
        
        if not self._file_path.exists():
            logger.warning(f"File does not exist: {self._file_path}")
            logger.warning(f"Returning empty list")
            return []

        try:
            logger.info("Opening file for reading...")
            with self._file_path.open("r", encoding="utf-8") as f:
                file_content = f.read()
                logger.info(f"File content length: {len(file_content)} characters")
                logger.debug(f"File content (first 500 chars): {file_content[:500]}")
                
                # Reset file pointer to beginning
                f.seek(0)
                data = json.load(f)
                
            logger.info(f"JSON parsed successfully, type: {type(data)}")
            logger.info(f"Number of items in JSON: {len(data) if isinstance(data, list) else 'N/A'}")
            
            if isinstance(data, list):
                logger.debug(f"First item in data: {data[0] if data else 'empty list'}")
            
            # data to lista dictów → zamieniamy na listę Quiz
            quizzes = [Quiz(**item) for item in data]
            logger.info(f"Successfully parsed {len(quizzes)} quizzes")
            for idx, quiz in enumerate(quizzes):
                logger.debug(f"Quiz {idx}: ID={quiz.quizId}, Title={quiz.quizTitle}, Questions={len(quiz.questions)}")
            
            return quizzes
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            logger.error(f"Error at line {e.lineno}, column {e.colno}")
            return []
        except OSError as e:
            logger.error(f"OS error reading file: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error in getAllQuizzes: {type(e).__name__}: {e}")
            logger.exception("Full traceback:")
            return []

    def addQuiz(self, quiz: Quiz) -> None:
        logger.info("=" * 80)
        logger.info("addQuiz called")
        logger.info(f"Quiz to add: ID={quiz.quizId}, Title={quiz.quizTitle}")
        logger.info(f"Quiz has {len(quiz.questions)} questions")
        
        logger.info("Fetching existing quizzes...")
        quizzes = self.getAllQuizzes()
        logger.info(f"Found {len(quizzes)} existing quizzes")
        
        quizzes.append(quiz)
        logger.info(f"Appended new quiz, total count now: {len(quizzes)}")

        # Pydantic: zamiana modeli na dict
        try:
            logger.info("Converting quizzes to serializable format...")
            serializable = [q.model_dump() for q in quizzes]  # v2
            # jeśli masz Pydantic v1, użyj zamiast tego:
            # serializable = [q.dict() for q in quizzes]
            logger.info(f"Successfully serialized {len(serializable)} quizzes")
            logger.debug(f"Serialized data type: {type(serializable)}")
        except Exception as e:
            logger.error(f"Error serializing quizzes: {type(e).__name__}: {e}")
            logger.exception("Full traceback:")
            raise

        try:
            logger.info(f"Opening file for writing: {self._file_path}")
            logger.info(f"File path absolute: {self._file_path.absolute()}")
            
            # Create parent directory if it doesn't exist
            self._file_path.parent.mkdir(parents=True, exist_ok=True)
            logger.info(f"Parent directory exists: {self._file_path.parent.exists()}")
            
            with self._file_path.open("w", encoding="utf-8") as f:
                json.dump(serializable, f, ensure_ascii=False, indent=2)
                logger.info("JSON dumped to file successfully")
            
            logger.info("File written successfully")
            
            # Verify the write
            if self._file_path.exists():
                file_size = self._file_path.stat().st_size
                logger.info(f"File exists after write, size: {file_size} bytes")
            else:
                logger.error("File does not exist after write operation!")
                
        except OSError as e:
            logger.error(f"OS error writing file: {e}")
            logger.exception("Full traceback:")
            raise
        except Exception as e:
            logger.error(f"Unexpected error in addQuiz: {type(e).__name__}: {e}")
            logger.exception("Full traceback:")
            raise

    def getQuizById(self, quiz_id: int) -> Optional[Quiz]:
        logger.info("=" * 80)
        logger.info(f"getQuizById called with quiz_id: {quiz_id}")
        
        quizzes = self.getAllQuizzes()
        logger.info(f"Retrieved {len(quizzes)} quizzes to search")
        
        for idx, quiz in enumerate(quizzes):
            logger.debug(f"Checking quiz {idx}: ID={quiz.quizId}")
            if quiz.quizId == quiz_id:
                logger.info(f"Found quiz with ID {quiz_id}: {quiz.quizTitle}")
                return quiz
        
        logger.warning(f"Quiz with ID {quiz_id} not found")
        return None

    def deleteQuiz(self, quiz_id: int) -> bool:
        logger.info("=" * 80)
        logger.info(f"deleteQuiz called with quiz_id: {quiz_id}")
        
        quizzes = self.getAllQuizzes()
        original_len = len(quizzes)
        logger.info(f"Retrieved {original_len} quizzes")

        quizzes = [q for q in quizzes if q.quizId != quiz_id]
        logger.info(f"After filtering, {len(quizzes)} quizzes remain")

        if len(quizzes) == original_len:
            logger.warning(f"Quiz {quiz_id} not found, nothing to delete")
            return False

        try:
            logger.info("Serializing remaining quizzes...")
            serializable = [q.model_dump() for q in quizzes]
            # albo q.dict() dla Pydantic v1

            logger.info(f"Writing {len(serializable)} quizzes to file...")
            with self._file_path.open("w", encoding="utf-8") as f:
                json.dump(serializable, f, ensure_ascii=False, indent=2)
            
            logger.info(f"Quiz {quiz_id} deleted successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting quiz: {type(e).__name__}: {e}")
            logger.exception("Full traceback:")
            raise

@singleton
class QuizService:
    def __init__(self):
        logger.info("QuizService initialized")
        self._repository = RepositoryService()
        logger.info("QuizService repository ready")

    def get_all_quizes(self) -> List[QuizResponse]:
        logger.info("=" * 80)
        logger.info("QuizService.get_all_quizes called")
        
        quizzes = self._repository.getAllQuizzes()
        logger.info(f"Repository returned {len(quizzes)} quizzes")
        
        responses = ResponseFactory.quizzes_to_responses(quizzes)
        logger.info(f"Converted to {len(responses)} responses")
        
        return responses

    def get_quiz(self, quiz_id: int) -> Optional[QuizResponse]:
        logger.info("=" * 80)
        logger.info(f"QuizService.get_quiz called with quiz_id: {quiz_id}")
        
        quiz = self._repository.getQuizById(quiz_id)
        
        if quiz:
            logger.info(f"Quiz found: {quiz.quizTitle}")
            response = ResponseFactory.quiz_to_response(quiz)
            logger.info("Converted to response")
            return response
        
        logger.warning(f"Quiz {quiz_id} not found")
        return None

    def create_quiz(self, quiz_data: QuizCreateDto) -> QuizResponse:
        logger.info("=" * 80)
        logger.info("QuizService.create_quiz called")
        logger.info(f"Quiz title: {quiz_data.title}")
        logger.info(f"Quiz description: {quiz_data.description}")
        logger.info(f"Number of questions: {len(quiz_data.questions)}")
        
        existing_quizzes = self._repository.getAllQuizzes()
        logger.info(f"Found {len(existing_quizzes)} existing quizzes")
        
        new_id = max([q.quizId for q in existing_quizzes], default=0) + 1
        logger.info(f"New quiz ID will be: {new_id}")

        questions = [
            Question(
                id=idx + 1,
                question=q.question,
                answer=q.answer
            )
            for idx, q in enumerate(quiz_data.questions)
        ]
        logger.info(f"Created {len(questions)} Question objects")

        new_quiz = Quiz(
            quizId=new_id,
            quizTitle=quiz_data.title,
            description=quiz_data.description,
            questions=questions
        )
        logger.info(f"Created Quiz object: ID={new_quiz.quizId}, Title={new_quiz.quizTitle}")

        logger.info("Saving quiz to repository...")
        self._repository.addQuiz(new_quiz)
        logger.info("Quiz saved successfully")
        
        response = ResponseFactory.quiz_to_response(new_quiz)
        logger.info("Converted to response")
        
        return response

    def delete_quiz(self, quiz_id: int) -> dict:
        logger.info("=" * 80)
        logger.info(f"QuizService.delete_quiz called with quiz_id: {quiz_id}")
        
        success = self._repository.deleteQuiz(quiz_id)
        logger.info(f"Delete operation result: {success}")

        if success:
            result = {
                "success": True,
                "message": f"Quiz {quiz_id} deleted successfully"
            }
            logger.info(f"Returning success response")
            return result
        else:
            result = {
                "success": False,
                "message": f"Quiz {quiz_id} not found"
            }
            logger.warning(f"Returning failure response")
            return result

    def check_quiz(self, quiz_id: int, answers: QuizAnswers) -> dict:
        logger.info("=" * 80)
        logger.info(f"QuizService.check_quiz called with quiz_id: {quiz_id}")
        logger.info(f"Received {len(answers.answers)} answers to check")
        
        quiz = self._repository.getQuizById(quiz_id)

        if not quiz:
            logger.error(f"Quiz {quiz_id} not found for checking")
            return {
                "error": "Quiz not found",
                "quizId": quiz_id
            }

        logger.info(f"Quiz found: {quiz.quizTitle} with {len(quiz.questions)} questions")
        correct_answers = {q.id: q.answer for q in quiz.questions}
        logger.debug(f"Correct answers map: {correct_answers}")

        results = []
        correct_count = 0

        for answer_dto in answers.answers:
            question_id = answer_dto.id
            user_answer = answer_dto.answer
            logger.debug(f"Checking answer for question {question_id}: user={user_answer}")

            if question_id in correct_answers:
                correct_answer = correct_answers[question_id]
                is_correct = correct_answer == user_answer
                logger.debug(f"Question {question_id}: correct={correct_answer}, user={user_answer}, match={is_correct}")

                if is_correct:
                    correct_count += 1

                results.append({
                    "questionId": question_id,
                    "correct": is_correct,
                    "userAnswer": user_answer,
                    "correctAnswer": correct_answer
                })
            else:
                logger.warning(f"Question {question_id} not found in quiz")
                results.append({
                    "questionId": question_id,
                    "error": "Question not found in quiz"
                })

        total_questions = len(quiz.questions)
        score_percentage = (correct_count / total_questions * 100) if total_questions > 0 else 0

        logger.info(f"Check complete: {correct_count}/{total_questions} correct ({score_percentage:.2f}%)")

        return {
            "quizId": quiz_id,
            "quizTitle": quiz.quizTitle,
            "totalQuestions": total_questions,
            "correctAnswers": correct_count,
            "incorrectAnswers": total_questions - correct_count,
            "scorePercentage": round(score_percentage, 2),
            "passed": score_percentage >= 60,
            "results": results
        }
