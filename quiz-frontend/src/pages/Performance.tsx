import React from 'react';
import { BarChart2, TrendingUp, Target, Award } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';

const monthlyProgress = [
  { month: 'Jan', score: 75 },
  { month: 'Feb', score: 82 },
  { month: 'Mar', score: 88 },
  { month: 'Apr', score: 85 },
  { month: 'May', score: 90 },
  { month: 'Jun', score: 92 }
];

const subjectPerformance = [
  { subject: 'Database', score: 92, questions: 150 },
  { subject: 'Programming', score: 85, questions: 120 },
  { subject: 'Networking', score: 78, questions: 90 },
  { subject: 'Security', score: 88, questions: 100 },
  { subject: 'Web Dev', score: 95, questions: 80 },
  { subject: 'DevOps', score: 82, questions: 70 }
];

const topicBreakdown = [
  { name: 'SQL', value: 35 },
  { name: 'NoSQL', value: 25 },
  { name: 'Data Modeling', value: 20 },
  { name: 'Indexing', value: 15 },
  { name: 'Transactions', value: 5 }
];

const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'];

export default function Performance() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Performance Analytics</h1>
          <p className="text-gray-600 mt-1">Track your quiz performance and progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium">Overall Score</p>
                <p className="text-2xl font-bold">88%</p>
              </div>
              <BarChart2 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Improvement</p>
                <p className="text-2xl font-bold">+12%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium">Accuracy</p>
                <p className="text-2xl font-bold">92%</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 font-medium">Achievements</p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Over Time */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Progress Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#4F46E5" 
                    strokeWidth={2}
                    dot={{ fill: '#4F46E5' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#7C3AED" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Topic Distribution */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Topic Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topicBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {topicBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
            <div className="space-y-4">
              {[
                { title: 'Perfect Score', description: 'Scored 100% in Database Quiz', date: '2024-03-15' },
                { title: 'Quick Learner', description: 'Completed 10 quizzes in a week', date: '2024-03-14' },
                { title: 'Consistency King', description: '7-day study streak', date: '2024-03-13' },
                { title: 'Subject Master', description: 'Completed all Database quizzes', date: '2024-03-12' }
              ].map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-600 mt-1" />
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}