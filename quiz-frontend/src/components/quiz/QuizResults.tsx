import React from 'react';

interface IncorrectAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  questionIndex: number;
}

interface QuizResultsProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  totalQuestions: number;
  incorrectAnswers: IncorrectAnswer[];
  onRetakeQuiz: () => void;
  onReviewQuestion: (questionIndex: number) => void;
}

export default function QuizResults({
  isOpen,
  onClose,
  score,
  totalQuestions,
  incorrectAnswers,
  onRetakeQuiz,
  onReviewQuestion
}: QuizResultsProps) {
  if (!isOpen) return null;
  
  const percentage = (score / totalQuestions) * 100;
  const isPassing = percentage >= 70;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Quiz Results</h2>
        </div>
        
        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="text-4xl font-bold mb-2">
              {score} / {totalQuestions}
            </div>
            <div className={`text-xl ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
              {percentage.toFixed(1)}% {isPassing ? 'Passed' : 'Failed'}
            </div>
          </div>
          
          {incorrectAnswers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Incorrect Answers</h3>
              <div className="space-y-4">
                {incorrectAnswers.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="font-medium mb-2">{item.question}</div>
                    <div className="text-sm text-red-600 mb-1">
                      Your answer: {item.userAnswer || 'Not answered'}
                    </div>
                    <div className="text-sm text-green-600 mb-3">
                      Correct answer: {item.correctAnswer}
                    </div>
                    <button
                      onClick={() => onReviewQuestion(item.questionIndex)}
                      className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded"
                    >
                      Review Question
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <button
              onClick={onRetakeQuiz}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Retake Quiz
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}