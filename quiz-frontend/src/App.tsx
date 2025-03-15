import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginDispatch } from "./store/slice/authSlice";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import TeachersSidebar from "./components/teacher/TeachersSidebar";
import AdminSidebar from "./components/admin/AdminSidebar";

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

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import ManageTeachers from "./pages/admin/ManageTeachers";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageQuizzes from "./pages/admin/ManageQuizzes";
import ManageSubjects from "./pages/admin/ManageSubjects";
import ManageTopics from "./pages/admin/ManageTopics";
import AddTeacher from "./pages/admin/AddTeacher";
import EditTeacher from "./pages/admin/EditTeacher";
import AddSubject from "./pages/admin/AddSubject";
import EditSubject from "./pages/admin/EditSubject";
import AddTopic from "./pages/admin/AddTopic";
import EditTopic from "./pages/admin/EditTopic";
import AllQuizes from "./pages/AllQuizes";

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
                  <Route path="/subjects" element={<SubjectsPage />} />
                  <Route path="/all-quizzes" element={<AllQuizes/>} />
                  <Route path="/quiz/:quizId" element={<QuizPage/>} />

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

        {/* Admin Dashboard Routes */}
        <Route
          path="/dashboard-admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboardLayout>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/profile" element={<AdminProfile />} />
                  <Route path="/teachers" element={<ManageTeachers />} />
                  <Route path="/teachers/add" element={<AddTeacher />} />
                  <Route path="/teachers/edit/:teacherId" element={<EditTeacher />} />
                  <Route path="/students" element={<ManageStudents />} />
                  <Route path="/quizzes" element={<ManageQuizzes />} />
                  <Route path="/subjects" element={<ManageSubjects />} />
                  <Route path="/subjects/add" element={<AddSubject />} />
                  <Route path="/subjects/edit/:subjectId" element={<EditSubject />} />
                  <Route path="/topics" element={<ManageTopics />} />
                  <Route path="/topics/add" element={<AddTopic />} />
                  <Route path="/topics/edit/:topicId" element={<EditTopic />} />
                </Routes>
              </AdminDashboardLayout>
            </ProtectedRoute>
          }
        />

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
const DashboardLayout = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1 md:ml-20 lg:ml-64 p-4">{children}</div>
  </div>
);

const TeacherDashboardLayout = ({ children }) => (
  <div className="flex">
    <TeachersSidebar />
    <div className="flex-1 md:ml-20 lg:ml-64 p-4">{children}</div>
  </div>
);

const AdminDashboardLayout = ({ children }) => (
  <div className="flex">
    <AdminSidebar />
    <div className="flex-1 md:ml-20 lg:ml-64 p-4">{children}</div>
  </div>
);

export default App;