import json

from typing import List
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

        # zakładamy, że data to lista słowników reprezentujących Quiz
        quizzes: List[Quiz] = [
            from_dict(data_class=Quiz, data=item) for item in data
        ]

        print(quizzes)

        return quizzes

    def addQuiz(self, quizzes: List[Quiz]) -> None:
        serializable = [asdict(q) for q in quizzes]

        with self._file_path.open("w", encoding="utf-8") as f:
            json.dump(serializable, f, ensure_ascii=False, indent=2)
