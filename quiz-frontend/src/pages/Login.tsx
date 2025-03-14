import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profile from '../assets/profile.webp'
import { BrainCircuit } from 'lucide-react';
import { login } from '../store/slice/authSlice'
import toast from 'react-hot-toast';
import { LoginCredentials } from '../types/auth';
import { useDispatch } from 'react-redux';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Simulated login - Replace with actual API call

      if (true) {
        const response = await axios.post('http://localhost:9090/login', credentials);


        localStorage.setItem('token', response.data.jwtToken);

        console.log("this is respons");
        console.log(response);
        console.log(response.data.jwtToken);
        const role = response.data.primaryRole || "No role found";
        console.log(role);
        localStorage.setItem('role', JSON.stringify(response.data.primaryRole));

        const user = JSON.parse(localStorage.getItem("user") || "{}");
           if (user && localStorage.getItem("token")) {
             dispatch(login(user));
           }
        if (role == "STUDENT") {
          localStorage.setItem('id', response.data.student.studentId);
          localStorage.setItem('user', JSON.stringify(response?.data?.student));
          
          toast.success('Welcome back, Quiz Master!');
          navigate('/dashboard');
        }
        else if (role == "TEACHER") {
          toast.success('Welcome back, Quiz Master!');
          localStorage.setItem('id', response.data.teacher.teacherId);
          localStorage.setItem('user', JSON.stringify(response?.data?.teacher));
          navigate("/dashboard-teacher/");
        }else{
          toast.success('Welcome back, Quiz Master!');
          // localStorage.setItem('id', response.data.teacher.teacherId);
          // localStorage.setItem('user', JSON.stringify(response?.data?.teacher));
          navigate("/dashboard-admin/");
        }
      }
      else if (credentials.email === 'teacher@quiz.edu' && credentials.password === 'password') {
        login({
          id: '1',
          name: 'Zahid',
          email: credentials.email,
          program: 'B.tech',
          year: 2,
          studentId: '22BLCS012HY',
          image: profile,
        });
        toast.success('Welcome back, Quiz Master!');
        navigate('/dashboard-teacher/');
      }
      else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
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