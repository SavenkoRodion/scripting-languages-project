import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/Layout.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<>test</>} />

          <Route path="/create-quiz" element={<>test</>} />
          <Route path="/solve-quiz" element={<>test1</>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
