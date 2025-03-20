import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart2, TrendingUp, Target, Award } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';

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
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// You can store this in an environment variable or a secure storage in a real application


export default function Performance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyProgress, setMonthlyProgress] = useState([]);
  const [overallScore, setOverallScore] = useState(0);
  const [improvement, setImprovement] = useState(0);
  const [quizAccuracy, setQuizAccuracy] = useState(0);
  const [achievements, setAchievements] = useState(0);
  const AUTH_TOKEN = localStorage.getItem("token");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) {
          throw new Error('User data not found in localStorage');
        }
        
        const userData = JSON.parse(userString);
        const studentId = userData.studentId;
        
        if (!studentId) {
          throw new Error('Student ID not found in user data');
        }
        
        const response = await axios.get(`http://localhost:9090/api/quiz-attempts/student/${studentId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AUTH_TOKEN}`,
            // Add any other required headers here
          }
        });
        
        if (response.data.success) {
          processAttemptData(response.data.data);
          setLoading(false);
        } else {
          setError("Failed to fetch data");
          setLoading(false);
        }
      } catch (err) {
        setError("Error fetching data: " + err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const processAttemptData = (attempts) => {
    // Group attempts by month
    const monthlyAttempts = {};
    let totalScore = 0;
    const totalAttempts = attempts.length;
    
    attempts.forEach(attempt => {
      const date = new Date(attempt.startTime[0], attempt.startTime[1] - 1, attempt.startTime[2]);
      const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!monthlyAttempts[monthYear]) {
        monthlyAttempts[monthYear] = {
          scores: [],
          month: MONTHS[date.getMonth()],
          year: date.getFullYear()
        };
      }
      
      monthlyAttempts[monthYear].scores.push(attempt.score);
      totalScore += attempt.score;
    });
    
    // Calculate monthly averages
    const processedData = Object.values(monthlyAttempts).map(item => {
      const totalMonthScore = item.scores.reduce((sum, score) => sum + score, 0);
      const avgScore = item.scores.length > 0 ? totalMonthScore / item.scores.length : 0;
      
      return {
        month: `${item.month}`,
        score: parseFloat(avgScore.toFixed(1)),
        year: item.year
      };
    });
    
    // Sort by year and month
    processedData.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month);
    });
    
    setMonthlyProgress(processedData);
    
    // Calculate overall metrics
    const overallAvg = totalAttempts > 0 ? totalScore / totalAttempts : 0;
    setOverallScore(Math.round(overallAvg));
    
    // Calculate improvement (difference between first and last month if available)
    if (processedData.length >= 2) {
      const firstMonth = processedData[0].score;
      const lastMonth = processedData[processedData.length - 1].score;
      const improvementVal = lastMonth - firstMonth;
      setImprovement(improvementVal > 0 ? `+${improvementVal.toFixed(0)}` : improvementVal.toFixed(0));
    }
    
    // Set quiz accuracy (using best score as proxy)
    const nonZeroScores = attempts.filter(a => a.score > 0).map(a => a.score);
    if (nonZeroScores.length > 0) {
      const bestScore = Math.max(...nonZeroScores);
      setQuizAccuracy(bestScore);
    }
    
    // Count unique quizzes attempted as achievements
    const uniqueQuizzes = new Set(attempts.map(a => a.quizId)).size;
    setAchievements(uniqueQuizzes);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-medium">Loading performance data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-medium text-red-500">{error}</div>
      </div>
    );
  }

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
                <p className="text-2xl font-bold">{overallScore}%</p>
              </div>
              <BarChart2 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Improvement</p>
                <p className="text-2xl font-bold">{improvement}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium">Best Score</p>
                <p className="text-2xl font-bold">{quizAccuracy}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 font-medium">Unique Quizzes</p>
                <p className="text-2xl font-bold">{achievements}</p>
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
                    name="Avg. Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Performance */}
          {/* <div className="bg-gray-50 rounded-lg p-6">
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
          </div> */}

          {/* Topic Distribution */}
          {/* <div className="bg-gray-50 rounded-lg p-6">
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
          </div> */}

          {/* Recent Quiz Attempts */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Quiz Attempts</h3>
            <div className="space-y-4 overflow-y-auto max-h-80">
              {monthlyProgress.length > 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-600">Monthly progress data available</p>
                </div>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-600">No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}