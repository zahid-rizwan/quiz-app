import React, { useState, useEffect } from 'react';
import { Brain, Target, Award, TrendingUp } from 'lucide-react';

export default function StatsGrid() {
  const [stats, setStats] = useState([
    { label: 'Total Quizzes', value: '0', icon: Brain, color: 'text-purple-600' },
    { label: 'Average Score', value: '0%', icon: Target, color: 'text-green-600' },
    { label: 'Highest Score', value: '0%', icon: Award, color: 'text-yellow-600' },
    { label: 'Current Streak', value: '0 days', icon: TrendingUp, color: 'text-blue-600' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentStats = async () => {
      try {
        setLoading(true);
        
        // Get student data from localStorage
        const userString = localStorage.getItem('user');
        if (!userString) {
          throw new Error('User data not found in localStorage');
        }
        
        const userData = JSON.parse(userString);
        const studentId = userData.studentId;
        
        if (!studentId) {
          throw new Error('Student ID not found in user data');
        }
        
        const token = localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:9090/api/quiz-attempts/student/${studentId}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          calculateStats(data.data);
        } else {
          setError(data.message || 'Failed to fetch student statistics');
        }
      } catch (error) {
        console.error('Error fetching student stats:', error);
        setError(error.message || 'Error connecting to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentStats();
  }, []);

  const calculateStats = (quizAttempts) => {
    // Filter out incomplete attempts
    const completedAttempts = quizAttempts.filter(attempt => 
      attempt.endTime !== null && attempt.score !== null
    );
    
    if (completedAttempts.length === 0) {
      return;
    }
    
    // Calculate total number of completed quizzes
    const totalQuizzes = completedAttempts.length;
    
    // Calculate average score
    const totalScore = completedAttempts.reduce((sum, attempt) => {
      // Normalize score to be between 0 and 100
      const normalizedScore = Math.min(100, Math.max(0, attempt.score));
      return sum + normalizedScore;
    }, 0);
    const averageScore = Math.round(totalScore / totalQuizzes);
    
    // Find the highest score among all attempts
    const highestScore = Math.max(...completedAttempts.map(attempt => 
      Math.min(100, Math.max(0, attempt.score))
    ));
    
    // Calculate current streak
    const streakDays = calculateStreak(completedAttempts);
    
    // Update the stats
    setStats([
      { label: 'Total Quizzes', value: totalQuizzes.toString(), icon: Brain, color: 'text-purple-600' },
      { label: 'Average Score', value: `${averageScore}%`, icon: Target, color: 'text-green-600' },
      { label: 'Highest Score', value: `${highestScore}%`, icon: Award, color: 'text-yellow-600' },
      { label: 'Current Streak', value: `${streakDays} day${streakDays !== 1 ? 's' : ''}`, icon: TrendingUp, color: 'text-blue-600' },
    ]);
  };

  const calculateStreak = (attempts) => {
    if (attempts.length === 0) {
      return 0;
    }
    
    // Sort attempts by date (newest first)
    const sortedAttempts = [...attempts].sort((a, b) => {
      const dateA = new Date(a.startTime[0], a.startTime[1]-1, a.startTime[2]);
      const dateB = new Date(b.startTime[0], b.startTime[1]-1, b.startTime[2]);
      return dateB - dateA;
    });
    
    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get date of most recent attempt
    const mostRecentAttempt = sortedAttempts[0];
    const mostRecentDate = new Date(
      mostRecentAttempt.startTime[0], 
      mostRecentAttempt.startTime[1]-1, 
      mostRecentAttempt.startTime[2]
    );
    mostRecentDate.setHours(0, 0, 0, 0);
    
    // Check if most recent attempt was today or yesterday to continue the streak
    const timeDiff = Math.floor((today - mostRecentDate) / (1000 * 60 * 60 * 24));
    if (timeDiff > 1) {
      // Streak broken - most recent attempt was more than 1 day ago
      return 0;
    }
    
    // Group attempts by date
    const attemptsByDate = {};
    for (const attempt of attempts) {
      const date = new Date(
        attempt.startTime[0], 
        attempt.startTime[1]-1, 
        attempt.startTime[2]
      );
      const dateStr = date.toISOString().split('T')[0];
      
      if (!attemptsByDate[dateStr]) {
        attemptsByDate[dateStr] = [];
      }
      attemptsByDate[dateStr].push(attempt);
    }
    
    // Count consecutive days with attempts
    let streakDays = 0;
    let currentDate = new Date(mostRecentDate);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      if (attemptsByDate[dateStr]) {
        streakDays++;
      } else {
        break;
      }
      
      // Move to the previous day
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streakDays;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Loading...</p>
                <p className="text-2xl font-bold mt-1 text-gray-200">...</p>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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