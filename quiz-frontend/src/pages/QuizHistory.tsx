import React, { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, Award } from 'lucide-react';

export default function QuizHistory() {
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    averageScore: 0,
    quizzesCompleted: 0,
    timeSpent: '0 min'
  });

  // Assuming student ID is available from auth context or props
  // For now, we'll hardcode it as 1
  const studentId = 1;

  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // Get token from localStorage
        
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
          console.log("this is data", data.data);
          // Only process attempts that have both a start and end time
          const validAttempts = data.data.filter(attempt => attempt.endTime !== null && attempt.score !== null);
          
          const formattedData = formatQuizData(validAttempts);
          setQuizHistory(formattedData);
          calculateStats(formattedData);
        } else {
          setError(data.message || 'Failed to fetch quiz history');
        }
      } catch (error) {
        setError('Error connecting to the server');
        console.error('Error fetching quiz history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizHistory();
  }, [studentId]);

  // Helper function to format time based on duration in seconds
  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds} sec`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)} min`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.round((seconds % 3600) / 60);
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  const formatQuizData = (data) => {
    // Group attempts by quiz ID
    const quizAttemptsByQuizId = data.reduce((acc, attempt) => {
      if (!acc[attempt.quizId]) {
        acc[attempt.quizId] = [];
      }
      acc[attempt.quizId].push(attempt);
      return acc;
    }, {});
    
    // For each quiz ID, sort attempts by date (most recent first)
    Object.keys(quizAttemptsByQuizId).forEach(quizId => {
      quizAttemptsByQuizId[quizId].sort((a, b) => {
        const dateA = new Date(a.startTime[0], a.startTime[1]-1, a.startTime[2], a.startTime[3], a.startTime[4], a.startTime[5]);
        const dateB = new Date(b.startTime[0], b.startTime[1]-1, b.startTime[2], b.startTime[3], b.startTime[4], b.startTime[5]);
        return dateB - dateA; // Descending order (newest first)
      });
    });
    
    // Calculate improvement for each attempt
    const formattedAttempts = data.map(attempt => {
      // Calculate duration in seconds
      const startTime = new Date(attempt.startTime[0], attempt.startTime[1]-1, attempt.startTime[2], 
                                attempt.startTime[3], attempt.startTime[4], attempt.startTime[5]);
      const endTime = new Date(attempt.endTime[0], attempt.endTime[1]-1, attempt.endTime[2], 
                              attempt.endTime[3], attempt.endTime[4], attempt.endTime[5]);
      const durationSeconds = Math.round((endTime - startTime) / 1000);

      // Format date
      const formattedDate = `${attempt.startTime[0]}-${String(attempt.startTime[1]).padStart(2, '0')}-${String(attempt.startTime[2]).padStart(2, '0')}`;
      
      // Find previous attempt for the same quiz
      const attemptsForThisQuiz = quizAttemptsByQuizId[attempt.quizId];
      const currentAttemptIndex = attemptsForThisQuiz.findIndex(a => a.attemptId === attempt.attemptId);
      const previousAttempt = attemptsForThisQuiz[currentAttemptIndex + 1]; // +1 because we sorted newest first
      
      // Calculate improvement
      let improvement = '-';
      if (previousAttempt) {
        const improvementValue = attempt.score - previousAttempt.score;
        improvement = improvementValue === 0 ? '0%' : 
                      improvementValue > 0 ? `+${improvementValue}%` : 
                      `${improvementValue}%`;
      }
      
      // Normalize score to be between 0 and 100
      const normalizedScore = Math.min(100, Math.max(0, attempt.score));
      
      return {
        id: attempt.attemptId,
        title: attempt.quizTitle,
        date: formattedDate,
        score: normalizedScore,
        rawScore: attempt.score, // Keep the original score for reference
        durationSeconds: durationSeconds,
        formattedDuration: formatTime(durationSeconds),
        category: attempt.quizTitle.split(' ')[0], // Using first word of quiz title as category
        improvement: improvement,
        quizId: attempt.quizId
      };
    });
    
    // Sort all attempts by date (newest first)
    formattedAttempts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
    
    return formattedAttempts;
  };

  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({
        averageScore: 0,
        quizzesCompleted: 0,
        timeSpent: '0 min'
      });
      return;
    }
    
    // Calculate average score (using normalized scores)
    const totalScore = data.reduce((sum, quiz) => sum + quiz.score, 0);
    const averageScore = Math.round(totalScore / data.length);
    
    // Calculate total time spent in seconds
    const totalSeconds = data.reduce((sum, quiz) => sum + quiz.durationSeconds, 0);
    
    setStats({
      averageScore: averageScore,
      quizzesCompleted: data.length,
      timeSpent: formatTime(totalSeconds)
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <p className="text-gray-600">Loading quiz history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Quiz History</h1>
          <p className="text-gray-600 mt-1">Track your progress and performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 font-medium">Average Score</p>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
              </div>
              <Award className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Quizzes Completed</p>
                <p className="text-2xl font-bold">{stats.quizzesCompleted}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium">Time Spent</p>
                <p className="text-2xl font-bold">{stats.timeSpent}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="p-6">
          {quizHistory.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No quiz attempts found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3 font-semibold">Quiz</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Duration</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  {quizHistory.map((quiz) => (
                    <tr key={quiz.id} className="border-b last:border-0">
                      <td className="py-4">
                        <div>
                          <p className="font-medium">{quiz.title}</p>
                          <p className="text-sm text-gray-500">{quiz.category}</p>
                        </div>
                      </td>
                      <td className="py-4">{quiz.date}</td>
                      <td className="py-4">{quiz.formattedDuration}</td>
                      <td className="py-4">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                            quiz.score >= 90 ? 'bg-green-100 text-green-800' :
                            quiz.score >= 80 ? 'bg-blue-100 text-blue-800' :
                            quiz.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                          title={quiz.rawScore > 100 ? `Raw score: ${quiz.rawScore}` : null}
                        >
                          {quiz.score}%
                          {quiz.rawScore > 100 && <span className="ml-1 text-xs">*</span>}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className={`flex items-center ${
                          quiz.improvement.startsWith('+') ? 'text-green-600' :
                          quiz.improvement.startsWith('-') ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {quiz.improvement !== '-' && (
                            <TrendingUp className={`w-4 h-4 mr-1 ${
                              quiz.improvement.startsWith('-') ? 'transform rotate-180' : ''
                            }`} />
                          )}
                          {quiz.improvement}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {quizHistory.some(quiz => quiz.rawScore > 100) && (
                <p className="text-xs text-gray-500 mt-4">* Score normalized to 100% for display purposes</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}