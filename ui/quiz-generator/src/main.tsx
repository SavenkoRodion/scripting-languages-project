// src/main.tsx lub src/index.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import "./index.css";
import CreateQuizPage from "./pages/CreateQuizPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import QuizListPage from "./pages/QuizListPage.tsx";
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
            <Route index element={<HomePage />} />

            {/* AddQuiz → "/create-quiz" (already implemented) */}
            <Route path="create-quiz" element={<CreateQuizPage />} />

            {/* QuizzesList → "/quizzes" */}
            <Route path="quizzes" element={<QuizListPage />} />

            {/* Single Quiz → "/quizzes/:quizId" */}
            <Route path="quizzes/:quizId" element={<SolveQuizPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
