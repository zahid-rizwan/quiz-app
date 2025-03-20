import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, BarChart2, History, BookOpen } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slice/authSlice';

// Import a custom logout icon instead of using the Lucide one
const CustomLogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// Custom GitHub icon
const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

// Custom Google icon
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="none" />
    <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 12h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile); // Keep sidebar open on desktop, closed on mobile
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      exact: true
    },
    {
      path: '/dashboard/performance',
      name: 'Performance',
      icon: BarChart2,
      exact: true
    },
    {
      path: '/dashboard/history',
      name: 'Quiz History',
      icon: History,
      exact: true
    },
    {
      path: '/dashboard/subjects',
      name: 'Subjects',
      icon: BookOpen,
      includesPath: ['/dashboard/subjects', '/quiz']
    }
  ];

  const mobileNavItems = [
    ...menuItems.slice(0, 4), // Take first 4 items or all if fewer
    {
      path: '/logout',
      name: 'Logout',
      icon: CustomLogoutIcon, // Using the custom logout icon here
      exact: true
    }
  ];

  const isActivePath = (item) => {
    if (item.exact && (location.pathname === item.path || location.pathname === item.path + '/')) {
      return true;
    }
    
    if (item.includesPath && item.includesPath.some(path => 
      location.pathname.startsWith(path) || location.pathname.includes(path)
    )) {
      return true;
    }
    
    return false;
  };
  
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleNavigation = (path) => {
    if (path === '/logout') {
      handleLogout();
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {/* Desktop Sidebar Toggle Button - only visible on desktop */}
      {!isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-100 lg:left-6"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      {/* Desktop Sidebar - only visible on desktop */}
      {!isMobile && (
        <div
          className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-all duration-300 ${
            isOpen ? 'w-64' : 'w-20'
          }`}
          style={{ zIndex: 1000 }} // High z-index to ensure it's on top
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-center">
                <span className={`font-bold text-2xl ${!isOpen && 'hidden'}`}>AQS</span>
                {!isOpen && <span className="font-bold text-sm">AQS</span>}
              </div>
            </div>

            <nav className="flex-1 p-4">
              {menuItems.map((item) => (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center px-4 py-3 my-2 rounded-lg cursor-pointer transition-colors ${
                    isActivePath(item)
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-indigo-50'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </div>
              ))}
            </nav>

            <div className="p-4 border-t">
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
              >
                <CustomLogoutIcon /> {/* Using the custom logout icon here */}
                {isOpen && <span className="ml-3">Logout</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation - only visible on mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30">
          <div className="flex justify-around items-center h-16">
            {mobileNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  item.path === '/logout' 
                    ? 'text-red-600' 
                    : isActivePath(item)
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* This section could be added to an authentication component if needed */}
      {/* 
      <div className="auth-providers">
        <button className="auth-btn github">
          <GitHubIcon />
          <span>Continue with GitHub</span>
        </button>
        <button className="auth-btn google">
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>
      </div>
      */}
    </>
  );
};

export default Sidebar;