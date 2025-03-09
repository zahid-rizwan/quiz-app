// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import QuizHeader from '../components/quiz/QuizHeader';
// import QuestionArea from '../components/quiz/QuestionArea';
// import QuestionPalette from '../components/quiz/QuestionPalette';
// import SubmitConfirmation from '../components/quiz/modals/SubmitConfirmation';
// import Instructions from '../components/quiz/modals/Instructions';
// import QuizResults from '../components/quiz/QuizResults';
// import ExitConfirmation from '../components/quiz/modals/ExitConfirmation';
// import axios from 'axios';

// // Define interfaces for the data structure
// interface Option {
//   id: number;
//   text: string;
//   isCorrect: boolean;
// }

// interface Question {
//   id: number;
//   question: string;
//   options: Option[];
//   explanation: string;
//   correctOptionId: number;
// }

// interface Quiz {
//   id: number;
//   title: string;
//   description: string;
//   durationMinutes: number;
//   questions: Question[];
// }

// interface IncorrectAnswer {
//   question: string;
//   userAnswer: string;
//   correctAnswer: string;
//   questionIndex: number; // Added to enable reopening specific questions
// }

// export default function QuizPage() {
//   const navigate = useNavigate();
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
//   const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
//   const [timeLeft, setTimeLeft] = useState(3600); // Will be updated with quiz duration
//   const [isConfirmingSubmit, setIsConfirmingSubmit] = useState(false);
//   const [isConfirmingExit, setIsConfirmingExit] = useState(false);
//   const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);
//   const [isPaletteOpen, setIsPaletteOpen] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const [quizScore, setQuizScore] = useState({ correct: 0, incorrect: [] as IncorrectAnswer[] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [quiz, setQuiz] = useState<Quiz | null>(null);
//   const [quizCompleted, setQuizCompleted] = useState(false);
//   const [reviewMode, setReviewMode] = useState(false);

//   // Fetch quiz data from API
//   useEffect(() => {
//     const fetchQuizData = async () => {
//       try {
//         setLoading(true);
//         // Get token from localStorage or wherever it's stored in your app
//         const token = localStorage.getItem('token');
        
