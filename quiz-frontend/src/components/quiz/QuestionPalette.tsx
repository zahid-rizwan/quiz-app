import React from 'react';

interface QuestionPaletteProps {
  totalQuestions: number;
  currentIndex: number;
  answeredQuestions: number[];
  markedQuestions: number[];
  onSelectQuestion: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
  quizCompleted?: boolean;
  correctAnswers?: boolean[];
  correctCount?: number;
}

export default function QuestionPalette({
  totalQuestions,
  currentIndex,
  answeredQuestions,
  markedQuestions,
  onSelectQuestion,
  isOpen,
  onClose,
  quizCompleted = false,
  correctAnswers = [],
  correctCount = 0
}: QuestionPaletteProps) {
  
  const getQuestionClass = (index: number) => {
    // Default styling
    let className = "w-10 h-10 flex items-center justify-center rounded-full border ";
    
    // Check if it's the current question
    if (index === currentIndex) {
      className += "border-blue-600 border-2 ";
    } else {
      className += "border-gray-300 ";
    }
    
    // Check for quiz completed mode with correct/incorrect indicators
    if (quizCompleted && answeredQuestions.includes(index)) {
      if (correctAnswers[index]) {
        className += "bg-green-100 text-green-800 ";
      } else {
        className += "bg-red-100 text-red-800 ";
      }
    } 
    // Regular mode indicators
    else {
      // Check if it's marked for review
      if (markedQuestions.includes(index)) {
        className += "bg-yellow-100 text-yellow-800 ";
      } 
      // Check if it's answered
      else if (answeredQuestions.includes(index)) {
        className += "bg-blue-100 text-blue-800 ";
      } else {
        className += "bg-gray-100 ";
      }
    }
    
    return className;
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose}></div>
      )}
    
      {/* Question palette */}
      <div
        className={`fixed md:static top-0 right-0 h-full md:h-auto w-64 md:w-1/4 bg-white p-6 shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Question Palette</h3>
          <button className="md:hidden" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-blue-100 rounded"></div>
            <span className="text-sm">Answered</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-yellow-100 rounded"></div>
            <span className="text-sm">Marked for review</span>
          </div>
          {quizCompleted && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-green-100 rounded"></div>
                <span className="text-sm">Correct answer</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-red-100 rounded"></div>
                <span className="text-sm">Incorrect answer</span>
              </div>
            </>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <button
              key={index}
              className={getQuestionClass(index)}
              onClick={() => onSelectQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        {quizCompleted && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-800 mb-1">Score Summary</div>
            <div className="text-sm text-blue-700">
              Correct: {correctCount} / {totalQuestions}
            </div>
          </div>
        )}
      </div>
    </>
  );
}