import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import profile from '../assets/profile.webp';
import { BrainCircuit } from 'lucide-react';
import { login } from '../store/slice/authSlice';
import toast from 'react-hot-toast';
import { LoginCredentials } from '../types/auth';
import { useDispatch } from 'react-redux';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  // Handle token from OAuth redirect
  useEffect(() => {
    // Check for token in URL (for OAuth redirect)
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      // Process the token from OAuth
      processOAuthToken(token);
    }
  }, [location]);

  const processOAuthToken = async (token: string) => {
    try {
      // Store token
      localStorage.setItem('token', token);
      
      // Get user info using the token
      const response = await axios.get('http://localhost:9090/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const userData = response.data;
      const role = userData.primaryRole || "No role found";
      
      localStorage.setItem('role', JSON.stringify(role));
      
      // Handle different roles
      if (role === "STUDENT") {
        localStorage.setItem('id', userData.student.studentId);
        localStorage.setItem('user', JSON.stringify(userData.student));
        dispatch(login(userData.student));
        toast.success('Welcome back, Quiz Master!');
        navigate('/dashboard');
      } else if (role === "TEACHER") {
        localStorage.setItem('id', userData.teacher.teacherId);
        localStorage.setItem('user', JSON.stringify(userData.teacher));
        dispatch(login(userData.teacher));
        toast.success('Welcome back, Quiz Master!');
        navigate("/dashboard-teacher/");
      } else {
        toast.success('Welcome back, Quiz Master!');
        navigate("/dashboard-admin/");
      }
    } catch (error) {
      console.error('Error processing OAuth token:', error);
      toast.error('Authentication failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:9090/login', credentials);
      localStorage.setItem('token', response.data.jwtToken);

      console.log("this is response");
      console.log(response);
      console.log(response.data.jwtToken);
      const role = response.data.primaryRole || "No role found";
      console.log(role);
      localStorage.setItem('role', JSON.stringify(response.data.primaryRole));

      // Update Redux store
      if (role === "STUDENT") {
        localStorage.setItem('id', response.data.student.studentId);
        localStorage.setItem('user', JSON.stringify(response.data.student));
        dispatch(login(response.data.student));
        toast.success('Welcome back, Quiz Master!');
        navigate('/dashboard');
      } else if (role === "TEACHER") {
        toast.success('Welcome back, Quiz Master!');
        localStorage.setItem('id', response.data.teacher.teacherId);
        localStorage.setItem('user', JSON.stringify(response.data.teacher));
        dispatch(login(response.data.teacher));
        navigate("/dashboard-teacher/");
      } else {
        toast.success('Welcome back, Quiz Master!');
        navigate("/dashboard-admin/");
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  const handleOAuthLogin = (provider: string) => {
    // Redirect to backend OAuth endpoint
    window.location.href = `http://localhost:9090/oauth2/authorization/${provider}?prompt=select_account`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <BrainCircuit className="w-16 h-16 text-white" />
        </div>
        <h2 className="mt-6 text-center text-4xl font-extrabold text-white">
          Adaptive Quiz System
        </h2>
        <p className="mt-2 text-center text-xl text-purple-100">
          Test Your Knowledge
        </p>
        <p className="mt-2 text-center text-sm text-purple-100">
          New to QuizMaster?{' '}
          <Link to="/register" className="font-medium text-white hover:text-purple-200 underline">
            Create an account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-purple-900/20 sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="student@quiz.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Start Quizzing
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div>
                <button
                  onClick={() => handleOAuthLogin('google')}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1Z" />
                  </svg>
                </button>
              </div>

              <div>
                <button
                  onClick={() => handleOAuthLogin('github')}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div>
                <button
                  onClick={() => handleOAuthLogin('linkedin')}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo credentials</span>
              </div>
            </div>
            <div className="mt-2 text-center text-xs text-gray-500">
              Email: student@quiz.edu<br />
              Password: password
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}