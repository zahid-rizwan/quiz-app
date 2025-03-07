import React from 'react';
import { BookOpen, Users, Clock } from 'lucide-react';

const chapters = [
  {
    name: 'Introduction to Databases',
    quizzes: 3,
    students: 45,
    avgScore: 82,
  },
  {
    name: 'SQL Fundamentals',
    quizzes: 4,
    students: 42,
    avgScore: 78,
  },
  {
    name: 'Database Design',
    quizzes: 2,
    students: 38,
    avgScore: 85,
  },
  {
    name: 'Normalization',
    quizzes: 3,
    students: 40,
    avgScore: 76,
  },
];

export default function QuizzesByChapter() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
        Quizzes by Chapter
      </h2>
      <div className="space-y-4">
        {chapters.map((chapter, index) => (
          <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
            <h3 className="font-medium mb-2">{chapter.name}</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <BookOpen className="w-4 h-4 mr-1" />
                {chapter.quizzes} Quizzes
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                {chapter.students}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {chapter.avgScore}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}