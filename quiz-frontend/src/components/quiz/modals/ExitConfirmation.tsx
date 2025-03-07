import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ExitConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExitConfirmation({
  isOpen,
  onConfirm,
  onCancel,
}: ExitConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-medium">Exit Quiz?</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Are you sure you want to exit? Your progress will be lost and cannot be recovered.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Exit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}