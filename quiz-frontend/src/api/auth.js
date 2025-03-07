import axiosInstance from './axiosInstances';

export const authLogin = async (credentials) => {
  const response = await axiosInstance.post('/login', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};