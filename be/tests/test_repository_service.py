import json
import os
import tempfile
import unittest

from app.models import Question, Quiz, QuizCreateDto, QuestionCreateDto, QuizAnswers, AnswerDto
from app.services import RepositoryService, QuizService

from unittest.mock import MagicMock, patch

class TestRepositoryService(unittest.TestCase):
    def setUp(self):
        self.tmp_file = tempfile.NamedTemporaryFile(delete=False)
        self.tmp_file.close()
        self.repo = RepositoryService(file_path=self.tmp_file.name)

    def tearDown(self):
        if os.path.exists(self.tmp_file.name):
            os.remove(self.tmp_file.name)
        self.repo._reset_singleton_for_tests()

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
        self.repo.addQuiz(quiz2)

        result = self.repo.getQuizById(2)

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

class TestQuizService(unittest.TestCase):
    def setUp(self):
        # 1. Reset singletona przed każdym testem
        QuizService._reset_singleton_for_tests()

        # 2. Tworzymy prawdziwy QuizService
        self.service = QuizService()

        # 3. Podmieniamy repozytorium na mock
        self.repo_mock = MagicMock(spec=RepositoryService)
        self.service._repository = self.repo_mock

    @patch("app.services.ResponseFactory")
    def test_get_all_quizes_uses_repository_and_response_factory(self, rf_mock):
        quizzes = [
            Quiz(quizId=1, quizTitle="Quiz 1", questions=[]),
            Quiz(quizId=2, quizTitle="Quiz 2", questions=[]),
        ]
        self.repo_mock.getAllQuizzes.return_value = quizzes

        # ResponseFactory.quizzes_to_responses ma zwrócić jakąś listę DTO
        rf_mock.quizzes_to_responses.return_value = ["resp1", "resp2"]

        result = self.service.get_all_quizes()

        self.repo_mock.getAllQuizzes.assert_called_once()
        rf_mock.quizzes_to_responses.assert_called_once_with(quizzes)
        self.assertEqual(result, ["resp1", "resp2"])

    # ---------- get_quiz ----------

    @patch("app.services.ResponseFactory")
    def test_get_quiz_existing(self, rf_mock):
        quiz = Quiz(quizId=1, quizTitle="Quiz 1", questions=[])
        self.repo_mock.getQuizById.return_value = quiz
        rf_mock.quiz_to_response.return_value = "quiz_response"

        result = self.service.get_quiz(1)

        self.repo_mock.getQuizById.assert_called_once_with(1)
        rf_mock.quiz_to_response.assert_called_once_with(quiz)
        self.assertEqual(result, "quiz_response")

    @patch("app.services.ResponseFactory")
    def test_get_quiz_not_existing_returns_none(self, rf_mock):
        self.repo_mock.getQuizById.return_value = None

        result = self.service.get_quiz(999)

        self.repo_mock.getQuizById.assert_called_once_with(999)
        rf_mock.quiz_to_response.assert_not_called()
        self.assertIsNone(result)

    # ---------- create_quiz ----------

    @patch("app.services.ResponseFactory")
    def test_create_quiz_generates_id_adds_quiz_and_returns_response(self, rf_mock):
        # istnieją już quizy o id 1 i 5
        existing_quizzes = [
            Quiz(quizId=1, quizTitle="Old 1", questions=[]),
            Quiz(quizId=5, quizTitle="Old 5", questions=[]),
        ]
        self.repo_mock.getAllQuizzes.return_value = existing_quizzes

        quiz_data = QuizCreateDto(
            title="New quiz",
            description="desc",
            questions=[
                QuestionCreateDto(question="Q1", answer=True),
                QuestionCreateDto(question="Q2", answer=False),
            ],
        )

        rf_mock.quiz_to_response.return_value = "created_response"

        created_quiz_captured = {}

        def add_quiz_side_effect(q):
            created_quiz_captured["quiz"] = q

        self.repo_mock.addQuiz.side_effect = add_quiz_side_effect

        result = self.service.create_quiz(quiz_data)

        # nowe ID = max(1,5) + 1 = 6
        self.repo_mock.getAllQuizzes.assert_called_once()
        self.repo_mock.addQuiz.assert_called_once()
        rf_mock.quiz_to_response.assert_called_once()

        self.assertEqual(result, "created_response")

        created_quiz = created_quiz_captured["quiz"]
        self.assertEqual(created_quiz.quizId, 6)
        self.assertEqual(created_quiz.quizTitle, "New quiz")
        self.assertEqual(created_quiz.description, "desc")
        self.assertEqual(len(created_quiz.questions), 2)
        self.assertEqual(created_quiz.questions[0].id, 1)
        self.assertEqual(created_quiz.questions[0].question, "Q1")
        self.assertTrue(created_quiz.questions[0].answer)
        self.assertEqual(created_quiz.questions[1].id, 2)
        self.assertEqual(created_quiz.questions[1].question, "Q2")
        self.assertFalse(created_quiz.questions[1].answer)

    # ---------- delete_quiz ----------

    def test_delete_quiz_success(self):
        self.repo_mock.deleteQuiz.return_value = True

        result = self.service.delete_quiz(3)

        self.repo_mock.deleteQuiz.assert_called_once_with(3)
        self.assertEqual(
            result,
            {"success": True, "message": "Quiz 3 deleted successfully"},
        )

    def test_delete_quiz_not_found(self):
        self.repo_mock.deleteQuiz.return_value = False

        result = self.service.delete_quiz(3)

        self.repo_mock.deleteQuiz.assert_called_once_with(3)
        self.assertEqual(
            result,
            {"success": False, "message": "Quiz 3 not found"},
        )

    # ---------- check_quiz ----------

    def test_check_quiz_not_found(self):
        self.repo_mock.getQuizById.return_value = None

        answers = QuizAnswers(answers=[AnswerDto(id=1, answer=True)])

        result = self.service.check_quiz(10, answers)

        self.repo_mock.getQuizById.assert_called_once_with(10)
        self.assertEqual(
            result,
            {"error": "Quiz not found", "quizId": 10},
        )

    def test_check_quiz_scoring_and_results(self):
        # quiz z 3 pytaniami
        quiz = Quiz(
            quizId=1,
            quizTitle="Sample quiz",
            questions=[
                Question(id=1, question="Q1", answer=True),
                Question(id=2, question="Q2", answer=False),
                Question(id=3, question="Q3", answer=True),
            ],
        )
        self.repo_mock.getQuizById.return_value = quiz

        # użytkownik:
        # - Q1: True (poprawne)
        # - Q2: True (błędne)
        # - Q3: True (poprawne)
        answers = QuizAnswers(
            answers=[
                AnswerDto(id=1, answer=True),
                AnswerDto(id=2, answer=True),
                AnswerDto(id=3, answer=True),
            ]
        )

        result = self.service.check_quiz(1, answers)

        self.repo_mock.getQuizById.assert_called_once_with(1)

        self.assertEqual(result["quizId"], 1)
        self.assertEqual(result["quizTitle"], "Sample quiz")
        self.assertEqual(result["totalQuestions"], 3)
        self.assertEqual(result["correctAnswers"], 2)
        self.assertEqual(result["incorrectAnswers"], 1)
        self.assertTrue(result["passed"])
        self.assertAlmostEqual(result["scorePercentage"], 66.67, places=2)

        self.assertEqual(len(result["results"]), 3)

        q1_res = next(r for r in result["results"] if r["questionId"] == 1)
        q2_res = next(r for r in result["results"] if r["questionId"] == 2)
        q3_res = next(r for r in result["results"] if r["questionId"] == 3)

        self.assertTrue(q1_res["correct"])
        self.assertFalse(q2_res["correct"])
        self.assertTrue(q3_res["correct"])