import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'Jan', averageScore: 75, highestScore: 95, lowestScore: 55 },
  { month: 'Feb', averageScore: 78, highestScore: 98, lowestScore: 60 },
  { month: 'Mar', averageScore: 82, highestScore: 100, lowestScore: 65 },
  { month: 'Apr', averageScore: 80, highestScore: 97, lowestScore: 62 },
  { month: 'May', averageScore: 85, highestScore: 100, lowestScore: 70 },
  { month: 'Jun', averageScore: 83, highestScore: 99, lowestScore: 68 },
];

export default function StudentPerformanceChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="averageScore"
            stroke="#4F46E5"
            strokeWidth={2}
            name="Average Score"
          />
          <Line
            type="monotone"
            dataKey="highestScore"
            stroke="#10B981"
            strokeWidth={2}
            name="Highest Score"
          />
          <Line
            type="monotone"
            dataKey="lowestScore"
            stroke="#EF4444"
            strokeWidth={2}
            name="Lowest Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}