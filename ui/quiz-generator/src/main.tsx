// src/main.tsx lub src/index.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import "./index.css";
import CreateQuizPage from "./pages/CreateQuizPage.tsx";
import QuizListPage from "./pages/QuizListPage.tsx";
import ResultQuizPage from "./pages/resultQuiz/ResultQuizPage.tsx";
import SolveQuizPage from "./pages/solveQuiz/SolveQuizPage.tsx";

export const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
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
                    Welcome to your quiz app. Use the navigation to create new
                    quizzes or browse existing ones.
                  </p>
                </div>
              }
            />

            {/* AddQuiz → "/create-quiz" (already implemented) */}
            <Route path="create-quiz" element={<CreateQuizPage />} />

            {/* QuizzesList → "/quizzes" */}
            <Route path="quizzes" element={<QuizListPage />} />
          <Route
            path="quizzes/:quizId/results"
            element={<ResultQuizPage />}
          />
            {/* Single Quiz → "/quizzes/:quizId" */}
            <Route path="quizzes/:quizId" element={<SolveQuizPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
