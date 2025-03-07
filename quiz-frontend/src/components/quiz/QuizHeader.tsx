import React from 'react';

interface QuizHeaderProps {
  timeLeft: number;
  onOpenInstructions: () => void;
  onOpenPalette: () => void;
  onSubmit: () => void;
  onExit: () => void;
  quizTitle: string;
  quizCompleted?: boolean;
  reviewMode?: boolean;
  onBackToResults?: () => void;
  correctCount?: number;
  totalQuestions?: number;
}

export default function QuizHeader({
  timeLeft,
  onOpenInstructions,
  onOpenPalette,
  onSubmit,
  onExit,
  quizTitle,
  quizCompleted = false,
  reviewMode = false,
  onBackToResults,
  correctCount = 0,
  totalQuestions = 0
}: QuizHeaderProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-lg truncate max-w-[30%]">{quizTitle}</div>
          
          <div className="flex items-center gap-3">
            {!quizCompleted && (
              <div className={`px-3 py-1 rounded-full ${timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                Time: {formatTime(timeLeft)}
              </div>
            )}
            
            {quizCompleted && (
              <div className="px-3 py-1 rounded-full bg-green-100 text-green-700">
                Score: {correctCount} / {totalQuestions}
              </div>
            )}
            
            {reviewMode && (
              <button
                onClick={onBackToResults}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded"
              >
                Back to Results
              </button>
            )}
            
            <button
              onClick={onOpenInstructions}
              className="px-3 py-1 bg-gray-100 rounded hidden md:block"
            >
              Instructions
            </button>
            
            <button
              onClick={onOpenPalette}
              className="px-3 py-1 bg-gray-100 rounded md:hidden"
            >
              Questions
            </button>
            
            {!quizCompleted && (
              <button
                onClick={onSubmit}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Submit
              </button>
            )}
            
            <button
              onClick={onExit}
              className="px-3 py-1 bg-red-100 text-red-700 rounded"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}