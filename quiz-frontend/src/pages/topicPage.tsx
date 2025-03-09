import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle } from 'lucide-react';

const TopicsPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjectTopics = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        
        const response = await fetch('http://localhost:9090/api/subjects/with-topics', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch subject topics');
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          // Find the subject that matches the ID from URL params
          const foundSubject = result.data.find(s => s.subjectId.toString() === subjectId.toString());
          
          if (foundSubject) {
            setSubject(foundSubject);
          } else {
            throw new Error('Subject not found');
          }
        } else {
          throw new Error(result.message || 'Failed to fetch subject topics');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching subject topics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchSubjectTopics();
    } else {
      navigate('/subjects');
    }
  }, [subjectId, navigate]);

  const handleTopicClick = (topicId) => {
    let role = localStorage.getItem('role');
    
    // Log the raw value
    console.log("Raw role from localStorage:", JSON.stringify(role));
    
    // Clean the role string properly
    if (role) {
      // Remove quotes, trim spaces, and convert to uppercase
      role = role.replace(/['"]/g, '').trim().toUpperCase();
    }
    
    console.log("Cleaned role:", role);
    
    if (role === "STUDENT") {
      navigate(`/quiz/${subjectId}/${topicId}`);
    } 
    else if (role === "TEACHER") {
      console.log("Inside TEACHER condition");
      navigate(`/dashboard-teacher/quiz/teacher/${subjectId}/${topicId}`);
    }
    else {
      console.log("No matching role condition");
    }
  };
  if (loading) {
    return <div className="container mx-auto py-6 flex justify-center items-center h-64">Loading topics...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/subjects')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-red-500">Error: {error}</h1>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/subjects')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold">Subject Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/subjects')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">{subject.subjectName} Topics</h1>
      </div>
      
      {subject.topics && subject.topics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subject.topics.map((topic) => (
            <div
              key={topic.topicId}
              onClick={() => handleTopicClick(topic.topicId)}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{topic.topicName}</h2>
                  <PlayCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-gray-600">{topic.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <p className="text-gray-600">No topics available for this subject.</p>
        </div>
      )}
    </div>
  );
};

export default TopicsPage;