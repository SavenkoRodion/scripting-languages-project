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
        q1 = Question(1, "Question 1", True)
        quiz = Quiz(quizId=1, quizTitle="Test", questions=[q1])

        self.repo.addQuiz([quiz])
        quizzes = self.repo.getAllQuizzes()

        self.assertEqual(len(quizzes), 1)
        loaded_quiz = quizzes[0]
        self.assertEqual(loaded_quiz.quizId, 1)
        self.assertEqual(loaded_quiz.quizTitle, "Test")
        self.assertEqual(len(loaded_quiz.questions), 1)
        self.assertEqual(loaded_quiz.questions[0].question, "Question 1")