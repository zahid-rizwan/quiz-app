import React from 'react';
import { Users, BookOpen, CheckCircle, Clock } from 'lucide-react';

const stats = [
  {
    label: 'Total Students',
    value: '245',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    label: 'Active Quizzes',
    value: '12',
    icon: BookOpen,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    label: 'Pass Rate',
    value: '85%',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    label: 'Avg. Completion Time',
    value: '45m',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
];

export default function TeacherStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}