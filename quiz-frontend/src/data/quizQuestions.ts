import { Question } from '../types/quiz';

export const questions: Question[] = [
  {
    id: 1,
    question: "What is a primary key in a database?",
    options: [
      { id: 1, text: "A key used for encryption" },
      { id: 2, text: "A unique identifier for records" },
      { id: 3, text: "A key that links tables" },
      { id: 4, text: "A key used for indexing" },
    ],
    correctOptionId: 2,
  },
  // ... rest of your questions array
];