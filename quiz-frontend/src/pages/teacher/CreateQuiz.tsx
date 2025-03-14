import React, { useState, useRef } from 'react';
import { Plus, Trash2, Save, Upload, FileText } from 'lucide-react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

interface QuizData {
  quizTitle: string;
  description: string;
  durationMinutes: number;
  isAdaptive: boolean;
  subjectId: number;
  topicId: number;
  questions: Question[];
}

interface Question {
  questionText: string;
  explanation: string;
  difficultyLevel: number;
  options: Option[];
}

interface Option {
  optionText: string;
  isCorrect: boolean;
}

export default function CreateQuiz() {
  const { subjectId, topicId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quizData, setQuizData] = useState<QuizData>({
    quizTitle: '',
    description: '',
    durationMinutes: 60,
    isAdaptive: true,
    subjectId: Number(subjectId) || 0,
    topicId: Number(topicId) || 0,
    questions: [],
  });
  const [isUploading, setIsUploading] = useState(false);

  const addQuestion = () => {
    const newQuestion: Question = {
      questionText: '',
      explanation: '',
      difficultyLevel: 1,
      options: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
      ],
    };
    setQuizData({ ...quizData, questions: [...quizData.questions, newQuestion] });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const updatedQuestions = quizData.questions.map((q, i) =>
      i === index ? updatedQuestion : q
    );
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleExcelUpload = () => {
    fileInputRef.current?.click();
  };

  const processExcelData = (data: any[]) => {
    try {
      // Expected Excel format:
      // First row contains quiz details: quiz_title, description, duration
      const quizDetails = data[0] || {};
      
      // Extract questions starting from row 2
      const questionRows = data.slice(1).filter(row => row.question_text);
      
      const parsedQuestions: Question[] = [];
      
      questionRows.forEach(row => {
        // Create a new question from the row data
        const question: Question = {
          questionText: row.question_text || '',
          explanation: row.explanation || '',
          difficultyLevel: Number(row.difficulty_level) || 1,
          options: []
        };
        
        // Parse options - assuming columns are named option1, option2, etc.
        // And correct answers are in columns correct1, correct2, etc. (boolean values)
        for (let i = 1; i <= 4; i++) {
          const optionText = row[`option${i}`] || '';
          const isCorrect = row[`correct${i}`] === true || 
                           row[`correct${i}`] === 'true' || 
                           row[`correct${i}`] === 1 || 
                           row[`correct${i}`] === '1';
          
          question.options.push({
            optionText,
            isCorrect
          });
        }
        
        parsedQuestions.push(question);
      });
      
      // Update quiz data with parsed information
      setQuizData({
        ...quizData,
        quizTitle: quizDetails.quiz_title || quizData.quizTitle,
        description: quizDetails.description || quizData.description,
        durationMinutes: Number(quizDetails.duration_minutes) || quizData.durationMinutes,
        questions: parsedQuestions
      });
      
      toast.success(`Successfully imported ${parsedQuestions.length} questions`);
    } catch (error) {
      console.error('Error parsing Excel data:', error);
      toast.error('Failed to parse Excel file. Please check the format.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet);
        
        processExcelData(excelData);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        toast.error('Failed to read Excel file');
      } finally {
        setIsUploading(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
      setIsUploading(false);
    };
    
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quizData.quizTitle || !quizData.subjectId || !quizData.topicId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (quizData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    // Validate that each question has at least one correct answer
    const invalidQuestions = quizData.questions.filter(
      q => !q.options.some(option => option.isCorrect)
    );
    
    if (invalidQuestions.length > 0) {
      toast.error(`Question ${quizData.questions.indexOf(invalidQuestions[0]) + 1} has no correct answer selected`);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9090/api/quizzes/teacher/1', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      toast.success('Quiz created successfully!');
    } catch (error) {
      toast.error('Failed to create quiz');
      console.error(error);
    }
  };

  // Download a sample Excel template
  const downloadSampleTemplate = () => {
    // Create sample data for the template
    const sampleData = [
      { 
        quiz_title: "Sample Quiz Title", 
        description: "Sample quiz description", 
        duration_minutes: 60 
      },
      {
        question_text: "What is 2+2?",
        explanation: "Basic addition",
        difficulty_level: 1,
        option1: "3",
        correct1: false,
        option2: "4",
        correct2: true,
        option3: "5",
        correct3: false,
        option4: "6",
        correct4: false
      },
      {
        question_text: "Which planet is closest to the sun?",
        explanation: "Mercury is the first planet in our solar system",
        difficulty_level: 2,
        option1: "Venus",
        correct1: false,
        option2: "Earth",
        correct2: false,
        option3: "Mercury",
        correct3: true,
        option4: "Mars",
        correct4: false
      }
    ];
    
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Template");
    
    // Generate the Excel file
    XLSX.writeFile(workbook, "quiz_template.xlsx");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create New Quiz</h1>
        <p className="text-gray-600">Design a new quiz for your students</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Excel Upload</h2>
            <p className="text-sm text-gray-600">
              Upload an Excel file with your quiz questions to populate the form automatically.
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={downloadSampleTemplate}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download Template
            </button>
            <button
              type="button"
              onClick={handleExcelUpload}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload Excel'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx, .xls"
              className="hidden"
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                value={quizData.quizTitle}
                onChange={(e) => setQuizData({ ...quizData, quizTitle: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter quiz title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject ID
              </label>
              <input
                type="number"
                value={quizData.subjectId}
                onChange={(e) => setQuizData({ ...quizData, subjectId: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic ID
              </label>
              <input
                type="number"
                value={quizData.topicId}
                onChange={(e) => setQuizData({ ...quizData, topicId: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={quizData.durationMinutes}
                onChange={(e) => setQuizData({ ...quizData, durationMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={quizData.description}
                onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                placeholder="Enter quiz description"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </button>
          </div>

          <div className="space-y-6">
            {quizData.questions.map((question, index) => (
              <QuestionEditor
                key={index}
                question={question}
                index={index}
                onUpdate={updateQuestion}
                onRemove={removeQuestion}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Quiz
          </button>
        </div>
      </form>
    </div>
  );
}

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (index: number, question: Question) => void;
  onRemove: (index: number) => void;
}

function QuestionEditor({ question, index, onUpdate, onRemove }: QuestionEditorProps) {
  const handleOptionChange = (optionIndex: number, text: string) => {
    const updatedOptions = question.options.map((opt, i) =>
      i === optionIndex ? { ...opt, optionText: text } : opt
    );
    onUpdate(index, { ...question, options: updatedOptions });
  };

  const handleCorrectOptionChange = (optionIndex: number) => {
    // Toggle the selected option instead of always setting it to true
    const updatedOptions = question.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === optionIndex ? !opt.isCorrect : opt.isCorrect,
    }));
    onUpdate(index, { ...question, options: updatedOptions });
  };

  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 mr-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Text
          </label>
          <textarea
            value={question.questionText}
            onChange={(e) =>
              onUpdate(index, { ...question, questionText: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={2}
            placeholder="Enter your question"
            required
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Explanation
          </label>
          <textarea
            value={question.explanation}
            onChange={(e) =>
              onUpdate(index, { ...question, explanation: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={2}
            placeholder="Explain the correct answer (shown after quiz completion)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level
          </label>
          <select
            value={question.difficultyLevel}
            onChange={(e) =>
              onUpdate(index, { ...question, difficultyLevel: Number(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value={1}>Easy</option>
            <option value={2}>Medium</option>
            <option value={3}>Hard</option>
            <option value={4}>Expert</option>
            <option value={5}>Master</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Options (select correct answer(s)):</p>
        {question.options.map((option, optionIndex) => (
          <div key={optionIndex} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={option.isCorrect}
              onChange={() => handleCorrectOptionChange(optionIndex)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={option.optionText}
              onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`Option ${optionIndex + 1}`}
              required
            />
          </div>
        ))}
      </div>
    </div>
  );
}