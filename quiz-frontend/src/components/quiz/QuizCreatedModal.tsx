import React from 'react';

interface QuizCreatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizTitle: string;
  questionCount: number;
}

const QuizCreatedModal: React.FC<QuizCreatedModalProps> = ({
  isOpen,
  onClose,
  quizTitle,
  questionCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Quiz Created Successfully!</h3>
          <div className="mt-4 text-left">
            <p className="text-sm text-gray-500 mb-1">Quiz Title:</p>
            <p className="text-md font-medium mb-3">{quizTitle}</p>
            
            <p className="text-sm text-gray-500 mb-1">Number of Questions:</p>
            <p className="text-md font-medium mb-3">{questionCount}</p>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCreatedModal;