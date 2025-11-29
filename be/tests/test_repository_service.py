import json
import os
import tempfile
import unittest

from app.models import Question, Quiz
from app.services import RepositoryService

class TestRepositoryService(unittest.TestCase):
    def setUp(self):
        self.tmp_file = tempfile.NamedTemporaryFile(delete=False)
        self.tmp_file.close()
        self.repo = RepositoryService(file_path=self.tmp_file.name)

    def tearDown(self):
        if os.path.exists(self.tmp_file.name):
            os.remove(self.tmp_file.name)

    def test_getAllQuizzes_empty_file_returns_empty_list(self):

        quizzes = self.repo.getAllQuizzes()
        self.assertEqual(quizzes, [])

    def test_addQuiz_and_getAllQuizzes(self):
        q1 = Question(id=1, question="Question 1", answer=True)
        quiz = Quiz(quizId=1, quizTitle="Test quiz", questions=[q1])

        self.repo.addQuiz(quiz)

        loaded_quizzes = self.repo.getAllQuizzes()

        assert len(loaded_quizzes) == 1
        loaded_quiz = loaded_quizzes[0]
        assert loaded_quiz.quizId == 1
        assert loaded_quiz.quizTitle == "Test quiz"
        assert len(loaded_quiz.questions) == 1
        assert loaded_quiz.questions[0].question == "Question 1"

    def test_get_quiz_by_id_found(self):
        q1 = Question(id=1, question="Question 1", answer=True)
        q2 = Question(id=2, question="Question 2", answer=False)

        quiz1 = Quiz(quizId=1, quizTitle="Quiz 1", questions=[q1])
        quiz2 = Quiz(quizId=2, quizTitle="Quiz 2", questions=[q2])

        self.repo.addQuiz(quiz1)
        self.addQuiz(quiz2)

        result = self.getQuizById(2)

        assert result is not None
        assert result.quizId == 2
        assert result.quizTitle == "Quiz 2"
        assert len(result.questions) == 1
        assert result.questions[0].question == "Question 2"

    def test_get_quiz_by_id_not_found(self):
        q1 = Question(id=1, question="Question 1", answer=True)
        quiz1 = Quiz(quizId=1, quizTitle="Quiz 1", questions=[q1])
        self.repo.addQuiz(quiz1)

        result = self.repo.getQuizById(999)

        assert result is None

    def test_delete_quiz_existing(self):
        q1 = Question(id=1, question="Question 1", answer=True)
        q2 = Question(id=2, question="Question 2", answer=False)

        quiz1 = Quiz(quizId=1, quizTitle="Quiz 1", questions=[q1])
        quiz2 = Quiz(quizId=2, quizTitle="Quiz 2", questions=[q2])

        self.repo.addQuiz(quiz1)
        self.repo.addQuiz(quiz2)

        # usuwamy quiz o ID = 1
        deleted = self.repo.deleteQuiz(1)
        assert deleted is True

        quizzes = self.repo.getAllQuizzes()
        ids = [q.quizId for q in quizzes]

        assert len(quizzes) == 1
        assert 1 not in ids
        assert 2 in ids

    def test_delete_quiz_not_existing(self):
        q1 = Question(id=1, question="Question 1", answer=True)
        quiz1 = Quiz(quizId=1, quizTitle="Quiz 1", questions=[q1])
        self.repo.addQuiz(quiz1)

        # próbujemy usunąć nieistniejący quiz
        deleted = self.repo.deleteQuiz(999)

        assert deleted is False

        # dane w pliku powinny zostać bez zmian
        quizzes = self.repo.getAllQuizzes()
        assert len(quizzes) == 1
        assert quizzes[0].quizId == 1