import unittest

from app.models import Question, Quiz
class TestQuestionAndQuiz(unittest.TestCase):
    def test_question_creation(self):
        q = Question(id=1, question="some question", answer=True)

        self.assertEqual(q.id, 1)
        self.assertEqual(q.question, "some question")
        self.assertTrue(q.answer)

    def test_quiz_creation(self):
        q1 = Question(1, "Question 1", True)
        q2 = Question(2, "Question 2", False)

        quiz = Quiz(
            quizId=10,
            quizTitle="My quiz",
            questions=[q1, q2],
        )

        self.assertEqual(quiz.quizId, 10)
        self.assertEqual(quiz.quizTitle, "My quiz")
        self.assertEqual(len(quiz.questions), 2)
        self.assertIsInstance(quiz.questions[0], Question)