import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  ClipboardList, 
  LogOut, 
  UserCircle,
  Menu,
  X
} from "lucide-react";
import { useDispatch } from "react-redux";
// import { logout } from "../../store/slice/authSlice";
// import adminLogo from "../../assets/admin-logo.png"; // Create or import an admin logo

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    // dispatch(logout());
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/dashboard-admin",
    },
    {
      name: "Teachers",
      icon: <Users className="w-5 h-5" />,
      path: "/dashboard-admin/teachers",
    },
    {
      name: "Students",
      icon: <GraduationCap className="w-5 h-5" />,
      path: "/dashboard-admin/students",
    },
    {
      name: "Subjects",
      icon: <BookOpen className="w-5 h-5" />,
      path: "/dashboard-admin/subjects",
    },
    {
      name: "Topics",
      icon: <FileText className="w-5 h-5" />,
      path: "/dashboard-admin/topics",
    },
    {
      name: "Quizzes",
      icon: <ClipboardList className="w-5 h-5" />,
      path: "/dashboard-admin/quizzes",
    },
    {
      name: "Profile",
      icon: <UserCircle className="w-5 h-5" />,
      path: "/dashboard-admin/profile",
    },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 lg:hidden bg-indigo-700 text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } bg-indigo-800 text-white w-64 md:w-20 lg:w-64 flex flex-col overflow-y-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center py-6 border-b border-indigo-700">
          <div className="flex items-center space-x-3">
            <img
              src={"https://via.placeholder.com/40"}
              alt="Admin Logo"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-xl font-bold hidden md:hidden lg:block">Admin Panel</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col flex-grow py-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 my-1 mx-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-700"
                }`
              }
            >
              <div className="flex items-center">
                {item.icon}
                <span className="ml-3 hidden md:hidden lg:block">{item.name}</span>
              </div>
            </NavLink>
          ))}
        </div>

        {/* Logout */}
        <div className="px-4 py-6 border-t border-indigo-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3 hidden md:hidden lg:block">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;