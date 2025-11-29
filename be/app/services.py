import json
from typing import List, Optional
from pathlib import Path

from .decorators import singleton
from .models import Quiz, Question, QuizResponse, QuizAnswers, QuizCreateDto
from .factories import ResponseFactory

@singleton
class RepositoryService:
    def __init__(self, file_path: str = "be/data/quizzes.json"):
        self._file_path = Path(file_path)

    def getAllQuizzes(self) -> List[Quiz]:
        if not self._file_path.exists():
            return []

        try:
            with self._file_path.open("r", encoding="utf-8") as f:
                data = json.load(f)
        except (json.JSONDecodeError, OSError):
            return []

        quizzes: List[Quiz] = [Quiz(**item) for item in data]
        return quizzes

    def getQuizById(self, quiz_id: int) -> Optional[Quiz]:
        """Get a single quiz by ID"""
    def addQuiz(self, quiz: Quiz) -> None:
        """Add a new quiz to the repository"""
    def deleteQuiz(self, quiz_id: int) -> bool:
        """Delete a quiz by ID. Returns True if deleted, False if not found"""


@singleton
class QuizService:
    def __init__(self, repository: RepositoryService = None):
        self._repository = repository if repository else RepositoryService()

    def get_all_quizes(self) -> List[QuizResponse]:
        quizzes = self._repository.getAllQuizzes()
        return ResponseFactory.quizzes_to_responses(quizzes)

    def get_quiz(self, quiz_id: int) -> Optional[QuizResponse]:
        quiz = self._repository.getQuizById(quiz_id)
        if quiz:
            return ResponseFactory.quiz_to_response(quiz)
        return None

    def create_quiz(self, quiz_data: QuizCreateDto) -> QuizResponse:
        existing_quizzes = self._repository.getAllQuizzes()
        new_id = max([q.quizId for q in existing_quizzes], default=0) + 1
        
        questions = [
            Question(
                id=idx + 1,
                question=q.question,
                answer=q.answer
            )
            for idx, q in enumerate(quiz_data.questions)
        ]
        
        new_quiz = Quiz(
            quizId=new_id,
            quizTitle=quiz_data.title,
            description=quiz_data.description,
            questions=questions
        )
        
        self._repository.addQuiz(new_quiz)
        return ResponseFactory.quiz_to_response(new_quiz)

    def delete_quiz(self, quiz_id: int) -> dict:
        success = self._repository.deleteQuiz(quiz_id)
        
        if success:
            return {
                "success": True,
                "message": f"Quiz {quiz_id} deleted successfully"
            }
        else:
            return {
                "success": False,
                "message": f"Quiz {quiz_id} not found"
            }

    def check_quiz(self, quiz_id: int, answers: QuizAnswers) -> dict:
        quiz = self._repository.getQuizById(quiz_id)
        
        if not quiz:
            return {
                "error": "Quiz not found",
                "quizId": quiz_id
            }
        
        correct_answers = {q.id: q.answer for q in quiz.questions}
        
        results = []
        correct_count = 0
        
        for answer_dto in answers.answers:
            question_id = answer_dto.id
            user_answer = answer_dto.answer
            
            if question_id in correct_answers:
                correct_answer = correct_answers[question_id]
                is_correct = correct_answer == user_answer
                
                if is_correct:
                    correct_count += 1
                
                results.append({
                    "questionId": question_id,
                    "correct": is_correct,
                    "userAnswer": user_answer,
                    "correctAnswer": correct_answer
                })
            else:
                results.append({
                    "questionId": question_id,
                    "error": "Question not found in quiz"
                })
        
        total_questions = len(quiz.questions)
        score_percentage = (correct_count / total_questions * 100) if total_questions > 0 else 0

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
