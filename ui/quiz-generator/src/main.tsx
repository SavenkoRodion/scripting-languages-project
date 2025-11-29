import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import CreateQuizPage from "./pages/addQuiz/CreateQuizPage.tsx";
import QuizListPage from "./pages/listQuiz/QuizListPage.tsx";
import SolveQuizPage from "./pages/solveQuiz/SolveQuizPage.tsx";
import ResultQuizPage from "./pages/resultQuiz/ResultQuizPage.tsx";
import { BrowserRouter, Routes, Route } from "react-router"; 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
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

          <Route path="create-quiz" element={<CreateQuizPage />} />

          <Route path="quizzes" element={<QuizListPage />} />

          <Route path="quizzes/:quizId" element={<SolveQuizPage />} />

          <Route
            path="quizzes/:quizId/results"
            element={<ResultQuizPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