//         const response = await axios.get('http://localhost:9090/api/quizzes/topic/59', {
//           headers: {
//             'Authorization': token ? `Bearer ${token}` : '',
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (response.data.success) {
//           const quizData = response.data.data[0]; // Getting the first quiz
          
//           // Transform API data to our required format
//           const transformedQuestions: Question[] = quizData.questions.map(q => {
//             // Randomize options order while keeping track of correct option
//             const shuffledOptions = shuffleOptions(q.options);
            
//             // Find the new ID of the correct option after shuffling
//             const correctOption = shuffledOptions.find(opt => opt.isCorrect);
//             const correctOptionId = correctOption ? correctOption.id : -1;
            
//             return {
//               id: q.questionId,
//               question: q.questionText,
//               options: shuffledOptions,
//               explanation: q.explanation,
//               correctOptionId
//             };
//           });
          
//           setQuiz({
//             id: quizData.quizId,
//             title: quizData.quizTitle,
//             description: quizData.description,
//             durationMinutes: quizData.durationMinutes,
//             questions: transformedQuestions
//           });
          
//           // Set time based on quiz duration
//           setTimeLeft(quizData.durationMinutes * 60);
//         } else {
//           setError('Failed to fetch quiz data');
//         }
//       } catch (err) {
//         console.error('Error fetching quiz:', err);
//         setError('Error connecting to quiz server');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchQuizData();
//   }, []);

//   // Function to shuffle options and identify the correct one
//   const shuffleOptions = (options) => {
//     const transformedOptions = options.map((opt, index) => ({
//       id: opt.optionId,
//       text: opt.optionText,
//       isCorrect: opt.correct
//     }));
    
//     // Fisher-Yates shuffle algorithm
//     for (let i = transformedOptions.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [transformedOptions[i], transformedOptions[j]] = [transformedOptions[j], transformedOptions[i]];
//     }
    
//     return transformedOptions;
//   };

//   useEffect(() => {
//     if (!loading && quiz && !quizCompleted) {
//       const timer = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 0) {
//             clearInterval(timer);
//             handleSubmit();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       return () => clearInterval(timer);
//     }
//   }, [loading, quiz, quizCompleted]);

//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement);
//     };

//     document.addEventListener('fullscreenchange', handleFullscreenChange);
//     return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
//   }, []);

//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       if (!showResults && !quizCompleted) {
//         e.preventDefault();
//         e.returnValue = '';
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
//     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
//   }, [showResults, quizCompleted]);

//   const enterFullscreen = async () => {
//     try {
//       await document.documentElement.requestFullscreen();
//     } catch (error) {
//       console.error('Failed to enter fullscreen:', error);
//     }
//   };

//   const exitFullscreen = async () => {
//     try {
//       if (document.fullscreenElement) {
//         await document.exitFullscreen();
//       }
//     } catch (error) {
//       console.error('Failed to exit fullscreen:', error);
//     }
//   };

//   const handleOptionSelect = useCallback((optionId: number) => {
//     if (quizCompleted && !reviewMode) return; // Prevent changing answers if quiz is completed

//     setSelectedAnswers(prev => ({
//       ...prev,
//       [currentQuestionIndex]: optionId
//     }));
//     toast.success('Answer saved!');
//   }, [currentQuestionIndex, quizCompleted, reviewMode]);

//   const handleMarkForReview = useCallback(() => {
//     if (quizCompleted && !reviewMode) return; // Prevent marking for review if quiz is completed

//     setMarkedForReview(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(currentQuestionIndex)) {
//         newSet.delete(currentQuestionIndex);
//       } else {
//         newSet.add(currentQuestionIndex);
//       }
//       return newSet;
//     });
//   }, [currentQuestionIndex, quizCompleted, reviewMode]);

//   const calculateScore = () => {
//     if (!quiz) return { correct: 0, incorrect: [] as IncorrectAnswer[] };
    
//     let correct = 0;
//     const incorrect: IncorrectAnswer[] = [];

//     for (let i = 0; i < quiz.questions.length; i++) {
//       const userAnswer = selectedAnswers[i];
//       const question = quiz.questions[i];
      
//       if (userAnswer === question.correctOptionId) {
//         correct++;
//       } else {
//         incorrect.push({
//           question: question.question,
//           userAnswer: question.options.find(opt => opt.id === userAnswer)?.text || 'Not answered',
//           correctAnswer: question.options.find(opt => opt.isCorrect)?.text || '',
//           questionIndex: i // Store the index to enable reopening the question
//         });
//       }
//     }

//     return { correct, incorrect };
//   };

//   const handleSubmit = () => {
//     const score = calculateScore();
//     setQuizScore(score);
//     setShowResults(true);
//     setQuizCompleted(true);
//     exitFullscreen();
//   };

//   const handleStartQuiz = () => {
//     setIsInstructionsOpen(false);
//     enterFullscreen();
//   };

//   const handleRetakeQuiz = () => {
//     setSelectedAnswers({});
//     setMarkedForReview(new Set());
//     setCurrentQuestionIndex(0);
//     setTimeLeft(quiz ? quiz.durationMinutes * 60 : 3600);
//     setShowResults(false);
//     setQuizCompleted(false);
//     setReviewMode(false);
//     enterFullscreen();
//   };

//   const handleExit = () => {
//     setIsConfirmingExit(true);
//   };

//   const confirmExit = () => {
//     exitFullscreen();
//     navigate('/dashboard');
//   };

//   const navigateQuestion = (direction: 'prev' | 'next') => {
//     if (!quiz) return;
    
//     if (direction === 'prev' && currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     } else if (direction === 'next' && currentQuestionIndex < quiz.questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };

//   const handleReviewQuestion = (questionIndex: number) => {
//     setReviewMode(true);
//     setShowResults(false);
//     setCurrentQuestionIndex(questionIndex);
//   };

//   const handleBackToResults = () => {
//     setReviewMode(false);
//     setShowResults(true);
//   };

//   // Calculate correctness array for question palette
//   const getCorrectAnswers = () => {
//     if (!quiz) return [];
    
//     return quiz.questions.map((q, i) => 
//       selectedAnswers[i] === q.correctOptionId
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-xl">Loading quiz...</div>
//       </div>
//     );
//   }

//   if (error || !quiz) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-xl text-red-500">{error || 'Failed to load quiz'}</div>
//       </div>
//     );
//   }

//   const correctAnswersArray = getCorrectAnswers();
//   const correctCount = correctAnswersArray.filter(Boolean).length;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <QuizHeader
//         timeLeft={quizCompleted ? 0 : timeLeft}
//         onOpenInstructions={() => setIsInstructionsOpen(true)}
//         onOpenPalette={() => setIsPaletteOpen(true)}
//         onSubmit={() => setIsConfirmingSubmit(true)}
//         onExit={handleExit}
//         quizTitle={quiz.title}
//         quizCompleted={quizCompleted}
//         reviewMode={reviewMode}
//         onBackToResults={handleBackToResults}
//         correctCount={correctCount}
//         totalQuestions={quiz.questions.length}
//       />

//       <div className="pt-16 pb-4">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row gap-4">
//             <QuestionArea
//               currentQuestion={quiz.questions[currentQuestionIndex]}
//               currentIndex={currentQuestionIndex}
//               totalQuestions={quiz.questions.length}
//               selectedAnswer={selectedAnswers[currentQuestionIndex]}
//               isMarkedForReview={markedForReview.has(currentQuestionIndex)}
//               onMarkForReview={handleMarkForReview}
//               onSelectOption={handleOptionSelect}
//               onNavigate={navigateQuestion}
//               quizCompleted={quizCompleted}
//               reviewMode={reviewMode}
//             />

//             <QuestionPalette
//               totalQuestions={quiz.questions.length}
//               currentIndex={currentQuestionIndex}
//               answeredQuestions={Object.keys(selectedAnswers).map(Number)}
//               markedQuestions={Array.from(markedForReview)}
//               onSelectQuestion={setCurrentQuestionIndex}
//               isOpen={isPaletteOpen}
//               onClose={() => setIsPaletteOpen(false)}
//               quizCompleted={quizCompleted}
//               correctAnswers={correctAnswersArray}
//               correctCount={correctCount}
//             />
//           </div>
//         </div>
//       </div>

//       <Instructions
//         isOpen={isInstructionsOpen}
//         onClose={handleStartQuiz}
//         quizTitle={quiz.title}
//         quizDescription={quiz.description}
//         durationMinutes={quiz.durationMinutes}
//         questionCount={quiz.questions.length}
//       />

//       <SubmitConfirmation
//         isOpen={isConfirmingSubmit}
//         onConfirm={handleSubmit}
//         onCancel={() => setIsConfirmingSubmit(false)}
//       />

//       <ExitConfirmation
//         isOpen={isConfirmingExit}
//         onConfirm={confirmExit}
//         onCancel={() => setIsConfirmingExit(false)}
//       />

//       <QuizResults
//         isOpen={showResults}
//         onClose={() => setShowResults(false)}
//         score={quizScore.correct}
//         totalQuestions={quiz.questions.length}
//         incorrectAnswers={quizScore.incorrect}
//         onRetakeQuiz={handleRetakeQuiz}
//         onReviewQuestion={handleReviewQuestion}
//       />
//     </div>
//   );
// }
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import QuizHeader from '../components/quiz/QuizHeader';
import QuestionArea from '../components/quiz/QuestionArea';
import QuestionPalette from '../components/quiz/QuestionPalette';
import SubmitConfirmation from '../components/quiz/modals/SubmitConfirmation';
import Instructions from '../components/quiz/modals/Instructions';
import QuizResults from '../components/quiz/QuizResults';
import ExitConfirmation from '../components/quiz/modals/ExitConfirmation';
import axios from 'axios';

// Define interfaces for the data structure
interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
  explanation: string;
  correctOptionId: number;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  questions: Question[];
}

