import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Code, Calculator, Atom, Brain, Globe, Plus, ListFilter, Grid } from 'lucide-react';

const SubjectsPage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubjects, setShowSubjects] = useState(false);

  // Map for subject icons - we'll use these based on subject names or defaults
  const iconMap = {
    'Mathematics': Calculator,
    'Computer Science': Code,
    'Physics': Atom,
    'Biology': Brain,
    'History': Book,
    'Geography': Globe,
    'Advanced Opetating System': Code, // Added for your example
    'default': Book
  };

  // Color map for styling
  const colorMap = {
    'Mathematics': 'bg-blue-500',
    'Computer Science': 'bg-green-500',
    'Physics': 'bg-purple-500',
    'Biology': 'bg-red-500',
    'History': 'bg-yellow-500',
    'Geography': 'bg-teal-500',
    'Advanced Opetating System': 'bg-indigo-500', // Added for your example
    'default': 'bg-gray-500'
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        
        const response = await fetch('http://localhost:9090/api/subjects/with-topics', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setSubjects(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch subjects');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching subjects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectClick = (subjectId) => {
    navigate(`/dashboard-teacher/subjects/${subjectId}`);
  };
  
  const handleAllQuizzes = () => {
    navigate('/dashboard/all-quizzes');
  };
  
  const handleQuizzesBySubject = () => {
    setShowSubjects(true);
  };
  
  const handleGenerateQuiz = () => {
    navigate('/quiz', { state: { from: 'generateQuiz' } });
  };

  if (loading) {
    return <div className="container mx-auto py-6 flex justify-center items-center h-64">Loading subjects...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-6 text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold text-center mb-8">Quiz Dashboard</h1>
      
      {!showSubjects ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* All Quizzes Card */}
          <div 
            onClick={handleAllQuizzes}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg flex flex-col items-center"
          >
            <div className="bg-blue-500 w-full p-6 text-white flex justify-center items-center">
              <Grid className="w-12 h-12" />
            </div>
            <div className="p-6 flex-grow flex flex-col items-center justify-center">
              <div className="flex justify-center items-center mb-4">
                <Plus className="w-16 h-16 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-center">All Quizzes</h2>
              <p className="text-gray-600 text-center mt-2">View all available quizzes</p>
            </div>
          </div>
          
          {/* Quizzes by Subject Card */}
          <div 
            onClick={handleQuizzesBySubject}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg flex flex-col items-center"
          >
            <div className="bg-purple-500 w-full p-6 text-white flex justify-center items-center">
              <ListFilter className="w-12 h-12" />
            </div>
            <div className="p-6 flex-grow flex flex-col items-center justify-center">
              <div className="flex justify-center items-center mb-4">
                <Plus className="w-16 h-16 text-purple-500" />
              </div>
              <h2 className="text-xl font-bold text-center">Quizzes by Subject</h2>
              <p className="text-gray-600 text-center mt-2">Browse quizzes by subject area</p>
            </div>
          </div>
          
          {/* Generate Quiz Card */}
          <div 
            onClick={handleGenerateQuiz}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg flex flex-col items-center"
          >
            <div className="bg-green-500 w-full p-6 text-white flex justify-center items-center">
              <Book className="w-12 h-12" />
            </div>
            <div className="p-6 flex-grow flex flex-col items-center justify-center">
              <div className="flex justify-center items-center mb-4">
                <Plus className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-center">Generate Quiz</h2>
              <p className="text-gray-600 text-center mt-2">Create a new customized quiz</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => setShowSubjects(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
            >
              Back to Options
            </button>
            <h2 className="text-2xl font-bold text-center">Select a Subject</h2>
            <button 
              onClick={handleGenerateQuiz}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Generate Quiz
            </button>
          </div>
          
          {subjects.length === 0 ? (
            <div className="text-center text-gray-500">No subjects available</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => {
                const IconComponent = iconMap[subject.subjectName] || iconMap.default;
                const colorClass = colorMap[subject.subjectName] || colorMap.default;
                
                return (
                  <div
                    key={subject.subjectId}
                    onClick={() => handleSubjectClick(subject.subjectId)}
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
                  >
                    <div className={`${colorClass} p-6 text-white flex justify-center items-center`}>
                      <IconComponent className="w-12 h-12" />
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-2">{subject.subjectName}</h2>
                      <p className="text-gray-600">{subject.description}</p>
                      <p className="text-sm text-gray-500 mt-2">{subject.topics?.length || 0} topics available</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SubjectsPage;