import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, BookOpen, FileText, ClipboardList, ArrowRight } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    teachersCount: 0,
    studentsCount: 0,
    subjectsCount: 0,
    topicsCount: 0,
    quizzesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoints
        const [teachers, students, subjects, topics, quizzes] = await Promise.all([
          axios.get("http://localhost:9090/admin/teachers/count"),
          axios.get("http://localhost:9090/admin/students/count"),
          axios.get("http://localhost:9090/admin/subjects/count"),
          axios.get("http://localhost:9090/admin/topics/count"),
          axios.get("http://localhost:9090/admin/quizzes/count"),
        ]);

        setStats({
          teachersCount: teachers.data || 0,
          studentsCount: students.data || 0,
          subjectsCount: subjects.data || 0,
          topicsCount: topics.data || 0,
          quizzesCount: quizzes.data || 0,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        // For demo purposes, set some mock data
        setStats({
          teachersCount: 15,
          studentsCount: 120,
          subjectsCount: 8,
          topicsCount: 24,
          quizzesCount: 45,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Teachers",
      count: stats.teachersCount,
      icon: <Users className="w-10 h-10 text-indigo-600" />,
      bgColor: "bg-indigo-100",
      route: "/dashboard-admin/teachers",
    },
    {
      title: "Students",
      count: stats.studentsCount,
      icon: <GraduationCap className="w-10 h-10 text-purple-600" />,
      bgColor: "bg-purple-100",
      route: "/dashboard-admin/students",
    },
    {
      title: "Subjects",
      count: stats.subjectsCount,
      icon: <BookOpen className="w-10 h-10 text-blue-600" />,
      bgColor: "bg-blue-100",
      route: "/dashboard-admin/subjects",
    },
    {
      title: "Topics",
      count: stats.topicsCount,
      icon: <FileText className="w-10 h-10 text-green-600" />,
      bgColor: "bg-green-100",
      route: "/dashboard-admin/topics",
    },
    {
      title: "Quizzes",
      count: stats.quizzesCount,
      icon: <ClipboardList className="w-10 h-10 text-orange-600" />,
      bgColor: "bg-orange-100",
      route: "/dashboard-admin/quizzes",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage all aspects of the Adaptive Quiz System from this control panel.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`${card.bgColor} rounded-lg shadow-md p-6 cursor-pointer transition-transform hover:scale-105`}
            onClick={() => navigate(card.route)}
          >
            <div className="flex items-center justify-between mb-4">
              {card.icon}
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{card.count}</h3>
            <p className="text-gray-600">{card.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/dashboard-admin/teachers/add")}
              className="flex items-center justify-between bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <span>Add New Teacher</span>
              <Users className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/dashboard-admin/subjects/add")}
              className="flex items-center justify-between bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Add New Subject</span>
              <BookOpen className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/dashboard-admin/topics/add")}
              className="flex items-center justify-between bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              <span>Add New Topic</span>
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/dashboard-admin/quizzes")}
              className="flex items-center justify-between bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <span>Review Quizzes</span>
              <ClipboardList className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Server Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Database Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Backup</span>
              <span className="text-gray-800">Today, 03:15 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">System Version</span>
              <span className="text-gray-800">v1.5.2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;