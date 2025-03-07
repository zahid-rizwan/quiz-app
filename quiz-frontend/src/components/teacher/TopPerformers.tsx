import React from 'react';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import profile from '../../assets/profile.webp'

const topStudents = [
  {
    name: 'Merajul Haque',
    score: 98,
    trend: 'up',
    image: profile
  },
  {
    name: 'Hibban',
    score: 95,
    trend: 'up',
    image: profile
  },
  {
    name: 'Ashad Jamal',
    score: 93,
    trend: 'down',
    image: profile
  },
  {
    name: 'MANNU',
    score: 91,
    trend: 'up',
    image: profile
  },
];

export default function TopPerformers() {
  return (
    <div className="space-y-4">
      {topStudents.map((student, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center space-x-4">
            {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
            <img
              src={student.image}
              alt={student.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-gray-500">Average Score: {student.score}%</p>
            </div>
          </div>
          {student.trend === 'up' ? (
            <TrendingUp className="w-5 h-5 text-green-500" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
        </div>
      ))}
    </div>
  );
}