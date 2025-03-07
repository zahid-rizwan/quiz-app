import React from 'react';

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
  explanation: string;
  correctOptionId: number;
}

interface QuestionAreaProps {
  currentQuestion: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: number | undefined;
  isMarkedForReview: boolean;
  onMarkForReview: () => void;
  onSelectOption: (optionId: number) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  quizCompleted?: boolean;
  reviewMode?: boolean;
}

export default function QuestionArea({
  currentQuestion,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isMarkedForReview,
  onMarkForReview,
  onSelectOption,
  onNavigate,
  quizCompleted = false,
  reviewMode = false
}: QuestionAreaProps) {
  
  const getOptionClass = (option: Option) => {
    if (!quizCompleted) {
      return selectedAnswer === option.id 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-300 hover:bg-gray-50';
    }
    
    // In completed quiz mode or review mode, show correct/incorrect answers
    if (option.id === currentQuestion.correctOptionId) {
      return 'border-green-500 bg-green-50'; // Correct answer
    } else if (selectedAnswer === option.id) {
      return 'border-red-500 bg-red-50'; // User's incorrect answer
    } else {
      return 'border-gray-300'; // Other options
    }
  };

  // Get option label (A, B, C, D) based on index
  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
  };
  
  return (
    <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between mb-4">
        <div className="text-sm text-gray-600">
          Question {currentIndex + 1} of {totalQuestions}
        </div>
        <button
          onClick={onMarkForReview}
          className={`text-sm px-2 py-1 rounded ${
            isMarkedForReview
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-600'
          }`}
          disabled={quizCompleted && !reviewMode}
        >
          {isMarkedForReview ? 'Marked for review' : 'Mark for review'}
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div
              key={option.id}
              className={`border p-3 rounded-lg cursor-pointer transition-all ${getOptionClass(option)}`}
              onClick={() => onSelectOption(option.id)}
            >
              <div className="flex items-start">
                <span className="inline-block w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 font-semibold">
                  {getOptionLabel(index)}
                </span>
                <span>{option.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(quizCompleted || reviewMode) && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Explanation:</h3>
          <p className="text-gray-600">{currentQuestion.explanation}</p>
          <div className="mt-2 text-sm text-green-700 font-medium">
            <strong>Correct answer:</strong> {getOptionLabel(currentQuestion.options.findIndex(opt => opt.isCorrect))}: {currentQuestion.options.find(opt => opt.isCorrect)?.text || ''}
          </div>
          {selectedAnswer !== currentQuestion.correctOptionId && selectedAnswer !== undefined && (
            <div className="mt-1 text-sm text-red-700 font-medium">
              <strong>Your answer:</strong> {getOptionLabel(currentQuestion.options.findIndex(opt => opt.id === selectedAnswer))}: {currentQuestion.options.find(opt => opt.id === selectedAnswer)?.text || ''}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => onNavigate('prev')}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={() => onNavigate('next')}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={currentIndex === totalQuestions - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}