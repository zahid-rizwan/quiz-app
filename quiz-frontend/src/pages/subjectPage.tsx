import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Code, Calculator, Atom, Brain, Globe } from 'lucide-react';

const SubjectsPage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div className="container mx-auto py-6 flex justify-center items-center h-64">Loading subjects...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-6 text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Select a Subject</h1>
      
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
    </div>
  );
};

export default SubjectsPage;