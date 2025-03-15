import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Clock, Filter, Plus, ArrowLeft, PenTool } from 'lucide-react';

const AllQuizes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        
        const response = await fetch('http://localhost:9090/api/quizzes', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setQuizzes(result.data);
          setFilteredQuizzes(result.data);
          
          // Extract unique subjects from quizzes for filtering
          const uniqueSubjects = [...new Set(result.data.map(quiz => quiz.subjectName))];
          setSubjects(uniqueSubjects);
        } else {
          throw new Error(result.message || 'Failed to fetch quizzes');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    // Apply filters whenever search term or subject filter changes
    let filtered = quizzes;
    
    if (searchTerm) {
      filtered = filtered.filter(quiz => 
        quiz.quizTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterSubject) {
      filtered = filtered.filter(quiz => quiz.subjectName === filterSubject);
    }
    
    setFilteredQuizzes(filtered);
  }, [searchTerm, filterSubject, quizzes]);

  const handleQuizClick = (quizId) => {
    navigate(`/dashboard/quiz/${quizId}`, { state: { from: 'all-quiz' }});
  };
  
  const handleGoBack = () => {
    navigate('/dashboard/subjects');
  };
  
  const handleGenerateQuiz = () => {
    navigate('/quiz', { state: { from: 'generateQuiz' } });
  };

  const getSubjectColor = (subjectName) => {
    const colors = {
      'Mathematics': 'bg-blue-500',
      'Computer Science': 'bg-green-500',
      'Physics': 'bg-purple-500',
      'Biology': 'bg-red-500',
      'History': 'bg-yellow-500',
      'Geography': 'bg-teal-500',
      'Data Structures and Algorithms': 'bg-indigo-500',
    };
    
    return colors[subjectName] || 'bg-gray-500';
  };

  if (loading) {
    return <div className="container mx-auto py-6 flex justify-center items-center h-64">Loading quizzes...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-6 text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={handleGoBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-center">All Quizzes</h1>
        <button 
          onClick={handleGenerateQuiz}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Generate Quiz
        </button>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search quizzes by title or description..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <PenTool className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl">No quizzes found</p>
          <p className="mt-2">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const colorClass = getSubjectColor(quiz.subjectName);
            
            return (
              <div
                key={quiz.quizId}
                onClick={() => handleQuizClick(quiz.quizId)}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
              >
                <div className={`${colorClass} p-6 text-white flex justify-between items-center`}>
                  <Book className="w-12 h-12" />
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{quiz.durationMinutes} min</span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{quiz.quizTitle}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                      {quiz.subjectName}
                    </span>
                    {quiz.topicName && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {quiz.topicName}
                      </span>
                    )}
                    {quiz.adaptive && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Adaptive
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500 flex justify-between items-center">
                    <span>{new Date(...quiz.createdAt).toLocaleDateString()}</span>
                    <span>{quiz.questions?.length || 0} questions</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllQuizes;