export interface Option {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
  correctOptionId: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: Record<number, number>;
  markedForReview: Set<number>;
  timeLeft: number;
}