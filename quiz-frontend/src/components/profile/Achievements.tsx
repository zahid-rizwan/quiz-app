import React from 'react';
import { Trophy, Clock, GraduationCap } from 'lucide-react';

const achievements = [
  { title: 'Perfect Score', description: 'Achieved 100% in 5 quizzes', icon: Trophy },
  { title: 'Quick Thinker', description: 'Completed quiz in record time', icon: Clock },
  { title: 'Knowledge Master', description: 'Completed 100 quizzes', icon: GraduationCap },
];

export default function Achievements() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
        Recent Achievements
      </h2>
      <div className="space-y-4">
        {achievements.map((achievement, index) => (
          <div key={index} className="flex items-start space-x-3">
            <achievement.icon className="w-5 h-5 text-yellow-600 mt-1" />
            <div>
              <p className="font-medium">{achievement.title}</p>
              <p className="text-sm text-gray-500">{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}