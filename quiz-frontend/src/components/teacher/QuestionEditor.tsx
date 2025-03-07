import React from 'react';
import { Trash2 } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

interface QuestionEditorProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onRemove: () => void;
}

export default function QuestionEditor({
  question,
  onUpdate,
  onRemove,
}: QuestionEditorProps) {
  const handleOptionChange = (optionId: string, text: string) => {
    const updatedOptions = question.options.map((opt) =>
      opt.id === optionId ? { ...opt, text } : opt
    );
    onUpdate({ ...question, options: updatedOptions });
  };

  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 mr-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Text
          </label>
          <textarea
            value={question.question}
            onChange={(e) => onUpdate({ ...question, question: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={2}
            placeholder="Enter your question"
            required
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {question.options.map((option) => (
          <div key={option.id} className="flex items-center space-x-3">
            <input
              type="radio"
              name={`correct-${question.id}`}
              checked={question.correctOptionId === option.id}
              onChange={() => onUpdate({ ...question, correctOptionId: option.id })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={option.text}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`Option ${option.id}`}
              required
            />
          </div>
        ))}
      </div>
    </div>
  );
}
