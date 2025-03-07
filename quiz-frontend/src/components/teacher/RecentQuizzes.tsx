import React from 'react';
import { Calendar, Users, Award } from 'lucide-react';

const recentQuizzes = [
  {
    title: 'Database Normalization',
    date: '2024-03-15',
    participants: 42,
    avgScore: 85,
    passRate: 92,
  },
  {
    title: 'SQL Joins',
    date: '2024-03-14',
    participants: 38,
    avgScore: 78,
    passRate: 84,
  },
  {
    title: 'Database Indexing',
    date: '2024-03-13',
    participants: 45,
    avgScore: 82,
    passRate: 89,
  },
];

export default function RecentQuizzes() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Quiz Results</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-3 font-semibold">Quiz Title</th>
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold">Participants</th>
              <th className="pb-3 font-semibold">Avg. Score</th>
              <th className="pb-3 font-semibold">Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            {recentQuizzes.map((quiz, index) => (
              <tr key={index} className="border-b last:border-0">
                <td className="py-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
                    {quiz.title}
                  </div>
                </td>
                <td className="py-4">{quiz.date}</td>
                <td className="py-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-500 mr-1" />
                    {quiz.participants}
                  </div>
                </td>
                <td className="py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    quiz.avgScore >= 85 ? 'bg-green-100 text-green-800' :
                    quiz.avgScore >= 75 ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {quiz.avgScore}%
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 text-green-500 mr-1" />
                    {quiz.passRate}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}