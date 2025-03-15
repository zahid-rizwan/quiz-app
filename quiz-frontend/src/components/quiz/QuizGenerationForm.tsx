import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Subject {
  subjectId: number;
  subjectName: string;
  description: string;
}

interface Topic {
  topicId: number;
  topicName: string;
  description: string;
  subjectId: number;
  subjectName: string;
}

interface FormData {
  quizTitle: string;
  description: string;
  difficultyLevel: number;
  numberOfQuestions: number;
  subjectIds: number[];
  topicIds: number[];
  adaptive: boolean;
}

interface QuizGenerationFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const QuizGenerationForm: React.FC<QuizGenerationFormProps> = ({
  onSubmit,
  isLoading,
  onCancel
}) => {
  const [formData, setFormData] = useState<FormData>({
    quizTitle: '',
    description: '',
    difficultyLevel: 3,
    numberOfQuestions: 10,
    subjectIds: [],
    topicIds: [],
    adaptive: true
  });

  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [currentSubjectId, setCurrentSubjectId] = useState<string>("");
  const [currentTopicId, setCurrentTopicId] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch subjects on component mount
  // Fix for the QuizGenerationForm component

  useEffect(() => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("No authentication token found");
      return; // Early return if no token
    }

    // Create axios instance with default headers
    const api = axios.create({
      baseURL: 'http://localhost:9090/api',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Fetch subjects
    api.get('/subjects')
      .then(response => {
        if (response.data && response.data.data) {
          setAvailableSubjects(response.data.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setAvailableSubjects([]); // Set to empty array if data format is unexpected
        }
      })
      .catch(error => {
        console.error('Error fetching subjects:', error);
        // Handle auth errors specifically
        if (error.response && error.response.status === 401) {
          console.error("Authentication failed. Token might be invalid or expired.");
          // You might want to redirect to login page here
        }
        setAvailableSubjects([]); // Set to empty array on error
      });
  }, []);

  // Fetch topics when a subject is selected
  useEffect(() => {
    if (currentSubjectId) {
      // Retrieve the token from local storage
      const token = localStorage.getItem('token');


      // Create axios instance with default headers
      const api = axios.create({
        baseURL: 'http://localhost:9090/api',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Fetch topics for the selected subject
      api.get(`/topics/subject/${currentSubjectId}`)
        .then(response => {
          setAvailableTopics(response.data.data);
        })
        .catch(error => {
          console.error('Error fetching topics:', error);
        });
    }
  }, [currentSubjectId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value, 10)
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSubjectDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentSubjectId(e.target.value);
  };

  const handleTopicDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTopicId(e.target.value);
  };

  const addSubject = () => {
    if (!currentSubjectId) return;

    const subjectId = parseInt(currentSubjectId, 10);
    const subject = availableSubjects.find(s => s.subjectId === subjectId);

    if (subject && !formData.subjectIds.includes(subjectId)) {
      setFormData(prev => ({
        ...prev,
        subjectIds: [...prev.subjectIds, subjectId]
      }));
      setSelectedSubjects(prev => [...prev, subject]);
      setCurrentSubjectId("");
    }
  };

  const addTopic = () => {
    if (!currentTopicId) return;

    const topicId = parseInt(currentTopicId, 10);
    const topic = availableTopics.find(t => t.topicId === topicId);

    if (topic && !formData.topicIds.includes(topicId)) {
      setFormData(prev => ({
        ...prev,
        topicIds: [...prev.topicIds, topicId]
      }));
      setSelectedTopics(prev => [...prev, topic]);
      setCurrentTopicId("");
    }
  };

  const removeSubject = (subjectId: number) => {
    setFormData(prev => ({
      ...prev,
      subjectIds: prev.subjectIds.filter(id => id !== subjectId)
    }));
    setSelectedSubjects(prev => prev.filter(s => s.subjectId !== subjectId));
  };

  const removeTopic = (topicId: number) => {
    setFormData(prev => ({
      ...prev,
      topicIds: prev.topicIds.filter(id => id !== topicId)
    }));
    setSelectedTopics(prev => prev.filter(t => t.topicId !== topicId));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.quizTitle.trim()) {
      newErrors.quizTitle = 'Quiz title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.numberOfQuestions < 1) {
      newErrors.numberOfQuestions = 'Number of questions must be at least 1';
    }

    if (formData.subjectIds.length === 0) {
      newErrors.subjectIds = 'At least one subject must be selected';
    }

    if (formData.topicIds.length === 0) {
      newErrors.topicIds = 'At least one topic must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quiz Title */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="quizTitle">
              Quiz Title
            </label>
            <input
              type="text"
              id="quizTitle"
              name="quizTitle"
              value={formData.quizTitle}
              onChange={handleInputChange}
              className={`w-full border ${errors.quizTitle ? 'border border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter quiz title"
            />
            {errors.quizTitle && <p className="text-red-500 text-sm mt-1">{errors.quizTitle}</p>}
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter quiz description"
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="difficultyLevel">
              Difficulty Level
            </label>
            <select
              id="difficultyLevel"
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleNumberChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Easy</option>
              <option value={2}>Medium</option>
              <option value={3}>Hard</option>
              <option value={4}>Expert</option>
            </select>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="numberOfQuestions">
              Number of Questions
            </label>
            <input
              type="number"
              id="numberOfQuestions"
              name="numberOfQuestions"
              value={formData.numberOfQuestions}
              onChange={handleNumberChange}
              min={1}
              max={30}
              className={`w-full border ${errors.numberOfQuestions ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.numberOfQuestions && <p className="text-red-500 text-sm mt-1">{errors.numberOfQuestions}</p>}
          </div>

          {/* Subjects - Enhanced Dropdown Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="subjectDropdown">
              Subjects
            </label>
            <div className={`flex mb-2 ${errors.subjectIds ? 'border-red-500' : ''}`}>
              <select
                id="subjectDropdown"
                value={currentSubjectId}
                onChange={handleSubjectDropdownChange}
                className="w-full border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a subject</option>
                {availableSubjects && availableSubjects.length > 0 ? (
                  availableSubjects.map(subject => (
                    <option key={subject.subjectId} value={subject.subjectId}>
                      {subject.subjectName}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No subjects available</option>
                )}
              </select>
              <button
                type="button"
                onClick={addSubject}
                className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>

            {/* Selected Subjects Display */}
            <div className="mt-2">
              {selectedSubjects.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedSubjects.map(subject => (
                    <div key={subject.subjectId} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                      <span>{subject.subjectName}</span>
                      <button
                        type="button"
                        onClick={() => removeSubject(subject.subjectId)}
                        className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No subjects selected</p>
              )}
            </div>
            {errors.subjectIds && <p className="text-red-500 text-sm mt-1">{errors.subjectIds}</p>}
          </div>

          {/* Topics - Enhanced Dropdown Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="topicDropdown">
              Topics
            </label>
            <div className={`flex mb-2 ${errors.topicIds ? 'border-red-500' : ''}`}>
              <select
                id="topicDropdown"
                value={currentTopicId}
                onChange={handleTopicDropdownChange}
                className="w-full border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!availableTopics || availableTopics.length === 0}
              >
                <option value="">Select a topic</option>
                {availableTopics && availableTopics.length > 0 ? (
                  availableTopics.map(topic => (
                    !formData.topicIds.includes(topic.topicId) && (
                      <option key={topic.topicId} value={topic.topicId}>
                        {topic.topicName}
                      </option>
                    )
                  ))
                ) : (
                  <option value="" disabled>No topics available</option>
                )}
              </select>
              <button
                type="button"
                onClick={addTopic}
                disabled={availableTopics.length === 0}
                className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>

            {/* Selected Topics Display */}
            <div className="mt-2">
              {selectedTopics.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedTopics.map(topic => (
                    <div key={topic.topicId} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                      <span>{topic.topicName}</span>
                      <button
                        type="button"
                        onClick={() => removeTopic(topic.topicId)}
                        className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No topics selected</p>
              )}
            </div>
            {errors.topicIds && <p className="text-red-500 text-sm mt-1">{errors.topicIds}</p>}
          </div>

          {/* Adaptive */}
          <div className="col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="adaptive"
                name="adaptive"
                checked={formData.adaptive}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-gray-700" htmlFor="adaptive">
                Enable adaptive quiz (adjusts difficulty based on student performance)
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizGenerationForm;