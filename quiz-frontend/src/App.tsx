// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Profile from './pages/Profile';
// import QuizPage from './pages/QuizPage';
// import Performance from './pages/Performance';
// import QuizHistory from './pages/QuizHistory';
// import ProtectedRoute from './components/ProtectedRoute';
// import Sidebar from './components/Sidebar';
// import TeacherProfile from './pages/teacher/TeacherProfile';
// import TeachersSidebar from './components/teacher/TeachersSidebar';
// import TeacherDashboard from './pages/teacher/TeacherDashboard';
// import CreateQuiz from './pages/teacher/CreateQuiz';

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route
//           path="/dashboard/*"
//           element={
//             <ProtectedRoute>
//               <div className="flex">
//                 <Sidebar />
//                 <div className="flex-1 md:ml-20 lg:ml-64 p-4">
//                   <Routes>
//                     <Route path="/" element={<Profile/>} />
//                     <Route path="/performance" element={<Performance />} />
//                     <Route path="/history" element={<QuizHistory />} />
//                   </Routes>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/dashboard-teacher/*"
//           element={
//             <ProtectedRoute>
//               <div className="flex">
//                 <TeachersSidebar />
//                 <div className="flex-1 md:ml-20 lg:ml-64 p-4">
//                   <Routes>
//                   <Route path="/" element={<TeacherDashboard/>} />
//                     <Route path="/profile" element={<TeacherProfile />} />
//                     <Route path="/quiz" element={<CreateQuiz />} />
//                   </Routes>
//                 </div>
//               </div>
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/quiz"
//           element={
//             <ProtectedRoute>
//               <QuizPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import QuizPage from './pages/QuizPage';
import Performance from './pages/Performance';
import QuizHistory from './pages/QuizHistory';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TeacherProfile from './pages/teacher/TeacherProfile';
import TeachersSidebar from './components/teacher/TeachersSidebar';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateQuiz from './pages/teacher/CreateQuiz';
import SubjectsPage from './pages/subjectPage';
import TopicsPage from './pages/topicPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 md:ml-20 lg:ml-64 p-4">
                  <Routes>
                    <Route path="/" element={<Profile/>} />
                    <Route path="/performance" element={<Performance />} />
                    <Route path="/history" element={<QuizHistory />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-teacher/*"
          element={
            <ProtectedRoute>
              <div className="flex">
                <TeachersSidebar />
                <div className="flex-1 md:ml-20 lg:ml-64 p-4">
                  <Routes>
                    <Route path="/" element={<TeacherDashboard/>} />
                    <Route path="/profile" element={<TeacherProfile />} />
                    <Route path="/quiz" element={<CreateQuiz />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 md:ml-20 lg:ml-64 p-4">
                  <SubjectsPage />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects/:subjectId"
          element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 md:ml-20 lg:ml-64 p-4">
                  <TopicsPage />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:subjectId/:topicId"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;