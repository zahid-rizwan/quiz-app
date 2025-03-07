import React from 'react';
import { Calendar, Clock, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const upcomingQuizzes = [
  { title: 'Daigital Logic', date: '2024-03-20', duration: '60 mins', difficulty: 'Advanced' },
  { title: 'Compiler Design', date: '2024-03-22', duration: '45 mins', difficulty: 'Intermediate' },
  { title: 'DBMS', date: '2024-03-25', duration: '30 mins', difficulty: 'Beginner' },
];

export default function UpcomingQuizzes() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
        Upcoming Quizzes
      </h2>
      <div className="space-y-4">
        {upcomingQuizzes.map((quiz, index) => (
          <div key={index} className="border-b last:border-0 pb-3 last:pb-0">
            <p className="font-medium">{quiz.title}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Clock className="w-4 h-4 mr-1" />
              <span>{quiz.duration}</span>
              <span className="mx-2">•</span>
              <span>{quiz.date}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                quiz.difficulty === 'Advanced' ? 'bg-red-100 text-red-800' :
                quiz.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {quiz.difficulty}
              </span>
              <button
                onClick={() => navigate('/dashboard/quiz')}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
              >
                <PlayCircle className="w-4 h-4 mr-1" />
                Start Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}