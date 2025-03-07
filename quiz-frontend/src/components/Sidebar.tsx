// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Menu, X, LayoutDashboard, Bell, BarChart2, History, LogOut, PlayCircle } from 'lucide-react';
// import { useDispatch } from 'react-redux';
// import {logout} from '../store/slice/authSlice'

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth < 768) {
//         setIsOpen(false);
//       }
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const menuItems = [
//     {
//       path: '/dashboard',
//       name: 'Dashboard',
//       icon: LayoutDashboard
//     },
//     {
//       path: '/dashboard/performance',
//       name: 'Performance',
//       icon: BarChart2
//     },
//     {
//       path: '/dashboard/history',
//       name: 'Quiz History',
//       icon: History
//     },
//     {
//       path: '/quiz',
//       name: 'Take Quiz',
//       icon: PlayCircle
//     }
//   ];

//   const isActivePath = (path: string) => {
//     return location.pathname === path || location.pathname === path + '/';
//   };
//   const handleLogout = () =>{
//     dispatch(
//       logout()
//     )
//     navigate("/")
//   }

//   return (
//     <>
//       {/* Desktop Sidebar Toggle Button */}
//       {!isMobile && (
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-100 lg:left-6"
//         >
//           {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//       )}

//       {/* Desktop Sidebar */}
//       {!isMobile && (
//         <div
//           className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-all duration-300 ${
//             isOpen ? 'w-64' : 'w-20'
//           }`}
//         >
//           <div className="flex flex-col h-full">
//             <div className="p-4 border-b">
//               <div className="flex items-center justify-center">
//                 <span className={`font-bold text-2xl ${!isOpen && 'hidden'}`}>AQS</span>
//               </div>
//             </div>

//             <nav className="flex-1 p-4">
//               {menuItems.map((item) => (
//                 <div
//                   key={item.path}
//                   onClick={() => navigate(item.path)}
//                   className={`flex items-center px-4 py-3 my-2 rounded-lg cursor-pointer transition-colors ${
//                     isActivePath(item.path)
//                       ? 'bg-indigo-600 text-white'
//                       : 'hover:bg-indigo-50'
//                   }`}
//                 >
//                   <item.icon className="w-6 h-6" />
//                   {isOpen && <span className="ml-3">{item.name}</span>}
//                 </div>
//               ))}
//             </nav>

//             <div className="p-4 border-t">
//               <button 
//                 onClick={() =>{handleLogout()}}
//                 className="flex items-center w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
//               >
//                 <LogOut className="w-6 h-6" />
//                 {isOpen && <span className="ml-3">Logout</span>}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Mobile Bottom Navigation */}
//       {isMobile && (
//         <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
//           <div className="flex justify-around items-center h-16">
//             {menuItems.map((item) => (
//               <button
//                 key={item.path}
//                 onClick={() => navigate(item.path)}
//                 className={`flex flex-col items-center justify-center flex-1 h-full ${
//                   isActivePath(item.path)
//                     ? 'text-indigo-600'
//                     : 'text-gray-600 hover:text-indigo-600'
//                 }`}
//               >
//                 <item.icon className="w-6 h-6" />
//                 <span className="text-xs mt-1">{item.name}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Sidebar;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Bell, BarChart2, History, LogOut, BookOpen } from 'lucide-react';
import { useDispatch } from 'react-redux';
import {logout} from '../store/slice/authSlice'

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/dashboard/performance',
      name: 'Performance',
      icon: BarChart2
    },
    {
      path: '/dashboard/history',
      name: 'Quiz History',
      icon: History
    },
    {
      path: '/subjects',
      name: 'Subjects',
      icon: BookOpen
    }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path || 
           location.pathname === path + '/' || 
           location.pathname.startsWith(path + '/') ||
           (path === '/subjects' && location.pathname.includes('/quiz/'));
  };
  
  const handleLogout = () =>{
    dispatch(
      logout()
    )
    localStorage.removeItem("token");
    navigate("/")
  }

  return (
    <>
      {/* Desktop Sidebar Toggle Button */}
      {!isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-100 lg:left-6"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-all duration-300 ${
            isOpen ? 'w-64' : 'w-20'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-center">
                <span className={`font-bold text-2xl ${!isOpen && 'hidden'}`}>AQS</span>
              </div>
            </div>

            <nav className="flex-1 p-4">
              {menuItems.map((item) => (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center px-4 py-3 my-2 rounded-lg cursor-pointer transition-colors ${
                    isActivePath(item.path)
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
                onClick={() =>{handleLogout()}}
                className="flex items-center w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-6 h-6" />
                {isOpen && <span className="ml-3">Logout</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="flex justify-around items-center h-16">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  isActivePath(item.path)
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;