# Quiz API Documentation

## API Endpoints

### GET `/quizes`

**Response:**
```json
[
  {
    "quizId": 1,
    "quizTitle": "Python Basics",
    "description": "Test your Python knowledge",
    "questions": [
      {"id": 1, "question": "Python is a compiled language"}
    ]
  }
]
```


### GET `/quizes/{quiz_id}`

**Response:**
```json
{
  "quizId": 1,
  "quizTitle": "Python Basics",
  "description": "Test your Python knowledge",
  "questions": [
    {"id": 1, "question": "Python is a compiled language"},
    {"id": 2, "question": "FastAPI is built on Starlette"}
  ]
}
```


### POST `/quizes/create`

**Request:**
```json
{
  "title": "Python Basics",
  "description": "A beginner-friendly Python quiz",
  "questions": [
    {
      "question": "Python is a compiled language",
      "answer": false
    },
    {
      "question": "FastAPI supports async",
      "answer": true
    }
  ]
}
```

**Response:**
```json
{
  "quizId": 2,
  "quizTitle": "Python Basics",
  "description": "A beginner-friendly Python quiz",
  "questions": [
    {"id": 1, "question": "Python is a compiled language"},
    {"id": 2, "question": "FastAPI supports async"}
  ]
}
```

---

### DELETE `/quizes/{quiz_id}`

**Response:**
```json
{
  "success": true,
  "message": "Quiz 1 deleted successfully"
}
```


### POST `/quizes/{quiz_id}/check`

**Request:**
```json
{
  "answers": [
    {"id": 1, "answer": false},
    {"id": 2, "answer": true}
  ]
}
```

**Response:**
```json
{
  "quiz_id": 1,
  "quiz_title": "Python Basics",
  "total_questions": 2,
  "correct_answers": 2,
  "incorrect_answers": 0,
  "score_percentage": 100.0,
  "passed": true,
  "results": [
    {
      "question_id": 1,
      "correct": true,
      "user_answer": false,
      "correct_answer": false
    },
    {
      "question_id": 2,
      "correct": true,
      "user_answer": true,
      "correct_answer": true
    }
  ]
}
```