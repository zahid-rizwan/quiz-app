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
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      processOAuthToken(token);
    }
  }, [location]);

  const processOAuthToken = async (token: string) => {
    try {
      localStorage.setItem('token', token);
      
      const response = await axios.get('http://localhost:9090/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const userData = response.data;
      const role = userData.primaryRole || "No role found";
      
      localStorage.setItem('role', JSON.stringify(role));
      
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

  const authenticateUser = async (token: string, userData?: any) => {
    try {
      if (!userData) {
        const response = await axios.get('http://localhost:9090/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        userData = response.data;
      }
      
      const role = userData.primaryRole || "No role found";
      localStorage.setItem('role', JSON.stringify(role));
      
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
        localStorage.setItem('user', JSON.stringify(userData.user || userData));
        dispatch(login(userData.user || userData));
        toast.success('Welcome back, Quiz Master!');
        navigate("/dashboard-admin/");
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      toast.error('Authentication failed. Please try again.');
      localStorage.removeItem('token');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9090/login', credentials);
      const token = response.data.jwtToken;
      localStorage.setItem('token', token);
      await authenticateUser(token, response.data);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `http://localhost:9090/oauth2/authorization/${provider}?prompt=select_account`;
    // Implement OAuth login logic here
    console.log(`Logging in with ${provider}`);
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

            <div className="mt-6 flex justify-center items-center gap-3">
  <div>
    <button
      onClick={() => handleOAuthLogin('google')}
      className="w-28 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
    >
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
      </svg>
    </button>
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
}