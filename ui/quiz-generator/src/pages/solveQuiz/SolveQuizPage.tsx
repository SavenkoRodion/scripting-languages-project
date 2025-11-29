// SolveQuizPage.tsx (example usage)
import SolveQuizForm, { type Quiz } from "./SolveQuizForm";

const quiz: Quiz = {
  id: "1",
  name: "JavaScript Basics",
  questions: [
    {
      id: "1",
      text: "In JavaScript, the expression typeof null returns 'object'.",
    },
    {
      id: "2",
      text: "Variables declared with let can be redeclared in the same scope.",
    },
    {
      id: "3",
      text: "The strict equality operator (===) compares both value and type.",
    },
    {
      id: "4",
      text: "NaN === NaN evaluates to true.",
    },
    {
      id: "5",
      text: "Arrow functions have their own 'this' binding.",
    },
    {
      id: "6",
      text: "The DOM in web development stands for Document Object Model.",
    },
    {
      id: "7",
      text: "JSON is a data format that can only be used by JavaScript.",
    },
    {
      id: "8",
      text: "Array.prototype.map creates and returns a new array.",
    },
    {
      id: "9",
      text: "setTimeout with a delay of 0 milliseconds runs before all synchronous code.",
    },
    {
      id: "10",
      text: "Using const to declare an array means you can never change the array’s contents.",
    },
  ],
};

export default function SolveQuizPage() {
  return (
    <div className="space-y-8">
      <SolveQuizForm quiz={quiz} />
    </div>
  );
}
