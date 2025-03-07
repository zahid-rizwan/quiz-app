// import React from 'react';
import {TrendingUp, Award } from 'lucide-react';
import StudentPerformanceChart from '../../components/teacher/StudentPerformanceChart';
import RecentQuizzes from '../../components/teacher/RecentQuizzes';
import TopPerformers from '../../components/teacher/TopPerformers';
import QuizzesByChapter from '../../components/teacher/QuizzesByChapter';
import TeacherStats from '../../components/teacher/TeacherStats';

export default function TeacherDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
        <p className="text-gray-600">Monitor student performance and manage quizzes</p>
      </div>

      <TeacherStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
            Class Performance Trend
          </h2>
          <StudentPerformanceChart />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-indigo-600" />
            Top Performing Students
          </h2>
          <TopPerformers />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentQuizzes />
        </div>
        <div>
          <QuizzesByChapter />
        </div>
      </div>
    </div>
  );
}