import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import ChapterSelect from '../../components/teacher/ChapterSelect';
import QuestionEditor from '../../components/teacher/QuestionEditor';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

export default function CreateQuiz() {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    duration: 60,
    chapter: '',
    passingScore: 70,
  });

  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      options: [
        { id: '1', text: '' },
        { id: '2', text: '' },
        { id: '3', text: '' },
        { id: '4', text: '' },
      ],
      correctOptionId: '1',
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, updatedQuestion: Question) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? updatedQuestion : q))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quizData.title || !quizData.chapter) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    // Here you would typically save the quiz data
    console.log('Quiz Data:', { ...quizData, questions });
    toast.success('Quiz created successfully!');
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
                value={quizData.title}
                onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter quiz title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chapter
              </label>
              <ChapterSelect
                value={quizData.chapter}
                onChange={(chapter) => setQuizData({ ...quizData, chapter })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={quizData.duration}
                onChange={(e) => setQuizData({ ...quizData, duration: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passing Score (%)
              </label>
              <input
                type="number"
                value={quizData.passingScore}
                onChange={(e) => setQuizData({ ...quizData, passingScore: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                max="100"
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
            {questions.map((question) => (
              <QuestionEditor
                key={question.id}
                question={question}
                onUpdate={(updatedQuestion) => updateQuestion(question.id, updatedQuestion)}
                onRemove={() => removeQuestion(question.id)}
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