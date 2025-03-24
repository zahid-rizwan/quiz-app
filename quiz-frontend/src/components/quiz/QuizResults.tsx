// import React from 'react';

// interface IncorrectAnswer {
//   question: string;
//   userAnswer: string;
//   correctAnswer: string;
//   questionIndex: number;
// }

// interface QuizResultsProps {
//   isOpen: boolean;
//   onClose: () => void;
//   score: number;
//   totalQuestions: number;
//   incorrectAnswers: IncorrectAnswer[];
//   onRetakeQuiz: () => void;
//   onReviewQuestion: (questionIndex: number) => void;
// }

// export default function QuizResults({
//   isOpen,
//   onClose,
//   score,
//   totalQuestions,
//   incorrectAnswers,
//   onRetakeQuiz,
//   onReviewQuestion
// }: QuizResultsProps) {
//   if (!isOpen) return null;
  
//   const percentage = (score / totalQuestions) * 100;
//   const isPassing = percentage >= 70;

//   // Function to share on Facebook
//   const shareOnFacebook = () => {
//     const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=I scored ${score} out of ${totalQuestions} on this quiz!`;
//     window.open(shareUrl, '_blank');
//   };

//   // Function to share on LinkedIn
//   const shareOnLinkedIn = () => {
//     const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=I scored ${score} out of ${totalQuestions} on this quiz!`;
//     window.open(shareUrl, '_blank');
//   };

//   // Function to handle redirection
//   const handleRedirect = () => {
//     window.location.href = '/dashboard'; // Change this to your desired redirect URL
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b">
//           <h2 className="text-2xl font-bold">Quiz Results</h2>
//         </div>
        
//         <div className="p-6">
//           <div className="mb-6 text-center">
//             <div className="text-4xl font-bold mb-2">
//               {score} / {totalQuestions}
//             </div>
//             <div className={`text-xl ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
//               {percentage.toFixed(1)}% {isPassing ? 'Passed' : 'Failed'}
//             </div>
//           </div>
          
//           {/* Share Buttons */}
//           <div className="flex justify-center gap-4 mb-6">
//             <button
//               onClick={shareOnFacebook}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Share on Facebook
//             </button>
//             <button
//               onClick={shareOnLinkedIn}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Share on LinkedIn
//             </button>
//           </div>

//           {incorrectAnswers.length > 0 && (
//             <div className="mb-6">
//               <h3 className="text-xl font-semibold mb-3">Incorrect Answers</h3>
//               <div className="space-y-4">
//                 {incorrectAnswers.map((item, index) => (
//                   <div key={index} className="border rounded-lg p-4">
//                     <div className="font-medium mb-2">{item.question}</div>
//                     <div className="text-sm text-red-600 mb-1">
//                       Your answer: {item.userAnswer || 'Not answered'}
//                     </div>
//                     <div className="text-sm text-green-600 mb-3">
//                       Correct answer: {item.correctAnswer}
//                     </div>
//                     <button
//                       onClick={() => onReviewQuestion(item.questionIndex)}
//                       className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded"
//                     >
//                       Review Question
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           <div className="flex justify-between">
//             <button
//               onClick={onRetakeQuiz}
//               className="px-4 py-2 bg-blue-500 text-white rounded"
//             >
//               Retake Quiz
//             </button>
//             <button
//               onClick={handleRedirect}
//               className="px-4 py-2 bg-green-500 text-white rounded"
//             >
//               Go to Dashboard
//             </button>
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-300 rounded"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

interface IncorrectAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  questionIndex: number;
}

interface QuizResultsProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  totalQuestions: number;
  incorrectAnswers: IncorrectAnswer[];
  onRetakeQuiz: () => void;
  onReviewQuestion: (questionIndex: number) => void;
}

export default function QuizResults({
  isOpen,
  onClose,
  score,
  totalQuestions,
  incorrectAnswers,
  onRetakeQuiz,
  onReviewQuestion
}: QuizResultsProps) {
  const resultsRef = useRef<HTMLDivElement>(null); // Ref to capture the quiz result (excluding share buttons)

  if (!isOpen) return null;
  
  const percentage = (score / totalQuestions) * 100;
  const isPassing = percentage >= 70;

  // Function to capture the quiz result as an image (excluding share buttons)
  const captureResultImage = async () => {
    if (resultsRef.current) {
      const canvas = await html2canvas(resultsRef.current);
      return canvas.toDataURL('image/png'); // Returns the image as a data URL
    }
    return null;
  };

  // Function to share on LinkedIn with an image
  const shareOnLinkedIn = async () => {
    const imageDataUrl = await captureResultImage();
    if (!imageDataUrl) return;

    // Upload the image to a server and get a public URL
    const imageUrl = await uploadImageToServer(imageDataUrl);

    // LinkedIn share URL
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(imageUrl)}&title=I scored ${score} out of ${totalQuestions} on this quiz!`;
    window.open(shareUrl, '_blank');
  };

  // Function to share on Facebook with an image
  const shareOnFacebook = async () => {
    const imageDataUrl = await captureResultImage();
    if (!imageDataUrl) return;

    // Upload the image to a server and get a public URL
    const imageUrl = await uploadImageToServer(imageDataUrl);

    // Facebook share URL
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}&quote=I scored ${score} out of ${totalQuestions} on this quiz!`;
    window.open(shareUrl, '_blank');
  };

  // Function to upload the image to a server (e.g., Cloudinary)
  const uploadImageToServer = async (imageDataUrl: string) => {
    try {
      // Example: Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', imageDataUrl);
      formData.append('upload_preset', 'adaptive-quiz-system'); 
      formData.append('cloud_name', 'dz7sfupkn'); // Replace with your Cloudinary upload preset

      const response = await fetch('https://api.cloudinary.com/v1_1/dz7sfupkn/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.secure_url; // Return the public URL of the uploaded image
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Content to be captured in the screenshot */}
        <div ref={resultsRef}>
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Quiz Results</h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6 text-center">
              <div className="text-4xl font-bold mb-2">
                {score} / {totalQuestions}
              </div>
              <div className={`text-xl ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                {percentage.toFixed(1)}% {isPassing ? 'Passed' : 'Failed'}
              </div>
            </div>

            {incorrectAnswers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Incorrect Answers</h3>
                <div className="space-y-4">
                  {incorrectAnswers.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="font-medium mb-2">{item.question}</div>
                      <div className="text-sm text-red-600 mb-1">
                        Your answer: {item.userAnswer || 'Not answered'}
                      </div>
                      <div className="text-sm text-green-600 mb-3">
                        Correct answer: {item.correctAnswer}
                      </div>
                      <button
                        onClick={() => onReviewQuestion(item.questionIndex)}
                        className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded"
                      >
                        Review Question
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Share Buttons (outside the screenshot area) */}
        <div className="p-6">
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={shareOnFacebook}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Share on Facebook
            </button>
            <button
              onClick={shareOnLinkedIn}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Share on LinkedIn
            </button>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onRetakeQuiz}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Retake Quiz
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}