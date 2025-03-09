import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginDispatch } from "./store/slice/authSlice";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import TeachersSidebar from "./components/teacher/TeachersSidebar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Performance from "./pages/Performance";
import QuizHistory from "./pages/QuizHistory";
import QuizPage from "./pages/QuizPage";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateQuiz from "./pages/teacher/CreateQuiz";
import SubjectsPage from "./pages/subjectPage";
import TopicsPage from "./pages/topicPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && localStorage.getItem("token")) {
      dispatch(loginDispatch(user));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Dashboard Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Profile />} />
                  <Route path="/performance" element={<Performance />} />
                  <Route path="/history" element={<QuizHistory />} />
                  <Route path="/subject" element={<SubjectsPage />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Teacher Dashboard Routes */}
        <Route
          path="/dashboard-teacher/*"
          element={
            <ProtectedRoute>
              <TeacherDashboardLayout>
                <Routes>
                  <Route path="/" element={<TeacherDashboard />} />
                  <Route path="/profile" element={<TeacherProfile />} />
                  <Route path="/quiz" element={<CreateQuiz />} />
                  <Route path="/subjects" element={<SubjectsPage />} />
                  <Route path="/subjects/:subjectId" element={<TopicsPage />} />
                  <Route path="/quiz/teacher/:subjectId/:topicId" element={<CreateQuiz />} />
                </Routes>
              </TeacherDashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Subjects & Topics Routes */}

        

        {/* Quiz Routes */}
        <Route
          path="/quiz/:subjectId/:topicId"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/teacher/:subjectId/:topicId"
          element={
            <ProtectedRoute>
              <CreateQuiz />
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

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

// Layout Components for Clean Code
const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1 md:ml-20 lg:ml-64 p-4">{children}</div>
  </div>
);

const TeacherDashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex">
    <TeachersSidebar />
    <div className="flex-1 md:ml-20 lg:ml-64 p-4">{children}</div>
  </div>
);

export default App;
