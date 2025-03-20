import React, { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';

export default function RecentQuizzes() {
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Assuming student ID is available from auth context or props

  let studentId;
  useEffect(() => {
    const fetchRecentQuizzes = async () => {
      try {
        setLoading(true);
        const userString = localStorage.getItem('user');
        if (!userString) {
          throw new Error('User data not found in localStorage');
        }
        
        const userData = JSON.parse(userString);
        studentId = userData.studentId;
        
        if (!studentId) {
          throw new Error('Student ID not found in user data');
        }
        
        const token = localStorage.getItem('token');
 // Get token from localStorage
        
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
          // Process and format the quiz data
          const formattedQuizzes = formatQuizData(data.data);
          setRecentQuizzes(formattedQuizzes);
        } else {
          setError(data.message || 'Failed to fetch recent quizzes');
        }
      } catch (error) {
        setError('Error connecting to the server');
        console.error('Error fetching recent quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentQuizzes();
  }, [studentId]);

  const formatQuizData = (data) => {
    // Filter out incomplete attempts
    const validAttempts = data.filter(attempt => attempt.endTime !== null && attempt.score !== null);
    
    // Format each attempt
    const formattedAttempts = validAttempts.map(attempt => {
      // Format date
      const formattedDate = `${attempt.startTime[0]}-${String(attempt.startTime[1]).padStart(2, '0')}-${String(attempt.startTime[2]).padStart(2, '0')}`;
      
      // Extract category from quiz title
      const category = attempt.quizTitle.split(' ')[0];
      
      // Normalize score to be between 0 and 100
      const normalizedScore = Math.min(100, Math.max(0, attempt.score));
      
      return {
        title: attempt.quizTitle,
        score: normalizedScore,
        date: formattedDate,
        category: category,
        id: attempt.attemptId
      };
    });
    
    // Sort by date (newest first)
    formattedAttempts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
    
    // Return only the 5 most recent quizzes
    return formattedAttempts.slice(0, 5);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
          Recent Quiz Results
        </h2>
        <div className="flex justify-center py-8">
          <p className="text-gray-500">Loading recent quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
          Recent Quiz Results
        </h2>
        <div className="flex justify-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
        Recent Quiz Results
      </h2>
      
      {recentQuizzes.length === 0 ? (
        <div className="flex justify-center py-8">
          <p className="text-gray-500">No recent quizzes found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentQuizzes.map((quiz) => (
            <div key={quiz.id} className="border-b last:border-0 pb-3 last:pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{quiz.title}</p>
                  <p className="text-sm text-gray-500">{quiz.category} • {quiz.date}</p>
                </div>
                <div className={`px-3 py-1 rounded-full ${
                  quiz.score >= 90 ? 'bg-green-100 text-green-800' :
                  quiz.score >= 80 ? 'bg-blue-100 text-blue-800' :
                  quiz.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {quiz.score}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}