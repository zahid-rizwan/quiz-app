import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

interface QuizData {
  quizTitle: string;
  description: string;
  durationMinutes: number;
  isAdaptive: boolean;
  subjectId: number;
  topicId: number;
  questions: Question[];
}

interface Question {
  questionText: string;
  explanation: string;
  difficultyLevel: number;
  options: Option[];
}

interface Option {
  optionText: string;
  isCorrect: boolean;
}

export default function CreateQuiz() {
  const { subjectId, topicId } = useParams();
  const [quizData, setQuizData] = useState<QuizData>({
    quizTitle: '',
    description: '',
    durationMinutes: 60,
    isAdaptive: true,
    subjectId: Number(subjectId) || 0, // Convert to number with fallback
    topicId: Number(topicId) || 0, // Convert to number with fallback
    questions: [],
  });

  const addQuestion = () => {
    const newQuestion: Question = {
      questionText: '',
      explanation: '',
      difficultyLevel: 1,
      options: [
        { optionText: '', isCorrect: false }, // All options default to false
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
      ],
    };
    setQuizData({ ...quizData, questions: [...quizData.questions, newQuestion] });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const updatedQuestions = quizData.questions.map((q, i) =>
      i === index ? updatedQuestion : q
    );
    setQuizData({ ...quizData, questions: updatedQuestions });
  };
  console.log("quiz" , quizData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quizData.quizTitle || !quizData.subjectId || !quizData.topicId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (quizData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    // Validate that each question has at least one correct answer
    const invalidQuestions = quizData.questions.filter(
      q => !q.options.some(option => option.isCorrect)
    );
    
    if (invalidQuestions.length > 0) {
      toast.error(`Question ${quizData.questions.indexOf(invalidQuestions[0]) + 1} has no correct answer selected`);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9090/api/quizzes/teacher/1', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      toast.success('Quiz created successfully!');
    } catch (error) {
      toast.error('Failed to create quiz');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create New Quiz</h1>
        <p className="text-gray-600">Design a new quiz for your students</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                value={quizData.quizTitle}
                onChange={(e) => setQuizData({ ...quizData, quizTitle: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter quiz title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject ID
              </label>
              <input
                type="number"
                value={quizData.subjectId}
                onChange={(e) => setQuizData({ ...quizData, subjectId: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic ID
              </label>
              <input
                type="number"
                value={quizData.topicId}
                onChange={(e) => setQuizData({ ...quizData, topicId: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={quizData.durationMinutes}
                onChange={(e) => setQuizData({ ...quizData, durationMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={quizData.description}
                onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                placeholder="Enter quiz description"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </button>
          </div>

          <div className="space-y-6">
            {quizData.questions.map((question, index) => (
              <QuestionEditor
                key={index}
                question={question}
                index={index}
                onUpdate={updateQuestion}
                onRemove={removeQuestion}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Quiz
          </button>
        </div>
      </form>
    </div>
  );
}

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (index: number, question: Question) => void;
  onRemove: (index: number) => void;
}

function QuestionEditor({ question, index, onUpdate, onRemove }: QuestionEditorProps) {
  const handleOptionChange = (optionIndex: number, text: string) => {
    const updatedOptions = question.options.map((opt, i) =>
      i === optionIndex ? { ...opt, optionText: text } : opt
    );
    onUpdate(index, { ...question, options: updatedOptions });
  };

  const handleCorrectOptionChange = (optionIndex: number) => {
    // Toggle the selected option instead of always setting it to true
    const updatedOptions = question.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === optionIndex ? !opt.isCorrect : opt.isCorrect,
    }));
    onUpdate(index, { ...question, options: updatedOptions });
  };

  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 mr-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Text
          </label>
          <textarea
            value={question.questionText}
            onChange={(e) =>
              onUpdate(index, { ...question, questionText: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={2}
            placeholder="Enter your question"
            required
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Explanation
          </label>
          <textarea
            value={question.explanation}
            onChange={(e) =>
              onUpdate(index, { ...question, explanation: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={2}
            placeholder="Explain the correct answer (shown after quiz completion)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level
          </label>
          <select
            value={question.difficultyLevel}
            onChange={(e) =>
              onUpdate(index, { ...question, difficultyLevel: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value={1}>Easy</option>
            <option value={2}>Medium</option>
            <option value={3}>Hard</option>
            <option value={4}>Expert</option>
            <option value={5}>Master</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Options (select correct answer(s)):</p>
        {question.options.map((option, optionIndex) => (
          <div key={optionIndex} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={option.isCorrect}
              onChange={() => handleCorrectOptionChange(optionIndex)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={option.optionText}
              onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`Option ${optionIndex + 1}`}
              required
            />
          </div>
        ))}
      </div>
    </div>
  );
}