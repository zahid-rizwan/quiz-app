import React from 'react';
import { Brain, Target, Award, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Total Quizzes', value: '247', icon: Brain, color: 'text-purple-600' },
  { label: 'Average Score', value: '85%', icon: Target, color: 'text-green-600' },
  { label: 'Achievements', value: '12', icon: Award, color: 'text-yellow-600' },
  { label: 'Current Streak', value: '7 days', icon: TrendingUp, color: 'text-blue-600' },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}