import React from 'react';
import { Calendar, Clock, TrendingUp, Award } from 'lucide-react';

const quizHistory = [
  {
    id: 1,
    title: 'Database Fundamentals',
    date: '2024-03-15',
    score: 85,
    duration: '45 minutes',
    category: 'Database',
    improvement: '+5%'
  },
  {
    id: 2,
    title: 'SQL Basics',
    date: '2024-03-14',
    score: 92,
    duration: '30 minutes',
    category: 'Database',
    improvement: '+8%'
  },
  {
    id: 3,
    title: 'NoSQL Concepts',
    date: '2024-03-13',
    score: 78,
    duration: '60 minutes',
    category: 'Database',
    improvement: '+2%'
  }
];

export default function QuizHistory() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Quiz History</h1>
          <p className="text-gray-600 mt-1">Track your progress and performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 font-medium">Average Score</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <Award className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Quizzes Completed</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium">Time Spent</p>
                <p className="text-2xl font-bold">18h</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3 font-semibold">Quiz</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.map((quiz) => (
                  <tr key={quiz.id} className="border-b last:border-0">
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{quiz.title}</p>
                        <p className="text-sm text-gray-500">{quiz.category}</p>
                      </div>
                    </td>
                    <td className="py-4">{quiz.date}</td>
                    <td className="py-4">{quiz.duration}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                        quiz.score >= 90 ? 'bg-green-100 text-green-800' :
                        quiz.score >= 80 ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {quiz.score}%
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {quiz.improvement}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}