// src/main.tsx lub src/index.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import CreateQuizPage from "./pages/CreateQuizPage.tsx";
import QuizListPage from "./pages/QuizListPage.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import SolveQuizPage from "./pages/SolveQuizPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Layout route */}
        <Route path="/" element={<App />}>
          {/* HomePage → "/" */}
          <Route
            index
            element={
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Home
                </h1>
                <p className="text-gray-700">
                  Welcome to your quiz app. Use the navigation to create new quizzes
                  or browse existing ones.
                </p>
              </div>
            }
          />

          {/* AddQuiz → "/create-quiz" (already implemented) */}
          <Route path="create-quiz" element={<CreateQuizPage />} />

          {/* QuizzesList → "/quizzes" */}
          <Route
            path="quizzes"
            element={<QuizListPage/>}
          />

          {/* Single Quiz → "/quizzes/:quizId" */}
          <Route
            path="quizzes/:quizId"
            element={<SolveQuizPage/>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