interface IncorrectAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  questionIndex: number; // Added to enable reopening specific questions
}

interface QuizAttempt {
  attemptId: number;
  startTime: string;
  endTime: string | null;
  score: number | null;
  studentId: number;
  studentName: string;
  quizId: number;
  quizTitle: string;
}

export default function QuizPage() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(3600); // Will be updated with quiz duration
  const [isConfirmingSubmit, setIsConfirmingSubmit] = useState(false);
  const [isConfirmingExit, setIsConfirmingExit] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, incorrect: [] as IncorrectAnswer[] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);
  const { topicId } = useParams();

  // Fetch quiz data from API
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        // Get token from localStorage or wherever it's stored in your app
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`http://localhost:9090/api/quizzes/topic/${topicId}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          const quizData = response.data.data[0]; // Getting the first quiz
          
          // Transform API data to our required format
          const transformedQuestions: Question[] = quizData.questions.map(q => {
            // Randomize options order while keeping track of correct option
            const shuffledOptions = shuffleOptions(q.options);
            
            // Find the new ID of the correct option after shuffling
            const correctOption = shuffledOptions.find(opt => opt.isCorrect);
            const correctOptionId = correctOption ? correctOption.id : -1;
            
            return {
              id: q.questionId,
              question: q.questionText,
              options: shuffledOptions,
              explanation: q.explanation,
              correctOptionId
            };
          });
          
          setQuiz({
            id: quizData.quizId,
            title: quizData.quizTitle,
            description: quizData.description,
            durationMinutes: quizData.durationMinutes,
            questions: transformedQuestions
          });
          
          // Set time based on quiz duration but don't start timer yet
          setTimeLeft(quizData.durationMinutes * 60);
        } else {
          setError('Failed to fetch quiz data');
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Error connecting to quiz server');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizData();
  }, [topicId]);

  // Function to shuffle options and identify the correct one
  const shuffleOptions = (options) => {
    const transformedOptions = options.map((opt, index) => ({
      id: opt.optionId,
      text: opt.optionText,
      isCorrect: opt.correct
    }));
    
    // Fisher-Yates shuffle algorithm
    for (let i = transformedOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [transformedOptions[i], transformedOptions[j]] = [transformedOptions[j], transformedOptions[i]];
    }
    
    return transformedOptions;
  };

  // Start quiz attempt
  const startQuizAttempt = async () => {
    try {
      const token = localStorage.getItem('token');
      const studentId = localStorage.getItem('id'); // Assuming you store the student ID in localStorage
      const quizId = quiz?.id; // Use the quiz ID fetched from the backend
  
      if (!studentId || !quizId) {
        throw new Error('Student ID or Quiz ID is missing');
      }
  
      const response = await axios.post(
        'http://localhost:9090/api/quiz-attempts/start',
        {
          studentId: parseInt(studentId), // Ensure studentId is a number
          quizId: quizId,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data.success) {
        setCurrentAttempt(response.data.data);
        toast.success('Quiz started successfully!');
        setQuizStarted(true); // Set quizStarted to true to start the timer
      } else {
        throw new Error('Failed to start quiz');
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error('Failed to start quiz');
    }
  };

  // Submit a single answer
  const submitAnswer = async (questionId, optionId) => {
    if (!currentAttempt) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `http://localhost:9090/api/quiz-attempts/${currentAttempt.attemptId}/submit`,
        {
          questionId: questionId,
          selectedOptionId: optionId
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.data.success) {
        toast.error('Failed to submit answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  // Finish quiz and submit all answers
  const finishQuiz = async () => {
    if (!currentAttempt) return;
    
    try {
      const token = localStorage.getItem('token');
      
      // Submit any remaining answers
      const submitPromises = Object.entries(selectedAnswers).map(([index, optionId]) => {
        const questionId = quiz?.questions[parseInt(index)]?.id;
        if (questionId) {
          return submitAnswer(questionId, optionId);
        }
        return Promise.resolve();
      });
      
      await Promise.all(submitPromises);
      
      // Finish the quiz
      const response = await axios.post(
        `http://localhost:9090/api/quiz-attempts/${currentAttempt.attemptId}/finish`,
        {},
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.data.success) {
        // Get results
        const resultResponse = await axios.get(
          `http://localhost:9090/api/quiz-attempts/${currentAttempt.attemptId}/result`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (resultResponse.data.success) {
          const result = resultResponse.data.data;
          // Format results for our frontend
          setQuizScore({
            correct: result.correctAnswers,
            incorrect: [] // You may need to format this differently based on your API response
          });
        }
        
        setQuizCompleted(true);
        setShowResults(true);
      } else {
        toast.error('Failed to finish quiz');
      }
    } catch (error) {
      console.error('Error finishing quiz:', error);
      toast.error('Failed to finish quiz');
    }
  };

  // Start timer only after quiz has started and not completed
  useEffect(() => {
    if (!loading && quiz && quizStarted && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, quiz, quizStarted, quizCompleted]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!showResults && !quizCompleted && quizStarted) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [showResults, quizCompleted, quizStarted]);

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  };

  const handleOptionSelect = useCallback(async (optionId: number) => {
    if (quizCompleted && !reviewMode) return; // Prevent changing answers if quiz is completed

    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionId
    }));

    // Submit answer to backend if we have an active attempt
    if (currentAttempt && quiz) {
      const questionId = quiz.questions[currentQuestionIndex].id;
      await submitAnswer(questionId, optionId);
    }
    
    toast.success('Answer saved!');
  }, [currentQuestionIndex, quizCompleted, reviewMode, currentAttempt, quiz]);

  const handleMarkForReview = useCallback(() => {
    if (quizCompleted && !reviewMode) return; // Prevent marking for review if quiz is completed

    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  }, [currentQuestionIndex, quizCompleted, reviewMode]);

  const calculateScore = () => {
    if (!quiz) return { correct: 0, incorrect: [] as IncorrectAnswer[] };
    
    let correct = 0;
    const incorrect: IncorrectAnswer[] = [];

    for (let i = 0; i < quiz.questions.length; i++) {
      const userAnswer = selectedAnswers[i];
      const question = quiz.questions[i];
      
      if (userAnswer === question.correctOptionId) {
        correct++;
      } else {
        incorrect.push({
          question: question.question,
          userAnswer: question.options.find(opt => opt.id === userAnswer)?.text || 'Not answered',
          correctAnswer: question.options.find(opt => opt.isCorrect)?.text || '',
          questionIndex: i // Store the index to enable reopening the question
        });
      }
    }

    return { correct, incorrect };
  };

  const handleSubmit = () => {
    finishQuiz();
  };

  const handleStartQuiz = () => {
    setIsInstructionsOpen(false);
    startQuizAttempt(); // Start the quiz attempt in backend
    enterFullscreen();
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setMarkedForReview(new Set());
    setCurrentQuestionIndex(0);
    setTimeLeft(quiz ? quiz.durationMinutes * 60 : 3600);
    setShowResults(false);
    setQuizCompleted(false);
    setReviewMode(false);
    startQuizAttempt(); // Create a new attempt
    enterFullscreen();
  };

  const handleExit = () => {
    setIsConfirmingExit(true);
  };

  const confirmExit = () => {
    // If quiz started but not completed, finish it
    if (quizStarted && !quizCompleted && currentAttempt) {
      finishQuiz();
    }
    exitFullscreen();
    navigate('/dashboard');
  };

  const navigateQuestion = (direction: 'prev' | 'next') => {
    if (!quiz) return;
    
    if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (direction === 'next' && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleReviewQuestion = (questionIndex: number) => {
    setReviewMode(true);
    setShowResults(false);
    setCurrentQuestionIndex(questionIndex);
  };

  const handleBackToResults = () => {
    setReviewMode(false);
    setShowResults(true);
  };

  // Calculate correctness array for question palette
  const getCorrectAnswers = () => {
    if (!quiz) return [];
    
    return quiz.questions.map((q, i) => 
      selectedAnswers[i] === q.correctOptionId
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading quiz...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-gray-400">No quiz available for this topic</div>
      </div>
    );
  }

  const correctAnswersArray = getCorrectAnswers();
  const correctCount = correctAnswersArray.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <QuizHeader
        timeLeft={quizCompleted ? 0 : timeLeft}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
        onOpenPalette={() => setIsPaletteOpen(true)}
        onSubmit={() => setIsConfirmingSubmit(true)}
        onExit={handleExit}
        quizTitle={quiz.title}
        quizCompleted={quizCompleted}
        reviewMode={reviewMode}
        onBackToResults={handleBackToResults}
        correctCount={correctCount}
        totalQuestions={quiz.questions.length}
        showSubmitButton={!quizCompleted && !reviewMode} // Only show submit button when not completed and not in review
      />

      <div className="pt-16 pb-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <QuestionArea
              currentQuestion={quiz.questions[currentQuestionIndex]}
              currentIndex={currentQuestionIndex}
              totalQuestions={quiz.questions.length}
              selectedAnswer={selectedAnswers[currentQuestionIndex]}
              isMarkedForReview={markedForReview.has(currentQuestionIndex)}
              onMarkForReview={handleMarkForReview}
              onSelectOption={handleOptionSelect}
              onNavigate={navigateQuestion}
              quizCompleted={quizCompleted}
              reviewMode={reviewMode}
            />

            <QuestionPalette
              totalQuestions={quiz.questions.length}
              currentIndex={currentQuestionIndex}
              answeredQuestions={Object.keys(selectedAnswers).map(Number)}
              markedQuestions={Array.from(markedForReview)}
              onSelectQuestion={setCurrentQuestionIndex}
              isOpen={isPaletteOpen}
              onClose={() => setIsPaletteOpen(false)}
              quizCompleted={quizCompleted}
              correctAnswers={correctAnswersArray}
              correctCount={correctCount}
            />
          </div>
        </div>
      </div>

      <Instructions
        isOpen={isInstructionsOpen}
        onClose={handleStartQuiz}
        quizTitle={quiz.title}
        quizDescription={quiz.description}
        durationMinutes={quiz.durationMinutes}
        questionCount={quiz.questions.length}
      />

      {/* Only show submit confirmation if not in completed or review mode */}
      {!quizCompleted && !reviewMode && (
        <SubmitConfirmation
          isOpen={isConfirmingSubmit}
          onConfirm={handleSubmit}
          onCancel={() => setIsConfirmingSubmit(false)}
        />
      )}

      <ExitConfirmation
        isOpen={isConfirmingExit}
        onConfirm={confirmExit}
        onCancel={() => setIsConfirmingExit(false)}
      />

      <QuizResults
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        score={quizScore.correct}
        totalQuestions={quiz.questions.length}
        incorrectAnswers={quizScore.incorrect}
        onRetakeQuiz={handleRetakeQuiz}
        onReviewQuestion={handleReviewQuestion}
      />
    </div>
  );
}