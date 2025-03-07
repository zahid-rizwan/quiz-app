import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9090', // Your API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized access');
      localStorage.removeItem('authToken'); // Clear token on unauthorized access
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;