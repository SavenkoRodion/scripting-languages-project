import json

from typing import List, Optional
from pathlib import Path

from dataclasses import asdict
from dacite import from_dict

from .decorators import singleton
from .models import Quiz


@singleton
class CounterService:
    def __init__(self):
        self.value = 0

    def incr2ement(self):
        self.value += 1
        return self.value

@singleton
class RepositoryService:
    def __init__(self, file_path: str = "quizzes.json"):
        self._file_path = Path(file_path)

    def getAllQuizzes(self) -> List[Quiz]:
        if not self._file_path.exists():
            return []

        try:
            with self._file_path.open("r", encoding="utf-8") as f:
                data = json.load(f)
        except (json.JSONDecodeError, OSError):
            return []

        # data to lista dictów → zamieniamy na listę Quiz
        return [Quiz(**item) for item in data]

    def addQuiz(self, quiz: Quiz) -> None:
        quizzes = self.getAllQuizzes()
        quizzes.append(quiz)

        # Pydantic: zamiana modeli na dict
        serializable = [q.model_dump() for q in quizzes]  # v2
        # jeśli masz Pydantic v1, użyj zamiast tego:
        # serializable = [q.dict() for q in quizzes]

        with self._file_path.open("w", encoding="utf-8") as f:
            json.dump(serializable, f, ensure_ascii=False, indent=2)

    def getQuizById(self, quiz_id: int) -> Optional[Quiz]:
        quizzes = self.getAllQuizzes()
        for quiz in quizzes:
            if quiz.quizId == quiz_id:
                return quiz
        return None

    def deleteQuiz(self, quiz_id: int) -> bool:
        quizzes = self.getAllQuizzes()
        original_len = len(quizzes)

        quizzes = [q for q in quizzes if q.quizId != quiz_id]

        if len(quizzes) == original_len:
            return False

        serializable = [q.model_dump() for q in quizzes]
        # albo q.dict() dla Pydantic v1

        with self._file_path.open("w", encoding="utf-8") as f:
            json.dump(serializable, f, ensure_ascii=False, indent=2)

        return True
