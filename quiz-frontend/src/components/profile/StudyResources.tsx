import React from 'react';
import { BookMarked, BookOpen, GraduationCap, Brain } from 'lucide-react';

export default function StudyResources() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <BookMarked className="w-5 h-5 mr-2 text-indigo-600" />
        Study Resources
      </h2>
      <div className="space-y-3">
        <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center">
            <BookOpen className="w-5 h-5 text-indigo-600 mr-3" />
            <div>
              <p className="font-medium">Practice Questions</p>
              <p className="text-sm text-gray-500">500+ questions with solutions</p>
            </div>
          </div>
        </a>
        <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center">
            <GraduationCap className="w-5 h-5 text-indigo-600 mr-3" />
            <div>
              <p className="font-medium">Video Tutorials</p>
              <p className="text-sm text-gray-500">Learn from expert instructors</p>
            </div>
          </div>
        </a>
        <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center">
            <Brain className="w-5 h-5 text-indigo-600 mr-3" />
            <div>
              <p className="font-medium">Study Guides</p>
              <p className="text-sm text-gray-500">Comprehensive topic reviews</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}