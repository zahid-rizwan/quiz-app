import React from 'react';
import { BarChart3 } from 'lucide-react';

const recentQuizzes = [
  { title: 'Array ', score: 92, date: '2024-03-15', category: 'Mathematics' },
  { title: 'Linked List', score: 88, date: '2024-03-14', category: 'History' },
  { title: 'Binary Search', score: 95, date: '2024-03-13', category: 'Science' },
  { title: 'Two pointer', score: 85, date: '2024-03-12', category: 'Literature' },
];

export default function RecentQuizzes() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
        Recent Quiz Results
      </h2>
      <div className="space-y-4">
        {recentQuizzes.map((quiz, index) => (
          <div key={index} className="border-b last:border-0 pb-3 last:pb-0">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{quiz.title}</p>
                <p className="text-sm text-gray-500">{quiz.category} • {quiz.date}</p>
              </div>
              <div className={`px-3 py-1 rounded-full ${
                quiz.score >= 90 ? 'bg-green-100 text-green-800' :
                quiz.score >= 80 ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {quiz.score}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}