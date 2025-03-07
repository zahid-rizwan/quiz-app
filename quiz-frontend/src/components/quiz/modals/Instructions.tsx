import React from 'react';
import { XCircle } from 'lucide-react';

interface InstructionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Instructions({ isOpen, onClose }: InstructionsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Quiz Instructions</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="prose prose-sm max-w-none">
          <h4>General Instructions:</h4>
          <ul>
            <li>Total duration of the quiz is 60 minutes.</li>
            <li>The clock will be set at the server. The countdown timer will display the remaining time.</li>
            <li>The quiz consists of 20 multiple choice questions.</li>
            <li>Each question has four options. Only one option is correct.</li>
            <li>You can mark a question for review and come back to it later.</li>
            <li>You can navigate between questions using the question palette or next/previous buttons.</li>
          </ul>
          <h4>Marking Scheme:</h4>
          <ul>
            <li>Each correct answer awards 1 mark.</li>
            <li>There is no negative marking for wrong answers.</li>
            <li>Unanswered questions are awarded zero marks.</li>
          </ul>
          <h4>Navigation and Features:</h4>
          <ul>
            <li>Click on a question number in the palette to navigate directly to that question.</li>
            <li>The question palette displays different colors to indicate question status.</li>
            <li>Use the calculator button for basic calculations if needed.</li>
            <li>You can submit the quiz at any time using the submit button.</li>
          </ul>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}